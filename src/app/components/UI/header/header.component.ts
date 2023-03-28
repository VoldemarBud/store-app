import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {filter, Observable} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  badge!: Observable<any>;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    // this.badge = this.productService.getTotalProductInBasket.pipe(filter(data => !!data));
  }

}
