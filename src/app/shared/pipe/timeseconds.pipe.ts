import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeseconds'
})
export class TimesecondsPipe implements PipeTransform {

  transform(value: number): string {
     let time:string;
        const hours: number = Math.floor(value / 3600);
        const minutes: number = Math.floor(value / 60);
        time= hours.toString().padStart(2, '0') +':'+minutes.toString().padStart(2, '0') + ':' + 
        Math.floor((value - minutes * 60)).toString().padStart(2, '0');
        if(time!='NaN:NaN:NaN')
        {
          return time;
        }
      else{
        return '';
      }
  
 }

}
