import { Component, Input } from '@angular/core';


/**
 * Component to display optional tag
 *
 * :show: Flag to control component state
 */
@Component({
  selector: 'ng-xform-optional-tag',
  template: `<small *ngIf="show" style="color: gray">(optional)</small>`,
})
export class OptionalTagComponent {
  @Input() show = false;
}
