import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-outer-header',
  templateUrl: './outer-header.component.html',
  styleUrls: ['./outer-header.component.scss']
})
export class OuterHeaderComponent implements OnInit {
  userDefoultLang: string;
  langflag: string;
  private _jsonURL;
  dirctionalLang;
  userDefoultConvert: string;
  rtlVal: string = 'ltr';
  toggleActive: boolean = false;
  RoadMapMenuLink: string;
  APIMenuLink: string;
  SupportMenuLink: string;
  DocumentCentreMenuLink: string;
  OptionalMenu: number;

  constructor(
    private translateService: TranslateService,
    private http: HttpClient,
    private domSanitizer: DomSanitizer,
    private commonServiesService: CommonServiesService,
    private commonserviceService: CommonserviceService,private _appSetting: AppSettingsService
  ) { 
    this.RoadMapMenuLink=this._appSetting.roadMapMenuLink;  
    this.APIMenuLink=this._appSetting.aPIMenuLink; 
    this.DocumentCentreMenuLink=this._appSetting.documentCentreMenuLink; 
    this.SupportMenuLink=this._appSetting.supportMenuLink; 
    this.OptionalMenu=this._appSetting.optionalMenu; 
  }

  ngOnInit(): void {
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
      document.getElementById("loginDivId").dir = "ltr";
      // this.renderer.removeClass(this.langDiv.nativeElement, 'left-align');
      // this.renderer.addClass(this.langDiv.nativeElement, 'right-align');
    } else {
      this.commonserviceService.onUserLanguageDirection.next('rtl');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'rtl';
      document.getElementById("headerId").dir = "rtl";
      document.getElementById("loginDivId").dir = "rtl";
      // this.renderer.removeClass(this.langDiv.nativeElement, 'right-align');
      // this.renderer.addClass(this.langDiv.nativeElement, 'left-align');
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
