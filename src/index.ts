import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

export type OnDestroyLike = {
    ngOnDestroy(): void;
}

export function componentDestroyed(component: OnDestroyLike): Observable<undefined> {
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new Subject();
    component.ngOnDestroy = function () {
        oldNgOnDestroy && oldNgOnDestroy.apply(component);
        stop$.next(undefined);
        stop$.complete();
    };
    return stop$;
}

