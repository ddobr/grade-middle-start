import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RxJsComponent } from "./components/rxjs/rxjs.component";

const routes: Routes = [
    {
        path: '',
        component: RxJsComponent
    }
]

@NgModule({
    declarations: [
        RxJsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ]
})
export class RxJsModule {

}