import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchList'
})
export class SearchListPipe implements PipeTransform {

  transform(data: Array<any>, searchTxt: string): Array<any> {
    if (data) {
      return data?.filter(getData);
      function getData(value, index) {
        if ((value?.UserName.toUpperCase().indexOf(searchTxt.toUpperCase()) > -1) || (value?.EmailId.toUpperCase().indexOf(searchTxt.toUpperCase()) > -1)) {
          return data[index];
        }
      };
    }
  };

}

