import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { OptionalTagComponent } from '../field-components/optional-tag.component';
import { ErrorMessagePipe } from '../field-error-message/error-message.pipe';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { DynamicField } from '../fields';
import { FormControlLayoutComponent } from '../form-control-layout/form-control-layout.component';
import { NgXformGroup } from '../ng-xform-group';
import { EditableLabelComponent } from './editable-label.component';
import { TextField } from '../../../tmp';
import { By } from '@angular/platform-browser';

describe('EditableFieldComponent', () => {
  it('should execute onChangeFn', () => {
    const fixture = createTestingModule(`
      <ng-xform-editable-label [field]="field" [form]="form">
      </ng-xform-editable-label>
    `);

    const component: EditableLabelTestComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
    fixture.detectChanges();
    const text = fixture.debugElement.query(By.css('input'));
    text.nativeElement.value = 'good boi';
    text.nativeElement.dispatchEvent(new Event('input'));
    expect(component.form.value.text).toEqual('good boi');
    expect(component.called).toEqual(1999);
  });
});

function createTestingModule( template: string, field?: DynamicField): ComponentFixture<any> {
  TestBed.configureTestingModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      BsDatepickerModule.forRoot(),
    ],
    declarations: [
      EditableLabelTestComponent,
      EditableLabelComponent,
      FormControlLayoutComponent,
      FieldErrorMessageComponent,
      OptionalTagComponent,
      ErrorMessagePipe,
    ]
  }).overrideComponent(EditableLabelTestComponent, {
    set: {
        template: template
    }
  }).compileComponents();

  const fixture = TestBed.createComponent(EditableLabelTestComponent);
  if (field) {
    fixture.componentInstance.field = field;
  }
  fixture.detectChanges();

  return fixture;
}


@Component({
  template: ``,
})
class EditableLabelTestComponent {
  @ViewChild(EditableLabelComponent) textField: EditableLabelComponent;
  called = 0;
  field: DynamicField = new TextField({
    key: 'text',
    label: 'Text',
    onChangeFn: (value: any) => {
      this.called = 1999;
    }
  });

  form = new NgXformGroup({text: new FormControl()});

}
