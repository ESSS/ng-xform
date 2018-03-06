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
npm i --save @ng-select/ng-select@0.16.0
npm i --save ngx-bootstrap@2.0.2
```

Now install `@esss/ng-xform` via:
```shell
npm i --save @esss/ng-xform
```

You will need to import styles. Example: 'src/styles.scss'
```css
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '../node_modules/ngx-bootstrap/datepicker/bs-datepicker.css';
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
 <ng-xform #xform (onSubmit)="onSubmit($event)" [model]="model" [fields]="fields" [(editing)]="editing"></ng-xform>
```
Component:
```ts
export class HomeComponent implements OnInit {

  public editing = true;
  public model: any = {};
  private colors: any[] = [
    { id: 1, name: 'blue' },
    { id: 2, name: 'yellow' },
    { id: 3, name: 'white' },
    { id: 4, name: 'black' },
    { id: 5, name: 'orange' },
    { id: 6, name: 'purple' }
  ];

  public fields: DynamicField[];

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
          Validators.required,
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
        key: 'color',
        label: 'Color',
        searchable: true,
        options: this.colors,
        labelAttribute: 'name',
      }),
      new SelectField({
        key: 'address',
        label: 'Address',
        searchHandler: this.observableSource.bind(this),
        searchByValueAttributeHandler: this.observableSourceByPlaceId.bind(this),
        searchable: true,
        labelAttribute: 'formatted_address',
        valueAttribute: 'place_id',
        validators: [
          Validators.required
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
        labelAttribute: 'description',
        valueAttribute: 'id',
        multiple: true
      }),
      new MeasureField({
        key: 'order',
        label: 'Order',
        unit: 'º'
      }),
      new CheckboxField({
        key: 'news',
        label: 'News'
      }),
      new DateField({
        key: 'birth',
        label: 'Date of birth',
        theme: 'blue',
        minDate: minDate,
        maxDate: maxDate,
        locale: 'pt-br',
      }),
    ];
  }

  ngOnInit() {
    this.titleService.setTitle('Home | @esss/ng-xform');
  }

  public onSubmit(values: object) {
    this.editing = !this.editing;
    this.model = values;
    console.log(values);
  }

  populate() {
    this.model = {
      name: 'Customer',
      email: 'customer@mail.com',
      type_tags: [2],
      type: 'b',
      color: { id: 3, name: 'white' },
      address: 'ChIJn7h-4b9JJ5URGCq6n0zj1tM',
      order: 2,
      news: true,
      birth: new Date()
    };
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
    }).delay(500);
  }
}
```

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

Copyright (c) 2018 Eder Soares. Licensed under the MIT License (MIT)

