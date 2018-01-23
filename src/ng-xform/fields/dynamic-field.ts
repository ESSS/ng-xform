import { ValidatorFn } from '@angular/forms';

export abstract class DynamicField {
  public key?: string;
  public label?: string;
  public required?: boolean;
  public controlType?: string;
  public validators?: Array<ValidatorFn | null | undefined>;

  constructor(
    options: DynamicField = {}
  ) {
    this.key = options.key || '';
    this.label = options.label || '';
    this.controlType = options.controlType || 'text';
    this.validators = options.validators;
  }

}
