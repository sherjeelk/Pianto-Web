import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../services/local-storage.service';
import {ActivatedRoute} from '@angular/router';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';
import {APIService} from '../../services/api.service';

@Component({
  selector: 'app-extended-payment-info',
  templateUrl: './extended-payment-info.component.html',
  styleUrls: ['./extended-payment-info.component.scss']
})
export class ExtendedPaymentInfoComponent implements  OnInit {

  constructor(private localStorage: LocalStorageService, private route: ActivatedRoute, public data: DataBindingService, public util: UtilService, private api: APIService) { }
  status;
  paymentObject;

  ngOnInit(): void {
    this.status = this.route.snapshot.paramMap.get('status');
    const data = this.route.queryParams.subscribe(params => {
      const paymentId = params['PAYMENT_ID'];
      const orderStatus = params['STATUS'];
      const returnAuthCode = params['RETURN_AUTHCODE'];
      const orderNumber = params['ORDER_NUMBER'];
      this.paymentObject = {paymentId, orderStatus, returnAuthCode, orderNumber};
      console.log('this is params data', this.paymentObject);
      this.postExtOrder();
    });
  }
  postExtOrder() {
    const extBody = JSON.parse(localStorage.getItem('extBody'));
    console.log('this is extended body', extBody);
    console.log('this is extended body', this.paymentObject);
    this.api.postExtOrder(this.paymentObject.orderNumber, extBody).subscribe( data => {
      this.confirmOrder(this.paymentObject.orderStatus);

      console.log('this is pay data@@@@@@@@@@@', data);
    }, error => {
      console.log('Order added successfully', error);

    });
  }

  confirmOrder(status) {
    const body = {id: this.paymentObject.orderNumber, status: status === 'PAID' ? 1 : 0};
    console.log('this ic confirm extended order status');
    this.api.putExtOrder(this.paymentObject.orderNumber,  body).subscribe(resp => {
      console.log('responese of put extended order', resp);
      console.log('this order status is', status === 1 + 'Data is ' + resp);
    });
  }

}
