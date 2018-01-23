import { Component } from '@angular/core';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { MeasureField } from '../fields';


/**
 * Component to generate a bootstrap form field of numeric type
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-measure-field',
  templateUrl: './measure-field.component.html',
})
export class MeasureFieldComponent extends BaseDynamicFieldComponent<MeasureField> {}
