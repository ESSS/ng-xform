import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'ng-xform-edit-save-cancel-button-bar',
    templateUrl: './edit-save-cancel-button-bar.component.html',
})
export class EditSaveCancelButtonBarComponent {

    @Input() editing = false;
    @Output() save = new EventEmitter();
    @Output() cancel = new EventEmitter();
    @Output() edit = new EventEmitter();

}
