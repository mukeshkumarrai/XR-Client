/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What:  This page will be use for the Inbox Email component ts file for particular candidate
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ResponceData, Userpreferences } from '@app/shared/models';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { MailServiceService } from '@app/shared/services/email-service/mail-service.service';
import { ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ClientNewEmailComponent } from '@app/modules/EWM.core/client/client-new-email/client-new-email.component';
import { JobScreening } from '@app/shared/models/job-screening';
enum fileExtention {
  "application/zip" = "zip",
  "application/pdf" = "pdf",
  "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet" = "xlsx",
  "text/plain" = "txt",
  "application/vnd.ms-word" = "doc",
  "application/vnd.ms-excel" = "xls",
  "image/png" = "png",
  "image/jpeg" = "jpeg",
  "image/gif" = "gif",
  "text/csv" = "csv"
}
@Component({
  selector: 'app-job-client-mailbox',
  templateUrl: './job-client-mailbox.component.html',
  styleUrls: ['./job-client-mailbox.component.scss']
})
export class JobClientMailboxComponent implements OnInit {
  public showEmailDetails: boolean = false;
  public showEmailClass: boolean = false;
  public showMarkImportantIcon: any[] = [];
  public maticonImporttant: any = "error_outline";
  public toggleColor = true;
  public changeImpIcon: any[] = [];
  public loading: boolean = false;
  public emailJson: any;
  public totalDataCount: number;
  public listView: any;
  public pagesize;
  public pagneNo = 1;
  public sortingValue: any = '';
  public searchValue: any = '';
  public emailConnection: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public loadingscroll: boolean;
  public status: boolean;
  public listViewDetails: any = {};
  public userpreferences: Userpreferences;
  @Output() mailInBoxCount = new EventEmitter();
  public mailDraftCount: any;
  public counter: any = 0;
  public tabActive: string = 'Inbox';
  public selectedTabIndex: any = 0;
  public loadingSearch: boolean;
  public searchVal: string = '';
  public IsSelected: any;
  public checkArr = [];
  public finalArr = [];
  public listViewDraft = [];
  public listViewSend = [];
  @Input() clientEmail: any;
  public positionMatDrawer: string = 'start';
  @Output() scrollChanges: EventEmitter<number> = new EventEmitter();
  @Input() clientEmailId: any;
  @Input() clientId:string;
  searchSubject$ = new Subject<any>(); 
  private dataSubscription: Subscription;
  dataMailListSubscription: Subscription;
  @Input() jobId: string;
  JobTitle: string;
  public ClientEmailId = [];
  constructor(public _sidebarService: SidebarService, private router: Router, private routes: ActivatedRoute,
    private translateService: TranslateService, public dialogObj: MatDialog, private snackBService: SnackBarService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService, private mailService: MailServiceService,
    public _userpreferencesService: UserpreferencesService, public _snackBarService: SnackBarService,
    private commonserviceService: CommonserviceService) {
    this.pagesize = this.appSettingsService.pagesize;
  }

  ngOnInit(): void {
    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.dataSubscription =  this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      let candidateList = res?.SelectedCandidate;
      this.JobTitle= res?.SelectedCandidate[0].JobTitle;
      if (candidateList?.length>0) {
        if(this.clientId){
         this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');
         this.getClientandContactEmails(this.clientId);
        }
      }
    });
  
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.dirChange(res);
    });
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {  
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
  }

  divScroll(event) {
    this.scrollChanges.emit(event);
  }
  clickEvent() {
    this.status = !this.status;
    this.counter++;
    if (this.counter > 1) {
      this.status = true;
    }
  }
/*
 @Type: File, <ts>
 @Name: openNewEmailModal function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
 @What: opening new mail
 */
  openNewEmailModal(responseData: any, mailRespondType: string) {
    this.commonserviceService?.showJobTag.next({IsJobTag:true});
    localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for remove value from localstorage
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ClientNewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      maxHeight: "100%",
      height: "100%",
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail':this.ClientEmailId,'JobId': this.jobId,'JobTitle':this.JobTitle,actionType: 'jobAction',
        'ClientEmailId':this.ClientEmailId},
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pagneNo = 1;
        this.sortingValue = '';
        this.searchValue = '';
        this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }
  showEmailSection() {
    this.showEmailDetails = true;
  }

  /*
 @Type: File, <ts>
 @Name: reloadPage function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
 @What: refresh the data
 */
  reloadPage(): void {
    this.loading = true;
    this.pagneNo = 1;
    this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');

  }

  /*
  @Type: File, <ts>
  @Name: enableDisableRule function
   @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What:on click mark as fav
  */

  enableDisableRule(index: number, markImp: number, UniqueId: any) {
    if (markImp != 1) {
      this.showMarkImportantIcon[index] = true;
      this.changeImpIcon[index] = false;
      } else {
      this.showMarkImportantIcon[index] = false;
      this.changeImpIcon[index] = false;
    }
    this.markAsImportant(UniqueId, markImp, 'Imp');
  }
  /*
    @Type: File, <ts>
    @Name: hideEmailSection function
    @Who:Nitin Bhati
    @When:04-Jan-2024
    @Why: EWM-15585 EWM-15644
    @What: hide mail section
    */

  hideEmailSection() {
    this.status = false;
    this.IsSelected = '';
  }
  /*
    @Type: File, <ts>
    @Name: fetchSendList function
    @Who:Nitin Bhati
    @When:04-Jan-2024
    @Why: EWM-15585 EWM-15644
    @What: service call for send List data
    */
  fetchSendList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.mailService.fetchSendMailList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewSend = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
@Type: File, <ts>
@Name: onScrollDown
@Who:Nitin Bhati
@When:04-Jan-2024
@Why: EWM-15585 EWM-15644
@What: To add data on page scroll.
*/
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.listView.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchMoreRecord(this.pagesize, this.pagneNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

  /*
 @Type: File, <ts>
 @Name: fetchMoreRecord
 @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
 @What: To get more data from server on page scroll.
 */

  fetchMoreRecord(pagesize, pagneNo, sortingValue) {
    this.mailService.fetchClientMailList(pagesize, pagneNo, sortingValue, this.searchValue,this.clientEmailId,this.clientId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listView = this.listView.concat(nextgridView);
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loadingscroll = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
 @Type: File, <ts>
 @Name: getDetailsInfo
 @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
 @What: To get deatil data based on unique Id
 */
  getDetailsInfo(UniqueId) {
    this.loading = true;
    this.IsSelected = UniqueId;
    this.listView.filter(x => {
      if (x['UniqueId'] == UniqueId) {
        x['IsRead'] = 1;
      }
    }
    );
    this.mailService.fetchMailDetails(UniqueId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewDetails = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
 @Type: File, <ts>
 @Name: sortName
 @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
 @What: To get short name if user profile image not present
 */
  sortName(fisrtName, lastName) {
    if (fisrtName || lastName) {
      const Name = fisrtName + " " + lastName;
      const ShortName = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
      return ShortName.toUpperCase();
    }
  }
/*
  @Type: File, <ts>
  @Name: emailDownloadAttachement
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: To get maildownload attachement
  */
  emailDownloadAttachement(EmailGuid: any, AttachmentId: any, name: any) {
    this.loading = true;
    let downloadObj = {};
    downloadObj['EmailGuid'] = EmailGuid;
    downloadObj['AttachmentId'] = AttachmentId;
    this.mailService.emailDownloadAttachement(downloadObj).subscribe(
      (data: any) => {
        const Url = URL.createObjectURL(data)
        const fileExt = fileExtention[data.type];
        this.loading = false;
        this.downloadFile(data, name);
      })
  }
 /*
  @Type: File, <ts>
  @Name: downloadFile
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: To get maildownload attachement
  */
  private downloadFile(data, filename) {
    const downloadedFile = new Blob([data], { type: data.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = filename;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }
  /*
  @Type: File, <ts>
  @Name: checkEmailConnection function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: check email connection is established or not
  */
  markAsImportant(UniqueId: any, markImp: any, Imp: string) {
    let markAsImp = {};
    markAsImp['EmailGuid'] = UniqueId;
    if (markImp == 1) {
      markAsImp['IsFavourite'] = 0;
    } else {
      markAsImp['IsFavourite'] = 1;
    }
    this.mailService.markAsImportant(markAsImp).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, Imp);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
@Name: onFilter function
@Who:Nitin Bhati
@When:04-Jan-2024
@Why: EWM-15585 EWM-15644
@What: use for Searching records
*/
  public onFilter(inputValue: string): void {
    this.loading = false;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue); 
  }
  getFilterValue(searchValue){
    this.mailService.fetchClientMailList(this.pagesize, this.pagneNo, this.sortingValue, searchValue,this.clientEmailId,this.clientId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = [];
          this.loading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Name: onFilterClear function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: use Clear for Searching records
  */
  public onFilterClear(): void {
    this.searchValue = '';
    this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');
  }
  /*
  @Name: ShowOnlyImportantFilter function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: filter only important records
  */
  ShowOnlyImportantFilter(event: any) {
    this.pagneNo = 1;
    if (event.checked) {
      this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '',this.clientEmailId)
    } else {
      this.pagneNo = 1;
      this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');
    }
  }

  /*
  @Name: fetchFavoriteMailList function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: filter only fave records
  */
  fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal, Imp,clientEmailId) {
    if (Imp == 'Imp') {
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.mailService.fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal,clientEmailId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = [];
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
 /*
  @Name: checkmultipleInfo function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: mark as read/unread for multiple mails
  */
  checkmultipleInfo(uniqueId: any, event: any) {
    if (event == true) {
      this.checkArr.push(uniqueId);
    }
  }

  /*
  @Name: updateMarkAsReadUnRead function
  @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
  @What: mark as read/unread for multiple mails
  */
  updateMarkAsReadUnRead(status: number) {
    this.finalArr = [];
    this.checkArr.forEach(x => {
      this.finalArr.push({
        'EmailGuid': x,
        'IsRead': status
      })
    })
    this.checkArr = [];
    let obj = {};
    obj['ReadUnread'] = this.finalArr;
    this.loading = true;
    this.mailService.markAsUnRead(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
 @Name: footer.component.ts
 @Who:Nitin Bhati
  @When:04-Jan-2024
  @Why: EWM-15585 EWM-15644
 @What: Implementation of Footer Section Flip with Logo Icon
 */
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'start';
    } else {
      this.positionMatDrawer = 'end';
    }
  }

  /*
    @Type: File, <ts>
    @Name: fetchInboxList function
    @Who:Nitin Bhati
    @When:04-Jan-2024
    @Why: EWM-15585 EWM-15644
    @What: service call for List data
    */
  fetchInboxList(pagesize, pagneNo, sortingValue, searchVal, Imp) { 
    if(this.clientEmailId==undefined || this.clientEmailId==null){
      return;
    }  
    if (Imp == 'Imp') {
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.dataMailListSubscription =  this.mailService.fetchClientMailList(pagesize, pagneNo, sortingValue, searchVal, this.clientEmailId,this.clientId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = [];
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataMailListSubscription.unsubscribe();
    }
  }

  getClientandContactEmails(clientId) {
    this.mailService.getClientandContactEmails(clientId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.ClientEmailId = repsonsedata.Data.ClientEmailId;
        } else if (repsonsedata.HttpStatusCode === 204) {
           } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

}
