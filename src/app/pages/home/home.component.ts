import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('stepper') stepper;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: any;
  // indexNumber: any;

  constructor(private formBuilder: FormBuilder, public dataService: DataBindingService, public util: UtilService) {}

  ngOnInit() {
    console.log('This is undefined moment' , moment(undefined));
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
