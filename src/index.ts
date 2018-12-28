import {Observable, ReplaySubject} from "rxjs";
import {takeUntil} from "rxjs/operators";

export function componentDestroyed(component: { ngOnDestroy(): void }): Observable<true> {
    const modifiedComponent = component as { ngOnDestroy(): void, __componentDestroyed$?: Observable<true> };
    if (modifiedComponent.__componentDestroyed$) {
        return modifiedComponent.__componentDestroyed$;
    }
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new ReplaySubject<true>();
    modifiedComponent.ngOnDestroy = function () {
        oldNgOnDestroy && oldNgOnDestroy.apply(component);
        stop$.next(true);
        stop$.complete();
    };
    return modifiedComponent.__componentDestroyed$ = stop$.asObservable();
}

export function untilComponentDestroyed<T>(component: { ngOnDestroy(): void }): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
