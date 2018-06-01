import { Observable } from 'rxjs/Observable';
import { Measure, NgXformModule } from '../../index';
import { CommonModule, DatePipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectFieldComponent } from './select-field.component';
import { SelectField } from '../fields';
import { NgXformGroup } from '../ng-xform-group';
import { Subject } from 'rxjs/Subject';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  let options: any[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgXformModule
      ]
    }).compileComponents();

    options = [
      { id: 1, description: 'Choice1' },
      { id: 2, description: 'Choice2' }
    ];

    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    component.editing = true;
    component.form = new NgXformGroup({ 'select': new FormControl() });
    component.field = new SelectField({
      key: 'choice_id',
      label: 'Choice',
      optionValueKey: 'id',
      optionLabelKey: 'description',
      options: options
    });
    component.ngOnInit();
    component.ngAfterViewInit();
  }));

  it('should render SelectField', () => {
    expect(component).toBeTruthy();
  });

  it('should render SelectField', () => {
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css(`#choice_id-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Choice');
    const selectComponet = el.query(By.css('ng-select'));
    expect(selectComponet).toBeTruthy();
  });

});
