import { OptionalTagComponent } from './field-components/optional-tag.component';
import { DateFieldComponent } from './date-field/date-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, Inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { NgXformComponent } from './ng-xform.component';
import { EditableLabelComponent } from './editable-label/editable-label.component';
import { MeasureFieldComponent } from './measure-field/measure-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { FieldErrorMessageComponent } from './field-error-message/field-error-message.component';
import { ErrorMessagePipe } from './field-error-message/error-message.pipe';
import { PipesModule } from '../pipes/pipes.module';
import { MultilineFieldComponent } from './multiline-field/multiline-field.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormControlLayoutComponent } from './form-control-layout/form-control-layout.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    NgXformComponent,
    FormGroupComponent,
    EditableLabelComponent,
    CheckboxFieldComponent,
    MeasureFieldComponent,
    SelectFieldComponent,
    FieldErrorMessageComponent,
    ErrorMessagePipe,
    MultilineFieldComponent,
    OptionalTagComponent,
    DateFieldComponent,
    FormControlLayoutComponent,
  ],
  exports: [
    NgXformComponent,
    FieldErrorMessageComponent,
    PipesModule,
  ]
})
export class NgXformModule {
  constructor(bsLocaleService: BsLocaleService, @Inject(LOCALE_ID) locale: string) {
    if (bsLocaleService.locale.value !== locale) {
      bsLocaleService.use(locale);
    }
  }
}
