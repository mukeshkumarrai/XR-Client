//  who:maneesh:what:ewm-13776 for create job action client contact list component,when:14/09/2023
import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { JobScreening } from 'src/app/shared/models/job-screening';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { GetClientContactListModel } from 'src/app/shared/models/get-client-contact-list'
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { debounceTime } from 'rxjs/operators';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-job-action-client-contactlist',
  templateUrl: './job-action-client-contactlist.component.html',
  styleUrls: ['./job-action-client-contactlist.component.scss']
})
export class JobActionClientContactlistComponent implements OnInit {
  public clientId: string;
  public caontactTabIndex: number = 3
  public loading: boolean;
  public selectedCandidate: Subscription;
  public searchContact: Subscription;
  public candidateName: string;
  public searchSubject$ = new Subject<any>();
  public searchValue: string = "";
  public loadingSearch: boolean;
  public candidateid: string;
  public GridId = "ClientContacts_grid_001";
  public getContactList: Subscription;
  public contactList: any = [];
  public pagesize: number;
  public pagneNo: number;
  public sortingValue: string = "FirstName,asc";
  public zoomPhoneCallRegistrationCode: any;
  public zoomCheckStatus: boolean = false;
  public zoomCheckStatuslist: Subscription;
  public contactNumber: number
  public canLoad: any;
  public pendingLoad: boolean;
  public loadingscroll: boolean;
  public totalDataCount: number;

  constructor(private commonserviceService: CommonserviceService, private clientService: ClientService,
    private appSettingsService: AppSettingsService, public systemSettingService: SystemSettingService,
    private translateService: TranslateService, private snackBService: SnackBarService, public dialog: MatDialog,) {
    this.pagneNo = this.appSettingsService?.pageOption;
    this.pagesize = appSettingsService?.pagesize;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService?.zoomPhoneCallRegistrationCode;
    this.commonserviceService?.notesClientId.subscribe((res => {
      this.clientId = res;
    }))
  }

  ngOnInit(): void {
    this.selectedCandidate = this.commonserviceService?.getJobScreeningInfo().subscribe((res: JobScreening) => {
      let candidateList = res?.SelectedCandidate;
      if (candidateList?.length > 0) {
        this.searchValue = '';
        this.candidateid = candidateList[0]?.CandidateId;
        this.candidateName = candidateList[0]?.CandidateName;
      }
    });
    this.getContactListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
    this.searchContact = this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      this.searchValue=value;
      this.getContactListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
    });
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
      //  who:maneesh:what:ewm-14550 for get status zoom call,when:10/10/2023
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
      let zoomCallIntegrationObj = otherIntegrations?.filter(res => res?.RegistrationCode == this.zoomPhoneCallRegistrationCode);
      this.zoomCheckStatus = zoomCallIntegrationObj[0]?.Connected;
  }
  //  who:maneesh:what:ewm-13776 for unsubscribe ,function:ngOnDestroy,when:13/09/2023
  ngOnDestroy() {
    this.getContactList?.unsubscribe();
    this.selectedCandidate?.unsubscribe();
    this.searchContact?.unsubscribe();
    this.zoomCheckStatuslist?.unsubscribe();
  }
  //  who:maneesh:what:ewm-13776 for managecontact ,function:managecontact,when:14/09/2023
  managecontact() {
    let URL = '/client/cont/contacts/contact-list';
    window.open(URL, '_blank')
  }
  //  who:maneesh:what:ewm-13776 for get status zoom call  ,function:getContactListByClientId,when:14/09/2023
  getContactListByClientId(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any) {
    let jsonObj: GetClientContactListModel;
    jsonObj = {
      GridId: this.GridId,
      ClientId: this.clientId,
      Search: searchValue,
      PageNumber: pagneNo,
      PageSize: pagesize,
      OrderBy: sortingValue,
      Filter: '',
    }
    this.loading = true;
    this.getContactList = this.clientService?.fetchContactListById(jsonObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.loading = false;
          this.contactList = data?.Data;
          this.totalDataCount = data?.TotalRecord;

          this.loading = false;
          this.loadingSearch = false;
        }
        else if (data.HttpStatusCode === 204) {
          this.contactList = data.Data;
          this.loading = false;
          this.loadingSearch = false;

        }
        else {
          this.loading = false;
          this.loadingSearch = false;

        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;

      });

  }
  //  who:maneesh:what:ewm-13776 for searchdata ,function:onFilter,when:14/09/2023
  public onFilter(inputValue: string): void {
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);
  }
  //  who:maneesh:what:ewm-13776 for clear searchdata ,function:onFilterClear,when:13/09/2023
  public onFilterClear(): void {
    this.searchValue = '';
    this.getContactListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
  }
  //  who:maneesh:what:ewm-13776 for clear copy current data  ,function:copyContactData,when:14/09/2023
  copyContactData(data: any, i: any, type) {
    if (type == 'emailId') {
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
      selBox.value = data;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    } else if (type == 'phone') {
      let el = document.getElementById('autoHidePhone' + i);
      el.style.display = 'block';
      setTimeout(() => {
        let el = document.getElementById('autoHidePhone' + i);
        el.style.display = 'none';
      }, 2000);
      // End 
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = data;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }


  }

  //  who:maneesh:what:ewm-13776 for opening new mail ,function:openNewEmailModal,when:14/09/2023
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
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, openDocumentPopUpFor: 'Candidate', isBulkEmail: false },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pagneNo = 1;
        this.sortingValue = '';
        this.searchValue = '';
      }
    })
  }

  //  who:maneesh:what:ewm-13776 for scroll  ,function:onScrollDown,when:15/09/2023

  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.contactList.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchMoreContactList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  //  who:maneesh:what:ewm-13776 for fetch more record when scroll  ,function:fetchMoreContactList,when:15/09/2023
  fetchMoreContactList(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any) {
    let jsonObj: GetClientContactListModel;
    jsonObj = {
      GridId: this.GridId,
      ClientId: this.clientId,
      Search: searchValue,
      PageNumber: pagneNo,
      PageSize: pagesize,
      OrderBy: sortingValue,
      Filter: '',
    }
    this.clientService.fetchContactListById(jsonObj).subscribe(
      (data: ResponceData) => {
        this.loadingscroll = false;
        if (data.HttpStatusCode === 200) {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = data.Data;
          this.contactList = this.contactList.concat(nextgridView);
        }
        else if (data.HttpStatusCode === 204) {
          this.loadingscroll = false;
        }
      });
  }

}
