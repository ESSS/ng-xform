import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, AfterContentInit, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
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
  selector: 'ng-xform-date-field',
  templateUrl: './date-field.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DateFieldComponent,
    multi: true
  }],
})
export class DateFieldComponent extends BaseDynamicFieldComponent<DateField> implements AfterViewInit, AfterContentInit,
  ControlValueAccessor {
  config: Partial<BsDatepickerConfig>;
  componentControl = new FormControl();
  private input: HTMLInputElement;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  // the elementRef will be used to get the input element after the view is initialized.
  constructor(private elementRef: ElementRef) {
    super();
    this.componentControl.valueChanges.subscribe((val: any) => {
      // replay changes from view to the form value
      this._onChange(val);
    });
  }

  ngAfterContentInit() {
    this.componentControl.setValidators(this.field.validators);
    this.config = Object.assign({}, {
      containerClass: `theme-${this.field.theme}`,
    });
  }

  ngAfterViewInit() {
    this.input = this.elementRef.nativeElement.querySelector('input');
    if (this.input) {
      this.input.onblur = this._onTouched
    }
  }

  writeValue(obj: any): void {
    if (obj instanceof Date) {
      this.componentControl.setValue(obj);
    } else if (obj) {
      this.componentControl.setValue(new Date(obj));
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


}
