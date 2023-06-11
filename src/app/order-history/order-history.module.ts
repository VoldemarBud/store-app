import {OrderHistoryRoutingModule} from "./order-history-routing.module";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OrderHistoryComponent} from "./shared/order-history.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
    declarations: [
        OrderHistoryComponent
    ],
    imports: [
        CommonModule,
        OrderHistoryRoutingModule,
        MatExpansionModule,
        MatPaginatorModule,
    ],
    exports: [OrderHistoryComponent]
})
export class OrderHistoryModule {
}
