import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Broadbean, ResponceData } from 'src/app/shared/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { IntegrationsBoardService } from '@app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { BroadbeanService } from '@app/modules/EWM.core/shared/services/broadbean/broadbean.service';

@Component({
  selector: 'app-broadbean',
  templateUrl: './broadbean.component.html',
  styleUrls: ['./broadbean.component.scss']
})
export class BroadbeanComponent implements OnInit {

  loading: boolean;
  jobId: string;
  urlBraodbean: SafeResourceUrl;
  jobFullDetails: any;
  workflowId: any;
  pageName: any;
  isDataLoaded: boolean = false;
  braodBeanRegistrationCode:string;
  dataListBoard: any;
  checkPlanType:string;
  emailPlanType:string = 'Email Apply';
  isDomainExist:boolean=true;
  DomainName:string;
  constructor(private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private translateService: TranslateService, private route: ActivatedRoute, private commonserviceService: CommonserviceService,
    public _integrationsBoardService: IntegrationsBoardService, private _broadBeanService: BroadbeanService, public dialog: MatDialog,
    public sanitizer: DomSanitizer, public appSetting: AppSettingsService) {

  }

  ngOnInit(): void {
    this.loading = true;
    // this.urlBraodbean = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.adcourier.com/broadcast-step-1.cgi?stored_id=MTkwMDAxMDAtMTY3NTg1MjYzMS4yNjAzOTgtMjkzNy1wcm9kLWF3cy1hcGktNC14ZW9wbGUudGVzdG9mZmljZS50ZXN0dGVhbUB0ZXN0dXNlcg%3D%3D');
    this.route.queryParams.subscribe((data: any) => {
      if (data['jobId']) {
        this.jobId = data['jobId'];
        this.workflowId = data['workId'];
        this.pageName = data['page'];
      }
    })
    if (this.pageName) {
      this._broadBeanService.broadBeanPublishedJobSelected.subscribe((data: any) => {
        if (!data) {
          this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
        } else {
          this.jobFullDetails = data;
        }
      })
      if (this.jobFullDetails) {
        this.getIntegrationBoardData();
      }
    }
  }

// @suika @EWM-13901 @whn-26-09-2023 
  getDomainName(url){
    url = url.replace("https://", '');
    url = url.replace("http://", '');   
    let prefix=this.appSetting.prefix;
    url = url.replace(prefix, '');
    return url.split('.')[0];
  };
  

  /*
    @Type: File, <ts>
    @Name: broadbeanJobPosting function
    @Who: Adarsh singh
    @When: 09-Feb-2023
    @Why: EWM-10280 EWM-104298
    @What: calling post job methode from here
  */
  broadbeanJobPosting() {
    this.loading = true;
    let dataObj = this.jobFullDetails;
    let _appSettingSerivce = this.appSetting;  
    // @suika @EWM-13901 @whn-26-09-2023 
    let domainData = '';
    this.DomainName = this.getDomainName(window.location.hostname);
    let domain = localStorage.getItem("tenantDomain");
    if(domain==''  || domain==null || domain==undefined){
     domainData = this.DomainName;
    }else{
      domainData = domain;
    }
     if(domainData=='' || domainData==null || domainData==undefined){
      this.isDomainExist = false;
      this.openWarningDialog('label_something_went_wrong_err', 'label_alert');
      return false;
    }
    let applicationUrl = this.commonserviceService.onshareJobApplicationURL(this.jobId,domainData);
   
    let redirectUrlAfterPublished = window.location.origin + '/client/jobs/job/job-list/list/' + this.workflowId + '?page=broadbean';
    let obj: Broadbean;
    let industry = dataObj?.IndustryName
    obj = {
      transaction: {
        // config: {
        //   stylesheet: 'https://sso-client-dev-ewm.entiredev.in/assets/broadbean.css'
        // },
        filters: {
          job_reference: dataObj?.JobReferenceId
        },
        advert: {
          job_title: dataObj?.JobTitle,
          job_reference: dataObj?.JobReferenceId,
          job_type: dataObj?.JobTypeName,
          location_query: dataObj?.Location,
          industry: industry+'',
          salary_from: dataObj?.SalaryMin,
          salary_to: dataObj?.SalaryMax,
          salary_currency: dataObj?.CurrencyName,
          salary_per: dataObj?.SalaryUnitName,
          // salary_benefits: dataObj?.salaryBenefits,
          summary: dataObj?.JobDescription,
          job_description: dataObj?.JobDescription,
        },
        applyonline: {
          url: this.checkPlanType == this.emailPlanType ? '' : applicationUrl
        },
        notify_on_delivery: _appSettingSerivce.broadbean.notify_on_delivery,
        redirect_on_completion: {
          url: redirectUrlAfterPublished,
          auto: _appSettingSerivce.broadbean.redirect_on_completion
        },
        // close_on_completion: _appSettingSerivce.broadbean.close_on_completion,
        // search: {
        //   candidate_import_url: _appSettingSerivce.broadbean.candidate_import_url
        // },
        stylesheet: {
          // _appSettingSerivce.systemConfig=='local'? 'https://sso-client-dev-ewm.entiredev.in'+'/assets/posting.css': _appSettingSerivce.baseUrl + "/assets/posting.css",
          posting_form: ''
        },
      },
      job_id: this.jobId,
      workflowId: this.workflowId
    };
    this._broadBeanService.broadbeanJobPosting(obj).subscribe((repsonsedata: any) => {
      if (repsonsedata.httpStatusCode == 200 || repsonsedata.httpStatusCode == 204) {
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        if (repsonsedata.data.url) {
          this.urlBraodbean = this.sanitizer.bypassSecurityTrustResourceUrl(repsonsedata.data.url);
          this.isDataLoaded = true;
          this.loading = false;
        }
      } else if (repsonsedata['httpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['message']), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
        this.loading = false;
        // this.router.navigate(['/client/core/job/job-landingpage/' + this.workflowId]);
      }
    }, err => {
      this.loading = false;
      this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }

  onBack() {
    window.top.location.href = 'client/jobs/job/job-list/list/' + this.workflowId;
  }

/*
  @Type: File, <ts>
  @Name: getIntegrationBoardData
  @Who: Adarsh singh
  @When: 10-May-2023
  @Why: EWM-10282 EWM-10476
  @What: for getting all job boards
*/
getIntegrationBoardData() {
  this._integrationsBoardService.getIntegrationBoard().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
         this.loading = false;
        let AllData = repsonsedata.Data;
        this.dataListBoard = AllData?.filter((dl: any) => dl.CategoryName === "Job Boards");
        let regCode =  this.dataListBoard?.filter((e:any) => e.Name.toLowerCase() === "broadbean");
        this.braodBeanRegistrationCode = regCode[0]?.RegistrationCode;
        this.getbroadbeantenantdetails();
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
  @Name: getbroadbeantenantdetails
  @Who: Adarsh singh
  @When: 10-May-2023
  @Why: EWM-10282 EWM-10476
  @What: for getting all job boards
*/
getbroadbeantenantdetails() {
  this.loading = true;
  this._SystemSettingService.getbroadbeantenantdetails(this.braodBeanRegistrationCode).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
         this.checkPlanType = data.Data?.PlanType;
         this.broadbeanJobPosting();
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
  @Name: openWarningDialog function
  @Who: Suika
  @When: 26-SEPT-2023
  @Why: EWM-13901
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
    if (res == false) {
    this.onBack();
    }
  })
}

}
