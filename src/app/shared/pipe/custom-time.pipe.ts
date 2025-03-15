/**
   @Type: ts
   @Name: custom.time.pipe.ts
   @Who: RENU
   @When:05-12-2023
   @Why: EWM-15297 EWM015295
   @What: This pipe format FOR TIME ONLY ( NO NEED OF DATE) .
  */
 import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'customTime'
})
export class CustomTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return moment(value,'hh:mm').format("hh:mm A");
  }

}
