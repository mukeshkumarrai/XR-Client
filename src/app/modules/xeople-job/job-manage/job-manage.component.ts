/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Satya Prakash Gupta
 @When: 21-May-2021
 @Why: EWM-1449 EWM-1583
 @What: quick job Section
 */

 import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
 import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
 import { MatDialog, MatDialogRef } from '@angular/material/dialog';
 import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
 import { TranslateService } from '@ngx-translate/core';
 import { MessageService } from '@progress/kendo-angular-l10n';
 import { MatInput } from '@angular/material/input';
 import { MatChipInputEvent } from '@angular/material/chips';
 import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
 import { delay, filter } from 'rxjs/operators';
 import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
 import { Subject } from 'rxjs';
 import { ServiceListClass } from 'src/app/shared/services/sevicelist';
 import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
 import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
 import { BroadbeanPosting, ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
 import { MediaMatcher } from '@angular/cdk/layout';
 import { CandidatejobmappingService } from 'src/app/shared/services/candidate/candidatejobmapping.service';
 import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { BroadbeanService } from '@app/modules/EWM.core/shared/services/broadbean/broadbean.service';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { PublishJobValidationComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/publish-job-validation/publish-job-validation.component';
import { PopupIntegrationCategoryComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/popup-integration-category/popup-integration-category.component';
import { IOwner, IjobAdvance, IjobBoards, IjobDescription, IjobDetails, IquickJob, Isalary } from '@app/modules/EWM.core/shared/quick-modal/quickjob/IquickJob';
import { QuickJobLocationComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/quick-job-location/quick-job-location.component';
import { statusMaster } from '@app/modules/EWM.core/shared/datamodels/status-master';
import { MapApplicationInfoComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/map-application-info/map-application-info.component';
import { GroupSkillConfirmationPopupComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/group-skill-confirmation-popup/group-skill-confirmation-popup.component';
import { JobDescriptionPopupEditorComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { CommonDropDownService } from '@app/modules/EWM.core/shared/services/common-dropdown-service/common-dropdown.service';
import { GetScreenSize } from '@app/shared/enums/job-detail.enum';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { CommonServiesService } from '@app/shared/services/common-servies.service';

@Component({
  providers: [MessageService],
  selector: 'app-job-manage',
  templateUrl: './job-manage.component.html',
  styleUrls: ['./job-manage.component.scss']
})
export class JobManageComponent implements OnInit {

  dirctionalLang;
  public ascIcon: string;
  panelOpenState = false;
  submitted = false;
  loading: boolean;
  quickJobForm: FormGroup;
  public specialcharPatternZip = "[A-Za-z0-9. ]+$";
  public specialcharPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,4}(?:\.\d{1,2})?)$/);
  public onlyNumberPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,1000}?)$/);
  //Who:Ankit Rawat, What:EWM-16596 Add number validation pattern for Head Count, When:04Apr24
  public headCountPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,10000}?)$/);
  clientList: any[] = [];
  clientAddressList: any = {};
  hideLocation: boolean = false;
  selectedValue: any;
  StateIdData: any;
  stateList: [] = [];
  categoryList: [] = [];
  subCategoryList: [] = [];
  industryList: [] = [];
  subIndustryList: [] = [];
  experienceList: [] = [];
  jobTypeList: [] = [];
  jobSubTypeList: [] = [];
  expertiseList: [] = [];
  subExpertiseList: [] = [];
  workFlowList: [] = [];
  statusList: [] = [];
  qualificationList: [] = [];

  currencyList: [] = [];
  salaryList: [] = [];
  salaryBandList: [] = [];
  jobTagList: [] = [];

  dateOpen = new Date();
  dateFill = new Date();
  today = new Date();
  todayOpenDate = new Date();
  todayFillDate = new Date();
  todayPublishDate = new Date();

  brandList: [] = [];
  ownerList: [] = [];
  companyContactsList: any = [];

  datePublish = new Date();
  DescriptionValue: any = ` `;

  selectedSubIndustryIdValue: any;
  selectedSubExpertiseIdValue: any;

  public experienceData: any;
  experienceIdValue: number[];
  public industryData: any;
  industryIdValue: string[];


  @ViewChild('title') title: MatInput;

  public userpreferences: Userpreferences;

  public selectedDataPopup: any;


  clientIdData: any;

  formTypeValue: any;

  public client: any;
  clients: any

  pageNumber: any = 1;
  pageSize: any = 500;
  listGroupData: [] = [];



  public dropDownCategoryConfig: customDropdownConfig[] = [];
  public selectedCategory: any = {};

  resetFormSubjectSubCategory: Subject<any> = new Subject<any>();
  public dropDownSubCategoryConfig: customDropdownConfig[] = [];
  public selectedSubCategory: any = [];

  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = [];

  resetFormSubjectSubIndustry: Subject<any> = new Subject<any>();
  public dropDownSubIndustryConfig: customDropdownConfig[] = [];
  public selectedSubIndustry: any = [];

  public dropDownExperienceConfig: customDropdownConfig[] = [];
  public selectedExperience: any = null;

  resetFormSubjectQualification: Subject<any> = new Subject<any>();
  public dropDownQualificationConfig: customDropdownConfig[] = [];
  public selectedQualification: any = [];

  public dropDownJobTypeConfig: customDropdownConfig[] = [];
  public selectedJobType: any = {};

  resetFormSubject: Subject<any> = new Subject<any>();
  public dropDownJobSubTypeConfig: customDropdownConfig[] = [];
  public selectedJobSubType: any = {};

  public dropDownExpertiesConfig: customDropdownConfig[] = [];
  public selectedExperties: any = [];

  resetFormSubjectSubExperties: Subject<any> = new Subject<any>();
  public dropDownSubExpertiesConfig: customDropdownConfig[] = [];
  public selectedSubExperties: any = [];


  resetFormSubjectWorkFlow: Subject<any> = new Subject<any>();
  public dropDownJobWorkflowConfig: customDropdownConfig[] = [];
  public selectedJobWorkflow: any = {};

  public dropDownJobStatusConfig: customDropdownConfig[] = [];
  public selectedJobStatus: any = {};

  public dropDownSalaryUnitConfig: customDropdownConfig[] = [];
  public selectedSalaryUnit: any = {};

  public dropDownSalaryBandConfig: customDropdownConfig[] = [];
  public selectedSalaryBand: any = {};

  public dropDownTagConfig: customDropdownConfig[] = [];
  public selectedTag: any = {};

  public dropDownBrandsConfig: customDropdownConfig[] = [];
  public selectedBrands: any = {};

  resetFormSubjectManage: Subject<any> = new Subject<any>();
  public dropDownManageAccessConfig: customDropdownConfig[] = [];
  public selectedManageAccess: any = {};

  resetFormSubjectMapApplication: Subject<any> = new Subject<any>();
  public dropDownMapApplicationConfig: customDropdownConfig[] = [];
  public selectedMapApplication: any = {};

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;

  skillSelectedList: any = [];
  searchskillListMain: any = [];
  searchskillList: any = [];
  skillGroupByIdList: any = [];
  skill: any = [];
  skillNameShowing = [];
  public searchValue: string = "";
  searchskillListT: any;
  skillSelectedListData: any = [];
  skillSelectedListDataServer: any = [];
  skillListLengthMore: any = 5;
  public skillIds = [];
  public loadingSearch: boolean;
  hideheaderforJobView = true;
  @Input() hideForJobDetailsView: any;
  @Input() jobId: any;
  JobId:any;
  jobDetailsDataByJobId: any = [];
  ownerpatch: any;
  companyContactsPatch: any;
  public errMsg: boolean = false;

  public isEditJob: boolean = false;
  public EditJobId: string = '';

  public jobCopySectionAccess: any[] = [];
  public isCopyJob: boolean = false;


  public type: string = '';
  public clientId: any;
  public workFlowLenght:any=0;

  uploadColorCodePreview:any;
  jobRankcolorCode:any;
  baseUrl: string;
  public oldPatchValues: any;
  accessEmailId: any = [];
  public formHeading:string;
  public oldPatchValuesAccessMode:any=[];
  dialogRef: any;
  public isMapAppToggled;
  public ishideView:boolean=true
  Published: any;
  public defaultColorValue = "#ffffff";
  isDropdown:boolean = false;
  public isDisabled = false;
  public dropDownStateConfig: customDropdownConfig[] = [];
  public selectedState: any = {};
  resetFormSubjectState: Subject<any> = new Subject<any>();

  animationVar: any;
  public applicationDefault:any={};
  public applicationList: any;
  public dropDownSalaryBandNameConfig: customDropdownConfig[] = [];
  public selectedSalaryBandName: any = {};
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones:MediaQueryList;
  forIpads:MediaQueryList;
  forMiniLapi:MediaQueryList;
  private _mobileQueryListener: () => void;
  maxMoreLengthForOwnerContacts:any;

  CurrencyName: any;
  CurrencySymbol: any;
  AddressLinkToMap: any;
  Latitude: any;
  Longitude: any;
  IndustryName: any;
  SubIndustryName: any;
  QualificationName: any;
  ExpertiseName: any;
  SubExpertiseName: any;
  BrandName: any;
  OrganizationName: string;
  IndustryId: any;
  SubIndustryId: any;
  ExpertiseId: any;
  SubExpertiseId: any;
  QualificationId: any;
  skillFinalData: any=[];
  ClientName: any;
  selectedIndustryList: any=[];
  selectedSubIndustryList: any=[];
  selectedQualificationList: any=[];
  selectedExpertiesList: any=[];
  selectedSubExpertiesList: any=[];
  companyList:any[]=[];
  contactList:any=[];
  isViewMode:boolean = true;
  editForm:any='';
  resetFormSubjectrReason: Subject<any> = new Subject<any>();
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public selectedReason: any = {};
  resetFormselectedReason: Subject<any> = new Subject<any>();
  JobID:any;
  SkillTag = new FormControl();
  public dropDownSkillTagsConfig: customDropdownConfig[] = [];
  public selectedSkillTags: any = {};
  public SkillTags: any[] = [];
  skillSelectedListId: any[] = [];
  maxMoreLength: any;
  search = new FormControl();
  currentSearchValue: string;
  skillCount: any;
  gridListData: any;
  public GridId: any = 'CandidateJobMapping_grid_001';
  Source: any;
  workflowId: any;
  pagesize: number = 10;
  pagneNo: number = 1;
  filterConfig: any = [];
  public sortingValue: string = "JobTitle,desc";
  @Input() floatingEditButton:boolean;
  @Output() onEditJobToFloatButton = new EventEmitter();
  floatingButtonForEdit:boolean = false;
  @Output() valueChange = new EventEmitter();
  @Input() hideUpperSaveCancelButton:boolean = true;
  workFlowID: any;
  jobStatusActiveKey: string;   //@suika@EWM-10681 EWM-10813  @02-03-2023 to set default values for status in job

  /* custome color code add
public color = "#f9d9ab";
public view: ColorPickerView = "palette";
public format: OutputFormat = "hex";
  public settings: PaletteSettings = {
    palette: [
      '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    ],
    columns: 10,
    tileSize: {
      width: 20,
      height: 20,
    },
  }
  */

  // color picker varibale
showColorPallateContainer = false;
color: any = '#2883e9'
selctedColor = '#FFFFFF';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
isOpen = false;
isMoreColorClicked!: boolean;
// color picker End
getDateFormat:any;
hidePopup:boolean;
  AccessName: any;
  AccessId: any;
  countryList:any = [];
  /*
 @Type: File, <ts>
 @Name: constructor function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: constructor for injecting services and formbuilder and other dependency injections
 */
 @Input() workflowStatus:boolean;
 @Input() ownersData:boolean;
 @Input() FocusContactField:boolean;
 public FocusOwnerField:boolean=false;
 public FocuscompanyContact:boolean=false;
 @Input() IsJobClosed:number;
 editLoading: boolean;
 addressData:any;
 ClientLocationAddress:any=[];
  clientJobDataByJobId: any=[];
  selectedIndex: number;

  common_DropdownC_Config: DRP_CONFIG;
  public selectedClientUser: any = {};
  public dropDownCurencyConfig: customDropdownConfig[] = [];
  public selectedCurrency: any = {};

  CMMN_Dropdown_ConfigJob_Category:DRP_CONFIG;
  CMMN_Dropdown_ConfigJob_SUB_Category:DRP_CONFIG;
  CMMN_Dropdown_ConfigQualification:DRP_CONFIG;
  CMMN_Dropdown_ConfigIndustry:DRP_CONFIG;
  CMMN_Dropdown_ConfigSubIndustry:DRP_CONFIG;
  CMMN_Dropdown_ConfigJobType:DRP_CONFIG;
  CMMN_Dropdown_ConfigJobSubType:DRP_CONFIG;
  CMMN_Dropdown_ConfigExperience:DRP_CONFIG;
  CMMN_Dropdown_ConfigExperties:DRP_CONFIG;
  CMMN_Dropdown_ConfigSubExperties:DRP_CONFIG;
  //apiCalledWhileReset:Object;
  messageCount: string;
  pageNameDRPObj = {
    pageName: 'jobManage',
    mode: 'add'
  }
  //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
  public workFlowDropdownConfig: DRP_CONFIG;
  public currentMenuWidth: number;
  public maxMoreLengthForWorkFlow: number = 5;
  public DisabledWorkFlowControl: Object;

  //Who:Ankit Rawat, Primary job owner changes: variable Initialization, Why: EWM-17356, When:25Jun2024
  public selectedOwnerItem: any = [];
  public ddlOwnerConfig: DRP_CONFIG;
  public maxMoreLengthForOwner: number = 5;

  public selectedPrimaryOwnerItem: any = [];
  public ddlPrimaryOwnerConfig: DRP_CONFIG;
  public maxMoreLengthForPrimaryOwner: number = 5;

  public isPrimaryOwnerValid: boolean=false;
  public DisabledPrimaryOwnerControl: Object;
  public DisabledOwnerControl: Object; 
  public showPrimaryOwner: boolean = true;
  public showOwner: boolean=true;
  clientSummeryId:string;
  public isActive:string;
  quickFilter:string;
  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, private serviceListClass: ServiceListClass,
    private commonserviceService: CommonserviceService, private quickJobService: QuickJobService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService,
    private jobWorkflowService: JobService,  private _service: CandidatejobmappingService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _BroadbeanService: BroadbeanService,private _clientService: ClientService,
    private _commonDropDownService: CommonDropDownService) {
    // who:maneesh get and set default value AccessName AccessId by config file when:19/04/2023
     this.AccessName=this.appSettingsService.getDefaultaccessName;
     this.AccessId=this.appSettingsService.getDefaultAccessId;
    //this.pagesize = this.appSettingsService.pagesize;
      //@suika@EWM-10681 EWM-10813  @02-03-2023 to set default values for status in job
    this.jobStatusActiveKey = this.appSettingsService.JobStatusActiveKey;

    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {changeDetectorRef.detectChanges()
     this.screenMediaQuiry();
     this.screenMediaQuiryForSkills();
    };
    this.forSmallSmartphones.addListener(this._mobileQueryListener);
   // who:maneesh what:handel in jobdetailsview mode not open popup in map applicationform   this.hidePopup=this.hideForJobDetailsView when:06/04/2023
    this.hidePopup=this.hideForJobDetailsView
    this.quickJobForm = this.fb.group({
      /////GENRAL First Pannel////////
  //  @Who: maneesh, @When: 06-jan-2023,@Why: EWM-10105 addnoWhitespaceValidator
      Title: ['', [Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]],
      JobReferenceId: [null],
      ClientId: [],
      ClientName: [], /*-@why:EWM-14961,@who: Nitin Bhati.@when:26-10-2023-*/
      Address1: ['', [Validators.maxLength(200)]],
      Address2: ['', [Validators.maxLength(200)]],
      Country: [],
      StateId: [],
      StateName:[''],
      City: ['', [Validators.maxLength(80)]],
      District_Suburb:[],
      ZipCode: ['', [Validators.maxLength(10), Validators.pattern(this.specialcharPatternZip)]],
     // AddressLinkToMap:[''],
     address: this.fb.group({
      'AddressLinkToMap': ['', [Validators.maxLength(250)]],
    }),
      Latitude :[''],
      Longitude :[''],
      /////Job Details Second Pannel////////
      JobCategoryId: [],
      JobSubCategoryId: [],
      IndustryId: [],
      SubIndustryId: [],
      QualificationId: [],
      ExperienceId: [],
      JobTypeId: [, [Validators.required]],
      JobSubTypeId: [],
      ExpertiseId: [],
      SubExpertiseId: [],
     // <!---------@When: 16-03-2023 @who:Bantee Kumar @why: EWM-10334 --------->
      JobExpiryDays: [30, [Validators.pattern(this.onlyNumberPattern)]],
      WorkFlowId: [, [Validators.required]],
      StatusId: [, [Validators.required]],
      StatusName: [],
      StatusColorCode: [],
      SkillTag:[],
      /////Salary Third Pannel////////
      CurrencyId: [],
      SalaryUnitId: [0],
      SalaryBandId: [0],
      SalaryBandName : [],
      Bonus: [0, [Validators.maxLength(10), Validators.pattern(this.onlyNumberPattern)]],
      Equity: [0, [Validators.maxLength(10), Validators.pattern(this.onlyNumberPattern)]],
      CurrencyName:[],
      CurrencySymbol:[],
      SalaryUnitName: [],
      HideSalary:[false],
      /////Description fourth Pannel////////
      DescriptionDetails: [''],
      InternalNotes: ['', [Validators.maxLength(1000)]], /*-@When:17-10-2023,@who:Nitin Bhati,@why:EWM-14819-*/
      JobTagId: [],
      /////Advanced 5th Pannel////////
      //Who:Ankit Rawat, What:EWM-16596  Default set head count 1, When:04Apr24
      HeadCount: [1, [Validators.pattern(this.headCountPattern)]],
      OpenDate: [, [Validators.required, CustomValidatorService.dateValidator]],
      FillDate: [null, [CustomValidatorService.dateValidator]],
      //OwnerId: [, [Validators.required]],
      Contact: [],
      JobRank: [0,[Validators.pattern(this.specialcharPattern)]],
      HideCompany: [true],
      BrandId: [],
      BrandName:[''],
      ProjectId: [],
      AccessName: ['', [Validators.required]],
      AccessId: [],
      ColorCode: ['#ffffff'],
      ReasonId:[0],
      ReasonName:[''],
      /////Job Board 6th Pannel////////
      IsDisable: [false],
      KnockOut: [true],
      ManageAccessId: [0],
      PublishDate: [, [CustomValidatorService.dateValidator]],  //  <!-- @Who: bantee ,@When: 31-mar-2023, @Why: EWM-11434 ,What: add required validator on condition based -->
      MapApplicationFormBtn: [false],
      ApplicationFormId: [null],
      ApplicationFormName: ['']
    });
    /*---@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883 ,What:pass job id from app setting---*/
    this.JobID = this.appSettingsService.jobID;
  }
  ngOnInit(): void {  
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.dropdownConfig();
    this.getColorCodeAll();
    //this.getClientAllDetailsList();
    this.getAllOwnerAndCompanyContacts();
    this.bindConfigOwner();
    this.bindConfigPrimaryOwner();
    this.getCurrencyAll();
    this.OrganizationName = localStorage.getItem('OrganizationName');
    let createJobFormBlank
    this.routes.params.subscribe(
      data => {
        createJobFormBlank = data["createJobForm"];
        this.type = data["type"];
        this.clientId = data["clientId"];
        this.workFlowLenght = data["workFlowLenght"]        
      })
    ////Add Job For Client
    if (this.type === "AddJobClient") {
      this.quickJobForm.patchValue({
        ClientId: this.clientId,
      })
      this.clientIdData = this.clientId;
      this.clientSummeryId = this.clientId; //by maneesh ewm-16996 when:04/07/2024
      this.quickJobForm.controls['ClientId'].disable();
      this.clientJobListByJobId(this.clientId);/*-@why:EWM-15005,@when:31-10-2023,@who:Nitin Bhati-*/
      this.getCompanyDetailsList(this.clientId);
    }
     if (createJobFormBlank === "template") {
      let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
      let ownerId: string = currentUser?.UserId
      this.ownerpatch = [ownerId];
      //Who:Ankit Rawat, Primary job owner: select current user from local storage, Why: EWM-17356, When:26Jun2024
      let userName=currentUser?.FirstName + (currentUser?.LastName ? ' ' + currentUser.LastName : '')
      this.selectedPrimaryOwnerItem={UserId:ownerId, UserName: userName};
      if(this.selectedPrimaryOwnerItem?.UserId){
        this.isPrimaryOwnerValid=true;
      }
      this.patchValueByTemplateData();
    } else if (createJobFormBlank === "blankForm") {
      let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
      let ownerId: string = currentUser?.UserId
      this.ownerpatch = [ownerId];
       //Who:Ankit Rawat, Primary job owner: select current user from local storage, Why: EWM-17356, When:26Jun2024
      let userName=currentUser?.FirstName + (currentUser?.LastName ? ' ' + currentUser.LastName : '')
      this.selectedPrimaryOwnerItem={UserId:ownerId, UserName: userName};
      if(this.selectedPrimaryOwnerItem?.UserId){
        this.isPrimaryOwnerValid=true;
      }
    }

    //this.clients=this.textChangeLngService.getData('plural');
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    if (this.type === 'AddJobClient') {
      this._sidebarService.subManuGroup.next('clients');
    } else {
      this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    }
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
      // For Edit And Copy Job

      this.routes.queryParams.subscribe((parmsValue) => {
        let JobId = parmsValue.jobId;
        let editForm = parmsValue.editForm;
        this.editForm = parmsValue.editForm;
        this.JobId = parmsValue.jobId;
        ////Edit Job////
        if (editForm == 'editForm' && JobId != undefined && JobId != null && JobId != '' ) {
          this.editLoading=true;
          this.quickJobListByJobId(JobId, true, false, false);
          this.isEditJob = true;
          this.EditJobId = JobId;
          this.isCopyJob = false;
          ////Copy Job////
        } else if (editForm == 'copyForm' && JobId != undefined && JobId != null && JobId != '') {
          this.isEditJob = false;
          this.isCopyJob = true;
          this.commonserviceService.JobCopySectionObs.subscribe(value => {
            // @suika @ewm-11998 to handle no data in service on page reload
            if (value!=null) {
              this.jobCopySectionAccess = value;
            }else{
              this.workflowId = localStorage.getItem('workflowId');
              this.route.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
            }
          })
          this.quickJobListByJobId(JobId, false, true, false);

        }
        //Who:Ankit Rawat, What:EWM-16596 Default workflow selected, When:05Apr24
        if(this.isEditJob==false && createJobFormBlank === "blankForm") this.setDefaultWorkflow();
      })
      this.formTypeValue = createJobFormBlank;
      if (this.hideForJobDetailsView == true) {
        this.hideheaderforJobView = false;
        this.quickJobListByJobId(this.jobId, false, false, true);
      } else {
        this.commonserviceService.onOrgSelectId.subscribe(value => {
          if (value !== null) {
            this.reloadApiBasedOnorg();
          }
        })
      }
    this.ddlconfigSetting();
    this.ascIcon = 'north';
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.baseUrl = 'https://'+window.location.host + '/client/jobs/job/job-detail/detail?jobId=';
    this.animationVar = ButtonTypes;
    this.screenMediaQuiry();
     this.screenMediaQuiryForSkills();
     this.tagSkillsList();
    // <!---------@When: 03-Feb-2023 @who:Adarsh singh @why: EWM-9386 EWM-10393 Desc- For getting queryParams --------->
     this.routes.queryParams.subscribe((data:any)=>{
        if (data['floatingButton']=='true') {
          this.floatingButtonForEdit = true;
        }else{
          this.floatingButtonForEdit = false;
        }
     })
    // <!---------@When: 03-Feb-2023 @who:Adarsh singh @why: EWM-9386 EWM-10393 END--------->

      //@suika@EWM-10681 EWM-10813  @02-03-2023 to set default values for status in job
        this.selectedJobStatus =  {Id:this.jobStatusActiveKey};
        this.onJobStatuschange(this.selectedJobStatus);
      // who:maneesh get and set default value AccessName AccessId by config file when:19/04/2023
      this.quickJobForm.patchValue({
        'AccessName': this.AccessName,
        'AccessId': this.AccessId
      });
      this.oldPatchValuesAccessMode = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
      this.isActive=sessionStorage.getItem('Activefilter');      
      this.routes.queryParams.subscribe((parmsValue) => { //by maneesh ewm-17125 for ewm-17125
        if (parmsValue?.filter != null || parmsValue?.filter != undefined) {
        this.isActive = parmsValue?.filter;     
        sessionStorage.setItem('Activefilter', this.isActive);
        }
      });
    this.quickFilter=sessionStorage.getItem('joblandingCreatejob');
}

  screenMediaQuiry(){
    if(this.hideForJobDetailsView==true){
      if(this.forSmallSmartphones.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forSmartphones.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forLargeSmartphones.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forIpads.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forMiniLapi.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else{
        this.maxMoreLengthForOwnerContacts=2;
      }
    }else{
      if(this.forSmallSmartphones.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forSmartphones.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forLargeSmartphones.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forIpads.matches==true){
        this.maxMoreLengthForOwnerContacts=1;
      }else if(this.forMiniLapi.matches==true){
        this.maxMoreLengthForOwnerContacts=2;
      }else{
        this.maxMoreLengthForOwnerContacts=3;
      }
    }

  }
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.screenMediaQuiry();
    this.screenMediaQuiryForSkills();
  }


  ddlconfigSetting() {
    //////Job  Category//////////////
    this.dropDownCategoryConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownCategoryConfig['apiEndPoint'] = this.serviceListClass.getJobCategoryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownCategoryConfig['placeholder'] = 'quickjob_jobCategory';
    this.dropDownCategoryConfig['IsManage'] = '/client/core/administrators/job-category';
    this.dropDownCategoryConfig['IsRequired'] = false;
    this.dropDownCategoryConfig['searchEnable'] = true;
    this.dropDownCategoryConfig['bindLabel'] = 'JobCategory';
    this.dropDownCategoryConfig['multiple'] = false;

    //////Job Sub Category//////////////
    this.dropDownSubCategoryConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    //  this.dropDownSubCategoryConfig['apiEndPoint'] = this.serviceListClass.getSubJobCategoryAll;
    this.dropDownSubCategoryConfig['placeholder'] = 'quickjob_jobSubCategory';
    this.dropDownSubCategoryConfig['IsManage'] = '/client/core/administrators/job-category';
    this.dropDownSubCategoryConfig['IsRequired'] = false;
    this.dropDownSubCategoryConfig['searchEnable'] = true;
    this.dropDownSubCategoryConfig['bindLabel'] = 'JobSubCategory';
    this.dropDownSubCategoryConfig['multiple'] = true;


    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true';
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;

    //////Sub Industry//////////////
    this.dropDownSubIndustryConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    //  this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + IndustryId ;
    this.dropDownSubIndustryConfig['placeholder'] = 'quickjob_subIndustry';
    this.dropDownSubIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownSubIndustryConfig['IsRequired'] = false;
    this.dropDownSubIndustryConfig['searchEnable'] = true;
    this.dropDownSubIndustryConfig['bindLabel'] = 'Description';
    this.dropDownSubIndustryConfig['multiple'] = true;

    //////////Experience//////////
    this.dropDownExperienceConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownExperienceConfig['apiEndPoint'] = this.serviceListClass.experienceAllListData +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownExperienceConfig['placeholder'] = 'quickjob_experience';
    this.dropDownExperienceConfig['IsManage'] = '/client/core/administrators/experience-type';
    this.dropDownExperienceConfig['IsRequired'] = false;
    this.dropDownExperienceConfig['searchEnable'] = true;
    this.dropDownExperienceConfig['bindLabel'] = 'Name';
    this.dropDownExperienceConfig['multiple'] = false;

    //////Qualification//////////////
    this.dropDownQualificationConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownQualificationConfig['placeholder'] = 'quickjob_qualification';
    this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
    this.dropDownQualificationConfig['IsRequired'] = false;
    this.dropDownQualificationConfig['searchEnable'] = true;
    this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
    this.dropDownQualificationConfig['multiple'] = true;
    //////Job Type//////////////
    this.dropDownJobTypeConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownJobTypeConfig['apiEndPoint'] = this.serviceListClass.getJobTypeList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownJobTypeConfig['placeholder'] = 'quickjob_jobType';
    this.dropDownJobTypeConfig['IsManage'] = '/client/core/administrators/job-type';
    this.dropDownJobTypeConfig['IsRequired'] = true;
    this.dropDownJobTypeConfig['searchEnable'] = true;
    this.dropDownJobTypeConfig['bindLabel'] = 'JobType';
    this.dropDownJobTypeConfig['multiple'] = false;

    //////Job Sub Type//////////////
    this.dropDownJobSubTypeConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    // this.dropDownJobSubTypeConfig['apiEndPoint'] = this.serviceListClass.getAllJobSubTypeList;
    this.dropDownJobSubTypeConfig['placeholder'] = 'quickjob_jobSubType';
    this.dropDownJobSubTypeConfig['IsManage'] = '/client/core/administrators/job-type';
    this.dropDownJobSubTypeConfig['IsRequired'] = false;
    this.dropDownJobSubTypeConfig['searchEnable'] = true;
    this.dropDownJobSubTypeConfig['bindLabel'] = 'JobSubType';
    this.dropDownJobSubTypeConfig['multiple'] = false;

    ////// Experties//////////////
    this.dropDownExpertiesConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    this.dropDownExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalExpertise +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownExpertiesConfig['placeholder'] = 'quickjob_functionalExpertise';
    this.dropDownExpertiesConfig['IsManage'] = '/client/core/administrators/functional-experties';
    this.dropDownExpertiesConfig['IsRequired'] = false;
    this.dropDownExpertiesConfig['searchEnable'] = true;
    this.dropDownExpertiesConfig['bindLabel'] = 'FunctionalExpertise';
    this.dropDownExpertiesConfig['multiple'] = true;

    //////Sub Experties//////////////
    this.dropDownSubExpertiesConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    //  this.dropDownSubExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiseId;
    this.dropDownSubExpertiesConfig['placeholder'] = 'quickjob_functionalSubExpertise';
    this.dropDownSubExpertiesConfig['IsManage'] = '/client/core/administrators/functional-experties';
    this.dropDownSubExpertiesConfig['IsRequired'] = false;
    this.dropDownSubExpertiesConfig['searchEnable'] = true;
    this.dropDownSubExpertiesConfig['bindLabel'] = 'FunctionalSubExpertise';
    this.dropDownSubExpertiesConfig['multiple'] = true;


    //////Job Work Flow//////////////
    /*
    if (this.hideForJobDetailsView) {
      this.dropDownJobWorkflowConfig['IsDisabled'] = true;
    }else if(this.workflowStatus){
      this.dropDownJobWorkflowConfig['IsDisabled'] = true;
    }
    else{
      this.dropDownJobWorkflowConfig['IsDisabled'] = this.JobId == undefined && this.jobId==undefined  && this.candidateMappedJobCount==0?false:true || this.editForm == 'copyForm'? false : true ;
    }
    this.dropDownJobWorkflowConfig['apiEndPoint'] = this.serviceListClass.jobWorkFlowList +
      "?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&PageNumber=1&PageSize=500&orderBy=WorkflowName,asc";
    this.dropDownJobWorkflowConfig['placeholder'] = 'quickjob_jobWorkflow';
    this.dropDownJobWorkflowConfig['IsManage'] = '/client/core/administrators/job-workflows;can=job';
    this.dropDownJobWorkflowConfig['IsRequired'] = true;
    this.dropDownJobWorkflowConfig['searchEnable'] = true;
    this.dropDownJobWorkflowConfig['bindLabel'] = 'WorkflowName';
    this.dropDownJobWorkflowConfig['multiple'] = false; */

    //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
    this.dropdownConfigWorkflow();
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForWorkflow();

    //////Job Status//////////////
    this.dropDownJobStatusConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    this.dropDownJobStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + "?GroupId=f7392f54-4ee0-4d3e-9342-f9f9ea76363a" +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownJobStatusConfig['placeholder'] = 'quickjob_status';
    this.dropDownJobStatusConfig['IsManage'] = '/client/core/administrators/group-master';
    this.dropDownJobStatusConfig['IsRequired'] = true;
    this.dropDownJobStatusConfig['searchEnable'] = true;
    this.dropDownJobStatusConfig['bindLabel'] = 'Code';
    this.dropDownJobStatusConfig['multiple'] = false;
    this.dropDownJobStatusConfig['isClearable'] = false;

    // 3rd
    //////Salary Unit//////////////
    this.dropDownSalaryUnitConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true';
    this.dropDownSalaryUnitConfig['placeholder'] = 'quickjob_salaryUnit';
    this.dropDownSalaryUnitConfig['IsManage'] = '/client/core/administrators/salaryunit';
    this.dropDownSalaryUnitConfig['IsRequired'] = false;
    this.dropDownSalaryUnitConfig['searchEnable'] = true;
    this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
    this.dropDownSalaryUnitConfig['multiple'] = false;


    //////Currency//////////////
    this.dropDownCurencyConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownCurencyConfig['apiEndPoint'] = this.serviceListClass.currencyList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true';
    this.dropDownCurencyConfig['placeholder'] = 'quickjob_currency';
    this.dropDownCurencyConfig['IsManage'] = '';
    this.dropDownCurencyConfig['IsRequired'] = false;
    this.dropDownCurencyConfig['searchEnable'] = true;
    this.dropDownCurencyConfig['bindLabel'] = 'CurrencySymbolName';
    this.dropDownCurencyConfig['multiple'] = false;

    // //////Salary Band//////////////
    // this.dropDownSalaryBandConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    // this.dropDownSalaryBandConfig['apiEndPoint'] = this.serviceListClass.salaryBandList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    // this.dropDownSalaryBandConfig['placeholder'] = 'quickjob_salaryBand';
    // this.dropDownSalaryBandConfig['IsManage'] = '/client/core/administrators/salary-band';
    // this.dropDownSalaryBandConfig['IsRequired'] = false;
    // this.dropDownSalaryBandConfig['searchEnable'] = true;
    // this.dropDownSalaryBandConfig['bindLabel'] = 'SalaryRange';
    // this.dropDownSalaryBandConfig['multiple'] = false;

        ////Salary Band Name//////////////
        this.dropDownSalaryBandNameConfig['IsDisabled'] = this.jobId == undefined ? false : true;
        this.dropDownSalaryBandNameConfig['apiEndPoint'] = this.serviceListClass.salaryBandList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.dropDownSalaryBandNameConfig['placeholder'] = 'quickjob_salaryBand';
        this.dropDownSalaryBandNameConfig['IsManage'] = '/client/core/administrators/salary-band';
        this.dropDownSalaryBandNameConfig['IsRequired'] = false;
        this.dropDownSalaryBandNameConfig['searchEnable'] = true;
        this.dropDownSalaryBandNameConfig['bindLabel'] = ['SalaryBandName','SalaryRange'];
        this.dropDownSalaryBandNameConfig['multiple'] = false;

    //  4th
    //////////Tag//////////
    this.dropDownTagConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    this.dropDownTagConfig['apiEndPoint'] = this.serviceListClass.tagList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownTagConfig['placeholder'] = 'quickjob_tags';
    this.dropDownTagConfig['IsManage'] = '/client/core/administrators/tag';
    this.dropDownTagConfig['IsRequired'] = false;
    this.dropDownTagConfig['searchEnable'] = true;
    this.dropDownTagConfig['bindLabel'] = 'Name';
    this.dropDownTagConfig['multiple'] = true;


    // 5th
    //////Brands//////////////
    this.dropDownBrandsConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    this.dropDownBrandsConfig['apiEndPoint'] = this.serviceListClass.getBrandAllList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownBrandsConfig['placeholder'] = 'quickjob_brands';
    this.dropDownBrandsConfig['IsManage'] = '/client/core/administrators/brands';
    this.dropDownBrandsConfig['IsRequired'] = false;
    this.dropDownBrandsConfig['searchEnable'] = true;
    this.dropDownBrandsConfig['bindLabel'] = 'Brand';
    this.dropDownBrandsConfig['multiple'] = false;

    // 6th
    //////Manage Access//////////////
    this.dropDownManageAccessConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownManageAccessConfig['apiEndPoint'] = this.serviceListClass.userGrpList;
    this.dropDownManageAccessConfig['placeholder'] = 'quickjob_ManageAccess';
    this.dropDownManageAccessConfig['IsManage'] = '/client/core/user-management/user-group';
    this.dropDownManageAccessConfig['IsRequired'] = false;
    this.dropDownManageAccessConfig['searchEnable'] = true;
    this.dropDownManageAccessConfig['bindLabel'] = 'Name';
    this.dropDownManageAccessConfig['multiple'] = false;

    // 7th
    //////Map Application form//////////////
    this.dropDownMapApplicationConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownMapApplicationConfig['apiEndPoint'] = this.serviceListClass.getApplicationFormAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownMapApplicationConfig['placeholder'] = 'label_SearchApplicationForm';
    this.dropDownMapApplicationConfig['IsManage'] = '/client/core/administrators/application-form';
    this.dropDownMapApplicationConfig['searchEnable'] = true;
    this.dropDownMapApplicationConfig['bindLabel'] = 'Name';
    this.dropDownMapApplicationConfig['multiple'] = false;
    // <!-- who:bantee,what:ewm-13212 non editable , Skills and Application form field When:18/07/2023 -->

    ////// State //////////////
    this.dropDownStateConfig['IsDisabled'] = this.hideForJobDetailsView?true:false;
    // this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll+'?ByPassPaging=true' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStateConfig['placeholder'] = 'label_state';
    this.dropDownStateConfig['IsManage'] = '/client/core/administrators/states';
    this.dropDownStateConfig['IsRequired'] = false;
    this.dropDownStateConfig['searchEnable'] = true;
    this.dropDownStateConfig['bindLabel'] = 'StateName';
    this.dropDownStateConfig['multiple'] = false;

    ////// State Added Adarsh singh for EWM-9369//////////////
    this.dropDownReasonConfig['IsDisabled'] = false;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_reasonMaster';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId='+this.JobID; /*--@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883 ,What:passing JObID parameter--*/
    this.dropDownReasonConfig['IsRequired'] = true;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;

    ////// Reason Added Adarsh singh for EWM-9369//////////////
    this.dropDownReasonConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_reasonMaster';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=='+this.JobID;
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;

    //////SkillTags //////////////
    this.dropDownSkillTagsConfig['IsDisabled'] = this.jobId == undefined ? false : true;;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillsTagList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = true;
    this.dropDownSkillTagsConfig['IsRequired'] = false;
    this.dropDownSkillTagsConfig['searchEnable'] = false;
    this.dropDownSkillTagsConfig['bindLabel'] = 'GroupName';
    this.dropDownSkillTagsConfig['multiple'] = true;

  }

  ngAfterViewInit() {
    setTimeout(() => {
      //who:maneesh.ewm-11774 for focus owner and companycontact field,when:20/09/2023
      if (this.hideheaderforJobView === true && !this.ownersData && !this.FocusContactField) {
        this.title.focus();
      }
    }, 1000);
    this.scrollToFirstInvalidControl();

  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /*
 @Type: File, <ts>
 @Name: patchValueByTemplateData function
 @Who: Anup Singh
 @When: 19-july-2021
 @Why: EWM-2001 EWM-2070
 @What: patch value from creat job popup template
*/
/*-@Who: Bantee,@When: 15-May-2023,@Why: EWM-12407,@What:salary unit name is going while creating job until change salary unit--*/

  patchValueByTemplateData() {
    this.commonserviceService.templateDetailsObs.pipe(delay(0)).subscribe(value => {
      this.selectedDataPopup = value;
      if (value != null && value != undefined) {
        this.quickJobForm.patchValue({
          JobCategoryId: value.JobCategoryId,
          Title: value.JobTitle,
          JobTypeId: value.JobTypeId,
          SalaryBandId: value.SalaryBandId,
          SalaryUnitId: value.SalaryUnitId,
          WorkFlowId: value.WorkFlowId,
          SalaryUnitName:value.SalaryUnitName,
          SalaryBandName :value.SalaryBandName,
          ClientId: value.ClientId,
          ClientName: value.ClientName,
        });
        this.clientJobListByJobId(value.ClientId); /*-@why:EWM-15005,@when:31-10-2023,@who:Nitin Bhati-*/
        ////Add Job For Client
        if (this.type === "AddJobClient") {
          this.quickJobForm.patchValue({
            ClientId: this.clientId,
          });
          this.clientJobListByJobId(this.clientId); /*-@why:EWM-15005,@when:31-10-2023,@who:Nitin Bhati-*/
        } else {
          this.quickJobForm.patchValue({
            ClientId: value.ClientId,
            ClientName: value.ClientName,
          });
        }

        if (value.JobCategoryId != null && value.JobCategoryId != undefined) {
          this.selectedCategory = { Id: value.JobCategoryId, "JobCategory": value?.JobCategoryName };
          this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + this.selectedCategory?.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        }

        if (value.JobTypeId != null && value.JobTypeId != undefined) {
          this.selectedJobType = { Id: value.JobTypeId, JobType: value.JobTypeName };
          this.CMMN_Dropdown_ConfigJobSubType.API= this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + value?.JobTypeId  +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        }

        if (value.SalaryBandId != null && value.SalaryBandId != undefined) {
          this.selectedSalaryBandName = { Id: value.SalaryBandId };
        }

        if (value.SalaryUnitId != null && value.SalaryUnitId != undefined) {
          this.selectedSalaryUnit = { Id: value.SalaryUnitId,Name:value.SalaryUnitName };
        }

        if (value.WorkFlowId != null && value.WorkFlowId != undefined) {
          this.selectedJobWorkflow = { Id: value.WorkFlowId,WorkflowName: value.WorkFlowName };
        }


        if (value.ExperienceId != null && value.ExperienceId != undefined) {
          this.selectedExperience = { Id: value.ExperienceId, Name: value.ExperienceName};
          let experienceId = value.ExperienceId
          this.quickJobForm.patchValue(
            {
              ExperienceId: experienceId
            }
          )
        }

        if (value.IndustryId != null && value.IndustryId != undefined) {
          this.selectedIndustry = [{ Id: value.IndustryId, Description: value.IndustryName }];
          let industryId = [value.IndustryId];
          this.quickJobForm.patchValue({ IndustryId: industryId });
          //////Sub Industry//////////////
          this.CMMN_Dropdown_ConfigSubIndustry.API = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        }

        this.DescriptionValue = value.JobDescription;
        this.clientIdData = value.ClientId;

        this.selectedClientUser = { 'ClientId': value?.ClientId, 'ClientName': value?.ClientName}
          
      }

    })
  }




  onCancel() {
    if (this.isEditJob === true) {
    // <!---------@When: 03-Feb-2023 @who:Adarsh singh @why: EWM-9386 EWM-10393--------->
      if (this.floatingButtonForEdit) {
        this.valueChange.emit(2);
        return;
      }
      const soucepage = localStorage.getItem('PageSource');
      if(soucepage ==='JobDetails')
      {
        this.valueChange.emit(2);
        localStorage.removeItem('PageSource');
        localStorage.setItem('JobDetailsReload','true');
        return;
      }
      // End
      if (this.quickJobForm.value.WorkFlowId != undefined && this.quickJobForm.value.WorkFlowId != null && this.quickJobForm.value.WorkFlowId != '') {
        this.route.navigate(['/client/jobs/job/job-list/list/' + this.quickJobForm.value.WorkFlowId]);
      }
    } else if (this.isCopyJob === true) {
      if (this.quickJobForm.value.WorkFlowId != undefined && this.quickJobForm.value.WorkFlowId != null && this.quickJobForm.value.WorkFlowId != '') {
        this.route.navigate(['/client/jobs/job/job-list/list/' + this.quickJobForm.value.WorkFlowId]);
      }
      // For Add Job of Client Summary
    } else if (this.type === "AddJobClient") {

      this.route.navigate(['/client/core/clients/list/client-detail'], {
        queryParams: { clientId: this.clientId, cliTabIndex: "1" }
      });
    }else if(this.formTypeValue=='blankForm' || this.formTypeValue=='template'){
      this.route.navigate(['/client/jobs/job/job-manage/create-job-selection', { workFlowLenght: this.workFlowLenght }]);
    }
    //
    else {
      this.route.navigate(['/client/jobs/job/job-workflow/workflow']);
    }

  }

  /*
  @Type: File, <ts>
  @Name: JobTitleduplicayCheck function
  @Who: Anup
  @When: 2-july-2021
  @Why: EWM-1749 EWM-1900
  @What: For checking duplicacy for job Title
 */
  JobTitleduplicayCheck() {
    let JobId = " ";
    if (this.quickJobForm.get('Title').value == '') {
      return false;
    }
    this.quickJobService.checkJobTitleIsExists('?Id=' + JobId + '&Value=' + this.quickJobForm.get('Title').value).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 400) {
          if (repsonsedata.Status == false) {
            this.quickJobForm.get("Title").setErrors({ codeTaken: true });
            this.quickJobForm.get("Title").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode == 204) {
          if (repsonsedata.Status == true) {
            this.quickJobForm.get("Title").clearValidators();
            this.quickJobForm.get("Title").markAsPristine();
            this.quickJobForm.get('Title').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);

          }
        }
        else {
          this.quickJobForm.get("Title").clearValidators();
          this.quickJobForm.get("Title").markAsPristine();
          this.quickJobForm.get('Title').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
        }

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
 @Type: File, <ts>
 @Name: getClientAllDetailsList function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get company details
 */

  getClientAllDetailsList() {
    this.quickJobService.getClientAllDetailsList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.clientList = repsonsedata.Data;
          this.ClientLocationAddress=[];
          // if (this.clientIdData != null) {
          //   this.clickClientGetAddressDetails(this.clientIdData);
          //   this.getCompanyDetailsList(this.clientIdData);
          // }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }


 getCompanyDetailsList(clientIdData){
  if(clientIdData==undefined || clientIdData==null || clientIdData=='00000000-0000-0000-0000-000000000000'){
    this.companyList = [];
    this.contactList = [];
    return false;
    }
  let jsonObj = {};
  jsonObj['GridId'] ='ClientContacts_grid_001';
  jsonObj['ClientId'] = clientIdData;
  jsonObj['ByPassPaging'] = true;
   this.quickJobService.getCompanyDetailsList(jsonObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.companyList = repsonsedata.Data;
        // this.selectedCurrencyValue
        //this.selectedCurrencyValue = Number(repsonsedata['Data']['SalaryBandId']);
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      // this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })

}


  /*
@Type: File, <ts>
@Name: clickClientGetAddressDetails function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get Address by company id
*/

  clickClientGetAddressDetails(clientData) {
  
    this.clientAddressList = [];
    this.hideLocation = false;
    if(this.hideForJobDetailsView==true){
    }else{
      this.quickJobForm.get('Address1').reset();
      this.quickJobForm.get('Address2').reset();
      this.selectedValue = [];

      this.quickJobForm.get('StateId').reset();
      this.quickJobForm.get('City').reset();
      this.quickJobForm.get('ZipCode').reset();
      this.quickJobForm['controls'].address['controls'].AddressLinkToMap.reset();
    }    
    this.clientIdData = clientData?.ClientId;
    this.getCompanyDetailsList(this.clientIdData);

    if (clientData == null || clientData=='undefined' || clientData.length =='0') {
      this.quickJobForm.get('ClientId').reset();
      this.quickJobForm.get('ClientName').reset();
      this.quickJobForm.get('Address1').reset();
      this.quickJobForm.get('Address2').reset();
      this.quickJobForm.get('StateId').reset();
      this.quickJobForm.get('City').reset();
      this.quickJobForm.get('ZipCode').reset();
      this.quickJobForm['controls'].address['controls'].AddressLinkToMap.reset();
      return;
    } else {
      this.ClientName=clientData?.ClientName;
      this.clientId=clientData?.ClientId;
      this.quickJobForm.patchValue({
        ClientId: clientData.ClientId,
        ClientName: clientData?.ClientName,
      });
      this.clientAddressList = clientData?.ClientLocations[0];
      this.ClientLocationAddress=[];
       this.addressData=[];
       this.addressData=clientData?.ClientLocations;
      if(clientData?.ClientLocations[0]?.ZipCode!=null || clientData?.ClientLocations[0]?.ZipCode!=undefined){
        this.addressData?.forEach((element:any) => {
          element['PostalCode'] = clientData?.ClientLocations[0]?.ZipCode;
          element['District_Suburb'] = clientData?.ClientLocations[0]?.District; /***when- 30-10-2023 @who: renu @why: in case on client/agency changes district/suburb is not patching */
        });
      }
    this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(clientData?.ClientLocations[0]?.AddressLinkToMap);
    this.AddressLinkToMap = clientData?.ClientLocations[0]?.AddressLinkToMap;
    this.Latitude = clientData?.ClientLocations[0]?.Latitude;
    this.Longitude = clientData?.ClientLocations[0]?.Longitude;
      if (clientData.ClientId != '00000000-0000-0000-0000-000000000000') {
        this.hideLocation = true;
      }
      // if( this.isEditJob == true || this.isCopyJob == true || this.hideForJobDetailsView == true){
      //     this.onclickLocationPatchAddressField()
      // }
      /*-@why:EWM-14577,@when:06-10-2023,@who:Nitin Bhati,by default address showing-*/
      this.onclickLocationPatchAddressField()
    }

      if(clientData!=undefined && clientData!=null && clientData?.length!=0){
      //let ClientAddress = this.clientList.filter((e: any) => e.ClientId === clientData.ClientId);
      this.ClientName=clientData?.ClientName;
      this.clientId=clientData?.ClientId;
      this.quickJobForm.patchValue({
        ClientId: clientData.ClientId,
        ClientName: clientData?.ClientName,
      });
      this.clientAddressList = clientData?.ClientLocations[0];
      this.ClientLocationAddress=[];
       this.addressData=[];
       this.addressData=clientData?.ClientLocations;
      if(clientData?.ClientLocations[0]?.ZipCode!=null || clientData?.ClientLocations[0]?.ZipCode!=undefined){
        this.addressData?.forEach((element:any) => {
          element['PostalCode'] = clientData?.ClientLocations[0]?.ZipCode;
          element['District_Suburb'] = clientData?.ClientLocations[0]?.District; /***when- 30-10-2023 @who: renu @why: in case on client/agency changes district/suburb is not patching */
          
        });
      }
    this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(clientData?.ClientLocations[0]?.AddressLinkToMap);
    this.AddressLinkToMap = clientData?.ClientLocations[0]?.AddressLinkToMap;
    this.Latitude = clientData?.ClientLocations[0]?.Latitude;
    this.Longitude = clientData?.ClientLocations[0]?.Longitude;
      if (clientData.ClientId != '00000000-0000-0000-0000-000000000000') {
        this.hideLocation = true;
      }
      // if( this.isEditJob == true || this.isCopyJob == true || this.hideForJobDetailsView == true){
      //     this.onclickLocationPatchAddressField()
      // }
      /*-@why:EWM-14577,@when:06-10-2023,@who:Nitin Bhati,by default address showing-*/
      this.onclickLocationPatchAddressField()
      }


    clientData.ClientId == undefined ?  this.hideLocation = false : '';
    this.companyContactsPatch = [];
    this.companyList =[];
  }
  

  onclickLocationPatchAddressField() {
    this.selectedValue = { 'Id': Number(this.clientAddressList?.CountryId),'CountryName': this.clientAddressList?.CountryName };
    this.clickCountrygetAllState(this.clientAddressList?.CountryId);
     /*  @Who: Bantee @When: 15-May-2023 @Why: EWM-11496*/
    setTimeout(() => {
      this.selectedState = { 'Id': Number(this.clientAddressList?.StateId), 'StateName': this.clientAddressList?.StateName};
      this.onStateChange(this.selectedState);
    }, 2000);

    setTimeout(() => {
      this.quickJobForm.patchValue({
        Address1: this.clientAddressList?.AddressLine1,
        Address2: this.clientAddressList?.AddressLine2,
        // StateId: stateid,
        City: this.clientAddressList?.TownCity,
        ZipCode: this.clientAddressList?.ZipCode,
        AddressLinkToMap:this.AddressLinkToMap,
        Latitude :this.Latitude,
        Longitude:this.Longitude
      })

    }, 300);

  }
  /*
  @Type: File, <ts>
  @Name: clickCountrygetAllState function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: get state list by state id
  */

  clickCountrygetAllState(CountryId) {
   // alert(CountryId);
    this.stateList = []
    this.StateIdData = null;
    let countryId = CountryId == undefined ? 0 : CountryId;

    this.quickJobService.getAllStateByCountryId(countryId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.stateList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }




  /*
 @Type: File, <ts>
 @Name: ddlchange function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: Get Country list
 */

  ddlchange(data) {
      this.selectedState = null;
      this.quickJobForm.patchValue(
        {
          StateId: null
        }
      )

    if (data == null || data == "" || data == undefined) {
      // this.quickJobForm.get("Country").setErrors({ required: true });
      // this.quickJobForm.get("Country").markAsTouched();
      // this.quickJobForm.get("Country").markAsDirty();
      this.selectedValue = null;
    }
    else {
      this.quickJobForm.get("Country").clearValidators();
      this.quickJobForm.get("Country").markAsPristine();
      this.selectedValue = data;
      if (data.Id == 0) {
        this.selectedValue = null;
        this.selectedState = null;
        this.quickJobForm.patchValue(
          {
            Country: null,
            StateId: null
          }
        )
      }else{
        this.quickJobForm.patchValue(
          {
            Country: data.Id,
            // StateId: null,
            // StateName: null
          }
        )
      }
      // this.clickCountrygetAllState(data.Id);
       ////// satate//////////////
    this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll+'?ByPassPaging=true' +"&CountryId="+ this.selectedValue?.Id+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'
    this.resetFormSubjectState.next(this.dropDownStateConfig);
    }

  }


  /////Job Details Second Pannel////////
  //////Category
  /*
 @Type: File, <ts>
 @Name: onCategorychange function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get category
 */
  onCategorychange(data) {
    this.selectedSubCategory = null;
    if (data == null || data == "") {
      this.selectedCategory = null;
      this.quickJobForm.patchValue(
        {
          JobCategoryId: null,
          JobSubCategoryId: null,
        }
      )
      // this.quickJobForm.get("JobCategoryId").setErrors({ required: true });
      // this.quickJobForm.get("JobCategoryId").markAsTouched();
      // this.quickJobForm.get("JobCategoryId").markAsDirty();
    }
    else {
      this.quickJobForm.get("JobCategoryId").clearValidators();
      this.quickJobForm.get("JobCategoryId").markAsPristine();
      this.selectedCategory = data;
      this.quickJobForm.patchValue(
        {
          JobCategoryId: data.Id,
          JobSubCategoryId: null,
        }
      )
      //////Job Sub Category//////////////
      this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + this.selectedCategory?.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubCategory.next(this.CMMN_Dropdown_ConfigJob_SUB_Category);

    }
  }


  /*
@Type: File, <ts>
@Name: onSubCategorychange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get sub category list by category id
*/
  onSubCategorychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedSubCategory = null;
      this.quickJobForm.patchValue(
        {
          JobSubCategoryId: null
        });
      // this.quickJobForm.get("JobSubCategoryId").setErrors({ required: true });
      // this.quickJobForm.get("JobSubCategoryId").markAsTouched();
      // this.quickJobForm.get("JobSubCategoryId").markAsDirty();
    }
    else {
      this.quickJobForm.get("JobSubCategoryId").clearValidators();
      this.quickJobForm.get("JobSubCategoryId").markAsPristine();
      this.selectedSubCategory = data;
      const subCategoryId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          JobSubCategoryId: subCategoryId
        }
      )
    }
  }

  /*
 @Type: File, <ts>
 @Name: onIndustrychange function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get industry List
 */
  onIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;
      this.selectedSubIndustry = null;
      this.selectedQualification = null; // <!---------@When: 21-april-2023 @who:bantee kumar @why: EWM-11814 EWM-12073--------->
      this.selectedIndustryList=null
      this.quickJobForm.patchValue(
        {
          IndustryId: null,
          SubIndustryId: null,
          QualificationId:null,

        })
        this.CMMN_Dropdown_ConfigSubIndustry.API= this.serviceListClass.getSubIndustryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.resetFormSubjectSubIndustry.next(this.CMMN_Dropdown_ConfigSubIndustry);
        this.CMMN_Dropdown_ConfigQualification.API =  this.serviceListClass.getQualification+'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.resetFormSubjectQualification.next(this.CMMN_Dropdown_ConfigQualification);
    }
    else {
      this.quickJobForm.get("IndustryId").clearValidators();
      this.quickJobForm.get("IndustryId").markAsPristine();
      this.selectedIndustry = data;
      const industryId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          IndustryId:  this.selectedIndustry
        }
      )
      //////Sub Industry//////////////
      this.CMMN_Dropdown_ConfigSubIndustry.API= this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industryId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubIndustry.next(this.CMMN_Dropdown_ConfigSubIndustry);

      // this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification;
      let cond = industryId ? '?IndustryId=' +  industryId + '&' : '?'
      this.CMMN_Dropdown_ConfigQualification.API =  this.serviceListClass.getQualification+cond+'FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectQualification.next(this.CMMN_Dropdown_ConfigQualification);

    }
    //this.clickIndustryGetSubIndustry();
  }


  /*
@Type: File, <ts>
@Name: onSubIndustrychange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get sub industry List by industry id
*/
  onSubIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedSubIndustry = null;
      this.quickJobForm.patchValue(
        {
          SubIndustryId: null
        });
      // this.quickJobForm.get("SubIndustryId").setErrors({ required: true });
      // this.quickJobForm.get("SubIndustryId").markAsTouched();
      // this.quickJobForm.get("SubIndustryId").markAsDirty();
    }
    else {
      this.quickJobForm.get("SubIndustryId").clearValidators();
      this.quickJobForm.get("SubIndustryId").markAsPristine();
      this.selectedSubIndustry = data;
      const subIndustryId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          SubIndustryId: subIndustryId
        }
      )

    }
  }

  clickIndustryGetSubIndustry() {
    let indusData = this.quickJobForm.get('IndustryId').value;

    // if (Id.length == 0) {
    //   this.quickJobForm.get('SubIndustryId').reset();
    //   this.subIndustryList = [];
    // }
    const industryId = indusData.map((item: any) => {
      return item.Id
    });
    this.quickJobService.getSubIndustryAll(industryId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.subIndustryList = repsonsedata.Data;
          this.cancelIndustryUpdateSubIndustry(this.subIndustryList);
        }

        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
@Type: File, <ts>
@Name: cancelIndustryUpdateSubIndustry function
@Who: Anup
@When: 2-July-2021
@Why: EWM-1749 EWM-1900
@What: get sub industry List by industry id
*/
  cancelIndustryUpdateSubIndustry(data) {
    if (this.quickJobForm.get('SubIndustryId').value != null) {
      //filter common id/value b/w two array
      const commonSubIndustryId = data.filter(o => this.selectedSubIndustry.some(({ Id, Code }) => o.Id === Id && o.Code === Code));
      this.selectedSubIndustry = commonSubIndustryId;
      const subIndustryId = commonSubIndustryId.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          SubIndustryId: subIndustryId
        }
      )
    }
  }


  //////////Experience

  /*
@Type: File, <ts>
@Name: onExperiencechange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get Experience List
*/
  onExperiencechange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedExperience = null;
      this.quickJobForm.patchValue(
        {
          ExperienceId: null
        });
      // this.quickJobForm.get("ExperienceId").setErrors({ required: true });
      // this.quickJobForm.get("ExperienceId").markAsTouched();
      // this.quickJobForm.get("ExperienceId").markAsDirty();
    }
    else {
      // this.quickJobForm.get("ExperienceId").clearValidators();
      // this.quickJobForm.get("ExperienceId").markAsPristine();
      this.selectedExperience = data;
      // const subExperienceId = data.map((item: any) => {
      //   return item.Id
      // });
      this.quickJobForm.patchValue(
        {
          ExperienceId: data.Id
        }
      )
    }
  }



  ///////////////Job Type

  /*
  @Type: File, <ts>
  @Name: onJobTypechange function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: get Job Type List
  */
  onJobTypechange(data) {
    this.selectedJobSubType = null;
    if (data == null || data == "") {
      this.selectedJobType = null;
      this.quickJobForm.patchValue(
        {
          JobTypeId: null,
          JobSubTypeId: null,
        }
      )
      this.quickJobForm.get("JobTypeId").setErrors({ required: true });
      this.quickJobForm.get("JobTypeId").markAsTouched();
      this.quickJobForm.get("JobTypeId").markAsDirty();
    }
    else {
      this.quickJobForm.get("JobTypeId").clearValidators();
      this.quickJobForm.get("JobTypeId").markAsPristine();
      this.selectedJobType = data;
      this.quickJobForm.patchValue(
        {
          JobTypeId: data.Id,
          JobSubTypeId: null,
        }
      )

      //////Job Sub Type//////////////
      this.CMMN_Dropdown_ConfigJobSubType.API = this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + this.selectedJobType.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubject.next(this.CMMN_Dropdown_ConfigJobSubType);
    }
  }


  /*
@Type: File, <ts>
@Name: onJobSubTypechange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What:  @What: get Job sub Type List by job type id
*/
  onJobSubTypechange(data) {
    if (data == null || data == "") {
      this.selectedJobSubType = null;
      this.quickJobForm.patchValue(
        {
          JobSubTypeId: null,
        })
      // this.quickJobForm.get("JobSubTypeId").setErrors({ required: true });
      // this.quickJobForm.get("JobSubTypeId").markAsTouched();
      // this.quickJobForm.get("JobSubTypeId").markAsDirty();

    }
    else {
      this.quickJobForm.get("JobSubTypeId").clearValidators();
      this.quickJobForm.get("JobSubTypeId").markAsPristine();
      this.selectedJobSubType = data;
      this.quickJobForm.patchValue(
        {
          JobSubTypeId: data.Id
        }
      )
    }
  }




  ///////////////////Expertise

  /*
 @Type: File, <ts>
 @Name: onExpertieschange function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get Expertise List
 */

  onExpertieschange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedExperties = null;
      this.selectedSubExperties = null;
      this.quickJobForm.patchValue(
        {
          ExpertiseId: null,
          SubExpertiseId: null,
        })
      // this.quickJobForm.get("ExpertiseId").setErrors({ required: true });
      // this.quickJobForm.get("ExpertiseId").markAsTouched();
      // this.quickJobForm.get("ExpertiseId").markAsDirty();
    }
    else {
      this.quickJobForm.get("ExpertiseId").clearValidators();
      this.quickJobForm.get("ExpertiseId").markAsPristine();
      this.selectedExperties = data;
      const expertiesId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          ExpertiseId: expertiesId
        }
      )
      //////Sub Experties//////////////
      this.CMMN_Dropdown_ConfigSubExperties.API = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      // this.dropDownSubExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubExperties.next(this.CMMN_Dropdown_ConfigSubExperties);

    }
    //this.clickExpertiseGetSubExpertise();
  }




  /*
@Type: File, <ts>
@Name: onSubExpertieschange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What:get sub Expertise List by expertise id
*/

  onSubExpertieschange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedSubExperties = null;
      this.quickJobForm.patchValue(
        {
          SubExpertiseId: null,
        });
      // this.quickJobForm.get("SubExpertiseId").setErrors({ required: true });
      // this.quickJobForm.get("SubExpertiseId").markAsTouched();
      // this.quickJobForm.get("SubExpertiseId").markAsDirty();
    }
    else {
      this.quickJobForm.get("SubExpertiseId").clearValidators();
      this.quickJobForm.get("SubExpertiseId").markAsPristine();
      this.selectedSubExperties = data;
      const subExpertiesId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          SubExpertiseId: subExpertiesId
        }
      )

    }
  }

  clickExpertiseGetSubExpertise() {
    let expertiseData = this.quickJobForm.get('ExpertiseId').value;
    // if (Id.length == 0) {
    //   this.quickJobForm.get('SubExpertiseId').reset();
    //   this.subExpertiseList = [];
    // }
    const expertiesId = expertiseData.map((item: any) => {
      return item.Id
    });
    this.quickJobService.fetchfunctionalSubExpertiseList(expertiesId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.subExpertiseList = repsonsedata.Data;
          this.cancelExpertiseUpdateSubExpertise(this.subExpertiseList);

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }




  /*
@Type: File, <ts>
@Name: cancelExpertiseUpdateSubExpertise function
@Who: Anup
@When: 2-July-2021
@Why: EWM-1749 EWM-1900
@What:get sub Expertise List by expertise id
*/
  cancelExpertiseUpdateSubExpertise(data) {
    // const subId = data.map((item: any) => {
    //   return item.Id
    // });
    if (this.quickJobForm.get('SubExpertiseId').value != null) {
      //filter common id/value b/w two array
      const commonSubExpertiseId = data.filter(o => this.selectedSubExperties.some(({ Id, FunctionalSubExpertise }) => o.Id === Id && o.FunctionalSubExpertise === FunctionalSubExpertise));
      this.selectedSubExperties = commonSubExpertiseId;
      const subExpertiesId = commonSubExpertiseId.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          SubExpertiseId: subExpertiesId
        }
      )

    }
  }




  ///WorkFlow
  /*
@Type: File, <ts>
@Name: onJobWorkflowchange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get Work Flow List
*/
  onJobWorkflowchange(data) {
    if (data == null || data == "") {
      this.selectedJobWorkflow = null;
      this.quickJobForm.patchValue(
        {
          WorkFlowId: null
        }
      )
      this.quickJobForm.get("WorkFlowId").setErrors({ required: true });
      this.quickJobForm.get("WorkFlowId").markAsTouched();
      this.quickJobForm.get("WorkFlowId").markAsDirty();
    }
    else {
      this.quickJobForm.get("WorkFlowId").clearValidators();
      this.quickJobForm.get("WorkFlowId").markAsPristine();
      this.selectedJobWorkflow = data;
      this.quickJobForm.patchValue(
        {
          WorkFlowId: data.Id
        }
      )
    }
  }


  ///StatusAll

  /*
@Type: File, <ts>
@Name: onJobStatuschange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get Status List
*/

  onJobStatuschange(data) {
    this.selectedReason = null;
    if (data == null || data == "") {
      this.selectedJobStatus = null;
      this.quickJobForm.patchValue(
        {
          StatusId: null,
          ReasonId: 0,
          ReasonName: ''
        }
      )
      this.quickJobForm.get("StatusId").setErrors({ required: true });
      this.quickJobForm.get("StatusId").markAsTouched();
      this.quickJobForm.get("StatusId").markAsDirty();
    }
    else {
      this.quickJobForm.get("StatusId").clearValidators();
      this.quickJobForm.get("StatusId").markAsPristine();
      this.selectedJobStatus = data;
      this.quickJobForm.patchValue(
        {
          StatusId: data.Id,
          StatusName:data.Description,
          StatusColorCode:data.ColorCode,
          ReasonId: 0,
          ReasonName: ''
        }
      )
    }
    //////Job Sub Type//////////////
    /*---@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883 ,What:pass group type---*/
    this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.JobID + '&statusId='+ this.selectedJobStatus.Id+'&GroupCode=JOB';
    this.resetFormselectedReason.next(this.dropDownReasonConfig);
  }

  ///Qualification All


  /*
@Type: File, <ts>
@Name: onQualificationchange function
@Who: Anup
@When: 23-Aug-2021
@Why: EWM-2515 EWM-2621
@What: get Qualification List
*/

  onQualificationchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedQualification = null;
      this.quickJobForm.patchValue(
        {
          QualificationId: null
        });
      // this.quickJobForm.get("QualificationId").setErrors({ required: true });
      // this.quickJobForm.get("QualificationId").markAsTouched();
      // this.quickJobForm.get("QualificationId").markAsDirty();
    }
    else {
      this.quickJobForm.get("QualificationId").clearValidators();
      this.quickJobForm.get("QualificationId").markAsPristine();
      this.selectedQualification = data;
      const qualificationId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          QualificationId: qualificationId
        }
      )
    }
  }

  /////Salary Third Pannel////////

  /////Currency


  /*
@Type: File, <ts>
@Name: getCurrencyAll function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get currency List
*/
getCurrencyAll() {
  this.quickJobService.getCurrency('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true').subscribe(
    (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.currencyList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /////Salary
  /*
@Type: File, <ts>
@Name: onJobSalaryUnitchange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get salary List
*/

  onJobSalaryUnitchange(data) {
    if (data == null || data == "") {
      this.selectedSalaryUnit = null;
      this.quickJobForm.patchValue(
        {
          SalaryUnitId: null
        }
      )
      // this.quickJobForm.get("SalaryUnitId").setErrors({ required: true });
      // this.quickJobForm.get("SalaryUnitId").markAsTouched();
      // this.quickJobForm.get("SalaryUnitId").markAsDirty();
    }
    else {
      // this.quickJobForm.get("SalaryUnitId").clearValidators();
      // this.quickJobForm.get("SalaryUnitId").markAsPristine();
      this.selectedSalaryUnit = data;
      this.quickJobForm.patchValue(
        {
          SalaryUnitId: data.Id,
          SalaryUnitName: data.Name,
        }
      )
    }
  }



  //////salary Band
  /*
@Type: File, <ts>
@Name: onJobSalaryBandchange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get salary Band List
*/

  onJobSalaryBandchange(data) {
    if (data == null || data == "") {
      this.selectedSalaryBandName = null;
      this.quickJobForm.patchValue(
        {
          SalaryBandId: null
        }
      )
      // this.quickJobForm.get("SalaryBandId").setErrors({ required: true });
      // this.quickJobForm.get("SalaryBandId").markAsTouched();
      // this.quickJobForm.get("SalaryBandId").markAsDirty();
    }
    else {
      // this.quickJobForm.get("SalaryBandId").clearValidators();
      // this.quickJobForm.get("SalaryBandId").markAsPristine();
      this.selectedSalaryBandName = data;
      this.quickJobForm.patchValue(
        {
          SalaryBandId: data.Id,
          SalaryBandName : data.SalaryBandName
        }
      )
    }
  }



  ////////////////Description Fourth Pannel///////////////////

  //////Job Tag
  /*
@Type: File, <ts>
@Name: onTagchange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get Job Tag List
*/

  onTagchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedTag = null;
      this.quickJobForm.patchValue(
        {
          JobTagId: null
        });
      // this.quickJobForm.get("JobTagId").setErrors({ required: true });
      // this.quickJobForm.get("JobTagId").markAsTouched();
      // this.quickJobForm.get("JobTagId").markAsDirty();
    }
    else {
      this.quickJobForm.get("JobTagId").clearValidators();
      this.quickJobForm.get("JobTagId").markAsPristine();
      this.selectedTag = data;
      const tagId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          JobTagId: tagId
        }
      )
    }
  }


  ////////////////Description 5th Pannel///////////////////

  ///Brand
  /*
  @Type: File, <ts>
  @Name: onJobBrandschange function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: get all brand List
  */

  onJobBrandschange(data) {
    if (data == null || data == "") {
      this.selectedBrands = null;
      this.quickJobForm.patchValue(
        {
          BrandId: null
        }
      )
      // this.quickJobForm.get("BrandId").setErrors({ required: true });
      // this.quickJobForm.get("BrandId").markAsTouched();
      // this.quickJobForm.get("BrandId").markAsDirty();
    }
    else {
      this.quickJobForm.get("BrandId").clearValidators();
      this.quickJobForm.get("BrandId").markAsPristine();
      this.selectedBrands = data;
      this.quickJobForm.patchValue(
        {
          BrandId: data.Id,
          BrandName:data.Brand
        }
      )
      this.BrandName=data.Brand;
    }
  }




  ////Owner & company contacts
  /*
@Type: File, <ts>
@Name: getAllOwnerAndCompanyContacts function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get All Owner And Company Contacts
*/
  getAllOwnerAndCompanyContacts() {
    this.quickJobService.fetchUserInviteList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.ownerList = repsonsedata.Data;

          this.companyContactsList = this.ownerList.filter((e: any) => e.UserTypeCode === 'EMPL');
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
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
  // --------@When: 01-12-2022 @who:Adarsh singh @why: EWM-9576 Desc: Adding condition while before open the modal--------
    if (this.isViewMode) {
      const dialogRef = this.dialog.open(JobDescriptionPopupEditorComponent, {
        maxWidth: "750px",
        // data: dialogData,
        data: { DescriptionData: this.DescriptionValue, },
        panelClass: ['quick-modalbox', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(DescriptionData => {
        this.quickJobForm.patchValue({
          DescriptionDetails: DescriptionData
        });

        this.DescriptionValue = DescriptionData;

      });
    }

  }

  //////skills  For Chip Design Anup Singh///////
  // visible = true;
  // selectable = true;
  // removable = true;
  // addOnBlur = true;
  // readonly separatorKeysCodes: number[] = [ENTER, SPACE, TAB,  COMMA];
  // skills: any[] = [];

  // add(event: MatChipInputEvent): void {
  //   const value = (event.value || '').trim();
  //   if (value) {
  //     this.skills.push(value);
  //   }
  //   // Reset the input value
  //   if (event.input) {
  //     event.input.value = '';
  //   }
  // }

  // remove(skill): void {
  //   const index = this.skills.indexOf(skill);

  //   if (index >= 0) {
  //     this.skills.splice(index, 1);
  //   }
  // }

  /// End Code Of Skill Chip////


  /*
 @Type: File, <ts>
 @Name: onChangeToggle function
 @Who: Anup
 @When: 25-Aug-2021
 @Why: EWM-2515 EWM-2621
 @What: enable disable Manage Access
*/

  onChangeToggle(enable: boolean) {
    // if (enable) {
    //   this.dropDownManageAccessConfig['IsDisabled'] = false;
    //   this.resetFormSubjectManage.next(this.dropDownManageAccessConfig);
    // } else {
    //   this.dropDownManageAccessConfig['IsDisabled'] = true;
    //   this.resetFormSubjectManage.next(this.dropDownManageAccessConfig);
    // }
    if (enable) {
     // <!-- @Who: bantee ,@When: 31-mar-2023, @Why: EWM-11434 ,What: add required validator on condition based -->
     // <!-- @Who: bantee ,@When: 20-04-2023, @Why: EWM-11998 ,What: add required validator on condition based -->
      this.quickJobForm.controls['PublishDate'].setValidators([Validators.required]);
      this.dropDownManageAccessConfig['IsDisabled'] = false;
      this.resetFormSubjectManage.next(this.dropDownManageAccessConfig);
    } else {
      this.dropDownManageAccessConfig['IsDisabled'] = true;
      this.resetFormSubjectManage.next(this.dropDownManageAccessConfig);
      this.quickJobForm.controls['PublishDate'].clearValidators();

    }
  }



  /*
 @Type: File, <ts>
 @Name: onManageAccesschange function
 @Who: Anup
 @When: 23-Aug-2021
 @Why: EWM-2515 EWM-2621
 @What: For showing the list of group data
*/
  onManageAccesschange(data) {
    if (data == null || data == "") {
      this.selectedManageAccess = null;
      this.quickJobForm.patchValue(
        {
          ManageAccessId: 0
        }
      )
      // this.quickJobForm.get("ManageAccessId").setErrors({ required: true });
      // this.quickJobForm.get("ManageAccessId").markAsTouched();
      // this.quickJobForm.get("ManageAccessId").markAsDirty();
    }
    else {
      this.quickJobForm.get("ManageAccessId").clearValidators();
      this.quickJobForm.get("ManageAccessId").markAsPristine();
      this.selectedManageAccess = data;
      this.quickJobForm.patchValue(
        {
          ManageAccessId: data.Id
        }
      )
    }
  }

    /*
 @Type: File, <ts>
 @Name: onMapApplicationForm function
 @Who: Adarsh singh
 @When: 15-06-22
 @Why: EWM-6971 EWM-7201
 @What: For showing dropDown data list for map application dropDown
*/
onMapApplicationForm(data) {

  if (data == null || data == "") {
    this.selectedMapApplication = null;
    if(this.selectedMapApplication == 0){
      this.quickJobForm.patchValue(
        {
          ApplicationFormId: null
        }
      )
    }
    // this.quickJobForm.get("ApplicationFormId").setErrors({ required: true });
    // this.quickJobForm.get("ApplicationFormId").markAsTouched();
    // this.quickJobForm.get("ApplicationFormId").markAsDirty();
  }
  else {
    this.quickJobForm.get("ApplicationFormId").clearValidators();
    this.quickJobForm.get("ApplicationFormId").markAsPristine();
    this.selectedMapApplication = data;
    this.quickJobForm.patchValue(
      {
        ApplicationFormId: data.Id,
        ApplicationFormName: data.Name
      }
    )
  }

  if (this.quickJobForm.value.MapApplicationFormBtn) {
    if (data == null) {
      this.isMapAppToggled = true;
      this.dropDownMapApplicationConfig['IsRequired'] = true;
      this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
    }else{
      this.isMapAppToggled = false;
      this.dropDownMapApplicationConfig['IsRequired'] = true;
      this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
    }
  }
  else{
    this.isMapAppToggled = false;
    this.dropDownMapApplicationConfig['IsRequired'] = false;
    this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
  }
}

isChecked;
onChangeMapApplicationToggle(e){
  this.isChecked = e;
  if (e) {
      /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map application form quick job**************/
      this.applicationFormInfo();
        /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map application form quick job************/

  }else{
    this.isDropdown = false;
    this.selectedMapApplication = null;
    this.quickJobForm.patchValue({
      ApplicationFormId: 0
    })
    this.isMapAppToggled = false;
  }
}



  /*
   @Type: File, <ts>
   @Name: onConfirm function
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: For saving quick job data
  */
  onConfirm(): void {
    this.submitted = true;
    if (this.quickJobForm.valid) {
      sessionStorage.setItem('QuickFilterForClone',this.isActive);
      sessionStorage.setItem('BrowserReloadFilter',this.quickFilter);

      this.loading = true; /*-@why:EWM-14577,@when:05-10-2023,@who:Nitin Bhati-*/
       if(this.quickJobForm.value.IsDisable == true && this.quickJobForm.value.FillDate!=null){
        if(this.quickJobForm.value.PublishDate>this.quickJobForm.value.FillDate){
          this.loading = false;
         const message = ``;
         const title = 'label_disabled';
         const subtitle = 'label_folderName';
         const dialogData = new ConfirmDialogModel(title, subtitle, message);
         const dialogRef = this.dialog.open(PublishJobValidationComponent, {
          data: new Object({ editId: 'Add'}),
          panelClass: ['xeople-modal', 'add_publishValidation','animate__animated', 'animate__zoomIn'],
          disableClose: true,
         });
         let dir:string;
         dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
         let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
         for(let i=0; i < classList.length; i++){
           classList[i].setAttribute('dir', this.dirctionalLang);
          }
         dialogRef.afterClosed().subscribe(res => {
           if(res===false){
            document.getElementsByClassName("add_publishValidation")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("add_publishValidation")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(false); }, 200);
           }else{
         const message = ``;
         const title = 'label_disabled';
         const subtitle = 'label_folderName';
         const dialogData = new ConfirmDialogModel(title, subtitle, message);
         const dialogRef = this.dialog.open(PopupIntegrationCategoryComponent, {
          data: new Object({ editId: 'Add'}),
          panelClass: ['xeople-modal', 'add_Integrationcategory','animate__animated', 'animate__zoomIn'],
          disableClose: true,
         });
         let dir:string;
         dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
         let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
         for(let i=0; i < classList.length; i++){
           classList[i].setAttribute('dir', this.dirctionalLang);
          }
         dialogRef.afterClosed().subscribe(res => {
           if(res==true){
            this.onSave();
            document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(false); }, 200);
           }else{
            document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(false); }, 200);
            }
        })
        }
      })
    }else{
         this.onSave();
    }
      }else{
        this.onSave();
      }
    }

  }





  /*
    @Type: File, <ts>
    @Name: createRequest function
    @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
    @What: method for onConfirm method
   */
  public createRequest(): IquickJob {

    let requestData: IquickJob = {};

    if (this.isEditJob === true) {
      requestData.JobId = this.EditJobId;
      requestData.ReferenceId = this.jobDetailsDataByJobId?.JobReferenceId;
    }
// who:maneesh,what:ewm-13530 for trim data when:25/07/2023
    requestData.Title = this.quickJobForm.value.Title?.trim();
    if (this.type === "AddJobClient") {      
      requestData.ClientId = this.clientId;
      requestData.ClientName = this.ClientName;
      requestData.OrganizationName =  this.OrganizationName;
    } else {
      requestData.ClientId = this.quickJobForm.value.ClientId;
      requestData.ClientName = this.quickJobForm.value.ClientName;/*-@why:EWM-14961,@who: Nitin Bhati.@when:26-10-2023-*/
      requestData.OrganizationName =  this.OrganizationName;
    }
    requestData.Address1 = this.quickJobForm.value.Address1?.trim();
    requestData.Address2 = this.quickJobForm.value.Address2?.trim();
    requestData.City = this.quickJobForm.value.City?.trim();
    requestData.AddressLinkToMap = this.quickJobForm.value.address.AddressLinkToMap;
    requestData.Latitude = this.quickJobForm.value.Latitude;
    requestData.Longitude = this.quickJobForm.value.Longitude;
    requestData.StateId = this.quickJobForm.value.StateId ? this.quickJobForm.value.StateId : this.selectedState?.Id;
    requestData.StateName = this.selectedState?.StateName;
    requestData.DistrictSuburb = this.quickJobForm.value.District_Suburb?.trim();
    requestData.JobUrl =  this.baseUrl;

    let countryIdSubmit;
    if (this.selectedValue == undefined || this.selectedValue == null) {
      countryIdSubmit = 0;
    }
    else {
      countryIdSubmit = this.selectedValue.Id;
    }
    requestData.CountryId = countryIdSubmit;
    requestData.CountryName = this.selectedValue?.CountryName;
    requestData.ZipCode = this.quickJobForm.value.ZipCode?.trim();

    let jobDetailsAll: IjobDetails = {}
    jobDetailsAll.JobCategoryId = this.quickJobForm.value.JobCategoryId;
    jobDetailsAll.JobSubCategoryId = this.quickJobForm.value.JobSubCategoryId;
   // <!---------@When: 21-april-2023 @who:bantee kumar @why: EWM-11814 EWM-12073--------->
    this.selectedIndustryList=[];
    this.selectedIndustry?.forEach(element => {
      this.selectedIndustryList.push({
        'IndustryId': element['Id'],
        'IndustryName': element['Description'],
      });
    })
    jobDetailsAll.Industries=  this.selectedIndustryList;
    this.selectedSubIndustry?.forEach(element => {
      this.selectedSubIndustryList.push({
        'SubIndustryId': element['Id'],
        'SubIndustryName': element['Description'],
      });
    });
    jobDetailsAll.SubIndustries = [...new Set(this.selectedSubIndustryList)];
    this.selectedQualification?.forEach(element => {
      this.selectedQualificationList.push({
        'Id': element['Id'],
        'QualificationName': element['QualificationName'],
      });
    });
    jobDetailsAll.Qualifications = [...new Set(this.selectedQualificationList)];

    // jobDetailsAll.IndustryId = this.quickJobForm.value.IndustryId;
    // jobDetailsAll.SubIndustryId = this.quickJobForm.value.SubIndustryId;
    // jobDetailsAll.QualificationId = this.quickJobForm.value.QualificationId;
    jobDetailsAll.ExperienceId = this.quickJobForm.value.ExperienceId==null?[]:[this.quickJobForm.value.ExperienceId];
    // jobDetailsAll.ExperienceId = this.experienceIdValue;

    jobDetailsAll.JobTypeId = this.quickJobForm.value.JobTypeId;
    jobDetailsAll.JobSubTypeId = this.quickJobForm.value.JobSubTypeId;
    this.selectedExperties?.forEach(element => {
      this.selectedExpertiesList.push({
        'ExpertiseId': element['Id'],
        'ExpertiseName': element['FunctionalExpertise'],
      });
    });
    jobDetailsAll.Expertise = [...new Set(this.selectedExpertiesList)];
    this.selectedSubExperties?.forEach(element => {
      this.selectedSubExpertiesList.push({
        'SubExpertiseId': element['Id'],
        'SubExpertiseName': element['FunctionalSubExpertise'],
      });
    });
    jobDetailsAll.SubExpertise = [...new Set(this.selectedSubExpertiesList)];
    // jobDetailsAll.ExpertiseId = this.quickJobForm.value.ExpertiseId;
    // jobDetailsAll.SubExpertiseId = this.quickJobForm.value.SubExpertiseId;
    let skillId: any;
    if (this.skillSelectedList != undefined && this.skillSelectedList != null && this.skillSelectedList.length != 0) {
      this.skillFinalData = [];  // <!---------@When: 21-april-2023 @who:bantee kumar @why: EWM-11814 EWM-12073--------->
      this.skillSelectedList?.forEach(element => {
        this.skillFinalData.push({
          'SkillId': element.Id,
          'SkillName': element.SkillName,
          'Weightage': element.Weightage
        });
      });
    } else {
      skillId = [];
    }
    jobDetailsAll.SkillList = this.skillFinalData;

    // jobDetailsAll.SkillList = this.skillIds;
    // let skillsChipValue
    // if(this.skills.length==0){
    //   skillsChipValue = null;
    // }else{
    //   skillsChipValue = this.skills;
    // }
    // jobDetailsAll.Skills = skillsChipValue;


    requestData.JobDetails = jobDetailsAll;

    //Salary
    let salaryDetailsAll: Isalary = {};
    salaryDetailsAll.CurrencyId = this.quickJobForm.value.CurrencyId==null?0:this.quickJobForm.value.CurrencyId;
    salaryDetailsAll.SalaryUnitId = this.quickJobForm.value.SalaryUnitId==null?0:this.quickJobForm.value.SalaryUnitId;
    salaryDetailsAll.SalaryUnitName = this.quickJobForm.value.SalaryUnitName;
    salaryDetailsAll.SalaryBandId = this.quickJobForm.value.SalaryBandId==null?0:this.quickJobForm.value.SalaryBandId;
    salaryDetailsAll.SalaryBandName = this.quickJobForm.value.SalaryBandName;
    salaryDetailsAll.Bonus = parseFloat(this.quickJobForm.value.Bonus);
    salaryDetailsAll.Equity = parseFloat(this.quickJobForm.value.Equity);
    salaryDetailsAll.CurrencyName = this.quickJobForm.value.CurrencyName;
    salaryDetailsAll.CurrencySymbol = this.quickJobForm.value.CurrencySymbol;
    salaryDetailsAll.SalaryUnitName = this.quickJobForm.value.SalaryUnitName;
    salaryDetailsAll.HideSalary = this.quickJobForm.value.HideSalary === true ? 1 : 0;

    requestData.Salary = salaryDetailsAll;

    //Job Tag
    let jobTagDetailsAll: IjobDescription = {};
    // jobTagDetailsAll.Description = this.quickJobForm.value.DescriptionDetails;
    jobTagDetailsAll.Description = this.DescriptionValue;
    jobTagDetailsAll.InternalNotes = this.quickJobForm.value.InternalNotes?.trim();
    jobTagDetailsAll.JobTagId = this.quickJobForm.value.JobTagId;

    requestData.JobDescription = jobTagDetailsAll;


    //Job Advance
    let jobAdvanceDetailsAll: IjobAdvance = {};
    jobAdvanceDetailsAll.HeadCount = parseFloat(this.quickJobForm.value.HeadCount);
    const d = new Date(this.quickJobForm.value.OpenDate);
    //const s = new Date(this.quickJobForm.value.FillDate);
    jobAdvanceDetailsAll.OpenDate =  new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    //jobAdvanceDetailsAll.FillDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString();
    if(this.quickJobForm.value.FillDate==null){
      jobAdvanceDetailsAll.FillDate=null; /*-@why:EWM-14577,@when:05-10-2023,@who:Nitin Bhati-*/
      // const s = new Date(Date.now());
      // jobAdvanceDetailsAll.FillDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString();
    }else{
      const s = new Date(this.quickJobForm.value.FillDate);
      jobAdvanceDetailsAll.FillDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString();
    }
    // jobAdvanceDetailsAll.OpenDate = this.quickJobForm.value.OpenDate;
    // jobAdvanceDetailsAll.FillDate = this.quickJobForm.value.FillDate;
    //jobAdvanceDetailsAll.OwnerId = [...new Set(this.quickJobForm.value.OwnerId)];

    //Who:Ankit Rawat, Primary job owner changes: manage data for insert api, Why: EWM-17356, When:26Jun2024
    if(this.selectedOwnerItem){
    jobAdvanceDetailsAll.Owners=this.selectedOwnerItem.map(item=>({
      'OwnerId':item.UserId,
      'IsPrimary':0
    }));
    }
    else{
      jobAdvanceDetailsAll.Owners=[];
    }
    const primaryOwner: IOwner = {
      OwnerId: this.selectedPrimaryOwnerItem.UserId,
      IsPrimary: 1
    };
    jobAdvanceDetailsAll.Owners.push(primaryOwner);

    jobAdvanceDetailsAll.Contact = this.contactList;
    jobAdvanceDetailsAll.JobRank = parseFloat(this.quickJobForm.value.JobRank);
    let isHideCompany;
    if (this.quickJobForm.value.HideCompany == true) {
      isHideCompany = 1;
    }
    if (this.quickJobForm.value.HideCompany == false) {
      isHideCompany = 0;
    }
    jobAdvanceDetailsAll.HideCompany = isHideCompany;
    jobAdvanceDetailsAll.BrandId = this.quickJobForm.value.BrandId;
    jobAdvanceDetailsAll.BrandName = this.quickJobForm.value.BrandName;
    jobAdvanceDetailsAll.ProjectId = this.quickJobForm.value.ProjectId;

    jobAdvanceDetailsAll.JobRankColorCodeURL = this.uploadColorCodePreview;
          // who:maneesh,why:ewm-11115 patch color value ,when:10/03/2023
    jobAdvanceDetailsAll.JobRankColorCode =  this.selctedColor;
    jobAdvanceDetailsAll.AccessId =  this.quickJobForm.value.AccessId;
    jobAdvanceDetailsAll.AccessName =  this.quickJobForm.value.AccessName;
    jobAdvanceDetailsAll.GrantAccessList = this.accessEmailId;
    jobAdvanceDetailsAll.ReasonId = this.quickJobForm.value.ReasonId == null || this.quickJobForm.value.ReasonId == 0 ? 0 : this.quickJobForm.value.ReasonId;
    jobAdvanceDetailsAll.ReasonName = this.quickJobForm.value.ReasonName;
    jobAdvanceDetailsAll.StatusId = this.quickJobForm.value.StatusId;
    jobAdvanceDetailsAll.StatusName = this.quickJobForm.value.StatusName;
    jobAdvanceDetailsAll.WorkFlowId = this.quickJobForm.value.WorkFlowId;
    jobAdvanceDetailsAll.ApplicationFormId = this.quickJobForm.value.ApplicationFormId == null ? 0 : this.quickJobForm.value.ApplicationFormId;
    jobAdvanceDetailsAll.ApplicationFormName = this.quickJobForm.value.ApplicationFormName;
    jobAdvanceDetailsAll.StatusColorCode = this.quickJobForm.value.StatusColorCode;
    jobAdvanceDetailsAll.JobExpiryDays = parseInt(this.quickJobForm.value.JobExpiryDays);


    requestData.JobAdvance = jobAdvanceDetailsAll;

    //Publish to Job Board
    let jobBoardDetailsAll: IjobBoards = {}

    let isDisable;
    if (this.quickJobForm.value.IsDisable == true) {
      isDisable = 1;
    }
    if (this.quickJobForm.value.IsDisable == false) {
      isDisable = 0;
    }
    jobBoardDetailsAll.IsDisable = isDisable;
/*--@who: Nitin Bhati,@When:11-05-2023,@Why:12363--*/
    // let isDisableKnockOut;
    // if (this.quickJobForm.value.KnockOut == true) {
    //   isDisableKnockOut = 1;
    // }
    // if (this.quickJobForm.value.KnockOut == false) {
    //   isDisableKnockOut = 0;
    // }
    // jobBoardDetailsAll.KnockOut = isDisableKnockOut;
    // jobBoardDetailsAll.ManageAccessId = this.quickJobForm.value.ManageAccessId;

    //jobBoardDetailsAll.PublishDate = this.quickJobForm.value.PublishDate;
    const publishedDate = new Date(this.quickJobForm.value.PublishDate);
    jobBoardDetailsAll.PublishDate = new Date(publishedDate.getFullYear(), publishedDate.getMonth(), publishedDate.getDate(), publishedDate.getHours(), publishedDate.getMinutes() - publishedDate.getTimezoneOffset()).toISOString();

    requestData.JobBoards = jobBoardDetailsAll;


    return requestData;
  }


/*
   @Type: File, <ts>
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 13-June-2021
   @Why: EWM-7019
   @What: For saving quick job data
  */
  onSave(): void{
    this.submitted = true;
    if (this.quickJobForm.valid) {
      this.loading = true;
      this.formHeading = 'Add';
      const quickJobRequest = JSON.stringify(this.createRequest())
      //Who:Ankit Rawat,Primary owner changes: Changed job insert API version 2, Why: EWM-17356, When:26Jun2024
      this.quickJobService.createQuickJob_v2(quickJobRequest).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            let IsDisableStatus=repsonsedata.Data.JobBoards.IsDisable;
            let workflowId=repsonsedata.Data.JobAdvance.WorkFlowId;
            let JobId=repsonsedata.Data.JobId;
            let ReferenceId=repsonsedata.Data.ReferenceId;
            if(IsDisableStatus===1){
              //<!-----@Adarsh singh @EWM-12361 @10-May-2023 @Desc- Calling extra api for getting all field while publish braodbean job----->
              this.getJobDetailsData(repsonsedata.Data?.JobId);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
             }else{
              if (this.isCopyJob === true) {
                this.route.navigate(['/client/jobs/job/job-list/list/' + this.quickJobForm.value.WorkFlowId]);
                this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
                // For Add Job of Client Summary
              } else if (this.type === "AddJobClient") {
                this.route.navigate(['/client/core/clients/list/client-detail'], {
                  queryParams: { clientId: this.clientSummeryId, openTab: "job" }//by maneesh ewm-16996 when:04/07/2024
                });
                this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              } else if (this.quickFilter!=null && this.quickFilter!=undefined) {
                sessionStorage.removeItem('QuickFilterForClone');
                this.route.navigate(['/client/jobs/job/job-list/list/' + this.quickJobForm.value.WorkFlowId],{
                queryParams: { filter: this.quickFilter}//by maneesh when:10/08/2024
                });
                this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
                }
               else {
                this.route.navigate(['/client/jobs/job/job-workflow/workflow']);
                this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              }
            }
            //this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          } else if (repsonsedata.HttpStatusCode === 400) {
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
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }
  }

  /*
 @Type: File, <ts>
 @Name: reloadApiBasedOnorg function
 @Who: Anup Singh
 @When: 14-july-2021
 @Why: EWM-2001 EWM-2070
 @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.route.navigate(['/client/jobs/job/job-manage/manage', { createJobForm: this.formTypeValue }]);
  }




  /*
    @Type: File, <ts>
    @Name: add function
    @Who: Nitin Bhati
    @When: 13-Sep-2021
    @Why: EWM-2756
    @What: get add skills List
    */
  add(event: MatChipInputEvent): void {
    //   alert("add");
    //   const value = (event.value || '').trim();
    //   // Add our fruit
    //   if (value) {
    //     this.skillSelectedList.push(value);
    //   }
    //  // Clear the input value
    //  // event.chipInput!.clear();
    //  this.skillCtrl.setValue(null);
  }
  /*
    @Type: File, <ts>
    @Name: remove function
    @Who: Nitin Bhati
    @When: 13-Sep-2021
    @Why: EWM-2756
    @What: get remove chips skills
    */
  remove(Id): void {
    const index = this.skillSelectedList.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.skillSelectedList.splice(index, 1);
    }
    if (this.skillSelectedList.length > 0) {
      //this.saveEnableDisable = false;
    } else {
      //this.saveEnableDisable = true;
    }

  }

  /*
  @Type: File, <ts>
  @Name: onsearchSkills function
  @Who: Anup
  @When: 10-Nov-2021
  @Why: EWM-3552
  @What: get skills and Tag List
  */
  // public onsearchSkills(inputValue: string) {
  //   this.loadingSearch = true;
  //   if (inputValue.length === 0) {
  //     this.searchskillList = [];
  //     this.loadingSearch = false;
  //   }
  //   if (inputValue.length > 0 && inputValue.length > 1) {
  //     this.searchValue = inputValue;
  //     this.loadingSearch = false;

  //     this.quickJobService.getAllSkillAndTag("?Search=" + inputValue).subscribe(
  //       (repsonsedata: any) => {
  //         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //           this.searchskillList = repsonsedata.Data;
  //           // if (this.skillSelectedListData.length !== 0) {
  //           //   this.loadingSearch = false;
  //           //   this.skillSelectedListData.forEach(element => {
  //           //     const index = this.searchskillList.findIndex(x => x.Id === element.Id);
  //           //     if (index !== -1) {
  //           //       this.searchskillList.splice(index, 1);
  //           //     }
  //           //   });
  //           // } else {
  //           //   this.searchskillList = repsonsedata.Data;
  //           //   this.loadingSearch = false;
  //           // }

  //         } else {
  //           // this.loadingSearch = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //         }
  //       }, err => {
  //         // this.loadingSearch = false;
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //       })

  //   }
  // }

  /*
   @Type: File, <ts>
   @Name: selectedSkills function
   @Who: Anup Singh
   @When: 10-Nov-2021
   @Why: EWM-3552 EWM-3651
   @What: get selected skills List
   */
  // public skillTag: any = [];
  // public selectedSkills(event: MatAutocompleteSelectedEvent): void {
  //   if (event.option.value.IsTag === 0) {
  //     if (this.skillSelectedList.some(el => el.SkillName == event.option.value.SkillName)) {

  //     } else {
  //       this.skillSelectedList.push({
  //         'Id': event.option.value.Id,
  //         'SkillName': event.option.value.SkillName,
  //         'Weightage': event.option.value.Weightage,
  //       });
  //     }

  //   } else {
  //     // if (this.skillTag.some(el => el.TagName == event.option.value.TagName)) {

  //     // } else {
  //     //   this.skillTag.push({
  //     //     'Id': event.option.value.Id,
  //     //     'TagName': event.option.value.TagName,
  //     //   });
  //     //   this.getskillListByTagId(event.option.value.Id, event.option.value.TagName)
  //     // }
  //     this.skillTag.push({
  //       'Id': event.option.value.Id,
  //       'TagName': event.option.value.TagName,
  //     });
  //     this.getskillListByTagId(event.option.value.Id, event.option.value.TagName);
  //   }
  //   this.searchskillList = [];
  //   this.skillInput.nativeElement.value = '';


  //   // this.getSkillById(event.option.value.Id, event.option.viewValue);
  // }



  /*
  @Type: File, <ts>
  @Name: getskillListByTagId function
  @Who: Anup Singh
  @When: 10-Nov-2021
  @Why: EWM-3552 EWM-3651
  @What: get skills List by tag id
  */
  skillsListByTag: any = []
  getskillListByTagId(id, tagName) {
    if(id){
      this.systemSettingService.fetchSkillsByTagId("?skilltagid=" + id).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.skillsListByTag = repsonsedata.Data;
            let totalRecord = repsonsedata.TotalRecord;
            this.openPopupForSkillCountOfTag(totalRecord, this.skillsListByTag, tagName)

          } else {
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

  }

  /*
  @Type: File, <ts>
  @Name: openPopupForSkillCountOfTag function
   @Who: Anup Singh
   @When: 10-Nov-2021
   @Why: EWM-3552 EWM-3651
  @What: open popup for skill count for tagid
  */
  // openPopupForSkillCountOfTag(count, SkillDataByTag, tagName): void {
  //   let countSkill: string = count;

  //   const message = countSkill;
  //   const title = 'label_skillLinked';
  //   let lng = this.translateService.instant('label_tagName');
  //   const subTitle = tagName + ' ' + lng + '.' + this.translateService.instant('label_skillDoYouWant');
  //   const dialogData = new ConfirmDialogModel(title, subTitle, message);
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     maxWidth: "350px",
  //     data: dialogData,
  //     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     if (dialogResult == true) {
  //       for (let index = 0; index < SkillDataByTag.length; index++) {
  //         const element = SkillDataByTag[index];
  //         this.skillSelectedList.push(element);
  //       }
  //       //this.skillSelectedList.forEach(element => {
  //       // this.skillIds.push(element.Id);
  //       //  });

  //     } else {
  //       const index = this.skillTag.findIndex(x => x.TagName === tagName);
  //       if (index !== -1) {
  //         this.skillTag.splice(index, 1);
  //       }
  //     }
  //     // who: maneesh,what:remove duplicate skill for ewm.8102,when:13/12/2022
  //     const uniqueUsers = Array.from(this.skillSelectedList.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
  //     this.skillSelectedList = uniqueUsers;
  //   });
  // }
  /*
  @Type: File, <ts>
  @Name: getSkillsAll function
  @Who: Nitin Bhati
  @When: 13-Sep-2021
  @Why: EWM-2756
  @What: get skills List
  */
  // getSkillById(skillById: any, skillName: any) {
  //   this.quickJobService.getSkillById(parseInt(skillById)).subscribe(
  //     (repsonsedata: any) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.skillGroupByIdList = repsonsedata.Data;
  //         if (repsonsedata.Data != null) {
  //           this.moreSkillpopUp(this.skillGroupByIdList);
  //         } else {
  //           this.skillSelectedListData.push({
  //             'Id': skillById,
  //             'SkillName': skillName
  //           });
  //           this.skillSelectedList.push({
  //             'Id': skillById,
  //             'SkillName': skillName
  //           });
  //           this.skillInput.nativeElement.value = '';
  //           this.skillIds = [];
  //           this.skillSelectedList.forEach(element => {
  //             this.skillIds.push(element.Id);
  //           });
  //         }

  //       } else {
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //       }
  //     }, err => {
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //     })
  // }
  /*
    @Type: File, <ts>
    @Name: moreskillPopUp function
    @Who: Nitin Bhati
    @When: 13-Sep-2021
    @Why: EWM-2756
    @What: For adding more skills List
    */
  moreSkillpopUp(skillGroupByIdList: any): void {
    const dialogRef = this.dialog.open(GroupSkillConfirmationPopupComponent, {
      data: new Object({ skillGroupByIdList: this.skillGroupByIdList }),
      maxWidth: "500px",
      width: "90%",
      maxHeight: "85%",
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        //this.skillSelectedList=[];
        this.skillGroupByIdList?.forEach(element => {
          this.skillSelectedList.push({
            'Id': element.Id,
            'SkillName': element.SkillName
          });
        });

        this.searchValue = '';
        let arr = [];
        arr = this.skillGroupByIdList.filter((n, i) => this.skillGroupByIdList.indexOf(n) === i);
        this.skillSelectedList = arr;
        this.skillInput.nativeElement.value = '';
        this.skillIds = [];
        this.skillSelectedList?.forEach(element => {
          this.skillIds.push(element.Id);
          this.loadingSearch = false;
          this.searchskillList = [];
        });
      } else {
        this.searchskillList = [];
        this.skillInput.nativeElement.value = '';
        this.loadingSearch = false;
      }
    })
  }
  /*
    @Type: File, <ts>
    @Name: clickMoreRecord function
    @Who: Nitin Bhati
    @When: 13-Sep-2021
    @Why: EWM-2756
    @What: For showing more chip data
    */
  public clickForMoreRecord() {
    this.skillListLengthMore = this.skillSelectedList.length;
  }




  /*
   @Type: File, <ts>
   @Name: quickJobListByJobId function
   @Who: Anup Singh
   @When: 30-Sept-2021
   @Why:EWM-2870 EWM-2988
   @What: For get quick job list by id
   */

  quickJobListByJobId(jobId, isEdit: boolean, isCopy: boolean, isView: boolean) {
    this.loading = true;
    //Who:Ankit Rawat,Primary owner changes: Changed job get API version 2, Why: EWM-17356, When:26Jun2024
    this.quickJobService.quickJobListBy_v2('?JobId=' + jobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              /**********Bantee EWM-13212 what:Under Summary Job we have job section in which we can view job details , once user opens the job in non editable , Skills and Application form field are open and user is allowed to add and replace the existing value.*/
          if(isView!=true){
          this.loading = false;}
          this.jobDetailsDataByJobId = repsonsedata.Data;
          if (isEdit === true) {
            this.oldPatchValues = repsonsedata.Data;
            this.oldPatchValuesAccessMode= repsonsedata.Data?.JobAdvance;
            this.accessEmailId = this.oldPatchValues?.JobAdvance?.GrantAccesList;
           this.workflowId = repsonsedata.Data.JobAdvance?.WorkFlowId;
           this.workFlowID = repsonsedata.Data.JobAdvance?.WorkFlowId;
           this.getCompanyDetailsList(repsonsedata.Data?.ClientId);
            this.patchValueJobDetailsForEdit(repsonsedata.Data);
            if(this.workflowStatus){
              //Who:Ankit Rawat, Added disable logic for workflow new control, When:05Apr2024
              this.DisabledWorkFlowControl=true;
              //this.dropDownJobWorkflowConfig['IsDisabled'] = true;
            }else{
              /**********Suika for fetch candidate mapped details with jobId EWM-10179 EWM-10210 */
           //this.dropDownJobWorkflowConfig['IsDisabled'] = repsonsedata.Data?.CandidateCount==0?false:true;
            //Who:Ankit Rawat, Added disable logic for workflow new control, When:05Apr2024
            this.DisabledWorkFlowControl=repsonsedata.Data?.CandidateCount==0?false:true;
          }
           //this.resetFormSubjectWorkFlow.next(this.dropDownJobWorkflowConfig);
        //  this.getCandidateListByJob(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
          } if (isCopy === true) {
            this.workflowId = repsonsedata.Data.JobAdvance?.WorkFlowId;
             localStorage.setItem('workflowId',this.workflowId);
            this.selectedValue = null;
            this.workflowId = repsonsedata.Data.JobAdvance?.WorkFlowId;
            localStorage.setItem('workflowId',this.workflowId);
            this.getCompanyDetailsList(repsonsedata.Data?.ClientId);
            this.patchValueJobDetailsForCopyJob(repsonsedata.Data);
          }
          if (isView === true) {
            this.patchValueFromJobDetails(repsonsedata.Data);
          }
        } else {
          if (isEdit === true) {
            this.patchValueJobDetailsForEdit(null);
          } if (isCopy === true) {
            this.patchValueJobDetailsForCopyJob(null);
          }
          if (isView === true) {
            this.patchValueFromJobDetails(null);
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        if (isEdit === true) {
          this.patchValueJobDetailsForEdit(null);
        } if (isCopy === true) {
          this.patchValueJobDetailsForCopyJob(null);
        }
        if (isView === true) {
          this.patchValueFromJobDetails(null);
        }
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
    @Type: File, <ts>
    @Name: patchValueFromJobDetails function
    @Who: Anup Singh
    @When: 30-Sep-2021
    @Why: EWM-2870 EWM-2990
    @What: For view data from job details
    */
  patchValueFromJobDetails(value: any) {
    //////disabled all controls
    this.quickJobForm.disable();
    this.dropDownCategoryConfig['IsDisabled'] = true;
    this.dropDownSubCategoryConfig['IsDisabled'] = true;
    this.dropDownIndustryConfig['IsDisabled'] = true;
    this.dropDownSubIndustryConfig['IsDisabled'] = true;
    this.dropDownExperienceConfig['IsDisabled'] = true;
    this.dropDownQualificationConfig['IsDisabled'] = true;
    this.dropDownJobTypeConfig['IsDisabled'] = true;
    this.dropDownJobSubTypeConfig['IsDisabled'] = true;
    this.dropDownExpertiesConfig['IsDisabled'] = true;
    this.dropDownSubExpertiesConfig['IsDisabled'] = true;
    //this.dropDownJobWorkflowConfig['IsDisabled'] = true;
    //Who:Ankit Rawat, Added disable logic for workflow new control, When:05Apr2024
    this.DisabledWorkFlowControl=true;
    this.dropDownJobStatusConfig['IsDisabled'] = true;
    this.dropDownSalaryUnitConfig['IsDisabled'] = true;
    this.dropDownSalaryBandConfig['IsDisabled'] = true;
    this.dropDownTagConfig['IsDisabled'] = true;
    this.dropDownBrandsConfig['IsDisabled'] = true;
    this.dropDownManageAccessConfig['IsDisabled'] = true;
    this.dropDownMapApplicationConfig['IsDisabled'] = true;
    this.dropDownSalaryBandNameConfig['IsDisabled'] = true;
    this.dropDownSalaryBandNameConfig['IsDisabled'] = true;
    this.dropDownReasonConfig['IsDisabled'] = true;
    this.DisabledPrimaryOwnerControl=true;
    this.DisabledOwnerControl=true;

    this.ishideView =false;
    this.isDisabled = true;
    this.dropDownStateConfig['IsDisabled'] = true;
    this.isViewMode  =false;
    this.pageNameDRPObj.mode = 'edit';

    // new dropdown v2 disbaled 
    this.JobViewModeOnly(value);
    this.selectedClientUser = { 'ClientId': value?.ClientId, 'ClientName': value?.ClientName}
    // end 

    if ((value != undefined) && (value != null) && (value != '')) {
      this.errMsg = false;
      setTimeout(() => {
        if(value.CountryId!=0 && value.CountryId!=undefined && value.CountryId!=null){
          this.ddlchange({'Id': Number(value.CountryId)});
          setTimeout(() => {
            this.selectedState = { 'Id': value.StateId, 'StateName': value.StateName};
            this.onStateChange(this.selectedState);
          }, 1000);
        }
      }, 2000)

      this.clickCountrygetAllState(value?.CountryId);
      setTimeout(() => {

        // check isMap application dropdown data is or not if yes then checkbox will check EWM-7202 by Adarsh
       // check isMap application dropdown data is or not if yes then checkbox will check EWM-7202 by Adarsh
        if (value.JobAdvance.ApplicationFormId == 0 || value.JobAdvance.ApplicationFormId == null) {
          this.quickJobForm.patchValue({
            MapApplicationFormBtn: false
          })
          this.isDropdown=false;
          // this.dropDownMapApplicationConfig['IsRequired'] = true;
          // this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
        }else{
          /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map applica*/
          this.applicationDefault={'Id':value.JobAdvance?.ApplicationFormId,'Name':value.JobAdvance?.ApplicationFormName };
          /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map application form quick job************/
          this.isDropdown=true;
          this.quickJobForm.patchValue({
            MapApplicationFormBtn: true,
            ApplicationFormId:value.JobAdvance?.ApplicationFormId,
            ApplicationFormName:value.JobAdvance?.ApplicationFormName
          })
        }
          // who:maneesh,why:ewm-11115 patch color value ,when:10/03/2023
        this.selctedColor = value?.JobAdvance?.JobRankColorCode;
        // this.selctedColor = value.Data.ColorCode;

        let color = this.hexToRgb(value?.JobAdvance?.JobRankColorCode);
        // End
        this.quickJobForm.patchValue({
          Title: value?.Title,
          ClientId: value?.ClientId!="00000000-0000-0000-0000-000000000000"?value?.ClientId:null,

          Address1: value?.Address1,
          Address2: value?.Address2,
          // StateId: stateid,
          City: value?.City,
          ZipCode: value?.ZipCode,

          JobExpiryDays: value?.JobAdvance?.JobExpiryDays,

          CurrencyId: value?.Salary?.CurrencyId,
          Bonus: value?.Salary?.Bonus,
          Equity: value?.Salary?.Equity,

          InternalNotes: value?.JobDescription?.InternalNotes,

          HeadCount: value?.JobAdvance?.HeadCount,
          OpenDate: new Date(value?.JobAdvance?.OpenDate),
          FillDate: new Date(value?.JobAdvance?.FillDate),
          JobRank: value?.JobAdvance?.JobRank,
          // ColorCode: this.defaultColorValue,
          // who:maneesh,why:ewm-11115 patch color value ,when:10/03/2023
          // ColorCode: (value.Data?.ColorCode === null || value.Data?.ColorCode ===undefined ) ? '#ffffff' : value.Data?.ColorCode,
          ColorCode: this.selctedColor,
          HideCompany: value?.JobAdvance?.HideCompany,
          ProjectId: value?.JobAdvance?.ProjectId,
          AccessId: value?.JobAdvance?.AccessId,
          AccessName: value?.JobAdvance?.AccessName,
          IsDisable: value?.JobBoards?.IsDisable,
          KnockOut: value?.JobBoards?.KnockOut,
          PublishDate: new Date(value?.JobBoards?.PublishDate),

        });
        this.ClientLocationAddress.push({/*-@why:EWM-14693,@when:12-10-2023,@who:Nitin Bhati-*/
          'AddressLine1': value?.Address1,
          'AddressLine2': value?.Address2,
          'AddressLinkToMap': value?.AddressLinkToMap,
          'CountryId': value?.CountryId,
          //'District': value?.Address1,
          'StateId': value?.StateId,
          'StateName': value?.StateName,
          'LocationId': value?.Address1,
          'Latitude': value?.Latitude,
          'Longitude': value?.Longitude,
          'PostalCode': value?.ZipCode,
          'District_Suburb' :value?.DistrictSuburb,
          'TownCity' : value?.City
        });
        this.addressData=[...this.ClientLocationAddress];
        this.AddressLinkToMap=value?.AddressLinkToMap;
        this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(value?.AddressLinkToMap);
        this.clientIdData = value?.ClientId;
        //this.getCompanyDetailsList(this.clientIdData);
        //this.clickClientGetAddressDetails( value?.ClientId);
          // who:maneesh,why:ewm-11115 patch color value ,when:10/03/2023
        // this.selctedColor = value.Data.ColorCode;


        if (value?.JobDetails != undefined && value.JobDetails != null && value.JobDetails != '') {
          let jobDetailsData: any = value?.JobDetails;
          //////Job Category//////////////
          if ((jobDetailsData?.JobCategoryId != undefined) && (jobDetailsData?.JobCategoryId != null) && (jobDetailsData?.JobCategoryId != '')) {
            this.selectedCategory = { Id: jobDetailsData?.JobCategoryId,"JobCategory": jobDetailsData?.JobCategoryName };

            //////Job Sub Category//////////////

            // this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + jobDetailsData?.JobCategoryId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            // this.resetFormSubjectSubCategory.next(this.CMMN_Dropdown_ConfigJob_SUB_Category);
            let arr:any | [] = [];
            jobDetailsData?.JobSubCategoryId.forEach((e:any)=>{
              arr.push({Id: e.Id, JobSubCategory: e.Name})
            })
            this.selectedSubCategory = arr;
          }
         //////Industry//////////////
         if ((jobDetailsData?.IndustryId != undefined) && (jobDetailsData?.IndustryId != null) && (jobDetailsData?.IndustryId != '')) {
          let industriesList = [];
         jobDetailsData?.IndustryId?.forEach(x => {
           industriesList.push({Id:x.IndustryId,Description:x.IndustryName});
         });
         this.selectedIndustry = industriesList;
         const industriesId =  this.selectedIndustry?.map((item: any) => {
           return item.Id
         });

         this.quickJobForm.patchValue(
           {
             IndustryId: jobDetailsData?.IndustryId
           });

          //////Sub Industry//////////////

         let subIndustriesList = [];
         jobDetailsData?.SubIndustryId?.forEach(y => {
           subIndustriesList.push({Id:y.SubIndustryId,Description:y.SubIndustryName});
         });
         this.selectedSubIndustry = subIndustriesList;

         this.quickJobForm.patchValue(
           {
             SubIndustryId: jobDetailsData?.SubIndustryId
           });

         //////Qualification//////////////

        //  this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?IndustryId=' + industriesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        //  this.resetFormSubjectQualification.next(this.dropDownQualificationConfig);


         this.selectedQualification = jobDetailsData?.QualificationId;

         this.quickJobForm.patchValue(
           {
             QualificationId: this.selectedQualification
           })
       }

            //////SkillList//////////////
            this.skillSelectedList = jobDetailsData?.skillList;
            this.skillSelectedListId = jobDetailsData?.skillList;
            this.quickJobForm.patchValue({
              SkillTag: this.skillSelectedListId
            });
            //////SkillList End //////////////

          //////Experience//////////////
          this.selectedExperience = jobDetailsData?.ExperienceId[0];

          //////JobType//////////////
          if ((jobDetailsData?.JobTypeId != undefined) && (jobDetailsData?.JobTypeId != null) && (jobDetailsData?.JobTypeId != '')) {
            this.selectedJobType = { Id: jobDetailsData?.JobTypeId , JobType: jobDetailsData.JobTypeName};
            //////JobSubType//////////////
            // this.dropDownJobSubTypeConfig['apiEndPoint'] = this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + jobDetailsData?.JobTypeId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            // this.resetFormSubject.next(this.dropDownJobSubTypeConfig);
            this.selectedJobSubType = { Id: jobDetailsData?.JobSubTypeId, JobSubType: jobDetailsData.JobSubTypeName};
          }

          //////Experties//////////////
          if ((jobDetailsData?.ExpertiseId != undefined) && (jobDetailsData?.ExpertiseId != null) && (jobDetailsData?.ExpertiseId != '')) {
            let expertiseList = [];
            jobDetailsData?.ExpertiseId?.forEach(z => {
              expertiseList.push({Id:z.ExpertiseId,FunctionalExpertise:z.ExpertiseName});
            });
            this.selectedExperties = expertiseList;
            const expertiesId = this.selectedExperties.map((item: any) => {
              return item.Id
            });
            this.quickJobForm.patchValue(
              {
                ExpertiseId: jobDetailsData?.ExpertiseId
              });
            //////Sub Experties//////////////
            this.dropDownSubExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
              let subExpertiseList = [];
            jobDetailsData?.SubExpertiseId?.forEach(y => {
              subExpertiseList.push({Id:y.SubExpertiseId,FunctionalSubExpertise:y.SubExpertiseName});
            });
            this.selectedSubExperties = subExpertiseList;
            const subExpertiesId = this.selectedSubExperties.map((item: any) => {
              return item.Id
            });
            this.quickJobForm.patchValue(
              {
                SubExpertiseId: jobDetailsData?.SubExpertiseId
              });
          }



          //////Job Status//////////////
          this.selectedJobStatus = { Id: jobDetailsData?.StatusId };
        }



        //////Salary//////////////
        if (value?.Salary != undefined && value.Salary != null && value.Salary != '') {
          let salaryData: any = value?.Salary;
          this.selectedSalaryUnit = { Id: salaryData?.SalaryUnitId };
          this.selectedSalaryBandName = { Id: salaryData?.SalaryBandId };
          // Hide Slary Adarsh singh 06-02-2023
          if (value.Salary.HideSalary == 0 || !value.Salary.HideSalary) {
            this.quickJobForm.patchValue({
              HideSalary: null
            })
          } else {
            this.quickJobForm.patchValue({
              HideSalary: true
            })
          }
        // End
        }

        //////JobDescription//////////////
        if (value?.JobDescription != undefined && value.JobDescription != null && value.JobDescription != '') {
          let jobDescriptionData: any = value?.JobDescription;
          this.DescriptionValue = jobDescriptionData?.Description;
          this.selectedTag = jobDescriptionData?.JobTagId;
        }

        //////Advanced//////////////

        if (value?.JobAdvance != undefined && value.JobAdvance != null && value.JobAdvance != '') {
          let jobAdvanceData: any = value?.JobAdvance;
          //this.ownerpatch = jobAdvanceData?.OwnerId;
         //Who:Ankit Rawat, Primary job owner show value on Edit, Why: EWM-17356, When:26Jun2024
        this.selectedOwnerItem=jobAdvanceData.Owners.filter(owner=>owner.IsPrimary==0).map(owner=>({
          UserId: owner.OwnerId,
          UserName: owner.OwnerName
        }));
        const primaryOwner=jobAdvanceData.Owners.find(owner=>owner.IsPrimary==1);
        if(primaryOwner){
          this.selectedPrimaryOwnerItem={UserId:primaryOwner.OwnerId, UserName: primaryOwner.OwnerName};
          this.isPrimaryOwnerValid=true;
        } else {
          this.isPrimaryOwnerValid=false;
        }

          jobAdvanceData?.ContactId.forEach(element => {
            element.Id = element.ClientContactId;
          });
          const contactId =  jobAdvanceData?.ContactId.map((item: any) => {
            return item.Id
          });
          setTimeout(() => {
            this.companyContactsPatch = contactId;
            this.contactList=jobAdvanceData?.ContactId;
          }, 1500);

          this.selectedBrands = { Id: jobAdvanceData?.BrandId,Brand:jobAdvanceData?.BrandName };
          if (value.JobAdvance.BrandId == 0 ) {
            this.selectedBrands = null;
            this.quickJobForm.patchValue({
              BrandId: null
            })

          }else{
            this.quickJobForm.patchValue({
                BrandId: this.selectedBrands.Id,
                BrandName: this.selectedBrands.Brand
              })
          }

            if (value.JobAdvance.ProjectId === 0) {
              this.quickJobForm.patchValue({
                ProjectId: null
              })
            }else{

            }

          //////Job Workflow//////////////
          this.selectedJobWorkflow = { Id: value.JobAdvance?.WorkFlowId, WorkflowName: value.JobAdvance?.WorkFlowName };
          this.quickJobForm.patchValue({
            WorkFlowId: this.selectedJobWorkflow.Id
          });
          this.workflowId = this.selectedJobWorkflow.Id;
          //////Job Status//////////////
          this.selectedJobStatus = { Id: jobAdvanceData?.StatusId, Description: jobAdvanceData?.StatusName, ColorCode: jobAdvanceData?.ColorCode };
          this.quickJobForm.patchValue(
            {
              StatusId: this.selectedJobStatus.Id,
              StatusName: this.selectedJobStatus.Description,
              StatusColorCode: this.selectedJobStatus.ColorCode
            });

          //////Job Reason//////////////
           /*---@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883 ,What:Add  group Type parameter---*/
          this.selectedReason = { Id: jobAdvanceData?.ReasonId, ReasonName: jobAdvanceData?.ReasonName };
          this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
          this.resetFormselectedReason.next(this.dropDownReasonConfig);
          if (value.JobAdvance.ReasonId == null || value.JobAdvance.ReasonId == 0) {
            this.selectedReason = null;
            this.quickJobForm.patchValue({
              ReasonId: null,
              ReasonName: ''
            })
          } else {
            this.quickJobForm.patchValue({
              ReasonId: this.selectedReason.Id,
              ReasonName: this.selectedReason.Brand
            })
          }
        }




        //////Publish to Job Boards//////////////
        if (value?.JobBoards != undefined && value.JobBoards != null && value.JobBoards != '') {
          let jobBoardsData: any = value?.JobBoards;
          this.selectedManageAccess = { Id: jobBoardsData?.ManageAccessId };
          this.selectedMapApplication = { Id: jobBoardsData?.ApplicationFormId,Name: jobBoardsData?.ApplicationFormName };
          this.quickJobForm.patchValue(
            {
              ManageAccessId: this.selectedManageAccess.Id,
              ApplicationFormId: this.selectedManageAccess.Id
            }
          )

        }
        if (value.CountryId === 0) {
          this.quickJobForm.patchValue({
            CountryId: null
          })
        }
        this.selectedValue = { 'Id': Number(value.StateId), 'StateName': value.StateName};
        this.onStateChange(this.selectedValue);
        this.loading=false;
      }, 300);

    } else {
      this.errMsg = true;
      this.dateOpen = null;
      this.dateFill = null;
      this.datePublish = null;
    }


  }

  /*
     @Type: File, <ts>
     @Name: patchValueJobDetailsForEdit function
     @Who: Anup Singh
     @When: 12-Nov-2021
     @Why: EWM-3128 EWM-2653
     @What: For patch data from job Edit
     */
  patchValueJobDetailsForEdit(value: any) {
    if(this.workflowStatus){
      //this.dropDownJobWorkflowConfig['IsDisabled'] = true;
      //Who:Ankit Rawat, Added disable logic for workflow new control, When:05Apr2024
      this.DisabledWorkFlowControl=true;
    }
    this.pageNameDRPObj.mode = 'edit';

    if ((value != undefined) && (value != null) && (value != '')) {
      // this.selectedValue = { 'Id': Number(value?.CountryId) };
      // this.clickCountrygetAllState(value?.CountryId);

      //  @Who: maneesh ,@When: 13-apr-2023, @Why: EWM-11874 ,What: add  validator
      if (value?.JobBoards?.PublishDate==0) {
        this.quickJobForm.patchValue({
          PublishDate: new Date()
        })
      }else{
        this.quickJobForm.patchValue({
          PublishDate: new Date(value?.JobBoards?.PublishDate)
        })
      }
      setTimeout(() => {
        // this.selectedValue = { 'Id': Number(value.CountryId), CountryName: value.CountryName };
        if(value.CountryId!=0 && value.CountryId!=undefined && value.CountryId!=null){
        this.ddlchange({'Id': Number(value.CountryId), CountryName: value.CountryName});
        setTimeout(() => {
          this.selectedState = { 'Id': value.StateId, 'StateName': value.StateName};
          this.onStateChange(this.selectedState);
        }, 1000);
      }
      }, 2000)
      setTimeout(() => {
        // check isMap application dropdown data is or not if yes then checkbox will check EWM-7202 by Adarsh
        if (value.JobAdvance.ApplicationFormId == 0 || value.JobAdvance.ApplicationFormId == null) {
          this.quickJobForm.patchValue({
            MapApplicationFormBtn: false
          })
          this.isDropdown=false;
          // this.dropDownMapApplicationConfig['IsRequired'] = true;
          // this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
        }else{
          /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map applica*/
          this.applicationDefault={'Id':value.JobAdvance?.ApplicationFormId,'Name':value.JobAdvance?.ApplicationFormName };
          /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map application form quick job************/
          this.isDropdown=true;
          this.quickJobForm.patchValue({
            MapApplicationFormBtn: true,
            ApplicationFormId:value.JobAdvance?.ApplicationFormId,
            ApplicationFormName:value.JobAdvance?.ApplicationFormName
          })
        }
      // End
        this.formHeading = 'Edit';
          // who:maneesh,why:ewm-11115 patch color value ,when:10/03/2023
        this.selctedColor = value?.JobAdvance?.JobRankColorCode;
        let color = this.hexToRgb(value?.JobAdvance?.JobRankColorCode);
        this.quickJobForm.patchValue({
          JobReferenceId: value?.JobReferenceId,
          Title: value?.Title,
          ClientId: value?.ClientId!="00000000-0000-0000-0000-000000000000"?value?.ClientId:'',
          ClientName:value?.ClientName, /*-@why:EWM-14961,@who: Nitin Bhati.@when:26-10-2023-*/
          Address1: value?.Address1,
          Address2: value?.Address2,
          City: value?.City,
          ZipCode: value?.ZipCode,
          JobExpiryDays: value?.JobAdvance?.JobExpiryDays,
          SalaryUnitName: value?.Salary?.SalaryUnitName,
          SalaryBandName: value?.Salary?.SalaryBandName,
          CurrencyId: value?.Salary?.CurrencyId,
          // who:bantee,why:ewm-11939 patch currency name and symbol in edit case ,when:17/04/2023
          CurrencyName: value?.Salary?.CurrencyName,
          CurrencySymbol: value?.Salary?.CurrencySymbol,
          Bonus: value?.Salary?.Bonus,
          Equity: value?.Salary?.Equity,

          InternalNotes: value?.JobDescription?.InternalNotes,

          HeadCount: value?.JobAdvance?.HeadCount,
          OpenDate: new Date(value?.JobAdvance?.OpenDate),
          FillDate: value?.JobAdvance?.FillDate==0?null:new Date(value?.JobAdvance?.FillDate),
          JobRank: value?.JobAdvance?.JobRank,
          HideCompany: value?.JobAdvance?.HideCompany,
          ProjectId: value?.JobAdvance?.ProjectId,
          AccessId: value?.JobAdvance?.AccessId,
          AccessName: value?.JobAdvance?.AccessName,
          // who:maneesh,why:ewm-11115 patch color value ,when:10/03/2023
          ColorCode:this.selctedColor,
          JobRankColorCodeURL: this.uploadColorCodePreview,

          IsDisable: value?.JobBoards?.IsDisable,
          KnockOut: value?.JobBoards?.KnockOut,

        });
        this.selectedClientUser = { 'ClientId': value?.ClientId, 'ClientName': value?.ClientName}
        this.selectedCurrency = { 'Id': value?.Salary?.CurrencyId, 'CurrencyName': value?.Salary?.CurrencyName, 'Symbol': value?.Salary?.CurrencySymbol };
        this.selectedValue = { 'Id': Number(value?.CountryId),'CountryName': value?.CountryName };
        this.ClientLocationAddress.push({/*-@why:EWM-14693,@when:12-10-2023,@who:Nitin Bhati-*/
          'AddressLine1': value?.Address1,
          'AddressLine2': value?.Address2,
          'AddressLinkToMap': value?.AddressLinkToMap,
          'CountryId': value?.CountryId,
          'District': value?.CountryName,
          'StateId': value?.StateId,
          'StateName': value?.StateName,
          'LocationId': value?.Address1,
          'Latitude': value?.Latitude,
          'Longitude': value?.Longitude,
          'PostalCode': value?.ZipCode,
          'District_Suburb' :value?.DistrictSuburb,
          'TownCity' : value?.City
        });
        
        this.addressData=[...this.ClientLocationAddress];
         this.Published= value?.JobBoards?.Published,
        this.quickJobForm.controls["JobReferenceId"].disable();
        this.clientIdData = value?.ClientId;
       // this.clickClientGetAddressDetails(this.clientIdData); /*-@why:EWM-14693,@when:12-10-2023,@who:Nitin Bhati-*/
        this.todayOpenDate = new Date(value?.JobAdvance?.OpenDate);
        this.todayFillDate = new Date(value?.JobAdvance?.FillDate);
        this.todayPublishDate = new Date(value?.JobBoards?.PublishDate);

        this.ClientName=value?.ClientName;
        this.AddressLinkToMap=value?.AddressLinkToMap;
        this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(value?.AddressLinkToMap);
        this.Latitude=value?.Latitude;
        this.Longitude=value?.Longitude;
       // this.BrandName=value?.JobAdvance?.BrandName;
        this.OrganizationName=value?.OrganizationName;

        if (value?.JobDetails != undefined && value.JobDetails != null && value.JobDetails != '') {
          let jobDetailsData: any = value?.JobDetails;
          //////Job Category//////////////
          if ((jobDetailsData?.JobCategoryId != undefined) && (jobDetailsData?.JobCategoryId != null) && (jobDetailsData?.JobCategoryId != '')) {
            this.selectedCategory = { Id: jobDetailsData?.JobCategoryId, "JobCategory": jobDetailsData?.JobCategoryName };
            if (value.JobDetails.JobCategoryId === "00000000-0000-0000-0000-000000000000") {
              this.selectedCategory = null;
              this.quickJobForm.patchValue({
                JobCategoryId: null
              })

            }else{
              this.quickJobForm.patchValue({
                JobCategoryId: this.selectedCategory.Id,
              })
            }
              }
              this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + this.selectedCategory?.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            //////Job Sub Category//////////////

            // this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + jobDetailsData?.JobCategoryId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            // this.resetFormSubjectSubCategory.next(this.CMMN_Dropdown_ConfigJob_SUB_Category);

            let arr:any | [] = [];
            jobDetailsData?.JobSubCategoryId.forEach((e:any)=>{
              arr.push({Id: e.Id, JobSubCategory: e.Name})
            })
            this.selectedSubCategory = arr;
            
            const subCategoryId = this.selectedSubCategory.map((item: any) => {
              return item.Id
            });
            this.quickJobForm.patchValue(
              {
                JobSubCategoryId: subCategoryId,
              });

          //////Industry//////////////
          if ((jobDetailsData?.IndustryId != undefined) && (jobDetailsData?.IndustryId != null) && (jobDetailsData?.IndustryId != '')) {
             let industriesList = [];
            jobDetailsData?.IndustryId?.forEach(x => {
              industriesList.push({Id:x.IndustryId,Description:x.IndustryName});
            });
            this.selectedIndustry = industriesList;
            const industriesId =  this.selectedIndustry?.map((item: any) => {
              return item.Id
            });

            this.quickJobForm.patchValue(
              {
                IndustryId: jobDetailsData?.IndustryId
              });

             //////Sub Industry//////////////
            this.CMMN_Dropdown_ConfigSubIndustry.API= this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industriesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            let subIndustriesList = [];
            jobDetailsData?.SubIndustryId?.forEach(y => {
              subIndustriesList.push({Id:y.SubIndustryId,Description:y.SubIndustryName});
            });
            this.selectedSubIndustry = subIndustriesList;
            this.quickJobForm.patchValue({SubIndustryId: jobDetailsData?.SubIndustryId});

            //////Qualification//////////////
            // this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?IndustryId=' + industriesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            // this.resetFormSubjectQualification.next(this.dropDownQualificationConfig);
            this.selectedQualification = jobDetailsData?.QualificationId;
            this.quickJobForm.patchValue(
              {
                QualificationId: this.selectedQualification
              })
          }else{
            this.selectedQualification = jobDetailsData?.QualificationId;
            this.quickJobForm.patchValue(
              {
                QualificationId: this.selectedQualification
              })
          }

          //////SkillList//////////////
          this.skillSelectedList = jobDetailsData?.skillList;
          this.skillSelectedListId = jobDetailsData?.skillList;
          this.quickJobForm.patchValue({
            SkillTag: this.skillSelectedListId
          });
          //////SkillList End //////////////

          //////Experience//////////////
          this.selectedExperience = jobDetailsData?.ExperienceId[0];
          // const ExperienceId = this.selectedExperience.map((item: any) => {
          //   return item.Id
          // });
          this.quickJobForm.patchValue(
            {
              ExperienceId: jobDetailsData?.ExperienceId[0]?.Id
            }
          )

          //////JobType//////////////
          if ((jobDetailsData?.JobTypeId != undefined) && (jobDetailsData?.JobTypeId != null) && (jobDetailsData?.JobTypeId != '')) {
            this.selectedJobType = { Id: jobDetailsData?.JobTypeId, JobType: jobDetailsData.JobTypeName };
            this.quickJobForm.patchValue(
              {
                JobTypeId: this.selectedJobType.Id,
              });
            //////JobSubType//////////////
            this.CMMN_Dropdown_ConfigJobSubType.API= this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + jobDetailsData?.JobTypeId  +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
 
            this.selectedJobSubType = { Id: jobDetailsData?.JobSubTypeId, JobSubType: jobDetailsData.JobSubTypeName };
            if (this.selectedJobSubType.Id == 0) {
              this.selectedJobSubType = null;
              this.quickJobForm.patchValue(
                {
                  JobSubTypeId: null
                }
              )
            }else{
              this.quickJobForm.patchValue(
                {
                  JobSubTypeId: this.selectedJobSubType.Id
                }
              )
            }

          }

          //////Experties//////////////
          if ((jobDetailsData?.ExpertiseId != undefined) && (jobDetailsData?.ExpertiseId != null) && (jobDetailsData?.ExpertiseId != '')) {
            let expertiseList = [];
            jobDetailsData?.ExpertiseId?.forEach(z => {
              expertiseList.push({Id:z.ExpertiseId,FunctionalExpertise:z.ExpertiseName});
            });
            this.selectedExperties = expertiseList;
            const expertiesId = this.selectedExperties.map((item: any) => {
              return item.Id
            });
            this.quickJobForm.patchValue(
              {
                ExpertiseId: jobDetailsData?.ExpertiseId
              });
            //////Sub Experties//////////////
            this.CMMN_Dropdown_ConfigSubExperties.API= this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            // this.dropDownSubExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
            // this.resetFormSubjectSubExperties.next(this.dropDownSubExpertiesConfig);
              let subExpertiseList = [];
            jobDetailsData?.SubExpertiseId?.forEach(y => {
              subExpertiseList.push({Id:y.SubExpertiseId,FunctionalSubExpertise:y.SubExpertiseName});
            });
            this.selectedSubExperties = subExpertiseList;
            const subExpertiesId = this.selectedSubExperties.map((item: any) => {
              return item.Id
            });
            this.quickJobForm.patchValue(
              {
                SubExpertiseId: jobDetailsData?.SubExpertiseId
              });
          }

        }

        //////Salary//////////////
        if (value?.Salary != undefined && value.Salary != null && value.Salary != '') {
          let salaryData: any = value?.Salary;
          this.selectedSalaryUnit = { Id: salaryData?.SalaryUnitId,SalaryUnitName:salaryData?.SalaryUnitName  };
          if (value.Salary.SalaryUnitId ==0) {
            this.selectedSalaryUnit = null;
            this.quickJobForm.patchValue({
              SalaryUnitId: null
            })
          }else{
            this.quickJobForm.patchValue(
              {
                SalaryUnitId: this.selectedSalaryUnit.Id,
                SalaryUnitName:this.selectedSalaryUnit.SalaryUnitName,
              })
          }
          this.selectedSalaryBandName = { Id: salaryData?.SalaryBandId,SalaryBandName: salaryData?.SalaryBandName };
          if (value.Salary.SalaryBandId == 0) {
            this.selectedSalaryBandName  =null;
            this.quickJobForm.patchValue(
              {
                SalaryBandId: null
              })
          }else{
            this.quickJobForm.patchValue({
              SalaryBandId: this.selectedSalaryBandName.Id,
              SalaryBandName:this.selectedSalaryBandName.SalaryBandName
            })
          }
          // Hide Slary Adarsh singh 06-02-2023
          if (value.Salary.HideSalary == 0 || !value.Salary.HideSalary) {
            this.quickJobForm.patchValue({
              HideSalary: null
            })
          } else {
            this.quickJobForm.patchValue({
              HideSalary: true
            })
          }
        // End
        }

          if (value.Salary.CurrencyId == 0 ) {
            this.quickJobForm.patchValue({
              CurrencyId: null,
            });
          }

        //////JobDescription//////////////
        if (value?.JobDescription != undefined && value.JobDescription != null && value.JobDescription != '') {
          let jobDescriptionData: any = value?.JobDescription;
          this.DescriptionValue = jobDescriptionData?.Description;

          this.selectedTag = jobDescriptionData?.JobTagId;
          const tagId = this.selectedTag.map((item: any) => {
            return item.Id
          });
          this.quickJobForm.patchValue(
            {
              JobTagId: tagId
            })
        }

        //////Advanced//////////////
        if (value?.JobAdvance != undefined && value.JobAdvance != null && value.JobAdvance != '') {
          let jobAdvanceData: any = value?.JobAdvance;
          //this.ownerpatch = jobAdvanceData?.OwnerId;
         // this.ownerList = jobAdvanceData?.OwnerId;
        //Who:Ankit Rawat, Primary job owner show value on Edit, Why: EWM-17356, When:26Jun2024
         this.selectedOwnerItem=jobAdvanceData.Owners.filter(owner=>owner.IsPrimary==0).map(owner=>({
          UserId: owner.OwnerId,
          UserName: owner.OwnerName
        }));
        const primaryOwner=jobAdvanceData.Owners.find(owner=>owner.IsPrimary==1);
        if(primaryOwner){
          this.selectedPrimaryOwnerItem={UserId:primaryOwner.OwnerId, UserName: primaryOwner.OwnerName};
          this.isPrimaryOwnerValid=true;
        } else {
          this.isPrimaryOwnerValid=false;
        }
          jobAdvanceData?.ContactId.forEach(element => {
            element.Id = element.ClientContactId;
          });
          const contactId =  jobAdvanceData?.ContactId.map((item: any) => {
            return item.Id
          });
          this.companyContactsPatch = contactId;
          this.contactList=jobAdvanceData?.ContactId;
        //  this.companyList = jobAdvanceData?.ContactId;
         // this.companyContactsPatch = jobAdvanceData?.ContactId;
          this.selectedBrands = { Id: jobAdvanceData?.BrandId,Brand:jobAdvanceData?.BrandName };
          if (value.JobAdvance.BrandId == 0 ) {
            this.selectedBrands = null;
            this.quickJobForm.patchValue({
              BrandId: null
            })

          }else{
            this.quickJobForm.patchValue({
                BrandId: this.selectedBrands.Id,
                BrandName: this.selectedBrands.Brand
              })
          }

          //////Job Workflow//////////////
          this.selectedJobWorkflow = { Id: value.JobAdvance?.WorkFlowId, WorkflowName: value.JobAdvance?.WorkFlowName };
          this.quickJobForm.patchValue({
              WorkFlowId: this.selectedJobWorkflow.Id
            });
           this.workflowId = this.selectedJobWorkflow.Id;
           ////// ProjectId //////////////
            if (value.JobAdvance.ProjectId === 0) {
              this.quickJobForm.patchValue({
                ProjectId: null
              })
            }else{

            }
            //////Job Status//////////////
          this.selectedJobStatus = { Id: jobAdvanceData?.StatusId,Description: jobAdvanceData?.StatusName,ColorCode:jobAdvanceData?.ColorCode };

          this.quickJobForm.patchValue(
            {
              StatusId: this.selectedJobStatus.Id,
              StatusName:this.selectedJobStatus.Description,
              StatusColorCode:this.selectedJobStatus.ColorCode
            });


            //////Job Reason//////////////
          this.selectedReason = { Id: jobAdvanceData?.ReasonId,ReasonName:jobAdvanceData?.ReasonName };
           /*---@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883 ,What:pass group type---*/
          this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
           this.resetFormselectedReason.next(this.dropDownReasonConfig);
          if (value.JobAdvance.ReasonId == null || value.JobAdvance.ReasonId == 0 ) {
            this.selectedReason = null;
            this.quickJobForm.patchValue({
              ReasonId: null,
              ReasonName: ''
            })
          }else{
            this.quickJobForm.patchValue({
                ReasonId: this.selectedReason.Id,
                ReasonName: this.selectedReason.Brand
              })
          }
        }

/*---@Who:Bantee Kumar,@When: 20-04-2023, @Why: EWM-11991 ,What:pass group type---When I edit the job details, the mapping of application form is deleted, and user has to map it again.*/
        //////Publish to Job Boards//////////////
        if (value?.JobAdvance != undefined && value.JobAdvance != null && value.JobAdvance != '') {
          let jobAdvanceData: any = value?.JobAdvance;
          this.selectedManageAccess = { Id: jobAdvanceData?.AccessId };
          this.selectedMapApplication = { Id: jobAdvanceData?.ApplicationFormId,Name: jobAdvanceData?.ApplicationFormName };
          this.quickJobForm.patchValue(
            {
              ManageAccessId: this.selectedManageAccess.Id,
              ApplicationFormId: this.selectedMapApplication.Id,
              ApplicationFormName: this.selectedMapApplication.Name,
            }
          )

        }
      //  who: maneesh, EWM.7606.EWM.7662 remove cross icon
         if (value.ClientId === "00000000-0000-0000-0000-000000000000") {
          this.quickJobForm.patchValue({
            ClientId: null
          })
        }else{
        }
        if (value.CountryId === 0) {
          this.quickJobForm.patchValue({
            CountryId: null
          })
        }
        this.editLoading=false;

      }, 1500);


    } else {
      this.dateOpen = null;
      this.dateFill = null;
      this.datePublish = null;
     this.editLoading=false;
    }
  }
 /*
    @Type: File, <ts>
    @Name: UpdateJob function
    @Who: Anup
    @When: 12-Nov-2021
    @Why: EWM-3128 EWM-3653
    @What: For update quick job data
   */

  UpdateJob(): void {
    this.submitted = true;
    if (this.quickJobForm.valid) {
      this.loading = true;
      const quickJobRequest = JSON.stringify(this.createRequest());
       //Who:Ankit Rawat,Primary owner changes: Changed job update API version 2, Why: EWM-17356, When:26Jun2024
      this.quickJobService.updateQuickJob_v2(quickJobRequest).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            sessionStorage.setItem('Activefilter', this.isActive);//by maneesh ewm-17125 for ewm-17125
            let IsDisableStatus=repsonsedata.Data.JobBoards.IsDisable;
            let workflowId=repsonsedata.Data.JobAdvance.WorkFlowId;
            let JobId=repsonsedata.Data.JobId;
            let ReferenceId=repsonsedata.Data.ReferenceId;
            if (this.ownersData || this.FocusContactField) { //who:maneesh,what:ewm-11774 for update data when,22/09/2023
            this.commonserviceService.ChangeStatus.next('editOwnerContactData');
            }
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            // <!---------@When: 03-Feb-2023 @who:Adarsh singh @why: EWM-9386 EWM-10393 --------->
            if (this.floatingButtonForEdit) {
              setTimeout(() => {
                this.valueChange.emit(true);
              }, 1000);
              return;
            }
            // <!---------@When: 03-Feb-2023 @who:Adarsh singh @why: EWM-9386 EWM-10393  END--------->
            if(IsDisableStatus===1){
              //<!-----@Adarsh singh @EWM-12361 @10-May-2023 @Desc- Calling extra api for getting all field while publish braodbean job----->
              this.getJobDetailsData(repsonsedata.Data?.JobId);
            }else{
              this.loading = false;
              const PageSource = localStorage.getItem('PageSource');
              if(PageSource !='JobDetails')
              this.route.navigate(['/client/jobs/job/job-list/list/' + this.quickJobForm.value.WorkFlowId]);
            
              }
              setTimeout(() => {
                this.valueChange.emit(true);
              }, 1000);
              localStorage.removeItem('PageSource');
              localStorage.setItem('JobDetailsReload','true');
             } else if (repsonsedata.HttpStatusCode === 400) {
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
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }

  }


 /*
     @Type: File, <ts>
     @Name: patchValueJobDetailsForCopyJob function
     @Who: Anup Singh
     @When: 18-Nov-2021
     @Why: EWM-3131 EWM-3794
     @What: For patch data for job Copy
     */
    patchValueJobDetailsForCopyJob(value: any) {
      if ((value != undefined) && (value != null) && (value != '')) {
        setTimeout(() => {
           // this.selectedValue = { 'Id': Number(value.CountryId), CountryName: value.CountryName };
           this.ddlchange({'Id': Number(value.CountryId), CountryName: value.CountryName});
           setTimeout(() => {
            this.selectedState = { 'Id': value.StateId, 'StateName': value.StateName};
            this.onStateChange(this.selectedState);
          }, 1000);
        }, 2000)
        this.pageNameDRPObj.mode = 'edit';

         // <!---------@When: 05-05-2023 @who:bantee kumar @why: EWM-11814 EWM-12324  What :Cancel button is not working in quick add job component while cloning one or two sections of any job.--------->
          if(value.JobAdvance?.WorkFlowId){
        this.selectedJobWorkflow = { Id: value.JobAdvance?.WorkFlowId, WorkflowName: value.JobAdvance?.WorkFlowName };
        this.quickJobForm.patchValue({
            WorkFlowId: this.selectedJobWorkflow.Id
          });
          this.workflowId = this.selectedJobWorkflow.Id;
        }
        ////////////General////////////////
        if (this.jobCopySectionAccess[0]?.isGeneral === true) {

          this.clickCountrygetAllState(value?.CountryId);
          setTimeout(() => {
           this.selectedValue = null;
            if (value.ClientId === "00000000-0000-0000-0000-000000000000") {
              this.quickJobForm.patchValue({
                Title: value?.Title,
                ClientId: null,
                Address1: value?.Address1,
                Address2: value?.Address2,
                // StateId: stateid,
                City: value?.City,
                ZipCode: value?.ZipCode,
              })
            }else{
              this.quickJobForm.patchValue({
                Title: value?.Title,
                ClientId: value?.ClientId,
                ClientName:value?.ClientName, /*-@why:EWM-14961,@who: Nitin Bhati.@when:26-10-2023-*/
                Address1: value?.Address1,
                Address2: value?.Address2,
                // StateId: stateid,
                City: value?.City,
                ZipCode: value?.ZipCode,
              });
            }
            this.clientIdData = value?.ClientId;
            this.selectedClientUser = { 'ClientId': value?.ClientId, 'ClientName': value?.ClientName};
            this.ClientLocationAddress=[];
            this.ClientLocationAddress.push({  /*-@why:EWM-14693,@when:12-10-2023,@who:Nitin Bhati-*/
              'AddressLine1': value?.Address1,
              'AddressLine2': value?.Address2,
              'AddressLinkToMap': value?.AddressLinkToMap,
              'CountryId': value?.CountryId,
              'District': value?.CountryName,
              'StateId': value?.StateId,
              'StateName': value?.StateName,
              'LocationId': value?.Address1,
              'Latitude': value?.Latitude,
              'Longitude': value?.Longitude,
              'PostalCode': value?.ZipCode,
              'District_Suburb' :value?.DistrictSuburb,
              'TownCity' : value?.City
            });
            this.addressData=[...this.ClientLocationAddress];
            this.AddressLinkToMap=value?.AddressLinkToMap;
            this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(value?.AddressLinkToMap);
            //this.clickClientGetAddressDetails(this.clientIdData);
          }, 500);

        }
        //////Job Details////////////////
        if (this.jobCopySectionAccess[0]?.isJobDetails === true) {
          if (value?.JobDetails != undefined && value.JobDetails != null && value.JobDetails != '') {
            let jobDetailsData: any = value?.JobDetails;
            //////Job Category//////////////
            if ((jobDetailsData?.JobCategoryId != undefined) && (jobDetailsData?.JobCategoryId != null) && (jobDetailsData?.JobCategoryId != '')) {
              this.selectedCategory = { Id: jobDetailsData?.JobCategoryId , "JobCategory": jobDetailsData?.JobCategoryName};
              if (value.JobDetails.JobCategoryId === "00000000-0000-0000-0000-000000000000") {
                this.selectedCategory = null;
                this.quickJobForm.patchValue({
                  JobCategoryId: null
                })

              }else{
                this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + this.selectedCategory?.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
              this.quickJobForm.patchValue(
                {
                  JobCategoryId: this.selectedCategory.Id,
                });
              }
              //////Job Sub Category//////////////
              // this.CMMN_Dropdown_ConfigJob_SUB_Category.API = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + jobDetailsData?.JobCategoryId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
              //  this.resetFormSubjectSubCategory.next(this.CMMN_Dropdown_ConfigJob_SUB_Category);

            let arr:any | [] = [];
              jobDetailsData?.JobSubCategoryId.forEach((e:any)=>{
                arr.push({Id: e.Id, JobSubCategory: e.Name})
              })
            this.selectedSubCategory = arr;
              const subCategoryId = this.selectedSubCategory.map((item: any) => {
                return item.Id
              });
              this.quickJobForm.patchValue(
                {
                  JobSubCategoryId: subCategoryId,
                });

            }

            //////Industry//////////////
            if ((jobDetailsData?.IndustryId != undefined) && (jobDetailsData?.IndustryId != null) && (jobDetailsData?.IndustryId != '')) {
              let industriesList = [];
               jobDetailsData?.IndustryId?.forEach(x => {
                 industriesList.push({Id:x.IndustryId,Description:x.IndustryName});
               });
               this.selectedIndustry = industriesList;
              const industryId = this.selectedIndustry.map((item: any) => {
                return item.Id
              });
              this.quickJobForm.patchValue(
                {
                  IndustryId: industryId
                });
              //////Sub Industry//////////////
              
              let subIndustriesList = [];
              jobDetailsData?.SubIndustryId?.forEach(y => {
                subIndustriesList.push({Id:y.SubIndustryId,Description:y.SubIndustryName});
              });
              this.selectedSubIndustry = subIndustriesList;

              const subIndustryId = this.selectedSubIndustry.map((item: any) => {
                return item.Id
              });
              this.quickJobForm.patchValue(
                {
                  SubIndustryId: subIndustryId
                });
                this.CMMN_Dropdown_ConfigSubIndustry.API = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
              //////Qualification//////////////
              this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?IndustryId=' + industryId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
              this.resetFormSubjectQualification.next(this.dropDownQualificationConfig);
              this.selectedQualification = jobDetailsData?.QualificationId;
              const qualificationId = this.selectedQualification.map((item: any) => {
                return item.Id
              });
              this.quickJobForm.patchValue(
                {
                  QualificationId: qualificationId
                })
                // @suika @whn 16-05-2023 @EWM-10611 @EWM-12444
            }else{
              this.selectedQualification = jobDetailsData?.QualificationId;
              this.quickJobForm.patchValue(
                {
                  QualificationId: this.selectedQualification
                })
            }

               //////SkillList//////////////
             this.skillSelectedList = jobDetailsData?.skillList;
             this.skillSelectedListId = jobDetailsData?.skillList;
             this.quickJobForm.patchValue({
               SkillTag: this.skillSelectedListId
             });
             //////SkillList End //////////////

            //////Experience//////////////
            this.selectedExperience = jobDetailsData?.ExperienceId[0];
            // const ExperienceId = this.selectedExperience.map((item: any) => {
            //   return item.Id
            // });
            if (jobDetailsData?.ExperienceId !== null && jobDetailsData?.ExperienceId !== undefined) {
            if(jobDetailsData?.ExperienceId.length>0){
            this.quickJobForm.patchValue(
              {
                ExperienceId: jobDetailsData?.ExperienceId[0].Id
              }
            )}
          }

            //////JobType//////////////
            if ((jobDetailsData?.JobTypeId != undefined) && (jobDetailsData?.JobTypeId != null) && (jobDetailsData?.JobTypeId != '')) {
              this.selectedJobType = { Id: jobDetailsData?.JobTypeId, JobType: jobDetailsData.JobTypeName };
              this.quickJobForm.patchValue(
                {
                  JobTypeId: this.selectedJobType.Id,
                });
              //////JobSubType//////////////
              this.selectedJobSubType = { Id: jobDetailsData?.JobSubTypeId, JobSubType: jobDetailsData.JobSubTypeName };
              this.CMMN_Dropdown_ConfigJobSubType.API = this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + this.selectedJobType?.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
             
              if (this.selectedJobSubType.Id == 0) {
                this.selectedJobSubType = null;
                this.quickJobForm.patchValue(
                  {
                    JobSubTypeId: null
                  }
                )
              }else{
                this.quickJobForm.patchValue(
                  {
                    JobSubTypeId: this.selectedJobSubType.Id
                  }
                )
              }
            }

            //////Experties//////////////
            if ((jobDetailsData?.ExpertiseId != undefined) && (jobDetailsData?.ExpertiseId != null) && (jobDetailsData?.ExpertiseId != '')) {
              let expertiseList = [];
              jobDetailsData?.ExpertiseId?.forEach(z => {
                expertiseList.push({Id:z.ExpertiseId,FunctionalExpertise:z.ExpertiseName});
              });
              this.selectedExperties = expertiseList;
              const expertiesId = this.selectedExperties.map((item: any) => {
                return item.Id
              });
              this.quickJobForm.patchValue(
                {
                  ExpertiseId: expertiesId
                });
              //////Sub Experties//////////////

              let subExpertiseList = [];
            this.CMMN_Dropdown_ConfigSubExperties.API= this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
              jobDetailsData?.SubExpertiseId?.forEach(y => {
                subExpertiseList.push({Id:y.SubExpertiseId,FunctionalSubExpertise:y.SubExpertiseName});
              });
              this.selectedSubExperties = subExpertiseList;
              const subExpertiesId = this.selectedSubExperties.map((item: any) => {
                return item.Id
              });
              this.quickJobForm.patchValue(
                {
                  SubExpertiseId: subExpertiesId
                });
            }


           
          }

        }

        //////Salary//////////////
        if (this.jobCopySectionAccess[0]?.isSalary === true) {
          if (value?.Salary != undefined && value.Salary != null && value.Salary != '') {
            let salaryData: any = value?.Salary;
            this.selectedSalaryUnit = { Id: salaryData?.SalaryUnitId };
            if (value.Salary.SalaryUnitId ==0) {
              this.selectedSalaryUnit = null;
              this.quickJobForm.patchValue({
                SalaryUnitId: null
              })
            }else{
              this.quickJobForm.patchValue(
                {
                  SalaryUnitId: this.selectedSalaryUnit.Id
                })
            }
            this.selectedSalaryBandName = { Id: salaryData?.SalaryBandId };
            if (value.Salary.SalaryBandId == 0) {
              this.selectedSalaryBandName  =null;
              this.quickJobForm.patchValue(
                {
                  SalaryBandId: null
                })
            }else{
              this.quickJobForm.patchValue(
                {
                  SalaryBandId: this.selectedSalaryBandName.Id
                })
            }

            if (value.Salary.CurrencyId == 0 ) {
              this.quickJobForm.patchValue({
                CurrencyId: null,
              });
            }else{
              this.selectedCurrency = { 'Id': value?.Salary?.CurrencyId, 'CurrencyName': value?.Salary?.CurrencyName, 'Symbol': value?.Salary?.CurrencySymbol };
              this.quickJobForm.patchValue({
                CurrencyId: value?.Salary?.CurrencyId,
                Bonus: value?.Salary?.Bonus,
                Equity: value?.Salary?.Equity,
              });
            }


          }
        }

        //////JobDescription//////////////
        if (this.jobCopySectionAccess[0]?.isJobDescription === true) {
          if (value?.JobDescription != undefined && value.JobDescription != null && value.JobDescription != '') {
            let jobDescriptionData: any = value?.JobDescription;
            this.DescriptionValue = jobDescriptionData?.Description;

            this.selectedTag = jobDescriptionData?.JobTagId;
            const tagId = this.selectedTag.map((item: any) => {
              return item.Id
            });
            this.quickJobForm.patchValue(
              {
                JobTagId: tagId
              })

            this.quickJobForm.patchValue({
              InternalNotes: value?.JobDescription?.InternalNotes,
            });

          }
        }

        //////Advanced//////////////
        if (this.jobCopySectionAccess[0]?.isAdvanced === true) {
          if (value?.JobAdvance != undefined && value.JobAdvance != null && value.JobAdvance != '') {
            let jobAdvanceData: any = value?.JobAdvance;
                // @bantee @whn 18-07-2023  @EWM-13191 what: When user B clones a job then user B as a job owner should be displayed by default in the owner field along with existing owners in the job.
            //Who:Ankit Rawat, Primary job owner show value on Edit, Why: EWM-17356, When:26Jun2024
            const primaryOwner=jobAdvanceData.Owners.find(owner=>owner.IsPrimary==1);
            if(primaryOwner){
              this.selectedPrimaryOwnerItem={UserId:primaryOwner.OwnerId, UserName: primaryOwner.OwnerName};
              this.isPrimaryOwnerValid=true;
            }
            else{
              let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
              let ownerId:any = currentUser?.UserId;
              let userName=currentUser?.FirstName + (currentUser?.LastName ? ' ' + currentUser.LastName : '')
              this.selectedPrimaryOwnerItem={UserId:ownerId, UserName: userName};
              this.isPrimaryOwnerValid=true;
            }

            this.selectedOwnerItem=jobAdvanceData.Owners.filter(owner=>owner.IsPrimary==0).map(owner=>({
              UserId: owner.OwnerId,
              UserName: owner.OwnerName
            }));
  
            /*
            jobAdvanceData?.OwnerId.forEach(id => {
              if(ownerId!=id){
                jobAdvanceData?.OwnerId.push(ownerId);
                this.ownerpatch=jobAdvanceData?.OwnerId

              }else{
                this.ownerpatch = jobAdvanceData?.OwnerId;
              }
            });*/
           // this.ownerList = jobAdvanceData?.OwnerId;
            jobAdvanceData?.ContactId.forEach(element => {
              element.Id = element.ClientContactId;
            });
            this.ownerpatch = jobAdvanceData?.OwnerId;
           // this.ownerList = jobAdvanceData?.OwnerId;
            jobAdvanceData?.ContactId.forEach(element => {
              element.Id = element.ClientContactId;
            });
            const contactId =  jobAdvanceData?.ContactId.map((item: any) => {
              return item.Id
            });
            setTimeout(() => {
              this.companyContactsPatch = contactId;
            }, 1500);


            this.contactList=jobAdvanceData?.ContactId;
           // this.companyList = jobAdvanceData?.ContactId;
            this.selectedBrands = { Id: jobAdvanceData?.BrandId,Brand:jobAdvanceData?.BrandName };
            if (value.JobAdvance.BrandId == 0 ) {
              this.selectedBrands = null;
              this.quickJobForm.patchValue({
                BrandId: null
              })

            }else{
              this.quickJobForm.patchValue({
                  BrandId: this.selectedBrands.Id,
                  BrandName: this.selectedBrands.Brand
                })
            }

            // ADD zero in clone case for 15242 Adarsh singh on 06-12-2023
            this.quickJobForm.patchValue({
              JobExpiryDays: 0,
            });

            if (value.JobAdvance.ProjectId === 0) {
              this.quickJobForm.patchValue({
                ProjectId: null
              })
            }else{
              this.quickJobForm.patchValue({
                //HeadCount: value?.JobAdvance?.HeadCount,
               // OpenDate: new Date(value?.JobAdvance?.OpenDate),
               // FillDate: new Date(value?.JobAdvance?.FillDate),
                JobRank: value?.JobAdvance?.JobRank,
                HideCompany: value?.JobAdvance?.HideCompany,
                ProjectId: value?.JobAdvance?.ProjectId,
                AccessId: value?.JobAdvance?.AccessId,
                AccessName: value?.JobAdvance?.AccessName,
              });
            }
              // @suika @EWM-11998 @EWM-11998 comment these line to reset date to cureent date
           // this.todayOpenDate = new Date(value?.JobAdvance?.OpenDate);
            //this.todayFillDate = new Date(value?.JobAdvance?.FillDate);
           // <!---------@When: 05-05-2023 @who:bantee kumar @why: EWM-11814 EWM-12324  What :Workflow value is patched in the begining of this function for all the sections--------->

              //////Job Status//////////////
            this.selectedJobStatus = { Id: jobAdvanceData?.StatusId,Description: jobAdvanceData?.StatusName,ColorCode:jobAdvanceData?.ColorCode };
            this.quickJobForm.patchValue(
              {
                StatusId: this.selectedJobStatus.Id,
                StatusName:this.selectedJobStatus.Description,
                StatusColorCode:this.selectedJobStatus.ColorCode
              });

              //////Job Reason//////////////
            this.selectedReason = { Id: jobAdvanceData?.ReasonId,ReasonName:jobAdvanceData?.ReasonName };
            /*--@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883,What:passing gropu code --*/
            this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
             this.resetFormselectedReason.next(this.dropDownReasonConfig);
             if (value.JobAdvance.ReasonId == null || value.JobAdvance.ReasonId == 0 ) {
              this.selectedReason = null;
              this.quickJobForm.patchValue({
                ReasonId: null,
                ReasonName: ''
              })
            }else{
              this.quickJobForm.patchValue({
                  ReasonId: this.selectedReason.Id,
                  ReasonName: this.selectedReason.Brand
                })
            }
          }


          //////Publish to Job Boards//////////////
          if (this.jobCopySectionAccess[0]?.isPublish === true) {
            if (value?.JobBoards != undefined && value.JobBoards != null && value.JobBoards != '') {
              let jobBoardsData: any = value?.JobBoards;
              this.selectedManageAccess = { Id: jobBoardsData?.ManageAccessId };
              this.quickJobForm.patchValue(
                {
                  ManageAccessId: this.selectedManageAccess.Id
                });
              this.quickJobForm.patchValue({
                IsDisable: value?.JobBoards?.IsDisable,
                KnockOut: value?.JobBoards?.KnockOut,
              //  PublishDate: new Date(value?.JobBoards?.PublishDate),  // @suika @EWM-11998 @EWM-11998 comment these line to reset date to cureent date
              });
                // @suika @EWM-11998 @EWM-11998 comment these line to reset date to cureent date
           //  this.todayPublishDate = new Date(value?.JobBoards?.PublishDate);
            }
          }
        } else {
              //Who:Ankit Rawat, Advance else block: select current user from local storage if isAdvance is false, Why: EWM-17356, When:26Jun2024
              let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
              let ownerId:any = currentUser?.UserId;
              let userName=currentUser?.FirstName + (currentUser?.LastName ? ' ' + currentUser.LastName : '')
              this.selectedPrimaryOwnerItem={UserId:ownerId, UserName: userName};
              this.isPrimaryOwnerValid=true;
          this.dateOpen = null;
          this.dateFill = null;
          this.datePublish = null;
        }
      }
    }




   /*
   @Type: File, <ts>
   @Name: openManageAccessModal
   @Who:Adarsh
   @When: 08-05-22
   @Why:EWM-4467 EWM-4529
   @What: to open quick add Manage Access modal dialog
 */

openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
  if (this.formHeading == 'Add') {
    this.oldPatchValuesAccessMode = {};
  }
  const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
    // maxWidth: "550px",
    data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValuesAccessMode, ActivityType: 2 },
    // width: "95%",
    // maxHeight: "85%",
    panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res.isSubmit == true) {
      this.oldPatchValuesAccessMode = {};
      this.accessEmailId = [];
      let mode: number;
      if (this.formHeading == 'Add') {
        mode = 0;
      } else {
        mode = 1;
      }
      res.ToEmailIds?.forEach(element => {
        this.accessEmailId.push({
          'Id': element['Id'],
          'UserId': element['UserId'],
          'EmailId': element['EmailId'],
          'UserName': element['UserName'],
          'MappingId': element[''],
          'Mode': mode
        });
      });
      this.quickJobForm.patchValue({
        'AccessName': res.AccessName,
        'AccessId': res.AccessId[0].Id
      });
      this.oldPatchValuesAccessMode = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

    } else {

    }


  })
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
}

/*
   @Type: File, <ts>
   @Name: getStatusList function
   @Who: ANup
   @When: 14-Mar-2022
   @Why: EWM-5285 EWM-3988
   @What: For img url
  */
 onChangeColorCodeGetImgUrl(data) {
  let ColorCodeJson = {}
  ColorCodeJson['ColorCode'] = '#' + data?.value?.hex;
  this.jobRankcolorCode = '#' + data?.value?.hex;
  this.jobWorkflowService.getWorkFlowImgUrlByColorCode(ColorCodeJson).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.uploadColorCodePreview = repsonsedata.Data[0].Preview;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

  /*
  @Type: File, <ts>
  @Name: hexToRgb
  @Who: Adarsh singh
  @When: 29-June-2021
  @Why: EWM-7081
  @What: TO CONVERT color to hex code
  */
 hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex?.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
/*
   @Type: File, <ts>
   @Name: onConfirmUpdateJob function
   @Who: Nitin Bhati
   @When: 15-June-2022
   @Why: EWM-1749 EWM-1900
   @What: For Update quick job data
  */
   onConfirmUpdateJob(): void {
    this.submitted = true;
     if (this.quickJobForm.valid) {
      this.loading = true;   /*-@why:EWM-14577,@when:05-10-2023,@who:Nitin Bhati-*/
       if(this.quickJobForm.value.IsDisable == true && this.quickJobForm.value.FillDate!=null ){
        if(this.quickJobForm.value.PublishDate>this.quickJobForm.value.FillDate){
          this.loading = false;
         const message = ``;
         const title = 'label_disabled';
         const subtitle = 'label_folderName';
         const dialogData = new ConfirmDialogModel(title, subtitle, message);
         const dialogRef = this.dialog.open(PublishJobValidationComponent, {
          data: new Object({ editId: 'Add'}),
          panelClass: ['xeople-modal', 'add_publishValidation','animate__animated', 'animate__zoomIn'],
          disableClose: true,
         });
         let dir:string;
         dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
         let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
         for(let i=0; i < classList.length; i++){
           classList[i].setAttribute('dir', this.dirctionalLang);
          }
         dialogRef.afterClosed().subscribe(res => {
           if(res===false){
            document.getElementsByClassName("add_publishValidation")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("add_publishValidation")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(false); }, 200);
           }else{
         const message = ``;
         const title = 'label_disabled';
         const subtitle = 'label_folderName';
         const dialogData = new ConfirmDialogModel(title, subtitle, message);
         const dialogRef = this.dialog.open(PopupIntegrationCategoryComponent, {
          data: new Object({ editId: 'Add'}),
          panelClass: ['xeople-modal', 'add_Integrationcategory','animate__animated', 'animate__zoomIn'],
          disableClose: true,
         });
         let dir:string;
         dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
         let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
         for(let i=0; i < classList.length; i++){
           classList[i].setAttribute('dir', this.dirctionalLang);
          }
         dialogRef.afterClosed().subscribe(res => {
           if(res==true){
            this.UpdateJob();
            document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(false); }, 200);
           }else{
            document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(false); }, 200);
            }
        })
        }
      })
    }else{
         this.UpdateJob();
    }
      }else{
        this.UpdateJob();
      }
    }

}
/*
   @Type: File, <ts>
   @Name: onChange function
   @Who: Adarsh Singh
   @When: 05-07-2022
   @Why: EWM-7363 EWM-7607
   @What: For change color on chnage while select color
*/
  public onChange(getColor: string): void {
    const color = getColor;
    const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
    this.defaultColorValue = hex;
  }

  /*
  @Type: File, <ts>
  @Name: onStateChange function
  @Who: Adarsh Singh
  @When: 29-Aug-2022
  @Why: EWM.8060.EWM.8372
  @What: To get Data from state while click on that
*/
onStateChange(data) {
  if (data == null || data == "" || data?.length == 0) {
    this.selectedState = null;
    this.quickJobForm.patchValue({
      StateId: null,
      StateName: null
    })
  }
  else if (data.Id ==0) {
    this.selectedState = null;
    this.quickJobForm.patchValue({
      StateId: null,
      StateName: null
    })
  }

  else {
    this.selectedState = data;
    this.quickJobForm.patchValue({
      StateId: data.Id,
      StateName: data.StateName
    })

  }
}

/*
  @Type: File, <ts>
  @Name: resetData function
  @Who: Adarsh Singh
  @When: 03-Aug-2022
  @Why: EWM.8060.EWM.8372
  @What: for reset the state data while chnaging the country
*/
resetData(e) {
  this.selectedState = null;
}
/*
  @Type: File, <ts>
  @Name: mapApplicationForm function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-7875 EWM-8992
  @What: open map application form
*/

mapApplicationForm(){
    const dialogRef = this.dialog.open(MapApplicationInfoComponent, {
      data: { applicationList: this.applicationList,applicationDefault:this.applicationDefault },
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
    if(resData.res){
      this.applicationDefault=resData.inputArray[0];
      this.isMapAppToggled=false;
      this.quickJobForm.patchValue({
        'ApplicationFormId': this.applicationDefault?.Id,
        'ApplicationFormName': this.applicationDefault?.Name
       })
    }
    })
}

/*
  @Type: File, <ts>
  @Name: removeApplication function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-7875 EWM-8992
  @What: to remove chip from data
*/
removeApplication(appInfo): void {
  this.applicationDefault={};
  this.isMapAppToggled=true;
  }
  /*
  @Type: File, <ts>
  @Name: applicationFormInfo function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-7875 EWM-8992
  @What: get application default Info
*/

applicationFormInfo(){
  this.jobWorkflowService.getApplicationDefault().subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.applicationList= repsonsedata.Data;
       this.applicationDefault= repsonsedata.Data.filter(x=>x['IsDefault']===1)[0];
       this.isMapAppToggled = true;
       this.isDropdown = true;
       this.quickJobForm.patchValue({
         'ApplicationFormId': this.applicationDefault?.Id,
         'ApplicationFormName': this.applicationDefault?.Name
        })
       if (this.quickJobForm.value.ApplicationFormId) {
       this.isMapAppToggled = false;
       }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      // this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

clickCurrency(dataList) {
  if (dataList == null || dataList == "" || dataList.length == 0) {
    this.selectedCurrency = null;
    this.quickJobForm.patchValue(
      {
        CurrencyId: null,
        CurrencyName: null,
        CurrencySymbol: null,
      });
    }
  else {
    this.quickJobForm.get("CurrencyId").clearValidators();
    this.quickJobForm.get("CurrencyId").markAsPristine();
  this.selectedCurrency=dataList;
  this.quickJobForm.patchValue(
   {
     CurrencyId: dataList?.Id,
     CurrencyName: dataList?.CurrencyName,
     CurrencySymbol: dataList?.Symbol,
   }
  )
  }
}


getContactList(){
  this.contactList = [];
  let cList = this.quickJobForm.get('Contact').value;
  cList?.forEach(element => {
    let Id = element;
    let contactList =  this.companyList.filter((e: any) => e.Id == Id);
    contactList[0].Phone = contactList[0].PhoneNo;
    contactList[0].ClientContactId = contactList[0].Id;
    this.contactList.push(contactList[0]);
  });
}

clearContact(item){
 const index = this.contactList.indexOf(item);
 if (index >= 0) {
   this.contactList.splice(index, 1);
 }
}
     /*
    @Type: File, <ts>
    @Name: clearPublishDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear publish  date
     */
    clearPublishDate(e){
      this.quickJobForm.patchValue({
        PublishDate: null
      });
    }
     /*
    @Type: File, <ts>
    @Name: clearopenDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear open  date
     */
    clearopenDate(e){
      this.quickJobForm.patchValue({
        OpenDate: null
      });
    }
       /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear start  date
     */
    clearStartDate(e){
      this.quickJobForm.patchValue({
        FillDate: null
      });
    }
 /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date
     */
    clearEndDate(e){
      this.quickJobForm.patchValue({
        DateEnd: null
      });
    }


/*
  @Type: File, <ts>
  @Name: onManageReasonchange function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: For showing the list of reason data
 */
  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.quickJobForm.patchValue(
        {
          ReasonId: 0,
          ReasonName: ''
        }
      )
      // this.quickJobForm.get("ReasonId").setErrors({ required: true });
      // this.quickJobForm.get("ReasonId").markAsTouched();
      // this.quickJobForm.get("ReasonId").markAsDirty();
    }
    else {
      // this.quickJobForm.get("ReasonId").clearValidators();
      // this.quickJobForm.get("ReasonId").markAsPristine();
      this.selectedReason = data;
      this.quickJobForm.patchValue(
        {
          ReasonId: data.Id,
          ReasonName: data.ReasonName,
        }
      )
    }
  }

/*
@Type: File, <ts>
@Name: userRoleList function
@Who: Adarsh singh
@When: 21-12-2021
@Why: EWM-9369 EWM-9967
@What: service call for get list for user role data
*/
// @When: 13-08-2024 @who:Amit @why: EWM-17888 @what: skill count & tag lable show
mintitle:string;
openPopupForSkillCountOfTag(count, SkillDataByTag, tagName): void {
  let countSkill: string = count;
  let message = countSkill;

  if (message=='1' ||message=='0') {  
    this.mintitle ='JobSummary_AddSkills_0_value';
    message = this.commonServiesService.getreplaceSkill(this.mintitle, tagName, count);
    } else {
     this.mintitle ='JobSummary_AddSkills';
    message = this.commonServiesService.getreplaceSkill(this.mintitle, tagName, count);
  }

  let titellabel=message;
  let title=''
  // const subTitle = tagName + ' ' + lng + '.' + this.translateService.instant('label_skillDoYouWant');
  const dialogData = new ConfirmDialogModel(title, titellabel, this.messageCount);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      for (let index = 0; index < SkillDataByTag?.length; index++) {
        const element = SkillDataByTag[index];
        this.skillSelectedList.push(element);
        this.skillSelectedListId.push(element);
      }
      this.SkillTag.patchValue(this.skillSelectedListId);
      this.quickJobForm.patchValue({
        SkillTag: this.skillSelectedListId
      });
      //this.skillSelectedList.forEach(element => {
      // this.skillIds.push(element.Id);
      //  });

    } else {
      const index = this.skillTag.findIndex(x => x.TagName === tagName);
      if (index !== -1) {
        this.skillTag.splice(index, 1);
      }
    }
  });
}

/*
  @Type: File, <ts>
  @Name: selectedSkills function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: for selected data in dropdown
  */
public skillTag: any = [];
public selectedSkills(eventData): void {
  // <!---------@When: 21-april-2023 @who:bantee kumar @why: EWM-11814 EWM-12073--------->
  if(!eventData.length){
    this.skillTag=[];
    this.skillSelectedListId=[];
    this.skillSelectedList = [];
  }
  let event = eventData[eventData.length - 1];
  if (event?.IsTag === 0) {
    if (this.skillSelectedList.some(el => el.SkillName == event?.SkillName)) {
    }
    else {
      this.skillSelectedList.push({
        'Id': event?.Id,
        'SkillName': event?.SkillName,
        'Weightage': event?.Weightage,

      });
    }
  } else {
    // if (this.skillTag.some(el => el.TagName == event.option.value.TagName)) {
    // } else {
    //   this.skillTag.push({
    //     'Id': event.option.value.Id,
    //     'TagName': event.option.value.TagName,
    //   });
    //   this.getskillListByTagId(event.option.value.Id, event.option.value.TagName)
    // }
    this.skillSelectedListId = this.skillSelectedListId.filter(s => s?.Id != event?.Id);
    // <!---------@When: 21-april-2023 @who:bantee kumar @why: EWM-11814 EWM-12073--------->
    if(event?.Id){
    this.skillTag.push({
      'Id': event?.Id,
      'TagName': event?.TagName,
    });
  }
    this.getskillListByTagId(event?.Id, event?.TagName);
  }
  //this.searchskillList = [];
  //this.skillInput.nativeElement.value = '';
  // this.getSkillById(event.option.value.Id, event.option.viewValue);
}

  /*
  @Type: File, <ts>
  @Name: screenMediaQuiryForSkills function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: for showing data according to screen size
  */
  screenMediaQuiryForSkills() {
    if (this.forSmallSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forSmartphones.matches == true) {
      this.maxMoreLength = 0;
    } else if (this.forLargeSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forIpads.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forMiniLapi.matches == true) {
      this.maxMoreLength = 4;
    } else {
      this.maxMoreLength = 2;
    }
  }

/*
  @Type: File, <ts>
  @Name: onsearchSkills function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: for display data while enter something
  */
  public onsearchSkills(inputValue: string) {
    this.currentSearchValue = inputValue;
    this.loadingSearch = true;
    if (inputValue.length === 0) {
      //this.searchskillList = [];
      this.tagSkillsList();
      this.loadingSearch = false;
      this.searchValue='';
    }
    if (inputValue.length > 0 && inputValue.length > 1) {
      this.searchValue = inputValue;
      this.loadingSearch = false;
      this.quickJobService.getAllSkillAndTag("?Search=" + inputValue +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.searchskillList = repsonsedata.Data;
            if (repsonsedata.Data != null) {
              this.skillCount = repsonsedata.Data[0]?.SkillCount;
            }
          } else {
            // this.loadingSearch = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          // this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  }

   /*
  @Type: File, <ts>
  @Name: tagSkillsList function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: service call for get list for skills
  */

 public tagSkillsList() {
  this.loadingSearch = true;
  this.quickJobService.getAllSkillAndTagWithoutFilter('?FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loadingSearch = false;
        this.searchskillList = repsonsedata.Data;
        if (repsonsedata.Data != null) {
          this.skillCount = repsonsedata.Data[0]?.SkillCount;
        }
      } else {
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
  /*
  @Type: File, <ts>
  @Name: refreshComponent function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: for refresh data
  */
refreshComponent(event) {
  // this.onsearchSkills(this.currentSearchValue);
  this.searchValue='';
  this.tagSkillsList();
}
/*
@Who: Adarsh singh
@When: 21-12-2021
@Why: EWM-9369 EWM-9967
@What: to compare objects selected
*/
compareFn(c1: any, c2:any): boolean {
  return c1 && c2 ?c1.Id === c2.Id : c1 === c2;
}
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 06-jan-2023
   @Why: EWM-10105
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}


candidateMappedJobCount:number = 0;
getCandidateListByJob(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, filterConfig: any, isSearch: boolean, isScroll: boolean) {
  this.loading = true;
  const formdata = {
    JobId: this.JobId,
    GridId: this.GridId,
    JobFilterParams: filterConfig,
    search: searchValue,
    PageNumber: pagneNo,
    PageSize: pagesize,
    OrderBy: sortingValue,
    CountFilter: 'TotalJobs',
    WorkflowId:this.workFlowID,
    Source:this.Source,
  }
  this._service.getAllCandidateJobMapping(formdata).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.gridListData = data.Data;
        if (data.Data==null) {
          this.candidateMappedJobCount = 0;
        }else{
          this.candidateMappedJobCount = data.TotalRecord;
        }
        this.loading = false;
      //this.dropDownJobWorkflowConfig['IsDisabled'] = this.candidateMappedJobCount==0?false:true;
      //Who:Ankit Rawat, Added disable logic for workflow new control, When:05Apr2024
      this.DisabledWorkFlowControl=this.candidateMappedJobCount==0?false:true;
      //this.resetFormSubjectWorkFlow.next(this.dropDownJobWorkflowConfig);
      }else if(data.HttpStatusCode === 204){
        this.candidateMappedJobCount = 0;
        this.gridListData = [];
        this.loading = false;
        //this.dropDownJobWorkflowConfig['IsDisabled'] = this.candidateMappedJobCount==0?false:true;
        //Who:Ankit Rawat, Added disable logic for workflow new control, When:05Apr2024
        this.DisabledWorkFlowControl=this.candidateMappedJobCount==0?false:true;
        //this.resetFormSubjectWorkFlow.next(this.dropDownJobWorkflowConfig);
      }else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });

}

/*
   @Type: File, <ts>
   @Name: onFloatButtonClickForEdit function
   @Who: Adarsh singh
   @When: 03-Feb-2023
   @Why: EWM-10393
   @What: when user click on flotter edit button then this will open edit mode
*/
onFloatButtonClickForEdit(){
  this.floatingEditButton = false;
  this.onEditJobToFloatButton.emit(true);
}
// color picker start
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11115
  @What: for open color picker dropdown
*/
showColorPallate(e:any) {
  this.overlayViewjob=!this.overlayViewjob;
  this.showColorPallateContainer = !this.showColorPallateContainer;
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11115
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.quickJobForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.quickJobForm.patchValue({
      ColorCode: null
    })
    this.selctedColor = null;
  }

}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11115
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.quickJobForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11115
  @What: close dropdown while click on more label
*/
closeTemplate() {
  this.showColorPallateContainer = true;
  this.isMoreColorClicked = true;
  setTimeout(() => {
    this.isMoreColorClicked = false;
  }, 100);
}
/*
  @Type: File, <ts>
  @Name: getColorCodeAll funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11115
  @What: get all custom color code from config file
*/
  getColorCodeAll() {
    this.loading = true;
    this.commonserviceService.getAllColorCode().subscribe((data: statusMaster) => {
      this.loading = false;
      this.themeColors = data[0]?.themeColors;
      this.standardColor = data[1]?.standardColors;
    },
      err => {
        this.loading = false;
      })
  }
// color picker End

/*
     @Type: File, <ts>
     @Name: conditionChcek
     @Who: Bantee Kumar
     @When: 16-03-2023
     @Why: EWM-10690
     @What: for validate maximum  and minimum expiry days
  */
conditionChcek() {
  let values = this.quickJobForm.get("JobExpiryDays").value;
  if (1000 > values) {

    if(values >= 0){
    this.quickJobForm.get("JobExpiryDays").clearValidators();
    this.quickJobForm.get("JobExpiryDays").markAsPristine();
    this.quickJobForm.get('JobExpiryDays').setValidators([Validators.pattern(this.onlyNumberPattern)]);
 }  else {
    this.quickJobForm.get("JobExpiryDays").setErrors({ numbercheck: true });
    this.quickJobForm.get("JobExpiryDays").markAsDirty();
  }
} else if((values%1)==0) {
  this.quickJobForm.get("JobExpiryDays").setErrors({ numbercheck: true });


}
else{
  this.quickJobForm.get('JobExpiryDays').setValidators([Validators.pattern(this.onlyNumberPattern)]);

}
}

manageSkills(){
  //this.route.navigate(['./client/core/administrators/skills']);
  window.open('./client/core/administrators/skills', "_blank");
}

  /*
   @Type: File, <ts>
   @Name: quickJobListByJobId function
   @Who: Anup Singh
   @When: 30-Sept-2021
   @Why:EWM-2870 EWM-2988
   @What: For get quick job list by id
   */

  getJobDetailsData(jobId) {
    this.loading = true;
    this.quickJobService.getJobDetailsData('?jobId=' + jobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
           //<!-----@Adarsh singh@EWM-10282 EWM-10476  @25-04-2023 Set json for job published from broadbean----->
           let data = repsonsedata.Data;
           this.route.navigate(['/client/jobs/job/job-publish-v1/publish', {jobId: data?.Id,jobRefId:data?.JobReferenceId,workId:data?.WorkflowId,pub:0}]);
            let jobDataForBroadbean : BroadbeanPosting = {
              JobTitle : data?.JobTitle,
              JobReferenceId : data?.JobReferenceId,
              JobTypeName : data?.JobTypeName,
              Location : data?.Location,
              IndustryName : data?.IndustryName,
              SalaryMin : data?.SalaryMin,
              SalaryMax : data?.SalaryMax,
              CurrencyName : data?.CurrencyName,
              SalaryUnitName : data?.SalaryUnitName,
              salaryBenefits : 'salary benefits',
              JobDescription : data?.JobDescription,
              ApplicationFormId : data?.ApplicationFormId,
              ApplicationFormName : data?.ApplicationFormName,
              WorkflowId : data?.WorkflowId,
              Id : data?.Id,
              PublishedOnSeek : data?.PublishedOnSeek,
              PublishedOnIndeed : data?.PublishedOnIndeed
            };
            this._BroadbeanService.onBroadBeadSelect.next(jobDataForBroadbean);
            this.selectedIndex = 0;
              this.commonserviceService.onselectedIndexId.next(this.selectedIndex);
            // End
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

    //who:maneesh.ewm-11774 for focus owner and companycontact field,when:20/09/2023
    scrollToFirstInvalidControl() {
      if (this.ownersData) {
      setTimeout(() => {
        document.getElementById("focusFielddata")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
         });
        }, 1000);
      }else if(this.FocusContactField){
        setTimeout(() => {
          document.getElementById("quickjob-companyContacts")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
           });
          }, 1000);
      }

    }

    /*
     @Type: File, <ts>
     @Name: addAddress
     @Who: Nitin Bhati
     @When: 06-March-2023
     @Why: Ewm-11009
     @What: To get Data from address of client
     */
     addAddress() {
        const dialogRef = this.dialog.open(QuickJobLocationComponent, {
           /*--@Who:bantee,@When:16/08/2023, EWM-13525 @What: common location changes--*/
       data: new Object({AutoFilldata:(this.addressData?.length?this.addressData[0]:this.clientAddressList),methodType:this.hideForJobDetailsView==true?'View':'Edit'}),
       panelClass: ['xeople-modal', 'add_canAddress', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     });
     dialogRef.afterClosed().subscribe(res => {
       if (res != undefined && res != null) {
         this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap)
         this.selectedValue = { 'Id': Number(res?.data?.CountryId),'CountryName': res?.data?.CountryName  };
           this.selectedState = { 'Id': Number(res?.data?.StateId), 'StateName': res?.data?.StateName};
           this.AddressLinkToMap = res?.data?.AddressLinkToMap;
           this.Latitude = res?.data?.Latitude;
           this.Longitude = res?.data?.Longitude;
           this.clientAddressList=res?.data;
           this.quickJobForm.patchValue({
           Address1: res?.data?.AddressLine1,
           Address2: res?.data?.AddressLine2,
           StateId: res?.data?.StateId,
           City: res?.data?.TownCity,
           ZipCode: res?.data?.PostalCode,
           Latitude:res?.data?.Latitude,
           Longitude:res?.data?.Longitude,
           District_Suburb:res?.data?.District_Suburb,
         });
          /*--@Who:Renu,@When:26/10/2023, EWM-14940 EWM-14918 @What: for update location--*/
         if(this.isEditJob && res?.response){
          this.updateLocation();
         }
       }
     })

     // RTL Code
     let dir: string;
     dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
     let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
     for (let i = 0; i < classList.length; i++) {
       classList[i].setAttribute('dir', this.dirctionalLang);
     }
   }
   /*
     @Type: File, <ts>
     @Name: updateLocation
     @Who: Renu
     @When: 26-Oct-2023
     @Why: Ewm-14918 EWM-14940
     @What: to update location through api call
     */
  updateLocation() {
   let locObj: IquickJob = {};
   locObj.JobId= this.EditJobId;
   locObj.Address1= this.quickJobForm.value.Address1?.trim();
   locObj.Address2=this.quickJobForm.value.Address2?.trim();
   locObj.AddressLinkToMap=this.quickJobForm.value.address.AddressLinkToMap;
   locObj.Latitude=this.quickJobForm.value.Latitude;;
   locObj.Longitude=this.quickJobForm.value.Longitude;
   let countryIdSubmit: number;
   if (this.selectedValue == undefined || this.selectedValue == null) {
     countryIdSubmit = 0;
   }
   else {
     countryIdSubmit = this.selectedValue.Id;
   }
   locObj.CountryId=countryIdSubmit;
   locObj.CountryName=this.selectedValue?.CountryName;
   locObj.StateId= this.selectedState?.Id;
   locObj.StateName=this.selectedState?.StateName;
   locObj.City=this.quickJobForm.value.City?.trim();
   locObj.ZipCode= this.quickJobForm.value.ZipCode?.trim();
   locObj.DistrictSuburb= this.quickJobForm.value.District_Suburb?.trim();
   this.quickJobService.updateJobLocation(locObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;

        this.addressData?.forEach((element:any) => {
          element['AddressLine1'] =locObj?.Address1;
          element['AddressLine2'] =locObj?.Address2;
          element['AddressLinkToMap'] =locObj?.AddressLinkToMap;
          element['CountryId'] = locObj?.CountryId;
          element['StateId'] =locObj?.StateId;
          element['StateName'] =locObj?.StateName;
          element['LocationId'] = locObj?.Address1;
          element['Latitude'] =  locObj?.Latitude;
          element['Longitude'] = locObj?.Longitude;
          element['PostalCode'] = locObj?.ZipCode;
          element['District_Suburb'] =locObj?.DistrictSuburb;
          element['TownCity'] = locObj?.City;
        });
        //this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
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
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
  }
  /*
     @Type: File, <ts>
     @Name: clientJobListByJobId
     @Who: Nitin Bhati
     @When: 31-Oct-2023
     @Why: Ewm-15005
     @What:get client Location
     */
  clientJobListByJobId(clientId) {
    //this.loading = true;
    this._clientService.getClientAdressAll('?clientid=' + clientId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
              this.clientJobDataByJobId = repsonsedata?.Data?.LocationDetails;
              this.ClientLocationAddress.push({
          'AddressLine1': repsonsedata?.Data?.LocationDetails?.AddressLine1,
          'AddressLine2': repsonsedata?.Data?.LocationDetails?.AddressLine2,
          'AddressLinkToMap': repsonsedata?.Data?.LocationDetails?.AddressLinkToMap,
          'CountryId': repsonsedata?.Data?.LocationDetails?.CountryId,
          'District': repsonsedata?.Data?.LocationDetails?.District,
          'StateId': repsonsedata?.Data?.LocationDetails?.StateId,
          'StateName': repsonsedata?.Data?.LocationDetails?.StateName,
          'LocationId': repsonsedata?.Data?.LocationDetails?.LocationId,
          'Latitude': repsonsedata?.Data?.LocationDetails?.Latitude,
          'Longitude': repsonsedata?.Data?.LocationDetails?.Longitude,
          'PostalCode': repsonsedata?.Data?.LocationDetails?.ZipCode,
          'District_Suburb' :repsonsedata?.Data?.LocationDetails?.District,
          'TownCity' : repsonsedata?.Data?.LocationDetails?.TownCity
        });
        this.selectedClientUser = { 'ClientId': repsonsedata?.Data?.LocationDetails?.ClientId, 'ClientName': repsonsedata?.Data?.LocationDetails?.ClientName}
        this.addressData=[...this.ClientLocationAddress];
        this.ClientName= repsonsedata?.Data?.LocationDetails?.ClientName;
        this.quickJobForm.patchValue({
          Address1: repsonsedata?.Data?.LocationDetails?.AddressLine1,
          Address2: repsonsedata?.Data?.LocationDetails?.AddressLine2,
          StateId: repsonsedata?.Data?.LocationDetails?.StateId,
          City: repsonsedata?.Data?.LocationDetails?.TownCity,
          ZipCode: repsonsedata?.Data?.LocationDetails?.ZipCode,
          Latitude:repsonsedata?.Data?.LocationDetails?.Latitude,
          Longitude:repsonsedata?.Data?.LocationDetails?.Longitude,
          District_Suburb:repsonsedata?.Data?.LocationDetails?.District,
        });
        this.AddressLinkToMap=repsonsedata?.Data?.LocationDetails?.AddressLinkToMap;
        this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(repsonsedata?.Data?.LocationDetails?.AddressLinkToMap);
        this.hideForJobDetailsView=false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.clientJobDataByJobId=repsonsedata?.Data?.LocationDetails;
        }
         else {

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
@Name: dropdownConfig function
@Who: Adarsh singh
@When: 23-Nov-2023
@Why: EWM-15147 
@What: for initialize form
*/
dropdownConfig(){
  this.common_DropdownC_Config = {
    API: this.serviceListClass.getCompanyAllDetailsV2,
    MANAGE: './client/core/clients/list?viewModeData=listMode',
    BINDBY: 'ClientName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_ModifyClient',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'Id'
  }
  //////Job  Category//////////////
  this.CMMN_Dropdown_ConfigJob_Category = {
    API: this.serviceListClass.getJobCategoryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
    MANAGE: '/client/core/administrators/job-category',
    BINDBY: 'JobCategory',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'quickjob_jobCategory',
    SINGLE_SELECETION: true,
    SHORTNAME_SHOW: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'Id'
  }
    //////Job Sub Category//////////////
   this.CMMN_Dropdown_ConfigJob_SUB_Category = {
    API: '',
    MANAGE: '/client/core/administrators/job-category',
    BINDBY: 'JobSubCategory',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'quickjob_jobSubCategory',
    SINGLE_SELECETION: false,
    SHORTNAME_SHOW: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE: '',
    FIND_BY_INDEX: 'Id'
  }
  //////Qualification//////////////
  this.CMMN_Dropdown_ConfigQualification = {
    API: this.serviceListClass.getQualification +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
    MANAGE: '/client/core/administrators/qualification',
    BINDBY: 'QualificationName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'quickjob_qualification',
    SINGLE_SELECETION: false,
    SHORTNAME_SHOW: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'Id'
  }
    ////// Industry//////////////
    this.CMMN_Dropdown_ConfigIndustry = {
      API: this.serviceListClass.getIndustryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
      MANAGE: '/client/core/administrators/industry-master',
      BINDBY: 'Description',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_industry',
      SINGLE_SELECETION: false,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: '',
      FIND_BY_INDEX: 'Id'
    }
    //////Sub Industry//////////////
    this.CMMN_Dropdown_ConfigSubIndustry = {
      API: '',
      MANAGE: '/client/core/administrators/industry-master',
      BINDBY: 'Description',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_subIndustry',
      SINGLE_SELECETION: false,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: '',
      FIND_BY_INDEX: 'Id'
    }

      //////Job Type//////////////
     this.CMMN_Dropdown_ConfigJobType = {
      API: this.serviceListClass.getJobTypeList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
      MANAGE: '/client/core/administrators/job-type',
      BINDBY: 'JobType',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_jobType',
      SINGLE_SELECETION: true,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id'
    }
    //////Job Sub Type//////////////
    this.CMMN_Dropdown_ConfigJobSubType = {
      API: '',
      MANAGE: '/client/core/administrators/job-type',
      BINDBY: 'JobSubType',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_jobSubType',
      SINGLE_SELECETION: true,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id'
    }
    //////////Experience//////////
    this.CMMN_Dropdown_ConfigExperience = {
      API: this.serviceListClass.experienceAllListData +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
      MANAGE: '/client/core/administrators/experience-type',
      BINDBY: 'Name',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_experience',
      SINGLE_SELECETION: true,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id'
    }
     //////////Experties//////////
     this.CMMN_Dropdown_ConfigExperties = {
      API: this.serviceListClass.getAllFunctionalExpertise +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
      MANAGE: '/client/core/administrators/functional-experties',
      BINDBY: 'FunctionalExpertise',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_functionalExpertise',
      SINGLE_SELECETION: false,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id'
    }
    ////////// Sub Experties //////////
    this.CMMN_Dropdown_ConfigSubExperties = {
      API: '',
      MANAGE: '/client/core/administrators/functional-experties',
      BINDBY: 'FunctionalSubExpertise',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'quickjob_functionalSubExpertise',
      SINGLE_SELECETION: false,
      SHORTNAME_SHOW: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id'
    }
 

} 
JobViewModeOnly(data:any){
  // this.common_DropdownC_Config.DISABLED = true;
  // this.CMMN_Dropdown_ConfigJob_Category.DISABLED = true;
  // this.CMMN_Dropdown_ConfigJob_SUB_Category.DISABLED = true;
  // this.CMMN_Dropdown_ConfigQualification.DISABLED = true;
  // this.CMMN_Dropdown_ConfigIndustry.DISABLED = true;
  // this.CMMN_Dropdown_ConfigSubIndustry.DISABLED = true;
  // this.CMMN_Dropdown_ConfigJobType.DISABLED = true;
  // this.CMMN_Dropdown_ConfigJobSubType.DISABLED = true;
  // this.CMMN_Dropdown_ConfigExperience.DISABLED = true;
  // this.CMMN_Dropdown_ConfigExperties.DISABLED = true;
  // this.CMMN_Dropdown_ConfigSubExperties.DISABLED = true;
  //this.apiCalledWhileReset = true;
  this.DisabledWorkFlowControl=true;
  this.DisabledPrimaryOwnerControl=true;
  this.DisabledOwnerControl=true;
}

ngOnDestroy(){
  // this.dataService.resetSetterData();
  // this.dataService.resetSetterDataClientSide();
    // sessionStorage.removeItem('joblandingCreatejob');
}
// adarsh singh common get screeensize function 26 feb 2024
  getScreenSizeName(){
    this._commonDropDownService.mediaBreakpoint$.subscribe((data:string)=>{
      switch (data) {
        case GetScreenSize.XS: {
          console.log('1')
          break;
        }
        case GetScreenSize.SM: {
          console.log('2')
          break;
        }
        case GetScreenSize.MD: {
          console.log('3')
          break;
        }
        case GetScreenSize.LG: {
          console.log('4')
          break;
        }
        case GetScreenSize.XL: {
          console.log('5')
          break;
        }
        case GetScreenSize.XXL: {
          console.log('6')
          break;
        }
      }
    })
  }

  sendDataAgainToChild(isMatchedData: any) {
    setTimeout(() => {
      if (isMatchedData) {
        this.selectedJobStatus = isMatchedData;
        this.quickJobForm.patchValue(
          {
            StatusId: this.selectedJobStatus.Id,
            StatusName: this.selectedJobStatus.StatusName,
            StatusColorCode: this.selectedJobStatus.ColorCode,
          }
        )
      }
      else {
        this.selectedJobStatus = null
      }
    }, 2000);
  }

 //Who:Ankit Rawat, What:EWM-16596  Head count validation, When:04Apr24
  onHeadCountsValidation(event: KeyboardEvent) {
    let values = this.quickJobForm.get("HeadCount").value;
    this.quickJobForm.get("HeadCount").clearValidators();
    this.quickJobForm.get("HeadCount").markAsPristine();
    if (10000 > values) {
      if(values >= 1){
        if(values % 1 !== 0){
          this.quickJobForm.get("HeadCount").setErrors({ pattern: true });
          this.quickJobForm.get("HeadCount").markAsDirty();
        }
        else
          this.quickJobForm.get('HeadCount').setValidators([Validators.pattern(this.headCountPattern)]);
      }  else {
      this.quickJobForm.get("HeadCount").setErrors({ numbercheck: true });
      this.quickJobForm.get("HeadCount").markAsDirty();
    }
    } 
    else if((values%1)==0) {
    this.quickJobForm.get("HeadCount").setErrors({ numbercheck: true });  
    }
    else{
    this.quickJobForm.get('HeadCount').setValidators([Validators.pattern(this.headCountPattern)]);
    }
  }


    //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
    dropdownConfigWorkflow() {
      let WorkFlowISDisabled=false;
      if (this.hideForJobDetailsView) {
        WorkFlowISDisabled = true;
      }else if(this.workflowStatus){
        WorkFlowISDisabled = true;
      }
      else{
        WorkFlowISDisabled = this.JobId == undefined && this.jobId==undefined  && this.candidateMappedJobCount==0?false:true || this.editForm == 'copyForm'? false : true ;
      }

      this.DisabledWorkFlowControl=WorkFlowISDisabled;
      this.workFlowDropdownConfig = {
        API: this.serviceListClass.jobWorkFlowList +"?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND",
        MANAGE: '',
        BINDBY: 'WorkflowName',
        REQUIRED: true,
        DISABLED: WorkFlowISDisabled,
        PLACEHOLDER: 'quickjob_jobWorkflow',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: 'Email',
        IMG_BIND_VALUE: 'ProfileImage',
        FIND_BY_INDEX: 'Id'
      }
    }

  //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
  onWorkFlowchange(data) {
    if (data == null || data == "") {
      this.selectedJobWorkflow = null;
      this.quickJobForm.patchValue(
        {
          WorkFlowId: null
        }
      )
      this.quickJobForm.get("WorkFlowId").setErrors({ required: true });
      this.quickJobForm.get("WorkFlowId").markAsTouched();
      this.quickJobForm.get("WorkFlowId").markAsDirty();
    }
    else {
      this.quickJobForm.get("WorkFlowId").clearValidators();
      this.quickJobForm.get("WorkFlowId").markAsPristine();
      this.selectedJobWorkflow = data;
      this.quickJobForm.patchValue(
        {
          WorkFlowId: data.Id
        }
      )
    }
  }

  //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
    screenMediaQuiryForWorkflow() {
      if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
        this.maxMoreLengthForWorkFlow = 1;
      } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
        this.maxMoreLengthForWorkFlow = 2;
      } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
        this.maxMoreLengthForWorkFlow = 3;
      } else {
        this.maxMoreLengthForWorkFlow = 4;
      }
    }

 //Who:Ankit Rawat, What:EWM-16596 Default workflow selected, When:05Apr24
setDefaultWorkflow(){
  this.jobWorkflowService.getAllWorkFlowList().subscribe(
    (repsonsedata:any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        const selectedWorkflowItem=repsonsedata?.Data?.find(item => item.IsDefault === 1);
        if(selectedWorkflowItem){
          this.selectedJobWorkflow = {
            Id: selectedWorkflowItem.Id,
            WorkflowName: selectedWorkflowItem.WorkflowName
          };
          this.quickJobForm.patchValue(
            {
              WorkFlowId: this.selectedJobWorkflow.Id
            }
          )
        }
        else
        {
          this.selectedJobWorkflow = null;
          this.quickJobForm.patchValue(
            {
              WorkFlowId: null
            }
          )
        }
      } else {
        this.selectedJobWorkflow=null;
        this.quickJobForm.patchValue(
          {
            WorkFlowId: null
          }
        )
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }

  //Who:Ankit Rawat, Primary job owner changes, Why: EWM-17356, When:25Jun2024
bindConfigPrimaryOwner() {
  this.ddlPrimaryOwnerConfig = {
    API: this.serviceListClass.userInvitationsList +"?RecordFor=People&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND",
    MANAGE: '',
    BINDBY: 'UserName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_JobOwners_Primary',
    SHORTNAME_SHOW: true,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: 'Email',
    IMG_BIND_VALUE: 'ProfileImageUrl',
    FIND_BY_INDEX: 'UserId'
  }
}

//Who:Ankit Rawat, Primary job owner changes, Why: EWM-17356, When:25Jun2024
ddlChangePrimaryOwner(data) {
  if (data == null || data == "") {
    this.selectedPrimaryOwnerItem = [];
    this.isPrimaryOwnerValid=false;
  }
  else {
    let old_data=this.selectedPrimaryOwnerItem;
    this.selectedPrimaryOwnerItem=data;
    this.isPrimaryOwnerValid=true;
      if(this.selectedOwnerItem){
        if(Object.keys(this.selectedOwnerItem).length > 0){
          if(this.selectedOwnerItem.some(item => item.UserId === data.UserId)) {
            this.ConfirmationDialog(old_data,data,'label_JobOwners_Exists_Alert','PRIMARY');
          }
        }
      }  
    }
  }

  //Who:Ankit Rawat, Primary job owner changes, Why: EWM-17356, When:25Jun2024
bindConfigOwner() {
  this.ddlOwnerConfig = {
    API: this.serviceListClass.userInvitationsList +"?RecordFor=People&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND",
    MANAGE: '',
    BINDBY: 'UserName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_JobOwners',
    SHORTNAME_SHOW: true,
    SINGLE_SELECETION: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: 'Email',
    IMG_BIND_VALUE: 'ProfileImageUrl',
    FIND_BY_INDEX: 'UserId'
  }
}

//Who:Ankit Rawat, Primary job owner changes, Why: EWM-17356, When:25Jun2024
ddlChangeOwner(data) {
  if (data == null || data == "") {
    this.selectedOwnerItem = null;
  }
  else {
    this.selectedOwnerItem=data;
    let old_data=this.selectedOwnerItem;
      if(this.selectedPrimaryOwnerItem){
        if(Object.keys(this.selectedPrimaryOwnerItem).length > 0){
        var oneitem=data[data.length - 1];
          if(this.selectedPrimaryOwnerItem.UserId==oneitem.UserId) {
            this.ConfirmationDialog(old_data,data,'label_Jo bOwners_Primary_Exists_Alert','OWNER');
          }
        }
      }
    }
  }
  

  public alertMessage(label){
    const message = ``;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle,message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData,isButtonShow:true,message:message, message1: label, message2: '', message3: ''},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  }

  ConfirmationDialog(old_data,data,label,sourceDropdown) {
    const message = label;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if(sourceDropdown=='PRIMARY'){
          this.selectedPrimaryOwnerItem = data;
          this.selectedOwnerItem=this.selectedOwnerItem.filter(item=>item.UserId!=data.UserId);
        }
        else if(sourceDropdown=='OWNER'){
          this.selectedOwnerItem = data;
          this.selectedPrimaryOwnerItem=[];
        }
      }
      else{
        if(sourceDropdown=='PRIMARY'){
          this.selectedPrimaryOwnerItem=old_data;
          this.showPrimaryOwner = false;
          setTimeout(() => this.showPrimaryOwner = true, 0);
        }
        else if(sourceDropdown=='OWNER'){
          if(old_data.length>1){
            old_data.pop();
          }
          else{
            old_data.length=0;
          }
          this.selectedOwnerItem=old_data;
          this.showOwner = false;
          setTimeout(() => this.showOwner = true, 0);
        }
      }
      if (this.selectedPrimaryOwnerItem === null || this.selectedPrimaryOwnerItem === undefined) {
        this.isPrimaryOwnerValid=false;
      }
      else if(this.selectedPrimaryOwnerItem.length==0){
        this.isPrimaryOwnerValid=false;
      }
      else{
        this.isPrimaryOwnerValid=true;
      }
    });

  }


}
