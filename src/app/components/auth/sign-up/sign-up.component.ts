import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {filter, Subject} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
    private unsub = new Subject();
    showPass: boolean = false;
    singUpFrom: FormGroup = new FormGroup<any>({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', Validators.required)
    })
    constructor(
        public authService: AuthService,
        private router: Router
    ) {
    }

    toggleShowPass(): void {
        this.showPass = !this.showPass;
    }

    onRegistration(): void {
        if (this.singUpFrom.valid) {
              this.authService.registration(this.singUpFrom.value)
            this.authService.isLoggedIn().pipe(filter(data=>data)).subscribe(()=>{
                this.router.navigate(['products'])
                this.unsub.next(true);
                this.unsub.complete();
            })
        }
    }
}