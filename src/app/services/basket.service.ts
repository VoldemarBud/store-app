import { Injectable } from '@angular/core';
import {filter, first, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {SnackbarService} from "./snackbar.service";
import {IProduct} from "../models/product/product";
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class BasketService {
    private readonly basketPath: string = 'basket';

    getTotalProductInBasket$: Observable<any> = this.getTotalProductInBasket()
    basketProducts$: Observable<any> = this.basketProducts()

  constructor(
      private cloudStore: AngularFirestore,
      private productService: ProductService,
      private snackbarService: SnackbarService
  ) { }

  getTotalProductInBasket() {
    return this.cloudStore.collection(this.basketPath).doc('activeOrder').valueChanges().pipe(shareReplay(1))
  }

  deleteFromBasket(productId: string) {
    const activeOrder = this.cloudStore.collection(this.basketPath).doc('activeOrder')
    return activeOrder
        .valueChanges().pipe(
            filter((data) => !!data),
            first(),
            switchMap((oldData: any) => {
              this.snackbarService.showMessage('Product delete from basket',['success'])
              return activeOrder.update({
                productsId: oldData.productsId.filter((product: string) => product !== productId)
              })
            })
        )
  }

  addToBasket(productId: string) {
    const activeOrder = this.cloudStore.collection(this.basketPath).doc('activeOrder')
    return activeOrder
        .valueChanges().pipe(
            filter((data) => !!data),
            first(),
            switchMap((oldData: any) => {
              if (!oldData.productsId.includes(productId)) {
                this.snackbarService.showMessage('Added to basket',['success'])
                return activeOrder.update({
                  productsId: [...oldData.productsId, productId]
                })
              }
              this.snackbarService.showMessage('You have product in basket',['warning'])
              return of(oldData);
            })
        )
  }

  basketProducts() {
    return this.getTotalProductInBasket$.pipe(
        filter(data => !!data),
        switchMap((basketItems: any) => {
          return this.productService.getProducts({})
              .valueChanges({idField: 'id'})
              .pipe(
                  map((products) => products
                      .filter((product) => basketItems.productsId.includes(product.id))
                  )
              );
        })
    ) as Observable<IProduct[]>
  }


  completeOrder(){
    // this.cloudStore.collection('users').doc(id).collection('oldOrders')
  }
}
