import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { BasketComponent } from './components/basket/basket.component';
import { ProductResolver } from './services/product.resolver';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },

  { path: 'home', component: BaseComponent, canActivate: [AuthGuard] },
  {
    path: 'products', component: ProductsComponent , canActivate: [AuthGuard] 
  },
  {
    path: 'product/:id', component: ProductDetailsComponent, resolve: { data: ProductResolver } , canActivate: [AuthGuard] 
  },
  {
    path: 'basket', component: BasketComponent , canActivate: [AuthGuard] 
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
