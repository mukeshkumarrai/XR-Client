import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UtcDiff'
})
export class UtcDiffPipe implements PipeTransform {

  transform(startDate: Date, endDate: Date) {

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (!startDate || !endDate) {
      return '00:00:00';
    }

    const timeDifference = endDate.getTime() - startDate.getTime();
    const hoursDiff = timeDifference / (1000 * 60 * 60);

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const formattedResult = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;

    return formattedResult;
  }
  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
