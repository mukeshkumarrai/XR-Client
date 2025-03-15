import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Broadbean } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { Subject, Subscription } from 'rxjs';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { IntegrationsBoardService } from '@app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { BroadbeanService } from '@app/modules/EWM.core/shared/services/broadbean/broadbean.service';

@Component({
  selector: 'app-job-publish',
  templateUrl: './job-publish.component.html',
  styleUrls: ['./job-publish.component.scss']
})
export class JobPublishComponent implements OnInit {

  sugestion: string;
  searchUserCtrl = new FormControl();
  addForm: FormGroup;
  public searchDataList: any = [];
  public categorySugestionDataList: any = [];
  public categoryWithParentDataList:any=[];
  public categoryWithChildDataList:any=[];
  public nearestLocationDataList:any=[];
  jobSugestionlength: number;
  public divStatus: boolean = false;
  AccessId: any;
  public loadingSearch: boolean;
  ipaddress:string = '';
  latitude:string= '';
  longitude:string= '';
  currency:string = '';
  currencysymbol:string = '';
  isp:string= '';
  city:string = '';
  country:string ='';
  province:string='';
  public lat;
  public lng;
  location;
  public divLoopStatus:number=1;
  searchVal;
  selectedIndex: number=0;
  workflowId: any;
  jobRefId: any;
  jobId: any;
  formValidateStatus: boolean = true;  
  formValidateStatusJobBoard:boolean=true;
  jobDetailsById: string;
  jobDataById: any;
  Published: any;
  JobTitle: any;
  tabstatus='enabled';
  publishedStatus: boolean=false;
  jobPublishArray = {};
  loading: boolean = true;
  selectedIndexTabTwo: any;
  positionMatTab: any;
  selectedName:string;
  broadBean: Broadbean;
  dataListBoard: any;
braodBeanRegistrationCode:string;
public pageNo: number = 1;
public pageSize:number;
public sortingValue: string = "UserName,asc";
currentUser: any;
activeUserList:[] = []
isUserActivatedForBroadBean:boolean = true;
jobFullData:any;
seekRegistrationCode:any;
isJobMappedWithApplicationForm:boolean;
planTypeApplicationForm = 'Applicatiorn Form';
visibilitySeek:boolean;
destroy$: Subject<boolean> = new Subject<boolean>();
IntegrationBoardObs:Subscription;
IntegrationCheckstatusObs: Subscription;
  BroadbeantenantdetailsObs: Subscription;
  BroadbeanUsersAllObs: Subscription;
  indeedRegistrationCode: string;
  logoURL: string;
  indeedId: number;
  previewUrl: any;
  previewBtnClick: boolean;
  publishStatus: number=0;
  isActive:string;
  constructor(private fb: FormBuilder,private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService,private translateService: TranslateService,private route: ActivatedRoute,private commonserviceService: CommonserviceService,
    public _integrationsBoardService: IntegrationsBoardService,private _broadBeanService: BroadbeanService,
    private appSettingsService: AppSettingsService, public dialog: MatDialog,private routes: ActivatedRoute,) { 
    this.seekRegistrationCode = this.appSettingsService.seekRegistrationCode;
    this.indeedRegistrationCode = this.appSettingsService.indeedRagistrationCode;
    this.pageSize = this.appSettingsService.pagesize;

    this.addForm = this.fb.group({
      accountName:[''],
      jobTitle: [''],
      Category:[''],
      SubCategory:[''],
      AccessId: [''],
      WorkType: [''],
      PayType: ['']
    });  
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        if (params['selectedName'] != undefined) {
          this.jobId = params['jobId'];
          this.jobRefId = params['jobRefId'];
          this.workflowId = params['workId'];
          this.selectedName = params['selectedName'];
          this.indeedId = params['indeedId'];
        }else{
          this.jobId = params['jobId'];
          this.jobRefId = params['jobRefId'];
          this.workflowId = params['workId'];
        }
      });
     this.commonserviceService.onselectedIndexId.subscribe(value => {
      if (value !== null) {
        this.selectedIndex = value;
        } 
    });

    this.commonserviceService.onSeekJobformValidSelectId.subscribe(value => {
      if (value === false) {
        this.formValidateStatus = value;
        }
        else{
          this.formValidateStatus = true;
        } 
    });
    this.commonserviceService.onJobSeekButtonStatusId.subscribe(value => {
      if (value === false) {
        this.formValidateStatus=false;
        } 
    });
    //this.getSeekJobCategoryWithChild();
    

    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab=res;
    });

    this.getIntegrationBoardData();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    //<!-----@Adarsh singh@EWM-10282 EWM-10476  @25-04-2023 Set json for job published from broadbean----->    
    this._broadBeanService.broadBeanPublishedJobSelected.subscribe((data: any) => {
      this.jobFullData = data;
      if (!data) {
        this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
      }
      else{
       
      }
    })
    let data = sessionStorage.getItem('Activefilter'); //by maneesh ewm-17125 for ewm-17125
    this.isActive=data;        
    this.routes.queryParams.subscribe((parmsValue) => {
      if (parmsValue?.filter != null || parmsValue?.filter != undefined) {
      this.isActive = parmsValue?.filter;
      }
    });
    // end 
  }

   /*
     @Type: File, <ts>
     @Name: onUpdate
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: for posting seek data 
  */
     public getDataFromAddJob(data){
       //console.log("data:",data)
      // this.jobDetailsById = localStorage.getItem('jobById');
      // this.jobDataById = JSON.parse(this.jobDetailsById);
      this.JobTitle = data?.JobTitle;
      this.Published=data?.Published;
      if(this.Published===1){
        this.tabstatus='disabled';
      }
     }

   /*
     @Type: File, <ts>
     @Name: oncancel
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: Redirect to job landing page
  */
     oncancel(){
      // this.destroy.next();
      // this.destroy.complete()
     // this.commonserviceService.onSeekJobPublishedSelectId.unsubscribe();
     sessionStorage.setItem('Activefilter', this.isActive);//by maneesh ewm-17125 for ewm-17125
      localStorage.removeItem("jobById");
      this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
    }


 /*
     @Type: File, <ts>
     @Name: clickAccessData
     @Who: Nitin Bhati
     @When: 17-Sep-2021
     @Why: EWM-2859
     @What: for hide and show div
  */
     public clickAccessData(accessData: any) {
      this.AccessId = accessData;
      if (accessData === 1) {
         this.divStatus = true;   
      }  else {
         this.divStatus = false;      
      }
    }
/*
     @Type: File, <ts>
     @Name: nextTab
     @Who: Nitin Bhati
     @When: 21-Dec-2021
     @Why: EWM-3691
     @What: for move to next tab
  */
     nextTab(value,index: number) {
      this.selectedIndex=index;
      this.checkTypeForRedirect(index);
      // switch() {
      //   case "Broadbean":
      //   break;

      //   default:
      //   break;
      // }
 

       
     }
/*
     @Type: File, <ts>
     @Name: movePublished
     @Who: Nitin Bhati
     @When: 21-Dec-2021
     @Why: EWM-3691
     @What: for Move to published 
  */
    movePublished(){
      this.publishedStatus=true;
      this.formValidateStatus=true;
      this.publishStatus=1;
      //this.commonserviceService.onSeekJobPublishedSelectId.next(this.publishedStatus);
      this.commonserviceService.onSeekJobPreviewSelectId.subscribe(value => {
        if (value !== null && this.publishStatus===1) {
          this.jobDataById = value;
         // console.log("publishedValue:",value);
          this.Published=this.jobDataById.Published;
          this.publishStatus=0;
          if(this.publishedStatus===true){
            if(this.Published===1 || this.Published===2){
              this.onUpdate();
            }else if(this.Published===3){
              //alert('Indeed Post');
              this.onSaveIndeed();
            }
              else{
              this.onSave();
            }
          }
         
        }         
      });

     
    }
/*
     @Type: File, <ts>
     @Name: clickIndexId
     @Who: Nitin Bhati
     @When: 21-Dec-2021
     @Why: EWM-3691
     @What: for move to next component
  */
 
    clickIndexId(id:number){
      if(this.Published===1){
        if(id===0){
          this.tabstatus='disabled';
          this.selectedIndex;
        }else{
          this.selectedIndex=id;
        }       
      }else{
        // this.selectedIndex=id;
      }
      
    }
   


        /*
     @Type: File, <ts>
     @Name: onSave
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: for posting seek data 
  */
     public onSave(){
      this.jobPublishArray['PositionTitle'] = this.jobDataById?this.jobDataById.PositionTitle:null;
      this.jobPublishArray['PayType'] = {
       "Code": this.jobDataById?this.jobDataById.PayType.Code:'',
       "Name": this.jobDataById?this.jobDataById.PayType.Name:'',
       "IntervalCode":this.jobDataById?this.jobDataById.PayType.IntervalCode:''
     },
     this.jobPublishArray['MinimumAmount'] = this.jobDataById?this.jobDataById.MinimumAmount:0;
     this.jobPublishArray['MaximumAmount'] = this.jobDataById?this.jobDataById.MaximumAmount:0;
    
     this.jobPublishArray['Contact']= {
       "Name": this.jobDataById.Contact.Name,
       "Phone": this.jobDataById.Contact.Phone,
       "Email": this.jobDataById.Contact.Email
     },
     this.jobPublishArray['JobCategoriesId'] = this.jobDataById.JobCategoriesId;
     this.jobPublishArray['PositionLocationId'] = this.jobDataById.PositionLocationId;
     this.jobPublishArray['PositionLocation'] = this.jobDataById.PositionLocation;   
     this.jobPublishArray['JobAd'] = this.jobDataById.JobAd;
     this.jobPublishArray['seekAdvertisementProductId']=this.jobDataById.seekAdvertisementProductId; /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What: seekAdvertisementProductId &  ProductPriceSummary added**/
     this.jobPublishArray['ProductPriceSummary']=this.jobDataById.ProductPriceSummary;
     this.jobPublishArray['SearchSummary'] = this.jobDataById.SearchSummary;
     this.jobPublishArray['JobDetail'] = this.jobDataById.JobDetail;
     this.jobPublishArray['PayTypeDescription'] = this.jobDataById.PayTypeDescription
     this.jobPublishArray['BrandingID'] = this.jobDataById.BrandingID;
     this.jobPublishArray['KeySellingPoint'] = this.jobDataById.KeySellingPoint;
     this.jobPublishArray['JobRefrenceID'] = this.jobDataById.JobRefrenceID;
     this.jobPublishArray['JobID'] = this.jobDataById.JobID;
     this.jobPublishArray['BillingRefrenceID'] = this.jobDataById.BillingRefrenceID;
     this.jobPublishArray['WorkTypeCode'] = this.jobDataById.WorkTypeCode;
     this.jobPublishArray['SeekVideo']= {
       "Url": this.jobDataById.SeekVideo.Url,
       "SeekAnzPositionCode": this.jobDataById.SeekVideo.SeekAnzPositionCode
     }
     this.jobPublishArray['WorkflowId'] = this.jobDataById.WorkflowId;
     this.jobPublishArray['knockOut'] = this.jobDataById.knockOut;
     this.jobPublishArray['JobCategory'] = this.jobDataById.JobCategory;
     this.jobPublishArray['OrganizationId'] = this.jobDataById.OrganizationId;
     this.jobPublishArray['SeekJobApplicationMethods'] = this.jobDataById.SeekJobApplicationMethods;
     this.jobPublishArray['ApplicationFormId'] = this.jobDataById.ApplicationFormId;
     this.jobPublishArray['ApplicationFormName'] = this.jobDataById.ApplicationFormName;
     this.jobPublishArray['ApplicationFormURL'] = this.jobDataById.ApplicationFormURL;
     this.jobPublishArray['JobExpiryDate'] = this.jobDataById.JobExpiryDate;
     this.jobPublishArray['Currency'] = this.jobDataById.Currency;  /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:static currency removed **/
    
    this.jobPublishArray['JobAdCost'] = Number(this.jobDataById.JobAdCost);  /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:converted to number**/
    this.jobPublishArray['JobadCostCurrency'] = this.jobDataById.JobadCostCurrency;
    this.jobPublishArray['IsHidePayInformation'] = this.jobDataById.IsHidePayInformation;
    this.jobPublishArray['defaultJobDetails'] = {
      "JobDetail": this.jobDataById.DefaultJobDetail.JobDetail,
      "JobDetailStatus": this.jobDataById.DefaultJobDetail.JobDetailStatus
    }

    //  this.jobPublishArray['ProfileId'] = this.jobDataById.ProfileId;
    //  this.jobPublishArray['Published']=this.jobDataById.Published;
    //  this.jobPublishArray['PositionOrganization'] = this.jobDataById.PositionOrganization;
      this.loading = true;
      this.commonserviceService.onSeekJobPublishedSelectId.next(null);
      this._SystemSettingService.createSeekPosting(this.jobPublishArray).subscribe((repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
          localStorage.removeItem("jobById");
          this.jobPublishArray = {};
          this.loading = false;
          this.publishedStatus=false;
           this.snackBService.showSeekPostSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Data.JobBoardUrl,this.workflowId);
          this.commonserviceService.onSeekJobPreviewSelectId.next(null);
          this.addForm.reset();
           } else if (repsonsedata.HttpStatusCode === 400) {
            this.commonserviceService.onSeekJobPreviewIframeId.next(null); 
            this.publishedStatus=false;
            this.jobPublishArray = {};
          this.commonserviceService.onJobSeekButtonStatusId.next(false);
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
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
     }

       /*
     @Type: File, <ts>
     @Name: onUpdate
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: for posting seek data 
  */
     public onUpdate(){
      this.jobPublishArray['PositionTitle'] = this.jobDataById.PositionTitle;
      this.jobPublishArray['PayType'] = {
       "Code": this.jobDataById.PayType.Code,
       "Name": this.jobDataById.PayType.Name,
       "IntervalCode":this.jobDataById.PayType.IntervalCode
     },
     this.jobPublishArray['MinimumAmount'] = this.jobDataById.MinimumAmount;
     this.jobPublishArray['MaximumAmount'] = this.jobDataById.MaximumAmount;
    // this.jobPublishArray['Currency'] = 'AUD';/**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What: static removed**/
     this.jobPublishArray['Contact']= {
       "Name": this.jobDataById.Contact.Name,
       "Phone": this.jobDataById.Contact.Phone,
       "Email": this.jobDataById.Contact.Email
     },
     this.jobPublishArray['JobCategoriesId'] = this.jobDataById.JobCategoriesId;
     this.jobPublishArray['PositionLocationId'] = this.jobDataById.PositionLocationId;
     this.jobPublishArray['PositionLocation'] = this.jobDataById.PositionLocation;   
     this.jobPublishArray['JobAd'] = this.jobDataById.JobAd;
     this.jobPublishArray['SearchSummary'] = this.jobDataById.SearchSummary;
     this.jobPublishArray['JobDetail'] = this.jobDataById.JobDetail;
     this.jobPublishArray['PayTypeDescription'] = this.jobDataById.PayTypeDescription
     this.jobPublishArray['BrandingID'] = this.jobDataById.BrandingID;
     this.jobPublishArray['KeySellingPoint'] = this.jobDataById.KeySellingPoint;
     this.jobPublishArray['JobRefrenceID'] = this.jobDataById.JobRefrenceID;
     this.jobPublishArray['JobID'] = this.jobDataById.JobID;
     this.jobPublishArray['BillingRefrenceID'] = this.jobDataById.BillingRefrenceID;
     this.jobPublishArray['WorkTypeCode'] = this.jobDataById.WorkTypeCode;
     this.jobPublishArray['SeekVideo']= {
       "Url": this.jobDataById.SeekVideo.Url,
       "SeekAnzPositionCode": this.jobDataById.SeekVideo.SeekAnzPositionCode
     }
     this.jobPublishArray['WorkflowId'] = this.jobDataById.WorkflowId;
     this.jobPublishArray['knockOut'] = this.jobDataById.knockOut;
     this.jobPublishArray['ProfileId'] = this.jobDataById.ProfileId;
      this.jobPublishArray['Published']=this.jobDataById.Published;
      this.jobPublishArray['PositionOrganization'] = this.jobDataById.PositionOrganization;
      this.jobPublishArray['JobCategory'] = this.jobDataById.JobCategory;
      this.jobPublishArray['JobPostedUri'] = this.jobDataById.JobPostedUri;

     this.jobPublishArray['OrganizationId'] = this.jobDataById.OrganizationId;
     this.jobPublishArray['SeekJobApplicationMethods'] = this.jobDataById.SeekJobApplicationMethods;
     this.jobPublishArray['ApplicationFormId'] = this.jobDataById.ApplicationFormId;
     this.jobPublishArray['ApplicationFormName'] = this.jobDataById.ApplicationFormName;
     this.jobPublishArray['ApplicationFormURL'] = this.jobDataById.ApplicationFormURL;
     this.jobPublishArray['JobExpiryDate'] = this.jobDataById.JobExpiryDate;

    this.jobPublishArray['JobadCostCurrency'] = this.jobDataById.Currency;
    this.jobPublishArray['PositionOpeningId'] = this.jobDataById.PositionOpeningiId;
    this.jobPublishArray['IsHidePayInformation'] = this.jobDataById.IsHidePayInformation;
    this.jobPublishArray['defaultJobDetails'] = {
      "JobDetail": this.jobDataById.DefaultJobDetail.JobDetail,
      "JobDetailStatus": this.jobDataById.DefaultJobDetail.JobDetailStatus
    }
    this.jobPublishArray['seekAdvertisementProductId']=this.jobDataById.seekAdvertisementProductId; /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What: seekAdvertisementProductId &  ProductPriceSummary added**/
    this.jobPublishArray['ProductPriceSummary']=this.jobDataById.ProductPriceSummary;
    this.jobPublishArray['Currency'] = this.jobDataById.Currency;  /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:static currency removed **/
    this.jobPublishArray['JobAdCost'] = Number(this.jobDataById.JobAdCost);  /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:converted to number**/
    this.jobPublishArray['IsAdvertisementProductIdChanged'] =this.jobDataById.IsAdvertisementProductIdChanged; /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What:when job ad type changes then send 1 else 0 (currently static in future will used) **/

    this.loading = true;
     
      this._SystemSettingService.updateSeekPosting(this.jobPublishArray).subscribe((repsonsedata: ResponceData) => {       
          if (repsonsedata.HttpStatusCode === 200) {
            this.publishedStatus=false;
          this.loading = false;
          localStorage.removeItem("jobById");
          this.jobPublishArray = {};
        //   this.selectedIndex=0;
        //  this.commonserviceService.onselectedIndexId.next(this.selectedIndex);
          this.snackBService.showSeekPostSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Data.JobBoardUrl,this.workflowId);
         this.commonserviceService.onSeekJobPreviewSelectId.next(null);
         
          this.addForm.reset();
           } else if (repsonsedata.HttpStatusCode === 400) {
            this.jobPublishArray = {};
            this.publishedStatus=false;
          this.commonserviceService.onJobSeekButtonStatusId.next(false);
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
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
     }


     ActiveTab(data){
      this.selectedIndex=data.index;;
        if(data.index===2){
        this.selectedIndexTabTwo=data.index;
         this.commonserviceService.onSeekJobformValidSelectIdActive.next(true);
       }else{
        this.commonserviceService.onSeekJobformValidSelectIdActive.next(false);
       }
     }

/*
  @Type: File, <ts>
  @Name: getIntegrationBoardData
  @Who: Adarsh singh
  @When: 06-Jan-2023
  @Why: EWM-10428
  @What: for getting all job boards
*/


  getIntegrationBoardData() {
    //this.loading = true;
    this.IntegrationBoardObs = this._integrationsBoardService.getIntegrationBoard().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          let AllData = repsonsedata.Data;
          this.dataListBoard = AllData?.filter((dl: any) => dl?.CategoryName === "Job Boards" || dl.CategoryName?.toLowerCase() === "partner");
          //<!---------@When: 16-03-2023 @who:Bantee Kumar @why: EWM-10959 --------->

          let regCode =  this.dataListBoard?.filter((e:any) => e.Name.toLowerCase() === "broadbean");
          this.braodBeanRegistrationCode = regCode[0]?.RegistrationCode;
          this.getOtherIntegrationCheckstatus();
          this.getOtherIntegrationCheckstatusForseek();
          this.getOtherIntegrationCheckstatusForIndeed();
          this.getBroadbeanUsersAll(this.pageNo, this.pageSize, this.sortingValue);
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
  @Name: onClickJobBoard
  @Who: Adarsh singh
  @When: 06-Jan-2023
  @Why: EWM-10428
  @What: changing borad on click
*/

//<!---------@When: 16-03-2023 @who:Bantee Kumar @why: EWM-10959 --------->
  onClickJobBoard(name:string,logoUrl:string){
    this.selectedName = name;
    this.logoURL = logoUrl;
    localStorage.setItem('IndeedLogoURL', this.logoURL);
    switch (name) {
      case "broadbean":
        if (this.isUserActivatedForBroadBean) {
          this.formValidateStatusJobBoard = true;
          this.openWarningDialog('label_loggedInUserNotConfigure', 'label_alert');
        }
        else {
          if (this.isJobMappedWithApplicationForm) {
            this.openWarningDialog('label_jobIsNotMappedWithApplication', 'label_alert');
            this.formValidateStatusJobBoard = true;
          }
          else {
            this.formValidateStatusJobBoard = false;
          }
        }
      break;
      case "seek":
      this.formValidateStatusJobBoard = false;
      break;
      case "indeed":
        this.formValidateStatusJobBoard = false;
        break;

      default:
      // for default 
      break;
    }
  }

/*
  @Type: File, <ts>
  @Name: checkTypeForRedirect
  @Who: Adarsh singh
  @When: 06-Jan-2023
  @Why: EWM-10428
  @What: changing borad on click
*/
  checkTypeForRedirect(index){
    if(this.selectedIndex!=2){
      if (this.selectedName == 'broadbean') {    
        this.router.navigate(['/client/jobs/job/job-publish/broadbean'], {
          queryParams: {page: 'broadbean', jobId: this.jobId, workId: this.workflowId}
        });
      }
      else if (this.selectedName == 'seek') {
        if (this.jobFullData.JobTitle) {
          if (this.jobFullData.PublishedOnSeek === '1') {
          this.router.navigate(['/client/jobs/job/job-list/list/'+ this.jobFullData.WorkflowId + '/republish-job', {jobId: this.jobFullData.Id,workId: this.jobFullData.WorkflowId}]);
          }else{
            this.selectedIndex=index;
          //this.router.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: this.jobFullData.Id,jobRefId:this.jobFullData.JobReferenceId,workId:this.jobFullData.WorkflowId,pub:0}]);
          }
        }else if(this.jobFullData.Title){
          this.router.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: this.jobId,jobRefId:this.jobFullData.JobAdvance.WorkFlowId,workId:this.workflowId,pub:0}]);
        }
        else{
          this.router.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: this.jobFullData.Id,jobRefId:this.jobFullData.JobReferenceId,workId:this.jobFullData.WorkflowId,pub:0}]);
        }
      }
      else if (this.selectedName == 'indeed') {
        if (this.jobFullData.JobTitle) {
          if (this.jobFullData.PublishedOnIndeed == '1') {
            this.router.navigate(['/client/jobs/job/job-publish/indeed-published',{jobId:this.jobFullData.Id,workId:this.jobFullData.WorkflowId}]);
          //this.router.navigate(['/client/core/job/job-landingpage/'+ this.jobFullData.WorkflowId + '/republish-job', {jobId: this.jobFullData.Id,workId: this.jobFullData.WorkflowId}]);
          }else{
          this.router.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: this.jobFullData.Id,jobRefId:this.jobFullData.JobReferenceId,workId:this.jobFullData.WorkflowId,pub:0}]);
          }
        }else if(this.jobFullData.Title){
          this.router.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: this.jobId,jobRefId:this.jobFullData.JobAdvance.WorkFlowId,workId:this.workflowId,pub:0}]);
        }
        else{
          this.router.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: this.jobFullData.Id,jobRefId:this.jobFullData.JobReferenceId,workId:this.jobFullData.WorkflowId,pub:0}]);
        }
      }
    }
   

 
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
getOtherIntegrationCheckstatus() {
  this.loading = true;
  this.IntegrationCheckstatusObs = this._SystemSettingService.getIntegrationCheckstatus(this.braodBeanRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
          this.visibilityBraodBean = repsonsedata.Data?.Connected;
          this.getbroadbeantenantdetails();
          if (!this.visibilityBraodBean) {
            let filteredPeople = this.dataListBoard.filter((item:any) => item.RegistrationCode != this.braodBeanRegistrationCode);
            this.dataListBoard = filteredPeople;
          }
          // this.loading = false;
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
  @Name: getBroadbeanUsersAll function
  @Who: Adarsh singh
  @When: 09-Feb-2023
  @Why: EWM-10280 EWM-104298
  @What: get all lists
*/

getBroadbeanUsersAll(pageNo, pageSize, sortingValue) {
  this.loading = true;
  this.BroadbeanUsersAllObs=this._SystemSettingService.getBroadbeanUsersAll(this.braodBeanRegistrationCode, pageNo,pageSize,sortingValue).subscribe(
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
getOtherIntegrationCheckstatusForseek() {
  this.loading = true;
  this.IntegrationCheckstatusObs = this._SystemSettingService.getIntegrationCheckstatus(this.seekRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.visibilitySeek = repsonsedata.Data?.Connected;
        if (!this.visibilitySeek) {
          let filteredPeople = this.dataListBoard.filter((item:any) => item.RegistrationCode != this.seekRegistrationCode);
          this.dataListBoard = filteredPeople;
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
 @Who: Adarsh singh
 @When: 25 -APRIL 20223
 @Why: EWM-10428
 @What: For checking broadbean plan type
*/
getBroadbeanPlanType:any;
getbroadbeantenantdetails() {
  this.loading = true;
  this.BroadbeantenantdetailsObs = this._SystemSettingService.getbroadbeantenantdetails(this.braodBeanRegistrationCode).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
        this.getBroadbeanPlanType = data.Data?.PlanType;

        let errArray = [undefined, null, 0, ''];
        if (this.getBroadbeanPlanType === this.planTypeApplicationForm) {
          if (errArray.includes(this.jobFullData?.ApplicationFormId)) {
            // this.openWarningDialog('label_jobIsNotMappedWithApplication', 'label_alert');
            this.isJobMappedWithApplicationForm = true;
          }else{
            this.isJobMappedWithApplicationForm = false;
          }
        }
        else{
          this.isJobMappedWithApplicationForm = false;
        }
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
 @Name: ngOnDestroy
 @Who: Nitin Bhati
 @When: 05-06-2023
 @Why: EWM-12708
 @What: use for unsubsribe service
*/
ngOnDestroy() {
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
  this.IntegrationBoardObs?.unsubscribe(); 
  this.IntegrationCheckstatusObs?.unsubscribe();
  this.BroadbeantenantdetailsObs?.unsubscribe();
  this.BroadbeanUsersAllObs?.unsubscribe();
  this.commonserviceService.onSeekJobPreviewIframeId.next(null);  
  this.commonserviceService.onSeekJobformValidSelectId.next(true);
}


/*
 @Type: File, <ts>
 @Name: getOtherIntegrationCheckstatusForIndeed function
 @Who: Nitin Bhati
 @When: 08-Nov-20223
 @Why: EWM-15083
 @What: For checking Indeed connected or not
*/
getOtherIntegrationCheckstatusForIndeed() {
  this.loading = true;
  this.IntegrationCheckstatusObs = this._SystemSettingService.getIntegrationCheckstatus(this.indeedRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.visibilitySeek = repsonsedata.Data?.Connected;
        if (!this.visibilitySeek) {
          let filteredPeople = this.dataListBoard.filter((item:any) => item.RegistrationCode != this.indeedRegistrationCode);
          this.dataListBoard = filteredPeople;
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
     @Name: onSaveIndeed
     @Who: Nitin Bhati
     @When: 16-Nov-2023
     @Why: EWM-14484
     @What: for Job posting indeed data 
  */
     public onSaveIndeed(){
     this.jobPublishArray['Job'] = {
       "ClientName": this.jobDataById?.job?.clientName,
       "HoldingCompany": this.jobDataById?.job?.holdingCompany,
       "EmailID":this.jobDataById?.job?.emailID,
       "ApplicationURL": this.jobDataById?.job?.applicationURL,
       "ApplicationFormName": this.jobDataById?.job?.applicationFormName,
       "ApplicationFormId": this.jobDataById?.job?.applicationFormId,
       "JobTittle": this.jobDataById?.job?.jobTittle,
       "City":this.jobDataById?.job?.city,
       "State": this.jobDataById?.job?.state,
       "StateId": this.jobDataById?.job?.stateId?this.jobDataById?.job?.stateId:0,
       "Country":this.jobDataById?.job?.country,
       "CountryId": this.jobDataById?.job?.countryId?this.jobDataById?.job?.countryId:0,
       "PostalCode": this.jobDataById?.job?.postalCode,
       "StreetAddress":this.jobDataById?.job?.streetAddress,
       "Category": this.jobDataById?.job?.category,
       "JobType": this.jobDataById?.job?.jobType,
       "JobExpiryDate":this.jobDataById?.job?.jobExpiryDate,
       "Currency":this.jobDataById?.job?.currency,
       "CurrencyId":this.jobDataById?.job?.currencyId?this.jobDataById?.job?.currencyId:0,
       "PayType": this.jobDataById?.job?.payType,
       "PayTypeId": this.jobDataById?.job?.payTypeId?this.jobDataById?.job?.payTypeId:0,
       "SalaryMin": this.jobDataById?.job?.salaryMin?this.jobDataById?.job?.salaryMin:0,
       "SalaryMax":this.jobDataById?.job?.salaryMax?this.jobDataById?.job?.salaryMax:0,
       "JobDescription": this.jobDataById?.job?.jobDescription,
       "IsRemoteJob": this.jobDataById?.job?.isRemoteJob?this.jobDataById?.job?.isRemoteJob:0,
       "WorkplaceType":this.jobDataById?.job?.workplaceType,
       "Experience": [this.jobDataById?.job?.experience],
       "Education": this.jobDataById?.job?.education,
       "ReferenceNumber":this.jobDataById?.jobRefNo,
       "TrackingUrl": this.jobDataById?.job?.trackingUrl,
        
       "AddressLine1": this.jobDataById?.job?.AddressLine1,
       "AddressLine2":this.jobDataById?.job?.AddressLine2,
       "DistrictSuburb": this.jobDataById?.job?.DistrictSuburb,
       "Latitude":this.jobDataById?.job?.Latitude,
       "Longitude": this.jobDataById?.job?.Longitude,
      
       "IsHidePayInformation": this.jobDataById?.job?.isHidePayInformation==true?1:0,
       "JobDescriptionCheck": this.jobDataById?.job?.jobDetailsCheck==true?1:0
     },
     this.jobPublishArray['Id'] = this.jobDataById.indeedId;
     this.jobPublishArray['JobId'] = this.jobDataById.jobId;
     this.jobPublishArray['JobRefNo'] = this.jobDataById.jobRefNo;
      this.loading = true;
      //this.commonserviceService.onSeekJobPublishedSelectId.next(null);
       this._SystemSettingService.createIndeedPosting(this.jobPublishArray).subscribe((repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == 200) {
          this.router.navigate(['/client/jobs/job/job-publish/indeed-published',{jobId:this.jobDataById.jobId,workId:this.workflowId}]);
          localStorage.removeItem("jobById");
          this.jobPublishArray = {};
          this.loading = false;
          this.publishedStatus=false;
          this.snackBService.showIndeedPostSnackBar(this.translateService.instant(repsonsedata.Message), this.workflowId);
          this.commonserviceService.onSeekJobPreviewSelectId.next(null);
          this.addForm.reset();
           } else if (repsonsedata.HttpStatusCode === 400) {
            this.publishedStatus=false;
            this.jobPublishArray = {};
          this.commonserviceService.onJobSeekButtonStatusId.next(false);
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
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
     }

    PreviewSeek(){
      this.previewBtnClick=true;
      this.commonserviceService.onSeekJobPreviewIframeId.subscribe(value => {
        if (value !== null &&  this.previewBtnClick) {
          let jsonObj = value;
          this._SystemSettingService.createSeekJobPostingPreview(value).subscribe(
            (repsonsedata: ResponceData) => {
              if (repsonsedata.HttpStatusCode == '200') {
                this.previewBtnClick=false;
                 /**WHO: Renu @WHEN:13-05-2024 @WHY:EWM-16917 EWM-17052 @WHAT: for preview job posting with url */
                this.previewUrl = repsonsedata.Data.postedPositionProfilePreview.previewUri?.url;
                window.open(this.previewUrl,'_blank');
              }else{
                this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
               }
            }, err => {
               this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
          } 
      });  
     }

}
