import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'forceUtc'
})
/**
 * This pipe force a string date value to UTC
 */
export class ForceUtcPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value != null) {
      return value + 'Z';
    }
    return null;
  }

}
