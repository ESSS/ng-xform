import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { tickAndDetectChanges } from '../../testing/helpers';
import { OptionalTagComponent } from '../field-components/optional-tag.component';
import { ErrorMessagePipe } from '../field-error-message/error-message.pipe';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { DateField, DynamicField } from '../fields';
import { FormControlLayoutComponent } from '../form-control-layout/form-control-layout.component';
import { NgXformGroup } from '../ng-xform-group';
import { DateFieldComponent } from './date-field.component';
import { By } from '@angular/platform-browser';


describe('DateFieldComponent', () => {
  it('should create DateField', () => {
    const fixture = createTestingModule(`
      <ng-xform-date-field [field]="field" [form]="form">
      </ng-xform-date-field>
    `);

    const component: DateFieldTestComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
    component.dateField.ngAfterContentInit();
    expect(component.dateField.config.showWeekNumbers).toBeFalsy();
  });

  it('should create DateField with week numbers', () => {
    const fieldConfig = new DateField({
      key: 'date',
      label: 'Date',
      showWeekNumbers: true
    });

    const fixture = createTestingModule(`
      <ng-xform-date-field [field]="field" [form]="form">
      </ng-xform-date-field>
    `, fieldConfig);

    const component: DateFieldTestComponent = fixture.componentInstance;
    expect(component).toBeTruthy();
    component.dateField.ngAfterContentInit();
    expect(component.dateField.config.showWeekNumbers).toBeTruthy();
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

  it('should not show datepicker on read mode ', fakeAsync(() => {
    const fixture = createTestingModule(`
      <form [formGroup]="form">
        <ng-xform-date-field [field]="field"
          [formControlName]="field.key"
          [form]="form"
          [(ngModel)]="dateValue">
        </ng-xform-date-field>
      </form>
    `);
    const dateField: DateFieldTestComponent = fixture.componentInstance;

    // Test editing false
    dateField.dateField.editing = false;
    tickAndDetectChanges(fixture);

    let date_picker = document.querySelector('bs-datepicker-container');
    expect(date_picker).toBeFalsy();
    
    let label = fixture.debugElement.query(By.css('label'));
    label.nativeElement.click();
    
    tickAndDetectChanges(fixture);

    date_picker = document.querySelector('bs-datepicker-container');
    expect(date_picker).toBeFalsy();

    // Test editing true
    dateField.dateField.editing = true;
    tickAndDetectChanges(fixture);

    date_picker = document.querySelector('bs-datepicker-container');
    expect(date_picker).toBeFalsy();
    
    label = fixture.debugElement.query(By.css('label'));
    label.nativeElement.click();
    
    tickAndDetectChanges(fixture);

    date_picker = document.querySelector('bs-datepicker-container');
    expect(date_picker).toBeTruthy();
  }));

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
  if (field) {
    fixture.componentInstance.field = field;
  }
  fixture.detectChanges();

  return fixture;
}


@Component({
  template: ``,
})
class DateFieldTestComponent {
  @ViewChild(DateFieldComponent) dateField: DateFieldComponent;

  field: DynamicField = new DateField({
    key: 'date',
    label: 'Date',
  });

  form = new NgXformGroup({date: new FormControl()});

  dateValue: Date;
}
