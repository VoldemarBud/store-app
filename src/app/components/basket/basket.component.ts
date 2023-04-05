import {Component, OnInit} from '@angular/core';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {ProductService} from '../../services/product.service';
import {IProduct} from '../../models/product/product';

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
    this.badgeProducts$ = this.productService.basketProducts$
    this.totalPrice$ = this.totalPrice()
  }
  

   totalPrice() {
    return this.productService.basketProducts$.pipe(
      map(data => data.map((data:IProduct) => data.price)
        .reduce((sum:number, price:number) => sum + price, 0)),
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
