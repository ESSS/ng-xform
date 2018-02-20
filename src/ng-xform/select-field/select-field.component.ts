import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ViewChild, Component, OnInit, AfterViewInit, Input, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import { BaseDynamicFieldComponent } from './../field-components/base-dynamic-field.component';
import { SelectField } from '../fields';


/**
 * Component to generate a bootstrap form field of general type
 *
 * :inputId: the id of the field in the FormGroup
 * :inputType: type of the input field
 * :caption: Title of the field
 * :form: FormGroup containing the field
 * :validator: external function that validates the data in the field
 * :errorMessage: message to be shown when the validation fails
 */
@Component({
  selector: 'ng-xform-select-field',
  templateUrl: './select-field.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SelectFieldComponent,
    multi: true
  }],
})
export class SelectFieldComponent extends BaseDynamicFieldComponent<SelectField> implements ControlValueAccessor, OnInit, AfterViewInit {

  @ViewChild(NgSelectComponent) select: NgSelectComponent;
  viewModel = new BehaviorSubject<any>(null);

  optionValues: any[] = [];
  optionLabel = '-';
  typeahead: EventEmitter<string>;

  _onChange: any = (value: any) => { };
  _onTouched: any = () => { };

  writeValue(obj: any): void {
    this.viewModel.next(obj);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.select.setDisabledState(isDisabled);
  }

  updateOptionLabel() {
    setTimeout(() => {
      this.optionLabel = this.select.selectedItems.map(item => item.label).join(this.field.separator);
    }, 0);
  }

  ngAfterViewInit() {
    this.select.registerOnChange((value: any) => {
      this.updateOptionLabel();
      this._onChange(value);
    });
    this.select.registerOnTouched(this._onTouched);
    this.viewModel.subscribe((value: any) => {
      if (this.field.searchByValueAttributeHandler) {
        this.field.searchByValueAttributeHandler(value).subscribe((val: any) => {
          this.optionValues = [val];
          this.select.writeValue(value);
          this.updateOptionLabel();
        });
        return;
      }
      this.select.writeValue(value);
      this.updateOptionLabel();
    })
  }

  ngOnInit() {
    super.ngOnInit();
    this.config();
  }

  config() {
    if (this.field.searchHandler) {
      this.typeahead = new EventEmitter<string>();
      this.field.searchable = true;
      let searchHandler = this.typeahead.asObservable();
      try {
        searchHandler = searchHandler
          .distinctUntilChanged()
          .debounceTime(200);
      } catch (e) {
        console.warn('You need add \'import "rxjs/Rx";\' on your main.ts to use distinctUntilChanged and debounceTime operators');
      }
      searchHandler
        .switchMap((term: string) => this.field.searchHandler(term))
        .subscribe((items: string[]) => {
          this.optionValues = items;
        }, (err: any) => {
          console.log(err);
          this.optionValues = [];
        });
    }
    let options = this.field.options;

    if (options instanceof Observable) {
      (<Observable<any[]>>options).subscribe(ret => this.optionValues = ret);
    } else {
      this.optionValues = options;
    }
  }
}
