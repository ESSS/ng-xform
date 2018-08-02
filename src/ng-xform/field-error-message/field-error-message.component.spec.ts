import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessagePipe } from './error-message.pipe';
import { FieldErrorMessageComponent } from './field-error-message.component';

describe('FieldErrorMessageComponent', () => {
  let component: FieldErrorMessageComponent;
  let fixture: ComponentFixture<FieldErrorMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FieldErrorMessageComponent,
        ErrorMessagePipe,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
