import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForceUtcPipe } from './force-utc.pipe';
import { ValueSuffixPipe } from './value-suffix.pipe';
import { NestedAttributePipe } from './nested-attribute.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ForceUtcPipe,
    ValueSuffixPipe,
    NestedAttributePipe,
  ],
  exports: [
    ForceUtcPipe,
    ValueSuffixPipe,
    NestedAttributePipe,
  ]
})
export class PipesModule { }
