import { DynamicField } from './dynamic-field';

export class MultilineField<T = any> extends DynamicField<T> {
  public controlType ? = 'MULTILINE';
  public rows?: number;

  constructor(options: MultilineField<T>) {
    super(options);
    this.rows = options.rows;
  }
}
