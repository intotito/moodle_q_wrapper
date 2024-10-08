import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
    // add lazy loaded routes for welcome as home page
    { path:  '', component:  WelcomeComponent},
    { path: 'main', loadComponent: () => import('./components/main/main.component').then(m => m.MainComponent)},
    {path: 'web-viewer', loadComponent: () => import('./components/web-viewer/web-viewer.component').then(m => m.WebViewerComponent)},
    {path: 'repo-viewer', loadComponent: () => import('./components/repo-viewer/repo-viewer.component').then(m => m.RepoViewerComponent)},
    {path: 'wizard', loadComponent: () => import('./components/wizard/wizard.component').then(m => m.WizardComponent)}
];
