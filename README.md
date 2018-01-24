# ng-xform - Angular library built using ngx-library yeoman generator.

[![npm version](https://badge.fury.io/js/%40esss%2Fng-xform.svg)](https://badge.fury.io/js/%40esss%2Fng-xform),
[![Build Status](https://travis-ci.org/ESSS/ng-xform.svg?branch=master)](https://travis-ci.org/ESSS/ng-xform)
[![Coverage Status](https://coveralls.io/repos/github/ESSS/ng-xform/badge.svg?branch=master)](https://coveralls.io/github/ESSS/ng-xform?branch=master)
[![dependencies Status](https://david-dm.org/esss/ng-xform/status.svg)](https://david-dm.org/esss/ng-xform)
[![devDependencies Status](https://david-dm.org/esss/ng-xform/dev-status.svg)](https://david-dm.org/esss/ng-xform?type=dev)

## Demo

View all the directives in action at https://esss.github.io/ng-xform

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 4 or higher, tested with 5.2.0)

## Installation
Install above dependencies via *npm*. 
```shell
npm i --save @ngui/auto-complete@^0.16.1
```

Now install `@esss/ng-xform` via:
```shell
npm i --save @esss/ng-xform
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
 <ng-xform (onSubmit)="onSubmit($event)" [fields]="fields" [editing]="editing"></ng-xform>
```
Component:
```ts
export class SampleComponent {

  public editing = true;
  public fields = [
    new TextField({
      key: 'name',
      label: 'Name',
      validators: [
        Validators.required,
        Validators.minLength(3)
      ]
    }),
    new AutocompleteField({
      key: 'color',
      label: 'Color',
      source: [{id: 1, name: 'Green'}, {id: 2, name: 'Blue'}, { id: 3, name: 'Yellow'}],
      listFormatter: 'id - name',
      valueFormatter: 'name'
    }),
    new AutocompleteField({
      key: 'address',
      label: 'Address',
      source: this.observableSource.bind(this),
      listFormatter: 'formatted_address',
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
      key: 'type',
      label: 'Type',
      options: ['a', 'b'],
      validators: [
        Validators.required
      ]
    }),
    new MeasureField({
      key: 'order',
      label: 'Order',
      // unit: 'º', // Do you can define a symbol here.
    })
  ];

  constructor(private http: HttpClient) {}

  public onSubmit(values: object) {
    this.editing = false;
    this.values = values;
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
}
```

## License

Copyright (c) 2018 Eder Soares. Licensed under the MIT License (MIT)

