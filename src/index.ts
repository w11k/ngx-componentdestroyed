import {Observable} from "rxjs/Observable";
import {takeUntil} from "rxjs/operators";
import {ReplaySubject} from "rxjs/ReplaySubject";

export function componentDestroyed(component: any): Observable<true> {
    if (component.__componentDestroyed$) {
        return component.__componentDestroyed$;
    }
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new ReplaySubject<true>();
    component.ngOnDestroy = function () {
        oldNgOnDestroy && oldNgOnDestroy.apply(component, arguments);
        stop$.next(true);
        stop$.complete();
    };
    return component.__componentDestroyed$ = stop$.asObservable();
}

export function untilComponentDestroyed<T>(component: any): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
