import { Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";

export function componentDestroyed(component: { observeOnDestroy(): Observable<void> }): Observable<void> {
    const modifiedComponent = component as { observeOnDestroy(): Observable<void>, ngOnDestroy?(): void, __componentDestroyed$?: Observable<void> };
    if (modifiedComponent.__componentDestroyed$ !== undefined) {
        return modifiedComponent.__componentDestroyed$;
    }

    return modifiedComponent.__componentDestroyed$ = component.observeOnDestroy();
}

export function untilComponentDestroyed<T>(component: { observeOnDestroy(): Observable<void> }): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
