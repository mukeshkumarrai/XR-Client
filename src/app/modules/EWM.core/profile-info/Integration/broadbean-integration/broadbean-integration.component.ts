/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: maneesh
    @When: 20-Sep-2022
    @Why: EWM-7472
    @What:  This page is creted for Integration interface board UI Component TS
*/
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, HostListener } from '@angular/core';
import { DataBindingDirective, PageChangeEvent } from '@progress/kendo-angular-grid';
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
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ButtonTypes } from 'src/app/shared/models';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { AddBroadbeanActivateUsersComponent } from './add-broadbean-activate-users/add-broadbean-activate-users.component';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-broadbean-integration',
  templateUrl: './broadbean-integration.component.html',
  styleUrls: ['./broadbean-integration.component.scss']
})
export class BroadbeanIntegrationComponent implements OnInit {

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
  public ClientId: string;
  public ClientSecret: string;
  public IsUser:number = 1;
  public Id:number = 0;
  public tabActive: string;
  planTypeList:any = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public activatedUsersgridViewList: any = [];
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  public sortingValue: string = "UserName,asc";

  public sort: any[] = [{
    field: 'UserName',
    dir: 'asc'
  }];
  public sortDirection = 'asc';
  public userpreferences: Userpreferences;
  public loadingscroll: boolean;
  public totalDataCount: any;
  public pagneNo = 1;
  isActivatedUsers:boolean = false;
  planName:string;
  isActiveClass:any;
  public pageNo: number = 1;
  public pageSize:number;
  broadBeanClientId: string;
  public canLoad = false;
  public pendingLoad = false;
  constructor(public dialog: MatDialog,private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private route: Router,
    private imageUploadService: ImageUploadService,
    private snackBService: SnackBarService, private commonServiesService: CommonServiesService, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private routes: ActivatedRoute,private _systemSettingService:SystemSettingService,private router: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService,private _appSetting: AppSettingsService,) {
      this.pageSize = this._appSetting.pagesize;
      this.seekIntegrationForm = this.fb.group({
      Id: [''],
      // ClientId: [''],
      // ClientSecret: [''],
      IsUser:[''],
      ClientId: ['', [Validators.required,Validators.maxLength(150),this.noWhitespaceValidator()]],
      ClientSecret: ['', [Validators.required,Validators.maxLength(150),this.noWhitespaceValidator() ]],
      PlanType:[null, [Validators.required]],
      PlanTypeName:['']
    });

  }

  ngOnInit(): void {
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth,'onload');
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
        }
        this.ClientId = params['ClientId'];
        this.ClientSecret = params['ClientSecret'];
        this.IsUser = params['IsUser'];
        this.Id = params['Id'];
        
      });
      this.getIntegrationCheckstatus();
      this.getIntegrationRegistrationByCode();
      this.animationVar = ButtonTypes;
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.getPlanType();
      setInterval(() => {
        this.canLoad = true;
        if (this.pendingLoad) {
          this.onScrollDown();
        }
      }, 2000);
  }

  // createItem(): FormGroup {
  //   return this.fb.group({
  //     Id: [''],
  //     // AdvertiserId: [''],
  //     ClientId: [''],
  //     ClientSecret: [''],
    
  //   });
  // }
  
  // addItem(): void {
  //   this.Advertisers = this.seekIntegrationForm.get('Advertisers') as FormArray;
  //   this.Advertisers.push(this.createItem());
  //   this.saveStatus = false;
  // }
/*
 @Type: File, <ts>
 @Name: getIntegrationRegistrationByCode function
 @Who: maneesh
 @When: 20-Sep-2022
 @Why: EWM-7472
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
isCreateMode:boolean = true;
  openSeekFormData(values){
    if(values=='Add'){
      this.activestatus='Add';
      this.showSeekFormData = true;
      this.showTabData = false;
      this.isActivatedUsers = false;
      if (this.showSeekFormData) {
        this.isCreateMode = false;
      }
    }else{
      this.getbroadbeantenantdetails();
      this.getPlanType();
      this.activestatus='Edit';
      this.showSeekFormData = true;
      this.showTabData = false;
      this.isCreateMode = true;
      this.isActivatedUsers = false;
     
    }
   
  }

  onCancel(){

  //   let advertisePoint=[{name: "1"}];
  //   let KeyAdvertise = this.seekIntegrationForm.get('Advertisers') as FormArray;
  //   KeyAdvertise.clear();
  //   advertisePoint.forEach(element => {
  //     KeyAdvertise.push(this.createItem());
  // });
    this.seekIntegrationForm.reset();
    this.getIntegrationCheckstatus();
    this.showSeekFormData = false;
    this.showTabData = true;
    this.saveStatus = false;
    this.isCreateMode = true;
    this.isActiveClass = null;
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
   @Who: maneesh
   @When: 20-Sep-2022
   @Why: EWM-7472
   @What: For checking wheather the data save or edit on the basis on active satatus
  */

  onSave(value) {
    this.submitted = true;
    if (this.seekIntegrationForm.invalid) {
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
   @When: 20-Sep-2022
   @Why: EWM-7472
   @What: For createIntegration broadBean master data
  */
   createIntegration(value:any) {
    this.loading = true;
    let AddObj={};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['IsUser'] = 1;
    AddObj['Id'] = 0;
    // AddObj['IsUser'] = this.IsUser;
    // AddObj['Id'] = this.Id;
    AddObj['ClientId'] = value.ClientId;
    AddObj['ClientSecret'] =  value.ClientSecret;
    AddObj['PlanType'] =  value.PlanTypeName;

    this._systemSettingService.broadBeanIntegrationConnectCreate(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.seekIntegrationForm.reset();
        this.getIntegrationCheckstatus();
        this.isCreateMode = true;
        this.getBroadbeanUsersAll(true,this.pageNo, this.pageSize, this.sortingValue);
        this.showSeekFormData = false;
        this.showTabData = false;
        this.saveStatus = false;
        this.isActiveClass = 'activatUsers';
        this.isActivatedUsers = true;

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
     @When: 20-Sep-2022
     @Why: EWM-7472
     @What: For updateIntegration data for broadBean Integartion master
    */
     updateIntegration(value: any) {
      // let updateObj = [];
      // let fromObj = {};
      // let toObj = {};
      // fromObj = this.oldPatchValues;
      // toObj['RegistrationCode'] = this.RegistrationCode;
      // toObj['ClientId'] = value.ClientId;
      // toObj['ClientSecret'] =  value.ClientSecret;
      // updateObj = [{
      //   "From": fromObj,
      //   "To": toObj
      // }];

      this.loading = true;
      let updateObj={};
      updateObj['RegistrationCode'] = this.RegistrationCode;
      updateObj['Id'] = value.Id;
      updateObj['ClientId'] = value.ClientId;
      updateObj['ClientSecret'] =  value.ClientSecret;
      updateObj['PlanType'] =  value.PlanTypeName;
      updateObj['IsUser'] =  1;

      this._systemSettingService.broadBeanIntegrationConnectCreate(updateObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getIntegrationCheckstatus();
          this.showSeekFormData = false;
          this.showTabData = false;
          this.saveStatus = false;
          this.isActiveClass = 'activatUsers';
          this.isActivatedUsers = true;
          this.getBroadbeanUsersAll(true,this.pageNo, this.pageSize, this.sortingValue);
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
       @When: 20-Sep-2022
      @Why: EWM-7472
      @What: FOR DIALOG BOX confirmation
    */
      disconnectPopUp(): void {  
        let DisconnectObj={};
        // DisconnectObj = this.oldPatchValues;

        DisconnectObj['RegistrationCode'] = this.RegistrationCode;
        const message = ``;
        const title = '';
        const subTitle = 'marketplace_broadbean';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
            this._systemSettingService.disconnectbroadBeanIntegration(DisconnectObj).subscribe(
              (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                  this.seekIntegrationForm.reset();
                  this.getIntegrationCheckstatus();
                  this.showSeekFormData = false;
                  this.showTabData = true;
                  this.saveStatus = false;
                  this.isActivatedUsers = false;
                  this.isActiveClass = null;
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
 @When: 20-Sep-2022
 @Why: EWM-7472
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
           if(this.visibilityStatus===true){
            //  this.getIntegrationById();
           this.getbroadbeantenantdetails()
             this.activestatus='Edit';
             this.visibilityStatus=true;
             this.saveStatus = false;
           }else{
            this.activestatus='Add';
            this.visibilityStatus=false;
           }
           }
             // @suika @EWM-13681 Whn 03-08-2023
           let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
           let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
           otherIntegrations[objIndex].Connected = this.visibilityStatus;
           localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
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
 @Who: maneesh
 @When: 20-Sep-2022
 @Why: EWM-7472
 @What: For Getting data By id
*/
getbroadbeantenantdetails() {
  this.loading = true;
  this._systemSettingService.getbroadbeantenantdetails(this.RegistrationCode).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
         this.seekIntegrationForm.patchValue({
          RegistrationCode: data.Data.ResgistrationCode,
          ClientId: data.Data.ClientId,
          ClientSecret: data.Data.ClientSecret,
          Id: data.Data.Id,
          IsUser: data.Data.IsUser,
          PlanType: data.Data.PlanType,
          PlanTypeName: data.Data.PlanType
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
     @When: 20-Sep-2022
     @Why: EWM-7472
     @What: For back to Integration page
   */
     backToJob() {
      this.route.navigate(['/client/core/administrators/integration-interface-board']);
    }

/* 
   @Type: File, <ts>
   @Name: onValidateSeekAdvertiseId function
   @Who: maneesh
   @When: 20-Sep-2022
   @Why: EWM-7472
   @What: For saving Validate seek advertise Id master data
  */
   onValidateSeekAdvertiseId(value:any,index) {
    let advertiseId=value.Advertisers[index].APIKey;
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
  @When: 20-Sep-2022
  @Why: EWM-7472
  @What: use for set value in patch.
*/
patch(AdvertisersMapping) {
  // const arr = <FormArray>this.seekIntegrationForm.get('Advertisers');
  // arr.clear();
  // const control = <FormArray>this.seekIntegrationForm.get('Advertisers');
  // AdvertisersMapping.forEach(x => {
  //   control.push(this.patchValues(x['APIKey'], x['OrganizationId'], x['APISecretKey']))
  // })
}
/*
  @Type: File, <ts>
  @Name: patchValues function
  @Who: maneesh
  @When: 20-Sep-2022
  @Why: EWM-7472
  @What: use for set value in patch for update data.
*/
patchValues(IsUser, Id,ClientId, ClientSecret) {
  return this.fb.group({
    // AdvertiserId: [AdvertiserId],
    ClientId: [ClientId],
    ClientSecret: [ClientSecret],
    Id:[Id],
    IsUser:[IsUser]
  })
  

}


deleteItem(index){
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

/*
  @Type: File, <ts>
  @Name: onPlanType function
  @Who: Adarsh singh
  @When: 30-Jan-2023
  @Why: EWM-10279 EWM-10329
  @What: for select plan Type
*/
onPlanType(data:any){
  if (data) {
    let planId = this.planTypeList?.filter((dl: any) => dl.Id == data);
    this.planName = planId[0].PlanType;
    this.seekIntegrationForm.patchValue({
      PlanTypeName:this.planName,
    })
  }else{
    this.seekIntegrationForm.patchValue({
      PlanTypeName:null,
      PlanType:null,
    })
  }
}

/*
  @Type: File, <ts>
  @Name: onActivatedUsers function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: for select active status
*/
onActivatedUsers(){
  this.getBroadbeanUsersAll(true,this.pageNo, this.pageSize, this.sortingValue)
  this.showSeekFormData = false;
  this.showTabData = false;
  this.isActivatedUsers = true;
  this.isCreateMode = true;
}

/*
  @Type: File, <ts>
  @Name: showTooltip function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: showTooltip
*/
public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  if (element.nodeName === 'TD') {
    var attrr = element.getAttribute('ng-reflect-logical-col-index');
    if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
        this.tooltipDir.hide();
      }
      else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
        } else {
          this.tooltipDir.toggle(element);
        }
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }
  else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
    if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
      this.tooltipDir.hide();
    }
    else {
      this.tooltipDir.toggle(element);
    }
  }
  else {
    this.tooltipDir.hide();
  }
}

/*
  @Type: File, <ts>
  @Name: sortChange function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: sortChange
*/
public sortChange($event): void {
  this.sortDirection = $event[0].dir;
  if (this.sortDirection == null || this.sortDirection == undefined) {
    this.sortDirection = 'asc';
  } else {
    this.sortingValue = $event[0].field + ',' + this.sortDirection;
  }
  this.getBroadbeanUsersAll(true,this.pageNo, this.pageSize, this.sortingValue)
  }

/*
  @Type: File, <ts>
  @Name: sortChange function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: sortChange
*/
public pageChange(event: PageChangeEvent): void {
  this.loadingscroll = true;
  if (this.totalDataCount > this.gridViewList.length) {
    this.pagneNo = this.pagneNo + 1;
    this.getBroadbeanUsersAll(false,this.pageNo, this.pageSize, this.sortingValue);
  } else {
    this.loadingscroll = false;
  }
}
/*
  @Type: File, <ts>
  @Name: onAddActivatedUsersPopUp function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: for open add popup
*/
onAddActivatedUsersPopUp(): void {  
  const dialogRef = this.dialog.open(AddBroadbeanActivateUsersComponent, {
    panelClass: ['xeople-modal','AddBroadbeanActivateUsers', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    data:{userList:this.activatedUsersgridViewList}
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.getBroadbeanUsersAll(true,this.pageNo, this.pageSize, this.sortingValue)
    }
  });
}

/*
  @Type: File, <ts>
  @Name: getBroadbeanUsersAll function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: get all lists
*/
isAccessEnabled:any;
getBroadbeanUsersAll(isLoader:boolean, pageNo, pageSize, sortingValue) {
  isLoader ? this.loading = true : this.loading = false;
  this._systemSettingService.getBroadbeanUsersAll(this.RegistrationCode, pageNo,pageSize,sortingValue).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.activatedUsersgridViewList = repsonsedata.Data;
        this.isAccessEnabled = this.activatedUsersgridViewList?.filter((data:any)=>data.IsAccess == 1);
        this.loading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
/*
  @Type: File, <ts>
  @Name: toggleVisibility function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: for enable disable access button
*/
  toggleVisibility(checked: any, data) {
    let isAccess = checked.checked ? 1 : 0;
    let Obj = {}
    Obj['Id'] = data.Id;
    Obj['UserId'] = data.UserId;
    Obj['EmailId'] = data?.EmailId;
    Obj['IsAccess'] = isAccess;
    Obj['BroadbeanUserId'] = data.BroadbeanUserId;
    Obj['BroadbeanRegistrationCode'] = data.BroadbeanRegistrationCode;
    Obj['UserName'] = data?.UserName;

    // this.loading = true;
    this._systemSettingService.broadbeanAddUser(Obj).subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.getBroadbeanUsersAll(false,this.pageNo, this.pageSize, this.sortingValue);

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

/*
  @Type: File, <ts>
  @Name: getPlanType function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: get plan type all
*/
  getPlanType() {
    this._systemSettingService.getPlanTypeAll().subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.planTypeList = data.Data;
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

/*
  @Type: File, <ts>
  @Name: onDeleteBroadbean function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: for deleting record
*/
  onDeleteBroadbean(userId:any){
    this.loading=true;
    this._systemSettingService.deleteBroadbeanUsers(userId).subscribe(
      (repsonsedata:any)=>{     
        this.loading=false;
        if(repsonsedata.HttpStatusCode==200){
          this.getBroadbeanUsersAll(true,this.pageNo, this.pageSize, this.sortingValue)
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        }else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading=false;
        }
      },err=>{
        this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
      })
  }
/*
  @Type: File, <ts>
  @Name: onDeleteBroadbeanUsersById function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: for open cinfirmation modal
*/
  onDeleteBroadbeanUsersById(userId): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_qualification';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.onDeleteBroadbean(userId);
      }
    });
  }
/*
  @Type: File, <ts>
  @Name: selectedHighLight function
  @Who: Adarsh singh
  @When: 31-Jan-2023
  @Why: EWM-10279 EWM-10330
  @What: active class add remove while clicking on button
*/
  selectedHighLight(value:any){
    this.isActiveClass = value;
  }
/*
    @Type: File, <ts>
    @Name: checkBroadbeanUserIdAlreadyInUse function
    @Who: Adarsh singh
    @When: 14-feb-2023
    @Why: EWM-10280 EWM-10428
    @What: for checking broadbean id is already in use or not  while clicking on toggle button
*/
  checkBroadbeanUserIdAlreadyInUse(checked: MatSlideToggleChange, data: any) {
    let checkSameUserId = this.isAccessEnabled?.filter((e: any) => (e.BroadbeanUserId == data.BroadbeanUserId) && (e.IsAccess == 1));
    if (checkSameUserId.length > 0 && checked.checked) {
      checked.source.checked = false;
      this.openWarningDialog('userIdAlreadyUsed','label_alert');
      // this.snackBService.showErrorSnackBar('User Id Already in use', '');
    } else {
      this.toggleVisibility(checked, data);
    }
  }

  
  /* 
  @Type: File, <ts>
  @Name: openWarningDialog function
  @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
  @What: on clicking next ADD SECTION
*/
openWarningDialog(label_SubtitleWeightage,label_TitleWeightage){
  const message = label_SubtitleWeightage;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if(res==true){

    }
  })
}

  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Adarsh singh
  @When: 21-Feb-2023
  @Why: EWM-1732 EWM-5338
  @What: To add data on page scroll.
  */
 onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.gridViewList.length) {
      this.pageNo = this.pageNo + 1;
      this.getBroadbeanUsersAll(false,this.pageNo, this.pageSize, this.sortingValue);
    } else {
      this.loadingscroll = false;
    }
  } else {
    this.loadingscroll = false;
    this.pendingLoad = true;
  }
}

 
}



