import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {
  }
  transform(value: any) {
    if (!value) {
      return '';
    }
    value = new Date(value);
    const now = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let seconds = Math.round(Math.abs((now.getTime() - value.getTime()) / 1000));
    let minutes = Math.round(Math.abs(seconds / 60));
    let hours = Math.round(Math.abs(minutes / 60));
    let days = Math.round(Math.abs(hours / 24));
    let week = Math.round(Math.abs(days / 7));

    const daysDifference = Math.floor(
      (now.getTime() - value.getTime()) / millisecondsPerDay
    );

      if (week ===0    ) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 10)
        // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };
      let counter;
      for (const i in intervals) {
       // console.log(i);
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
      }

    } else {
      return  this.datePipe.transform(new Date(value), 'dd-MM-yyyy hh:mm a');

    }
  }
}
