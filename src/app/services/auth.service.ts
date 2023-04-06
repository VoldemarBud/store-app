import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {LoginWithEmail} from "../models/loginWithEmail";
import {BehaviorSubject, take} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IUser} from "../models/user";
import {SnackbarService} from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly usersPath: string = 'users';

    private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _userRole: BehaviorSubject<IUser> = new BehaviorSubject({});

    constructor(
        private cloudStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
        private snackbarService: SnackbarService
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
                this.snackbarService.showMessage('Success',['success'])
            })
            .catch(({message}) => {
                this.snackbarService.showMessage(`${message.substring(message.indexOf(':') + 2, message.lastIndexOf('(') - 1)} `,['warning']);
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
            this.snackbarService.showMessage('Success',['success'])
        })
            .catch(({message}) => {
                this.snackbarService.showMessage(`${message.substring(message.indexOf(':') + 2, message.lastIndexOf('(') - 1)} `,['warning']);
            })
    }

    forgotPass(email: string) {
        return this.fireAuth.sendPasswordResetEmail(email)
            .then((data) => {
                console.log(data);
                // this.router.navigate(['sing-in'])
            }).catch(({message}) => {
              this.snackbarService.showMessage(message,['warning'])
            })
    }

    logout() {
        this.fireAuth.signOut().then(() => {
            this._isLoggedIn.next(false);
        }).catch(err => {
            this.snackbarService.showMessage(err,['warning']);
        })
    }

    private getRole(uid: string) {
        this.cloudStore.collection(this.usersPath).doc(uid).valueChanges()
            .pipe(take(1))
            .toPromise().then(user => {
            this._userRole.next(<IUser>user)
        })
    }

    private setRole(id: string) {
        this.cloudStore.collection(this.usersPath).doc(id).set({role: "user"})
    }


}
