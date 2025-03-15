/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: maneesh
 @When: 22-Sep-2022
 @Why: EWM-8676
    @What:  This page is creted for broadbean enabel disabel Integration interface board UI Component TS
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
  selector: 'app-broadbean-enabel-desabel',
  templateUrl: './broadbean-enabel-desabel.component.html',
  styleUrls: ['./broadbean-enabel-desabel.component.scss']
})
export class BroadbeanEnabelDesabelComponent implements OnInit {

  public showTabData: boolean = true;
  public showSeekFormData: boolean = false;
  broadbeanIntegrationForm: FormGroup;
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
  public UserHybridName: string;
  public UserHybridPassword: string;
  // public IsUser: number = 1;
  public Id: number = 0;
  constructor(public dialog: MatDialog, private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private route: Router,
    private imageUploadService: ImageUploadService,
    private snackBService: SnackBarService, private commonServiesService: CommonServiesService, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private routes: ActivatedRoute, private _systemSettingService: SystemSettingService, private router: ActivatedRoute) {
    this.broadbeanIntegrationForm = this.fb.group({
      Id: [''],
      UserHybridName: ['',[Validators.required,Validators.maxLength(100),this.noWhitespaceValidator() ]],
      UserHybridPassword: ['',[Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]],
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

        this.UserHybridName = params['UserHybridName'];
        this.UserHybridPassword = params['UserHybridPassword'];
        this.Id = params['Id'];

      });
    // this.getIntegrationCheckstatus();
    this.getBroadbeanEnabelDesabel();
    this.getIntegrationRegistrationByCode();
    this.animationVar = ButtonTypes;
  }
  /*
   @Type: File, <ts>
   @Name: getIntegrationRegistrationByCode function
   @Who: maneesh
   @When: 22-Sep-2022
   @Why: EWM-8676
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
      this.getbroadbeantenantdetails()
      this.activestatus = 'Edit';
      this.showSeekFormData = true;
      this.showTabData = false;

    }

  }

  onCancel() {
    this.broadbeanIntegrationForm.reset();
    // this.getIntegrationCheckstatus();
    this.getBroadbeanEnabelDesabel();
    this.showSeekFormData = false;
    this.showTabData = true;
    this.saveStatus = false;

    // this.showSeekFormData = false;
    // this.showTabData = true;
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
    @Who: maneesh
    @When: 22-Sep-2022
    @Why: EWM-8676
    @What: For checking wheather the data save or edit on the basis on active satatus
   */

  onSave(value) {
    this.submitted = true;
    if (this.broadbeanIntegrationForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createIntegration(value)
    } else {
      this.updateIntegration(value);
    }
  }
  /* 
   @Type: File, <ts>
   @Name: createIntegration function
   @Who: maneesh
   @When: 22-Sep-2022
   @Why: EWM-8676
   @What: For createIntegration broadBean master data
  */
  createIntegration(value: any) {
    this.loading = true;
    let AddObj = {};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    // AddObj['IsUser'] = 1;
    AddObj['Id'] = 0;
    AddObj['UserHybridName'] = value.UserHybridName.trim(); 
    AddObj['UserHybridPassword'] = value.UserHybridPassword.trim();
    this._systemSettingService.enabelbroadBeanIntegration(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.showSeekFormData = false;
        this.showTabData = true;
        this.broadbeanIntegrationForm.reset();
        // this.getIntegrationCheckstatus();
        this.getBroadbeanEnabelDesabel();
        this.saveStatus = false;
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

  /*
     @Type: File, <ts>
     @Name: updateIntegration function
     @Who: maneesh
     @When: 22-Sep-2022
     @Why: EWM-8676
     @What: For updateIntegration data for broadBean Integartion master
    */
  updateIntegration(value: any) {
    this.loading = true;
    let updateObj = {};
    updateObj['RegistrationCode'] = this.RegistrationCode;
    updateObj['Id'] = value.Id;
    // updateObj['Id'] = 0;
    updateObj['UserHybridName'] = value.UserHybridName.trim();
    updateObj['UserHybridPassword'] = value.UserHybridPassword.trim();
    this._systemSettingService.enabelbroadBeanIntegration(updateObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.getBroadbeanEnabelDesabel();

        this.showSeekFormData = false;
        this.showTabData = true;
        this.saveStatus = false;
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
  /*
      @Type: File, <ts>
      @Name: disconnectPopUp function
       @Who: maneesh
       @When: 22-Sep-2022
       @Why: EWM-8676
      @What: FOR DIALOG BOX confirmation
    */
  disconnectPopUp(): void {
    // console.log('RegistrationCode',this.RegistrationCode);  
    let DisconnectObj = {};
    DisconnectObj['RegistrationCode'] = this.RegistrationCode;
    const message = `label_titleDialogContentSiteDomain`;
    const title = '';
    const subTitle = 'label_disconnectBroadbean';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._systemSettingService.disablebroadBeanIntegration(DisconnectObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.broadbeanIntegrationForm.reset();
              this.getBroadbeanEnabelDesabel();

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
    });
  }
  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatus function
   @Who: maneesh
   @When: 22-Sep-2022
   @Why: EWM-8676
   @What: For showing check status 
  */
      getBroadbeanEnabelDesabel() {
        this.loading = true;  
         // @suika @EWM-13681 Whn 03-08-2023
        this._systemSettingService.getJobBoardsIntegrationCheckstatus([{'RegistrationCode':this.RegistrationCode,'IsUser':1}]).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          // console.log('repsonsedata',repsonsedata);

          if (repsonsedata.Data) {
            this.visibilityStatus = repsonsedata.Data.Connected;
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
   @Who: maneesh
   @When: 22-Sep-2022
   @Why: EWM-8676
   @What: For Getting data By id
  */
  getbroadbeantenantdetails() {
    this.loading = true;
    this._systemSettingService.getbroadbeanuserdetails(this.RegistrationCode).subscribe(
      (data: ResponceData) => {
        // console.log('data',data);
        this.loading = false;
        if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
          this.broadbeanIntegrationForm.patchValue({
            RegistrationCode: data.Data.ResgistrationCode,
            UserHybridName: data.Data.UserHybridName,
            UserHybridPassword: data.Data.UserHybridPassword,
            Id: data.Data.Id,

          });
          // console.log('RegistrationCode',this.RegistrationCode);

          // this.patchValues(data);
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
      @Who: maneesh
      @When: 22-Sep-2022
      @Why: EWM-8676
      @What: For back to Integration page
    */
  backToJob() {
    this.route.navigate(['/client/core/profile/other-integration']);
  }

  /* 
     @Type: File, <ts>
     @Name: onValidateSeekAdvertiseId function
     @Who: maneesh
     @When: 22-Sep-2022
     @Why: EWM-8676
     @What: For saving Validate seek advertise Id master data
    */
  onValidateSeekAdvertiseId(value: any, index) {
    let advertiseId = value.Advertisers[index].APIKey;
    this.loading = true;
    this._systemSettingService.onValidateSeekAdvertiseId(advertiseId).subscribe(
      (data: ResponceData) => {
        // console.log('data',data);
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.saveStatus = true;
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        if (err.status == undefined) {
          this.saveStatus = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant('label_seekAdvertiserIDwrong'), '400');
        }
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
 @Type: File, <ts>
 @Name: patch function
 @Who: maneesh
 @When: 22-Sep-2022
 @Why: EWM-8676
 @What: use for set value in patch.
*/
  patch(AdvertisersMapping) {
    // const arr = <FormArray>this.broadbeanIntegrationForm.get('Advertisers');
    // arr.clear();
    // const control = <FormArray>this.broadbeanIntegrationForm.get('Advertisers');
    // AdvertisersMapping.forEach(x => {
    //   control.push(this.patchValues(x['APIKey'], x['OrganizationId'], x['APISecretKey']))
    // })
  }
  /*
    @Type: File, <ts>
    @Name: patchValues function
    @Who: maneesh
    @When: 22-Sep-2022
    @Why: EWM-8676
    @What: use for set value in patch for update data.
  */
  patchValues(IsUser, Id, UserHybridName, UserHybridPassword) {
    return this.fb.group({
      // AdvertiserId: [AdvertiserId],
      UserHybridName: [UserHybridName],
      UserHybridPassword: [UserHybridPassword],
      Id: [Id],
      // IsUser: [IsUser]
    })


  }
  deleteItem(index) {
    // this.Advertisers.removeAt(index)
  }
  /*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 23-Sep-2022
   @Why: EWM-8676
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}
// export class UsernameValidator {
//   static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
//       if((control.value as string).indexOf(' ') >= 0){
//           return {cannotContainSpace: true}
//       }
//       return null;
//   }
// }
