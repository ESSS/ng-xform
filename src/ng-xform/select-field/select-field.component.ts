import { AfterViewInit, Component, EventEmitter, OnInit, SimpleChange, ViewChild, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BehaviorSubject, Observable, isObservable, from } from 'rxjs';
import { distinctUntilChanged, switchMap, debounceTime, tap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

import { AddNewOptionObservableFn, SelectField } from '../fields';
import { BaseDynamicFieldComponent } from './../field-components/base-dynamic-field.component';


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
export class SelectFieldComponent extends BaseDynamicFieldComponent<SelectField> implements ControlValueAccessor, OnInit, AfterViewInit
, OnDestroy {

  @ViewChild(NgSelectComponent) select: NgSelectComponent;
  viewModel = new BehaviorSubject<any>(null);

  subs = new Subscription();

  optionValues: any[] = [];
  optionLabel = '-';
  typeahead: EventEmitter<string>;
  parsedAddNewOption: boolean | ((term: string) => any | Promise<any>);
  searchHandlersValue: any;


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
    this.subs.add(
      this.viewModel.pipe(
        switchMap((value: any) => {
          this.searchHandlersValue = value;
          if (this.field.searchByValueKeyHandler) {
            if (this.field.searchHandler && this.searchHandlersValue != null) {
              return this.field.searchByValueKeyHandler(this.searchHandlersValue);
            }
            return of(null);
          } else {
            return of(null);
          }
        }),
        tap((val: any) => {
          if (val) {
            const oldValue = this.optionValues;
            this.optionValues = [val];
            this.select.ngOnChanges({ items: new SimpleChange(oldValue, this.optionValues, !this.optionValues)});
          }
          if (this.searchHandlersValue == null) {
            this.updateOptionLabel();
          } else {
            this.select.writeValue(this.searchHandlersValue);
            this.updateOptionLabel();
          }
        })
      ).subscribe()
    );
  }

    ngOnDestroy(): void {
      this.subs.unsubscribe();
    }

  writeValue(obj: any): void {
    // the form makes writeValue's call before the select attribute is initialized
    this.viewModel.next(obj);
  }

  forceSearch() {
    if (this.field.searchOnFocus && !this.optionValues && this.field.searchHandler) {
      this.typeahead.emit('');
    }
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
    let searchHandler = from(this.typeahead);
    searchHandler = searchHandler.pipe(distinctUntilChanged(), debounceTime(200));
    return searchHandler;
  }

  /**
   * Prepare addTag to be passed to ng-select. If addTag is a callback that returns an observable, transform it in a Promise
   *
   * Note: ng-select only suport calbacks that return Promise. This method add support for callbacks that returns observables.
   */
  private prepareAddTag() {
    const addNewOption = this.field.addNewOption;
    if (addNewOption instanceof Function ) {
      this.parsedAddNewOption = (term: string) => {
        const newItem = {}
        newItem[this.field.optionLabelKey] = term;
        const partialResult = (<AddNewOptionObservableFn>addNewOption)(newItem);
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

      this.subs.add(
        this.getTypeaheadWithDistinctAndDebounce()
          .pipe(switchMap((term: string) => this.field.searchHandler(term)))
          .subscribe(
            (items: string[]) => this.optionValues = items,
            (err: any) => this.optionValues = []
          )
      );
    }
    const options = this.field.options;

    if (isObservable(options)) {
      this.subs.add(
        (<Observable<any[]>>options).subscribe(ret => {
          this.optionValues = ret;
          this.updateOptionLabel();
        })
      );
    } else {
      this.optionValues = options;
    }
  }
}
