import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'base64'
})
export class Base64Pipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }
  public transform(value: any, contentType: string): any {
    if(value){  
    let base64Content = this.domSanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${value}`);
    return base64Content;
  }
   
  }
}
