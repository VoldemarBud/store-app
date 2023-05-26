import {BasketRoutingModule} from "./basket-routing.module";
import {BasketComponent} from "./shared/basket.component";
import {NgModule} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
    declarations: [
        BasketComponent
    ],
    imports: [
        CommonModule,
        BasketRoutingModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [BasketComponent]
})
export class BasketModule {
}
