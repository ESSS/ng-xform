import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { NgXformSaveEditComponent } from './ng-xform-save-edit.component';
import { DateField, MeasureField, TextField } from '../fields';
import { CheckboxField } from '../fields/checkbox-field';
import { MultilineField } from '../fields/multiline-field';
import { NestedFormGroup } from '../fields/nested-form-group';
import { NgXformModule } from '../ng-xform.module';

describe('NgXformSaveEdit', () => {
  let component: NgXformSaveEditComponent;
  let fixture: ComponentFixture<NgXformSaveEditComponent>;
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
    fixture = TestBed.createComponent(NgXformSaveEditComponent);
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
      new MeasureField({ key: 'measure1', label: 'Measure 1', modelUnit: 'degC' }),
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

    fixture.detectChanges();
    component.setValue(model);
  });


  it('should patch value', () => {
    expect(component.xform.form.value.nested2).toBeTruthy();
  });


  it('should emit form value on submit', (done: any) => {
    const editBtnEl = fixture.debugElement.query(By.css(`#formEditBtn`));
    editBtnEl.nativeElement.click();
    fixture.detectChanges();

    component.submit.subscribe((value: any) => {
      setTimeout(() => {
        expect(value.text1).toBe(model.text1);
        expect(value.comments).toBe(model.comments);
        expect(value.date).toBe(dateTest);
        expect(value.isChecked).toBeFalsy();
        done();
      });
    });
    const buttonEl = fixture.debugElement.query(By.css(`#formSubmitBtn`));
    fixture.detectChanges();
    expect(buttonEl).toBeTruthy();
    expect(component.xform.form.valid).toBeTruthy();
    buttonEl.nativeElement.click();
  });

  it('should be read mode', () => {
    const editBtnEl = fixture.debugElement.query(By.css(`#formEditBtn`));
    editBtnEl.nativeElement.click();
    fixture.detectChanges();

    expect(component.editing).toBeTruthy();
    const cancelBtnEl = fixture.debugElement.query(By.css(`#formCancelBtn`));
    cancelBtnEl.nativeElement.click();
    fixture.detectChanges();
    expect(component.editing).toBeFalsy();
    expectFormLabel('text1', 'Text 1', model.text1);
    expectFormLabel('comments', 'Comments', model.comments);
    // implement tes of value
    expectFormLabel('street', 'Street', model.address.street);
    expectFormLabel('city', 'City', model.address.city);
    expectFormLabel('date', 'Date', datePipe.transform(dateTest, 'mediumDate', 'en'));
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

});
