import {Component, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
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

    constructor(
        private basketService: BasketService
    ) {
    }

    ngOnInit(): void {
        this.badgeProducts$ = this.basketService.basketProducts$
        this.totalPrice$ = this.basketService.totalPrice()
    }

    createOrder() {
        this.basketService.completeOrder().pipe(takeUntil(this.unSub))
            .subscribe(() => {
                this.unSub.next(true);
                this.unSub.complete();
            });
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
