import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nestedAttribute'
})
export class NestedAttributePipe implements PipeTransform {

  transform(value: any, attr: string): any {
    if (value instanceof Object && attr) {
      return value[attr];
    }
    return value;
  }

}
