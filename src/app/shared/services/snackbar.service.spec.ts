import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';
import { MessageSnackbarComponent } from "../components/snackbars/message-snackbar/message-snackbar.component";

describe('SnackbarService', () => {
    let snackbarService: SnackbarService;
    let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        const matSnackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

        TestBed.configureTestingModule({
            providers: [
                SnackbarService,
                { provide: MatSnackBar, useValue: matSnackBarSpyObj }
            ]
        });

        snackbarService = TestBed.inject(SnackbarService);
        matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    });

    it('should create SnackbarService', () => {
        expect(snackbarService).toBeTruthy();
    });

    it('should call MatSnackBar.openFromComponent with correct parameters', () => {
        const message = 'Test message';
        const cssClass = ['warning'];

        snackbarService.showMessage(message, cssClass);

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

    it('should call MatSnackBar.openFromComponent with MessageSnackbarComponent', () => {
        const message = 'Test message';
        const cssClass = ['class1', 'class2'];

        snackbarService.showMessage(message, cssClass);

        expect(matSnackBarSpy.openFromComponent).toHaveBeenCalledWith(
            MessageSnackbarComponent,
            jasmine.any(Object)
        );
    });
});
