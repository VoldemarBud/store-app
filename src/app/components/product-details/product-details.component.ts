import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {map, Observable} from 'rxjs';
import {IProduct} from '../../models/product/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: Observable<IProduct>;
  constructor(private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.product = this.route.data.pipe(
      map((data: Data) => data?.['data'])
    )
  }

}
