import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { NumberFieldComponent } from './number-field.component';
import { NgXformModule } from '../ng-xform.module';
import { NgXformGroup } from '../ng-xform-group';
import { NumberField } from '../fields';

describe('NumberFieldComponent', () => {
  let component: NumberFieldComponent;
  let fixture: ComponentFixture<NumberFieldComponent>;

  beforeEach(
    async(() => TestBed.configureTestingModule({
        imports: [
          NgXformModule
        ]
      }).compileComponents()
    )
  );

  it('should show 0 value', () => {
    fixture = TestBed.createComponent(NumberFieldComponent);
    component = fixture.componentInstance;
    component.form = new NgXformGroup({ 'aNumber': new FormControl() });
    component.field = new NumberField({ 'key': 'aNumber'});
    // Force Initialization
    component.ngOnInit();

    component.control.setValue(0);
    expect(component.formattedValue).toBe(0);
  })

});
