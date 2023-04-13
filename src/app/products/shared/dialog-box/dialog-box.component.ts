import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {filter, Subject, switchMap, takeUntil} from 'rxjs';
import {IProduct} from 'src/app/models/product/product';

interface DialogData {
    title: string,
    product?: IProduct
}

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss']
})

export class DialogBoxComponent implements OnInit {
    private imageFile?: File;
    private newFileName!: string;
    private unsub = new Subject();

    form: FormGroup = new FormGroup({
        title: new FormControl('',
            [
                Validators.required,
                Validators.minLength(5)]
        ),
        description: new FormControl(''),
        image: new FormGroup({
                imgUrl: new FormControl('',
                    [Validators.required]
                ),
                imgName: new FormControl('')
            }
        ),
        price: new FormControl(0,
            [
                Validators.required,
                Validators.min(1),
                Validators.pattern("[0-9]*$")
            ]),
        configure: new FormGroup({
            year: new FormControl('', [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(4),
                Validators.pattern("[0-9]*$")
            ])
        })
    })

    constructor(
        private productService: ProductService,
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit(): void {
        if (this.data.product) {
            this.form.patchValue(this.data.product)
        }
    }

    get formImage() {
        return this.form.controls['image']
    }

    onNoClick(): void {
        this.productService.deleteLastFile(this.imageFile, this.newFileName);
        this.dialogRef.close();
    }


    private generateNewName(imageFileName: string): string {
        const lastPoint = imageFileName!.indexOf('.');
        return `${imageFileName.substring(0, lastPoint)}-${new Date().getTime()}${imageFileName.substring(lastPoint)}`
    }

    handleFileInputChange(l: FileList | null): void {
        if (l?.length) {
            if (this.data.product) {
                this.productService.deleteLastFile(this.data.product, this.data.product.image.imgName)
            } else {
                this.productService.deleteLastFile(this.imageFile, this.newFileName)
            }
            this.imageFile = l[0]
            this.newFileName = this.generateNewName(this.imageFile?.name);

            this.productService.uploadFile(this.imageFile, this.newFileName).pipe(
                filter(data => data?.state === 'success'),
                switchMap(() => {
                    return this.productService.downloadURL(this.newFileName)
                }),
                takeUntil(this.unsub)
            ).subscribe(downloadURL => {
                this.formImage
                    .patchValue({
                        imgUrl: downloadURL,
                        imgName: this.newFileName
                    });
                this.unsub.next(true);
                this.unsub.complete();
            })
        }
    }


    onSubmit() {
        this.formImage.markAsTouched();
        if (this.form.valid) {
            if (this.data.product) {
                this.productService.editeProduct(this.data.product.id,this.form.value);
            } else {
                this.productService.addProduct(this.form.value)
            }
            this.dialogRef.close();
        }
    }

}
