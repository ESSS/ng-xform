import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  Output,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberSymbol, getLocaleNumberSymbol } from '@angular/common';
import * as math from 'mathjs';

import { KeyCode as KC } from './number-utils';


/**
 * Component to generate input field form numbers
 */
@Component({
  selector: 'ng-xform-input-number',
  templateUrl: './input-number.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputNumberComponent,
    multi: true
  }],
})
export class InputNumberComponent implements ControlValueAccessor, AfterViewInit {

  @Output() paste = new EventEmitter();
  @Output() keypress = new EventEmitter<KeyboardEvent>();
  @Input() formatOptions = { notation: 'auto'};
  @Input() inputClass = '';
  @Input() inputStyle = '';
  @Input() inputId = '';
  viewModel = '';

  private input: HTMLInputElement;
  private isValidNumber: RegExp;
  private allowedKeyCodes = [
    KC.Plus,
    KC.Minus,
    KC.E,
    KC.Enter,
    KC.Number0,
    KC.Number1,
    KC.Number2,
    KC.Number3,
    KC.Number4,
    KC.Number5,
    KC.Number6,
    KC.Number7,
    KC.Number8,
    KC.Number9,
  ];
  private thousandSeparator: string;
  private decimalSeparator: string;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(LOCALE_ID) private locale: string) {
    this.thousandSeparator = getLocaleNumberSymbol(locale, NumberSymbol.Group);
    this.decimalSeparator = getLocaleNumberSymbol(locale, NumberSymbol.Decimal);
    const decimalSymbolKeyCode = this.decimalSeparator.charCodeAt(0);
    this.allowedKeyCodes.push(decimalSymbolKeyCode);
    this.isValidNumber = new RegExp(
      `^(([+\\-]?(?:(?:\\d{1,3}(?:\\${this.thousandSeparator}\\d{1,3})+)|\\d*))(?:\\${this.decimalSeparator}(\\d*))?)` +
      `(?:(?:[e]+([+\-]?\\d*)))?$`
    );
  }

  ngAfterViewInit() {
    this.input = this.elementRef.nativeElement.querySelector('input');
    this.input.oninput = () => {
      this._onChange(this.getValueAsNumber());
    };
    this.input.onkeypress = (event: KeyboardEvent) => {
      this.keypress.emit(event);
      if (this.allowedKeyCodes.indexOf(event.keyCode) < 0 || !this.isValidNumber.test(this.getFutureValue(event))) {
        event.preventDefault();
      }
    }
    this.input.onpaste = (event: Event) => this.paste.emit(event);
  }

  private getFutureValue(event: KeyboardEvent) {
    const input: any = event['target'];
    return input.value.slice(0, input.selectionStart) +
      event.key +
      input.value.slice(input.selectionEnd, input.value.length);
  }

  public get formattedValue() {
    return this.viewModel || '-';
  }

  private getValueAsNumber(): number {
    if (!this.isValidNumber.test(this.viewModel)) {
      return NaN;
    }
    const value = this.viewModel.replace(this.thousandSeparator, '').replace(this.decimalSeparator, '.');
    return Number(value);
  }

  private toLocaleString(value: number) {
    let formatedValue = math.format(value, this.formatOptions);
    if (this.decimalSeparator !== '.') {
      return formatedValue.replace('.', this.decimalSeparator);
    }
    return formatedValue;
  }

  writeValue(value: any): void {
    if (value == null) {
      this.viewModel = '';
      return;
    }
    this.viewModel = this.toLocaleString(Number(value));
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (!this.input) {
      return;
    }
    if (isDisabled) {
      this.renderer.setAttribute(this.input, 'disabled', undefined);
    } else {
      this.renderer.removeAttribute(this.input, 'disabled');
    }
  }

}