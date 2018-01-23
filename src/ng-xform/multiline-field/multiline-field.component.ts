import { Component } from '@angular/core';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { MultilineField } from '../fields/multiline-field';

/**
 * Component to generate a dynamic form component for multi-line text fields
 */
@Component({
  selector: 'ng-xform-multiline-field',
  templateUrl: './multiline-field.component.html',
})
export class MultilineFieldComponent extends BaseDynamicFieldComponent<MultilineField> {}
