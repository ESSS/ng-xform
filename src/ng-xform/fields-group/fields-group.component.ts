
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { DynamicField } from '../fields/dynamic-field';
import { FieldGroup } from '../fields/field-group';

/**
 * This component builds a form with input components from fields list.
 *
 * :fields: List of configurations to build fields.
 * :editing: Flag to control components state
 */
@Component({
  selector: 'ng-xform-fields-group',
  templateUrl: './fields-group.component.html',
  styles: []
})
export class FieldsGroupComponent {
  @Input() fields: DynamicField[];
  @Input() form: FormGroup;
  @Input() editing: boolean;
}
