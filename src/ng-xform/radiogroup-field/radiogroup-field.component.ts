import { Component, OnInit } from '@angular/core';
import { Observable, isObservable } from 'rxjs';

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
  private selectedLabel = '-';

  ngOnInit() {
    super.ngOnInit();
    const options = this.field.options;

    if (isObservable(options)) {
      (<Observable<any[]>>options).subscribe(ret => {
        this.optionValues = ret;
        this.updateSelectedLabel();
      });
    } else {
      this.optionValues = options;
    }
    this.control.valueChanges.subscribe(() => this.updateSelectedLabel());
  }

  get formattedValue(): string {
    return this.selectedLabel;
  }

  private updateSelectedLabel() {
    const value = this.form.controls[this.elementId].value;
    if (value !== null && this.field.optionLabelKey) {
      const selected = this.optionValues.find(option => {
        if (this.field.optionValueKey && option[this.field.optionValueKey] === value) {
          return option
        } else if (option === value) {
          return option
        }
      });
      this.selectedLabel = selected ? selected[this.field.optionLabelKey] : '-';
    } else {
      this.selectedLabel = value === null ? '-' : value;
    }
  }

}
