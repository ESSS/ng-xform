import { NgXformGroup } from './ng-xform-group';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

import { DynamicField } from './fields/dynamic-field';
import { NestedFormGroup } from './fields/nested-form-group';

/**
 * This component builds a form with input components from fields list.
 * If any instance is defined in the model, yours attribute values will be applied to the corresponding field.
 * This component can display an error code if that is defined.
 *
 * :fields: List of configurations to build fields.
 * :model: Model instance to edit [optional].
 * :errorCode: This can display an error if is defined.
 * :editing: Flag to control components state
 */
@Component({
  selector: 'ng-xform',
  templateUrl: './ng-xform.component.html',
  styles: []
})
export class NgXformComponent implements OnInit, OnChanges {
  @Input() fields: DynamicField[];
  @Input() editing: boolean;
  @Input() horizontalForm = false;
  @Input() labelWidth: number;
  @Output() editingChange = new EventEmitter();

  /** To listening submitSuccessful event */
  @Output() onSubmit = new EventEmitter();

  /** To listening submitSuccessful event */
  @Output() onCancel = new EventEmitter();

  model: any;
  form: FormGroup;

  ngOnInit() {
    this.createForm();
    this.reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.createForm();
    }
  }

  createForm() {
    this.form = this.createFormGroup(this.fields);
  }

  createFormGroup(fields: DynamicField[]): FormGroup {
    const group: any = {};

    fields.forEach(field => {
      if (field instanceof NestedFormGroup) {
        group[field.key] = this.createFormGroup(field.fields);
      } else {
        group[field.key] = field.validators
          ? new FormControl(undefined, field.validators)
          : new FormControl();
      }
    });

    return new NgXformGroup(group);
  }

  unpatchValue(form: FormGroup, model: any) {
    const modelToSend = { ...model };
    for (const attr in form.controls) {
      if (form.controls[attr] instanceof FormGroup) {
        const modelAttr = model ? model[attr] : null;
        modelToSend[attr] = this.unpatchValue(<FormGroup>form.controls[attr], modelAttr);
      } else {
        modelToSend[attr] = form.controls[attr].value;
      }
    }
    return modelToSend;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  submit() {
    this.validateAllFormFields(this.form);
    if (this.form.invalid) {
      return;
    }

    // copy object
    const modelToSend = this.unpatchValue(this.form, this.model);
    this.onSubmit.emit(modelToSend);
  }

  /** It is called by cancel button */
  cancel() {
    this.setEditing(false);
    this.reset();
    this.onCancel.emit();
  }

  reset() {
    this.form.reset();
    if (this.model) {
      this.form.patchValue(this.model, { onlySelf: true });
    }
  }

  clear() {
    this.form.reset();
    this.model = undefined;
  }

  setEditing(state: boolean) {
    if (this.editing === undefined) {
      return;
    }
    this.editingChange.emit(state);
  }

  /**
   * Initialize the form with the values in @param value object
   * @param value object with values to be set to the form
   *
   * Note: Calling setValue(null) will not clear the form. Use clear() instead.
   */
  setValue(value: any) {
    this.model = value;
    this.form.patchValue(value);
  }
}
