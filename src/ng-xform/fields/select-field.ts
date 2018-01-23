import { SelectOption } from './select-option';
import { DynamicField } from './dynamic-field';
import { OptionValue } from '../../types';
import { Observable } from 'rxjs/Observable';

export class SelectField extends DynamicField {
  public controlType ? = 'SELECT';
  public options: string[] | OptionValue[] | Observable<OptionValue[]>;

  constructor(options = {}) {
    super(options);
    this.options = options['options'];
  }
}
