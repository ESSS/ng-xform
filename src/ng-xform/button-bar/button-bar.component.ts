import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'ng-xform-button-bar',
    templateUrl: './button-bar.component.html',
})
export class ButtonBarComponent {

    @Input() editing = false;
    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() edit = new EventEmitter();

}
