import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, AfterContentInit, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { DatepickerField } from '../fields';

/**
 * Component to generate a bootstrap form field of general type
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DatepickerFieldComponent,
    multi: true
  }],
})
export class DatepickerFieldComponent extends BaseDynamicFieldComponent<DatepickerField> implements AfterViewInit, AfterContentInit,
  ControlValueAccessor {
  config: Partial<BsDatepickerConfig>;
  componentControl = new FormControl();
  private input: HTMLInputElement;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  constructor(private _localeService: BsLocaleService, private elementRef: ElementRef, private renderer: Renderer) {
    super();
    this.componentControl.valueChanges.subscribe((val: any) => {
      this._onChange(val);
    });
  }

  ngAfterContentInit() {
    this.componentControl.setValidators(this.field.validators);
    this.config = Object.assign({}, {
      containerClass: `theme-${this.field.theme}`,
    });
    if (this.field.locale) {
      this._localeService.use(this.field.locale)
    }
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
