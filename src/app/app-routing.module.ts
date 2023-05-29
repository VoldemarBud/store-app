import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './components/auth/sign-in/sign-in.component';
import {AuthGuard} from './guards/auth.guard';
import {LoginGuard} from "./guards/login.guard";
import {SignUpComponent} from "./components/auth/sign-up/sign-up.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";

const routes: Routes = [
    {path: '', redirectTo: '/products', pathMatch: 'full'},
    {path: 'sing-in', component: SignInComponent, canActivate: [LoginGuard]},
    {path: 'register-user', component: SignUpComponent, canActivate: [LoginGuard]},
    {
        path: 'products',
        loadChildren: () => import('./products/product.module').then(m => m.ProductModule),
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
        pathMatch: 'full',
        redirectTo: '',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}