import { Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicField } from '../fields';

/**
 * Base class for Dynamic for Fields
 */
export class BaseDynamicFieldComponent<T extends DynamicField> implements OnInit {
  @Input() field: T;
  @Input() form: FormGroup;
  @Input() editing = true;

  control: FormControl;

  ngOnInit() {
    this.control = <FormControl>this.form.controls[this.field.key];
  }

  /**
   * Property to be used as the Form Element ID
   */
  get elementId(): string {
    return this.field.key;
  }

  get isOptional(): boolean {
    return !this.field.validators || !this.field.validators.find(el => el === Validators.required);
  }

  get isEditing(): boolean {
    return this.editing && !this.field.readOnly;
  }

  displayFieldCss() {
    return {
      'has-error': this.control.touched && this.control.invalid,
      'has-feedback': this.control.touched && this.control.invalid
    };
  }

}
