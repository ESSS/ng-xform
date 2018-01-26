import { Observable } from 'rxjs/Observable';
import { DynamicField } from './dynamic-field';

export class AutocompleteField extends DynamicField {
  public controlType ? = 'AUTOCOMPLETE';
  public source?: string | any[] | Observable<any[]> | ((keyword: string) => Observable<any[]>);
  public valueFormatter?: string;
  public listFormatter?: string;
  public valueAttribute?: string;
  public zIndex?: Number;

  constructor(options: AutocompleteField = {}) {
    super(options);
    this.source = options.source;
    this.valueFormatter = options.valueFormatter;
    this.listFormatter = options.listFormatter;
    this.valueAttribute = options.valueAttribute;
    this.zIndex = options.zIndex || 100;
  }
}
