import { DynamicField } from './dynamic-field';

export class DateField<T = any> extends DynamicField<T> {
  public controlType ? = 'DATE';
  public theme?: 'default' | 'green' | 'blue' | 'dark-blue' | 'red' | 'orange';
  public placement?: 'top' | 'bottom' | 'left' | 'right';
  public initialValue?: Date;
  public locale?: string;
  public maxDate?: Date;
  public minDate?: Date;

  constructor(options: DateField<T>) {
    super(options);
    this.theme = options.theme || 'dark-blue';
    this.placement = options.placement || 'bottom';
    this.maxDate = options.maxDate;
    this.minDate = options.minDate;
    this.locale = options.locale;
  }
}
