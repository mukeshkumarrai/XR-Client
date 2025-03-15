/*
  @(C): Entire Software
  @Type: landing.component.ts
  @Who: Renu
  @When: 24-Feb-2021
  @Why:  ROST-816
  @What: landing page before login to system

*/
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { LoginResponce, ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { v4 as uuidv4 } from 'uuid';
import { ProfileInfoService } from '../EWM.core/shared/services/profile-info/profile-info.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SessionExpiredComponent } from '../sign-in/session-expired/session-expired.component';
import { SystemSettingService } from '../EWM.core/shared/services/system-setting/system-setting.service';
import { IndexedDbService } from '@app/shared/helper/indexed-db.service';
import { DOCUMENT } from '@angular/common';
import { EncryptionDecryptionService } from '@app/shared/services/encryption-decryption.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [DummyService]
})
export class LandingComponent implements OnInit {

  /*****************common varibale declaration************************* */
  public urlpath: string;
  valuedata: string;
  tokenValue: string;
  public loginResponce: LoginResponce;
  public loginData: any;
  loading: boolean;
  errmsg: boolean;
  enterOTP: boolean;
  returnUrl: string;
  userDefoultLang: string;
  langflag: string;
  domain: string;
  redirectUrl:any;

  clientNameId: any;
  employeeNameId: any;
  public leadNameId:any;
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  result: any;
  baseLogin: any;
  SessionOverRide: number=0;
  dirctionalLang;
  zoomPhoneCallRegistrationCode:string;
  seekRegistrationCode:string;
  Broadbeanregistrationcode:string;
  zoomMeetingInviteRegistrationCode:string;
  mSTeamMeetingInviteRegistrationCode:string;
  zoomCheckStatus: boolean=false;
  daxtraRegistrationCode:string;
  xeopleSMSRegistrationCode:string;
  xeopleCallRegistrationCode:string;
  googleMeetMeetingInviteRegistrationCode:string;
  enabelBroadbeanregistrationcode:string;
  IsenableIntegrationEOH: string;
  burstSMSRegistrationCode: string;
  indeedRagistrationCode: string;
  EOHRagistrationCode: string;
  IsCANDExtractNotificationEnable: number = 0;
  brandAppSetting: any=[];
  private manageNameParendIDName:string;
  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute,private authenticationService: LoginService,
    private translateService: TranslateService,private _dynamicMenuService: DynamicMenuService,private _snackBarService: SnackBarService, private _profileInfoService: ProfileInfoService,
    private commonserviceService: CommonserviceService,private _appSetting: AppSettingsService,
    private cookieService: CookieService,public dummyService: DummyService,
    public dialog: MatDialog,private mailService: MailServiceService,public _encryptionDecryptionService: EncryptionDecryptionService,
     public dialogObj: MatDialog, @Inject(DOCUMENT) private document: Document, public systemSettingService: SystemSettingService,
    private indexedDbService: IndexedDbService
    ) {

    this.manageNameParendIDName=this._appSetting.manageNameParendID;
    this.leadNameId=this._appSetting.leadNameId;
    this.clientNameId = this._appSetting.clientNameId;
    this.employeeNameId = this._appSetting.employeeNameId;
    this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.Broadbeanregistrationcode =  this._appSetting.Broadbeanregistrationcode;
    this.zoomMeetingInviteRegistrationCode = this._appSetting.zoomMeetingInviteRegistrationCode;
    this.mSTeamMeetingInviteRegistrationCode = this._appSetting.mSTeamMeetingInviteRegistrationCode;
    this.daxtraRegistrationCode = this._appSetting.daxtraRegistrationCode;
    this.xeopleSMSRegistrationCode = this._appSetting.xeopleSMSRegistrationCode;
    this.xeopleCallRegistrationCode = this._appSetting.xeopleCallRegistrationCode;
    this.googleMeetMeetingInviteRegistrationCode = this._appSetting.googleMeetMeetingInviteRegistrationCode;
    this.enabelBroadbeanregistrationcode = this._appSetting.enabelBroadbeanregistrationcode;
    this.IsenableIntegrationEOH = this._appSetting.eohRegistrationCode;
    this.burstSMSRegistrationCode = this._appSetting.burstSMSRegistrationCode;
    this.indeedRagistrationCode = this._appSetting.indeedRagistrationCode;
    this.EOHRagistrationCode = this._appSetting.eohRegistrationCode;
    this.baseLogin=this._appSetting.baseUrl;
    this.brandAppSetting = this._appSetting.brandAppSetting;
  }


  ngOnInit() {
      this.commonserviceService.setDrawer(this.drawer);
      this.route.queryParams.subscribe(params => {
        this.tokenValue = decodeURIComponent(params['Token']);
        this.domain = params['DomainName'];
        this.redirectUrl = params['redirectUrl'];
        this.userTokenApi(this.tokenValue);
        localStorage.removeItem('StoredTenantData');
        localStorage.removeItem('StoredshortToken');
        localStorage.removeItem('currentUser');
      })

    // const lng = this.translateService.getBrowserLang();
    // this.translateService.setDefaultLang(lng);
    // this.translateService.use(lng);
    // const supportedLangs = ["eng", "hin","ara"];
    // supportedLangs.forEach((language) => {
    //   this.translateService.reloadLang(language);
    // });
    this.document.body.classList.add('login-screen-body');

  }


  public ngOnDestroy(): void {
    this.document.body.classList.remove('login-screen-body');
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
    this._profileInfoService.getManageNameAllList('?ParentId=' +this.manageNameParendIDName).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
         let data=repsonsedata?.Data?.Data;
         const eoh = this.brandAppSetting?.filter(brand => brand?.EOH);
         const Xeople = this.brandAppSetting?.filter(brand => brand?.Xeople);

         const EOHItem = {
          EOH: "{\"eng\":\""+eoh[0]?.EOH+"\",\"hin\":\""+eoh[0]?.EOH+"\",\"ara\":\"وكالة\"}"
          
        };
        const XeopleItem = {
          Xeople: "{\"eng\":\""+Xeople[0]?.Xeople+"\",\"hin\":\""+Xeople[0]?.Xeople+"\",\"ara\":\"وكالة\"}"
          
        };
        const updatedData = { ...data, ...EOHItem, ...XeopleItem };
          localStorage.setItem("ManageName", JSON.stringify(updatedData));
        }
      },
      err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
    @Type: File, <ts>
    @Name: userTokenApi function
    @Who: Renu
    @When: 25-feb-2021
    @Why: ROST-816
    @What: For logged In
    */

  userTokenApi(tokenvalue) {
    // if (localStorage.getItem("Token") !== null) {
    //   this.openConfrmDialog(tokenvalue);
    // }else{
      const formData = { 'Domain': this.domain, 'IsRemember': Boolean(JSON.parse(localStorage.getItem('isRemember'))), 'Device': 'web', 'Token': tokenvalue };
      localStorage.removeItem('isRemember');
      this.authenticationService.loginDomain(formData).subscribe(
        (data: ResponceData) => {
          this.loading = false;
          if (data.HttpStatusCode === 200) {
            if (data.Data.Token) {
              this.loginResponce = data.Data;
              this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
                localStorage.setItem("menuInfo", JSON.stringify(response.Data));
                this.setSecureCookie(this._encryptionDecryptionService.encryptData(data.Data.SessionId));
               
                this._dynamicMenuService.menuStatusOb.next(1);

                this.errmsg = false;
                if (this.loginResponce.MFA === 0) {
                  this.setLocalStoreageData(data);
                  this.router.navigate(['mfa']);
                } else if (this.loginResponce.MFA === 1) {
                  this.setLocalStoreageData(data);
                  if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                    let reDirectURL = this.redirectUrl.split('/')
                    let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/');
                    this.router.navigate(['./' + finalRedirectURL]);
                  }else{
                    this.router.navigate(['./client/core/home/dashboard']);
                  }

                } else if (this.loginResponce.MFA === 2) {
                   this.setLocalStoreageData(data);
                  if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                    let reDirectURL = this.redirectUrl.split('/')
                    let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/');
                    this.router.navigate(['./' + finalRedirectURL]);
                  }else{
                    this.router.navigate(['./client/core/home/dashboard']);
                  }

                } else {
                  this.setLocalStoreageData(data);
                  this.router.navigate(['mfa']);
                }
                this.getManageListAll();
              });
            } else {
              // this.router.navigate(['/login']);
            }

          }
          else if(data.HttpStatusCode === 419){
            const message = ``;
            const title = 'label_disabled';
            const subtitle = 'label_folderName';
            const dialogData = new ConfirmDialogModel(title, subtitle, message);
            const dialogRef = this.dialog.open(SessionExpiredComponent, {
             data: new Object({ editId: 'Add'}),
             panelClass: ['xeople-modal', 'add_sessionExpValidation','animate__animated', 'animate__zoomIn'],
             disableClose: true,
            });
            let dir:string;
            dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
            let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
            for(let i=0; i < classList.length; i++){
              classList[i].setAttribute('dir', this.dirctionalLang);
             }
            dialogRef.afterClosed().subscribe(res => {
                if(res==true){
                const formData = { 'Domain': this.domain, 'IsRemember': Boolean(JSON.parse(localStorage.getItem('isRemember'))), 'Device': 'web', 'Token': tokenvalue, 'IsTerminateExistingSession': true };
                localStorage.removeItem('isRemember');
                this.authenticationService.loginDomain(formData).subscribe(
                  (data: ResponceData) => {
                    this.loading = false;
                    if (data.HttpStatusCode === 200) {
                      if (data.Data.Token) {
                        this.loginResponce = data.Data;
                        this.getManageListAll();
                        // value['MFA'] = 2;
                        /************@why: EWM-1988 @who: Mukesh @what: to load menu on page load inital level*******/
                        this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
                          localStorage.setItem("menuInfo", JSON.stringify(response.Data));
                          localStorage.setItem('sessionId', uuidv4());
                          this._dynamicMenuService.menuStatusOb.next(1);

                          this.errmsg = false;
                          if (this.loginResponce.MFA === 0) {
                            this.setLocalStoreageData(data);
                            this.router.navigate(['mfa']);
                          } else if (this.loginResponce.MFA === 1) {
                            this.setLocalStoreageData(data);
                            if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                              let reDirectURL = this.redirectUrl.split('/')
                              let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/');
                              this.router.navigate(['./' + finalRedirectURL]);
                            }else{
                              this.router.navigate(['./client/core/home/dashboard']);
                              // this.isRedirectUrl();
                            }

                          } else if (this.loginResponce.MFA === 2) {
                             this.setLocalStoreageData(data);
                            if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                              let reDirectURL = this.redirectUrl.split('/')
                              let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/');
                              this.router.navigate(['./' + finalRedirectURL]);
                            }else{
                              this.router.navigate(['./client/core/home/dashboard']);
                              // this.isRedirectUrl();
                            }

                          } else {
                            this.setLocalStoreageData(data);
                            this.router.navigate(['mfa']);
                          }
                        });
                      } else {
                        // this.router.navigate(['/login']);
                      }

                    }
                  },
                  error => {
                    this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
                    this.loading = false;
                    this.errmsg = true;
                    // this.router.navigate(['/login']);
                  })
              }else{
                this.router.navigate(['/login']);
              }

         })
          }
          else{
            // --------@When: 20-July-2023 @who:Adarsh singh @why: EWM-13459 --------
           this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.router.navigate(['/login']);
            // End
          }
        },
        error => {
          this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
          this.loading = false;
          this.errmsg = true;
          // --------@When: 20-July-2023 @who:Adarsh singh @why: EWM-13459 --------
          this.router.navigate(['/login']);
        })
    //}
  }
 
    
  setSecureCookie(sessionID: string) {
    const url = new URL(this.baseLogin);
    const domainParts = url.hostname.split('.');
    let baseDomain = domainParts.length > 1 ? '.'+domainParts.slice(-2).join('.') : '.'+url.hostname;
    localStorage.setItem('sessionId', sessionID);
      this.cookieService.set(baseDomain, sessionID, {
       // expires:  RemembermeDate, // Set the expiration date
        secure: true,    // Ensures the cookie is only sent over HTTPS
        sameSite: 'Lax', // Helps prevent CSRF attacks
        domain: baseDomain,
        path: '/'   // Specify the cookie path (usually root)
      });
      
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
    localStorage.setItem('DateFormat', data.Data['DateFormat']);
    if (data.Data['Language'] === null) {
      localStorage.setItem('Language', 'eng');
    } else {
      localStorage.setItem('Language', data.Data['Language']);
    }
    localStorage.setItem('SessionOverRide',String(this.SessionOverRide));
  }
// @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Open modal window
  // @What: this function used for open policy and terem modal window.
  // @Return: None
  // @Params :
  // 1. lang - language code.

  openDialog(param): void {
    if (param === 'privacy') {
      this.modaldata = this.dummyService.getPolicy();
    }
    if (param === 'term') {
      this.modaldata = this.dummyService.getTerm();
    }
    const dialogRef = this.dialog.open(FooterDialogComponent, {
      maxWidth:"750px",
      width: '90%',
      disableClose: true,
      data: this.modaldata,
      panelClass: ['footerPopUp', 'animate__slow', 'animate__animated', 'animate__fadeInUpBig']
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }



    /*
   @Type: File, <ts>
   @Name: openConfrmDialog
   @Who: Renu
   @When: 25-May-2022
   @Why: ROST-6778 ROST-6777
   @What:open the confirmation box to check user already
   */


  openConfrmDialog(tokenvalue): void {
    const message = ``;
    const title = '';
    const subtitle = 'label_alreadyUserLoginTitle';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__slow', 'animate__zoomIn'],
      disableClose: true,
    });
    this.loading = true;
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
       this.SessionOverRide=1;
        this.loading = false;
        const formData = { 'Domain': this.domain, 'IsRemember': Boolean(JSON.parse(localStorage.getItem('isRemember'))), 'Device': 'web', 'Token': tokenvalue };
        localStorage.removeItem('isRemember');
        this.authenticationService.loginDomain(formData).subscribe(
          (data: ResponceData) => {
            this.loading = false;
            if (data.HttpStatusCode == 200) {
              if (data.Data.Token) {
                this.loginResponce = data.Data;


                //this.getAllClientName();
                //this.getAllEmployeeName();
                this.getManageListAll();
                // value['MFA'] = 2;
                /************@why: EWM-1988 @who: Mukesh @what: to load menu on page load inital level*******/
                this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
                  localStorage.setItem("menuInfo", JSON.stringify(response.Data));
                  localStorage.setItem('sessionId', uuidv4());
                  this._dynamicMenuService.menuStatusOb.next(1);

                  this.errmsg = false;
                  if (this.loginResponce.MFA === 0) {
                    this.setLocalStoreageData(data);
                    this.router.navigate(['mfa']);
                  } else if (this.loginResponce.MFA === 1) {
                    this.setLocalStoreageData(data);
                    if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                      let reDirectURL = this.redirectUrl.split('/')
                      let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/')
                      this.router.navigate(['./' + finalRedirectURL]);
                    }else{
                      this.router.navigate(['./client/core/home/dashboard']);
                      // this.isRedirectUrl();
                    }

                  } else if (this.loginResponce.MFA === 2) {
                     this.setLocalStoreageData(data);
                    if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                      let reDirectURL = this.redirectUrl.split('/')
                      let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/')
                      this.router.navigate(['./' + finalRedirectURL]);
                    }else{
                      this.router.navigate(['./client/core/home/dashboard']);
                      // this.isRedirectUrl();
                    }

                  } else {
                    this.setLocalStoreageData(data);
                    this.router.navigate(['mfa']);
                  }
                });
              } else {
                // this.router.navigate(['/login']);
              }
            }else if(data.HttpStatusCode === 419){
              const message = ``;
              const title = 'label_disabled';
              const subtitle = 'label_folderName';
              const dialogData = new ConfirmDialogModel(title, subtitle, message);
              const dialogRef = this.dialog.open(SessionExpiredComponent, {
               data: new Object({ editId: 'Add'}),
               panelClass: ['xeople-modal', 'add_sessionExpValidation','animate__animated', 'animate__zoomIn'],
               disableClose: true,
              });
              let dir:string;
              dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
              let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
              for(let i=0; i < classList.length; i++){
                classList[i].setAttribute('dir', this.dirctionalLang);
               }
              dialogRef.afterClosed().subscribe(res => {
                  if(res==true){
                  const formData = { 'Domain': this.domain, 'IsRemember': Boolean(JSON.parse(localStorage.getItem('isRemember'))), 'Device': 'web', 'Token': tokenvalue, 'IsTerminateExistingSession': true };
                  localStorage.removeItem('isRemember');
                  this.authenticationService.loginDomain(formData).subscribe(
                    (data: ResponceData) => {
                      this.loading = false;
                      if (data.HttpStatusCode === 200) {
                        if (data.Data.Token) {
                          this.loginResponce = data.Data;
                          //this.getAllClientName();
                          //this.getAllEmployeeName();
                          this.getManageListAll();
                          // value['MFA'] = 2;
                          /************@why: EWM-1988 @who: Mukesh @what: to load menu on page load inital level*******/
                          this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
                            localStorage.setItem("menuInfo", JSON.stringify(response.Data));
                            localStorage.setItem('sessionId', uuidv4());
                            this._dynamicMenuService.menuStatusOb.next(1);

                            this.errmsg = false;
                            if (this.loginResponce.MFA === 0) {
                              this.setLocalStoreageData(data);
                              this.router.navigate(['mfa']);
                            } else if (this.loginResponce.MFA === 1) {
                              this.setLocalStoreageData(data);
                              if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                                let reDirectURL = this.redirectUrl.split('/')
                                let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/')
                                this.router.navigate(['./' + finalRedirectURL]);
                              }else{
                                this.router.navigate(['./client/core/home/dashboard']);
                                // this.isRedirectUrl();
                              }

                            } else if (this.loginResponce.MFA === 2) {
                               this.setLocalStoreageData(data);
                              if(this.redirectUrl !=undefined && this.redirectUrl !=null && this.redirectUrl !=''){
                                let reDirectURL = this.redirectUrl.split('/')
                                let finalRedirectURL = (reDirectURL.slice(3, reDirectURL.length)).join('/')
                                this.router.navigate(['./' + finalRedirectURL]);
                              }else{
                                this.router.navigate(['./client/core/home/dashboard']);
                                // this.isRedirectUrl();
                              }

                            } else {
                              this.setLocalStoreageData(data);
                              this.router.navigate(['mfa']);
                            }
                          });
                        } else {
                          // this.router.navigate(['/login']);
                        }

                      }
                    },
                    error => {
                      this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
                      this.loading = false;
                      this.errmsg = true;
                      // this.router.navigate(['/login']);
                    })
                }else{
                  this.router.navigate(['/login']);
                }

           })
            }
          },
          error => {
            this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
            this.loading = false;
            this.errmsg = true;
            // this.router.navigate(['/login']);
          })
      } else {
        this.loading = false;
        this.router.navigate([this.baseLogin]);
      }
    });
  }



  isRedirectUrl() {
    let url = localStorage.getItem('URLs');
    url == 'undefined' ? this.router.navigate(['./client/core/home/dashboard']) : this.router.navigateByUrl(url);
  }
 
}
