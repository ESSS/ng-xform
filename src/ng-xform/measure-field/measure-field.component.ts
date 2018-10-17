import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Unit } from 'mathjs';
import * as math from 'mathjs';
import { isObservable } from 'rxjs';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { MeasureField } from '../fields';
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
export class MeasureFieldComponent extends BaseDynamicFieldComponent<MeasureField> implements ControlValueAccessor, AfterViewInit,
  OnInit {

  @ViewChild('unitsDropdown') unitsDropdown: ElementRef;

  private input: HTMLInputElement;
  private quantity: Unit;

  viewUnit: string;
  availableUnits: string[];

  _onChange = (value: any) => { };
  _onTouched = () => { };

  constructor(private elementRef: ElementRef) {
    super();
  }

  get formattedValue() {
    return this.quantity ? math.format(this.quantity.to(this.viewUnit)) : '-'
  }

  ngOnInit() {
    super.ngOnInit();
    this.setViewUnits();
    this.setViewUnit();
  }

  ngAfterViewInit() {
    this.input = this.elementRef.nativeElement.querySelector('input');
    if (this.input) {
      this.input.onblur = this._onTouched
    }
    this.input.oninput = (event: Event) => {
      const field = event.target as HTMLInputElement;
      if (!field.value) {
        this.quantity = null;
        this._onChange(null);
        return;
      }

      const value = Number(field.value);
      this.quantity = math.unit(value, this.viewUnit).to(this.field.modelUnit);
      this._onChange(new Measure(
        this.quantity.toNumber(this.field.modelUnit),
        this.field.modelUnit
      ));
    }
  }

  writeValue(obj: Measure): void {
    if (!obj) {
      return;
    }
    this.quantity = math.unit(obj.value, obj.unit).to(this.field.modelUnit);
    this.updateInputValue();
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.input.disabled = isDisabled;
  }

  changeUnit(unit: string, emitEvent = true) {
    if (!unit) {
      this.viewUnit = this.field.modelUnit;
      return;
    }
    this.viewUnit = unit;
    if (this.quantity) {
      this.updateInputValue();
    }
    if (this.field.changedUnitHandler && emitEvent) {
      this.field.changedUnitHandler(unit);
    }
  }

  private updateInputValue() {
    const value = this.quantity.toNumber(this.viewUnit);
    if (this.input) {
      this.input.value = math.format(value, this.field.formatOptions);
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
