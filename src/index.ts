import {Observable, ReplaySubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

/*
function getInternalAngularComponent<T>(type: any): any {
    noinspection JSNonASCIINames
    // return type.ɵdir || type.ɵcmp;
}

export function ObserveOnDestroy() {
    return (target: any) => {
        const componentDefinition = getInternalAngularComponent(target);
        if (componentDefinition) {
            const old = componentDefinition.onDestroy;
            componentDefinition.onDestroy = function (this: any) {
                const onDestroySubject = componentDestroyed(this) as Subject<void>;
                onDestroySubject.next();

                if (old !== undefined && old !== null) {
                    old();
                }
            };
        } else {
            throw new Error("Ivy and AoT must be enabled for @ObserveOnDestroy().");
        }

        function decorated(this: any) {
            const instance = Reflect.construct(target, arguments);
            instance[ON_DESTROY_SUBJECT_KEY] = new ReplaySubject(1);
            return instance;
        }

        Object.setPrototypeOf(decorated, target);
        return decorated as any;
    };
}
*/

const ON_DESTROY_SUBJECT_KEY = Symbol("ON_DESTROY_SUBJECT_KEY");

export type ComponentWithOnDestroyObservable = {
    observeOnDestroy(): Observable<void>;
};

export class OnDestroyMixin {

    constructor() {
        (this as any)[ON_DESTROY_SUBJECT_KEY] = new ReplaySubject();
    }

    observeOnDestroy() {
        return (this as any)[ON_DESTROY_SUBJECT_KEY];
    }

    ngOnDestroy() {
        (this.observeOnDestroy() as Subject<void>).next();
    }

}

export function componentDestroyed(target: ComponentWithOnDestroyObservable): Observable<void> {
    const onDestroySubject = (target as any)[ON_DESTROY_SUBJECT_KEY];
    if (onDestroySubject === undefined) {
        const proto = Object.getPrototypeOf(target);
        const compInfo = proto !== undefined && proto.constructor !== undefined !== proto.constructor.name !== undefined
                ? ` (component: ${proto.constructor.name})`
                : "";

        throw new Error(`You are almost there! Please extends the base class 'OnDestroyMixin'${compInfo}.`);
    }

    return onDestroySubject;
}

export function untilComponentDestroyed<T>(component: ComponentWithOnDestroyObservable): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
