import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ResponceData, Userpreferences } from '@app/shared/models';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CandidatejobmappingService } from '@app/shared/services/candidate/candidatejobmapping.service';
import { DataBindingDirective, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { PagerPosition } from '@progress/kendo-angular-listview';
import { PagerType } from '@progress/kendo-angular-pager';
import { filterBy, orderBy, SortDescriptor, State } from '@progress/kendo-data-query';
import { Observable, Subject, Subscription } from 'rxjs';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { ApplicantDetailPopupComponent } from './applicant-detail-popup/applicant-detail-popup.component';
import { MailServiceService } from '@app/shared/services/email-service/mail-service.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ReloadService } from '@app/modules/EWM.core/shared/reload.service';
import { ShareResumeComponent } from '@app/modules/EWM.core/job/screening/share-resume/share-resume.component';
import { ParsedResumeKeywordSearchComponent } from '@app/shared/parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';
import { CandidateTimelineComponent } from '@app/modules/EWM.core/job/candidate-timeline/candidate-timeline.component';

@Component({
  selector: 'app-applicant-list',
  templateUrl: './applicant-list.component.html',
  styleUrls: ['./applicant-list.component.scss']
})
export class ApplicantListComponent implements OnInit {
  public view: Observable<any[]>;
  private subscription: Subscription;
  public state: State = { skip: 0, take: 50 };
  gridListData: any[] = [];
  gridListDataFilter:any=[];
  public searchText: string = '';
  APIRequest;
  loadingscroll: boolean;
  totalDataCount: number;
  public pagneNo = 1;
  @Input() workflowId;
  @Input() WorkflowStageId;
  @Input() filterConfig;
  @Input() QuickFilter;
  @Input() CountFilter;
  @Input() JobId;
  loading: boolean;
  public pagerTypes = ['numeric', 'input'];
  public type: PagerType = 'numeric';
  public buttonCount = 3;
  public info = true;
  public pageSizes = true;
  public previousNext = true;
  public position: PagerPosition = 'bottom';
  public pageSize;
  public skip = 0;
  public gridView: GridDataResult;
  public sort: SortDescriptor[] = [
    {
      field: 'Name',
      dir: 'asc'
    }
  ];
  public sizes = [50, 100, 200];
  //JobId: string = '00000000-0000-0000-0000-000000000000';
  public userpreferences: Userpreferences;
  public dirctionalLang: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  isResumeUpload: any = [];
  public ResumeName: any;
  public FileName: any;
  public ResumeId: any;
  CandidateId: any;
  CandidateName: string;
  public searchVal: string = '';
  public loadingSearch: boolean = false;
  @Input() JobDetailApplicantlist;
  Applicantlist:boolean=false;
  @Input() pipeline;
  
  constructor(private _service: CandidatejobmappingService, private _reloadService: ReloadService, private appSettingsService: AppSettingsService, public dialog: MatDialog, public _userpreferencesService: UserpreferencesService,private mailService: MailServiceService,
    private translateService: TranslateService, private snackBService: SnackBarService,private candidateService: CandidateService) {
    this.pageSize = this.appSettingsService.pagesize;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.sizes = this.appSettingsService.pageSizeOptions;
    this.subscription = this._reloadService.reload$.subscribe(() => {
      // Perform the reload or other actions here
      this.getApplicatList();
    });

  }

  ngOnInit(): void {    
    this.getApplicatList();
    if (this.JobDetailApplicantlist==true) {
      this.Applicantlist=false;
    }else{
      this.Applicantlist=true;
    }   
  }
  ngOnDestroy() {
    // Clean up the subscription
    this.subscription.unsubscribe();
  }
  getApplicatList() {
    this.loading = true;
    let requestdata = {
      "JobId":this.JobId,
      "WorkflowId": this.workflowId,
      "CountFilter": this.CountFilter,
      "QuickFilter": this.QuickFilter,
      "CandidateFilterParams": this.filterConfig,
      "WorkflowStageId": this.WorkflowStageId,
    };
    if (this.APIRequest) {
      this.APIRequest.unsubscribe();
    }
    this.APIRequest = this._service.getApplicantList(requestdata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.loading = false;
          this.gridListData = data.Data;
          this.gridListDataFilter= data.Data;
          this.totalDataCount = data.TotalRecord;
          this.searchVal='';
          this.loadItems();
        }
        this.loading = false;
      })
  }
  candidateSummery(url: string, canID: string, type: string) {
    url = url + "?CandidateId=" + canID + "&Type=CAND"
    window.open(url, "_blank");
  }


  public pageChange({ skip, take }: PageChangeEvent): void {
    this.loading = true;
    this.skip = skip;
    this.pageSize = take;
        setTimeout(()=>{
      this.loading = true;
      this.loadItemsData();
    })
  }

  public loadItems(): void {
    this.gridView = {
      data: this.gridListData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridListData.length
    };
  }
  public loadItemsData(): void { //this is use for change page size data by maneesh ewm-16250
    this.gridView = {
      data: this.gridListData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridListData.length
    };
    this.loading = false;
  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadProducts();
  }
  private loadProducts(): void {
    this.gridView = {
      data: orderBy(this.gridListData, this.sort),
      total: this.gridListData.length
    };
  }

  /*
    @Type: File, <ts>
    @Name: copyCandidateEmailId function
    @Who: Nitin Bhati
    @When: 05-Dec-2023
    @Why: EWM-15306
    @What: for copy current data
 */
  copyCandidateEmailId(EmailId: any, i: any) {
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

  /*
  @Type: File, <ts>
  @Name: openNewEmailModal function
  @Who: Nitin Bhati
  @When: 05-Dec-2023
  @Why: EWM-15306
  @What: opening new mail
  */
  openNewEmailModal(responseData: any, mailRespondType: string, email: string,dataItem) { 
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, 'workflowId': this.workflowId,
       'JobId': this.JobId, openDocumentPopUpFor: 'Candidate', isBulkEmail: false,ApplicantCandidatId:dataItem?.CandidateId},
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
         }
    })

  }

  /*
    @Name: openCandidateDetails function
    @Who: Nitin Bhati
    @When: 05-12-2023
    @Why: EWM-15306 EWM-15315
    @What: For showing candidate detials information on click
    */
    openCandidateDetails(candidatedata: string) {
      this.dialog.open(ApplicantDetailPopupComponent, {
        data: { 'candidatedata': candidatedata},
        panelClass: ['xeople-candidate-info-card', 'open-candidate-details', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });

      // RTL code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    }
    getBackgroundColor(shortName) {
      if (shortName?.length > 0) {
        return ShortNameColorCode[shortName[0]?.toUpperCase()]
      }
    }
  /*
 @Type: File, <ts>
 @Name: showTooltip function
 @Who: Nitin Bhati
 @When: 06-Dec-2023
 @Why: EWM-15315
 @What: For showing tooltip in kendo
  */
    public showTooltip(e: MouseEvent): void {
      const element = e.target as HTMLElement;
      if (element.nodeName === 'TD') {
        var attrr = element.getAttribute('ng-reflect-logical-col-index');
        if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
          if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
            this.tooltipDir.hide();
          }
          else {
            if (element.innerText == '') {
              this.tooltipDir.hide();
            } else {
              this.tooltipDir.toggle(element);
            }

          }
        }
        else {
          this.tooltipDir.hide();
        }
      }
      else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
          this.tooltipDir.hide();
        }
        else {
          if (element.innerText == '') {
            this.tooltipDir.hide();
          } else {
            this.tooltipDir.toggle(element);
          }

        }
      }
      else {
        this.tooltipDir.hide();
      }
    }



 /*
 @Type: File, <ts>
 @Name: showResume function
 @Who: Nitin Bhati
 @When: 06-Dec-2023
 @Why: EWM-15315
 @What: For display resume
*/
showResume(CandidateId: string) {
  const dialogRef = this.dialog.open(ParsedResumeKeywordSearchComponent, {
    data: new Object({CandidateId:CandidateId }),
    panelClass: ['xeople-modal-lg', 'resume-view-parse', 'animate__animated', 'animate__zoomIn'],
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
 @Name: confirmShareDocument function
 @Who: Nitin Bhati
 @When: 06-Dec-2023
 @Why: EWM-15315
 @What: share documnet while click save button
*/
confirmShareDocument(CandidateId, CandidateName) {
  this.loading = true;
  this.fetchVersionHistory(CandidateId);
  this.CandidateId = CandidateId;
  this.CandidateName = CandidateName;
}
/*
 @Type: File, <ts>
 @Name: fetchVersionHistory function
 @Who: Nitin Bhati
 @When: 06-Dec-2023
 @Why: EWM-15315
 @What: share documnet while click save button
*/
  fetchVersionHistory(candidateId) {
    this.loading = true;
    this.candidateService.fetchCandidateVersionHistory("?candidateId=" + candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
          let gridView = repsonsedata.Data;
          if (gridView?.length == 0) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_resumeNotAddedYet'), repsonsedata['HttpStatusCode']);
            this.loading = false;
            this.isResumeUpload[candidateId] = true;
          } else {
            if (gridView) {
              let Id = gridView?.ResumeId;
              this.ResumeName = gridView[0].UploadFileName;
              this.FileName = gridView[0].FileName;
              this.ResumeId = gridView[0].ResumeId;
              // this.loadViewer(DemoDoc, Id, FileName)
              this.onShareDocPopUp();
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

   /*
 @Type: File, <ts>
 @Name: onShareDocPopUp function
 @Who: Nitin Bhati
 @When: 06-Dec-2023
 @Why: EWM-15315
 @What: opne document popup
*/
onShareDocPopUp() {
  let documentData = {};
  documentData['Name'] = this.ResumeName ? this.ResumeName : 'Resume';
  documentData['ResumeLink'] = this.FileName;
  documentData['Id'] = this.ResumeId;
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(ShareResumeComponent, {
    data: new Object({ documentData: documentData, candidateId: this.CandidateId, candidateName: this.CandidateName }),
    panelClass: ['xeople-modal', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
    } else {
      this.loading = false;
    }
  });
}

onFilterSearch(filter) {
  const newData = filterBy(this.gridListDataFilter,{
    logic:"or",
    filters:[
   { field:"MappedWithJob", operator:'eq',value:filter},
   { field:"Name", operator:'contains',value:filter},
   { field:"CandidateEmail", operator:'contains',value:filter},
   { field:"Location", operator:'contains',value:filter},
   { field:"Skills", operator:'contains',value:filter},
   { field:"Tags", operator:'contains',value:filter}
    ]
  });
 this.gridListData =newData;

}

 onRefresh(){
  this.getApplicatList();
 }
//  by maneesh.when:20/06/2024,open timeline popup when click on pipline coloum
 openJobTimeline(candidateId: string,piplinetype) {
  const dialogRef = this.dialog.open(CandidateTimelineComponent, {
    data: { candidateId: candidateId, jobId: this.JobId, workflowId: this.workflowId,ApplicantList:this.Applicantlist,piplinetype:piplinetype,jobdetailsPipeline:this.pipeline },
    panelClass: ['xeople-modal-lg', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  // RTL Code
  let dir: string;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }
}
}
