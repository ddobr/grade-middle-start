import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app-component/app.component';

const routes: Routes = [
    {
        path: 'animation',
        loadChildren: () => import('./children/animation/animation.module').then((m) => m.AnimationModule)
    },
    {
        path: 'rxjs',
        loadChildren: () => import('./children/rxjs/rxjs-module').then((m) => m.RxJsModule)
    }
]

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
