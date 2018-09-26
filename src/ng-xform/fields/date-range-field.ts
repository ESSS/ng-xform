import { DateField } from './date-field';

export class DateRangeField extends DateField {
  public controlType ? = 'DATERANGE';

  constructor(options: DateRangeField) {
    super(options);
  }
}
