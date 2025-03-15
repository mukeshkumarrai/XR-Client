/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: application-preview.component.ts
 @Who: Renu
 @When: 23-May-2022
 @Why: ROST-6558 EWM-6782
 @What: preview automatic form component
 */
import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from '../modules/EWM.core/shared/services/Job/job.service';
import { QuickJobService } from '../modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ResponceData, User } from '../shared/models';
import { LoginService } from '../shared/services/login/login.service';
import { SnackBarService } from '../shared/services/snackbar/snack-bar.service';
import { PreviewSaveService } from './shared/preview-save.service';
import { Observable } from 'rxjs';
import { ProfileInfoService } from '../modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ThemingService } from '../shared/services/theming.service';
import { AppSettingsService } from '../shared/services/app-settings.service';

@Component({
  selector: 'app-application-preview',
  templateUrl: './application-preview.component.html',
  styleUrls: ['./application-preview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationPreviewComponent implements OnInit {

  loading: boolean = false;
  imagePreviewStatus: boolean;
  public imagePreviewloading: boolean = false;
  public logoPreviewUrl: string;
  public opicityData="0.5";
  headingInputValue:string='';
  subHeadingInputValue:string='';
  AboutUs: any;
  showUploadResume: boolean=false;
  public agentId: string;
  public apiKey: string;
  public applicationParam:string;
  public DomainName:string='';
  public jobId: any;
  public JobName: string;
  public mode: string;
  public stepperConfig: any;
  public currentUser: Observable<User>;
  clientNameId: any;
  employeeNameId: any;
  leadNameId: any;
  xeopleURL:string;
  welcomeInfo: any;
  Domain:string;
  public primaryBgColor: string = '#673AB7';
  public primaryTxtColor: string = '#ffffff';
  public highlightBgColor: string = '#7FB734';
  public highlightTxtColor: string = '#ffffff';
  type: string;

  constructor(private routes: ActivatedRoute,private snackBService: SnackBarService,private translateService: TranslateService,
    private jobService: JobService,private loginService:LoginService,private _appSettingsService:AppSettingsService,
    private route:Router, private quickJobService: QuickJobService,private  previewSaveService:PreviewSaveService,
    private _profileInfoService: ProfileInfoService,private theming: ThemingService) { 
      this.agentId=this._appSettingsService.agentId;
      this.apiKey=this._appSettingsService.apikey;  
      this.clientNameId = this._appSettingsService.clientNameId;
      this.employeeNameId = this._appSettingsService.employeeNameId;
      this.leadNameId = this._appSettingsService.leadNameId;
      this.xeopleURL = this._appSettingsService.xeopleURL;
      this.themeApply();
    }

  ngOnInit(): void {
    this.checkDeviceName();
    let appId:number;
    const { hostname}  = new URL( window.location.origin);
    let [subdomain] = hostname.split('.');
    let prefix=this._appSettingsService.prefix;
    this.DomainName=subdomain.replace(prefix,'');
    this.routes.queryParams.subscribe((parms: any) => {
      if(parms?.mode){
        this.mode=parms?.mode;
        this.Domain = parms?.domain;
      }
     appId=parms?.applicationId;
      if (parms?.applicationId) {
        this.applicationParam='?applicationId='+parms?.applicationId;
        this.type=parms?.type;
    
      }else  if (parms?.jobId){
        this.applicationParam='?jobId='+parms?.jobId;
        if(this.mode=='apply'){
          this.getAuthenticationToken(parms?.jobId);
        }
      }
    });
    if(this.mode!='apply'){
    this.getWelcomePageDataById(this.applicationParam);
    this.getStepperConfig(this.applicationParam);
    this.getThankYouPageById(appId);
    }
    this.getDefaultDarkMode();
  }

getAuthenticationToken(jobId) {
  this.loading = true;
  if (this.DomainName == 'localhost') {
    this.DomainName = this.Domain;
  }
  let obj={};
  obj['DomainName']=this.DomainName;//this.DomainName;/
  obj['AgentKey']=this.agentId;
  obj['APIKey']=this.apiKey;
  this.loginService.getAuthenticationExternalUser(obj).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
       this.setLocalStoreageData(data);
       setTimeout(() => {
         if(localStorage.getItem('Token')!==null){
          this.getWelcomePageDataById(this.applicationParam);
          this.getThankYouPageById(this.applicationParam);
          this.getStepperConfig(this.applicationParam);
          this.getManageListAll();
         } }, 3000);
      }
      
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}

/*
     @Type: File, <ts>
     @Name: getManageListAll function
     @Who: Anup
     @When: 26-aug-2021
     @Why: EWM-2008 EWM-2285
     @What: get defualt manage Name All
     */

     getManageListAll(){
      this._profileInfoService.getManageNameAllList('?ParentId=' +this.clientNameId+','+this.employeeNameId+','+this.leadNameId).subscribe(
        (repsonsedata:ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           let data=repsonsedata.Data.Data;
            localStorage.setItem("ManageName", JSON.stringify(data));
          }
        },
        err => {
          this.loading=false;
        })
    }
 /*
    @Type: File, <ts>
    @Name: setLocalStoreageData function
    @Who: Renu
    @When: 21-Jan-2020
    @Why: ROST-663
    @What: For Storing Neccessary Information in localstorage
    */

    setLocalStoreageData(data) {

      localStorage.setItem('currentUser',JSON.stringify(data.Data));
      localStorage.setItem('tenantData', JSON.stringify(data.Data));
      localStorage.setItem('Token', data.Data['Token']);
      localStorage.setItem('TimeZone', data.Data['TimeZone']);
      this.loginService.currentUserSubject.next(data);
        }

      /*
@Type: File, <ts>
@Name: getStepperConfig function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6558 EWM-6782
@What: get stepper Config
*/
getStepperConfig(ApplicationFormId){

  this.jobService.fetchConfigStepperById(ApplicationFormId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
        this.loading=false;
         this.stepperConfig=data.Data;
         this.previewSaveService.stepperConfigInfo.next(this.stepperConfig);
      } else {
        this.loading=false
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
  }
 
  /*
@Type: File, <ts>
@Name: getWelcomePageDataById function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6558 EWM-6782
@What: get data welcome page by Id
*/
getWelcomePageDataById(ApplicationFormId: any) {
  this.loading = true;
  this.jobService.fetchWelComePageDataById(ApplicationFormId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
        if(data?.Data!=undefined && data?.Data!=null && data?.Data!=''){
          this.welcomeInfo=data?.Data;
          if (data?.Data?.BannerImageURL != '') {
            this.imagePreviewStatus = true;
            this.logoPreviewUrl = data?.Data?.BannerImageURL;
          } else {
            this.imagePreviewStatus = false;
            this.logoPreviewUrl = data?.Data?.BannerImageURL;
          }
          this.AboutUs=data?.Data?.AboutUs;
          this.headingInputValue=data?.Data?.Heading;
          this.subHeadingInputValue=data?.Data?.SubHeading;
          this.opicityData = ((data?.Data?.BannerTransparency)/100).toString();
          this.previewSaveService.welcomePageInfo.next(data.Data);
          this.JobName=data?.Data?.JobTitle +' (Job Ref Id: '+data?.Data?.JobReferenceId+')';
          this.previewSaveService.onJobInfo.next(this.JobName);
        }
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}

  /*
    @Type: File, <TS>
    @Name: onChangeTheme
    @Who: Adarsh singh
    @When: 12-07-22
    @Why: EWM-7756
    @What: Implementation of dark mode theme
  */
 isEnable = false;

 onChangeTheme(event) {
  var isDarkMode;
  if (event == true) {
    this.theming.theme.next("dark-theme");
    localStorage.setItem('isDarkModeEnable', "1");
    this.isEnable = true;
    isDarkMode = 1;
    document.body.classList.toggle("dark-theme");
    // document.getElementById("main-comp").classList.remove("dark-theme");
    document.body.classList.add("dark-theme");
  } else {
    this.theming.theme.next("light-theme");
    localStorage.setItem('isDarkModeEnable', "0");
    this.isEnable = false;
    isDarkMode = 0;
    // document.querySelector("body").classList.toggle("dark-theme");
    document.getElementById("main-comp").classList.remove("dark-theme");
    document.body.classList.remove("dark-theme");
  }

  this.updateDarkMode(isDarkMode);

}

  /*
    @Type: File, <ts>
    @Name: updateDarkMode
    @Who: Adarsh singh
    @When: 12-07-22
    @Why: EWM-7756
    @What: to update updateDarkMode
    */
   updateDarkMode(isDarkMode) {
    var removeJsonId = {};
    removeJsonId['IsDarkMode'] = isDarkMode;
    this._profileInfoService.updateDarkMode(JSON.stringify(removeJsonId)).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  night() {
    var darkmodeon = false;
    function night() {
      var element = document.body;
      if (darkmodeon) {
        element.classList.replace("dark-theme", "");
        // setTimeout(() => {}, 200);
      } else {
        element.classList.replace("light-theme", "");
        // setTimeout(() => { }, 200);
      }
      darkmodeon = !darkmodeon;
    }
  } 
  /*
    @Type: File, <ts>
    @Name: getDarkMode
    @Who: Adarsh singh
    @When: 12-07-22
    @Why: EWM-7756
    @What: to  getDarkMode
    */
   getDarkMode() {
    // this._profileInfoService.getDarkMode().subscribe(
    //   (repsonsedata: ResponceData) => {
    //     this.loading = false;
    //     if (repsonsedata.HttpStatusCode == 200) {
          //  console.log(JSON.stringify(repsonsedata.Data.IsDarkMode));
          let isDarkMode = '0';
          if (isDarkMode == "0") {
            this.isEnable = false;
            this.theming.theme.next("light-theme");
            document.body.classList.remove('dark-theme');
          } else if (isDarkMode == "1") {
            this.isEnable = true;
            this.theming.theme.next("dark-theme");
            document.body.classList.add('dark-theme');
          }
      //   } else {
      //     this.loading = false;
      //   }
      // }, err => {
      //   this.loading = false;
      //   this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      // })

  }

    /*
    @Type: File, <ts>
    @Name: get Default dark mode
    @Who: Adarsh singh
    @When: 12-07-22
    @Why: EWM-7756
    @What: get auto default dark mode
    */
  getDefaultDarkMode(){
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (matched) {
      this.isEnable = true;
    }
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        
        if (event.matches) {
          this.onChangeTheme(true)
          this.isEnable = true;
        } else {
          this.onChangeTheme(false)
          this.isEnable = false;
        }
      });
  }

  addSticky(){
    let element = document.getElementById('preview-section');
    element.classList.add('application-preview-sticky-header');
  }
  removeSticky(){
    let element = document.getElementById('preview-section');
    element.classList.remove('application-preview-sticky-header');
  }

  @HostListener("window:scroll", ['$event'])
  onWindowScroll(e) {
    if(e.srcElement.scrollTop>= 230){
      this.addSticky();
    }else{
     this.removeSticky();
    }
  }

  /*
 @Type: File, <ts>
 @Name: sortName
 @Who: Renu
 @When: 09-Oct-2021
 @Why: EWM-8902 EWM-9112
 @What: To get short name if user profile image not present
 */
 sortName(fisrtName, lastName) {​​​​​​
  if(fisrtName|| lastName){
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
    return ShortName.toUpperCase();
  }
  }
  ​​​​​​
  
  /*
@Type: File, <ts>
@Name: getThankYouPageById function
@Who:Renu
@When: 17-05-2022
@Why:EWM-8901 EWM-9096
@What: get data
*/
getThankYouPageById(ApplicationFormId: any) {
//this.loading=true;
  this.jobService.fetchThankYouDataById('?applicationId='+ApplicationFormId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
        this.loading = false;
            this.previewSaveService.successMsg.next(data?.Data);
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}

themeApply() {
  this.primaryBgColor = localStorage.getItem('HeaderBackground');
  this.primaryTxtColor = localStorage.getItem('HeaderColor');
  this.highlightBgColor = localStorage.getItem('HighlightBackground');
  this.highlightTxtColor = localStorage.getItem('HighlightColor');
  if (this.primaryBgColor != null && this.primaryTxtColor != null && this.highlightBgColor != null && this.highlightTxtColor != null) {
    document.documentElement.style.setProperty('--primary-color', this.primaryBgColor);
    document.documentElement.style.setProperty('--secondary-color', this.primaryTxtColor);
    document.documentElement.style.setProperty('--highlightprimary-color', this.highlightBgColor);
    document.documentElement.style.setProperty('--highlightsecondary-color', this.highlightTxtColor);
  }
}

detectMob() {
  const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];
  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
  });
}


checkDeviceName(){
  if (this.detectMob()) {
    localStorage.setItem("mobile", 'true');
    document.querySelector('body').classList.add('mobile-device');
    return;
  }
 
  else{
    localStorage.setItem("mobile", 'false');
    document.querySelector('body').classList.add('Desktop');
    return;;
  }

}

}
