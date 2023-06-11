import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[appLogClick]'
})
export class LogClickDirective {
    counter: number = 0;

    @Output() clickChanges: EventEmitter<number> = new EventEmitter<number>();

    @HostListener('click') onClick() {
        this.counter++;
        this.clickChanges.emit(this.counter);
    }
}
