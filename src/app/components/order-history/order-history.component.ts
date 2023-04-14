import { Component } from '@angular/core';
import {BasketService} from "../../services/basket.service";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent {
  orderHistory$ = this.basketService.orderHistory();
constructor(private  basketService: BasketService) {
}
}
