import { DynamicField } from './dynamic-field';

export class MultilineField extends DynamicField {
  public controlType ? = 'MULTILINE';
  public rows?: number;

  constructor(options: MultilineField) {
    super(options);
    this.rows = options.rows;
  }
}
