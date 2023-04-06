import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './components/base/base.component';
import {ProductsComponent} from './product/shared/products/products.component';
import {ProductDetailsComponent} from './product/shared/product-details/product-details.component';
import {BasketComponent} from './components/basket/basket.component';
import {ProductResolver} from './resolvers/product.resolver';
import {SignInComponent} from './components/auth/sign-in/sign-in.component';
import {AuthGuard} from './guards/auth.guard';
import {LoginGuard} from "./guards/login.guard";
import {AuthResolver} from "./resolvers/auth.resolver";
import {SignUpComponent} from "./components/auth/sign-up/sign-up.component";
import {ForgotPassComponent} from "./components/auth/forgot-pass/forgot-pass.component";

const routes: Routes = [
    {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
    {path: 'sign-in', component: SignInComponent, canActivate: [LoginGuard]},
    {path: 'register-user', component: SignUpComponent, canActivate: [LoginGuard]},
    {path: 'forgot-password', component: ForgotPassComponent, canActivate: [LoginGuard]},
    {path: 'home', component: BaseComponent},
    {
        path: 'products', component: ProductsComponent, resolve: {data: AuthResolver}
    },
    {
        path: 'product/:id',
        component: ProductDetailsComponent,
        resolve: {data: ProductResolver},
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
