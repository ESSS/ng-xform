# ng-xform - Angular library built using ngx-library yeoman generator.

[![npm version](https://badge.fury.io/js/%40esss%2Fng-xform.svg)](https://badge.fury.io/js/%40esss%2Fng-xform),
[![Build Status](https://travis-ci.org/ESSS/ng-xform.svg?branch=master)](https://travis-ci.org/ESSS/ng-xform)
[![Coverage Status](https://coveralls.io/repos/github/ESSS/ng-xform/badge.svg?branch=master)](https://coveralls.io/github/ESSS/ng-xform?branch=master)
[![dependencies Status](https://david-dm.org/esss/ng-xform/status.svg)](https://david-dm.org/esss/ng-xform)
[![devDependencies Status](https://david-dm.org/esss/ng-xform/dev-status.svg)](https://david-dm.org/esss/ng-xform?type=dev)

## Demo

View all the directives in action at [Demo](https://esss.github.io/ng-xform) and [Demo source code](https://github.com/ESSS/ng-xform/blob/master/demo/src/app/home/home.component.ts)

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 6, tested with 6.1.0)

## Installation
Install above dependencies via *npm*. 
```shell
npm i --save @ng-select/ng-select@2.3.5 ngx-bootstrap@3.0.1 mathjs@3.20.2
```

Now install `@esss/ng-xform` via:
```shell
npm i --save @esss/ng-xform
```

You will need to import styles. Example: 'src/styles.scss'
```css
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'ngx-bootstrap/datepicker/bs-datepicker.css';
@import "@ng-select/ng-select/themes/default.theme.css";
```

Setup the MeasureComponent adding the js file on .angular-cli.json 
```json
"scripts": [
  "../node_modules/mathjs/dist/math.js"
]
```

---
##### SystemJS
>**Note**:If you are using `SystemJS`, you should adjust your configuration to point to the UMD bundle.
In your systemjs config file, `map` needs to tell the System loader where to look for `@esss/ng-xform`:
```js
map: {
  '@esss/ng-xform': 'node_modules/@esss/ng-xform/bundles/ng-xform.umd.js',
}
```
---

Once installed you need to import the main module:
```js
import { NgXformModule } from '@esss/ng-xform';
```
The only remaining part is to list the imported module in your application module. The exact method will be slightly
different for the root (top-level) module for which you should end up with the code similar to (notice ` NgXformModule`):
```js
import { NgXformModule } from '@esss/ng-xform';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [NgXformModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Other modules in your application can simply import ` NgXformModule `:

```js
import { NgXformModule } from '@esss/ng-xform';

@NgModule({
  declarations: [OtherComponent, ...],
  imports: [NgXformModule, ...], 
})
export class OtherModule {
}
```

## Usage
Template:
```html
 <ng-xform [horizontalForm]="horizontal" [labelWidth]="labelWidth" [fields]="fields" ></ng-xform>
```
Component:
```ts
export class HomeComponent implements OnInit, OnDestroy {

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

  public onchangefn = new Subject<string>();

  public fields: DynamicField[];
  public horizontal = false;
  public labelWidth = 2;
  public model: any;
  public outputhelper = {'A': 1, 'B': 2, 'C': 3};
  public subscriptions: Subscription[] = [];

  constructor(private titleService: Title, private http: HttpClient) { }

  ngOnInit() {
    const minDate = new Date();
    const maxDate = new Date();

    this.subscriptions.push(this.onchangefn.asObservable().subscribe(
      (value: any) =>  this.xformComponent.setValue({'outputopt': this.outputhelper[value]})
    ));

    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);
    this.titleService.setTitle('Home | @esss/ng-xform');
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
            key: 'country',
            label: 'Country',
            searchHandler: this.observableSource.bind(this),
            searchByValueKeyHandler: this.observableSourceByPlaceId.bind(this),
            searchOnFocus: true,
            searchable: true,
            optionLabelKey: 'name',
            optionValueKey: 'alpha3Code',
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
      new SelectField({
        key: 'opt',
        label: 'Select an option',
        options: [{id: 'A', description: 'Option A'}, {id: 'B', description: 'Option B'}, {id: 'C', description: 'Option C'}],
        optionLabelKey: 'description',
        optionValueKey: 'id',
        onChangeFn: (value: string) => {
          this.onchangefn.next(value);
        }
      }),
      new TextField({
        key: 'outputopt',
        label: 'Output of option',
        readOnly: true,
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

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onSubmit(values: object) {
    this.model = values;
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
      width: { value: 3, unit: 'ft'},
      opt: 'A',
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
```
### Custom Field

It's possible to create your own field template and set it on dynamic field list through CustomField

Example:
`my-component.html`
```html
<ng-template #customField let-customControl="control" let-isEditing="isEditing">
  <div class="input-group">
    <div class="input-group-addon">$</div>
    <input type="number"
      [formControl]="customControl"
      [attr.disabled]="!isEditing || null" 
      class="form-control"
      style="text-align:right" 
      id="exampleInputAmount" 
      placeholder="Amount" />
    <div class="input-group-addon">.00</div>
  </div>
</ng-template>
```

`my-component.ts`
```ts

  @ViewChild('customField') customFieldTmpl: TemplateRef<any>;
  public fields: DynamicField[];
  ...
  ngOnInit() {
    this.fields = [
      new CustomField({
        key: 'custom_amount',
        label: 'Custom Field Amount',
        tmpl: this.customFieldTmpl
      }),
    ];
  }
``` 

### Typed key validation

Now it is possible to define a type that will be used to validate the key field values

Example:
```ts

class Address {
  street: string;
  city: string;
}

class User {
  name: string;
  email: string;
  address: Address;
}

export class UserComponent {

  public fields: DynamicField[];

  constructor() {

    this.fields = [
      new TextField<User>({
        key: 'name',
        label: 'Name',
        validators: [
          Validators.minLength(3)
        ]
      }),
      new TextField<User>({
        key: 'email',
        label: 'E-mail',
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      new NestedFormGroup<User>({
        key: 'address',
        fields: [
          new TextField<Address>({
            key: 'street',
            label: 'Street',
          }),
          new TextField<Address>({
            key: 'city',
            label: 'City',
          }),
        ]
      })
    ];
  }
}
```

In the example, the ```TextField``` is created specialized whit the ```User``` class
```ts
new TextField<User>({
``` 
the TextField ```key``` attribute will accept only keys of the class User (i.e. 'name', 'email', 'address'), and show and error if any other value is provided.

### On change function
You can add a parameter ```onChangeFn``` on your ```DynamicField``` fields. This parameter receives a 
anonymous function, just like in the following example:

```ts
new TextField({
  key: 'phrase',
  label: 'Write a phrase',
  onChangeFn: (value: string) => {
    // push new typed value to a subject
    this.onchangefnSubject.next(value);
  }
}),
```
This parameter can be used to execute async functions that depends on user input or push values of 
a field to a ```Subject()``` just like is shown above. 


### Locales
DatepickerField can use different locales. 

It's possible to change a locale by calling use method of BsLocaleService, list of available locales is in dropdown below.

To use a different locale, you have to import it from ngx-bootstrap/chronos first, then define it in your @NgModule using function defineLocale

Example: 

```ts
import { defineLocale, LocaleData } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
defineLocale(ptBrLocale.abbr, ptBrLocale);

...

export class AppModule {

  constructor(bsLocaleService: BsLocaleService) {
    // aplly locale
    bsLocaleService.use(ptBrLocale.abbr);
  }
}
```

[Demo source code](https://github.com/ESSS/ng-xform/blob/master/demo/src/app/app.module.ts) load locales.

## Development

After cloning of this repository will be necessary run once ```npm run setup```, so will be able to run ```npm run demo``` to start the demo locally

For more information view common development activities on https://github.com/tinesoft/generator-ngx-library#development

## License

Copyright (c) 2018 ESSS. Licensed under the MIT License (MIT)
