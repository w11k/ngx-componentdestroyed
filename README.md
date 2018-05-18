
[![Build Status](https://travis-ci.org/w11k/ng2-rx-componentdestroyed.svg?branch=master)](https://travis-ci.org/w11k/ng2-rx-componentdestroyed)
[![npm version](https://badge.fury.io/js/ng2-rx-componentdestroyed.svg)](https://badge.fury.io/js/ng2-rx-componentdestroyed)


# New version 3.0.0 **breaking change**

- Requires >= RxJS 6.0.0


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
npm i --save ng2-rx-componentdestroyed
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
import {untilComponentDestroyed} from "ng2-rx-componentdestroyed";

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
