import { DynamicField } from './dynamic-field';

export class NumberField<T = any> extends DynamicField<T> {
  public controlType ? = 'NUMBER';
  public precision?: number;
  public formatOptions?: { [key: string]: any };

  constructor(options: NumberField<T>) {
    super(options);
    this.precision = options.precision;
    this.formatOptions = options.formatOptions;
  }
}
