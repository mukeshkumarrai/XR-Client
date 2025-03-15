/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: upload-docs.component.ts
 @Who: Renu
 @When: 03-June-2022
 @Why: ROST-6558 EWM-6782
 @What: upload docs component
 */

import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Actions } from '../interface/actions';
import { documentInfo, knockOutInfo, personalInfo } from '../interface/applicationInfo';
import { ActionserviceService } from '../shared/actionservice.service';
import { PreviewSaveService } from '../shared/preview-save.service';
import { DocumentPopupComponent } from './document-popup/document-popup.component';

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent implements OnInit {
  public uploadDocsForm: FormGroup;
  applicationFormId: number;
  loadingscroll = false;
  public ascIcon: string;
  public descIcon: string;
  public canLoad = false;
  public pendingLoad = false;
  public totalDataCount: any;
  public loadingSearch: boolean;
  public pageNo: number = 1;
  public sortingValue: string = "DocumentName,asc";
  public sortedcolumnName: string = 'DocumentName';
  public sortDirection = 'asc';
  public searchVal: string = '';
  public loading: boolean;
  public animationVar: any;
  public animationState = false;
  public pageOption: any;
  public pageSize;
  public gridViewList: any = [];
  @Input() totalStepsCount:number;
  currentStep: any;
  submitActive: boolean;
  applicationParam: string;
  documentTypeOptions: any;
  iconFileType: any;
  filestatus:any[]=[];
  setActionRunnerFn: any;
  private actions: Actions;
  documentsData: documentInfo;
  personalInfo: personalInfo;
  knockoutInfo: knockOutInfo;
  JobId: any;
  applicationId: any;
  autoFill: any;
  @Output() stepperNext= new EventEmitter<any>();
  JobTittle: any;
  mode: any;
  @Input() ApplicationFormId:any;
  knockoutStatus: knockOutInfo;
  orgName: any;
  candidateId: any;
  @Input() lableTitleName: string;
  constructor(private snackBService: SnackBarService, private jobService: JobService,private translateService: TranslateService,
    private routes: ActivatedRoute,private fb: FormBuilder, private appSettingsService: AppSettingsService,
    public dialog: MatDialog,private commonService: CommonserviceService,private http: HttpClient,private router:Router,
    private actionsService:ActionserviceService,private  previewSaveService:PreviewSaveService) { 
        // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this.appSettingsService.pagesize;
    this.uploadDocsForm = this.fb.group({
      docsInfo: this.fb.array([])
    });
    this.actions = this.actionsService.constants;
  }

  ngOnInit(): void {
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     })
    this.commonService.onstepperInfoChange.subscribe(res=>{
      this.currentStep=res+1;
      if(this.totalStepsCount==this.currentStep){
        this.submitActive=true;
      }else{
        this.submitActive = false;
      }
    })
   
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId=parms?.applicationId;
        this.applicationParam='?applicationId='+parms?.applicationId;
      }else  if (parms?.jobId){
        this.JobId=parms?.jobId;
        this.applicationParam='?jobId='+parms?.jobId;
      
      }    
      if(parms?.mode){
        this.mode=parms?.mode;
      }
    });
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.getFormDocumentAll(this.applicationParam, this.pageNo, this.pageSize, this.sortingValue, this.searchVal,true);
 
    this.previewSaveService.personalInfoChange.subscribe((data: personalInfo) => {
      this.personalInfo=data;
    });

    this.previewSaveService.onknockOutInfoChange.subscribe((data: knockOutInfo) => {
      this.knockoutInfo=data;
    });

    this.previewSaveService.onIsAutoFillInfoChange.subscribe((res:any)=>{
      this.autoFill=res;
    });

    this.previewSaveService.onJobInfoChange.subscribe((res:any)=>{
      this.JobTittle=res;
    });
    this.previewSaveService.konckoutStatusChange.subscribe((data: knockOutInfo) => {
      this.knockoutStatus=data;
    });
  }
/*
   @Type: File, <ts>
   @Name: onScrollDown
   @Who: Renu
   @When: 03-June-2022
   @Why:  ROST-6558 EWM-6782
   @What: for getting themore data based on pagination
   */
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchMoreRecord(this.applicationParam, this.pageNo, this.pageSize, this.sortingValue, this.searchVal,true);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  /*
   @Type: File, <ts>
   @Name: fetchMoreRecord
   @Who: Renu
   @When: 03-June-2022
   @Why:  ROST-6558 EWM-6782
   @What: for getting themore data based on pagination
   */
  fetchMoreRecord(Id: any, pageSize: number, pageNo: any, sortingValue: string, searchVal: string, isLoader: boolean){
    if (isLoader == true) {
      this.loading = true;
    }else{
      this.loading = false;
    }
   
    this.jobService.getFormDocumentAllPage(Id, pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          let nextgridView: any = [];
          repsonsedata.Data.forEach(element => {
            if (element.Qualifications?.length > 0 || element.Skills?.length > 0) {
              nextgridView = repsonsedata.Data.filter(x=>x['IsHidden']===1 && (x['IsJobQualificationMapped']===1 || x['IsJobSkillMapped']===1));
            }
          });
         let data = repsonsedata.Data.filter(x=>x['Qualifications'].length===0 && x['Skills'].length===0 );
          data = data.filter(x=>x['IsHidden']===1);
          nextgridView = nextgridView.concat(data)
          let uniqueChars = [...new Set(nextgridView)];
          nextgridView =  uniqueChars;

        this.gridViewList = this.gridViewList.concat(nextgridView);
          this.totalDataCount = repsonsedata.TotalRecord;
        
            const control=<FormArray>this.uploadDocsForm.controls['docsInfo'];
            control.clear();
            if( this.gridViewList.length>0){
              this.gridViewList.forEach((x,i) => {
                this.filestatus[i]=true;
              control.push(
                 this.fb.group({      
                  FileName: [],
                  IsMandatory:[x.IsMandatory],
                  DocumentId: [x.DocumentId],
                  DocumentName:[x.DocumentName],
                  CategoryId:[x.DocumentCategoryId],
                  CategoryName:[x.DocumentCategory],
                  ReferenceId:[],
                  StartDate:[],
                  EndDate:[],
                  UploadDocument:[],
                  Comment:[],
                  iconFileType:[],
                  IsJobQualificationMapped:[x.IsJobQualificationMapped],
                  IsJobSkillMapped:[x.IsJobSkillMapped]
                 })
               );
               let groupItems:any = this.docsInfo().controls[i].get('FileName');
               if(x.IsMandatory===1){
                groupItems.setValidators([Validators.required]);
                groupItems.updateValueAndValidity();
               }else{
                groupItems.clearValidators();
                groupItems.updateValueAndValidity();
               }
             });
            }
        
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: docsInfo
   @Who: Renu
   @When: 03-June-2022
   @Why:  ROST-6558 EWM-6782
   @What: for getting the formarray with this instance
   */
   docsInfo() : FormArray {
    return this.uploadDocsForm.get("docsInfo") as FormArray
  }
  /*
@Type: File, <ts>
@Name: getFormDocumentAll function
@Who: RENU
@When: 03-June-2022
@Why:  ROST-6558 EWM-6782
@What: For showing the list of Document data
*/
getFormDocumentAll(Id: any, pageSize: number, pageNo: any, sortingValue: string, searchVal: string, isLoader: boolean) {
  
  if (isLoader == true) {
    this.loading = true;
  }else{
    this.loading = false;
  }
 
  this.jobService.getFormDocumentAllPage(Id, pageSize, pageNo, sortingValue, searchVal).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.animate();
        this.loading = false;
        this.loadingSearch = false;
        this.loadingscroll = false;
        let nextgridView: any = [];
          repsonsedata.Data.forEach(element => {
            if (element.Qualifications?.length > 0 || element.Skills?.length > 0) {
              nextgridView = repsonsedata.Data.filter(x=>x['IsHidden']===1 && (x['IsJobQualificationMapped']===1 || x['IsJobSkillMapped']===1));
            }
          });
         let data = repsonsedata.Data.filter(x=>x['Qualifications'].length===0 && x['Skills'].length===0 );
          data = data.filter(x=>x['IsHidden']===1);
          nextgridView = nextgridView.concat(data)
          let uniqueChars = [...new Set(nextgridView)];
          nextgridView =  uniqueChars;

        this.gridViewList = this.gridViewList.concat(nextgridView);
        this.totalDataCount = repsonsedata.TotalRecord;
      
          const control=<FormArray>this.uploadDocsForm.controls['docsInfo'];
          control.clear();
          if( nextgridView.length>0){
            nextgridView.forEach((x,i) => {
              this.filestatus[i]=true;
            control.push(
               this.fb.group({      
                FileName: [],
                IsMandatory:[x.IsMandatory],
                DocumentId: [x.DocumentId],
                DocumentName:[x.DocumentName],
                CategoryId:[],
                CategoryName:[x.DocumentCategory],
                ReferenceId:[],
                StartDate:[],
                EndDate:[],
                UploadDocument:[],
                Comment:[],
                iconFileType:[],
                IsJobQualificationMapped:[x.IsJobQualificationMapped],
                IsJobSkillMapped:[x.IsJobSkillMapped]
               })
             );
             let groupItems:any = this.docsInfo().controls[i].get('FileName');
             if(x.IsMandatory===1){
              groupItems.setValidators([Validators.required]);
              groupItems.updateValueAndValidity();
             }else{
              groupItems.clearValidators();
              groupItems.updateValueAndValidity();
             }
           });
          }
      
      } else {
        this.loading = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      this.loading = false;
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Renu
     @When: 03-June-2022
     @Why: EWM-6558 EWM-6782
     @What: on save pop-up button file
   */

     onConfirm(): void {
      if(this.mode=='apply'){
      if (this.uploadDocsForm.invalid) {
        return;
      }  
      this.saveDocsInfo();
    }else{
      this.stepperNext.emit(true);
    }
      
    }
  /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: Amit Rajput
  @When: 19-Jan-2022
  @Why: EWM-4368 EWM-4526
  @What: creating animation
*/
animate() {
  this.animationState = false;
  setTimeout(() => {
    this.animationState = true;
  }, 0);
}
delaAnimation(i: number) {
  if (i <= 25) {
    return 0 + i * 80;
  }
  else {
    return 0;
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
 @Name: saveDocsInfo
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for saving documeent  data on service
 */

 saveDocsInfo(){

  this.previewSaveService.setActionRunnerFn(this.actions.DOCUMENT_INFO, this.uploadDocsForm.value.docsInfo.filter(x=>x['IsMandatory']==1 || x['UploadDocument']!==null));
  this.stepperNext.emit(true);
}

/*
 @Type: File, <ts>
 @Name: OpenDocuemntPopUp
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for OpenDocuemntPopUp documeent  pop up
 */
OpenDocuemntPopUp(DocId:any,index:number)
{

   const dialogRef = this.dialog.open(DocumentPopupComponent, {
     data:{docRequiredStatus:true,openDocumentPopUpFor:'Candidate','documentData':this.gridViewList.filter(x=>x['DocumentId']==DocId)[0]},
     panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     let res=dialogResult.value;
    const list = res?.FileName.split('.');
    const fileType = list[list.length - 1];
    let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
    this.iconFileType= FileTypeJson[0]? FileTypeJson[0].logo:'';
      this.docsInfo().at(index).patchValue({
        FileName: res.Name,
        CategoryId:res.CategoryId,
        CategoryName:res.Category,
        ReferenceId:res.ReferenceId,
        StartDate:res.StartDate,
        EndDate:res.ExpiryDate,
        UploadDocument:res.UploadDocument,
        iconFileType:this.iconFileType,
        Comment:res.Comment,
        FileSize:res.FileSize
      });
      this.filestatus[index] = false;
   });
}
/*
 @Type: File, <ts>
 @Name: removeImage
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for remove document uploaded data
 */
  removeImage(index) {
    this.docsInfo().at(index).get('UploadDocument').reset();
    this.docsInfo().at(index).get('iconFileType').reset();
    this.docsInfo().at(index).get('FileName').reset();
     this.filestatus[index] = true;
    // this.informDocumentParent.emit({FilePathOnServer:'', SizeOfFile:'',UploadFileName:''});
  }

/*
 @Type: File, <ts>
 @Name: saveApplicationInfo
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for saving application overall  data
*/
saveApplicationInfo(){
  if(this.mode=='apply'){
 this.loading=true;
  this.previewSaveService.ondocumentInfoChange.subscribe((data: documentInfo) => {
    if(data){
      this.loading=false;
      this.documentsData = data;
    }else{
     
      let obj={};
      obj['KnockoutQuestions']=this.knockoutInfo;
      obj['PersonalInfo']=this.personalInfo;
      obj['ApplicationFormId']=this.applicationId?this.applicationId:this.ApplicationFormId;
      obj['JobId']=this.JobId?this.JobId:'';
      obj['JobTitle']=this.JobTittle?this.JobTittle:'';
      obj['Documents']=this.uploadDocsForm.value.docsInfo.filter(x=>x['IsMandatory']==1 || x['UploadDocument']!==null);
      obj['IsAutoFill']=this.autoFill;
      obj['IsKnockoutSuccess']=this.knockoutStatus?Number(this.knockoutStatus):1;
      obj['CandidateId']=this.candidateId;
      
      this.jobService.saveApplicationPreview(obj).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200){
            this.loading=false;
            this.orgName=repsonsedata.Data.OrgName;
            this.previewSaveService.orgName.next(this.orgName);
            this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
          }else{
            this.loading=false;
          }
        }, err => {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  });
}else{
  this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
}
}

}
