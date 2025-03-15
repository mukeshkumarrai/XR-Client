import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { BroadbeanPosting, ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { BroadbeanJobBoardsStatusComponent } from 'src/app/shared/modal/broadbean-job-boards-status/broadbean-job-boards-status.component';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { IntegrationsBoardService } from '@app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { BroadbeanService } from '@app/modules/EWM.core/shared/services/broadbean/broadbean.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
@Component({
  selector: 'app-manage-job-posting',
  templateUrl: './manage-job-posting.component.html',
  styleUrls: ['./manage-job-posting.component.scss']
})
export class ManageJobPostingComponent implements OnInit {
  @Input() JobId:any;
  @Input() JobReferenceId:any;
  @Input() WorkflowId:any;
  seekRegisCode: any;
  seekRegistrationCode: any;
  seekRegistrationList: any;
  seekRegisCodeList: any;
  selectedIndex: number;
  public loading: boolean = false;
    userpreferences: Userpreferences;
  jobBoardList=[];
  
  
  dataListBoard: any;
  braodBeanRegistrationCode:string;
  public pageNo: number = 1;
  public pageSize:number;
  public sortingValue: string = "UserName,asc";
  activeUserList:[] = []
  currentUser: any;
  isUserActivatedForBroadBean:boolean;
  planTypeApplicationForm = 'Applicatiorn Form';
  planTypeEmailApply = 'Email Apply';
  getBroadbeanPlanType:any;
  dirctionalLang;
  indeedRegisCode: any;
  indeedRegistrationCode: string;
  indeedRegistrationList: any;
  indeedRegisCodeList: any;
    visibilityIndeed: boolean;
  
    constructor(private jobService: JobService,private snackBService: SnackBarService,private translateService: TranslateService,
      public _integrationsBoardService: IntegrationsBoardService,private appSettingsService: AppSettingsService,private commonserviceService: CommonserviceService,
      private router:Router,private _userpreferencesService: UserpreferencesService,  private _broadBeanService: BroadbeanService,
      public dialog: MatDialog,private _SystemSettingService: SystemSettingService,
      private commonServiesService: CommonServiesService) { 
      this.seekRegistrationCode = this.appSettingsService.seekRegistrationCode;
      this.indeedRegistrationCode = this.appSettingsService.indeedRagistrationCode;
      this.pageSize = this.appSettingsService.pagesize;
  
      }
  
    ngOnInit(): void {
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
     this.getJobPostingdetails();
     this.getIntegSeekRegistrationAll();
     this.getIntegIndeedRegistrationAll();
      this.getIntegrationBoardData();
    }
  
  
     /*
   @Type: File, <ts>
   @Name: job posting details
   @Who: Bantee Kumar
   @When: 04-Jan-2023
   @Why: EWM-10026.EWM-10059
   @What: To get job boards data.
   */
    getJobPostingdetails(){
      this.loading = true;
      this.jobService.getJobPostingdetailsById(this.JobId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.jobBoardList = repsonsedata.Data;
            // this.loading = false;
          } else if (repsonsedata.HttpStatusCode === 204) {
            this.jobBoardList  = [];
            // this.loading = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
        })
    }
  /*
     @Type: File, <ts>
     @Name: getIntegSeekRegistrationAll function
     @Who: Bantee Kumar
     @When: 04-Jan-2023
     @Why: EWM-10026.EWM-10059
     @What: For getting registration code data 
    */
  
    getIntegSeekRegistrationAll() {
       this.loading = true;
      this._integrationsBoardService.getIntegrationAll().subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
            //  this.loading = false;
            this.seekRegistrationList = repsonsedata.Data;
            this.seekRegisCodeList = this.seekRegistrationList?.filter((e: any) => e.RegistrationCode === this.seekRegistrationCode);
  
            this.seekRegisCode = this.seekRegisCodeList[0]?.RegistrationCode;
          } else {
            this.seekRegistrationList = null;
             this.loading = false;
          }
        })
    }
  
    /*
     @Type: File, <ts>
     @Name: Publish event
     @Who: Bantee Kumar
     @When: 04-Jan-2023
     @Why: EWM-10026.EWM-10059
     @What: navigating on condition 
    */
  
    clickPublish(data: any) {
      localStorage.setItem('IndeedLogoURL', data?.Logo);
       let jobHeaderDetails;
      // obj['']
      this._broadBeanService.onJobHeaderDetailsSelected.subscribe((e: any) => {
        jobHeaderDetails = e;
      })
      //<!-----@Adarsh singh@EWM-10282 EWM-10476  @25-04-2023 Set json for job published from broadbean----->    
      let getJobDetails: any = JSON.parse(localStorage.getItem('jobDetails'));
      let jobDataForBroadbean : BroadbeanPosting= {
        JobTitle : jobHeaderDetails?.HeaderDetails?.JobDetails?.JobTitle,
        JobReferenceId : jobHeaderDetails?.HeaderAdditionalDetails?.JobReferenceId,
        JobTypeName : jobHeaderDetails?.HeaderAdditionalDetails?.JobType,
        Location : jobHeaderDetails?.HeaderDetails?.JobDetails?.Location,
        IndustryName : getJobDetails?.IndustryName,
        SalaryMin : getJobDetails?.SalaryMin,
        SalaryMax : getJobDetails?.SalaryMax,
        CurrencyName : jobHeaderDetails?.HeaderDetails?.JobDetails?.CurrencyName,
        SalaryUnitName : getJobDetails?.SalaryUnitName,
        salaryBenefits : 'salary benefits',
        JobDescription : getJobDetails?.JobDescription,
        ApplicationFormId : jobHeaderDetails?.HeaderDetails?.JobDetails?.ApplicationFormId,
        ApplicationFormName : jobHeaderDetails?.HeaderDetails?.JobDetails?.ApplicationFormName,
        Id : this.JobId,
        WorkflowId : this.WorkflowId,
        PublishedOnSeek : getJobDetails?.PublishedOnSeek,
        PublishedOnIndeed : getJobDetails?.PublishedOnIndeed
      };
      
      this._broadBeanService.onBroadBeadSelect.next(jobDataForBroadbean);
      switch (data.JobBoard.toLowerCase()) {
        case "broadbean":
          let errArray = [undefined, null, 0, ''];
          if (this.visibilityBraodBean) {
            // If login user user not activated with broadbean..it's display msg user is not connected with broadbean. 
            if (!this.isUserActivatedForBroadBean) {
              if (this.getBroadbeanPlanType === this.planTypeApplicationForm) {
                if (errArray.includes(jobHeaderDetails?.HeaderDetails.JobDetails.ApplicationFormId)) {
                  this.openWarningDialog('label_jobIsNotMappedWithApplication', 'label_alert');
                }
                else{
                  this.router.navigate(['/client/jobs/job/job-publish/broadbean'], {
                    queryParams: { page: 'broadbean', jobId: this.JobId, workId: this.WorkflowId }
                  });
                }
              }
              else{
                this.router.navigate(['/client/jobs/job/job-publish/broadbean'], {
                  queryParams: { page: 'broadbean', jobId: this.JobId, workId: this.WorkflowId }
                });
              }
            }
            else {
              this.openWarningDialog('label_loggedInUserNotConfigure', 'label_alert');
            }
          }
          else{
            this.openWarningDialog('label_braodbeanNotConnect', 'label_alert');
          }
          break;
        //  end 
        case "seek":
      //<!-----@Bantee Kumar @EWM-10204 @18-07-2023  Check status of boards under market place to connected or not connected in Manage Job Posting page.----->    
  
          if(this.visibilitySeek){
          if (data.PublishedOn == 0) {
            this.router.navigate(['/client/jobs/job/job-publish-v1/publish', { jobId: this.JobId, jobRefId: this.JobReferenceId, workId: this.WorkflowId, pub: 0 }])
          } else {
            this.router.navigate(['/client/jobs/job/job-publish-v1/republish-job', { jobId: this.JobId, workId: this.WorkflowId }])
          }
        }else{
          this.openWarningDialog('label_seekNotConnect', 'label_alert');
  
        }
          this.selectedIndex = 0;
          this.commonserviceService.onselectedIndexId.next(this.selectedIndex);
          this.commonserviceService.onSeekJobPublishedSelectId.next(null);
          break;
  
          case "indeed":
                if(this.visibilityIndeed){
                if (data.PublishedOn == 0) {
                  this.router.navigate(['/client/jobs/job/job-publish-v1/publish', { jobId: this.JobId, jobRefId: this.JobReferenceId, workId: this.WorkflowId, pub: 0 }])
                } else {
                  this.router.navigate(['/client/jobs/job/job-publish/indeed-published',{jobId:this.JobId,workId:this.WorkflowId}]);
                 }
              }else{
                this.openWarningDialog('label_indeedNotConnect', 'label_alert');
        
              }
                this.selectedIndex = 0;
                this.commonserviceService.onselectedIndexId.next(this.selectedIndex);
                this.commonserviceService.onSeekJobPublishedSelectId.next(null);
                break;
          
        default:
          // for default 
          break;
      }
  
  
    }
    /* 
    @Type: File, <ts>
    @Name: openWarningDialog function
    @Who: Adarsh Singh
    @When: 25-APRIL-2023
    @Why: EWM-10282 EWM-10476
    @What: for opening alert modal
  */
    openWarningDialog(label_SubtitleWeightage, label_TitleWeightage) {
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
        if (res == true) {
  
        }
      })
    }
  
    /*
    @Type: File, <ts>
    @Name: getIntegrationBoardData
    @Who: Adarsh singh
    @When: 25-APRIL-2023
    @Why: EWM-10282 EWM-10476
    @What: for getting all job boards
  */
  
  getIntegrationBoardData() {
    this.loading = true;
    this._integrationsBoardService.getIntegrationBoard().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          let AllData = repsonsedata.Data;
          this.dataListBoard = AllData?.filter((dl: any) => dl.CategoryName === "Job Boards");
          let regCode =  this.dataListBoard?.filter((e:any) => e.Name.toLowerCase() === "broadbean");
          this.braodBeanRegistrationCode = regCode[0]?.RegistrationCode;
          this.getOtherIntegrationCheckstatus();
          this.getBroadbeanUsersAll(this.pageNo, this.pageSize, this.sortingValue);
          // this.loading = false;
        } else {
          this.dataListBoard = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }
  
    /*
    @Type: File, <ts>
    @Name: getBroadbeanUsersAll function
    @Who: Adarsh singh
    @When: 25-APRIL-2023
    @Why: EWM-10282 EWM-10476
    @What: get all lists
  */
  
  getBroadbeanUsersAll(pageNo, pageSize, sortingValue) {
    this.loading = true;
    this._SystemSettingService.getBroadbeanUsersAll(this.braodBeanRegistrationCode, pageNo,pageSize,sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.activeUserList = repsonsedata.Data;
          let isUser:any = this.activeUserList?.filter((ele:any)=> ele.UserId === this.currentUser.UserId && ele?.IsAccess === 1);
          isUser.length > 0 ? this.isUserActivatedForBroadBean = false : this.isUserActivatedForBroadBean = true;
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
   @Name: getIntegrationCheckstatus function
   @Who: Adarsh singh
   @When: 08 -Feb 20223
   @Why: EWM-10428
   @What: For checking broadbean connected or not
  */
  visibilityBraodBean:boolean;
  
  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatus function
   @Who: bantee
   @When: 17 -july 2023
   @Why: EWM-10204
   @What: For checking broadbean connected or not
  */
  visibilitySeek: boolean;
   // @suika @EWM-13684 Whn 03-08-2023
  getOtherIntegrationCheckstatus(){
    let integrationdata = JSON.parse(localStorage.getItem('otherIntegrations'));
    integrationdata?.forEach(element => {
      if (this.seekRegistrationCode == element.RegistrationCode) {
          this.visibilitySeek=element.Connected;
      };
      if (this.indeedRegistrationCode == element.RegistrationCode) {
        this.visibilityIndeed=element.Connected;
    };
      if (this.braodBeanRegistrationCode == element.RegistrationCode) {
        this.visibilityBraodBean = element.Connected;    
        if (!this.visibilityBraodBean) {
          let filteredPeople = this.dataListBoard?.filter((item: any) => item.RegistrationCode != this.braodBeanRegistrationCode);
          this.dataListBoard = filteredPeople;
        }
      };  
    })
    this.getbroadbeantenantdetails();
    return;
  }
  /*
   @Type: File, <ts>
   @Name: getbroadbeantenantdetails function
   @Who: Adarsh singh
   @When: 25 -APRIL 20223
   @Why: EWM-10428
   @What: For checking broadbean plan type
  */
  getbroadbeantenantdetails() {
    this.loading = true;
    this._SystemSettingService.getbroadbeantenantdetails(this.braodBeanRegistrationCode).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
          this.getBroadbeanPlanType = data.Data?.PlanType;
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
  /*
    @Type: File, <ts>
    @Name: onGetAllBroadbeanBoards function
    @Who: Adarsh singh
    @When: 01-june-2023
    @Why: EWM-12604-EWM-12665
    @What: for open job board modal
  */
  onGetAllBroadbeanBoards(){
    const dialogRef = this.dialog.open(BroadbeanJobBoardsStatusComponent,{
      maxWidth: "350px",
      data: new Object({ jobId: this.JobId }),
      panelClass: ['xeople-modal-lg', 'BroadbenJobBoards', 'animate__animated', 'animate__zoomIn'],
      disableClose: true
    })
  
    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	
  
  }
  

  redirectUrl(boardType:string){  
    switch(boardType?.toLocaleLowerCase()){
      case 'broadbean':
        this.router.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.appSettingsService.Broadbeanregistrationcode))
      break;
      case 'seek':
        this.router.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.appSettingsService.seekRegistrationCode))
      break;
      case 'indeed':
        this.router.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.appSettingsService.indeedRagistrationCode))
      break
    }
    }
    getIntegIndeedRegistrationAll() {
      this.loading = true;
     this._integrationsBoardService.getIntegrationAll().subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
           //  this.loading = false;
           this.indeedRegistrationList = repsonsedata.Data;
           this.indeedRegisCodeList = this.indeedRegistrationList?.filter((e: any) => e.RegistrationCode === this.indeedRegistrationCode);
  
           this.indeedRegisCode = this.indeedRegisCodeList[0]?.RegistrationCode;
         } else {
           this.indeedRegistrationList = null;
            this.loading = false;
         }
       })
   }
  
}
