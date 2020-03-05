
[![Build Status](https://travis-ci.org/w11k/ngx-componentdestroyed.svg?branch=master)](https://travis-ci.org/w11k/ngx-componentdestroyed)
[![npm version](https://badge.fury.io/js/%40w11k%2Fngx-componentdestroyed.svg)](https://badge.fury.io/js/%40w11k%2Fngx-componentdestroyed)

# Unsubscribe from Observables in Angular

This library provides utility methods which help to unsubscribe from ReactiveX's Observables in Angular applications.

**If you already use this library and want to use it with Angular 9:** Please check the [Migration Guide](https://github.com/w11k/ngx-componentdestroyed#migration-guide-4xx---5xx).

## Why?

Failing to unsubscribe from observables will lead to unwanted memory leaks as the observable stream is left open, potentially even after a component has been destroyed or the user has navigated to another page.

*Important*: If services are used in [Hierarchical Dependency Injectors](https://angular.io/guide/hierarchical-dependency-injection#hierarchical-dependency-injectors) they are affected by the same memory-leak issue!

This blog post provides additional information:

https://medium.com/thecodecampus-knowledge/the-easiest-way-to-unsubscribe-from-observables-in-angular-5abde80a5ae3

## Patrons

❤️ [W11K - The Web Engineers](https://www.w11k.de/)

❤️ [theCodeCampus - Trainings for Angular and TypeScript](https://www.thecodecampus.de/)

## First: Check your Angular version!

If you are using Angular <= 8 or Angular 9 with ViewEngine instead of Ivy, you have to use a previous version of this library. Please see [ViewEngine usage](https://github.com/w11k/ngx-componentdestroyed/blob/master/docs/viewengine.md) for further instructions. If you are using the latest Angular version and if you have no idea what ViewEngine or Ivy is, just continue with the instructions below.

## Demo

```
@Component({
    selector: 'foo',
    templateUrl: './foo.component.html'
})
export class FooComponent 
            extends OnDestroyMixin                  // <--- 1. extend OnDestroyMixin 
            implements OnInit { 

    ngOnInit() {
        interval(1000)
            .pipe(
                untilComponentDestroyed(this)       // <--- 2. use the pipe operator
            )
            .subscribe();
  }

}
```

The TypeScript compiler will check that your component extends `OnDestroyMixin` when you try to use `untilComponentDestroyed`.

## Installation

**Download the NPM package**

```
npm i --save @w11k/ngx-componentdestroyed
```
## Usage

**Prepare the class**

Your component class must extend `OnDestroyMixin`:

```
import {OnDestroyMixin} from "@w11k/ngx-componentdestroyed";

@Component({
    selector: 'foo',
    templateUrl: './foo.component.html'
})
export class FooComponent extends OnDestroyMixin {  // <--- HERE 
    ...
}
```

**Use the pipe operator**

Either use

- `untilComponentDestroyed(this)`
- `takeUntil(componentDestroyed(this))`
 
as the last Observable pipe operator.

```
import {interval} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {untilComponentDestroyed} from "@w11k/ngx-componentdestroyed";


interval(1000)
    .pipe(
        untilComponentDestroyed(this)               // <--- HERE
    )
    .subscribe();
```

## Migration guide 4.x.x -> 5.x.x

1. The component class has to extend `OnDestroyMixin` (import from `@w11k/ngx-componentdestroyed`).
2. If the component class has a constructor (very likely), you have to call `super()` at the beginning. The TypeScript compiler will complain if you don't.
3. You **must** either remove the existing `ngOnDestroy()` method (if empty, recommended) or call `super.ngOnDestroy()` within.

## TSLint rule

Our sister project [@w11k/rx-ninja](https://github.com/w11k/rx-ninja) provides a TSLint rule to enforce the use a terminator operator. If you want to use `untilComponentDestroyed(this)` instead of `takeUntil(componentDestroyed(this))` please add this configuration to your tslint.json file:

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

## A note on Ivy, ViewEngine, AoT on/off, Karma, Jest, ...

We tried everything but the current state of Angular's Ivy compilation is a f@#!ing nightmare: 

- Base classes do not work with ViewEngine
- Ivy doesn't work with patching at runtime (this library version <= 4)
- Decorator tricks rely on Angular internals and **will** break in the future ...
- ... they don't work with Karma or Jest
- ... but even if the don't break, they don't work with AoT compilation turned off
