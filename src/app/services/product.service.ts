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
