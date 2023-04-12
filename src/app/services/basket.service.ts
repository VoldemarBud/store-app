import {Injectable} from '@angular/core';
import {filter, first, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {SnackbarService} from "./snackbar.service";
import {IProduct} from "../models/product/product";
import {ProductService} from "./product.service";
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class BasketService {
    private readonly basketPath: string = 'basket';
    private readonly usersPath: string = 'users';

    getProductInBasket$: Observable<any> = this.getProductInBasket()
    basketProducts$: Observable<any> = this.basketProducts()

    constructor(
        private cloudStore: AngularFirestore,
        private productService: ProductService,
        private authService: AuthService,
        private snackbarService: SnackbarService
    ) {
    }


    getProductInBasket() {
        return this.authService.getUserId().pipe(
            shareReplay(1),
            filter(id => !!id),
            switchMap(id => {
                return this.cloudStore.collection(this.usersPath).doc(id).valueChanges().pipe(
                    map((user: any) => user.basket),
                );
            })
        );

    }

    deleteFromBasket(productId: string) {
        return this.authService.getUserId().pipe(
            shareReplay(1),
            filter(id => !!id),
            switchMap(id => {
                const activeOrder = this.cloudStore.collection(this.usersPath).doc(id)
                return activeOrder
                    .valueChanges().pipe(
                        filter((data) => !!data),
                        first(),
                        switchMap((oldData: any) => {
                            this.snackbarService.showMessage('Product delete from basket', ['success'])
                            return activeOrder.update({
                                basket: oldData.basket.filter((product: string) => product !== productId)
                            })
                        })
                    )
            })
        )
    }


    totalPrice() {
        return this.basketProducts$.pipe(
            map(data => data.map((data: IProduct) => data.price)
                .reduce((sum: number, price: number) => sum + price, 0)),
        )
    }

    addToBasket(productId: string) {
        return this.authService.getUserId().pipe(
            shareReplay(1),
            filter(id => !!id),
            switchMap(id => {
                const activeOrder = this.cloudStore.collection(this.usersPath).doc(id)
                return activeOrder
                    .valueChanges().pipe(
                        filter((data) => !!data),
                        first(),
                        switchMap((oldData: any) => {
                            if (!oldData.basket.includes(productId)) {
                                this.snackbarService.showMessage('Added to basket', ['success'])
                                return activeOrder.update({
                                    basket: [...oldData.basket, productId]
                                })
                            }
                            this.snackbarService.showMessage('You have product in basket', ['warning'])
                            return of(oldData);
                        })
                    )
            })
        );
    }

    basketProducts() {
        return this.getProductInBasket$.pipe(
            switchMap((basketItems: any) => {
                return this.productService.getProducts({})
                    .valueChanges({idField: 'id'})
                    .pipe(
                        map((products) => products
                            .filter((product) => basketItems.includes(product.id))
                        )
                    );
            })
        ) as Observable<IProduct[]>
    }


    completeOrder() {
        this.authService.getUserId().pipe(
            filter(id => !!id),
            switchMap((id) => {
                const activeOrderRef = this.cloudStore.collection(this.basketPath).doc('activeOrder');
                return activeOrderRef.valueChanges().pipe(
                    switchMap((activeOrder: any) => {
                        return this.totalPrice().pipe(
                            map(totalPrice => {
                                this.cloudStore.collection('users').doc(id).collection('completeOrders').add({
                                    dataOrder: new Date(),
                                    products: activeOrder.productsId,
                                    totalPrice
                                }).then(() => {
                                    activeOrderRef.update({
                                        productsId: []
                                    })
                                })
                            })
                        )
                    })
                )
            })
        );
    }
}
