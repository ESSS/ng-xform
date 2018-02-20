import { FormGroup } from '@angular/forms';

export class NgXformGroup extends FormGroup {

  patchValue(value: {
    [key: string]: any;
  }, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.patchValue(value || {}, options);
  }
}
