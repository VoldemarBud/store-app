import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './components/base/base.component';
import {ProductsComponent} from './components/product/products/products.component';
import {ProductDetailsComponent} from './components/product/product-details/product-details.component';
import {BasketComponent} from './components/basket/basket.component';
import {ProductResolver} from './services/product.resolver';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {AuthGuard} from './guards/auth.guard';
import {LoginGuard} from "./guards/login.guard";
import {AuthResolver} from "./services/auth.resolver";

const routes: Routes = [
    {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
    {path: 'sign-in', component: SignInComponent, canActivate: [LoginGuard]},
    {path: 'home', component: BaseComponent},
    {
        path: 'products', component: ProductsComponent, resolve: {data: AuthResolver}
    },
    {
        path: 'product/:id',
        component: ProductDetailsComponent,
        resolve: {data: ProductResolver},
        canActivate: [AuthGuard]
    },
    {
        path: 'basket', component: BasketComponent, canActivate: [AuthGuard]
    },
    {
        path: "**",
        redirectTo: '', component: BaseComponent, pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
