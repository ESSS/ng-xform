import { Observable } from 'rxjs/Observable';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Component, AfterViewInit, ElementRef, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { Measure } from './../models/measure';
import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { MeasureField } from '../fields';


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
  private quantity: Qty;

  viewUnit: string;
  availableUnits: string[];

  _onChange = (value: any) => { };
  _onTouched = () => { };

  constructor(private elementRef: ElementRef) {
    super();
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
      this.quantity = new Qty(value, this.viewUnit).to(this.field.modelUnit);
      this._onChange(new Measure(
        this.quantity.to(this.field.modelUnit).scalar,
        this.field.modelUnit
      ));
    }
  }

  writeValue(obj: Measure): void {
    if (!obj) {
      return;
    }
    this.quantity = new Qty(obj.value, obj.unit).to(this.field.modelUnit);
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

  changeUnit(unit: string) {
    this.viewUnit = unit;
    if (this.quantity) {
      this.updateInputValue();
    }
    if (this.field.changedUnitHandler) {
      this.field.changedUnitHandler(unit);
    }
  }

  private updateInputValue() {
    const value = this.quantity.to(this.viewUnit).scalar
    if (this.input) {
      this.input.value = Number(value.toFixed(this.field.precision)).toString();
    }
  }

  private setViewUnits() {
    if (!this.field.availableUnits) {
      const qt = Qty(0, this.field.modelUnit);
      const availableUnitsKind = qt.kind();
      this.availableUnits = Qty.getUnits(availableUnitsKind).map(el => Qty.getAliases(el)[0]);
      return;
    }

    if (this.field.availableUnits instanceof Observable) {
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

    if (this.field.viewUnit instanceof Observable) {
      this.field.viewUnit.subscribe(unit => this.changeUnit(unit));
      this.viewUnit = this.field.modelUnit;
    } else {
      this.viewUnit = this.field.viewUnit;
    }
  }
}
