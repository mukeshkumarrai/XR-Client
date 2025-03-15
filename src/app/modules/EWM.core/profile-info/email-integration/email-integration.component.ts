import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserEmailIntegration } from '../../shared/datamodels'
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogModel, EmailConfirmDialogComponent } from 'src/app/shared/modal/email-confirm-dialog/email-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { DisconnectEmailComponent } from 'src/app/shared/modal/disconnect-email/disconnect-email.component';
import { MsalService } from '@azure/msal-angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';


const loginRequest = {
  scopes: ["user.read"]
}

export interface EmailConfig {
  Code: string;
  EmailId: string;
  Provider: number;
  Configuration: Configuration;
}

export interface Configuration {
  SyncCalendar: number;
  SyncEmails: number;
  EmailProvider: number;
  IsEmailConnected: number;
  Email: string;
  DaysToSyncCalendar: number;
}

@Component({
  selector: 'app-email-integration',
  templateUrl: './email-integration.component.html',
  styleUrls: ['./email-integration.component.scss']
})
export class EmailIntegrationComponent implements OnInit {
  public loading: boolean;
  public userEmailIntegration: UserEmailIntegration;
  userEmailIntegrationForm: FormGroup;
  public emailSyncValue: any;
  public SyncCalendar: number = 0;
  public SyncEmails: number = 0;
  public emailConnected: boolean = false;
  public gmailEmailProvider: boolean = false;
  public outLookEmailProvider: boolean = false;
  public btnDisabled: boolean = true;
  public maxCharacterLengthSubHead = 115;

  // public emailInt_Outlook: boolean = false;
  emailInt_Gmail = false;
  emailInt_Outlook = false;
  outlookIntegrationForm: FormGroup;
  public code: any;
  public emailInfo: any;
  public connectAs: string;
  public emailConnection: boolean = false;
  public userEmail: any;
  public Pageurl: string;
  sub: any;
  public gmailIntegrationForm: FormGroup;
  public emailConnectionGmail: boolean =false;
  public emailStatus: boolean= false;
  emailProvider: any;
  IsEmailConnectedWithAnotherTenant: any;
  LastActivitySyncDate: number;
  public userpreferences: Userpreferences;
  public currentDate=new Date();
  syncStatus: number;
  DaysToSyncCalendarCount: number=0;
  emailConnectedStatus: boolean=false;
  syncStatusEmail: boolean=false;
  syncStatusCalendar: boolean=false;
  syncDays: {Id: number}[] = [
    {Id: 1},
    {Id: 2},
    {Id: 3},
    {Id: 4},
    {Id: 5},
    {Id: 6},
    {Id: 7},
  ]
  constructor(public _sidebarService: SidebarService, private fb: FormBuilder, private route: Router, private _profileInfoService: ProfileInfoService,
    public _snackBarService: SnackBarService, private translateService: TranslateService, private commonserviceService: CommonserviceService,
    public _appSetting: AppSettingsService, private router: ActivatedRoute, public dialog: MatDialog, private msalService: MsalService,
     private mailService: MailServiceService,private cookieService: CookieService, public _userpreferencesService: UserpreferencesService,) {
    this.userEmailIntegrationForm = this.fb.group({
      SyncCalendar: [''],
      SyncEmails: [''],
      EmailProvider: [''],
      DaysToSyncCalendar:[],
    });
    this.outlookIntegrationForm = this.fb.group({
      connectAs: ['', Validators.required],
      email: ['', Validators.required]
    })

    this.gmailIntegrationForm= this.fb.group({
      connectAs: ['', Validators.required],
      email: ['', Validators.required]
    })
    this.loading = false;
  }

  ngOnInit(): void {
  
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
 
   
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.code = params['code'];
          //this.emailConnection=true;
          this.emailInt_Outlook = true;
           //this.officeConfigure(this.code);
        } else {
          this.emailConnection = false;
          this.SyncEmails = 1;
        }
      });
      // <!-----@When:  27-07-2023 @Who : bantee @why: EWM-13394---->

      this.userpreferences = this._userpreferencesService.getuserpreferences();
      if (this.code) {
        this.loading = true;
        this.officeConfigure(this.code);
      }else{
        this.getUserEmailIntegration();
      }
  }


  /*
  @Type: File, <ts>
  @Name: getUserEmailIntegration function
  @Who: Mukesh Kumar Rai
  @When: 27-Dec-2020
  @Why: ROST-581
  @What: service call for creating Update user email  Integration
  */
  getUserEmailIntegration() {
    this.loading = true;
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));

    this._profileInfoService.getUserEmailIntegration(currentUser?.EmailId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.userEmailIntegration = data.Data;
          this.LastActivitySyncDate=data.Data.LastActivitySyncDate;
          this.emailSyncValue = this.userEmailIntegration.EmailProvider;
          this.userEmail = this.userEmailIntegration.Email;
          this.emailInfo = JSON.parse(localStorage.getItem('currentUser'));
          localStorage.setItem('DaysToSyncCalendar', data.Data.DaysToSyncCalendar);
          this.IsEmailConnectedWithAnotherTenant = data.Data.IsEmailConnectedWithAnotherTenant;
          if (this.emailInfo) {
            this.connectAs = this.emailInfo.FirstName + ' ' + this.emailInfo.LastName;
            this.patchValue(this.connectAs);
          }
         
         if (this.userEmailIntegration.IsEmailConnected === 1 ) {
          this.emailConnectedStatus=true;
          if(this.userEmailIntegration.SyncEmails===1){
            this.syncStatusEmail=true;
            this.btnDisabled=false;
            this.SyncEmails = this.userEmailIntegration.SyncEmails;
          }else{
            this.SyncEmails = parseInt(localStorage.getItem('SyncEmails'));
            if(this.SyncEmails===1){
              this.syncStatusEmail=true;
              this.btnDisabled=false;
              this.syncStatus=1;
            }else{
              this.syncStatusEmail=false;
            }
          };

          if(this.userEmailIntegration.DaysToSyncCalendar>0){
            this.userEmailIntegrationForm.patchValue({
              DaysToSyncCalendar: this.userEmailIntegration.DaysToSyncCalendar
            });
          }else{
            this.userEmailIntegrationForm.patchValue({
              DaysToSyncCalendar: []
            });
          };

          if(this.userEmailIntegration.SyncCalendar===1){
            this.syncStatusCalendar=true;
            this.btnDisabled=false;
            this.userEmailIntegrationForm.patchValue({
              DaysToSyncCalendar: this.userEmailIntegration.DaysToSyncCalendar == 0 ? [] : this.userEmailIntegration.DaysToSyncCalendar
            });
            if(this.userEmailIntegration.DaysToSyncCalendar>0){
              this.userEmailIntegrationForm.controls["DaysToSyncCalendar"].enable();            
            }else{
              this.userEmailIntegrationForm.controls["DaysToSyncCalendar"].enable(); 
            }
             this.DaysToSyncCalendarCount=this.userEmailIntegration.DaysToSyncCalendar;
            this.SyncCalendar = this.userEmailIntegration.SyncCalendar;
          }else{
            this.SyncCalendar = parseInt(localStorage.getItem('SyncCalendar'));
            if(this.SyncCalendar===1){
              this.syncStatusCalendar=true;
              this.btnDisabled=false;
              this.syncStatus=1;
            }else{
              this.syncStatusCalendar=false;
            }           
           };

           if(this.userEmailIntegration.EmailProvider=='1'){
            //this.btnDisabled = false;
            this.emailInt_Outlook = true;
            this.emailConnection = true;
            this.emailStatus = true;
           }else if(this.userEmailIntegration.EmailProvider=='2'){
            //this.btnDisabled = false;
            this.emailStatus = true;
             this.emailConnectionGmail=true;
             this.emailInt_Gmail = true;
           }
           
          } else {
            //localStorage.setItem('SyncCalendar', '0');
            this.emailConnectedStatus=false;
            localStorage.setItem('SyncEmails', '1');
            this.btnDisabled = true;
            this.emailStatus=false;
            this.emailConnectionGmail=false;
            this.emailInt_Gmail = false;
            this.emailInt_Outlook = false;
            this.emailConnection = false;
             this.userEmailIntegrationForm.patchValue({
              DaysToSyncCalendar: null
            });
          }
          this.loading = false;

         // this.btnStatus();
         

       
        } else {
          this.loading = false;
        }

      }, err => {
        this.loading = false;
        // this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: updateUserEmailIntegration function
  @Who: Mukesh Kumar Rai
  @When: 27-Dec-2020
  @Why: ROST-581
  @What: service call for creating Update user email  Integration
  */
  updateUserEmailIntegration(value) {
    if (this.userEmailIntegrationForm.invalid) {
      return;
    } else {
      this.loading = true;
      value['EmailProvider'] = this.emailSyncValue;
      value['Email'] = this.userEmail;
      if(value.SyncCalendar===1){
        value['DaysToSyncCalendar'] = parseInt(value.DaysToSyncCalendar)===null?0:parseInt(value.DaysToSyncCalendar);
      }else{
        value['DaysToSyncCalendar'] = 0;
      }
      value['SyncCalendar'] = parseInt(value.SyncCalendar)===null?0:parseInt(value.SyncCalendar);
      value['SyncEmails'] = parseInt(value.SyncEmails)===null?0:parseInt(value.SyncEmails);
    
      this._profileInfoService.updateUserEmailIntegration(JSON.stringify(value)).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
            this.userEmailIntegration = data.Data;
            localStorage.setItem('SyncCalendar', '0');
            localStorage.setItem('DaysToSyncCalendar', '0');
            localStorage.setItem('SyncEmails', '0');
            this.userEmailIntegrationForm.controls["DaysToSyncCalendar"].enable(); 
          this.code='';
          this.getUserEmailIntegration();
          this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), String(data.HttpStatusCode));
          this.loading = false;
          }
          else if (data.HttpStatusCode === 400){
            this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
          else{
            // this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }

        }, err => {
          this.loading = false;
          // this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    }

  }
  /*
  @Type: File, <ts>
  @Name: gmailemailSync function
  @Who: Mukesh Kumar Rai
  @When: 27-Dec-2020
  @Why: ROST-581
  @What: gmail email Sync   Integration
  */
  gmailemailSync(value) {
    this.gmailEmailProvider = !value;
    if (this.gmailEmailProvider) {
      this.emailSyncValue = 2;
    } else {
      this.emailSyncValue = '';
    }
    this.btnStatus();
  }
  /*
  @Type: File, <ts>
  @Name: outLookemailSync function
  @Who: Mukesh Kumar Rai
  @When: 27-Dec-2020
  @Why: ROST-581
  @What: Outlook email Sync   Integration
  */
  outLookemailSync(value) {
    this.outLookEmailProvider = !value;
    if (this.outLookEmailProvider) {
      this.emailSyncValue = 1;
    } else {
      this.emailSyncValue = '';
    }

    this.btnStatus();

  }
  /*
 @Type: File, <ts>
 @Name: btnStatus function
 @Who: Mukesh Kumar Rai
 @When: 27-Dec-2020
 @Why: ROST-581
 @What: Submit button active deactive status
 */
  btnStatus() {
    if ((this.emailSyncValue === '' && this.SyncCalendar === 1) || (this.emailSyncValue === '' && this.SyncEmails === 1)) {
      this.btnDisabled = true;
    } else {
      this.btnDisabled = false;
    }
  }
  statusSysnCalender(values){
    if(this.emailConnectedStatus){
      if(values===true){
        this.syncStatusCalendar=true;
        this.btnDisabled=false;
        localStorage.setItem('SyncCalendar', '1');

      }else{
        this.syncStatusCalendar=false;
        localStorage.setItem('SyncCalendar', '0');
        localStorage.setItem('DaysToSyncCalendar', '0');
      }
    }else{
      this.syncStatusCalendar=false;
      this.btnDisabled=true;
      if(values===true){
        localStorage.setItem('SyncCalendar', '1');
      }else{
        localStorage.setItem('SyncCalendar', '0');
        localStorage.setItem('DaysToSyncCalendar', '0');
      }
    }

  
    }
    statusSysnEmails(values){
      if(this.emailConnectedStatus){
        if(values===true){
          this.syncStatusEmail=true;
          this.btnDisabled=false;
          localStorage.setItem('SyncEmails', '1');
        }else{
          this.syncStatusEmail=false;
          localStorage.setItem('SyncEmails', '0');
        }
      }else{
        this.syncStatusEmail=false;
        this.btnDisabled=true;
        if(values===true){
          localStorage.setItem('SyncEmails', '1');
        }else{
          localStorage.setItem('SyncEmails', '0');
        }
      }
  
  }

  /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

  reloadApiBasedOnorg() {
    this.getUserEmailIntegration();
  }

  emailConnectOption(divid) {
    if (divid === "emailInt_Outlook") {
      this.emailProvider=1;
   
      this.emailInt_Outlook = true;
      this.emailInt_Gmail = false;
    }
    else if (divid === "emailInt_Gmail") {
      this.emailProvider=2;
      this.emailInt_Gmail = true;
      this.emailInt_Outlook = false;
    }
    localStorage.setItem('emailProvider', this.emailProvider)
  }


  /*
    @Type: File, <ts>
    @Name: microsoftIntegration function
    @Who: Renu
    @When: 15-Sept-2021
    @Why: EWM-2716
    @What: Integration with office 365
  */

  microsoftIntegration(value) {
    let currentUrl = window.location.origin + '/client/core/profile/email-integration';
    this.router.snapshot.url;
    let responseType = this._appSetting.getResponseType365();
    let state = currentUrl;
    let scope = this._appSetting.getScope365();
    let clientId = this._appSetting.getClientIdOffice365();
    let redirectUri = this._appSetting.getRedirectUri365();
    let responseMode = this._appSetting.getresponseMode365();
    window.open('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + clientId + '&state=' + state + '&scope=' + scope + '&response_mode=' + responseMode + '&redirect_uri=' + redirectUri + '&response_type=' + responseType + '', "_self");
 

  //  const w = screen.width * 0.6;
  //  const h = screen.height * 0.8;
  //  const left = (screen.width / 2) - (w / 2);
  //  const top = (screen.height / 2) - (h / 2);
  //  const randomnumber = Math.floor((Math.random() * 100) + 1);

  //  window.open('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + clientId + '&state=' + state + '&scope=' + scope + '&response_mode=' + responseMode + '&redirect_uri=' + redirectUri + '&response_type=' + responseType + '',
  //   '_blank', 'PopUp' + randomnumber + ',scrollbars=1,menubar=0,resizable=1,width = ' + w + ', height = ' + h + ', top = ' + top + ', left = ' + left);
   
  //   let timer=setInterval(() => {
  //       this.checkCode();
  // }, 5000);
  
  // setTimeout(() => { clearInterval(timer); }, 5500 );

  }
 

  /*
    @Type: File, <ts>
    @Name: microsoftIntegration function
    @Who: Renu
    @When: 15-Sept-2021
    @Why: EWM-2716
    @What: Integration with office 365
  */

    GmailIntegration(value) {     
      let currentUrl = window.location.origin + '/client/core/profile/email-integration';
      this.router.snapshot.url;
      let responseType = this._appSetting.getResponseTypeGmail();
      let state =currentUrl;
      let scope = this._appSetting.getScopeGmail();
      let clientId = this._appSetting.getClientIdGmail();
      let redirectUri = this._appSetting.getRedirectUriGmail();
      let responseMode = this._appSetting.getresponseModeGmail();   
      let prompt = this._appSetting.getPromptGmail();   
     window.open('https://accounts.google.com/o/oauth2/v2/auth?scope='+scope+'&prompt='+prompt+'&access_type=offline&include_granted_scopes=true&response_type='+
     responseType+'&state='+state+'&redirect_uri='+redirectUri+'&client_id='+clientId+ '', "_self");  
    }

  checkCode(){
    
    const IsCookieExists: boolean = this.cookieService.check('code');
      this.emailInt_Outlook = true;
      if(IsCookieExists )
      {
        this.code =this.cookieService.get('code');
      this.officeConfigure(this.code);
    }
    else{
      this.emailConnection = false;
    }
  }

  /*
    @Type: File, <ts>
    @Name: officeConfigure function
    @Who: Renu
    @When: 15-Sept-2021
    @Why: EWM-2716
    @What: office 365 configure with authorization code
  */
  officeConfigure(code) {
    // <!-----@When:  27-07-2023 @Who : bantee @why: EWM-13394---->
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let emailConfig:any = JSON.parse(localStorage.getItem('emailConfig'));
    let syncDays:any = JSON.parse(localStorage.getItem('DaysToSyncCalendar'))

    // <!-----@When:  30-11-2023 @Who : Adarsh @why: EWM-15160---->
    let obj: EmailConfig = {
      "Code": code,
      "EmailId": currentUser.EmailId,
      "Provider": Number(localStorage.getItem('emailProvider')),
      "Configuration": {
        "SyncCalendar": emailConfig?.SyncCalendar,
        "SyncEmails": emailConfig?.SyncEmails,
        "EmailProvider":  Number(localStorage.getItem('emailProvider')),
        "IsEmailConnected": 0,
        "Email": currentUser.EmailId,
        "DaysToSyncCalendar": syncDays
      }
    }
    // End 
    this._profileInfoService.officeConfigure(obj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.emailStatus = true;
          // console.log("data ",data);
          if(localStorage.getItem('emailProvider')=='1'){
             this.btnDisabled = false;
            this.emailConnection=true;
            this.emailSyncValue = data.Data.Provider;
           this.emailInt_Outlook=true;
           this.emailInt_Gmail=false;
           this.emailStatus = true;

           }else{
            this.btnDisabled = false;
            this.emailConnectionGmail=true;
            this.emailSyncValue = data.Data.Provider;
            this.emailInt_Gmail=true;
            this.emailInt_Outlook=false;
            this.emailStatus = true;
           

          }
        
          // <!---------@When: 19-12-2022 @who:Adarsh singh @why: EWM-9908 --------->
          let res:any = data.Data.Provider == 1 ? 1 : 0;
          localStorage.setItem("emailConnection", res);
          localStorage.removeItem('emailConfig');
          //this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), String(data.HttpStatusCode));
        } else {
          this.emailStatus = false;
          this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), String(data.HttpStatusCode));
        }
        //  console.log("data",data);
        this.getUserEmailIntegration();

      }, err => {
        this.loading = false;
        this.emailConnection = false;
        // this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: patchValue function
  @Who: Renu
  @When: 15-Sept-2021
  @Why: EWM-2716
  @What: patch value in form based on preselected value
*/
  patchValue(connectAs: string) {
  
      this.outlookIntegrationForm.patchValue({
        'connectAs': connectAs,
        'email': this.userEmail
      })
  
  
      this.gmailIntegrationForm.patchValue({
        'connectAs': connectAs,
        'email': this.userEmail
      })
    
  }

  /*
      @Type: File, <ts>
      @Name: disConnectEmailConfirmBox function
      @Who: Renu
      @When: 15-Sept-2021
      @Why: EWM-2716
      @What: confiramtion box for disconnect
    */

  disConnectEmailConfirmBox(): void {
    const message = `label_areYouSureDisconnectionMsg`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(EmailConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        //this.userEmailIntegrationForm.reset();   
        this.SyncCalendar=0;
        this.userEmailIntegrationForm.patchValue({
          DaysToSyncCalendar: 0
        });
         this.SyncEmails=1;
         this.emaildisconnection();
        //this.getUserEmailIntegration();
       
      }
    })

  }
  /*
  @Type: File, <ts>
  @Name: emaildisconnection function
  @Who: Renu
  @When: 22-Sept-2021
  @Why: ROST-2511 ROST-2704
  @What: service call for email disconnection
  */
  emaildisconnection() {
    // this.getUserEmailIntegration();
    this.loading = true;
    this.mailService.emailDisconnection().subscribe(
      (data: ResponceData) => {
        this.userEmailIntegration = data.Data;
        // <!---------@When: 09-12-2022 @who:Adarsh singh @why: EWM-9908 --------->
        let isEmail:any = 0;
        localStorage.setItem("emailConnection", isEmail);
        localStorage.setItem("emailProvider", isEmail);
        localStorage.setItem('SyncCalendar', '0');
        localStorage.setItem('DaysToSyncCalendar', '0');
        localStorage.setItem('SyncEmails', '1');
        
        // end 
        if (data.HttpStatusCode === 200) {
          this.SyncCalendar=0;
          this.userEmailIntegrationForm.patchValue({
            DaysToSyncCalendar: 0
          });
          this.userEmailIntegrationForm.controls["DaysToSyncCalendar"].enable(); 
           this.SyncEmails=1;
          const message = ``;
          const title = 'label_disabled';
          const subtitle = 'label_securitymfa';
          const dialogData = new ConfirmDialogModel(title, subtitle, message);
          const dialogRef = this.dialog.open(DisconnectEmailComponent, {
            maxWidth: '350px',
             panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
         
          this.code='';
         this.btnDisabled=true;
        // <!---------@When: 28-07-2023 @who:bantee kumar @why: EWM-13394 --------->

         this.route.navigate([], {
          queryParams: {
            'code': null,
          },
          queryParamsHandling: 'merge'
        })
          this.getUserEmailIntegration();
        }
       // this.getUserEmailIntegration();
        //this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), String(data.HttpStatusCode));
        this.loading = false;

      }, err => {
        this.loading = false;
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }


  /*
      @Type: File, <ts>
      @Name: gmailCheckEmailConnectedWithAnotherTenant function
      @Who: Suika
      @When: 28-July-2023
      @Why: EWM-13297
      @What: confiramtion box before connected 
    */
  gmailCheckEmailConnectedWithAnotherTenant(){
    if(this.IsEmailConnectedWithAnotherTenant>0){
      this.ConnectEmailConfirmBox('gmail');
    }else{
      this.GmailIntegration(this.gmailIntegrationForm.value);
    }
  }

    /*
      @Type: File, <ts>
      @Name: officeCheckEmailConnectedWithAnotherTenant function
      @Who: Suika
      @When: 28-July-2023
      @Why: EWM-13297
      @What: confiramtion box before connected 
    */
   officeCheckEmailConnectedWithAnotherTenant(){
    localStorage.setItem('emailConfig', JSON.stringify(this.userEmailIntegrationForm.getRawValue()))
    if(this.IsEmailConnectedWithAnotherTenant>0){
      this.ConnectEmailConfirmBox('office');
    }else{
      this.microsoftIntegration(this.outlookIntegrationForm.value);
    }
  }


    /*
      @Type: File, <ts>
      @Name: ConnectEmailConfirmBox function
      @Who: Suika
      @When: 28-July-2023
      @Why: EWM-13297
      @What: confiramtion box for connected 
    */
   ConnectEmailConfirmBox(val): void {
    const message = `label_emailIntegration_ConnctedwithAnotherTenant`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(EmailConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if(val=='office'){
          this.microsoftIntegration(this.outlookIntegrationForm.value);
        }else{
          this.GmailIntegration(this.gmailIntegrationForm.value); 
        }           
      }
    })

  }
  changeDays(syncDays){
    localStorage.setItem('DaysToSyncCalendar', this.SyncCalendar == 0 ? 0 : syncDays.DaysToSyncCalendar);
  }

}
