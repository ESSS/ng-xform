import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import {
  CheckboxField,
  DateField,
  DateRangeField,
  DynamicField,
  MeasureField,
  MultilineField,
  NestedFormGroup,
  NgXformEditSaveComponent,
  RadioGroupField,
  SelectField,
  TextField,
  CustomField,
  NumberField
} from '@esss/ng-xform';
import { Observable, of } from 'rxjs';
import { delay, map, buffer, skip } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(NgXformEditSaveComponent) xformComponent: NgXformEditSaveComponent;
  @ViewChild('customField') customFieldTmpl: TemplateRef<any>;

  private colors: any[] = [
    { id: 0, name: 'other' },
    { id: 1, name: 'blue' },
    { id: 2, name: 'yellow' },
    { id: 3, name: 'white' },
    { id: 4, name: 'black' },
    { id: 5, name: 'orange' },
    { id: 6, name: 'purple' }
  ];

  public fields: DynamicField[];
  public horizontal = false;
  public editing = true;
  public labelWidth = 2;
  public model: any;

  constructor(private titleService: Title, private http: HttpClient) { }

  ngOnInit() {
    const minDate = new Date();
    const maxDate = new Date();

    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);
    this.titleService.setTitle('Home | @esss/ng-xform');
    this.fields = [
      new NumberField({
        key: 'number',
        label: 'Number'
      }),
      new TextField({
        key: 'name',
        label: 'Name',
        validators: [
          Validators.minLength(3)
        ]
      }),
      new TextField({
        key: 'email',
        label: 'E-mail',
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      new SelectField({
        key: 'color_ro',
        label: 'Color read-only',
        readOnly: true,
        searchable: true,
        options: this.colors,
        optionLabelKey: 'name',
      }),
      new SelectField({
        key: 'color',
        label: 'Color',
        searchable: true,
        options: this.colors,
        addNewOption: true,
        addNewOptionText: 'Add Color',
        optionLabelKey: 'name',
      }),
      new TextField({
        key: 'other',
        label: 'Other color',
        visibilityFn: (value: any) => value.color && value.color.id === 0
      }),
      new NestedFormGroup({
        key: 'address',
        fields: [
          new SelectField({
            key: 'country',
            label: 'Country',
            searchHandler: this.observableSource.bind(this),
            searchByValueKeyHandler: this.observableSourceByPlaceId.bind(this),
            searchOnFocus: true,
            searchable: true,
            optionLabelKey: 'name',
            optionValueKey: 'alpha3Code'
          })
        ]
      }),
      new SelectField({
        key: 'type',
        label: 'Type',
        options: ['a', 'b'],
        validators: [
          Validators.required
        ]
      }),
      new SelectField({
        key: 'type_tags',
        label: 'Type tags',
        options: [{id: 1, description: 'A'}, {id: 2, description: 'B'}, {id: 3, description: 'C'}],
        optionLabelKey: 'description',
        optionValueKey: 'id',
        multiple: true
      }),
      new MeasureField({
        key: 'length',
        label: 'Length',
        modelUnit: 'mm',
        viewUnit: of('m').pipe(delay(200)),
        availableUnits: of(['m', 'cm', 'mm']).pipe(delay(200))
      }),
      new MeasureField({
        key: 'width',
        label: 'Width',
        modelUnit: 'inch',
        viewUnit: of('inch').pipe(delay(200)),
        availableUnits: of(['inch', 'ft']).pipe(delay(200))
      }),
      new CheckboxField({
        key: 'news',
        label: 'News'
      }),
      new RadioGroupField({
        key: 'gender',
        label: 'Gender',
        options: of([{id: 1, label: 'male'}, {id: 2, label: 'female'}]).pipe(delay(2000)),
        optionValueKey: 'id',
        optionLabelKey: 'label'
      }),
      new MultilineField({
        key: 'comment',
        label: 'Comment',
        rows: 4
      }),
      new DateField({
        key: 'birth',
        label: 'Date of birth',
        theme: 'blue',
        minDate: minDate,
        maxDate: maxDate,
        showWeekNumbers: true
      }),
      new DateRangeField({
        key: 'range',
        label: 'Date range',
        theme: 'blue'
      }),
      new CustomField({
        key: 'custom_amount',
        label: 'Custom Field Amount',
        tmpl: this.customFieldTmpl
      }),
    ];
  }

  public onSubmit(values: object) {
    this.model = values;
  }

  populate() {
    this.xformComponent.setValue({
      number: 7846509780989089080945.654,
      name: 'Customer',
      email: 'customer@mail.com',
      type_tags: [2],
      type: 'b',
      color: { id: 3, name: 'white' },
      color_ro: { id: 3, name: 'white' },
      address: {
        street: 'ChIJn7h-4b9JJ5URGCq6n0zj1tM'
      },
      gender: 1,
      length: { value: 2, unit: 'm'},
      width: { value: 3, unit: 'ft'},
      news: true,
      comment: 'Mussum Ipsum, cacilds vidis litro abertis. Mauris nec dolor in eros commodo tempor. Aenean aliquam molestie leo, vitae ' +
      'iaculis nisl. Quem num gosta di mé, boa gentis num é. Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis. Em pé ' +
      'sem cair, deitado sem dormir, sentado sem cochilar e fazendo pose. Leite de capivaris, leite de mula manquis sem cabeça. Praesent ' +
      'vel viverra nisi. Mauris aliquet nunc non turpis scelerisque, eget. Casamentiss faiz malandris se pirulitá. Sapien in monti ' +
      'palavris qui num significa nadis i pareci latim.',
      birth: new Date(),
      range: [
        '2018-09-06T03:00:00.000Z',
        '2018-10-08T03:00:00.000Z'
      ],
      custom_amount: 456
    });
  }

  public observableSource(keyword: any): Observable<any[]> {
    const url = `https://restcountries.eu/rest/v2/name/${keyword}`;
    if (keyword) {
      return this.http.get(url)
        .pipe(
          map((res) => res as any[])
        );
    } else {
      return of([]);
    }
  }

  public observableSourceByPlaceId(keyword: any): Observable<any> {
    return of({
      'alpha3Code': 'BRA',
      'name': 'Brazil'
    }).pipe(delay(300));
  }
}
