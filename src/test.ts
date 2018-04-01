import {componentDestroyed, OnDestroyLike, untilComponentDestroyed} from "./index";
import {Subject} from "rxjs/Subject";
import {switchMap, takeUntil} from "rxjs/operators";
import {assert} from "chai";
import {of} from "rxjs/observable/of";

class FakeComp implements OnDestroyLike {
    ngOnDestroy() {
    }
}

const NOOP = () => {
};

describe("componentDestroyed", function () {

    it("emits a value when ngOnDestroy() gets called", function () {
        const fakeComp = new FakeComp();
        const signal$ = componentDestroyed(fakeComp);
        let called = false;
        signal$.subscribe(() => called = true);
        fakeComp.ngOnDestroy();
        assert.isTrue(called);
    });

    it("can be used with the pipe and takeUntil operators", function () {
        const fakeComp = new FakeComp();

        let closed = false;
        const source = new Subject();
        source.pipe(takeUntil(componentDestroyed(fakeComp)))
            .subscribe(NOOP, NOOP, () => closed = true);

        fakeComp.ngOnDestroy();
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

        fakeComp.ngOnDestroy();
        assert.isTrue(closed);
    });

    it("can be used with other pipe operators", function () {
        const fakeComp = new FakeComp();

        let closed = false;
        const vals: number[] = [];
        const source = new Subject<number>();
        source
            .pipe(
                untilComponentDestroyed(fakeComp),
                switchMap(val => of(val + 100))
            )
            .subscribe(val => vals.push(val), NOOP, () => closed = true);

        source.next(1);
        source.next(2);
        source.next(3);
        fakeComp.ngOnDestroy();

        assert.deepEqual(vals, [101, 102, 103]);
        assert.isTrue(closed);
    });

});
