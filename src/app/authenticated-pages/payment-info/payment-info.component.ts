import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';
import {APIService} from '../../services/api.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {SessionService} from '../../services/session.service';
import {Register} from '../../shared/models/Register';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  constructor( private session: SessionService, private localStorage: LocalStorageService, private route: ActivatedRoute, public data: DataBindingService, public util: UtilService, private api: APIService) { }
  status;
  paymentObject;
  userData: Register;
  paymentMethod;
  user: any;
  ngOnInit(): void {
    this.status = this.route.snapshot.paramMap.get('status');
    const data = this.route.queryParams.subscribe(params => {
      const paymentId = params['PAYMENT_ID'];
      const orderStatus = params['STATUS'];
      const returnAuthCode = params['RETURN_AUTHCODE'];
      const orderNumber = params['ORDER_NUMBER'];
      this.paymentMethod = params['PAYMENT_METHOD'];
      this.paymentObject = {paymentId, orderStatus, returnAuthCode, orderNumber};
      this.user = this.localStorage.getObject('userExist');
      console.log('user Details', this.user);
      console.log('this is status', this.route.snapshot.paramMap.get('status'));

      // this.updateOrderStatus();
      this.registerNewUser(orderStatus);
    });
  }

  //
  // updateOrderStatus(): void {
  //   const body = {
  //     payment: this.paymentObject,
  //     paymentMethod: 'PAYTRAIL'
  //   };
  //   this.api.updateOrder(this.paymentObject.orderNumber, body).subscribe( data => {
  //     console.log('this is update order', data);
  //   }, error => {
  //     console.log('this is  order error', error);
  //   });
  // }

   confirmOrder(status) {
    const body = {id: this.paymentObject.orderNumber, status: status === 'PAID' ? 1 : 0, payment: this.paymentObject, paymentMethod: this.paymentMethod === 'PAY_LATER' ? 'PAY_LATER' : 'PAYTRAIL', userId: this.userData ? this.userData.user.id : ''};
    this.api.placeOrderConfirm(body).subscribe(resp => {
      console.log('this order status is', status === 1 + 'Data is ' + resp);
    }, error => {
      console.log('An error occurred while confirming order', error);
    });
  }


  registerNewUser(status) {
    const body = {
      name: this.localStorage.getObject('userName'),
      email: this.localStorage.getObject('userEmail')
    };

    console.log('this is the body of silent registered user', body);
    console.log('this is the body of silent registered user', this.session.isLoggedIn);
    if (!this.session.isLoggedIn) {
      console.log('user is not logged in', this.session.isLoggedIn);
      if (!this.user.exists){
        const userExist = this.localStorage.getObject('userExist');
        userExist.exists = true;
        this.api.registerNewUser(body).subscribe(data => {
            console.log('this is user data', data);
            this.userData = data;
            this.api.setToken(data.tokens.access.token);
            this.confirmOrder(status);
            console.log('this token is set', data.user.id);
            this.localStorage.setObject('userExist', userExist);
          },
          error => {
            // this.data.openSnackBarError(this.util.setWords('AlreadyRegistered'), 'Ok');
             this.confirmOrder(status);
             console.log('an error occurred while registering new user', error.status);
          });
      } else {
        this.confirmOrder(status);
      }
    } else {
      this.confirmOrder(status);
      console.log('this is else block');
    }
  }
}
