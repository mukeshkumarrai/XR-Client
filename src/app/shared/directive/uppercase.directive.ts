  /*
  @Type: File, <ts>
  @Name: convert lowerCase to Uppercase Pipe
  @Who: Adarsh singh
  @When: 22 March 2022
*/

import { Directive, HostListener } from '@angular/core';
  
  @Directive({
    selector: '[appUppercase]',
  })
  export class UppercaseDirective   {
    @HostListener('input', ['$event']) onInput(event) {
      // console.log("UpperCaseInputDirective::event",event);
      event.target.value = event.target.value.toUpperCase();
      return true;
    }
   
  }
  