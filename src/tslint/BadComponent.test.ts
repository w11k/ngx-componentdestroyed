import {Component, OnDestroy, OnInit} from "@angular/core";
import {of} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {untilComponentDestroyed} from "../index";

@Component({})
class BadComponent implements OnInit, OnDestroy {

    observable = of(1);
    stop = of(1);

    ngOnInit() {
        // Error
        this.observable.pipe(
            map(i => i),
            takeUntil(this.stop),
            map(i => i),
        ).subscribe();

        // Error
        this.observable.pipe(
            map(i => i),
            untilComponentDestroyed(this),
            map(i => i),
        ).subscribe();

        // OK
        this.observable.pipe(
            map(i => i),
            takeUntil(this.stop),
        ).subscribe();

        // OK
        this.observable.pipe(
            map(i => i),
            untilComponentDestroyed(this),
        ).subscribe();
    }

    ngOnDestroy(): void {
    }

}
