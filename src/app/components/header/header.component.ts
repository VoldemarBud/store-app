import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {filter, Observable, Subject} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {BasketService} from "../../services/basket.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    badge!: Observable<any>;
    canView$!: Observable<boolean>;
    private unsub = new Subject();

    constructor(
        private basketService: BasketService,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.canView$ = this.authService.isLoggedIn();
        this.badge = this.basketService.getProductInBasket$.pipe(filter(data => !!data));
    }

    onLogout() {
        this.authService.logout()
        this.authService.isLoggedIn().pipe(filter(data => !data)).subscribe(() => {
            this.router.navigate(['home'])
            this.unsub.next(true);
            this.unsub.complete();
        })
    }
}
