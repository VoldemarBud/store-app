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
    }

    login({email, password}: LoginWithEmail) {
        return this.fireauth.signInWithEmailAndPassword(email, password)
            .then(() => {
                this._isLoggedIn.next(true);
                this.router.navigate(['home'])
            })
            .catch(({message}) => {
               return `${message.substring(message.indexOf(':')+2, message.lastIndexOf('(') - 1)} `
            })
    }
    registration({email, password}: LoginWithEmail){
      return  this.fireauth.createUserWithEmailAndPassword(email, password)
          .then(() => {
              this._isLoggedIn.next(true);
              this.router.navigate(['home'])
          }).catch(({message}) => {
            return `${message.substring(message.indexOf(':')+2, message.lastIndexOf('(') - 1)} `
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
