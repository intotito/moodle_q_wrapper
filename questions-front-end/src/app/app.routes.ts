import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
    // add lazy loaded routes for welcome as home page
    { path:  '', component:  WelcomeComponent},
    { path: 'main', loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent)}

];
