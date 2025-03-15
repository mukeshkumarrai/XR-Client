import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({
    name: 'numbertomonth'
})
export class NumberToMonthPipe implements PipeTransform {
    transform(value: number, unit: string) {
        if(value && !isNaN(value)) {
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