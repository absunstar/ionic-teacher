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
  },  {
    path: 'packages',
    loadComponent: () => import('./packages/packages.page').then( m => m.PackagesPage)
  },
  {
    path: 'books',
    loadComponent: () => import('./books/books.page').then( m => m.BooksPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'user-manage',
    loadComponent: () => import('./user-manage/user-manage.page').then( m => m.UserManagePage)
  },
  {
    path: 'package-view',
    loadComponent: () => import('./package-view/package-view.page').then( m => m.PackageViewPage)
  },

];
