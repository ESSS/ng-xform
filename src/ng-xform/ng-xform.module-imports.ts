import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModuleWithProviders } from '@angular/core';

/** Issue: Having a problem when creating package with RouterModule imported in NgModule decorator
 * https://github.com/dherges/ng-packagr/issues/778#issuecomment-385122626
 */
export const bsDatepickerModuleWithProviders: ModuleWithProviders = BsDatepickerModule.forRoot();
export const bsDropdownModuleWithProviders: ModuleWithProviders = BsDropdownModule.forRoot();
