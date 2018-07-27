import { DynamicField } from './dynamic-field';

export class TextField<T = any> extends DynamicField<T> {
  public controlType ? = 'TEXT';
  public type?: string;

  constructor(options: TextField<T>) {
    super(options);
    this.type = options.type || 'text';
  }
}
