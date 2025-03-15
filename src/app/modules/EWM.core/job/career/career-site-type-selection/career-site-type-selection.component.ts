import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FormBuilder} from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
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
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
 

@Component({
  selector: 'app-career-site-type-selection',
  templateUrl: './career-site-type-selection.component.html',
  styleUrls: ['./career-site-type-selection.component.scss']
})
export class CareerSiteTypeSelectionComponent implements OnInit {
  @Output() consentReqPageTemp = new EventEmitter();
  loading= false;
  manageCareerFormData: string;
  oldPatchValues;
  careerId:any;
  listData;
  pageOption: any;
  public pageSize;
  public sortingValue: string = "CareerPageName,asc";
  public searchVal: string = '';


  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
     public dialog: MatDialog, private appSettingsService: AppSettingsService, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService,
     ) {
 // page option from config file
 this.pageOption = this.appSettingsService.pageOption;
 // page option from config file
 this.pageSize=this.appSettingsService.pagesize;
  }

  ngOnInit(): void {
      this.jobService.manageCareerPageFormData.subscribe(msg => {
        this.manageCareerFormData = msg;
      });

      this.routes.queryParams.subscribe(
        params => {
          if ((this.routes.snapshot.queryParams.Id != null)) {
            this.careerId = params['Id'];
            
            this.getByIdData(this.careerId );
          }
        });
  }

  careerType = 1;
  isCareerSelection(data,selecttype){
     if (data.isTrusted == true) {
       if (selecttype == 'Advance & Customized') {
         this.careerType = 1;
       }
       else if (selecttype == 'Job Listing') {
        this.careerType = 2;
      }else{
        this.careerType = 1;
      }
     }
    
  }

  onConfirm(){
    if (this.manageCareerFormData != null || this.manageCareerFormData != '') {
      this.editCareerForm(this.manageCareerFormData);
    } 
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
  Obj['CareerSiteType']  = this.careerType;

  this.loading=true;

      this.jobService.createCareerPage(Obj).subscribe(
        repsonsedata=>{     
          this.loading=false;
          if(repsonsedata.HttpStatusCode==200){
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.consentReqPageTemp.emit(true);
           this.getCareerPage(this.pageSize, this.pageOption, this.sortingValue, this.searchVal); 
            
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
     Obj['CareerSiteType'] = this.careerType;

     let addObj = {};
     addObj = {
       "From": fromObj,
       "To": Obj
     };
     this.loading=true;
     this.jobService.updateCareerPage(addObj).subscribe(
       repsonsedata=>{     
         this.loading=false;
         if(repsonsedata.HttpStatusCode==200){
           this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.consentReqPageTemp.emit(true);
            this.getByIdData(this.careerId );
         }else{
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
           this.loading=false;
         }
       },err=>{
        this.loading=false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
  }

  getByIdData(Id){
    //console.log(Id);
    this.loading=true;
    this.jobService.getByIdCareerPage(Id).subscribe(
      repsonsedata=>{     
        if(repsonsedata['HttpStatusCode']=='200'){
          this.loading=false;
          this.oldPatchValues=repsonsedata['Data'];
          this.careerType = repsonsedata['Data'].CareerSiteType;
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
  @Name: getCareerPage function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
  @What: service call for get data
  */
 getCareerPage(pageSize, pageNo, sortingValue, searchVal){
  this.loading=true;
  this.jobService.getCareerPageAll(pageSize, pageNo, sortingValue, searchVal).subscribe(
    repsonsedata=>{     
      if(repsonsedata['HttpStatusCode']=='200'){
        this.loading=false;
        this.listData=repsonsedata['Data'];
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
@Name: onDismiss
@Who: Anup Singh
@When: 14-Feb-2022
@Why: EWM-4672 EWM-5191
@What: for close drawer
*/
onDismiss() {
  this.consentReqPageTemp.emit(true);
}

}
