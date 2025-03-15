/**
   @(C): Entire Software
   @Type: ts
   @Name: phone.pipe.ts
   @Who: Renu
   @When: 02-jUNE-2023
   @Why: ewm-12698
   @What: This pipe used to format phonenumer in 2-4-4 format seprate country code
  */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  private readonly PHONE_REGEX = /^(\d{2})(\d{4})(\d{4})$/;
  private readonly SPACES = /\s+/g;
  
    transform(value: string): string {
      let trimmed = value.replace(this.SPACES, '');
     
      const matches = trimmed.match(this.PHONE_REGEX);
  
      if (!matches) {
        return value;
      }
  
      const phoneParts = matches.slice(1,);
      return phoneParts.join('-');
    }

}
