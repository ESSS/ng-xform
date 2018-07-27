import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgXformModule } from '@esss/ng-xform';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    NgXformModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule {}
