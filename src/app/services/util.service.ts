import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {MessageConstants} from '../MessageConstants';
import {LocalStorageService} from './local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private language = {};
  public lang = 1;

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
    console.log('this is the language selected', 2);
    this.getLangLocal();
  }

  public getHumanShortDate(date) {
    return moment(date).format('DD-MMM-YYYY');
  }

  public getDayName(date) {
    if (moment(date).format('dddd') === 'Monday') {
      return this.setWords('Monday');
    } else if (moment(date).format('dddd') === 'Tuesday') {
      return this.setWords('Tuesday');
    }else if (moment(date).format('dddd') === 'Wednesday') {
      return this.setWords('Wednesday');
    }else if (moment(date).format('dddd') === 'Thursday') {
      return this.setWords('Thursday');
    }else if (moment(date).format('dddd') === 'Friday') {
      return this.setWords('Friday');
    }else if (moment(date).format('dddd') === 'Saturday') {
      return this.setWords('Saturday');
    }else if (moment(date).format('dddd') === 'Sunday') {
      return this.setWords('Sunday');
    }
  }
  public getTime(date) {
    return moment(date).format('H:mm');
  }

  setLanguage(lang) {
    console.log('this is lang', lang);
    if (lang === 1) {
      this. lang = 1;
      MessageConstants.CURRENT_LANG = 1;
      this.localStorage.setString('lang', '1');
      this.http.get('/assets/json/english.json').subscribe(data => {
        return this.language = data;
      });
    } else if (lang === 2) {
      this.lang = 2;
      this.localStorage.setString('lang', '2');
      this.http.get('/assets/json/finnish.json').subscribe(data => {
        MessageConstants.CURRENT_LANG = 2;
        return this.language = data;
      });
    } else {
      this.http.get('/assets/json/english.json').subscribe(data => {
        this.localStorage.setString('lang', '1');
        return this.language = data;
      });
    }

  }

  setWords(key) {
    // console.log('this is data', this.language);
    // console.log('this word is set', this.language[key]);
    return this.language[key];
  }

  changeLanguage(language) {
    if (language === 'eng') {
      this.setLanguage(language);
      console.log('language Changed to english');
      // this.presentToast('Language changed to English');
    } else {
      this.setLanguage(language);
      console.log('language Changed to finnish');

      // this.presentToast('Language changed to Finnish');
    }
  }

  getLangLocal() {
    const lang = this.localStorage.getString('lang');
    console.log('this is lanuage in payment status ', lang);
    if (lang === '1') {
      this.setLanguage(1);
    } else {
      this.setLanguage(2);
    }
  }
}
