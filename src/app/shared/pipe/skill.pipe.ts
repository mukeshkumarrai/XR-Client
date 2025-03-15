import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skill'
})
export class SkillPipe implements PipeTransform {
 /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @param {string} searchType
   * @returns {any[]}
   */
  transform(value: any[], searchText: any): any[] {
    if(value.length===0){
      return value;
    }
    return value.filter(function(search){
      return search.SkillName.toLowerCase().indexOf(searchText) > -1
    })
 

  }
}
