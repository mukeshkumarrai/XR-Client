import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';


@Pipe({
  name: 'timezone'
})
export class TimezonePipe implements PipeTransform {

  public date: moment.Moment;
  private num = moment();
  public a: moment.Moment;
  public aFormat: string;
  private format = 'LLL Z z';
  public aSpecialFormat: string;

  getTimeZone: string = localStorage.getItem('UserTimezone')

  applySpecialFormat(dateTime: moment.Moment): string {
    let special = dateTime.format('llll');
    let offset = dateTime.utcOffset();
    return special + ' ' + dateTime.tz();
  }
  transform(date: any, timeZone: string): any {

    if (timeZone == undefined ) {
      timeZone = localStorage.getItem('UserTimezone');
      date = moment(this.num).utc();
      this.a = moment(this.num).tz(timeZone);
      this.aFormat = this.a.format(this.format);
      this.aSpecialFormat = this.applySpecialFormat(this.a);
    } else {
      date = moment(this.num).utc();
      this.a = moment(this.num).tz(timeZone);
      this.aFormat = this.a.format(this.format);
      this.aSpecialFormat = this.applySpecialFormat(this.a);
     // console.log(this.aFormat);
     // console.log(this.aSpecialFormat);
    }

    return this.aSpecialFormat;
  }

}
