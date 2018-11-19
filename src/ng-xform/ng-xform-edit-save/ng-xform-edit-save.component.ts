import { NgXformComponent } from '../ng-xform.component';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

import { DynamicField } from '../fields/dynamic-field';

/**
 * This component builds a ng-xform with a button bar. The button bar shows an Edit button
 * when `form.editing == false` and Save/Cancel buttons when `form.editing == true`. Save
 * buttons trigger `onSubmit` event.
 *
 */
@Component({
  selector: 'ng-xform-edit-save',
  templateUrl: './ng-xform-edit-save.component.html',
  styles: []
})
export class NgXformEditSaveComponent {

  @Input() fields: DynamicField[];
  @Input() editing = false;
  @Input() horizontalForm = false;
  @Input() labelWidth: number;
  @Output() editingChange = new EventEmitter();
  /** To listening submitSuccessful event */
  @Output() submit = new EventEmitter();
  /** To listening submitSuccessful event */
  @Output() cancel = new EventEmitter();

  @ViewChild('xform') xform: NgXformComponent;

  protected beforeEditingValue = {};

  setEditing(editing: boolean) {
    this.editing = editing;
    if (editing) {
      this.beforeEditingValue = this.xform.getModel();
      this.xform.setValue({... this.beforeEditingValue});
    }
  }

  onSubmit() {
    if (this.xform.isFormValid()) {
      this.submit.emit(this.xform.getModel());
      this.editing = false;
    }
  }

  onCancel() {
    this.cancel.emit();
    this.xform.setValue(this.beforeEditingValue);
    this.editing = false;
  }

  setValue(newModel: any) {
    this.xform.setValue(newModel);
    this.beforeEditingValue = this.xform.getModel();
  }
}
