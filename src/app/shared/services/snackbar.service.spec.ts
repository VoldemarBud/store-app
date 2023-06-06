import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarService} from './snackbar.service';

describe('SnackbarService', () => {
    let snackbarService: SnackbarService;
    let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        // Створення підробленого об'єкту MatSnackBar з допомогою jasmine.createSpyObj
        const matSnackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

        TestBed.configureTestingModule({
            providers: [
                SnackbarService,
                {provide: MatSnackBar, useValue: matSnackBarSpyObj}
            ]
        });

        // Отримання екземпляра SnackbarService та підробленого об'єкту MatSnackBar
        snackbarService = TestBed.inject(SnackbarService);
        matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    it('should create SnackbarService', () => {
        // Перевірка, чи було створено екземпляр SnackbarService
        expect(snackbarService).toBeTruthy();
    });

    it('should call MatSnackBar.openFromComponent with correct parameters', () => {
        const message = 'Test message';
        const cssClass = ['class1', 'class2'];

        // Виклик методу showMessage з сервісу SnackbarService
        snackbarService.showMessage(message, cssClass);

        // Перевірка, чи було викликано метод openFromComponent з правильними параметрами
        expect(matSnackBarSpy.openFromComponent).toHaveBeenCalledWith(
            jasmine.any(Function),
            {
                data: message,
                duration: 3000,
                verticalPosition: 'bottom',
                horizontalPosition: 'left',
                panelClass: cssClass
            }
        );
    });

    it('should return the sum of two numbers synchronously', () => {
        const a = 5;
        const b = 10;
        const expectedSum = a + b;

        // Виклик синхронного методу testMethod1 з сервісу SnackbarService
        const sum = snackbarService.testMethod1(a, b);

        // Перевірка, чи повернена сума відповідає очікуваному значенню
        expect(sum).toBe(expectedSum);
    });
    it('should return the sum of two numbers asynchronously', fakeAsync(() => {
        const a = 5;
        const b = 10;
        const expectedSum = a + b;

        // Call the asynchronous method asyncMethod from the SnackbarService
        snackbarService.asyncMethod(a, b).then(result => {
            expect(result).toBe(expectedSum);
        });

        // Advance the virtual clock by 5000 milliseconds
        tick(5000);

        // Check if the returned sum matches the expected value
    }));

});
