import { Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicField } from '../fields';
import { Subscription } from 'rxjs/Rx';

/**
 * Base class for Dynamic for Fields
 */
export class BaseDynamicFieldComponent<T extends DynamicField> implements OnInit, OnDestroy {

  @Input() field: T;
  @Input() form: FormGroup;
  @Input() editing = true;

  control: FormControl;
  visible = true;

  private valueChangeSubscription: Subscription;

  ngOnInit() {
    this.control = <FormControl>this.form.controls[this.field.key];
    // console.log('control', this.control, this.field,  this.form.controls);
    if (this.field.visibilityFn) {
      this.valueChangeSubscription = this.form.valueChanges.subscribe(val => {
        this.visible = this.field.visibilityFn(val);
        if (!this.visible) {
          this.control.setValue(null, { emitEvent: false });
        }
      });
      this.visible = this.field.visibilityFn(this.form.value);
    }

  }

  ngOnDestroy() {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
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
