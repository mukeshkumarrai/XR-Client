/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Nitin Bhati
    @When: 22-Sep-2022
    @Why: EWM-8875
    @What:  This page is creted for Burst SMS UI Component TS
*/
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, HostListener } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ButtonTypes } from 'src/app/shared/models';


@Component({
  selector: 'app-burstsms-integration',
  templateUrl: './burstsms-integration.component.html',
  styleUrls: ['./burstsms-integration.component.scss']
})
export class BurstsmsIntegrationComponent implements OnInit {

  public showTabData: boolean = true;
  public showSeekFormData: boolean = false;
  seekIntegrationForm: FormGroup;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public totalStages: number;
  public screenPreviewClass: string = "";
  public currentMenuWidth: number;
  public screnSizePerStage: number;

  public submitted = false;
  public loading: boolean = false;
  public activestatus: string;
  RegistrationCode;
  IntegratorName;
  public oldPatchValues: any;
  visibilityStatus: boolean;
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
  animationVar: any;
  Advertisers: FormArray;
  AdvertiserName: any;
  saveStatus: boolean = false;
  public ClientId: string;
  public ClientSecret: string;
  public IsUser: number = 1;
  public Id: number = 0;
  public ClientSecretUrl: string = 'http://api.transmitsms.com/';
  messageValidation: string;

  constructor(public dialog: MatDialog, private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private route: Router,
    private imageUploadService: ImageUploadService,
    private snackBService: SnackBarService, private commonServiesService: CommonServiesService, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private routes: ActivatedRoute, private _systemSettingService: SystemSettingService, private router: ActivatedRoute) {
    this.seekIntegrationForm = this.fb.group({
      Id: [''],
      // ClientId: [''],
      // ClientSecret: [''],
      IsUser: [''],
      ClientId: ['', [Validators.required, Validators.maxLength(255),this.noWhitespaceValidator()]],
      DedicatedNumber: [null]
    });

  }

  ngOnInit(): void {
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth, 'onload');
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
        }
        this.ClientId = params['ClientId'];
        //this.ClientSecret = params['ClientSecret'];
        this.IsUser = params['IsUser'];
        this.Id = params['Id'];

      });
    this.getIntegrationCheckstatus();
    this.getIntegrationRegistrationByCode();
    this.animationVar = ButtonTypes;
  }
  /*
   @Type: File, <ts>
   @Name: getIntegrationRegistrationByCode function
   @Who: Nitin Bhati
   @When: 22-Sep-2022
   @Why: EWM-8875
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
            //  this.IsUser = this.gridViewList.IsUser;

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
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  openSeekFormData(values) {
    if (values == 'Add') {
      this.activestatus = 'Add';
      this.showSeekFormData = true;
      this.showTabData = false;
    } else {
      // this.getIntegrationById();
      this.getbroadbeantenantdetails()
      this.activestatus = 'Edit';
      this.showSeekFormData = true;
      this.showTabData = false;
    }
  }

  onCancel() {
    this.seekIntegrationForm.reset();
    this.getIntegrationCheckstatus();
    this.showSeekFormData = false;
    this.showTabData = true;
    this.saveStatus = false;
  }

  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    //  console.log('slide change');
  }

  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = 'flext-start';
    } else {
      this.screenPreviewClass = '';
    }
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }

    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 3000) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }


  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /* 
    @Type: File, <ts>
    @Name: onSave function
    @Who: Nitin Bhati
    @When: 22-Sep-2022
    @Why: EWM-8875
    @What: For checking wheather the data save or edit on the basis on active satatus
   */

  onSave(value) {
    this.submitted = true;
    if (this.seekIntegrationForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      // this.saveStatus = false;
      // this.saveStatus = true;
      this.createIntegration(value)
    } else {
      this.updateIntegration(value);
    }
  }
  /* 
   @Type: File, <ts>
   @Name: createIntegration function
   @Who: Nitin Bhati
   @When: 22-Sep-2022
   @Why: EWM-8875
   @What: For createIntegration broadBean master data
  */
  createIntegration(value: any) {
    this.loading = true;
    let AddObj = {};
    AddObj['Id'] = this.Id;
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['ClientId'] = value.ClientId;
    AddObj['DedicatedNumber'] = value.DedicatedNumber;

   // AddObj['ClientSecret'] = value.ClientSecret;
    AddObj['IsUser'] = this.IsUser;
    this._systemSettingService.burstSmsIntegrationConnectCreate(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.showSeekFormData = false;
        this.showTabData = true;
        this.seekIntegrationForm.reset();
        this.getIntegrationCheckstatus();
        this.saveStatus = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
        // who:bantee,what:ewm-12854,What: Add Dedicated Number while activating Burst SMS from marketplace,when:03/07/2023 

        this.messageValidation=repsonsedata.Message
        if(this.messageValidation=='400050'|| this.messageValidation=='400051' || this.messageValidation=='400052'){
        }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
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

  /*
     @Type: File, <ts>
     @Name: updateIntegration function
     @Who: Nitin Bhati
     @When: 22-Sep-2022
     @Why: EWM-8875
     @What: For updateIntegration data for Burst Sms Integartion master
    */
  updateIntegration(value: any) {
    this.loading = true;
    let updateObj = {};
    updateObj['Id'] = value.Id;
    updateObj['RegistrationCode'] = this.RegistrationCode;
    updateObj['ClientId'] = value.ClientId;
    updateObj['DedicatedNumber'] = value.DedicatedNumber;

    //updateObj['ClientSecret'] = value.ClientSecret;
    updateObj['IsUser'] = this.IsUser;
    this._systemSettingService.burstSmsIntegrationConnectCreate(updateObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.getIntegrationCheckstatus();
        this.showSeekFormData = false;
        this.showTabData = true;
        this.saveStatus = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
         // who:bantee,what:ewm-12854,What: Add Dedicated Number while activating Burst SMS from marketplace,when:03/07/2023 -->

        this.messageValidation=repsonsedata.Message;
        if(this.messageValidation=='400050'|| this.messageValidation=='400051' || this.messageValidation=='400052'){
        }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
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
  /*
      @Type: File, <ts>
      @Name: disconnectPopUp function
      @Who: Nitin Bhati
      @When: 22-Sep-2022
      @Why: EWM-8875
      @What: FOR DIALOG BOX confirmation
    */
  disconnectPopUp(): void {
    let DisconnectObj = {};
    DisconnectObj['RegistrationCode'] = this.RegistrationCode;
    const message = ``;
    const title = '';
    // @When: 30-07-2024 @who:Amit @why: EWM-17749 @what: label change
    const subTitle = 'label_marketplace_burstSMS_disconnect';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._systemSettingService.disconnectBurstSmsIntegration(DisconnectObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.seekIntegrationForm.reset();
              this.getIntegrationCheckstatus();
              this.showSeekFormData = false;
              this.showTabData = true;
              this.saveStatus = false;
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
      this.messageValidation='';
    });
  }
  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatus function
   @Who: Nitin Bhati
   @When: 22-Sep-2022
   @Why: EWM-8875
   @What: For showing check status 
  */
  getIntegrationCheckstatus() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatus(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          // console.log('repsonsedata',repsonsedata);

          if (repsonsedata.Data) {
            this.visibilityStatus = repsonsedata.Data?.Connected;
            if (this.visibilityStatus === true) {
              //  this.getIntegrationById();
              this.getbroadbeantenantdetails()
              this.activestatus = 'Edit';
              this.visibilityStatus = true;
              this.saveStatus = false;
            } else {
              this.activestatus = 'Add';
              this.visibilityStatus = false;
            }
              // @suika @EWM-13681 Whn 03-08-2023
            let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
            let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
            otherIntegrations[objIndex].Connected = this.visibilityStatus;
           localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
          }
          //this.totalDataCount = repsonsedata.TotalRecord;
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
   @Name: getbroadbeantenantdetails function
   @Who: Nitin Bhati
   @When: 22-Sep-2022
   @Why: EWM-8875
   @What: For Getting data By id
  */
  getbroadbeantenantdetails() {
    this.loading = true;
    this._systemSettingService.getBurstSmstenantdetails(this.RegistrationCode).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
          this.seekIntegrationForm.patchValue({
            RegistrationCode: data.Data.ResgistrationCode,
            ClientId: data.Data.ClientId,
            //ClientSecret: data.Data.ClientSecret,
            Id: data.Data.Id,
            IsUser: data.Data.IsUser,
            DedicatedNumber:data.Data?.DedicatedNumber
          });
          this.oldPatchValues = data['Data'];
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
      @Type: File, <ts>
      @Name: backToJob
      @Who: Nitin Bhati
      @When: 22-Sep-2022
      @Why: EWM-8875
      @What: For back to Integration page
    */
  backToJob() {
    this.route.navigate(['/client/core/administrators/integration-interface-board']);
  }
  /*
    @Type: File, <ts>
    @Name: patchValues function
    @Who: Nitin Bhati
    @When: 23-Sep-2022
    @Why: EWM-8875
    @What: use for set value in patch for update data.
  */
  patchValues(IsUser, Id, ClientId, ClientSecret) {
    return this.fb.group({
      // AdvertiserId: [AdvertiserId],
      ClientId: [ClientId],
      //ClientSecret: [ClientSecret],
      Id: [Id],
      IsUser: [IsUser]
    })
  } 

  /*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: Nitin Bhati
   @When: 23-Sep-2022
   @Why: EWM-8875
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

  /*
   @Type: File, <ts>
   @Name: clearMessage function
   @Who: Bantee Kumar
   @When: 03-July-2023
   @Why: EWM-12854
   @What: Remove error message
*/
clearMessage(){
  
  this.messageValidation='';
  
}

  /*
   @Type: File, <ts>
   @Name: changeAPIKey function
   @Who: Bantee Kumar
   @When: 03-July-2023
   @Why: EWM-12854
   @What: Remove error message
*/
changeAPIKey(){
  this.messageValidation='';
  this.seekIntegrationForm.get('DedicatedNumber').reset();

}
}

