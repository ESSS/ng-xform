import { Observable } from 'rxjs/Rx';
import { DebugElement } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';

import { DateField } from './fields';
import { NgXformComponent } from './ng-xform.component';
import { NgXformModule } from './ng-xform.module';
import { EditableLabelComponent } from './editable-label/editable-label.component';
import { MeasureFieldComponent } from './measure-field/measure-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { MultilineFieldComponent } from './multiline-field/multiline-field.component';
import { FieldErrorMessageComponent } from './field-error-message/field-error-message.component';
import { ErrorMessagePipe } from './field-error-message/error-message.pipe';
import { PipesModule } from '../pipes/pipes.module';
import { MultilineField } from './fields/multiline-field';
import { NestedFormGroup } from './fields/nested-form-group';
import { CheckboxField } from './fields/checkbox-field';
import {
  TextField,
  MeasureField,
  SelectField
} from './fields';

describe('DynamicFormComponent', () => {
  let component: NgXformComponent;
  let fixture: ComponentFixture<NgXformComponent>;
  let optieditingons: any[];
  let model: any;
  let options: any[];
  let dateTest: Date;
  let datePipe: DatePipe;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          NgXformModule
        ]
      }).compileComponents();
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
      choice_id: 1,
      comments: 'comments here...',
      address: {
        street: 'St wall',
        city: 'Ny',
        extra_field: 'Extra',
      },
      nested2: null,
      date: dateTest,
    };

    options = [
      { id: 1, description: 'Choice1' },
      { id: 2, description: 'Choice2' }
    ];
    const colors: any[] = [
      { id: 1, name: 'blue' },
      { id: 2, name: 'yellow' },
      { id: 3, name: 'white' }
    ];

    component.fields = [
      new TextField({ key: 'text1', label: 'Text 1' }),
      new TextField({ key: 'required', label: 'Required 1', validators: [Validators.required] }),
      new MeasureField({ key: 'measure1', label: 'Measure 1', modelUnit: 'tempC' }),
      new SelectField({
        key: 'choice_id',
        label: 'Choice',
        optionValueKey: 'id',
        optionLabelKey: 'description',
        options: options
      }),
      new MultilineField({ key: 'comments', label: 'Comments' }),
      new SelectField({
        key: 'color',
        label: 'Color',
        searchHandler: (keyword: string) => Observable.of(colors.filter(el => el.name === keyword)),
        options: colors,
        optionValueKey: 'id',
        optionLabelKey: 'name',
      }),
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

  it('should create form', () => {
    component.createForm();
    expect(component.form).toBeTruthy();
  });

  it('should patch value', () => {
    component.createForm();
    component.reset();
    expect(component.errorCode).toBeUndefined();
    expect(component.form.value.nested2).toBeTruthy();
  });

  it('should change nested attr value and patch on null model', (done: any) => {
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

    component.onSubmit.subscribe((value: any) => {
      expect(value.nested2.field1).toBe('some value');
      done();
    });
    const buttonEl = fixture.debugElement.query(By.css(`#formSubmitBtn`));
    fixture.detectChanges();
    expect(buttonEl).toBeTruthy();
    expect(component.form.valid).toBeTruthy();
    buttonEl.nativeElement.click();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render NestedFormGroup', () => {
    expectFormInput('city', 'City', 'Ny');
  });

  it('should render TextField', () => {
    expectFormInput('text1', 'Text 1', 'value1');
  });

  it('should render MultilineField', () => {
    expectFormTextarea('comments', 'Comments', 'comments here...');
  });

  it('should render MeasureField', () => {
    expectFormInput('measure1', 'Measure 1');
  });

  it('should render nested field', () => {
    expectFormInput('city', 'City', 'Ny');
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

  it('should render AutocompleteField', () => {
    const el = fixture.debugElement.query(By.css(`#color-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Color');
    const input = el.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('should render SelectField', () => {
    const el = fixture.debugElement.query(By.css(`#choice_id-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Choice');
    const selectComponet = el.query(By.css('ng-select'));
    expect(selectComponet).toBeTruthy();
    const optionsEl = el.queryAll(By.css('div.ng-option'));
    expect(optionsEl.length).toBe(options.length);
  });

  it('should hidden/show other_color on change color', () => {
    const fieldId = 'other_color';
    const el = fixture.debugElement.queryAll(By.css('ng-xform-editable-label'))
      .find(e => e.componentInstance.elementId === fieldId);
    const elComponent = el.componentInstance;

    expect(elComponent.visible).toBeFalsy();

    component.setValue({ color: 1 });
    expect(elComponent.visible).toBeTruthy();

    component.setValue({ color: null });
    expect(elComponent.visible).toBeFalsy();

  });

  it('should patch value', () => {
    component.createForm();
    component.reset();
    expect(component.errorCode).toBeUndefined();
    expect(component.form.value.nested2).toBeTruthy();
  });

  it('should change nested attr value', (done: any) => {
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css(`#field1-div`));
    expect(el).toBeTruthy();
    const input = el.query(By.css('input'));
    input.nativeElement.value = 'some value';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component.form.value['nested2']).toBeTruthy();
    expect(component.form.value['nested2']['field1']).toBe('some value');

    component.onSubmit.subscribe((value: any) => {
      expect(value.nested2.field1).toBe('some value');
      expect(value.address.extra_field).toBe(model.address.extra_field);
      done();
    });
    const buttonEl = fixture.debugElement.query(By.css(`#formSubmitBtn`));
    fixture.detectChanges();
    expect(buttonEl).toBeTruthy();
    expect(component.form.valid).toBeTruthy();
    buttonEl.nativeElement.click();

  });

  it('should emit form value on submit', (done: any) => {
    component.onSubmit.subscribe((value: any) => {
      setTimeout(() => {
        expect(value.text1).toBe(model.text1);
        expect(value.comments).toBe(model.comments);
        expect(value.choice_id).toBe(model.choice_id);
        expect(value.date).toBe(dateTest);
        // TODO RFDAP-593
        // expect(value.isChecked).not.toBeNull();
        expect(value.isChecked).toBeFalsy();
        expect(value.color).toBeNull();
        done();
      });
    });
    const buttonEl = fixture.debugElement.query(By.css(`#formSubmitBtn`));
    fixture.detectChanges();
    expect(buttonEl).toBeTruthy();
    expect(component.form.valid).toBeTruthy();
    buttonEl.nativeElement.click();
  });

  it('should be read mode', () => {
    component.editing = false;
    fixture.detectChanges();
    expectFormLabel('text1', 'Text 1', model.text1);
    expectFormLabel('comments', 'Comments', model.comments);
    // implement tes of value
    expectFormLabel('choice_id', 'Choice', '-');
    expectFormLabel('street', 'Street', model.address.street);
    expectFormLabel('city', 'City', model.address.city);
    expectFormLabel('date', 'Date', datePipe.transform(dateTest, 'mediumDate', 'en'));
  });

  it('should display (optional) for required field', () => {
    const fieldId = 'required';
    const el = fixture.debugElement.queryAll(By.css('ng-xform-editable-label'))
      .find(e => e.componentInstance.elementId === fieldId);
    const optional = el.query(By.css('ng-xform-optional-tag'));
    const fieldComponent = el.componentInstance;
    expect(el).toBeTruthy();
    expect(optional.componentInstance.show).toBeFalsy();

    fieldComponent.field.validators = undefined;
    fixture.detectChanges();

    expect(fieldComponent.field.validators).toBeFalsy();
    expect(fieldComponent.isOptional).toBeTruthy();
    expect(optional.componentInstance.show).toBeTruthy();
  });

  function expectFormLabel(fieldId: string, caption: string, value: any) {

    const el = fixture.debugElement.query(By.css(`#${fieldId}-label`));
    expect(el).toBeTruthy();
    expect(el.nativeElement).toBeTruthy();
    expect(el.nativeElement.hidden).toBeFalsy();
    const label = el.query(By.css('strong'));
    expect(label.nativeElement.textContent).toBe(caption);
    const labelValue = el.query(By.css('div'));
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
