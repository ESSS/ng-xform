import { DynamicField } from './dynamic-field';

export class NestedObjectField extends DynamicField {
    public controlType ? = 'GROUP';
    public key: string;
    public label?: string;
    public fields: DynamicField[];

    constructor(
        options: NestedObjectField
    ) {
        super(options);
        this.key = options.key;
        this.label = options.label || '';
        this.fields = options.fields;
    }
}
