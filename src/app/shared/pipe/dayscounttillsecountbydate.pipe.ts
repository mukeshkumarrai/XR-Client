
/*
value:  will be millisecond 
unit-->
To: for subtarct current date to given date
From: for subtarct  given date from current date 
*/
import { DatePipe } from '@angular/common';
import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
    name: 'dayscounttillsecontsbydate'
})

export class DaysCountTillSecontsByDatePipe implements PipeTransform {
    transform(value: any, unit: string) {
       let currentdate=new Date();
        if(value) {
          let comingDate=Math.round(value);
          //let comingDate=new Date(value);
           let diff=0;
           if(unit=="To"){
           // diff=comingDate.getTime()-currentdate.getTime();
            diff=comingDate-currentdate.getTime();
           }
          else{
           // diff= currentdate.getTime()-comingDate.getTime();
            diff= currentdate.getTime()-comingDate;
          }
          let diffDays = Math.floor(diff / 86400000); // days
          let diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
          let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); //minuts
          let diffsec = Math.round((((diff % 86400000) % 3600000) % 60000)/60000); //second
        // return diffDays+'d '+diffHrs+'h '+diffMins+'m '+diffsec+'s';
        if(unit=="FromWithHour"){
            return diffDays+ 'd '+ diffHrs+ 'h '+diffMins+ 'm '+diffsec+ 's ';
        }else{
         return diffDays+ 'd'; 
        }

        }
        return;
    }
}