import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss']
})
export class DocumentHeaderComponent implements OnInit {
  userDefoultLang: string;
  langflag: string;
  private _jsonURL;
  dirctionalLang;
  userDefoultConvert: string;
  rtlVal: string = 'ltr';
  toggleActive: boolean = false;
  
  constructor(
    private translateService: TranslateService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private commonServiesService: CommonServiesService,
    private commonserviceService: CommonserviceService
  ) { }

  ngOnInit(): void {
  }

  /*
  @(C): Entire Software
  @Type: Function
  @Who: Nitin Bhati
  @When: 13-Oct-2020
  @Why:  For read json File data
  @What: this function used for change Json File dynamically of application.
  @Return: None
  @Params : lang, _jsonURL
  */
  public getJSON(lang): Observable<any> {
   this._jsonURL = 'assets/i18n/' + lang + '.json';
    let jsonURLSanitze:any =  this.domSanitizer.bypassSecurityTrustUrl(this._jsonURL)
    return this.http.get(jsonURLSanitze.changingThisBreaksApplicationSecurity);
  }

  /*
  @(C): Entire Software
  @Type: Function
  @Who: Mukesh kumar rai
  @When: 10-Sept-2020
  @Why:  Switching language
  @What: this function used for change language of application.
  @Return: None
  @Params :
  1. lang - language code.
*/

  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
    this.langflag = lang;
    this.getJSON(lang).subscribe(data => {
      this.dirctionalLang = data._sys_language_direction;
      this.toggleLtrRtl(this.dirctionalLang);
    });
  }


  /*
@Type: File, <TS>
@Name: header.component.ts
@Who: Nitin Bhati
@When: 09-Oct-2020
@Why: ROST-247
@What: Implementation of Header Section Flip with Logo Icon
*/

  data = 'Initial Data';
  toggleLtrRtl(value) {
    this.rtlVal = value;
    this.commonServiesService.emitEvent(this.rtlVal);
    if (value == 'ltr') {
      this.commonserviceService.onUserLanguageDirection.next('ltr');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'ltr';
      document.getElementById("headerId").dir = "ltr";
    } else {
      this.commonserviceService.onUserLanguageDirection.next('rtl');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'rtl';
      document.getElementById("headerId").dir = "rtl";
    }
  }

   /*
  @Type: File, <ts>
  @Name: toggleSidenav()
  @Who: Renu
  @When: 22-Dec-2020
  @Why: ROST-572
  @What: For toggling side nav on moblie menu
  */

  toggleSidenav() {
    this.toggleActive = !this.toggleActive;
    this.commonserviceService.toggle();
  }

}
