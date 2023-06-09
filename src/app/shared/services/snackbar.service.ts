import {Injectable} from '@angular/core';
import {MessageSnackbarComponent} from "../components/snackbars/message-snackbar/message-snackbar.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(private snackBar: MatSnackBar) {
    }

    showMessage(message: string, cssClass: string[]) {
        this.snackBar.openFromComponent(
            MessageSnackbarComponent,
            {
                data: message,
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: "left",
                panelClass: [...cssClass]
            }
        )
    }
}
