import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForceUtcPipe } from './force-utc.pipe';
import { ValueSuffixPipe } from './value-suffix.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ForceUtcPipe,
    ValueSuffixPipe
  ],
  exports: [
    ForceUtcPipe,
    ValueSuffixPipe
  ]
})
export class PipesModule { }
