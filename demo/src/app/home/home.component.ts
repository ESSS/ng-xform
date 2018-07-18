import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {
  TextField, SelectField, MeasureField, NgXformComponent, CheckboxField,
  MultilineField, DateField, DynamicField, NestedFormGroup, RadioGroupField
} from '@esss/ng-xform';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(NgXformComponent) xformComponent: NgXformComponent;
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
  public editing = true;
  public horizontal = false;
  public labelWidth = 2;

  constructor(private titleService: Title, private http: HttpClient) {
    const minDate = new Date();
    const maxDate = new Date();

    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);

    this.fields = [
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
            key: 'street',
            label: 'Street',
            searchHandler: this.observableSource.bind(this),
            searchByValueKeyHandler: this.observableSourceByPlaceId.bind(this),
            searchable: true,
            optionLabelKey: 'formatted_address',
            optionValueKey: 'place_id',
            validators: [
              Validators.required
            ]
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
        modelUnit: 'm',
        viewUnit: Observable.of('cm').delay(200),
        availableUnits: Observable.of(['m', 'cm', 'mm', 'ft']).delay(200)
      }),
      new CheckboxField({
        key: 'news',
        label: 'News'
      }),
      new RadioGroupField({
        key: 'gender',
        label: 'Gender',
        options: Observable.of([{id: 1, label: 'male'}, {id: 2, label: 'female'}]).delay(2000),
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
        maxDate: maxDate
      }),
    ];
  }

  ngOnInit() {
    this.titleService.setTitle('Home | @esss/ng-xform');
  }

  public onSubmit(values: object) {
    this.editing = !this.editing;
    console.log(values);
  }

  populate() {
    this.xformComponent.setValue({
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
      news: true,
      comment: 'Mussum Ipsum, cacilds vidis litro abertis. Mauris nec dolor in eros commodo tempor. Aenean aliquam molestie leo, vitae ' +
      'iaculis nisl. Quem num gosta di mé, boa gentis num é. Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis. Em pé ' +
      'sem cair, deitado sem dormir, sentado sem cochilar e fazendo pose. Leite de capivaris, leite de mula manquis sem cabeça. Praesent ' +
      'vel viverra nisi. Mauris aliquet nunc non turpis scelerisque, eget. Casamentiss faiz malandris se pirulitá. Sapien in monti ' +
      'palavris qui num significa nadis i pareci latim.',
      birth: new Date()
    });
  }

  public observableSource(keyword: any): Observable<any[]> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${keyword}`;
    if (keyword) {
      return this.http.get(url)
        .map((res) => res['results']);
    } else {
      return Observable.of([]);
    }
  }

  public observableSourceByPlaceId(place_id: any): Observable<any> {
    return Observable.of({
      'place_id': 'ChIJn7h-4b9JJ5URGCq6n0zj1tM',
      'formatted_address': 'Florianópolis - State of Santa Catarina, Brazil'
    }).delay(300);
  }
}
