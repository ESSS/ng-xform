import { Observable } from 'rxjs/Observable';
import { Component, Input } from '@angular/core';

import { BaseDynamicFieldComponent } from '../../ng-xform/field-components/base-dynamic-field.component';
import { DynamicField } from '../..';



/**
 * Component to generate a Bootstrap form field and set up the component layout according to the form configuration.
 */
@Component({
  selector: 'ng-xform-form-control-layout',
  templateUrl: './form-control-layout.component.html',
  styleUrls: [
    'form-control-layout.component.css'
  ]
})
export class FormControlLayoutComponent {
  @Input() fieldComponent: BaseDynamicFieldComponent<DynamicField>;

  get labelStyleClass(): string {
    if (!this.fieldComponent.isHorizontal) {
      return '';
    }
    return `col-sm-${this.fieldComponent.labelWidth} control-label`;
  }

  get fieldStyleClassCheckbox(): string {
    if (!this.fieldComponent.isHorizontal) {
      return '';
    }
    if (this.fieldComponent.isHorizontal && this.fieldComponent.hideLabelOnEdit) {
      return `${this.fieldStyleClass} col-sm-offset-${this.fieldComponent.labelWidth}`;
    }
    return this.fieldStyleClass;
  }

  get fieldStyleClass(): string {
    if (!this.fieldComponent.isHorizontal) {
      return '';
    }
    return `col-sm-${12 - this.fieldComponent.labelWidth}`;
  }
}
