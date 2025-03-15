/**
   @(C): Entire Software
   @Type: ts
   @Name: custome.currencypipe.pipe.ts
   @Who: Mukesh Kumar rai
   @When: 21-Sept-2020
   @Why: #ROST-144
   @What: This pipe format currency and show currency icon at starting.
  */
import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'PipeCurrencyCustome',
})

export class CustomeCurrencyPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) { }
  transform(value: any, userCurrencySign: string = '₹ ', digitsInfo?: string): string {
    let data = Number(value);
    if (value) {
      //alert(userCurrencySign)


      let userDefineThousandSeparatorPlace: number = 3;
      const userDefineThousandSeparatorOn = true;
      let userDefineDecimalLength: number = 2;
      let userDefineThousandSeparatorCharacter: string = ',';
      let userDefineDecimalDelimiterCharacter: string = '.';

      let result = '\\d(?=(\\d{' + userDefineThousandSeparatorPlace + '})+' + (userDefineDecimalLength > 0 ? '\\D' : '$') + ')';
      let num = data.toFixed(Math.max(0, ~~userDefineDecimalLength));
      if (userDefineThousandSeparatorOn) {
        // return userCurrencySign + (userDefineDecimalDelimiterCharacter ? num.replace('.', userDefineDecimalDelimiterCharacter) : num).replace(new RegExp(result, 'g'), '$&' + userDefineThousandSeparatorCharacter);
        return (userDefineDecimalDelimiterCharacter ? num.replace('.', userDefineDecimalDelimiterCharacter) : num).replace(new RegExp(result, 'g'), '$&' + userDefineThousandSeparatorCharacter);
      } else {
        // return userCurrencySign + (userDefineDecimalDelimiterCharacter ? num.replace('.', userDefineDecimalDelimiterCharacter) : num).replace(new RegExp(result, 'g'), '$&');
        return (userDefineDecimalDelimiterCharacter ? num.replace('.', userDefineDecimalDelimiterCharacter) : num).replace(new RegExp(result, 'g'), '$&');
      }

    }

    return '';
  }
}
