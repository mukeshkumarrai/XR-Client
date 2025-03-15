/*
    @Type: File, <ts>
    @Name: SortByOrderPipe
    @Who: Adarsh singh
    @When: 22-11-2022
    @Why: ROST-9065
    @What: for ordering data in first which has been maped
*/

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'sortByOrder'
})
export class SortByOrderPipe implements PipeTransform {

  transform(value: any[]): any[] {
    value.sort((a: any, b: any) => {
      if (a.IsMapped < b.IsMapped) {
        return 1;
      } else if (a.IsMapped > b.IsMapped) {
        return -1;
      } else {
        return 0;
      }0
    });
    return value;
  }
}