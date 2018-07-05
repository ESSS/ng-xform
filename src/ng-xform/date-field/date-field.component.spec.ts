import {
  ComponentFixture,
  TestBed,
  fakeAsync,
} from '@angular/core/testing';

import { DateField } from '../fields';
import { NgXformModule } from '../ng-xform.module';
import { DateFieldComponent } from './date-field.component';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgXformGroup } from '../ng-xform-group';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { tickAndDetectChanges } from '../../testing/helpers';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormControlLayoutComponent } from '../form-control-layout/form-control-layout.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { OptionalTagComponent } from '../field-components/optional-tag.component';
import { ErrorMessagePipe } from '../field-error-message/error-message.pipe';


describe('DateFieldComponent', () => {
  it('should create DateField', () => {
    const fixture = createTestingModule(`
      <ng-xform-date-field [field]="field" [form]="form">
      </ng-xform-date-field>
    `);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should patch value to DateField', fakeAsync(() => {
    const fixture = createTestingModule(`
      <form [formGroup]="form">
        <ng-xform-date-field [field]="field" 
          [formControlName]="field.key"
          [form]="form"
          [(ngModel)]="dateValue">
        </ng-xform-date-field>
      </form>
    `);
    tickAndDetectChanges(fixture);
    const dateField: DateFieldTestComponent = fixture.componentInstance;

    expect(dateField.dateValue).toBe(undefined);
    expect(dateField.dateField.componentControl.value).toBe(undefined);

    const changeTo = new Date(2018, 1, 28, 0, 0, 0);
    dateField.form.patchValue({date: changeTo});
    tickAndDetectChanges(fixture);

    expect(dateField.dateValue).toBe(changeTo);
    expect(dateField.dateField.componentControl.value.toISOString()).toBe(changeTo.toISOString());

  }));

  it('should be set to null when form resets ', fakeAsync(() => {
    const fixture = createTestingModule(`
      <form [formGroup]="form">
        <ng-xform-date-field [field]="field" 
          [formControlName]="field.key"
          [form]="form"
          [(ngModel)]="dateValue">
        </ng-xform-date-field>
      </form>
    `);
    tickAndDetectChanges(fixture);
    const dateField: DateFieldTestComponent = fixture.componentInstance;

    const changeTo = new Date(2018, 1, 28, 0, 0, 0);
    
    dateField.form.patchValue({date: changeTo});
    tickAndDetectChanges(fixture);

    expect(dateField.dateValue).toBe(changeTo);
    expect(dateField.dateField.componentControl.value.toISOString()).toBe(changeTo.toISOString());

    dateField.form.reset();
    tickAndDetectChanges(fixture);

    expect(dateField.dateValue).toBe(null);
    expect(dateField.dateField.componentControl.value).toBe(null);

  }));

});

function createTestingModule( template: string): ComponentFixture<any> {
  TestBed.configureTestingModule({
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      BsDatepickerModule.forRoot(),
    ],
    declarations: [
      DateFieldTestComponent,
      DateFieldComponent,
      FormControlLayoutComponent,
      FieldErrorMessageComponent,
      OptionalTagComponent,
      ErrorMessagePipe,
    ]
  }).overrideComponent(DateFieldTestComponent, {
    set: {
        template: template
    }
  }).compileComponents();

  const fixture = TestBed.createComponent(DateFieldTestComponent);
  fixture.detectChanges();

  return fixture;
}


@Component({
  template: ``,
})
class DateFieldTestComponent {
  @ViewChild(DateFieldComponent) dateField: DateFieldComponent;

  field = new DateField({
    key: 'date',
    label: 'Date',
  });

  form = new NgXformGroup({date: new FormControl()});

  dateValue: Date;
}
