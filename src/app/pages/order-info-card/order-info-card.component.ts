import { Component, OnInit } from '@angular/core';
import {DataBindingService} from '../../services/data-binding.service';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-order-info-card',
  templateUrl: './order-info-card.component.html',
  styleUrls: ['./order-info-card.component.scss']
})
export class OrderInfoCardComponent implements OnInit {

  constructor(public data: DataBindingService, public util: UtilService) {
  }

  ngOnInit(): void {
  }

  getPercentValue(amount) {
    console.log('this total without tax', amount, this.data.withoutTaxTotal);
    return    Math.round(((this.data.withoutTaxTotal * amount / 100) + Number.EPSILON) * 100) / 100 ;
  }

}
