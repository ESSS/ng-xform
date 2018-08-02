import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { getNgSelectElement, KeyCode, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { SelectField } from '../fields';
import { NgXformGroup } from '../ng-xform-group';
import { NgXformModule } from '../ng-xform.module';
import { SelectFieldComponent } from './select-field.component';

describe('SelectFieldComponent', () => {
  it('should render SelectField', () => {
    const fixture = createTestingModule(new SelectField({
      key: 'choice_id',
      label: 'Choice',
      optionValueKey: 'id',
      optionLabelKey: 'description',
      options: []
    }));

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render SelectField', () => {
    const fixture = createTestingModule(new SelectField({
      key: 'choice_id',
      label: 'Choice',
      optionValueKey: 'id',
      optionLabelKey: 'description',
      options: [
        { id: 1, description: 'Choice1' },
        { id: 2, description: 'Choice2' }
      ]
    }));
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css(`#choice_id-div`));
    expect(el).toBeTruthy();
    const label = el.query(By.css('label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent).toContain('Choice');
    const selectComponet = el.query(By.css('ng-select'));
    expect(selectComponet).toBeTruthy();
  });

  describe('Tagging', () => {
    it('should select custom tag', fakeAsync(() => {
      const fixture = createTestingModule(new SelectField({
        key: 'choice_id',
        label: 'Choice',
        searchable: true,
        addNewOption: true,
        optionValueKey: 'id',
        optionLabelKey: 'description',
        options: []
      }));

      tickAndDetectChanges(fixture);
      fixture.componentInstance.select.filter('New local tag');
      tickAndDetectChanges(fixture);
      triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
      tickAndDetectChanges(fixture);
      expect(fixture.componentInstance.select.selectedItems.length).toBe(1);
      expect(<any>fixture.componentInstance.select.selectedItems[0]).toEqual(jasmine.objectContaining({
          label: 'New local tag'
      }));

      tick(10);
    }));

    it('should select custom tag with observable', fakeAsync(() => {
      const fixture = createTestingModule(new SelectField({
        key: 'choice_id',
        label: 'Choice',
        searchable: true,
        addNewOption: (model) => of({id: 5, description: model.description, valid: true}),
        optionValueKey: 'id',
        optionLabelKey: 'description',
        options: []
      }));

      tickAndDetectChanges(fixture);
      fixture.componentInstance.select.filter('server side tag');
      tickAndDetectChanges(fixture);
      triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
      tickAndDetectChanges(fixture);
      expect(fixture.componentInstance.select.selectedItems.length).toBe(1);
      expect(<any>fixture.componentInstance.select.selectedItems[0]).toEqual(jasmine.objectContaining({
          label: 'server side tag'
      }));

      tick(10);
    }));

    it('should select custom tag with promise', fakeAsync(() => {
      const fixture = createTestingModule(new SelectField({
        key: 'choice_id',
        label: 'Choice',
        searchable: true,
        addNewOption: (model) => of({id: 5, description: model.description, valid: true}).toPromise(),
        optionValueKey: 'id',
        optionLabelKey: 'description',
        options: []
      }));

      tickAndDetectChanges(fixture);
      fixture.componentInstance.select.filter('server side tag');
      tickAndDetectChanges(fixture);
      triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
      tickAndDetectChanges(fixture);
      expect(fixture.componentInstance.select.selectedItems.length).toBe(1);
      expect(<any>fixture.componentInstance.select.selectedItems[0]).toEqual(jasmine.objectContaining({
          label: 'server side tag'
      }));

      tick(10);
    }));

  });

});

function createTestingModule(field: SelectField): ComponentFixture<any> {
  TestBed.configureTestingModule({
    imports: [
      NgXformModule
    ]
  }).compileComponents();

  const fixture = TestBed.createComponent(SelectFieldComponent);
  let component = fixture.componentInstance;
  component.editing = true;
  component.form = new NgXformGroup({ 'select': new FormControl() });
  component.field = field;
  component.ngOnInit();
  component.ngAfterViewInit();

  return fixture;
}
