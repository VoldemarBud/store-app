import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
    showPass: boolean = false;
    singInFrom: FormGroup = new FormGroup<any>({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', Validators.required)
    })

    constructor(
        public authService: AuthService
    ) {
    }

    toggleShowPass(): void {
        this.showPass = !this.showPass;
    }

    onLogin(): void {
        if (this.singInFrom.valid) {
            this.authService.login(this.singInFrom.value)
        }
    }

    ngOnInit(): void {
    }
}