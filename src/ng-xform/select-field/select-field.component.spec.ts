import { Observable } from 'rxjs/Rx';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectFieldComponent } from './select-field.component';
import { SelectField } from '../fields';
import { NgXformGroup } from '../ng-xform-group';
import { NgXformModule } from '../ng-xform.module';
import { tickAndDetectChanges, triggerKeyDownEvent, getNgSelectElement, KeyCode } from '../../testing/helpers';


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
        addTag: true,
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
        addTag: (model) => {return Observable.of({id: 5, description: model.description, valid: true})},
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
        addTag: (model) => {return Observable.of({id: 5, description: model.description, valid: true}).toPromise()},
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
