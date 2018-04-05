import { DynamicField } from './dynamic-field';

export class CheckboxField extends DynamicField {
  public controlType ? = 'CHECKBOX';

  constructor(options: CheckboxField) {
    super(options);
  }
}
