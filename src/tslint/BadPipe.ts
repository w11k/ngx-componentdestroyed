import {Pipe} from "@angular/core";
import {of} from "rxjs";

@Pipe({name: "badPipe"})
class BadPipe {

    constructor() {
        // Error
        of(1).subscribe();
    }

}
