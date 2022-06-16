import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as _ from 'lodash';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataBindingService {
  step = {desc: false, location: false, payment: false};
  index = 0;
  descData;
  selectedService = [];
  scheduleInfo;
  locationData;
  total = 0;
  afterDiscountTotal;
  subTotal;
  charges = [];
  defaultTimeTech: any = {date: Date, id: '', name: '', from: '', till: '', email: '', phone: ''};

  couponApplied = false;
  couponDiscount;
  couponName;

  totalPercentChargeValue;
  totalAbsoluteCharge;

  chosenServices = [];


  descFormData = {
    data: false,
    formData: undefined,
    service: [],
    chosenService: [],
  };
  locationFormData = {
    data: false,
    formData: undefined
  };

  userFormData = {
    data: false,
    formData: undefined
  };

  order = {
    name: '',
    type: '',
    service: [],
    total: 0,
    address: '',
    city: '',
    postcode: '',
    email: '',
    paymentMethod: '',
    discount: 0,
    coupon: '',
    subtotal: 0,
    serviceMan: '',
    charges: [],
    lastService: '',
    user: '',
    payment: [],
    date: Date,
    time: '',
    serial: '',
    userName: '',
    phone: '',
    pianoName: '',
    technician: '',
    contactCustomer : false,
    notes: ''
  };

  orderId;

  selectSlotAgain = false;

  progress = false;
  withoutTaxTotal = 0;

  constructor(private snackBar: MatSnackBar, private localStorage: LocalStorageService) {
  }

  setService(service) {
    this.selectedService = service;
    console.log('these are services', this.selectedService);
    this.total = _.sumBy(this.selectedService, 'price');
  }

  openSnackBarSuccess(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['white-snackbar']
    });
  }

  openSnackBarError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
  }


}
