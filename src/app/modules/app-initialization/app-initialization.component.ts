/*
  @(C): Entire Software
  @Type: Function
  @Who: Renu
  @When: 24-Feb-2021
  @Why:  Rost-865
  @What: Intermediate page
*/
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ResponceData } from 'src/app/shared/models';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { LoginService } from 'src/app/shared/services/login/login.service';
import {v4 as uuidv4} from 'uuid';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-app-initialization',
  templateUrl: './app-initialization.component.html',
  styleUrls: ['./app-initialization.component.scss']
})
export class AppInitializationComponent implements OnInit {

  public urlpath: string;
  userDefoultLang: string;
  langflag: string;
  loginResponce: any;

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private translateService: TranslateService,
    private authenticationService: LoginService,
    private _dynamicMenuService: DynamicMenuService,private cookieService: CookieService,private _AppSettingsService: AppSettingsService) { }

  ngOnInit(): void {
    const urlpath = window.location.hostname;
    let domainName:String='';
    // this.http.get("assets/config/App-settings.config.json").subscribe(data => {
    //   data = JSON.parse(JSON.stringify(data));
      // if(this._AppSettingsService.environment=='STG' || this._AppSettingsService.environment==''){
      //   domainName = urlpath.slice(0, urlpath.indexOf('.'));
      // }else{
      //   domainName = urlpath.slice(0, urlpath.indexOf('-'));
      // }
        /** @Who: renu @when: 12-04-2023 @Why:EWM-11590 */
       /** @Who: renu @when: 12-04-2023 @Why:EWM-11590 */
      // let urlWithoutProtocol = new URL(this._AppSettingsService.baseUrl).host; 
      // console.log("urlWithoutProtocol",urlWithoutProtocol.split('-').join(',').split('.').join(',')) 
       //let domainname = new URL(url).host; 
       let atr=urlpath.split('-').join(',').split('.').join(',');
      // console.log("domainname",  atr.split(',')[0]) ;
       domainName=atr.split(',')[0];
      // let url='https://biotique_12-client-qa-ewm.entiredev.in/client/core/home/dashboard';
      // let baseurl='http://sso-client-qa-ewm.entiredev.in';
      //let prefix=this._AppSettingsService.prefix;
      // let urlWithoutProtocol = new URL(baseurl).host; 
      // console.log("urlWithoutProtocol",urlWithoutProtocol) 
      // let domainname = new URL(url).host; 
      // console.log("domainname",domainname) ;
      // var upperleveldomain =domainname.split('.')[0]
      // console.log("mukesh",upperleveldomain) ;
      // let temp=upperleveldomain.replace(prefix,'');
      // console.log("final",temp);
        
      this.urlpath = window.location.origin;
      
      let domain:string;
      this.route.queryParams.subscribe(params => {
        if (params.domain) {
          domain = params.domain;
        } else {
          domain = '';
        }
      });
      if(this.cookieService.get('Token')!=undefined && this.cookieService.get('Token')!='' )
      {
        this.userLogin();
        return;
      }
     if (this.urlpath !== this._AppSettingsService.baseUrl && domain!='site') {
        window.location.href = this._AppSettingsService.baseUrl  + '/login?' + 'domain=' + domainName;

      } else if (domain != '' && domain!='site') {
        this.router.navigate(['/login'], { queryParams: { domain: domain } });
      } else {
        this.router.navigate(['/login']);
      }

   // });
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
  }
  /*
    @Type: Function
    @Who: Priti Srivastava
    @When: 29-june-2021
    @Why:  EWM-1863 (for user login in case of remeber me)
    @What: this function used for user login in case of remeber me.
  */
userLogin()
{
  const formData = { 'Domain': this.cookieService.get('userDomain'), 'IsRemember': Boolean(JSON.parse('true')), 'Device': 'web', 'Token': this.cookieService.get('Token') };
   
  this.authenticationService.loginDomain(formData).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
        if (data.Data.Token) {
          this.loginResponce = data.Data;
          // value['MFA'] = 2;
     /************@ehy: EWM-1988 @who: Mukesh @what: to load menu on page load inital level*******/
   this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
    console.log('JSON.stringify(response.Data)',JSON.stringify(response.Data));
    
    localStorage.setItem("menuInfo",JSON.stringify(response.Data));
    this._dynamicMenuService.menuStatusOb.next(1);
            if (this.loginResponce.MFA === 0) {
              this.setLocalStoreageData(data);
              this.router.navigate(['mfa']);
            } else if (this.loginResponce.MFA === 1) {
              this.setLocalStoreageData(data);
             // this.router.navigate(['./client/core/profile/profile-setting']);
              this.router.navigate(['./client/core/home/dashboard']);
            } else if (this.loginResponce.MFA === 2) {
              this.setLocalStoreageData(data);
              //this.router.navigate(['./client/core/profile/profile-setting']);
              this.router.navigate(['./client/core/home/dashboard']);
            } else {
              this.setLocalStoreageData(data);
              this.router.navigate(['mfa']);
            }
          });
          // set login sessionID :Priti(2-july-2021)EWM-1989
        //  localStorage.setItem('sessionId', uuidv4());
        } else {
          this.router.navigate(['/login']);
        }

      }
    },
    error => {
      this.router.navigate(['/login']);
    });
}
  /*
    @Type: Function
    @Who: Priti Srivastava
    @When: 29-june-2021
    @Why:  EWM-1863 (set localstoreage in case of remeber me)
    @What: this function used for user login in case of remeber me.
  */
setLocalStoreageData(data) {
  if (data.Data['Colors'] != undefined && data.Data['Colors'] != null) {
    localStorage.setItem('HeaderBackground', data.Data['Colors']['HeaderBackground']);
    localStorage.setItem('HeaderColor', data.Data['Colors']['HeaderColor']);
    localStorage.setItem('HighlightBackground', data.Data['Colors']['HighlightBackground']);
    localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
    localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
  }
  if (data.Data['Urls'] != undefined && data.Data['Urls'] != null) {
    localStorage.setItem('FaviconUrl', data.Data['Urls']['FaviconUrl']);
    localStorage.setItem('LogoUrl', data.Data['Urls']['LogoUrl']);
  }

  localStorage.setItem('MFA', data.Data['MFA']);
  localStorage.setItem('OrganizationId', data.Data['OrganizationId']);
  localStorage.setItem('OrganizationName', data.Data['OrganizationName']);//who:maneesh,what:ewm-15806 for set OrganizationName,when:23/01/2024
  localStorage.setItem('LastLoginDateTime', data.Data['LastLoginDateTime']);
  localStorage.setItem('TimeZone', data.Data['TimeZone']);
  localStorage.setItem('DateTimeFormat', data.Data['DateTimeFormat']);
  localStorage.setItem('QuickTour', data.Data['QuickTour']);
  //localStorage.setItem('Language', data.Data['Language']);
  if (data.Data['Language'] === null) {
    localStorage.setItem('Language', 'eng');
  } else {
    localStorage.setItem('Language', data.Data['Language']);
  }
}
}
