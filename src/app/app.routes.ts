import { Routes } from '@angular/router';
import { adminAuthGuard } from './admin/guards/admin-auth.guard';

export const routes: Routes = [
  { path: 'admin/login', loadComponent: () => import('./admin/pages/login/admin-login.component').then(m => m.AdminLoginComponent) },
  {
    path: 'admin',
    loadComponent: () => import('./admin/components/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./admin/pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'inquiries', loadComponent: () => import('./admin/pages/inquiries/admin-inquiries.component').then(m => m.AdminInquiriesComponent) },
      { path: 'inquiries/:id', loadComponent: () => import('./admin/pages/inquiry-details/admin-inquiry-details.component').then(m => m.AdminInquiryDetailsComponent) }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  { path: '**', redirectTo: '' }
];
