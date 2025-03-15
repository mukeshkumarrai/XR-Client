
/*
  @(C): Entire Software
  @Type: tenant-user.component.ts
  @Who: Renu
  @When: 07-Apr-2021
  @Why:  ROST-1289
  @What: multiple selection of tenant before login to system
*/

import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tenant-user',
  templateUrl: './tenant-user.component.html',
  styleUrls: ['./tenant-user.component.scss'],
  providers: [DummyService]
})
export class TenantUserComponent implements OnInit {

  /*****************common variable declaration************************* */
  @ViewChild('langDiv') langDiv: ElementRef;
  public tenantData;
  public shortTokenInfo;
  userDefoultLang: string;
  langflag: string;
  public devEnvSettings: any;
  currentUser: any;
  username: string;
  userShortName:string;
  userImage:string;
  DomainName: any;
  TenantUrl: any;
  SelectedDomain:string;
  dirctionalLang;
  private _jsonURL;
  isRtl = false;
  rtlVal: string = 'ltr';
  userDefoultConvert: string;
  modaldata: any;
  disabled:boolean=true;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  redirectUrl:any;
  

  constructor(private commonserviceService:CommonserviceService, private translateService: TranslateService,
    private http: HttpClient, private _commonService: CommonServiesService,  private renderer: Renderer2,
    public router: Router,private route: ActivatedRoute,
    public dummyService: DummyService, private cookieService: CookieService, private domSanitizer: DomSanitizer,
    public dialog: MatDialog,private _appSettingsService:AppSettingsService,
    @Inject(DOCUMENT) private document: Document) { }

ngOnInit(): void {
  this.commonserviceService.setDrawer(this.drawer);
  this.currentUser=localStorage.getItem('tenantData') || localStorage.getItem('currentUser'); 
  if(this.currentUser!=null){
    let obj: any = JSON.parse( this.currentUser);
    this.username=obj.FirstName+" "+obj.LastName;
    this.userShortName=obj.ShortName;
    this.userImage=obj.ProfileUrl;
  }
  
  this.commonserviceService.getTenantInfo().subscribe(value => {
      this.tenantData=value;

  })
  
  let tenantData=localStorage.getItem('StoredTenantData');
  this.tenantData = JSON.parse(tenantData);

  this.commonserviceService.getshortTokenInfo().subscribe(value => {
    this.shortTokenInfo=value;
  })

// this.http.get("assets/config/App-settings.config.json").subscribe(data => {
    //data = JSON.parse(JSON.stringify(data));
    this.devEnvSettings = this._appSettingsService.systemConfig;
// });


  this.route.queryParams.subscribe(params => {
    this.redirectUrl = params['redirectUrl'];

  });

  let getClass = document.getElementById("main-section");
  getClass.classList.add('tenant-screen-section')
  // --------@When: 20-July-2023 @who:Adarsh singh @why: EWM-13459 --------
  if (!this.shortTokenInfo) {
    this.router.navigate(['/login']);
  }
  this.document.body.classList.add('login-screen-body');
}

@HostListener('window:scroll', ['$event'])
onWindowScroll(e) {
    if (window.scrollY > 20) {
      let element = document.getElementById('login-container');
      element.classList.add('header-sticky');
    } else {
      let element = document.getElementById('login-container');
      element.classList.remove('header-sticky'); 
    }
}

/*
  @(C): Entire Software
  @Type: Function
  @Who: Satya Prakash Gupta
  @When: 24-Feb-2021
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
  this._commonService.emitEvent(this.rtlVal);
  if (value == 'ltr') {
     this.commonserviceService.onUserLanguageDirection.next('ltr');
     this.translateService.setDefaultLang(this.userDefoultLang);
     this.userDefoultConvert = 'ltr';
     document.getElementById("headerId").dir = "ltr";
     document.getElementById("loginDivId").dir = "ltr";
     this.renderer.removeClass(this.langDiv.nativeElement, 'left-align');
    this.renderer.addClass(this.langDiv.nativeElement, 'right-align');
  } else {
    this.commonserviceService.onUserLanguageDirection.next('rtl');
     this.translateService.setDefaultLang(this.userDefoultLang);
     this.userDefoultConvert = 'rtl';
     document.getElementById("headerId").dir = "rtl";
     document.getElementById("loginDivId").dir = "rtl";
     this.renderer.removeClass(this.langDiv.nativeElement, 'right-align');
    this.renderer.addClass(this.langDiv.nativeElement, 'left-align');
  }
}

  /*
  @Type: File, <ts>
  @Name: userDomainRedirection function
  @Who: Renu
  @When: 07-Apr-2021
  @Why: ROST-1289
  @What: for setting value to selected domain
  */
  userDomainRedirection(DomainName:any,TenantUrl:any){
    this.DomainName=DomainName;
    this.TenantUrl=TenantUrl;
    this.SelectedDomain = DomainName;
    this.disabled=false;

    //@when:27-Feb-2023 | @who:Satya Prakash Gupta | @why: EWM-10695 EWM-10841 | add function (onNext()) here
    if (this.devEnvSettings === 'local')
    {
      if(this.redirectUrl!=undefined && this.redirectUrl!=null && this.redirectUrl!=''){
        window.location.href = 'http://localhost:4200/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName + '&redirectUrl=' + this.redirectUrl;
      }else{
        window.location.href = 'http://localhost:4200/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName;
         }
       }
       else{
        if(this.redirectUrl!=undefined && this.redirectUrl!=null && this.redirectUrl!=''){
          window.location.href = this.TenantUrl+'/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName + '&redirectUrl=' + this.redirectUrl;
       }else{
          window.location.href = this.TenantUrl+'/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName;
       }
        
    }
    if(localStorage.getItem('isRemember')=='true'){
      this.cookieService.set('userDomain',this.DomainName);  //priti
     }
     else{
       this.cookieService.delete('userDomain');
       
     }
  }
 /*
  @Type: File, <ts>
  @Name: onNext function
  @Who: Renu
  @When: 07-Apr-2021
  @Why: ROST-1289
  @What: for logging to selected domain
  */

  //@when:27-Feb-2023 | @who:Satya Prakash Gupta | @why: EWM-10695 EWM-10841 | This functionality move to userDomainRedirection function
  /*onNext(){
    if (this.devEnvSettings === 'local')
    {
      if(this.redirectUrl!=undefined && this.redirectUrl!=null && this.redirectUrl!=''){
        window.location.href = 'http://localhost:4200/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName + '&redirectUrl=' + this.redirectUrl;
      }else{
        window.location.href = 'http://localhost:4200/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName;
         }
       }
       else{
        if(this.redirectUrl!=undefined && this.redirectUrl!=null && this.redirectUrl!=''){
          window.location.href = this.TenantUrl+'/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName + '&redirectUrl=' + this.redirectUrl;
       }else{
          window.location.href = this.TenantUrl+'/landingpage?Token=' + encodeURIComponent(this.shortTokenInfo) + '&DomainName=' + this.DomainName;
       }
        
    }
    if(localStorage.getItem('isRemember')=='true'){
      this.cookieService.set('userDomain',this.DomainName);  //priti
     }
     else{
       this.cookieService.delete('userDomain');
       
     }
  }*/

  
  // @(C): Entire Software
  // @Type: Function
  // @Who: Nitin Bhati
  // @When: 13-Oct-2020
  // @Why:  For read json File data
  // @What: this function used for change Json File dynamically of application.
  // @Return: None
  // @Params : lang, _jsonURL
  public getJSON(lang): Observable<any> {
    this._jsonURL = '/assets/i18n/' + lang + '.json';
    let jsonURLSanitze:any =  this.domSanitizer.bypassSecurityTrustUrl(this._jsonURL)
    return this.http.get(jsonURLSanitze.changingThisBreaksApplicationSecurity);
  }
}


