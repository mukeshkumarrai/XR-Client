import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChange, SimpleChanges, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { SeekPreview, OfferedRemunerationPackage, RangesEntity, MinimumAmount, MaximumAmount } from './seekinterface';
import { SeekPreviewUrl, OfferedRemunerationPackageUrl, RangesEntityUrl, MinimumAmountUrl, MaximumAmountUrl, PostingInstructionsEntity, PositionFormattedDescriptionsEntity, SeekVideo } from './seek-preview-interface';
import { debounceTime } from 'rxjs/operators';
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
  public categoryWithParentDataList: any = [];
  public categoryWithChildDataList: any = [];
  public nearestLocationDataList: any = [];
  jobSugestionlength: number;
  public divStatus: boolean = false;
  CategoryRadioId: any;
  public loadingSearch: boolean;
  public loadingSearchS: boolean;

  ipaddress: string = '';
  latitude: string = '';
  longitude: string = '';
  currency: string = '';
  currencysymbol: string = '';
  isp: string = '';
  city: string = '';
  country: string = '';
  province: string = '';

  public lat;
  public lng;
  location;
  public divLoopStatus: number = 1;
  searchVal;
  step = 0;
  locationId: any;

  public jobAdTypeList: any = [];
  jobCategoryId: any;

  KeySellingPoint: FormArray;
  brandingList: any;
  sellingPoint: any = [];
  jobPublishArray = {};
  jobId: any;
  jobRefId: any;
  brandingId: string;
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
  @Input() selectedIndexId: any;
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
  selectedAdTypeId: any;
  JobDescription: any;
  public divStatusJobDetails: boolean = false;
  IsHidePayInformation: boolean = false;
  jobDetailsById: string;
  filledCount: number = 0;
  radiofilledCount: number = 0;
  totalfilledCount: number = 0;
  @ViewChildren('textboxes') textboxes: QueryList<ElementRef>;
  filledCount1: number;
  jobTitle: any;
  totalFilledPercentage: number = 0;
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
  divexpanded: boolean = false;
  textboxes1: any;
  jobCategory: any;
  JobCategory: any;
  JobCategories: any;
  totalCount: number = 14;
  SubCategoryName: any;
  JobPostedUri: any;
  VideoPosition: any;
  VideoURL: any;
  payTypeValue: string;
  workTypeValue: any;
  dateStart = new Date(new Date().setDate(new Date().getDate()));
  dateStartNgModel = new Date(new Date().setDate(new Date().getDate() + 1));
  dateStartMax = new Date(new Date().setDate(new Date().getDate() + 29));
  dateMax = new Date(new Date().setDate(new Date().getDate() + 29));
  minDate: Date;
  maxDate: Date;
  applyType: any;
  orgType: any;
  seekRegistrationCode: any;
  seekOrganisationId: any;
  descriptionSatus: boolean = false;
  categorySatus: boolean = false;
  subcategorySatus: boolean = false;
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
  preJobDescription: any;
  ApplyType: any;
  PositionOpeningiId: any;
  updateSekkSelectionStatus: number = 0;
  DescriptionValueUncheck: any;
  JobAdPriceStandMessage: any;
  expireDate: number = 0;
  dirctionalLang;
  AssessmentArray: any;
  linkOutStatus: string;
  applicationFormName: any;
  applicationFormNames: any;
  applicationFormId: any;
  applicationFormURL: string;
  applicationBaseUrl: string;
  ApplyTypeName: any;
  subdomain: string;
  public isHideChip: boolean = true;
  orgTypeLength: any;
  dateFormat: any;
  getDateFormat: any;
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
  SeekCurrenciesList: any = [];
  ClassicSellingPointList: any = [];
  SeekAdvertisementProductId: any;
  ProductPriceSummary: any;
  IsAdvertisementProductIdChanged: number = 0;
  JobAdCost: any;
  JobadCostCurrency: any;
  toggleStatusJobAdd: boolean = false;
  getSeekPayTypeObs: Subscription;
  getSeekPayTypeList: any;
  getSeekWorkTypeList: any;
  getSeekWorkTypeObs: Subscription;
  searchSubject$ = new Subject<any>();
  searchLocationSubject$ = new Subject<any>();
  searchLocation: string;
  public divStatusBranding: boolean = false;
  public divStatusBrandingLogo: boolean = false;
  public divStatusKeySelling: boolean = false;
  public ParentSource: string;

  constructor(private fb: FormBuilder, private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private translateService: TranslateService, public _userpreferencesService: UserpreferencesService, private route: ActivatedRoute, public dialogObj: MatDialog, private commonserviceService: CommonserviceService, private jobService: JobService, private _appSetting: AppSettingsService,
    private appSettingsService: AppSettingsService) {
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.applicationBaseUrl = this._appSetting.applicationBaseUrl;
    this.ParentSource=this._appSetting.SourceCodeParam['Seek'];
    //const reg = '/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/';
    this.addForm = this.fb.group({
      OrganisationName: [, [Validators.required]],
      ApplyType: [, [Validators.required]],
      // <!-----@suika @whn 14-03-2023 @whyEWM-11175  dynamic date filter validation------------>
      DateExpiry: [, [Validators.required, CustomValidatorService.dateValidator]],
      accountName: ['', [Validators.required, Validators.maxLength(255)]],
      jobTitle: ['', [Validators.required, Validators.maxLength(80)]],
      location: ['', Validators.required],
      Category: [[]],
      SubCategory: [[]],
      CategoryRadioId: ['', Validators.required],
      WorkType: ['', Validators.required],
      PayType: ['', Validators.required],
      // PayAdTypeIsCurrent: [''],
      //KeySellingPoint: this.fb.array([this.createItem('')]),
      KeySellingPoint: this.fb.array([]),
      BillingReference: ['', [Validators.maxLength(50)]],
      jobDescription: ['', [Validators.required, this.noWhitespaceValidator()]],
      jobSummary: ['', [Validators.required, Validators.maxLength(150), this.noWhitespaceValidator()]],
      SalaryRangeMinimum: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
      SalaryRangeMaximum: ['', [Validators.required, Validators.max(999999)]],
      PayLabel: ['', [Validators.maxLength(50)]],
      VideoURL: ['', [Validators.pattern(this.pattern)]],
      VideoPosition: [],
      jobDetailsCheck: [false],
      payLabelCheck: [false],
      knockOut: [],
      jobAdType: ['', Validators.required],
      applicationFormNameValue: ['', Validators.required],
      SalaryCurrency: [, Validators.required]
    });
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.orgId = localStorage.getItem('OrganizationId');
    this.addForm.controls['jobDescription'].reset();
    this.getSeekOrganizationById();
    this.getPostingseekDetails();
    this.getSeekJobCategoryWithChild()
    this.getSeekCurrencies();  /** Who: Renu @When:13-05-2024 @Why:EWM-16917 EWM-17052 @What: currency dropdown */
    this.getSeekPayType();
    this.getSeekWorkType();
    //this.getSeekAdselectionV2();
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
          if (this.PublishedOnSeek === 0) {
            this.getJobDetailsByid(this.jobId);
          }
        }
      });
    this.subdomain = localStorage.getItem("tenantDomain");
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.dateFormat = localStorage.getItem('DateFormat');
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.getSeekAdselectionV2(); 
    });
    this.searchLocationSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.getSeekLocationSearch(val);
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
  getJobDetailsByid(jobId: any) {
    this.loading = true;
    this.jobService.getJobDetailsByid('?JobId=' + jobId).subscribe(
      (data: ResponceData) => {
        this.loading = true;
        if (data?.HttpStatusCode === 200) {
          this.jobDataById = data?.Data;
          this.PublishedOnSeek = this.jobDataById?.PublishedOnSeek;
          this.workflowId = this.jobDataById?.WorkflowId;
          this.OwnerName = this.jobDataById?.OwnerName;
          this.JobTitle = this.jobDataById?.JobTitle;
          this.Location = this.jobDataById?.Location;
          this.JobDescription = this.jobDataById?.JobDescription;
          this.CategoryName = this.jobDataById?.CategoryName;
          this.workType = this.jobDataById?.JobTypeName;
          this.payType = this.jobDataById?.SalaryUnitName;
          this.expireDate = 1;
          this.applicationFormId = this.jobDataById?.ApplicationFormId;
          this.applicationFormName = this.jobDataById?.ApplicationFormName;
          this.applicationFormNames = this.jobDataById?.ApplicationFormName;
          this.addForm.patchValue({
            applicationFormNameValue: this.applicationFormName
          })
          this.loading = false;
          //this.applicationFormURL = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.jobId+'&domain='+this.subdomain+'&applicationId='+this.applicationFormId+'&source=seek';    

          this.tabOneEvent.emit({ JobTitle: this.JobTitle, Published: this.PublishedOnSeek });
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
    return this.fb.group({
      name: ['', Validators.maxLength(80)]
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
  getSeekLocation(searchVal: string) {
    this.loadingSearch = true;
    if (searchVal == '') {
      this.addForm.get("CategoryRadioId").reset();
      this.jobCategoryId=null;
      this.divStatus = false;
      this.loadingSearch = false;
      this.searchDataList = [];
      return;
    };
    if (searchVal?.length >= 0 && searchVal?.length < 3) {
      this.loadingSearch = false;
      this.searchDataList = [];
      this.addForm.get("CategoryRadioId").reset();
      this.jobCategoryId=null;
      this.divStatus = false;
      return;
    };
    this.searchLocation=searchVal;
    this.searchLocationSubject$.next(searchVal);
  }
  getSeekLocationSearch(val) {
     this.UpdatedSeekAdSelectionObs = this._SystemSettingService.getSeekLocationList(this.searchLocation, this.seekOrganisationId).subscribe(
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
    if (user?.location == undefined) {
      return user;
    } else {
      return user ? user.location.contextualName : undefined;
    }
  }
  getSeekJobCategorySugestion(event: MatAutocompleteSelectedEvent) {
    if (event.option != undefined) {
      this.locationId = event?.option?.value?.location?.id?.value;
      this.locationName = event?.option?.value?.location?.contextualName;
      this.addForm.patchValue({
        SalaryCurrency: event?.option?.value?.location?.currencies[0]?.code
      })
    }
    this.addForm.get("CategoryRadioId").reset();
    this.jobCategoryId=null;
    let jobTitle = this.addForm.get("jobTitle").value;
    //this.locationId=event.option.value.location.id.value;
    this.loading = true;
    if (jobTitle == '') {
      this.loading = false;
      return;
    }
    this.SeekJobCategorySugestionObs = this._SystemSettingService.getSeekJobCategorySugestion(jobTitle, this.locationId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.categorySugestionDataList = repsonsedata.Data.jobCategorySuggestions;
            this.jobSugestionlength = repsonsedata.Data.jobCategorySuggestions.length - 1;
            if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
              this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
              this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
              && this.addForm.get("SalaryRangeMaximum").value != '') {
              this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
            }
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
    if (index >= 0) {
      this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
      this.radiofilledCount = this.radiofilledCount - 1;
      this.totalfilledCount = this.filledCount + this.radiofilledCount;
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
    }

    this.addForm.get("CategoryRadioId").reset();
    this.jobCategoryId=null;
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    let jobTitle = this.addForm.get("jobTitle").value;
    if (jobTitle == '') {
      this.loading = false;
      return;
    }
    this.SeekJobCategorySugestionObs = this._SystemSettingService.getSeekJobCategorySugestion(jobTitle, this.locationId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          if (repsonsedata.Data) {
            this.categorySugestionDataList = repsonsedata?.Data?.jobCategorySuggestions;
            this.jobSugestionlength = repsonsedata?.Data?.jobCategorySuggestions?.length - 1;
           }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  getSeekJobCategoryWithChild() {
    let jobTitle = this.addForm.get("jobTitle").value;
    this.SeekJobCategoryWithchildObs = this._SystemSettingService.getSeekJobCategoryWithchild().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          if (repsonsedata.Data) {
            this.categoryWithParentDataList = repsonsedata?.Data?.jobCategories;
            if (this.JobCategory != undefined && this.JobCategory != '') {
              this.onParentChildchangePatch(this.JobCategory, this.categoryWithParentDataList);
            }
           }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  onParentChildchange(dataId) {
    let CategoryData = this.categoryWithParentDataList?.filter((dl: any) => dl?.id?.value == dataId);
    this.jobCategory = dataId;
     this.addForm.get("SubCategory").reset();
    this.subcategorySatus = true;
    this.categoryWithChildDataList = CategoryData[0]?.children;
     //this.getSeekAdselectionV2();/**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
   }

  onParentChildchangeNext(dataId) {
    this.subcategorySatus = false;
    this.jobCategoryId = dataId;
    let SubCategoryData = this.categoryWithChildDataList?.filter((dl: any) => dl?.id?.value == this.jobCategoryId);
    this.SubCategoryName = SubCategoryData[0]?.name;
    this.onProgressCount(this.addForm.value, 'jobcategory');
    if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
    this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
    this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
    && this.addForm.get("SalaryRangeMaximum").value != '') {
    this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
  }
     //this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
  }
  onParentChildchangePatch(dataId, categoryWithParentDataList) {
    let CategoryData = categoryWithParentDataList?.filter((dl: any) => dl?.id?.value == dataId);
    if (CategoryData != 0) {
      this.jobCategory = dataId;//data.id.value;
      this.addForm.get("SubCategory").reset();
      this.categoryWithChildDataList = CategoryData[0]?.children;
      this.addForm.patchValue({
        'SubCategory': this.JobCategories
      });
      let SubCategoryData = this.categoryWithChildDataList?.filter((dl: any) => dl?.id?.value == this.JobCategories);
      this.SubCategoryName = SubCategoryData[0]?.name;
    }
    //this.getSeekAdSelection();
    // this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
  }
  /*
      @Type: File, <ts>
      @Name: clickCategorryRadio
      @Who: Nitin Bhati
      @When: 04-Feb-2022
      @Why: EWM-4980
      @What: for hide and show div
   */
  public clickCategorryRadio(accessData: any, data) {
    this.CategoryRadioId = accessData;
    if (accessData === 1) {
      this.divStatus = true;
      this.addForm.get("Category").reset();
      this.addForm.get("SubCategory").reset();
      this.addForm.get('Category').setValidators(Validators.required);
      this.addForm.get('SubCategory').setValidators(Validators.required);
      this.addForm.patchValue({
        'CategoryRadioId': 1
      });
      this.radiocountArray
      const index = this.radiocountArray?.findIndex(x => x.types == 'jobcategory');
      if (index >= 0) {
        this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
        this.radiofilledCount = this.radiofilledCount - 1;
        this.totalfilledCount = this.filledCount + this.radiofilledCount;
        this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
        this.commonserviceService.onSeekJobformValidSelectId.next(true);
      } else {
        this.commonserviceService.onSeekJobformValidSelectId.next(true);
      }
    } else {
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
        'CategoryRadioId': data?.jobCategory?.id?.value
      })
      this.jobCategoryId = data ? data.jobCategory.id.value : '';
      if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
        this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
        this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
        && this.addForm.get("SalaryRangeMaximum").value != '') {
        this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
      }
      this.onProgressCount(this.addForm.value, 'jobcategory');
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
    this.divLoopStatus == 2;
    this.getPosition()
      .then((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.SeekLocationGeoObs = this._SystemSettingService.getSeekLocationGeo(this.lat, this.lng).subscribe(
            (repsonsedata: ResponceData) => {
              if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                if (repsonsedata.Data) {
                  this.loading = false;
                  this.searchDataList = [];
                  this.divStatus = false;
                  let location = {
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
                  this.searchDataList.push({ location: location });
                  this.searchVal = repsonsedata.Data.nearestLocations[0]?.contextualName;
                  // this.searchUserCtrl.setValue({location: location});
                  this.locationName = repsonsedata.Data.nearestLocations[0]?.contextualName;
                  this.addForm.patchValue({
                    'location': repsonsedata.Data.nearestLocations[0]?.contextualName
                  });
                  this.locationId = repsonsedata.Data.nearestLocations[0]?.id.value;
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
   @Name: onCurrentPayAdDetails
   @Who: Nitin Bhati
   @When: 28-March-2022
   @Why: EWM-3759
   @What: for showing Job add type
*/
  onCurrentPayAdDetails(index, jobAdId, jobAdTypeList) {
    if (jobAdId == 'Classic') {
      this.divStatusKey = false;
      this.divStatusBranding=false;
      this.divStatusBrandingLogo=false;
      this.divStatusKeySelling=false;
    }else if(jobAdId == 'Basic') {
      this.divStatusKey = true;
      this.divStatusBranding=false;
      this.divStatusBrandingLogo=true;
      this.divStatusKeySelling=false;
    } else {
      this.divStatusKey = true;
      this.divStatusBranding=true;
      this.divStatusBrandingLogo=true;
      this.divStatusKeySelling=true;
    }
    this.brandingId = null;
    this.selectedAdTypeId = index;
    this.SeekAdvertisementProductId = jobAdTypeList?.id?.value;
    this.JobAd = jobAdId;
    this.ProductPriceSummary = jobAdTypeList?.price?.Summary
    let ProductPriceSummarySplit = jobAdTypeList?.price?.Summary.split(/\s/).map(item => item.trim());
    this.JobadCostCurrency = ProductPriceSummarySplit ? ProductPriceSummarySplit[0] : '';
    this.JobAdCost = ProductPriceSummarySplit ? ProductPriceSummarySplit[1] : '';
    this.JobAdCost = this.JobAdCost.replace(/,/g, '');
    this.JobAdCost =parseFloat(this.JobAdCost);
    this.addForm.patchValue({
      'jobAdType': jobAdId
    });
    this.onProgressCount(this.addForm.value, 'jobtype');
    this.sellingPoint = [{ name: "1" }, { name: "2" }, { name: "3" }];
    this.KeySellingPoint = this.addForm.get('KeySellingPoint') as FormArray;
    this.KeySellingPoint.clear();
    this.sellingPoint.forEach(element => {
      this.KeySellingPoint.push(this.createItem('Classic'));
    });
    let formControl: FormControl = this.addForm.get("KeySellingPoint") as FormControl;
    formControl.clearValidators();
    formControl.setValidators(null);
    formControl.updateValueAndValidity();
    //this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid); 
    this.totalCount = 14;
    this.onProgressCount(this.addForm.value, 'jobtype');
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
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata?.Data) {
            this.brandingList = repsonsedata?.Data?.AdvertisementBrandings?.Edges;
          }
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  public onBranding(index: any, id: any) {
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
      this.SeekAccountUserObs = this._SystemSettingService.getSeekAccountUser("?Search=" + inputValue + "&OrganizationId=" + this.orgId).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
            this.loadingSearchS = false;
            this.searchListUser = repsonsedata?.Data;
            this.userContactsList = this.searchListUser?.filter((e: any) => e.UserId === this.SearchUserId);
            this.AddSelectTeammate(this.userContactsList, '', 'loginUser')
            this.noRecordFound = "";
           }
          else if (repsonsedata?.HttpStatusCode === 400 && repsonsedata?.Data == null) {
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
  public AddSelectTeammate(data: any, searchname: any, login: any) {
    if (login == 'loginUser') {
      this.searchValue = data[0]?.UserName;
      this.ContactName = data[0]?.UserName;
      this.ContactPhone = data[0]?.MobileNumber;
      this.ContactEmail = data[0]?.EmailId;
      this.addForm.patchValue({
        'accountName': data[0]?.UserName
      })
    } else {
      this.searchValue = searchname;
      this.ContactName = data.UserName;
      this.ContactPhone = data.MobileNumber;
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
  public clickWorkType(workTypes: any) {
    this.workTypeValue = workTypes;
    this.onProgressCount(this.addForm.value, 'worktype');
    this.addForm.patchValue({
      WorkType: this.workTypeValue
    });
    if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
      this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
      this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
      && this.addForm.get("SalaryRangeMaximum").value != '') {
      this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
    }
  }
  /*
      @Type: File, <ts>
      @Name: clickPayType
      @Who: Nitin Bhati
      @When: 11-feb-2022
      @Why: EWM-3759
      @What: for pay type
   */
  public clickPayType(payTypeValue: any) {
    if (this.PublishedOnSeek === 0) {
      this.addForm.get("SalaryRangeMinimum").reset();
      this.addForm.get("SalaryRangeMaximum").reset();
      this.totalfilledCount = this.totalfilledCount - 2;
    }
    this.payTypeValue = payTypeValue?.Code;
    this.payTypeName = payTypeValue?.Name;
    this.payTypeIntervalCode = payTypeValue?.IntervalCode;
    this.addForm.patchValue({
      PayType: payTypeValue?.Code
    });
    this.onProgressCount(this.addForm.value, 'paytype');
    if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
      this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
      this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
      && this.addForm.get("SalaryRangeMaximum").value != '') {
      this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
    }
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
    this.PostingseekDetailsObs = this._SystemSettingService.getPostingseekDetails().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata?.Data) {
            this.getPostingseekDetails = repsonsedata?.Data;
            this.JobCount = repsonsedata?.Data.JobCount;
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
    let paytype = this.addForm.get("PayType").value;
    let SalaryRangeMinimum = Number(this.addForm.get("SalaryRangeMinimum").value);
    let SalaryRangeMaximum = Number(this.addForm.get("SalaryRangeMaximum").value);
    let diffrenceValue = SalaryRangeMaximum - SalaryRangeMinimum;
    if (paytype === 'Salaried') {
      if (SalaryRangeMaximum >= SalaryRangeMinimum) {
        if (SalaryRangeMinimum < 100000) {
          if (diffrenceValue >= 100000) {
            this.addForm.get("SalaryRangeMaximum").setErrors({ diffcheck: true });
            this.addForm.get("SalaryRangeMaximum").markAsDirty();
          } else {
            this.addForm.get("SalaryRangeMaximum").clearValidators();
            this.addForm.get("SalaryRangeMaximum").markAsPristine();
            this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required, Validators.max(999999)]);
          }
        } else {
          if (diffrenceValue >= 999999) {
            this.addForm.get("SalaryRangeMaximum").setErrors({ diffGreaterThan: true });
            this.addForm.get("SalaryRangeMaximum").markAsDirty();
          } else {
            this.addForm.get("SalaryRangeMaximum").clearValidators();
            this.addForm.get("SalaryRangeMaximum").markAsPristine();
            this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required, Validators.max(999999)]);
          }
        }
      } else {
        this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
        this.addForm.get("SalaryRangeMaximum").markAsDirty();
      }

    } else if (paytype === 'Hourly') {
      if (SalaryRangeMaximum >= SalaryRangeMinimum) {
        // if(diffrenceValue>=100){
        //     this.addForm.get("SalaryRangeMaximum").setErrors({ diffMinBelowFiftyHour: true });
        //     this.addForm.get("SalaryRangeMaximum").markAsDirty();
        //   }else{
        //     this.addForm.get("SalaryRangeMaximum").clearValidators();
        //     this.addForm.get("SalaryRangeMaximum").markAsPristine();
        //     this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required,Validators.max(999999)]);               
        //   }
      } else {
        this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
        this.addForm.get("SalaryRangeMaximum").markAsDirty();
      }
    } else {
      if (SalaryRangeMaximum >= SalaryRangeMinimum) {
        this.addForm.get("SalaryRangeMaximum").clearValidators();
        this.addForm.get("SalaryRangeMaximum").markAsPristine();
        this.addForm.get('SalaryRangeMaximum').setValidators([Validators.required, Validators.max(999999)]);
      } else {
        this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
        this.addForm.get("SalaryRangeMaximum").markAsDirty();
      }
    }
    if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
      this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
      this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
      && this.addForm.get("SalaryRangeMaximum").value != '') {
        this.searchSubject$.next(this.addForm.get("SalaryRangeMaximum").value);
      //this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
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
  public onSave(value) {
    this.jobPublishArray['jobType'] = 'seek';
    this.jobPublishArray['PositionTitle'] = value?.jobTitle;
    this.jobPublishArray['PayType'] = {
      "Code": this.payTypeValue,//value.PayType,
      "Name": this.payTypeName,
      "IntervalCode": this.payTypeIntervalCode
    },
      this.jobPublishArray['MinimumAmount'] = parseInt(value?.SalaryRangeMinimum);
    this.jobPublishArray['MaximumAmount'] = parseInt(value?.SalaryRangeMaximum);
    this.jobPublishArray['Contact'] = {
      "Name": this.ContactName,
      "Phone": this.ContactPhone ? this.ContactPhone : 'null',
      "Email": this.ContactEmail
    },
      this.jobPublishArray['JobCategoriesId'] = this.jobCategoryId;
    this.jobPublishArray['PositionLocationId'] = this.locationId;

    this.jobPublishArray['PositionLocation'] = this.locationName;

    this.jobPublishArray['JobAd'] = this.JobAd;
    this.jobPublishArray['JobAdCost'] = this.JobAdCost; // value.SalaryCurrency;  //this.JobAdPrice;  /**WHO: Renu @WHEN:14-05-2024 @WHY:EWM-16917 EWM-17059 @WHAT: JobAdPrice & JobAdCurrency changes & added two new fields ProductPriceSummary,seekAdvertisementProductId & currency commented**/
    this.jobPublishArray['PositionOpeningiId'] = this.PositionOpeningiId;
    this.jobPublishArray['ProductPriceSummary'] = this.ProductPriceSummary;
    this.jobPublishArray['JobadCostCurrency'] = this.JobadCostCurrency;
    this.jobPublishArray['seekAdvertisementProductId'] = this.SeekAdvertisementProductId;/**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: SeekAdvertisementProductId added**/
    this.jobPublishArray['SearchSummary'] = value?.jobSummary;
    this.jobPublishArray['JobDetail'] = value?.jobDescription;
    this.jobPublishArray['PayTypeDescription'] = [value.PayLabel] ? [value?.PayLabel] : [];
    this.jobPublishArray['BrandingID'] = this.brandingId ? this.brandingId : '';
    let keySelling = [];
    value.KeySellingPoint.forEach(element => {
      keySelling.push(element.name);
    });
    this.jobPublishArray['KeySellingPoint'] = keySelling ? keySelling : [];
    this.jobPublishArray['JobRefrenceID'] = this.jobRefId ? this.jobRefId : '0';
    this.jobPublishArray['JobID'] = this.jobId;
    this.jobPublishArray['BillingRefrenceID'] = value?.BillingReference;
    this.jobPublishArray['WorkTypeCode'] = this.workTypeValue;//value.WorkType;
    if (value?.VideoURL === '') {
      this.VideoPosition = null;
    } else {
      this.VideoPosition = value?.VideoPosition;
    }

    if (value?.VideoPosition === null) {
      this.VideoURL = '';
    } else {
      this.VideoURL = value?.VideoURL;
    }
    this.jobPublishArray['SeekVideo'] = {
      "Url": this.VideoURL,
      "SeekAnzPositionCode": this.VideoPosition
    }
    this.jobPublishArray['selected'] = this.brandingId;
    this.jobPublishArray['knockOut'] = value.knockOut;
    this.jobPublishArray['Category'] = this.jobCategory;//value.Category;
    this.jobPublishArray['SubCategory'] = this.SubCategoryName ? this.SubCategoryName : '';
    this.jobPublishArray['CategoryRadio'] = value.CategoryRadioId;
    this.jobPublishArray['totalFilledPercentage'] = this.totalFilledPercentage;
    this.jobPublishArray['WorkflowId'] = this.workflowId;
    this.jobPublishArray['divStatusKey'] = this.divStatusKey;
    this.jobPublishArray['divStatusBranding'] = this.divStatusBranding;
    this.jobPublishArray['divStatusBrandingLogo'] = this.divStatusBrandingLogo;
    this.jobPublishArray['divStatusKeySelling'] = this.divStatusKeySelling;

    this.jobPublishArray['ProfileId'] = this.ProfileId;
    this.jobPublishArray['Published'] = this.PublishedOnSeek;
    this.jobPublishArray['PositionOrganization'] = this.PositionOrganization;
    this.jobPublishArray['JobCategory'] = this.jobCategory;
    this.jobPublishArray['JobPostedUri'] = this.JobPostedUri;

    this.jobPublishArray['OrganizationId'] = this.seekOrganisationId;//value.OrganisationName;
    this.jobPublishArray['SeekJobApplicationMethods'] = value.ApplyType ? value.ApplyType : this.ApplyType;

    this.ApplyTypeName = value.ApplyType ? value.ApplyType : this.ApplyType;
    if (this.ApplyTypeName === 'ApplicationUri') {
      this.jobPublishArray['ApplicationFormId'] = this.applicationFormId;
      this.jobPublishArray['ApplicationFormName'] = this.applicationFormName;
      this.applicationFormURL = this.applicationBaseUrl + '/application/apply?mode=apply&jobId=' + this.jobId + '&domain=' + this.subdomain + '&Source='+this.ParentSource+'&parentSource='+this.ParentSource;
      this.jobPublishArray['ApplicationFormURL'] = this.applicationFormURL;
    }
    const d = new Date(value.DateExpiry)
    let divStatusJobDetails;
    if (this.divStatusJobDetails == true) {
      divStatusJobDetails = 1;
    } else {
      divStatusJobDetails = 0;
    }
    this.jobPublishArray['DefaultJobDetail'] = {
      "JobDetail": this.preJobDescription ? this.preJobDescription : '',//value.PayType,
      "JobDetailStatus": divStatusJobDetails
    },
      this.jobPublishArray['Currency'] = value.SalaryCurrency ?? ''; /**WHO: Renu @WHEN:14-05-2024 @WHY:EWM-16917 EWM-17059 @WHAT: currency dropdown value added **/
    this.jobPublishArray['IsAdvertisementProductIdChanged'] = this.IsAdvertisementProductIdChanged;

    let IsHidePayInformation;
    if (this.addForm.get("payLabelCheck").value == true) {
      IsHidePayInformation = 1;
    } else {
      IsHidePayInformation = 0;
    }
    this.jobPublishArray['IsHidePayInformation'] = IsHidePayInformation;
    this.jobPublishArray['JobExpiryDate'] = new Date(d?.getFullYear(), d?.getMonth(), d?.getDate(), d?.getHours(), d?.getMinutes() - d?.getTimezoneOffset())?.toISOString();
    this.jobPublishArray['jobAdTypeList'] = this.jobAdTypeList;
    this.jobPublishArray['getSeekWorkTypeList'] = this.getSeekWorkTypeList;
    this.jobPublishArray['getSeekPayTypeList'] = this.getSeekPayTypeList;
    this.jobPublishArray['brandingList'] = this.brandingList;
    this.jobPublishArray['orgType'] = this.orgType;
    this.jobPublishArray['SeekCurrenciesList'] = this.SeekCurrenciesList;
    this.jobPublishArray['applyType'] = this.applyType;
    this.jobPublishArray['categorySugestionDataList'] = this.categorySugestionDataList;
    this.jobPublishArray['categoryWithParentDataList'] = this.categoryWithParentDataList;
    this.commonserviceService.onSeekJobPreviewSelectId.next(this.jobPublishArray);
    this.createRequest(value);
    this.selectedIndex = 2;
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
  oncancel() {
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
  onJobTitleChange(searchVal: any) {
    if (searchVal.length < 3) {
      this.searchDataList = [];
    }
    if (this.locationId != undefined) {
      this.getSeekJobCategorySugestionDetectLocation(this.locationId);
    }
    this.addForm.get("CategoryRadioId").reset();
    this.jobCategoryId=null;
    if (this.addForm.get("jobTitle").value != '' && this.locationId != undefined &&
      this.addForm.get("CategoryRadioId").value != '' && this.addForm.get("CategoryRadioId").value != null && this.addForm.get("WorkType").value != '' &&
      this.addForm.get("PayType").value != '' && this.addForm.get("SalaryCurrency").value != '' && this.addForm.get("SalaryRangeMinimum").value != ''
      && this.addForm.get("SalaryRangeMaximum").value != '') {
      this.getSeekAdselectionV2(); /**@when: 15-05-2024 @why: EWM-16917 EWM-17084 @who:Renu @What: getSeekAdselectionV2 added**/
    }
  }
  onJobDetails() {
    let jobcheck = this.addForm.get("jobDetailsCheck").value;
    if (jobcheck === false) {
      this.preJobDescription = this.JobDescription;//this.jobDataById.JobDescription;
      this.DescriptionValue = this.JobDescription;//this.jobDataById.JobDescription;
      this.divStatusJobDetails = true;
      this.descriptionSatus = false;
      this.addForm.patchValue({
        jobDescription: this.JobDescription
      });
      let excluded = [null, undefined, '', ' ', 'null']; //by maneesh what ewm-17233 when:30/05/2024
      if (excluded.includes(this.addForm.get('jobDescription').value)) {
        this.descriptionSatus = true;
        this.addForm.controls['jobDescription'].setErrors({ 'required': true });
      } else {
        this.descriptionSatus = false;
      }
      this.onProgressCount(this.addForm.value, 'description');
    } else {
      // this.addForm.controls['jobDescription'].reset();
      //this.DescriptionValue = ` `;
      this.divStatusJobDetails = false;
      if (this.DescriptionValueUncheck == undefined) {
        this.divStatusJobDetails = false;
        this.descriptionSatus = true;
        this.addForm.controls['jobDescription'].reset();
        this.DescriptionValue = ` `;
        this.radiocountArray
        const index = this.radiocountArray.findIndex(x => x.types == 'description');
        if (index >= 0) {
          this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
          this.radiofilledCount = this.radiofilledCount - 1;
          this.totalfilledCount = this.filledCount + this.radiofilledCount;
          this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
          this.commonserviceService.onSeekJobformValidSelectId.next(true);
        } else {
          this.commonserviceService.onSeekJobformValidSelectId.next(true);
        }
      } else {
        this.descriptionSatus = false;
        this.DescriptionValue = this.DescriptionValueUncheck;
        this.divStatusJobDetails = false;
        this.addForm.patchValue({
          jobDescription: this.DescriptionValue
        });
        this.onProgressCount(this.addForm.value, 'description');
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
    if (value?.jobTitle == '') {
      this.addForm.get("CategoryRadioId").reset();
      this.divStatus = false;
      return;
    };
    this.filledCount = this.textboxes?.filter(t => t.nativeElement.value).length;
    this.totalfilledCount = this.filledCount + this.radiofilledCount;
    this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    if (this.addForm.invalid === false) {
      this.totalFilledPercentage = 100;
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } else {
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
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
    if (this.addForm.invalid === false) {
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
  radiocountArray = [];
  onProgressCount(value, types) {
    const index = this.radiocountArray.findIndex(x => x.types == types);
    if (index >= 0) {
    }
    else {
      this.radiocountArray.push({ types });
      this.radiofilledCount = this.radiofilledCount + 1;
      this.totalfilledCount = this.filledCount + this.radiofilledCount;
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
    }
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    if (this.addForm.invalid === false) {
      this.totalFilledPercentage = 100;
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } else {
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
    }
  }

  // radiocountArray=[];
  onCategoryProgressCount() {
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    if (this.addForm.invalid === false) {
      this.totalFilledPercentage = 100;
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } else {
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
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
      data: { DescriptionData: this.DescriptionValue },
      panelClass: ['xeople-modal-md', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(DescriptionData => {
      if (DescriptionData.replace(/<(.|\n)*?>/g, '').trim().length === 0 && !DescriptionData.includes("<img")) {
        this.descriptionSatus = true;
        this.addForm.patchValue({
          jobDescription: DescriptionData
        });
        this.DescriptionValue = DescriptionData;
        this.DescriptionValueUncheck = DescriptionData;
      } else {
        this.descriptionSatus = false;
        this.addForm.patchValue({
          jobDescription: DescriptionData
        });
        let excluded = [null, undefined, '', ' ', 'null', 'undefined']; //by maneesh what ewm-17233 when:30/05/2024;
        if (excluded.includes(DescriptionData)) {
          this.addForm.patchValue({
            jobDescription: null
          });
          this.descriptionSatus = true;
        } else {
          this.descriptionSatus = false;
        }
        this.DescriptionValue = DescriptionData;
        this.DescriptionValueUncheck = DescriptionData;
        this.onProgressCount(this.addForm.value, 'description');
      }
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
  clickInformation() {
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
          if (data?.Data?.Advertisers?.length == 1) {
            this.addForm.patchValue({
              OrganisationName: data?.Data?.Advertisers[0]?.OrganizationId,
            });
            this.seekOrganisationId = data?.Data?.Advertisers[0]?.OrganizationId;
            this.getSeekBrandning(data?.Data?.Advertisers[0]?.OrganizationId);
            this.getApplyTypeDetails(data?.Data?.Advertisers[0]?.OrganizationId);
          } else {
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
  changeOrganisation(OrganizationId) {
    this.seekOrganisationId = OrganizationId;
    this.getSeekBrandning(this.seekOrganisationId);
    this.getApplyTypeDetails(this.seekOrganisationId);
    if (this.seekOrganisationId != null) {
      this.resetform();
    }
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
    if (index >= 0) {
      this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
      this.radiofilledCount = this.radiofilledCount - 1;
      this.totalfilledCount = this.filledCount + this.radiofilledCount;
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
      this.commonserviceService.onSeekJobformValidSelectId.next(true);
    } else {
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
    if (index >= 0) {
      this.radiocountArray.splice(index, 1); // 2nd parameter means remove one item only
      this.radiofilledCount = this.radiofilledCount - 1;
      this.totalfilledCount = this.filledCount + this.radiofilledCount;
      this.totalFilledPercentage = (this.totalfilledCount * 100 / this.totalCount);
      this.commonserviceService.onSeekJobformValidSelectId.next(true);
    } else {
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
    this.divStatusVideo = true;
    let videovalue = this.addForm.get("VideoURL").value;
    if (videovalue == '') {
      this.divStatusVideo = false;
      this.addForm.get("VideoURL").reset;
    } else {
      this.divStatusVideo = true;
      this.addForm.patchValue({
        'VideoPosition': 'Below'
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
  ResetMaximumValue() {
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
    this.searchText = '';
  }

  /*
      @Type: File, <ts>
      @Name: onPayLabelDetailsCheck
      @Who: Nitin Bhati
      @When: 04-Feb-2022
      @Why: EWM-4980
      @What: for showing pay label checklist
   */
  onPayLabelDetailsCheck() {
    let payLabelCheck = this.addForm.get("payLabelCheck").value;
    if (payLabelCheck === false) {
      this.IsHidePayInformation = false;
    } else {
      this.IsHidePayInformation = true;
    }
  }

  /* @Type: File, <ts>
     @Name: openMapAllicationFormModule Name
     @Who: Nitin Bhati
     @When: 20-Sep-2022
     @Why: EWM-8845
     @What: for open map application form
    */
  openMapAllicationFormModule() {
    const dialogRef = this.dialogObj.open(MapApplicationFormSeekComponent, {
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 desc: sending apllicationId in popup--------->
      data: { jobId: this.jobId, JobTitle: this.JobTitle, applicationFormName: this.applicationFormName, applicationFormId: this.applicationFormId },
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
      if (resData.res == true) {
        this.addForm.patchValue({
          applicationFormNameValue: resData.Name
        })
        this.applicationFormId = resData.Id;
        this.applicationFormName = resData.Name;
        this.applicationFormNames = resData.Name;
        this.isHideChip = true

        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        if (this.addForm.invalid === false) {
          this.totalFilledPercentage = 100;
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          this.onSave(this.addForm.getRawValue());
        } else {
          this.totalFilledPercentage = (this.totalfilledCount * 100 / 15);
        }

      } else {
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
  changeApplyType(applyType) {
    this.linkOutStatus = applyType;
    this.isHideChip = true;
    // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 --------->
    this.applicationFormName = this.applicationFormNames;
    if (this.linkOutStatus === 'ApplicationUri') {
      this.addForm.patchValue({
        applicationFormNameValue: this.applicationFormName
      });
    } else {
      this.addForm.patchValue({
        applicationFormNameValue: ''
      });
      this.addForm.get("applicationFormNameValue").clearValidators();
      this.addForm.get("applicationFormNameValue").markAsPristine();
      this.addForm.get("applicationFormNameValue").updateValueAndValidity();
    }
  }

  removeApplication() {
    this.addForm.patchValue({
      applicationFormNameValue: ''
    });
    this.applicationFormName = '';
    this.isHideChip = false;
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    if (this.addForm.invalid === false) {
      this.totalFilledPercentage = 100;
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } else {
      this.totalFilledPercentage = (this.totalfilledCount * 100 / 15);
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

  clearExpiryDate() {
    this.addForm.patchValue({
      DateExpiry: null
    });
    this.input('');
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
  /** Who: Renu @When:13-05-2024 @Why:EWM-16917 EWM-17052 @What: currency dropdown */
  getSeekCurrencies() {
    this.loading = true;
    this.PostingseekDetailsObs = this._SystemSettingService.getSeekCurrencies().subscribe(
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
   getSeekAdselectionV2() {
    this.selectedAdTypeId = -1;
    this.jobAdTypeList=[];
    this.brandingId = null;
    this.addForm.get("jobAdType").reset();
    this.jobTitle = this.addForm.get("jobTitle").value;
    let MinimumAmountArr: MinimumAmount = {
      currency: this.addForm.get("SalaryCurrency").value,
      value: parseInt(this.addForm.get("SalaryRangeMinimum").value)
    };
    let MaximumAmountArr: MaximumAmount = {
      currency: this.addForm.get("SalaryCurrency").value,
      value: parseInt(this.addForm.get("SalaryRangeMaximum").value)
    };
    let RangesEntityArr: RangesEntity[] = [];
    RangesEntityArr.push({
      intervalCode: this.payTypeIntervalCode,
      minimumAmount: MinimumAmountArr,
      maximumAmount: MaximumAmountArr
    })

    let OfferedRemunerationPackageArr: OfferedRemunerationPackage = {
      basisCode: this.payTypeValue,
      descriptions: [this.payTypeValue],
      ranges: RangesEntityArr
    };
    let updateObj = [];
    let jsonObj: SeekPreview;
    jsonObj = {
      jobCategoryId: this.jobCategoryId,
      locationId: this.locationId,
      organizationId: this.seekOrganisationId,
      jobTitle: this.jobTitle,

      ProfileId: this.ProfileId,
      offeredRemunerationPackage: OfferedRemunerationPackageArr,
      seekAnzWorkTypeCode: this.workTypeValue
    }
    updateObj = [{
      "positionProfile": jsonObj,
      "PreviousSelectedAdvertisementProductId": this.SeekAdvertisementProductId ? this.SeekAdvertisementProductId : '',
    }];
    this._SystemSettingService.getSeekAdselectionV2(updateObj[0]).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.jobAdTypeList = repsonsedata.Data.advertisementProducts.products;
          this.divStatusKey = false;
          this.divStatusBranding=false;
          this.divStatusBrandingLogo=false;
          this.divStatusKeySelling=false;
           this.onSave(this.addForm.getRawValue());
        } else {
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  public async createRequest(value) {
    let keySelling = [];
    value.KeySellingPoint.forEach(element => {
      keySelling.push(element.name);
    });
    let MinimumAmountArr: MinimumAmount = {
      currency: this.addForm.get("SalaryCurrency").value,
      value: parseInt(this.addForm.get("SalaryRangeMinimum").value)
    };
    let MaximumAmountArr: MaximumAmount = {
      currency: this.addForm.get("SalaryCurrency").value,
      value: parseInt(this.addForm.get("SalaryRangeMaximum").value)
    };
    let RangesEntityArr: RangesEntity[] = [];
    RangesEntityArr.push({
      intervalCode: this.payTypeIntervalCode,
      minimumAmount: MinimumAmountArr,
      maximumAmount: MaximumAmountArr
    })

    let OfferedRemunerationPackageArr: OfferedRemunerationPackage = {
      basisCode: this.payTypeValue,
      descriptions: [this.payTypeValue],
      ranges: RangesEntityArr
    };
    let PostingInstructionsEntityArr: PostingInstructionsEntity[] = [];
    PostingInstructionsEntityArr.push({
      seekAdvertisementProductId: this.SeekAdvertisementProductId,
      brandingId: this.brandingId
    })
    let PositionFormattedDescriptionsEntityArr: PositionFormattedDescriptionsEntity[] = [];
    PositionFormattedDescriptionsEntityArr.push({
      DescriptionId: 'AdvertisementDetails',
      Content: value.jobDescription
    }, {
      DescriptionId: 'SearchSummary',
      Content: value.jobSummary
    },
      ...keySelling[0] ? [{ DescriptionId: 'SearchBulletPoint', Content: keySelling[0] }] : [], /***@When: 13-05-2023 @Eho: Renu @Why:EWM-16917 EWM-17052 @What: since these are optional if value present then only we will send these 3 object in array */
      ...keySelling[1] ? [{ DescriptionId: 'SearchBulletPoint', Content: keySelling[1] }] : [],
      ...keySelling[2] ? [{ DescriptionId: 'SearchBulletPoint', Content: keySelling[2] }] : []
    )
    let SeekVideoArr: SeekVideo = {
      Url: this.VideoURL,
      SeekAnzPositionCode: this.VideoPosition
    };
    //let updateObj = [];
    let jsonObj: SeekPreviewUrl;
    jsonObj = {
      jobCategoryId: this.jobCategoryId,
      locationId: this.locationId,
      organizationId: this.seekOrganisationId,
      jobTitle: this.jobTitle,

      offeredRemunerationPackage: OfferedRemunerationPackageArr,
      seekAnzWorkTypeCode: this.workTypeValue,
      postingInstructions: PostingInstructionsEntityArr ? PostingInstructionsEntityArr : null,
      positionFormattedDescriptions: PositionFormattedDescriptionsEntityArr ? PositionFormattedDescriptionsEntityArr : null,
      // seekApplicationQuestionnaireId: this.jobCategoryId,  /**WHO: Renu @WHEN:13-05-2024 @WHY:EWM-16917 EWM-17052 @WHAT: as per the API requirement is not required so commented. */
      seekVideo: SeekVideoArr && (Object.keys(SeekVideoArr).length === 0) ? SeekVideoArr : null  /**WHO: Renu @WHEN:13-05-2024 @WHY:EWM-16917 EWM-17052 @WHAT: null handling */
    }
    // this.getSeekAdselectionPreviewV2(jsonObj);
    this.commonserviceService.onSeekJobPreviewIframeId.next(jsonObj);
  }

  /** Who: Renu @When:21-05-2024 @Why:EWM-16917 EWM-17160 @What: noWhitespaceValidator validation issue*/
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  resetform() {
    this.addForm.get("location").reset();
    this.addForm.get("CategoryRadioId").reset();
    this.addForm.get("Category").reset();
    this.addForm.get("SubCategory").reset();
   // this.addForm.reset();
    this.selectedAdTypeId = -1;
    this.addForm.patchValue({
      OrganisationName: this.seekOrganisationId,
    });
    this.seekOrganisationId = this.seekOrganisationId;
    this.divStatusKey = false;
    this.divStatusBranding=false;
    this.divStatusBrandingLogo=false;
    this.divStatusKeySelling=false;
    this.brandingList = null;
    this.categorySugestionDataList = [];
    this.jobAdTypeList=[];
    this.jobCategoryId=null;
  }
  getSeekPayType() {
    this.loading = true;
    this.getSeekPayTypeObs = this._SystemSettingService.getSeekPayType().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.getSeekPayTypeList = repsonsedata.Data;
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
  getSeekWorkType() {
    this.loading = true;
    this.getSeekWorkTypeObs = this._SystemSettingService.getSeekWorkType().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.getSeekWorkTypeList = repsonsedata.Data;
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
