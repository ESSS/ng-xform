import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

import { DynamicField } from './fields/dynamic-field';

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
  @Input() model: any;
  @Input() errorCode: string;
  @Input() editing: boolean;

  /** To listening submitSuccessful event */
  @Output() onSubmit = new EventEmitter();

  /** To listening submitSuccessful event */
  @Output() onCancel = new EventEmitter();

  form: FormGroup;

  ngOnInit() {
    this.createForm();
    this.reset();
  }

  ngOnChanges() {
    if (!this.form) {
      return;
    }
    this.reset();
  }

  createForm() {
    let group: any = {};

    this.fields.forEach(field => {
      group[field.key] = field.validators
        ? new FormControl('', field.validators)
        : new FormControl('');
    });

    this.form = new FormGroup(group);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.errorCode = undefined;

    // copy object
    let modelToSend = { ...this.model };

    for (const attr in this.form.value) {
      if (this.form.value.hasOwnProperty(attr)) {
        const value = this.form.value[attr];
        modelToSend[attr] = value === '' ? null : value;
      }
    }
    this.onSubmit.emit(modelToSend);
  }

  /** It is called by cancel button */
  cancel() {
    this.setEditing(false);
    this.reset();
    this.onCancel.emit();
  }

  // TODO: add a ´clear´ method to clear the state of the form

  reset() {
    if (this.model) {
      this.form.patchValue(this.model);
    }

    this.errorCode = undefined;
  }

  clear() {
    this.form.reset();
  }

  setEditing(state: boolean) {
    if (this.editing === undefined) {
      return;
    }
    this.editing = state;
  }
}
