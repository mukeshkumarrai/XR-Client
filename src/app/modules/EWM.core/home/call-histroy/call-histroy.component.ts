
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
import { ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { NewEmailComponent } from '../../shared/quick-modal/new-email/new-email.component';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-call-histroy',
  templateUrl: './call-histroy.component.html',
  styleUrls: ['./call-histroy.component.scss']
})
export class CallHistroyComponent implements OnInit {
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
  public getEditorValFrom: string;
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
  public ActivityTypeList: any[] = [];
  public showHideReletedTo: string;
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
  resetRelattedUserDrp: Subject<any> = new Subject<any>();
  SecondresetRelattedUserDrp: Subject<any> = new Subject<any>();
  isNoRecordCategory: boolean = false;
  activityFor: string;
  decimalhour:number;
  timeValue: any = [];
  timeValueForSecond: any = [];
  reletedUsertype:string;
  redirectUsertype: any;
  contactId: any;
  contactSummery = '/client/cont/contacts/contact-detail';
  jobSummery = '/client/jobs/job/job-detail/detail';
  clientSummery = '/client/core/clients/list/client-detail'
  candidateSummery = '/client/cand/candidate/candidate'
  fromSummery = '/client/emp/employees/employee-detail'
  employeeSummery = '/client/emp/employees/employee-detail'
  // /client/emp/employees/employee-detail?CandidateId=d7ea30c1-e9d2-4b22-9dea-29752b1559da&employeeType=EMPL
  usertype:string;
  fromIsNotes: any;
  usertypeData: any;
  contactIdForUrl: any;
  workflowId: any;
  sameActivityFor: any;
  fromDetailsId: any;
  activityForRelatedTo: string;
  fromDetailsName: any;
  fromcontactId: any;
  ToUrl: any;
  FromURl: any;
  DetailsURL: any;
  SaveToSummeryUrl: any;
  fromRelatedTo: any;
  showEndCaller:boolean=false;
  saveTo: any;
  SaveToName: any;
  saveToFromId: any;
  saveToFromName: any;
  EndCallerTypeCode: any='';
  ToId: any;
  SaveToId: any;
  ToNameForFromObj: any;
  ToIdForFromObj: any;
  disabelBtnLastcalldetals:boolean=false;
  isResponseGet:boolean = false;
  CategoryNamegetById: string;
  CategoryIdgetById: any;
  savetoNameFromEdit: string;
  savetoIdFromEdit: any;
  profileName:string;
  profileImage:string;
  profileShortName:string;
  profileEmail:string;
  profilePhonnumber:number;
  profileImageData:boolean;
  callTypedata:string;
  public selectedForProfiledata: any = {};
  public showprofileDataTypeCode: string;
  public extraBindValueEndcaller: string;
  public extraBindValue: string;
  public extraBindValueFirstfield: string;
  public reletedcatgry:boolean=false;
  public MaxDate: any = new Date();
  public timeAfter5Minutes: Date;
  public formattedDate:string;
  public fromUtcDate:string;
  public utcDate:string;
  public currentUserProfileImage:string;
  public profileImageURL:string;
  public fromImagedata:string;
  public FromProfileImageUrl:string;
  public ToProfileImage:string;
  public ToProfileImageUrl:string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private routes: ActivatedRoute, public dialogRef: MatDialogRef<CallHistroyComponent>,
    public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private quickJobService: QuickJobService, private clientService: ClientService, private serviceListClass: ServiceListClass,
    private appSettingsService: AppSettingsService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private datePipe: DatePipe) {
    this.addCallForm = this.fb.group({
      Id: [null],
      CategoryId: ['', Validators.required],
      NotesDiscription: ['', Validators.required],
      NotesCategry: [''],
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      RelatedUserType: [''],
      RelatedUserTypeName: [null, [Validators.required]],
      RelatedUserId: [null],
      RelatedUserUserName: [''],
      SecondRelatedUserType: [null],
      SecondRelatedUserTypeName: [''],
      SecondRelatedUserId: [''],
      SecondRelatedUserUserName: [null],
      SourcDescription: [null, [Validators.maxLength(25)]],
      mins: [null],
      Second: [null],
      RelatedUserTypeEndCaller: [null],
      RelatedUserIdEndCaller: [null],


    });    


    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData;    
    let sortProfileUrl=localStorage.getItem('ProfileUrl')as string;;
    let path = sortProfileUrl?.substring(sortProfileUrl?.indexOf('USER')); // Extract everything starting from "EWM"   
    this.currentUserProfileImage = path;
    this.currentUserId = tenantData?.UserId;
    this.clientshortname = this.data?.ClientSortName;
    if (this.data?.isEdit!='Edit') {
      this.dropDownStatusConfig['IsDisabled'] = true;
      this.dropDownStatusConfig['apiEndPoint'] = ''
      this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
      this.dropDownStatusConfig['searchEnable'] = true;
      this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
      this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
      this.dropDownStatusConfig['IsRequired'] = true;
      this.selectedCategory = null;
      this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
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
    // this.DetailsSummaryURL = this.data?.gridlistData.DetailsSummaryURL;
    // this.FromSummaryURL = this.data?.gridlistData.FromSummaryURL;
    // this.ToSummaryURL = this.data?.ToSummaryURL;
    // this.NotesURL = this.data?.NotesURL;
  }


  ngOnInit() {
    this.IsActive = this.data?.isEdit
    // this.selectedRelatedUser = { 'Id': this.data?.Id, 'Name': this.data?.Name }
    this.Name = this.data?.Name
    this.selectedCategory = {};
    this.timevalue();
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    let currentTime = new Date();
    this.timeAfter5Minutes = new Date(currentTime.getTime() + 5 * 60000);    
    // Create a new Date object based on the current time and add 5 minutes
    this.TimeEndValue = nowTime;
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
    
    if (this.IsActive=='Add') {
      // this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      // this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      // this.addCallForm.get("NotesDiscription").markAsTouched();
      // this.editConfigRequired();
      this.getRequiredValidationMassage.next(this.editorConfig);
    }
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserDetails = currentUser;
    this.userId = currentUser?.UserId;
    this.username = currentUser?.FirstName + ' ' + currentUser?.LastName;  
    this.addCallForm.patchValue({
      RelatedUserUserName: this.data?.Id,
      RelatedUserId: this.data?.Name
    });

    // this.getConfig();
    // this.notesCatogry();

    if (this.data?.isEdit =='Edit' && this.data?.callId) {
      this.callId = this.data?.callId
      this.getVxtCandidateListCallDetailsById(this.data?.callId)
    } else {
      this.addCallForm.patchValue({
        DateStart: this.slotStartDate,
        TimeStart: this.TimeStartValue
      });
    }

    // this.getVxtLastCallDetails();
    this.getConfig();
  }

notesCatogry(){
  if (this.activityFor=='JOB') {
    this.activityFor='JOBS';
  }
  this.selectedCategory = { 'Id': this.CategoryId,CategoryName: this.CategoryName};
  this.dropDownStatusConfig['IsDisabled'] = false;
  this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+this.activityFor + '&FilterParams.ColumnName=StatusName&ByPassPaging=true&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
  this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
  this.dropDownStatusConfig['searchEnable'] = true;
  this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
  this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
  this.dropDownStatusConfig['IsRequired'] = true;
  this.resetFormSubjectStatus.next(this.dropDownStatusConfig);

}
  getVxtCandidateListCallDetailsById(Id) {
    this.loading = true;
    this.candidateService.getVxtCandidateListCallDetailsById(Id).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.CategoryId = repsonsedata.Data?.Id;
          this.profileImageData=true;
          this.fromImagedata=repsonsedata.Data?.FromProfileImage;
          this.FromProfileImageUrl=repsonsedata.Data?.FromProfileImageUrl;
          this.ToProfileImage=repsonsedata.Data?.ToProfileImage;          ;
          this.ToProfileImageUrl=repsonsedata.Data?.ToProfileImageUrl;
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
          this.reletedUsertype= repsonsedata.Data?.RelatedTo;
          this.activityForRelatedTo= repsonsedata.Data?.RelatedTo;
          this.reletedUsertype= repsonsedata.Data?.RelatedTo;
          this.fromRelatedTo=repsonsedata.Data?.RelatedTo;
          this.sameActivityFor=repsonsedata.Data?.UserType;
          this.saveTo=repsonsedata.Data?.UserType;
          this.CategoryNamegetById=repsonsedata.Data?.CategoryName;
          this.CategoryIdgetById=repsonsedata.Data?.CategoryId;
          this.savetoNameFromEdit=repsonsedata.Data?.SaveToName;
          this.savetoIdFromEdit=repsonsedata.Data?.SaveToId;

          this.SecondselectedRelatedUser = { 'Id': repsonsedata.Data?.DetailsId, 'Name': repsonsedata.Data?.DetailsName };
          this.SecondOnRelatedUserchange(this.SecondselectedRelatedUser,'true');
          this.patchDataForClientEdit(repsonsedata.Data);
          this.loading = false;
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
    
    this.Name = data?.ToName;
    this.usertypeData=data?.UserType;
    this.editConfigRequired();
    this.getNotesDetails = data?.Notes;
    this.fromIsNotes=data?.IsNotes;
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
    this.fromDetailsId=data?.DetailsId;
    this.fromDetailsName=data?.DetailsName;
    this.redirectUsertype=data?.UserType;
    this.ToUrl=data?.ToSummaryURL;
    this.FromURl=data?.FromSummaryURL;
    this.DetailsURL=data?.DetailsSummaryURL;
    this.SaveToSummeryUrl=data?.SaveToSummaryURL;
    this.ToNameForFromObj=data?.ToName;
    this.ToIdForFromObj=data?.ToId;

    if (this.redirectUsertype=='CONT') {
        if (localStorage.getItem('saveToContctIdForUrl')!=null && localStorage.getItem('saveToContctIdForUrl')!=undefined && localStorage.getItem('saveToContctIdForUrl')!='') {
        this.contactId= localStorage.getItem('saveToContctIdForUrl'); 
        this.fromcontactId= this.contactId;
        }
    }else{
      this.fromcontactId=data?.fromFromId;
    }
    if (data?.CallType.toLocaleLowerCase() == 'incoming') {
      this.callType = data?.CallType;
      this.showOutGoingCallData = false;
      this.showIncommingCallData = true;
      this.selectedRelatedUser={Id:data?.SaveToId,Name:data?.SaveToName};

    } else {
      this.callType = data?.CallType;
      this.showIncommingCallData = false;
      this.showOutGoingCallData = true;
      // this.selectedRelatedUser={Id:data?.ToId,Name:data?.ToName}
      this.selectedRelatedUser={Id:data?.SaveToId,Name:data?.SaveToName};

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
      this.getEditorValFrom = data?.Notes;

    } else {
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
      this.getEditorValFrom = data?.Notes;
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
    this.saveToFromId=data?.FromId;
    this.saveToFromName=data?.FromName;
    this.EndCallerTypeCode=data?.EndCallerTypeCode;
    this.showprofileDataTypeCode=data?.EndCallerTypeCode;
    if (this.showprofileDataTypeCode=='' || this.showprofileDataTypeCode==null || this.showprofileDataTypeCode==undefined) {
    this.showprofileDataTypeCode=data?.UserType;
    }

    if (this.EndCallerTypeCode=='CONT') {
    this.contactId= localStorage.getItem('ForJobContctIdrEndCaller');    
    this.checkRelatedTypeEndCaller('CONT');
    this.redirectUsertype='CONT';
    }else if(this.EndCallerTypeCode!='CONT' ){
      if (data?.CallType.toLocaleLowerCase() == 'incoming') {
        this.contactId=data?.FromId;
        } else {
        this.contactId=data?.ToId;
        }

        if (data?.CallType.toLocaleLowerCase() == 'incoming' && data.EndCallerTypeCode!='') {
        this.getVxtLastCallDetails(this.contactId,this.EndCallerTypeCode);  
          } else if(data?.CallType.toLocaleLowerCase() == 'outgoing' && data.UserType!='') {
        this.getVxtLastCallDetails(this.contactId,this.EndCallerTypeCode);
          }

    this.checkRelatedTypeEndCaller(this.EndCallerTypeCode);

    }
    if(data?.CallType.toLocaleLowerCase() == 'outgoing' && this.EndCallerTypeCode!='JOB') {
      this.getVxtLastCallDetails(data?.ToId,data?.UserType);
        }
        
    if ( this.saveTo=='JOB' || data?.UserType=='JOB') {
      this.showEndCaller=true;
      this.SaveToId=data?.SaveToId;
      this.SaveToName=data?.SaveToName;

      if (data?.CallType?.toLocaleLowerCase() == 'incoming') {

      this.selectedRelatedUserEndCaller = {Id:data?.FromId,Name:data?.FromName};
      this.selectedForProfiledata = {Id:data?.FromId,Name:data?.FromName};
      } else {
      this.selectedRelatedUserEndCaller = {Id:data?.ToId,Name:data?.ToName};
      this.selectedForProfiledata = {Id:data?.ToId,Name:data?.ToName};
      }
      // this.selectedRelatedUser={Id:data?.SaveToId,Name:data?.SaveToName}
      // this.selectedRelatedUserEndCaller = {Id:data?.FromId,Name:data?.FromName};
  
      if(data?.EndCallerTypeCode=='CAND'){ //by maneesh ewm-18655
        this.getCatogryDataForCandidate();
      }else if(data?.EndCallerTypeCode=='CLIE'){
      this.getCatogryDataForClient();
        }else if(data?.EndCallerTypeCode=='CONT'){
      this.getCatogryDataForContact();   
        }

      // this.checkRelatedTypeEndCaller(this.saveTo);
      this.addCallForm.patchValue({
        RelatedUserTypeName: this.saveTo,
        RelatedUserTypeEndCaller:data?.EndCallerTypeCode,
        RelatedUserId: data?.Id,
        DateStart: currentDa,
        TimeStart: this.TimeStartValue,
        SecondRelatedUserType: data?.RelatedTo!=null? data?.RelatedTo :null,
        SecondRelatedUserId: data?.DetailsId,
        SecondRelatedUserUserName: data?.DetailsName,
        SourcDescription: data?.Source
    })
    // this.addCallForm.get("RelatedUserTypeName").clearValidators();
    // this.addCallForm.get("RelatedUserTypeName").markAsPristine();
    // this.addCallForm.get('RelatedUserTypeName').updateValueAndValidity();
    // this.addCallForm.get("RelatedUserId").clearValidators();
    // this.addCallForm.get("RelatedUserId").markAsPristine();
    // this.addCallForm.get('RelatedUserId').updateValueAndValidity();

    this.addCallForm.get("RelatedUserTypeEndCaller").clearValidators();
    this.addCallForm.get("RelatedUserTypeEndCaller").markAsPristine();
    this.addCallForm.get('RelatedUserTypeEndCaller').updateValueAndValidity();
    this.addCallForm.get("RelatedUserIdEndCaller").clearValidators();
    this.addCallForm.get("RelatedUserIdEndCaller").markAsPristine();
    this.addCallForm.get('RelatedUserIdEndCaller').updateValueAndValidity();
    }else{
      this.addCallForm.get("RelatedUserTypeEndCaller").clearValidators();
      this.addCallForm.get("RelatedUserTypeEndCaller").markAsPristine();
      this.addCallForm.get('RelatedUserTypeEndCaller').updateValueAndValidity();
      this.addCallForm.get("RelatedUserIdEndCaller").clearValidators();
      this.addCallForm.get("RelatedUserIdEndCaller").markAsPristine();
      this.addCallForm.get('RelatedUserIdEndCaller').updateValueAndValidity();
      this.addCallForm.patchValue({
        // RelatedUserUserName: this.data?.Id,
        RelatedUserTypeName: this.data?.Name,
        RelatedUserId: data?.Id,
        DateStart: currentDa,
        TimeStart: this.TimeStartValue,
        SecondRelatedUserType: data?.RelatedTo!=null? data?.RelatedTo :null,
        SecondRelatedUserId: data?.DetailsId,
        SecondRelatedUserUserName: data?.DetailsName,
        SourcDescription: data?.Source
      })
      if (this.EndCallerTypeCode=='' || this.EndCallerTypeCode==null || this.EndCallerTypeCode==undefined) {
        this.redirectUsertype=data?.UserType;   
        }
        if (data.UserType=='CONT') {
          this.contactId= localStorage.getItem('saveToContctIdForUrl'); 
        }
      this.getVxtLastCallDetails(data?.SaveToId,data?.UserType);      
    }


    if (data?.EndCallerTypeCode=='' || data?.EndCallerTypeCode==undefined || data?.EndCallerTypeCode==null) {
      if (data?.CallType?.toLocaleLowerCase() == 'incoming') {
        this.selectedRelatedUserEndCaller = {Id:data?.FromId,Name:data?.FromName};
        this.selectedForProfiledata = {Id:data?.FromId,Name:data?.FromName};
        } else {
        this.selectedRelatedUserEndCaller = {Id:data?.ToId,Name:data?.ToName};
        this.selectedForProfiledata = {Id:data?.ToId,Name:data?.ToName};
        }
        this.getDataDetail(this.saveTo);
      }
      if (data?.UserType.toLocaleLowerCase()!='job') {
        this.saveTo=data?.UserType;
        if (data?.CallType?.toLocaleLowerCase() == 'incoming') {
          this.selectedRelatedUserEndCaller = {Id:data?.FromId,Name:data?.FromName};
          this.selectedForProfiledata = {Id:data?.FromId,Name:data?.FromName};
          } else {
          this.selectedRelatedUserEndCaller = {Id:data?.ToId,Name:data?.ToName};
          this.selectedForProfiledata = {Id:data?.ToId,Name:data?.ToName};
          }
          this.getDataDetail(this.saveTo);
        }

    if (data?.RelatedTo=='Job') {
      this.reletedUsertype="JOB";
    }else if(data?.RelatedTo=='Client'){
      this.reletedUsertype="CLIE";
    }else if(data?.RelatedTo=='Candidate'){
      this.reletedUsertype="CAND";
    }else if(data?.RelatedTo=='Contact'){
      this.reletedUsertype="CONT";
    }


    if (data?.UserType=='Job') {
      this.addCallForm.patchValue({
        RelatedUserTypeName: 'Job',
        RelatedUserId: data?.UserType,
      }) 
       }else if(data?.UserType=='CLIE'){
      this.addCallForm.patchValue({
        RelatedUserTypeName: 'Client',
        RelatedUserId: data?.UserType,
      }) 
    }else if(data?.UserType=='CAND'){
      this.addCallForm.patchValue({
        RelatedUserTypeName: 'Candidate',
        RelatedUserId: data?.UserType,
      })
    }else if(data?.UserType=='CONT'){
      this.addCallForm.patchValue({
        RelatedUserTypeName: 'Contact',
        RelatedUserId: data?.UserType,
      })    }
    this.SecondselectedRelatedUser = { 'Id': data?.DetailsId, 'Name': data?.DetailsName }
    this.SecondcheckRelatedType(data?.RelatedTo);
    // this.SecondcheckRelatedType(this.reletedUsertype);
    this.addCallForm.get('RelatedUserTypeName').disabled;
    this.addCallForm.controls["RelatedUserTypeName"].disable();
    if (data?.UserType?.toLocaleLowerCase()=='job') {
      this.extraBindValueFirstfield='JobReferenceId';  
      }else if(data?.UserType?.toLocaleLowerCase()!='job' && data?.UserType?.toLocaleLowerCase()!='cont'){
        this.extraBindValueFirstfield='Email';
      }
      else if(data?.UserType?.toLocaleLowerCase()=='cont'){
      this.extraBindValueFirstfield='EmailId';  
      }
      this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValueFirstfield;
    this.common_DropdownC_Config = {
      API: '',
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: true,
      PLACEHOLDER: 'label_Vxt_Select_Detail',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE: 'ProfilePicturePreview',
      FIND_BY_INDEX: 'Id'
    }
    this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
    this.selectedCategory = { 'Id': this.CategoryId,CategoryName: this.CategoryName};
    this.activityFor=data?.UserType;
    this.notesCatogry();
    
  }

  getConfig() {
    this.common_DropdownC_Config = {
      API: '',
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_Vxt_Select_Detail',
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
      this.CategoryName = data?.CategoryName;
      this.addCallForm.patchValue({
        CategoryId: data?.Id,
        NotesCategry: data?.CategoryName
      })
    }
  }
  //clear minut and second
  resetTime(type) {
    if (type=='minut') {
      this.millisecondForMinut=0;
    }else{
      this.millisecondForSecond=0;
    }
    this.decimalhour=this.millisecondForMinut + this.millisecondForSecond;
  }

//on save data and update data
  onConfirm(value) {
  this.isResponseGet = true;
    if (this.IsActive == 'Edit') {
      this.onUpdate(value);
    }
    else {
      this.onSave(value);
    }
  }
//onSave function  for create data
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
       }
    let AddNotesObj: addVxtCalllog = {
      SaveTo: this.saveTo=='JOB'?'JOB':this.redirectUsertype,//discuss with nitin sir and taj sir  saveto data never change
      SaveToId: this.selectedRelatedUser?.Id,//discuss with nitin sir and taj sir  saveto data never change
      CategoryId: this.IsNotes==1 ? this.addCallForm.value?.CategoryId : 0,
      CategoryName:this.IsNotes==1 ? this.addCallForm.value?.NotesCategry : '',
      StartDate:this.utcDate,
      FromId: this.callType.toLocaleLowerCase() == 'incoming' ? (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Id:this.selectedRelatedUser?.Id)  :this.currentUserId,
      FromName: this.callType.toLocaleLowerCase() == 'incoming' ? (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Name:this.selectedRelatedUser?.Name) : cureentUserName,
      ToId: this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserId :(this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Id:this.selectedRelatedUser?.Id) ,
      ToName: this.callType.toLocaleLowerCase() == 'incoming' ? cureentUserName :  (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Name:this.selectedRelatedUser?.Name),
      CallType: this.callType,
      RelatedTo: this.addCallForm.value?.SecondRelatedUserType!='' && this.addCallForm.value?.SecondRelatedUserType != undefined ? this.addCallForm.value?.SecondRelatedUserType : null,
      DetailsId: this.addCallForm.value?.SecondRelatedUserId != '' && this.addCallForm.value?.SecondRelatedUserId != undefined ? this.addCallForm.value?.SecondRelatedUserId : "00000000-0000-0000-0000-000000000000",
      DetailsName: this.SecondselectedRelatedUser?.Name,
      Notes: this.addCallForm.value?.NotesDiscription?.trim(),
      Duration: this.decimalhour,
      IsNotes: this.IsNotes,
      Source: this.addCallForm.value?.SourcDescription?.trim(),
      FromSummaryURL: this.callType.toLocaleLowerCase() == 'incoming' ?this.viewJobSummery(this.contactId,this.redirectUsertype) : this.viewJobSummery(this.currentUserId,'EMPL'),
      ToSummaryURL: this.callType.toLocaleLowerCase() == 'incoming' ? this.viewJobSummery(this.currentUserId,'EMPL') : this.viewJobSummery(this.contactId,this.redirectUsertype),
      DetailsSummaryURL: this.viewJobSummery(this.contactIdForUrl,this.activityForRelatedTo),
      NotesURL: 'NotesURL',
      SaveToName:this.SaveToName,//discuss with nitin sir and taj sir send only this.SaveToName
      SaveToSummaryURL :this.viewJobSummery(this.selectedRelatedUser?.Id,this.saveTo=='JOB'?'JOB':this.redirectUsertype),//discuss with nitin sir and taj sir  saveto data never change
      EndCallerTypeCode :this.EndCallerTypeCode,
    };    
    AddNotesObj.ToProfileImage=this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserProfileImage: this.profileImageURL?this.profileImageURL:'';
    AddNotesObj.FromProfileImage=this.callType.toLocaleLowerCase() == 'incoming' ? this.profileImageURL?this.profileImageURL:'' : this.currentUserProfileImage;
    AddNotesObj.FromProfileImageUrl='',
    AddNotesObj.ToProfileImageUrl='',
     this.candidateService.CreatecandidateVxtCall(AddNotesObj).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.isResponseGet = false;
          this.addCallForm.reset();

        document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(true); }, 200);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
      } else {
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
      }
    }, err => {
      this.isResponseGet = false;
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
//viewJobSummery function  for redirect data
  viewJobSummery(Id, relatedTo) {   
    this.usertype=relatedTo;
    const baseUrl = window.location.origin;
    if (this.usertype == 'CLIE') {
      return baseUrl + this.clientSummery + "?clientId=" + Id + "&Type=" + this.usertype +"&cantabIndex=" +0;
  
    } else if (this.usertype == 'CAND') {
      return baseUrl + this.candidateSummery + "?CandidateId=" + Id + "&Type=" + this.usertype + "&cantabIndex=" +0;
    }
    else if (this.usertype == 'JOB') {
    return baseUrl + this.jobSummery +"?jobId="+ Id + "&workflowId="+ this.workflowId + "&filter=" + 'ActivePositions' +'&selectjob=' +'TotalActiveJobs' +"&tabIndex=" +0;
    }
    else if (this.usertype == 'JOBS') {
    return baseUrl + this.jobSummery +"?jobId="+ Id + "&workflowId="+ this.workflowId + "&filter=" + 'ActivePositions' +'&selectjob=' +'TotalActiveJobs' +"&tabIndex=" +0;
    }
    else if (this.usertype == 'CONT') {
      return baseUrl + this.contactSummery + "?ContactId=" + Id;
    }  else if (this.usertype == 'EMPL') {
      return baseUrl + this.employeeSummery + "?CandidateId=" + this.currentUserId + "&employeeType=" + 'EMPL';
    }
     
    }
//onUpdate function  for update data
  onUpdate(value) {
    localStorage.removeItem('redirectContactId');
    let toUpdatejson = {};
    let fromJson = {};
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
    toUpdatejson['SaveToId'] = this.callType.toLocaleLowerCase() == 'incoming' ? (this.saveTo=='JOB'?this.SaveToId :this.selectedRelatedUser?.Id) : (this.saveTo=='JOB'?this.SaveToId :this.selectedRelatedUser?.Id);
  //  toUpdatejson['SaveToId'] = this.selectedRelatedUser?.Id;
    toUpdatejson['CategoryId'] = this.IsNotes==1 ? this.CategoryId : 0;
    toUpdatejson['CategoryName'] = this.IsNotes==1 ? this.CategoryName : '';
    toUpdatejson['StartDate'] =  this.utcDate;
    toUpdatejson['FromId'] = this.callType.toLocaleLowerCase() == 'incoming' ? (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Id:this.selectedRelatedUser?.Id) : this.currentUserId;
    toUpdatejson['FromName'] = this.callType.toLocaleLowerCase() == 'incoming' ? (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Name:this.selectedRelatedUser?.Name) : cureentUserName;
    toUpdatejson['ToId'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserId : (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Id:this.selectedRelatedUser?.Id);
    toUpdatejson['ToName'] = this.callType.toLocaleLowerCase() == 'incoming' ? cureentUserName : (this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Name:this.selectedRelatedUser?.Name);
    toUpdatejson['CallType'] = this.callType;
    toUpdatejson['RelatedTo'] = this.addCallForm.value?.SecondRelatedUserType!='' && this.addCallForm.value?.SecondRelatedUserType != undefined ? this.addCallForm.value?.SecondRelatedUserType : null,
    toUpdatejson['DetailsId'] = this.addCallForm.value?.SecondRelatedUserId;
    toUpdatejson['DetailsName'] = this.SecondselectedRelatedUser?.Name;
    toUpdatejson['Notes'] = this.IsNotes==0?'':this.addCallForm.value?.NotesDiscription?.trim(),
    toUpdatejson['Duration'] = this.decimalhour;
    toUpdatejson['IsNotes'] = this.IsNotes;
    toUpdatejson['Source'] = this.addCallForm.value?.SourcDescription?.trim();
    toUpdatejson['callId'] = this.callId;
    toUpdatejson['NotesURL'] = 'Notes';
    toUpdatejson['SaveTo']=this.saveTo;
    toUpdatejson['SaveToName'] = this.selectedRelatedUser?.Name;
    toUpdatejson['SaveToSummaryURL'] = this.SaveToSummeryUrl;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['EndCallerTypeCode'] = this.EndCallerTypeCode;
    if (this.callType.toLocaleLowerCase() != 'outgoing' && this.saveTo=='JOB') {
       this.redirectUsertype= this.EndCallerTypeCode;
    }
    toUpdatejson['FromSummaryURL'] = this.callType.toLocaleLowerCase()=='incoming' ?this.viewJobSummery(this.contactId,this.redirectUsertype) : this.viewJobSummery(this.currentUserId,'EMPL');
    if (this.callType.toLocaleLowerCase() == 'outgoing' && this.saveTo=='JOB' &&this.EndCallerTypeCode!='CONT' ) {
      this.contactId=(this.saveTo=='JOB'?this.selectedRelatedUserEndCaller?.Id:this.selectedRelatedUser?.Id);      
       this.redirectUsertype= this.EndCallerTypeCode;
    }
    toUpdatejson['ToSummaryURL'] = this.callType.toLocaleLowerCase()=='incoming' ? this.viewJobSummery(this.currentUserId,'EMPL') : this.viewJobSummery(this.contactId,this.redirectUsertype);
    toUpdatejson['DetailsSummaryURL'] = this.viewJobSummery(this.contactIdForUrl,this.activityForRelatedTo),
    toUpdatejson['ToProfileImage'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserProfileImage: this.profileImageURL?this.profileImageURL:'';
    toUpdatejson['FromProfileImage'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.profileImageURL?this.profileImageURL:'' : this.currentUserProfileImage;
    toUpdatejson['ToProfileImageUrl'] = '',
    toUpdatejson['FromProfileImageUrl'] ='',
    fromJson['SaveTo']=this.usertypeData;
    fromJson['SaveToId']=this.savetoIdFromEdit;
    fromJson['CategoryId']=this.CategoryIdgetById;
    fromJson['CategoryName']=this.CategoryNamegetById;
    fromJson['StartDate']=this.fromUtcDate;
    fromJson['FromId']= this.saveToFromId;
    fromJson['FromName']=this.saveToFromName;
    fromJson['CallType']=this.callType;
    fromJson['RelatedTo']= this.fromRelatedTo;
    fromJson['DetailsId']=this.fromDetailsId;
    fromJson['ToId']= this.ToIdForFromObj;
    fromJson['ToName']=this.ToNameForFromObj;
    fromJson['DetailsName']=this.fromDetailsName;
    fromJson['Notes']=this.getEditorValFrom;
    fromJson['Duration']=this.decimalhour;
    fromJson['IsNotes']=this.fromIsNotes;
    fromJson['Source']=this.addCallForm.value?.SourcDescription?.trim();
    fromJson['callId']= this.callId;
    fromJson['NotesURL'] = 'Notes';
    fromJson['SaveToName'] =this.savetoNameFromEdit;
    fromJson['SaveToSummaryURL'] = this.SaveToSummeryUrl;
    fromJson['EndCallerTypeCode'] = this.EndCallerTypeCode;
    fromJson['FromSummaryURL'] =this.FromURl;
    fromJson['ToSummaryURL'] =this.ToUrl;
    fromJson['DetailsSummaryURL'] = this.DetailsURL;
    fromJson['ToProfileImage'] = this.ToProfileImage
    fromJson['ToProfileImageUrl'] = this.ToProfileImageUrl;
    fromJson['FromProfileImage'] = this.fromImagedata;
    fromJson['FromProfileImageUrl'] = this.FromProfileImageUrl;

    let updateTeamjson = {
       "From": fromJson,
       "To": toUpdatejson
     }
    this.candidateService.candidateVxtUpdateCall(updateTeamjson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.isResponseGet = false;
          this.addCallForm.reset();

          document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        } else {
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
//onDismiss function  for cansel data
  onDismiss(): void {
    document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

//openImageUpload function  for upload data
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
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    }
    else if (sources == undefined && event?.val == '') {
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    } else if (sources != undefined && event?.val != '') {
      this.showMaxlengthError = false;
      this.getNotesDetails = event?.val;
      this.addCallForm.get('NotesDiscription').setValue(event?.val);
      this.addCallForm.get('NotesDiscription').clearValidators();
      this.addCallForm.get('NotesDiscription').markAsPristine();
    } else if (event?.val != '') {
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
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    }
    else if (sources == undefined && event?.val == '') {
      this.editConfigRequired();
      this.showMaxlengthError = true;
      this.addCallForm.get('NotesDiscription').setValue('');
      this.addCallForm.get('NotesDiscription').setValidators([Validators.required]);
      this.addCallForm.get('NotesDiscription').updateValueAndValidity();
      this.addCallForm.get("NotesDiscription").markAsTouched();
    } else if (sources != undefined && event?.val != '') {
      this.showMaxlengthError = false;
      this.getNotesDetails = event?.val;
      this.addCallForm.get('NotesDiscription').setValue(event?.val);
      this.addCallForm.get('NotesDiscription').clearValidators();
      this.addCallForm.get('NotesDiscription').markAsPristine();
    } else if (event?.val != '') {
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
    if (type.toLocaleLowerCase() == 'incoming') {
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
    if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValueFirstfield='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValueFirstfield='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValueFirstfield='EmailId';  
      }
      this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValueFirstfield;
    this.activityFor=activityFor;
    this.sameActivityFor=activityFor;
    this.saveTo=activityFor;    
    this.profileImageData=false;
    this.showprofileDataTypeCode=activityFor;
    this.addCallForm.patchValue({
      'SecondRelatedUserType': '',
    });
    this.addCallForm.get("RelatedUserId").clearValidators();
    this.addCallForm.get("SecondRelatedUserUserName").clearValidators();

    this.addCallForm.get("RelatedUserId").markAsPristine();
    this.addCallForm.get("SecondRelatedUserUserName").markAsPristine();
    this.SecondselectedRelatedUser=null;
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
    if (this.saveTo=='JOB') {
        this.reletedcatgry=true;
        this.profileImageData=false;
        this.addCallForm.patchValue({
          'RelatedUserTypeEndCaller': '',
        });
        // this.selectedRelatedUser = null;
        // this.addCallForm.patchValue(
        //   {
        //     RelatedUserId: null,
        //     RelatedUserUserName: null,
        //   });
      // this.addCallForm.get("RelatedUserId").setErrors({ required: true });
      // this.addCallForm.get("RelatedUserId").markAsTouched();
      // this.addCallForm.get("RelatedUserId").markAsDirty();
      // this.addCallForm.get("RelatedUserUserName").setErrors({ required: true });
      // this.addCallForm.get("RelatedUserUserName").markAsTouched();
      // this.addCallForm.get("RelatedUserUserName").markAsDirty();
      // this.addCallForm.get('RelatedUserTypeEndCaller').setValidators([Validators.required]);
      // this.addCallForm.get('RelatedUserTypeEndCaller').updateValueAndValidity();
      // this.addCallForm.get("RelatedUserTypeEndCaller").markAsTouched();  
      // this.addCallForm.get('RelatedUserIdEndCaller').setValidators([Validators.required]);
      // this.addCallForm.get('RelatedUserIdEndCaller').updateValueAndValidity();
      // this.addCallForm.get("RelatedUserIdEndCaller").markAsTouched();  
    }
    // this.notesCatogry();
    this.reletedcatgry=true;
    this.disabelBtnLastcalldetals=true;

    this.addCallForm.get("RelatedUserId").setErrors({ required: true });
    this.addCallForm.get("RelatedUserId").markAsTouched();
    this.addCallForm.get("RelatedUserId").markAsDirty();
    this.addCallForm.get("CategoryId").setErrors({ required: true });
    this.addCallForm.get("CategoryId").markAsTouched();
    this.addCallForm.get("CategoryId").markAsDirty();
    this.addCallForm.patchValue(
      {
        RelatedUserId: null,
        RelatedUserUserName: '',
        CategoryId: null,
        NotesCategry:null,
      });
    this.selectedRelatedUser = null;
    this.selectedCategory = null;
    // this.activityForAttendees = activityFor;
    this.redirectUsertype=activityFor;
    this.showEndCaller=false;
    if (activityFor == "JOB") {
      this.showEndCaller=true;
      this.profileImageData=false;
      this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
      this.addCallForm.patchValue({
        'RelatedUserTypeName': this.redirectUsertype,
        RelatedUserType:'Job'
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "CAND") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': this.redirectUsertype
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "EMPL") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': this.redirectUsertype
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "CLIE") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': this.redirectUsertype
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "CONT") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': this.redirectUsertype
      })
      this.getActivityTypeCategory(activityFor);
    } 
    else {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': '',
      })
      this.ActivityTypeList = [];
    }
    if (this.redirectUsertype=='JOB') {
      this.redirectUsertype='JOBS';
      this.profileImageData=false;
      this.reletedcatgry=true;
      // this.addCallForm.patchValue({
      //   RelatedUserIdEndCaller: '',
      //   RelatedUserUserNameEndCaller: null,
      // });
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
        this.addCallForm.patchValue(
          {
            RelatedUserId: null,
            RelatedUserUserName: '',
          });
        this.addCallForm.get("RelatedUserId").setErrors({ required: true });
        this.addCallForm.get("RelatedUserId").markAsTouched();
        this.addCallForm.get("RelatedUserId").markAsDirty();
    }


    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+ this.redirectUsertype + '&FilterParams.ColumnName=StatusName&ByPassPaging=true&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
    this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
    this.dropDownStatusConfig['IsRequired'] = true;
    this.selectedCategory = {};
    this.resetFormSubjectStatus.next(this.dropDownStatusConfig);    
  }
  CallUserType:boolean=false;
  onChangeActivityRelatedToSecond(activityFor) {
    this.activityForRelatedTo=activityFor;
    this.CallUserType=false;
    this.activityFor = activityFor;
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
          'SecondRelatedUserType': this.activityFor
  
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "CAND") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Candidate',
          'SecondRelatedUserType': this.activityFor
  
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "EMPL") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Employee',
          'SecondRelatedUserType': this.activityFor
  
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "CLIE") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Client',
          'SecondRelatedUserType': this.activityFor
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "CONT") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Client',
          'SecondRelatedUserType': this.activityFor
        })
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config_Details.IMG_SHOW = true;
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = true;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
      }
       else {
        this.addCallForm.patchValue({
          'SecondRelatedUserTypeName': '',
          'SecondRelatedUserType': ''
  
        })
        this.ActivityTypeList = [];
      }
      this.common_DropdownC_Config_Details.REQUIRED = true;
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);

    }

    if (this.addCallForm.get('SecondRelatedUserType').value != '' && this.addCallForm.get('SecondRelatedUserType').value != null && this.addCallForm.get('SecondRelatedUserType').value != undefined) {
      this.addCallForm.get("SecondRelatedUserUserName").setErrors({ required: true });
      this.addCallForm.get("SecondRelatedUserId").markAsTouched();
      this.addCallForm.get("SecondRelatedUserId").markAsDirty();
    }
  }

  getActivityTypeCategory(activityFor) {
    this.systemSettingService.getAllActivityListCategory("?search=" + activityFor).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          //  this.loading = false;
          this.ActivityTypeList = repsonsedata.Data;
          if (this.ActivityTypeList == undefined || this.ActivityTypeList == null || this.ActivityTypeList.length == 0) {
            this.isNoRecordCategory = true;
          } else {
            this.isNoRecordCategory = false;
          }

        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  checkRelatedType(activityFor) {
    if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValueFirstfield='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValueFirstfield='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValueFirstfield='EmailId';  
      }
      this.common_DropdownC_Config.EXTRA_BIND_VALUE = this.extraBindValueFirstfield;
    if (activityFor=='JOB') {
      this.redirectUsertype='JOBS';
    }else{
      this.redirectUsertype=activityFor;
    }
    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+ this.redirectUsertype + '&FilterParams.ColumnName=StatusName&ByPassPaging=true&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStatusConfig['placeholder'] = 'label_Vxt_Notes_catogry';
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
    this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
    this.dropDownStatusConfig['IsRequired'] = true;
    this.selectedCategory = {};
    this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
    switch (activityFor) {
      case "JOB": {
        this.common_DropdownC_Config.API = this.serviceListClass.jobWithoutWorkflowV3;
        this.common_DropdownC_Config.MANAGE = '';
        this.common_DropdownC_Config.SHORTNAME_SHOW = false;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End 
        break;
      }
      case "CAND": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllCandidateForActivity_v2;
        this.common_DropdownC_Config.MANAGE = './client/cand/candidate/candidate-list';
        this.common_DropdownC_Config.SHORTNAME_SHOW = true;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End 
        break;
      }
      case "CLIE": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllClientForActivity;
        this.common_DropdownC_Config.MANAGE = './client/core/clients/client-dashboard';
        this.common_DropdownC_Config.SHORTNAME_SHOW = false;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End
        break;
      }
      case "CONT": {
        this.common_DropdownC_Config.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config.SHORTNAME_SHOW = true;
        this.common_DropdownC_Config.BINDBY = 'Name';
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
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
      this.SecondselectedRelatedUser = null;
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
      this.common_DropdownC_Config_Details.REQUIRED = false;
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
    }
    switch (activityFor) {
      case "JOB": {
        this.common_DropdownC_Config_Details.API = this.serviceListClass.jobWithoutWorkflowV3;
        this.common_DropdownC_Config_Details.MANAGE = '';
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.IMG_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
        // End 
        break;
      }
      case "Job": {
        this.common_DropdownC_Config_Details.API = this.serviceListClass.jobWithoutWorkflowV3;
        this.common_DropdownC_Config_Details.MANAGE = '';
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
    if (data == null || data == "" || data?.length == 0) {
      this.disabelBtnLastcalldetals=true;
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
      if (this.activityFor.toLocaleLowerCase()!='job') {
        this.profileImageData=false;  
      }
    }
    else {
      if (this.sameActivityFor.toLocaleLowerCase()!='job') {
        this.profileImageData=true;
        this.profileName = data?.Name;
        this.profileImage = data?.ProfilePicturePreview;
        this.profileShortName = data?.ShortName;
        this.profileEmail= data?.Email;
        this.profilePhonnumber = data?.PhoneNumber;  
      }
      this.reletedcatgry=false;
      this.addCallForm.get("RelatedUserId").clearValidators();
      this.addCallForm.get("RelatedUserId").markAsPristine();      
      if (this.sameActivityFor=='CONT') {
        this.profileName = data?.Name;
        this.profileImage = data?.ProfileImageURL;
        this.profileShortName = data?.ShortName;
        this.profileImageURL = data?.ProfileImagePath;
        this.profileEmail= data?.EmailId;
        this.profilePhonnumber = data?.PhoneNo;
        this.addCallForm.patchValue({
          RelatedUserId: data?.ContactId,
          RelatedUserUserName: data?.Name
        })
      this.selectedRelatedUser = {Id:data?.ContactId,Name:data?.Name};
      this.contactId = data?.Id;
      this.getVxtLastCallDetails(data?.ContactId,this.sameActivityFor);
      
      localStorage.setItem('saveToContctIdForUrl',data?.Id);
      this.SaveToName=data?.Name;
      this.disabelBtnLastcalldetals=false;

      }else{
       this.profileImage = data?.ProfilePicturePreview;
       this.profileImageURL = data?.ProfilePicture;
       this.disabelBtnLastcalldetals=false;
       this.getVxtLastCallDetails(data?.Id,this.sameActivityFor)
      this.selectedRelatedUser = data;
      this.SaveToName=data?.Name;
      this.contactId = data?.Id;
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
if (this.activityForRelatedTo=='CONT') {
  this.SecondselectedRelatedUser = { 'Id': data?.ContactId, 'Name': data?.Name };
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
  this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
  this.addCallForm.patchValue({
    SecondRelatedUserId: data?.ContactId,
    SecondRelatedUserUserName: data?.Name,
  })
  // this.contactIdForUrl=data?.Id;
  this.workflowId=data?.WorkflowId;
  if (localStorage.getItem('contctIdForUrl')!=null && localStorage.getItem('contctIdForUrl')!=undefined && localStorage.getItem('contctIdForUrl')!='' && value=='true') {
  this.contactIdForUrl= localStorage.getItem('contctIdForUrl'); 
  }else{
  this.contactIdForUrl=data?.Id;
  localStorage.setItem('contctIdForUrl',data?.Id)

  }
}else{
  this.SecondselectedRelatedUser = data;
  this.contactIdForUrl=data?.Id;
  this.workflowId=data?.WorkflowId;
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

  ChangeAEndCaller:string;
  public selectedRelatedUserEndCaller: any = {};
  common_DropdownC_ConfigEndCaller: DRP_CONFIG;
  SecondresetRelattedUserDrpEndCaller: Subject<any> = new Subject<any>();

  onChangeAEndCaller(activityFor) {   
    this.showprofileDataTypeCode=activityFor;
    this.selectedRelatedUserEndCaller = null;
    this.reletedcatgry=true;
    this.showHideReletedTo = activityFor;
    this.EndCallerTypeCode=activityFor;
      this.ChangeAEndCaller=activityFor;
      this.redirectUsertype=activityFor;
      this.disabelBtnLastcalldetals=true;
      // this.sameActivityFor=activityFor;
      this.addCallForm.get("RelatedUserTypeEndCaller").clearValidators();
      this.addCallForm.get("RelatedUserTypeEndCaller").markAsPristine();
      this.addCallForm.get('RelatedUserTypeEndCaller').updateValueAndValidity();
      this.addCallForm.patchValue({
        CategoryId:0,
        NotesCategry: ''
      })
      // this.addCallForm.get("CategoryId").setErrors({ required: true });
      // this.addCallForm.get("CategoryId").markAsTouched();
      // this.addCallForm.get("CategoryId").markAsDirty();
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
      // this.getNotesCategry();
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
      // this.selectedCategory = null;
      // this.dropDownStatusConfig['IsDisabled'] = false;
      // this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+ this.ChangeAEndCaller + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      // this.dropDownStatusConfig['placeholder'] = 'label_notesCategory';
      // this.dropDownStatusConfig['searchEnable'] = true;
      // this.dropDownStatusConfig['IsManage'] = './client/core/administrators/notes-category';
      // this.dropDownStatusConfig['bindLabel'] = 'CategoryName';
      // this.dropDownStatusConfig['IsRequired'] = true;
      // this.selectedCategory = {};
      // this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
      this.common_DropdownC_ConfigEndCaller.DISABLED = false;
      this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
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
        this.common_DropdownC_ConfigEndCaller.BINDBY = 'Name';
        this.SecondresetRelattedUserDrpEndCaller.next(this.common_DropdownC_ConfigEndCaller);
        // End 
        break;
      }
      case "CLIE": {
      this.profileImageData=false;
        this.common_DropdownC_ConfigEndCaller.API = this.serviceListClass.getAllClientForActivity;
        this.common_DropdownC_ConfigEndCaller.MANAGE = './client/core/clients/client-dashboard';
        this.common_DropdownC_ConfigEndCaller.SHORTNAME_SHOW = false;
        this.common_DropdownC_ConfigEndCaller.BINDBY = 'Name';
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
          let constchangedOb = repsonsedata.Data.filter(x => x?.Id == this.selectedForProfiledata?.Id);
          this.profileImageData=true;
          this.profileName = constchangedOb[0]?.Name;
          this.profileImage = constchangedOb[0]?.ProfilePicturePreview;
          this.profileImageURL = constchangedOb[0]?.ProfilePicture;
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
          let constchangedOb = repsonsedata.Data.filter(x => x?.Id == this.selectedForProfiledata?.Id);
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
          let constchangedOb = repsonsedata.Data.filter(x => x?.ContactId == this.selectedForProfiledata?.Id);          
          this.profileImageData=true;
          this.profileName = constchangedOb[0]?.Name;
          this.profileImage = constchangedOb[0]?.ProfileImageURL;
          this.profileImageURL = constchangedOb[0]?.ProfilePicture;
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
    this.addCallForm.get("RelatedUserIdEndCaller").clearValidators();
    this.addCallForm.get("RelatedUserIdEndCaller").markAsPristine();
    this.addCallForm.get('RelatedUserIdEndCaller').updateValueAndValidity();
    if (data == null || data == "" || data?.length == 0) {      
      this.disabelBtnLastcalldetals=true;
      this.selectedRelatedUserEndCaller = null;
      this.reletedcatgry=true;
      this.addCallForm.patchValue({
        RelatedUserIdEndCaller: data?.Id,
        RelatedUserUserNameEndCaller: data?.Name,
      });
      this.profileImageData=false;
    }
    else {
      
      this.profileImageData=true;
      this.profileName = data?.Name;
      this.profileImage = data?.ProfilePicturePreview;
      this.profileShortName = data?.ShortName;
      this.profileEmail= data?.Email;
      this.profilePhonnumber = data?.PhoneNumber;      
      if (this.ChangeAEndCaller==undefined || this.ChangeAEndCaller==null) {
        this.ChangeAEndCaller=this.EndCallerTypeCode;
      }     
      if(this.ChangeAEndCaller=='CONT'){
        this.profileName = data?.Name;
        this.profileImage = data?.ProfileImageURL;
        this.profileImageURL = data?.ProfileImagePath;
        this.profileShortName = data?.ShortName;
        this.profileEmail= data?.EmailId;
        this.profilePhonnumber = data?.PhoneNo;
        this.selectedRelatedUserEndCaller = {Id:data?.ContactId,Name:data?.Name};
        // this.selectedRelatedUser={Id:data?.ContactId,Name:data?.Name};
        this.addCallForm.patchValue({
          RelatedUserIdEndCaller: data?.ContactId,
          RelatedUserUserNameEndCaller: data?.Name,
        })
    this.getVxtLastCallDetails(data?.ContactId,this.ChangeAEndCaller);
    this.disabelBtnLastcalldetals=false;

        if (localStorage.getItem('ForJobContctIdrEndCaller')!=null && localStorage.getItem('ForJobContctIdrEndCaller')!=undefined && localStorage.getItem('ForJobContctIdrEndCaller')!='') {      
          this.contactId=data?.Id;
          localStorage.setItem('ForJobContctIdrEndCaller',data?.Id)
          }else{
          this.contactId=data?.Id;
          localStorage.setItem('ForJobContctIdrEndCaller',data?.Id)
        
          }
      }else{
    this.disabelBtnLastcalldetals=false;
        this.contactId=data?.Id;
        this.selectedRelatedUserEndCaller = data;
        // this.selectedRelatedUser=data;
        if (this.ChangeAEndCaller==undefined || this.ChangeAEndCaller==null) {
          this.ChangeAEndCaller=this.EndCallerTypeCode;
        }
        if (this.ChangeAEndCaller=='CLIE') {
        this.profileName = data?.Name;
        this.profileImage = data?.ProfileImageURL;
        this.profileShortName = data?.ShortName;
        this.profileEmail= data?.Email;
        this.profilePhonnumber = data?.PhoneNumber;
        }else if(this.ChangeAEndCaller=='CAND'){
          this.profileName = data?.Name;
          this.profileImage = data?.ProfilePicturePreview;
          this.profileImageURL = data?.ProfilePicture;
          this.profileShortName = data?.ShortName;
          this.profileEmail= data?.EmailId;
          this.profilePhonnumber = data?.PhoneNumber;
        }                
       this.getVxtLastCallDetails(data?.Id,this.ChangeAEndCaller);
        this.addCallForm.patchValue({
          RelatedUserIdEndCaller: data?.Id,
          RelatedUserUserNameEndCaller: data?.Name,
        });
      }  
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
  getDataDetail(saveTo){
    if(saveTo=='CAND'){ //by maneesh ewm-18655
      this.getCatogryDataForCandidate();
    }else if(saveTo=='CLIE'){
    this.getCatogryDataForClient();
      }else if(saveTo=='CONT'){
    this.getCatogryDataForContact();   
      }
  }
}
