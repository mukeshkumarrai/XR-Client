import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Subject, Subscription } from 'rxjs';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { JobDescriptionPopupEditorComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';
import { MapApplicationFormSeekComponent } from '../map-application-form-seek/map-application-form-seek.component';

@Component({
  selector: 'app-job-add-details',
  templateUrl: './job-add-details.component.html',
  styleUrls: ['./job-add-details.component.scss']
})
export class JobAddDetailsComponent implements OnInit {

  public loading: boolean = false;
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
  CategoryRadioId: any;
  public loadingSearch: boolean;
  public loadingSearchS:boolean;

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
  step = 0;
  locationId: any;

  public jobAdTypeList:any=[];
  jobCategoryId: any;

  KeySellingPoint: FormArray;
  brandingList: any;
  sellingPoint: any=[];
  jobPublishArray = {};
  jobId: any;
  jobRefId: any;
  brandingId: any;
  JobCount: any;
  LastJobPostdate: any;
  public userpreferences: Userpreferences;
  userList: any;
  searchListUser: any;
  noRecordFound: string;
  searchValue: string;
  orgId: string;
  ContactName: any;
  ContactPhone: any;
  ContactEmail: any;
  @Input() selectedIndexId:any;
  ClassicSummary: any;
  StandOutSummary: any;
  PremiumSummary: any;
  StandOutId: any;
  PremiumId: any;
  ClassicId: any;
  JobAdId: any;
  public divStatusKey: boolean = false;
  payTypeIntervalCode: string;
  payTypeName: string;
  selected = -1;
  result: string = '';
  workflowId: any;
  jobDataById: any;
  JobTitle: any;
  Location: any;
  selected1: any;
  togglestatus: boolean;
  togglestatusClassic: boolean=false;
  togglestatusStandOut: boolean=false;
  togglestatusPremium: boolean=false;
  togglestatusClassicE: boolean=false;
  togglestatusStandOutE: boolean=false;
  togglestatusPremiumE: boolean=false;
  JobDescription: any;
  public divStatusJobDetails: boolean = false;
  IsHidePayInformation:boolean=false;
  jobDetailsById: string;
  filledCount: number = 0;
  radiofilledCount: number = 0;
  totalfilledCount: number = 0;
  @ViewChildren('textboxes') textboxes: QueryList<ElementRef>;
  filledCount1: number;
  jobTitle: any;
  totalFilledPercentage: number=0;
  DescriptionValue: any = ` `;
  locationName: any;
  selectedIndex: number;
  ownerpatch: string[];
  userContactsList: any;
  SearchUserId: any;
  CategoryName: any;
  PayTypeName: any;
  workType: any;
  payType: any;
  OwnerName: any;
  PublishedOnSeek: any;
  SellingPoints: any;
  JobAd: any;
  ProfileId: any;
  PositionOrganization: any;
  divexpanded: boolean=false;
  textboxes1: any;
  jobCategory: any;
  JobCategory: any;
  JobCategories: any;
  totalCount:number=14;
  SubCategoryName: any;
  JobPostedUri: any;
  VideoPosition: any;
  VideoURL: any;
  payTypeValue: string;
  workTypeValue: any;
  dateStart = new Date(new Date().setDate(new Date().getDate()));
  dateStartNgModel = new Date(new Date().setDate(new Date().getDate()+1));
  dateStartMax = new Date(new Date().setDate(new Date().getDate() + 29));
  dateMax = new Date(new Date().setDate(new Date().getDate() + 29));
  minDate: Date;
  maxDate: Date;
  applyType: any;
  orgType: any;
  seekRegistrationCode: any;
  seekOrganisationId: any;
  descriptionSatus: boolean=false;
  categorySatus: boolean=false;
  subcategorySatus: boolean=false;
  events: any;
  @Output() tabOneEvent = new EventEmitter();
  pattern = new RegExp(
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  );
  public divStatusVideo: boolean = false;
  searchText = '';
  seekCover = "/assets/seek-cover.png";
  JobAdPrice: any;
  JobAdCurrency: any;
  JobAdValueClassic: any;
  JobAdPriceClassic: any;
  JobAdValueStand: any;
  JobAdPriceStand: any;
  JobAdValuePremium: any;
  JobAdPricePremium: any;
  preJobDescription: any;
  ApplyType: any;
  PositionOpeningiId: any;
  updateSekkSelectionStatus: number=0;
  DescriptionValueUncheck: any;
  JobAdPriceStandMessage: any;
  ClassicSummaryInvoice: any;
  StandOutSummaryInvoice: any;
  PremiumSummaryInvoice: any;
  ClassicDescription: string;
  StandOutDescription: string;
  PremiumDescription: string;
  expireDate: number=0;
  classicEnabledIndicator: boolean;
  standOutEnabledIndicator: boolean;
  premiumEnabledIndicator: boolean;
  dirctionalLang;
  AssessmentArray: any;
  linkOutStatus:string;
  applicationFormName: any;
  applicationFormNames: any;
  applicationFormId: any;
  applicationFormURL:string;
  applicationBaseUrl: string;
  ApplyTypeName: any;
  subdomain: string;
  public isHideChip:boolean=true;
  orgTypeLength: any;
dateFormat:any;
getDateFormat:any;
/*-@Nitin Bhati,@when:06-06-2023,@Why:EWM-12708,For calling unsubscribe--*/
  destroy$: Subject<boolean> = new Subject<boolean>();
  SeekIntegrationByIdObs: Subscription;
  SeekApplicationMethodObs: Subscription;
  UpdatedSeekAdSelectionObs: Subscription;
  SeekJobCategorySugestionObs: Subscription;
  SeekJobCategoryWithchildObs: Subscription;
  SeekLocationGeoObs: Subscription;
  SeekAdSelectionObs: Subscription;
  SeekBrandingObs: Subscription;
  SeekAccountUserObs: Subscription;
  PostingseekDetailsObs: Subscription;
  public ParentSource: String;

  constructor(private fb: FormBuilder,private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService,private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,private route: ActivatedRoute,public dialogObj: MatDialog,private commonserviceService: CommonserviceService, private jobService: JobService,private _appSetting: AppSettingsService,
    private appSettingsService: AppSettingsService) { 
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.applicationBaseUrl =  this._appSetting.applicationBaseUrl; 
    this.ParentSource=this._appSetting.SourceCodeParam['Seek'];
    //const reg = '/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/';
    this.ParentSource=this._appSetting.SourceCodeParam['Seek'];
    this.addForm = this.fb.group({
      OrganisationName:[, [Validators.required]],
      ApplyType:[, [Validators.required]],
        // <!-----@suika @whn 14-03-2023 @whyEWM-11175  dynamic date filter validation------------>
      DateExpiry: [, [Validators.required,CustomValidatorService.dateValidator]],
      accountName:['', [Validators.required,Validators.maxLength(255)]],
      jobTitle: ['', [Validators.required,Validators.maxLength(80)]],
      location: ['', Validators.required],
      Category:[[]],
      SubCategory:[[]],
      CategoryRadioId: ['',Validators.required],
      WorkType: ['', Validators.required],
      PayType: ['', Validators.required],
     // PayAdTypeIsCurrent: [''],
      //KeySellingPoint: this.fb.array([this.createItem('')]),
      KeySellingPoint: this.fb.array([]),
      BillingReference: ['',[Validators.maxLength(50)]],
      jobDescription:['', Validators.required],
      jobSummary:['', [Validators.required,Validators.maxLength(150)]],
      SalaryRangeMinimum:['', [Validators.required,Validators.max(999999)]],
      SalaryRangeMaximum:['', [Validators.required,Validators.max(999999)]],
      PayLabel:['', [Validators.maxLength(50)]],
      VideoURL:['',[Validators.pattern(this.pattern)]],
      VideoPosition:[],
      jobDetailsCheck:[false],
      payLabelCheck:[false],
      knockOut:[],
      jobAdType: ['',Validators.required],
      applicationFormNameValue: ['',Validators.required],
    });   
    
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.orgId = localStorage.getItem('OrganizationId');
    this.addForm.controls['jobDescription'].reset();  
    this.getSeekOrganizationById();
    this.getPostingseekDetails();
    this.getSeekJobCategoryWithChild();
     let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.SearchUserId = currentUser?.UserId
    let currentUserName: any = currentUser?.FirstName;
    this.onsearchTeammate(currentUserName);    
    this.loading = true;
    this.route.params.subscribe(
      params => {
        if (params['jobId'] != undefined) {
          this.jobId = params['jobId'];
          this.jobRefId = params['jobRefId'];
          this.workflowId = params['workId'];
          this.PublishedOnSeek = parseInt(params['pub']);
          if(this.PublishedOnSeek===1){
            this.divexpanded=true;
            this.jobId=this.jobId;//this.jobDataById.Id;
            this.editForm(this.jobId);    
             this.totalFilledPercentage=100;
          }else{
            this.getJobDetailsByid(this.jobId);
          }         
        }
      });   
      this.subdomain=localStorage.getItem("tenantDomain");  
      //this.applicationFormURL = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.jobId+'&domain='+this.subdomain+'&source=seek';    
      this.userpreferences = this._userpreferencesService.getuserpreferences();

  this.dateFormat = localStorage.getItem('DateFormat');

  }


  
  /*
   @Type: File, <ts>
   @Name: getJobDetailsByid function
   @Who: Nitin Bhati
   @When: 23-March-2022
   @Why: EWM-5397
   @What: For getting record by id
  */
   getJobDetailsByid(jobId: any) {
    this.loading = true;
    this.jobService.getJobDetailsByid('?JobId='+jobId).subscribe(
      (data: ResponceData) => {
        this.loading = true;
        if (data.HttpStatusCode === 200) {
          this.jobDataById = data.Data;
          this.PublishedOnSeek=this.jobDataById.PublishedOnSeek;
          // if(this.Published===1 || this.Published===2 ){
          //   this.divexpanded=true;
          //   this.jobId=this.jobDataById.Id;
          //   this.editForm(this.jobId);    
          //    this.totalFilledPercentage=100;
          // }
          this.workflowId=this.jobDataById.WorkflowId;
          this.OwnerName=this.jobDataById.OwnerName;
          this.JobTitle = this.jobDataById.JobTitle;
          this.Location=this.jobDataById.Location;
          this.JobDescription=this.jobDataById.JobDescription;
          this.CategoryName=this.jobDataById.CategoryName;
          this.workType=this.jobDataById.JobTypeName;
          this.payType=this.jobDataById.SalaryUnitName;
          this.expireDate = 1;
          this.applicationFormId=this.jobDataById.ApplicationFormId;
          this.applicationFormName=this.jobDataById.ApplicationFormName;
          this.applicationFormNames=this.jobDataById.ApplicationFormName;
          this.addForm.patchValue({
            applicationFormNameValue:this.applicationFormName
          })
          this.loading = false;
          //this.applicationFormURL = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.jobId+'&domain='+this.subdomain+'&applicationId='+this.applicationFormId+'&source=seek';    
     
          this.tabOneEvent.emit({JobTitle:this.JobTitle,Published:this.PublishedOnSeek});
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
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 04-Feb-2022
   @Why: EWM-4980
   @What: For setting value in the edit form
  */
   editForm(Id: Number) {
    this.loading = true;
    this.jobService.getPostedJobdetailsByid('?JobId='+this.jobId+'&JobBoard='+'seek').subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.addForm.controls["ApplyType"].disable();        
          this.addForm.controls["DateExpiry"].disable();    
          let hidePayInformation;
          if (data.Data.IsHidePayInformation == 1) {
            hidePayInformation = true;
          } else {
            hidePayInformation = false;
          }
          this.addForm.patchValue({
            Id: data.Data.BillingReferenceId,
            accountName: data.Data.ContactPerson,
            Currency: data.Data.Currency,
            //Status: data.Data.JobAd,
            Category: data.Data.JobCategory,
            SubCategory: data.Data.JobCategories,
            //CategoryRadioId: data.Data.JobCategory?1:data.Data.JobCategories,
            jobDescription: data.Data.JobDescription,
            JobId: data.Data.JobId,
            KeySellingPoint: data.Data.KeySellingPoints,
            knockOut: data.Data.KnockoutQuestionnaires,
            SalaryRangeMaximum: data.Data.MaximumAmount, 
            SalaryRangeMinimum: data.Data.MinimumAmount,
            PayLabel: data.Data.PayLable,
            PayType: data.Data.PayType, 
            jobTitle: data.Data.PositionTitle,
            jobSummary: data.Data.SearchSummary,
            VideoPosition: data.Data.VideoCode, 
            VideoURL: data.Data.VideoUri,
            WorkType: data.Data.WorkType, 
            BillingReference: data.Data.BillingReferenceId, 
            jobAdType: data.Data.JobAd, 
            OrganisationName: data.Data.organizationid,
            ApplyType: data.Data.ApplicationType,
            jobDetailsCheck: data.Data.QuickJobDetailStatus,
            payLabelCheck: hidePayInformation,
            DateExpiry: new Date(data.Data.JobExpiry),
          });           
          this.JobDescription=data.Data.QuickJobDetail;
          this.DescriptionValueUncheck=data.Data.JobDescription;
          this.ApplyType=data.Data.ApplicationType;
          this.jobTitle=data.Data.PositionTitle;
          this.locationId=data.Data.JobLocation;
          this.jobCategoryId=data.Data.JobCategories;
          this.seekOrganisationId=data.Data.organizationid;
          this.linkOutStatus=data.Data.ApplicationType;
          this.applicationFormId=data.Data.ApplicationFormId;
          this.applicationFormName=data.Data.ApplicationFormName;
          //this.applicationFormURL = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.jobId+'&domain='+this.subdomain+'&applicationId='+this.applicationFormId+'&source=seek';    
     
          this.tabOneEvent.emit({JobTitle:this.jobTitle,Published:this.PublishedOnSeek});
          this.getSeekAdSelection();
         let videovalue= data.Data.VideoUri;
          if(videovalue==''){
            this.divStatusVideo=false;
            this.addForm.get("VideoURL").reset;
           }else{
            this.divStatusVideo=true;
            this.addForm.patchValue({
              'VideoPosition':'Below'
            });
          }
          //this.addForm.controls["ApplyType"].disable();
          //this.getSeekOrganizationById();
          this.onProgressCount(this.addForm.value,'jobcategory'); 
          this.onProgressCount(this.addForm.value,'worktype'); 
          this.onProgressCount(this.addForm.value,'paytype'); 
          this.onProgressCount(this.addForm.value,'jobtype'); 
          this.onProgressCount(this.addForm.value,'description');

          this.onProgressCount(this.addForm.value,'orgName');
          this.onProgressCount(this.addForm.value,'applyType');

          this.getApplyTypeDetails(data.Data.organizationid);
          this.getSeekBrandning(data.Data.organizationid);
          this.seekOrganisationId=data.Data.organizationid;
          // this.addForm.patchValue({
          //   applicationFormNameValue:data.Data.ApplicationFormName
          // })
          if (data?.Data?.ApplicationType==='ApplicationUri') {
            this.addForm.patchValue({
              applicationFormNameValue:data.Data.ApplicationFormName
            })
          }else{
            this.addForm.patchValue({
              applicationFormNameValue:''
            })
            this.addForm.get("applicationFormNameValue").clearValidators();
            this.addForm.get("applicationFormNameValue").markAsPristine();
            this.addForm.get("applicationFormNameValue").updateValueAndValidity();
          }
          if(data.Data.JobCategory!=null){
            this.addForm.patchValue({
              'CategoryRadioId':1
            })
            this.divStatus = true; 
          }else{
            this.addForm.patchValue({
              'CategoryRadioId':data.Data.JobCategories
            })
          }
          this.JobPostedUri=data.Data.JobPostedUri;
          this.JobCategory=data.Data.JobCategory;
          this.JobCategories=data.Data.JobCategories;
          this.getSeekJobCategoryWithChild();
            
          this.addForm.controls["accountName"].disable();
          this.addForm.controls["OrganisationName"].disable();
          this.displayFn(data.Data.PositionLocation);
          this.clickWorkType(data.Data.WorkType);
          this.clickPayType(data.Data.PayType);
          this.locationName=data.Data.PositionLocation;
          this.jobCategoryId=data.Data.JobCategories;
          
          this.JobAdId = data.Data.JobAd;
          
          if(this.JobAdId==='Classic'){
            this.divStatusKey = false;
            this.togglestatusClassic = true;

            this.togglestatusClassicE = true;
            this.togglestatusStandOutE = false;
            this.togglestatusPremiumE = true;
            }else if(this.JobAdId==='StandOut'){
              this.divStatusKey = true;
            this.togglestatusStandOut = true;

            this.togglestatusClassicE = true;
            this.togglestatusStandOutE = true;
            this.togglestatusPremiumE = true;
          }else{
            this.divStatusKey = true;
             this.togglestatusPremium = true; 

             this.togglestatusClassicE = true;
             this.togglestatusStandOutE = true;
             this.togglestatusPremiumE = true;
          }
          if (data.Data.KeySellingPoints.length > 0) {
          //this.divStatusKey=true;
           this.SellingPoints=data.Data.KeySellingPoints;
           this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
            this.SellingPoints.forEach(element => {
            this.KeySellingPoint.push(
              this.fb.group({
                name:[element,Validators.maxLength(80)]
              })
            )
          });
        }

          this.ProfileId=data.Data.ProfileId;
          this.PositionOpeningiId=data.Data.PositionOpeningiId;
          this.JobAdPrice=data.Data.JobadCost;
          this.JobAdCurrency=data.Data.JobadCostCurrency;
          this.PositionOrganization=data.Data.PositionOrganization;
          this.locationId=data.Data.JobLocation;
          this.getSeekLocation(data.Data.PositionLocation);
          this.addForm.patchValue({
            'location':data.Data.PositionLocation
          })
          this.getSeekJobCategorySugestion(this.locationId);
          this.DescriptionValue=data.Data.JobDescription;
          this.JobTitle = data.Data.PositionTitle;
          this.jobRefId = data.Data.JobReferenceId;
          this.brandingId = data.Data.BrandingURL;
          this.onBranding('',this.brandingId);
          this.totalFilledPercentage=100;
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

  createItem(jobAdType) {
    // if(jobAdType==='Classic'){
    //   return this.fb.group({
    //     name: ['']
    //   })
    // }else{
    //   return this.fb.group({
    //     name: ['']
    //   })
    // }
    return this.fb.group({
      name: ['',Validators.maxLength(80)]
    })
    
  }

  /*
 @Type: File, <ts>
 @Name: getSeekLocation function
 @Who: Nitin Bhati
 @When: 04-Feb-2022
 @Why: EWM-4980
 @What: For showing the list of seek Location data
*/
getSeekLocation(searchVal:string) {
  this.loadingSearch = true; 
  if (searchVal=='') {
    this.addForm.get("CategoryRadioId").reset();
     this.divStatus = false; 
    return;
  };
  if (searchVal.length >= 0 && searchVal.length <= 3) {
    this.loadingSearch = false;
    this.searchDataList=[];  
    this.addForm.get("CategoryRadioId").reset();
     this.divStatus = false; 
    return;
  };
  this.UpdatedSeekAdSelectionObs = this._SystemSettingService.getSeekLocationList(searchVal,this.seekOrganisationId).subscribe(
    (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loadingSearch = false;
        if (repsonsedata.Data) {
          this.loadingSearch = false;
           this.searchDataList = repsonsedata.Data.locationSuggestions;
          }
      }
      else {
        this.loadingSearch = false;
       //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loadingSearch = false;
      //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
displayFn(user) {
  if(user?.location==undefined){
    return user;
  }else{
    return user ? user.location.contextualName : undefined;
  }
 
//return user ? user.location.contextualName : undefined;
}
getSeekJobCategorySugestion(event: MatAutocompleteSelectedEvent) {
   if(event.option!=undefined){
    this.locationId=event.option.value.location.id.value;
    this.locationName=event.option.value.location.contextualName;
  }
  let jobTitle=this.addForm.get("jobTitle").value;
 //this.locationId=event.option.value.location.id.value;
 
  this.loading = true;
  if (jobTitle=='' ) {
    this.loading = false;
    return;
  }
  this.SeekJobCategorySugestionObs = this._SystemSettingService.getSeekJobCategorySugestion(jobTitle,this.locationId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.categorySugestionDataList = repsonsedata.Data.jobCategorySuggestions;
           this.jobSugestionlength = repsonsedata.Data.jobCategorySuggestions.length - 1;

          //  if(this.locationId!=undefined && this.jobCategoryId!=undefined){
          //   this.getSeekAdSelection();
          // }  
          if(this.jobTitle!=undefined && this.locationId!=undefined && this.jobCategoryId!=undefined){
            this.getSeekAdSelection();
          }
          //  this.categoryWithParentDataList=[];
          //  this.categoryWithChildDataList=[];
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
getSeekJobCategorySugestionDetectLocation(value) {
  this.divStatus = false;  
  this.radiocountArray
  const index = this.radiocountArray.findIndex(x => x.types == 'jobcategory');
  if (index>= 0) {
    this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
    this.radiofilledCount=this.radiofilledCount-1;    
    this.totalfilledCount=this.filledCount+this.radiofilledCount;
    this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
  }
 
 this.addForm.get("CategoryRadioId").reset();
 this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
 let jobTitle=this.addForm.get("jobTitle").value;
 if (jobTitle=='' ) {
  this.loading = false;
  return;
}
  this.SeekJobCategorySugestionObs = this._SystemSettingService.getSeekJobCategorySugestion(jobTitle,this.locationId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
           this.categorySugestionDataList = repsonsedata.Data.jobCategorySuggestions;
           this.jobSugestionlength = repsonsedata.Data.jobCategorySuggestions.length - 1;
          //  this.categoryWithParentDataList=[];
          //  this.categoryWithChildDataList=[];
           }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
getSeekJobCategoryWithChild() {
  let jobTitle=this.addForm.get("jobTitle").value;
  this.SeekJobCategoryWithchildObs = this._SystemSettingService.getSeekJobCategoryWithchild().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
           this.categoryWithParentDataList = repsonsedata?.Data?.jobCategories;
          //  if (this.JobCategory != undefined && this.JobCategory != '') {
          //    this.onParentChildchangePatch(this.JobCategory,this.categoryWithParentDataList);
          //  }
           this.onParentChildchangePatch(this.JobCategory,this.categoryWithParentDataList);
           
           }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
onParentChildchange(dataId) {
  let CategoryData = this.categoryWithParentDataList?.filter((dl: any) => dl.id.value == dataId);
   this.jobCategory=dataId;//data.id.value;
   //this.categorySatus=false;
  this.addForm.get("SubCategory").reset();
  this.subcategorySatus=true;
  this.categoryWithChildDataList=CategoryData[0]?.children;
  //this.getSeekAdSelection();
  //this.onProgressCount(this.addForm.value,'jobcategory'); 
   }

   onParentChildchangeNext(dataId) {
     this.subcategorySatus=false;
    this.jobCategoryId=dataId;//data.id.value;
    let SubCategoryData = this.categoryWithChildDataList?.filter((dl: any) => dl.id.value == this.jobCategoryId);
    this.SubCategoryName=SubCategoryData[0]?.name;
    this.onProgressCount(this.addForm.value,'jobcategory'); 
    this.getSeekAdSelection();
    
    }

    onParentChildchangePatch(dataId,categoryWithParentDataList) {
      let CategoryData = categoryWithParentDataList?.filter((dl: any) => dl.id.value == dataId);
      this.jobCategory=dataId;//data.id.value;
      this.addForm.get("SubCategory").reset();
      this.categoryWithChildDataList=CategoryData[0]?.children;
      this.addForm.patchValue({
        'SubCategory':this.JobCategories
      });
      let SubCategoryData = this.categoryWithChildDataList?.filter((dl: any) => dl.id.value == this.JobCategories);
      this.SubCategoryName=SubCategoryData[0]?.name;
      this.getSeekAdSelection();
      }
 /*
     @Type: File, <ts>
     @Name: clickCategorryRadio
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for hide and show div
  */
     public clickCategorryRadio(accessData: any,data) {
         this.CategoryRadioId = accessData;
        if (accessData === 1) {
          this.divStatus = true;  
          this.addForm.get("Category").reset();
          this.addForm.get("SubCategory").reset();
          this.addForm.get('Category').setValidators(Validators.required);
          this.addForm.get('SubCategory').setValidators(Validators.required);
          this.addForm.patchValue({
            'CategoryRadioId':1
          }); 
         this.radiocountArray
        const index = this.radiocountArray.findIndex(x => x.types == 'jobcategory');
        if (index>= 0) {
        this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
        this.radiofilledCount=this.radiofilledCount-1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
        this.commonserviceService.onSeekJobformValidSelectId.next(true);
         }else{
          this.commonserviceService.onSeekJobformValidSelectId.next(true);
         }
         }else {
          this.divStatus = false;  
          this.addForm.get("Category").reset();
          this.addForm.get("SubCategory").reset();
          this.addForm.get('Category').clearValidators();
          this.addForm.get('Category').updateValueAndValidity();
          this.addForm.get("Category").markAsPristine();
          this.addForm.get('SubCategory').clearValidators();  
          this.addForm.get('SubCategory').updateValueAndValidity();
          this.addForm.get("SubCategory").markAsPristine();
          this.addForm.patchValue({
          'CategoryRadioId':data.jobCategory.id.value
        })
         this.jobCategoryId=data?data.jobCategory.id.value:''; 
         this.getSeekAdSelection();   
         this.onProgressCount(this.addForm.value,'jobcategory'); 
      }
    }
 /*
     @Type: File, <ts>
     @Name: detectLocation
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing location using lat long 
  */
    detectLocation() {
      this.loading = true;
      //this.addForm.get("CategoryRadioId").reset();
      this.divLoopStatus == 2;  
      this.getPosition()
        .then((position) => {
         if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.SeekLocationGeoObs = this._SystemSettingService.getSeekLocationGeo(this.lat,this.lng).subscribe(
            (repsonsedata: ResponceData) => {
              if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                 if (repsonsedata.Data) {
                   this.loading = false;
                    this.searchDataList=[];
                    this.divStatus = false;   
                    let location={
                    'id': {
                      'value': repsonsedata.Data.nearestLocations[0]?.id.value
                    },
                    'name': 'string',
                    'contextualName': repsonsedata.Data.nearestLocations[0]?.contextualName,
                    'countryCode': 'string',
                    'parent': {
                      'id': {
                        'value': 'string'
                      },
                      'name': 'string',
                      'contextualName': 'string',
                      'countryCode': 'string'
                    }
                  }
                  this.searchDataList.push({location: location});
                  this.searchVal=repsonsedata.Data.nearestLocations[0]?.contextualName;
                 // this.searchUserCtrl.setValue({location: location});
                  this.locationName=repsonsedata.Data.nearestLocations[0]?.contextualName;
                  this.addForm.patchValue({
                    'location':repsonsedata.Data.nearestLocations[0]?.contextualName
                  });
                  this.locationId=repsonsedata.Data.nearestLocations[0]?.id.value;
                  this.getSeekJobCategorySugestionDetectLocation(repsonsedata.Data.nearestLocations[0]?.id.value)
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
            })
          .catch((err) => {
            this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant('label_userDeniedLocation'), err.StatusCode);
        });     
    }
/*
     @Type: File, <ts>
     @Name: getPosition
     @Who: Nitin Bhati
     @When: 27-March-2022
     @Why: EWM-4980
     @What: for fetching get location
  */
    getPosition(options?: PositionOptions): Promise<any> {
      return new Promise((resolve, reject) =>   
          navigator.geolocation.getCurrentPosition(resolve, reject, options) 
      ); 
  }
/*
     @Type: File, <ts>
     @Name: setStep
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for step
  */
    setStep(index: number) {
      this.step = index;
    }
  /*
     @Type: File, <ts>
     @Name: nextStep
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for next index tab
  */
    nextStep() {
      this.step++;
    }
  /*
     @Type: File, <ts>
     @Name: prevStep
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for previous index tab
  */
    prevStep() {
      this.step--;
    }
 /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
    getSeekAdSelection() {
      this.jobTitle=this.addForm.get("jobTitle").value;
      let locationId=this.locationId;
      let jobCategoryId=this.jobCategoryId;
      this.SeekAdSelectionObs=this._SystemSettingService.getSeekAdSelection('?jobTitle=' + this.jobTitle + '&locationId=' + this.locationId + '&jobCategoryId=' + this.jobCategoryId+ '&organizationId='+this.seekOrganisationId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Data) {
               this.jobAdTypeList = repsonsedata.Data.SeekAnzHirerAdvertisementCreationProducts;
              this.ClassicSummary=this.jobAdTypeList?this.jobAdTypeList[0]?.Price.Summary:'';
              this.StandOutSummary=this.jobAdTypeList?this.jobAdTypeList[1]?.Price.Summary:'';
              this.PremiumSummary=this.jobAdTypeList?this.jobAdTypeList[2]?.Price.Summary:'';
              this.ClassicDescription=this.jobAdTypeList?this.jobAdTypeList[0]?.Description:'';
              this.StandOutDescription=this.jobAdTypeList?this.jobAdTypeList[1]?.Description:'';
              this.PremiumDescription=this.jobAdTypeList?this.jobAdTypeList[2]?.Description:'';
              this.ClassicSummaryInvoice=this.jobAdTypeList?this.jobAdTypeList[0]?.CheckoutEstimate?.Summary:'';
              this.StandOutSummaryInvoice=this.jobAdTypeList?this.jobAdTypeList[1]?.CheckoutEstimate?.Summary:'';
              this.PremiumSummaryInvoice=this.jobAdTypeList?this.jobAdTypeList[2]?.CheckoutEstimate?.Summary:'';
              this.JobAdValueClassic=this.jobAdTypeList?this.jobAdTypeList[0]?.Price.AmountExcludingTax?.Currency:'';
              this.JobAdPriceClassic=this.jobAdTypeList?this.jobAdTypeList[0]?.Price.AmountExcludingTax?.Value:'';
              this.JobAdValueStand=this.jobAdTypeList?this.jobAdTypeList[1]?.Price.AmountExcludingTax?.Currency:'';
              this.JobAdPriceStand=this.jobAdTypeList?this.jobAdTypeList[1]?.Price.AmountExcludingTax?.Value:'';
              this.JobAdValuePremium=this.jobAdTypeList?this.jobAdTypeList[2]?.Price.AmountExcludingTax?.Currency:'';
              this.JobAdPricePremium=this.jobAdTypeList?this.jobAdTypeList[2]?.Price.AmountExcludingTax?.Value:'';
              this.ClassicId=this.jobAdTypeList?this.jobAdTypeList[0]?.AdvertisementTypeCode:'';
              this.StandOutId=this.jobAdTypeList?this.jobAdTypeList[1]?.AdvertisementTypeCode:'';
              this.PremiumId=this.jobAdTypeList?this.jobAdTypeList[2]?.AdvertisementTypeCode:'';
              this.classicEnabledIndicator=this.jobAdTypeList?this.jobAdTypeList[0]?.EnabledIndicator:'';
              this.standOutEnabledIndicator=this.jobAdTypeList?this.jobAdTypeList[1]?.EnabledIndicator:'';
              this.premiumEnabledIndicator=this.jobAdTypeList?this.jobAdTypeList[2]?.EnabledIndicator:'';
               }
          } else {
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
    
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
    /*
     @Type: File, <ts>
     @Name: onCurrentPayAdDetails
     @Who: Nitin Bhati
     @When: 28-March-2022
     @Why: EWM-3759
     @What: for showing Job add type
  */
    onCurrentPayAdDetails(enable: boolean,index,jobAdId,data){
      
        if(this.PublishedOnSeek===1 || this.PublishedOnSeek===2 ){
          if(this.JobAdId=='Classic'){
              if(jobAdId=='StandOut'){
                this.divStatusKey = true;
                this.togglestatusClassic = false;
                this.togglestatusStandOut = true;
                this.togglestatusPremium = false;

                this.togglestatusClassicE = false;
                this.togglestatusStandOutE = true;
                this.togglestatusPremiumE = true;   
                this.getUpdateSeekAdSelection();           
                this.updateSekkSelectionStatus=1;
                this.onProgressCount(this.addForm.value,'jobtype');  
               
              }else{
                this.updateSekkSelectionStatus=0;
                this.getSeekAdSelection();
                this.onProgressCount(this.addForm.value,'jobtype');  
               
                this.divStatusKey = false;
                this.togglestatusClassic = true;
                this.togglestatusPremium = false;
                this.togglestatusStandOut = false;
               
                this.togglestatusClassicE = true;
                this.togglestatusPremiumE = true;
                this.togglestatusStandOutE = false;
              }          
            }
          }else{       
          this.JobAdId=jobAdId;
          this.addForm.patchValue({
              'jobAdType':jobAdId
          });
          this.onProgressCount(this.addForm.value,'jobtype');  
          if(data==='Classic'){  
            this.JobAdCurrency=this.JobAdValueClassic;
            this.JobAdPrice=this.JobAdPriceClassic;
          this.selected1 = index;
          this.togglestatusClassic = true;
          this.togglestatusPremium = false;
          this.togglestatusStandOut = false;
          this.divStatusKey = false;

          this.togglestatusClassicE = true;
          this.togglestatusPremiumE = false;
          this.togglestatusStandOutE = false;
          this.onProgressCount(this.addForm.value,'jobtype');  
         
          this.sellingPoint=[{name: "1"},{name: "2"},{name: "3"}];
           this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
          this.KeySellingPoint.clear();
          this.sellingPoint.forEach(element => {
            this.KeySellingPoint.push(this.createItem('Classic'));
          });
          let formControl : FormControl = this.addForm.get("KeySellingPoint") as FormControl;
          formControl.clearValidators();
          formControl.setValidators(null);
          formControl.updateValueAndValidity();
           //this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid); 
           this.totalCount=14;
           this.onProgressCount(this.addForm.value,'jobtype');           
          } else if(data==='Premium'){
            this.JobAdCurrency=this.JobAdValuePremium;
            this.JobAdPrice=this.JobAdPricePremium;
          this.selected1 = index;
          this.togglestatusPremium = true;
          this.togglestatusClassic = false;
          this.togglestatusStandOut = false;
          this.divStatusKey = true;
          this.togglestatusPremiumE = true;
          this.togglestatusClassicE = false;
          this.togglestatusStandOutE = false;
         
          this.sellingPoint=[{name: "1"},{name: "2"},{name: "3"}];
           this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
          this.KeySellingPoint.clear();
          this.sellingPoint.forEach(element => {
            this.KeySellingPoint.push(this.createItem(''));
          });
          this.totalCount=14;
          this.onProgressCount(this.addForm.value,'jobtype');      
         // this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);         
         } 
         else{
          this.JobAdCurrency=this.JobAdValueStand;
          this.JobAdPrice=this.JobAdPriceStand;
           this.selected1 = index;
          this.togglestatusPremium = false;
          this.togglestatusClassic = false;
          this.togglestatusStandOut = true;
          this.divStatusKey = true;        
          this.togglestatusPremiumE = false;
          this.togglestatusClassicE = false;
          this.togglestatusStandOutE = true;
          this.sellingPoint=[{name: "1"},{name: "2"},{name: "3"}];
           this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
          this.KeySellingPoint.clear();
          this.sellingPoint.forEach(element => {
            this.KeySellingPoint.push(this.createItem(''));
          });
          this.totalCount=14;
          this.onProgressCount(this.addForm.value,'jobtype');        
         // this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);     
         
          }     
        }
      }
  /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
     getSeekBrandning(seekorganizationId) {
      this.loading = true;
     this.SeekBrandingObs = this._SystemSettingService.getSeekBranding(seekorganizationId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.loading = false;
            if (repsonsedata.Data) {
               this.brandingList = repsonsedata.Data.AdvertisementBrandings.Edges;
               }
          } else {
            this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }    
    public onBranding(index: any,id:any){
      this.brandingId = id;
      this.selected = index;
      this.onCategoryProgressCount();
      }
 /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
     onsearchTeammate(inputValue: string) {
      if (inputValue.length === 0) {
        this.noRecordFound = "";
        this.searchListUser = [];
      }
      if (inputValue.length > 3) {
       this.loadingSearchS = true;
        this.searchValue = inputValue;
        this.SeekAccountUserObs=this._SystemSettingService.getSeekAccountUser("?Search=" + inputValue + "&OrganizationId=" + this.orgId).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loadingSearchS = false;
              this.searchListUser = repsonsedata.Data;
              this.userContactsList = this.searchListUser?.filter((e: any) => e.UserId === this.SearchUserId);
              this.AddSelectTeammate(this.userContactsList,'','loginUser')
              this.noRecordFound = "";
              // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
             }
            else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
             this.loadingSearchS = false;
              this.noRecordFound = repsonsedata.Message;
              this.searchListUser = [];
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            }
            else {
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
              this.loadingSearchS = false;
              this.noRecordFound = "";
             }
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
             this.noRecordFound = ""
          }) 
      }
    }
   public AddSelectTeammate(data:any,searchname:any,login:any) {
     if(login=='loginUser'){
      this.searchValue = data[0]?.UserName;
      this.ContactName = data[0]?.UserName;
      this.ContactPhone  = data[0]?.MobileNumber;
      this.ContactEmail = data[0]?.EmailId;
      this.addForm.patchValue({
      'accountName':data[0]?.UserName
    })
     }else{
      this.searchValue = searchname;
      this.ContactName = data.UserName;
      this.ContactPhone  = data.MobileNumber;
      this.ContactEmail = data.EmailId;
     }
      
   }
 /*
     @Type: File, <ts>
     @Name: clickWorkType
     @Who: Nitin Bhati
     @When: 11-Feb-2022
     @Why: EWM-3759
     @What: for work type
  */
   public clickWorkType(workTypes:any){
    this.workTypeValue=workTypes;
    this.onProgressCount(this.addForm.value,'worktype');
  }
 /*
     @Type: File, <ts>
     @Name: clickPayType
     @Who: Nitin Bhati
     @When: 11-feb-2022
     @Why: EWM-3759
     @What: for pay type
  */
   public clickPayType(payTypeValue:any){
    if(this.PublishedOnSeek===0){
      this.addForm.get("SalaryRangeMinimum").reset();
      this.addForm.get("SalaryRangeMaximum").reset();
      this.totalfilledCount=this.totalfilledCount-2;
    } 
    
    if(payTypeValue==='Hourly'){
      this.payTypeValue='Hourly';
      this.payTypeName='Hourly rate';
      this.payTypeIntervalCode='Hour'; 
     }else if(payTypeValue==='Salaried'){
      this.payTypeValue='Salaried';
      this.payTypeName='Annual salary';
      this.payTypeIntervalCode='Year';
    }else{
      this.payTypeValue='SalariedPlusCommission';
      this.payTypeName='Annual and comission';
      this.payTypeIntervalCode='Year';
    }
    this.onProgressCount(this.addForm.value,'paytype');
  }
     /*
     @Type: File, <ts>
     @Name: getPostingseekDetails
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
     getPostingseekDetails() {
      this.loading = true;
      this.PostingseekDetailsObs= this._SystemSettingService.getPostingseekDetails().subscribe(
         (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
             this.loading = false;
             if (repsonsedata.Data) {
                this.getPostingseekDetails = repsonsedata.Data;
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
 /*
     @Type: File, <ts>
     @Name: conditionChcek
     @Who: Nitin Bhati
     @When: 13-Dec-2022
     @Why: EWM-3759
     @What: for validate maximum salary and minimum salary
  */
     conditionChcek() {
     let paytype= this.addForm.get("PayType").value;
      let SalaryRangeMinimum = Number(this.addForm.get("SalaryRangeMinimum").value);
      let SalaryRangeMaximum = Number(this.addForm.get("SalaryRangeMaximum").value); 
      let diffrenceValue=SalaryRangeMaximum-SalaryRangeMinimum;     
         if(paytype==='Salaried'){
            if (SalaryRangeMaximum >= SalaryRangeMinimum) {
                if(SalaryRangeMinimum<100000){
                    if(diffrenceValue>=100000){
                         this.addForm.get("SalaryRangeMaximum").setErrors({ diffcheck: true });
                        this.addForm.get("SalaryRangeMaximum").markAsDirty();
                      }else{
                        this.addForm.get("SalaryRangeMaximum").clearValidators();
                        this.addForm.get("SalaryRangeMaximum").markAsPristine();
                        this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required,Validators.max(999999)]);               
                      }
                }else{
                  if(diffrenceValue>=999999){
                    this.addForm.get("SalaryRangeMaximum").setErrors({ diffGreaterThan: true });
                    this.addForm.get("SalaryRangeMaximum").markAsDirty();
                  }else{
                    this.addForm.get("SalaryRangeMaximum").clearValidators();
                    this.addForm.get("SalaryRangeMaximum").markAsPristine();
                    this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required,Validators.max(999999)]);               
                  }
                }
                } else {
                this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
                this.addForm.get("SalaryRangeMaximum").markAsDirty();
              } 

         }else if(paytype==='Hourly'){
          if (SalaryRangeMaximum >= SalaryRangeMinimum) {
                if(diffrenceValue>=100){
                    this.addForm.get("SalaryRangeMaximum").setErrors({ diffMinBelowFiftyHour: true });
                    this.addForm.get("SalaryRangeMaximum").markAsDirty();
                  }else{
                    this.addForm.get("SalaryRangeMaximum").clearValidators();
                    this.addForm.get("SalaryRangeMaximum").markAsPristine();
                    this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required,Validators.max(999999)]);               
                  }
            } else {
            this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
            this.addForm.get("SalaryRangeMaximum").markAsDirty();
          } 
         }else{
          if(SalaryRangeMaximum >= SalaryRangeMinimum){
            this.addForm.get("SalaryRangeMaximum").clearValidators();
            this.addForm.get("SalaryRangeMaximum").markAsPristine();
            this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required,Validators.max(999999)]);
          }else{
            this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
            this.addForm.get("SalaryRangeMaximum").markAsDirty();
          }
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
     public onSave(value){
      this.jobPublishArray['jobType'] = 'seek';
       this.jobPublishArray['PositionTitle'] = value.jobTitle;
       this.jobPublishArray['PayType'] = {
        "Code": this.payTypeValue,//value.PayType,
        "Name": this.payTypeName,
        "IntervalCode":this.payTypeIntervalCode
      },
      this.jobPublishArray['MinimumAmount'] = parseInt(value.SalaryRangeMinimum);
      this.jobPublishArray['MaximumAmount'] = parseInt(value.SalaryRangeMaximum);
      this.jobPublishArray['Contact']= {
        "Name": this.ContactName,
        "Phone": this.ContactPhone?this.ContactPhone:'null',
        "Email": this.ContactEmail
      },
      this.jobPublishArray['JobCategoriesId'] = this.jobCategoryId;
      this.jobPublishArray['PositionLocationId'] = this.locationId;

      this.jobPublishArray['PositionLocation'] = this.locationName;
     
      this.jobPublishArray['JobAd'] = value.jobAdType;//this.JobAdId;
      this.jobPublishArray['SearchSummary'] = value.jobSummary;
      this.jobPublishArray['JobDetail'] = value.jobDescription;
      this.jobPublishArray['PayTypeDescription'] = [value.PayLabel]?[value.PayLabel]:[];
      this.jobPublishArray['BrandingID'] = this.brandingId?this.brandingId:'';
      let keySelling=[];
      value.KeySellingPoint.forEach(element => {
        keySelling.push(element.name);
      });
      this.jobPublishArray['KeySellingPoint'] = keySelling?keySelling:[];
      this.jobPublishArray['JobRefrenceID'] = this.jobRefId?this.jobRefId:'0';
      this.jobPublishArray['JobID'] = this.jobId;
      this.jobPublishArray['BillingRefrenceID'] = value.BillingReference;
      this.jobPublishArray['WorkTypeCode'] = this.workTypeValue;//value.WorkType;
      if(value.VideoURL===''){
        this.VideoPosition=null;
      }else{
        this.VideoPosition=value.VideoPosition;
      }

      if(value.VideoPosition===null){
        this.VideoURL='';
      }else{
        this.VideoURL=value.VideoURL;
      }
      this.jobPublishArray['SeekVideo']= {
        "Url": this.VideoURL,
        "SeekAnzPositionCode": this.VideoPosition
      }
      // this.jobPublishArray['SeekVideo']= {
      //   "Url": value.VideoURL,
      //   "SeekAnzPositionCode": value.VideoPosition
      // }
      this.jobPublishArray['togglestatusClassic'] = this.togglestatusClassic;
      this.jobPublishArray['togglestatusStandOut'] = this.togglestatusStandOut;
      this.jobPublishArray['togglestatusPremium'] = this.togglestatusPremium;
      this.jobPublishArray['selected'] = this.brandingId;
      this.jobPublishArray['knockOut'] = value.knockOut;
      this.jobPublishArray['Category'] = this.jobCategory;//value.Category;
      this.jobPublishArray['SubCategory'] = this.SubCategoryName?this.SubCategoryName:'';
      this.jobPublishArray['CategoryRadio'] = value.CategoryRadioId;  
      this.jobPublishArray['totalFilledPercentage'] = this.totalFilledPercentage; 
      this.jobPublishArray['WorkflowId'] = this.workflowId;
      this.jobPublishArray['divStatusKey'] = this.divStatusKey;

      this.jobPublishArray['ProfileId'] = this.ProfileId;
      this.jobPublishArray['Published']=this.PublishedOnSeek;
      this.jobPublishArray['PositionOrganization'] = this.PositionOrganization;
      this.jobPublishArray['JobCategory'] = this.jobCategory;
      this.jobPublishArray['JobPostedUri'] = this.JobPostedUri; 

      this.jobPublishArray['OrganizationId'] = this.seekOrganisationId;//value.OrganisationName;
      this.jobPublishArray['SeekJobApplicationMethods'] = value.ApplyType?value.ApplyType:this.ApplyType; 

      this.ApplyTypeName=value.ApplyType?value.ApplyType:this.ApplyType;
     if (this.ApplyTypeName === 'ApplicationUri') {
      this.jobPublishArray['ApplicationFormId'] = this.applicationFormId;
      this.jobPublishArray['ApplicationFormName'] = this.applicationFormName; 
      this.applicationFormURL = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.jobId+'&domain='+this.subdomain+'&Source='+this.ParentSource+'&parentSource='+this.ParentSource;    
      this.jobPublishArray['ApplicationFormURL'] = this.applicationFormURL;
    } 

      // this.jobPublishArray['ApplicationFormId'] = this.applicationFormId;
      // this.jobPublishArray['ApplicationFormName'] = this.applicationFormName; 
      // this.jobPublishArray['ApplicationFormURL'] = this.applicationFormURL;
      const d = new Date(value.DateExpiry)
     // This will return an ISO string matching your local time.
     // this.jobPublishArray['JobExpiryDate'] = value.DateExpiry;
     let divStatusJobDetails;
     if (this.divStatusJobDetails == true) {
      divStatusJobDetails = 1;
    } else {
      divStatusJobDetails = 0;
    }
     this.jobPublishArray['DefaultJobDetail'] = {
      "JobDetail": this.preJobDescription?this.preJobDescription:'',//value.PayType,
      "JobDetailStatus": divStatusJobDetails
    },
    this.jobPublishArray['JobAdCost'] = this.JobAdPrice;
    this.jobPublishArray['Currency'] = this.JobAdCurrency?this.JobAdCurrency:'0';
    this.jobPublishArray['PositionOpeningiId'] = this.PositionOpeningiId;
     
    this.jobPublishArray['updateSekkSelectionStatus']=this.updateSekkSelectionStatus;
    let IsHidePayInformation;
    if (this.addForm.get("payLabelCheck").value == true) {
      IsHidePayInformation = 1;
    } else {
      IsHidePayInformation = 0;
    }
    this.jobPublishArray['IsHidePayInformation']=IsHidePayInformation;
    this.jobPublishArray['JobExpiryDate'] =  new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset())?.toISOString();
      this.commonserviceService.onSeekJobPreviewSelectId.next(this.jobPublishArray);
      this.selectedIndex=2;
      }

/*
     @Type: File, <ts>
     @Name: openPopupForPostResponse
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: for posting seek data 
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
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: Redirect to job landing page
  */
    oncancel(){
      this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
    }
/*
     @Type: File, <ts>
     @Name: onJobTitleChange
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: For seek advertise selection
  */
    onJobTitleChange(searchVal:any){
      if (searchVal.length < 3 ) {
        this.searchDataList=[];   
      }
      if(this.locationId!= undefined){
        this.getSeekJobCategorySugestionDetectLocation(this.locationId);
      }
      if(this.locationId!=undefined && this.jobCategoryId!=undefined){
        this.getSeekAdSelection();
      }       
    }
    onJobDetails(){
     let jobcheck =this.addForm.get("jobDetailsCheck").value;
      if(jobcheck===false){
        this.preJobDescription=this.JobDescription;//this.jobDataById.JobDescription;
        this.DescriptionValue=this.JobDescription;//this.jobDataById.JobDescription;
        this.divStatusJobDetails=true;
        this.descriptionSatus=false;
        this.addForm.patchValue({
        jobDescription: this.JobDescription
        });
        this.onProgressCount(this.addForm.value,'description'); 
      }else{
        // this.addForm.controls['jobDescription'].reset();
        //this.DescriptionValue = ` `;
        this.divStatusJobDetails=false;
           if(this.DescriptionValueUncheck == undefined){
            this.divStatusJobDetails=false;
            this.descriptionSatus=true;
            this.addForm.controls['jobDescription'].reset();
            this.DescriptionValue = ` `;
            this.radiocountArray
          const index = this.radiocountArray.findIndex(x => x.types == 'description');
          if (index>= 0) {
          this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
          this.radiofilledCount=this.radiofilledCount-1;
          this.totalfilledCount=this.filledCount+this.radiofilledCount;
          this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
          this.commonserviceService.onSeekJobformValidSelectId.next(true);
           }else{
            this.commonserviceService.onSeekJobformValidSelectId.next(true);
           }
           }else{
            this.descriptionSatus=false;
            this.DescriptionValue=this.DescriptionValueUncheck;
            this.divStatusJobDetails=false;
          this.addForm.patchValue({
            jobDescription: this.DescriptionValue
          });
          this.onProgressCount(this.addForm.value,'description');
           }
          }
    }
/* 
    @Type: File, <ts>
    @Name: input function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
    input(value) {
      if(value?.jobTitle==''){
        this.addForm.get("CategoryRadioId").reset();
        this.divStatus = false; 
        return;
        };
        this.filledCount = this.textboxes?.filter(t => t.nativeElement.value).length;       
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
         this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
         this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        if(this.addForm.invalid===false){
          this.totalFilledPercentage=100;
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          this.onSave(this.addForm.getRawValue());
       }else{
        this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
      } 
    }
  /* 
    @Type: File, <ts>
    @Name: inputwithoutValidation function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
    inputwithoutValidation(value) {
       //this.textboxes.filter(t => t.nativeElement.value).length;
     // this.onSave(value);
     this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      if(this.addForm.invalid===false){
         this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
         this.onSave(value);
      }
     }
   /* 
    @Type: File, <ts>
    @Name: onProgressCount function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
    radiocountArray=[];
    onProgressCount(value,types){
       const index = this.radiocountArray.findIndex(x => x.types == types);
       if (index>= 0) {
       }
      else {
        this.radiocountArray.push({types});
        this.radiofilledCount=this.radiofilledCount+1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
       }
       this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      if(this.addForm.invalid===false){
        this.totalFilledPercentage=100;
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        this.onSave(this.addForm.getRawValue());
        }else{
          this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
        }      
     }

    // radiocountArray=[];
    onCategoryProgressCount(){
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      if(this.addForm.invalid===false){
        this.totalFilledPercentage=100;
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        this.onSave(this.addForm.getRawValue());
        }else{
          this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
        }      
     }
    /* 
    @Type: File, <ts>
    @Name: openDialogforDescription function
    @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
    @What:Dialog for html Editor for description
   */
 openDialogforDescription() {
    const dialogRef = this.dialogObj.open(JobDescriptionPopupEditorComponent, {
      // maxWidth: "750px",
      data: { DescriptionData: this.DescriptionValue, },
      panelClass: ['xeople-modal-md', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(DescriptionData => {
      if (DescriptionData == ' ') {
        this.descriptionSatus=true;
       } else {
        this.descriptionSatus=false;
        this.addForm.patchValue({
          jobDescription: DescriptionData
        });
        this.DescriptionValue = DescriptionData;
        this.DescriptionValueUncheck = DescriptionData;
        this.onProgressCount(this.addForm.value,'description'); 
       // this.addForm.controls['jobDescription'].setErrors({ 'required': true });
      }
      // this.addForm.patchValue({
      //   jobDescription: DescriptionData
      // });
      // this.DescriptionValue = DescriptionData;
      // this.onProgressCount(this.addForm.value,'description');
     });
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
 @Name: getSeekOrganizationById function
 @Who: Nitin Bhati
 @When: 07-March-2022
 @Why: EWM-5445
 @What: For Getting data By seek organizationid
*/
getSeekOrganizationById() {
  this.loading = true;
  this.SeekIntegrationByIdObs = this._SystemSettingService.getSeekIntegrationById(this.seekRegistrationCode).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200 || data.HttpStatusCode == 204) {
        this.orgType = data?.Data?.Advertisers;
      /*@Who: Nitin Bhati,@Why: EWM-10810,@When: 27-Feb-2023,@What:Org should be show default*/
        if(data?.Data?.Advertisers?.length==1){
          this.addForm.patchValue({
            OrganisationName: data?.Data?.Advertisers[0]?.OrganizationId,
          });
          this.seekOrganisationId=data?.Data?.Advertisers[0]?.OrganizationId;
          this.getSeekBrandning(data?.Data?.Advertisers[0]?.OrganizationId);
          this.getApplyTypeDetails(data?.Data?.Advertisers[0]?.OrganizationId);         
        }else{
          this.orgType = data?.Data?.Advertisers;   
        }     
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
     @Name: getApplyTypeDetails
     @Who: Nitin Bhati
     @When: 07-March-2022
     @Why: EWM-5445
     @What: for showing Apply Type
  */
     getApplyTypeDetails(seekOrganisationId) {
      this.loading = true;
       this.SeekApplicationMethodObs = this._SystemSettingService.getSeekApplicationMethod(seekOrganisationId).subscribe(
         (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
             this.loading = false;
             if (repsonsedata.Data) {
                this.applyType = repsonsedata.Data;
                //this.getSeekBrandning(seekOrganisationId);
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
     @Name: changeOrganisation Name
     @Who: Nitin Bhati
     @When: 07-March-2022
     @Why: EWM-5445
     @What: for changing organisation name
  */
     changeOrganisation(OrganizationId){
       this.seekOrganisationId=OrganizationId;
       this.getSeekBrandning(this.seekOrganisationId);
       this.getApplyTypeDetails(this.seekOrganisationId);
     } 
/*
     @Type: File, <ts>
     @Name: numberOnly
     @Who: Nitin Bhati
     @When: 09-March-2022
     @Why: EWM-5445
     @What: for number validation only
  */
     numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true; 
    }
/*
     @Type: File, <ts>
     @Name: onClearCaregory
     @Who: Nitin Bhati
     @When: 11-March-2022
     @Why: EWM-5485
     @What: for remove category dvalue
  */
    onClearCaregory() {
      this.radiocountArray
      const index = this.radiocountArray.findIndex(x => x.types == 'jobcategory');
      if (index>= 0) {
      this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
      this.radiofilledCount=this.radiofilledCount-1;
      this.totalfilledCount=this.filledCount+this.radiofilledCount;
      this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
      this.commonserviceService.onSeekJobformValidSelectId.next(true);
       }else{
        this.commonserviceService.onSeekJobformValidSelectId.next(true);
       }
     }
/*
     @Type: File, <ts>
     @Name: onClearSubCaregory
     @Who: Nitin Bhati
     @When: 11-March-2022
     @Why: EWM-5485
     @What: for remove sub category value
  */
     onClearSubCaregory() {
      this.radiocountArray
      const index = this.radiocountArray.findIndex(x => x.types == 'jobcategory');
      if (index>= 0) {
      this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
      this.radiofilledCount=this.radiofilledCount-1;
      this.totalfilledCount=this.filledCount+this.radiofilledCount;
      this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
      this.commonserviceService.onSeekJobformValidSelectId.next(true);
       }else{
        this.commonserviceService.onSeekJobformValidSelectId.next(true);
       }
     }
 


      /* 
    @Type: File, <ts>
    @Name: inputVideo function
    @Who: Nitin Bhati
    @When: 31-March-2022
    @Why: EWM-6080
    @What:for showing video position
   */
    inputVideo(value) {
      this.divStatusVideo=true;
     let videovalue= this.addForm.get("VideoURL").value;
      if(videovalue==''){
      this.divStatusVideo=false;
      this.addForm.get("VideoURL").reset;
     }else{
      this.divStatusVideo=true;
      this.addForm.patchValue({
        'VideoPosition':'Below'
      });     
     }   
     }
 /* 
    @Type: File, <ts>
    @Name: ResetMaximumValue function
    @Who: Nitin Bhati
    @When: 31-March-2022
    @Why: EWM-6080
    @What:When we insert value under minimum then maximum value is empty
   */
     ResetMaximumValue(){
      this.addForm.get("SalaryRangeMaximum").reset();
     }

 /*
@Name: onFilterBrandingClear function
@Who: Nitin Bhati
@When: 4-April-2022
@Why: EWM-6080
@What: use Clear for Searching branding records
*/
public onFilterBrandingClear(): void {
  this.searchText='';
}
 /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
     getUpdateSeekAdSelection() {
      this.jobTitle=this.addForm.get("jobTitle").value;
      let locationId=this.locationId;
      let jobCategoryId=this.jobCategoryId;
      this.UpdatedSeekAdSelectionObs = this._SystemSettingService.getUpdatedSeekAdSelection('?jobTitle=' + this.jobTitle + '&locationId=' + this.locationId + '&jobCategoryId=' + this.jobCategoryId+ '&organizationId='+this.seekOrganisationId + '&SeekAdvertisementId=' +this.ProfileId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Data) {
              this.jobAdTypeList = repsonsedata.Data.SeekAnzHirerAdvertisementModificationProducts;
              this.ClassicSummary='';//this.jobAdTypeList?this.jobAdTypeList[0].Price.Summary:'';
              //this.StandOutSummary=this.jobAdTypeList?this.jobAdTypeList[1].Price.Summary:'';
              this.StandOutSummary=this.jobAdTypeList?this.jobAdTypeList[1]?.Messages[0]?.Content:'';
              this.PremiumSummary='';//this.jobAdTypeList?this.jobAdTypeList[2].Price.Summary:'';
              this.JobAdValueClassic='';//this.jobAdTypeList?this.jobAdTypeList[0].Price.AmountExcludingTax.Currency:'';
              this.JobAdPriceClassic='';//this.jobAdTypeList?this.jobAdTypeList[0].Price.AmountExcludingTax.Value:'';
              this.JobAdValueStand=this.jobAdTypeList?this.jobAdTypeList[1]?.Price.AmountExcludingTax?.Currency:'';
              this.JobAdPriceStand=this.jobAdTypeList?this.jobAdTypeList[1]?.Price.AmountExcludingTax?.Value:'';
              this.JobAdValuePremium='';//this.jobAdTypeList?this.jobAdTypeList[2].Price.AmountExcludingTax.Currency:'';
              this.JobAdPricePremium='';//this.jobAdTypeList?this.jobAdTypeList[2].Price.AmountExcludingTax.Value:'';
              this.JobAdCurrency=this.JobAdValueStand;
              this.JobAdPrice=this.JobAdPriceStand;
               this.addForm.patchValue({
                'jobAdType':this.jobAdTypeList[1].Name?this.jobAdTypeList[1].Name:''
               });
              this.ClassicId=this.jobAdTypeList?this.jobAdTypeList[0].AdvertisementTypeCode:'';
              this.StandOutId=this.jobAdTypeList?this.jobAdTypeList[1].AdvertisementTypeCode:'';
              this.PremiumId=this.jobAdTypeList?this.jobAdTypeList[2].AdvertisementTypeCode:'';
               }
          } else {
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
    
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

 /*
     @Type: File, <ts>
     @Name: onPayLabelDetailsCheck
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing pay label checklist
  */
     onPayLabelDetailsCheck(){
      let payLabelCheck =this.addForm.get("payLabelCheck").value;
       if(payLabelCheck===false){
         this.IsHidePayInformation=false;       
       }else{
        this.IsHidePayInformation=true;
     }
    }

  /* @Type: File, <ts>
     @Name: openMapAllicationFormModule Name
     @Who: Nitin Bhati
     @When: 20-Sep-2022
     @Why: EWM-8845
     @What: for open map application form
    */
    openMapAllicationFormModule(){
        const dialogRef = this.dialogObj.open(MapApplicationFormSeekComponent, {
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 desc: sending apllicationId in popup--------->
          data: { jobId: this.jobId,JobTitle:this.JobTitle,applicationFormName:this.applicationFormName, applicationFormId: this.applicationFormId },
          panelClass: ['xeople-modal-lg', 'add-assessment-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
        dialogRef.afterClosed().subscribe(resData => {          
        if (resData.res==true) {
          this.addForm.patchValue({
            applicationFormNameValue:resData.Name
          })
          this.applicationFormId=resData.Id;  
          this.applicationFormName=resData.Name;
          this.applicationFormNames=resData.Name;
          this.isHideChip = true

          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          if(this.addForm.invalid===false){
            this.totalFilledPercentage=100;
            this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
            this.onSave(this.addForm.getRawValue());
            }else{
              this.totalFilledPercentage=(this.totalfilledCount*100/15);
            } 

        } else{
          // this.isHideChip = false

        } 
          //this.inputwithoutValidation(this.addForm.value);

        })     
    }
    /* @Type: File, <ts>
     @Name: changeApplyType Name
     @Who: Nitin Bhati
     @When: 21-Sep-2022
     @Why: EWM-8845
     @What: for changing Apply Type  name
    */
     changeApplyType(applyType){
      this.linkOutStatus=applyType;
      this.isHideChip = true;
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 --------->
      this.applicationFormName = this.applicationFormNames;
      if (this.linkOutStatus==='ApplicationUri') {
        this.addForm.patchValue({
          applicationFormNameValue:this.applicationFormName
        });
      }else{
        this.addForm.patchValue({
          applicationFormNameValue:''
        });
        this.addForm.get("applicationFormNameValue").clearValidators();
        this.addForm.get("applicationFormNameValue").markAsPristine();
        this.addForm.get("applicationFormNameValue").updateValueAndValidity();
      }
    } 

    removeApplication(){
      this.addForm.patchValue({
        applicationFormNameValue:''
      });
      this.applicationFormName='';
      this.isHideChip = false;
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      if(this.addForm.invalid===false){
        this.totalFilledPercentage=100;
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        this.onSave(this.addForm.getRawValue());
        }else{
          this.totalFilledPercentage=(this.totalfilledCount*100/15);
        }  
    }
/*
    @Type: File, <ts>
    @Name: clearExpiryDate function
    @Who: bantee
    @When: 24-march-2024
    @Why: EWM-11177
    @What: For clear expiry  date 
     */

    clearExpiryDate(){
      this.addForm.patchValue({
        DateExpiry: null
      });
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
  this.SeekIntegrationByIdObs?.unsubscribe(); 
  this.SeekApplicationMethodObs?.unsubscribe(); 
  this.UpdatedSeekAdSelectionObs?.unsubscribe(); 
  this.SeekJobCategorySugestionObs?.unsubscribe(); 
  this.SeekJobCategoryWithchildObs?.unsubscribe(); 
  this.SeekLocationGeoObs?.unsubscribe(); 
  this.SeekAdSelectionObs?.unsubscribe(); 
  this.SeekBrandingObs?.unsubscribe(); 
  this.SeekAccountUserObs?.unsubscribe(); 
  this.PostingseekDetailsObs?.unsubscribe(); 
  }

}
