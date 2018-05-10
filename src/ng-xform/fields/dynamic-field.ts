import { ValidatorFn } from '@angular/forms';

export abstract class DynamicField {
  public key?: string;
  public label?: string;
  public controlType?: string;
  public validators?: Array<ValidatorFn | null | undefined>;
  public readOnly?: boolean;
  public visibilityFn?: (val: any) => boolean;

  constructor(options: DynamicField) {
    this.key = options.key || '';
    this.label = options.label || '';
    this.controlType = options.controlType || 'text';
    this.validators = options.validators;
    this.readOnly = options.readOnly;
    this.visibilityFn = options.visibilityFn;
  }
}