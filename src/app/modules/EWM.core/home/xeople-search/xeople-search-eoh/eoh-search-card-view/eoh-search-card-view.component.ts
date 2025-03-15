import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ListViewDataResult, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-listview';
import { BehaviorSubject, fromEvent, Observable, Subscription,of, Subject } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { XeopleSearchService } from '../../../../shared/services/xeople-search/xeople-search.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { ExtractMapBulkComponent } from '../extract-map-bulk/extract-map-bulk.component';
import { JobSMSComponent } from 'src/app/modules/EWM.core/job/job/job-sms/job-sms.component';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { filterBy, process, State } from '@progress/kendo-data-query';
import { DataBindingDirective, GridDataResult } from '@progress/kendo-angular-grid';
@Component({
  selector: 'app-eoh-search-card-view',
  templateUrl: './eoh-search-card-view.component.html',
  styleUrls: ['./eoh-search-card-view.component.scss']
})
export class EohSearchCardViewComponent implements OnInit,OnChanges  {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('search', { static: false }) searchElemRef: ElementRef| undefined;
  public viewMembers: any=[];
  public loading = false;
  public results: Observable<GridDataResult>;
  public skip = 0;
  public pageSize:number;
  SearchQuery: string;
  ShowTopMatchingRecordNumber: number=0;
  imgData: any;
  finalresult: any;
  public dirctionalLang: string;
  public ResumeName: any;
  public FileName: any;
  public ResumeId: any;
  isCopied: boolean;
  burstSMSRegistrationCode: string;
  public isSMSStatus: boolean = false;
  totalRecords: number;
  public sizes:number[] = [50, 100, 200];
  selectedCanForExtract:string[]=[];
  NoOfMembersEOHExtract: number;
  extractArr:boolean[]=[];
  extractMapArr={
    'a':false
  };
  burstSMSCheckStatus: boolean=false;
  zoomPhoneCallRegistrationCode: string;
  globalResult: GridDataResult;
  intervalTime: NodeJS.Timeout;
  value: any;
  filterData: string[];
  public get pagerSettings(): PagerSettings {
  return {
  pageSizeValues: this.sizes,
  info: true,
  previousNext: true,
  type: 'numeric',
  };
  }
  zoomCheckStatus: boolean = false;
CreateJobCallLogObs: Subscription;
cardInfoObs:Subscription;
@Output() xeopleSearchEOHdata = new EventEmitter();
@Output() membersEOHExtract = new EventEmitter<any>();
JobDetails: {Id:string,JobTitle:string};
@Input() ExtractedStatus:boolean;
  public get showPager(): boolean {
      return this.viewMembers && this.viewMembers.total > 0;
  }
  private productsSubscription = new Subscription();
  searchTerm="";
  public searchSubject$ = new Subject<any>();
  loadingSearch:boolean=false;

  constructor( private xeopleSearchService: XeopleSearchService,private commonserviceService: CommonserviceService,
    private translateService: TranslateService, private snackBService: SnackBarService, public candidateService: CandidateService,
    public dialog: MatDialog,private _appSetting: AppSettingsService,public systemSettingService: SystemSettingService) {
      this.burstSMSRegistrationCode = this._appSetting.burstSMSRegistrationCode;
      this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
      this.pageSize=this._appSetting.pagesize;
      this.NoOfMembersEOHExtract =  this._appSetting.NoOfMembersEOHExtract;
     }
     ngOnInit(): void {
      this.commonserviceService.getFilterInfoEOH.subscribe((data) => {
        this.SearchQuery = data?.SearchQuery;
        this.JobDetails = data?.JobDetails;
        this.ShowTopMatchingRecordNumber = (data?.ShowAllMatchingRecord!==1)? (data?.ShowTopMatchingRecordNumber):0;
      });
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    // Burst SMS
      let burstSMSRegistrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
      this.burstSMSCheckStatus =  burstSMSRegistrationObj[0]?.Connected;
    // Zoom
    let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
    this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
      this.getEohMembersList();
      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        this.loadingSearch = true;
        this.onFilter(val);
      });
    }
    public ngOnDestroy(): void {
      this.CreateJobCallLogObs?.unsubscribe();
      if (this.productsSubscription) {
          this.productsSubscription.unsubscribe();
      }
      if (this.cardInfoObs) {
      this.cardInfoObs.unsubscribe();
      }
      clearTimeout(this.intervalTime);
  }
    ngOnChanges(changes: SimpleChanges): void {
       if(this.ExtractedStatus){
       this.selectedCanForExtract=[];
       this.membersEOHExtract.emit({
        'selectedCanForExtractCount':this.selectedCanForExtract?.length,
        'selectedCanForExtractData':this.selectedCanForExtract
      });
      this.extractArr=[false];
      if(this.JobDetails && Object.keys(this.JobDetails)?.length!==0 && this.JobDetails?.Id!==''){
          this.extractMapArr['a']=false;
      }else{
          this.extractMapArr['a']=true;
      }
      }
    }
  public handlePageChange(event: PageChangeEvent): void {
      this.skip =  event.skip;
      this.pageSize = event.take;
      this.getEohMembersList();
     // this.ShowTopMatchingRecordNumber=0;
  }
  /* @Name: getEohMembersList @Who: renu @When: 05-Sept-2023 @Why:EWM-13708 EWM-13926 @What: get EOH members list */
  public getEohMembersList(): void {
      let memberObj={};
      memberObj['OrganizationId']=localStorage.getItem('OrganizationId')?localStorage.getItem('OrganizationId'):null;
      memberObj['PageNo']=(this.skip + this.pageSize) / this.pageSize;
      memberObj['OrderBy']='Country asc';
      memberObj['PageSize']=this.ShowTopMatchingRecordNumber!==0?Number(this.ShowTopMatchingRecordNumber):this.pageSize;
      memberObj['Filters']=this.SearchQuery;
      this.loading = true;
      if(this.cardInfoObs){
        this.cardInfoObs.unsubscribe();
      } 
     this.startTimer();
      this.cardInfoObs=this.xeopleSearchService.getXfactorCardList(memberObj,this.ShowTopMatchingRecordNumber).pipe(
        tap((res:any) => {
          if(res?.HttpStatusCode===200 || res?.HttpStatusCode===204){
            clearTimeout(this.intervalTime);
            this.loading = false;
            res.total=this.ShowTopMatchingRecordNumber!==0?Number(this.ShowTopMatchingRecordNumber):res?.total;
            this.viewMembers=res.data;
            this.totalRecords=res?.total;
            this.results=res;
            this.xeopleSearchEOHdata.emit({
              'totalDataCount': this.ShowTopMatchingRecordNumber!==0?Number(this.ShowTopMatchingRecordNumber):res?.total,
              'canidatedata': res?.data
            });
            if(this.JobDetails && Object.keys(this.JobDetails)?.length!==0  && this.JobDetails?.Id!==''){
              this.extractMapArr['a']=false;
            }else{
                this.extractMapArr['a']=true;
            
            }
          }else if(res?.HttpStatusCode===408){
            this.totalRecords=0;
            this.snackBService.showInfoMsgSnackBar(this.translateService.instant('label_EOH_408err'), undefined,'label_xeopleSearch_RequestTimeOut');
          }
        }),
        concatMap(() => this.xeopleSearchService.getProfilePicMembersList(memberObj)),
        tap((res) => {
          this.finalresult = this.viewMembers.map((v:any) => ({ ...v, ...res?.data.find(sp => sp.MemberId === v.CandidateId) }));
        })
      )
      .subscribe((response:ResponceData) => {
        if (response.HttpStatusCode === 200|| response.HttpStatusCode == 204) {
           this.loading = false;
           this.globalResult={
            data:this.finalresult,
            total: this.ShowTopMatchingRecordNumber!==0?Number(this.ShowTopMatchingRecordNumber):this.totalRecords
          };
          this.results=Object.assign(this.globalResult);
        }
      },err => {
        this.loading = false;
     });
  }
  startTimer() {
    this.intervalTime = setTimeout(() => {
      this.snackBService.showInfoMsgSnackBar(this.translateService.instant('label_EOHLoaderWaitMsg'), undefined,'label_xeopleSearch_Progressing');
    },20000)
  }
  viewResumeByCandidateId(Resume: string) {
    this.loading = true;
    this.xeopleSearchService.fetchCandidateEOHResume("?FileName=" + Resume).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
          let gridView = repsonsedata.Data;
          if (gridView?.length == 0) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_fileNotFound'), repsonsedata['HttpStatusCode']);
            this.loading = false;
          } else {
            if (gridView) {
              let ResumeUrl = gridView;
              this.showResume(ResumeUrl, Resume)
              this.loading = false;
            }
            this.loading = false;
          }
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  showResume(ResumeUrl: string, FileName: string) {
    var filename = ResumeUrl?.split('.').pop();
    let fname = 'resume.' + filename;
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: ResumeUrl, FileName: FileName ? FileName : fname }),
      panelClass: ['xeople-modal-full-screen', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      }
    });
  }
  /*
    @Type: File, <ts>
    @Name: copyCandidateEmailId function
    @Who: Adarsh singh
    @When: 18-Feb-2023
    @Why: EWM-9379 EWM-10612
    @What: for copy current data
  */
  copyCandidateEmailId(EmailId:any, i:any){
    // for display and auto hide after some time
    let el = document.getElementById('autoHide' + i);
    el.style.display = 'block';
    setTimeout(() => {
      let el = document.getElementById('autoHide' + i);
      el.style.display = 'none';
    }, 2000);
    // End
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = EmailId;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  /* @Name: openNewEmailModal @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: to open email popup */
  openNewEmailModal(responseData: any, mailRespondType: string, email: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, 'JobId': this.JobDetails?.Id  },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
  }
  openJobBulkSMSForCandidate(dataItem:{}) {
   const dialogRef = this.dialog.open(JobSMSComponent,{
     data: new Object({jobdetailsData: dataItem}),
     panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   // RTL Code
   let dir: string;
   dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
   let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
   for (let i = 0; i < classList.length; i++) {
     classList[i].setAttribute('dir', this.dirctionalLang);
   }
  }
  onMemeberCheck(isChecked: { checked: boolean; }, data: string,index: string){
    data['checked']=isChecked.checked;
  if (isChecked.checked == true) {
    this.extractArr[index]=true;
   // this.extractMapArr[index]=[true];
    this.selectedCanForExtract.push(data);
  }else{
    this.extractArr[index]=false;
    if(this.JobDetails && Object.keys(this.JobDetails)?.length!==0 && this.JobDetails?.Id!==''){
   // this.extractMapArr[index]=[false];
    }
    // else{
    //   this.extractMapArr[index]=[true];
    // }
    const indexInfo: number = this.selectedCanForExtract.indexOf(data);
    if (indexInfo !== -1) {
        this.selectedCanForExtract.splice(indexInfo, 1);
    }
  }
  if(this.selectedCanForExtract?.length>this.NoOfMembersEOHExtract){
    this.alertSingleCandidatesSelectionMessage(data);
  }
  this.membersEOHExtract.emit({
    'selectedCanForExtractCount':this.selectedCanForExtract?.length,
    'selectedCanForExtractData':this.selectedCanForExtract
  })
  }
  public alertSingleCandidatesSelectionMessage(data){
    const message = ``;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle,message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData,isButtonShow:true,message:message, message1: 'label_xeopleEOH_AlertMsg1', message2: this.NoOfMembersEOHExtract, message3: 'label_xeopleEOH_AlertMsg2'},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
    dialogRef.afterClosed().subscribe(res => {
      const index: number = this.selectedCanForExtract.indexOf(data);
      if (index !== -1) {
        data.checked=false;
        this.selectedCanForExtract.splice(index, 1);
        this.membersEOHExtract.emit( {
          'selectedCanForExtractCount':this.selectedCanForExtract?.length,
          'selectedCanForExtractData':this.selectedCanForExtract
        })
      }
    })
  }
  OnClickExtractMap(dataItem,index,method:string){
    const message = ``;
    const title = '';
    const subtitle = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ExtractMapBulkComponent, {
      data: new Object({ selectedCanForExtract:[dataItem],method:method}),
      panelClass: ['xeople-modal', 'view_extract', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }
  zoomCallEnable(phoneNo: any) {
    if (phoneNo) {
      window.open('zoomphonecall://' + phoneNo, '_blank');
    }
  }
  /*
    @Type: File, <ts>
    @Name: copySMSId function
    @Who: Renu
    @When: 25-Sept-2023
    @Why: EWM-9379 EWM-10612
    @What: for copy current data
  */
  copySMSId(PhoneNo:string, i:number){
    let el = document.getElementById('autoHideSMS' + i);
    el.style.display = 'block';
    setTimeout(() => {
      let el = document.getElementById('autoHideSMS' + i);
      el.style.display = 'none';
    }, 2000);
    // End
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = PhoneNo;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
    /* @Name: getBackgroundColor function:@Who: Satya Prakash Gupta:@When: 05-Oct-2023:@Why: EWM-14571 EWM-14606:@What: set background color*/
    getBackgroundColor(shortName) {
      if (shortName?.length > 0) {
        return ShortNameColorCode[shortName[0]?.toUpperCase()]
      }
    }
    onsearchByFilter(searchVal: string) {
      this.loading = false;
      this.searchSubject$.next(searchVal);
    }
  
    /* @Name: handleFilterChange :@Who: Renu @When: 11-10-2023:@Why: EWM-14696  EWM-14710 @What:for searching filter in card*/
    public onFilter(input:string): void {
      const inputValue = input;
      let obj:{};
      if(inputValue.length==0){
        this.searchTerm='';
        obj={
          data: this.viewMembers,
          total:this.totalRecords
        }
        this.xeopleSearchEOHdata.emit( {
          'totalDataCount':this.totalRecords,
          'canidatedata': this.viewMembers
        });
      }else
      {
        this.searchTerm=inputValue;
        this.filterData  = filterBy(this.viewMembers,{
            logic: 'or',
            filters: [
                {
                    field: 'CandidateName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'Email',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'CandidateId',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'Experience',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'MemberAddress',
                    operator: 'contains',
                    value: inputValue
                },
                {
                  field: 'Skills',
                  operator: 'contains',
                  value: inputValue
                },
                {
                  field: 'Qualification',
                  operator: 'contains',
                  value: inputValue
                },
                {
                field: 'ShortName',
                operator: 'contains',
                value: inputValue
                },
                {
                field: 'PhoneNo',
                operator: 'contains',
                value: inputValue
                },
                {
                field: 'Proximity',
                operator: 'contains',
                value: inputValue
                },
                {
                field: 'MemberStatus',
                operator: 'contains',
                value: inputValue
                }, {
                field: 'CandidatePriority',
                operator: 'contains',
                value: inputValue
                },
                {
                field: 'DateOfHire',
                operator: 'contains',
                value: inputValue
                },
                {
                field: 'Office',
                operator: 'contains',
                value: inputValue
                }
            ]
        });
        obj={
          data: this.filterData,
          total:this.filterData?.length
          }
        this.xeopleSearchEOHdata.emit( {
          'totalDataCount':this.filterData?.length,
          'canidatedata': this.filterData
        });
       
      }
      this.results=Object.assign(obj);
        this.value = fromEvent(this.searchElemRef.nativeElement, 'keyup').pipe(
          map((e: Event) => (e.target as HTMLInputElement).value),  debounceTime(20),
          distinctUntilChanged()
        );
        setTimeout(() => {
          this.loadingSearch = false
        }, 3000);
        ;
      }

  /* @When: 10-06-2024 @who:Amit @why: EWM-14654 @what: phone no copied */
  copyPhoneNumber(copyPhoneNumber: string) {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 3000);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = copyPhoneNumber;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }    
      
}
