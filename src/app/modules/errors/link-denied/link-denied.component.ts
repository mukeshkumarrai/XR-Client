/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: link-denied.component
  @Who: Nitin Bhati
  @When: 12-Mar-2021
  @Why: EWM-1146
  @What: This file handle all functionality related to link denied
*/
import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../shared/services/commonservice/commonservice.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-link-denied',
  templateUrl: './link-denied.component.html',
  styleUrls: ['./link-denied.component.scss']
})
export class LinkDeniedComponent implements OnInit {
  userDefoultLang: string;
  langflag: string;
  previousUrls;
  previousUrl: Observable<string> = this.commonserviceService.previousUrl$;
  selectedSubMenu: string;
  constructor(private translateService: TranslateService, public router: Router, public _sidebarService: SidebarService, private commonserviceService: CommonserviceService) { }

  ngOnInit(): void {
    this.commonserviceService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrls = previousUrl;
    });
    let URL = this.router.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(sessionStorage.getItem('LastmenuSelect'));
  }
  
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching language
  // @What: this function used for change language of application.
  // @Return: None
  // @Params :
  // 1. lang - language code.
  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
    this.langflag = lang;
  }
  /*
    @(C): Entire Software
    @Type: File, <ts>
    @Name: link-denied.component
    @Who: Nitin Bhati
    @When: 12-Mar-2021
    @Why: EWM-1146
    @What: for redirect login module
  */
  public domainDenied() {
    this.router.navigate([this.previousUrls]);
  }

}
