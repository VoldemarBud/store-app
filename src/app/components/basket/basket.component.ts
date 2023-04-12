import {Component, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import {IProduct} from '../../models/product/product';
import {BasketService} from "../../services/basket.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-basket',
    templateUrl: './basket.component.html',
    styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
    badgeProducts$!: Observable<IProduct[]>;
    totalPrice$!: Observable<number>;
    unSub = new Subject();

    userID$!: Observable<any>

    constructor(
        private basketService: BasketService,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.badgeProducts$ = this.basketService.basketProducts$
        this.totalPrice$ = this.basketService.totalPrice()
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
