import { Component, Input } from '@angular/core';


/**
 * Component to display optional tag
 *
 * :show: Flag to control component state
 */
@Component({
  selector: 'ng-xform-required-field-tag',
  template: `
    <small *ngIf="!horizontal && optional" style="color: gray">(optional)</small>
    <span *ngIf="horizontal && !optional" style='color: red'>*</span>
  `,
})
export class OptionalTagComponent {
  @Input() optional = false;
  @Input() horizontal = false;
}
