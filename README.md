
[![Build Status](https://travis-ci.org/w11k/ngx-componentdestroyed.svg?branch=master)](https://travis-ci.org/w11k/ngx-componentdestroyed)
[![npm version](https://badge.fury.io/js/@w11k/ngx-componentdestroyed.svg)](https://badge.fury.io/js/@w11k/ngx-componentdestroyed)


# Unsubscribe from Observables in Angular

This library provides utility methods which help to unsubscribe from ReactiveX's Observables in Angular applications.

**Why?**

Angular applications suffer from memory leak issues if they subscribe Observables without *unsubscribing*   


(*Why trigger on `@Injectable()`?*: If services are used in [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection#hierarchical-dependency-injectors) they are affected by the same memory-leak issue!)



This blog post provides additional information:

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

- `untilComponentDestroyed(this)` or 
- `componentDestroyed(this)` together with `takeUntil()` 

as an Observable pipe operator. The TypeScript compiler will ensure that `this`' class implements a `ngOnDestroy()` method.


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

- a class is annotated with `Component`, `Directive`, `Pipe` or `Service`
- and `Observable#subscribe()` is called inside that class

and then enforces that 

- `.pipe()` is called directly before `.subscribe()`
- and that either `untilComponentDestroyed()` or `takeUntil()` is called as the last pipe operator


### Installation 

**Adjust your tslint.json**

```
{
  "rulesDirectory": [
    "node_modules/@w11k/ngx-componentdestroyed/dist/tslint"
  ],
  "rules": {
    "w11k-rxjs-angular-subscribe-takeuntil": true
  }
}
```

**Run tslint with type info**

```
tslint -p tsconfig.json
```
