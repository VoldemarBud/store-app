import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {BasketComponent} from './components/basket/basket.component';
import {BaseComponent} from './components/base/base.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatBadgeModule} from '@angular/material/badge';
import {SignInComponent} from './components/auth/sign-in/sign-in.component';
import {ProductModule} from "./product/product.module";
import {MatInputModule} from "@angular/material/input";
import {SignUpComponent} from "./components/auth/sign-up/sign-up.component";
import {ForgotPassComponent} from "./components/auth/forgot-pass/forgot-pass.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { ErrorSnackbarComponent } from './components/snackbars/error-snackbar/error-snackbar.component';
import { AddToBasketSnackbarComponent } from './components/snackbars/add-to-basket-snackbar/add-to-basket-snackbar.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        BasketComponent,
        BaseComponent,
        SignInComponent,
        SignUpComponent,
        ForgotPassComponent,
        ErrorSnackbarComponent,
        AddToBasketSnackbarComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        ProductModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatToolbarModule,
        MatBadgeModule,
        MatButtonModule,
        MatInputModule,
        MatSnackBarModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
