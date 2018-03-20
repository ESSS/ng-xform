import { Component, AfterContentInit } from '@angular/core';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { CheckboxField } from '../fields';


/**
 * Component to generate a form checkbox field
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-checkbox-field',
  templateUrl: './checkbox-field.component.html',
})
export class CheckboxFieldComponent extends BaseDynamicFieldComponent<CheckboxField> implements AfterContentInit {

  ngAfterContentInit() {
    if (this.control.value === null) {
      this.control.setValue(false);
    }
  }

}
