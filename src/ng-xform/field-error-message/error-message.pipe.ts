import { Pipe, PipeTransform } from '@angular/core';

import * as messages from './error-messages';

@Pipe({
  name: 'errorMessage'
})
export class ErrorMessagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }

    const error = Object.keys(value)[0];
    switch (error) {
      case 'minlength':
      case 'maxlength':
        return messages[error].replace('{requiredLength}', value[error].requiredLength);

      default: return messages[error] || '';
    }
  }

}
