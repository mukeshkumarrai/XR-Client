import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utctodatetime'
})
export class UtctodatetimePipe implements PipeTransform {

  transform(value: any, args?: any, time?: any,timezonName?:any): any { 
    moment.tz.setDefault(timezonName);
    let format = '';
    if(args==12 && time=='start'){
      format = 'hh:mm a';
    }else if(args==12 && time=='end'){
      format = 'hh:mm a';
    }else if(args==24 && time=='start'){
      format = 'HH:mm ';
    }else if(args==24 && time=='end'){
      format = 'HH:mm ';
    }else{
      format = 'HH:mm a';
    }
    const d = new Date(Number(value));    
    let local_date =  moment.utc(d).tz(timezonName).format(format);  
    return local_date;
  }

}
