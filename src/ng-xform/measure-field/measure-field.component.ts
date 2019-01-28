import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unit } from 'mathjs';
import * as math from 'mathjs';
import { isObservable, Subscription } from 'rxjs';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { MeasureField } from '../fields';
import { InputNumberComponent } from '../number-field/input-number.component';
import { Measure } from './../models/measure';


/**
 * Component to generate a bootstrap form field of numeric type
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-measure-field',
  templateUrl: './measure-field.component.html',
  styleUrls: ['./measure-field.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: MeasureFieldComponent,
    multi: true
  }],
})
export class MeasureFieldComponent extends BaseDynamicFieldComponent<MeasureField> implements ControlValueAccessor, OnInit, OnDestroy {

  @ViewChild(InputNumberComponent) inputNumber: InputNumberComponent;

  private quantity: Unit;
  viewModel: number;
  viewUnit: string;
  availableUnits: string[];

  subs = new Subscription();

  _onChange = (value: any) => { };
  _onTouched = () => { };

  get formattedValue() {
    return !!this.inputNumber && !!this.quantity ? `${this.inputNumber.formattedValue} ${this.viewUnit}` : '-';
  }

  ngOnInit() {
    super.ngOnInit();
    this.setViewUnits();
    this.setViewUnit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onViewChange(value: any) {
    let newValue: any;
    if (!value) {
      this.quantity = null;
      newValue = null;
    } else {
      this.quantity = math.unit(value, this.viewUnit).to(this.field.modelUnit);
      newValue = new Measure(
        this.quantity.toNumber(this.field.modelUnit),
        this.field.modelUnit
      );
    }

    this.control.setValue(newValue, { emitModelToViewChange: false });
    this._onChange(newValue);
  }

  writeValue(obj: Measure): void {
    if (!!obj) {
      this.quantity = math.unit(obj.value, obj.unit).to(this.field.modelUnit);
    } else {
      this.quantity = undefined;
    }
    this.updateInputValue();
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.inputNumber.setDisabledState(isDisabled);
  }

  changeUnit(unit: string, emitEvent = true) {
    this.viewUnit = !unit ? this.field.modelUnit : unit;
    if (this.quantity) {
      this.updateInputValue();
    }
    if (this.field.changedUnitHandler && emitEvent) {
      this.field.changedUnitHandler(unit);
    }
  }

  private updateInputValue() {
    const newValue = this.quantity ? this.quantity.toNumber(this.viewUnit) : undefined;
    if (this.viewModel !== newValue) {
      this.viewModel = newValue;
    }
  }

  private setViewUnits() {
    if (!this.field.availableUnits) {
      this.availableUnits = [this.field.modelUnit];
      return;
    }

    if (isObservable(this.field.availableUnits)) {
      this.field.availableUnits.subscribe(unitList => this.availableUnits = unitList);
      this.availableUnits = [];
    } else {
      this.availableUnits = this.field.availableUnits;
    }
  }

  private setViewUnit() {
    if (!this.field.viewUnit) {
      this.viewUnit = this.field.modelUnit;
      return;
    }

    if (isObservable(this.field.viewUnit)) {
      this.field.viewUnit.subscribe(unit => this.changeUnit(unit, false));
    } else {
      this.viewUnit = this.field.viewUnit;
    }
  }
}
