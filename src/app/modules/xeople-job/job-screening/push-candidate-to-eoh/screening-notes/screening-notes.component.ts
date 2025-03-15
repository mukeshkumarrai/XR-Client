import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { ResponceData, Userpreferences } from '@app/shared/models';
import { ActionsTab, JobScreening, candidateEntity } from '@app/shared/models/job-screening';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { JobActionTabService } from '@app/shared/services/commonservice/job-action-tab.service';
import { JobActionsStoreService } from '@app/shared/services/commonservice/job-actions-store.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { Subject, Subscription } from 'rxjs';
import { PushCandidatePageType } from '../pushCandidate-model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-screening-notes',
  templateUrl: './screening-notes.component.html',
  styleUrls: ['./screening-notes.component.scss']
})
export class ScreeningNotesComponent implements OnInit,AfterViewInit {
  public loadingSearch: boolean;
  public getNotesList: Subscription;
  public loading: boolean;
  public gridList: any = [];
  public gridListData: any = [];
  public candidateList: candidateEntity[] = [];
  subscriptions: Subscription;
  NotesCreated:string;
  public userpreferences: Userpreferences;
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string='';
  ownerList: string[]=[];
  public showErrorDesc: boolean = false;
  public tagList:any=[];
  public basic:any=[];
  getEmailEditorVal:string=''
  resetEditorValue: Subject<any> = new Subject<any>();
  getEditorValFromEmployee:string='';
  @Output() NextEmitOut: EventEmitter<any> = new EventEmitter<any>();
  private actions: ActionsTab;
  public jobInfo: JobScreening;
  candPageTypeSubs: Subscription;
  IsOpenFor: number = PushCandidatePageType.Modal;
  candidateId: string;
  screeningMaster: any;
  CanAlreadyPushedSubs: Subscription;
  candidateInformation: any;
  public  showWarningAlert: boolean = false;
  private destroy$:Subject<any> = new Subject();
  private destroySub$:Subject<any> = new Subject();
  private destroySubPush$:Subject<any> = new Subject();
  public getEditorValTimeStamp: string;
  nowDate = new Date();
  utcstring = this.nowDate;
  @Input() memberStatus;
  public getEditorValEmp: string='';
  resetEditorValueEmp: Subject<any> = new Subject<any>();
  @Input() publishedStatus;
  constructor( public candidateService: CandidateService,private commonserviceService: CommonserviceService,private jobActionTabService: JobActionTabService,
    public _userpreferencesService: UserpreferencesService,private jobActionsStoreService: JobActionsStoreService,
    private pushCandidateEOHService: PushCandidateEOHService) {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
   }

  ngOnInit(): void {
    this.actions = this.jobActionTabService.constants;
  
    this.subscriptions = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.candidateList = res?.CandidateList;
      this.jobInfo=res;
    })
    this.candPageTypeSubs = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
      if (details) {
        this.IsOpenFor=details.pageType;
        this.candidateId = details.candidateID;
        this.showWarningAlert = details.showWarningAlert;
        this.NotesList()
        this.config();
      }
    });
    this.jobActionsStoreService.isScreeningActionTabUpdate.subscribe((e:boolean)=>{
      if (e) {
        let ScreeningMasterArr = this.jobActionsStoreService.getterEOHScreeningTab();
        ScreeningMasterArr.filter(e => {
          return e !== null
        });
        this.screeningMaster=ScreeningMasterArr[1];
      }else{
        this.screeningMaster=null;
      }
    });  
}



  config(){  
    this.editorConfig={
     REQUIRED:false,
     DESC_VALUE:null,
     PLACEHOLDER:'',
     Tag:this.tagList,
     EditorTools:this.basic,
     MentionStatus:false,
     maxLength:0,
     MaxlengthErrormessage:false,
     JobActionComment:false
   };
   
  }

  ngAfterViewInit(){
    this.CanAlreadyPushedSubs = this.pushCandidateEOHService.SetAlreadyPushCandInfo.subscribe((cand: any)=>{
      if(cand?.IsXRCandidatePushedToEOH === 1 && cand?.MemberId?.substring(0, 3)?.toLowerCase()==='apl' && !this.memberStatus) {
        this.candidateInformation =cand;
        this.editorConfig.DISABLED=true;
        this.resetEditorValue.next(this.editorConfig);
      }
    });
  }
  // who:maneesh:what:ewm-17105 for NotesList ,function:NotesList,when:24/05/2023
  NotesList() {
    this.loading = true;
    this.getNotesList=this.candidateService?.fetchEohNotesAll('?CandidateId='+this.candidateId+'&JobId='+this.jobInfo?.JobId)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridList = data.Data;            
            this.gridListData = data.Data;
            this.NotesCreated = this.gridList[0]?.NotesCreated;
            this.getEditorVal=this.gridList[0]?.NotesDescription            
            // this.config();
            this.resetEditorValue.next(this.editorConfig);

            this.loading = false;
            this.loadingSearch = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loading = false;
            this.loadingSearch = false;
          }
          else {
            this.gridListData = data.Data;
            this.loading = false; 
            this.loadingSearch = false;
          }
        }, err => {
          this.loading = false;
          this.loadingSearch = false;
        });

  }
  // this is use for get employee editor Value,when:24/05/2024 plz use this function also in html
  getEditorFormInfoScreening(event) {
    if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
      this.getEditorVal= event?.val;
    }
    if(event?.val!=''){
       this.getEditorVal= event?.val;
    }
  }
// this is use for get employee editor Value,when:24/05/2024
  getEditorFormInfo(event) {
    this.getEditorValFromEmployee= event;
  }

  onNextClick(){
    let obj={};
    obj['NotesCreated']=this.NotesCreated;
    obj['getEditorVal']=this.getEditorVal;
    obj['getEditorValFromEmployee']=this.memberStatus?this.getEditorValEmp:this.getEditorValFromEmployee;
    this.jobActionsStoreService.setActionRunnerFn(this.actions.SCREENING_NOTES_INFO, obj);
    this.NextEmitOut.emit(true);
    this.jobActionsStoreService.isScreeningActionTabUpdate.next(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroySub$.next();
    this.destroySubPush$.next();
  }
  clickTimeStamp(){
    this.nowDate = new Date();
    this.utcstring = this.nowDate;
    let tenantData = JSON.parse(localStorage?.getItem('currentUser'));
    this.getEditorValTimeStamp='['+tenantData?.FirstName + ' ' + tenantData?.LastName+']'+' '+formatDate(this.utcstring, 'dd/MM/yyyy hh:mm:ss', 'en_US');
    this.commonserviceService?.notestimestampResponce?.next({userTimeStamp:this.getEditorValTimeStamp});
  } 

  getEditorFormInfoScreeningEmp(event) {
    if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
      this.getEditorValEmp= event?.val;
    }
    if(event?.val!=''){
       this.getEditorValEmp= event?.val;
    }
  }

}
