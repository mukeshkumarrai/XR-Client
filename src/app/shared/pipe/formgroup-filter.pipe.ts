/**
   @(C): Entire Software
   @Type: ts
   @Name: custome.numberpipe.pipe.ts
   @Who: Renu
   @When: 03-Jan-2023
   @Why: #ROST-9388 EWM- 10001
   @What: This pipe used to filter/search an array of formgroup type .
  */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formgroupFilter'
})
export class FormgroupFilterPipe implements PipeTransform {

  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @param {string} searchType
   * @returns {any[]}
   */
  public searchtype:string;
  transform(items: any, searchText: string,searchType:string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
     searchText = searchText.toLocaleLowerCase();
     this.searchtype = searchType;
      return items.filter(x => {
        return x.controls['Code'].value.toLocaleLowerCase().indexOf(searchText) !== -1 ;
     });
  }
}
