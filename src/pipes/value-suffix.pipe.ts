import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';

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
