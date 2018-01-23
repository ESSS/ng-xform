import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  NgXformModule  } from '@esss/ng-xform';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
        NgXformModule,
        ReactiveFormsModule,
        FormsModule,
        HomeRoutingModule,
    ],
    declarations: [HomeComponent],
})
export class HomeModule { }
