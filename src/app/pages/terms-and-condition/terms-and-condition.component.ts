import { Component, OnInit } from '@angular/core';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss']
})
export class TermsAndConditionComponent implements OnInit {

  constructor(public util: UtilService) { }

  ngOnInit(): void {
  }

}
