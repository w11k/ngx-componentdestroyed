
[![Build Status](https://travis-ci.org/w11k/ngx-componentdestroyed.svg?branch=master)](https://travis-ci.org/w11k/ngx-componentdestroyed)
[![npm version](https://badge.fury.io/js/ngx-componentdestroyed.svg)](https://badge.fury.io/js/ngx-componentdestroyed)


# Version 4.0.0 - new name

- This package was renamed to '@w11k/ngx-componentdestroyed'


# Requirements

- Requires >= RxJS 6.0.0 (part of Angular 6)


# Unsubscribe from Observables in Angular Components

This small library provides a utility method that helps to unsubscribe from ReactiveX's Observables in Angular Components.

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

## Installation / Usage

### Download the NPM package

```
npm i --save @w11k/ngx-componentdestroyed
```

### Prepare the Angular Component class

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

### Usage

Use the `untilComponentDestroyed()` method as an Observable pipe operator. This only works inside Angular components since this library uses the component's life cycle hooks to determine when the Observable is not needed anymore.

```
import {untilComponentDestroyed} from "@w11k/ngx-componentdestroyed";

...
...

Observable.interval(1000)
    .pipe(
        untilComponentDestroyed(this)
    )
    .subscribe(console.log);
```

## More information

https://medium.com/thecodecampus-knowledge/the-easiest-way-to-unsubscribe-from-observables-in-angular-5abde80a5ae3
