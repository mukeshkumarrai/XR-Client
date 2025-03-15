import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject, Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobDescriptionPopupEditorComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';

@Component({
  selector: 'app-seek-update-preview-publish',
  templateUrl: './seek-update-preview-publish.component.html',
  styleUrls: ['./seek-update-preview-publish.component.scss']
})
export class SeekUpdatePreviewPublishComponent implements OnInit {
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
  AccessId: any;
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
  url: string;
  selectedIndex: number;
  ProfileId: any;
  Published: any;
  dateStart = new Date();
  minDate: Date;
  maxDate: Date;
  applyType: any;
  private destroy:Subject<null> = new Subject();
  orgType: any;
  seekRegistrationCode: any;
  tabIndexStatus: boolean=false;
  DefaultJobDetail: any;
  seekCover = "assets/seek-cover.png";
  IsHidePayInformation: boolean;
  linkOutStatus:string;
  applicationFormName: any;
  /*-@Nitin Bhati,@when:06-06-2023,@Why:EWM-12708,For calling unsubscribe--*/
  destroy$: Subject<boolean> = new Subject<boolean>();
  SeekJobCategorySugestionObs: Subscription;
  SeekJobCategoryWithchildObs: Subscription;
  SeekLocationGeoObs: Subscription;
  SeekAdSelectionObs: Subscription;
  SeekBrandingObs: Subscription;
  SeekAccountUserObs: Subscription;
  PostingseekDetailsObs: Subscription;
  SeekIntegrationByIdObs: Subscription;
  SeekApplicationMethodObs: Subscription;
  UpdatedSeekAdSelectionObs: Subscription;
  SeekCurrenciesList:  any=[]; /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:currency dropdown in view mode**/
  PremiumSellingPointList: any=[];
  ClassicSellingPointList: any=[];
  StandOutSellingPointList: any=[];
  seekAdvertisementProductId: string;
  getSeekWorkTypeList: any=[];
  getSeekPayTypeList: any=[];
  JobAd: string;
  public divStatusBranding: boolean = false;
  public divStatusBrandingLogo: boolean = false;
  public divStatusKeySelling: boolean = false;
  constructor(private fb: FormBuilder,private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService,private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,private route: ActivatedRoute,public dialogObj: MatDialog,private commonserviceService: CommonserviceService,private _appSetting: AppSettingsService) { 
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.addForm = this.fb.group({
      OrganisationName:[, [Validators.required]],
      accountName:['', Validators.required],
      ApplyType:[, [Validators.required]],
      DateExpiry: [],
      jobTitle: ['', Validators.required],
      location: ['', Validators.required],
      Category:[[]],
      SubCategory:[[]],
      AccessId: ['',Validators.required],
      WorkType: ['', Validators.required],
      PayType: ['', Validators.required],
     // PayAdTypeIsCurrent: [''],
      KeySellingPoint: this.fb.array([this.createItem()]),
      BillingReference: [''],
      jobDescription:['', Validators.required],
      jobSummary:['', Validators.required],
      SalaryRangeMinimum:['', Validators.required],
      SalaryRangeMaximum:['', Validators.required],
      PayLabel:[''],
      VideoURL:[''],
      VideoPosition:[[]],
      jobDetailsCheck:[false],
      keyone:[''],
      keytwo:[''],
      keythree:[''],
      knockOut:[[]],
      jobAdType:[''],
      brandingType:[''],
      payLabelCheck:[false],
      SalaryCurrency:[] /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:currency dropdown in view mode**/
    });  
  }
  ngOnInit(): void {
    this.orgId = localStorage.getItem('OrganizationId');
    this.addForm.disable();
    
    this.commonserviceService.onSeekJobformValidSelectIdActive.subscribe(data => {    
      this.tabIndexStatus=data;
      if (this.tabIndexStatus === true) {
        this.commonserviceService.onSeekJobPreviewSelectId.subscribe(value => {
          if (value !== null && this.tabIndexStatus===true && value.jobType=='seek') {
             this.jobDataById = value;
           // this.getSeekJobCategorySugestion(this.jobDataById.PositionTitle,this.jobDataById.PositionLocationId);
            //this.getSeekOrganizationById();
            //this.getApplyTypeDetails(this.jobDataById?.OrganizationId);
            // this.getPostingseekDetails();
            //this.getSeekCurrencies(); /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:currency dropdown in view mode**/
            //this.getSeekJobCategoryWithChild();       
            this.jobAdTypeList=this.jobDataById?.jobAdTypeList;  
            this.getSeekWorkTypeList=this.jobDataById?.getSeekWorkTypeList;
            this.getSeekPayTypeList=this.jobDataById?.getSeekPayTypeList;
            this.brandingList=this.jobDataById?.brandingList;
            this.orgType=this.jobDataById?.orgType;
            this.SeekCurrenciesList=this.jobDataById?.SeekCurrenciesList;
            this.applyType=this.jobDataById?.applyType;
            this.categorySugestionDataList=this.jobDataById?.categorySugestionDataList;
            this.categoryWithParentDataList=this.jobDataById?.categoryWithParentDataList;
            this.JobAd=this.jobDataById?.JobAd;

           this.seekAdvertisementProductId=this.jobDataById?.seekAdvertisementProductId;
            this.ProfileId=this.jobDataById?.ProfileId;
            this.Published=this.jobDataById?.Published;
            this.divStatusKey=this.jobDataById?.divStatusKey;
            this.divStatusBranding=this.jobDataById?.divStatusBranding;
            this.divStatusBrandingLogo=this.jobDataById?.divStatusBrandingLogo;
            this.divStatusKeySelling=this.jobDataById?.divStatusKeySelling;
            this.DescriptionValue=this.jobDataById?.JobDetail;
            this.selected = this.jobDataById?.selected; 
            this.totalFilledPercentage = this.jobDataById?.totalFilledPercentage; 
            this.DefaultJobDetail=this.jobDataById?.DefaultJobDetail?.JobDetailStatus; 
            if (this.jobDataById?.DefaultJobDetail?.JobDetailStatus == 1) {
              this.DefaultJobDetail = true;
            } else {
              this.DefaultJobDetail = false;
            }
         if (this.jobDataById?.IsHidePayInformation == 1) {
              this.IsHidePayInformation = true;
            } else {
              this.IsHidePayInformation = false;
            }
    
            if (this.jobDataById.CategoryRadio === 1) {
              this.divStatus = true;   
           }else{
              this.divStatus = false;      
           }
             this.addForm.patchValue({
              'OrganisationName': this.jobDataById.OrganizationId,
              'ApplyType': this.jobDataById.SeekJobApplicationMethods,
              'DateExpiry': this.jobDataById.JobExpiryDate,
              'SalaryCurrency':this.jobDataById.Currency, /**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:currency dropdown in view mode**/
              'accountName': this.jobDataById.Contact.Name,
              'jobTitle': this.jobDataById.PositionTitle,
               'location': this.jobDataById.PositionLocation,
              'SalaryRangeMinimum': this.jobDataById.MinimumAmount,
              'SalaryRangeMaximum': this.jobDataById.MaximumAmount,
               'PayLabel': this.jobDataById.PayTypeDescription,
              'VideoURL': this.jobDataById.SeekVideo.Url,
              'VideoPosition': this.jobDataById.SeekVideo.SeekAnzPositionCode,
              'jobSummary': this.jobDataById.SearchSummary,
              'BillingReference': this.jobDataById.BillingRefrenceID,
              'WorkType': this.jobDataById.WorkTypeCode,
              'PayType': this.jobDataById.PayType.Name,
              'keyone': this.jobDataById.KeySellingPoint[0],
              'keytwo': this.jobDataById.KeySellingPoint[1],
              'keythree': this.jobDataById.KeySellingPoint[2],
              'knockOut': this.jobDataById.knockOut,
              'Category': this.jobDataById.Category,
              'SubCategory': this.jobDataById.SubCategory,
              'AccessId': this.jobDataById.CategoryRadio,
              'jobDescription': this.jobDataById.JobDetail,
              'jobDetailsCheck': this.DefaultJobDetail,
              'payLabelCheck': this.IsHidePayInformation,
              });
              this.linkOutStatus=this.jobDataById.SeekJobApplicationMethods;
              this.applicationFormName=this.jobDataById.ApplicationFormName;
            }         
        });
        } 
    });
  this.route.params.subscribe(
      params => {
        if (params['jobId'] != undefined) {
          this.jobId = params['jobId'];
          this.jobRefId = params['jobRefId'];
          this.workflowId = params['workId'];
        }
      });
     
      this.userpreferences = this._userpreferencesService.getuserpreferences();
  }

  public ngDestroy(): void {
    // this.destroy.next();
    // this.destroy.complete()
    // this.commonserviceService.onSeekJobPublishedSelectId.unsubscribe();
    // this.commonserviceService.onSeekJobPublishedSelectId.complete();
  }

  createItem() {
    return this.fb.group({
      name: ['', Validators.required]
    })
  }
 /*
 @Type: File, <ts>
 @Name: getSeekLocation function
 @Who: Nitin Bhati
 @When: 10-Nov-2021
 @Why: EWM-3691
 @What: For showing the list of seek Location data
*/

getSeekLocation(searchVal:string) {
  if (searchVal.length < 1 ) {
    this.searchDataList=[];   
  }
  this.loadingSearch = true;
  this._SystemSettingService.getSeekLocationList(searchVal,this.jobDataById.OrganizationId).subscribe(
    (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loadingSearch = false;
        if (repsonsedata.Data) {
          this.loadingSearch = false;
           this.searchDataList = repsonsedata.Data.locationSuggestions;
           
           //this.getSeekAdSelection();
            }
       }
      else {
         this.loadingSearch = false;
      }
    }, err => {
      this.loadingSearch = false;
     })
}

displayFn(user) {
return user ? user.location.contextualName : undefined;
}

getSeekJobCategorySugestion(title,location) {
   this.loading = true;
  this.SeekJobCategorySugestionObs=this._SystemSettingService.getSeekJobCategorySugestion(title,location).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.categorySugestionDataList = repsonsedata.Data.jobCategorySuggestions;
           this.jobSugestionlength = repsonsedata.Data.jobCategorySuggestions.length - 1;
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
  let jobTitle=this.addForm.get("jobTitle").value;
   this.SeekJobCategorySugestionObs=this._SystemSettingService.getSeekJobCategorySugestion(jobTitle,value).subscribe(
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
  this.SeekJobCategoryWithchildObs=this._SystemSettingService.getSeekJobCategoryWithchild().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
           this.categoryWithParentDataList = repsonsedata.Data.jobCategories;
           }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
onParentChildchange(data) {
  this.jobCategoryId=data.id.value;
  this.addForm.get("SubCategory").reset();
  this.categoryWithChildDataList=data.children;
  //this.getSeekAdSelection();
  }

  
 /*
     @Type: File, <ts>
     @Name: clickCategorryRadio
     @Who: Nitin Bhati
     @When: 17-Sep-2021
     @Why: EWM-2859
     @What: for hide and show div
  */
     public clickCategorryRadio(accessData: any,data) {
        this.AccessId = accessData;
      if (accessData === 1) {
         this.divStatus = true;   
      }  else {
         this.divStatus = false;      
      }
  
      this.jobCategoryId=data?data.jobCategory.id.value:'';
     // this.getSeekAdSelection();
    }


    /*
     @Type: File, <ts>
     @Name: detectLocation
     @Who: Nitin Bhati
     @When: 10-Nov-2021
     @Why: EWM-3691
     @What: for showing location using lat long 
  */
    detectLocation() {
      this.loading = true;

      this.addForm.get("AccessId").reset();
      this.divLoopStatus == 2;  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          if (position) {
             this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
           this.SeekLocationGeoObs= this._SystemSettingService.getSeekLocationGeo(this.lat,this.lng).subscribe(
              (repsonsedata: ResponceData) => {
                if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                   if (repsonsedata.Data) {
                     //this.searchDataList = repsonsedata.Data.nearestLocations;
                     this.loading = false;

                      this.searchDataList=[];
                      this.divStatus = false;   
                      // this.categoryWithParentDataList=[];
                      // this.categoryWithChildDataList=[];
                    
                     let location={
                      'id': {
                        'value': repsonsedata.Data.nearestLocations[0].id.value
                      },
                      'name': 'string',
                      'contextualName': repsonsedata.Data.nearestLocations[0].contextualName,
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
                    this.searchVal=repsonsedata.Data.nearestLocations[0].contextualName;
                    this.searchUserCtrl.setValue({location: location});
                    this.getSeekJobCategorySugestionDetectLocation(repsonsedata.Data.nearestLocations[0].id.value)
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
        },
          (error: any) => console.log(error));
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }

    setStep(index: number) {
      this.step = index;
    }
  
    nextStep() {
      this.step++;
    }
  
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
     getSeekBrandning(OrganizationId) {
      this.loading = true;
      this.SeekBrandingObs=this._SystemSettingService.getSeekBranding(OrganizationId).subscribe(
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
    /*
     @Type: File, <ts>
     @Name: onBranding
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for showing Branding data
  */
    public onBranding(index: any,id:any){
      this.filledCount=this.filledCount+1;
      this.selected = index;
      this.brandingId=id;
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
            if (repsonsedata.HttpStatusCode === 200) {
              this.loadingSearchS = false;
              this.searchListUser = repsonsedata.Data;
              this.noRecordFound = "";
             }
            else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
             this.loadingSearchS = false;
              this.noRecordFound = repsonsedata.Message;
              this.searchListUser = [];
             }
            else {
              this.loadingSearchS = false;
              this.noRecordFound = "";
            }
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            this.noRecordFound = ""
           })
  
      }
    }

    public AddSelectTeammate(data,searchname) {
      this.searchValue = searchname;
      this.ContactName = data.UserName;
      this.ContactPhone  = data.MobileNumber;
      this.ContactEmail = data.EmailId;
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
      if (searchVal.length < 1 ) {
        this.searchDataList=[];   
      }
      if(this.jobTitle=='undefined' || this.locationId == 'undefined' || this.jobCategoryId == 'undefined'){
        //this.getSeekAdSelection();
      }       
    }

    onJobDetails(){
       let jobcheck =this.addForm.get("jobDetailsCheck").value;
      if(jobcheck===false){
        this.DescriptionValue=this.jobDataById.JobDescription;
        this.divStatusJobDetails=true;
        this.addForm.patchValue({
        jobDescription: this.JobDescription
        });
        this.radiofilledCount=this.radiofilledCount+1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/20);     
      }else{
        this.DescriptionValue = ` `;
        this.divStatusJobDetails=false;
          this.addForm.patchValue({
            jobDescription: this.DescriptionValue
          });
          this.radiofilledCount=this.radiofilledCount-1;
          this.totalfilledCount=this.filledCount+this.radiofilledCount;
          this.totalFilledPercentage=(this.totalfilledCount*100/20);
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
    input() {
       this.filledCount = this.textboxes?.filter(t => t.nativeElement.value).length;
       this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/20);
      }
   /* 
    @Type: File, <ts>
    @Name: onProgressCount function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
       onProgressCount(){
        this.radiofilledCount=this.radiofilledCount+1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/20);
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
      maxWidth: "750px",
      data: { DescriptionData: this.DescriptionValue, },
      panelClass: ['quick-modalbox', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(DescriptionData => {
      this.addForm.patchValue({
        jobDescription: DescriptionData
      });
      this.DescriptionValue = DescriptionData;
      this.onProgressCount();
    });
  } 


    /*
 @Type: File, <ts>
 @Name: getSeekOrganizationById function
 @Who: Nitin Bhati
 @When: 07-March-2022
 @Why: EWM-5445
 @What: For Getting data By id
*/
getSeekOrganizationById() {
  this.loading = true;
  this.SeekIntegrationByIdObs=this._SystemSettingService.getSeekIntegrationById(this.seekRegistrationCode).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        this.orgType = data?.Data?.Advertisers;
       // this.getSeekBrandning(this.jobDataById.OrganizationId);
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
     getApplyTypeDetails(orgId) {
      this.loading = true;
     // let OrgIdd='seekAnz:organization:seek:W37Mb8Wb';
      this.SeekApplicationMethodObs= this._SystemSettingService.getSeekApplicationMethod(orgId).subscribe(
         (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
             this.loading = false;
             if (repsonsedata.Data) {
                this.applyType = repsonsedata.Data;
                this.addForm.patchValue({
                  'ApplyType': this.jobDataById.SeekJobApplicationMethods,
                })
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
  
/**@when: 14-05-2024 @why: EWM-16917 EWM-17059 @who:Renu @What:currency dropdown in view mode**/
  getSeekCurrencies() {
    this.loading = true;
    this.PostingseekDetailsObs= this._SystemSettingService.getSeekCurrencies().subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           if (repsonsedata.Data) {
              this.SeekCurrenciesList = repsonsedata.Data.currencies;
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
