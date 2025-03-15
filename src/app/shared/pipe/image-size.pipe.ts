/**
   @(C): Entire Software
   @Type: ts
   @Name: image-size.pipe.ts
   @Who: Ankit Rawat
   @When: 09Aug2024
   @Why: EWM-17853
   @What: This pipe is for showing image as per given format
  */
import { Pipe, PipeTransform } from '@angular/core';
import { ImageSize } from '../enums/job-detail.enum'

@Pipe({
  name: 'imageSize'
})
export class ImageSizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    try{
      if(args){
        const imageSize=ImageSize[args as keyof typeof ImageSize];
        return value?.replace(/(\.[\w]+)$/, '_'+imageSize+'$1');
      }
      else{
        return value;
      }
    }
    catch(error){
      console.log(error);
      return value;
    }
  }

}
