import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {IProduct} from '../models/product/product';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<IProduct> {
  constructor(private store: AngularFirestore) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    return this.store.collection('products').doc(route.params?.['id'])
        .valueChanges({idField: 'id'}) as Observable<IProduct>
  }
}
