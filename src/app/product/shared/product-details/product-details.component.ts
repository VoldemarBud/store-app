import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {map, Observable} from 'rxjs';
import {IProduct} from '../../../models/product/product';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product?: Observable<IProduct>;
  canView$!: Observable<boolean>;
  constructor(private route: ActivatedRoute,private authService: AuthService) {
  }
  ngOnInit(): void {
    this.product = this.route.data.pipe(
      map((data: Data) => data?.['data'])
    )
    this.canView$ = this.authService.isLoggedIn();
  }

}
