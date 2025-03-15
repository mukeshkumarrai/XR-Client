/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Nitin Bhati
    @When: March 02 2022
    @Why: EWM-5409
    @What:  This page is creted for Zoom Meeting Integration UI Component
*/
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ButtonTypes } from 'src/app/shared/models';

@Component({
  selector: 'app-zoom-meeting-integration',
  templateUrl: './zoom-meeting-integration.component.html',
  styleUrls: ['./zoom-meeting-integration.component.scss']
})
export class ZoomMeetingIntegrationComponent implements OnInit {

 
  public showTabData: boolean = true;
  public showSeekFormData: boolean = false;
  seekIntegrationForm: FormGroup;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public totalStages: number;
  public screenPreviewClass: string="";
  public currentMenuWidth: number;
  public screnSizePerStage:number;
  public submitted = false;
  public loading: boolean = false;
  public activestatus: string;
  RegistrationCode:any;
  IntegratorName;
  public oldPatchValues: any;
  visibilityStatus:boolean;
  gridViewList: any;
  LogoUrl: any;
  Description: any;
  IntegrationImages: any;
  VideoUrl: any;
  IntegrationLocations: any;
  LocationName: any;
  LocationType: any;
  Country: any;
  AddressLine1: any;
  District: any;
  TownCity: any;
  State: any;
  AddressLine2: any;
  TagCode: any;
  PostalCode: any;
  IsUser:any;
  public code: any;
  zoomMeetingInviteRegistrationCode: any;
  zoomPhoneCallRegistrationCode: any;
  positionMatTab: any;
  animationVar: any;

  constructor(public dialog: MatDialog,private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private snackBService: SnackBarService,private route:Router,
    private translateService: TranslateService,private _systemSettingService:SystemSettingService,private router: ActivatedRoute,
    private _appSetting: AppSettingsService,
    private commonserviceService: CommonserviceService,) {
    this.zoomMeetingInviteRegistrationCode = this._appSetting.zoomMeetingInviteRegistrationCode;
    this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
  }

  ngOnInit(): void {
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth,'onload');
   
    let otherIntegrationData= JSON.parse(localStorage.getItem('otherIntegrationData')) ;
    this.RegistrationCode = otherIntegrationData.RegistrationCode;
          this.IntegratorName = otherIntegrationData.Name;
  
      this.getIntegrationRegistrationByCode();

      this.router.queryParams.subscribe(
        params => {
          if (params['code'] != undefined) {
            this.code = params['code'];
          } else{
           this.getOtherIntegrationCheckstatus();
          }
        });
      

      this.commonserviceService.onUserLanguageDirections.subscribe(res => {
          this.positionMatTab=res;
      });

      this.animationVar = ButtonTypes;
            
  }

  ngAfterViewInit(){
    if (this.code) {
      this.zoomConfigure(this.code);
    }
  }
/*
 @Type: File, <ts>
 @Name: getIntegrationRegistrationByCode function
 @Who: Nitin Bhati
 @When: March 02 2022
 @Why: EWM-5409
 @What: For showing Integration Registration Code
*/
getIntegrationRegistrationByCode() {
  //this.loading = true;
  this._systemSettingService.getIntegrationRegistrationByCode(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
       // this.loading = false;
        if (repsonsedata.Data) {
           this.gridViewList = repsonsedata.Data;
           this.IsUser = this.gridViewList.IsUser;
           this.LogoUrl = this.gridViewList.LogoUrl;
            this.Description = this.gridViewList.Description;
           this.IntegrationImages = this.gridViewList.IntegrationImages;
           this.VideoUrl = this.gridViewList.VideoUrl;
           this.TagCode = this.gridViewList.TagCode;
           this.LocationName = this.gridViewList.IntegrationLocations.LocationName;
           this.LocationType = this.gridViewList.IntegrationLocations.LocationType;
           this.Country = this.gridViewList.IntegrationLocations.LocationCountryName;
           this.AddressLine1 = this.gridViewList.IntegrationLocations.AddressLine1;
           this.AddressLine2 = this.gridViewList.IntegrationLocations.AddressLine2;
           this.District = this.gridViewList.IntegrationLocations.District;
           this.TownCity = this.gridViewList.IntegrationLocations.TownCity;
           this.State = this.gridViewList.IntegrationLocations.StateId;
           this.PostalCode = this.gridViewList.IntegrationLocations.PostalCode;            
           }
       } else {
       // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      //this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
  onCancel(){
    this.showSeekFormData = false;
    this.showTabData = true;
  }
  onSwiper(swiper) {
    // console.log(swiper);
   }
   onSlideChange() {
   //  console.log('slide change');
   }
  maxNumberClass(perSlide){
    if(this.totalStages>perSlide){
      this.screenPreviewClass = 'flext-start';
    }else{
      this.screenPreviewClass = '';
    }
  }

  @HostListener("window:resize", ['$event'])
    private onResize(event,loadingType) {
      if(loadingType=='onload')
      {
        this.currentMenuWidth = event;
      }else{
        this.currentMenuWidth = event.target.innerWidth;
      }
    
      if (this.currentMenuWidth > 240 && this.currentMenuWidth < 3000) {
        this.screnSizePerStage = 1;
        this.maxNumberClass(this.screnSizePerStage);
      }     
    }

  /* 
   @Type: File, <ts>
   @Name: EnableSave function
   @Who: Nitin Bhati
   @When: March 02 2022
   @Why: EWM-5409
   @What: For Zoom integration  enable
  */
   EnableSave() {
    let currentUrl = window.location.origin + '/client/core/profile/other-integration/zoom-meeting-integration';
    this.router.snapshot.url;
    let responseType = this._appSetting.getResponseTypeZoomMeeting();  
    let state =currentUrl;
    let clientId = this._appSetting.getClientIdZoomMeeting();         
    let redirectUri = this._appSetting.getRedirectUriZoomMeeting(); 
    
    window.open('https://zoom.us/oauth/authorize'+'?response_type='+ responseType + '&client_id='+ clientId +
    '&redirect_uri=' + redirectUri +'&state='+state + '', "_self")
  

  }

/* 
   @Type: File, <ts>
   @Name: zoomConfigure function
   @Who: Nitin Bhati
   @When: March 02 2022
   @Why: EWM-5409
   @What: For saving Zoom integration  enable
  */
  zoomConfigure(code){
 this.loading = true;
    let AddObj={};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['AccessCode'] = code;
    AddObj['AppType'] = 'Meeting';
    this._systemSettingService.zoomConfiguration(AddObj).subscribe(
      (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
       // this.loading = false;
        this.showSeekFormData = false;
        this.showTabData = true;
         this.getOtherIntegrationCheckstatus();   
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

    /*
      @Type: File, <ts>
      @Name: disconnectPopUp function
      @Who: Nitin Bhati
      @When: March 02 2022
      @Why: EWM-5409
      @What: FOR DIALOG BOX confirmation
    */
      disconnectPopUp(): void {
        let DisconnectObj={};
        //DisconnectObj = this.oldPatchValues;
        DisconnectObj['RegistrationCode'] = this.RegistrationCode;
        DisconnectObj['IsUser'] = this.IsUser;
        let message = ``;
        const title = '';
        let subTitle = '';
         if(this.RegistrationCode==this.zoomMeetingInviteRegistrationCode){
          message = `label_titleDialogContentSiteDomain`;
          subTitle = 'label_disableZoomMeetingInvite';
        }else if(this.RegistrationCode==this.zoomPhoneCallRegistrationCode){
          message = ``;
          subTitle = 'label_disableZoomPhonCallFromOtherIntegration';
        }
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
            this.loading = true;
            this._systemSettingService.zoomConfigurationDisabled(DisconnectObj).subscribe(
              (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                  this.getOtherIntegrationCheckstatus();
                  this.showSeekFormData = false;
                  this.showTabData = true;
                 // this.loading = false;
                 this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
                    } else {
                  this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                } 
              }, err => {
                if (err.StatusCode == undefined) {
                  this.loading = false;
                }
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                this.loading = false;
              })
          }
        });
      }
/*
 @Type: File, <ts>
 @Name: getIntegrationCheckstatus function
 @Who: Nitin Bhati
 @When: March 02 2022
 @Why: EWM-5409
 @What: For showing check status 
*/
getOtherIntegrationCheckstatus() {
  this.loading = true;
   // @suika @EWM-13681 Whn 03-08-2023
  this._systemSettingService.getJobBoardsIntegrationCheckstatus([{'RegistrationCode':this.RegistrationCode,'IsUser':1}]).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
          this.visibilityStatus = repsonsedata.Data.Connected;
            // @suika @EWM-13681 Whn 03-08-2023
          let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
          let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
          otherIntegrations[objIndex].Connected = this.visibilityStatus;
          localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
          this.loading = false;
          }
      } else {
        this.loading = false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loading = false;
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}


/*
     @Type: File, <ts>
     @Name: backToOtherIntegration
     @Who: Nitin Bhati
     @When: March 02 2022
     @Why: EWM-5409
     @What: For back to Integration page
   */
     backToOtherIntegration() {
      this.route.navigate(['/client/core/profile/other-integration']);
    }

}

