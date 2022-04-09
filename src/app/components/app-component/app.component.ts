import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ISimpleLink } from 'src/app/interfaces/simple-link.interface';

@Component({
    selector: 'app-root',
    styleUrls: ['./styles/app.master.css'],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    public linkList: ISimpleLink[] = [
        {
            url: '/animation',
            title: 'Animations'
        },
        {
            url: '/rxjs',
            title: 'RxJS'
        }
    ] 

    constructor(
        private _router: Router
    ) {

    }

    public navigate(url: string): void {
        this._router.navigate([url]);
    }

    public isSelected(url: string): boolean {
        return this._router.url === url;
    }
}
