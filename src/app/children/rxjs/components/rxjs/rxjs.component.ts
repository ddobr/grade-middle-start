import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { BehaviorSubject, interval, Observable, Subject, switchMap, takeUntil, tap } from "rxjs";
import { ILog } from "../../interfaces/log.interface";

@Component({
    templateUrl: './rxjs.component.html',
    styleUrls: ['./styles/rxjs.master.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RxJsComponent implements OnDestroy {
    /** список логов */
    public consoleLogList$: BehaviorSubject<ILog[]> = new BehaviorSubject<ILog[]>([]);

    /** "консоль" */
    @ViewChild('logDisplay')
    public logDisplay!: ElementRef<HTMLDivElement>;

    /** Счетчик холодных observable */
    private _coldObservableCounter: number = 0;
    /** Счетчик горячих observable */
    private _hotObservableCounter: number = 0;
    /** Событие дестроя компоненты */
    private _destroy$: Subject<void> = new Subject<void>();
    /** Счетчик. Нужен для создания горячих потоков. */
    private _hotObservableTicker$: Observable<number> = this.createHotObservableTicker();
    /** Событие сброса всех выводимых в консоль observable */
    private _stopAll$: Subject<void> = new Subject<void>();

    constructor() {
    }

    /** дестрой компоненты */
    public ngOnDestroy(): void {
        this.stopAll();
        this._destroy$.next();
    }

    /** добавляет консоли подписку на новый observable 
     * @param type тип observable 
     */
    public addObservable(type: string): void {
        switch (type) {
            case 'cold':
                this.addObservableToLogs(this.createCold())
                break
            case 'hot':
                this.addObservableToLogs(this.createHot())
                break
            default:
                break
        }
    }

    /** Останавливает все выводимые в консоль observable */
    public stopAll(): void {
        this._stopAll$.next();
        this._coldObservableCounter = 0;
        this._hotObservableCounter = 0;

        this.consoleLogList$.next([]);
    }

    /** Создает горячий поток логов */
    public createHot(): Observable<ILog> {
        const subscriberIdx = this._hotObservableCounter;
        const color = this.createRandomColor();
        this._hotObservableCounter += 1;

        const source = new Observable<ILog>((subscriber) => {
            // Подписываемся на глобальный счетчик. В этом и есть весь прикол 
            // горячего потока - значения создаются не в колбэке, а берутся извне
            const subscription = this._hotObservableTicker$.subscribe((i) => {
                subscriber.next({ message: `[HOT${subscriberIdx}]: ${i}`, color: color });
            });

            return () =>  { 
                subscription.unsubscribe() 
            };
        });

        return source;
    }

    /** Создает холодный поток логов */
    public createCold(): Observable<ILog> {
        const subscriberIdx = this._coldObservableCounter;
        const color = this.createRandomColor();
        this._coldObservableCounter += 1;

        const source = new Observable<ILog>((subscriber) => {
            // В холодном потоке создается свой источник значений для каждой подписки
            // Данный колбэк вызывается при каждой подписке
            let i = 0;
            const subscription = interval(1000).subscribe(() => {
                subscriber.next({ message: `[COLD${subscriberIdx}]: ${i++}`, color: color });
            });

            return () => subscription.unsubscribe();
        });

        return source;
    }

    /** 
     * Подписывает консоль на поток логов
     * @param observable поток
     */
    private addObservableToLogs(observable: Observable<ILog>): void {
        observable.pipe(
            takeUntil(this._stopAll$),
        ).subscribe((log) => {
            const newValue = [...this.consoleLogList$.getValue(), log];
            this.consoleLogList$.next(newValue);

            setTimeout(() => {
                this.logDisplay.nativeElement.scroll(0, this.logDisplay.nativeElement.scrollTop + 50);
            }, 1)
        })
    }

    /** генерит случайный цвет */
    private createRandomColor(): string {
        return `rgb(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200})`;
    }

    /** 
     * создает счетчик, эмитящий событие каждую секунду 
     * со значением равным сколько секунд прошло с начала запуска 
     */
    private createHotObservableTicker(): Observable<number> {
        let subj = new BehaviorSubject(0);

        interval(1000).pipe(
            takeUntil(this._destroy$),
        ).subscribe(() => {
            subj.next(subj.getValue() + 1);
        });

        return subj.asObservable();
    }
}
