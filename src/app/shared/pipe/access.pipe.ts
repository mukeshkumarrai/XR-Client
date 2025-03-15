import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SeekPipe'
})
export class AccessPipe implements PipeTransform {
 /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @param {string} searchType
   * @returns {any[]}
   */

  transform(items: any[], searchText: string): any[] {
     if(!items) return [];

    if(!searchText) return items;

    return this.searchItems(items, searchText.toLowerCase());
   }

   private searchItems(items :any[], searchText): any[] {
     let results = [];
      items.forEach(it => {
        if (it.Node.Name.toLowerCase().includes(searchText)) {
            results.push(it);
        } 
        // else {
        //   let searchResults =  this.searchItems(it.items_containers, searchText);
        //   if (searchResults.length > 0) {
        //       results.push({
        //         title: it.Node.Name,
        //         items_containers: searchResults
        //       });
        //   }
        // }
      });
      return results;
   }

  // transform(items: any[], searchText: any): any[] {
  //     if(items.length===0){
  //     return items;
  //   }
  //   return items.filter(item => {
  //     return Object.keys(item).some(key => {
  //       return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
  //     });
  //   });
  // }
}
