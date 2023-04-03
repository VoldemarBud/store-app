import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {LoginWithEmail} from "../models/loginWithEmail";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


    constructor(
        private fireauth: AngularFireAuth, private router: Router
    ) {
    }

    isLoggedIn() {
        return this._isLoggedIn;
        console.log(this._isLoggedIn);
    }

    login({email, password}: LoginWithEmail) {
        this.fireauth.signInWithEmailAndPassword(email, password)
            .then((data) => {
                console.log(data);
                this._isLoggedIn.next(true);
                this.router.navigate(['home'])
            })
            .catch(err => {
                console.log(err.message);
            })
    }


    logout() {
        this.fireauth.signOut().then(() => {
            this._isLoggedIn.next(false);
            this.router.navigate(['home'])
        }).catch(err => {
            console.error(err)
        })
    }
}
