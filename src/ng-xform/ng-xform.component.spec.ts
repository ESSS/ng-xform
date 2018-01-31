import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { NgXformComponent } from './ng-xform.component';
import { EditableLabelComponent } from './editable-label/editable-label.component';
import { MeasureFieldComponent } from './measure-field/measure-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { AutocompleteFieldComponent } from './autocomplete-field/autocomplete-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { MultilineFieldComponent } from './multiline-field/multiline-field.component';
import { FieldErrorMessageComponent } from './field-error-message/field-error-message.component';
import { ErrorMessagePipe } from './field-error-message/error-message.pipe';
import { OptionValue } from '../types';
import { PipesModule } from '../pipes/pipes.module';
import { MultilineField } from './fields/multiline-field';
import { FieldsGroupComponent } from './fields-group/fields-group.component';
import { FieldGroup } from './fields/field-group';
import {
  AutocompleteField,
  TextField,
  MeasureField,
  SelectField
} from './fields';

describe('DynamicFormComponent', () => {
  let component: NgXformComponent;
  let fixture: ComponentFixture<NgXformComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          NgXformComponent,
          EditableLabelComponent,
          FieldsGroupComponent,
          AutocompleteFieldComponent,
          CheckboxFieldComponent,
          MeasureFieldComponent,
          SelectFieldComponent,
          FieldErrorMessageComponent,
          ErrorMessagePipe,
          MultilineFieldComponent
        ],
        imports: [
          CommonModule,
          NguiAutoCompleteModule,
          ReactiveFormsModule,
          PipesModule
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NgXformComponent);
    component = fixture.componentInstance;

    component.model = {
      text1: 'value1',
      measure1: 22,
      choice_id: 1,
      comments: 'comments here...',
      address: {
        street: 'St wall',
        city: 'Ny'
      }
    };

    const options = [
      [1, 'Choice1'] as OptionValue,
      [2, 'Choice2'] as OptionValue
    ];

    const colors: any[] = [
      { id: 1, name: 'blue' },
      { id: 2, name: 'yellow' },
      { id: 3, name: 'white' }
    ];

    component.fields = [
      new TextField({ key: 'text1', label: 'Text 1' }),
      new MeasureField({ key: 'measure1', label: 'Measure 1', unit: 'C' }),
      new SelectField({ key: 'choice_id', label: 'Choice', options }),
      new MultilineField({ key: 'comments', label: 'Comments' }),
      new AutocompleteField({
        key: 'color',
        label: 'Color',
        source: colors,
        valueAttribute: 'id',
        valueFormatter: 'name',
        listFormatter: 'name'
      }),
      new FieldGroup({
        key: 'address', label: 'Address',
        fields: [
          new TextField({ key: 'street', label: 'Street' }),
          new TextField({ key: 'city', label: 'City' }),
        ]
      })
    ];

    // fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expectFormInput('text1', 'Text 1', 'value1');
    expectFormInput('measure1', 'Measure 1', 22, 15);
    expectFormSelect('choice_id', 'Choice', '1', '2');
    expectFormTextarea('comments', 'Comments', 'comments here...');
    expectFormInput('city', 'City', 'Ny');
    expectFormInput('color', 'Color', '');
  });

  it('should emit form value on submit', () => {
    fixture.detectChanges();
    component.onSubmit.subscribe((value: Object) => {
      expect(value['color']).toBeNull();
      expect(value['text1']).toBe('Text 1');
    });
    component.model = { color: null, text1: 'Text 1' };
    component.reset();
    const buttonEl = fixture.debugElement.query(By.css(`#formSubmitBtn`));
    fixture.detectChanges();
    expect(buttonEl).toBeTruthy();
    buttonEl.nativeElement.click();
  });

  it('should be read mode', () => {
    component.editing = false;
    fixture.detectChanges();
    expectFormLabel('text1', 'Text 1', 'value1');
  });

  function expectFormLabel(fieldId: string, caption: string, value: any) {
    const el = fixture.debugElement.query(By.css(`#${fieldId}-label`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('strong'));
    expect(label.nativeElement.textContent).toBe(caption);
    const labelValue = el.query(By.css('p'));
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
    expect(el.children.length).toBe(3);
    const label = el.children[0].nativeElement;
    expect(label.textContent).toBe(caption);
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
  const expectFormSelect = expectFormField.bind(null, 'select', 'change');
});
