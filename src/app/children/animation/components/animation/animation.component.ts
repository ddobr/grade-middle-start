import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';
import { IOpenable } from "../../interfaces/openable.interface";

@Component({
    templateUrl: './animation.component.html',
    styleUrls: ['./styles/animation.master.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
            state('open', style({
                height: '*',
            })),
            state('closed', style({
                height: '0px',
            })),
            transition('open <=> closed', [
                animate('0.1s'),
            ]),
        ])
    ]
})
export class AnimationComponent {
    public cardList: IOpenable[] = [
        {
            text: 'Waze & Odyssey vs R. Kelly - Bump & Grind',
            opened: false
        },
        {
            text: 'Salvatore Ganacci - Step-Grandma',
            opened: false
        },
        {
            text: 'Example - 10 Million People',
            opened: false
        },
        {
            text: 'Shy FX - Bye bye bye feat. Jvck James & Chronixx (S.P.Y remix)',
            opened: false
        }
    ]

    public toggle(idx: number): void {
        this.cardList[idx].opened = !this.cardList[idx].opened;
    }
}