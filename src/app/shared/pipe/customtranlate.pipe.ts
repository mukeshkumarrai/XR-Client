import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'customTranslate',
  pure: false
})
export class CustomtranlatePipe implements PipeTransform {



  public manageData: any;
  public transString: any;
  replacekey: any;

  constructor(private translateService: TranslateService) {

  }
  transform(value: any): unknown {
    //console.log(value);
    let result;
    let lang = localStorage.getItem('Language');
    this.manageData = [JSON.parse(localStorage.getItem('ManageName'))];
    let transString;
    //this.translateService.setDefaultLang(lang);
    if(value){
      this.translateService.get(value).subscribe((responce: string) => {
        transString = responce;
      });
      result = this.replaceText(transString);
  
      if (result) {
        return result;
      }
    }
   
  }

  replaceText(transString) {
    let result: string;
    let lang = localStorage.getItem('Language');

    for (let obj of this.manageData) {
      for (let key in obj) {
        let objKey = Object.assign({}, JSON.parse(obj[key]));
        let replacekey = '{{' + key.toLowerCase() + '}}';
        if (transString != undefined) {
          // result = transString.replaceAll('{{client}}', 'mukesh');
          if (transString.includes(replacekey)) {
            if (transString.indexOf(replacekey) > 0) {
              result = transString.replaceAll(replacekey, objKey[lang]);
            }
            else {
              result = transString.replaceAll(replacekey, objKey[lang]);

            }

            return result;
          } else {
            result = transString;
          }
        }
      }
    }

    return result;
  }
}
