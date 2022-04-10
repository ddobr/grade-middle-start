import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgLetModule } from "src/app/pipes/ng-let.module";
import { ObservableComponent } from "./components/observable-component/observable.component";
import { RxJsComponent } from "./components/rxjs/rxjs.component";
import { SubscriberComponent } from "./components/subscriber-component/subscriber.component";

const routes: Routes = [
    {
        path: '',
        component: RxJsComponent
    }
]

@NgModule({
    declarations: [
        RxJsComponent,
        SubscriberComponent,
        ObservableComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        NgLetModule,
    ]
})
export class RxJsModule {

}