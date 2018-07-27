import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { AppComponent } from './app.component';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale, enGbLocale } from 'ngx-bootstrap/locale';
defineLocale(ptBrLocale.abbr, ptBrLocale);
defineLocale('en-us', enGbLocale);

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
    AppRoutingModule,
    AppSharedModule,
    HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(bsLocaleService: BsLocaleService) {
    // aplly locale
    bsLocaleService.use(ptBrLocale.abbr);
  }
}
