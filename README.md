<p align="center">
  <img height="256px" width="256px" style="text-align: center;" src="https://cdn.rawgit.com/edetec/ng-xform/master/demo/src/assets/logo.svg">
</p>

# ng-xform - Angular library built with ❤ using ngx-library yeoman generator.

[![npm version](https://badge.fury.io/js/ng-xform.svg)](https://badge.fury.io/js/ng-xform),
[![Build Status](https://travis-ci.org/edetec/ng-xform.svg?branch=master)](https://travis-ci.org/edetec/ng-xform)
[![Coverage Status](https://coveralls.io/repos/github/edetec/ng-xform/badge.svg?branch=master)](https://coveralls.io/github/edetec/ng-xform?branch=master)
[![dependency Status](https://david-dm.org/edetec/ng-xform/status.svg)](https://david-dm.org/edetec/ng-xform)
[![devDependency Status](https://david-dm.org/edetec/ng-xform/dev-status.svg?branch=master)](https://david-dm.org/edetec/ng-xform#info=devDependencies)

## Demo

View all the directives in action at https://edetec.github.io/ng-xform

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 2 or higher, tested with 2.0.0)

## Installation
Install above dependencies via *npm*. 

Now install `@esss/ng-xform` via:
```shell
npm install --save @esss/ng-xform
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
import { LibModule } from '@esss/ng-xform';
```
The only remaining part is to list the imported module in your application module. The exact method will be slightly
different for the root (top-level) module for which you should end up with the code similar to (notice ` LibModule .forRoot()`):
```js
import { LibModule } from '@esss/ng-xform';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [LibModule.forRoot(), ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Other modules in your application can simply import ` LibModule `:

```js
import { LibModule } from '@esss/ng-xform';

@NgModule({
  declarations: [OtherComponent, ...],
  imports: [LibModule, ...], 
})
export class OtherModule {
}
```

## Usage



## License

Copyright (c) 2018 Eder Soares. Licensed under the MIT License (MIT)

