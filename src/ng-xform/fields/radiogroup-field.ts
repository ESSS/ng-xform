import { Observable } from 'rxjs';
import { DynamicField } from './dynamic-field';

export class RadioGroupField<T = any> extends DynamicField<T> {
  public controlType ? = 'RADIOGROUP';
  public options: any[] | Observable<any[]>;
  public optionValueKey?: string;
  public optionLabelKey?: string;
  constructor(options: RadioGroupField<T>) {
    super(options);
    this.options = options.options;
    this.optionValueKey = options.optionValueKey;
    this.optionLabelKey = options.optionLabelKey;
  }
}
