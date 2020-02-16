import { Observable } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

export function componentDestroyed(component: { observeOnDestroy(): Observable<void>, ngOnDestroy?(): void }): Observable<void> {
    const modifiedComponent = component as { observeOnDestroy(): Observable<void>, ngOnDestroy?(): void, __componentDestroyed$?: Observable<void> };
    if (modifiedComponent.__componentDestroyed$ !== undefined) {
        return modifiedComponent.__componentDestroyed$;
    }
    // TODO check if we need this
    const oldNgOnDestroy = component.ngOnDestroy;
    modifiedComponent.ngOnDestroy = function () {
        // tslint:disable-next-line strict-boolean-expressions
        oldNgOnDestroy && oldNgOnDestroy.apply(component);
    };

    return modifiedComponent.__componentDestroyed$ = component.observeOnDestroy();
}

export function untilComponentDestroyed<T>(component: { observeOnDestroy(): Observable<void>, ngOnDestroy?(): void }): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
