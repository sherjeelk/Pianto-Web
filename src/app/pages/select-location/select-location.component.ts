import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {APIService} from '../../services/api.service';
import {Extra} from '../../shared/models/Extras';
import * as _ from 'lodash';
import * as moment from 'moment';
import {UtilService} from '../../services/util.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class SelectLocationComponent implements OnInit {
  locationFormGroup: any;
  showSchedule = false;
  schedule = null;
  calendar = [];
  showCalendar = false;
  defaultTimeTech: any = {date: Date, id: '', name: '', from: '', till: '', email: '', phone: ''};

  public selectedTimeTech;
  postCodeIsValid = false;
  public postCodeResult;
  post;
  loading = false;
  date = moment();
  showPrevious = 0;
  public days: moment.Moment[];
  private postcodes: Extra[];
  public firstTime: { date: any; till: any; phone: any; from: any; name: any; email: any, id: any };
  locProgress = false;
  calendarProgress = false;
  contactUsForm: FormGroup;
  public showContact =  false;
  minDate = moment().startOf('day').add(1, 'day').toDate();
  contactCard = false;

  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, public dataService: DataBindingService, private api: APIService, public util: UtilService) {
  }

  ngOnInit() {
      this.locationFormGroup = this.formBuilder.group({
      building: ['', Validators.required],
      city: ['', Validators.required],
      postcode: ['', Validators.required]
    });

      this.contactUsForm = this.formBuilder.group({
      customDate: ['', Validators.required],
      customTime: ['', Validators.required],
    });
      console.log('This log is generated before getting data from select location', this.dataService.locationFormData);

      if (this.dataService.locationFormData.data) {
      console.log('value found in data service', this.dataService.descFormData);
      this.locationFormGroup.patchValue({
        building: this.dataService.locationFormData.formData.building,
        city: this.dataService.locationFormData.formData.city,
        postcode: this.dataService.locationFormData.formData.postcode,
      });
      this.post = this.dataService.locationFormData.formData.postcode;
    } else {
      console.log('no value found in dataservice');

    }
  }

  sendLocationData() {
    if (!this.dataService.order.contactCustomer) {
      this.dataService.locationFormData.data = true;
      this.dataService.locationFormData.formData = this.locationFormGroup.value;
      if (this.locationFormGroup.valid && this.schedule === null) {
        // console.log('fill in data of select location form group', this.dataService.locationFormData);
        this.schedule =  {date: this.calendar[0].date, time: this.calendar[0].from, technician: this.calendar[0].name};

        this.dataService.scheduleInfo = this.schedule;
        this.dataService.locationData = this.locationFormGroup.value;
        this.dataService.order.serviceMan = this.schedule.id;
        console.log('this is schedule', this.schedule);
        this.setDataForOrder();

      } else if (this.locationFormGroup.invalid) {
        this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');
      } else {
        this.dataService.scheduleInfo = this.schedule;
        this.dataService.locationData = this.locationFormGroup.value;
        this.dataService.order.serviceMan = this.schedule.id;
        this.setDataForOrder();

      }
    } else {
      this.setDataForOrder();
    }

  }

  isSlotsAvl(day) {
    const slots = [];
    for (const date of this.calendar) {
      if (day.isSame(date.date, 'day')) {
        return true;
      }
    }
    return slots.length > 0;
  }

  setDataForOrder() {
    this.dataService.step.location = true;
    this.dataService.order.address = this.locationFormGroup.value.building;
    this.dataService.order.city = this.locationFormGroup.value.city;
    this.dataService.order.postcode = this.locationFormGroup.value.postcode;
    console.log('will not further', this.dataService.index);
    this.dataService.index = 1;

    setTimeout(() => {
      this.dataService.step.payment = false;
      this.dataService.index = 2;
      console.log('will go further', this.dataService.index);
      }, 30);
  }

  scheduleInfo(item) {
    this.selectedTimeTech = item;
    this.dataService.defaultTimeTech = item;
    // console.log('this is default tech time when slot selected', this.dataService.defaultTimeTech);
    this.dataService.order.date = item.date;
    this.dataService.order.time = item.from;
    this.dataService.order.technician = item.name;
    this.schedule = item;
    this.dataService.order.contactCustomer = false;
    this.dataService.openSnackBarSuccess(this.util.setWords('ScheduleSelected'), '');

  }

  addLocation(postcode) {
    this.locProgress = true;
    this.checkAvailability(postcode);
    // this.dataService.locationData = undefined;
    // this.defaultTimeTech = undefined;
    if (this.locationFormGroup.valid && this.postCodeIsValid) {
      this.contactCard = true;
      this.getSlots();

      // console.log(this.dataService.locationData);
    } else {
      this.locProgress = false;
      this.contactCard = false;

      this.dataService.openSnackBarError(this.postCodeIsValid ? this.util.setWords('ValidStreet') : this.util.setWords('ValidPostcode'), '');
    }
  }

  setTimeTech(event: MatCheckboxChange) {
    if (event.checked) {
      console.log('this is the first time', this.firstTime);
      this.showSchedule = true;
      this.dataService.defaultTimeTech = this.firstTime;
      this.dataService.order.date = this.firstTime.date;
      this.dataService.order.time = this.firstTime.from;
      this.dataService.order.technician = this.firstTime.name;
      this.selectedTimeTech = undefined;
      console.log('this is the default time tech checked', this.dataService.defaultTimeTech);

    } else {
      this.showSchedule = false;
      this.dataService.defaultTimeTech = this.firstTime;
      this.dataService.order.date = this.firstTime.date;
      this.dataService.order.time = this.firstTime.from;
      this.dataService.order.technician = this.firstTime.name;
      console.log('this is the default time tech unchecked', this.dataService.defaultTimeTech);
    }

  }

  timeSelectedCss(item) {
    return item === this.selectedTimeTech ? 'time-slot-selected' : 'time-slot';

  }

  checkAvailability(postcode) {
    this.loading = true;
    // console.log('these are postcodes', postcode);
    const body = [{type: 'postcode'}, {value: postcode}];
    this.api.getAllSearchInExtras(body).subscribe(data => {
      this.postcodes = data;
      this.loading = false;
      // console.log('postcodes***********', this.postcodes);

      if (_.find(this.postcodes, {value: postcode})) {
        this.postCodeResult = _.find(this.postcodes, {value: postcode});
        this.postCodeIsValid = true;
        this.post = this.postCodeResult.name;
      } else {
        this.dataService.openSnackBarError(this.util.setWords('ValidPostcode'), '');
        console.log('this postcode is not available');
        this.postCodeIsValid = false;
        this.post = undefined;
        this.loading = false;
      }
    }, error => {
      console.log('An error occurred while fetching postcodes', error);
      this.loading = false;

    });
  }

  getSlots() {
    this.getNextDays();
    this.calendar = [];
    const body = {
      city: this.locationFormGroup.value.city.toLowerCase(),
      postcode: this.locationFormGroup.value.postcode
    };
    this.api.getFutureSlots(body).subscribe(data => {
      if ( data.length > 0) {
        console.log('this is slot data', data);
        let slotExist = false;
        data.forEach(item => {
          item.slots.forEach(resp => {
            console.log('this is calendar', resp);
            const mStart = moment(resp.date).toDate();
            mStart.setHours(Number(resp.from.split(':')[0]));
            mStart.setMinutes(Number(resp.from.split(':')[1]));
            if (resp.available) {
              if (moment(mStart).isAfter(moment().startOf('day').add(1, 'day'))) {
                this.calendar.push({startTime: mStart, date: moment(resp.date).toDate(), id: item.id, name: item.name, from: resp.from, till: resp.till, email: item.email, phone: item.phone, available: resp.available});
                console.log('I am here', this.calendar);
                slotExist = true;

              } else {
                this.dataService.locationData = undefined;
                this.locProgress = false;
                this.showCalendar = false;

                this.openFixSnackBarError(this.util.setWords('SorryNoTechnician'), 'Ok');
                slotExist = false;
              }
            }
          });
        });

        if (slotExist) {
          this.calendar.sort((a, b) => {
            return a.startTime - b.startTime;
          });
          console.log('First avl time***************', this.calendar[0], this.calendar);
          this.firstTime = {date: this.calendar[0].date, id: this.calendar[0].id, till: this.calendar[0].till, from: this.calendar[0].from, name: this.calendar[0].name , email: this.calendar[0].email, phone: this.calendar[0].phone};
          // tslint:disable-next-line:max-line-length
          this.dataService.order.contactCustomer = false;
          this.dataService.defaultTimeTech = {date: this.calendar[0].date, id: this.calendar[0].id, till: this.calendar[0].till, from: this.calendar[0].from, name: this.calendar[0].name , email: this.calendar[0].email, phone: this.calendar[0].phone};
          this.dataService.order.technician = this.firstTime.name;
          this.dataService.order.date = this.firstTime.date;
          this.dataService.order.time = this.firstTime.from;
          this.dataService.order.technician = this.firstTime.name;
          this.schedule = this.firstTime;

          console.log('default tech time', this.dataService.defaultTimeTech);
          const grouped = _.chain(this.calendar).groupBy('date').map((value, key) => ({date: key, slots: value})).value();
          _.remove(grouped, item => moment(item.date).isBefore(moment(), 'day') || moment(item.date).isAfter(moment().add(60, 'day')));
          this.calendar = grouped;
          this.locProgress = false;

          this.showCalendar = true;
          this.snackBar.dismiss();

          this.dataService.locationData = this.locationFormGroup.value;

          // console.log('this is grouped item', this.calendar);
        }
      } else {
        this.dataService.locationData = undefined;
        this.locProgress = false;
        this.showCalendar = false;

        this.openFixSnackBarError(this.util.setWords('thereNoBookingAvailYourArea'), 'Ok');
      }
    }, error => {
      this.dataService.openSnackBarError(this.util.setWords('retrySlot'), '');
      console.log('an error occurred while getting slots', error);
    });
  }

  onSearchChange(event: any) {
    const value = event.target.value;
    if (value.length === 5) {
      this.checkAvailability(value);
    }
  }

  getNextWeek() {
    this.calendarProgress = true;

    this.date = this.date.add('7', 'day');
    this.showPrevious = this.showPrevious + 1;
    this.getNextDays();
    this.calendarProgress = false;
  }

  getPreviousWeek() {
    this.calendarProgress = true;
    this.date = this.date.subtract('7', 'day');
    this.showPrevious = this.showPrevious - 1;
    this.getNextDays();
    this.calendarProgress = false;
  }

  getNextDays() {
    let daysToGet = 7;
    const arrDays = [];
    while (daysToGet) {
      const current = moment(this.date).add(daysToGet, 'day');
      if (current.startOf('day').isSameOrBefore(moment().startOf('day'))) {
        // console.log('add no new date in here *********', current);
      } else {
        // console.log('add new date here *********', current);
        // console.log('add new date here *********', this.util.getHumanShortDate(current));
        arrDays.push(current);
        daysToGet--;
      }
    }
    // console.log('these are next 7 days', arrDays);
    if (this.showPrevious > 0) {
      this.days = arrDays.reverse();
    } else if (this.showPrevious === 0) {
      this.days = arrDays.reverse();
    }
  }

  openFixSnackBarError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: undefined,
    });
  }

  // customDateTime() {
  //   if (this.contactUsForm.valid) {
  //     // this.showContact = !this.showContact;
  //     const contactData = this.contactUsForm.value;
  //     console.log('this is contact form data', contactData, this.locationFormGroup  );
  //     this.dataService.locationData = this.locationFormGroup.value;
  //     this.dataService.order.date = contactData.customDate.toISOString();
  //     this.dataService.order.time = contactData.customTime;
  //     this.dataService.order.postcode = this.locationFormGroup.value.postcode;
  //     this.dataService.order.city = this.locationFormGroup.value.city;
  //     this.dataService.order.address = this.locationFormGroup.value.building;
  //     this.selectedTimeTech = undefined;
  //     this.dataService.defaultTimeTech = {date: contactData.customDate.toISOString(), id: undefined, till: contactData.customTime, from: contactData.customTime, name: '-' , email: '-', phone: '-'};
  //     this.dataService.order.contactCustomer = true;
  //     this.setDataForOrder();
  //     console.log('this is contact form data', contactData, this.locationFormGroup  );
  //     this.dataService.openSnackBarSuccess('Custom schedule selected', '');
  //   } else {
  //     console.log('form is not valid');
  //   }
  // }
  contactMe() {
      // this.showContact = !this.showContact;
      // const contactData = this.contactUsForm.value;
      // console.log('this is contact form data', contactData, this.locationFormGroup  );
      this.dataService.locationData = this.locationFormGroup.value;
      this.dataService.order.date = undefined;
      this.dataService.order.time = undefined;
      this.dataService.order.postcode = this.locationFormGroup.value.postcode;
      this.dataService.order.city = this.locationFormGroup.value.city;
      this.dataService.order.address = this.locationFormGroup.value.building;
      this.selectedTimeTech = undefined;
      this.dataService.defaultTimeTech = {date: null, id: undefined, till: undefined, from: undefined, name: '-' , email: '-', phone: '-'};
      this.dataService.order.contactCustomer = true;
      this.setDataForOrder();
      // console.log('this is contact form data', contactData, this.locationFormGroup  );
      this.dataService.openSnackBarSuccess(this.util.setWords('customSchedule'), '');

  }

  cancelCustomTime() {
    this.showContact = !this.showContact;
    this.addLocation(this.locationFormGroup.value.postcode);
  }
}
