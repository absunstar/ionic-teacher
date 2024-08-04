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
    path: 'lecture-view',
    loadComponent: () => import('./lecture-view/lecture-view.page').then( m => m.LectureViewPage)
  },
  {
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
  {
    path: 'book-view',
    loadComponent: () => import('./book-view/book-view.page').then( m => m.BookViewPage)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.page').then( m => m.NotificationsPage)
  },
  {
    path: 'centers',
    loadComponent: () => import('./centers/centers.page').then( m => m.CentersPage)
  },
  {
    path: 'parent-report',
    loadComponent: () => import('./parent-report/parent-report.page').then( m => m.ParentReportPage)
  },
  {
    path: 'teachers',
    loadComponent: () => import('./teachers/teachers.page').then( m => m.TeachersPage)
  },

];
