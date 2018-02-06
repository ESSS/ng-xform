import { Observable } from 'rxjs/Observable';

import { SelectOption } from './select-option';
import { DynamicField } from './dynamic-field';

export class SelectField extends DynamicField {
  public controlType ? = 'SELECT';
  public options?: any[] | Observable<any[]>;
  public multiple?: boolean;
  public noFilterUntil?: number;
  public valueAttribute?: string;
  public labelAttribute?: string;
  public tagLabelAttribute?: string;
  public searchable?: boolean;
  public markFirst?: boolean;
  public separator?: string;

  constructor(options: SelectField = {}) {
    super(options);
    this.options = options.options;
    this.multiple = options.multiple || false;
    this.noFilterUntil = options.noFilterUntil || 0;
    this.valueAttribute = options.valueAttribute;
    this.labelAttribute = options.labelAttribute;
    this.tagLabelAttribute = options.tagLabelAttribute;
    this.searchable = options.searchable === true;
    this.markFirst = options.markFirst === true;
    this.separator = options.separator || ', ';
  }
}
