import {assert} from "chai";
import {of, Subject} from "rxjs";
import {switchMap, takeUntil} from "rxjs/operators";
import {componentDestroyed, ObserveOnDestroy, untilComponentDestroyed} from "./index";

function FakeAngularIvyAot() {
    return (target: any) => {
        // noinspection JSNonASCIINames
        target.ɵcmp = target;
    };
}

function destroyComponent(component: any) {
    const constructor = Object.getPrototypeOf(component).constructor;
    const onDestroy = constructor.onDestroy;
    onDestroy.apply(component);
}

@ObserveOnDestroy()
@FakeAngularIvyAot()
class FakeComp {
}

const NOOP = () => {
};

describe("componentDestroyed", function () {

    it("emits a value when ngOnDestroy() gets called", function () {
        const fakeComp = new FakeComp();
        let observable = componentDestroyed(fakeComp);
        let called = false;
        observable.subscribe(() => called = true);
        destroyComponent(fakeComp);
        assert.isTrue(called);
    });

    it("gets reinitialized on component creation", function () {
        function testRun() {
            const fakeComp = new FakeComp();
            let called = false;
            let closed = false;
            const source = new Subject();
            source.pipe(takeUntil(componentDestroyed(fakeComp))).subscribe(
                    () => called = true,
                    NOOP,
                    () => closed = true);
            source.next(1);
            destroyComponent(fakeComp);
            assert.isTrue(called);
            assert.isTrue(closed);
        }

        testRun();
        testRun();
        testRun();
    });

    it("can be used with the pipe and takeUntil operators", function () {
        const fakeComp = new FakeComp();

        let closed = false;
        const source = new Subject();
        source.pipe(takeUntil(componentDestroyed(fakeComp)))
                .subscribe(NOOP, NOOP, () => closed = true);

        destroyComponent(fakeComp);
        assert.isTrue(closed);
    });


});

describe("untilComponentDestroyed", function () {

    it("can be used as a pipe operator", function () {
        const fakeComp = new FakeComp();

        let closed = false;
        const source = new Subject();
        source.pipe(untilComponentDestroyed(fakeComp))
                .subscribe(NOOP, NOOP, () => closed = true);

        destroyComponent(fakeComp);
        assert.isTrue(closed);
    });

    it("can be used with other pipe operators", function () {
        const fakeComp = new FakeComp();

        let closed = false;
        const vals: number[] = [];
        const source = new Subject<number>();
        source
                .pipe(
                        switchMap/*<number, number>*/(val => of(val + 100)),
                        untilComponentDestroyed(fakeComp),
                )
                .subscribe(val => vals.push(val), NOOP, () => closed = true);

        source.next(1);
        source.next(2);
        source.next(3);
        destroyComponent(fakeComp);

        assert.deepEqual(vals, [101, 102, 103]);
        assert.isTrue(closed);
    });

});
