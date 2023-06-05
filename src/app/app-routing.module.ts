import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './shared/components/auth/sign-in/sign-in.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {LoginGuard} from "./shared/guards/login.guard";
import {SignUpComponent} from "./shared/components/auth/sign-up/sign-up.component";
import {NotFoundComponent} from "./shared/components/not-found/not-found.component";

const routes: Routes = [
    {path: '', redirectTo: '/products/all', pathMatch: 'full'},
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
        redirectTo: '404',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}