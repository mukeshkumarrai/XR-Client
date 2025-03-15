/**
   @(C): Entire Software
   @Type: ts
   @Name: custome.phone.pipe.ts
   @Who: Ankit Rawat
   @When: 13 May 2024
   @Why: EWM-16433
   @What: This pipe format the phone number as per country code
  */

   import { Pipe, PipeTransform } from '@angular/core';
   import { AsYouType,parsePhoneNumber } from 'libphonenumber-js'
   
   @Pipe({
     name: 'customPhoneFormat'
   })
   export class CustomPhonePipe implements PipeTransform {
     transform(value: any, args?: any): any {
       if(value && args){
         try{
          const phoneNumber = parsePhoneNumber(value, args);
          return new AsYouType().input(phoneNumber?.number);
         }
         catch(error){
           console.log(error);
           return value;
         }
       }
       else return value;
     }
   }
   