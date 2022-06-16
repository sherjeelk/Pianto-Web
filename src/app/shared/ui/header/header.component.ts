import { Component, OnInit } from '@angular/core';
import {SessionService} from '../../../services/session.service';
import {Router} from '@angular/router';
import {UtilService} from '../../../services/util.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {MatDialog} from '@angular/material/dialog';
import {LogoutPopupComponent} from '../dialogues/logout-popup/logout-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog, public session: SessionService, private router: Router, public util: UtilService, public local: LocalStorageService) {
  }

  ngOnInit(): void {
  }

  navigate() {
    if (!this.session.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LogoutPopupComponent, {
      width: '250px',
    });
  }
}
