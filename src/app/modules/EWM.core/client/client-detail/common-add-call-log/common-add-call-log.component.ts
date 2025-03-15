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
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-common-add-call-log',
  templateUrl: './common-add-call-log.component.html',
  styleUrls: ['./common-add-call-log.component.scss']
})
export class CommonAddCallLogComponent implements OnInit {
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
  public dropDoneConfig: customDropdownConfig[] = [];
  public ddlCallStatusConfig: customDropdownConfig[] = [];
  public selectedCategory: any = {};
  public selectedCallStatus: any = {};
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

  isChecked = true;

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
  reletedUserTypeCode:string;
  reletedUserTypeCodeValue:string;
  JobIdForVxt:boolean=false;
  public isReadMore: any[] = [false];
  common_DropdownC_Config_DetailsRadioBtn: DRP_CONFIG;
  RelatedUserForRadiobtnUserDrp: Subject<any> = new Subject<any>();
  RelatedUserForRadiobtn: any = {};
  tabUserType:string
  fromIsNotes: any;
  redirectUsertype: any='CLIE';
  contactId: any;
  contactSummery = '/client/cont/contacts/contact-detail';
  jobSummery = '/client/jobs/job/job-detail/detail';
  clientSummery = '/client/core/clients/list/client-detail'
  candidateSummery = '/client/cand/candidate/candidate'
  fromSummery = '/client/emp/employees/employee-detail'
  employeeSummery = '/client/emp/employees/employee-detail'
  resetFormSubjectStatus: Subject<any> = new Subject<any>();
  fromDetailsId: any;
  activityForRelatedTo: string;
  fromDetailsName: any;
  fromcontactId: any;
  ToUrl: any;
  FromURl: any;
  DetailsURL: any;
  SaveToSummeryUrl: any;
  fromRelatedTo: any;
  // /client/emp/employees/employee-detail?CandidateId=d7ea30c1-e9d2-4b22-9dea-29752b1559da&employeeType=EMPL
  usertype:string;
  fromIdsummeryUrl: any;
  redirectUsertypeData: any;
  isResponseGet:boolean=false;
  EditorShow = { ShowEditor : true,}
  resetEditorValue: Subject<any> = new Subject<any>();
  phoneNumber:number;
  emailId:string;
  contactIdForUrl:any;
  workflowId:string;
  callTypedata:string;
  extraBindValue:string;
  public MaxDate: any = new Date();
  public timeAfter5Minutes: Date;
  public ProfileImagePath:string;
  public ToProfileImage:string;
  public ToProfileImageUrl:string;
  public FromProfileImageUrl:string;
  public FromProfileImage:string;
  public formattedDate:string;
  public fromUtcDate:string;
  public utcDate:string;
  public currentUserProfileImage:string;
  public profileImageURL:string;
  public fromImagedata:string;
  public clientType:string;
  public ProfilePicture:string;
  public patchData:any = {};
  public common_DropdownCallStatus_Config:DRP_CONFIG;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private routes: ActivatedRoute, public dialogRef: MatDialogRef<CommonAddCallLogComponent>,
    public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private quickJobService: QuickJobService, private clientService: ClientService, private serviceListClass: ServiceListClass,
    private appSettingsService: AppSettingsService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private datePipe: DatePipe,
    ) {
    this.addCallForm = this.fb.group({
      Id: [null],
      CategoryId: ['', Validators.required],
      NotesDiscription: ['', Validators.required],
      NotesCategry: [''],
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      RelatedUserType: [{ value: this.data?.reletedUserTypeCode, disabled: true }, [Validators.required]],
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
      CallStatusId: ['', Validators.required],
      CallStatus: [''],

    });    


    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData;
    this.currentUserId = tenantData?.UserId;
    let sortProfileUrl=localStorage.getItem('ProfileUrl')as string;;
    let path = sortProfileUrl?.substring(sortProfileUrl?.indexOf('USER')); // Extract everything starting from "EWM"   
    this.currentUserProfileImage = path;
    this.clientshortname = this.data?.ClientSortName;
    this.JobIdForVxt=this.data?.JobIdForVxt;
    this.tabUserType=this.data?.usertype;   
    this.emailId=this.data?.EmailId;
    this.phoneNumber=this.data?.PhoneNumber;
    this.clientType=this.data?.clientType;
    this.ProfileImagePath=this.data?.ProfileImagePath;
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType='+this.tabUserType + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDoneConfig['placeholder'] = 'label_Vxt_Notes_catogry';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/notes-category';
    this.dropDoneConfig['bindLabel'] = 'CategoryName';
    this.dropDoneConfig['IsRequired'] = true;

    // this.ddlCallStatusConfig['IsDisabled'] = false;
    // this.ddlCallStatusConfig['apiEndPoint'] = this.serviceListClass.vxtcallStatus ;
    // this.ddlCallStatusConfig['placeholder'] = 'label_Vxt_Call_Status';
    // this.ddlCallStatusConfig['searchEnable'] = true;
    // this.ddlCallStatusConfig['IsManage'] = '';
    // this.ddlCallStatusConfig['bindLabel'] = 'CallStatus';
    // this.ddlCallStatusConfig['IsRequired'] = true;
 }


  ngOnInit() {
    this.IsActive = this.data?.isEdit
    this.selectedRelatedUser = { 'Id': this.data?.Id, 'Name': this.data?.Name }
    this.redirectUsertypeData=this.data?.usertype;
    this.Name = this.data?.Name;
    this.selectedCategory = {};
    if (this.data?.usertype=='CONT') {
    this.fromIdsummeryUrl=this.data?.contactIdForNUmberTyp;   
    }else{
      this.fromIdsummeryUrl=this.data?.Id;
    }
    this.timevalue();
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
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
      RelatedUserId: this.data?.Name
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
    this.getVxtLastCallDetails();

  }

//getVxtCandidateListCallDetailsById function for getbyid data
  getVxtCandidateListCallDetailsById(Id) {
    this.loading = true;
    this.candidateService.getVxtCandidateListCallDetailsById(Id).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.patchData = repsonsedata.Data;
          this.CategoryId = repsonsedata.Data?.Id;
          this.CategoryName = repsonsedata.Data?.CategoryName;
          // Example decimal value (hours)
          this.decimalhour=repsonsedata.Data?.Duration;
          const decimalHours = repsonsedata.Data?.Duration;
          this.fromImagedata=repsonsedata.Data?.FromProfileImage;
          this.FromProfileImageUrl=repsonsedata.Data?.FromProfileImageUrl;
          this.ToProfileImage=repsonsedata.Data?.ToProfileImage; 
          this.ProfileImagePath=repsonsedata.Data?.FromProfileImage;          ;
          this.ToProfileImageUrl=repsonsedata.Data?.ToProfileImageUrl;
          const minutes = Math.floor(decimalHours / 60 / 1000);
          this.millisecondForMinut = minutes;
          const seconds = Math.floor(decimalHours / 1000) % 60;
          this.millisecondForSecond = seconds;
          this.addCallForm.patchValue({
            mins: minutes==0?null:minutes,
            Second: seconds==0?null:seconds
          });
          // this.ToProfileImage=repsonsedata.Data?.ToProfileImage;
          // this.ToProfileImageUrl=repsonsedata.Data?.ToProfileImageUrl;
          // this.FromProfileImageUrl=repsonsedata.Data?.FromProfileImageUrl;
          // this.FromProfileImage=repsonsedata.Data?.FromProfileImage;
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
    // this.Name = data?.ToName;
    this.editConfigRequired();
    this.redirectUsertype=data?.UserType;
    this.fromIsNotes=data?.IsNotes;
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
    this.redirectUsertype=data?.RelatedTo;
    this.activityFor=data.RelatedTo;

    if (this.redirectUsertype=='CONT') {
      if (localStorage.getItem('contctIdForUrl')!=null && localStorage.getItem('contctIdForUrl')!=undefined && localStorage.getItem('contctIdForUrl')!='') {
      // this.contactId= localStorage.getItem('saveToContctIdForUrl'); 
      // this.fromcontactId= this.contactId;
      this.contactIdForUrl=localStorage.getItem('contctIdForUrl'); 
      }
  }else{
    this.contactIdForUrl=data?.DetailsId;
  }
    this.callTypedata=data?.CallType;
    if (data?.CallType.toLocaleLowerCase() == 'incoming') {
      this.callType = data?.CallType;
      this.showOutGoingCallData = false;
      this.showIncommingCallData = true;
    } else {
      this.callType = data?.CallType;
      this.showIncommingCallData = false;
      this.showOutGoingCallData = true;
    }
    this.fromIsNotes=data?.IsNotes;
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
      this.getEditorValForFrom=data?.Notes;
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
      this.getEditorValForFrom=data?.Notes;

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

    this.addCallForm.patchValue({
      // RelatedUserUserName: this.data?.Id,
      // RelatedUserType: this.data?.reletedUserTypeCode,
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
    this.SecondselectedRelatedUser = { 'Id': data?.DetailsId, 'Name': data?.DetailsName }
    this.SecondcheckRelatedType(data?.RelatedTo);
  }
//getConfig function for getconfig filter data
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
//onCategorychange function for get catogrydata data
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

// resetTime function for create and update  data
resetTime(type) {
  if (type=='minut') {
    this.millisecondForMinut=0;
  }else{
    this.millisecondForSecond=0;
  }
  this.decimalhour=this.millisecondForMinut + this.millisecondForSecond;
}

//onConfirm function for create and update data
  onConfirm(value) {
    this.isResponseGet=true;
    if (this.IsActive == 'Edit') {
      this.onUpdate(value);
    }
    else {
      this.onSave(value);
    }

  }

 //onConfirm function for create  data
  onSave(value): void {    
    localStorage.removeItem('redirectContactId');
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
      SaveTo: this.data?.usertype,
      SaveToId: this.data?.Id,
      CategoryId: this.addCallForm.value?.CategoryId ? this.addCallForm.value?.CategoryId : 0,
      CategoryName:this.addCallForm.value?.NotesCategry ? this.addCallForm.value?.NotesCategry : '',
      StartDate:this.utcDate,
      FromId: this.callType.toLocaleLowerCase()  == 'incoming' ? this.selectedRelatedUser?.Id : this.currentUserId,
      FromName: this.callType.toLocaleLowerCase()  == 'incoming' ? this.selectedRelatedUser?.Name : cureentUserName,
      ToId: this.callType.toLocaleLowerCase()  == 'incoming' ? this.currentUserId : this.selectedRelatedUser?.Id,
      ToName: this.callType.toLocaleLowerCase()  == 'incoming' ? cureentUserName : this.selectedRelatedUser?.Name,
      CallType: this.callType,
      RelatedTo: this.addCallForm.value?.SecondRelatedUserType!='' && this.addCallForm.value?.SecondRelatedUserType != undefined ? this.addCallForm.value?.SecondRelatedUserType : null,
      DetailsId: this.addCallForm.value?.SecondRelatedUserId != '' && this.addCallForm.value?.SecondRelatedUserId != undefined ? this.addCallForm.value?.SecondRelatedUserId : "00000000-0000-0000-0000-000000000000",
      DetailsName: this.SecondselectedRelatedUser?.Name,
      Notes: this.IsNotes==0?'':this.addCallForm.value?.NotesDiscription?.trim(),
      Duration: this.decimalhour,
      IsNotes: this.IsNotes,
      Source: this.addCallForm.value?.SourcDescription?.trim(),
      FromSummaryURL: this.callType.toLocaleLowerCase()  == 'incoming' ?this.viewJobSummery(this.fromIdsummeryUrl,this.redirectUsertypeData) : this.viewJobSummery(this.currentUserId,'EMPL'),
      ToSummaryURL: this.callType.toLocaleLowerCase()  == 'incoming' ? this.viewJobSummery(this.currentUserId,'EMPL') : this.viewJobSummery(this.fromIdsummeryUrl,this.redirectUsertypeData),
      DetailsSummaryURL: this.viewJobSummery(this.contactIdForUrl,this.activityFor),
      NotesURL: 'NotesURL',
      SaveToName:this.callType.toLocaleLowerCase()  == 'incoming' ? this.selectedRelatedUser?.Name : cureentUserName,
      SaveToSummaryURL :this.callType.toLocaleLowerCase()  == 'incoming' ? this.viewJobSummery(this.fromIdsummeryUrl,this.redirectUsertypeData) : this.viewJobSummery(this.currentUserId,'EMPL'),
      EndCallerTypeCode: '',
      CallStatusId: this.addCallForm.value?.CallStatusId ? this.addCallForm.value?.CallStatusId : null,
      CallStatus: this.addCallForm.value?.CallStatus ? this.addCallForm.value?.CallStatus : '',
      SaveToPhoneNumber: this.data?.PhoneNumber?this.data?.PhoneNumber:''
    };
    AddNotesObj.ToProfileImage=this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserProfileImage: this.ProfileImagePath?this.ProfileImagePath:'';
    AddNotesObj.ToProfileImageUrl=this.callType.toLocaleLowerCase() == 'incoming' ? '': this.profileImageURL?this.profileImageURL:'';
    AddNotesObj.FromProfileImage=this.callType.toLocaleLowerCase() == 'incoming' ? this.ProfileImagePath?this.ProfileImagePath:'' : this.currentUserProfileImage;
    AddNotesObj.FromProfileImageUrl=this.callType.toLocaleLowerCase() == 'incoming' ?this.profileImageURL? this.profileImageURL:'':'';
    this.candidateService.CreatecandidateVxtCall(AddNotesObj).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.isResponseGet=false;

          this.addCallForm.reset();
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
 //viewJobSummery function for redirect url  data
 viewJobSummery(Id, relatedTo) {  
  this.usertype=relatedTo;
  const baseUrl = window.location.origin;
  if (this.usertype == 'CLIE') {
    return baseUrl + this.clientSummery + "?clientId=" + Id + "&Type=" + this.usertype;

  } else if (this.usertype == 'CAND') {
    return baseUrl + this.candidateSummery + "?CandidateId=" + Id + "&Type=" + this.usertype;
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
    return baseUrl + this.employeeSummery + "?CandidateId=" + this.currentUserId + "&employeeType=" + relatedTo;
  }
   
  }
 //onUpdate function for update  data
 timeFormatted:string;
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
    // let localstartDate = this.formatDateToUTC(d);
    toUpdatejson['SaveTo'] = this.data?.usertype;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['SaveToId'] = this.data?.Id;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['CategoryId'] = this.addCallForm.value?.CategoryId ? this.addCallForm.value?.CategoryId : 0;
    toUpdatejson['CategoryName'] = this.CategoryName ? this.CategoryName : '';
    toUpdatejson['StartDate'] =  this.utcDate;
    toUpdatejson['FromId'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.selectedRelatedUser?.Id : this.currentUserId;
    toUpdatejson['FromName'] = this.callType.toLocaleLowerCase()  == 'incoming' ? this.selectedRelatedUser?.Name : cureentUserName;
    toUpdatejson['ToId'] = this.callType.toLocaleLowerCase()  == 'incoming' ? this.currentUserId : this.selectedRelatedUser?.Id;
    toUpdatejson['ToName'] = this.callType.toLocaleLowerCase()  == 'incoming' ? cureentUserName : this.selectedRelatedUser?.Name;
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
    toUpdatejson['SaveToName'] = this.data?.Name;
    toUpdatejson['EndCallerTypeCode'] = '';
    toUpdatejson['SaveToName'] = this.selectedRelatedUser?.Name; //discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['SaveToSummaryURL'] =this.SaveToSummeryUrl;//discuss with nitin sir and taj sir  saveto data never change
    toUpdatejson['EndCallerTypeCode'] = '';
    toUpdatejson['SaveToPhoneNumber'] = this.data?.PhoneNumber?this.data?.PhoneNumber:'';
    toUpdatejson['CallStatusId'] = this.addCallForm.value?.CallStatusId ? this.addCallForm.value?.CallStatusId : null;
    toUpdatejson['CallStatus'] = this.addCallForm.value?.CallStatus ? this.addCallForm.value?.CallStatus : '';

    toUpdatejson['FromSummaryURL'] = this.callType.toLocaleLowerCase()  == 'incoming' ?this.viewJobSummery(this.fromIdsummeryUrl,this.redirectUsertypeData) : this.viewJobSummery(this.currentUserId,'EMPL');
    toUpdatejson['ToSummaryURL'] = this.callType.toLocaleLowerCase() =='incoming' ? this.viewJobSummery(this.currentUserId,'EMPL') : this.viewJobSummery(this.fromIdsummeryUrl,this.redirectUsertypeData);
    toUpdatejson['DetailsSummaryURL'] = this.viewJobSummery(this.contactIdForUrl,this.activityFor),
    toUpdatejson['ToProfileImage'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.currentUserProfileImage: this.ProfileImagePath?this.ProfileImagePath:'';
    toUpdatejson['ToProfileImageUrl'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.ToProfileImageUrl?this.profileImageURL:'': this.profileImageURL?this.profileImageURL:'';
    toUpdatejson['FromProfileImage'] = this.callType.toLocaleLowerCase() == 'incoming' ? this.ProfileImagePath?this.ProfileImagePath:'' : this.currentUserProfileImage;
    toUpdatejson['FromProfileImageUrl'] = this.callType.toLocaleLowerCase() == 'incoming' ?this.profileImageURL? this.profileImageURL:'':'';    
    fromJson['SaveTo']=this.data?.usertype;
    fromJson['SaveToId']=this.data?.Id;
    fromJson['CategoryId']= this.CategoryId;
    fromJson['CategoryName']=this.CategoryName;
    fromJson['StartDate']=this.fromUtcDate;
    fromJson['FromId']=this.callTypedata.toLocaleLowerCase() =='incoming'?this.selectedRelatedUser?.Id:this.currentUserId,
    fromJson['FromName']=this.callTypedata.toLocaleLowerCase() =='incoming'?this.selectedRelatedUser?.Name:cureentUserName,
    fromJson['ToId']=this.callTypedata.toLocaleLowerCase() =='incoming'?this.currentUserId:this.selectedRelatedUser?.Id,
    fromJson['ToName']=this.callTypedata.toLocaleLowerCase() =='incoming'?cureentUserName:this.selectedRelatedUser?.Name,
    fromJson['CallType']=this.callTypedata;
    fromJson['RelatedTo']= this.fromRelatedTo;
    fromJson['DetailsId']=this.fromDetailsId;
    fromJson['DetailsName']=this.fromDetailsName;
    fromJson['Notes']=this.getEditorValForFrom,
    fromJson['Duration']=this.decimalhour;
    fromJson['IsNotes']=this.fromIsNotes;
    fromJson['Source']=this.addCallForm.value?.SourcDescription?.trim();
    fromJson['callId']= this.callId;
    fromJson['NotesURL'] = 'Notes';
    fromJson['SaveToName'] = this.callTypedata.toLocaleLowerCase()  == 'incoming' ? this.selectedRelatedUser?.Name : cureentUserName;
    fromJson['SaveToSummaryURL'] = this.SaveToSummeryUrl;
    fromJson['EndCallerTypeCode'] = '';
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
 //onDismiss function for cansel form
  onDismiss(): void {
    document.getElementsByClassName("add-calllog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-calllog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }


 //openImageUpload function for upload image
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
    else if (sources == undefined && event?.val == '') {
      this.getNotesDetails = event?.val;
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
    // const regex = /<(?!img\s*\/?)[^>]+>/gi;
    // let result = event.val?.replace(regex, '\n');
    // if (result?.length > 500) {
    //   this.maxlenth = result?.length;
    //   // this.editConfigmaxlength();
    //   this.showMaxlengthError = true;
    // } else if (result?.length <= 500) {
    //   this.showMaxlengthError = false;
    //   this.addCallForm.get('NotesDiscription').setValue(event?.val);
    // }
  }

 //getEditorImageFormInfo function for first time  upload image 
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
    // let result = event.val?.replace(regex, '\n');
    // if (result?.length > 500) {
    //   this.maxlenth = result?.length;
    //   // this.editConfigmaxlength();
    //   this.showMaxlengthError = true;
    // } else if (result?.length <= 500) {
    //   this.showMaxlengthError = false;
    //   this.addCallForm.get('NotesDiscription').setValue(event?.val);
    // }
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
    // if (this.maxlenth>500) {
    //   this.showMaxlengthError=true;
    // }else{
    // this.showMaxlengthError=false;
    // }
    this.showMaxlengthError = true;

    this.maxLengthEditorValue.next(this.editorConfig);
    this.addCallForm.get('NotesDiscription').updateValueAndValidity();
    this.addCallForm.get("NotesDiscription").markAsTouched();
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
 //onHideMoreField function for show and hide btn
  onHideMoreField(el) {
    this.hideMoreFields = !this.hideMoreFields;
    if (this.showReferenceId || this.showStartDate || this.showExpiryDate) {
      this.showReferenceId = false;
      this.showStartDate = false;
      this.showExpiryDate = false;
    }
   this.goDown2()
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
 //handleChangeStartTime function for start time
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

 //onChangeEndTime function for end time
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
 //timevalue function for minute time get data
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
 //onChangeActivityRelatedTo function for change related to
  onChangeActivityRelatedTo(activityFor) {
    this.selectedRelatedUser = null;
    this.activityForAttendees = activityFor;
    this.redirectUsertype=activityFor;
    if (activityFor == "JOB") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Job'
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "CAND") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Candidate'
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "EMPL") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Employee'
      })
      this.getActivityTypeCategory(activityFor);
    } else if (activityFor == "CLIE") {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': 'Client'
      })
      this.getActivityTypeCategory(activityFor);
    } else {
      this.addCallForm.patchValue({
        'RelatedUserTypeName': '',
      })
      this.ActivityTypeList = [];
    }

  }
  CallUserType:boolean=false;
  onChangeActivityRelatedToSecond(activityFor) {
    this.CallUserType=false;
    this.activityFor = activityFor;
    this.redirectUsertype=activityFor;
    this.SecondselectedRelatedUser = null;
    this.addCallForm.patchValue({
      SecondRelatedUserUserName: ''
    })
    if (activityFor == null || activityFor == undefined) {
      this.SecondselectedRelatedUser = null;

      this.addCallForm.get("RelatedUserId").clearValidators();
      this.addCallForm.get("SecondRelatedUserUserName").clearValidators();

      this.addCallForm.get("RelatedUserId").markAsPristine();
      this.addCallForm.get("SecondRelatedUserUserName").markAsPristine();
      this.common_DropdownC_Config_Details = {
        API: '',
        MANAGE: '',
        BINDBY: '',
        REQUIRED: false,
        DISABLED: true,
        PLACEHOLDER: 'label_Vxt_Save_To_Name',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: '',
        IMG_BIND_VALUE: 'ProfilePicturePreview',
        FIND_BY_INDEX: ''
      }
      this.CallUserType=true;
      this.SecondselectedRelatedUser={};
      // this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
      this.common_DropdownC_Config_Details.API = '';
      this.common_DropdownC_Config_Details.IMG_SHOW = false;
      this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
      this.common_DropdownC_Config_Details.BINDBY = '';
      this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
    } else {
      this.common_DropdownC_Config_Details.DISABLED = false;
      this.common_DropdownC_Config_Details.REQUIRED = true;
      if (activityFor?.toLocaleLowerCase()=='job') {
      this.extraBindValue='JobReferenceId';  
      }else if(activityFor?.toLocaleLowerCase()!='job' && activityFor?.toLocaleLowerCase()!='cont'){
        this.extraBindValue='Email';
      }
      else if(activityFor?.toLocaleLowerCase()=='cont'){
      this.extraBindValue='EmailId';  
      }
      this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = this.extraBindValue;
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
          'SecondRelatedUserType':  this.activityFor
  
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "EMPL") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Employee',
          'SecondRelatedUserType':  this.activityFor
  
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "CLIE") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Client',
          'SecondRelatedUserType':  this.activityFor
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "CONT") {
        this.addCallForm.patchValue({
          // 'SecondRelatedUserTypeName': 'Client',
          'SecondRelatedUserType':  this.activityFor
        })
        this.common_DropdownC_Config_Details.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config_Details.IMG_SHOW = true;
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = true;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'EmailId';
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
    switch (activityFor) {
      case "JOB": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllJobForActivityV2;
        this.common_DropdownC_Config.MANAGE = '';
        this.common_DropdownC_Config.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = 'JobReferenceId';
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End 
        break;
      }
      case "CAND": {
        this.common_DropdownC_Config.API = this.serviceListClass.getAllCandidateForActivity_v2;
        this.common_DropdownC_Config.MANAGE = './client/cand/candidate/candidate-list';
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = 'Email';
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
        this.common_DropdownC_Config.EXTRA_BIND_VALUE = 'Email';
        this.common_DropdownC_Config.SHORTNAME_SHOW = false;
        this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
        // End
        break;
      }
      case "CONT": {

        this.common_DropdownC_Config_Details.API = this.serviceListClass.getClientsContact;
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'EmailId';
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
        this.common_DropdownC_Config_Details.API = this.serviceListClass.jobWithoutWorkflowV3;
        this.common_DropdownC_Config_Details.MANAGE = '';
        this.common_DropdownC_Config_Details.SHORTNAME_SHOW = false;
        this.common_DropdownC_Config_Details.IMG_SHOW = false;
        this.common_DropdownC_Config_Details.BINDBY = 'Name';
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'JobReferenceId';
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
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'EmailId';
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
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'Email';
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
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'Email';
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
        this.common_DropdownC_Config_Details.EXTRA_BIND_VALUE = 'EmailId';
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
if (this.activityFor=='CONT') {  
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
  this.SecondresetRelattedUserDrp.next(this.common_DropdownC_Config_Details);
  this.addCallForm.patchValue({
    SecondRelatedUserId: data?.ContactId,
    SecondRelatedUserUserName: data?.FullName,
  })
  if (localStorage.getItem('contctIdForUrl')!=null && localStorage.getItem('contctIdForUrl')!=undefined && localStorage.getItem('contctIdForUrl')!='' && value=='true') {
    this.contactIdForUrl= localStorage.getItem('contctIdForUrl'); 
    }else{
    this.contactIdForUrl=data?.Id;
    localStorage.setItem('contctIdForUrl',data?.Id)
  
    }
  this.ProfilePicture=data?.ProfilePicture;
    
  // this.contactIdForUrl=data?.Id;
}else{
  this.SecondselectedRelatedUser = data;
  this.contactIdForUrl=data?.Id;
  this.workflowId=data?.WorkflowId;
  this.ProfilePicture=data?.ProfilePicture;
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



 //getVxtLastCallDetails function for getvxt call details 
  getVxtLastCallDetails() {
    this.getVxtLastCallDetail = this.candidateService?.getVxtLastCallDetails('?id=' + this.data?.Id + '&usertype=' + this.data?.usertype)
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
//for open new email popup 
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
  formatDateToUTC(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }
}
