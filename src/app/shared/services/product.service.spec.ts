import {TestBed} from '@angular/core/testing';
import {ProductService} from './product.service';
import {SnackbarService} from './snackbar.service';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";

describe('ProductService', () => {
    let productService: ProductService;
    let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
    let storageSpy: jasmine.SpyObj<AngularFireStorage>;
    let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

    beforeEach(() => {
        // Creating spy objects for the dependencies
        const firestoreSpyObj = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc', 'valueChanges']);
        const storageSpyObj = jasmine.createSpyObj('AngularFireStorage', ['ref', 'upload']);
        const snackbarServiceSpyObj = jasmine.createSpyObj('SnackbarService', ['showMessage']);

        TestBed.configureTestingModule({
            providers: [
                ProductService,
                {provide: AngularFirestore, useValue: firestoreSpyObj},
                {provide: AngularFireStorage, useValue: storageSpyObj},
                {provide: SnackbarService, useValue: snackbarServiceSpyObj}
            ]
        });

        // Obtaining instances of the service and the spy objects
        productService = TestBed.inject(ProductService);
        firestoreSpy = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
        storageSpy = TestBed.inject(AngularFireStorage) as jasmine.SpyObj<AngularFireStorage>;
        snackbarServiceSpy = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;
    });

    it('should create ProductService', () => {
        expect(productService).toBeTruthy();
    });

    it('should call AngularFirestore.doc with correct parameters in getProduct', () => {
        const id = 'testId';

        productService.getProduct(id);
        expect(firestoreSpy.doc).toHaveBeenCalledWith(jasmine.stringMatching('/products/testId/'));

    });

    it('should call AngularFireStorage.ref and delete in deleteLastFile', () => {
        const imageFile = new File([], 'test.jpg');
        const fileName = 'test.jpg';

        productService.deleteLastFile(imageFile, fileName);

        expect(storageSpy.ref).toHaveBeenCalledWith('products');
        expect(storageSpy.ref('products').child).toHaveBeenCalledWith('test.jpg');
        expect(storageSpy.ref('products').child('test.jpg').delete).toHaveBeenCalled();
    });

    it('should call AngularFireStorage.upload and snapshotChanges in uploadFile', () => {
        const imageFile = new File([], 'test.jpg');
        const fileName = 'test.jpg';

        productService.uploadFile(imageFile, fileName);

        expect(storageSpy.upload).toHaveBeenCalledWith('products/test.jpg', imageFile);
        expect(storageSpy.upload('products/test.jpg', null).snapshotChanges).toHaveBeenCalled();
    });

    it('should call AngularFireStorage.ref and getDownloadURL in downloadURL', () => {
        const fileName = 'test.jpg';

        productService.downloadURL(fileName);

        expect(storageSpy.ref).toHaveBeenCalledWith('products/test.jpg');
        expect(storageSpy.ref('products').getDownloadURL).toHaveBeenCalled();
    });

});
