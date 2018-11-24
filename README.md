
[![Build Status](https://travis-ci.org/w11k/ngx-componentdestroyed.svg?branch=master)](https://travis-ci.org/w11k/ngx-componentdestroyed)
[![npm version](https://badge.fury.io/js/ngx-componentdestroyed.svg)](https://badge.fury.io/js/ngx-componentdestroyed)


# Unsubscribe from Observables in Angular Components

This library provides utility methods which help to unsubscribe from ReactiveX's Observables in Angular Components. This blog post provides a detailed explanation:

https://medium.com/thecodecampus-knowledge/the-easiest-way-to-unsubscribe-from-observables-in-angular-5abde80a5ae3

**Requirements**

- Requires >= RxJS 6.0.0 (part of Angular 6)

## Demo

```
@Component({
  selector: 'foo',
  templateUrl: './foo.component.html'
})
export class FooComponent implements OnInit, OnDestroy {

  ngOnInit() {
    Observable.interval(1000)
        .pipe(
            untilComponentDestroyed(this) // <--- magic is here!
        )
        .subscribe(console.log);
  }

  ngOnDestroy() {
  }
  
}
```

## Installation

**Download the NPM package**

```
npm i --save @w11k/ngx-componentdestroyed
```

**Prepare the Angular Component class**

The component class must have a `ngOnDestroy()` method (it can be empty):

```
@Component({
  selector: 'foo',
  templateUrl: './foo.component.html'
})
export class FooComponent implements OnDestroy {

  // ...

  ngOnDestroy() {
  }
  
}
```

## Usage

Either use 

- `untilComponentDestroyed()` or 
- `componentDestroyed()` together with `takeUntil()` 

as an Observable pipe operator. This only works inside Angular components since this library uses the component's life cycle hooks to determine when the Observable is not needed anymore.


**untilComponentDestroyed()**

```
import {untilComponentDestroyed} from "@w11k/ngx-componentdestroyed";

Observable.interval(1000)
    .pipe(
        untilComponentDestroyed(this)
    )
    .subscribe();
```

**componentDestroyed()**

```
import {takeUntil} from "rxjs/operators";
import {componentDestroyed} from "@w11k/ngx-componentdestroyed";


Observable.interval(1000)
    .pipe(
        takeUntil(componentDestroyed(this))
    )
    .subscribe();
```

## TSLint rule

To enforce this code style, add the provided TSLint rule. This rule triggers if

- a file imports `Component` from `@angular/core`
- and the class' name ends with `Component`
- and `Observable#subscribe()` is called inside that class

and then enforces that 

- `.pipe()` is called directly before `.subscribe()`
- and that either `untilComponentDestroyed()` or `takeUntil(...)` is called as the last pipe operator

### Installation 

**Adjust your tslint.json**

```
{
  "rulesDirectory": [
    "node_modules/@w11k/ngx-componentdestroyed/dist/tslint"
  ],
  "rules": {
    "w11k-rxjs-angular-component-subscribe-takeuntil": true
  }
}
```

**Run tslint with type info**

```
tslint -p tsconfig.json
```
