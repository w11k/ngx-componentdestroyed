import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

export interface OnDestroy {
    ngOnDestroy(): void;
}

export function componentDestroyed(component: OnDestroy): Observable<undefined> {
    const oldNgOnDestroy = component.ngOnDestroy;
    const stop$ = new Subject();
    component.ngOnDestroy = function () {
        oldNgOnDestroy.apply(component);
        stop$.next(undefined);
    };
    return stop$;
}

