import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageLayoutComponent} from './page-layout/page-layout.component';
import {PaymentComponent} from './payment/payment.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
  {
    path: '',
    component: PageLayoutComponent,
    loadChildren: () => import('./page-layout/page-layout.module').then(m => m.PageLayoutModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
