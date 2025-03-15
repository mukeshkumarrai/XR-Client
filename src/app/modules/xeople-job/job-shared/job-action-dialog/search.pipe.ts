import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchPipe implements PipeTransform {

  constructor(private translateService: TranslateService,){}
  
  transform(items: any[], filterdata: string): any[] {
    if (!items) return [];
    if (!filterdata) return items;
    // console.log(filterdata);
    filterdata = filterdata.toString().toLowerCase();
    return items.filter((it) => {
    //   console.log(it);
      return this.translateService.instant(it.Title).toLowerCase().includes(filterdata);
    });
  }

}
