import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {Product} from "../../models/product/product";
import {ProductFormComponent} from "../shared/product-form/product-form.component";
import {Observable} from "rxjs";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{
    canEdite$!: Observable<boolean>;
    constructor(
                private authService: AuthService,
                private dialog: MatDialog,
                ) {
    }
    ngOnInit(): void {
        this.canEdite$ = this.authService.userAdmin;
    }

    openDialog(product?: Product): void {
        this.dialog.open(ProductFormComponent, {
            data: {
                title: product ? 'Edite Product' : 'Add new Product',
                product
            },
            minWidth: 360,
            maxWidth: 450,
            autoFocus: false,
            disableClose: true
        });
        this.dialog.afterAllClosed;
    }


}