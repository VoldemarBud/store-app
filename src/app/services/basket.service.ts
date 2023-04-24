import {Injectable} from '@angular/core';
import {filter, first, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {SnackbarService} from "./snackbar.service";
import {Product} from "../models/product/product";
import {ProductService} from "./product.service";
import {AuthService} from "./auth.service";
import {OrderHistory} from "../models/orderHistory";
import {User} from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class BasketService {
    private readonly usersPath: string = 'users';

    getProductInBasket$: Observable<string[] | []> = this.getProductInBasket()
    basketProducts$:Observable<Product[]> = this.basketProducts()

    constructor(
        private cloudStore: AngularFirestore,
        private productService: ProductService,
        private authService: AuthService,
        private snackbarService: SnackbarService
    ) {
    }


    getProductInBasket():Observable<string[]|[]> {
        return this.authService.getUserId().pipe(
            switchMap(id => {
                return this.cloudStore.collection(this.usersPath).doc(id).valueChanges().pipe(
                    map((user: any) => user.basket),
                );
            })
        );

    }

    deleteFromBasket(productId: string): Observable<void> {
        return this.authService.getUserId().pipe(
            shareReplay(1),
            switchMap(id => {
                const activeOrder = this.cloudStore.collection(this.usersPath).doc(id)
                return activeOrder
                    .valueChanges().pipe(
                        filter((data) => !!data),
                        first(),
                        switchMap((oldData:any) => {
                            this.snackbarService.showMessage('Product delete from basket', ['success'])
                            return activeOrder.update({
                                basket: oldData.basket.filter((product: string) => product !== productId)
                            })
                        })
                    )
            })
        )
    }


    totalPrice():Observable<number> {
        return this.basketProducts$.pipe(
            map((data:Product[]) => data.map((data: Product) => data.price)
                .reduce((sum: number, price: number) => sum + price, 0)),
        )
    }

    addToBasket(productId: string) {
        return this.authService.getUserId().pipe(
            shareReplay(1),
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
                            this.snackbarService.showMessage('You have products in basket', ['warning'])
                            return of(oldData);
                        })
                    )
            })
        );
    }

    orderHistory(): Observable<OrderHistory[] | []> {
        return this.authService.getUserId().pipe(
            shareReplay(1),
            switchMap(id => {
                    return this.cloudStore.collection(this.usersPath).doc(id).collection('completeOrders').valueChanges() as Observable<OrderHistory[] | []>
                }
            ))
    }

    basketProducts(): Observable<Product[]> {
        return this.getProductInBasket$.pipe(
            switchMap((basketItems: string[]) => {
                return this.productService.getProducts({})
                    .valueChanges({idField: 'id'})
                    .pipe(
                        map((products: { id: string }[]) => products
                            .filter((product: { id: string }) => basketItems.includes(product.id))
                        )
                    );
            })
        ) as Observable<Product[]>
    }


    completeOrder() {
        return this.authService.getUserId().pipe(
            switchMap((id: string) => {
                const activeOrderRef = this.cloudStore.collection(this.usersPath).doc(id)
                return activeOrderRef.get().pipe(
                    filter(data => !!data.data()),
                    map(data => data.data() as User),
                    switchMap((activeOrder: User) => {
                        console.log('activeOrder', activeOrder)
                        return this.totalPrice().pipe(
                            map(totalPrice => {
                                this.cloudStore.collection('users').doc(id).collection('completeOrders').add({
                                    dataOrder: new Date().getTime(),
                                    products: activeOrder.basket,
                                    totalPrice
                                }).then(() => {
                                    this.snackbarService.showMessage('Order Created', ['success'])
                                    activeOrderRef.update({
                                        basket: []
                                    }).catch(({message}) => {
                                        this.snackbarService.showMessage(`${message.substring(message.indexOf(':') + 2, message.lastIndexOf('(') - 1)} `, ['warning']);
                                    })
                                }).catch(({message}) => {
                                    this.snackbarService.showMessage(`${message.substring(message.indexOf(':') + 2, message.lastIndexOf('(') - 1)} `, ['warning']);
                                })
                            })
                        )
                    })
                )
            })
        );
    }
}
