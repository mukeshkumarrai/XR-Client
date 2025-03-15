import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customeFirstletterCappipe'
})
export class CustomeFirstletterCappipePipe implements PipeTransform {

  transform(value: any, status: any): unknown {
    return null;
  }

}
