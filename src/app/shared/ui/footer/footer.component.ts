import { Component, OnInit } from '@angular/core';
import {UtilService} from '../../../services/util.service';
// declare let _hsp = window._hsp = window._hsp || [];
// declare let _hsp: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  hsp = (window as any)._hsp;
  constructor(public util: UtilService) { }

  ngOnInit(): void {
  }

}
