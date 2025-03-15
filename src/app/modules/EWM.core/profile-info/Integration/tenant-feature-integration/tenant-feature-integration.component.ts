/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Anup Singh
    @When: 15-Dec-2021
    @Why: EWM-3275 EWM-4199
    @What:  This page is creted for tenant feature integration  UI Component
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
import { ButtonTypes } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-tenant-feature-integration',
  templateUrl: './tenant-feature-integration.component.html',
  styleUrls: ['./tenant-feature-integration.component.scss']
})
export class TenantfeatureIntegration implements OnInit {

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
  animationVar: any;
  xeopleSMSRegistrationCode: any;
  zoomMeetingInviteRegistrationCode: any;
  zoomPhoneCallRegistrationCode: any;
  TypeName: any;
  mSTeamMeetingInviteRegistrationCode: any;
  googleMeetMeetingInviteRegistrationCode: any;
  dirctionalLang;

  constructor(public dialog: MatDialog,private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,private route: Router,
    private snackBService: SnackBarService,
    private translateService: TranslateService,private _systemSettingService:SystemSettingService,private router: ActivatedRoute,private _appSetting: AppSettingsService) {
      // this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
      // this.daxtraRegistrationCode = this._appSetting.daxtraRegistrationCode;
       // this.xeopleCallRegistrationCode = this._appSetting.xeopleCallRegistrationCode;
      this.xeopleSMSRegistrationCode = this._appSetting.xeopleSMSRegistrationCode;
      this.zoomMeetingInviteRegistrationCode = this._appSetting.zoomMeetingInviteRegistrationCode;
      this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
      this.mSTeamMeetingInviteRegistrationCode = this._appSetting.mSTeamMeetingInviteRegistrationCode;
      this.googleMeetMeetingInviteRegistrationCode = this._appSetting.googleMeetMeetingInviteRegistrationCode;
  }

  ngOnInit(): void {
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth,'onload');
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
          this.IntegratorName = params['name'];
        }
      });
      this.getIntegrationCheckstatus();
      this.getIntegrationRegistrationByCode();
      this.animationVar = ButtonTypes;
  }
/*
 @Type: File, <ts>
 @Name: getIntegrationRegistrationByCode function
 @Who: Anup Singh
 @When: 15-Dec-2021
 @Why: EWM-3275 EWM-4199
 @What: For showing Integration Registration Code
*/
getIntegrationRegistrationByCode() {
  this.loading = true;
  this._systemSettingService.getIntegrationRegistrationByCode(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
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
           this.TypeName = this.gridViewList.TypeName;          
           }
       } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      this.loading = false;
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
   @Who: Anup Singh
   @When: 15-Dec-2021
   @Why: EWM-3275 EWM-4199
   @What: For saving tenant feature integration  enable and disable data
  */
   EnableSave() {
    this.loading = true;
    let AddObj={};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['IsUser'] = this.IsUser;

    if(this.RegistrationCode==this.xeopleSMSRegistrationCode){
      this._systemSettingService.enableXeopleSMSIntegration(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.showSeekFormData = false;
          this.showTabData = true;
           this.getIntegrationCheckstatus();   
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
    }else if(this.RegistrationCode==this.zoomMeetingInviteRegistrationCode){
      this._systemSettingService.zoomConfigurationConnect(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.showSeekFormData = false;
          this.showTabData = true;
           this.getIntegrationCheckstatus();   
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
    }else if(this.RegistrationCode==this.zoomPhoneCallRegistrationCode){
      this._systemSettingService.zoomConfigurationConnect(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.showSeekFormData = false;
          this.showTabData = true;
           this.getIntegrationCheckstatus();   
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
    else if(this.RegistrationCode==this.mSTeamMeetingInviteRegistrationCode){
      this._systemSettingService.msTeamConfigurationConnect(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.showSeekFormData = false;
          this.showTabData = true;
           this.getIntegrationCheckstatus();   
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
     else if(this.RegistrationCode==this.googleMeetMeetingInviteRegistrationCode){
      this._systemSettingService.googleMeetConfigurationConnect(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.showSeekFormData = false;
          this.showTabData = true;
           this.getIntegrationCheckstatus();   
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
      @Who: Anup Singh
      @When: 15-Dec-2021
      @Why: EWM-3275 EWM-4199
      @What: FOR DIALOG BOX confirmation
    */
      disconnectPopUp(): void {
        let DisconnectObj={};
        //DisconnectObj = this.oldPatchValues;
        DisconnectObj['RegistrationCode'] = this.RegistrationCode;
        DisconnectObj['IsUser'] = this.IsUser;
        const message = ``;
        const title = '';
        let subTitle = '';
        if(this.RegistrationCode==this.xeopleSMSRegistrationCode){
          subTitle = 'marketplace_twilio_SMS';
        }else if(this.RegistrationCode==this.zoomMeetingInviteRegistrationCode){
          subTitle = 'marketplace_ZoomMeeting';
        }else if(this.RegistrationCode==this.zoomPhoneCallRegistrationCode){
          subTitle = 'marketplace_Zoomphonecall';
        }else if(this.RegistrationCode==this.mSTeamMeetingInviteRegistrationCode){
          subTitle = 'Label_marketplace_Teams';
        }else if(this.RegistrationCode==this.googleMeetMeetingInviteRegistrationCode){
          subTitle = 'marketplace_Google Meet';
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

            if(this.RegistrationCode==this.xeopleSMSRegistrationCode){
              this._systemSettingService.disableXeopleSMSIntegration(DisconnectObj).subscribe(
                (data: ResponceData) => {
                  if (data.HttpStatusCode === 200) {
                    this.getIntegrationCheckstatus();
                    this.showSeekFormData = false;
                    this.showTabData = true;
                    this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                      } else {
                    this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                  } 
                }, err => {
                  if (err.StatusCode == undefined) {
                    this.loading = false;
                  }
                  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                })

            }else if(this.RegistrationCode==this.zoomMeetingInviteRegistrationCode){
              this._systemSettingService.zoomConfigurationDisconnect(DisconnectObj).subscribe(
                (data: ResponceData) => {
                  if (data.HttpStatusCode === 200) {
                    this.getIntegrationCheckstatus();
                    this.showSeekFormData = false;
                    this.showTabData = true;
                    this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                      } else {
                    this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                  } 
                }, err => {
                  if (err.StatusCode == undefined) {
                    this.loading = false;
                  }
                  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                })

            } else if(this.RegistrationCode==this.zoomPhoneCallRegistrationCode){
            this._systemSettingService.zoomConfigurationDisconnect(DisconnectObj).subscribe(
              (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                  this.getIntegrationCheckstatus();
                  this.showSeekFormData = false;
                  this.showTabData = true;
                  this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                    } else {
                  this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                } 
              }, err => {
                if (err.StatusCode == undefined) {
                  this.loading = false;
                }
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
              })
            }else if(this.RegistrationCode==this.mSTeamMeetingInviteRegistrationCode){
              this._systemSettingService.msTeamConfigurationDisconnect(DisconnectObj).subscribe(
                (data: ResponceData) => {
                  if (data.HttpStatusCode === 200) {
                    this.getIntegrationCheckstatus();
                    this.showSeekFormData = false;
                    this.showTabData = true;
                    this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                      } else {
                    this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                  } 
                }, err => {
                  if (err.StatusCode == undefined) {
                    this.loading = false;
                  }
                  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                })
              }
              else if(this.RegistrationCode==this.googleMeetMeetingInviteRegistrationCode){
                this._systemSettingService.googleMeetConfigurationDisconnect(DisconnectObj).subscribe(
                  (data: ResponceData) => {
                    if (data.HttpStatusCode === 200) {
                      this.getIntegrationCheckstatus();
                      this.showSeekFormData = false;
                      this.showTabData = true;
                      this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                        } else {
                      this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                    } 
                  }, err => {
                    if (err.StatusCode == undefined) {
                      this.loading = false;
                    }
                    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                  })
                }
          }
        });

        let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	 

      }
/*
 @Type: File, <ts>
 @Name: getIntegrationCheckstatus function
 @Who: Anup Singh
 @When: 15-Dec-2021
 @Why: EWM-3275 EWM-4199
 @What: For showing check status 
*/
getIntegrationCheckstatus() {
  this.loading = true;
  this._systemSettingService.getIntegrationCheckstatus(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.visibilityStatus = repsonsedata.Data?.Connected;
             // @suika @EWM-13681 Whn 03-08-2023
           let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
           let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
           otherIntegrations[objIndex].Connected = this.visibilityStatus;
           localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
          }
      } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}


/*
     @Type: File, <ts>
     @Name: backToIntegration
     @Who: Anup
     @When: 10-feb-2022
     @What: For back to Integration page
   */
     backToIntegration() {
      this.route.navigate(['/client/core/administrators/integration-interface-board']);
    }

}