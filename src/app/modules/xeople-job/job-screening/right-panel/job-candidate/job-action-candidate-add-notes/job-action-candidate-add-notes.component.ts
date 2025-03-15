//  who:maneesh:what:ewm-13870 for create job action candidate add notes,when:24/08/2023
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddNotesModel, XRNotifications,NotifyUser } from 'src/app/shared/models/candidateaddnotes';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobScreening } from 'src/app/shared/models/job-screening';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

@Component({
  selector: 'app-job-action-candidate-add-notes',
  templateUrl: './job-action-candidate-add-notes.component.html',
  styleUrls: ['./job-action-candidate-add-notes.component.scss']
})
export class JobActionCandidateAddNotesComponent implements OnInit {
  public jobActionNotesForm: FormGroup;
  public fileType: string;
  public fileSizetoShow: string;
  public fileSize: number;
  public dateFill = new Date();
  public today = new Date();
  public todayOpenDate = new Date();
  public todayFillDate = new Date();
  public fileBinary: File;
  public filePath: string;
  public previewUrl: string;
  public maxMessage: number = 200;
  public loading: boolean;
  public AccessId: number;
  public AccessName: string;
  @ViewChild('editor') editor: EditorComponent;
  public accessEmailId: any = [];
  public candidatesid: string;
  public candidateName: string;
  public dirctionalLang:string;
  public dropDoneConfig: customDropdownConfig[] = [];
  public dateFormat: string;
  public getDateFormat: string;
  public PageName: string;
  public oldPatchValuesAccessMode: any = [];
  public showRelated: boolean = false;
  public showRelatedClient: boolean = false;
  public isCategory: boolean = true;
  public CategoryId: number;
  public categoryName: string;
  public selectedCategory: any = {};
  public isDropdownShow: boolean = true;
  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  public JobId: string;
  public NotesDates:string
  public RelatedTo:any=[]
  public Id:number=0
  public JobTitle:string;
  public ClientName:string;
  public isResponseGet: boolean = false;
  public addNotesList: Subscription;
  public userType:string='CAND';
  public clientCode:string='CLIE';
  public jobCode:string='JOBS';
  public clientId:string;
  public hiddenclientcheckbox:boolean=false;
  public selectedCandidate: Subscription;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  public logedInUserName:string;
  public Notes: string='Notes';
   //Who:Renu, What:EWM-15213 EWM-16320 @Why: for new editor with tagging, When:04-mar-2024
   mentionList: any[] = [];
   ShowEditor: boolean=true;
   public showErrorDesc: boolean = false;
   public editorConfig: EDITOR_CONFIG;
   public getEditorVal: string;
   ownerList: string[]=[];
  logedInUser: string;
  WorkflowId: String;
  public tagList:any=['Jobs'];
  getRequiredValidationMassage: Subject<any> = new Subject<any>();

  constructor(public dialogRef: MatDialogRef<JobActionCandidateAddNotesComponent>, private appSettingsService: AppSettingsService, private fb: FormBuilder, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private serviceListClass: ServiceListClass,private renderer: Renderer2,
    private snackBService: SnackBarService, public candidateService: CandidateService, private translateService: TranslateService,
    private _commonService: CommonserviceService,private jobService: JobService,   private systemSettingService: SystemSettingService,) {
    this.AccessId = this.appSettingsService?.getDefaultAccessId;
    this.AccessName = this.appSettingsService?.getDefaultaccessName;
    this.candidatesid = data?.Candidatesids;    
    this.candidateName = data?.candidateName;    
    this.JobId = data?.JobId;
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass?.notesCategoryList+'?UserType=' +'CAND' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo' ;
    this.dropDoneConfig['placeholder'] = 'label_notesCategory';//who:maneesh,what:ewm-15061 for change label,when:22/11/2023
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/notes-category';
    this.dropDoneConfig['bindLabel'] = 'CategoryName';
    this.dropDoneConfig['IsRequired'] = true;
    this.jobActionNotesForm = this.fb.group({
      NotesDate: ['', [Validators.required, CustomValidatorService.dateValidator]],
      CategoryId: [''],
      NoteTitle: ['', [Validators.maxLength(200)]],
      Description: ['',[Validators.required]],
      file: [''],
      AccessId: [''],
      AccessName: ['', [Validators.required]],
      ClientId: [],
      Id: [],
      AccessDescription: [''],
      JobCheckbox: [false],
      clientCheckbox: [false],
    });
    this.fileType = appSettingsService?.file_file_type_extralarge;
    this.fileSizetoShow = appSettingsService?.file_file_size_extraExtraLarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
    this._commonService.notesClientId.subscribe((res=>{
      this.clientId=res;       
      if (this.clientId=="00000000-0000-0000-0000-000000000000" || this.clientId==null || this.clientId=='') {
        this.hiddenclientcheckbox=true;
      } else{
        this.hiddenclientcheckbox=false;
      }    
    }))
  }
  ngOnInit(): void {
    this.oldPatchValuesAccessMode = { 'AccessId': 2, 'GrantAccesList': '' }
    this.getDateFormat = this.appSettingsService?.dateFormatPlaceholder;
    this.dateFormat = localStorage.getItem('DateFormat');
      //  who:maneesh:what:ewm-14535 for patch title,when:09/10/2023
      this.logedInUser= JSON.parse(localStorage.getItem('currentUser'));
      this.logedInUserName=this.logedInUser['FirstName']+' '+this.logedInUser['LastName'];
    this.selectedCandidate=this._commonService?.getJobScreeningInfo().subscribe((data: JobScreening) => {
      this.JobTitle=data?.JobTitle;
      this.ClientName=data?.ClientName;
      this.WorkflowId=data?.WorkflowId;
     })
    this.jobActionNotesForm.patchValue({
      'AccessName': this.AccessName,
      'AccessId': this.AccessId,
      'NoteTitle':this.JobTitle + '-' +this.logedInUserName +' '+this.Notes

    })
    this.maxMessage = 200 - this.jobActionNotesForm.get('NoteTitle')?.value?.length;//who:maneesh,what:ewm-15439 for charachter count show,when:14/12/2023 
    this.RelatedTo.push({
      Id:this.candidatesid,
      UserType:this.userType,
      Name:this.candidateName,
      CompleteNotificationRouterURL:window.location.origin+"/"+"client/cand/candidate/candidate?CandidateId="+this.candidatesid+'&Type=CAND&cantabIndex=6&uniqueId=',
      NotificationRouterURL:"client/cand/candidate/candidate?CandidateId="+this.candidatesid+'&Type=CAND&cantabIndex=6&uniqueId='   
    });
      this.getInsertPlaceholderByType('Jobs');
      this.editorConfig={
        REQUIRED:true,
        DESC_VALUE:null,
        PLACEHOLDER:'label_recentnotesdescription',
        Tag:this.tagList,
        EditorTools:[],
        MentionStatus:true,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false


      };
      this.renderer.listen('window', 'click', (e: Event) => {
        let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
        mentionDiv.forEach(node => {
          node.style.display = 'none';
        });
      });
  }
  //  who:maneesh:what:ewm-13870 for unsubscribe ,function:ngOnDestroy,when:28/08/2023
ngOnDestroy() {
  this.addNotesList?.unsubscribe();
  this.selectedCandidate?.unsubscribe();
  this.EditorEventCapture();
}
  // who:maneesh,what:ewm-13870 for open image upload Popup,when:24/05/2023
  openImageUpload(): void {
    const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
      data: new Object({ type: this.appSettingsService?.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService?.imageUploadConfigForKendoEditor['file_img_size_small'] }),
      panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.data != undefined && res?.data != '') {
        this.loading = true;
        if (res?.event === 1) {
          this._KendoEditorImageUploaderService?.uploadImageFileInBase64(res?.data).subscribe(res => {
            this.editor?.exec('insertImage', res);
             this.loading = false;
          })
        }
        else {
          this._KendoEditorImageUploaderService?.getImageInfoByURL(res?.uploadByUrl).subscribe(res => {
            this.editor?.exec('insertImage', res);
            this.loading = false;
          })
        }
      }
    })
  }
  // who:maneesh,what:ewm-13870 for open Manage Access Modal,when:24/05/2023
  openManageAccessModal(Id, Name, AccessModeId) {
    this.oldPatchValuesAccessMode = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      data: { candidateId: this.candidatesid, Id: Id, Name: Name, AccessModeId: this.oldPatchValuesAccessMode, ActivityType: 2 },
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isSubmit == true) {
        this.oldPatchValuesAccessMode = {};
        this.accessEmailId = [];
        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': 0
          });
        });
        this.jobActionNotesForm.patchValue({
          'AccessName': res.AccessId[0]?.AccessName,
          'AccessId': res.AccessId[0]?.Id,
          'AccessDescription': res.AccessId[0]?.Description,
        });
        this.oldPatchValuesAccessMode = { 'AccessId': res.AccessId[0]?.Id, 'GrantAccesList': this.accessEmailId }
      }
    })

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0]?.attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }
  // who:maneesh,what:ewm-13870 for  on validating file onMessage function,when:24/05/2023
  public onMessage(value: string) {
    if (value != undefined && value != null) {
      this.maxMessage = 200 - value?.length;
    }
  }
  // who:maneesh,what:ewm-13870 for  when category drop down changes  onCategorychange function,when:24/05/2023
  onCategorychange(data) {
    if (data == null || data == '') {
      this.isCategory = true;
    } else {
      this.isCategory = false;
      this.CategoryId = data?.Id;
      this.categoryName = data?.CategoryName;
    }
  }
  // who:maneesh,what:ewm-13870 for to close the pop up   onDismiss function,when:24/05/2023
  onDismiss() {
    this.EditorEventCapture();
    document.getElementsByClassName("quick-modal-drawer")[0].classList.remove("animate__slideInRight")
    document.getElementsByClassName("quick-modal-drawer")[0].classList.add("animate__slideOutRight");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  // who:maneesh,what:ewm-13870 for removeAttachment file   removeAttachment function,when:24/05/2023
  removeAttachment(fileInfo) {
    const index: number = this.fileAttachments?.indexOf(fileInfo);
    if (index !== -1) {
      this.fileAttachments?.splice(index, 1);
    }

    if (this.fileAttachments?.length > 2) {
      this.fileAttachmentsOnlyTow = this.fileAttachments?.slice(0, 2)
    } else {
      this.fileAttachmentsOnlyTow = this.fileAttachments
    }
  }
  // who:maneesh,what:ewm-13870 for openMultipleAttachmentModal,function:openMultipleAttachmentModal function,when:24/05/2023
  openMultipleAttachmentModal() { 
    let files = [];
    this.fileAttachments?.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
      maxWidth: "600px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: files
      }),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res?.fileAttachments;

        if (this.fileAttachments?.length > 2) {
          this.fileAttachmentsOnlyTow = this.fileAttachments?.slice(0, 2);
        } else {
          this.fileAttachmentsOnlyTow = this.fileAttachments;
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
  // who:maneesh,what:ewm-13870 for saving the data,function:onSave,when:24/05/2023
  onSave(value) {
    this.isResponseGet = true;
    this.createNotes(value);
  }
  // who:maneesh,what:ewm-13870 for saving the data, function:createNotes, when:24/05/2023
  createNotes(value) {
    this.getMentionInfo(value.Description?.trim());
    this.loading = true;
    let files = [];
    const d =new Date(value.NotesDate);
    this.NotesDates=new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
    this.fileAttachments?.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    }); 
    let NotifyUser:NotifyUser[]=[];
   this.mentionList?.filter(item=>{
    this.ownerList?.filter(element=> {
      if(element['name']==item)
      {
        NotifyUser.push({
          ID: element['id'],
          Name: element['name'],
          ProfilePath: element['ProfileImage'],
          UserType: element['UserType']
        });
      }
  });
});
    let XRNotificationsArr:XRNotifications={
      NotifyUser:NotifyUser,
      UserProfilePic:this.logedInUser['ProfileUrl'],
      NavigateUrl:"client/cand/candidate/candidate?CandidateId="+this.candidatesid+'&Type=CAND&cantabIndex=6&uniqueId=',
      CompletePath:window.location.origin+"/"+"client/cand/candidate/candidate?CandidateId="+this.candidatesid+'&Type=CAND&cantabIndex=6&uniqueId='
    };
    let AddNotesObj : AddNotesModel;
    AddNotesObj={
      NotesDate : this.NotesDates,
      CategoryName :this.categoryName,
      CategoryId :this.CategoryId,
      NoteTitle :value?.NoteTitle.trim(),
      Description :value?.Description === null ? '' : value?.Description.trim(),
      AccessId :value?.AccessId,
      AccessName :value?.AccessName,
      GrantAccesList : this.accessEmailId,
      Files :files,
      NotesURL: '',
      RelatedToIds:this.RelatedTo,
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null,
    }
    this.addNotesList= this.jobService.createJob_V2_Notes(AddNotesObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.isResponseGet = false;
            this.jobActionNotesForm.reset();
            this.selectedCategory = {};
            this.fileBinary = null;
            this.filePath = null;
            this.isDropdownShow = false;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            document.getElementsByClassName("quick-modal-drawer")[0].classList.remove("animate__slideInRight")
            document.getElementsByClassName("quick-modal-drawer")[0].classList.add("animate__slideOutRight");
            setTimeout(() => { this.dialogRef.close(true); }, 200);
            this.EditorEventCapture();
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
            this.isDropdownShow = false;
            this.isResponseGet = false; 
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService?.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.isResponseGet = false;
          }
        }, err => {
          this.loading = false;
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService?.instant(err.Message), err.StatusCode);

        });
  }
  // who:maneesh,what:ewm-13870 for job and client checkbox, function:checkbox, when:24/05/2023
  checkbox(data, type,Id) {
        if (data?.checked && type == 'job') {
      this.showRelated = true;
      this.RelatedTo?.push({
        Id:this.JobId,
        UserType:this.jobCode,
        Name:this.JobTitle,
        CompleteNotificationRouterURL:window.location.origin+'client/jobs/job/job-detail/detail?jobId='+this.JobId+'&workflowId='+this.WorkflowId+'&filter=All&selectjob=TotalJobs&tabIndex=3&uniqueId=',
        NotificationRouterURL:'client/jobs/job/job-detail/detail?jobId='+this.JobId+'&workflowId='+this.WorkflowId+'&filter=All&selectjob=TotalJobs&tabIndex=3&uniqueId='
      });      
    } else if (data?.checked && type == 'client') {
      this.showRelatedClient = true;
      this.RelatedTo?.push({ 
        Id:this.clientId,
        UserType:this.clientCode, 
        Name:this.ClientName,
        CompleteNotificationRouterURL:window.location.origin+'/client/core/clients/list/client-detail?clientId='+ this.clientId+'&cliTabIndex=6&uniqueId=',
        NotificationRouterURL:'client/core/clients/list/client-detail?clientId='+ this.clientId+'&cliTabIndex=6&uniqueId='
    });
    } else if (data?.checked == false && type == 'job' && this.JobId==Id) {
      this.showRelated = false;
      const index = this.RelatedTo?.findIndex(list => list?.Id == Id)
      this.RelatedTo?.splice(index,1);
    } else if (data?.checked == false && type == 'client' && this.clientId==Id) {
      this.showRelatedClient = false;
      const index = this.RelatedTo?.findIndex(list => list?.Id == Id)
      this.RelatedTo?.splice(index,1);
    }
  }
  //  who:maneesh:what:ewm-13870 for For Insert Job tag value ,function:getInsertPlaceholderByType,when:04/09/2023
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
          existing.push({ text: peopleButton, data: this.plcData });
          let jobData: any = existing.filter((item) => {
            return item.text === insertType
          });
          this._toolButtons$.next(jobData);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  // who:maneesh,what:handel whitespace validator,when:03/09/2023
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let cntrl=control?.value?.toString();
    const isWhitespace = cntrl?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
  // @When: 08-09-2023 @who:maneesh singh @why: EWM-13770 add NotesDate patch value null when clear date
clearEndDate(){
  this.jobActionNotesForm.patchValue({
    NotesDate:null
  });
}

    //  @Who: Renu, @When: 05-03-2024,@Why: EWM-15213 EWM-16320 @What: on changes on kendo editor catch the event here
    getEditorFormInfo(event) {
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      this.ownerList = event?.ownerList;
      if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
        this.showErrorDesc = false;
        this.jobActionNotesForm.get('Description').setValue(event?.val);
      } else if(sources == undefined && event?.val==null ){
        this.editConfig();
        this.showErrorDesc = true;
        this.jobActionNotesForm.get('Description').setValue('');
        this.jobActionNotesForm.get('Description').setValidators([Validators.required]);
        this.jobActionNotesForm.get('Description').updateValueAndValidity();
        this.jobActionNotesForm.get("Description").markAsTouched();    }
      else if(sources == undefined && event?.val==''){
        this.showErrorDesc = true;
        this.jobActionNotesForm.get('Description').setValue('');
        this.jobActionNotesForm.get('Description').setValidators([Validators.required]);
        this.jobActionNotesForm.get('Description').updateValueAndValidity();
        this.jobActionNotesForm.get("Description").markAsTouched();
      }
    }
  
    //  @Who: Renu, 05-03-2024,@Why: EWM-15213 EWM-16320 @What:get all mentions info from html tags on save/update
    getMentionInfo(value) {
      const tempContainer = this.renderer.createElement('div');
      this.renderer.setProperty(tempContainer, 'innerHTML', value);
      const mentionNodes = tempContainer.querySelectorAll('.prosemirror-mention-node');
      mentionNodes.forEach(node => {
        if (node.hasAttribute("data-mention-name")) {
          let mentionId = node.getAttribute('data-mention-name');
          this.mentionList.push(mentionId);
        }else{
          let mentionId =node.innerHTML.substring(1); 
          this.mentionList.push(mentionId);
        }
       
      });
      this.mentionList=  this.mentionList.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })
    }
  
    //  @Who: Renu, @When: 05-03-2024,@Why: EWM-15213 EWM-16320 @What: get all event for editor here
    EditorEventCapture() {
      this.ShowEditor = false;
      let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
      mentionDiv.forEach(node => {
        node.style.display = 'none';
      });
    }
                 // who:maneesh,what: this is use for patch first time image upload data,when:04/04/2024

  getEditorImageFormInfo(event){   
    let disValue=this.jobActionNotesForm.get('Description').value;
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
    ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
    if(event?.val!='' && sources!=undefined){
      this.showErrorDesc=false;
      this.jobActionNotesForm.get('Description').setValue(event?.val);
    }else if(disValue!='' && event?.val?.length!=0 ){          
      this.showErrorDesc = false;
      this.jobActionNotesForm.get('Description').updateValueAndValidity();
      this.jobActionNotesForm.get('Description').markAsTouched();
      // this.jobActionNotesForm.get('Description').setValue('')
    }
    else{
      this.showErrorDesc = true;
      this.jobActionNotesForm.get('Description').updateValueAndValidity();
      this.jobActionNotesForm.get('Description').markAsTouched();
      this.jobActionNotesForm.get('Description').setValue('');   
    }
  }
  editConfig(){
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_recentnotesdescription',
      Tag:this.tagList,
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    this.showErrorDesc=true;
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.jobActionNotesForm.get('Description').updateValueAndValidity();
    this.jobActionNotesForm.get('Description').markAsTouched();
  }
}
