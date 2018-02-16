import { DynamicField } from './dynamic-field';

export class NestedFormGroup extends DynamicField {
    public controlType ? = 'GROUP';
    public key: string;
    public label?: string;
    public fields: DynamicField[];

    constructor(
        options: NestedFormGroup
    ) {
        super(options);
        this.key = options.key;
        this.label = options.label || '';
        this.fields = options.fields;
    }
}
