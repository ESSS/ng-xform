# ng-xform - Angular library built using ngx-library yeoman generator.

[![npm version](https://badge.fury.io/js/%40esss%2Fng-xform.svg)](https://badge.fury.io/js/%40esss%2Fng-xform),
[![Build Status](https://travis-ci.org/ESSS/ng-xform.svg?branch=master)](https://travis-ci.org/ESSS/ng-xform)
[![Coverage Status](https://coveralls.io/repos/github/ESSS/ng-xform/badge.svg?branch=master)](https://coveralls.io/github/ESSS/ng-xform?branch=master)
[![dependencies Status](https://david-dm.org/esss/ng-xform/status.svg)](https://david-dm.org/esss/ng-xform)
[![devDependencies Status](https://david-dm.org/esss/ng-xform/dev-status.svg)](https://david-dm.org/esss/ng-xform?type=dev)

## Demo

View all the directives in action at [Demo](https://esss.github.io/ng-xform) and [Demo source code](https://github.com/ESSS/ng-xform/blob/master/demo/src/app/home/home.component.ts)

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 4 or higher, tested with 5.2.0)

## Installation
Install above dependencies via *npm*. 
```shell
npm i --save @ng-select/ng-select@0.16.0 ngx-bootstrap@2.0.2 mathjs@3.20.2
```

Now install `@esss/ng-xform` via:
```shell
npm i --save @esss/ng-xform
```

You will need to import styles. Example: 'src/styles.scss'
```css
@import '~bootstrap/dist/css/bootstrap.min.css';
@import '~ngx-bootstrap/datepicker/bs-datepicker.css';
@import "~@ng-select/ng-select/themes/default.theme.css";
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
 <ng-xform [horizontalForm]="horizontal" [labelWidth]="labelWidth" (onSubmit)="onSubmit($event)" [fields]="fields" [(editing)]="editing"></ng-xform>
```
Component:
```ts
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
    this.xformComponent.form.patchValue({
      name: 'Customer',
      email: 'customer@mail.com',
      type_tags: [2],
      type: 'b',
      color: { id: 3, name: 'white' },
      color_ro: { id: 3, name: 'white' },
      address: {
        street: 'ChIJn7h-4b9JJ5URGCq6n0zj1tM'
      },
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
