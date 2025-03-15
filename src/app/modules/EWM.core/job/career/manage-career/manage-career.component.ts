import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ResponceData } from 'src/app/shared/models'; 
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
import { UserAdministrationService } from '../../../shared/services/user-administration/user-administration.service';
import { ExperienceMaster } from '../../../shared/datamodels/experience';
import {  ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { customDropdownConfig } from '../../../shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';

@Component({
  selector: 'app-manage-career',
  templateUrl: './manage-career.component.html',
  styleUrls: ['./manage-career.component.scss']
})
export class ManageCareerComponent implements OnInit {
careerPageForm: FormGroup;
SubDomainName: string;
domainNames: string;
loading: boolean;
public statusList: any = [];
activestatus: string='Add';
submitted = false;
public gridView: any = [];
loadingscroll = false;
public pageNo: number = 1;
public pageSize;
public sortingValue: string = "Brand,asc";
public searchVal: string = '';
public idBrands = '';
public idName = 'Id';
public specialcharPattern = "^[A-Za-z0-9_]+$";

listId:any;
listData;
public dropDownBrandConfig: customDropdownConfig[] = [];
public selectedBrand: any = {};
public selectedSubCategory: any = {};
isClicked=false;
baseUrl:any;
actionStatus = 'create';
oldPatchValues;
isBtnDisabled = false;

  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, 
    private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
     public dialog: MatDialog, private appSettingsService: AppSettingsService, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService,
    private _userAdministrationService: UserAdministrationService,public dialogRef: MatDialogRef<ManageCareerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private serviceListClass: ServiceListClass,) {
      // page option from config file
     this.pageNo = this.appSettingsService.pageOption;
     // page option from config file
     this.pageSize=this.appSettingsService.pagesize;
      this.careerPageForm = this.fb.group({
        Id: [''],
        BrandName: [''],
        Created: [''],
        BrandId: ['',[]],
        IsDefault: [''],
        CareerSiteType: [''],
        CareerPageName: ['', [Validators.required, Validators.maxLength(50)] ],
        CareerSiteName: ['',  [Validators.required, Validators.maxLength(50), Validators.pattern(this.specialcharPattern)]],
      });

      this.dropDownBrandConfig['IsDisabled'] = false;
      this.dropDownBrandConfig['apiEndPoint'] = this.serviceListClass.getBrandAllList;
      this.dropDownBrandConfig['placeholder'] = 'label_Brand';
      this.dropDownBrandConfig['IsManage'] = '/client/core/administrators/brands';
      this.dropDownBrandConfig['IsRequired'] = false;
      this.dropDownBrandConfig['searchEnable'] = true;
      this.dropDownBrandConfig['bindLabel'] = 'Brand';
      this.dropDownBrandConfig['multiple'] = false;

 

  }

  ngOnInit(): void {
    this.getBrandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idBrands);
        this.routes.queryParams.subscribe(
          params => {
            if ((this.routes.snapshot.queryParams.Id != null)) {
              this.actionStatus = 'update'
              this.listId = params['Id'];
              this.getByIdData(this.listId);
            }
          });
      this.baseUrl = window.location.host;
  }

   /*
    @Type: File, <ts>
    @Name: on confirm save and update
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What: For  save and Update
    */
   onConfirm(value){
    this.submitted = true;
    if (this.careerPageForm.invalid) {
      return;
    }
    
    // this.route.navigate(['./client/core/job/career/nike-career']);
    // setTimeout(() => { this.dialogRef.close(false); }, 200);
    this.isClicked = true;
    this.checkDuplicacy(true);
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
@Name: checkDuplicacy function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
@What: This function is used for checking duplicacy for role Name
*/
public checkDuplicacy(isBlurNotBlur){
  let value = this.careerPageForm.value;
  let id;
  if ((this.routes.snapshot.queryParams.Id != null)) {
      id = this.listId
  }else{
    id = 0
  }
  
let brndId;
  if (value.BrandId == undefined || value.BrandId == null || value.BrandId == '') {
     brndId = null;
  }else{
    brndId = value.BrandId
  }
  let duplicacyExpertiesObj = {};
  duplicacyExpertiesObj['Id'] = parseInt(id);
  duplicacyExpertiesObj['Value'] = value.CareerPageName;
  // duplicacyExpertiesObj['BrandId'] = brndId;
  
  if(this.careerPageForm.get("CareerPageName").value){
    this.jobService.checkCareerPageDuplicacy(duplicacyExpertiesObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
              this.careerPageForm.get("CareerPageName").setErrors({ codeTaken: true });
             this.careerPageForm.get("CareerPageName").markAsDirty();
             this.careerPageForm.get('CareerPageName').setValidators([Validators.required,, Validators.maxLength(50)]);

            this.loading = false;
            this.isBtnDisabled  = true;

            if (isBlurNotBlur == true) {
              if (this.isClicked == true) {
                if (data.Message == "400035") {
                  this.openWarningDialog('400035','label_alert');
                  this.careerPageForm.get("CareerPageName").setErrors({ codeTaken: false });
                 this.careerPageForm.get("CareerPageName").markAsDirty();
                 this.careerPageForm.get('CareerPageName').setValidators([Validators.required, Validators.maxLength(50)]);

                 this.isBtnDisabled  = true;
                }
              }
            }
          }
        }
        else if (data.HttpStatusCode == 204) {
          this.loading = false;
          this.isBtnDisabled  =false;
          if (this.isClicked == true) {
            // this.route.navigate(['./client/core/job/career/nike-career']);
            this.jobService.manageCareerPageFormData.next(value);
            // setTimeout(() => { this.dialogRef.close(false); }, 200);
            // let Id = this.listId 
            // if (this.data.Id != null || this.data.Id != '') {
            //   this.route.navigate(['./client/core/job/career/nike-career'], {queryParams: {Id}});
            // }
            if (this.careerPageForm && this.submitted == true) {
              if (this.routes.snapshot.queryParams.Id == null) {
                this.addCareerForm(this.careerPageForm.value);
              } else {
                this.editCareerForm(this.careerPageForm.value);
              }
            }
          }

          if (data.Data == true) {
            // this.careerPageForm.get("Name").clearValidators();
            this.careerPageForm.get("CareerPageName").markAsPristine();
            this.careerPageForm.get('CareerPageName').setValidators([Validators.required,, Validators.maxLength(50)]);

          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
    err=>{
      this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
  });
  }else
  {
    this.careerPageForm.get('CareerPageName').setValidators([Validators.required]);
 
  }
  this.careerPageForm.get('CareerPageName').updateValueAndValidity();
  this.checkDuplicacyBrand(false);
}

/*
@Type: File, <ts>
@Name: checkDuplicacy function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
@What: This function is used for checking duplicacy for role Name
*/
isDisabled;

public checkDuplicacyBrand(isBlurNotBlur){
  let value = this.careerPageForm.value;
  let id;
  if ((this.routes.snapshot.queryParams.Id != null)) {
      id = this.listId
  }else{
    id = 0
  }
  
let brndId;
  if (value.BrandId == undefined || value.BrandId == null || value.BrandId == '') {
     brndId = null;
  }else{
    brndId = value.BrandId
  }
  let duplicacyExpertiesObj = {};
  duplicacyExpertiesObj['Id'] = parseInt(id);
  duplicacyExpertiesObj['Value'] = value.CareerPageName;
  duplicacyExpertiesObj['BrandId'] = brndId;
  
    this.jobService.checkCareerPageDuplicacy(duplicacyExpertiesObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.isDisabled  = true;
            this.loading = false;
              if (data.Message == "400035") {
                this.openWarningDialog('400035','label_alert');
              }
          }
        }
        else if (data.HttpStatusCode == 204) {
          this.loading = false;
          this.isBtnDisabled  =false;
          this.isDisabled  = false;
          if (this.isClicked == true) {
            this.jobService.manageCareerPageFormData.next(value);
          }

          if (data.Data == true) {
            //this.addCareerPageNameForm.get("Name").clearValidators();
            // this.careerPageForm.get("CareerPageName").markAsPristine();
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
    err=>{
      this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
  });

}


addCareerForm(value){
  let Obj = {}
  
  let brndId;
    if (value.BrandId == '') {
       brndId = null;
    }else{
      brndId = value.BrandId
    }

  Obj['BrandId'] = brndId;
  Obj['CareerPageName'] = value.CareerPageName;
  Obj['CareerSiteName']  = value.CareerSiteName;
  Obj['CareerSiteType']  = 1;

  this.loading=true;

      this.jobService.createCareerPage(Obj).subscribe(
        repsonsedata=>{     
          this.loading=false;
          if(repsonsedata.HttpStatusCode==200){
            let Id = repsonsedata.Data.Id;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            setTimeout(() => { this.dialogRef.close(false); }, 200);
            this.route.navigate(['./client/core/job/career/nike-career'], {queryParams: {Id}});
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
  @Name: editCareerForm function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
  @What: service call for update  Career page
  */
 editCareerForm(value){
     let fromObj = {};
     fromObj = this.oldPatchValues;

     let brndId;
    if (value.BrandId == '') {
       brndId = null;
    }else{
      brndId = value.BrandId
    }
     let Obj = {}
     Obj['Id'] = this.oldPatchValues.Id;
     Obj['BrandName'] = this.oldPatchValues.BrandName;
     Obj['Created'] = this.oldPatchValues.Created;
     Obj['IsDefault'] = this.oldPatchValues.IsDefault;
     Obj['SocialProfiles'] = this.oldPatchValues.SocialProfiles;
     Obj['CareerPageName'] = value.CareerPageName;
     Obj['CareerSiteName'] = value.CareerSiteName;
     Obj['BrandId'] = brndId;
     Obj['CareerSiteType'] = value.CareerSiteType;

     let addObj = {};
     addObj = {
       "From": fromObj,
       "To": Obj
     };
     this.loading=true;
     this.jobService.updateCareerPage(addObj).subscribe(
       repsonsedata=>{     
         this.loading=false;
         let Id =  this.listId
         if(repsonsedata.HttpStatusCode==200){
           this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
           setTimeout(() => { this.dialogRef.close(false); }, 200);
           this.route.navigate(['./client/core/job/career/nike-career'], {queryParams: {Id}});

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
@Name: getExperienceList function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
@What: For showing the list of Brand
*/


getBrandList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience) {
  this.loading = true;
  this.systemSettingService.getBrandAllList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience).subscribe(
    (repsonsedata: ExperienceMaster) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loading = false;
        this.gridView = repsonsedata.Data;
        // this.reloadListData();
        // this.doNext();
      } else {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loadingscroll = false;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

getByIdData(Id){
  this.loading=true;
  this.jobService.getByIdCareerPage(Id).subscribe(
    repsonsedata=>{     
      if(repsonsedata['HttpStatusCode']=='200'){
        this.loading=false;
        this.listData=repsonsedata['Data'];
        this.oldPatchValues = repsonsedata['Data']
        this.careerPageForm.patchValue({
        CareerPageName:this.listData.CareerPageName,
        CareerSiteName:this.listData.CareerSiteName,
        BrandId:this.listData.BrandId,
        })
      this.selectedBrand = {Id:this.listData.BrandId}
       
      }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    },err=>{
       this.loading=false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
 }

  /* 
 @Type: File, <ts>
 @Name: onBrandchange function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
 @What: get brand List
 */
onBrandchange(data) {
  this.selectedSubCategory = null;
  if (data == null || data == "") {
    this.selectedBrand = null;
    this.careerPageForm.patchValue(
      {
        BrandId: null,
      }
    )
    
    // this.careerPageForm.get("BrandId").setErrors({ required: true });
    // this.careerPageForm.get("BrandId").markAsTouched();
    // this.careerPageForm.get("BrandId").markAsDirty();
  }
  else {
    // this.careerPageForm.get("BrandId").clearValidators();
    // this.careerPageForm.get("BrandId").markAsPristine();
    this.selectedBrand = data;
    this.careerPageForm.patchValue(
      {
        BrandId: data.Id,
      }
    )
  }
    this.checkDuplicacy(true)
}
  /*
  @Type: File, <ts>
  @Name: onDismissEdit
  @Who: Adarsh Singh
  @When: 12-jan-2021
  @Why: 4052 EWM-4489
  @What: To close Quick Company Modal for edit
  */
 onDismiss(): void {
  document.getElementsByClassName("careerPage")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("careerPage")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
  this.route.navigate([], {
    queryParams: {
      'Id': null,
    },
    queryParamsHandling: 'merge'
  })
}

 

}
