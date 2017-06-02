# Unsubscribe from Observables in Angular Components

This small library provides a utility method that helps to unsubscribe from ReactiveX's Observables in Angular Components.

## Demo

```javascript




```

## Installation / Usage

### Download the NPM package

```bash
npm i --save ng2-rx-componentdestroyed
```

### Prepare the Angular Component class

The component class must have a `ngOnDestroy()` method (it can be empty):

```javascript


```

### Usage

Combine the Observable operator `takeUntil` with this library. This only works inside Angular Component since this library uses the component's life cycle hooks to determine when the Observable is not needed anymore.

```javascript

```
