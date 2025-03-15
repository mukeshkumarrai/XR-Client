 /*
  @Type: File, <ts>
  @Name: orderTranslate ts file
  @Who: RENU
  @When: 02-Nov-2023
  @Why: EWM-15018 EWM-15027
  @What: ORDER BY TO COVERT FOR LANGUGAE FILE
   */
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'orderTranslate'
})
export class OrderTranslatePipe implements PipeTransform {

  constructor(private translate : TranslateService) {}
    transform(array: Array<string>): Array<string>
    {
      array?.sort((a: any, b: any) =>
      {
        if (this.translate.instant(a?.Title) < this.translate.instant(b?.Title))
          return -1;
        else if (this.translate.instant(a?.Title) > this.translate.instant(b?.Title))
          return 1;
        else
          return 0;
      });
      return array;
    }

}
