import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {filter, Subject} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
    private unsub = new Subject();
    showPass: boolean = false;
    singInFrom: FormGroup = new FormGroup<any>({
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

    onLogin(): void {
        if (this.singInFrom.valid) {
            this.authService.login(this.singInFrom.value)
           this.authService.isLoggedIn().pipe(filter(data=>data)).subscribe(()=>{
               this.router.navigate(['home'])
               this.unsub.next(true);
               this.unsub.complete();
           })
        }
    }
}