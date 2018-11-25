import {Directive} from "@angular/core";
import {of} from "rxjs";

@Directive({})
class BadDirective {

    constructor() {
        // Error
        of(1).subscribe();
    }

}
