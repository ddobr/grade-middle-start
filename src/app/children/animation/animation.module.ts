import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnimationComponent } from "./components/animation/animation.component";

const routes: Routes = [
    {
        path: '',
        component: AnimationComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        AnimationComponent
    ]
})
export class AnimationModule {

}