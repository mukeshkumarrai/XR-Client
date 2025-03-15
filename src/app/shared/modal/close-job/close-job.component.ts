import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ContactReceipentPopupComponent } from 'src/app/modules/EWM.core/shared/contact-receipent-popup/contact-receipent-popup.component';
import { customDropdownConfig, UserEmailIntegration } from 'src/app/modules/EWM.core/shared/datamodels';
import { Email } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { TemplatesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/templates/templates.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from '../../models';
import { AppSettingsService } from '../../services/app-settings.service';
import { KendoEditorImageUploaderService } from '../../services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { ServiceListClass } from '../../services/sevicelist';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { ImageUploadKendoEditorPopComponent } from '../image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MailServiceService } from '../../services/email-service/mail-service.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { DeleteConfirmationComponent } from '../confirm-dialog/delete-confirmation/delete-confirmation.component';
import { closeJobData, ICandidateMail, IDelinkCandidate, IMoveCandidate } from '@app/modules/xeople-job/job-manage/IquickJob';
//import { customDropdownConfig } from '../../datamodels/common.model';
@Component({
  selector: 'app-close-job',
  templateUrl: './close-job.component.html',
  styleUrls: ['./close-job.component.scss']
})
export class CloseJobComponent implements OnInit {
  public dropDownJobStatusConfig: customDropdownConfig[] = [];
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public dropDownCanReasonConfig: customDropdownConfig[] = [];
  public dropDownCanStatusConfig:customDropdownConfig[] = [];
  public dropDownToConfig:customDropdownConfig[] = [];
  public selectedReason: any = {};
  resetFormselectedReason: Subject<any> = new Subject<any>();
  resetFormCanselectedReason: Subject<any> = new Subject<any>();
  resetFormCanselectedStatus: Subject<any> = new Subject<any>();
  resetFormWorkFlowStages: Subject<any> = new Subject<any>();
  public selectedJobStatus: any = {};
  public selectedCanJobStatus:any ={};
  public selectedCanReason: any = {};
  public selectedToCandidates:any = [];
  public selectedCandidatesObj:any = [];
  public groupJobID:string ;
  public groupCandidateID:string;
  closeJobForm: FormGroup;
  public selectedCandidateList:any = [];
  public jobId:string;
  public workflowId:string;
  public parentStagesList:any=[];
  public isSendEmailSelected:boolean=false; 
  searchValue: string;
  maxMoreLength: any = 1;
  // @When: 20-09-2023 @who:Amit @why: EWM-13899 @what: maxMoreLengthEmail add
  maxMoreLengthEmail: any = 2;
  public candidateSelectedListId:any=[];  
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  public loading:boolean=false;
  @ViewChild('editor') editor: EditorComponent;
  DefaultSignature:Number;
  subscription$: Subscription;
  dirctionalLang;  
  public userEmailIntegration: UserEmailIntegration;
  public userEmail: string;
  emailProvider: any;
  public showCC : boolean = false;
  public showBCC : boolean = false;
  public ccEmailList = [];
  public bccEmailList = [];
  public emailListLengthccMore: any=1;
  public emailListLengthMore:number=1;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: Email[] = [    
  ];
  public fileAttachments: any[] = [];
  public fileType: any;
  public fileSize: any;
  public  filestatus: boolean = true;
  public  fileInfo: any={};
  public  uploadFiles: any;
  public  fileSizetoShow: string;
  public arr=[];
  public attachmentName:string;
  ModuleName:string;
  @ViewChild('target') private myScrollContainer: ElementRef;
  isfileAttachments:boolean;
  public JobTitle:string;
  public JobStatusObj = {};
  public JobStatus:string;
  public JobStatusId:string;
  public isSelectedCandidates:boolean=false;
  public isMoveSelectedCandidates:boolean=false;
  public isDeLinkSelectedCandidates:boolean=false; 
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;  
  private _mobileQueryListener: () => void;
  maxMessage: number = 300;
  public closeJobInfo:closeJobData;
  public workflowName:string;
  isResponseGet:boolean = false;


  constructor(public dialogRef: MatDialogRef<CloseJobComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,private serviceListClass: ServiceListClass,private appSettingsService: AppSettingsService,
     public systemSettingService: SystemSettingService,private snackBService: SnackBarService,
      private translateService: TranslateService,private jobService:JobService,private mailService: MailServiceService,
      private _profileInfoService: ProfileInfoService,
      private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        this.fileType = appSettingsService.file_file_type_extralarge;
        this.fileSizetoShow = appSettingsService.file_file_type_mail;
        if (this.fileSizetoShow.includes('KB')) {
          let str = this.fileSizetoShow.replace('KB', '')
          this.fileSize = Number(str) * 1000;
        }
        else if (this.fileSizetoShow.includes('MB')) {
          let str = this.fileSizetoShow.replace('MB', '')
          this.fileSize = Number(str) * 1000000;
        }
          

        
    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiry();
    };
    this.forSmallSmartphones.addListener(this._mobileQueryListener);

    this.groupJobID = this.appSettingsService.jobID;
    this.groupCandidateID = this.appSettingsService.candidateID;
    this.jobId = data.jobId;
    this.JobTitle = data.JobTitle;
    this.workflowId = data.WorkflowId;
    this.workflowName = data.WorkflowName;
    this.JobStatusObj = data.JobStatusObj;
    this.JobStatus = data.JobStatusObj[0]?.Name;
    this.JobStatusId = data.JobStatusObj[0]?.Id;


     //////Job Status//////////////
     this.dropDownJobStatusConfig['IsDisabled'] = false;
     this.dropDownJobStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + "?GroupId=" + this.groupJobID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
     this.dropDownJobStatusConfig['placeholder'] = 'label_closejob_job_status';
     this.dropDownJobStatusConfig['IsManage'] = '/client/core/administrators/group-master';
     this.dropDownJobStatusConfig['IsRequired'] = true;
     this.dropDownJobStatusConfig['searchEnable'] = true;
     this.dropDownJobStatusConfig['bindLabel'] = 'ShortDescription';
     this.dropDownJobStatusConfig['multiple'] = false;
     this.dropDownJobStatusConfig['isClearable'] = false;
     
    ////// Job Reason //////////////
    this.dropDownReasonConfig['IsDisabled'] = false;
    this.dropDownReasonConfig['placeholder'] = 'label_closejob_job_status_reason';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId='+this.groupJobID;
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;


    //////Can Status//////////////
    this.dropDownCanStatusConfig['IsDisabled'] = this.isDeLinkSelectedCandidates?false:true;
    this.dropDownCanStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + '?GroupId=' + this.groupCandidateID +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownCanStatusConfig['placeholder'] = 'label_closjob_candidate_status';
    this.dropDownCanStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=' + this.groupCandidateID;
    this.dropDownCanStatusConfig['IsRequired'] = false;
    this.dropDownCanStatusConfig['searchEnable'] = true;
    this.dropDownCanStatusConfig['bindLabel'] = 'Code';
    this.dropDownCanStatusConfig['multiple'] = false;
    this.dropDownCanStatusConfig['isClearable'] = false;
    
      //////Can Reason//////////////
    this.dropDownCanReasonConfig['IsDisabled'] = this.isDeLinkSelectedCandidates?false:true;
    this.dropDownCanReasonConfig['placeholder'] = 'label_closjob_candidate_reason';
    this.dropDownCanReasonConfig['IsManage'] = '';
    this.dropDownCanReasonConfig['IsRequired'] = false;
    this.dropDownCanReasonConfig['searchEnable'] = true;
    this.dropDownCanReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownCanReasonConfig['multiple'] = false;

    
  /////////////////To/////////////////////
  
  this.dropDownToConfig['IsDisabled'] = false;
  this.dropDownToConfig['apiEndPoint'] = this.serviceListClass.getAllSelectedCandidates + '?JobId=' + this.jobId + '&WorkflowId='+ this.workflowId;
  this.dropDownToConfig['placeholder'] = 'label_to';
  this.dropDownToConfig['IsManage'] = '';
  this.dropDownToConfig['IsRequired'] = false;
  this.dropDownToConfig['searchEnable'] = true;
  this.dropDownToConfig['bindLabel'] = 'EmailId';
  this.dropDownToConfig['multiple'] = true;

  




    
    this.closeJobForm = this.fb.group({
      StatusId: [, [Validators.required]],
      StatusName: [],  
      ReasonId: [0],
      ReasonName: [''],
      selectedCandidates:[],
      MoveCandidate:[],
      WorkflowStageObj:[],
      DelinkCandidate:[''],
      Comment:['',[Validators.maxLength(300)]],
      SendEmail:[''],
      CanStatusId: [],
      CanStatusName: [''],  
      CanReasonId: [''],
      CanReasonName: [''],
      To:[[]],
      EmailCC: [''],
      EmailBCC: [''],
      FromEmail:[],
      JobId:[''],
      JobTitle:[''],
      workflowName:[''],
      workflowId:[''],
      Subject:['',[Validators.maxLength(500)]],
      Description:[]

    });


   }

  ngOnInit(): void {
    this.closeJobInfo=<closeJobData>{};
    this.screenMediaQuiry();
   this.getSelectedCandidateList();
    this.getParentStagesList();
    this.getInsertPlaceholderByType('Jobs');
    this.getUserEmailIntegration();
    this.closeJobForm.patchValue({
      JobId:this.jobId,
      JobTitle:this.JobTitle,
      workflowName:this.workflowName,
      workflowId:this.workflowId
    });
    this.closeJobForm.get('WorkflowStageObj').disable();
    this.closeJobForm.get('Comment').disable();

  }

  // @When: 21-09-2023 @who:Amit @why: EWM-13899 @what: maxMoreLengthEmail change
  screenMediaQuiry() {
    if (this.forSmallSmartphones.matches == true) {
      this.maxMoreLength = 1;
      this.maxMoreLengthEmail = 1;
    } else if (this.forSmartphones.matches == true) {
      this.maxMoreLength = 1;
      this.maxMoreLengthEmail = 1;
    } else if (this.forLargeSmartphones.matches == true) {
      this.maxMoreLength = 1;
      this.maxMoreLengthEmail = 1;
    } else if (this.forIpads.matches == true) {
      this.maxMoreLength = 1;
      this.maxMoreLengthEmail = 2;
    } else if (this.forMiniLapi.matches == true) {
      this.maxMoreLength = 1;
      this.maxMoreLengthEmail = 2;
    } else {
      this.maxMoreLength = 1;
      this.maxMoreLengthEmail = 2;
    }
  }

  /* 
@Type: File, <ts>
@Name: onJobStatuschange function
@Who: Suika
@When: 17-09-2023
@Why: EWM-13816 EWM-13898
@What: get Status List
*/
onJobStatuschange(data) {
  if(data.Id==this.JobStatusId){
    this.closeJobForm.get("StatusId").setErrors({ currentStatus: true });
    this.closeJobForm.get("StatusId").markAsTouched();
    this.closeJobForm.get("StatusId").markAsDirty();
    return false;
  }
  if (data == null || data == "") {
    this.selectedJobStatus = null;
    this.closeJobForm.patchValue(
      {
        StatusId: null,
        ReasonId: 0,
        ReasonName: ''
      }
    )
    this.closeJobForm.get("StatusId").setErrors({ required: true });
    this.closeJobForm.get("StatusId").markAsTouched();
    this.closeJobForm.get("StatusId").markAsDirty();
  }
  else {  
    this.closeJobForm.get("StatusId").clearValidators();
    this.closeJobForm.get("StatusId").markAsPristine();
    this.selectedJobStatus = data;
    this.closeJobForm.patchValue(
      {
        StatusId: data.Id,
        StatusName: data.ShortDescription,
        ReasonId: 0,
        ReasonName: ''
      }
    )
    this.selectedReason={};
  }
  //////Job Sub Type//////////////
  this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
  this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.groupJobID + '&statusId=' + this.selectedJobStatus.Id + '&GroupCode=JOB';
  this.resetFormselectedReason.next(this.dropDownReasonConfig);
}



  /*
    @Type: File, <ts>
    @Name: onManageReasonchange function
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: For showing the list of reason data
   */
  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.closeJobForm.patchValue(
        {
          ReasonId: 0,
          ReasonName: ''
        }
      )
    }
    else {
      this.selectedReason = data;
      this.closeJobForm.patchValue(
        {
          ReasonId: data.Id,
          ReasonName: data.ReasonName,
        }
      )
    }
  }


    /*
    @Type: File, <ts>
    @Name: onManageCanReasonchange function
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: For showing the list of reason data
   */
  onManageCanStatuschange(data) {
    this.selectedReason = null ;
    if (data == null || data == "") {
      this.selectedCanJobStatus = null;
      this.selectedCanReason = null;
      this.closeJobForm.patchValue(
        {
          CanStatusId: null,
          CanStatusName: '',
          CanReasonId: 0,
          CanReasonName: ''
        }
      )
      // this.closeJobForm.get("CanStatusId").setErrors({ required: true });
      // this.closeJobForm.get("CanStatusId").markAsTouched();
      // this.closeJobForm.get("CanStatusId").markAsDirty();
      this.dropDownCanReasonConfig['IsManage'] = '';
      // this.dropDownCanReasonConfig['IsRequired'] = true
    }
    else {
      // this.closeJobForm.get("CanStatusId").clearValidators();
      // this.closeJobForm.get("CanStatusId").markAsPristine();
      this.selectedCanJobStatus = data;
      this.selectedCanReason = null;
      this.closeJobForm.patchValue(
        {
          CanStatusId: data.Id,
          CanStatusName: data.Description,
          CanReasonId: 0,
          CanReasonName: ''
        }
      )
      // this.closeJobForm.get("CanReasonId").setErrors({ required: true });
     // this.closeJobForm.get("CanReasonId").markAsTouched();
     // this.closeJobForm.get("CanReasonId").markAsDirty();
      // this.dropDownCanReasonConfig['IsRequired'] = true; 
      this.dropDownCanReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.groupCandidateID + '&statusId='+ this.selectedCanJobStatus.Id+'&GroupCode=CANDIDATE';
      this.dropDownCanReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedCanJobStatus.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=candidate';
      this.resetFormCanselectedReason.next(this.dropDownCanReasonConfig);
    }
    
   
  }


    /*
    @Type: File, <ts>
    @Name: onManageCanReasonchange function
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: For showing the list of reason data
   */
  onManageCanReasonchange(data) {
    if (data == null || data == "") {
      this.selectedCanReason = null;
      this.closeJobForm.patchValue(
        {
          CanReasonId: 0,
          CanReasonName: ''
        }
      )
      // this.closeJobForm.get("CanReasonId").setErrors({ required: true });
      // this.closeJobForm.get("CanReasonId").markAsTouched();
      // this.closeJobForm.get("CanReasonId").markAsDirty();
      // this.dropDownCanReasonConfig['IsRequired'] = true;
    }
    else {
      this.selectedCanReason = data;
     // this.closeJobForm.get("CanReasonId").clearValidators();
      //this.closeJobForm.get("CanReasonId").markAsPristine();
      this.closeJobForm.patchValue(
        {
          CanReasonId: data.Id,
          CanReasonName: data.ReasonName,
        }
      )
    }
    // this.dropDownCanReasonConfig['IsRequired'] = true;
    // this.resetFormCanselectedReason.next(this.dropDownCanReasonConfig);
  }





    /*
    @Type: File, <ts>
    @Name: getSelectedCandidateList
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: To get Data for selected candidates
    */
   getSelectedCandidateList() {
     let jobId = this.jobId;
     let workflowId = this.workflowId;
    this.systemSettingService.getAllSelectedCandidates(jobId,workflowId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.selectedCandidateList = repsonsedata.Data;
            this.selectedToCandidates = repsonsedata.Data; 
            this.selectedCandidatesObj = repsonsedata.Data;    
            this.selectAllForDropdownItems(this.selectedCandidateList);
            this.closeJobForm.patchValue(
              {
                selectedCandidates:  this.selectedCandidatesObj,
                To:this.selectedToCandidates
              })  
              if(this.selectedCandidateList?.length>0) {
                this.isSelectedCandidates = true;
              }else{
                this.isSelectedCandidates = false;
              }     
        }else if (repsonsedata.HttpStatusCode === 204) {
          this.selectedCandidateList = [];       
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {

      })
  }




      /*
    @Type: File, <ts>
    @Name: getParentStagesList
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: To get Data for parent stage
    */
   getParentStagesList() {
     let currentStageId = '00000000-0000-0000-0000-000000000000';
     let level = 1;
   this.jobService.getAllNextStages_v2('?workflowid=' +  this.workflowId + '&currentstageid=' + currentStageId + '&level=' + level).subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200) {
         this.parentStagesList = repsonsedata.Data;       
       }else if (repsonsedata.HttpStatusCode === 204) {
         this.parentStagesList = [];       
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
       }
     }, err => {

     })
 }






      /*
    @Type: File, <ts>
    @Name: isSendEmailSelectedInfo
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: To isSendEmailSelectedInfo
    */
 isSendEmailSelectedInfo(event){
   if(event?.checked==true){
    this.isSendEmailSelected = true;
    this.closeJobForm.get("To").setErrors({ required: true });
    this.closeJobForm.get("Subject").setErrors({ required: true});
    this.closeJobForm.get("Description").setErrors({ required: true });
    this.closeJobForm.get('JobTitle').patchValue(this.JobTitle);
   }else{
    this.isSendEmailSelected = false;
    this.closeJobForm.get("To").markAsUntouched();
    this.closeJobForm.get("To").setErrors(null);
    this.closeJobForm.get("To").clearValidators();
    this.closeJobForm.get("To").markAsPristine();
    this.closeJobForm.get("Subject").markAsUntouched();
    this.closeJobForm.get("Subject").setErrors(null);
    this.closeJobForm.get("Subject").clearValidators();
    this.closeJobForm.get("Subject").markAsPristine();
    this.closeJobForm.get("Description").markAsUntouched();
    this.closeJobForm.get("Description").setErrors(null);
    this.closeJobForm.get("Description").clearValidators();
    this.closeJobForm.get("Description").markAsPristine();
   }
   
 }







 /* 
   @Type: File, <ts>
   @Name: onWorkFlowStagechange
   @Who: Suika
   @When: 17-09-2023
   @Why: EWM-13816 EWM-13898
   @What: when realtion drop down changes 
 */


onWorkFlowStageChanges(data){
  this.closeJobForm.patchValue(
    {
      WorkflowStageObj:data,
    }
    )
}

onSelectedCandidateschanges(data){

}
 /* 
   @Type: File, <ts>
   @Name: onSelectedCandidateschange
   @Who: Suika
   @When: 17-09-2023
   @Why: EWM-13816 EWM-13898
   @What: when realtion drop down changes 
 */
onSelectedCandidateschange(data){    
  //this.selectedCandidatesObj=null;     
  if(data==null || data=="")
  {
    this.isSelectedCandidates = false;
    this.selectedCandidatesObj=null;     
    this.closeJobForm.get("selectedCandidates").setErrors({ required: true });
    this.closeJobForm.get("selectedCandidates").markAsTouched();
    this.closeJobForm.get("selectedCandidates").markAsDirty();
  }
  else
  {
    this.isSelectedCandidates = true;
    this.closeJobForm.get("selectedCandidates").clearValidators();
    this.closeJobForm.get("selectedCandidates").markAsPristine();
    this.selectedCandidatesObj=data;   
    this.closeJobForm.patchValue(
      {
        selectedCandidates:data.CandidateId,
      }
   )
  }
}
selectAllForDropdownItems(items: any[]) {
  let allSelect = items => {
    items.forEach(element => {
      element['selectedAllGroup'] = 'selectedAllGroup';
    });
  };

  allSelect(items);
}
/*
  @Type: File, <ts>
  @Name: getInsertPlaceholderByType
  @Who: Suika
  @When: 17-09-2023
  @Why: EWM-13816 EWM-13898
  @What: For Insert Job tag value
*/
getInsertPlaceholderByType(insertType) {
  this.systemSettingService.getPlaceholderByType(insertType).subscribe(
    respdata => {
      if (respdata['Data']) {
        let existing: any[] = this._toolButtons$.getValue();
        this.plcData = [];
        for (let plc of respdata['Data']) {
          this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
        }
        let peopleButton: string = insertType;
        // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
        existing.push({ text: peopleButton, data: this.plcData });
        let jobData: any = existing?.filter((item) => {
              return item.text === insertType
            });
            this._toolButtons$.next(jobData);            
     }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}



/*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Suika
  @When: 17-09-2023
  @Why: EWM-13816 EWM-13898
  @What: open modal for set image in kendo editor
*/  
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


  /* 
    @Type: File, <ts>
    @Name: onDismissphone
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: Function will cancel popup 
  */
 onDismissphone(data): void {
  document.getElementsByClassName("candidate-jobapplicationform")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("candidate-jobapplicationform")[0].classList.add("animate__zoomOut");
  this.dialogRef.close({ data: data });
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.remove("is-blurred");
  }
}


/*
  @Type: File, <ts>
  @Name: openTemplateModal
  @Who: Suika
  @When: 17-09-2023
  @Why: EWM-13816 EWM-13898
  @What: to open template modal dialog
*/
openTemplateModal() {
  const message = 'label_close_job_msg';
  const title = 'label_disabled';
  const subtitle = 'label_insertTemplate';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(TemplatesComponent, {
      panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     if(res!=false){
      this.systemSettingService.getEmailTemplateByID('?id=' + res.data.Id).subscribe(
        (repsonsedata:ResponceData) => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode === 200) {
            
            let cceList = repsonsedata.Data.CcEmail?.split(',');
            for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
              if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
                this.ccEmailList.push({ value: cceList[itr2], invalid: false });
              }
            }
            let bcceList = repsonsedata['Data'].BccEmail?.split(',');
            for (let itr3 = 0; itr3 < bcceList?.length; itr3++) {
              if (bcceList[itr3]?.length != 0 && bcceList[itr3] != '') {
                this.bccEmailList.push({ value: bcceList[itr3], invalid: false });
              }
            }

            this.closeJobForm.patchValue({
              'Subject': repsonsedata.Data.Subject,
              'Description': repsonsedata['Data'].TemplateText
            });
            let ccEMailVal = '';
            let bccEMailVal = '';


            for (let i = 0; i < this.ccEmailList?.length; i++) {
              if (ccEMailVal?.length === 0 || ccEMailVal === '') {
                ccEMailVal = this.ccEmailList[i].value;
              }
              else {
                ccEMailVal += ',' + this.ccEmailList[i].value;
              }
            }
           
            for (let i = 0; i < this.bccEmailList?.length; i++) {
              if (bccEMailVal?.length === 0 || bccEMailVal === '') {
                bccEMailVal = this.bccEmailList[i].value;
              }
              else {
                bccEMailVal += ',' + this.bccEmailList[i].value;
              }
            }
           
         
            this.closeJobForm.patchValue({
              'EmailCC': ccEMailVal
            });
            this.closeJobForm.patchValue({
              'EmailBCC': bccEMailVal
            });
            
            if(ccEMailVal!='')
            {
              this.showCC=true;
              //this.showCCBtn();
            }
            if(bccEMailVal!='')
            {
              this.showBCC=true;
              //this.showBCCBtn();
            }
            let filedata;
            filedata = repsonsedata.Data.Files;
            let fSize: number = 0;
            if (filedata === undefined) {
              this.fileAttachments = [];
            }else{
             filedata.forEach(element => {
              fSize += element.Size;
               this.fileAttachments.push({
                 'Name':element.Name,
                 'Size':element.Size,
                 'Path':element.Path
               })
             });
         
             if (fSize > this.fileSize) {
              this.filestatus=true;
              this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentSize') + ' ' + this.fileSizetoShow, '');
              return;
            }else{
              this.filestatus=false;
            }
            this.DefaultSignature = repsonsedata.Data?.DefaultSignature;
            }
            this.ModuleName = repsonsedata.Data?.RelatedTo;
         }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
          }
        },
        err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
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


    
 /*
@Name: getUserEmailIntegration
@Who: Suika
@When: 17-09-2023
@Why: EWM-13816 EWM-13898
@What: to get default email Id
*/
getUserEmailIntegration() {
  this.loading = true;
  this._profileInfoService.getUserEmailIntegration().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.userEmailIntegration = data.Data;
        this.userEmail = this.userEmailIntegration.Email;
        this.loading = false;
        this.emailProvider=data.Data.EmailProvider;
        this.closeJobForm.patchValue({
          'FromEmail': this.userEmail 
        })
      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
     // this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}



showCCBtn(){
  this.showCC = !this.showCC;
  if(this.showCC == true){
    document.getElementsByClassName('ccBccEmailBtn')[0]?.classList.add('activeBtnColor');
  }
  if(this.showCC == false){
    document.getElementsByClassName('ccBccEmailBtn')[0]?.classList.remove('activeBtnColor');
  }
}

showBCCBtn(){
  this.showBCC = !this.showBCC;
  if(this.showBCC == true){
    document.getElementsByClassName('bccBccEmailBtn')[0]?.classList.add('activeBtnColor');
  }
  if(this.showBCC == false){
    document.getElementsByClassName('bccBccEmailBtn')[0]?.classList.remove('activeBtnColor');
  }
}



removeccEmail(data: any): void {
  if (this.ccEmailList.indexOf(data) >= 0) {
    this.ccEmailList.splice(this.ccEmailList.indexOf(data), 1);
  }

  let eMailVal = '';
  let invalidEmail = false;

  for (let i = 0; i < this.ccEmailList?.length; i++) {
    if (this.ccEmailList[i].invalid === true) {
      invalidEmail = true;
    }

    if (eMailVal?.length === 0 || eMailVal === '') {
      eMailVal = this.ccEmailList[i].value;
    }
    else {
      eMailVal += ',' + this.ccEmailList[i].value;
    }
  }

  this.closeJobForm.patchValue({
    'ccMails': eMailVal
  });

  if (eMailVal?.length === 0 || eMailVal === '') {
    /* this.newEmailTemplateForm.get("ccMails").clearValidators();
    this.newEmailTemplateForm.get("ccMails").setErrors({ required: true });
    this.newEmailTemplateForm.get("ccMails").markAsDirty(); */
  }
  else {
    if (invalidEmail) {
      this.closeJobForm.get("ccMails").clearValidators();
      this.closeJobForm.controls["ccMails"].setErrors({ 'incorrectEmail': true });
    }
  }
}


public clickForccMoreRecord(emailArr) {
  this.emailListLengthccMore = emailArr?.length;
}

 /* 
   @Type: File, <ts>
   @Name: onJobchange
   @Who: Suika
   @When: 17-09-2023
   @Why: EWM-13816 EWM-13898
   @What: when realtion drop down changes 
 */
getUserContactInfo(currEmailType) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "";
  dialogConfig.autoFocus = false;
  dialogConfig.panelClass = 'myDialogCroppingImage';
  dialogConfig.data = null;
  dialogConfig.panelClass = ['xeople-modal', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
  const modalDialog = this.dialog.open(ContactReceipentPopupComponent, dialogConfig);
  
  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }	
  modalDialog.afterClosed().subscribe(res => {
    for (let i = 0; i < res['data']?.length; i++) {
      let IsDuplicate = false;
       if (currEmailType === 'CC') {
        for (let j = 0; j < this.ccEmailList?.length; j++) {
          if (this.ccEmailList[j].value === res['data'][i]['emailId']) {
            IsDuplicate = true;
          }
        }

        if (IsDuplicate === false) {
          if (this.validateEmail(res['data'][i]['emailId'])) {
            this.ccEmailList.push({ value: res['data'][i]['emailId'], invalid: false });
            this.setCCEmailsValues();
          } else {
            this.ccEmailList.push({ value: res['data'][i]['emailId'], invalid: true });
            this.setCCEmailsValues();
            this.closeJobForm.get("EmailCC").clearValidators();
            this.closeJobForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
          }
        }
      }
      else if (currEmailType === 'BCC') {
        for (let j = 0; j < this.bccEmailList?.length; j++) {
          if (this.bccEmailList[j].value === res['data'][i]['emailId']) {
            IsDuplicate = true;
          }
        }

        if (IsDuplicate === false) {
          if (this.validateEmail(res['data'][i]['emailId'])) {
            this.bccEmailList.push({ value: res['data'][i]['emailId'], invalid: false });
            this.setBccEmailsValues();
          } else {
            this.bccEmailList.push({ value: res['data'][i]['emailId'], invalid: true });
            this.setBccEmailsValues();
            this.closeJobForm.get("EmailBCC").clearValidators();
            this.closeJobForm.controls["EmailBCC"].setErrors({ 'incorrectEmail': true });
          }
        }
      }
    }
    
  })
  return false;
}

private validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


setBccEmailsValues() {
  let eMailVal = '';
  let IsValid = true;

  for (let i = 0; i < this.bccEmailList?.length; i++) {
    if (this.validateEmail(this.bccEmailList[i].value) === false) {
      IsValid = false;
    }

    if (eMailVal?.length === 0 || eMailVal === '') {
      eMailVal = this.bccEmailList[i].value;
    }
    else {
      eMailVal += ',' + this.bccEmailList[i].value;
    }
  }

  this.closeJobForm.patchValue({
    'EmailBCC': eMailVal
  });

  if (IsValid === false) {
    this.closeJobForm.get("EmailBCC").clearValidators();
    this.closeJobForm.controls["EmailBCC"].setErrors({ 'incorrectEmail': true });
  }
}


setCCEmailsValues() {
  let eMailVal = '';
  let IsValid = true;

  for (let i = 0; i < this.ccEmailList?.length; i++) {
    if (this.validateEmail(this.ccEmailList[i].value) === false) {
      IsValid = false;
    }

    if (eMailVal?.length === 0 || eMailVal === '') {
      eMailVal = this.ccEmailList[i].value;
    }
    else {
      eMailVal += ',' + this.ccEmailList[i].value;
    }
  }

  this.closeJobForm.patchValue({
    'EmailCC': eMailVal
  });

  if (IsValid === false) {
    this.closeJobForm.get("EmailCC").clearValidators();
    this.closeJobForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
  }
}


removeBccEmail(data: any): void {
  if (this.bccEmailList.indexOf(data) >= 0) {
    this.bccEmailList.splice(this.bccEmailList.indexOf(data), 1);
  }

  let eMailVal = '';
  let invalidEmail = false;

  for (let i = 0; i < this.bccEmailList?.length; i++) {
    if (this.bccEmailList[i].invalid === true) {
      invalidEmail = true;
    }

    if (eMailVal?.length === 0 || eMailVal === '') {
      eMailVal = this.bccEmailList[i].value;
    }
    else {
      eMailVal += ',' + this.bccEmailList[i].value;
    }
  }

  this.closeJobForm.patchValue({
    'EmailBCC': eMailVal
  });

  if (eMailVal?.length === 0 || eMailVal === '') {
    /* this.newEmailTemplateForm.get("bccMails").clearValidators();
    this.newEmailTemplateForm.get("bccMails").setErrors({ required: true });
    this.newEmailTemplateForm.get("bccMails").markAsDirty(); */
  }
  else {
    if (invalidEmail) {
      this.closeJobForm.get("EmailBCC").clearValidators();
      this.closeJobForm.controls["EmailBCC"].setErrors({ 'incorrectEmail': true });
    }
  }
}


public clickForMoreRecord(emailArr) {
  this.emailListLengthMore = emailArr?.length;
}

addBcc(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value.trim();
  var IsDuplicate = false;

  if (event.value.trim()) {
    for (let i = 0; i < this.bccEmailList?.length; i++) {
      if (this.bccEmailList[i].value === value) {
        IsDuplicate = true;
      }
    }
    if (IsDuplicate === false) {
      if (this.validateEmail(event.value.trim())) {
        this.bccEmailList.push({ value: event.value.trim(), invalid: false });
        this.setBccEmailsValues();
      } else {
        this.bccEmailList.push({ value: event.value.trim(), invalid: true });
        this.setBccEmailsValues();
        this.closeJobForm.get("EmailBCC").clearValidators();
        this.closeJobForm.controls["EmailBCC"].setErrors({ 'incorrectEmail': true });
      }
    }
  }
  else if (this.closeJobForm.get("EmailBCC").value === null || this.closeJobForm.get("EmailBCC").value === '') {
    /* this.newEmailTemplateForm.get("bccMails").clearValidators();
    this.newEmailTemplateForm.get("bccMails").setErrors({ required: true });
    this.newEmailTemplateForm.get("bccMails").markAsDirty(); */
  }
  if (event.input) {
    event.input.value = '';
  }
}


addCC(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value.trim();
  var IsDuplicate = false;

  if (event.value.trim()) {
    for (let i = 0; i < this.ccEmailList?.length; i++) {
      if (this.ccEmailList[i].value === value) {
        IsDuplicate = true;
      }
    }
    if (IsDuplicate === false) {
      if (this.validateEmail(event.value.trim())) {
        this.ccEmailList.push({ value: event.value.trim(), invalid: false });
        this.setCCEmailsValues();
      } else {
        this.ccEmailList.push({ value: event.value.trim(), invalid: true });
        this.setCCEmailsValues();
        this.closeJobForm.get("EmailCC").clearValidators();
        this.closeJobForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
      }
    }
  }
  else if (this.closeJobForm.get("EmailCC").value === null || this.closeJobForm.get("EmailCC").value === '') {
    /* this.newEmailTemplateForm.get("ccMails").clearValidators();
    this.newEmailTemplateForm.get("ccMails").setErrors({ required: true });
    this.newEmailTemplateForm.get("ccMails").markAsDirty(); */
  }
  if (event.input) {
    event.input.value = '';
  }
}



Uploadfile(file) {
  //this.filestatus=true;
  const list = file.target.files[0].name?.split('.');
  const fileType = list[list?.length - 1];
  if (!this.fileType.includes(fileType.toLowerCase())) {
    this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidDocumentType'), '');
    //file = null;
    return;
  }
  let totalfileSize:any=0;
  if (file.target.files[0].size > this.fileSize) {
    this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidDocumentSize') + ' ' + this.fileSizetoShow, '');
   // file = null;
   this.filestatus=false;
    return;
  }else{
    this.arr.push({
      fileName:file.target.files[0].name,
      size:file.target.files[0].size
    })
    this.arr.forEach(x=>{
          totalfileSize += x.size;
    })
  }
  
    if(totalfileSize>this.fileSize){
        const index = this.arr.findIndex(x => x.size === file.target.files[0].size);
        if (index !== -1) {
        this.arr.splice(index, 1);
        }
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentSize') + ' ' + this.fileSizetoShow, '');
      //file = null;
      this.filestatus=false;
      return;
    }
  
  this.fileInfo = {'name':file.target.files[0].name ,'size':this.formatBytes(file.target.files[0].size)};
  localStorage.setItem('Image', '1');
  this.uploadFiles = file.target.files[0];
  const formData = new FormData();
  formData.append('file', file.target.files[0]);
  this.mailService.uploadDocument(formData)
    .subscribe((data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
        let fileArray = {};
        fileArray['Name'] = data.Data[0].UploadFileName;
        fileArray['Path'] = data.Data[0].FilePathOnServer;
        fileArray['Size'] = data.Data[0].SizeOfFile;
        this.fileAttachments.push(fileArray);
        localStorage.setItem('Image', '2');
        this.filestatus = false;
        this.showPrgrsScrolldwn();
      }
    }, err => {
      this.filestatus = false;
      this.loading = false;
    });
}


    /**
    * Format the size to a human readable string
    *
    * @param bytes
    * @returns the formatted string e.g. `105 kB` or 25.6 MB
    */
   formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;
    let index = 0;

    while (bytes >= factor) {
      bytes /= factor;
      index++;
    }
    return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  }


  
  showPrgrsScrolldwn(){
    setTimeout(() => {
       this.myScrollContainer?.nativeElement.scroll({
      top: this.myScrollContainer?.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
    }, 0);
   }


   removeAttachment(fileInfo:any){
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
        this.fileAttachments.splice(index, 1);
    }   
    const indexfile: number = this.arr.findIndex(x => x.size === fileInfo.Size);
    if (indexfile !== -1) {
        this.arr.splice(index, 1);
    }     
    this.attachmentName = null;
  }

  selectCandidates(data, selectedCandidatesObj) {
    this.selectedCandidatesObj = selectedCandidatesObj;
    this.selectedToCandidates = selectedCandidatesObj;
    this.closeJobForm.get('To').reset();
    this.closeJobForm.get('To').setValue(this.selectedToCandidates);
    if (data?.length > 0) {
      this.isSelectedCandidates = true;
    } else {
      this.isSelectedCandidates = false;
      this.closeJobForm.get('WorkflowStageObj').disable();
      this.closeJobForm.get('WorkflowStageObj').reset();
      this.dropDownCanStatusConfig['IsDisabled'] = true;
      this.dropDownCanReasonConfig['IsDisabled'] = true;
      this.closeJobForm.get("MoveCandidate").patchValue(0);
      this.closeJobForm.get("DelinkCandidate").patchValue(0);
      this.closeJobForm.get('SendEmail').patchValue(0)
      this.closeJobForm.get("CanStatusId").reset();
      this.closeJobForm.get("CanReasonId").reset();
      this.selectedCanJobStatus = null;
      this.selectedCanReason = null;
      this.isSendEmailSelected = false;
      this.closeJobForm.get("To").setErrors(null);
      this.closeJobForm.get("Subject").setErrors(null);
      this.closeJobForm.get("Description").setErrors(null);
      this.resetFormCanselectedStatus.next(this.dropDownCanStatusConfig);
      this.resetFormCanselectedReason.next(this.dropDownCanReasonConfig);
      this.closeJobForm.get('Comment').disable();
      this.closeJobForm.get("Comment").patchValue('');


    }
  }


onMoveSelectedCandidates(event){
if(event.checked==true){
  this.isMoveSelectedCandidates=true;
  this.DeLinkSelectedCandidatesNullValidator();
  this.closeJobForm.get("MoveCandidate").patchValue(1);
  this.closeJobForm.get("DelinkCandidate").patchValue(0);
  this.closeJobForm.get("CanStatusId").patchValue('');
  this.closeJobForm.get("CanStatusName").patchValue(0);
  this.closeJobForm.get("CanReasonId").patchValue(0);
  this.closeJobForm.get("CanReasonName").patchValue('');
  this.closeJobForm.get("Comment").patchValue('');
  this.closeJobForm.get('WorkflowStageObj').enable();
  this.closeJobForm.get("WorkflowStageObj").markAsUntouched();
  this.closeJobForm.get("WorkflowStageObj").setErrors({ required: true });
  this.closeJobForm.get('Comment').disable();
 }else{
  this.closeJobForm.get('WorkflowStageObj').disable();
  this.closeJobForm.get("WorkflowStageObj").setErrors(null); 
  this.closeJobForm.get('WorkflowStageObj').clearValidators();
  this.closeJobForm.get('WorkflowStageObj').markAsPristine();
  this.isMoveSelectedCandidates=false;
  this.closeJobForm.get("MoveCandidate").patchValue(0);
  this.closeJobForm.get("WorkflowStageObj").patchValue(null);
  this.closeJobForm.get("DelinkCandidate").patchValue(0);
  this.closeJobForm.get("CanStatusId").patchValue('');
  this.closeJobForm.get("CanStatusName").patchValue(0);
  this.closeJobForm.get("CanReasonId").patchValue(0);
  this.closeJobForm.get("CanReasonName").patchValue(0);
  this.closeJobForm.get("Comment").patchValue('');
  this.DeLinkSelectedCandidatesNullValidator();
  this.closeJobForm.get('Comment').disable();

 }
}

DeLinkSelectedCandidatesNullValidator(){
  this.selectedCanJobStatus = null;
  this.selectedCanReason = null;
  this.dropDownCanStatusConfig['IsDisabled'] = true;  
  // this.dropDownCanStatusConfig['IsRequired'] = false;
  this.dropDownCanReasonConfig['IsDisabled'] = true;  
  // this.dropDownCanReasonConfig['IsRequired'] = false;
  this.resetFormCanselectedStatus.next(this.dropDownCanStatusConfig);
  this.resetFormCanselectedReason.next(this.dropDownCanReasonConfig);
}

MoveSelectedCandidatesNullValidator(){
  this.closeJobForm.get('WorkflowStageObj').disable();
  this.closeJobForm.get('WorkflowStageObj').setErrors(null);
  this.closeJobForm.get('WorkflowStageObj').clearValidators();
  this.closeJobForm.get('WorkflowStageObj').markAsPristine();
}
onDeLinkSelectedCandidates(event){
  if(event.checked==true){
    this.selectedCanReason = null;
    this.isDeLinkSelectedCandidates=true
    this.MoveSelectedCandidatesNullValidator();
    this.dropDownCanStatusConfig['IsDisabled'] = false;
    // this.dropDownCanStatusConfig['IsRequired'] = true;
    this.dropDownCanReasonConfig['IsDisabled'] = false;
    // this.dropDownCanReasonConfig['IsRequired'] = true;
    // this.closeJobForm.get("CanStatusId").setErrors({ required: true });
    // this.closeJobForm.get("CanStatusId").markAsDirty();
    // this.closeJobForm.get("CanReasonId").setErrors({ required: true });
    // this.closeJobForm.get("CanReasonId").markAsDirty();
    this.closeJobForm.get("MoveCandidate").patchValue(0);
    this.closeJobForm.get("DelinkCandidate").patchValue(1);
    this.closeJobForm.get("WorkflowStageObj").patchValue(null);
    this.closeJobForm.get("CanStatusId").markAsUntouched();
    // this.closeJobForm.get("CanReasonId").markAsUntouched();

   }else{
    this.isDeLinkSelectedCandidates=false
    this.selectedCanReason = null;
    this.dropDownCanStatusConfig['IsDisabled'] = true;
    // this.dropDownCanStatusConfig['IsRequired'] = false;
    this.dropDownCanReasonConfig['IsDisabled'] = true; 
    // this.dropDownCanReasonConfig['IsRequired'] = false;
    // this.closeJobForm.get("CanStatusId").markAsUntouched();     
    // this.closeJobForm.get("CanStatusId").setErrors(null); 
    // this.closeJobForm.get('CanStatusId').clearValidators();
    // this.closeJobForm.get('CanStatusId').markAsPristine();
    // this.closeJobForm.get("CanReasonId").markAsUntouched();   
    // this.closeJobForm.get("CanReasonId").setErrors(null);
    // this.closeJobForm.get("CanReasonId").clearValidators();
    // this.closeJobForm.get("CanReasonId").markAsPristine();
    this.selectedCanJobStatus = null;
    this.MoveSelectedCandidatesNullValidator();
    this.closeJobForm.get("MoveCandidate").patchValue(0); 
    this.closeJobForm.get("WorkflowStageObj").patchValue(null);
    this.closeJobForm.get("DelinkCandidate").patchValue(0);
    this.closeJobForm.get("CanStatusId").patchValue('');
    this.closeJobForm.get("CanStatusName").patchValue('');
    this.closeJobForm.get("CanReasonId").patchValue(0);
    this.closeJobForm.get("CanReasonName").patchValue('');
    this.closeJobForm.get("Comment").patchValue('');
    this.closeJobForm.get('Comment').disable();
   }

   this.resetFormCanselectedStatus.next(this.dropDownCanStatusConfig);
   this.resetFormCanselectedReason.next(this.dropDownCanReasonConfig);
}


    /*
    @Type: File, <ts>
    @Name: compareFn
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: get data when activity chane
  */
 compareFn(c1: any, c2: any): boolean {
  return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
}





    /*
    @Type: File, <ts>
    @Name: onMessage
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: for close job message count for comment
  */
public onMessage(value: any) {
  if (value != undefined && value != null) {
    this.maxMessage = 300 - value.length;
  }
}



  /*
    @Type: File, <ts>
    @Name: confirmDialog function
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: FOR DIALOG BOX confirmation
  */
 confirmDialog(value): void {
  const message = 'label_titleDialogContent';
  const title = 'label_close_job_msg';
  const subTitle = 'label_close_job';
  const iscloseJob = true;
  const dialogData = new ConfirmDialogModel(title, subTitle, message,iscloseJob);
  const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult){
      this.closeJob(value);
     }   
    }
  );
}

    /*
    @Type: File, <ts>
    @Name: closeJob
    @Who: Suika
    @When: 17-09-2023
    @Why: EWM-13816 EWM-13898
    @What: for close job confirmpop up
  */

  closeJob(value) {
    this.isResponseGet = true;
    delete this.closeJobInfo.DelinkCandidate;
    this.closeJobInfo.JobId = this.jobId ? this.jobId : "";
    this.closeJobInfo.JobTitle = this.JobTitle ? this.JobTitle : "";
    this.closeJobInfo.WorkflowId = this.workflowId ? this.workflowId : "";
    this.closeJobInfo.WorkflowName = this.workflowName ? this.workflowName : "";
    this.closeJobInfo.StatusName = value.StatusName ? value.StatusName : "";
    this.closeJobInfo.StatusId = value.StatusId ? value.StatusId : "";
    if (value.MoveCandidate == 1) {
      let MoveCandidate: IMoveCandidate = {};
      MoveCandidate.NextStageId = value.WorkflowStageObj.InternalCode ? value.WorkflowStageObj.InternalCode : "";
      MoveCandidate.NextStageName = value.WorkflowStageObj.StageName ? value.WorkflowStageObj.StageName : "";
      MoveCandidate.NextStageDisplaySeq = value.WorkflowStageObj.DisplaySeq ? value.WorkflowStageObj.DisplaySeq : 0;
      this.closeJobInfo.MoveCandidate = MoveCandidate;
    }

    this.closeJobInfo.ReasonId = value.ReasonId ? value.ReasonId : 0;
    this.closeJobInfo.ReasonName = value.ReasonName ? value.ReasonName : "";
    if (value.DelinkCandidate == 1) {
      let DelinkCandidate: IDelinkCandidate = {};
      DelinkCandidate.ReasonId = value.CanReasonId ? value.CanReasonId : 0;
      DelinkCandidate.ReasonName = value.CanReasonName ? value.CanReasonName : "";
      DelinkCandidate.StatusId = value.CanStatusId == 0  || value.CanStatusId == null || value.CanStatusId == '' ? '00000000-0000-0000-0000-000000000000': value.CanStatusId;
      DelinkCandidate.StatusName = value.CanStatusName ? value.CanStatusName : "";
      DelinkCandidate.Comment = value.Comment ? value.Comment : "";
      this.closeJobInfo.DelinkCandidate = DelinkCandidate;
    }
    if (value.SendEmail == 1) {
      let CandidateMail: ICandidateMail = {};
      CandidateMail.To = value.To ? value.To : [];
      CandidateMail.Bcc = value.EmailBCC ? value.EmailBCC : "";
      CandidateMail.Cc = value.EmailCC ? value.EmailCC : "";
      CandidateMail.Subject = value.Subject ? value.Subject : "";
      CandidateMail.PageUrl = 'CloseJob';
      CandidateMail.JobId = value.JobId ? value.JobId : "";
      CandidateMail.MailProvider = this.emailProvider;
      CandidateMail.Body = value.Description ? value.Description : "";
      CandidateMail.BodyType = 'HTML';
      CandidateMail.DefaultSignature = this.DefaultSignature ? this.DefaultSignature : 0;
      CandidateMail.RelatedToInternalCode = this.ModuleName ? this.ModuleName : 'JOBS';
      CandidateMail.Attachment = this.fileAttachments?.length > 0 ? true : false;
      CandidateMail.Files = this.fileAttachments ? this.fileAttachments : [];
      this.closeJobInfo.CandidateMail = CandidateMail;
    }
    this.closeJobInfo.CandidateList = value.selectedCandidates ? value.selectedCandidates : "";
    
    this.systemSettingService.closeJob(this.closeJobInfo).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.onDismissphone(true);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.isResponseGet = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.isResponseGet = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.isResponseGet = false;
        }
      }, err => {
        this.isResponseGet = false;
      })

  }
}
