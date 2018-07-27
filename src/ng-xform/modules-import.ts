import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModuleWithProviders } from '@angular/core';

export const bsDatepickerModuleWithProviders: ModuleWithProviders = BsDatepickerModule.forRoot();
export const bsDropdownModuleWithProviders: ModuleWithProviders = BsDropdownModule.forRoot();

