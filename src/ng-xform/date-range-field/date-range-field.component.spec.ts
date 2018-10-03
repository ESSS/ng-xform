import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { tickAndDetectChanges } from '../../testing/helpers';
import { OptionalTagComponent } from '../field-components/optional-tag.component';
import { ErrorMessagePipe } from '../field-error-message/error-message.pipe';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { DateRangeField } from '../fields';
import { FormControlLayoutComponent } from '../form-control-layout/form-control-layout.component';
import { NgXformGroup } from '../ng-xform-group';
import { DateRangeFieldComponent } from './date-range-field.component';


describe('DateRangeFieldComponent', () => {
  it('should create DateRangeField', () => {
    const fixture = createTestingModule(`
      <ng-xform-date-range-field [field]="field" [form]="form">
      </ng-xform-date-range-field>
    `);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should patch value to DateRangeField', fakeAsync(() => {
    const fixture = createTestingModule(`
      <form [formGroup]="form">
        <ng-xform-date-range-field [field]="field"
          [formControlName]="field.key"
          [form]="form"
          [(ngModel)]="dateValue">
        </ng-xform-date-range-field>
      </form>
    `);
    tickAndDetectChanges(fixture);
    const dateRangeField: DateRangeFieldTestComponent = fixture.componentInstance;

    expect(dateRangeField.dateValue).toBe(undefined);
    expect(dateRangeField.dateRangeField.componentControl.value).toBe(undefined);

    const changeTo = [new Date(2018, 1, 28, 0, 0, 0), new Date(2018, 1, 28, 0, 0, 0)];
    dateRangeField.form.patchValue({date: changeTo});
    tickAndDetectChanges(fixture);

    expect(dateRangeField.dateRangeField.componentControl.value[0].toISOString()).toBe(changeTo[0].toISOString());
    expect(dateRangeField.dateRangeField.componentControl.value[1].toISOString()).toBe(changeTo[1].toISOString());

  }));

  it('should be set to null when form resets ', fakeAsync(() => {
    const fixture = createTestingModule(`
      <form [formGroup]="form">
        <ng-xform-date-range-field [field]="field"
          [formControlName]="field.key"
          [form]="form"
          [(ngModel)]="dateValue">
        </ng-xform-date-range-field>
      </form>
    `);
    tickAndDetectChanges(fixture);
    const dateRangeField: DateRangeFieldTestComponent = fixture.componentInstance;

    const changeTo = [new Date(2018, 1, 28, 0, 0, 0), new Date(2018, 1, 28, 0, 0, 0)];

    dateRangeField.form.patchValue({date: changeTo});
    tickAndDetectChanges(fixture);

    expect(dateRangeField.dateRangeField.componentControl.value[0].toISOString()).toBe(changeTo[0].toISOString());
    expect(dateRangeField.dateRangeField.componentControl.value[1].toISOString()).toBe(changeTo[1].toISOString());
    expect(dateRangeField.dateRangeField.formattedValue).toBe('Feb 28, 2018 - Feb 28, 2018');

    dateRangeField.form.reset();
    tickAndDetectChanges(fixture);

    expect(dateRangeField.dateValue).toBe(null);
    expect(dateRangeField.dateRangeField.componentControl.value).toBe(null);
    expect(dateRangeField.dateRangeField.formattedValue).toBe('-');
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
      DateRangeFieldTestComponent,
      DateRangeFieldComponent,
      FormControlLayoutComponent,
      FieldErrorMessageComponent,
      OptionalTagComponent,
      ErrorMessagePipe,
    ]
  }).overrideComponent(DateRangeFieldTestComponent, {
    set: {
        template: template
    }
  }).compileComponents();

  const fixture = TestBed.createComponent(DateRangeFieldTestComponent);
  fixture.detectChanges();

  return fixture;
}


@Component({
  template: ``,
})
class DateRangeFieldTestComponent {
  @ViewChild(DateRangeFieldComponent) dateRangeField: DateRangeFieldComponent;

  field = new DateRangeField({
    key: 'date',
    label: 'Date',
  });

  form = new NgXformGroup({date: new FormControl()});

  dateValue: Date;
}
