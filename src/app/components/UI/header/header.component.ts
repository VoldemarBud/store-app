import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {filter, Observable} from 'rxjs';
import {AuthResolver} from "../../../services/auth.resolver";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    badge!: Observable<any>;
    canView$!: Observable<boolean>;


    constructor(private productService: ProductService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.canView$ = this.authService.isLoggedIn();
        this.badge = this.productService.getTotalProductInBasket$.pipe(filter(data => !!data));
    }

    onLogout() {
        this.authService.logout()
    }
}
