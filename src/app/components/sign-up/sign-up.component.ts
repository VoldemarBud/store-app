import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
    showPass: boolean = false;
    singUpFrom: FormGroup = new FormGroup<any>({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', Validators.required)
    })
    authMessage!: Promise<string|void>;

    constructor(
        public authService: AuthService
    ) {
    }

    toggleShowPass(): void {
        this.showPass = !this.showPass;
    }

    onRegistration(): void {
        if (this.singUpFrom.valid) {
            this.authMessage =   this.authService.registration(this.singUpFrom.value)
        }
    }
}