import { DynamicField } from './dynamic-field';

export class TextField extends DynamicField {
  public controlType ? = 'TEXT';
  public type?: string;

  constructor(options: TextField) {
    super(options);
    this.type = options.type || 'text';
  }
}
