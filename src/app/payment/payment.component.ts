import { Component, OnInit } from '@angular/core';
import {sha256} from 'js-sha256';
import {AppConstants} from '../AppConstants';
import {DataBindingService} from '../services/data-binding.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentData = {
    MERCHANT_AUTH_HASH: AppConstants.PAY_TRAIL_AUTH,
    MERCHANT_ID: AppConstants.PAY_TRAIL_MER_ID,
    URL_SUCCESS: AppConstants.PAY_TRAIL_SUCCESS,
    URL_CANCEL: AppConstants.PAY_TRAIL_FAILED,
    ORDER_NUMBER: this.data.orderId,
    PARAMS_IN: 'MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT',
    PARAMS_OUT: 'PAYMENT_ID,TIMESTAMP,STATUS',
    AMOUNT: this.data.total.toFixed(2), // 350.00
    AUTH_CODE: '',
  };

  constructor(public data: DataBindingService) { }

  ngOnInit(): void {

    // set amount and order id here


    // ends here init


    const hashString = `${this.paymentData.MERCHANT_AUTH_HASH}|${this.paymentData.MERCHANT_ID}|${this.paymentData.URL_SUCCESS}|${this.paymentData.URL_CANCEL}|${this.paymentData.ORDER_NUMBER}|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|${this.paymentData.AMOUNT}`;

    sha256('Message to hash');
    const hash = sha256.create();
    // dummy
   // hash.update('6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ|13466|http://www.example.com/success|http://www.example.com/cancel|123456|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|350.00');
    hash.update(hashString);
    console.log('hash', hash.hex().toUpperCase());
    this.paymentData.AUTH_CODE = hash.hex().toUpperCase();
  }

}
