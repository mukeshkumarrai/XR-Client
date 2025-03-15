/*
   @Type: File, <html>
   @Name: dayHoursMinutesFormat.pipe.ys
   @Who: Adarsh Singh
   @When: 04-Mar-2023
   @Why:EWM-10721
   @What: dayHoursMinutesFormat pipe
*/
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
    name: 'dayHoursMinutesFormat'
})

export class DayHoursMinutesFormatPipe implements PipeTransform {
    transform(value: any, unit: string) {
        let currentdate = new Date();
        if (value) {
            let comingDate = Math.round(value);
            let diff = 0;
            diff = comingDate - currentdate.getTime();
            let diffDays = Math.floor(diff / 86400000); // days
            let diffHrs = Math.floor((diff % 86400000) / 3600000); // hours
            let diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); //minuts
            if (unit == "dayHoursMinutes") {
                if (diff < 0) {
                    let date = Math.round(value);
                    let now = new Date(date);
                    let getDateFormat = localStorage.getItem('DateFormat');
                    let dateString = moment(now).format(getDateFormat);
                    return `Job Expired On (${dateString})`;
                } else {
                    return diffDays + 'd ' + diffHrs + 'h ' + diffMins + 'm ';
                }
            } else {
                return diffDays + 'd';
            }
        }
        return;
    }
}