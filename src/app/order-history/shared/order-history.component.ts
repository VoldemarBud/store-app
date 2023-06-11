import {Component} from '@angular/core';
import {BasketService} from "../../shared/services/basket.service";
import {Observable} from "rxjs";
import {OrderHistory} from "../../shared/models/orderHistory";

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
    orderHistory$: Observable<OrderHistory[]> = this.basketService.orderHistory();

    constructor(private basketService: BasketService) {
    }

}