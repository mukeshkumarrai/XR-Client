import { ChangeDetectorRef, HostListener, Component, ElementRef, OnInit, ViewChild, Renderer2, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogModel, DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ActionsTab, candidateEntity, jobActionsEntity, JobScreening } from 'src/app/shared/models/job-screening';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FilterJobCommentsComponent } from 'src/app/modules/xeople-job/job-screening/job-comments/filter-job-comments/filter-job-comments.component';
import { ConfirmDialogComponent } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { JobActionsStoreService } from 'src/app/shared/services/commonservice/job-actions-store.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { JobActionTabService } from 'src/app/shared/services/commonservice/job-action-tab.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MediaMatcher } from '@angular/cdk/layout';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import {  Schema ,schema,Plugin} from '@progress/kendo-angular-editor';
import {addMentionNodes, addTagNodes, getMentionsPlugin} from 'prosemirror-mentions';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { VoiceRecognitionService } from '@app/shared/services/speech-to-text/voice-recognition.service';
import { XRNotifications, jobActionComment,NotifyUser } from '@app/shared/models/notes';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

export enum Comment{
  ADD_COMMENT='Add',
  UPDATE_COMMENT='Update'
}

@Component({
  selector: 'app-job-comments',
  templateUrl: './job-comments.component.html',
  styleUrls: ['./job-comments.component.scss']
})
export class JobCommentsComponent implements OnInit {
  animationVar: any;
  allDetailsData: JobScreening;
  public candidateListOfArray: candidateEntity[];
  loading: boolean;
  commentsList: any;
  public AddObj:jobActionComment;
  public getObj = {};
  public stageId: String;
  public jobId: String;
  public onActiveCandidateList: candidateEntity[];
  onActiveCandidateId: any = [];
  pageNumber: number;
  pageSize: number;
  public userpreferences: Userpreferences;
  public jobCommentsForm: FormGroup;
  public oldPatchValues: any;
  editstatus: string = null;
  public selectedItem = [];
  public sortDirection = 'asc';
  searchSubject$ = new Subject<any>();
  loadingSearch: boolean;
  pageNo: number=1;
  searchVal: string = '';
  userId: string;
  activeCandidateList = [];
  activeRecuiterList = [];
  activeCandidateListClearFilter = [];
  dirctionalLang;
  filterCountRecuiter: number=0;
  filterCountCandidate: number=0;
  subscription1: Subscription;
  subscription2: Subscription;
  public isReadMore: any[] = [false];
  selectedItemListForActiveClass = null;
  empAllObs: Subscription;
  public descending:boolean=false;  
  public ascending:boolean=true;
  loadingscroll: boolean=false;
  totalDataCount: number;
  public showAllResults = 'min-data';
  readMore:boolean=false;
  candidateList: candidateEntity[];
  maxMoreLength = 3;
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;
  private _mobileQueryListener: () => void;
  filteredRecruiterId=[];
  currentUser: any;
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.screenMediaQuiryForSkills();
  }

  ownerList: string[]=[];
  onSuccessStatusPage:boolean = true;
  private actions: ActionsTab;
  subscription3:Subscription;
  subscription4:Subscription;
  subscription5:Subscription;
  subscription6:Subscription;
  defaultJobStatusFormData:any;
  @ViewChild('relatedToSelect') relatedToSelect: NgSelectComponent;
  @ViewChild('editor') editor: ElementRef;
  @ViewChild('scrollContainer') private scrollContainer: ElementRef;
  activeCandidateListData=[];
  oldCandidateId = [];
  pagesize:number;
  sortingValue: string = "";
  searchValue:string='';
  isStillRecoginze:boolean[]= [];
  mentionList: any[] = [];
  public getEditorValForEdit: string;
  public getEditorVal: string;
  ownerListData: string[]=[];
  public showErrorDesc: boolean = false;
  public tagList:any=['Employee'];
  public basic:any=[];
  public editorConfig: EDITOR_CONFIG;
  getRequiredValidationMassage: Subject<any> = new Subject<any>();
  public commentResult = {
    Action: 'OPEN',  //DISMISS
    Source:''
  }
  public IsShowComment: boolean=false;
  public isScrollDown: boolean=false;
  constructor(private fb: FormBuilder, private _commonService: CommonserviceService, private snackBService: SnackBarService, private jobService: JobService,
    private translateService: TranslateService, private _AppSettingsService: AppSettingsService, changeDetectorRef: ChangeDetectorRef, public _userpreferencesService: UserpreferencesService, public dialog: MatDialog,
    private jobActionsStoreService: JobActionsStoreService,  private serviceListClass: ServiceListClass,private quickJobService: QuickJobService,
    media: MediaMatcher,public voiceRecognitionService: VoiceRecognitionService,private renderer: Renderer2,
    private jobActionTabService: JobActionTabService, private el:ElementRef,public dialogRef: MatDialogRef<JobCommentsComponent>,@Inject(MAT_DIALOG_DATA) public commentData: any) {
      if(commentData && commentData!==undefined){
        this.commentResult=commentData.commentData;
      }
    this.pageNumber = this._AppSettingsService.pageOption;
    this.pageSize = this._AppSettingsService.pagesize;
    this.actions = this.jobActionTabService.constants;
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
    this.isScrollDown=true;
    this.initialize();
  }

  reloadComment():void{
    this.initialize();
  }

  initialize():void{
    this.getEmployeeList(this.pageNo,this.sortingValue,this.searchValue);
    this.screenMediaQuiryForSkills();
    this.animationVar = ButtonTypes;
    this.currentUser= JSON.parse(localStorage.getItem('currentUser'));
    this.userId = this.currentUser?.UserId;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.subscription1 = this._commonService.getJobScreeningInfo().subscribe((data: JobScreening) => {
      this.allDetailsData = data;
      this.candidateListOfArray = data?.CandidateList;
      this.initializedOnStarting();
    })

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.initializedOnStarting();
    });

/* 
  @Name: Subscribe All Services for saving data while user closed the page
  @Who: Adarsh Singh
  @When: 18-06-2023
  @Why: EWM-11779 EWM-12547
*/
    // called when click on cross icon in Job Action Modal
     this.subscription3 = this.jobActionsStoreService.isJobActionWindowClose.subscribe((e: boolean) => {
      if (e) {
        let hasChnage = this.checkFormValueChaned();
        if (e && hasChnage && this.onSuccessStatusPage) {
          // console.log('Changed Comments', hasChnage);
          let obj: jobActionsEntity = {
            formGroupInfo: this.jobCommentsForm,
            APIEndPoint: this.serviceListClass.addJobActionComments,
            isChanged: hasChnage,
            tabName: 'COMMENTS_INFO'
          }
          this.jobActionsStoreService.setActionRunnerFn(this.actions.COMMENTS_INFO, obj);
          hasChnage = false;
        }
      }
    });
    // end 
    
    // called when user changed the tab inside Job Action Modal
    this.subscription4 = this.jobActionsStoreService.onJobCommentsTabChange.subscribe((e: boolean) => {
      if (e) {
        let hasChnage = this.checkFormValueChaned();
        if (e && hasChnage) {
          let obj: jobActionsEntity = {
            formGroupInfo: this.jobCommentsForm,
            APIEndPoint: this.serviceListClass.addJobActionComments,
            isChanged: hasChnage,
            tabName: 'COMMENTS_INFO'
          }
          this.jobActionsStoreService.setActionRunnerFn(this.actions.COMMENTS_INFO, obj);
          hasChnage = false;
        }
      }
    })
    // end 

    // Called When save API called while click on Cross icon Then Check If Any Required Field or not
    this.subscription5 = this.jobActionsStoreService.hasRequiredFieldComments.subscribe((e:boolean)=>{
      if (e) {
        setTimeout(() => {
          this.onCheckRequiredValidationField();
        }, 300);
      }
    });
    // End 

    // called when successfully data submit and reset the form 
    this.subscription6 =this.jobActionsStoreService.resetJobCommentsFormOnSuccess.subscribe((e:boolean)=>{
        if (e) {
          this.resetForm();
          // this.onSuccessStatusPage = false;
          this.jobActionsStoreService.setActionRunnerFn(this.actions.COMMENTS_INFO, null);
          this.jobActionsStoreService.comments.next(null);
        }
    })
    // End 

    this.defaultJobStatusFormData = this.jobCommentsForm.value;
    this.renderer.listen('window', 'click', (e: Event) => {
      let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
      mentionDiv.forEach(node => {
        node.style.display = 'none';
      });
    });
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_comments',
      Tag:[],
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:true
    }
    this.jobCommentsForm.patchValue({
      JobCommentsEdit:this.getEditorValForEdit
    })
    // this.jobCommentsForm.get('JobCommentsEdit').setValue(this.commentsList[0]?.Comment);
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
      @Name: initializedOnStarting
      @Who: Nitin Bhati
      @When: 13-06-2023
      @Why: EWM-12640
      @What: geting record for initialized staring 
    */
  initializedOnStarting() {
    this.activeCandidateList = [];   //@why:EWM-14353,@who:Nitin Bhati,@when!26-09-2023
    this.activeCandidateListData=[];
    this.stageId = this.allDetailsData.WorkFlowStageId;
    this.jobId = this.allDetailsData.JobId;
    // this.jobName = this.allDetailsData.JobTitle;
    this.onActiveCandidateList = this.candidateListOfArray;
    //this.onActiveCandidateId = this.candidateListOfArray[0].CandidateId;
     this.candidateListOfArray?.forEach(element => {
      this.activeCandidateList?.push(element.CandidateId);
    });
    this.activeCandidateListClearFilter = this.activeCandidateList;
    this.activeCandidateListData = this.activeCandidateList;
    this.oldCandidateId = this.activeCandidateList;
    // this.animationVar = ButtonTypes;
    this.jobCommentsForm = this.fb.group({
      Id: [],
      JobId: [this.allDetailsData.JobId],
      JobName: [this.allDetailsData.JobTitle],
      Candidates: [this.activeCandidateList],
      RelatedTo: [this.candidateListOfArray, [Validators.required]],
      RelatedToIds: [this.activeCandidateList],
      ParentStageId: [this.allDetailsData.WorkFlowStageId],
      ParentStageName: [this.allDetailsData.WorkFlowStageName],
      ChildStageId: [this.candidateListOfArray[0].WorkFlowStageId],
      ChildStageName: [this.candidateListOfArray[0].WorkFlowStageName],
      SubChildStageId: [null],
      SubChildStageName: [null],
      JobCommentsEdit: [''],
      JobComments: ['', [Validators.required]],
    })
    
    this.getJobActionComments();
  }

  get relatedTos(){
    return this.jobCommentsForm.value.RelatedTo;
  }


  /* 
    @Name: getJobActionComments
    @Who: Nitin Bhati
    @When: 13-06-2023
    @Why: EWM-12640
    @What: get Job Action Comments
  */
  getJobActionComments(isScroll?) {
    if (isScroll==true) {
      this.loading = false;
    } else if(isScroll==false){
      this.loading = true;
    }
     else {
      this.loading = true;
    }
    this.loading = true;
    this.getObj['JobId'] = this.jobId;
    // this.getObj['Candidates'] = this.filterCountRecuiter!=0?this.activeCandidateListData:this.activeCandidateList;
    this.getObj['Candidates'] = this.filteredCandidateId?.length>0 ? this.filteredCandidateId: this.activeCandidateListData;
    this.getObj['StageId'] = this.stageId;
    this.getObj['PageNumber'] = this.pageNumber;
    this.getObj['PageSize'] = this.pageSize;
    this.getObj['Search'] = this.searchVal;
    this.getObj['OrderBy'] = this.sortDirection;
    this.getObj['Recuirters'] = this.activeRecuiterList;
    this.subscription2 = this.jobService.getJobActionComments(this.getObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.loadingscroll = false;
          if (isScroll) {
            let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          if(nextgridView!=undefined && nextgridView!=null && nextgridView?.length!=0){
            this.commentsList = this.commentsList.concat(nextgridView);
          }
           }else{
            this.loadingSearch = false;
            this.commentsList = repsonsedata.Data; 
          }
          this.totalDataCount= repsonsedata.TotalRecord    
          this.editConfigRequired();
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.commentsList = repsonsedata.Data;
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;

        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;

        }
        if(this.isScrollDown){
          setTimeout(() => this.scrollToBottom(), 0);
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;

          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
  /* 
      @Name: Sorting
      @Who: Nitin Bhati
      @When: 13-06-2023
      @Why: EWM-12640
      @What: get Job Action Comments for sorting
    */
  sorting(sortVal) {
    if (sortVal == 'desc') {
      this.pageNo = 1;
      this.sortDirection = 'asc';
      this.descending = false;
      this.ascending = true;
    } else {
      this.pageNo = 1;
      this.sortDirection = 'desc';
      this.ascending = false;
      this.descending = true;
    }
    //this.sortDirection = sort === 'asc' ? 'desc' : 'asc';
    this.getJobActionComments();
  }
  /* 
   @Name: updateJobActionComments
   @Who: Nitin Bhati
   @When: 14-06-2023
   @Why: EWM-12640
   @What: update Job Action Comments
 */
  editJobActionComments(id, i) {
    this.editstatus = i;
    this.oldPatchValues = this.commentsList.filter((dl: any) => dl.Id == id);
    this.jobCommentsForm.patchValue({
      'JobCommentsEdit': this.oldPatchValues[0].Comment,
      'Id': this.oldPatchValues[0].Id,
      'JobId': this.oldPatchValues[0].JobId,
      'JobName': this.oldPatchValues[0].JobName,
      'Candidates': this.oldPatchValues[0].Candidates,
      'ParentStageId': this.oldPatchValues[0].ParentStageId,
      'ParentStageName': this.oldPatchValues[0].ParentStageName,
      'ChildStageId': this.oldPatchValues[0].ChildStageId,
      'ChildStageName': this.oldPatchValues[0].ChildStageName,
      'SubChildStageId': this.oldPatchValues[0].SubChildStageId,
      'SubChildStageName': this.oldPatchValues[0].SubChildStageName
    });
    this.getEditorValForEdit=this.oldPatchValues[0]?.Comment; 
    this.selectedItem[i] = i;
  }
  /* 
 @Name: updateJobActionComments
 @Who: Nitin Bhati
 @When: 14-06-2023
 @Why: EWM-12640
 @What: update Job Action Comments
*/
  updateJobActionComments(value) { 
    this.getMentionInfo(value.JobCommentsEdit.trim());
    let updateObj = [];
    let fromObj = {};
    fromObj = this.oldPatchValues[0];
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
       UserProfilePic:this.currentUser['ProfileUrl'],
       NavigateUrl:"client/cand/candidate/candidate?CandidateId=&Type=CAND&cantabIndex=4&uniqueId=",
       CompletePath:window.location.origin+"/"+"client/cand/candidate/candidate?CandidateId=&Type=CAND&cantabIndex=4&uniqueId="
     };
    let toObj:jobActionComment = {
      Id:value.Id,
      JobId:value.JobId,
      JobName:value.JobName,
      Candidates:value.Candidates,
      ParentStageId:value.ParentStageId,
      ParentStageName:value.ParentStageName,
      ChildStageId:value.ChildStageId,
      ChildStageName:value.ChildStageName,
      SubChildStageId:value.SubChildStageId,
      SubChildStageName:value.SubChildStageName,
      Comment: value.JobCommentsEdit,
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null
    };
    // this.getEditorVal=value?.JobCommentsEdit;
    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this.jobService.updateJobActionComments(updateObj[0]).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.isScrollDown=true;
          this.loading = false;
          this.selectedItem = [];
          this.editstatus = null;
          this.activeCandidateList = [];
          this.initializedOnStarting();
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

  /* 
   @Name: addJobActionComments
   @Who: Nitin Bhati
   @When: 13-06-2023
   @Why: EWM-12640
   @What: Add Job Action Comments
 */
  addJobActionComments(value) {
    this.loading = true;
    // this.getEditorVal=value?.JobComments?.trim()//who:maneesh patch data for editor
    this.getMentionInfo(value.JobComments?.trim());
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
       UserProfilePic:this.currentUser['ProfileUrl'],
       NavigateUrl:"client/cand/candidate/candidate?CandidateId=&Type=CAND&cantabIndex=4&uniqueId=",
       CompletePath:window.location.origin+"/"+"client/cand/candidate/candidate?CandidateId=&Type=CAND&cantabIndex=4&uniqueId="
     };
   
    this.AddObj={
      JobId:value.JobId,
      JobName:value.JobName,
      Candidates:value.RelatedToIds,
      ParentStageId:value.ParentStageId,
      ParentStageName:value.ParentStageName,
      ChildStageId:value.ChildStageId,
      ChildStageName:value.ChildStageName,
      Comment: value.JobComments.replace(/<(?!\/?(b|p|strong|u|i|ul|ol|li)\b)[^>]+>/g, ''),
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null
    }

    this.jobService.addJobActionComments(this.AddObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;
         this.resetForm();
          this.defaultJobStatusFormData = this.jobCommentsForm.value;
          this.jobActionsStoreService.setActionRunnerFn(this.actions.COMMENTS_INFO, null);
          // this.getEditorVal=null;
          //this.editConfigRequired();
          this.IsShowComment=false;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

  resetForm(){
    this.selectedItem = [];
    this.activeCandidateList = [];
    //this.editstatus=false;
    this.initializedOnStarting();
  }
  /*
   @Type: File, <ts>
   @Name: deleteComments function
   @Who: Nitin Bhati
   @When: 14-06-2023
   @Why: EWM-12640
   @What: FOR delete confirmation comments
 */
  deleteComments(val): void {
    let deleteObj = [];
    deleteObj = [{
      "From": val,
      "To": val
    }];
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_comments';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.jobService.deleteJobActionComments(deleteObj[0]).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.selectedItem = [];
              //this.editstatus=false;
              this.initializedOnStarting();
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }
  /* 
      @Name: closeJobActionComments
      @Who: Nitin Bhati
      @When: 14-06-2023
      @Why: EWM-12640
      @What: For close Button
    */
  public closeJobActionComments() {
    this.editstatus = null;
    this.selectedItem = [];
  }
  /* 
    @Name: onSearch
    @Who: Nitin Bhati
    @When: 13-06-2023
    @Why: EWM-12640
    @What: For search record
  */
  onSearch(value) {
    if (value.length > 0 && value.length < 3) {
      return;
    }
    this.searchVal = value;
    this.loadingSearch = true;
    this.pageNo = 1;
    this.activeCandidateList = [];

    this.searchSubject$.next(value);
    
  }
  /*
  @Name: onSearchClear function
  @Who: Nitin Bhati
  @When: 15-06-2023
  @Why: EWM-12640
  @What: use Clear for Searching records
  */
  public onSearchClear() {
    this.searchVal = '';
    this.getJobActionComments();
  }

  /* 
  @Type: File, <ts>
  @Name: openDialogJobComments function 
  @Who: Nitin Bhati
  @When: 15-June-2023
  @Why: EWM-12640
  @What: job category dialog
  */
 filteredCandidateId = [];
  openDialogJobComments() {

       if(this.filteredCandidateId.length>0){
      this.candidateListOfArray.forEach(element => {
        
        let selectedCandidate=this.filteredCandidateId.findIndex((candId => candId == element.CandidateId));
        if (selectedCandidate != -1) {
          element['IsSelected'] = 1;
    
        }
      });
    }
    const dialogRef = this.dialog.open(FilterJobCommentsComponent, {
      data: new Object({ candidate: this.candidateListOfArray, filteredCandidateId :this.filteredCandidateId,filteredRecruiterId :this.filteredRecruiterId}),
      panelClass: ['xeople-modal-md', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res.result ==true){
      this.filterCountRecuiter=0;
      this.activeRecuiterList = [];
      this.activeRecuiterList = res?.recuiter;
      if(res?.cand?.length>0){
        this.activeCandidateList = [];

        this.activeCandidateList = res?.cand;
        this.activeCandidateListData = [...res?.cand];
        this.filteredCandidateId = [...res?.cand];
        this.filteredRecruiterId = [...res?.recuiter];


      }
      this.filterCountRecuiter = res?.cand?.length + res?.recuiter?.length;
      this.commentsList = [];
      this.getJobActionComments();
      //this.filterCountCandidate = this.activeCandidateList.length;
      // var element = document.getElementById("filter-category");
      // element.classList.add("active");
    }
    });
    if (this._AppSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
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
   @Name: onClearFilter function 
   @Who: Nitin Bhati
   @When: 15-June-2023
   @Why: EWM-12640
   @What: For clear Filter data
   */
  onClearFilter(): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_comment';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.filterCountRecuiter=0;
        this.commentsList = [];
        this.activeRecuiterList = [];
        this.activeCandidateList = [];
        this.activeCandidateListData = this.oldCandidateId;
        this.activeCandidateList = this.activeCandidateListClearFilter;
        this.filteredCandidateId = [];
        this.filteredRecruiterId = [];

        this.getJobActionComments();
      }
    });
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
   @Name: onScrollDown function 
   @Who: Nitin Bhati
   @When: 15-June-2023
   @Why: EWM-12640
   @What: For scolling data
   */
onScrollDown() {
  this.loadingscroll = true;
  if (this.totalDataCount > this.commentsList?.length) {
    this.pageNumber = this.pageNumber + 1;
   this.getJobActionComments(true);
  }
  else {
    this.loadingscroll = false;
  }
}

 /* 
  @Name: ngOnDestroy
  @Who: Nitin Bhati
  @When: 15-June-2023
  @Why: EWM-12266,EWM-12640
  @What: to store data in service 
*/
ngOnDestroy(): void {
  this.subscription1.unsubscribe();
  this.subscription2.unsubscribe();
  this.subscription3.unsubscribe();
  this.subscription4.unsubscribe();
  this.subscription5.unsubscribe();
  this.subscription6.unsubscribe();
  this.empAllObs?.unsubscribe();
  this.EditorEventCapture();
}

  /*
     @Type: File, <ts>
     @Name: remove function
     @Who: Nitin Bhati
     @When: 13-06-2023
     @Why: EWM-12640
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
     
          const selectedCandidates = this.jobCommentsForm.value.RelatedTo.filter(id =>
            id.CandidateId != CandidateId
          );
          this.jobCommentsForm.patchValue({
            'RelatedTo': selectedCandidates,
             'RelatedToIds': selectedCandidates.map(id=>id.CandidateId)

          });
          
       
      }
    });

  }


  updateSelectedCandidate(relatedToSelect, id: any) {
    let isCandidateExists = this.jobCommentsForm.get('RelatedTo').value.findIndex(x => x.CandidateId == id);
    if (isCandidateExists != -1) {
      relatedToSelect.close();
      this.remove(id);
    }
  }

  /*
   @Type: File, <ts>
   @Name: getRelatedTo function
   @Who: Nitin Bhati
   @When: 13-06-2023
   @Why: EWM-12640
   @What: for getting Related to user candidate
 */
  getRelatedTo() {
    let CandId = []
    let candidateIdArray = this.jobCommentsForm.get('RelatedTo').value.forEach(e => {
      CandId.push(e.CandidateId);
    })
    this.jobCommentsForm.patchValue({
      RelatedToIds: CandId
    })
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
  let val = this.jobCommentsForm.value;
  let defaultObj = {
    RelatedToIds: initialValue?.RelatedToIds,
    JobComments: initialValue?.JobComments,
  }

  let current = {
    RelatedToIds: val?.RelatedToIds,
    JobComments: val?.JobComments,
  }
  
  let res = JSON.stringify(defaultObj) != JSON.stringify(current);
  return res;
}


onCheckRequiredValidationField() {
  for (const key of Object.keys(this.jobCommentsForm.controls)) {
    if (this.jobCommentsForm.controls[key].invalid) {
      if (key === 'RelatedTo') {
        this.relatedToSelect?.focus();
      }
      if (key === 'JobComments') {
        this.editor?.nativeElement?.focus();
      }
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
      invalidControl.focus();
      break;
    }
  }
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
    this.maxMoreLength = 1;
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
  @Name: getBackgroundColor function
  @Who: Bantee Kumar
  @When: 23-06-2023
  @Why: EWM-7926
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }

}
 //  @Who: Renu, @When: 05-Mar-2024,@Why: EWM-15213-EWM-16323 @What: default schema

 mySchema = new Schema({
  nodes: addTagNodes(addMentionNodes(schema.spec.nodes)),
  marks: schema.spec.marks,
});

  //  @Who: Renu, @When: 05-Mar-2024,@Why: EWM-15213-EWM-16323 @What: define your in build plugin

public plugin = new getMentionsPlugin({
  getSuggestions: (type, text, done) => {
    if (type === "mention") {
      let res= this.ownerList.filter(val => val['name'].toLowerCase().startsWith(text.toLowerCase()));
      if(res?.length!==0){
        done(res);   
      }
    } 
  },
  getSuggestionsHTML: (items, type) => {
    if (type === "mention") {
      if(items?.length!==0)
      return this.getMentionSuggestionsHTML(items);
    } 
  },
});
  //  @Who: Renu, @When: 05-Mar-2024,@Why: EWM-15213-EWM-16323 @What: reintialise the plugin for kendo editor

public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
  this.plugin,
  ...defaultPlugins,
];
  //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16323 @What:create html dropdown 

 getMentionSuggestionsHTML = (items) => {
  return (
    '<div class="suggestion-item-list">' +items?.map((i) => 
    '<div class="suggestion-item" >'+
    ((i.ProfilePath && i.ProfilePath!='')? '<img src="'+i.ProfilePath+'">': '<span style="background-color:'+this.getBackgroundColor(i?.ShortName)+'">'+i.ShortName+'</span>')
    +'<div><div>'+ i.name+'</div><small>'+i.email+'</small></div>' + '</div>') ?.join("") +
      '</div>'
  );
};

/*@Name: getEmployeeList @Who:Renu @When: 20-Feb-2024  @Why: EWM-16108 @What: user list of employee*/
getEmployeeList(pagneNo?: number, orderBy?: string, searchVal?: string) {
  if (this.empAllObs) {
    this.empAllObs.unsubscribe();
 }
 this.empAllObs=this.quickJobService.getEmployeeList(pagneNo, this.pageSize, orderBy, searchVal).subscribe(
    (Responce: ResponceData) => {
      if (Responce.HttpStatusCode === 200) {
        this.loading = false;
        this.ownerList = Responce.Data.map((x: { [x: string]: any; })=>{return {
          'id':x['UserId'],
          'name':x['UserName'],
          'email':x['Email'],
          'ProfilePath':x['ProfileImageUrl'],
          'UserType':x['UserTypeCode'],
          'ProfileImage':x['ProfileImage'],
          'ShortName':x['ShortName']
        }
        });
        this.EditorEventCapture()
      } else {
        this.loading = false;
        this.ownerList=[];
      }
    }, err => {       
      this.loading = false;
      this.ownerList=[];
    });
    return  this.ownerList;
  }

  startService(type: string | number,index: string | number) {
    this.voiceRecognitionService.init();
    if(this.isStillRecoginze[index]==index){
      this.isStillRecoginze[index]= this.voiceRecognitionService.start() === true ? true : false;
    }
    this.isStillRecoginze[index]= false;
  }

  stopService(type: string | number,index: string | number) {
    if(this.isStillRecoginze[index]==index){
    this.isStillRecoginze[index]= this.voiceRecognitionService.stop(this.jobCommentsForm.value.JobComments) === false ? false : true;
    }else{
      this.isStillRecoginze[index]= false;
    }
    if(Comment[type]=='Add'){
      this.jobCommentsForm.get('JobComments').setValue(this.voiceRecognitionService.text);
    }else{
      this.jobCommentsForm.get('JobCommentsEdit').setValue(this.voiceRecognitionService.text);
    }
    
  }

    //  @Who: Renu, @When:@When: 04-03-2024,@Why: EWM-15213-EWM-16313 @What:get all mentions info from html tags on save/update
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

      //  @Who: Renu, @When: 04-03-2024,@Why: EWM-15213 EWM-16313 @What: get all event for editor here
      EditorEventCapture() {
        let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
        mentionDiv.forEach(node => {
          node.style.display = 'none';
        });
      }

       //  @Who: maneesh, @When: 14-03-2024,@Why: EWM-16343-EWM-16207 @What: on changes on kendo editor catch the event here
     getEditorFormInfo(event) {
      this.ownerListData = event?.ownerList;        
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      if(event?.val!='' && sources!=undefined){
        this.jobCommentsForm.get('JobComments').setValue(event?.val);
        this.jobCommentsForm.get('JobComments').clearValidators();
        this.jobCommentsForm.get('JobComments').updateValueAndValidity();
        this.jobCommentsForm.get("JobComments").markAsTouched();

      }else if(event?.val!='' && sources==undefined){
        this.jobCommentsForm.get('JobComments').setValue(event?.val);
        this.jobCommentsForm.get('JobComments').updateValueAndValidity();
        this.jobCommentsForm.get("JobComments").markAsTouched();
      }
      else{
        this.jobCommentsForm.get('JobComments').setValue('');
       // this.jobCommentsForm.get('JobComments').setValidators([Validators.required]);
        this.jobCommentsForm.get('JobComments').updateValueAndValidity();
        this.jobCommentsForm.get("JobComments").markAsTouched();
      }
    }

    getEditorFormInfoJobCommentsEdit(event){
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);

      if(event?.val!='' && sources!=undefined){          
        this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);
        this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
        this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();

      }else  if(event?.val!='' && sources==undefined){          
        this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);
        this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
        this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();

      }
      else{
        console.log('event?.valsss',event?.val);
        this.jobCommentsForm.get('JobCommentsEdit').setValue('');
        this.jobCommentsForm.get('JobCommentsEdit').setValidators([Validators.required]);
        this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
        this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();
      }
    }
    editConfigRequired(){
      this.editorConfig={
        REQUIRED:true,
        DESC_VALUE:'JobComments',
        PLACEHOLDER:'label_comments',
        Tag:[],
        EditorTools:[],
        MentionStatus:false,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false
      }
        this.getEditorVal=''
        //this.getRequiredValidationMassage.next(this.editorConfig);
        this.jobCommentsForm.get('JobComments').setValue('');
        //this.jobCommentsForm.get('JobComments').setValidators([Validators.required]);
        //this.jobCommentsForm.get('JobComments').updateValueAndValidity();
        //this.jobCommentsForm.get("JobComments").markAsTouched();
        if (this.jobCommentsForm.controls['JobComments'].hasError('required')) {
          this.jobCommentsForm.controls['JobComments'].setErrors(null);
        }
      }
        
      getEditorImageFormInfo(event){
        const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
        if(event?.val!='' && sources!=undefined){
          this.jobCommentsForm.get('JobComments').setValue(event?.val);
          this.jobCommentsForm.get('JobComments').clearValidators();
          this.jobCommentsForm.get('JobComments').updateValueAndValidity();
          this.jobCommentsForm.get("JobComments").markAsTouched();

        }
        else  if(event?.val!='' && sources==undefined){          
          this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);
          this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
          this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();
  
        }else{
          this.jobCommentsForm.get('JobComments').setValue('');
          //this.jobCommentsForm.get('JobComments').setValidators([Validators.required]);
          //this.jobCommentsForm.get('JobComments').updateValueAndValidity();
          //this.jobCommentsForm.get("JobComments").markAsTouched();
        }
      
      }
      editImageFormInfo(event){
        const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
        this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);
        if(event?.val!='' && sources!=undefined){          
          this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);
          this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
          this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();

        }else if(event?.val!='' && sources==undefined){
          this.jobCommentsForm.get('JobCommentsEdit').setValue(event?.val);
          this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
          this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();
        }
        else{
          this.jobCommentsForm.get('JobCommentsEdit').setValue('');
          this.jobCommentsForm.get('JobCommentsEdit').setValidators([Validators.required]);
          this.jobCommentsForm.get('JobCommentsEdit').updateValueAndValidity();
          this.jobCommentsForm.get("JobCommentsEdit").markAsTouched();
        }
      
      }

      onDismiss(): void {
        this.commentResult.Action='DISMISS';
        this.dialogRef.close(this.commentResult);
      }

      private scrollToBottom(): void {
        try {
          this.isScrollDown=false;
          this.scrollContainer.nativeElement.scroll({
            top: this.scrollContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
          
        } catch (err) {
          console.error('Scroll to bottom failed: ', err);
        }
      }

      showEditor(){
        this.IsShowComment=true;
        setTimeout(() => this.scrollToBottom(), 0);
      }
}
