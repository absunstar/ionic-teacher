import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'lectures',
    loadComponent: () => import('./lectures/lectures.page').then( m => m.LecturesPage)
  },
  {
    path: 'lectures-view',
    loadComponent: () => import('./lectures-view/lectures-view.page').then( m => m.LecturesViewPage)
  },
];
