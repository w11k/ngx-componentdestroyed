
[![Build Status](https://travis-ci.org/w11k/ngx-componentdestroyed.svg?branch=master)](https://travis-ci.org/w11k/ngx-componentdestroyed)
[![npm version](https://badge.fury.io/js/%40w11k%2Fngx-componentdestroyed.svg)](https://badge.fury.io/js/%40w11k%2Fngx-componentdestroyed)

# Unsubscribe from Observables in Angular

This library provides utility methods which help to unsubscribe from ReactiveX's Observables in Angular applications.

**Why?**

Failing to unsubscribe from observables will lead to unwanted memory leaks as the observable stream is left open, potentially even after a component has been destroyed or the user has navigated to another page.

*Important*: If services are used in [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection#hierarchical-dependency-injectors) they are affected by the same memory-leak issue!

This blog post provides additional information:

https://medium.com/thecodecampus-knowledge/the-easiest-way-to-unsubscribe-from-observables-in-angular-5abde80a5ae3

**Patrons**

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)

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
        .subscribe();
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

**Prepare the class**

The class must have a `ngOnDestroy()` method (it can be empty):

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

- `untilComponentDestroyed(this)`
- `takeUntil(componentDestroyed(this))`
 
as the last Observable pipe operator. The TypeScript compiler will ensure that `this`' class implements a `ngOnDestroy()` method.

```
import {takeUntil} from "rxjs/operators";
import {componentDestroyed} from "@w11k/ngx-componentdestroyed";


Observable.interval(1000)
    .pipe(
        untilComponentDestroyed(this)
    )
    .subscribe();
```

## TSLint rule

Our sister project [@w11k/rx-ninja](https://github.com/w11k/rx-ninja) provides a TSLint rule to enforce the use a terminator operator. If you want to use `untilComponentDestroyed(this)` instead of `takeUntil(componentDestroyed(this))` please add this configuration:

```
{
  "rulesDirectory": [
    "node_modules/@w11k/rx-ninja/dist/tslint_rules"
  ],
  "rules": {
    "rx-ninja-subscribe-takeuntil": [true, "takeUntil", "untilComponentDestroyed"]
  }
}
```
