import { Component, ElementRef, Input, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
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
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { JobDescriptionPopupEditorComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';

@Component({
  selector: 'app-republish-job',
  templateUrl: './republish-job.component.html',
  styleUrls: ['./republish-job.component.scss']
})
export class RepublishJobComponent implements OnInit {

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
  ClassicSummary: any;
  StandOutSummary: any;
  PremiumSummary: any;
  StandOutId: any;
  PremiumId: any;
  ClassicId: any;
  JobAdId: any;
  public divStatusKey: boolean = true;
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
  locationName: any;
  selectedIndex: number=1;
  ownerpatch: string[];
  userContactsList: any;
  SearchUserId: any;
  CategoryName: any;
  PayTypeName: any;
  workType: any;
  payType: any;
  OwnerName: any;
  JobAd: any;
  BrandingURL: any;
  KeySellingPoints: any;
  SellingPoints: any;
  editStatus: number;
  JobPostedUri: any;
  JobCategory: any;
  JobCategories: any;
  jobCategory: any;
  dateStart = new Date();
  minDate: Date;
  maxDate: Date;
  seekOrganisationId: any;
  orgType: any;
  seekRegistrationCode: any;
  applyType: any;
  ProfileId: any;
  QuickJobDetail: any;
  seekCover = "/assets/seek-cover.png";
  ClassicDescription: any;
  StandOutDescription: any;
  PremiumDescription: any;
  classicEnabledIndicator: boolean;
  standOutEnabledIndicator: boolean;
  premiumEnabledIndicator: boolean;
  linkOutStatus: string;
  applicationFormName: string;
  DateExpiryJob: Date;
  currentDateStart: Date;
  DateExpiryJobStatus: boolean=false;
  
  constructor(private fb: FormBuilder,private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService,private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,private route: ActivatedRoute,public dialogObj: MatDialog,private commonserviceService: CommonserviceService, private jobService: JobService,private _appSetting: AppSettingsService) { 
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.addForm = this.fb.group({
      OrganisationName:[, [Validators.required]],
      ApplyType:[, [Validators.required]],
      DateExpiry: [, [Validators.required]],
      accountName:['', Validators.required],
      jobTitle: ['', Validators.required],
      location: ['', Validators.required],
      Category:[[]],
      SubCategory:[[]],
      AccessId: ['',Validators.required],
      WorkType: ['', Validators.required],
      PayType: ['', Validators.required],
     // PayAdTypeIsCurrent: [''],
      KeySellingPoint: this.fb.array([]),
      BillingReference: [''],
      jobDescription:['', Validators.required],
      jobSummary:['', Validators.required],
      SalaryRangeMinimum:['', Validators.required],
      SalaryRangeMaximum:['', Validators.required],
      PayLabel:[''],
      VideoURL:[''],
      VideoPosition:[],
      jobDetailsCheck:[false],
      knockOut:[],
      BrandId: ['',Validators.required],
      payLabelCheck:[false],
    });
    
  }

  ngOnInit(): void {
    this.currentDateStart=new Date(this.dateStart);
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.SearchUserId = currentUser?.UserId
    this.getSeekOrganizationById();
    let currentUserName: any = currentUser?.FirstName;
    this.onsearchTeammate(currentUserName);

    this.orgId = localStorage.getItem('OrganizationId');

   
    // this.jobDetailsById = localStorage.getItem('jobById');
    // this.jobDataById = JSON.parse(this.jobDetailsById);
    
    // this.OwnerName=this.jobDataById.OwnerName;
    // this.JobTitle = this.jobDataById.JobTitle;
    // this.Location=this.jobDataById.Location;
    // this.JobDescription=this.jobDataById.JobDescription;
    // this.CategoryName=this.jobDataById.CategoryName;
    // this.workType=this.jobDataById.JobTypeName;
    // this.payType=this.jobDataById.SalaryBandName;
    // this.addForm.patchValue({
    //   jobDescription: this.JobDescription
    // });
    this.getPostingseekDetails();
    //this.getSeekJobCategoryWithChild();
    //this.getSeekBrandning();

    this.route.params.subscribe(
      params => {
        if (params['jobId'] != undefined) {
          this.jobId = params['jobId'];
          this.workflowId = params['workId'];
          this.editForm(this.jobId);
        }
      });
     
      this.userpreferences = this._userpreferencesService.getuserpreferences();
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
        this.addForm.disable();
        let hidePayInformation;
        if (data.Data.IsHidePayInformation == 1) {
          hidePayInformation = true;
        } else {
          hidePayInformation = false;
        }
        if (data.HttpStatusCode === 200) {
           this.addForm.patchValue({
            Id: data.Data.BillingReferenceId,
            accountName: data.Data.ContactPerson,
            Currency: data.Data.Currency,
            Category: data.Data.JobCategory,
            SubCategory: data.Data.JobCategories,
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
            OrganisationName: data.Data.organizationid,
            ApplyType: data.Data.ApplicationType,
            jobDetailsCheck: data.Data.QuickJobDetailStatus,
            payLabelCheck: hidePayInformation,
            DateExpiry: new Date(data.Data.JobExpiry),
          });
          this.DateExpiryJob= new Date(data.Data.JobExpiry),
          this.QuickJobDetail=data.Data.QuickJobDetail,
          this.seekOrganisationId=data.Data.organizationid;
          this.linkOutStatus=data.Data.ApplicationType;
          this.applicationFormName=data.Data.ApplicationFormName;
         /*@Who: Nitin Bhati,@When: 01-March-2022,@Why: EWM-10833,@What: For Expire date feature should be enable*/
          if(this.DateExpiryJob>=this.currentDateStart){
            this.DateExpiryJobStatus=true;
          };
          this.getSeekBrandning(data.Data.organizationid);
          this.getApplyTypeDetails(data.Data.organizationid);
          this.ProfileId=data.Data.ProfileId;
          
          this.getSeekAdSelection(data.Data.PositionTitle,data.Data.JobLocation,data.Data.JobCategories,data.Data.organizationid,this.ProfileId);
          if(data.Data.JobCategory!=null){
            this.addForm.patchValue({
              'AccessId':1
            })
            this.divStatus = true; 
          }else{
            this.addForm.patchValue({
              'AccessId':data.Data.JobCategories
            })
          }
          this.JobCategory=data.Data.JobCategory;
          this.getSeekJobCategoryWithChild();
          this.JobCategories=data.Data.JobCategories;
          this.JobPostedUri=data.Data.JobPostedUri;
          this.displayFn(data.Data.PositionLocation);
          
          if (data.Data.KeySellingPoints.length > 0) {
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
          this.locationId=data.Data.JobLocation;
          this.getSeekLocation(data.Data.PositionLocation);
          this.addForm.patchValue({
            'location':data.Data.PositionLocation
          })
          this.getSeekJobCategorySugestion(this.locationId);
          this.DescriptionValue=data.Data.JobDescription;
          this.JobTitle = data.Data.PositionTitle;
          this.jobRefId = data.Data.JobReferenceId;
          this.BrandingURL = data.Data.BrandingURL;
          this.JobAd = data.Data.JobAd;
          if(this.JobAd==='Classic'){
            this.divStatusKey = false;
            this.togglestatusClassic = true;
            }else if(this.JobAd==='StandOut'){
              this.divStatusKey = true;
            this.togglestatusStandOut = true;
          }else{
            this.divStatusKey = true;
             this.togglestatusPremium = true; 
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
 
  createItem(jobAdType) {
    if(jobAdType==='Classic'){
      return this.fb.group({
        name: ['',Validators.maxLength(80)]
      })
    }else{
      return this.fb.group({
        name: ['',Validators.required,Validators.maxLength(80)]
      })
    }
    
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
  if (searchVal.length < 3 ) {
    this.searchDataList=[];   
  }
  this.loading = true;
  this.loadingSearch = true;
  this._SystemSettingService.getSeekLocationList(searchVal,this.seekOrganisationId).subscribe(
    (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loadingSearch = false;
        if (repsonsedata.Data) {
          this.loadingSearch = false;
          this.loading = false;
           this.searchDataList = repsonsedata.Data.locationSuggestions;
           if(this.jobTitle=='undefined' || this.locationId == 'undefined' || this.jobCategoryId == 'undefined'){
            //this.getSeekAdSelection();
          }
           // for (let i = 0; i < searchDataListCount; i++) {
          //   // console.log ("Block statement execution no." + i);
          //   // this.searchDataList = repsonsedata.Data.locationSuggestions[i].location.name;
          //   // repsonsedata.Data.locationSuggestions[i].location.id.value;
          //   this.searchDataList.push({
          //     'Id': repsonsedata.Data.locationSuggestions[i].location.id.value,
          //     'Name': repsonsedata.Data.locationSuggestions[i].location.name
          //   });
          // }
          // this.searchDataList = repsonsedata.Data.locationSuggestions[0].location.name;
          //this.searchDataList = repsonsedata.Data.locationSuggestions[0].location.id.value;
          //console.log("searchDataList:",this.searchDataList);
          //console.log("searchDataListId:",repsonsedata.Data.locationSuggestions[0].location.id.value);
         }
        //this.totalDataCount = repsonsedata.TotalRecord;
      }
      else {
        this.loadingSearch = false;
        this.loading = false;
       //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loadingSearch = false;
      this.loading = false;
      //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
displayFn(user) {
  if(user?.location===undefined){
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
  this._SystemSettingService.getSeekJobCategorySugestion(jobTitle,this.locationId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.categorySugestionDataList = repsonsedata.Data.jobCategorySuggestions;
           this.jobSugestionlength = repsonsedata.Data.jobCategorySuggestions.length - 1;
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
 let jobTitle=this.addForm.get("jobTitle").value;
 if (jobTitle=='' ) {
  this.loading = false;
  return;
}
  this._SystemSettingService.getSeekJobCategorySugestion(jobTitle,value).subscribe(
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
   this._SystemSettingService.getSeekJobCategoryWithchild().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
           this.categoryWithParentDataList = repsonsedata.Data.jobCategories;
           this.onParentChildchangePatch(this.JobCategory,this.categoryWithParentDataList);
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

   onParentChildchangePatch(dataId,categoryWithParentDataList) {
    let CategoryData = categoryWithParentDataList.filter((dl: any) => dl.id.value == dataId);
   this.jobCategory=dataId;//data.id.value;
   this.addForm.get("SubCategory").reset();
   this.categoryWithChildDataList=CategoryData[0].children;
   this.addForm.patchValue({
     'SubCategory':this.JobCategories
   })
   this.jobCategoryId=this.JobCategories;
  // this.getSeekAdSelection();
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
        this.AccessId = accessData;
      if (accessData === 1) {
         this.divStatus = true;   
      }  else {
         this.divStatus = false;      
      }
      this.jobCategoryId=data?data.jobCategory.id.value:'';
      //this.getSeekAdSelection();
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
      this.addForm.get("AccessId").reset();
      this.divLoopStatus == 2;  
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this._SystemSettingService.getSeekLocationGeo(this.lat,this.lng).subscribe(
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
                    this.locationId=repsonsedata.Data.nearestLocations[0].id.value;
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
        }
        ,(error: any) => console.log(error));
      } else {
        alert("Geolocation is not supported by this browser.");
      }
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
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for previous index tab
  */
    prevStep() {
      this.step--;
    }
 /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
    getSeekAdSelection(PositionTitle:any,PositionLocationId:any,JobCategoriesId:any,OrganizationId:any,SeekAdvertisementId:any) {
      this.jobTitle=this.addForm.get("jobTitle").value;
      let locationId=this.locationId;
      let jobCategoryId=this.jobCategoryId;
      this._SystemSettingService.getSeekAdSelection('?jobTitle=' + PositionTitle + '&locationId=' + PositionLocationId + '&jobCategoryId=' + JobCategoriesId + '&organizationId=' +OrganizationId + '&SeekAdvertisementId=' +SeekAdvertisementId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Data) {
               this.jobAdTypeList = repsonsedata.Data.SeekAnzHirerAdvertisementCreationProducts;

               this.ClassicDescription=this.jobAdTypeList?this.jobAdTypeList[0].Description:'';
              this.StandOutDescription=this.jobAdTypeList?this.jobAdTypeList[1].Description:'';
              this.PremiumDescription=this.jobAdTypeList?this.jobAdTypeList[2].Description:'';

              this.ClassicSummary=this.jobAdTypeList?this.jobAdTypeList[0].Price.Summary:'';
              this.StandOutSummary=this.jobAdTypeList?this.jobAdTypeList[1].Price.Summary:'';
              this.PremiumSummary=this.jobAdTypeList?this.jobAdTypeList[2].Price.Summary:'';

              this.ClassicId=this.jobAdTypeList?this.jobAdTypeList[0].AdvertisementTypeCode:'';
              this.StandOutId=this.jobAdTypeList?this.jobAdTypeList[1].AdvertisementTypeCode:'';
              this.PremiumId=this.jobAdTypeList?this.jobAdTypeList[2].AdvertisementTypeCode:'';
              this.classicEnabledIndicator=this.jobAdTypeList?this.jobAdTypeList[0].EnabledIndicator:'';
              this.standOutEnabledIndicator=this.jobAdTypeList?this.jobAdTypeList[1].EnabledIndicator:'';
              this.premiumEnabledIndicator=this.jobAdTypeList?this.jobAdTypeList[2].EnabledIndicator:'';
               }
          } else {
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
    
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

    onCurrentPayAdDetails(enable: boolean,index,jobAdId,data){
       this.JobAdId=jobAdId;
       this.filledCount=this.filledCount+1;
          if(data==='Classic'){
          this.selected1 = index;
          this.togglestatusClassic = true;
          this.togglestatusPremium = false;
          this.togglestatusStandOut = false;
          this.divStatusKey = false;
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
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
         } else if(data==='Premium'){
           this.selected1 = index;
          this.togglestatusPremium = true;
          this.togglestatusClassic = false;
          this.togglestatusStandOut = false;
          this.divStatusKey = true;
          this.sellingPoint=[{name: "1"},{name: "2"},{name: "3"}];
           this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
          this.KeySellingPoint.clear();
          this.sellingPoint.forEach(element => {
            this.KeySellingPoint.push(this.createItem(''));
          });
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);  
         } 
         else{
          this.selected1 = index;
          this.togglestatusPremium = false;
          this.togglestatusClassic = false;
          this.togglestatusStandOut = true;
          this.divStatusKey = true;
          this.sellingPoint=[{name: "1"},{name: "2"},{name: "3"}];
           this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
          this.KeySellingPoint.clear();
          this.sellingPoint.forEach(element => {
            this.KeySellingPoint.push(this.createItem(''));
          });
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);       
         }     
       }
  /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
     getSeekBrandning(seekOrganisationId) {
      this.loading = true;
      this._SystemSettingService.getSeekBranding(seekOrganisationId).subscribe(
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
      this.BrandingURL = id;
      //this.selected = index;
      this.brandingId=id;
      this.addForm.patchValue({
        'BrandId':this.brandingId
      })
    }
 /*
     @Type: File, <ts>
     @Name: getSeekAdSelection
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
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
        this._SystemSettingService.getSeekAccountUser("?Search=" + inputValue + "&OrganizationId=" + this.orgId).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.loadingSearchS = false;
              this.searchListUser = repsonsedata.Data;
              this.userContactsList = this.searchListUser.filter((e: any) => e.UserId === this.SearchUserId);
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
      this.searchValue = data[0].UserName;
      this.ContactName = data[0].UserName;
      this.ContactPhone  = data[0].MobileNumber;
      this.ContactEmail = data[0].EmailId;
      this.addForm.patchValue({
      'accountName':data[0].UserName
    })
     }else{
      this.searchValue = searchname;
      this.ContactName = data.UserName;
      this.ContactPhone  = data.MobileNumber;
      this.ContactEmail = data.EmailId;
     }
      
   }

   public clickPayType(payTypeValue){
    if(payTypeValue==='Hourly'){
      this.payTypeName='Hourly rate';
      this.payTypeIntervalCode='Hour'; 
     }else if(payTypeValue==='Salaried'){
      this.payTypeName='Annual salary';
      this.payTypeIntervalCode='Year';
    }else{
      this.payTypeName='Annual and comission';
      this.payTypeIntervalCode='Year';
    }
  }
     /*
     @Type: File, <ts>
     @Name: getPostingseekDetails
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing Job Ad Type using Jobtile, locationId and categoryid
  */
     getPostingseekDetails() {
      this.loading = true;
       this._SystemSettingService.getPostingseekDetails().subscribe(
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
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for validate maximum salary and minimum salary
  */
     conditionChcek() {
      let SalaryRangeMinimum = this.addForm.get("SalaryRangeMinimum").value;
      let SalaryRangeMaximum = this.addForm.get("SalaryRangeMaximum").value; 
        if (SalaryRangeMaximum >= SalaryRangeMinimum) {
          this.addForm.get("SalaryRangeMaximum").clearValidators();
          this.addForm.get("SalaryRangeMaximum").markAsPristine();
         } else {
          this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
          this.addForm.get("SalaryRangeMaximum").markAsDirty();
        }   
    }

     /*
     @Type: File, <ts>
     @Name: onSave
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for posting seek data 
  */
     public onSave(value){
     
       this.jobPublishArray['PositionTitle'] = value.jobTitle;
       this.jobPublishArray['PayType'] = {
        "Code": value.PayType,
        "Name": this.payTypeName,
        "IntervalCode":this.payTypeIntervalCode
      },
      this.jobPublishArray['MinimumAmount'] = parseInt(value.SalaryRangeMinimum);
      this.jobPublishArray['MaximumAmount'] = parseInt(value.SalaryRangeMaximum);
      this.jobPublishArray['Currency'] = 'AUD';
      this.jobPublishArray['Contact']= {
        "Name": this.ContactName,
        "Phone": this.ContactPhone?this.ContactPhone:'null',
        "Email": this.ContactEmail
      },
      this.jobPublishArray['JobCategoriesId'] = this.jobCategoryId;
      this.jobPublishArray['PositionLocationId'] = this.locationId;

      this.jobPublishArray['locationName'] = this.locationName;
     
      this.jobPublishArray['JobAd'] = this.JobAdId;
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
      this.jobPublishArray['WorkTypeCode'] = value.WorkType;
      this.jobPublishArray['SeekVideo']= {
        "Url": value.VideoURL,
        "SeekAnzPositionCode": value.VideoPosition
      }
      this.jobPublishArray['togglestatusClassic'] = this.togglestatusClassic;
      this.jobPublishArray['togglestatusStandOut'] = this.togglestatusStandOut;
      this.jobPublishArray['togglestatusPremium'] = this.togglestatusPremium;
      this.jobPublishArray['selected'] = this.selected;
      this.jobPublishArray['knockOut'] = value.knockOut;
      this.jobPublishArray['Category'] = value.Category;
      this.jobPublishArray['SubCategory'] = value.SubCategory.name?value.SubCategory.name:'';
      this.jobPublishArray['AccessId'] = value.AccessId;  
      this.jobPublishArray['totalFilledPercentage'] = this.totalFilledPercentage; 
      this.jobPublishArray['WorkflowId'] = this.workflowId;
      this.jobPublishArray['divStatusKey'] = this.divStatusKey;
      
      this.commonserviceService.onSeekJobPreviewSelectId.next(this.jobPublishArray);
      this.selectedIndex=1;
      //console.log("values:",this.jobPublishArray);
      //this.commonserviceService.onselectedIndexId.next(this.selectedIndex);    
      // this._SystemSettingService.createSeekPosting(this.jobPublishArray).subscribe((repsonsedata: ResponceData) => {
      //   if (repsonsedata.HttpStatusCode === 200) {
      //     this.loading = false;
      //     this.openPopupForPostResponse(repsonsedata.Data);
      //     this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      //    } else if (repsonsedata.HttpStatusCode === 400) {
      //     this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      //    this.loading = false;
      //   }
      //   else {
      //     this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      //     this.loading = false;
      //   }
      // },
      //   err => {
      //     this.loading = false;
      //    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      //   });

     }

/*
     @Type: File, <ts>
     @Name: onSave
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
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
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: Redirect to job landing page
  */
    oncancel(){
      this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
    }
/*
     @Type: File, <ts>
     @Name: onJobTitleChange
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: For seek advertise selection
  */
    onJobTitleChange(searchVal:any){
      if (searchVal.length < 3 ) {
        this.searchDataList=[];   
      }
      if(this.jobTitle=='undefined' || this.locationId == 'undefined' || this.jobCategoryId == 'undefined'){
        //this.getSeekAdSelection();
      }       
    }
    /* 
    @Type: File, <ts>
    @Name: onJobDetails function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:For Job Details
   */
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
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:for progress bar count
   */
    input(value) {
      if(this.addForm.invalid===false){
         this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        this.onSave(value);
      }
        this.filledCount = this.textboxes.filter(t => t.nativeElement.value).length;
       this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/20);
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
       }
   /* 
    @Type: File, <ts>
    @Name: onProgressCount function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:for progress bar count
   */
     onProgressCount(value){
        if(this.addForm.invalid===false){
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        this.onSave(value);
        }
        this.radiofilledCount=this.radiofilledCount+1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/20);
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
       }
    /* 
    @Type: File, <ts>
    @Name: openDialogforDescription function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
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
      this.onProgressCount(this.addForm.value);
    });

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
    this.router.navigate(['/client/jobs/job/job-publish-v1/publish',{jobId: this.jobId,jobRefId:this.jobRefId,workId:this.workflowId,pub:1,selectedName:'seek'}])
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
 @Name: getSeekOrganizationById function
 @Who: Nitin Bhati
 @When: 07-March-2022
 @Why: EWM-5445
 @What: For Getting data By id
*/
getSeekOrganizationById() {
  this.loading = true;
  this._SystemSettingService.getSeekIntegrationById(this.seekRegistrationCode).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        this.orgType = data.Data.Advertisers;
        //this.getApplyTypeDetails();
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
     getApplyTypeDetails(organisationId) {
      this.loading = true;
       this._SystemSettingService.getSeekApplicationMethod(organisationId).subscribe(
         (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
             this.loading = false;
             if (repsonsedata.Data) {
                this.applyType = repsonsedata.Data;
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
                this.router.navigate(['/client/jobs/job/job-list/list',this.workflowId]);
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

}
