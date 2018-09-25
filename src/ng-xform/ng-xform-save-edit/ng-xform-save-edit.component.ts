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
 * This component builds a form that switches from editable/non-editable mode.
 *
 * :editing: Flag to control components state
 */
@Component({
  selector: 'ng-xform-save-edit',
  templateUrl: './ng-xform-save-edit.component.html',
  styles: []
})
export class NgXformSaveEditComponent {

  @Input() fields: DynamicField[];
  @Input() editing = false;
  @Input() horizontalForm = false;
  @Input() labelWidth: number;
  @Output() editingChange = new EventEmitter();
  /** To listening submitSuccessful event */
  @Output() submit = new EventEmitter();
  /** To listening submitSuccessful event */
  @Output() cancel = new EventEmitter();

  @ViewChild(NgXformComponent) xform: NgXformComponent;

  private currentModel: any;

  setEditing(editing: boolean) {
    if (editing) {
      this.currentModel = this.xform.getModel();
    }
    this.editing = editing;
  }

  onSubmit() {
    if (this.xform.form.invalid) {
      return;
    }
    this.submit.emit(this.xform.getModel());
  }

  onCancel() {
    this.cancel.emit();
    this.xform.setValue(this.currentModel);
    this.editing = false;
  }

  setValue(newModel: any) {
    this.xform.setValue(newModel);
  }
}
