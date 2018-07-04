import { Observable } from 'rxjs/Observable';

import { DynamicField } from './dynamic-field';

export type AddNewOptionObservableFn = ((model: any) => any | Observable<any> | Promise<any>);

export class SelectField<T = any> extends DynamicField<T> {
  public controlType ? = 'SELECT';
  public options?: any[] | Observable<any[]>;
  public multiple?: boolean;
  public noFilterUntil?: number;
  public optionValueKey?: string;
  public optionLabelKey?: string;
  public searchHandler?: (value: string) => Observable<any[]>;
  public searchByValueKeyHandler?: (value: string) => Observable<any>;
  public searchable?: boolean;
  public markFirst?: boolean;
  public separator?: string;
  public addNewOption?: boolean | AddNewOptionObservableFn ;
  public addNeOptionText?: string;

  constructor(options: SelectField<T>) {
    super(options);
    this.options = options.options;
    this.multiple = options.multiple || false;
    this.noFilterUntil = options.noFilterUntil || 2;
    this.optionValueKey = options.optionValueKey;
    this.optionLabelKey = options.optionLabelKey;
    this.searchable = options.searchable === true;
    this.searchHandler = options.searchHandler;
    this.searchByValueKeyHandler = options.searchByValueKeyHandler;
    this.markFirst = options.markFirst === true;
    this.separator = options.separator || ', ';
    this.addNewOption = options.addNewOption;
    this.addNeOptionText = options.addNeOptionText;
  }
}
