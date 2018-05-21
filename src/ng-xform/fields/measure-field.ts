import { Observable } from 'rxjs/Rx';
import { DynamicField } from './dynamic-field';

export class MeasureField<T = any> extends DynamicField<T> {
  public controlType ? = 'MEASURE';
  public modelUnit?: string;
  public viewUnit?: string | Observable<string>;
  public availableUnits?: string[] | Observable<string[]>;
  public precision?: number;
  public changedUnitHandler?: (unit: string) => void;

  constructor(options: MeasureField<T>) {
    super(options);
    this.modelUnit = options.modelUnit;
    this.viewUnit = options.viewUnit;
    this.availableUnits = options.availableUnits;
    this.precision = options.precision || 8;
    this.changedUnitHandler = options.changedUnitHandler;
  }
}
