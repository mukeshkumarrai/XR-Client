 /*
  @Type: File, <ts>
  @Name: OrderByFunPipe ts file
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For sortByPinAndDate
   */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByFun'
})
export class OrderByFunPipe implements PipeTransform {
  transform(value: any[]): any[] {
    value.sort((a, b) => {
        let IsPinSort = this.customSort(a, b, 'IsPin', 'number', 'desc');
        let LastActivitySort = this.customSort(a, b, 'LastActivity', 'string', 'desc');
        if (IsPinSort === 0) {
          return LastActivitySort;
        }
        return IsPinSort;    
    });
    return value;
  }

  sortLogic(a, b, field, type: string, direction: string) {
    if (type === 'string') {
      if (a[field] < b[field]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[field] > b[field]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
    }
  }

  customSort(a, b, field, type: string, direction: string) {
    return this.sortLogic(a, b, field, type, direction);
  }

}
