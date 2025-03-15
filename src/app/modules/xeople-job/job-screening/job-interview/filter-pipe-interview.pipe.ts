import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipeInterview'
})
export class FilterPipeInterviewPipe implements PipeTransform {
  
    transform(items: any[], searchTerm: any, searchBy: string) {

      // when our serach is undefined or null
      if (!searchTerm) {
        return items;
      }
  
      // when there is partial or full match of the search term
      return items.filter(item => {
        const currentItem = item[searchBy];
        return currentItem.toString().toLowerCase().includes(searchTerm.trim().toLowerCase());
      });
    }

}
