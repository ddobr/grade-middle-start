import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { interval, Observable, share } from "rxjs";
import { ISubscriberProps } from "../../interfaces/subsciber-props.interface";

@Component({
    selector: 'app-observable',
    templateUrl: './observable.component.html',
    styleUrls: ['./styles/observable.master.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservableComponent {
    @Input()
    public observableType!: 'cold' | 'hot';

    public subscriberPropsList: ISubscriberProps[] = [];
    public eventFrequency: number = 1000;
    public coldObservable$: Observable<number> = this.createColdObservable();
    public hotObservable$: Observable<number> = this.createHotObservable();

    private _subscriberCounter: number = 0;

    public addSubscriber(): void {
        this.subscriberPropsList.push({
            index: this._subscriberCounter++,
            observable: this.observableType === 'cold' ? this.coldObservable$ : this.hotObservable$
        });
    }

    public inputHandler(e: Event): void {
        this.eventFrequency = Number.parseInt((e.target as any).value);
    }

    public deleteSubscriber(index: number): void {
        this.subscriberPropsList = [...this.subscriberPropsList.filter((props) => props.index !== index)];
    }

    public createHotObservable(): Observable<number> {
        const observable = new Observable<number>((subscriber) => {
            const subscription = this.coldObservable$.subscribe((i) => {
                subscriber.next(i);
            });

            return () => subscription.unsubscribe();
        });

        return observable.pipe(share());
    }

    public createColdObservable(): Observable<number> {
        const observable = new Observable<number>((subscriber) => {
            let isUnsubscribed = false;
            let i = 0;
            const callback = () => {
                return setTimeout(() => {
                    
                    if (!isUnsubscribed) {
                        subscriber.next(i++);
                        const id = callback() as any;
                    }

                }, this.eventFrequency)
            }

            const id = callback() as any;

            return () =>  {
                clearTimeout(id);
                isUnsubscribed = true;
            }
        });

        return observable;
    }
}