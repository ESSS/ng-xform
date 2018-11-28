import { AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as math from 'mathjs';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { NumberField } from '../fields';


/**
 * Component to generate a bootstrap form field of general type number
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-number-field',
  templateUrl: './number-field.component.html',
})
export class NumberFieldComponent extends BaseDynamicFieldComponent<NumberField> { }
