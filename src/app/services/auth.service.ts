import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {LoginWithEmail} from "../models/loginWithEmail";
import {BehaviorSubject, take} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IUser} from "../models/user";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorSnackbarComponent} from "../components/error-snackbar/error-snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _userRole: BehaviorSubject<IUser> = new BehaviorSubject({});

    constructor(
        private cloudStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
        private _snackBar: MatSnackBar
    ) {
    }

    isAdmin(): boolean {
        return this._userRole.value?.role === 'admin';
    }

    isLoggedIn() {
        return this._isLoggedIn;
    }

    login({email, password}: LoginWithEmail) {
        this.fireAuth.signInWithEmailAndPassword(email, password)
            .then((data) => {
                this.getRole(data.user!.uid)
                this._isLoggedIn.next(true);
            })
            .catch(({message}) => {
                this.showErrorMessage(`${message.substring(message.indexOf(':') + 2, message.lastIndexOf('(') - 1)} `);
            })
    }

    registration({email, password}: LoginWithEmail) {
        this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((data) => {
                this.setRole(data.user!.uid);
                return data.user!.uid
            }).then(data => {
            this.getRole(data);
            this._isLoggedIn.next(true);
        })
            .catch(({message}) => {
                this.showErrorMessage(`${message.substring(message.indexOf(':') + 2, message.lastIndexOf('(') - 1)} `);
            })
    }

    forgotPass(email: string) {
        return this.fireAuth.sendPasswordResetEmail(email)
            .then((data) => {
                console.log(data);
                // this.router.navigate(['sing-in'])
            }).catch(({message}) => {
              this.showErrorMessage(message)
            })
    }

    logout() {
        this.fireAuth.signOut().then(() => {
            this._isLoggedIn.next(false);
        }).catch(err => {
            this.showErrorMessage(err);
        })
    }

    private getRole(uid: string) {
        this.cloudStore.collection('users').doc(uid).valueChanges()
            .pipe(take(1))
            .toPromise().then(user => {
            this._userRole.next(<IUser>user)
        })
    }

    private setRole(id: string) {
        this.cloudStore.collection('users').doc(id).set({role: "user"})
    }

    private showErrorMessage(message: string) {
        this._snackBar.openFromComponent(
            ErrorSnackbarComponent,
            {
                data: message,
                duration: 3000
            }
        )
    }
}
