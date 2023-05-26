import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductsComponent} from './products/shared/products/products.component';
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
    {
        path: 'home',
        loadChildren: () => import('./products/product.module').then(m => m.ProductModule),
        resolve: {data: AuthResolver},
        canActivate: [AuthGuard]
    },
    {
        path: 'basket',
        loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'order-history',
        loadChildren: () => import('./order-history/order-history.module').then(m => m.OrderHistoryModule),
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        redirectTo: '', component: ProductsComponent, pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}