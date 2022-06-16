import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import * as _ from 'lodash';
import {APIService} from '../../services/api.service';
import {Services} from '../../shared/models/Services';
import {Extra} from '../../shared/models/Extras';
import {Charge} from '../../shared/models/Charges';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-piano-desc',
  templateUrl: './piano-desc.component.html',
  styleUrls: ['./piano-desc.component.scss']
})
export class PianoDescComponent implements OnInit {
  isLinear = false;
  descFormGroup: FormGroup;
  type: any;
  lastService: any;
  public chosenServices = [];
  public selectedServices = [];
  public allServices: Services;
  piano = {
    name : ''
  };
  public allPianoNames: Extra[] = [];
  private total: number;

  public charges: Charge[];
  totalAbsoluteCharge;
  totalPercentCharge;
  public subTotal: any;
  private totalPercentChargeValue: number;
  public allLastService: any = [];
  private withoutTaxTotal = 0;
  constructor(private formBuilder: FormBuilder, private dataService: DataBindingService, private api: APIService, private session: SessionService,
              public util: UtilService) {}

  ngOnInit() {
    this.descFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      sno: [''],
      type: ['', Validators.required],
      lastService: ['', Validators.required]
    });
    console.log('This log is generated before getting data from Description form', this.dataService.descFormData);

    if (this.dataService.descFormData.data) {
      console.log('value found in data service', this.dataService.descFormData);
      this.descFormGroup.patchValue({
        name: this.dataService.descFormData.formData.name,
        sno: this.dataService.descFormData.formData.sno,
        type: this.dataService.descFormData.formData.type,
        lastService: this.dataService.descFormData.formData.lastService
      });
      this.selectedServices =  this.dataService.descFormData.service ;
      this.chosenServices =  this.dataService.descFormData.chosenService ;
      this.dataService.chosenServices =  this.dataService.descFormData.chosenService ;
      this.piano.name =   this.dataService.descFormData.formData.name;
    } else {
      // this.descFormGroup.setValue(this.dataService.descFormData);
      console.log('no value found in dataservice');
    }
    this.getAllServices();
    this.getAllCharges();
    this.getAllLastService();

  }

  sendData() {
    this.dataService.descFormData.formData = this.descFormGroup.value;
    this.dataService.descFormData.data = true;
    this.dataService.descFormData.service = this.selectedServices;
    this.dataService.descData = this.descFormGroup.value;
    this.dataService.descFormData.chosenService = this.chosenServices;
    // console.log('this is desc form values', this.descFormGroup.value);
    if (this.descFormGroup.valid && this.chosenServices.length > 0) {
      this.dataService.index = 0;
      this.dataService.order.pianoName = this.descFormGroup.value.name;
      this.dataService.order.service = this.chosenServices;
      this.dataService.order.type = this.descFormGroup.value.type;
      this.dataService.order.serial = this.descFormGroup.value.sno;
      this.dataService.order.lastService = this.descFormGroup.value.lastService;
      this.dataService.step.desc = true;
      setTimeout(() => {
        this.dataService.index = 1;
      }, 30);
    } else if (this.descFormGroup.invalid) {
      this.dataService.openSnackBarError( this.util.setWords('CorrectErrors') , 'Ok');

    } else {
      this.dataService.openSnackBarError( this.util.setWords('PleaseSelectService') , 'Ok');

    }
  }

  pushService(service) {
    const servicePrice = service.price +  service.price * this.totalPercentCharge / 100;
    const serviceBody = {
      name: service.name,
      name_fi: service.name_fi,
      desc: service.desc,
      desc_fi: service.desc_fi,
      type: service.type,
      price: servicePrice,
      enable: service.enable,
    };
    if (_.find(this.chosenServices, serviceBody)) {
      _.remove(this.chosenServices, serviceBody);
      this.total = _.sumBy(this.chosenServices, 'price');
      this.dataService.total = this.total;
      // console.log('this is % ************', this.totalPercentChargeValue);
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) +  this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      this.dataService.total = this.total + this.totalAbsoluteCharge;
      // console.log('this is subtotal', this.totalAbsoluteCharge);
    } else {
      this.chosenServices.push(serviceBody);
      this.dataService.setService(this.chosenServices);
      this.total = _.sumBy(this.chosenServices, 'price');
      this.dataService.total = this.total;
      this.subTotal = this.total + (this.totalAbsoluteCharge ? this.totalAbsoluteCharge : 0) +  this.totalPercentChargeValue;
      this.dataService.subTotal = this.subTotal;
      this.dataService.total = this.total + this.totalAbsoluteCharge;
      // console.log('this is subtotal', this.totalAbsoluteCharge);
    }
    if (_.find(this.selectedServices, service)) {
      _.remove(this.selectedServices, service);
      this.withoutTaxTotal = _.sumBy(this.selectedServices, 'price');
      this.dataService.withoutTaxTotal = this.withoutTaxTotal;
      // console.log('this is subtotal', this.totalAbsoluteCharge);
    } else {
      this.selectedServices.push(service);
      this.withoutTaxTotal = _.sumBy(this.selectedServices, 'price');
      this.dataService.withoutTaxTotal = this.withoutTaxTotal;
    }
  }

  getServiceClass(service) {
    return _.find(this.selectedServices, service) ? 'service-details-selected' : 'service-details';
  }

  //  Api call to get All Services

  getAllServices() {
    this.api.getAllServices().subscribe(data => {
      this.allServices = data;
      // console.log('All Service Data', data);
      }, error => {
      console.log('An error occured while getting all services', error);
    });
  }

  getPiano(type, query) {
    const body = [{type}, {name : query }];
    this.api.getAllSearchInExtras(body).subscribe(data => {
      this.allPianoNames = data;
      }, error => {
      console.log('An error occurred while getting all piano names', error);
    });
  }

  onClickedOutside($event: Event) {
    this.allPianoNames = [];
  }

  addExtraTimes(result) {
    this.piano.name = result.name;
    console.log('this is piano', result);
  }

    getAllCharges() {
      this.api.getAllCharges().subscribe(data => {
        this.charges = data.results;
        for (const charge of this.charges) {
          if (charge.enable) {
            this.dataService.charges.push(charge);
            this.dataService.order.charges.push(charge);
          } else {
          }
        }
        this.dataService.charges = this.charges;
        const absolute = data.results;
        this.sumAllCharges();
      }, error => {
        console.log('An error Occurred while getting charges', error);
      });
    }

    getAllLastService() {
      const body = [{type: 'last'}];
      this.api.getAllSearchInExtras(body).subscribe(data => {
        data.forEach(item => {
          if (item.enable) {
            this.allLastService.push(item);
          }});
        this.allLastService = data;
        // console.log('these are all last services', this.allLastService);
      }, error => {
        console.log('An error Occurred while all services', error);
      });
    }

    async sumAllCharges() {
    // console.log('these are all charges', this.charges);

    const allAbsolute = _.filter(this.charges, {amountType: 'absolute'});
    // console.log('all absolute', allAbsolute);
    const allPercentage = _.filter(this.charges, {amountType: 'percentage'});
    // console.log('all percentage', allPercentage);

    this.totalAbsoluteCharge = _.sumBy(allAbsolute, 'value');
    this.dataService.totalAbsoluteCharge = this.totalAbsoluteCharge;
    // console.log('sum of all absolute', this.totalAbsoluteCharge);

    this.totalPercentCharge = _.sumBy(allPercentage, 'value');
    this.dataService.totalPercentChargeValue = this.totalPercentCharge;

  }

}









