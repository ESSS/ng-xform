import { TemplateRef } from '@angular/core';
import { DynamicField } from './dynamic-field';

export class CustomField<T = any> extends DynamicField<T> {
  public controlType ? = 'CUSTOM';
  public tmpl: TemplateRef<any>;

  constructor(options: CustomField<T>) {
    super(options);
    this.tmpl = options.tmpl;
  }
}
