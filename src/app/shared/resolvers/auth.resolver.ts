import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";

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
