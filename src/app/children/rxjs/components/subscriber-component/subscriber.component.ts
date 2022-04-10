import { trigger, state, style, transition, animate, keyframes } from "@angular/animations";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { concatMap, interval, map, mergeMap, Observable, Subject, switchMap, take, takeUntil } from "rxjs";

@Component({
    selector: 'app-subscriber',
    templateUrl: './subscriber.component.html',
    styleUrls: ['./styles/subscriber.master.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flicker', [
            transition('* <=> *', [
                animate('0.15s', keyframes([
                    style({ opacity: '1' }),
                    style({ opacity: '0' })
                  ])),
            ]),
        ]),
        trigger('enter', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('0.5s', style({
                    opacity: 1
                }))
            ])
        ])
    ]
})
export class SubscriberComponent implements OnInit, OnDestroy {
    @Input()
    public source!: Observable<number>;
    @Input()
    public index!: number;
    @Output()
    public delete: EventEmitter<number> = new EventEmitter<number>();

    public innerSource$!: Observable<number>;

    public color: string = this.createRandomColor();

    private _multiplier: number = 1;
    private _switchmapRepetitions: number = 1;
    private _destroy$: Subject<void> = new Subject<void>();

    constructor(private _changeDetectorRef: ChangeDetectorRef) {

    }

    public ngOnDestroy(): void {
        this._destroy$.next();
    }

    public ngOnInit(): void {
        this.innerSource$ = this.source.pipe(
            takeUntil(this._destroy$),
            map((i) => i * this._multiplier),
            switchMap((i) => {
                return interval(200).pipe(
                    take(this._switchmapRepetitions),
                    map((e) => {
                        return i * (e + 1);
                    })
                )
            })
        );
    }

    public deleteClick(): void {
        this.delete.emit(this.index);
    }

    public mapInputHandler(e: Event): void {
        this._multiplier = Number.parseInt((e.target as any).value);
    }

    public switchmapInputHandler(e: Event): void {
        this._switchmapRepetitions = Number.parseInt((e.target as any).value);
    }


    /** генерит случайный цвет */
    private createRandomColor(): string {
        return `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
    }
}