
/*
   @Type: File, <html>
   @Name: custome.validator.ts
   @Who: Adarsh singh
   @When: 11-Mar-2023
   @Why: EWM-10688
   @What: for validation date which entered manually
*/
import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class CustomValidatorService {

  constructor() { }

  static CustomerNumberCustomValidation(control: FormControl) {
    var reg = /[^A-Za-z0-9]+/;
    if (control.value) {
      const matches = control.value.match(reg);
      return matches ? null : { 'CustomerNumberCustomValidation': true };
    } else {
      return null;
    }
  }
  // convertDate(inputFormat) {
  //   function pad(s) { return (s < 10) ? '0' + s : s; }
  //   var d = new Date(inputFormat)
  //   return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  // }
  static dateValidator(control: FormControl) {
    if (control.value == '' || control.value == null) {    
      return;
    }else{  // @suika @EWM-11024 handle date picker parsing issue
      function pad(s) {
        return (s < 10) ? '0' + s : s;
      }
      var d = new Date(control.value);
      let date = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
  
      if (date) {
        const matches = date.match(/^\d{2}\/\d{2}\/\d{4}$/);
        let defaultJsDate = "01/01/1970";
        if (date == defaultJsDate) {
          return { 'invalidDate': true }
        } else {
          return matches ? null : { 'invalidDate': true };
        }
      } else {
        return null;
      }
    }

  }
}