import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgXformModule } from '../..';
import { InputNumberComponent } from './input-number.component';

describe('InputNumberComponent', () => {

  describe('Locale pt', () => {
    let component: InputNumberComponent;
    let fixture: ComponentFixture<InputNumberComponent>;
    let inputEl: DebugElement;
    beforeEach(
      async(() => {
        registerLocaleData(localePt, 'pt');
        TestBed.configureTestingModule({
          imports: [
            NgXformModule
          ],
          providers: [
            { provide: LOCALE_ID, useValue: 'pt'}
          ],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(InputNumberComponent);
      component = fixture.componentInstance;
      component.ngAfterViewInit();
      fixture.detectChanges();
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('should render NumberField', () => {
      expect(component).toBeTruthy();
    });

    it('should disable form value', () => {
      component.setDisabledState(true);
      expect(inputEl.nativeElement.disabled).toBe(true);

      component.setDisabledState(false);
      expect(inputEl.nativeElement.disabled).toBe(false);
    });

    it('should render form  exponential value', () => {
      component.writeValue(2.2324789456e+31);
      expect(component.formattedValue).toBe('2,2324789456e+31');
      expect(component.viewModel).toBe('2,2324789456e+31');
    });

    it('should render form decimal value', () => {
      component.writeValue(2.23247894);
      expect(component.formattedValue).toBe('2,23247894');
      expect(component.viewModel).toBe('2,23247894');
    });

    it('should render form integer value', () => {
      component.writeValue(234);
      expect(component.formattedValue).toBe('234');
      expect(component.viewModel).toBe('234');
    });

    it('should render form long value as exponential', () => {
      component.writeValue(232478);
      expect(component.formattedValue).toBe('2,32478e+5');
      expect(component.viewModel).toBe('2,32478e+5');
    });

    it('should update form value', () => {
      const newValueString = '15,654';
      let updatedValue;

      component.registerOnChange((val: any) => updatedValue = val);
      inputEl.nativeElement.value = newValueString;
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(updatedValue).toEqual(15.654);
    });
  });

  describe('Locale en', () => {
    let component: InputNumberComponent;
    let fixture: ComponentFixture<InputNumberComponent>;
    let inputEl: DebugElement;
    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [
            NgXformModule
          ],
          providers: [
            { provide: LOCALE_ID, useValue: 'en'}
          ],
        }).compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(InputNumberComponent);
      component = fixture.componentInstance;
      component.ngAfterViewInit();
      fixture.detectChanges();
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('should render NumberField', () => {
      expect(component).toBeTruthy();
    });

    it('should render form  exponential value', () => {
      component.writeValue(2.2324789456e+31);
      expect(component.formattedValue).toBe('2.2324789456e+31');
      expect(component.viewModel).toBe('2.2324789456e+31');
    });

    it('should render form decimal value', () => {
      component.writeValue(2.23247894);
      expect(component.formattedValue).toBe('2.23247894');
      expect(component.viewModel).toBe('2.23247894');
    });

    it('should render form integer value', () => {
      component.writeValue(234);
      expect(component.formattedValue).toBe('234');
      expect(component.viewModel).toBe('234');
    });

    it('should render form long value as exponential', () => {
      component.writeValue(232478);
      expect(component.formattedValue).toBe('2.32478e+5');
      expect(component.viewModel).toBe('2.32478e+5');
    });

    it('should show 0 value', () => {
      component.writeValue(0);
      expect(component.formattedValue).toBe('0')
      expect(component.viewModel).toBe('0');
    });

    it('should update form value', () => {
      const newValueString = '15.654';
      let updatedValue;

      component.registerOnChange((val: any) => updatedValue = val);
      inputEl.nativeElement.value = newValueString;
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(updatedValue).toEqual(15.654);
    });
  });
});
