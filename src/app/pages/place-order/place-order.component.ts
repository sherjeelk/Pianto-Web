import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import {APIService} from '../../services/api.service';
import {SessionService} from '../../services/session.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {TermsComponent} from '../terms/terms.component';
import {CancellationPolicyComponent} from '../cancellation-policy/cancellation-policy.component';
import {UtilService} from '../../services/util.service';
import {Router} from '@angular/router';
import {AppConstants} from '../../AppConstants';
import {sha256} from 'js-sha256';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  showCoupon = false;
  showPayment = false;
  orderData;
  slotsData = [];
  inputCoupon = '';
  @ViewChild('pay') pay: ElementRef;
  paymentData = {
    MERCHANT_AUTH_HASH: AppConstants.PAY_TRAIL_AUTH,
    MERCHANT_ID: AppConstants.PAY_TRAIL_MER_ID,
    URL_SUCCESS: AppConstants.PAY_TRAIL_SUCCESS,
    URL_CANCEL: AppConstants.PAY_TRAIL_FAILED,
    URL_NOTIFY: AppConstants.PAY_TRAIL_SUCCESS,
    ORDER_NUMBER: this.dataService.orderId,
    PARAMS_IN: 'MERCHANT_ID,URL_SUCCESS,URL_CANCEL,URL_NOTIFY,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT',
    PARAMS_OUT: 'PAYMENT_ID,ORDER_NUMBER,TIMESTAMP,STATUS',
    AMOUNT: this.dataService.total.toFixed(2), // 350.00
    AUTH_CODE: '',
  };
  interval;
  timeLeft = 60;
  public existing = 0;
  private slotsIsAvailable = false;
  private payLater = false;


  constructor(private formBuilder: FormBuilder, private localStorage: LocalStorageService, private router: Router, public dataService: DataBindingService, private api: APIService, public session: SessionService, public dialog: MatDialog, public util: UtilService) {
  }

  ngOnInit() {
    this.paymentFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      coupon: [],
      notes: [],
      terms: [false],
      privacy: [false]
    });
    console.log('This log is generated before getting data from Description form', this.dataService.userFormData);

    if (this.dataService.userFormData.data) {
      console.log('value found in data service', this.dataService.descFormData);
      this.paymentFormGroup.patchValue({
        name: this.dataService.userFormData.formData.name,
        surname: this.dataService.userFormData.formData.surname,
        email: this.dataService.userFormData.formData.email,
        phone: this.dataService.userFormData.formData.phone,
        coupon: this.dataService.userFormData.formData.coupon,
        terms: this.dataService.userFormData.formData.terms,
        privacy: this.dataService.userFormData.formData.privacy,
      });
      this.inputCoupon = this.dataService.userFormData.formData.coupon;
    } else {
      // this.descFormGroup.setValue(this.dataService.descFormData);
      console.log('no value found in dataservice');

    }

  }

  enterCoupon(change) {
    if (change.checked) {
      this.showCoupon = !this.showCoupon;
      this.paymentFormGroup.get('coupon').setValidators([Validators.required]);
      this.paymentFormGroup.get('coupon').updateValueAndValidity();
    } else {
      this.showCoupon = !this.showCoupon;
      this.paymentFormGroup.get('coupon').clearValidators();
      this.paymentFormGroup.get('coupon').updateValueAndValidity();
      this.inputCoupon = '';
      this.dataService.order.discount = 0;
      this.dataService.total = (this.dataService.withoutTaxTotal * (this.dataService.totalPercentChargeValue / 100)) + this.dataService.withoutTaxTotal + this.dataService.totalAbsoluteCharge;
      this.dataService.couponApplied = false;
    }
    console.log('this is change event', change.checked);
  }


  async checkout() {
    await this.localStorage.saveObject('userEmail', this.paymentFormGroup.value.email);
    await this.localStorage.saveObject('userName', this.paymentFormGroup.value.name);
    this.dataService.order.email = this.paymentFormGroup.value.email;
    this.dataService.order.name = this.paymentFormGroup.value.name + ' ' + this.paymentFormGroup.value.surname;
    this.dataService.order.phone = this.paymentFormGroup.value.phone;
    this.dataService.order.notes = this.paymentFormGroup.value.notes;
    this.dataService.order.subtotal = this.dataService.withoutTaxTotal;
    this.dataService.order.total = this.dataService.total;
    this.dataService.order.coupon = this.paymentFormGroup.value.coupon ? this.paymentFormGroup.value.coupon : '';
    console.log('this is order body', this.dataService.order);
    if (this.session.isLoggedIn) {
      this.dataService.order.user = this.session.user.id;
      this.placeOrderApi();
    } else {
      this.placeOrderApi();
    }
  }

  placeOrderApi() {
    this.paymentData.AMOUNT = this.dataService.total.toFixed(2);
    this.dataService.descFormData.data = false;
    this.dataService.locationFormData.data = false;
    this.dataService.userFormData.data = false;
    console.log('this log is generated when we remove data in all forms from service', this.dataService.userFormData.data = false);
    console.log('This is finial order body', this.dataService.order);
    this.api.placeOrder(this.dataService.order).subscribe(data => {
      // console.log('this order is placed', data);
      this.paymentData.ORDER_NUMBER = data._id;
      // this.dataService.openSnackBarSuccess(this.util.setWords('OrderPlacedSuccessfully'), '');
      this.orderData = data;
      this.paymentData.AMOUNT = this.dataService.total.toFixed(2);
      if (this.payLater) {
        this.router.navigateByUrl('/payment-info/success?ORDER_NUMBER=' + this.paymentData.ORDER_NUMBER + '&PAYMENT_METHOD=PAY_LATER&STATUS=PAID');
      } else {
        this.callPayTrail();
      }
      console.log('this is pay data@@@@@@@@@@@', this.paymentData);
      const el: HTMLElement = this.pay.nativeElement;
      setTimeout(() => {
        el.click();
      }, 30);
      // el.click();
    }, error => {
      this.dataService.openSnackBarError(this.util.setWords('AnErrorOccurred'), '');
      console.log('an error occurred while placing order', error);
    });
  }

  confirmOrder(status) {
    const body = {id: this.orderData._id, status};
    this.api.placeOrderConfirm(body).subscribe(resp => {
      console.log('this order status is', status === 1 + 'Data is ' + resp);
    });
  }


  /**
   * Check if user already exist in system force user to login if exists and place order if not.
   * @param emailId pass emailId from form
   */

  checkExistingUser(emailId) {
    this.api.getExistingUser(emailId).subscribe(data => {
      console.log('this is status of existing user api', data);
      if (data.status === 0) {
        this.checkout();
      } else {
        this.dataService.order.user = data.id;
        this.checkout();

        // this.dataService.openSnackBarError(this.util.setWords('AlreadyRegistered'), 'Ok');
      }
      console.log('this user exist', data);
    });
  }

  // registerNewUser() {
  //   const body = {
  //     name: this.paymentFormGroup.value.name,
  //     email: this.paymentFormGroup.value.email,
  //   };
  //   this.api.registerNewUser(body).subscribe(data => {
  //     this.dataService.order.user = data.user.id;
  //     this.checkout();
  //     console.log('this is new user', data.user);
  //   }, error => {
  //       this.dataService.openSnackBarError(this.util.setWords('AlreadyRegistered'), 'Ok');
  //       console.log('an error occurred while registering new user', error.status);
  //   });
  // }

  updateOrderWithNewUser(orderId, userId) {
    const body = {
      user: userId
    };
    this.api.updateUser(orderId, body).subscribe(data => {
      console.log('this is updated Order', data);
    }, error => {
      console.log('an error occurred while updating order with user Id', error);
    });
  }

  applyCoupon(value: string) {
    console.log('coupon value', value);
    const body = {
      coupon: value,
      total: this.dataService.total
    };

    console.log('this is coupon api body', body);
    this.api.applyCoupon(body).subscribe(data => {
      console.log('coupon applied successfully', data);
      this.dataService.couponApplied = true;
      this.dataService.couponDiscount = data.discount;
      this.dataService.order.discount = data.discount;
      this.dataService.couponName = value;
      this.totalAfterDiscount(data);
      this.dataService.openSnackBarSuccess(this.util.setWords('CouponAppliedSuccess'), '');
    }, error => {
      console.log('coupon applied failed', error);
      this.dataService.openSnackBarError(this.util.setWords('PleaseEnterValidCoupon'), '');
    });

  }

  totalAfterDiscount(data) {
    this.dataService.afterDiscountTotal = this.dataService.withoutTaxTotal - data.discount;
    console.log('this is after total discount total 1', this.dataService.afterDiscountTotal, this.dataService.totalPercentChargeValue, this.dataService.totalAbsoluteCharge);
    this.dataService.afterDiscountTotal = (this.dataService.afterDiscountTotal * (this.dataService.totalPercentChargeValue / 100)) + this.dataService.afterDiscountTotal + this.dataService.totalAbsoluteCharge;
    console.log('this is after total discount total 2', this.dataService.afterDiscountTotal);
    this.dataService.total = this.dataService.afterDiscountTotal;
    console.log('this is after total discount total 3', this.dataService.total);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TermsComponent, {
      width: '600px',
      height: '500px'
    });

    console.log('this is order body', this.dataService.order);
  }

  openDialogCancel(): void {
    const dialogRef = this.dialog.open(CancellationPolicyComponent, {
      width: '600px',
    });
  }

  // check if user slot still exist before payment
  placeOrder() {
    this.dataService.userFormData.data = true;
    this.dataService.userFormData.formData = this.paymentFormGroup.value;
    console.log('this is generated when we set data in user form in service', this.dataService.userFormData.formData);
    console.log('this is order json', this.dataService.order);
    if (this.dataService.order.service.length > 0) {
      if (this.paymentFormGroup.valid) {
        if (!this.dataService.order.contactCustomer) {
          this.api.getUserSlots(this.dataService.order.serviceMan).subscribe(data => {
            // console.log('this is user slots', data);
            const selected = {
              date: moment(this.dataService.defaultTimeTech.date).toDate().toISOString(),
              from: this.dataService.defaultTimeTech.from,
              till: this.dataService.defaultTimeTech.till,
              available: true
            };
            const time = _.filter(data.slots, selected);
            // console.log('this is user selected slot', selected);
            // console.log('this is user data slot', data.slots);
            // console.log('this is filter', time);

            this.slotsIsAvailable = time.length > 0;
            if (this.paymentFormGroup.valid && (this.paymentFormGroup.value.terms === false || this.paymentFormGroup.value.privacy === false)) {
              this.dataService.openSnackBarError(this.util.setWords('PleaseAcceptT&C'), '');
              console.log('this is payments info', this.paymentFormGroup.value
              );
            } else if (this.paymentFormGroup.invalid) {
              this.dataService.openSnackBarError(this.util.setWords('CorrectErrors'), 'Ok');
            } else if (this.slotsIsAvailable) {
              if (!this.session.isLoggedIn) {
                this.checkExistingUser(this.paymentFormGroup.value.email);
              } else {
                this.checkout();
              }
            } else {
              this.dataService.step.payment = false;
              setTimeout(() => {
                this.dataService.index = 1;
              }, 30);
              this.dataService.openSnackBarError(this.util.setWords('SlotNotExist'), 'Ok');
              console.log('Go back');
            }
          }, error => {
            console.log('an error occurred while getting user slots', error);
            this.dataService.openSnackBarError(this.util.setWords('ErrorWhileConfirming'), 'Ok');
            this.slotsIsAvailable = false;
          });
        } else {

          console.log('Name and email set in storage', this.localStorage.getObject('userName'), this.localStorage.getObject('userEmail'));
          this.dataService.order.serviceMan = '';
          this.dataService.order.technician = '';
          if (this.paymentFormGroup.valid && (this.paymentFormGroup.value.terms === false || this.paymentFormGroup.value.privacy === false)) {
            this.dataService.openSnackBarError(this.util.setWords('PleaseAcceptT&C'), '');
            console.log('this is payments info', this.paymentFormGroup.value
            );
          } else if (this.paymentFormGroup.invalid) {
            this.dataService.openSnackBarError(this.util.setWords('CorrectErrors'), 'Ok');
          } else if (!this.session.isLoggedIn) {
            this.checkExistingUser(this.paymentFormGroup.value.email);
          } else {
            this.checkout();
          }
        }
      } else {
        this.dataService.openSnackBarError(this.util.setWords('CorrectErrors'), 'Ok');

      }
    } else {
      this.dataService.step.location = false;
      this.dataService.step.payment = false;
      console.log('this is steps', this.dataService.step);
      setTimeout(() => {
        this.dataService.index = 0;
      }, 30);
      this.dataService.openSnackBarError(this.util.setWords('NoServicesSelected!'), 'Ok');
    }
  }

  payment(type: number) {
    console.log('this is route', this.router.url);
    if (type === 1) {
      this.payLater = false;
      this.placeOrder();
    } else {
      this.payLater = true;
      this.placeOrder();
    }
  }

  // normalFlow(data) {
  //   // console.log('this is user slots', data);
  //   const selected = {
  //     date: moment(this.dataService.defaultTimeTech.date).toDate().toISOString(),
  //     from: this.dataService.defaultTimeTech.from,
  //     till: this.dataService.defaultTimeTech.till,
  //     available: true
  //   };
  //   const time = _.filter(data.slots, selected);
  //   // console.log('this is user selected slot', selected);
  //   // console.log('this is user data slot', data.slots);
  //   // console.log('this is filter', time);
  //
  //   this.slotsIsAvailable = time.length > 0;
  //   if (this.paymentFormGroup.valid && (this.paymentFormGroup.value.terms === false || this.paymentFormGroup.value.privacy === false)) {
  //     this.dataService.openSnackBarError(this.util.setWords('PleaseAcceptT&C'), '');
  //     console.log('this is payments info', this.paymentFormGroup.value
  //     );
  //   } else if (this.paymentFormGroup.invalid) {
  //     this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');
  //   } else if (this.slotsIsAvailable){
  //     if (!this.session.isLoggedIn) {
  //       this.checkExistingUser(this.paymentFormGroup.value.email);
  //     } else {
  //       this.checkout();
  //     }
  //   } else{
  //     this.dataService.step.payment = false;
  //     setTimeout(() => {
  //       this.dataService.index = 1;
  //     }, 30);
  //     this.dataService.openSnackBarError(this.util.setWords('SlotNotExist'), 'Ok');
  //     console.log('Go back');
  //   }
  // }

  removeCoupon() {
    this.dataService.total = (this.dataService.withoutTaxTotal * (this.dataService.totalPercentChargeValue / 100)) + this.dataService.withoutTaxTotal + this.dataService.totalAbsoluteCharge;
    this.inputCoupon = '';
    this.dataService.order.discount = 0;
    this.dataService.couponApplied = false;
  }

  callPayTrail() {
    const hashString = `${this.paymentData.MERCHANT_AUTH_HASH}|${this.paymentData.MERCHANT_ID}|${this.paymentData.URL_SUCCESS}|${this.paymentData.URL_CANCEL}|${this.paymentData.URL_NOTIFY}|${this.paymentData.ORDER_NUMBER}|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,URL_NOTIFY,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,ORDER_NUMBER,TIMESTAMP,STATUS|${this.paymentData.AMOUNT}`;
    sha256('Message to hash');
    console.log('Message to hash', hashString);
    const hash = sha256.create();
    // dummy
    // hash.update('6pKF4jkv97zmqBJ3ZL8gUw5DfT2NMQ|13466|http://www.example.com/success|http://www.example.com/cancel|123456|MERCHANT_ID,URL_SUCCESS,URL_CANCEL,ORDER_NUMBER,PARAMS_IN,PARAMS_OUT,AMOUNT|PAYMENT_ID,TIMESTAMP,STATUS|350.00');
    hash.update(hashString);
    console.log('hash', hash.hex().toUpperCase());
    this.paymentData.AUTH_CODE = hash.hex().toUpperCase();
  }

  async getExistingEmail(value: string) {
    console.log('this email input value', value);
    console.log('existing user is calling');


    const mail = this.paymentFormGroup.get('email').value;
    if (this.paymentFormGroup.get('email').valid && !this.session.isLoggedIn) {
      console.log('email is now valid we can check!!!!!!!!');
      await this.api.getExistingUser(mail).subscribe(data => {
        console.log('getting  userExisting data', data);
        this.localStorage.setObject('userExist', data);
        console.log('this is local storage', this.localStorage.getObject('userExist'));
        if (data.status === 1 && !data.used) {
          // user exists send link
          this.existing = 1;
        } else if (data.status === 1 && data.used) {
          // user exists send ask for login
          this.existing = 2;
        } else {
          // User does not exist create a new account
          this.existing = 3;
        }
      }, error => {
        console.log('An error occurred while checking existing user');
        return;
      });
    } else {
      return false;
    }

  }

  startTimer() {
    this.getExistingEmail(this.paymentFormGroup.value.email);
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
        clearTimeout(this.interval);
        return;
      }
    }, 1000);
  }


}
