import { Component } from '@angular/core';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { CustomField } from '../fields';


/**
 * Component to generate a form custom field
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-custom-field',
  templateUrl: './custom-field.component.html',
})
export class CustomFieldComponent extends BaseDynamicFieldComponent<CustomField> {
  hideLabelOnEdit = false;
  useFormattedValueOnReadonly = false;
}
