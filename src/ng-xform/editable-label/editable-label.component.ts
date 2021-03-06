import { Component } from '@angular/core';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { TextField } from '../fields';


/**
 * Component to generate a bootstrap form field of general type
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-editable-label',
  templateUrl: './editable-label.component.html',
})
export class EditableLabelComponent extends BaseDynamicFieldComponent<TextField> {}
