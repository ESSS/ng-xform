import { DynamicField } from './dynamic-field';

export class DateField extends DynamicField {
  public controlType ? = 'DATE';
  public theme?: 'default' | 'green' | 'blue' | 'dark-blue' | 'red' | 'orange';
  public placement?: 'top' | 'bottom' | 'left' | 'right';
  public initialValue?: Date;
  public maxDate?: Date;
  public minDate?: Date;

  constructor(options: DateField) {
    super(options);
    this.theme = options.theme || 'dark-blue';
    this.placement = options.placement || 'bottom';
    this.maxDate = options.maxDate;
    this.minDate = options.minDate;
  }
}
