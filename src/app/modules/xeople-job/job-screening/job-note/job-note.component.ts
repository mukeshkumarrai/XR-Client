import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, HostListener, Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ActionsTab, candidateEntity, jobActionsEntity, JobScreening } from 'src/app/shared/models/job-screening';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobActionsStoreService } from 'src/app/shared/services/commonservice/job-actions-store.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobNoteListComponent } from './job-note-list/job-note-list.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subject, Subscription } from 'rxjs';
import { JobActionTabService } from 'src/app/shared/services/commonservice/job-action-tab.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { XRNotifications, jobActionNotes,NotifyUser } from '@app/shared/models/notes';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { PushCandidatePageType } from '../push-candidate-to-eoh/pushCandidate-model';
@Component({
  selector: 'app-job-note',
  templateUrl: './job-note.component.html',
  styleUrls: ['./job-note.component.scss']
})
export class JobNoteComponent implements OnInit {
  public candidateListOfArray: candidateEntity[];
  public allDetailsData: JobScreening;
  public jobNotesForm: FormGroup;
  candidateList: candidateEntity[];
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedCategory: any = {};
  isCategory: boolean = true;
  public categorys: string = 'Jobs'
  CategoryId: any;
  AccessName: string;
  AccessId: string;
  oldPatchValuesAccessMode: {};
  clientId: any;
  accessEmailId: any[];
  formHeading: string;
  dirctionalLang: string;
  selectedFiles: any;
  public fileBinary: File;
  documentTypeOptions: any;
  fileType: any;
  fileSizetoShow: any;
  fileSize: number;
  myfilename: string;
  filePath: any;
  uploadedFileName: any;
  previewUrl: any;
  public activestatus: string = 'Add';
  jobId: string;
  CategoryName: any;
  LastUpdated: any;
  pagesize: number;
  public userpreferences: Userpreferences;
  gridList: any;
  hoverIndex: number;
  notesDate: string;
  isSingle: boolean;
  relatedTo: any;
  notesTitleId: any;
  candidateNoteCount: any;
  notesObj: {};
  savedFormStatus: boolean = true;
  private actions: ActionsTab;
  jobCategoryList: any;
  defaultCateogory: any;
  jobNotesEvent: any;
  public animationVar: any;
  public loader: boolean = false;
  maxMoreLength = 3;
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;
  private _mobileQueryListener: () => void;
  saveEnableDisable: boolean=false;
  logedInUser: string;
  candidateInfoId: string;
   subscription5: Subscription;
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.screenMediaQuiryForSkills();
  }

  subscription1:Subscription;
  subscription2:Subscription;
  subscription3:Subscription;
  subscription4:Subscription;
  defaultJobStatusFormData:any;
  
  @ViewChild('relatedToSelect') relatedToSelect: NgSelectComponent;
  @ViewChild('category') category: NgSelectComponent;
  onSuccessStatusPage:boolean = true;
  isDefault:boolean;
  loading:boolean = false;

    //  kendo image uploader Adarsh singh 11-Aug-2023
    @ViewChild('editor') editor: EditorComponent;
    subscription$: Subscription;
    // End 
    public fileAttachments: any[] = [];
    public fileAttachmentsOnlyTow: any[] = [];

    //Who:Renu, What:EWM-16207 EWM-16299 @Why: for new editor with tagging, When:04-mar-2024
   mentionList: any[] = [];
   public showErrorDesc: boolean = false;
   public editorConfig: EDITOR_CONFIG;
   public getEditorVal: string;
  ownerList: string[]=[];
  resetEditorValue: Subject<any> = new Subject<any>();
  getRequiredValidationMassage: Subject<any> = new Subject<any>();


  constructor(private _commonService: CommonserviceService, private appSettingsService: AppSettingsService,
    private fb: FormBuilder, private serviceListClass: ServiceListClass, public dialog: MatDialog,
    private http: HttpClient, private snackBService: SnackBarService, media: MediaMatcher,
    private translateService: TranslateService, private jobService: JobService, private renderer: Renderer2,
    public candidateService: CandidateService, private routes: ActivatedRoute, changeDetectorRef: ChangeDetectorRef,
    public _userpreferencesService: UserpreferencesService, public _dialog: MatDialog, private jobActionsStoreService: JobActionsStoreService,
    private jobActionTabService: JobActionTabService,private el:ElementRef,private pushCandidateEOHService: PushCandidateEOHService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
      this.logedInUser= JSON.parse(localStorage.getItem('currentUser'));
    this.AccessName = this.appSettingsService.getDefaultaccessName;
    this.AccessId = this.appSettingsService.getDefaultAccessId;
    //this.CategoryId = this.appSettingsService.getDefaultCategoryId;

    this.jobNotesEvent = this._commonService.getJobScreeningInfo().subscribe((data: JobScreening) => {
      this.allDetailsData = data;
      this.jobId = this.allDetailsData.JobId;
      this.candidateListOfArray = data?.CandidateList;
      this.pagesize = appSettingsService.pagesize;
      const d = new Date();
      this.notesDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
      
      this.jobNotesForm = this.fb.group({
        JobId: [this.jobId],
        RelatedTo: [this.candidateListOfArray, [Validators.required]],
        Category: [null, [Validators.required]],
        Subject: [this.allDetailsData?.WorkFlowStageName + ' Notes'],
        AccessName: ['', [Validators.required]],
        AccessId: ['', [Validators.required]],
        Description: ['', [Validators.required,Validators.maxLength(5000)]],
        file: [''],
        NotesDate: [this.notesDate, [Validators.required, CustomValidatorService.dateValidator]],
        WorkflowStageName: [this.allDetailsData?.WorkFlowStageName],
        WorkflowStageId: [this.allDetailsData?.WorkFlowStageId],
        // Attachment: [''],
        // AttachmentName: [''],
        fileAttachments:[[]],
        GrantAccesList: [],
        NotesURL: [window.location.href],
        RelatedToIds: ['']
      })

      // this.selectedCategory = {
      //   Id: this.appSettingsService.getDefaultCategoryId, CategoryName: this.appSettingsService.getDefaultcategoryName
      // }
      // this.onCategorychange(this.selectedCategory)
      this.jobNotesForm.patchValue({
        'AccessName': this.AccessName,
        'AccessId': this.AccessId

      });
     
      this.getJobActionNotesCount();
      this.animationVar = ButtonTypes;
      if (this.defaultCateogory && this.defaultCateogory?.length) {
        this.jobNotesForm.patchValue({
          'Category': this.defaultCateogory[0],

        });
      }

      let CandId = [];
      this.jobNotesForm.get('RelatedTo').value.forEach(e => {
        CandId.push(e.CandidateId);
      })
  
      this.jobNotesForm.patchValue({
        'RelatedToIds': CandId
      });

      this.defaultJobStatusFormData = this.jobNotesForm.value;
    })



    this.userpreferences = this._userpreferencesService.getuserpreferences();
        // who:bantee,what:ewm-13757 ,when:16/08/2023

    this.fileType = appSettingsService.file_file_type_extralarge;
    this.fileSizetoShow = appSettingsService.file_file_size_extraExtraLarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }

    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    })

    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiryForSkills();
    };
    this.actions = this.jobActionTabService.constants;
    
  }

  ngOnInit(): void {
    this.getEditorVal=null;
    this.screenMediaQuiryForSkills();
    //this.candidateListOfArray.forEach(element => { element['disabled'] = true });

    this.getJobNotesCategory();

    if (this.candidateListOfArray.length > 1) {
      this.isSingle = false;

    } else {
      this.isSingle = true;
      this.jobNotesForm.controls['RelatedTo'].disable();

    }
    
/* 
  @Name: Subscribe All Services for saving data while user closed the page
  @Who: Adarsh Singh
  @When: 18-06-2023
  @Why: EWM-11779 EWM-12547
*/
    // called when click on cross icon in Job Action Modal
    this.subscription1 = this.jobActionsStoreService.isJobActionWindowClose.subscribe((e: boolean) => {
      if (e) {
        let hasChnage = this.checkFormValueChaned();
        if (e && hasChnage && this.onSuccessStatusPage) {
          // console.log('Changed Notes', hasChnage);
          let obj: jobActionsEntity = {
            formGroupInfo: this.jobNotesForm,
            APIEndPoint: this.serviceListClass.createJobNotes,
            isChanged: hasChnage,
            tabName: 'NOTES_INFO'
          }
          this.jobActionsStoreService.setActionRunnerFn(this.actions.NOTES_INFO, obj);
          hasChnage = false;
        }
      }
    });
    // end 

    // called when user changed the tab inside Job Action Modal
    this.subscription2 = this.jobActionsStoreService.onJobNotesTabChange.subscribe((e: boolean) => {
      if (e) {
        let hasChnage = this.checkFormValueChaned();
        if (e && hasChnage) {
          let obj: jobActionsEntity = {
            formGroupInfo: this.jobNotesForm,
            APIEndPoint: this.serviceListClass.createJobNotes,
            isChanged: hasChnage,
            tabName: 'NOTES_INFO'
          }
          this.jobActionsStoreService.setActionRunnerFn(this.actions.NOTES_INFO, obj);
          hasChnage = false;
        }
      }
    })
    // end 

    // Called When save API called while click on Cross icon Then Check If Any Required Field or not
    this.subscription3 = this.jobActionsStoreService.hasRequiredFieldNotes.subscribe((e:boolean)=>{
      if (e) {
        setTimeout(() => {
          this.onCheckRequiredValidationField();
        }, 300);
      }
    });
    // End 

    // called when successfully data submit and reset the form 
    this.subscription4 =this.jobActionsStoreService.resetJobNotesFormOnSuccess.subscribe((e:boolean)=>{
        if (e) {
          this.getJobActionNotesCount();
          // this.onSuccessStatusPage = false;
          this.jobActionsStoreService.setActionRunnerFn(this.actions.NOTES_INFO, null);
          this.jobActionsStoreService.notes.next(null);
        }
    })
    // End 
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_recentnotesdescription',
      Tag:[],
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

    this.subscription5 = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
      if (details) {
        this.candidateInfoId = details.candidateID;
      }
      });
  }

  /*
   @Type: File, <ts>
   @Name: remove function
   @Who: Bantee
   @When: 5-June-2023
   @Why: EWM-11780 EWM-12635
   @What: to remove the candidate from related To field
 */

  remove(CandidateId: string) {
    const message = `label_titleDialogContentRemoveCandidate`;
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
        setTimeout(() => {
          let CandId = []
          this.candidateList = this.jobNotesForm.value.RelatedTo.filter(id =>
            id.CandidateId != CandidateId
          );

          this.candidateList.forEach((e: any) => {
            CandId.push(e.CandidateId);
          })
          this.jobNotesForm.patchValue({
            'RelatedTo': this.candidateList,
            'RelatedToIds': CandId
          });
        }, 300);
      }
    });

  }


  /*
  @Type: File, <ts>
  @Name: updateSelectedCandidate function
  @Who: Bantee
  @When: 5-June-2023
  @Why: EWM-11780 EWM-12635
  @What: opens popup when candidate selected for removal
*/
  updateSelectedCandidate(relatedToSelect, id: any) {
    let isCandidateExists = this.jobNotesForm.get('RelatedTo').value.findIndex(x => x.CandidateId == id);
    if (isCandidateExists != -1) {
      relatedToSelect.close();
      this.remove(id);
    }
  }

  getRelatedTo(){
    let CandId = []
    let candidateIdArray = this.jobNotesForm.get('RelatedTo').value.forEach(e => {
      CandId.push(e.CandidateId);
    })
    this.jobNotesForm.patchValue({
      RelatedToIds: CandId
    })
  }


  /*
     @Type: File, <ts>
     @Name: openManageAccessModal
     @Who: Bantee
     @When: 5-June-2023
     @Why: EWM-11780 EWM-12635
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
        this.jobNotesForm.patchValue({
          'AccessName': res.AccessName,
          'AccessId': res.AccessId[0].Id,
          'GrantAccesList': this.accessEmailId
        });
        // who:maneesh,what:ewm-13501 for after save notes again open popup then by default show public,when:07/08/2023
        this.oldPatchValuesAccessMode = { 'AccessId': this.AccessId, 'GrantAccesList': this.accessEmailId }

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
  @Name: onSave function
  @Who: Bantee
  @When: 5-June-2023
  @Why: EWM-11780 EWM-12635
  @What: on saving the data
*/
  onSubmitJobNotesForm(value) {

    if (this.activestatus == 'Add') {
      this.saveEnableDisable=true;

      this.createJobNotes(value);
    }
    this.saveEnableDisable=true;
  }

  /*
  @Type: File, <ts>
  @Name: createJobNotes function
  @Who: Bantee
  @When: 5-June-2023
  @Why: EWM-11780 EWM-12635
  @What: on creating the notes
*/
  createJobNotes(value) {
    this.getMentionInfo(value.Description?.trim());
    this.loading = true;
    let files = [];
	      this.fileAttachments.forEach(element => {
 	       if(element.hasOwnProperty('Path')){
          files.push(element);
        }
      });
    this.savedFormStatus = false;
    let desc = value.Description === null ? '' : value.Description;
    if(desc.indexOf('<img') == -1){
      // @When: 03-04-2024 @who:Amit @why: EWM-16545 @what: replace tag change
      //  desc.replace(/(<([^>]+)>)/ig, '');
      // desc.replace(/<(?!\/?(b|p|strong|u|i|ul|ol|li)\b)[^>]+>/g, '');
    }

    let NotifyUser:NotifyUser[]=[];
    this.mentionList?.filter(item=>{
     this.ownerList.filter(element=> {
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
       NavigateUrl:'client/cand/candidate/candidate?CandidateId=&Type=CAND&cantabIndex=6&uniqueId=',
       CompletePath:window.location.origin+'client/cand/candidate/candidate?CandidateId=&Type=CAND&cantabIndex=6&uniqueId='
       };
  
    let AddNotesObj:jobActionNotes = {
      JobId: this.jobId,
      NotesDate: this.notesDate,
      CategoryId: value.Category.Id,
      CategoryName: value.Category.CategoryName,
      WorkflowStageName: this.allDetailsData?.WorkFlowStageName,
      WorkflowStageId: this.allDetailsData?.WorkFlowStageId,
      Subject: value.Subject,
      Description: desc,
      Files: files,
      AccessId: value.AccessId,
      AccessName: value.AccessName,
      GrantAccesList: this.accessEmailId,
      NotesURL: window.location.href,
      RelatedToIds: this.jobNotesForm.controls['RelatedTo'].value.map(cand => cand.CandidateId),
      XRNotifications: this.mentionList.length>0?XRNotificationsArr:null
    };
    
    this.jobService.AddJobNotesAll(AddNotesObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.isDefault = true;
              /****@Who: renu @what:EWM-17289 EWM-17868 @WHEN: 12/08/2024 */
              let obj:any = {
                pageType: PushCandidatePageType.Normal,
                candidateID: this.candidateInfoId,
                showWarningAlert: true
              }
              this.pushCandidateEOHService.SetPushCandPageType.next(obj);
              //**end***** */
            this.getJobActionNotesCount();
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
            this.fileAttachments=[];
            this.jobActionsStoreService.setActionRunnerFn(this.actions.NOTES_INFO, null);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue

            this.fileAttachments=[];
            this.EditorEventCapture();
            this.getEditorVal='';
            this.editorConfig={
              REQUIRED:true,
              DESC_VALUE:null,
              PLACEHOLDER:'label_recentnotesdescription',
              Tag:[],
              EditorTools:[],
              MentionStatus:true,
              maxLength:0,
              MaxlengthErrormessage:false,
              JobActionComment:false

            }
            // this.resetEditorValue.next(this.editorConfig);
            this.editConfigRequired();

          }
          else if (data.HttpStatusCode === 204) {
             this.loading = false;
            //  this.isDropdownShow = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;

          }
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->

          this.saveEnableDisable=false;
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }


  resetForm() {
    this.selectedCategory = {};
    if (!this.defaultCateogory?.length) {
      this.jobNotesForm.get('Category').reset();
    } else {
      this.jobNotesForm.patchValue({
        'Category': this.defaultCateogory[0],
      });
    }
    this.jobNotesForm.patchValue({
      'Subject': this.allDetailsData?.WorkFlowStageName + ' Notes',
    });
    this.jobNotesForm.patchValue({
      'AccessName': this.AccessName,
      'AccessId': this.AccessId
    });
    this.jobNotesForm.get('Description').reset();
    this.accessEmailId = [];
    this.filePath = null;
    this.uploadedFileName = null;
    this.accessEmailId = [];
    this.filePath = null;
    this.uploadedFileName = null;
    this.jobNotesForm.patchValue({
      fileAttachments:[]
    });

  }


  /*
@Type: File, <ts>
@Name: getLastNotesDate function
@Who: Bantee
@When: 5-June-2023
@Why: EWM-11780 EWM-12635
@What: getting data for created notes
*/




  getJobActionNotesCount() {

    let satgeId = this.allDetailsData?.WorkFlowStageId;

    this.jobService.getJobActionNotesCount(this.jobId, satgeId)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            if (this.isDefault) {
              this.resetForm();
            }
            this.candidateNoteCount = data.Data.RelatedToCount;
            this.LastUpdated = data.Data.LastUpdated;

            this.notesObj = {};
            for (var i = 0; i < this.candidateNoteCount?.length; i++) {
              this.notesObj[this.candidateNoteCount[i].RelatedToId] = this.candidateNoteCount[i].Count;
              // console.log(this.notesObj[this.candidateNoteCount[i].RelatedToId] = this.candidateNoteCount[i].Count)

            }
          }
          else if (data.HttpStatusCode === 204) {
            // temproray added 
            this.resetForm();
            this.defaultJobStatusFormData = this.jobNotesForm.value;
            // End 
          }
        }, err => {

          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }


  /*
@Type: File, <ts>
@Name: openNoteListDataModel function
@Who: Bantee
@When: 5-June-2023
@Why: EWM-11780 EWM-12635
@What: to open the pop up for crated notes list
*/
  openNoteListDataModel() {
    let CandId = this.jobNotesForm.controls['RelatedTo'].value.map(cand => cand.CandidateId);

    let jsonObj = {};
    jsonObj['JobId'] = this.jobId;
    jsonObj['Candidates'] = CandId;
    jsonObj['StageId'] = this.allDetailsData?.WorkFlowStageId;
    jsonObj['PageNumber'] = 1;
    jsonObj['PageSize'] = this.pagesize;
    const dialogRef = this.dialog.open(JobNoteListComponent, {
      data: jsonObj,
      panelClass: ['xeople-drawer', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });

  }


  onHover(i: number) {
    this.hoverIndex = i;
    var element = document.getElementById("flex-box-hover");
    if (i != -1) {
      element.classList.add("test");
    } else {
      this.hoverIndex = i;

      element.classList.remove("test");
    }
  }




  /*
@Type: File, <ts>
@Name: getJobNotesCategory function
@Who: Bantee
@When: 5-June-2023
@Why: EWM-11780 EWM-12635
@What: to get the dropdown values for categorys
*/
  getJobNotesCategory() {
    this.loader = true;

    this.jobService.getNotesCategoryList(this.categorys)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.jobCategoryList = data.Data;
            // <!-- /*--@Who:Bantee,@When: 19-july-2023,@Why:EWM-13029,@What:When user adds new notes category via Manage icon, then added category is not displaying on category dropdown list-----*/ -->

            this.defaultCateogory = this.jobCategoryList.filter(s => s?.CategoryName.trim().toLowerCase() == 'screening notes');
            if (this.defaultCateogory && this.defaultCateogory?.length) {
              this.jobNotesForm.patchValue({
                'Category': this.defaultCateogory[0],

              });
            }
            this.defaultJobStatusFormData = this.jobNotesForm.value;

          }
          else if (data.HttpStatusCode === 204) {
            this.defaultJobStatusFormData = this.jobNotesForm.value;

          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          }
          this.loader = false;

        }, err => {

          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loader = false;

        });
  }

  ngOnDestroy(): void {
    this.jobNotesEvent.unsubscribe();
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5?.unsubscribe();
    this.subscription$?.unsubscribe();
    this.EditorEventCapture();
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
      this.maxMoreLength = 2;
    } else {
      this.maxMoreLength = 2;
    }
  }

  /*
  @Type: File, <ts>
  @Name: checkFormValueChaned function
  @Who: Adarsh singh
  @When: 14-June-2023
  @Why: EWM-11779.EWM-12547
  @What: check form data has been chnaged or not
*/
  checkFormValueChaned() {
    let initialValue:any = this.defaultJobStatusFormData;
    let val = this.jobNotesForm.value;
    let defaultObj = {
      RelatedTo: initialValue?.RelatedTo,
      Category: initialValue?.Category,
      AccessName: initialValue?.AccessName,
      AccessId: initialValue?.AccessId,
      Description: initialValue?.Description,
      //file: initialValue?.file,
      // NotesDate: initialValue?.NotesDate,
      fileAttachments:initialValue.fileAttachments,
      Subject: initialValue?.Subject,
      // Attachment: initialValue?.Attachment,
      // AttachmentName: initialValue?.AttachmentName,
      GrantAccesList: initialValue?.GrantAccesList,
      RelatedToIds: initialValue?.RelatedToIds,
    }

    let current = {
      RelatedTo: val?.RelatedTo,
      Category: val?.Category,
      AccessName: val?.AccessName,
      AccessId: val?.AccessId,
      Description: val?.Description,
      fileAttachments:val?.fileAttachments,

     // file: val?.file,
      // NotesDate: val?.NotesDate,
      Subject: val?.Subject,
      // Attachment: val?.Attachment,
      // AttachmentName: val?.AttachmentName,
      GrantAccesList: val?.GrantAccesList,
      RelatedToIds: val?.RelatedToIds,
    }
    let res = JSON.stringify(defaultObj) != JSON.stringify(current);
    //console.log(defaultObj, 'defaultObj');
    // console.log(current, 'current');
    // console.log(res, 'res');
    return res;
  }


  onCheckRequiredValidationField() {
    for (const key of Object.keys(this.jobNotesForm.controls)) {
      if (this.jobNotesForm.controls[key].invalid) {
        if (key === 'RelatedTo') {
          this.relatedToSelect?.focus();
        }
        if (key === 'Category') {
          this.category?.focus();
        }
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

    /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 11-Aug-2023
  @Why: EWM-13233
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
// <!--@Bantee Kumar,@EWM-13525,@when:14-08-2023, Common location changes-->

removeAttachment(fileInfo: any) {
  const index: number = this.fileAttachments.indexOf(fileInfo);
  if (index !== -1) {
    this.fileAttachments.splice(index, 1);
  }

  if (this.fileAttachments.length > 2) {
    this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
  } else {
    this.fileAttachmentsOnlyTow = this.fileAttachments
  }
  this.jobNotesForm.patchValue({
    fileAttachments:this.fileAttachments
  })
}
// <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13758 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->

openMultipleAttachmentModal() {
  let files = [];
     this.fileAttachments.forEach(element => {
       if(element.hasOwnProperty('Path')){
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
    if (res.isFile == true) {
      this.fileAttachments = [];
      this.fileAttachments = res.fileAttachments;
      this.jobNotesForm.patchValue({
      fileAttachments:this.fileAttachments
      })
      if (this.fileAttachments.length > 2) {
        this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2);
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

  //  @Who: Renu, ,@When: 05-Feb-2024,@Why: EWM-15213 EWM-16313 @What: on changes on kendo editor catch the event here
  geteditor:string
    getEditorFormInfo(event){
      this.ownerList=event?.ownerList;  
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      if (event?.val==' ' || event?.val==" " || event?.val=='' || event?.val=="" ||  event?.val==null) {
        this.jobNotesForm.get('Description').updateValueAndValidity();
        this.jobNotesForm.get("Description").markAsTouched();
        this.jobNotesForm.get("Description").setValidators([Validators.required]);
        this.editConfigRequired();
      } else if(event?.val!='' && event?.val!=null && sources!=undefined){
          this.jobNotesForm.get("Description").setValue(event?.val);
          this.jobNotesForm.get("Description").clearValidators();
          this.jobNotesForm.get('Description').updateValueAndValidity();
          this.jobNotesForm.get("Description").markAsTouched();
          this.showErrorDesc=false;
  
        }  else if(event?.val=='' && sources==undefined && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length==0){
          this.editConfigRequired();
          this.showErrorDesc=false;
      this.jobNotesForm.get("Description").setValue('');
      this.jobNotesForm.get('Description').updateValueAndValidity();
      this.jobNotesForm.get("Description").markAsTouched();
      this.jobNotesForm.get("Description").setValidators([Validators.required]);

  
        }
        else if(event?.val!='' && event?.val!=null && sources==undefined){
          this.jobNotesForm.get("Description").setValue(event?.val);
          this.jobNotesForm.get("Description").clearValidators();
          this.jobNotesForm.get('Description').updateValueAndValidity();
          this.jobNotesForm.get("Description").markAsTouched();
          this.showErrorDesc=false;
  
        } 
    }
    getEditorImageFormInfo(event){
      if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
        this.showErrorDesc=false;
        this.jobNotesForm.get('Description').setValue(event?.val);
      }
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      if (event?.val==' ' || event?.val==" " || event?.val=='' || event?.val=="" ||  event?.val==null) {
        this.jobNotesForm.get("Description").setValue('');
        this.jobNotesForm.get('Description').updateValueAndValidity();
        this.jobNotesForm.get("Description").markAsTouched();
        this.jobNotesForm.get("Description").setValidators([Validators.required]);
        this.editConfigRequired();
      } else if(event?.val!='' && event?.val!=null && sources!=undefined){
          this.jobNotesForm.get("Description").setValue(event?.val);
          this.jobNotesForm.get("Description").clearValidators();
          this.jobNotesForm.get('Description').updateValueAndValidity();
          this.jobNotesForm.get("Description").markAsTouched();
          this.showErrorDesc=false;
  
        }  else if(event?.val=='' && sources==undefined && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length==0){
          this.jobNotesForm.get("Description").setValue('');
          this.jobNotesForm.get('Description').updateValueAndValidity();
          this.jobNotesForm.get("Description").markAsTouched();
          this.jobNotesForm.get("Description").setValidators([Validators.required]);
          this.editConfigRequired();
  
        }
        else if(event?.val!='' && event?.val!=null && sources==undefined){
          this.jobNotesForm.get("Description").setValue(event?.val);
          this.jobNotesForm.get("Description").clearValidators();
          this.jobNotesForm.get('Description').updateValueAndValidity();
          this.jobNotesForm.get("Description").markAsTouched();
          this.showErrorDesc=false;
  
        }
    }

    editConfigRequired(){
      this.editorConfig={
        REQUIRED:true,
        DESC_VALUE:'JobActionNotes',
        PLACEHOLDER:'label_recentnotesdescription',
        Tag:[],
        EditorTools:[],
        MentionStatus:false,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false
      }
        this.getRequiredValidationMassage.next(this.editorConfig);
        this.jobNotesForm.get("Description").setValue('');
        this.jobNotesForm.get('Description').updateValueAndValidity();
        this.jobNotesForm.get("Description").markAsTouched();
        this.jobNotesForm.get("Description").setValidators([Validators.required]);

        // this.showErrorDesc=true
      }
    //  @Who: Renu,@When: 05-Feb-2024,@Why: EWM-15213 EWM-16313 @What:get all mentions info from html tags on save/update
    getMentionInfo(value){
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
  
    //  @Who: Renu, @When: 05-Feb-2024,@Why: EWM-15213 EWM-16313 @What: get all event for editor here
    EditorEventCapture(){
      let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
      mentionDiv.forEach(node => {
        node.style.display = 'none';
      });
    }
}
