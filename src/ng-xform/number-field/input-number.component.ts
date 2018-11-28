import { AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as math from 'mathjs';


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
  private regExpIsValidNumber: RegExp;
  private allowedKeyCodes = [ 43, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 101, 13 ];
  private millionSeparator: string;
  private decimalSeparator: string;

  _onChange = (value: any) => { };
  _onTouched = () => { };

  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(LOCALE_ID) private locale: string) {
    let decimalSymbolKeyCode;
    if (this.isPtLocale(locale)) {
      decimalSymbolKeyCode = 44;
      this.millionSeparator = '.';
      this.decimalSeparator = ',';
    } else {
      decimalSymbolKeyCode = 46;
      this.millionSeparator = ',';
      this.decimalSeparator = '.';
    }
    this.allowedKeyCodes.push(decimalSymbolKeyCode);
    this.regExpIsValidNumber = new RegExp(
      `^(([+\\-]?(?:(?:\\d{1,3}(?:\\${this.millionSeparator}\\d{1,3})+)|\\d*))(?:\\${this.decimalSeparator}(\\d*))?)` +
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
      if (this.allowedKeyCodes.indexOf(event.keyCode) < 0 || !this.regExpIsValidNumber.test(this.getFutureValue(event))) {
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
    if (!this.regExpIsValidNumber.test(this.viewModel)) {
      return NaN;
    }
    const value = this.viewModel.replace(this.millionSeparator, '').replace(this.decimalSeparator, '.');
    return Number(value);
  }

  private isPtLocale(locale: string) {
    return locale.indexOf('pt') > -1;
  }

  private toLocaleString(value: number) {
    let formatedValue = math.format(value, this.formatOptions);
    if (formatedValue.indexOf('.') > -1 && this.isPtLocale(this.locale)) {
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
