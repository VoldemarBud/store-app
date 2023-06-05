import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/components/header/header.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {ReactiveFormsModule} from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import {SignInComponent} from './shared/components/auth/sign-in/sign-in.component';
import {ProductModule} from "./products/product.module";
import {MatInputModule} from "@angular/material/input";
import {SignUpComponent} from "./shared/components/auth/sign-up/sign-up.component";
import {ConfirmDialogComponent} from './shared/components/confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {BasketModule} from "./basket/basket.module";
import {OrderHistoryModule} from "./order-history/order-history.module";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NotFoundComponent} from './shared/components/not-found/not-found.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SignInComponent,
        SignUpComponent,
        ConfirmDialogComponent,
        NotFoundComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireStorageModule,
        ProductModule,
        BasketModule,
        OrderHistoryModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatSnackBarModule,
        MatBadgeModule,
        MatInputModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
