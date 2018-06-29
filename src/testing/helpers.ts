import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick(10);
}

export function getNgSelectElement(fixture: ComponentFixture<any>) {
  return fixture.debugElement.query(By.css('ng-select'));
}

export function triggerKeyDownEvent(element: any, which: number, key = ''): void {
  element.triggerEventHandler('keydown', {
      which: which,
      key: key,
      preventDefault: () => { },
      stopPropagation: () => { }
  });
}

export enum KeyCode {
  Tab = 9,
  Enter = 13,
  Esc = 27,
  Space = 32,
  ArrowUp = 38,
  ArrowDown = 40,
  Backspace = 8
}
  