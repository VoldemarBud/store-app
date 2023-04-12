import {Component, OnInit} from '@angular/core';
import {distinctUntilChanged, map, Observable, Subject, takeUntil} from 'rxjs';
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
    canBuy$!: Observable<boolean>

    constructor(
        private basketService: BasketService
    ) {
    }

    ngOnInit(): void {
        this.badgeProducts$ = this.basketService.basketProducts$
        this.totalPrice$ = this.basketService.totalPrice()
        this.canBuy$ = this.canBuy();
    }

    private canBuy(): Observable<boolean> {
        return this.basketService.getProductInBasket$.pipe(
            map(products => !!products && products.length > 0),
            distinctUntilChanged()
        )
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
