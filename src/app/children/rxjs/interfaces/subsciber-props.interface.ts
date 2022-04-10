import { Observable } from "rxjs";

export interface ISubscriberProps {
    index: number;
    observable: Observable<number>;
}