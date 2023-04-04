import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent  {
    showPass: boolean = false;
    singInFrom: FormGroup = new FormGroup<any>({
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

    onLogin(): void {
        if (this.singInFrom.valid) {
            this.authMessage = this.authService.login(this.singInFrom.value)
        }
    }
}