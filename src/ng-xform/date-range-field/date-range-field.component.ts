import { DateRangeField } from './../fields/date-range-field';
import { DatePipe } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, AfterContentInit, ElementRef, AfterViewInit, Inject, LOCALE_ID } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { DateField } from '../fields';

/**
 * Component to generate a bootstrap form field of Date type
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-date-range-field',
  templateUrl: './date-range-field.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DateRangeFieldComponent,
    multi: true
  }],
})
export class DateRangeFieldComponent extends BaseDynamicFieldComponent<DateRangeField> implements AfterViewInit, AfterContentInit,
  ControlValueAccessor {
  config: Partial<BsDatepickerConfig>;
  componentControl = new FormControl();
  private input: HTMLInputElement;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  // the elementRef will be used to get the input element after the view is initialized.
  constructor(private elementRef: ElementRef, @Inject(LOCALE_ID) private locale: string) {
    super();
    this.componentControl.valueChanges.subscribe((val: any) => {
      // replay changes from view to the form value
      this._onChange(val);
    });
  }

  ngAfterContentInit() {
    this.componentControl.setValidators(this.field.validators);
    this.config = {
      containerClass: `theme-${this.field.theme}`,
      showWeekNumbers: this.field.showWeekNumbers
    };
  }

  ngAfterViewInit() {
    this.input = this.elementRef.nativeElement.querySelector('input');
    if (this.input) {
      this.input.onblur = this._onTouched
    }
  }

  writeValue(obj: any): void {
    if (obj instanceof Array) {
      this.componentControl.setValue(obj.map(item => new Date(item)));
    } else {
      this.componentControl.setValue(obj);
    }
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

  get formattedValue(): string {
    const dateFormatter = new DatePipe(this.field.locale || this.locale);
    if (!this.form.controls[this.elementId].value) {
      return '-';
    }
    const start = dateFormatter.transform(this.form.controls[this.elementId].value[0], 'mediumDate');
    const end = dateFormatter.transform(this.form.controls[this.elementId].value[1], 'mediumDate');
    return `${start} - ${end}`;
  }

}
