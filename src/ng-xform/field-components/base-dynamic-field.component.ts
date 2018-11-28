import { Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicField } from '../fields';
import { Subscription, Observable } from 'rxjs';

/**
 * Base class for Dynamic Fields
 */
export class BaseDynamicFieldComponent<T extends DynamicField> implements OnInit, OnDestroy {

  @Input() field: T;
  @Input() form: FormGroup;
  @Input() editing = true;
  @Input() isHorizontal: boolean;
  @Input() labelWidth: number;

  control: FormControl;
  visible = true;
  public hideLabelOnEdit = false;

  /** If true, the read-only state will show the value obtained from the formattedValue method;
   * otherwise, will keep the component to manage this behavior.
   */
  public useFormattedValueOnReadonly = true;

  private valueChangeSubscription: Subscription;

  ngOnInit() {
    this.control = this.form.controls[this.elementId] as FormControl;
    if (this.field.visibilityFn) {
      const formRoot = this.form.root; // Make sure to get the root form, even for nested FromGroups
      this.valueChangeSubscription = formRoot.valueChanges.subscribe(val => {
        this.visible = this.field.visibilityFn(val);
        if (!this.visible && !this.field.keepValueWhenHiding) {
          this.control.setValue(null, { emitEvent: false });
        }
      });
      this.visible = this.field.visibilityFn(formRoot.value);
    }

    if (this.field.onChangeFn) {
      this.control.valueChanges.subscribe(val => {
        this.field.onChangeFn(val);
      });
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
    return String(this.field.key);
  }

  get instance(): BaseDynamicFieldComponent<T> {
    return this;
  }

  get isOptional(): boolean {
    return !this.field.validators || !this.field.validators.find(el => el === Validators.required);
  }

  get isEditing(): boolean {
    return this.editing && !this.field.readOnly;
  }

  get formattedValue(): string {
    return this.form.controls[this.elementId].value || '-';
  }

  displayFieldCss(): { [k: string]: boolean } {
    return {
      'has-error': this.control.touched && this.control.invalid,
      'has-feedback': this.control.touched && this.control.invalid
    };
  }

  onChangeFnObservable(): Observable<any> {

    return ;
  }

}
