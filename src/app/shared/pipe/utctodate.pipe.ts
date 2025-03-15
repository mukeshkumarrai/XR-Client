import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utctodate'
})
export class UtctodatePipe  implements PipeTransform {

    transform(value: any, args?: any,timezonName?:any,format?:any): any {  
      let displayDate = '';
      let startdateOfWeekms = new Date(moment().startOf('week').toDate()).getTime();
      let enddateOfWeekms   = new Date(moment().endOf('week').toDate()).getTime();
      let startdateOfWeek = new DatePipe('en-US').transform(startdateOfWeekms,'dd/MM/yyyy',timezonName);
      let enddateOfWeek   = new DatePipe('en-US').transform(enddateOfWeekms,'dd/MM/yyyy',timezonName);
      let currentDatems = new Date().getTime();
      let currentdate = new DatePipe('en-US').transform(currentDatems,'dd/MM/yyyy',timezonName);
      let candate = new DatePipe('en-US').transform(value,'dd/MM/yyyy',timezonName);
      if(currentdate==candate){
        let d = new DatePipe('en-US').transform(value,'h:mm a',timezonName);
        displayDate = 'Today ' + d;
      }
      // commented by Adarsh singh 
      // }else if(candate > startdateOfWeek) {
      //   displayDate = new DatePipe('en-US').transform(value,'EEEE,h:mm a',timezonName);
      else if(candate > startdateOfWeek && candate < enddateOfWeek) {
        displayDate = new DatePipe('en-US').transform(value,'EE,h:mm a',timezonName);
      }else{
        displayDate = new DatePipe('en-US').transform(value,'EE dd/MM/yyyy',timezonName);//EEEE,dd/MM/yyyy
      }
      return displayDate;
    }  
  
  }
  