/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Satya Prakash Gupta
 @When: 21-May-2021
 @Why: EWM-1449 EWM-1583
 @What: quick job Section
 */
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { QuickJobService } from '../../services/quickJob/quickJob.service';
import { IquickJob, IjobDetails, Isalary, IjobDescription, IjobAdvance, IjobBoards, IOwner } from './IquickJob';
import { JobDescriptionPopupEditorComponent } from './job-description-popup-editor/job-description-popup-editor.component';
import { MatInput } from '@angular/material/input';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, I, SPACE, TAB } from '@angular/cdk/keycodes';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { customDropdownConfig } from '../../datamodels/common.model';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { Observable, Subject } from 'rxjs';
import { GroupSkillConfirmationPopupComponent } from './group-skill-confirmation-popup/group-skill-confirmation-popup.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { PublishJobValidationComponent } from './publish-job-validation/publish-job-validation.component';
import { ManageAccessComponent } from 'src/app/modules/EWM-Candidate/candidate-document/manage-access/manage-access.component';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { ResponceData, ButtonTypes, BroadbeanPosting } from 'src/app/shared/models';
import { JobService } from '../../services/Job/job.service';
import { PopupIntegrationCategoryComponent } from './popup-integration-category/popup-integration-category.component';
import { MapApplicationInfoComponent } from './map-application-info/map-application-info.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ConfigureJobFieldsComponent } from './configure-job-fields/configure-job-fields.component';
import { delay } from 'rxjs/operators';
import { BroadbeanService } from '../../services/broadbean/broadbean.service';
import { QuickJobLocationComponent } from './quick-job-location/quick-job-location.component';
import { statusMaster } from '../../datamodels/status-master';
import { CustomValidatorService } from '../../../../../shared/services/custome-validator/custom-validator.service';
import { ClientService } from '../../services/client/client.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { CommonDropDownService } from '../../services/common-dropdown-service/common-dropdown.service';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
@Component({
  providers: [MessageService],
  selector: 'app-quickjob',
  templateUrl: './quickjob.component.html',
  styleUrls: ['./quickjob.component.scss'],

})
export class QuickjobComponent implements OnInit {

  panelOpenState = false;
  submitted = false;
  loading: boolean;
  // ^[0.01-9]+$
  quickJobForm: FormGroup;
  public specialcharPatternZip = "[A-Za-z0-9. ]+$";
  public specialcharPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,4}(?:\.\d{1,2})?)$/);
  public onlyNumberPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,1000}?)$/);
  public DecimalPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,1000}(?:\.\d{1,2})?)$/);
  //Who:Ankit Rawat, What:EWM-16596 Add number validation pattern for Head Count, When:04Apr24
  public headCountPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,10000}?)$/);

  clientList: any[] = [];
  companyList: any[] = [];
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

  brandList: [] = [];
  ownerList: [] = [];
  companyContactsList: any = [];

  datePublish = new Date();
  DescriptionValue: any = ` `;
  isChecked;
  isDropdown: boolean = false;
  selectedSubIndustryIdValue: any;
  selectedSubExpertiseIdValue: any;

  @ViewChild('title') title: MatInput;


  titleData: any;
  ClientNameData: any;
  ClientIdData: any;

  client: any;
  pageNumber: any = 1;
  pageSize: any = 500;
  listGroupData: [] = [];
  dirctionalLang;
  defaultCurrencyString = "quickjob_salaryBand";

  public dropDownCategoryConfig: customDropdownConfig[] = [];
  public selectedCategory: any = {};

  resetFormSubjectSubCategory: Subject<any> = new Subject<any>();
  public dropDownSubCategoryConfig: customDropdownConfig[] = [];
  public selectedSubCategory: any = {};

  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = [];

  resetFormSubjectSubIndustry: Subject<any> = new Subject<any>();
  public dropDownSubIndustryConfig: customDropdownConfig[] = [];
  public selectedSubIndustry: any = [];

  public dropDownExperienceConfig: customDropdownConfig[] = [];
  public selectedExperience: any = null;//@Who: priti ;@When: 10-Nov-2021; @Why: EWM-3620;@what:pull null value to trigger required validator

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

  public dropDownStateConfig: customDropdownConfig[] = [];
  public selectedState: any = {};
  resetFormSubjectState: Subject<any> = new Subject<any>();

  public dropDownSalaryBandNameConfig: customDropdownConfig[] = [];
  public selectedSalaryBandName: any = {};

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
  public ownerpatch: any;
  currentSearchValue: any;
  skillCount: any;
  public primaryTxtColor: string;
  uploadColorCodePreview: any;
  jobRankcolorCode: any;
  dateToday = new Date(new Date().setDate(new Date().getDate()));
  baseUrl: string;
  public isMapAppToggled;
  qulificationList: [] = [];
  public defaultColorValue = "#ffffff";
  jobID: any;
  animationVar: any;
  public applicationDefault: any = {};
  public applicationList: any;
  selectedCurrencyValue: number;
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
  //IndustryId: any;
  SubIndustryId: any;
  ExpertiseId: any;
  SubExpertiseId: any;
  QualificationId: any;
  skillFinalData: any = [];
  selectedIndustryList: any = [];
  selectedSubIndustryList: any = [];
  selectedQualificationList: any = [];
  selectedExpertiesList: any = [];
  selectedSubExpertiesList: any = [];
  contactList: any[];
  companyContactsPatch: any;
  SkillTag = new FormControl();
  public dropDownSkillTagsConfig: customDropdownConfig[] = [];
  public selectedSkillTags: any = {};
  public SkillTags: any[] = [];
  skillSelectedListId: any[] = [];
  maxMoreLength: any = 7;
  search = new FormControl();

  resetFormSubjectrReason: Subject<any> = new Subject<any>();
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public selectedReason: any = {};
  resetFormselectedReason: Subject<any> = new Subject<any>();
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;
  public isDisabled = false;
  JobID: any;
  jobFieldPermissiondata = [];
  public selectedDataPopup: any;
  private _mobileQueryListener: () => void;
  type: string;
  clientIdData: any;
  StatusDataId: never[];
  jobStatusActiveKey: string;
  /*--@Who:Nitin Bhati,@When:3th March 2023,@Why:EWM-11009,@What:declare variable--*/
  JobTitle: boolean = false;
  ClientName: boolean = false;
  Location: boolean = false;
  JobCategory: boolean = false;
  JobSubCategory: boolean = false;
  Industry: boolean = false;
  SubIndustry: boolean = false;
  Qualification: boolean = false;
  Skills: boolean = false;
  JobType: boolean = false;
  JobSubType: boolean = false;
  Experience: boolean = false;
  FunctionalExpertise: boolean = false;
  FunctionalSubExpertise: boolean = false;
  Currency: boolean = false;
  SalaryUnit: boolean = false;
  SalaryBand: boolean = false;
  HideSalary: boolean = false;
  Bonus: boolean = false;
  Equity: boolean = false;
  JobDescription: boolean = false;
  InternalNotes: boolean = false;
  Tags: boolean = false;
  JobRank: boolean = false;
  HeadCount: boolean = false;
  FilledDate: boolean = false;
  OpenDate: boolean = false;
  JobExpiryDays: boolean = false;
  Owners: boolean = false;
  CompanyContacts: boolean = false;
  Brands: boolean = false;
  Project: boolean = false;
  JobWorkflow: boolean = false;
  MapApplicationForm: boolean = false;
  Access: boolean = false;
  Status: boolean = false;
  public addressData: any;
  CountryId: number=0;
  CountryIdValue: number=0;
  clientJobDataByJobId: any=[];
  messageCount: string;
  @HostListener("window:resize", ['$event'])
  private onResize(event) {

    /*-@Why: screen media, @When: 22-08-2023, @Who: Maneesh--*/
    this.currentMenuWidth = event.target.innerWidth;
    this.screenMediaQuiryForSkills();
    this.screenMediaQuiryForOwnerContact()
  }
// color picker varibale
showColorPallateContainer = false;
color: any = '#2883e9'
selctedColor = '#FFFFFF';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
isOpen = false;
isMoreColorClicked!: boolean;
dateFormat:any;
// color picker End
getDateFormat:any;
ClientFullName:string;
public maxMoreLengthForOwnerContacts:number=4;
public currentMenuWidth: number;
ClientLocationAddress:any=[];

common_DropdownC_Config:DRP_CONFIG;
public selectedClientUser: any = {};
common_DropdownCurrency_Config:DRP_CONFIG;
public selectedCurrency: any = {};
pageNameDRPObj = {
  pageName: 'jobManage',
  mode: 'add'
}
  //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
  public workFlowDropdownConfig: DRP_CONFIG;
  public maxMoreLengthForWorkFlow: number = 5;


  //Who:Ankit Rawat, Primary job owner changes: variable Initialization, Why: EWM-17356, When:27Jun2024
  public selectedOwnerItem: any = [];
  public ddlOwnerConfig: DRP_CONFIG;
  public maxMoreLengthForOwner: number = 5;

  public selectedPrimaryOwnerItem: any = [];
  public ddlPrimaryOwnerConfig: DRP_CONFIG;
  public maxMoreLengthForPrimaryOwner: number = 5;

  public isPrimaryOwnerValid: boolean=false;
  public showPrimaryOwner: boolean = true;
  public showOwner: boolean=true;
  /* 
   @Type: File, <ts>s
   @Name: constructor function
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: constructor for injecting services and formbuilder and other dependency injections
   */
  constructor(private fb: FormBuilder,private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router,
    private serviceListClass: ServiceListClass, private commonServiesService: CommonServiesService,
    private commonserviceService: CommonserviceService, private quickJobService: QuickJobService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, public dialogRef: MatDialogRef<QuickjobComponent>,
    private jobWorkflowService: JobService, media: MediaMatcher, changeDetectorRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any,
    private _BroadbeanService: BroadbeanService,private _clientService: ClientService,private dataService: CommonDropDownService) {
    this.jobID = this.appSettingsService.jobID
    this.jobStatusActiveKey = this.appSettingsService.JobStatusActiveKey;

    //////Job  Category//////////////
    this.dropDownCategoryConfig['IsDisabled'] = false;
    this.dropDownCategoryConfig['apiEndPoint'] = this.serviceListClass.getJobCategoryAll + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownCategoryConfig['placeholder'] = 'quickjob_jobCategory';
    this.dropDownCategoryConfig['IsManage'] = '/client/core/administrators/job-category';
    this.dropDownCategoryConfig['IsRequired'] = false;
    this.dropDownCategoryConfig['searchEnable'] = true;
    this.dropDownCategoryConfig['bindLabel'] = 'JobCategory';
    this.dropDownCategoryConfig['multiple'] = false;

    //////Job Sub Category//////////////
    this.dropDownSubCategoryConfig['IsDisabled'] = false;
    //  this.dropDownSubCategoryConfig['apiEndPoint'] = this.serviceListClass.getSubJobCategoryAll;
    // this.dropDownSubCategoryConfig['apiEndPoint'] = this.serviceListClass.getSubJobCategoryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';

    this.dropDownSubCategoryConfig['placeholder'] = 'quickjob_jobSubCategory';
    this.dropDownSubCategoryConfig['IsManage'] = '/client/core/administrators/job-category';
    this.dropDownSubCategoryConfig['IsRequired'] = false;
    this.dropDownSubCategoryConfig['searchEnable'] = true;
    this.dropDownSubCategoryConfig['bindLabel'] = 'JobSubCategory';
    this.dropDownSubCategoryConfig['multiple'] = true;


    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll + '?ByPassPaging=true' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;

    //////Sub Industry//////////////
    this.dropDownSubIndustryConfig['IsDisabled'] = false;
    //  this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + IndustryId ;
    this.dropDownSubIndustryConfig['placeholder'] = 'quickjob_subIndustry';
    this.dropDownSubIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownSubIndustryConfig['IsRequired'] = false;
    this.dropDownSubIndustryConfig['searchEnable'] = true;
    this.dropDownSubIndustryConfig['bindLabel'] = 'Description';
    this.dropDownSubIndustryConfig['multiple'] = true;

    //////////Experience//////////
    this.dropDownExperienceConfig['IsDisabled'] = false;
    this.dropDownExperienceConfig['apiEndPoint'] = this.serviceListClass.experienceAllListData + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownExperienceConfig['placeholder'] = 'quickjob_experience';
    this.dropDownExperienceConfig['IsManage'] = '/client/core/administrators/experience-type';
    this.dropDownExperienceConfig['IsRequired'] = false;
    this.dropDownExperienceConfig['searchEnable'] = true;
    this.dropDownExperienceConfig['bindLabel'] = 'Name';
    this.dropDownExperienceConfig['multiple'] = false;

    //////Qualification//////////////
    // who:maneesh,what: add by passing true ,when:13/06/2023
    //--@Nitin Bhtai,@EWM-13251,@when:31-07-2023, Handle countryList API Callingfrom custom drop
    this.dropDownQualificationConfig['IsDisabled'] = false;
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?ByPassPaging=true' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownQualificationConfig['placeholder'] = 'quickjob_qualification';
    this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
    this.dropDownQualificationConfig['IsRequired'] = false;
    this.dropDownQualificationConfig['searchEnable'] = true;
    this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
    this.dropDownQualificationConfig['multiple'] = true;

    //////Job Type//////////////
    this.dropDownJobTypeConfig['IsDisabled'] = false;
    this.dropDownJobTypeConfig['apiEndPoint'] = this.serviceListClass.getJobTypeList + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownJobTypeConfig['placeholder'] = 'quickjob_jobType';
    this.dropDownJobTypeConfig['IsManage'] = '/client/core/administrators/job-type';
    this.dropDownJobTypeConfig['IsRequired'] = true;
    this.dropDownJobTypeConfig['searchEnable'] = true;
    this.dropDownJobTypeConfig['bindLabel'] = 'JobType';
    this.dropDownJobTypeConfig['multiple'] = false;

    //////Job Sub Type//////////////
    this.dropDownJobSubTypeConfig['IsDisabled'] = false;
    // this.dropDownJobSubTypeConfig['apiEndPoint'] = this.serviceListClass.getAllJobSubTypeList;
    this.dropDownJobSubTypeConfig['placeholder'] = 'quickjob_jobSubType';
    this.dropDownJobSubTypeConfig['IsManage'] = '/client/core/administrators/job-type';
    this.dropDownJobSubTypeConfig['IsRequired'] = false;
    this.dropDownJobSubTypeConfig['searchEnable'] = true;
    this.dropDownJobSubTypeConfig['bindLabel'] = 'JobSubType';
    this.dropDownJobSubTypeConfig['multiple'] = false;

    ////// Experties//////////////
    this.dropDownExpertiesConfig['IsDisabled'] = false;
    this.dropDownExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalExpertise + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownExpertiesConfig['placeholder'] = 'quickjob_functionalExpertise';
    this.dropDownExpertiesConfig['IsManage'] = '/client/core/administrators/functional-experties';
    this.dropDownExpertiesConfig['IsRequired'] = false;
    this.dropDownExpertiesConfig['searchEnable'] = true;
    this.dropDownExpertiesConfig['bindLabel'] = 'FunctionalExpertise';
    this.dropDownExpertiesConfig['multiple'] = true;

    //////Sub Experties//////////////
    this.dropDownSubExpertiesConfig['IsDisabled'] = false;
    //  this.dropDownSubExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiseId;
    this.dropDownSubExpertiesConfig['placeholder'] = 'quickjob_functionalSubExpertise';
    this.dropDownSubExpertiesConfig['IsManage'] = '/client/core/administrators/functional-experties';
    this.dropDownSubExpertiesConfig['IsRequired'] = false;

    this.dropDownSubExpertiesConfig['searchEnable'] = true;
    this.dropDownSubExpertiesConfig['bindLabel'] = 'FunctionalSubExpertise';
    this.dropDownSubExpertiesConfig['multiple'] = true;

    //////Job Work Flow//////////////
    /*this.dropDownJobWorkflowConfig['IsDisabled'] = false;
    this.dropDownJobWorkflowConfig['apiEndPoint'] = this.serviceListClass.jobWorkFlowList +
      "?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&PageNumber=1&PageSize=500&orderBy=WorkflowName,asc";
    this.dropDownJobWorkflowConfig['placeholder'] = 'quickjob_jobWorkflow';
    this.dropDownJobWorkflowConfig['IsManage'] = '/client/core/administrators/job-workflows;can=job';
    this.dropDownJobWorkflowConfig['IsRequired'] = true;
    this.dropDownJobWorkflowConfig['searchEnable'] = true;
    this.dropDownJobWorkflowConfig['bindLabel'] = 'WorkflowName';
    this.dropDownJobWorkflowConfig['multiple'] = false;*/

    //Who:Ankit Rawat, Replace workflow control with new dropdown, When:05Apr2024
      this.dropdownConfigWorkflow();
      this.currentMenuWidth = window.innerWidth;
      this.screenMediaQuiryForWorkflow();

    //////Job Status//////////////
    this.dropDownJobStatusConfig['IsDisabled'] = false;
    this.dropDownJobStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + "?GroupId=" + this.jobID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownJobStatusConfig['placeholder'] = 'quickjob_status';
    this.dropDownJobStatusConfig['IsManage'] = '/client/core/administrators/group-master';
    this.dropDownJobStatusConfig['IsRequired'] = true;
    this.dropDownJobStatusConfig['searchEnable'] = true;
    this.dropDownJobStatusConfig['bindLabel'] = 'Code';
    this.dropDownJobStatusConfig['multiple'] = false;
    this.dropDownJobStatusConfig['isClearable'] = false;

    // 3rd
    //////Salary Unit//////////////
    this.dropDownSalaryUnitConfig['IsDisabled'] = false;
    this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownSalaryUnitConfig['placeholder'] = 'quickjob_salaryUnit';
    this.dropDownSalaryUnitConfig['IsManage'] = '/client/core/administrators/salaryunit';
    this.dropDownSalaryUnitConfig['IsRequired'] = false;
    this.dropDownSalaryUnitConfig['searchEnable'] = true;
    this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
    this.dropDownSalaryUnitConfig['multiple'] = false;

    ////Salary Band//////////////
    // this.dropDownSalaryBandConfig['IsDisabled'] = false;
    // this.dropDownSalaryBandConfig['apiEndPoint'] = this.serviceListClass.salaryBandList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    // this.dropDownSalaryBandConfig['placeholder'] = 'quickjob_salaryBand';
    // this.dropDownSalaryBandConfig['IsManage'] = '/client/core/administrators/salary-band';
    // this.dropDownSalaryBandConfig['IsRequired'] = false;
    // this.dropDownSalaryBandConfig['searchEnable'] = true;
    // this.dropDownSalaryBandConfig['bindLabel'] = 'SalaryRange';
    // this.dropDownSalaryBandConfig['multiple'] = false;

    ////Salary Band Name//////////////
    this.dropDownSalaryBandNameConfig['IsDisabled'] = false;
    this.dropDownSalaryBandNameConfig['apiEndPoint'] = this.serviceListClass.salaryBandList + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownSalaryBandNameConfig['placeholder'] = 'quickjob_salaryBand';
    this.dropDownSalaryBandNameConfig['IsManage'] = '/client/core/administrators/salary-band';
    this.dropDownSalaryBandNameConfig['IsRequired'] = false;
    this.dropDownSalaryBandNameConfig['searchEnable'] = true;
    this.dropDownSalaryBandNameConfig['bindLabel'] = ['SalaryBandName', 'SalaryRange'];
    this.dropDownSalaryBandNameConfig['multiple'] = false;

    //  4th
    //////////Tag//////////
    this.dropDownTagConfig['IsDisabled'] = false;
    this.dropDownTagConfig['apiEndPoint'] = this.serviceListClass.tagList + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownTagConfig['placeholder'] = 'quickjob_tags';
    this.dropDownTagConfig['IsManage'] = '/client/core/administrators/tag';
    this.dropDownTagConfig['IsRequired'] = false;
    this.dropDownTagConfig['searchEnable'] = true;
    this.dropDownTagConfig['bindLabel'] = 'Name';
    this.dropDownTagConfig['multiple'] = true;


    // 5th
    //////Brands//////////////
    this.dropDownBrandsConfig['IsDisabled'] = false;
    this.dropDownBrandsConfig['apiEndPoint'] = this.serviceListClass.getBrandAllList + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownBrandsConfig['placeholder'] = 'quickjob_brands';
    this.dropDownBrandsConfig['IsManage'] = '/client/core/administrators/brands';
    this.dropDownBrandsConfig['IsRequired'] = false;
    this.dropDownBrandsConfig['searchEnable'] = true;
    this.dropDownBrandsConfig['bindLabel'] = 'Brand';
    this.dropDownBrandsConfig['multiple'] = false;

    // 6th
    //////Manage Access//////////////
    this.dropDownManageAccessConfig['IsDisabled'] = false;
    this.dropDownManageAccessConfig['apiEndPoint'] = this.serviceListClass.userGrpList;
    this.dropDownManageAccessConfig['placeholder'] = 'quickjob_ManageAccess';
    this.dropDownManageAccessConfig['IsManage'] = '/client/core/user-management/user-group';
    this.dropDownManageAccessConfig['IsRequired'] = false;
    this.dropDownManageAccessConfig['searchEnable'] = true;
    this.dropDownManageAccessConfig['bindLabel'] = 'Name';
    this.dropDownManageAccessConfig['multiple'] = false;

    // 7th
    //////Map Application form//////////////
    this.dropDownMapApplicationConfig['IsDisabled'] = false;
    this.dropDownMapApplicationConfig['apiEndPoint'] = this.serviceListClass.getApplicationFormAll + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownMapApplicationConfig['placeholder'] = 'label_SearchApplicationForm';
    this.dropDownMapApplicationConfig['IsManage'] = '/client/core/administrators/application-form';
    this.dropDownMapApplicationConfig['IsRequired'] = false;
    this.dropDownMapApplicationConfig['searchEnable'] = true;
    this.dropDownMapApplicationConfig['bindLabel'] = 'Name';
    this.dropDownMapApplicationConfig['multiple'] = false;

    ////// State //////////////
    this.dropDownStateConfig['IsDisabled'] = false;
    // this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll+'?ByPassPaging=true' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStateConfig['placeholder'] = 'label_state';
    this.dropDownStateConfig['IsManage'] = '/client/core/administrators/states';
    this.dropDownStateConfig['IsRequired'] = false;
    this.dropDownStateConfig['searchEnable'] = true;
    this.dropDownStateConfig['bindLabel'] = 'StateName';
    this.dropDownStateConfig['multiple'] = false;

    ////// Reason Added Adarsh singh for EWM-9369//////////////
    this.dropDownReasonConfig['IsDisabled'] = false;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_reasonMaster';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId='+this.jobID; //@suika @whn 27-03-2023
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;

    //////SkillTags //////////////
    this.dropDownSkillTagsConfig['IsDisabled'] = false;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillsTagList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = true;
    this.dropDownSkillTagsConfig['IsRequired'] = false;
    this.dropDownSkillTagsConfig['searchEnable'] = false;
    this.dropDownSkillTagsConfig['bindLabel'] = 'GroupName';
    this.dropDownSkillTagsConfig['multiple'] = true;

    if (data?.type === 'patch') {
      this.patchValueByTemplateData();
    }


    this.quickJobForm = this.fb.group({
      /////GENRAL First Pannel////////
      //  @Who: maneesh, @When: 09-jan-2023,@Why: EWM-10155 addnoWhitespaceValidator
      Title: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator()]],
      ClientId: [],
      Address1: ['', [Validators.maxLength(200)]],
      Address2: ['', [Validators.maxLength(200)]],
      Country: [],
      CountryName: [],
      StateId: [],
      StateName: [''],
      City: ['', [Validators.maxLength(80)]],
      District_Suburb:[],
      ZipCode: ['', [Validators.maxLength(10), Validators.pattern(this.specialcharPatternZip)]],
      /////Job Details Second Pannel////////
      JobCategoryId: [],
      JobSubCategoryId: [],
      IndustryId: [],
      IndustryName: [],
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
      workflowName:[''],

      /////Salary Third Pannel////////
      CurrencyId: [0],
      SalaryUnitId: [0],
      SalaryBandId: [0],
      SalaryBandName : [],
      Bonus: [0, [Validators.maxLength(10), Validators.pattern(this.onlyNumberPattern)]],
      Equity: [0, [Validators.maxLength(10), Validators.pattern(this.onlyNumberPattern)]],
      CurrencyName: [],
      CurrencySymbol: [],
      SalaryUnitName: [],
      HideSalary: [false],


      /////Description fourth Pannel////////
      DescriptionDetails: [''],
      InternalNotes: ['', [Validators.maxLength(1000)]], /*-@When:17-10-2023,@who:Nitin Bhati,@why:EWM-14819-*/
      JobTagId: [],

      /////Advanced 5th Pannel////////
      //Who:Ankit Rawat, What:EWM-16596  Default set head count 1, When:04Apr24
      HeadCount: [1, [Validators.pattern(this.headCountPattern)]],
      // @When: 14-03-2023 @who:maneesh singh @why: EWM-11177 add CustomValidatorService
      OpenDate: ['',[Validators.required, CustomValidatorService.dateValidator]],
      // @When: 14-03-2023 @who:maneesh singh @why: EWM-11177 add  CustomValidatorService
      FillDate: [null,[CustomValidatorService.dateValidator]], /*-@When:05-10-2023,@Why:EWM-14577,@who: Nitin Bhati-*/

      //OwnerId: [, [Validators.required]],
      Contact: [],
      JobRank: [0, [Validators.pattern(this.specialcharPattern)]],/*-@When:05-10-2023,@Why:EWM-14577,@who: Nitin Bhati-*/
      HideCompany: [true],
      BrandId: [],
      ProjectId: [],
      AccessName: ['', [Validators.required]],
      AccessId: [],
      //Who:Ankit Rawat, Why: EWM-14648 Added default white color on page load, When:25Apr2024 
      ColorCode: ['#ffffff'],
      ReasonId: [0],
      ReasonName: [''],

      /////Job Board 6th Pannel////////
      IsDisable: [false],
      KnockOut: [true],
      ManageAccessId: [0],
      // who:maneesh,what:ewm-11177 when:14/03/2023
      PublishDate: [, [Validators.required, CustomValidatorService.dateValidator]],
      MapApplicationFormBtn: [false],
      ApplicationFormId: [null],
      ApplicationFormName: [''],
      /*----@who: Nitin Bhati,@Date:06-march-2023,@why: EWM-11009,@What: for create form control for address----*/
      address: this.fb.group({
        'AddressLinkToMap': ['', [Validators.maxLength(250)]],
      })

    });
   /*---@Who:Nitin Bhati,@When: 13-04-2023, @Why: EWM-11883 ,What:wrong Job id calling---*/
    //this.JobID = this.appSettingsService.candidateID;
    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiryForSkills();
    };
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    //Who:Ankit Rawat, What:EWM-16596 Default workflow selected for add new job only, When:05Apr24
    this.setDefaultWorkflow();
    //  this.client = this.textChangeLngService.getData('singular');
      /*----@who: maneesh,@Date:11-march-2023,@why: EWM-11121,@What: for color picker----*/
    this.dropdownConfig();
    this.bindConfigOwner();
    this.bindConfigPrimaryOwner();
    this.getColorCodeAll()
    this.getJobConfigureFieldPermission();
    //this.getClientAllDetailsList();
    this.getCurrencyAll();
    this.getAllOwnerAndCompanyContacts();
    //this.getActiveStatus()
    //this.getSkillsAll();
    //this.onsearchSkills(this.searchValue);
    this.OrganizationName = localStorage.getItem('OrganizationName');
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let ownerId: string = currentUser?.UserId;
    this.ownerpatch = [ownerId];
    //Who:Ankit Rawat, Primary job owner: select current user from local storage, Why: EWM-17356, When:27Jun2024
    let userName=currentUser?.FirstName + (currentUser?.LastName ? ' ' + currentUser.LastName : '')
    this.selectedPrimaryOwnerItem={UserId:ownerId, UserName: userName};
    if(this.selectedPrimaryOwnerItem?.UserId){
      this.isPrimaryOwnerValid=true;
    }

    this.baseUrl = 'https://' + window.location.host + '/client/jobs/job/job-detail/detail?jobId=';
    this.animationVar = ButtonTypes;
    this.tagSkillsList();
    this.quickJobForm.patchValue({
      'AccessName': 'Public',
      'AccessId': 2
    });
    this.oldPatchValues = { 'AccessId': 2, 'GrantAccesList': '' }

    //@suika@EWM-10681 EWM-10813  @02-03-2023 to set default values for status in job
  this.selectedJobStatus =  {Id:this.jobStatusActiveKey};
  this.onJobStatuschange(this.selectedJobStatus);
   /* @Who: Nitin Bhati,@When: 06-March-2023,@Why: EWM-11009,@What: For patch publish date value*/
   this.quickJobForm.controls['PublishDate'].setValue(this.datePublish);
  // <!---------@When: 24-03-2023 @who:bantee @why: EWM-11177 --------->

  this.dateFormat = localStorage.getItem('DateFormat');
  this.currentMenuWidth = window.innerWidth;
  this.screenMediaQuiryForOwnerContact()

  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //  this.title.focus();
    // }, 1000);
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
  @Name: JobTitleduplicayCheck function
  @Who: Anup
  @When: 2-july-2021
  @Why: EWM-1749 EWM-1900
  @What: For checking duplicacy for job Title
 */
  JobTitleduplicayCheck() {
    this.titleData = this.quickJobForm.get('Title').value;
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
            this.quickJobForm.get('Title').setValidators([Validators.required, Validators.maxLength(100), this.noWhitespaceValidator()]);

          }
        }
        else {
          this.quickJobForm.get("Title").clearValidators();
          this.quickJobForm.get("Title").markAsPristine();
          this.quickJobForm.get('Title').setValidators([Validators.required, Validators.maxLength(100), this.noWhitespaceValidator()]);
        }

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
 @Type: File, <ts>
 @Name: getCompanyAllDetailsList function
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
          // this.selectedCurrencyValue
          this.selectedCurrencyValue = Number(repsonsedata['Data']['SalaryBandId']);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

  getCompanyDetailsList() {
    let jsonObj = {};
    jsonObj['GridId'] = 'ClientContacts_grid_001';
    jsonObj['ClientId'] = this.ClientIdData;
    jsonObj['ByPassPaging'] = true;
    if(this.ClientIdData==null || this.ClientIdData=='0'|| this.ClientIdData=='undefined' ){
      return;
    }
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
    let ClientAddress=null;
    this.clientAddressList = [];
    this.hideLocation = false;
    this.quickJobForm.get('Address1').reset();
    this.quickJobForm.get('Address2').reset();
    this.selectedValue = [];
    this.quickJobForm.get('StateId').reset();
    this.quickJobForm.get('City').reset();
    this.quickJobForm.get('ZipCode').reset();
    this.quickJobForm.get('ZipCode').reset();
    this.quickJobForm['controls'].address['controls'].AddressLinkToMap.reset();

    if (clientData == null || clientData=='undefined' || clientData.length =='0') {
      this.ClientNameData = ""
      return;
    } else {
      this.ClientNameData = clientData?.ClientName;
    }
    this.selectedClientUser=clientData;
    this.ClientIdData = clientData?.ClientId;
    this.getCompanyDetailsList();
    //ClientAddress = this.clientList?.filter((e: any) => e?.ClientId === clientData?.ClientId);
    /*----@who: Nitin Bhati,@Date:06-march-2023,@why: EWM-11009----*/
    this.addressData=clientData?.ClientLocations;
    if(clientData?.ClientLocations[0]?.ZipCode!=null || clientData?.ClientLocations[0]?.ZipCode!=undefined){
      this.addressData?.forEach((element:any) => {
        element['PostalCode'] = clientData?.ClientLocations[0]?.ZipCode;
        element['District_Suburb'] = clientData?.ClientLocations[0]?.District;
      });
    }
    this.quickJobForm.patchValue({
      District_Suburb: clientData?.ClientLocations[0]?.District
    })
    this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(clientData?.ClientLocations[0]?.AddressLinkToMap);
    this.clientAddressList = clientData?.ClientLocations[0];
    this.ClientFullName=clientData?.ClientName;
    this.AddressLinkToMap = clientData?.ClientLocations[0]?.AddressLinkToMap;
    this.Latitude = clientData?.ClientLocations[0]?.Latitude;
    this.Longitude = clientData?.ClientLocations[0]?.Longitude;
    this.onclickLocationPatchAddressField();
    if (this.clientAddressList?.LocationName != "") {
      this.hideLocation = true;
    }

  }

  onclickLocationPatchAddressField() {
    this.selectedValue = { 'Id': Number(this.clientAddressList?.CountryId) };
    this.selectedState = { 'Id': Number(this.clientAddressList?.StateId), 'StateName': this.clientAddressList?.StateName };
    this.onStateChange(this.selectedState);
    let stateid;
    if (this.clientAddressList?.StateId == 0) {
      stateid = null;
    } else {
      stateid = this.clientAddressList?.StateId;
    }
    this.quickJobForm.patchValue({
      Address1: this.clientAddressList?.AddressLine1,
      Address2: this.clientAddressList?.AddressLine2,
      StateId: stateid,
      City: this.clientAddressList?.TownCity,
      ZipCode: this.clientAddressList?.ZipCode,
    });
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
    this.stateList = []
    this.StateIdData = null;
    this.quickJobService.getAllStateByCountryId(CountryId).subscribe(
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
    @Name: onDismiss
    @Who: Satya Prakash Gupta
    @When: 16-june-2021
    @Why: EWM-1749 EWM-1897
    @What: Function will call when user close the popup.
  */
  onDismiss(): void {
    document.getElementsByClassName("add_Quickjob")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("add_Quickjob")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }
  /////Job Details Second Pannel////////
  //////Category
  /*
 @Type: File, <ts>
 @Name: onCategorychange function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get category List
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
      this.dropDownSubCategoryConfig['apiEndPoint'] = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + this.selectedCategory.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubCategory.next(this.dropDownSubCategoryConfig);

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



  /////industry
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
      this.selectedQualification = null
      this.quickJobForm.patchValue(
        {
          IndustryId: null,
          SubIndustryId: null,
          QualificationId: null,
        })
      // this.quickJobForm.get("IndustryId").setErrors({ required: true });
      // this.quickJobForm.get("IndustryId").markAsTouched();
      // this.quickJobForm.get("IndustryId").markAsDirty();
    }
    else {
      this.quickJobForm.get("IndustryId").clearValidators();
      this.quickJobForm.get("IndustryId").markAsPristine();
      this.selectedIndustry = data;
      //console.log("industry:",this.selectedIndustry);
      const industryId = data.map((item: any) => {
        return item.Id
      });
      // this.quickJobForm.patchValue(
      //   {
      //     IndustryId: data[0].Id,
      //     IndustryName:data[0].Description

      //   }
      // )
      // this.IndustryId= data[0].Id;
      // this.IndustryName= data[0].Description;
      //////Sub Industry//////////////
      this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
      //////Qualification//////////////
      this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?IndustryId=' + industryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';;
      this.resetFormSubjectQualification.next(this.dropDownQualificationConfig);
    }
   // this.clickIndustryGetSubIndustry();
    if (data == null) {
      this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectQualification.next(this.dropDownQualificationConfig);
    }
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
      this.cancelIndustryUpdateSubIndustry(data);
      const subIndustryId = data.map((item: any) => {
        return item.Id
      });
      this.quickJobForm.patchValue(
        {
          SubIndustryId: subIndustryId
        }
      )
      // this.SubIndustryId=data[0].Id;
      // this.SubIndustryName=data[0].Description;

    }
  }

  clickIndustryGetSubIndustry() {
    let Id = this.quickJobForm.get('IndustryId').value;
    let id = Id;
    // if (Id.length == 0) {
    //   this.quickJobForm.get('SubIndustryId').reset();
    //   this.subIndustryList = [];
    // }
    this.quickJobService.getSubIndustryAll(id).subscribe(
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
      this.dropDownJobSubTypeConfig['apiEndPoint'] = this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + this.selectedJobType.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';;
      this.resetFormSubject.next(this.dropDownJobSubTypeConfig);
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
      // this.ExpertiseId=data[0].Id;
      // this.ExpertiseName=data[0].FunctionalExpertise;
      //////Sub Industry//////////////
      this.dropDownSubExpertiesConfig['apiEndPoint'] = this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiesId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubExperties.next(this.dropDownSubExpertiesConfig);

    }
    this.clickExpertiseGetSubExpertise();
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
      this.SubExpertiseId = data[0].Id;
      this.SubExpertiseName = data[0].FunctionalSubExpertise;
    }
  }

  clickExpertiseGetSubExpertise() {
    let Id = this.quickJobForm.get('ExpertiseId').value;
    let id = Id
    if (Id.length == 0) {
      this.quickJobForm.get('SubExpertiseId').reset();
      this.subExpertiseList = [];
    }
    this.quickJobService.fetchfunctionalSubExpertiseList(id).subscribe(
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
          WorkFlowId: data.Id,
          workflowName: data.WorkflowName
        }
      )
    }
  }
/*
@Type: File, <ts>
@Name: onJobStatuschange function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get Status List
*/
  onJobStatuschange(data) {
    if (data == null || data == "") {
      this.selectedJobStatus = null;
      this.quickJobForm.patchValue(
        {
          StatusId: null
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
//<!-- @Who: bantee ,@When: 14-april-2023, @Why: EWM-11888 ,What: on change of status field previous reason must get empty-->
      this.quickJobForm.patchValue(
        {
          StatusId: data.Id,
          StatusName: data.Description,
          StatusColorCode: data.ColorCode,
          ReasonId: 0,
          ReasonName: ''
        }
      )
      this.selectedReason={};
    }
    //////Job Sub Type//////////////
    this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.jobID + '&statusId=' + this.selectedJobStatus.Id + '&GroupCode=JOB';
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
      // this.QualificationId=data[0].Id;
      // this.QualificationName=data[0].QualificationName;
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
    this.quickJobService.getCurrency('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo' + '&ByPassPaging=true').subscribe(
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
          SalaryUnitId: null,
          SalaryUnitName: null
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
      this.selectedCurrencyValue = null;
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
      this.selectedCurrencyValue = data;
      this.quickJobForm.patchValue(
        {
          SalaryBandId: data.Id,
          SalaryBandName:data.SalaryBandName
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
      this.selectedBrands = data;
      this.quickJobForm.patchValue(
        {
          BrandId: data.Id
        }
      )
      this.BrandName = data.Brand;
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
          BrandId: data.Id
        }
      )
      this.BrandName = data.Brand;
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
 const dialogRef = this.dialog.open(JobDescriptionPopupEditorComponent, {
      // maxWidth: "750px",
      // data: dialogData,
      data: { DescriptionData: this.DescriptionValue, },
      panelClass: ['xeople-modal-md', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(DescriptionData => {
      this.quickJobForm.patchValue({
        DescriptionDetails: DescriptionData
      });
      this.DescriptionValue = DescriptionData;

    });

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
  //     //console.dir(event);
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
    if (enable) {
       this.dropDownManageAccessConfig['IsDisabled'] = false;
      this.resetFormSubjectManage.next(this.dropDownManageAccessConfig);
    } else {
       this.dropDownManageAccessConfig['IsDisabled'] = true;
      this.resetFormSubjectManage.next(this.dropDownManageAccessConfig);
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
      if (this.selectedMapApplication == 0) {
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
      } else {
        this.isMapAppToggled = false;
        this.dropDownMapApplicationConfig['IsRequired'] = true;
        this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
      }
    }
    else {
      this.isMapAppToggled = false;
      this.dropDownMapApplicationConfig['IsRequired'] = false;
      this.resetFormSubjectMapApplication.next(this.dropDownMapApplicationConfig);
    }
  }

  onChangeMapApplicationToggle(e) {
    this.isChecked = e;
    if (e) {
      /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map application form quick job**************/
      this.applicationFormInfo();
      /**************@Who:renu @When: 27-0-2022 @Why:EWM-7875 EWM-8992 @What: Map application form quick job************/

    } else {
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
      this.loading = true; /*-@why:EWM-14577,@when:05-10-2023,@who:Nitin Bhati-*/
      if (this.quickJobForm.value.IsDisable == true && this.quickJobForm.value.FillDate!=null) {
        if (this.quickJobForm.value.PublishDate > this.quickJobForm.value.FillDate) {
          this.loading = false;
          const message = ``;
          const title = 'label_disabled';
          const subtitle = 'label_folderName';
          const dialogData = new ConfirmDialogModel(title, subtitle, message);
          const dialogRef = this.dialog.open(PublishJobValidationComponent, {
            data: new Object({ editId: 'Add' }),
            panelClass: ['xeople-modal', 'add_publishValidation', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          let dir: string;
          dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
          let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
          for (let i = 0; i < classList.length; i++) {
            classList[i].setAttribute('dir', this.dirctionalLang);
          }
          dialogRef.afterClosed().subscribe(res => {
            if (res == false) {
              document.getElementsByClassName("add_publishValidation")[0].classList.remove("animate__fadeInDownBig")
              document.getElementsByClassName("add_publishValidation")[0].classList.add("animate__fadeOutUpBig");
              setTimeout(() => { this.dialogRef.close(false); }, 200);
            } else {
              const message = ``;
              const title = 'label_disabled';
              const subtitle = 'label_folderName';
              const dialogData = new ConfirmDialogModel(title, subtitle, message);
              const dialogRef = this.dialog.open(PopupIntegrationCategoryComponent, {
                data: new Object({ editId: 'Add' }),
                panelClass: ['xeople-modal', 'add_Integrationcategory', 'animate__animated', 'animate__zoomIn'],
                disableClose: true,
              });
              let dir: string;
              dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
              let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
              for (let i = 0; i < classList.length; i++) {
                classList[i].setAttribute('dir', this.dirctionalLang);
              }
              dialogRef.afterClosed().subscribe(res => {
                if (res == true) {
                  this.onSave();
                  document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__fadeInDownBig")
                  document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__fadeOutUpBig");
                  setTimeout(() => { this.dialogRef.close(false); }, 200);
                } else {
                  document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__fadeInDownBig")
                  document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__fadeOutUpBig");
                  setTimeout(() => { this.dialogRef.close(false); }, 200);
                }
              })
            }
          })
        } else {
          this.onSave();
        }
      } else {
        this.onSave();
      }
    }
  }
  /*
    @Type: File, <ts>
    @Name: onSave function
    @Who: Nitin Bhati
    @When: 13-June-2021
    @Why: EWM-7019
    @What: For saving quick job data
   */
  onSave(): void {
    this.submitted = true;
    if (this.quickJobForm.valid) {
      this.loading = true;
      const quickJobRequest = JSON.stringify(this.createRequest())
      //Who:Ankit Rawat,Primary owner changes: Changed API version 2, Why: EWM-17356, When:26Jun2024
      this.quickJobService.createQuickJob_v2(quickJobRequest).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            let IsDisableStatus = repsonsedata.Data.JobBoards.IsDisable;
            let workflowId = repsonsedata.Data.JobAdvance.WorkFlowId;
            let JobId = repsonsedata.Data.JobId;
            let ReferenceId = repsonsedata.Data.ReferenceId;
            if (IsDisableStatus === 1) {
              this.loading = false;
              //<!-----@Adarsh singh @EWM-12361 @10-May-2023 @Desc- Calling extra api for getting all field while publish braodbean job----->
              this.getJobDetailsData(repsonsedata.Data?.JobId);
              this.route.navigate(['/client/jobs/job/job-publish-v1/publish', { jobId: JobId, jobRefId: ReferenceId, workId: workflowId, pub: 0 }]);
              document.getElementsByClassName("add_Quickjob")[0].classList.remove("animate__fadeInDownBig")
              document.getElementsByClassName("add_Quickjob")[0].classList.add("animate__fadeOutUpBig");
              setTimeout(() => { this.dialogRef.close(true); }, 200);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            } else {
              this.loading = false;
              document.getElementsByClassName("add_Quickjob")[0].classList.remove("animate__fadeInDownBig")
              document.getElementsByClassName("add_Quickjob")[0].classList.add("animate__fadeOutUpBig");
              setTimeout(() => { this.dialogRef.close(true); }, 200);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            }
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
    @Name: createRequest function
    @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
    @What: method for onConfirm method
   */
  public createRequest(): IquickJob {
    let requestData: IquickJob = {};
// who:maneesh,what:ewm-13530 for trim data when:25/07/2023
    requestData.Title = this.quickJobForm.value.Title?.trim();
    requestData.ClientId = this.ClientIdData;
    requestData.ClientName = this.ClientFullName;
    requestData.Address1 = this.quickJobForm.value.Address1?.trim();
    requestData.Address2 = this.quickJobForm.value.Address2?.trim();
    requestData.City = this.quickJobForm.value.City?.trim();
    requestData.StateId = this.quickJobForm.value.StateId == null ? 0 : this.quickJobForm.value.StateId;
    requestData.StateName = this.selectedState?.StateName;
    requestData.DistrictSuburb = this.quickJobForm.value.District_Suburb?.trim();
    requestData.JobUrl = this.baseUrl;
    requestData.OrganizationName = this.OrganizationName;

    requestData.AddressLinkToMap = this.AddressLinkToMap;
    requestData.Latitude = this.Latitude;
    requestData.Longitude = this.Longitude;
    //requestData.CountryName=this.quickJobForm.value.CountryName;

    let countryIdSubmit;
    if (this.selectedValue == undefined) {
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
    this.selectedIndustry?.forEach(element => {
      this.selectedIndustryList.push({
        'IndustryId': element['Id'],
        'IndustryName': element['Description'],
      });
    });
    jobDetailsAll.Industries = this.selectedIndustryList;
    this.selectedSubIndustry?.forEach(element => {
      this.selectedSubIndustryList.push({
        'SubIndustryId': element['Id'],
        'SubIndustryName': element['Description'],
      });
    });
    jobDetailsAll.SubIndustries = this.selectedSubIndustryList;
    this.selectedQualification?.forEach(element => {
      this.selectedQualificationList.push({
        'Id': element['Id'],
        'QualificationName': element['QualificationName'],
      });
    });
    jobDetailsAll.Qualifications = this.selectedQualificationList;
    jobDetailsAll.ExperienceId =this.quickJobForm.value.ExperienceId==null?[]:[this.quickJobForm.value.ExperienceId];
    jobDetailsAll.JobTypeId = this.quickJobForm.value.JobTypeId;
    jobDetailsAll.JobSubTypeId = this.quickJobForm.value.JobSubTypeId;
    this.selectedExperties?.forEach(element => {
      this.selectedExpertiesList.push({
        'ExpertiseId': element['Id'],
        'ExpertiseName': element['FunctionalExpertise'],
      });
    });
    jobDetailsAll.Expertise = this.selectedExpertiesList;
    this.selectedSubExperties?.forEach(element => {
      this.selectedSubExpertiesList.push({
        'SubExpertiseId': element['Id'],
        'SubExpertiseName': element['FunctionalSubExpertise'],
      });
    });
    jobDetailsAll.SubExpertise = this.selectedSubExpertiesList;
    let skillId: any;
    if (this.skillSelectedList != undefined && this.skillSelectedList != null && this.skillSelectedList.length != 0) {
      this.skillSelectedList?.forEach(element => {
        this.skillFinalData.push({
          'SkillId': element.Id,
          'SkillName': element.SkillName,
          'Weightage': element.Weightage
        });
      });
      // skillId = this.skillSelectedList.map((item: any) => {
      //   return item.Id
      // });
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
    // jobDetailsAll.WorkFlowId = this.quickJobForm.value.WorkFlowId;
    // jobDetailsAll.StatusId = this.quickJobForm.value.StatusId;
    // jobDetailsAll.StatusName = this.quickJobForm.value.StatusName;
    requestData.JobDetails = jobDetailsAll;

    //Salary
    let salaryDetailsAll: Isalary = {};
    salaryDetailsAll.CurrencyId = this.quickJobForm.value.CurrencyId==null?0:this.quickJobForm.value.CurrencyId;
    salaryDetailsAll.SalaryUnitId = this.quickJobForm.value.SalaryUnitId==null?0:this.quickJobForm.value.SalaryUnitId;
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
    jobTagDetailsAll.Description = this.quickJobForm.value.DescriptionDetails;
    //jobTagDetailsAll.Description = this.DescriptionValue;
    jobTagDetailsAll.InternalNotes = this.quickJobForm.value.InternalNotes?.trim();
    jobTagDetailsAll.JobTagId = this.quickJobForm.value.JobTagId;

    requestData.JobDescription = jobTagDetailsAll;


    //Job Advance
    let jobAdvanceDetailsAll: IjobAdvance = {};
    jobAdvanceDetailsAll.HeadCount = parseFloat(this.quickJobForm.value.HeadCount);
    /*--@Who: Nitin Bhati,@When:10-March-2023,@Why: Ewm-11009,@What:For handle open and filled date --*/
    if(this.quickJobForm.value.OpenDate==null){
      const d = new Date(Date.now());
      jobAdvanceDetailsAll.OpenDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    }else{
    const d = new Date(this.quickJobForm.value.OpenDate);
    jobAdvanceDetailsAll.OpenDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    };
    if(this.quickJobForm.value.FillDate==null){
      jobAdvanceDetailsAll.FillDate=null; /*-@why:EWM-14577,@when:05-10-2023,@who:Nitin Bhati-*/
      // const s = new Date(Date.now());
      // jobAdvanceDetailsAll.FillDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString();
    }else{
      const s = new Date(this.quickJobForm.value.FillDate);
      jobAdvanceDetailsAll.FillDate = new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString();
    }

    //jobAdvanceDetailsAll.OwnerId = this.quickJobForm.value.OwnerId;
        //Who:Ankit Rawat, Primary job owner changes: manage data for insert api, Why: EWM-17356, When:27Jun2024
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
    jobAdvanceDetailsAll.BrandName = this.BrandName;
    jobAdvanceDetailsAll.ProjectId = this.quickJobForm.value.ProjectId;

    jobAdvanceDetailsAll.JobRankColorCodeURL = this.uploadColorCodePreview;
    // who:maneesh,what:ewm-11121 for color picker value ,when:10/03/2023
    jobAdvanceDetailsAll.JobRankColorCode = this.selctedColor
    jobAdvanceDetailsAll.AccessId = this.quickJobForm.value.AccessId;
    jobAdvanceDetailsAll.AccessName = this.quickJobForm.value.AccessName;
    jobAdvanceDetailsAll.GrantAccessList = this.accessEmailId;
    jobAdvanceDetailsAll.ReasonId = this.quickJobForm.value.ReasonId == null || this.quickJobForm.value.ReasonId == 0 ? 0 : this.quickJobForm.value.ReasonId;
    jobAdvanceDetailsAll.ReasonName = this.quickJobForm.value.ReasonName;
    jobAdvanceDetailsAll.StatusId = this.quickJobForm.value.StatusId;
    jobAdvanceDetailsAll.StatusName = this.quickJobForm.value.StatusName;
    jobAdvanceDetailsAll.WorkFlowId = this.quickJobForm.value.WorkFlowId;
    jobAdvanceDetailsAll.workflowName = this.quickJobForm.value.workflowName;
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
    // jobBoardDetailsAll.ApplicationFormId = this.quickJobForm.value.ApplicationFormId == null ? 0 : this.quickJobForm.value.ApplicationFormId;
    // jobBoardDetailsAll.ApplicationFormName = this.quickJobForm.value.ApplicationFormName;
    const publishedDate = new Date(this.quickJobForm.value.PublishDate);
    jobBoardDetailsAll.PublishDate = new Date(publishedDate.getFullYear(), publishedDate.getMonth(), publishedDate.getDate(), publishedDate.getHours(), publishedDate.getMinutes() - publishedDate.getTimezoneOffset()).toISOString();

    //jobBoardDetailsAll.PublishDate = this.quickJobForm.value.PublishDate;

    requestData.JobBoards = jobBoardDetailsAll;

    return requestData;
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
    //   console.log("add:",event.value);
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
  @Name: getskillListByTagId function
  @Who: Anup Singh
  @When: 13-Sep-2021
  @Why: EWM-3552 EWM-3651
  @What: get skills List by tag id
  */
  skillsListByTag: any = []
  getskillListByTagId(id, tagName) {
    this.systemSettingService.fetchSkillsByTagId("?skilltagid=" + id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.skillsListByTag = repsonsedata.Data;
          let totalRecord = repsonsedata.TotalRecord;
          this.openPopupForSkillCountOfTag(totalRecord, this.skillsListByTag, tagName,)

        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }
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
   @Name: openManageAccessModal
   @Who:Anup
   @When: 07-jan-2022
   @Why:EWM-4467 EWM-4529
   @What: to open quick add Manage Access modal dialog
 */
  public clientId: any;
  public oldPatchValues: any;
  accessEmailId: any = [];


  openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValues, ActivityType: 1, HasAccessFromJob: true },
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isSubmit == true) {
        this.oldPatchValues = {};
        this.accessEmailId = [];
        // let mode: number;
        // if (this.formHeading == 'Add') {
        //   mode = 0;
        // } else {
        //   mode = 1;
        // }
        res.ToEmailIds?.forEach(element => {
          this.accessEmailId.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': 0
          });
        });
        this.quickJobForm.patchValue({
          'AccessName': res.AccessName,
          'AccessId': res.AccessId[0].Id
        });
        this.oldPatchValues = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

      } else {

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
@Name: getStatusList function
@Who: ANup
@When: 14-Mar-2022
@Why: EWM-5285 EWM-3988
@What: For img url
*/
  onChangeColorCodeGetImgUrl(data) {
    let ColorCodeJson = {}
    ColorCodeJson['ColorCode'] = data;
    this.jobRankcolorCode = data;

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
    this.onChangeColorCodeGetImgUrl(this.defaultColorValue);
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
    else if (data.Id == 0) {
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
  @Name: applicationFormInfo function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-7875 EWM-8992
  @What: get application default Info
*/

  applicationFormInfo() {
    this.jobWorkflowService.getApplicationDefault().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.applicationList = repsonsedata.Data;
          this.applicationDefault = repsonsedata.Data.filter(x => x['IsDefault'] === 1)[0];
          this.isMapAppToggled = true;
          this.isChecked ?  this.isDropdown = true : '';
          this.selectedMapApplication = this.applicationDefault;
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

  /*
    @Type: File, <ts>
    @Name: mapApplicationForm function
    @Who: Renu
    @When: 27-Sep-2022
    @Why: EWM-7875 EWM-8992
    @What: open map application form
  */

  mapApplicationForm() {

    const dialogRef = this.dialog.open(MapApplicationInfoComponent, {
      data: { applicationList: this.applicationList, applicationDefault: this.applicationDefault },
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
      if (resData.res) {
        this.applicationDefault = resData.inputArray[0];
        this.isMapAppToggled = false;
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
    this.applicationDefault = {};
    this.isMapAppToggled = true;
  }

  clickCurrency(dataList) {
    this.selectedCurrency=dataList;
    //let currencySelection: any = [];
    //currencySelection = currencySelection.filter((e: any) => e.Id === dataList.Id);
    // this.CurrencyName=currencySelection[0].CurrencyName;
    // this.CurrencySymbol=currencySelection[0].Symbol;
    this.quickJobForm.patchValue(
      {
        CurrencyId: dataList?.Id,
        CurrencyName: dataList?.CurrencyName,
        CurrencySymbol: dataList?.Symbol,
      }
    )
  }


  getContactList() {
    this.contactList = [];
    let cList = this.quickJobForm.get('Contact').value;
    cList?.forEach(element => {
      let Id = element;
      let contactList = this.companyList.filter((e: any) => e.Id == Id);
      contactList[0].Phone = contactList[0].PhoneNo;
      contactList[0].ClientContactId = contactList[0].Id;
      this.contactList.push(contactList[0]);
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
 // @When: 12-08-2024 @who:Amit @why: EWM-17852 @what: skill count & tag lable show
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

    // const subTitle = tagName + ' ' + lng + '.' + this.translateService.instant('label_skillDoYouWant');
    let titellabel=message;
    let title=''
    const dialogData = new ConfirmDialogModel(title, titellabel, this.messageCount);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        for (let index = 0; index < SkillDataByTag.length; index++) {
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
      this.skillTag.push({
        'Id': event?.Id,
        'TagName': event?.TagName,
      });
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
      this.searchValue = '';
    }
    if (inputValue.length > 0 && inputValue.length > 1) {
      this.searchValue = inputValue;
      this.loadingSearch = false;
      this.quickJobService.getAllSkillAndTag("?Search=" + inputValue + '&FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
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
    this.searchValue = '';
    this.tagSkillsList();
  }
  /*
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: to compare objects selected
  */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
  }
  /*
     @Type: File, <ts>
     @Name: noWhitespaceValidator function
     @Who: maneesh
     @When: 09-jan-2023
     @Why: EWM-10155
     @What: Remove whitespace
  */
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '')?.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  /*
     @Type: File, <ts>
     @Name: configureFields function
     @Who: Nitin Bhati
     @When: 07-Feb-2023
     @Why: EWM-10420
     @What: For open Job configure fields
  */
  configureFields() {
    const dialogRef = this.dialog.open(ConfigureJobFieldsComponent, {
      data: new Object({ JobId: 'JobId' }),
      panelClass: ['xeople-modal', 'ConfigureJobFields', 'ConfigureJobFields', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getJobConfigureFieldPermission();
        // setTimeout(() => {
        //   this.getJobConfigureFieldPermission();
        //  }, 1500);
      } else {
        this.loading = false;
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
      @Name: getJobConfigureFieldPermission function
      @Who:  Nitin Bhati
      @When: 8th Feb 2023
      @Why: EWM-10420
      @What: For get Job Configure Field Permission
    */
  getJobConfigureFieldPermission() {
    this.loading = true;
    this.systemSettingService.getJobConfigurePermission().subscribe(
      (responsedata: any) => {
        if (responsedata.HttpStatusCode == 200 || responsedata.HttpStatusCode === 204) {
          this.jobFieldPermissiondata = responsedata.Data;
          this.jobFieldPermissiondata.forEach(element => {
            /*--@Who:Nitin Bhati,@When:3th March 2023,@Why:EWM-11009,@What:For showing General--*/
            if (element.GroupName.toLowerCase() == 'general') {
              element.ListColumn.forEach(sub => {
                if (sub.ColumnName.toLowerCase() == 'jobtitle') {
                  this.JobTitle = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'shop') {
                  this.ClientName = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'location') {
                  this.Location = sub.IsChecked;
                };
              });
            };
            /*--@Who:Nitin Bhati,@When:3th March 2023,@Why:EWM-11009,@What:For showing JobDetails--*/
            if (element.GroupName.toLowerCase() == 'jobdetails') {
              element.ListColumn.forEach(sub => {
                if (sub.ColumnName.toLowerCase() == 'jobcategory') {
                  this.JobCategory = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'jobsubcategory') {
                  this.JobSubCategory = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'industry') {
                  this.Industry = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'subindustry') {
                  this.SubIndustry = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'qualification') {
                  this.Qualification = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'skills') {
                  this.Skills = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'jobtype') {
                  this.JobType = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'jobsubtype') {
                  this.JobSubType = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'experience') {
                  this.Experience = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'functionalexpertise') {
                  this.FunctionalExpertise = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'functionalsubexpertise') {
                  this.FunctionalSubExpertise = sub.IsChecked;
                };
              });
            };
            /*--@Who:Nitin Bhati,@When:3th March 2023,@Why:EWM-11009,@What:For showing Salary--*/
            if (element.GroupName.toLowerCase() == 'salary') {
              element.ListColumn.forEach(sub => {
                if (sub.ColumnName.toLowerCase() == 'currency') {
                  this.Currency = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'salaryunit') {
                  this.SalaryUnit = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'salaryband') {
                  this.SalaryBand = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'hidesalary') {
                  this.HideSalary = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'bonus') {
                  this.Bonus = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'equity') {
                  this.Equity = sub.IsChecked;
                };
              });
            };
            if (element.GroupName.toLowerCase() == 'jobdescription') {
              element.ListColumn.forEach(sub => {
                if (sub.ColumnName.toLowerCase() == 'jobdescription') {
                  this.JobDescription = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'internalnotes') {
                  this.InternalNotes = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'tags') {
                  this.Tags = sub.IsChecked;
                };
              });
            };
            /*--@Who:Nitin Bhati,@When:3th March 2023,@Why:EWM-11009,@What:For showing Advance data--*/
            if (element.GroupName.toLowerCase() == 'advanced') {
              element.ListColumn.forEach(sub => {
                if (sub.ColumnName.toLowerCase() == 'jobrank') {
                  this.JobRank = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'headcount') {
                  this.HeadCount = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'filleddate') {
                  this.FilledDate = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'opendate') {
                  this.OpenDate = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'jobexpirydays') {
                  this.JobExpiryDays = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'owners') {
                  this.Owners = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'companycontacts') {
                  this.CompanyContacts = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'brands') {
                  this.Brands = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'project') {
                  this.Project = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'jobworkflow') {
                  this.JobWorkflow = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'mapapplicationform') {
                  this.MapApplicationForm = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'access') {
                  this.Access = sub.IsChecked;
                };
                if (sub.ColumnName.toLowerCase() == 'status') {
                  this.Status = sub.IsChecked;
                };
              });
            };
          });
          this.loading = false;
          //  setTimeout(() => {
          //   this.title.focus();
          //  }, 1000);
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(responsedata.Message), responsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }


  /*
@Type: File, <ts>
@Name: patchValueByTemplateData function
@Who: Anup Singh
@When: 19-july-2021
@Why: EWM-2001 EWM-2070
@What: patch value from creat job popup template
*/

  patchValueByTemplateData() {
    this.commonserviceService.templateDetailsObs.pipe(delay(0)).subscribe(value => {
      this.selectedDataPopup = value;
      if (value != null && value != undefined) {
        this.quickJobForm.patchValue({
          JobCategoryId: value.JobCategoryId,
          Title: value.JobTitle,
          JobTypeId: value.JobTypeId,
          SalaryBandId: value.SalaryBandId,
          SalaryBandName: value.SalaryBandName,
          SalaryUnitId: value.SalaryUnitId,
          WorkFlowId: value.WorkFlowId,
          workflowName: value.WorkFlowName,
          StatusName: value.StatusName
        });
        this.ClientIdData = value.ClientId;
        this.ClientFullName = value.ClientName;
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
          });
        }

        if (value.JobCategoryId != null && value.JobCategoryId != undefined) {
          this.selectedCategory = { Id: value.JobCategoryId };
          //////Job Sub Category//////////////
          this.dropDownSubCategoryConfig['apiEndPoint'] = this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + value.JobCategoryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
          this.resetFormSubjectSubCategory.next(this.dropDownSubCategoryConfig);
        }

        if (value.JobTypeId != null && value.JobTypeId != undefined) {
          this.selectedJobType = { Id: value.JobTypeId };
          //////Job Sub Type//////////////
          this.dropDownJobSubTypeConfig['apiEndPoint'] = this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + value.JobTypeId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
          this.resetFormSubject.next(this.dropDownJobSubTypeConfig);
        }

        if (value.SalaryBandId != null && value.SalaryBandId != undefined) {
          this.selectedSalaryBandName = { Id: value.SalaryBandId };
        }

        if (value.SalaryUnitId != null && value.SalaryUnitId != undefined) {
          this.selectedSalaryUnit = { Id: value.SalaryUnitId };
        }

        if (value.WorkFlowId != null && value.WorkFlowId != undefined) {
          console.log('value',value);
          this.selectedJobWorkflow = { Id: value.WorkFlowId, WorkflowName: value.WorkFlowName };
        }


        if (value.ExperienceId != null && value.ExperienceId != undefined) {
          this.selectedExperience = { Id: value.ExperienceId };
          let experienceId = value.ExperienceId
          this.quickJobForm.patchValue(
            {
              ExperienceId: experienceId
            }
          )
        }

        if (value.IndustryId != null && value.IndustryId != undefined) {
          this.selectedIndustry = [{ Id: value.IndustryId }];
          let industryId = [value.IndustryId]
          this.quickJobForm.patchValue(
            {
              IndustryId: industryId
            }
          )


          //////Sub Industry//////////////
          this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + value.IndustryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
          this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
          // this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification;
          this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?IndustryId=' + value.IndustryId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
          this.resetFormSubjectQualification.next(this.dropDownQualificationConfig);

        }

        this.DescriptionValue = value.JobDescription;
        this.clientIdData = value.ClientId;


      }

    })
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

        data: new Object({AutoFilldata: this.addressData?.length?this.addressData[0]:this.addressData}),
        panelClass: ['xeople-modal', 'add_canAddress', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res != undefined && res != null) {
          this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap)
          this.selectedValue = { 'Id': Number(res?.data?.CountryId) };
            this.selectedState = { 'Id': Number(res?.data?.StateId), 'StateName': res?.data?.StateName};
            this.AddressLinkToMap = res?.data?.AddressLinkToMap;
            this.Latitude = res?.data?.Latitude;
            this.Longitude = res?.data?.Longitude;
            this.addressData=res?.data;
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

// color picker start
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11121
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
  @Why: EWM-11121
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
  @Why: EWM-11121
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
  @Why: EWM-11121
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
  @Why: EWM-11121
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
  if (1000 > values) { /*-@why:EWM-14577,@when:05-10-2023,@who:Nitin Bhati-*/

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

/*
    @Type: File, <ts>
    @Name: clear Date function
    @Who: bantee
    @When: 24-march-2024
    @Why: EWM-11177
    @What: For clear filled  date
     */
clearFilledDate(){
  this.quickJobForm.patchValue({
    FillDate: null
  });
}

clearOpenDate(){
  this.quickJobForm.patchValue({
    OpenDate: null
  });
}
/*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 05-april-2023
    @Why: EWM-11724
    @What: For clear PublishDate
     */
    clearEndDate(e){
      this.quickJobForm.patchValue({
        PublishDate: null
      });
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
  // who:maneesh,what:ewm-13859 for show 1 more create function screenMediaQuiryForOwnerContact() when:21/08/2023
  screenMediaQuiryForOwnerContact(){
    /* @When: 29-08-2023 @who:Amit @why: EWM-13922 @what:max length changes */
    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 450) {
      this.maxMoreLengthForOwnerContacts = 1;
    } else if (this.currentMenuWidth > 450 && this.currentMenuWidth < 580) {
      this.maxMoreLengthForOwnerContacts = 2;
    } else if (this.currentMenuWidth > 580 && this.currentMenuWidth < 735) {
      this.maxMoreLengthForOwnerContacts = 3;
    } else if (this.currentMenuWidth > 850 && this.currentMenuWidth < 950) {
      this.maxMoreLengthForOwnerContacts = 5;
    } else if (this.currentMenuWidth > 950 && this.currentMenuWidth < 980) {
      this.maxMoreLengthForOwnerContacts = 6;
    } else if (this.currentMenuWidth > 980 && this.currentMenuWidth < 1024) {
      this.maxMoreLengthForOwnerContacts = 2;
    } else if (this.currentMenuWidth >  1024 && this.currentMenuWidth < 1265) {
      this.maxMoreLengthForOwnerContacts = 3;
    } else if (this.currentMenuWidth >  1585 && this.currentMenuWidth < 1700) {
      this.maxMoreLengthForOwnerContacts = 5;
    } else if (this.currentMenuWidth >  1700 && this.currentMenuWidth < 1921) {
      this.maxMoreLengthForOwnerContacts = 6;
    }
    else {
      this.maxMoreLengthForOwnerContacts = 4;
    }
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
          this.addressData=[...this.ClientLocationAddress];
          this.AddressLinkToMap=repsonsedata?.Data?.LocationDetails?.AddressLinkToMap;

          this.quickJobForm['controls'].address['controls'].AddressLinkToMap.setValue(repsonsedata?.Data?.LocationDetails?.AddressLinkToMap);
          //this.hideForJobDetailsView=false;
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
      IMG_BIND_VALUE:'ProfileImage',
      FIND_BY_INDEX: 'Id'
  }

  this.common_DropdownCurrency_Config = {
    API: this.serviceListClass.currencyList +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true',
    MANAGE: './client/core/clients/list?viewModeData=listMode',
    BINDBY: 'CurrencySymbolName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'quickjob_currency',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'Id'
  }
}

ngOnDestroy(){
  // this.dataService.resetSetterData();
  // this.dataService.resetSetterDataClientSide();
}
  sendDataAgainToChild(isMatchedData: any) {
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
    this.workFlowDropdownConfig = {
      API: this.serviceListClass.jobWorkFlowList +"?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND",
      MANAGE: '',
      BINDBY: 'WorkflowName',
      REQUIRED: true,
      DISABLED: false,
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

  //Who:Ankit Rawat, Primary job owner changes: Bind Primary owner, Why: EWM-17356, When:27Jun2024
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
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: 'Email',
    IMG_BIND_VALUE: 'ProfileImageUrl',
    FIND_BY_INDEX: 'UserId'
  }
}

//Who:Ankit Rawat, Primary job owner changes: Change event of Primary owner, Why: EWM-17356, When:27Jun2024
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

  //Who:Ankit Rawat, Primary job owner changes: Bind owner dropdown, Why: EWM-17356, When:27Jun2024
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
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: 'Email',
    IMG_BIND_VALUE: 'ProfileImageUrl',
    FIND_BY_INDEX: 'UserId'
  }
}

//Who:Ankit Rawat, Primary job owner changes: Change event of owner dropdown, Why: EWM-17356, When:27Jun2024
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
  
//Who:Ankit Rawat, Alert message, Why: EWM-17356, When:27Jun2024
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
