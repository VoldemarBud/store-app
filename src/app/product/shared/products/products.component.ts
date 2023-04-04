import {Component, OnInit} from '@angular/core';
import {IProduct} from '../../../models/product/product';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogBoxComponent} from '../dialog-box/dialog-box.component';
import {ProductService} from '../../../services/product.service';
import {QueryFn} from "../../../models/queryFn";
import {ActivatedRoute, Data} from "@angular/router";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    canView$!: Observable<boolean>;
    products?: Observable<IProduct[]>;
    unsub = new Subject();

    constructor(private productService: ProductService, private dialog: MatDialog, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.products = this.productService.getProducts({}).valueChanges({idField: 'id'}) as Observable<IProduct[]>;
        this.canView$ = this.route.data.pipe(
            map((data: Data) => data?.['data'])
        )
    }

    getSorted(data: QueryFn) {
        this.products = this.productService.getProducts(data).valueChanges({idField: 'id'}) as Observable<IProduct[]>;
    }

    addToBasket(id: string): void {
        this.productService.addToBasket(id)
            .pipe(takeUntil(this.unsub))
            .subscribe(() => {
                    this.unsub.next(true);
                    this.unsub.complete();
                }
            )
    }

    openDialog(product?: IProduct): void {
        this.dialog.open(DialogBoxComponent, {
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
