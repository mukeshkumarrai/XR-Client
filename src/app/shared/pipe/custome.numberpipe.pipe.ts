/**
   @(C): Entire Software
   @Type: ts
   @Name: custome.numberpipe.pipe.ts
   @Who: Mukesh Kumar rai
   @When: 21-Sept-2020
   @Why: #ROST-147
   @What: This pipe format number into user define parameter if user not define any parameter  then it show default number format.
  */
import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
@Pipe({
  name: 'PipeNumberCustome',
})
export class CustomeNumberPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) { }
  transform(value: number, digitsInfo?: string): string {
    if (value) {
      let userDefineThousandSeparatorPlace: number = 3;
      const userDefineThousandSeparatorOn = true;
      let userDefineDecimalLength: number = 2;
      let userDefineThousandSeparatorCharacter: string = ',';
      let userDefineDecimalDelimiterCharacter: string = '.';

      let result = '\\d(?=(\\d{' + userDefineThousandSeparatorPlace + '})+' + (userDefineDecimalLength > 0 ? '\\D' : '$') + ')';
      let num = value.toFixed(Math.max(0, ~~userDefineDecimalLength));
      if (userDefineThousandSeparatorOn) {
        return (userDefineDecimalDelimiterCharacter ? num.replace('.', userDefineDecimalDelimiterCharacter) : num).replace(new RegExp(result, 'g'), '$&' + userDefineThousandSeparatorCharacter);
      } else {
        return (userDefineDecimalDelimiterCharacter ? num.replace('.', userDefineDecimalDelimiterCharacter) : num).replace(new RegExp(result, 'g'), '$&');
      }
    }

    return '';
  }
}
