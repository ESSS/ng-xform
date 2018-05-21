import { DynamicField } from './dynamic-field';

export class CheckboxField<T = any> extends DynamicField<T> {
  public controlType ? = 'CHECKBOX';

  constructor(options: CheckboxField<T>) {
    super(options);
  }
}
