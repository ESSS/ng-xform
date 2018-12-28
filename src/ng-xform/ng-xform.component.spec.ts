import { MeasureFieldComponent } from './measure-field/measure-field.component';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';


import { DateField, MeasureField, TextField } from './fields';
import { CheckboxField } from './fields/checkbox-field';
import { MultilineField } from './fields/multiline-field';
import { NestedFormGroup } from './fields/nested-form-group';
import { NgXformComponent } from './ng-xform.component';
import { NgXformModule } from './ng-xform.module';

describe('NgXformComponent', () => {
  let component: NgXformComponent;
  let fixture: ComponentFixture<NgXformComponent>;
  let model: any;
  let dateTest: Date;
  let datePipe: DatePipe;
  let bsLocaleService: BsLocaleService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          NgXformModule
        ]
      }).compileComponents();
      bsLocaleService = TestBed.get(BsLocaleService);
      bsLocaleService.use('en');
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NgXformComponent);
    component = fixture.componentInstance;
    dateTest = new Date();
    datePipe = new DatePipe('en');
    model = {
      text1: 'value1',
      required: 'value2',
      comments: 'comments here...',
      address: {
        street: 'St wall',
        city: 'Ny',
        extra_field: 'Extra',
      },
      nested2: null,
      date: dateTest,
    };
    const colors: any[] = [
      { id: 1, name: 'blue' },
      { id: 2, name: 'yellow' },
      { id: 3, name: 'white' }
    ];

    component.fields = [
      new TextField({ key: 'text1', label: 'Text 1' }),
      new TextField({ key: 'required', label: 'Required 1', validators: [Validators.required] }),
      new MultilineField({ key: 'comments', label: 'Comments' }),
      new TextField({ key: 'other_color', label: 'Other Color', visibilityFn: (formVal: any) => formVal.color === 1 }),
      new NestedFormGroup({
        key: 'address', label: 'Address',
        fields: [
          new TextField({ key: 'street', label: 'Street' }),
          new TextField({ key: 'city', label: 'City' }),
        ]
      }),
      new NestedFormGroup({
        key: 'nested2',
        fields: [
          new TextField({ key: 'field1', label: 'Field1' }),
        ]
      }),
      new DateField({ key: 'date', label: 'Date' }),
      new CheckboxField({ key: 'isChecked', label: 'Is Checked' }),
    ];

    component.ngOnInit();
    component.setValue(model);
    fixture.detectChanges();
  });

  it('should render TextField', () => {
    expectFormInput('text1', 'Text 1', 'value1');
  });

  it('should render MultilineField', () => {
    expectFormTextarea('comments', 'Comments', 'comments here...');
  });

  it('should render nested field', () => {
    expectFormInput('city', 'City', 'Ny');
  });

  it('should clear', () => {
    component.clear();
    fixture.detectChanges();
    expectFormInput('city', 'City', '');
    expectFormInput('text1', 'Text 1', '');
    expectFormTextarea('comments', 'Comments', '');
  });

  it('should render DateField', () => {
    let fieldId = 'date';
    const el = fixture.debugElement.query(By.css(`#${fieldId}-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Date');
    const input = el.query(By.css('input'));
    expect(input).toBeTruthy();

    input.nativeElement.value = '02/28/2018';
    const changeTo = new Date(2018, 1, 28, 0, 0, 0);
    input.nativeElement.dispatchEvent(new Event('change'));
    expect(component.form.value[fieldId].toISOString()).toBe(changeTo.toISOString());
  });

  it('should patch value', () => {
    component.createForm();
    component.reset();
    expect(component.form.value.nested2).toBeTruthy();
  });

  it('should change nested attr value', () => {
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css(`#field1-div`));
    expect(el).toBeTruthy();
    const input = el.query(By.css('input'));
    input.nativeElement.value = 'some value';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component.form.value['nested2']).toBeTruthy();
    expect(component.form.value['nested2']['field1']).toBe('some value');
    let formValue = component.getModel()
    expect(formValue.nested2.field1).toBe('some value');
    expect(formValue.address.extra_field).toBe(model.address.extra_field);
    expect(component.form.valid).toBeTruthy();
  });

  it('should change nested attr value and patch on null model', () => {
    component.setValue(null);
    fixture.detectChanges();
    expectFormInput('field1', 'Field1', '')

    const el = fixture.debugElement.query(By.css(`#field1-div`));
    expect(el).toBeTruthy();

    const input = el.query(By.css('input'));
    input.nativeElement.value = 'some value';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component.form.value['nested2']).toBeTruthy();
    expect(component.form.value['nested2']['field1']).toBe('some value');
    let formValue = component.getModel()
    expect(formValue.nested2.field1).toBe('some value');

    fixture.detectChanges();
    expect(component.form.valid).toBeTruthy();
  });

  it('should be read mode', () => {
    component.editing = false;
    fixture.detectChanges();
    expectFormLabel('text1', 'Text 1', model.text1);
    expectFormLabel('comments', 'Comments', model.comments);
    // implement tes of value
    expectFormLabel('street', 'Street', model.address.street);
    expectFormLabel('city', 'City', model.address.city);
    expectFormLabel('date', 'Date', datePipe.transform(dateTest, 'mediumDate', 'en'));
  });

  it('should display (optional) for optional field', () => {
    const fieldId = 'required';
    const el = fixture.debugElement.queryAll(By.css('ng-xform-editable-label'))
      .find(e => e.componentInstance.elementId === fieldId);
    const optional = el.query(By.css('ng-xform-required-field-tag'));
    const fieldComponent = el.componentInstance;
    expect(el).toBeTruthy();
    expect(optional.componentInstance.optional).toBeFalsy();

    fieldComponent.field.validators = undefined;
    fixture.detectChanges();

    expect(fieldComponent.field.validators).toBeFalsy();
    expect(fieldComponent.isOptional).toBeTruthy();
    expect(optional.componentInstance.optional).toBeTruthy();
  });

  function expectFormLabel(fieldId: string, caption: string, value: any) {

    const el = fixture.debugElement.query(By.css(`#${fieldId}-div`));
    expect(el).toBeTruthy();
    expect(el.nativeElement).toBeTruthy();
    expect(el.nativeElement.hidden).toBeFalsy();
    const label = el.query(By.css('label'));
    expect(label.nativeElement.textContent.trim()).toBe(caption);
    const labelValue = el.query(By.css('div.text-muted'));
    expect(labelValue).toBeTruthy();
    expect(labelValue.nativeElement.textContent.trim()).toBe(value);
  }

  function expectFormField(
    inputType: any,
    changeEvent: any,
    fieldId: string,
    caption: string,
    value: any,
    changeTo?: any
  ) {
    const el = fixture.debugElement.query(By.css(`#${fieldId}-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain(caption);
    // Test if the initial element value
    const input = el.query(By.css(inputType));
    expect(input.properties['value']).toBe(value);
    // Change element and test if form value is updated
    if (changeTo !== undefined) {
      input.nativeElement.value = changeTo;
      input.nativeElement.dispatchEvent(new Event(changeEvent));
      expect(component.form.value[fieldId]).toBe(changeTo);
    }
  }

  const expectFormInput = expectFormField.bind(null, 'input', 'input');
  const expectFormTextarea = expectFormField.bind(null, 'textarea', 'input');

});

describe('NgXformComponent - Fields setup', () => {

  it('should reset on field Change', () => {

    const fixture = createTestingModule();
    expect(fixture.componentInstance).toBeTruthy();

    let component: NgXformComponent = fixture.debugElement.componentInstance.form;

    fixture.componentInstance.setModel({field1: 'some value'});

    let el = fixture.debugElement.query(By.css('#field1-div .text-muted'));
    expect(el).toBeFalsy();

    fixture.detectChanges();

    fixture.componentInstance.setFields([
      new TextField({ key: 'field1', label: 'Field 1' }),
    ]);
    fixture.detectChanges();

    el = fixture.debugElement.query(By.css('#field1-div .text-muted'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.textContent).toEqual(' some value ');

  });

  it('should reset null measure field values', () => {
    const fixture = createTestingModule();
    expect(fixture.componentInstance).toBeTruthy();

    fixture.componentInstance.setFields([
      new MeasureField({ key: 'field1', label: 'Field 1', modelUnit: 'm' }),
    ]);
    fixture.detectChanges();

    const measureField: MeasureFieldComponent = fixture.debugElement.query(By.css('ng-xform-measure-field')).componentInstance;
    expect(measureField).toBeTruthy();

    fixture.componentInstance.setModel({field1: {value: 10, unit: 'm'}});
    fixture.detectChanges();

    let el = fixture.debugElement.query(By.css('#field1-div .text-muted'));
    expect(el).toBeTruthy();

    expect(measureField.viewModel).toEqual(10);
    expect(measureField.viewUnit).toEqual('m');

    fixture.componentInstance.setModel({field1: null});
    fixture.detectChanges();

    expect(measureField.viewModel).toBeUndefined();
    expect(measureField.viewUnit).toEqual('m');

    fixture.componentInstance.editing = true;
    fixture.detectChanges();

    el = fixture.debugElement.query(By.css('#field1-div input'));
    expect(el).toBeTruthy();
  });

});

function createTestingModule(): ComponentFixture<any> {
  TestBed.configureTestingModule({
    imports: [
      NgXformModule
    ],
    declarations: [
      DateRangeFieldTestComponent,
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(DateRangeFieldTestComponent);
  fixture.detectChanges();

  return fixture;
}


@Component({
  template: `
  <ng-xform [fields]="fields" [horizontalForm]="false" [labelWidth]="3" [(editing)]="editing"></ng-xform>
  `,
})
class DateRangeFieldTestComponent {
  @ViewChild(NgXformComponent) form: NgXformComponent;

  fields: any = [];
  editing = false;

  setFields(fields: any) {
    this.fields = fields;
  }

  setModel(model: any) {
    this.form.setValue(model);
  }

}
