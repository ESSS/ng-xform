import { ViewChild, Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SelectField } from '../fields';
import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';


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
})
export class SelectFieldComponent extends BaseDynamicFieldComponent<SelectField> implements OnInit {

  @Input() errorMessage: string;

  optionValues: any[] = [];

  ngOnInit() {
    super.ngOnInit();
    let options = this.field.options;

    if (options instanceof Observable) {
      (<Observable<any[]>>options).subscribe(ret => this.optionValues = ret);
    } else {
      this.optionValues = options;
    }
  }

  getOptionLabel(): string {
    let value = this.control.value;
    if (!value) {
      return '-';
    }
    if (this.field.multiple) {
      if (this.field.valueAttribute) {
        return value
          .map((val: any) => this.optionValues
            .find((opt: any) => opt[this.field.valueAttribute] === val))
          .map((val: any) => {
            if (val === undefined) {
              return '-';
            }
            return val[this.field.labelAttribute];
          })
          .join(this.field.separator);
      }
      return value.join(this.field.separator);
    }
    return this.field.labelAttribute ? value[this.field.labelAttribute] : value;
  }
}
