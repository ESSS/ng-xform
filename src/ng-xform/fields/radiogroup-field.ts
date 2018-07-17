import { Observable } from 'rxjs/Observable';
import { DynamicField } from './dynamic-field';

export class RadiogroupField<T = any> extends DynamicField<T> {
  public controlType ? = 'RADIOGROUP';
  public options: any[] | Observable<any[]>;
  public optionValueKey?: string;
  public optionLabelKey?: string;
  constructor(options: RadiogroupField<T>) {
    super(options);
    this.options = options.options;
    this.optionValueKey = options.optionValueKey;
    this.optionLabelKey = options.optionLabelKey;
  }
}
