import {Injectable} from "@angular/core";
import {of} from "rxjs";

@Injectable({providedIn: "root"})
class BadSerivce {

    constructor() {
        // Error
        of(1).subscribe();
    }

}
