import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {filter, first, map, Observable, of, shareReplay, switchMap} from 'rxjs';
import {IProduct} from '../models/product/product';
import {QueryFn} from "../models/queryFn";
import {SnackbarService} from "./snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly productsPath: string = 'products';
    private readonly basketPath: string = 'basket';

    getTotalProductInBasket$: Observable<any> = this.getTotalProductInBasket()
    basketProducts$: Observable<any> = this.basketProducts()

    constructor(
        private cloudStore: AngularFirestore,
        private storage: AngularFireStorage,
        private snackbarService: SnackbarService
    ) {
    }

    private pathUploadFile(imageFileName: string): string {
        return `${this.productsPath}/${imageFileName}`
    }

    getProducts({fieldPath = 'title', directionStr}: QueryFn) {
        return this.cloudStore.collection(this.productsPath,
            (fer) => fer.orderBy(fieldPath, directionStr))
    }

    deleteLastFile(imageFile: File | IProduct | undefined, fileName: string): void {
        if (imageFile) {
            this.storage.ref(this.productsPath).child(fileName).delete();
        }
    }

    uploadFile(imageFile: File, fileName: string): Observable<any> {
        return this.storage.upload(this.pathUploadFile(fileName), imageFile).snapshotChanges()
    }

    downloadURL(fileName: string): Observable<any> {
        return this.storage.ref(this.pathUploadFile(fileName))
            .getDownloadURL()
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

    getTotalProductInBasket() {
        return this.cloudStore.collection(this.basketPath).doc('activeOrder').valueChanges().pipe(shareReplay(1))
    }

    basketProducts() {
        return this.getTotalProductInBasket$.pipe(
            filter(data => !!data),
            switchMap((basketItems: any) => {
                return this.getProducts({})
                    .valueChanges({idField: 'id'})
                    .pipe(
                        map((products) => products
                            .filter((product) => basketItems.productsId.includes(product.id))
                        )
                    );
            })
        ) as Observable<IProduct[]>
    }

    addProduct(data: IProduct) {
        this.cloudStore.collection('products')
            .add(data)
            .then(() => {
                this.snackbarService.showMessage('Product added',['success']);
            }).catch((error) => {
            this.snackbarService.showMessage(error.message ,['warning'])
        });
    }

    editeProduct(productId: string, data: IProduct) {
        this.cloudStore.collection('products')
            .doc(productId).update(data)
            .then(() => {
                this.snackbarService.showMessage('Product edited',['success'])
            }).catch((error) => {
                this.snackbarService.showMessage(error.message,['warning'])
            });
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

    deleteProduct(productId: string) {
        this.cloudStore.collection(this.productsPath).doc(productId).delete()
            .then(() => {
                this.snackbarService.showMessage('Product delete',['success'])
            })
            .catch((error) => {
                this.snackbarService.showMessage(error.message,['warning'])
            });
    }

}
