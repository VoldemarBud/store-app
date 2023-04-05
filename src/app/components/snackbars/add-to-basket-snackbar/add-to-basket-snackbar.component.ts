import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-to-basket-snackbar',
  templateUrl: './add-to-basket-snackbar.component.html',
  styleUrls: ['./add-to-basket-snackbar.component.scss']
})
export class AddToBasketSnackbarComponent {
  constructor(
      @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) {}
}
