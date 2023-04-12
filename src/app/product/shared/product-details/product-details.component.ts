import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {firstValueFrom, map, Observable, Subject, takeUntil} from 'rxjs';
import {IProduct} from '../../../models/product/product';
import {AuthService} from "../../../services/auth.service";
import {ProductService} from "../../../services/product.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../components/confirm-dialog/confirm-dialog.component";
import {BasketService} from "../../../services/basket.service";

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
    product$!: Observable<IProduct>;
    canView$!: Observable<boolean>;
    canDelete!: boolean;
    unsub = new Subject();

    constructor(
        private dialogConfirm: MatDialog,
        private productService: ProductService,
        private basketService: BasketService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService) {
    }

    ngOnInit(): void {
        this.product$ = this.route.data.pipe(
            map((data: Data) => data?.['data'])
        )
        this.canView$ = this.authService.isLoggedIn();
        this.canDelete = this.authService.isAdmin();
    }

    async addToBasket() {
        const product = await firstValueFrom(this.product$)
        this.basketService.addToBasket(product.id)
            .pipe(takeUntil(this.unsub))
            .subscribe(() => {
                    this.unsub.next(true);
                    this.unsub.complete();
                }
            )
    }

    confirmDelete() {
        this.dialogConfirm.open(ConfirmDialogComponent).afterClosed().pipe(takeUntil(this.unsub)).subscribe(data => {
            this.deleteProduct(data)
        })
    }

    async deleteProduct(data: boolean) {
        if (data) {
            const product = await firstValueFrom(this.product$)
            this.productService.deleteProduct(product.id);
            this.unsub.next(true);
            this.unsub.complete();
            this.router.navigate(['home'])
        }
    }
}
