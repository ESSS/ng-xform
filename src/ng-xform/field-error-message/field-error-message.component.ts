import { FormControl, ValidatorFn } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'ng-xform-field-error-message',
  templateUrl: './field-error-message.component.html',
  styles: []
})
export class FieldErrorMessageComponent implements OnInit {

  @Input() control: FormControl;

  ngOnInit() {}

}
