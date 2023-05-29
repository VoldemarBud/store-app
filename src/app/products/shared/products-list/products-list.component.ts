import {Component, OnInit} from '@angular/core';
import {map, Observable, Subject, takeUntil} from "rxjs";
import {Product} from "../../../models/product/product";
import {ProductService} from "../../../services/product.service";
import {BasketService} from "../../../services/basket.service";
import {AuthService} from "../../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Data} from "@angular/router";
import {QueryFn} from "../../../models/queryFn";
import {ProductFormComponent} from "../product-form/product-form.component";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent
implements OnInit {
  canView$!: Observable<boolean>;
  canEdite$!: Observable<boolean>;
  products$?: Observable<Product[]>;
  unsub = new Subject();

  constructor(private productService: ProductService,
      private basketService: BasketService,
      private authService: AuthService,
      private dialog: MatDialog,
      private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts({})
        .valueChanges({idField: 'id'}) as Observable<Product[]>;
    this.canView$ = this.route.data.pipe(
        map((data: Data) => data?.['data'])
    )
    this.canEdite$ = this.authService.userAdmin;
  }

  getSorted(data: QueryFn) {
    this.products$ = this.productService.getProducts(data)
        .valueChanges({idField: 'id'}) as Observable<Product[]>;
  }

  addToBasket(id: string): void {
    this.basketService.addToBasket(id)
        .pipe(takeUntil(this.unsub))
        .subscribe(() => {
              this.unsub.next(true);
              this.unsub.complete();
            }
        )
  }

  openDialog(product?: Product): void {
    this.dialog.open(ProductFormComponent, {
      data: {
        title: product ? 'Edite Product' : 'Add new Product',
        product
      },
      minWidth: 360,
      maxWidth: 450,
      autoFocus: false,
      disableClose: true
    });
    this.dialog.afterAllClosed
  }

}
