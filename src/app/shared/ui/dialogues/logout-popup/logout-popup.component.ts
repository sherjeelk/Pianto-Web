import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SessionService} from '../../../../services/session.service';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss']
})
export class LogoutPopupComponent implements OnInit {

  DialogData;
  constructor( public dialogRef: MatDialogRef<LogoutPopupComponent>, public session: SessionService) { }

  ngOnInit(): void {
  }

  logout() {
    this.session.logout();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();

  }
}
