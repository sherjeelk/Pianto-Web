import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {APIService} from '../../services/api.service';
import {Order} from '../../shared/models/Orders';
import * as _ from 'lodash';
import {DataBindingService} from '../../services/data-binding.service';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';
import {Services} from '../../shared/models/Services';
import {Charge} from '../../shared/models/Charges';
import {sha256} from 'js-sha256';
import {AppConstants} from '../../AppConstants';

@Component({
  selector: 'app-extended-order',
  templateUrl: './extended-order.component.html',
  styleUrls: ['./extended-order.component.scss']
})
export class ExtendedOrderComponent implements OnInit {
  private charges: Charge[];

  progress = false;
  public remServices = [];

  @ViewChild('pay') pay: ElementRef;

  paymentData = {
    MERCHANT_AUTH_HASH: AppConstants.PAY_TRAIL_AUTH,
    MERCHANT_ID: AppConstants.PAY_TRAIL_MER_ID,
    URL_SUCCESS: AppConstants.PAY_TRAIL_SUCCESS_EXT,
    URL_CANCEL: AppConstants.PAY_TRAIL_FAILED_EXT,
    ORDER_NUMBER: this.dataService.orderId,
    PARAMS_IN: 'MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT',
    PARAMS_OUT: 'PAYMENT_ID,ORDER_NUMBER,TIMESTAMP,STATUS',
    AMOUNT: this.dataService.total.toFixed(2), // 350.00
    AUTH_CODE: '',
  };


  constructor(private route: ActivatedRoute, public dataService: DataBindingService, private api: APIService, private session: SessionService,
              public util: UtilService) { }

  public chosenServices = [];
  public allServices: Services;
  public total: number;
  totalAbsoluteCharge;
  totalPercentCharge;
  public subTotal: any;
  private totalPercentChargeValue: number;
  public oid;
  public orderData: Order;
  showPayment: any;
  ngOnInit(): void {
    this.getOrderData();
  }

  getOrderData() {
    this.progress = true;
    this.oid = this.route.snapshot.params.id;

    this.api.getOrder(this.oid).subscribe( data => {
      this.orderData = data;
      this.getAllServices();
      this.getAllCharges();
      this.progress = false;
      console.log('this is order data', data);
    }, error => {
      console.log('error occurred while getting order data', error);
    });
  }

  getServiceTime(order) {
    if (order.service.length === 1) {
      return `${order.service[0].name}`;
    } else if (order.service.length > 1) {
      return `${order.service[0].name} & ${order.service.length - 1} more`;
    } else {
      return 'No Service';
    }
  }

  pushService(service) {

    if (_.find(this.chosenServices, service)) {
      _.remove(this.chosenServices, service);
      this.total = _.sumBy(this.chosenServices, 'price');
      this.dataService.total = this.total;
      this.totalPercentChargeValue = this.total * ( this.totalPercentCharge ? this.totalPercentCharge / 100 : 0);
      this.dataService.totalPercentChargeValue = this.totalPercentChargeValue;
      console.log('this is % ************', this.totalPercentCharge);
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) +  this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      console.log('this is subtotl', this.subTotal);
    }
    else {
      this.chosenServices.push(service);
      this.dataService.setService(this.chosenServices);
      this.total = _.sumBy(this.chosenServices, 'price');
      this.dataService.total = this.total;
      this.totalPercentChargeValue = this.total * ( this.totalPercentCharge ? this.totalPercentCharge / 100 : 0);
      this.dataService.totalPercentChargeValue = this.totalPercentChargeValue;
      console.log('this is % ************', this.totalPercentCharge);
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) +  this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      console.log('this is subtotl', this.subTotal);

    }
    console.log('these are chosen ', this.chosenServices);
  }

  getServiceClass(service) {
    return _.find(this.chosenServices, service) ? 'service-details-selected' : 'service-details';
  }

  getAllServices() {
    this.api.getAllServices().subscribe(data => {
      this.allServices = data;
      const  all = this.allServices.results;
      const  pre = this.orderData.service;
     // const diff = _.differenceWith(all, pre, _.isEqual);
      this.remServices = _.differenceBy(all, pre, '_id');
      console.log('diff Service Data ****',  this.remServices);
      console.log('All Service Data',  all);
      console.log('Pre Service Data',  pre);
    }, error => {
      console.log('An error occured while getting all services', error);
    });
  }

  getAllCharges() {

    this.api.getAllCharges().subscribe(data => {
      this.charges = data.results;
      this.dataService.charges = this.charges;
      const absolute = data.results;
      this.sumAllCharges();
    }, error => {
      console.log('An error Occurred while getting charges', error);
    });
  }

  async sumAllCharges() {
    await _.sumBy(this.charges, absCharge => {
      if (absCharge.amountType === 'Absolute') {
        console.log('these are absolute charges', absCharge.value);
        this.dataService.totalAbsoluteCharge = absCharge.value;
        return this.totalAbsoluteCharge = absCharge.value;
      }
      if (absCharge.amountType === 'Percentage'){
        console.log('these are % charges', absCharge.value);
        return this.totalPercentCharge = absCharge.value;
      } else {
        console.log('NO % or absolute based charges found');

      }
    });

  }

  addOrder() {
    const body = {
      charges : this.charges,
      total: this.total,
      services: this.chosenServices
    };
    console.log('this is body of extended order', body);
    localStorage.setItem('extBody', JSON.stringify(body));
    this.paymentData.AMOUNT = this.total.toFixed(2);
    this.paymentData.ORDER_NUMBER = this.orderData._id;
    this.paymentData.AMOUNT = this.total.toFixed(2);
    this.callPayTrail();
    const el: HTMLElement = this.pay.nativeElement;
    setTimeout(() => {
      el.click();
    }, 30);
    console.log('this is body of extended order', body);
  }


  callPayTrail() {
    const hashString = `${this.paymentData.MERCHANT_AUTH_HASH}|${this.paymentData.MERCHANT_ID}|${this.paymentData.URL_SUCCESS}|${this.paymentData.URL_CANCEL}|${this.paymentData.ORDER_NUMBER}|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,ORDER_NUMBER,TIMESTAMP,STATUS|${this.paymentData.AMOUNT}`;
    sha256('Message to hash');
    console.log('Message to hash', hashString);
    const hash = sha256.create();
    // dummy
    // hash.update('6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ|13466|http://www.example.com/success|http://www.example.com/cancel|123456|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|350.00');
    hash.update(hashString);
    console.log('hash', hash.hex().toUpperCase());
    console.log('this is payment data', this.paymentData);
    this.paymentData.AUTH_CODE = hash.hex().toUpperCase();
  }

}
