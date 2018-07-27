import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valueSuffix'
})
export class ValueSuffixPipe implements PipeTransform {

  transform(value: any, suffix: string = ''): any {
    if (!value) {
      return '-';
    }
    return `${value} ${suffix}`;
  }

}
