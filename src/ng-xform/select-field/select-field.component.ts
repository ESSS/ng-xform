import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { OptionValue } from '../../types';
import { SelectField } from '../fields';
import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';


type OptionsObservable = Observable<OptionValue[]>;

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

  optionValues: OptionValue[];

  ngOnInit() {
    super.ngOnInit();
    let field = <SelectField>this.field;
    let options = field.options;

    if (options instanceof Observable) {
      (<OptionsObservable>options).subscribe(ret => this.optionValues = ret);
    } else if (typeof options[0] === 'string') {
      // options is a list of string. Convert a list of strings in a list of OptionValues.
      this.optionValues = (<string[]>options).map((item, i) => <OptionValue>[i, item]);
    } else {
      this.optionValues = <OptionValue[]>options;
    }
  }

  getOptionLabel(): string {
    if (this.optionValues) {
      let value = this.control.value;
      let selectedOption = this.optionValues.find(optionValue => optionValue[0] === value);
      if (selectedOption) {
        return selectedOption[1];
      }
    }
    return '<undefined>';
  }
}
