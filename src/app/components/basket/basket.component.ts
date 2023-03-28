import {Component, OnInit} from '@angular/core';
import {filter, map, Observable, reduce, Subject, switchMap, takeUntil} from 'rxjs';
import {ProductService} from '../../services/product.service';
import {IProduct} from '../../models/product';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  badgeProducts$!: Observable<IProduct[]>;
  totalPrice$!: Observable<number>;
  unSub = new Subject();

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.badgeProducts$ = this.basketProducts;
    this.totalPrice$ = this.totalPrice;
  }

  get basketProducts(): Observable<IProduct[]> {
    return this.productService.basketProducts
  }

  get totalPrice() {
    return this.basketProducts.pipe(
      map(data => data.map(data => data.price)
        .reduce((sum, price) => sum + price, 0)),
    )
  }

  deleteFromBasket(id: string) {
    this.productService.deleteFromBasket(id)
      .pipe(takeUntil(this.unSub))
      .subscribe(() => {

      this.unSub.next(true);
      this.unSub.complete();
    });
  }
}
