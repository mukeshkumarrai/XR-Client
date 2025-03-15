
// <!-- by maneesh creat component for add vxt call log -->
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { Address } from 'cluster';
import { Observable, Subject, Subscription } from 'rxjs';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import * as moment from 'moment';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { addVxtCalllog } from '@app/shared/models/commonaddvxtcalllog';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { ConfirmDialogModel } from '../share-job-application-url/share-job-application-url.component';
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-job-call',
  templateUrl: './add-job-call.component.html',
  styleUrls: ['./add-job-call.component.scss']
})
export class AddJobCallComponent implements OnInit {
  /**********************global variables decalared here **************/
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addCallForm: FormGroup;
  addressBarData: Address;
  public locationTypeList: any = [];
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  events: Event[] = [];
  ownerList: [] = [];
  selectedValue: any = {};
  client: any;
  public loading: boolean = false;
  clientId: any;
  public hideRuleContent: boolean;
  @ViewChild('editor') editor: EditorComponent;
  subscription$: Subscription;
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string;
  public getEditorValForFrom: string='';
  public showErrorDesc: boolean = false;
  public tagList: any = ['jobs'];
  public basic: any = [];
  maxLengthEditorValue: Subject<any> = new Subject<any>();
  showMaxlengthError: boolean = false;
  public maxlenth: number;
  getRequiredValidationMassage: Subject<any> = new Subject<any>();
  public dateFill = new Date();
  getDateFormat: string;
  currentStartDate: any = new Date();
  StartDateMin = new Date();
  userId: any;
  username: string;
  public dropDownStatusConfig: customDropdownConfig[] = [];
  resetFormSubjectStatus: Subject<any> = new Subject<any>();
  public selectedCategory: any = {};
  currentUserId: string;
  clientshortname: string;
  callType: string = "Incoming"
  public getVxtLastCallDetail: Subscription;
  gridList: any;
  LastCallToSortName: string;
  lastcallToName: string;
  lastcallFromSortName: string;
  lastcallFromName: string;
  lastcallToProfileImageUrl: string;
  lastcallToFromProfileImageUrl: string;
  lastcallNotesDiscription: string
  lastcallTime: any;
  lastcallDate: string;
  public isEditForm: boolean;
  public slotStartDate: any;
  public slotEndDate: any;
  public startTime: any;
  public endTime: any;
  public timePeriod: any = 60;
  userInviteArr: any = [];
  currentUserDetails: any
  public dynamicFilterArea: boolean = false;
  Name: string;
  callId: number;
  public timezonName: any = localStorage.getItem('UserTimezone');
  IsActive: string = '';
  getMinut: number;
  getSecond: number;
  public selectedItem = [];
  resetFormSubjectRelatedUser: Subject<any> = new Subject<any>();
  attendiesPopArr = [];
  jobContactsArr = [];
  empCandArr = [];
  onlyAttendiesPopArr = [];
  public selectedRelatedUser: any = {};
  public selectedRelatedUserEndCaller: any = {};
  public ActivityTypeList: any[] = [];
  public activityForAttendees: string;
  public requiredAttendeesList: any[] = [];
  public optionalAttendeesList: any[] = [];
  public organizerOrAssigneesList: any = [];
  minut: number;
  second: number;
  millisecondForMinut: number = 0;
  millisecondForSecond: number = 0;
  isMinTimeCondotion: boolean = false;
  isEndTmeRequired: boolean;
  public TimeStartValue: any;
  public TimeEndValue: any;
  isStartTmeRequired: boolean;
  isDateEnd: boolean = true;
  EndDateMin: Date;
  dateAndTimeToggle: boolean;
  callData: number;
  showIncommingCallData: boolean = true;
  showOutGoingCallData: boolean = false;
  @ViewChild('target') private myScrollContainer: ElementRef;
  hideMoreFields: boolean = false;
  showReferenceId: boolean;
  showStartDate: boolean;
  showExpiryDate: boolean;
  ShowEditor: boolean = true;
  IsNotes: number = 1
  currentUser: any;
  isCategory: boolean
  CategoryId: any;
  CategoryName: string;
  common_DropdownC_Config_Details: DRP_CONFIG;
  getNotesDetails: string;
  maxMessage: Number = 25;
  SecondselectedRelatedUser: any = {};
  common_DropdownC_Config: DRP_CONFIG;
  common_DropdownC_ConfigEndCaller: DRP_CONFIG;
  resetRelattedUserDrp: Subject<any> = new Subject<any>();
  SecondresetRelattedUserDrp: Subject<any> = new Subject<any>();
  SecondresetRelattedUserDrpEndCaller: Subject<any> = new Subject<any>();
  activityFor: string;
  decimalhour:number;
  timeValue: any = [];
  timeValueForSecond: any = [];
  reletedUsertype:string;
  reletedUserTypeCode:string;
  reletedUserTypeCodeValue:string;
  JobIdForVxt:boolean=false;
  public isReadMore: any[] = [false];
  common_DropdownC_Config_DetailsRadioBtn: DRP_CONFIG;
  RelatedUserForRadiobtnUserDrp: Subject<any> = new Subject<any>();
  RelatedUserForRadiobtn: any = {};
  AddJobVxt:boolean=false;
  DetailsSummaryURL:string;
  fromIsNotes: any;
  contactSummery = '/client/cont/contacts/contact-detail';
  jobSummery = '/client/jobs/job/job-detail/detail';
  clientSummery = '/client/core/clients/list/client-detail'
  candidateSummery = '/client/cand/candidate/candidate'
  fromSummery = '/client/emp/employees/employee-detail'
  employeeSummery = '/client/emp/employees/employee-detail'
  usertype:string;
  contactId: any;
  redirectUsertype: string;
  contactIdForUrl: any;
  jobDetailsWorkflowId: string;
  fromDetailsId: any;
  activityForRelatedTo: string;
  fromDetailsName: any;
  fromcontactId: any;
  ToUrl: any;
  FromURl: any;
  DetailsURL: any;
  SaveToSummeryUrl: any;
  fromRelatedTo: any;
  ForDetailsUrl: any;
  fromId: any;
  contctIdrEndCaller: any;
  isResponseGet=false;
resetEditorValue: Subject<any> = new Subject<any>();
  saveToName: string;
  SaveToId: any;
  FromName: string;
  FromId: any;
  ToName: string;
  ToId: any;
  reletedcatgry:boolean=false;
  profileName:string;
  profileImage:string;
  profileShortName:string;
  profileEmail:string;
  profilePhonnumber:number;
  profileImageData:boolean;
  callTypedata:string;
  public selectedRelatedUserEndCallerData: any = {};
  public extraBindValue:string;
  public extraBindValueEndcaller: string;
  public ChangeAEndCaller:string;
  hideJobDropdown:boolean=false;
  public MaxDate: any = new Date();
  public timeAfter5Minutes: Date;
  public currentUserProfileImage:string;
  public ProfileImagePath:string='';
  public ToProfileImage:string;
  public ToProfileImageUrl:string;
  public FromProfileImageUrl:string;
  public FromProfileImage:string;
  public formattedDate:string;
  public fromUtcDate:string;
  public utcDate:string;
  public profileImageURL:string;
  public fromImagedata:string;
  public common_DropdownCallStatus_Config:DRP_CONFIG;
  public selectedCallStatus: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private routes: ActivatedRoute, public dialogRef: MatDialogRef<AddJobCallComponent>,
    public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private quickJobService: QuickJobService, private clientService: ClientService, private serviceListClass: ServiceListClass,
    private appSettingsService: AppSettingsService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private datePipe: DatePipe) {
    this.addCallForm = this.fb.group({
      Id: [null],
      CategoryId: ['', Validators.required],
      NotesDiscription: ['', [Validators.required]],
      NotesCategry: [''],
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      RelatedUserType: [{ value: 'Job', disabled: true }, [Validators.required]],
      RelatedUserTypeName: [this.data?.reletedUserTypeCodeValue],
      RelatedUserId: [null],
      RelatedUserUserName: [''],
      SecondRelatedUserType: [null],
      SecondRelatedUserTypeName: [''],
      SecondRelatedUserId: [''],
      SecondRelatedUserUserName: [null],
      SourcDescription: [null, [Validators.maxLength(25)]],
      mins: [null],
      Second: [null],
      RelatedUserEndCaller: [''],
      RelatedUserTypeEndCaller: [null, [Validators.required]],
      RelatedUserIdEndCaller: [null],
      RelatedUserUserNameEndCaller: [''],
      RelatedUserTName: [{value: this.data?.Name, disabled: true }],
      CallStatusId: ['', Validators.required],
      CallStatus: [''],
    }); 
      if (this.data?.isEdit!='Edit') {
        this.dropDownStatusConfig['IsDisabled'] = false;
        this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType=JOBS' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
        this.dropDownStatusConfig['searchEnable'] = true;
        this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
        this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
        this.dropDownStatusConfig['IsRequired'] = true;
      } 


    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    let jobDetailsWorkflowId = localStorage.getItem('jobDetailsWorkflowId');
    this.jobDetailsWorkflowId = jobDetailsWorkflowId;

    this.currentUser = tenantData;
    this.currentUserId = tenantData?.UserId;
    let sortProfileUrl=localStorage.getItem('ProfileUrl')as string;;
    let path = sortProfileUrl?.substring(sortProfileUrl?.indexOf('USER')); // Extract everything starting from "EWM"   
    this.currentUserProfileImage = path;
    this.clientshortname = this.data?.ClientSortName;
    this.JobIdForVxt=this.data?.JobIdForVxt;
    this.AddJobVxt=this.data?.AddJobVxt;
    this.DetailsSummaryURL=this.data?.JobdetailsSummeryUrl;
  }


  ngOnInit() {
    this.IsActive = this.data?.isEdit
    this.selectedRelatedUser = { 'Id': this.data?.Id, 'Name': this.data?.Name }
    this.Name = this.data?.Name
    this.addCallForm.patchValue({
      RelatedUserTName:this.Name
    });
    this.selectedCategory = {};
    this.timevalue();
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    let currentTime = new Date();
    this.timeAfter5Minutes = new Date(currentTime.getTime() + 5 * 60000);      
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.slotStartDate = new Date();
    this.slotEndDate = new Date(Date.now() + this.timePeriod * 60 * 1000);
    const startdatetime = new Date(this.slotStartDate);
    let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.routes.queryParams.subscribe((value) => {
      if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
        this.clientId = value.clientId;
      }
    });
    this.editorConfig = {
      REQUIRED: true,
      DESC_VALUE: null,
      PLACEHOLDER: 'label_Vxt_Notes_Discription',
      Tag: [],
      EditorTools: this.basic,
      MentionStatus: false,
      maxLength: 0,
      MaxlengthErrormessage: false,
      JobActionComment: false,
      hideIconForAddCommonCallLog:true 

    };
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserDetails = currentUser;
    this.userId = currentUser?.UserId;
    this.username = currentUser?.FirstName + ' ' + currentUser?.LastName;  
    this.addCallForm.patchValue({
      RelatedUserUserName: this.data?.Id,
      RelatedUserId: this.data?.Name,
    });
    this.getConfig();
    if (this.data?.isEdit =='Edit' && this.data?.callId) {
      this.callId = this.data?.callId
      this.getVxtCandidateListCallDetailsById(this.data?.callId)
    } else {
      this.addCallForm.patchValue({
        DateStart: this.slotStartDate,
        TimeStart: this.TimeStartValue
      });
    }
    if (this.data?.Name ==undefined || this.data?.Name ==null) {
    let data=JSON.parse(localStorage.getItem('jobdetailsHeaderDetails'));
    this.Name =data?.JobDetails?.JobTitle;
    this.selectedRelatedUser = { 'Id': this.data?.Id, 'Name': data?.JobDetails?.JobTitle }     
    }
  }

  getVxtCandidateListCallDetailsById(Id) {
    this.loading = true;
    this.ShowEditor=true;
    this.candidateService.getVxtCandidateListCallDetailsById(Id).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.CategoryId = repsonsedata.Data?.CategoryId;
          this.CategoryName = repsonsedata.Data?.CategoryName;
          this.fromImagedata=repsonsedata.Data?.FromProfileImage;
          this.profileImageURL= this.fromImagedata;
          this.FromProfileImageUrl=repsonsedata.Data?.FromProfileImageUrl;
          this.ToProfileImage=repsonsedata.Data?.ToProfileImage;          ;
          this.ToProfileImageUrl=repsonsedata.Data?.ToProfileImageUrl;
          // Example decimal value (hours)
          this.decimalhour=repsonsedata.Data?.Duration;
          const decimalHours = repsonsedata.Data?.Duration;
          const minutes = Math.floor(decimalHours / 60 / 1000);
          this.millisecondForMinut = minutes;
          const seconds = Math.floor(decimalHours / 1000) % 60;
          this.millisecondForSecond = seconds;
          this.addCallForm.patchValue({
            mins: minutes==0?null:minutes,
            Second: seconds==0?null:seconds
          })
          this.ForDetailsUrl=repsonsedata.Data?.RelatedTo;
          if (repsonsedata.Data?.EndCallerTypeCode=='CONT') {
            this.ChangeAEndCaller=repsonsedata.Data?.EndCallerTypeCode;
            // this.fromId= localStorage.getItem('contctIdrEndCaller');  
          this.contctIdrEndCaller= localStorage.getItem('contctIdrEndCaller'); 

          }else{
            // this.fromId=repsonsedata.Data?.FromId;
          this.contctIdrEndCaller= repsonsedata.Data?.FromId;

          }
          this.saveToName=repsonsedata.Data?.SaveToName;
          this.SaveToId=repsonsedata.Data?.SaveToId;
          this.ToId=repsonsedata.Data?.ToId;
          this.ToName=repsonsedata.Data?.ToName;
          this.FromName=repsonsedata.Data?.FromName;
          this.FromId=repsonsedata.Data?.FromId;
          this.getVxtLastCallDetails(repsonsedata.Data?.FromId,repsonsedata.Data?.EndCallerTypeCode);
          if(repsonsedata.Data?.UserType=='JOB'){
          this.selectedRelatedUser = { 'Id': repsonsedata.Data?.FromId };
          }

          this.SecondselectedRelatedUser = { 'Id': repsonsedata.Data?.DetailsId, 'Name': repsonsedata.Data?.DetailsName };
          this.SecondOnRelatedUserchange(this.SecondselectedRelatedUser,'true');
          if (repsonsedata.Data?.CallType.toLocaleLowerCase()=='incoming' && repsonsedata.Data?.UserType=='JOB') {
          this.selectedRelatedUserEndCaller = {Id:repsonsedata.Data?.FromId,Name:repsonsedata.Data?.FromName};
          this.selectedRelatedUserEndCallerData = {Id:repsonsedata.Data?.FromId,Name:repsonsedata.Data?.FromName};

          this.FromName=repsonsedata.Data?.FromName;
          this.FromId=repsonsedata.Data?.FromId;
          }
          else if(repsonsedata.Data?.CallType.toLocaleLowerCase()=='incoming' && repsonsedata.Data?.UserType!='JOB'){
          this.selectedRelatedUserEndCaller = {Id:repsonsedata.Data?.FromId,Name:repsonsedata.Data?.FromName};
          this.selectedRelatedUserEndCallerData = {Id:repsonsedata.Data?.FromId,Name:repsonsedata.Data?.FromName};
          this.FromName=repsonsedata.Data?.FromName;
          this.FromId=repsonsedata.Data?.FromId;
          }else if(repsonsedata.Data?.CallType.toLocaleLowerCase()=='outgoing' && repsonsedata.Data?.UserType=='JOB') {
            this.selectedRelatedUserEndCaller = {Id:repsonsedata.Data?.ToId,Name:repsonsedata.Data?.ToName};
          this.selectedRelatedUserEndCallerData = {Id:repsonsedata.Data?.ToId,Name:repsonsedata.Data?.ToName};
            }
          this.ChangeAEndCaller=repsonsedata.Data?.EndCallerTypeCode;
          this.onChangeAEndCallerGetById(repsonsedata.Data?.EndCallerTypeCode);
          this.checkRelatedTypeEndCaller(repsonsedata.Data?.EndCallerTypeCode);
          this.patchDataForClientEdit(repsonsedata.Data);
          this.loading = false;
          if(this.ChangeAEndCaller=='CAND'){ //by maneesh ewm-18655
            this.getCatogryDataForCandidate();
          }else if(this.ChangeAEndCaller=='CLIE'){
          this.getCatogryDataForClient();
            }else if(this.ChangeAEndCaller=='CONT'){
          this.getCatogryDataForContact();   
            }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
  patchDataForClientEdit(data) {

    // this.Name = data?.SaveToName;
    this.fromIsNotes=data?.IsNotes;
    this.editConfigRequired();
    this.redirectUsertype=data?.UserType;
    this.getNotesDetails = data?.Notes;
    const timestamp = data?.Date;
    const date = new Date(timestamp);
    let currentDa = new Date(data?.Date);
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    let local_startDate = this.commonserviceService.getUtCToLocalDate(date);
    if (isNaN(currentDa.getTime())) {
      console.error('Invalid Date');
    } else {
      // Convert to UTC format using toISOString
      this.fromUtcDate = currentDa.toISOString();
    }
    this.selectedCategory = { 'Id': data.CategoryId };
    this.fromDetailsId=data?.DetailsId;
    this.fromDetailsName=data?.DetailsName;
    this.ToUrl=data?.ToSummaryURL;
    this.FromURl=data.FromSummaryURL;
    this.DetailsURL=data.DetailsSummaryURL;
    this.SaveToSummeryUrl=data.SaveToSummaryURL;
    this.callTypedata=data?.CallType;
    if (this.ForDetailsUrl=='CONT') {
      if (localStorage.getItem('contctIdForUrlJ')!=null && localStorage.getItem('contctIdForUrlJ')!=undefined && localStorage.getItem('contctIdForUrlJ')!='') {
      this.contactIdForUrl=localStorage.getItem('contctIdForUrlJ'); 
      this.activityFor=this.ForDetailsUrl;
      }else{
        this.contactIdForUrl=data?.Id;
      }
    }
    if (data?.CallType.toLocaleLowerCase() == 'incoming') {
      this.callType = data?.CallType;
      this.showOutGoingCallData = false;
      this.showIncommingCallData = true;
    } else {
      this.callType = data?.CallType;
      this.showIncommingCallData = false;
      this.showOutGoingCallData = true;
    }
    if (data?.IsNotes == 1) {
      this.ShowEditor = true;
      this.IsNotes = 1;
      // this.addCallForm.patchValue({
      //   // RelatedUserUserName: this.data?.Id,
      //   NotesCategry: this.data?.NotesCategry ,      
      // })
      this.CategoryId = data?.CategoryId;
      this.CategoryName = data?.CategoryName;
      this.addCallForm.patchValue({
        CategoryId: data?.CategoryId,
        NotesCategry: data?.CategoryName,
        NotesDiscription: data?.Notes
      })
      this.getEditorVal = data?.Notes;
      this.getEditorValForFrom = data?.Notes;
      this.resetEditorValue.next(this.editorConfig);
    } else {
      // this.resetEditorValue.next(this.editorConfig);
      this.ShowEditor = false;
      this.IsNotes = 1;
      this.CategoryId = data?.CategoryId;
      this.CategoryName = data?.CategoryName;
      this.addCallForm.patchValue({
        CategoryId: data?.CategoryId,
        NotesCategry: data?.CategoryName,
        NotesDiscription: data?.Notes
      })
      this.getEditorVal = data?.Notes;
      this.getEditorValForFrom = data?.Notes;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
      this.addCallForm.get("NotesCategry").clearValidators();
      this.addCallForm.get("NotesCategry").markAsPristine();
      this.addCallForm.get('NotesCategry').updateValueAndValidity();
      this.addCallForm.get("CategoryId").clearValidators();
      this.addCallForm.get("CategoryId").markAsPristine();
      this.addCallForm.get('CategoryId').updateValueAndValidity();

    }
if (data.EndCallerTypeCode=='JOBS' || data.EndCallerTypeCode=='Jobs') {
  this.ChangeAEndCaller='JOBS'; 
this.selectedCategory = { 'Id': this.CategoryId,CategoryName: this.CategoryName};
this.dropDownStatusConfig['IsDisabled'] = false;
this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+'JOBS' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
this.dropDownStatusConfig['searchEnable'] = true;
this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
this.dropDownStatusConfig['IsRequired'] = true;
}else{
  this.ChangeAEndCaller=data.EndCallerTypeCode;
  this.selectedCategory = { 'Id': this.CategoryId,CategoryName: this.CategoryName};
  this.dropDownStatusConfig['IsDisabled'] = false;
  this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+'JOBS' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
  this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
  this.dropDownStatusConfig['searchEnable'] = true;
  this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
  this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
  this.dropDownStatusConfig['IsRequired'] = true;
}
    this.addCallForm.patchValue({
      // RelatedUserUserName: this.data?.Id,
      RelatedUserType: 'Job',
      RelatedUserId: data?.Id,
      DateStart: currentDa,
      TimeStart: this.TimeStartValue,
      SecondRelatedUserType: data?.RelatedTo!=null? data?.RelatedTo :null,
      SecondRelatedUserId: data?.DetailsId,
      SecondRelatedUserUserName: data?.DetailsName,
      SourcDescription: data?.Source,
      CallStatusId: data?.CallStatusId,
      CallStatus: data?.CallStatus
    })
    // this code for max time date validation
    // let currentStartDate = this.commonserviceService.getUtCToLocalDate(this.currentStartDate);
    //   if (local_startDate < currentStartDate) {
    //      let currentTime = new Date();
    //      this.timeAfter5Minutes = new Date(currentTime.getTime() + 5 * 60000);  
    //   }else{
    //      this.timeAfter5Minutes = new Date();  
    //   }
    this.selectedCallStatus = { 'CallStatusId': data.CallStatusId, 'CallStatus': data.CallStatus };
    if (data?.RelatedTo=='Job') {
      this.reletedUsertype="JOB";
    }else if(data?.RelatedTo=='Client'){
      this.reletedUsertype="CLIE";
    }else if(data?.RelatedTo=='Candidate'){
      this.reletedUsertype="CAND";
    }else if(data?.RelatedTo=='Contact'){
      this.reletedUsertype="CONT";
    }

    // if (data?.UserType=='JOb') {
    //   // this.reletedUsertype="JOB";
    //   this.addCallForm.patchValue({
    //     RelatedUserType: "Job",
    //     RelatedUserId: data?.Id,
    //   })
    // }
    // this.addCallForm.patchValue({
    //   RelatedUserType: "Job",
    //   RelatedUserId: data?.Id,
    // })
    // this.SecondselectedRelatedUser = { 'Id': data?.DetailsId, 'Name': data?.DetailsName }
    // this.SecondOnRelatedUserchange(this.SecondselectedRelatedUser,'true');
    this.SecondcheckRelatedType(data?.RelatedTo);
    this.resetFormSubjectStatus.next(this.dropDownStatusConfig);

  }

  getConfig() {
    this.common_DropdownC_Config = {
      API: this.serviceListClass.getAllClientForActivity,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'Name',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: 'ProfilePicturePreview',
      FIND_BY_INDEX: 'Id'
    }
    this.common_DropdownC_Config_Details = {
      API: '',
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_Vxt_Save_To_Name',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: 'ProfilePicturePreview',
      FIND_BY_INDEX: 'Id'
    }

    this.common_DropdownC_ConfigEndCaller = {
      API: '',
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_Vxt_End_Caller_Name',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: 'ProfilePicturePreview',
      FIND_BY_INDEX: 'Id'
    }


    this.common_DropdownCallStatus_Config = {
      API: this.serviceListClass.vxtcallStatus,
      MANAGE: '',
      BINDBY: 'CallStatus',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_Vxt_Call_Status',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: ''  ,
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'CallStatusId'
    }

  }

  onCategorychange(data) {
    if (data == null || data == '' || data == undefined) {
      this.CategoryId =0;
      this.CategoryName = '';
      this.addCallForm.patchValue({
        CategoryId:0,
        NotesCategry: ''
      })
      this.addCallForm.get("CategoryId").setErrors({ required: true });
      this.addCallForm.get("CategoryId").markAsTouched();
      this.addCallForm.get("CategoryId").markAsDirty();
      this.isCategory = true;
    } else {
      this.isCategory = false;
      this.CategoryId = data?.Id;
      this.CategoryName = data?.Name;      
      this.addCallForm.patchValue({
        CategoryId: data?.Id,
        NotesCategry: data?.CategoryName
      })
    }
  }
// resetTime function for create and update  data
resetTime(type) {
  if (type=='minut') {
    this.millisecondForMinut=0;
  }else{
    this.millisecondForSecond=0;
  }
  this.decimalhour=this.millisecondForMinut + this.millisecondForSecond;
  }

// onConfirm function for create and update  data
  onConfirm(value) {
    this.isResponseGet=true;
    if (this.IsActive == 'Edit') {
      this.onUpdate(value);
    }
    else {
      this.onSave(value);
    }
  }
// onSave function for create  data
  onSave(value): void {
    localStorage.removeItem('redirectContactId');
    // this.decimalhour = this.millisecondForMinut + this.millisecondForSecond;
    let cureentUserName = this.currentUser?.FirstName + ' ' + this.currentUser?.LastName;    
    this.formattedDate = this.datePipe.transform(value?.DateStart, 'yyyy-MM-dd')!;
    let hours = this.TimeStartValue.getHours();
    let minutes = this.TimeStartValue.getMinutes();
    let seconds = this.TimeStartValue.getSeconds();
    const combinedTime = `${hours}:${minutes}:${seconds}`;
    const combinedDateTime = `${this.formattedDate}T${combinedTime}`;
       const formattedDate = this.formatDate(combinedDateTime);
       // Create a Date object from the formatted date string
       const dateObj = new Date(formattedDate);
       // Check if the date object is valid
       if (isNaN(dateObj.getTime())) {
         console.error('Invalid Date');
       } else {
         // Convert to UTC format using toISOString
         this.utcDate = dateObj.toISOString();
       }   // this.addCallForm.value?.RelatedUserType?.value
    let AddNotesObj: addVxtCalllog = {
      SaveTo: this.data?.usertype,
      SaveToId: this.data?.Id,
      CategoryId: this.addCallForm.value?.CategoryId ? this.addCallForm.value?.CategoryId : 0,
      CategoryName:this.addCallForm.value?.CategoryId ? this.addCallForm.value?.NotesCategry : '',
      StartDate:this.utcDate,
      FromId: this.callType.toLocaleLowerCase() == 'incoming' ? this.selectedRelatedUserEndCaller?.Id : this.currentUserId,
      FromName: this.callType.toLocaleLowerCase() == 'incoming' ? this.selectedRelatedUserEndCaller?.Name : cureentUserName,
      ToId: this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserId : this.selectedRelatedUserEndCaller?.Id,
      ToName: this.callType.toLocaleLowerCase() == 'incoming' ? cureentUserName : this.selectedRelatedUserEndCaller?.Name,
      CallType: this.callType,
      RelatedTo: this.addCallForm.value?.SecondRelatedUserType!='' && this.addCallForm.value?.SecondRelatedUserType != undefined ? this.addCallForm.value?.SecondRelatedUserType : null,
      DetailsId: this.addCallForm.value?.SecondRelatedUserId != '' && this.addCallForm.value?.SecondRelatedUserId != undefined ? this.addCallForm.value?.SecondRelatedUserId : "00000000-0000-0000-0000-000000000000",
      DetailsName: this.SecondselectedRelatedUser?.Name,
      Notes: this.IsNotes==0?'':this.addCallForm.value?.NotesDiscription?.trim(),
      Duration: this.decimalhour,
      IsNotes: this.IsNotes,
      Source: this.addCallForm.value?.SourcDescription?.trim(),
      FromSummaryURL: this.callType.toLocaleLowerCase() == 'incoming' ?this.viewJobSummery(this.contctIdrEndCaller,this.ChangeAEndCaller) : this.viewJobSummery(this.currentUserId,'EMPL'),
      ToSummaryURL: this.callType.toLocaleLowerCase() == 'incoming' ? this.viewJobSummery(this.currentUserId,'EMPL') : this.viewJobSummery(this.contctIdrEndCaller,this.ChangeAEndCaller),
      DetailsSummaryURL: this.viewJobSummery(this.contactIdForUrl,this.activityFor),
      NotesURL: 'NotesURL',
      SaveToName :this.selectedRelatedUser?.Name,
      // SaveToSummaryURL :this.DetailsSummaryURL,
      SaveToSummaryURL :this.callType.toLocaleLowerCase() == 'incoming' ?this.viewJobSummery(this.contctIdrEndCaller,this.ChangeAEndCaller) : this.viewJobSummery(this.currentUserId,'EMPL'),
      EndCallerTypeCode :this.ChangeAEndCaller,
      CallStatusId: this.addCallForm.value?.CallStatusId ? this.addCallForm.value?.CallStatusId : null,
      CallStatus: this.addCallForm.value?.CallStatus ? this.addCallForm.value?.CallStatus : '',
      SaveToPhoneNumber: this.data?.PhoneNumber?this.data?.PhoneNumber:''
    };
    AddNotesObj.FromProfileImage=this.callType.toLocaleLowerCase() == 'incoming' ? this.profileImageURL?this.profileImageURL:'' : this.currentUserProfileImage;
    AddNotesObj.ToProfileImage=this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserProfileImage: this.profileImageURL?this.profileImageURL:'';
    AddNotesObj.ToProfileImageUrl='';
    AddNotesObj.FromProfileImageUrl='';
     this.candidateService.CreatecandidateVxtCall(AddNotesObj).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addCallForm.reset();
          this.isResponseGet=false;
          document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        } else {
          this.isResponseGet=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.isResponseGet=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
      // Helper function to format the date string with leading zeros
      formatDate(date: string): string {
        // Split the input date and time
        const [datePart, timePart] = date.split('T');
        // Pad time components with leading zeros
        const [hours, minutes, seconds] = timePart.split(':').map((part) => part.padStart(2, '0'));
        // Return the formatted string
        return `${datePart}T${hours}:${minutes}:${seconds}`;
      }
    combineDateWithTime(date: string, time: string): Date {
      // Combine the date and time into a single string (format: "YYYY-MM-DDTHH:MM:SS")
      const combinedDateTime = `${date}T${time}`;
      return new Date(combinedDateTime); // Return as a Date object
    }
// viewJobSummery function for redirectdata url  data
  viewJobSummery(Id, relatedTo) {    
    this.usertype=relatedTo;
    const baseUrl = window.location.origin;
    if (this.usertype == 'CLIE') {
      return baseUrl + this.clientSummery + "?clientId=" + Id + "&Type=" + this.usertype;
  
    } else if (this.usertype == 'CAND') {
      return baseUrl + this.candidateSummery + "?CandidateId=" + Id + "&Type=" + this.usertype;
    }
    else if (this.usertype == 'JOB') {
    return baseUrl + this.jobSummery +"?jobId="+ Id + "&workflowId="+ this.jobDetailsWorkflowId + "&filter=" + 'ActivePositions' +'&selectjob=' +'TotalActiveJobs' +"&tabIndex=" +0;
    }
    else if (this.usertype == 'JOBS') {
    return baseUrl + this.jobSummery +"?jobId="+ Id + "&workflowId="+ this.jobDetailsWorkflowId + "&filter=" + 'ActivePositions' +'&selectjob=' +'TotalActiveJobs' +"&tabIndex=" +0;
    }
    else if (this.usertype == 'CONT') {
      return baseUrl + this.contactSummery + "?ContactId=" + Id;
    }  else if (this.usertype == 'EMPL') {
      return baseUrl + this.employeeSummery + "?CandidateId=" + this.currentUserId + "&employeeType=" + relatedTo;
    }
     
    }
// onUpdate function for update data
  onUpdate(value) {    
    localStorage.removeItem('redirectContactId');
    let toUpdatejson = {};
    let fromJson = {};
    // this.decimalhour = this.millisecondForMinut + this.millisecondForSecond;
    let cureentUserName = this.currentUser?.FirstName + ' ' + this.currentUser?.LastName;
    this.formattedDate = this.datePipe.transform(value?.DateStart, 'yyyy-MM-dd')!;
    let hours = this.TimeStartValue.getHours();
    let minutes = this.TimeStartValue.getMinutes();
    let seconds = this.TimeStartValue.getSeconds();
    const combinedTime = `${hours}:${minutes}:${seconds}`;
    const combinedDateTime = `${this.formattedDate}T${combinedTime}`;
       const formattedDate = this.formatDate(combinedDateTime);
       // Create a Date object from the formatted date string
       const dateObj = new Date(formattedDate);
       // Check if the date object is valid
       if (isNaN(dateObj.getTime())) {
         console.error('Invalid Date');
       } else {
         // Convert to UTC format using toISOString
         this.utcDate = dateObj.toISOString();
       }
    // let localstartDate = this.formatDateToUTC(d);     
    toUpdatejson['SaveTo'] = this.data?.usertype;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['SaveToId'] = this.SaveToId;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['CategoryId'] = this.addCallForm.value?.CategoryId ? this.addCallForm.value?.CategoryId : 0;
    toUpdatejson['CategoryName'] = this.CategoryName ? this.CategoryName : '';
    toUpdatejson['StartDate'] =  this.utcDate;
    toUpdatejson['FromId'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.selectedRelatedUserEndCaller?.Id : this.currentUserId;
    toUpdatejson['FromName'] =  this.callType.toLocaleLowerCase() == 'incoming' ? this.selectedRelatedUserEndCaller?.Name : cureentUserName,
    toUpdatejson['ToId'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserId : this.selectedRelatedUserEndCaller?.Id;
    toUpdatejson['ToName'] = this.callType.toLocaleLowerCase() == 'incoming' ? cureentUserName : this.selectedRelatedUserEndCaller?.Name;
    toUpdatejson['CallType'] = this.callType;
    toUpdatejson['RelatedTo'] = this.ForDetailsUrl;
    toUpdatejson['DetailsId'] = this.addCallForm.value?.SecondRelatedUserId;
    toUpdatejson['DetailsName'] = this.SecondselectedRelatedUser?.Name;
    toUpdatejson['Notes'] = this.IsNotes==0?'':this.addCallForm.value?.NotesDiscription?.trim(),
    toUpdatejson['Duration'] = this.decimalhour;
    toUpdatejson['IsNotes'] = this.IsNotes;
    toUpdatejson['Source'] = this.addCallForm.value?.SourcDescription?.trim();
    toUpdatejson['callId'] = this.callId;
    toUpdatejson['NotesURL'] = 'Notes';
    toUpdatejson['SaveToName'] = this.saveToName;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['SaveToSummaryURL'] =this.SaveToSummeryUrl;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['EndCallerTypeCode'] = this.ChangeAEndCaller;
    toUpdatejson['SaveToPhoneNumber'] = this.data?.PhoneNumber?this.data?.PhoneNumber:'';
    toUpdatejson['CallStatusId'] = this.addCallForm.value?.CallStatusId ? this.addCallForm.value?.CallStatusId : null;
    toUpdatejson['CallStatus'] = this.addCallForm.value?.CallStatus ? this.addCallForm.value?.CallStatus : '';

    toUpdatejson['FromSummaryURL'] = this.callType.toLocaleLowerCase()=='incoming' ?this.viewJobSummery(this.contctIdrEndCaller,this.ChangeAEndCaller) : this.viewJobSummery(this.currentUserId,'EMPL');
    toUpdatejson['ToSummaryURL'] = this.callType.toLocaleLowerCase()=='incoming' ? this.viewJobSummery(this.currentUserId,'EMPL') : this.viewJobSummery(this.contctIdrEndCaller,this.ChangeAEndCaller);
    toUpdatejson['DetailsSummaryURL'] = this.viewJobSummery(this.contactIdForUrl,this.ForDetailsUrl),
    toUpdatejson['ToProfileImage'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserProfileImage: this.profileImageURL?this.profileImageURL:'';
    toUpdatejson['FromProfileImage'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.profileImageURL?this.profileImageURL:'' : this.currentUserProfileImage;
    toUpdatejson['ToProfileImageUrl'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.ToProfileImageUrl?this.ToProfileImageUrl:'': this.profileImageURL?this.profileImageURL:'';
    toUpdatejson['FromProfileImageUrl'] = this.callType.toLocaleLowerCase() == 'incoming' ?this.profileImageURL? this.profileImageURL:'':'';
   
    fromJson['SaveTo']=this.data?.usertype;
    fromJson['SaveToId']=this.SaveToId;
    fromJson['CategoryId']=this.CategoryId
    fromJson['CategoryName']=this.CategoryName;
    fromJson['StartDate']=this.fromUtcDate;
    fromJson['FromId']=this.FromId;
    fromJson['FromName']= this.FromName;
    fromJson['ToId']=this.ToId;
    fromJson['ToName']=this.ToName;
    fromJson['CallType']=this.callTypedata;
    fromJson['RelatedTo']=this.addCallForm.value?.SecondRelatedUserType!='' && this.addCallForm.value?.SecondRelatedUserType != undefined ? this.addCallForm.value?.SecondRelatedUserType : null,
    fromJson['DetailsId']=this.addCallForm.value?.SecondRelatedUserId;
    fromJson['DetailsName']=this.SecondselectedRelatedUser?.Name;
    fromJson['Notes']=this.getEditorValForFrom;
    fromJson['Duration']=this.decimalhour;
    fromJson['IsNotes']=this.fromIsNotes;
    fromJson['Source']=this.addCallForm.value?.SourcDescription?.trim();
    fromJson['callId']= this.callId;
    fromJson['NotesURL'] = 'Notes';
    fromJson['SaveToName'] = this.saveToName;
    fromJson['EndCallerTypeCode'] = this.ChangeAEndCaller;
    fromJson['SaveToSummaryURL'] = this.SaveToSummeryUrl;
    fromJson['FromSummaryURL'] =this.FromURl;
    fromJson['ToSummaryURL'] =this.ToUrl;
    fromJson['DetailsSummaryURL'] = this.DetailsURL;
    fromJson['ToProfileImage'] = this.ToProfileImage
    fromJson['ToProfileImageUrl'] = this.ToProfileImageUrl;
    fromJson['FromProfileImage'] = this.fromImagedata;
    fromJson['FromProfileImageUrl'] = this.FromProfileImageUrl;
    fromJson['SaveToPhoneNumber'] = this.data?.PhoneNumber?this.data?.PhoneNumber:'';
    fromJson['CallStatusId'] = this.addCallForm.value?.CallStatusId ? this.addCallForm.value?.CallStatusId : null;
    fromJson['CallStatus'] = this.addCallForm.value?.CallStatus ? this.addCallForm.value?.CallStatus : '';
    let updateTeamjson = {
       "From": fromJson,
       "To": toUpdatejson
     }
    this.candidateService.candidateVxtUpdateCall(updateTeamjson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addCallForm.reset();
          this.isResponseGet=false;

          document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        } else {
         this.isResponseGet=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.isResponseGet=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  onDismiss(): void {
    document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }



  openImageUpload(): void {
    const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
      data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
      panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.loading = true;
        if (res.event === 1) {
          this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
            this.editor.exec('insertImage', res);
            this.loading = false;
          })
        }
        else {
          this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
            this.editor.exec('insertImage', res);
            this.loading = false;
          })
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe();
  }
  //who:maneesh,what:ewm-16207 ewm-16673 for new speech editor,when:14/03/2024
  getEditorFormInfo(event) {
    this.ownerList = event?.ownerList;
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));

    if (sources == undefined && event?.val == null) {
      this.getNotesDetails = event?.val; 
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    }
    else if (sources == undefined && event?.val == ' ' ) {
      this.getNotesDetails = event?.val;
      this.editorConfig = {
        REQUIRED: true,
        DESC_VALUE: null,
        PLACEHOLDER: 'label_Vxt_Notes_Discription',
        Tag: [],
        EditorTools: [],
        MentionStatus: false,
        maxLength: 0,
        MaxlengthErrormessage: false,
        JobActionComment: false,
        hideIconForAddCommonCallLog:true 
      }
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
      // this.addCallForm.get("NotesDiscription").markAsDirty();
      this.resetEditorValue.next(this.editorConfig);

    }
    else if (sources == undefined && event?.val == '' ) {
      this.getNotesDetails = event?.val;
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    } else if (sources != undefined && event?.val != '' && event?.val != ' ') {
      this.showMaxlengthError = false;
      this.getNotesDetails = event?.val;
      this.addCallForm.get('NotesDiscription').setValue(event?.val);
      this.addCallForm.get('NotesDiscription').clearValidators();
      this.addCallForm.get('NotesDiscription').markAsPristine();
    } else if (event?.val != '' && event?.val != ' ') {
      this.showMaxlengthError = false;
      this.getNotesDetails = event?.val;
      this.addCallForm.get('NotesDiscription').setValue(event?.val);
      this.addCallForm.get('NotesDiscription').clearValidators();
      this.addCallForm.get('NotesDiscription').markAsPristine();
    }
  }


  getEditorImageFormInfo(event) {
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
    this.showMaxlengthError = false;
    const regex = /<(?!img\s*\/?)[^>]+>/gi;
    if (sources == undefined && event?.val == null) {
      this.getNotesDetails = event?.val;
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    }
    else if (sources == undefined && event?.val == '') {
      this.getNotesDetails = event?.val;
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    } else if (sources != undefined && event?.val != '' && event?.val != ' ') {
      this.showMaxlengthError = false;
      this.getNotesDetails = event?.val;
      this.addCallForm.get('NotesDiscription').setValue(event?.val);
      this.addCallForm.get('NotesDiscription').clearValidators();
      this.addCallForm.get('NotesDiscription').markAsPristine();
    } else if (event?.val != '' &&  event?.val != ' ') {
      this.showMaxlengthError = false;
      this.getNotesDetails = event?.val;
      this.addCallForm.get('NotesDiscription').setValue(event?.val);
      this.addCallForm.get('NotesDiscription').clearValidators();
      this.addCallForm.get('NotesDiscription').markAsPristine();
    }
  }
  editConfigRequired() {
    this.editorConfig = {
      REQUIRED: true,
      DESC_VALUE: null,
      PLACEHOLDER: 'label_Vxt_Notes_Discription',
      Tag: [],
      EditorTools: [],
      MentionStatus: false,
      maxLength: 0,
      MaxlengthErrormessage: false,
      JobActionComment: false,
      hideIconForAddCommonCallLog:true 
    }
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.addCallForm.get('NotesDiscription').updateValueAndValidity();
    this.addCallForm.get("NotesDiscription").markAsTouched();
  }
  editConfigmaxlength() {
    this.editorConfig = {
      REQUIRED: false,
      DESC_VALUE: null,
      PLACEHOLDER: 'label_Vxt_Notes_Discription',
      Tag: [],
      EditorTools: [],
      MentionStatus: false,
      maxLength: 0,
      MaxlengthErrormessage: true,
      JobActionComment: false,
      hideIconForAddCommonCallLog:true 
    }
    this.showMaxlengthError = true;
    this.maxLengthEditorValue.next(this.editorConfig);
    this.addCallForm.get('NotesDiscription').updateValueAndValidity();
    this.addCallForm.get("NotesDiscription").markAsTouched();
  }


  ShowOnlyImportantFilter(event: any) {
    if (event.checked) {
      this.ShowEditor = true;
      this.IsNotes = 1;
      // this.CategoryId='';
      // this.selectedCategory = {};
      this.dropDownStatusConfig['IsRequired'] = true;
      this.addCallForm.get("NotesDiscription").setErrors({ required: true });
      this.addCallForm.get("NotesDiscription").markAsTouched();
      this.addCallForm.get("NotesDiscription").markAsDirty();
      if (this.addCallForm.get("CategoryId").value==0 || this.CategoryId==undefined) {
        this.addCallForm.get("NotesCategry").setErrors({ required: true });
        this.addCallForm.get("NotesCategry").markAsTouched();
        this.addCallForm.get("NotesCategry").markAsDirty();
        this.addCallForm.get("CategoryId").setErrors({ required: true });
        this.addCallForm.get("CategoryId").markAsTouched();
        this.addCallForm.get("CategoryId").markAsDirty();
      }
      else if(!this.addCallForm.get("NotesDiscription").value){
        this.addCallForm.get("NotesDiscription").setErrors({ required: true });
        this.addCallForm.get("NotesDiscription").markAsTouched();
        this.addCallForm.get("NotesDiscription").markAsDirty();
      }
        else{
        this.addCallForm.get("NotesCategry").clearValidators();
        this.addCallForm.get("NotesCategry").markAsPristine();
        this.addCallForm.get('NotesCategry').updateValueAndValidity();

        this.addCallForm.get("CategoryId").clearValidators();
        this.addCallForm.get("CategoryId").markAsPristine();
        this.addCallForm.get('CategoryId').updateValueAndValidity();

        this.addCallForm.get("NotesDiscription").clearValidators();
        this.addCallForm.get("NotesDiscription").markAsPristine();
        this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      }


      if (this.IsActive == 'Edit' && this.getNotesDetails!=null) {
        this.getEditorVal = this.getNotesDetails;
        this.editConfigRequired();
        this.addCallForm.patchValue({
          NotesDiscription: this.getNotesDetails,
          CategoryId: this.CategoryId==undefined?0:this.CategoryId
        })
        if (this.CategoryId==0 || this.CategoryId==undefined) {
        this.selectedCategory = {}; 
        this.dropDownStatusConfig['IsRequired'] = true;
        this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
        }else{
          this.selectedCategory = { 'Id': this.CategoryId };   
          this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
        }

        this.getRequiredValidationMassage.next(this.editorConfig);
        this.addCallForm.get('NotesDiscription').updateValueAndValidity();
        this.addCallForm.get("NotesDiscription").markAsTouched();

      }else{
        this.addCallForm.patchValue({
          CategoryId: this.CategoryId,
          NotesDiscription:this.getNotesDetails
        })
        if (this.CategoryId==0 || this.CategoryId==undefined) {
          this.selectedCategory = {}; 
          this.dropDownStatusConfig['IsRequired'] = true;
          this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
          }else{
            this.selectedCategory = { 'Id': this.CategoryId };   
            this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
          }
        // this.selectedCategory = { 'Id': this.CategoryId };
        this.getEditorVal = this.getNotesDetails;
        // this.resetFormSubjectStatus.next(this.dropDoneConfig);
        this.getRequiredValidationMassage.next(this.editorConfig);
        this.addCallForm.get('NotesDiscription').updateValueAndValidity();
        this.addCallForm.get("NotesDiscription").markAsTouched();
      }

      if (this.getNotesDetails=='' || this.getNotesDetails==undefined ||  this.getNotesDetails==null ) {
      this.addCallForm.get("NotesDiscription").setErrors({ required: true });
      this.addCallForm.get("NotesDiscription").markAsTouched();
      this.addCallForm.get("NotesDiscription").markAsDirty();
      this.getRequiredValidationMassage.next(this.editorConfig);
         }
    } else {
      this.ShowEditor = false;
      this.IsNotes = 1;
      this.addCallForm.get("NotesDiscription").clearValidators();
      this.addCallForm.get("NotesDiscription").markAsPristine();
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesCategry").clearValidators();
      this.addCallForm.get("NotesCategry").markAsPristine();
      this.addCallForm.get('NotesCategry').updateValueAndValidity();

      this.addCallForm.get("DateStart").clearValidators();
      this.addCallForm.get("DateStart").markAsPristine();
      this.addCallForm.get('DateStart').updateValueAndValidity();
      this.addCallForm.get("TimeStart").clearValidators();
      this.addCallForm.get("TimeStart").markAsPristine();
      this.addCallForm.get('TimeStart').updateValueAndValidity();

      this.addCallForm.get("RelatedUserType").clearValidators();
      this.addCallForm.get("RelatedUserType").markAsPristine();
      this.addCallForm.get('RelatedUserType').updateValueAndValidity();
      this.addCallForm.get("CategoryId").clearValidators();
      this.addCallForm.get("CategoryId").markAsPristine();
      this.addCallForm.get('CategoryId').updateValueAndValidity();

    }
  }

  onHideMoreField(el) {
    this.hideMoreFields = !this.hideMoreFields;
    if (this.showReferenceId || this.showStartDate || this.showExpiryDate) {
      this.showReferenceId = false;
      this.showStartDate = false;
      this.showExpiryDate = false;
    }
  this.goDown2(); //for scroll 
}
 goDown2() {
       setTimeout(() => {
         document.getElementById("targetGreen").scrollIntoView({
           behavior: "smooth",
           block: "start",
           inline: "nearest"
         });
   }, 100);

 }
  CallHistrydata(type) {
    if (type == 'Incoming') {
      this.callType = type;
      this.showOutGoingCallData = true;
      this.showIncommingCallData = false;
    } else {
      this.callType = type;
      this.showIncommingCallData = true;
      this.showOutGoingCallData = false;
    }
  }

  clearEndDate(e) {
    this.addCallForm.patchValue({
      DateStart: null
    });
    this.addCallForm.get("DateStart").setErrors({ required: true });
    this.addCallForm.get("DateStart").markAsTouched();
    this.addCallForm.get("DateStart").markAsDirty();
    this.MaxDate=new Date();
  }

  onToggleDateAndTime(): void {
    let x = document.getElementById('DateAndTime') as HTMLElement | null;
    let y = document.getElementById('fadeButton') as HTMLElement | null;
    x.classList.toggle('showDateAndTime')
    if (x?.classList.contains('showDateAndTime')) {
      x.classList.remove("out");
      x.classList.add("active");
      x.style.display = 'block';
      y.classList.add('btnActive');
      this.dateAndTimeToggle = true;
    }
    else {
      x.classList.add("out");
      x.classList.remove("active");
      x.style.display = 'none';
      y.classList.remove('btnActive');
      this.dateAndTimeToggle = false;
    }
  }

  addDateStart(event) {
    let DateStart = this.appSettingsService.getUtcDateFormat(this.addCallForm.get("DateStart").value);
    //this.EndDateMin = new Date(DateStart);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
    this.addCallForm.patchValue({
      DateEnd: DateStart
    });
    this.isDateEnd = false;

  }

  handleChangeStartTime(e: any) {
    if (e == null) {
      return false;
    }
    let date = new Date(e);
    let mnth: any = ("0" + (date.getMonth() + 1)).slice(-2);
    let day: any = ("0" + date.getDate()).slice(-2);
    let DateEnd = this.appSettingsService.getUtcDateFormat([date.getFullYear(), mnth, day].join("-"));
    this.TimeStartValue = new Date(date.getFullYear(), mnth, day, date.getHours(), date.getMinutes(), 0);
    this.TimeEndValue = new Date(date.getFullYear(), mnth, day, date.getHours() + 1, date.getMinutes(), 0);
    this.addCallForm.patchValue({
      TimeStart: new Date(this.TimeStartValue).toString().slice(16, 21),
      TimeEnd: new Date(this.TimeEndValue).toString().slice(16, 21),
    });
    this.isStartTmeRequired = false;
  }


  onChangeEndTime() {
    let getStartTimeHM: any = new Date(this.TimeStartValue).toString().slice(16, 21);
    let getEndTimeHM: any = new Date(this.TimeEndValue).toString().slice(16, 21);
    let local_startDate = moment.utc(this.addCallForm.get("DateStart").value).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(this.addCallForm.get("DateEnd").value).local().format('YYYY-MM-DD');

    if (local_startDate == local_endDate) {
      const date1 = new Date('2023-01-01 ' + getStartTimeHM);
      const date2 = new Date('2023-01-01 ' + getEndTimeHM);
      if (date2.getTime() > date1.getTime()) {
        this.isMinTimeCondotion = false;
      }
      else {
        this.isMinTimeCondotion = true;
      }
    } else {
      this.isMinTimeCondotion = false;
    }
    this.isStartTmeRequired = false;
    this.isEndTmeRequired = false;
  }
  clearStartTime() {
    this.TimeStartValue = "";
    this.TimeEndValue = "";
    this.addCallForm.patchValue({
      TimeStart: "",
      TimeEnd: "",
    });
    this.isEndTmeRequired = true;
    this.isStartTmeRequired = true;
  }

  timevalue() {
    let array = 999;
    for (let index = 1; index <= array; index++) {
      this.timeValue.push({
        number: index
      });
    }

    let second = 59;
    for (let index = 1; index <= second; index++) {
      this.timeValueForSecond.push({
        number: index
      });
    }
  }

  onChangeminut(e, type) {
    if (type == 'minut') {
      this.minut = e;
      this.millisecondForMinut = e * 60000;

    } else {
      this.second = e;
      this.millisecondForSecond = e * 1000;
    }
    this.decimalhour=this.millisecondForMinut + this.millisecondForSecond;

  }
  onChangeSecond(e) {
    this.second = e;
  }
  onChangeActivityRelatedTo(activityFor) {
    this.selectedRelatedUser = null;
    this.activityForAttendees = activityFor;
    this.redirectUsertype=activityFor;
    if (activityFor == "JOB") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Job'
      })
    } else if (activityFor == "CAND") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Candidate'
      })
    } else if (activityFor == "EMPL") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Employee'
      })
    } else if (activityFor == "CLIE") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Client'
      })
    } else {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': '',
      })
      this.ActivityTypeList = [];
    }

  }
  CallUserType:boolean=false;
  onChangeActivityRelatedToSecond(activityFor) {
    if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValue='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValue='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValue='EmailId';  
      }
      this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = this.extraBindValue;
    this.CallUserType=false;
    this.activityFor = activityFor;
    this.ForDetailsUrl=activityFor;
    this.SecondselectedRelatedUser = null;
    this.addCallForm.patchValue({
      SecondRelatedUserUserName: ''
    })
    if (activityFor == null || activityFor == undefined) {
      this.addCallForm.get("RelatedUserId").clearValidators();
      this.addCallForm.get("SecondRelatedUserUserName").clearValidators();

      this.addCallForm.get("RelatedUserId").markAsPristine();
      this.addCallForm.get("SecondRelatedUserUserName").markAsPristine();
      this.common_DropdownC_Config_Details = {
        API: '',
        MANAGE: '',
        BINDBY: 'Name',
        REQUIRED: false,
        DISABLED: true,
        PLACEHOLDER: 'label_Vxt_Save_To_Name',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: '',
        IMG_BIND_VALUE: 'ProfilePicturePreview',
        FIND_BY_INDEX: 'Id'
      }
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
      this.CallUserType=true;

    } else {
      this.common_DropdownC_Config_Details.DISABLED = false;
      this.common_DropdownC_Config_Details.REQUIRED = true;
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
      // this.common_DropdownC_Config_Details = {
      //   API: '',
      //   MANAGE: '',
      //   BINDBY: 'Name',
      //   REQUIRED: true,
      //   DISABLED: false,
      //   PLACEHOLDER: 'Details',
      //   SHORTNAME_SHOW: false,
      //   SINGLE_SELECETION: true,
      //   AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      //   IMG_SHOW: false,
      //   EXTRA_BIND_VALUE: '',
      //   IMG_BIND_VALUE: '',
      //   FIND_BY_INDEX: 'Id'
      // }
      if (activityFor == "JOB") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Job',
          'SecondRelatedUserType':  this.activityFor
  
        })
      } else if (activityFor == "CAND") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Candidate',
          'SecondRelatedUserType':  this.activityFor
  
        })
      } else if (activityFor == "EMPL") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Employee',
          'SecondRelatedUserType':  this.activityFor
  
        })
      } else if (activityFor == "CLIE") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Client',
          'SecondRelatedUserType':  this.activityFor
        })
      } else if (activityFor == "CONT") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Client',
          'SecondRelatedUserType':  this.activityFor
        })
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config_Details.IMG_SHOW = true;
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = true;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = this.extraBindValue;
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
      }
       else {
        this.addCallForm.patchValue({
          'SecondRelatedUserTypeName': '',
          'SecondRelatedUserType': ''
  
        })
        this.ActivityTypeList = [];
      }

    }

    if (this.addCallForm.get('SecondRelatedUserType').value != '' && this.addCallForm.get('SecondRelatedUserType').value != null && this.addCallForm.get('SecondRelatedUserType').value != undefined) {
      this.addCallForm.get("SecondRelatedUserUserName").setErrors({ required: true });
      this.addCallForm.get("SecondRelatedUserId").markAsTouched();
      this.addCallForm.get("SecondRelatedUserId").markAsDirty();
    }
  }


  checkRelatedType(activityFor) {
    switch (activityFor) {
      case "JOB": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllJobForActivityV2;
        this.common_DropdownC_Config.MANAGE = './client/core/job/landing';
        this.common_DropdownC_Config.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValue;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End 
        break;
      }
      case "CAND": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllCandidateForActivity_v2;
        this.common_DropdownC_Config.MANAGE = './client/cand/candidate/candidate-list';
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValue;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End 
        break;
      }
      case "EMPL": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllEmployeeForActivity_v2;
        this.common_DropdownC_Config.MANAGE = './client/emp/employees/employee-list';
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End 
        break;
      }
      case "CLIE": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllClientForActivity;
        this.common_DropdownC_Config.MANAGE = './client/core/clients/client-dashboard';
        this.common_DropdownC_Config.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValue;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End
        break;
      }
      case "CONT": {

        this.common_DropdownC_Config_Details.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValue;
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End
        break;
      }

      default: {
        this.common_DropdownC_Config.API = '';
        this.common_DropdownC_Config.MANAGE = '';
        // End 

        break;
      }
    }
  }

  SecondcheckRelatedType(activityFor) {
    if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValue='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValue='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValue='EmailId';  
      }
    this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = this.extraBindValue;
    if (activityFor == null || activityFor == undefined) {
      this.addCallForm.get("RelatedUserId").clearValidators();
      this.addCallForm.get("SecondRelatedUserUserName").clearValidators();

      this.addCallForm.get("RelatedUserId").markAsPristine();
      this.addCallForm.get("SecondRelatedUserUserName").markAsPristine();
      this.common_DropdownC_Config_Details = {
        API: '',
        MANAGE: '',
        BINDBY: '',
        REQUIRED: false,
        DISABLED: false,
        PLACEHOLDER: 'label_Vxt_Save_To_Name',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: '',
        IMG_BIND_VALUE: 'ProfilePicturePreview',
        FIND_BY_INDEX: 'Id'
      }
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
    }
    switch (activityFor) {
      case "JOB": {
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getAllJobForActivityV2;
        this.common_DropdownC_Config_Details.MANAGE = './client/core/job/landing';
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.IMG_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End 
        break;
      }
      case "Job": {
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getAllJobForActivityV2;
        this.common_DropdownC_Config_Details.MANAGE = './client/core/job/landing';
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.IMG_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End 
        break;
      }
      case "CAND": {
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getAllCandidateForActivity_v2;
        this.common_DropdownC_Config_Details.MANAGE = './client/cand/candidate/candidate-list';
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = true;
        this.common_DropdownC_Config_Details.IMG_SHOW = true;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End 
        break;
      }
      case "CLIE": {
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getAllClientForActivity;
        this.common_DropdownC_Config_Details.MANAGE = './client/core/clients/client-dashboard';
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.IMG_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End
        break;
      }
      case "CONT": {
        this.common_DropdownC_Config_Details = {
          API: '',
          MANAGE: '',
          BINDBY: 'Name',
          REQUIRED: false,
          DISABLED: false,
          PLACEHOLDER: 'label_Vxt_Save_To_Name',
          SHORTNAME_SHOW: false,
          SINGLE_SELECETION: true,
          AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
          IMG_SHOW: false,
          EXTRA_BIND_VALUE: '',
          IMG_BIND_VALUE: 'ProfilePicturePreview',
          FIND_BY_INDEX: 'Id'
        }
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config_Details.IMG_SHOW = true;
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = true;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = this.extraBindValue;
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End
        break;
      }

      default: {
        this.common_DropdownC_Config_Details.API = '';
        this.common_DropdownC_Config_Details.MANAGE = '';
        // End 
        this.SecondselectedRelatedUser = null;
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);

        break;
      }
    }
  }

  onRelatedUserchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedRelatedUser = null;
      this.addCallForm.patchValue(
        {
          RelatedUserId: null,
          RelatedUserUserName: '',
        });
      this.addCallForm.get("RelatedUserId").setErrors({ required: true });
      this.addCallForm.get("RelatedUserId").markAsTouched();
      this.addCallForm.get("RelatedUserId").markAsDirty();
      this.requiredAttendeesList = [];
    }
    else {
      this.addCallForm.get("RelatedUserId").clearValidators();
      this.addCallForm.get("RelatedUserId").markAsPristine();
      if (this.redirectUsertype=='CONT') {
        this.addCallForm.patchValue({
          RelatedUserId: data?.Id,
          RelatedUserUserName: data?.Name
        })
      this.selectedRelatedUser = {Id:data.ContactId,Name:data.Name};
      this.contactId = data?.Id;

      }else{
      this.selectedRelatedUser = data;
        this.addCallForm.patchValue({
          RelatedUserId: data?.Id,
          RelatedUserUserName: data?.Name
        })
      }
    }


  }

  SecondOnRelatedUserchange(data,value) {
    if (data == null || data == "" || data.length == 0) {
      this.SecondselectedRelatedUser = null;
      this.addCallForm.patchValue(
        {
          RelatedUserId: null,
          RelatedUserUserName: '',
        });
      this.addCallForm.get("SecondRelatedUserId").setErrors({ required: true });
      this.addCallForm.get("SecondRelatedUserId").markAsTouched();
      this.addCallForm.get("SecondRelatedUserId").markAsDirty();
      this.requiredAttendeesList = [];
    }
    else {
      this.addCallForm.get("SecondRelatedUserId").clearValidators();
      this.addCallForm.get("SecondRelatedUserId").markAsPristine();
if (this.ForDetailsUrl=='CONT' || this.activityFor=='CONT') {
  this.SecondselectedRelatedUser = { 'Id': data?.ContactId, 'Name': data?.FullName };
  this.common_DropdownC_Config_Details = {
    API: this.serviceListClass.getClientsContact,
    MANAGE: '',
    BINDBY: 'Name',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_Vxt_Save_To_Name',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE: 'ProfilePicturePreview',
    FIND_BY_INDEX: 'Id'
  }
  // this.SecondselectedRelatedUser = { 'Id': data?.Id, 'Name': data?.Name };
  this.addCallForm.patchValue({
    SecondRelatedUserId: data?.ContactId,
    SecondRelatedUserUserName: data?.FullName,
  })
  if (localStorage.getItem('contctIdForUrlJ')!=null && localStorage.getItem('contctIdForUrlJ')!=undefined && localStorage.getItem('contctIdForUrlJ')!='' && value=='true') {
    this.SecondselectedRelatedUser = { 'Id': data?.Id, 'Name': data?.Name };

    this.contactIdForUrl= localStorage.getItem('contctIdForUrlJ'); 
    }else{
    this.SecondselectedRelatedUser = { 'Id': data?.ContactId, 'Name': data?.Name };
    this.contactIdForUrl=data?.Id;
    localStorage.setItem('contctIdForUrlJ',data?.Id)
  
    }
    this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
  // this.contactIdForUrl=data?.Id;
}else{
  this.contactIdForUrl=data?.Id;
  this.SecondselectedRelatedUser = data;
  this.addCallForm.patchValue({
    SecondRelatedUserId: data?.Id,
    SecondRelatedUserUserName: data?.Name,
    // SecondRelatedUserType:data?.Name
  })
}
      this.addCallForm.get("SecondRelatedUserUserName").clearValidators();
      this.addCallForm.get("SecondRelatedUserUserName").markAsPristine();
    }
  }

  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 25 - value?.length;
      if (value?.length > 25) {
        this.addCallForm.get('SourcDescription').markAsTouched();
        this.addCallForm.get('SourcDescription').setErrors({ maxlength: true });
      }
    }
  }

  openDynamicFilterArea() {
    // this.dynamicFilterArea = true;
    this.dynamicFilterArea = !this.hideRuleContent;
    this.hideRuleContent = !this.hideRuleContent;
  }

  closeDynamicFilterArea() {
    this.dynamicFilterArea = false;
  }




  getVxtLastCallDetails(Id,ChangeAEndCaller) {
    this.getVxtLastCallDetail = this.candidateService?.getVxtLastCallDetails('?id=' + Id + '&usertype=' + ChangeAEndCaller)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridList = data.Data;
            this.LastCallToSortName = this.gridList?.ToSortName;
            this.lastcallToName = this.gridList?.ToName;
            this.lastcallFromSortName = this.gridList?.FromSortName;
            this.lastcallFromName = this.gridList?.FromName;
            this.lastcallToProfileImageUrl = this.gridList?.ToProfileImageUrl;
            this.lastcallToFromProfileImageUrl = this.gridList?.FromProfileImageUrl;
            this.lastcallNotesDiscription = this.gridList?.Notes;            
            const timestamp = this.gridList?.Date;
            const date = new Date(timestamp);
            let currentDa = new Date(this.gridList?.Date);
            let nowTime = new Date(currentDa.getTime());
            this.lastcallTime = nowTime;
            let local_startDate = this.commonserviceService.getUtCToLocalDate(date);
            this.lastcallDate = local_startDate;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
          }
          else {
            this.gridList = data.Data;
          }
        }, err => {

        });

  }

  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }

getDropdownForRadiobtn(){
    this.common_DropdownC_Config_Details = {
      API: '',
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_Vxt_Save_To_Name',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: 'ProfilePicturePreview',
      FIND_BY_INDEX: 'Id'
    }
  }
  RelatedUserForRadiobtnUserchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.RelatedUserForRadiobtn = null;
        }
    else {
      this.RelatedUserForRadiobtn = data;
      this.RelatedUserForRadiobtnUserDrp.next(this.common_DropdownC_Config_DetailsRadioBtn);

    }
  }
  onChangeAEndCaller(activityFor) {  
    if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValueEndcaller='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValueEndcaller='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValueEndcaller='EmailId';  
      }
      this.common_DropdownC_ConfigEndCaller.EXTRA_BIND_VALUE = this.extraBindValueEndcaller;  
    this.selectedRelatedUserEndCaller = null;
    this.reletedcatgry=true;
    this.activityForAttendees = activityFor;
      this.ChangeAEndCaller=activityFor;
      this.addCallForm.patchValue({
        'SecondRelatedUserType': '',
      });
      this.addCallForm.get("RelatedUserId").clearValidators();
      this.addCallForm.get("SecondRelatedUserUserName").clearValidators();

      this.addCallForm.get("RelatedUserId").markAsPristine();
      this.addCallForm.get("SecondRelatedUserUserName").markAsPristine();
      this.common_DropdownC_Config_Details = {
        API: '',
        MANAGE: '',
        BINDBY: 'Name',
        REQUIRED: false,
        DISABLED: true,
        PLACEHOLDER: 'label_Vxt_Save_To_Name',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: '',
        IMG_BIND_VALUE: 'ProfilePicturePreview',
        FIND_BY_INDEX: 'Id'
      }
      this.SecondselectedRelatedUser=null;
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
      if (activityFor==null || activityFor==undefined) {
        this.common_DropdownC_ConfigEndCaller = {
          API: '',
          MANAGE: '',
          BINDBY: '',
          REQUIRED: true,
          DISABLED: true,
          PLACEHOLDER: 'label_Vxt_End_Caller_Name',
          SHORTNAME_SHOW: false,
          SINGLE_SELECETION: true,
          AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
          IMG_SHOW: true,
          EXTRA_BIND_VALUE: '',
          IMG_BIND_VALUE: 'ProfilePicturePreview',
          FIND_BY_INDEX: 'Id'
        } 
        this.selectedRelatedUserEndCaller=null;
        this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
      }
      if (activityFor == "JOB") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': 'Job',
        })
      } else if (activityFor == "CAND") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': activityFor
        })
      } else if (activityFor == "EMPL") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': activityFor
        })
      } else if (activityFor == "CLIE") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': activityFor
        })
      } else if (activityFor == "CONT") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': activityFor
        })
      } 
      else {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': '',
        })
        this.ActivityTypeList = [];
      }
      if ( this.ChangeAEndCaller=='JOB') {
        this.ChangeAEndCaller='JOBS'; 
      }
  }

  checkRelatedTypeEndCaller(activityFor) {
    if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValueEndcaller='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValueEndcaller='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValueEndcaller='EmailId';  
      }
      this.common_DropdownC_ConfigEndCaller.EXTRA_BIND_VALUE = this.extraBindValueEndcaller; 
    switch (activityFor) {
      case "JOB": {
      this.profileImageData=false;
        this.common_DropdownC_ConfigEndCaller.API = this.serviceListClass.getAllJobForActivityV2;
        this.common_DropdownC_ConfigEndCaller.MANAGE = './client/core/job/landing';
        this.common_DropdownC_ConfigEndCaller.SHORTNAME_SHOW = false;
        this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
        // End 
        break;
      }
      case "CAND": {
      this.profileImageData=false;
        this.common_DropdownC_ConfigEndCaller.API = this.serviceListClass.getAllCandidateForActivity_v2;
        this.common_DropdownC_ConfigEndCaller.MANAGE = './client/cand/candidate/candidate-list';
        this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
        // End 
        break;
      }
      case "CLIE": {
      this.profileImageData=false;
        this.common_DropdownC_ConfigEndCaller.API = this.serviceListClass.getAllClientForActivity;
        this.common_DropdownC_ConfigEndCaller.MANAGE = './client/core/clients/client-dashboard';
        this.common_DropdownC_ConfigEndCaller.SHORTNAME_SHOW = false;
        this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
        // End
        break;
      }
      case "CONT": {
        this.profileImageData=false;
        this.common_DropdownC_ConfigEndCaller.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_ConfigEndCaller.SHORTNAME_SHOW = false;
        this.common_DropdownC_ConfigEndCaller.BINDBY = 'Name';
        this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
        // End
        break;
      }

      default: {
      this.profileImageData=false;
        this.common_DropdownC_ConfigEndCaller.API = '';
        this.common_DropdownC_ConfigEndCaller.MANAGE = '';
        // End 

        break;
      }
    }
  }


  getCatogryDataForCandidate() {
    this.systemSettingService.getAllDataForProfileImage("?pageSize=" + 50).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          let constchangedOb = repsonsedata.Data.filter(x => x?.Id == this.selectedRelatedUserEndCallerData?.Id);
          this.profileImageData=true;
          this.profileName = constchangedOb[0]?.Name;
          this.profileImage = constchangedOb[0]?.ProfilePicturePreview;
          this.profileShortName = constchangedOb[0]?.ShortName;
          this.profileEmail= constchangedOb[0]?.Email;
          this.profilePhonnumber = constchangedOb[0]?.PhoneNumber;
        } 
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  getCatogryDataForClient() {
    this.systemSettingService.getClientDataForProfileImage("?pageSize=" + 50).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          let constchangedOb = repsonsedata.Data.filter(x => x?.Id == this.selectedRelatedUserEndCallerData?.Id);
          this.profileImageData=true;
          this.profileName = constchangedOb[0]?.Name;
          this.profileImage = null;
          this.profileShortName = constchangedOb[0]?.ShortName;
          this.profileEmail= constchangedOb[0]?.Email;
          this.profilePhonnumber = constchangedOb[0]?.PhoneNumber;
        } 
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  getCatogryDataForContact() {
    this.systemSettingService.getContactDataForProfileImage("?pageSize=" + 50).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          let constchangedOb = repsonsedata.Data.filter(x => x?.ContactId == this.selectedRelatedUserEndCallerData?.Id);
          this.profileImageData=true;
          this.profileName = constchangedOb[0]?.Name;
          this.profileImage = constchangedOb[0]?.ProfileImageURL;
          this.profileShortName = constchangedOb[0]?.ShortName;
          this.profileEmail= constchangedOb[0]?.EmailId;
          this.profilePhonnumber = constchangedOb[0]?.PhoneNo;
        } 
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  onRelatedUserchangeEndCaller(data) {  
    this.reletedcatgry=false;
    if (data == null || data == "" || data.length == 0) {
      this.selectedRelatedUserEndCaller = null;
      this.reletedcatgry=true;
      this.addCallForm.patchValue({
        RelatedUserIdEndCaller: data?.Id,
        RelatedUserUserNameEndCaller: data?.Name,
      })
      this.profileImageData=false;
    }
    else {
      this.profileImageData=true;
      this.profileName = data?.Name;
      this.profileImage = data?.ProfilePicturePreview;
      this.profileImageURL = data?.ProfilePicture;
      this.profileShortName = data?.ShortName;
      this.profileEmail= data?.Email;
      this.profilePhonnumber = data?.PhoneNumber;
      if(this.ChangeAEndCaller=='CONT'){
        this.profileName = data?.Name;
        this.profileImage = data?.ProfileImageURL;
        this.profileImageURL = data?.ProfilePicture;
        this.profileShortName = data?.ShortName;
        this.profileEmail= data?.EmailId;
        this.profilePhonnumber = data?.PhoneNo;
        this.selectedRelatedUserEndCaller = {Id:data?.ContactId,Name:data?.Name};
        this.addCallForm.patchValue({
          RelatedUserIdEndCaller: data?.ContactId,
          RelatedUserUserNameEndCaller: data?.Name,
        })
       this.getVxtLastCallDetails(data?.ContactId,this.ChangeAEndCaller);
        if (localStorage.getItem('contctIdrEndCaller')!=null && localStorage.getItem('contctIdrEndCaller')!=undefined && localStorage.getItem('contctIdrEndCaller')!='') {
          // this.selectedRelatedUserEndCaller = { 'Id': data?.Id, 'Name': data?.Name };
          this.contctIdrEndCaller= localStorage.getItem('contctIdrEndCaller'); 
          localStorage.setItem('contctIdrEndCaller',data?.Id)
          // this.fromId=this.contactIdForUrl;
          }else{
          this.contctIdrEndCaller=data?.Id;
          // this.fromId=data?.ContactId;
          localStorage.setItem('contctIdrEndCaller',data?.Id)
          }
        // this.contctIdrEndCaller=data?.Id;
      }else{
        this.contctIdrEndCaller=data?.Id;
        this.selectedRelatedUserEndCaller = data; 
        this.profileImage = data?.ProfilePicturePreview;
        this.profileImageURL = data?.ProfilePicture;
       this.getVxtLastCallDetails(data?.Id,this.ChangeAEndCaller);
        this.addCallForm.patchValue({
          RelatedUserIdEndCaller: data?.Id,
          RelatedUserUserNameEndCaller: data?.Name,
        })
      }
  
    }


  }


  onChangeAEndCallerGetById(activityFor) {
    // this.selectedRelatedUserEndCaller = null;
    this.activityForAttendees = activityFor;
      this.ChangeAEndCaller=activityFor;
      if (activityFor == "JOB") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': 'Job',
        })
      } else if (activityFor == "CAND") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': 'Candidate'
        })
      } else if (activityFor == "EMPL") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': 'Employee'
        })
      } else if (activityFor == "CLIE") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': 'Client'
        })
      } else if (activityFor == "CONT") {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': 'Contact'
        })
      } 
      else {
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': '',
        })
        this.ActivityTypeList = [];
      }
      if ( this.ChangeAEndCaller=='JOB') {
        this.ChangeAEndCaller='JOBS'; 
      }
  }

  ShowIncomingOutgoing(event: any) {
    if (event.checked) {
      this.showOutGoingCallData = true;
      this.showIncommingCallData = false;
      this.callType='Outgoing';
    }
    else {
      this.showOutGoingCallData = false;
      this.showIncommingCallData = true;
      this.callType='Incoming';
    }
  }

  openNewEmailModal(ContactId:string,email: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: { 'contactEmail': true,'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, openDocumentPopUpFor: 'Contact', isBulkEmail: false,'candidateId':ContactId },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
  }


  onCallStatuschange(data) {
    if (data == null || data == "") {
      this.selectedCallStatus = null;
      this.addCallForm.patchValue(
        {
          CallStatusId: null,
          CallStatus: null,
        }
      )
     this.addCallForm.get("CallStatusId").setErrors({ required: true });
     this.addCallForm.get("CallStatusId").markAsTouched();
     this.addCallForm.get("CallStatusId").markAsDirty();
    }
    else {
      this.addCallForm.get("CallStatusId").clearValidators();
      this.addCallForm.get("CallStatusId").markAsPristine();
      this.selectedCallStatus = data;   
      this.addCallForm.patchValue({
        CallStatusId: data?.CallStatusId,
        CallStatus: data?.CallStatus,
      });   
    }
  }
    // this code for max time date validation
    //   datechange(data){
    // let currentTime = new Date();
    // if (new Date(data) < currentTime) {
    // let currentTime = new Date();
    // this.timeAfter5Minutes = new Date(currentTime.getTime() + 5 * 60000);  
    // }else if(new Date(data) == currentTime){
    //   this.timeAfter5Minutes = new Date(currentTime.getTime() + 5 * 60000);  
    // }else{
    // this.timeAfter5Minutes = new Date();  
    // }
    //   }
    // [max]="timeAfter5Minutes"
    // (dateInput)="datechange($event.value)"
}

