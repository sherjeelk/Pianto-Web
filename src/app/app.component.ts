import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AppConstants} from './AppConstants';
declare let gtag: Function;
declare let fbq: Function;
// declare let _hsp = window._hsp = window._hsp || [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pianto';

  constructor(private router: Router){

    router.events.subscribe((y: NavigationEnd) => {
  if (y instanceof NavigationEnd){
  gtag('config', AppConstants.G_ID , {page_path : y.url});
  fbq('track', 'PageView');
}
});
}
}
