/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Naresh Singh
    @When:
    @Modified: Oct 25 2021
    @Why: EWM-3040 EWM-3453
    @What:  This page is creted for Integration interface board UI Component TS
*/


import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, HostListener } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { RxwebValidators } from '@rxweb/reactive-form-validators';


@Component({
  selector: 'app-seek-integration',
  templateUrl: './seek-integration.component.html',
  styleUrls: ['./seek-integration.component.scss']
})
export class SeekIntegrationComponent implements OnInit {

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
  RegistrationCode;
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
  animationVar: any;
  Advertisers: FormArray;
  AdvertiserName: any;
  saveStatus: boolean=false;
  dirctionalLang;
  validSeekId=[];
  constructor(public dialog: MatDialog,private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private route: Router,
    private imageUploadService: ImageUploadService,
    private snackBService: SnackBarService, private commonServiesService: CommonServiesService, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private routes: ActivatedRoute,private _systemSettingService:SystemSettingService,private router: ActivatedRoute) {
    this.seekIntegrationForm = this.fb.group({
      Id: [''],
      // SeekClientId: ['', [Validators.required, Validators.maxLength(255)]],
      // SeekClientSecret: ['', [Validators.required, Validators.maxLength(255)]],
      //advertiserId: ['', [Validators.required, Validators.maxLength(255)]],
      Advertisers: new FormArray([this.createItem()])
    });
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

      let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
  }

  createItem(): FormGroup {
    //   <!------------@suika @EWM-13275 @Whn 10-08-2023-------------->
    return this.fb.group({
      AdvertiserId: ['', [Validators.required,RxwebValidators.unique(),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]],
      IsValidate:['',[Validators.required]],
      OrganizationName:['',[Validators.required]],
      OrganizationId: '',
    });
  }

  addItem(): void {
    this.Advertisers = this.seekIntegrationForm.get('Advertisers') as FormArray;
    this.Advertisers.push(this.createItem());
    this.saveStatus = false;
  }
/*
 @Type: File, <ts>
 @Name: getIntegrationRegistrationByCode function
 @Who: Nitin Bhati
 @When: 02-Nov-2021
 @Why: EWM-3450
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

  openSeekFormData(values){
    if(values=='Add'){
      this.activestatus='Add';
      this.showSeekFormData = true;
      this.showTabData = false;
    }else{
      this.getIntegrationById();
      this.activestatus='Edit';
      this.showSeekFormData = true;
      this.showTabData = false;

    }

  }

  onCancel(){

    let advertisePoint=[{name: "1"}];
    let KeyAdvertise = this.seekIntegrationForm.get('Advertisers') as FormArray;
    KeyAdvertise.clear();
    advertisePoint.forEach(element => {
      KeyAdvertise.push(this.createItem());
  });
    this.seekIntegrationForm.reset();
    this.getIntegrationCheckstatus();
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
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 02-Nov-2021
   @Why: EWM-3450
   @What: For checking wheather the data save or edit on the basis on active satatus
  */

  onSave(value) {
    this.submitted = true;
    if (this.seekIntegrationForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createIntegration(value);
    } else {
      this.updateIntegration(value);
    }
  }
  /*
   @Type: File, <ts>
   @Name: createIntegration function
   @Who: Nitin Bhati
   @When: 1-Nov-2021
   @Why: EWM-3452
   @What: For saving Integration seek master data
  */
   createIntegration(value:any) {
     //console.log("values:",value)
    this.loading = true;
    let AddObj={};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    // AddObj['IntegratorName'] = this.IntegratorName;
    // AddObj['ClientId'] = value.SeekClientId;
    // AddObj['ClientSecret'] =  value.SeekClientSecret;
    // AddObj['AdvertiserId'] =  value.advertiserId;
    AddObj['Advertisers'] =  value.Advertisers;
    this._systemSettingService.seekIntegrationConnectCreate(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.showSeekFormData = false;
        this.showTabData = true;
        this.seekIntegrationForm.reset();
        this.getIntegrationCheckstatus();
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
     @Who: Nitin Bhati
     @When: 1-Nov-2021
     @Why: EWM-3452
     @What: For saving data for Seek Integartion master
    */
     updateIntegration(value: any) {
      let updateObj = [];
      let fromObj = {};
      let toObj = {};
      fromObj = this.oldPatchValues;
      //fromObj['IntegratorName'] = this.IntegratorName;
      toObj['RegistrationCode'] = this.RegistrationCode;
      //toObj['IntegratorName'] = this.IntegratorName;
      // toObj['ClientId'] = value.SeekClientId;
      // toObj['ClientSecret'] =  value.SeekClientSecret;
      // toObj['AdvertiserId'] =  value.AdvertiserId;
      toObj['Advertisers'] =  value.Advertisers;
      updateObj = [{
        "From": fromObj,
        "To": toObj
      }];
      this._systemSettingService.updateSeekIntegration(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getIntegrationCheckstatus();
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
      @Who: Nitin
      @When: 2-Nov-2021
      @Why: EWM-3450
      @What: FOR DIALOG BOX confirmation
    */
      disconnectPopUp(): void {
        let DisconnectObj={};
        DisconnectObj = this.oldPatchValues;
        DisconnectObj['IntegratorName'] = this.IntegratorName;
        const message = ``;
        const title = '';
        const subTitle = 'marketplace_seek';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
            this._systemSettingService.disconnectSeekIntegration(DisconnectObj).subscribe(
              (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                   // const arr = <FormArray>this.seekIntegrationForm.get('Advertisers');
                  // arr.clear();
                  let advertisePoint=[{name: "1"}];
                  let KeyAdvertise = this.seekIntegrationForm.get('Advertisers') as FormArray;
                  KeyAdvertise.clear();
                  advertisePoint.forEach(element => {
                    KeyAdvertise.push(this.createItem());
                });
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
        });

        // RTL Code
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
 @Who: Nitin Bhati
 @When: 02-Nov-2021
 @Why: EWM-3450
 @What: For showing check status
*/
getIntegrationCheckstatus() {
  this.loading = true;
  this._systemSettingService.getIntegrationCheckstatus(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.visibilityStatus = repsonsedata.Data.Connected;
           if(this.visibilityStatus===true){
             this.getIntegrationById();
             this.activestatus='Edit';
             this.visibilityStatus=true;
             this.saveStatus = false;
           }else{
            this.activestatus='Add';
            this.visibilityStatus=false;
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
 @Name: getIntegrationById function
 @Who: Nitin Bhati
 @When: 02-Nov-2021
 @Why: EWM-3450
 @What: For Getting data By id
*/
getIntegrationById() {
  this.loading = true;
  this._systemSettingService.getSeekIntegrationById(this.RegistrationCode).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
         this.seekIntegrationForm.patchValue({
          RegistrationCode: data.Data.RegistrationCode,
          // IntegratorName: data.Data.IntegratorName,
          // SeekClientId: data.Data.ClientId,
          // SeekClientSecret: data.Data.ClientSecret,
          // advertiserId: data.Data.AdvertiserId
        });
        this.patch(data.Data.Advertisers);
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
     @When: 17-Dec-2021
     @Why: EWM-4169
     @What: For back to Integration page
   */
     backToJob() {
      this.route.navigate(['/client/core/administrators/integration-interface-board']);
    }

/*
   @Type: File, <ts>
   @Name: onValidateSeekAdvertiseId function
   @Who: Nitin Bhati
   @When: 3-March-2022
   @Why: EWM-5433
   @What: For saving Validate seek advertise Id master data
  */
   onValidateSeekAdvertiseId(value:any,index) {
    let advertiseId=value.Advertisers[index].AdvertiserId;
    this.loading = true;
    const seekFormArray = this.seekIntegrationForm.get("Advertisers") as FormArray;
     this._systemSettingService.onValidateSeekAdvertiseId(advertiseId).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.validSeekId.push({advertiseId:advertiseId,Data:data.Data});
          this.saveStatus = true;
          data.Data.AdvertiserName;
          this.AdvertiserName=data.Data.AdvertiserName;
           (<FormArray>this.seekIntegrationForm.get('Advertisers')).at(index).patchValue(
            {
              OrganizationName:this.AdvertiserName,
              OrganizationId:data.Data.Id.value,
            }
          )
              // @suika @whn 17-08-2023 @EWM-13275
          seekFormArray.at(index).get('IsValidate').setValue(true);
          seekFormArray.at(index).get('IsValidate').setErrors(null);
          seekFormArray.at(index).get('AdvertiserId').clearValidators();
          seekFormArray.at(index).get('AdvertiserId').markAsPristine();
          seekFormArray.at(index).get('AdvertiserId').setValidators( [Validators.required,RxwebValidators.unique(),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]);
           }
        else{
              // @suika @whn 17-08-2023 @EWM-13275
          seekFormArray.at(index).get('IsValidate').setErrors({ IsValidateErr: true });
          seekFormArray.at(index).get('AdvertiserId').setErrors({ invalid: true });
          seekFormArray.at(index).get('AdvertiserId').markAsTouched();
          seekFormArray.at(index).get('AdvertiserId').markAsDirty();
         // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
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
  @Who: Nitin Bhati
  @When: 04-March-2022
  @Why: EWM-5433
  @What: use for set value in patch.
*/
patch(AdvertisersMapping) {
  const arr = <FormArray>this.seekIntegrationForm.get('Advertisers');
  arr.clear();
  const control = <FormArray>this.seekIntegrationForm.get('Advertisers');
  AdvertisersMapping.forEach(x => {
    control.push(this.patchValues(x['AdvertiserId'], x['OrganizationId'], x['OrganizationName']))
  })
}
/*
  @Type: File, <ts>
  @Name: patchValues function
  @Who: Nitin Bhati
  @When: 04-March-2022
  @Why: EWM-5433
  @What: use for set value in patch for update data.
*/
patchValues(AdvertiserId, OrganizationId, OrganizationName) {
  return this.fb.group({
    // @suika @whn 17-08-2023 @EWM-13275
    AdvertiserId: [AdvertiserId,[Validators.required,RxwebValidators.unique(),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]],
    IsValidate:[true],
    OrganizationId: [OrganizationId,Validators.required],
    OrganizationName: [OrganizationName]
  })
}


/*
  @Type: File, <ts>
  @Name: deleteItem function
  @Who: Suika
  @When: 18-Aug-2023
  @Why: EWM-13275
  @What: use for set value in patch for update data.
*/
deleteItem(index){
 // @suika @whn 17-08-2023 @EWM-13275
const seekFormArray = this.seekIntegrationForm.get("Advertisers") as FormArray;
seekFormArray.at(index).get('AdvertiserId').setErrors(null);
seekFormArray.at(index).get('AdvertiserId').clearValidators();
seekFormArray.at(index).get('AdvertiserId').markAsPristine();
seekFormArray.at(index).get('AdvertiserId').setValidators( [Validators.required,RxwebValidators.unique(),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]);
this.Advertisers.removeAt(index);
}


/*
  @Type: File, <ts>
  @Name: setValidateVal function
  @Who: Suika
  @When: 18-Aug-2023
  @Why: EWM-13275
  @What: use for set value in patch for update data.
*/
setValidateVal(i){
  const seekFormArray = this.seekIntegrationForm.get("Advertisers") as FormArray;
  let seekId = seekFormArray.at(i).get('AdvertiserId').value;
   let data = this.validSeekId?.filter(res=>res.advertiseId==seekId);
  if(data?.length>0){
    (<FormArray>this.seekIntegrationForm.get('Advertisers')).at(i).patchValue(
      {
        //@suika @whn 26-09-2023 @ewm-13275
      //  OrganizationName:data[0]?.Data?.AdvertiserName,
      //  OrganizationId:data[0]?.Data?.Id?.value,
      }
    )
    seekFormArray.at(i).get('IsValidate').setErrors(null);
    seekFormArray.at(i).get('IsValidate').clearValidators();
    seekFormArray.at(i).get('IsValidate').markAsPristine();
    return false;
  }else{
    seekFormArray.at(i).get('IsValidate').setValue(null);
    (<FormArray>this.seekIntegrationForm.get('Advertisers')).at(i).patchValue(
      {
        OrganizationName:'',
        OrganizationId:'',
      }
    )
  }

}

}
