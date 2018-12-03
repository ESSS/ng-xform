import { ValidatorFn } from '@angular/forms';

export abstract class DynamicField<T = any> {
  public key?: keyof T;
  public label?: string;
  public controlType?: string;
  public validators?: Array<ValidatorFn | null | undefined>;
  public readOnly?: boolean;
  public visibilityFn?: (val: any) => boolean;
  public keepValueWhenHiding?: boolean;
  public onChangeFn?: (val: any) => void;

  constructor(options: DynamicField<T>) {
    this.key = options.key;
    this.label = options.label || '';
    this.controlType = options.controlType || 'text';
    this.validators = options.validators;
    this.readOnly = options.readOnly;
    this.visibilityFn = options.visibilityFn;
    this.keepValueWhenHiding = options.keepValueWhenHiding;
    this.onChangeFn = options.onChangeFn;
  }
}
