import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Userpreferences } from '../../models/index';

@Injectable({
  providedIn: 'root'
})
export class UserpreferencesService {
  public userpreferences: Userpreferences;

  datas:object = {};
  timeZone:object = {};
  lastLoginDate:object = {};
  dateFormatte:object ={};

  public dateFormat = new BehaviorSubject<object>(this.datas);
  public timeZoneFormat = new BehaviorSubject<object>(this.timeZone);
  public dateTimeFormat = new BehaviorSubject<object>(this.dateFormatte);
  //@when:05-nov-2021;@who:Priti Srivastava;@why: EWM-3462 @What:handle time zone n date format
  nowdate=new Date();
  brawoseTimeZone=this.nowdate.getTimezoneOffset();
  brawoseTimeformat='MMM d y h:mm a';//this.nowdate.toLocaleString();
  brawoseDateformat='MMM d y'//this.nowdate.toLocaleDateString();
  constructor() {

  //@when:05-nov-2021;@who:Priti Srivastava;@why: EWM-3462 @What:code modified to handle time zone n date format
    let data = {
      'timezone': localStorage.getItem('TimeZone')==undefined?this.brawoseTimeZone.toString():localStorage.getItem('TimeZone'),
      'timeformate': localStorage.getItem('DateTimeFormat')==undefined?this.brawoseTimeformat:localStorage.getItem('DateTimeFormat'),
      'dateformate': localStorage.getItem('DateFormat')==undefined?this.brawoseDateformat:localStorage.getItem('DateFormat'),
    };
    this.userpreferences = data;
  }


    changeDateFormat(newDate:Object){   
      this.dateFormat.next(newDate);
    }

    changeTimeZoneFormat(newTimeZone:Object){   
      this.timeZoneFormat.next(newTimeZone);
    }
  getuserpreferences() {
    // <!---------@When: 28-03-2023 @who:Adarsh singh @why: EWM-10940 @Desc- Convert DD into small (dd) becoz angular is not supported caps DD for date format--------->
    // for DateTimeFormat
    let timeformate = localStorage.getItem('DateTimeFormat');
    // if (timeformate.includes("D")) {
    //   timeformate = timeformate.replace('D', 'd')
    // } else if (timeformate.includes("DD")) {
    //   timeformate = timeformate.replace('DD', 'dd')
    // }
    // for date format 
    let dateformate = localStorage.getItem('DateFormat');
    // if (dateformate.includes("D")) {
    //   dateformate = dateformate.replace('D', 'd')
    // } else if (dateformate.includes("DD")) {
    //   dateformate = dateformate.replace('DD', 'dd')
    // }
    // End 
  //@when:05-nov-2021;@who:Priti Srivastava;@why: EWM-3462 @What:code modified to handle time zone n date format
  //@when:18-08-2023;@who:Bantee Kumar;@why: EWM-10517 @What:Documents External Share Feature (Employee Documents Section) not considering the localstorage timezone as discussed with mukesh kumar sir

    let data = {
      'timezone': localStorage.getItem('TimeZone')==undefined?Intl.DateTimeFormat().resolvedOptions().timeZone:localStorage.getItem('TimeZone'),
      'timeformate': timeformate==undefined?this.brawoseTimeformat:timeformate,
      'dateformate': dateformate==undefined?this.brawoseDateformat:dateformate,
    };
    this.userpreferences = data;
    return this.userpreferences;
  }
  setuserpreferences(data) {
    this.userpreferences = data;
    return this.userpreferences;
  }

  getNewPrefresnces(){
    return this.userpreferences;
  }
}
