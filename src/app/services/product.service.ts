import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {filter, first, map, Observable, of, shareReplay, switchMap} from 'rxjs';
import {IProduct} from '../models/product/product';
import {QueryFn} from "../models/queryFn";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
    AddToBasketSnackbarComponent
} from "../components/snackbars/add-to-basket-snackbar/add-to-basket-snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly productsPath: string = 'products';
    private readonly basketPath: string = 'basket';

    getTotalProductInBasket$ : Observable<any> = this.getTotalProductInBasket()
    basketProducts$ : Observable<any> = this.basketProducts()

    constructor(
        private cloudStore: AngularFirestore,
        private storage: AngularFireStorage,
        private _snackBar: MatSnackBar
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
                        this.showMessage('Added to basket');
                        return activeOrder.update({
                            productsId: [...oldData.productsId, productId]
                        })
                    }
                    this.showMessage('You have product in basket');
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

    addProduct(data:IProduct){
        this.cloudStore.collection('products')
            .add(data)
        this.showMessage('Product added');
    }

    editeProduct(productId:string,data:IProduct){
        this.cloudStore.collection('products')
            .doc(productId).update(data);
        this.showMessage('Product edited')
    }

    deleteFromBasket(productId: string) {
        const activeOrder = this.cloudStore.collection(this.basketPath).doc('activeOrder')
        this.showMessage('Product delete from basket')
        return activeOrder
            .valueChanges().pipe(
                filter((data) => !!data),
                first(),
                switchMap((oldData: any) => {
                    return activeOrder.update({
                        productsId: oldData.productsId.filter((product: string) => product !== productId)
                    })
                })
            )
    }

    private showMessage(message:string) {
        this._snackBar.openFromComponent(
            AddToBasketSnackbarComponent,
            {
                data: message,
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: "left"
            }
        )
    }
}
