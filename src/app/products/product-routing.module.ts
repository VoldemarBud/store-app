import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductsComponent} from "./products/products.component";
import {ProductDetailsComponent} from "./shared/product-details/product-details.component";
import {ProductResolver} from "../shared/resolvers/product.resolver";
import {ProductsListComponent} from "./shared/products-list/products-list.component";
import {NotFoundComponent} from "../shared/components/not-found/not-found.component";
import {AuthResolver} from "../shared/resolvers/auth.resolver";


const routes: Routes = [
    {
        path: '',
        component: ProductsComponent,
    },
    {path: '', pathMatch: 'full', redirectTo: 'all'},
    {path: 'all', component: ProductsListComponent, resolve: {data: AuthResolver}},
    {
        path: ':id',
        component: ProductDetailsComponent,
        resolve: {data: ProductResolver},
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule {
}