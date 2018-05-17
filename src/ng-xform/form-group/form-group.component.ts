
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { DynamicField } from '../fields/dynamic-field';

/**
 * This component builds a form with input components from fields list.
 *
 * :fields: List of configurations to build fields.
 * :editing: Flag to control components state
 */
@Component({
  selector: 'ng-xform-form-group',
  templateUrl: './form-group.component.html',
  styles: []
})
export class FormGroupComponent {
  @Input() fields: DynamicField<any>[];
  @Input() form: FormGroup;
  @Input() editing: boolean;
  @Input() isHorizontal: boolean;
  @Input() labelWidth: number;
}
