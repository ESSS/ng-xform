import { NgSelectComponent } from '@ng-select/ng-select';
import { ViewChild, Component, OnInit, AfterViewInit, Input, EventEmitter, SimpleChange } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import { BaseDynamicFieldComponent } from './../field-components/base-dynamic-field.component';
import { SelectField, AddNewOptionObservableFn } from '../fields';


/**
 * Component to generate a form select field that can be settable to single-selection, multi-selection, and typeahead(autocomplete)
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
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
  parsedAddNewOption: boolean | ((term: string) => any | Promise<any>);

  _onChange: any = (value: any) => { };
  _onTouched: any = () => { };

  ngOnInit() {
    super.ngOnInit();
    this.config();
  }

  ngAfterViewInit() {
    this.select.registerOnChange((value: any) => {
      this.updateOptionLabel();
      this._onChange(value);
    });
    this.select.registerOnTouched(this._onTouched);
    this.viewModel.subscribe((value: any) => {
      if (this.field.searchByValueKeyHandler) {
        if (value === undefined || value === null) {
          this.updateOptionLabel();
          return;
        }
        this.field.searchByValueKeyHandler(value).subscribe((val: any) => {
          if (this.field.searchHandler) {
            const oldValue = this.optionValues;
            this.optionValues = [val];
            this.select.ngOnChanges({ items: new SimpleChange(oldValue, this.optionValues, !this.optionValues)});
          }
          this.select.writeValue(value);
          this.updateOptionLabel();
        });
        return;
      }
      this.select.writeValue(value);
      this.updateOptionLabel();
    })
  }

  writeValue(obj: any): void {
    // the form makes writeValue's call before the select attribute is initialized
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

  get formattedValue() {
    return this.optionLabel;
  }

  private updateOptionLabel() {
    setTimeout(() => {
      this.optionLabel = this.select.selectedItems.map(item => item.label).join(this.field.separator) || '-';
    }, 0);
  }

  private getTypeaheadWithDistinctAndDebounce() {
    let searchHandler = this.typeahead.asObservable();
    if (searchHandler.distinctUntilChanged instanceof Function && searchHandler.distinctUntilChanged instanceof Function) {
      // These two operators only work if the main application has the 'import "rxjs/Rx" ;
      searchHandler = searchHandler
        .distinctUntilChanged()
        .debounceTime(200);
    } else {
      console.warn('You need to add \'import "rxjs/Rx";\' on your main.ts to use distinctUntilChanged and debounceTime operators');
    }
    return searchHandler;
  }

  /**
   * Prepare addTag to be passed to ng-select. If addTag is a callback that returns an observable, transform it in a Promise
   *
   * Note: ng-select only suport calbacks that return Promise. This method add support for callbacks that returns observables.
   */
  private prepareAddTag() {
    let addNewOption = this.field.addNewOption;
    if (addNewOption instanceof Function ) {
      this.parsedAddNewOption = (term: string) => {
        let newItem = {}
        newItem[this.field.optionLabelKey] = term;
        let partialResult = (<AddNewOptionObservableFn>addNewOption)(newItem);
        if (partialResult && partialResult instanceof Observable) {
          return partialResult.toPromise();
        } else {
          return partialResult;
        }
      };
    } else {
      this.parsedAddNewOption = addNewOption;
    }
  }

  private config() {
    if (this.field.addNewOption) {
      this.prepareAddTag();
    }

    if (this.field.searchHandler) {
      this.typeahead = new EventEmitter<string>();
      this.field.searchable = true;

      this.getTypeaheadWithDistinctAndDebounce()
        .switchMap((term: string) => this.field.searchHandler(term))
        .subscribe((items: string[]) => {
          this.optionValues = items;
        }, (err: any) => {
          console.error(err);
          this.optionValues = [];
        });
    }
    let options = this.field.options;

    if (options instanceof Observable) {
      (<Observable<any[]>>options).subscribe(ret => {
        this.optionValues = ret;
        this.updateOptionLabel();
      });
    } else {
      this.optionValues = options;
    }
  }
}
