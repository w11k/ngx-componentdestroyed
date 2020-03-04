import {assert} from "chai";
import {of, Subject} from "rxjs";
import {switchMap, takeUntil} from "rxjs/operators";
import {componentDestroyed, OnDestroyMixin, untilComponentDestroyed} from "./index";

function FakeAngularIvyAot() {
    return (target: any) => {
        // noinspection JSNonASCIINames
        target.ɵcmp = target;
    };
}

function destroyComponent(component: any) {
    // const constructor = Object.getPrototypeOf(component).constructor;
    // const onDestroy = constructor.onDestroy;
    // onDestroy.apply(component);
    component.ngOnDestroy();
}

// @ObserveOnDestroy()
// @FakeAngularIvyAot()
class FakeComp extends OnDestroyMixin {
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

    it("each component instance has it's own destroyed observable", function () {
        const fakeComp1 = new FakeComp();
        const fakeComp2 = new FakeComp();

        let called1 = false;
        let called2 = false;
        let closed1 = false;
        let closed2 = false;
        const source1 = new Subject();
        const source2 = new Subject();

        source1.pipe(takeUntil(componentDestroyed(fakeComp1))).subscribe(() => called1 = true, NOOP, () => closed1 = true);
        source2.pipe(takeUntil(componentDestroyed(fakeComp2))).subscribe(() => called2 = true, NOOP, () => closed2 = true);

        assert.isFalse(called1);
        assert.isFalse(closed1);
        assert.isFalse(called2);
        assert.isFalse(closed2);
        source1.next();
        assert.isTrue(called1);
        assert.isFalse(closed1);
        assert.isFalse(called2);
        assert.isFalse(closed2);
        destroyComponent(fakeComp1);
        assert.isTrue(called1);
        assert.isTrue(closed1);
        assert.isFalse(called2);
        assert.isFalse(closed2);
        source2.next();
        assert.isTrue(called1);
        assert.isTrue(closed1);
        assert.isTrue(called2);
        assert.isFalse(closed2);
        destroyComponent(fakeComp2);
        assert.isTrue(called1);
        assert.isTrue(closed1);
        assert.isTrue(called2);
        assert.isTrue(closed2);
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
