import {Injectable} from '@angular/core';
import {LoginWithEmail} from "../models/loginWithEmail";
import {BehaviorSubject, filter, map, Observable, take} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../models/user";
import {SnackbarService} from "./snackbar.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserMetaDate} from "../models/userMetaDate";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly usersPath: string = 'users';

    private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    userAdmin: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private cloudStore: AngularFirestore,
        private fireAuth: AngularFireAuth,
        private snackbarService: SnackbarService
    ) {
    }

    private setUser(uid: string) {
        return this.cloudStore.collection(this.usersPath).doc(uid).valueChanges()
            .pipe(
                filter(data => !!data),
                take(1)
            ).toPromise().then((user) => {
                this.isAdmin((user as User)?.role);
            });
    }

    private isAdmin(role?: string) {
        this.userAdmin.next(role === 'admin')
    }

    private updateUserDate(id: string, metaDate: UserMetaDate) {
        this.cloudStore.collection(this.usersPath).doc(id).update({
            metaDate: {
                ...metaDate
            }
        })
    }

    private setUserConfig(id: string, email: string, metaDate: UserMetaDate) {
        this.cloudStore.collection(this.usersPath).doc(id).set(
            {
                email,
                basket: [],
                role: "user",
                metaDate: {
                    ...metaDate
                }
            }
        )
    }


    isLoggedIn(): BehaviorSubject<boolean> {
        return this._isLoggedIn;
    }

    async login({email, password}: LoginWithEmail) {
        const {uid, metadata}: ({
            uid?: string,
            metadata?: UserMetaDate
        } | any) = await this.fireAuth.signInWithEmailAndPassword(email, password)
            .then(({user}) => {
                return {uid: user!.uid, metadata: user!.metadata};
            })
            .catch(({message}) => {
                this.snackbarService.showMessage(message, ['warning']);
            })
        if (uid) {
            await this.setUser(uid);
            await this.updateUserDate(uid, metadata)
            this._isLoggedIn.next(true);
            this.snackbarService.showMessage('Success', ['success'])
        }

    }

    getUserId(): Observable<string> {
        return this.fireAuth.user.pipe(
            filter(data => !!data?.uid),
            map(data => data!.uid)
        );
    }

    async registration({email, password}: LoginWithEmail) {
        const uid = await this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then((data) => {
                this.setUserConfig(data.user!.uid, email, data.user!.metadata);
                return data.user!.uid
            }).catch(({message}) => {
                this.snackbarService.showMessage(message, ['warning']);
            })
        if (uid) {
            await this.setUser(uid);
            this._isLoggedIn.next(true);
            this.snackbarService.showMessage('Success', ['success'])
        }
    }

    logout() {
        this.fireAuth.signOut()
            .then(() => {
                this.userAdmin.next(false);
                this._isLoggedIn.next(false);
            })
            .catch(err => {
                this.snackbarService.showMessage(err, ['warning']);
            })
    }

}