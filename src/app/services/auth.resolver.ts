import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {IProduct} from '../models/product/product';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private auth: AuthService) {
  }

  resolve(): Observable<boolean>{
    return this.auth.isLoggedIn();
  }
}
