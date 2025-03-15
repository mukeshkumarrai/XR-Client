import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "customsort"
})
export class ArraySortPipe  implements PipeTransform {
    constructor(private translate : TranslateService) {}
  transform(array: any, field: string): any[] {
  
    if (!Array.isArray(array)) {
      return;
    }
    const filterOrderByIsNull = array.every((item) => item.FilterOrderBy === null);
    if (filterOrderByIsNull) {
        array?.sort((a: any, b: any) =>
      {
        if (this.translate.instant(a?.Title) < this.translate.instant(b?.Title))
          return -1;
        else if (this.translate.instant(a?.Title) > this.translate.instant(b?.Title))
          return 1;
        else
          return 0;
      });
    }else{
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    }
    return array;
  }
}