import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberpipe'
})
export class NumberpipePipe implements PipeTransform {
    transform(value: number, unit: string) {
       
        if(!isNaN(value)) {
            if (unit === 'M') {
             
                let months=value % 12;
                let year = (value-months) / 12;
             
                if(year==0)
                {
                    return months +' month(s)'
                }
                else if(months==0)
                {
                    return year+' Year(s)'
                }
                else{
                    return year +' Year(s) '+months+' month(s)';
                }
               
            } 
        }
        return;
    }
}
