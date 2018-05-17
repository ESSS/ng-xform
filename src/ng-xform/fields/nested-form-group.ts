import { DynamicField } from './dynamic-field';

export class NestedFormGroup<T = any> extends DynamicField<T> {
    public controlType ? = 'GROUP';
    public key: keyof T;
    public label?: string;
    public fields: DynamicField<any>[];

    constructor(
        options: NestedFormGroup<T>
    ) {
        super(options);
        this.key = options.key;
        this.label = options.label || '';
        this.fields = options.fields;
    }
}
