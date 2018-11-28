import { BsLocaleService, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { AppComponent } from './app.component';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale, glLocale } from 'ngx-bootstrap/locale';

// register angular locale
registerLocaleData(localePt, 'pt');

// register ngx-bootstrap locales
defineLocale('pt', ptBrLocale);


@NgModule({
  declarations: [AppComponent],
  imports: [
    // Add .withServerTransition() to support Universal rendering.
    // The application ID can be any identifier which is unique on
    // the page.
    BrowserModule.withServerTransition({ appId: 'ng-xform-demo-id' }),
    TransferHttpCacheModule,
    FormsModule,
    HttpModule,
    BsDatepickerModule.forRoot(),
    AppRoutingModule,
    AppSharedModule,
    HomeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(bsLocaleService: BsLocaleService) {
    // aplly locale
    bsLocaleService.use('en');
  }
}
