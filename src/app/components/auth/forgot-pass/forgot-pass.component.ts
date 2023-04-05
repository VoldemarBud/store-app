import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'app-sign-up',
    templateUrl: './forgot-pass.component.html',
    styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent {
    showPass: boolean = false;
    singUpFrom: FormGroup = new FormGroup<any>({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ])
    })

    constructor(
        public authService: AuthService
    ) {
    }

    toggleShowPass(): void {
        this.showPass = !this.showPass;
    }

    onRegistration(): void {
        if (this.singUpFrom.valid) {
          this.authService.forgotPass(this.singUpFrom.value);
        }
    }
}