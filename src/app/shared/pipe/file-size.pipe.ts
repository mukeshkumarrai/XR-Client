/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Adarsh Singh
  @When: 12-Sep-2022
  @Why: EWM-8235 EWM-8298
  @What: this page is use for convert TimeStmap into KB,Mb,Gb,Tb
*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSize implements PipeTransform {

  transform(bytes: any, args?: any): any {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]; 
    if (bytes == 0) { 
      return "0 Byte"; 
    } 
    const i = Math.floor(Math.log(bytes) / Math.log(1024)); 
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }

}