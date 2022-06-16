import { Component, OnInit } from '@angular/core';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(public util: UtilService) { }

  ngOnInit(): void {
  }

}
