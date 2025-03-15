import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-job-indeed-published',
  templateUrl: './job-indeed-published.component.html',
  styleUrls: ['./job-indeed-published.component.scss']
})
export class JobIndeedPublishedComponent implements OnInit {

  
  public loading: boolean = false;
  addForm: FormGroup;
  public divStatus: boolean = false;
  public loadingSearch: boolean;
  public loadingSearchS:boolean;

  currency:string = '';
  city:string = '';
  country:string ='';
  province:string='';

  public divLoopStatus:number=1;
  searchVal;
  step = 0;

  jobPublishArray = {};
  jobId: any;
  jobRefId: any;
  brandingId: any;
  JobCount: any;
  LastJobPostdate: any;
  public userpreferences: Userpreferences;
  @Input() selectedIndexId:any;
  selected = -1;
  result: string = '';
  workflowId: any;
  jobDataById: any={};
  JobTitle: any;
  Location: any;
  JobDescription: any;
  public divStatusJobDetails: boolean = false;
  jobDetailsById: string;
  filledCount: number = 0;
  radiofilledCount: number = 0;
  totalfilledCount: number = 0;
  @ViewChildren('textboxes') textboxes: QueryList<ElementRef>;
  filledCount1: number;
  jobTitle: any;
  totalFilledPercentage: number=0;
  DescriptionValue: any = ` `;
  dateStart = new Date();
  minDate: Date;
  maxDate: Date;
  applicationFormName: string;
  DateExpiryJob: Date;
  currentDateStart: Date;
  DateExpiryJobStatus: boolean=false;

  logoURL:string;
  shareJobApplicationUrl: string;
  experienceName: string;
  categoryList: any=[];
  experienceList: any=[];
  educationList: any=[];
  tabIndexStatus: any;
  applicationFormId: any;
  remoteTypeValue: boolean;
  indeedRagistrationCode: string;
  selectedIndex: number=1;
  ProfileId: any;
  JobPostedUri: any;
  indeedId: number;
  PostingIndeedDetailsObs: any;
  
  constructor(private fb: FormBuilder,private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService,private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,private route: ActivatedRoute,public dialogObj: MatDialog,private commonserviceService: CommonserviceService,private _appSetting: AppSettingsService, private jobService: JobService) { 
    this.indeedRagistrationCode = this._appSetting.indeedRagistrationCode;
    this.addForm = this.fb.group({
      clientName: [],
      clientHoldingName: [],
      emailIds: [],
      applicationFormNameValue: [],
      applicationURL:[],
      careerSiteURL:[''],
      jobTitle: [],
      category:[],
      categoryId:[],
      jobType: [],
      DateExpiry: [],
      curency: [],
      PayType: [],
      SalaryRangeMinimum:[],
      SalaryRangeMaximum:[],
      payLabelCheck:[],
      jobDetailsCheck:[],
      jobDescription:[],
      remoteJob:[],
      workplaceType:[],
      experience:[],
      education:[],
      Address1: [],
      Address2: [],
      address: this.fb.group({
        'AddressLinkToMap': [],
      }),
      Latitude :[],
      Longitude :[]
      
    }); 
    
  }

  ngOnInit(): void {
    this.currentDateStart=new Date(this.dateStart);
    //this.getIndeedJobPublishedDetailsById(this.jobId);
    this.route.params.subscribe(
      params => {
        if (params['jobId'] != undefined) {
          this.jobId = params['jobId'];
          this.workflowId = params['workId'];
          this.getPostingIndeedDetails();
          this.getIndeedJobPublishedDetailsById(this.jobId);
        }
      });
     
      this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
/*
     @Type: File, <ts>
     @Name: setStep
     @Who: Nitin Bhati
    @When: 19-Nov-2023
    @Why: EWM-14478
     @What: for step
  */
    setStep(index: number) {
      this.step = index;
    }
  /*
     @Type: File, <ts>
     @Name: nextStep
     @Who: Nitin Bhati
    @When: 19-Nov-2023
    @Why: EWM-14478
     @What: for next index tab
  */
    nextStep() {
      this.step++;
    }
  /*
     @Type: File, <ts>
     @Name: prevStep
     @Who: Nitin Bhati
    @When: 19-Nov-2023
    @Why: EWM-14478
     @What: for previous index tab
  */
    prevStep() {
      this.step--;
    }
 

/*
     @Type: File, <ts>
     @Name: onSave
     @Who: Nitin Bhati
     @When: 19-Nov-2023
    @Why: EWM-14478
     @What: for posting Indeed data 
  */
     openPopupForPostResponse(value: any): void {
      const message = ``;
      const title = value;
      const subtitle = 'label_publishJob';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__slow', 'animate__zoomIn'],
        disableClose: true,
      });
      this.loading = true;
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        if (dialogResult == true) {
          this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
        } else {
          this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
          this.loading = false;
        }
      });
    }
  /*
     @Type: File, <ts>
     @Name: oncancel
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: Redirect to job landing page
  */
    oncancel(){
      this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
    }

   


/* 
    @Type: File, <ts>
    @Name: tabIndex function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:for passing index value
   */
  tabIndex() {
  this.commonserviceService.onselectedIndexId.next(this.selectedIndex);
  this.router.navigate(['/client/jobs/job/job-publish-v1/publish',{jobId: this.jobId,jobRefId:this.jobRefId,workId:this.workflowId,pub:1,indeedId:this.indeedId,selectedName:'indeed'}])
  }
   /* 
    @Type: File, <ts>
    @Name: clickPublished function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:For open window seek published job URL
   */
  clickPublished(data){
    window.open(data);
  }
  /* 
    @Type: File, <ts>
    @Name: clickInformation function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:For open window for seek information
   */
  clickInformation(){
    window.open('https://talent.seek.com.au/support/productterms/');
  }


  

    /*
     @Type: File, <ts>
     @Name: expireJob
     @Who: Nitin Bhati
     @When: 28-Feb-2023
     @Why: EWM-10833
     @What: for expiry date
    */
     expireJob(): void {
      const message = `label_titleDialogSeekExpireJob`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      let postSeekJobExpire = {};
      postSeekJobExpire['ProfileId'] = this.ProfileId;
      postSeekJobExpire['JobId'] = this.jobId;
       this._SystemSettingService.postSeekJobExpire(postSeekJobExpire).subscribe(
         (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200) {
             this.loading = false;
             if (repsonsedata.Data) {
                this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
                this.router.navigate(['/client/jobs/job/job-list/list/',this.workflowId]);
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
      });
    }

    /*
   @Type: File, <ts>
   @Name: getJobDetailsByid function
   @Who: Nitin Bhati
   @When: 23-March-2022
   @Why: EWM-5397
   @What: For getting record by id
  */
   getIndeedJobPublishedDetailsById(jobId: any) {
    this.loading = true;
    this._SystemSettingService.getIndeedJobPublishedDetailsById('?JobID='+this.jobId).subscribe(
      (data: ResponceData) => {
        this.loading = true;
        if (data.HttpStatusCode === 200) {
          this.jobDataById = data.Data;
          this.addForm.disable();
          this.addForm.patchValue({
            clientName:this.jobDataById?.ClientName,
            clientHoldingName:this.jobDataById?.HoldingCompany,
            emailIds:this.jobDataById?.EmailID,
            applicationFormNameValue:this.jobDataById?.ApplicationFormName,
            careerSiteURL:this.jobDataById?.TrackingUrl,
            jobTitle:this.jobDataById?.JobTittle,
            AddressLinkToMap:this.jobDataById?.StreetAddress,
            category:this.jobDataById?.Category,
            jobType:this.jobDataById?.JobType,
            DateExpiry:new Date(this.jobDataById?.JobExpiryDate),
            curency:this.jobDataById?.Currency,
            PayType:this.jobDataById?.PayType,
            SalaryRangeMinimum:this.jobDataById?.SalaryMin=='0'?'':this.jobDataById?.SalaryMin,
            SalaryRangeMaximum:this.jobDataById?.SalaryMax=='0'?'':this.jobDataById?.SalaryMax,
            jobDescription:this.jobDataById?.JobDescription,
            remoteJob:this.jobDataById?.IsRemoteJob,
           // workplaceType:this.jobDataById?.workplaceType,
            experience:this.jobDataById?.ExperienceName,
            education:this.jobDataById?.Education,
            payLabelCheck:this.jobDataById?.IsHidePayInformation==1?true:false,
            jobDetailsCheck:this.jobDataById?.JobDescriptionCheck==1?true:false,
          });
          if(this.jobDataById?.IsRemoteJob==1){
            this.remoteTypeValue=true;
            this.addForm.patchValue(
              {
                workplaceType: this.jobDataById?.WorkplaceType,
              })
          }else{
            this.remoteTypeValue=false;
          }
          this.indeedId=this.jobDataById?.Id;
          this.JobTitle=this.jobDataById?.JobTittle;
          this.jobRefId=this.jobDataById?.JobRefNo;
          this.categoryList=this.jobDataById?.JobCategories;
          this.experienceList=this.jobDataById?.JobExperience;
          this.educationList=this.jobDataById?.JobEducations;
          this.DescriptionValue=this.jobDataById?.JobDescription;
          this.shareJobApplicationUrl=this.jobDataById?.ApplicationURL;
          this.applicationFormName=this.jobDataById?.ApplicationFormName;
          this.logoURL=localStorage.getItem('IndeedLogoURL');
             this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(this.jobDataById?.StreetAddress);
          this.loading = false;
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

  downloadXml(){
    this.loading = true;
      this._SystemSettingService.getDownloadJobXml(this.jobId).subscribe(
        (data:any)=>{
          this.loading=false;
        this.downloadFile(data);
        }
      );
  }

    /*
@Name: downloadFile function
@Who: Nitin Bhati
@When: 17-sep-2023
@Why: EWM-11785
@What: for Workflow  checklist download into pdf
*/
private downloadFile(data) {
  const downloadedFile = new Blob([data], { type: data.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = 'indeed.xml';
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}

getPostingIndeedDetails() {
  this.loading = true;
  this.PostingIndeedDetailsObs= this.jobService.getPostingIndeedDetails().subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
         this.loading = false;
         if (repsonsedata.Data) {
            this.JobCount = repsonsedata.Data.JobCount;
            this.LastJobPostdate = repsonsedata.Data.LastJobPostdate;
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

}
