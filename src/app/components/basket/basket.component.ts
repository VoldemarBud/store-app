import {Component, OnInit} from '@angular/core';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {IProduct} from '../../models/product/product';
import {BasketService} from "../../services/basket.service";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  badgeProducts$!: Observable<IProduct[]>;
  totalPrice$!: Observable<number>;
  unSub = new Subject();

  constructor(private basketService: BasketService) {
  }

  ngOnInit(): void {
    this.badgeProducts$ = this.basketService.basketProducts$
    this.totalPrice$ = this.totalPrice()
  }


   totalPrice() {
    return this.basketService.basketProducts$.pipe(
      map(data => data.map((data:IProduct) => data.price)
        .reduce((sum:number, price:number) => sum + price, 0)),
    )
  }

  deleteFromBasket(id: string) {
    this.basketService.deleteFromBasket(id)
      .pipe(takeUntil(this.unSub))
      .subscribe(() => {
      this.unSub.next(true);
      this.unSub.complete();
    });
  }
}
