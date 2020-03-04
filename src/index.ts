import {Observable, ReplaySubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

const ON_DESTROY_SUBJECT_KEY = Symbol("ON_DESTROY_SUBJECT_KEY");

function getInternalAngularComponent<T>(type: any): any {
    // noinspection JSNonASCIINames
    return type.ɵdir || type.ɵcmp;
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

export function componentDestroyed(target: any): Observable<void> {
    const onDestroySubject = target[ON_DESTROY_SUBJECT_KEY];
    if (onDestroySubject === undefined) {
        const proto = Object.getPrototypeOf(target);
        const compName = proto !== undefined && proto.constructor !== undefined !== proto.constructor.name !== undefined
                ? ` (${proto.constructor.name})`
                : "";

        throw new Error(`You are almost there! Please add the @ObserveOnDestroy() decorator to this component${compName}.`);
    }

    return onDestroySubject;
}

export function untilComponentDestroyed<T>(component: any): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => source.pipe(takeUntil(componentDestroyed(component)));
}
