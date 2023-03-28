import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { filter, first, map, Observable, of, switchMap } from 'rxjs';
import { IProduct } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsPath: string = 'products';
  private readonly basketPath: string = 'basket';

  constructor(
    private cloudStore: AngularFirestore,
    private storage: AngularFireStorage,
  ) {
  }

  private pathUploadFile(imageFileName: string): string {
    return `${this.productsPath}/${imageFileName}`
  }

  get getProducts() {
    return this.cloudStore.collection(this.productsPath)
  }

  deleteLastFile(imageFile: File | IProduct | undefined, fileName: any): void {
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
            return activeOrder.update({
              productsId: [...oldData.productsId, productId]
            })
          }
          return of(oldData);
        })
      )
  }

  get getTotalProductInBasket() {
    return this.cloudStore.collection(this.basketPath).doc('activeOrder').valueChanges()
  }

  get basketProducts() {
    return this.getTotalProductInBasket.pipe(
      filter(data => !!data),
      switchMap((basketItems: any) => {
        const productsId = basketItems.productsId
        return this.getProducts
          .valueChanges({idField: 'id'})
          .pipe(map((products) => products.filter((product) => productsId.includes(product.id))));
      })
    ) as Observable<IProduct[]>
  }


  deleteFromBasket(productId: string) {
    const activeOrder = this.cloudStore.collection(this.basketPath).doc('activeOrder')

    return activeOrder
      .valueChanges().pipe(
        filter((data) => !!data),
        first(),
        switchMap((oldData: any) => {
          return activeOrder.update({
            productsId: oldData.productsId.filter((product:string) => product !== productId)
          })
        })
      )
  }
}
