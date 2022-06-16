import { Component, OnInit } from '@angular/core';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {

  constructor(public util: UtilService) { }

  ngOnInit(): void {
  }

}
