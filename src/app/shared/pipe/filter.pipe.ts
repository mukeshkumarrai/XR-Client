
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'NameFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @param {string} searchType
   * @returns {any[]}
   */
  public searchtype:string

  constructor(private translateService: TranslateService,){}

  transform(items: any[], searchText: string,searchType:string): any[] {  
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
     searchText = searchText.toLocaleLowerCase();
     this.searchtype = searchType;
if(this.searchtype=='Name'){
  return items.filter(x => {
    return x.Name.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
}
else if(this.searchtype=='Title'){
 return items.filter(x => {
    if (this.translateService.instant(x.Title).toLocaleLowerCase().indexOf(searchText) !== -1 ) {
      return this.translateService.instant(x.Title).toLocaleLowerCase().indexOf(searchText) !== -1 ; 
    }
    else{
      return '';
    }
 });
}

else if(this.searchtype=='TagName'){
  return items.filter(x => {
    return x.TagName.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
}
else if(this.searchtype=='SkillName'){
  return items.filter(x => {
    return x.SkillName.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
}
//@who:priti @why:EWM-4377 @what:filter data for client org list @when:29-DEC-2021-->
else if(this.searchtype=='ClientName'){
  return items.filter(x => {
    return x.ClientName.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
//@who:maneesh @why:EWM-16080 @what:filter data for tag  list @when:16-feb-2023-->
}else if(this.searchtype=='ShortDescription'){ 
  return items.filter(x => {
    return x.ShortDescription.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
}else if(this.searchtype=='PhoneNumber'){ 
  return items.filter(x => {
    return x.PhoneNumber.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
}
//@who:maneesh @why:EWM-17168 @what:filter data for status candidate header dropdown  list @when:22-05-2023-->
else if(this.searchtype=='Code'){ 
  return items.filter(x => {
    return x.Code.toLocaleLowerCase().indexOf(searchText) !== -1 ;
});
}
}
    
}

