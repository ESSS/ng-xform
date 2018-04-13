import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Component, Input } from '@angular/core';



/**
 * Component to generate a bootstrap form field of numeric type
 *
 * :isEditing: Flag to control component state
 * :isCheckbox: Flag to inform if it is a layout for a checkbox
 * :isHorizontal: Flag to inform if it is a horizontal layout
 * :isOptionl: Flag to append '(optional)' on the label
 * :labelWidth: Number of columns of the bootstrap system grids to apply on the label element
 * :label: Label of the field
 * :formattedValue: Value to display when the field been on reading state
 * :styleClasses: css classes to apply on the html element
 */
@Component({
  selector: 'ng-xform-form-layout',
  templateUrl: './form-layout.component.html',
  styleUrls: [
    'orm-layout.component.css'
  ]
})
export class FormLayoutComponent {
  @Input() isHorizontal = false;
  @Input() isEditing = false;
  @Input() isCheckbox = false;
  @Input() isOptional: string;
  @Input() elementId: string;
  @Input() labelWidth = 2;
  @Input() label: string;
  @Input() formattedValue: string;
  @Input() control: FormControl;
  @Input() form: FormGroup;
  @Input() styleClasses: string;

  get labelCssClass(): string {
    if (!this.isHorizontal) {
      return '';
    }
    return `col-sm-${this.labelWidth} control-label`;
  }

  get fieldCssClassCheckbox(): string {
    if (!this.isHorizontal) {
      return '';
    }
    if (this.isHorizontal && this.isCheckbox) {
      return `${this.fieldCssClass} col-sm-offset-${this.labelWidth}`;
    }
    return this.fieldCssClass;
  }

  get fieldCssClass(): string {
    if (!this.isHorizontal) {
      return '';
    }
    return `col-sm-${12 - this.labelWidth}`;
  }
}
