import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RadioGroupField } from '../fields';
import { NgXformGroup } from '../ng-xform-group';
import { NgXformModule } from '../ng-xform.module';
import { RadioGroupFieldComponent } from './radiogroup-field.component';


describe('RadiogroupFieldComponent', () => {
  it('should render RadiogroupField', () => {
    const fixture = createTestingModule(new RadioGroupField({
      key: 'choice_id',
      label: 'Choice',
      optionValueKey: 'id',
      optionLabelKey: 'description',
      options: []
    }));

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render RadiogroupField with object array options', () => {
    const fixture = createTestingModule(new RadioGroupField({
      key: 'choice_id',
      label: 'Choice',
      optionValueKey: 'id',
      optionLabelKey: 'description',
      options: [
        { id: 1, description: 'Choice1' },
        { id: 2, description: 'Choice2' }
      ]
    }));
    let component = fixture.componentInstance;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css(`#choice_id-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Choice');
    const radioComponets = getRadioOptions(el, 'choice_id');
    expect(radioComponets.length).toBe(2);
  });

  it('should render RadiogroupField with string array options', () => {
    const fixture = createTestingModule(new RadioGroupField({
      key: 'choice_id',
      label: 'Choice',
      options: [ 'Choice1', 'Choice2']
    }));
    let component = fixture.componentInstance;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css(`#choice_id-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Choice');
    const radioComponets = getRadioOptions(el, 'choice_id');
    expect(radioComponets.length).toBe(2);
  });

  it('should render RadiogroupField with observable options', () => {
    const fixture = createTestingModule(new RadioGroupField({
      key: 'choice_id',
      label: 'Choice',
      options: Observable.of([ 'Choice1', 'Choice2'])
    }));
    let component = fixture.componentInstance;
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css(`#choice_id-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Choice');
    const radioComponets = getRadioOptions(el, 'choice_id');
    expect(radioComponets.length).toBe(2);
  });
});

function getRadioOptions(el: any, name: string) {
  return el.queryAll(By.css(`input[type="radio"][ng-reflect-name="${name}"]`));
}

function createTestingModule(field: RadioGroupField): ComponentFixture<any> {
  TestBed.configureTestingModule({
    imports: [
      NgXformModule
    ]
  }).compileComponents();

  const control = {}
  control[field.key] = new FormControl();

  const fixture = TestBed.createComponent(RadioGroupFieldComponent);
  let component = fixture.componentInstance;
  component.editing = true;
  component.form = new NgXformGroup(control);
  component.field = field;
  component.ngOnInit();

  return fixture;
}
