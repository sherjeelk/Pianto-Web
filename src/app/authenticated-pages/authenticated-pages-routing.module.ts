import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyOrdersComponent} from './my-orders/my-orders.component';
import {ProfileComponent} from './profile/profile.component';
import {PaymentInfoComponent} from './payment-info/payment-info.component';
import {PasswordInfoComponent} from './password-info/password-info.component';
import {ExtendedOrderComponent} from './extended-order/extended-order.component';
import {ExtendedPaymentInfoComponent} from './extended-payment-info/extended-payment-info.component';


const routes: Routes = [

  {
    path: 'my-orders',
    component: MyOrdersComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'payment-info/:status',
    component: PaymentInfoComponent
  },
  {
    path: 'ext-payment-info/:status',
    component: ExtendedPaymentInfoComponent
  },
  {
    path: 'password-info/:status',
    component: PasswordInfoComponent
  },
  {
    path: 'extended-order/:id',
    component: ExtendedOrderComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticatedPagesRoutingModule { }
