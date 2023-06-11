import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductsComponent} from "./shared/products/products.component";
import {ProductDetailsComponent} from "./shared/product-details/product-details.component";
import {ProductResolver} from "../resolvers/product.resolver";


const routes: Routes = [
    {
        path: '',
        component: ProductsComponent
    },
            {
        path: 'products/:id',
                component: ProductDetailsComponent,
                resolve: {data: ProductResolver},
            },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {
}