import { DynamicField } from './dynamic-field';

export class MeasureField extends DynamicField {
  public controlType ? = 'MEASURE';
  public unit?: string;

  constructor(options: MeasureField = {}) {
    super(options);
    this.unit = options.unit;
  }
}
