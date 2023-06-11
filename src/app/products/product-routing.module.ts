import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductDetailsComponent} from "./shared/product-details/product-details.component";
import {ProductResolver} from "../shared/resolvers/product.resolver";
import {ProductsListComponent} from "./shared/products-list/products-list.component";
import {AuthResolver} from "../shared/resolvers/auth.resolver";


const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'all'},
    {path: 'all', component: ProductsListComponent, resolve: {data: AuthResolver}},
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