import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SortPanelComponent} from "./shared/sort-panel/sort-panel.component";
import {ProductFormComponent} from "./shared/product-form/product-form.component";
import {ProductDetailsComponent} from "./shared/product-details/product-details.component";
import {ProductsComponent} from "./products/products.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TruncatePipe} from "../shared/pipes/truncate.pipe";
import {RouterLink} from "@angular/router";
import {MatChipsModule} from "@angular/material/chips";
import {ProductRoutingModule} from "./product-routing.module";
import { ProductsListComponent } from './shared/products-list/products-list.component';


@NgModule({
    declarations: [
        ProductsComponent,
        ProductDetailsComponent,
        SortPanelComponent,
        ProductFormComponent,
        TruncatePipe,
        ProductsListComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatToolbarModule,
        MatCardModule,
        MatChipsModule,
        RouterLink,
        ProductRoutingModule
    ],
    exports: [ProductsComponent]
})
export class ProductModule {
}
