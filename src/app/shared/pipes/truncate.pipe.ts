import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(text?: string, length: number = 35, suffix: string = ' ...'): string|void {
        if (text) {
            if (text.length >= length) {
                return text.substring(0, length) + suffix;
            }
            return text;
        }
    }

}
