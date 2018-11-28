import { Observable } from 'rxjs';
import { DynamicField } from './dynamic-field';
import { FormatOptions } from 'mathjs';

export class MeasureField<T = any> extends DynamicField<T> {
  public controlType ? = 'MEASURE';
  public modelUnit: string;
  public viewUnit?: string | Observable<string>;
  public availableUnits?: string[] | Observable<string[]>;
  public formatOptions?: FormatOptions;
  public changedUnitHandler?: (unit: string) => void;

  constructor(options: MeasureField<T>) {
    super(options);
    this.modelUnit = options.modelUnit;
    this.viewUnit = options.viewUnit;
    this.availableUnits = options.availableUnits;
    this.formatOptions = options.formatOptions || {precision: 5, notation: 'auto'};
    this.changedUnitHandler = options.changedUnitHandler;
  }
}
