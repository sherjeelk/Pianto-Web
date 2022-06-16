import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsComponent>, public util: UtilService) { }

  ngOnInit(): void {
  }

}
