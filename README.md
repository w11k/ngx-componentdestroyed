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
      .takeUntil(componentDestroyed(this)) // <--- magic is here!
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

Combine the Observable operator `takeUntil()` with this library. This only works inside Angular components since this library uses the component's life cycle hooks to determine when the Observable is not needed anymore.

```
Observable.interval(1000)
  .takeUntil(componentDestroyed(this))
  .subscribe(console.log);
```
