import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseDynamicFieldComponent } from '../field-components/base-dynamic-field.component';
import { RadioGroupField } from '../fields';


/**
 * Component to generate a form radiogroup field
 *
 * :editing: Flag to control component state
 * :form: FormGroup containing the field
 * :field: Intance of field configurations
 */
@Component({
  selector: 'ng-xform-radiogroup-field',
  templateUrl: './radiogroup-field.component.html',
})
export class RadioGroupFieldComponent extends BaseDynamicFieldComponent<RadioGroupField> implements OnInit {
  optionValues: any[] = [];
  private selectedLabel = '';

  ngOnInit() {
    super.ngOnInit();
    let options = this.field.options;

    if (options instanceof Observable) {
      (<Observable<any[]>>options).subscribe(ret => {
        this.optionValues = ret;
        this.updateSelectedLabel();
      });
    } else {
      this.optionValues = options;
    }
    this.control.valueChanges.subscribe((v) => {
      console.log('radiogroup', v);
      this.updateSelectedLabel();
    })
  }

  get formattedValue(): string {
    return this.selectedLabel;
  }

  private updateSelectedLabel() {
    const value = this.form.controls[this.elementId].value;
    if (value && this.field.optionLabelKey) {
      const selected = this.optionValues.find(option => {
        if (this.field.optionValueKey && String(option[this.field.optionValueKey]) === value) {
          return option
        } else if (option === value) {
          return option
        }
      });
      this.selectedLabel = selected[this.field.optionLabelKey];
    } else {
      this.selectedLabel = value === null ? '-' : value;
    }
  }

}
