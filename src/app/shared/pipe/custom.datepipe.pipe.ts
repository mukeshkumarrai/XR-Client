/**
   @(C): Entire Software
   @Type: ts
   @Name: custome.currencypipe.pipe.ts
   @Who: Mukesh Kumar rai
   @When: 21-Sept-2020
   @Why: #ROST-144
   @What: This pipe format date  .
  */
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Pipe({
  name: 'PipeDateCustome'
})
export class CustomDatepipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let local_date = moment.utc(value).local().format('YYYY-MM-DD HH:mm:ss a');
    return local_date;
  }

}
