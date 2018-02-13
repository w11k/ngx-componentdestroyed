import {Observable} from "rxjs/Observable";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";

export type OnDestroyLike = {
    ngOnDestroy(): void;
}

export function componentDestroyed(component: OnDestroyLike): Observable<true> {
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new Subject<true>();
    component.ngOnDestroy = function () {
        oldNgOnDestroy && oldNgOnDestroy.apply(component, arguments);
        stop$.next(true);
        stop$.complete();
    };
    return stop$.asObservable();
}

export function untilComponentDestroyed<T>(component: OnDestroyLike): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
