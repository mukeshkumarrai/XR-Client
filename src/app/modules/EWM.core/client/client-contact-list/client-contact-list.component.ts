/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup
  @When: 01-dec-2021
  @Why:EWM-3692 EWM-3861
  @What:  This page will be use for client contact Component ts file
*/

import { Component, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from '../../../../shared/models';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { CandidatejobmappingService } from '../../../../shared/services/candidate/candidatejobmapping.service';
import { DocumentService } from '../../../../shared/services/candidate/document.service';
import { CommonServiesService } from '../../../../shared/services/common-servies.service';
import { UserpreferencesService } from '../../../../shared/services/commonservice/userpreferences.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { AddAddressComponent } from '../../../EWM.core/shared/quick-modal/add-address/add-address.component';
import { CandidateService } from '../../../EWM.core/shared/services/candidates/candidate.service';
import { ClientService } from '../../../EWM.core/shared/services/client/client.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { JobService } from '../../shared/services/Job/job.service';
import { QuickAddContactComponent } from '../../shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { GridComponent, SelectableSettings } from '@progress/kendo-angular-grid';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { AssignContactComponent } from '../../shared/quick-modal/quick-add-contact/AssignContact/assign-contact/assign-contact.component';
import { NewEmailComponent } from '../../shared/quick-modal/new-email/new-email.component';
import { ButtonTypes } from 'src/app/shared/models';
import { JobSMSComponent } from '../../job/job/job-sms/job-sms.component';
import { MatSidenav } from '@angular/material/sidenav';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { RouterData } from '@mainshared/enums/router.enum';
import { CommonFilterDiologComponent } from '../../job/landingpage/common-filter-diolog/common-filter-diolog.component';
import { CommonFilterdilogService } from '@app/shared/services/common-filterdilog.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-client-contact-list',
  templateUrl: './client-contact-list.component.html',
  styleUrls: ['./client-contact-list.component.scss']
})
export class ClientContactListComponent implements OnInit {

  @Input() clientIdData:any
  @Input() clientIdDatalist:any

  public loading: boolean;
  gridListData: any[]=[];
  public userpreferences: Userpreferences;
  public sortDirection = 'asc';
  public sortingValue: string = "FirstName,asc";
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  public sort: any[] = [{
    field: 'FirstName',
    dir: 'asc'
  }];
  public kendoLoading: boolean;
  TotalNoOfClient: number;
  public colArr: any = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public pageSizeOptions;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public filterCount: number = 0;
  public columns: ColumnSetting[] = [];
  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  viewMode: string = 'listMode';
  @Output() clientContactCount = new EventEmitter();
  public totalDataCount: number;
  clientId = "";
  GridId="ClientContacts_grid_001";
  public filterConfig: any;
  public result: string = '';
  searchSubject$ = new Subject<any>();
  dirctionalLang;
  animationVar: any;

  // get config Adarsh EWM-12059 26-APRIL-2023
public filterAlert: any = 0;
public quickFilterStatus: number = 0;
@ViewChild(GridComponent) public grid: GridComponent;
public dynamicFilterArea: boolean = false;
public columnsWithAction: any[] = [];
// End
gridColConfigStatus:boolean=false;
UserType='CONT';
@ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
isSmsHistoryForm: boolean = false;
smsHistoryToggel: boolean;
quickFilterToggel: boolean;
candidateDetails: any;
SMSCheckStatus: boolean = false;
burstSMSRegistrationCode: string;
candidateIdData: string;
SMSHistory:any=[];
contactId:string;
public selectedCandidate: any = [];
zoomCheckStatus:boolean= false;
zoomPhoneCallRegistrationCode:string;
public matDrawerBgClass;
public contactPhone:number;
  constructor(private route: Router,private fb: FormBuilder,private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService,private commonserviceService: CommonserviceService, private jobService: JobService, private snackBService: SnackBarService,private clientService: ClientService, public candidateService: CandidateService,
    private ngZone: NgZone,public systemSettingService: SystemSettingService, private CommonFilterdilogsrvs :CommonFilterdilogService) {
    this.pagesize = appSettingsService.pagesize;
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
    this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
    let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
     this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
         // who:maneesh,what: ewm-16065 for send  sms after checkbox uncheck  contct,when:04/03/2024
      this.commonserviceService?.contactlistSendSmsResponce?.subscribe(res => {
        if (res==true) {
          this.selectedCandidate=[];
          this.commonserviceService?.selectedContact.next(this.selectedCandidate);//this service will be use for disabled send sms btn  and send mail btn
          this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
        }
      });
    this.routes.queryParams.subscribe((value) => {
      if(value.clientId!=undefined && value.clientId!=null && value.clientId!=''){
       this.clientId = value.clientId;
      }
    });

    this.commonserviceService.onClientSelectId.subscribe(value => {
      if (value !== null) {
        this.clientId = value;
        this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
      }
    })
    this.getFilterConfig(false);

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {   // put this code in ngOnIt section
      this.loadingSearch = true;
      this.getContactListByClientId(this.pagesize, this.pagneNo, this.sortingValue, val, true, false);
       });

       this.animationVar = ButtonTypes;

   }

   /*
@Type: File, <ts>
@Name: ngOnDestroy
@Who: Adarsh Singh
@When: 26-APRIL-2023
@Why: ROST-12059
@What: calling configuation while user has leave the page
*/
ngOnDestroy() {
  const columns = this.grid?.columns;
  if (columns) {
    const gridConfig = {
      columnsConfig: columns.toArray().map(item => {
        return Object.keys(item)
          .filter(propName => !propName.toLowerCase()
            .includes('template'))
          .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
      }),
    };
    // this.setConfiguration(gridConfig.columnsConfig); //by maneesh ewm-17806
  }
}

  /*
    @Type: File, <ts>
    @Name: getFilterConfig
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: filter get api
  */
 getFilterConfig(loaderValue: boolean) {
  this.loading = loaderValue;
  this.jobService.getfilterConfig(this.GridId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        let colArrSelected = [];
        if (repsonsedata.Data !== null) {
          this.colArr = repsonsedata.Data.GridConfig;
          this.filterConfig = repsonsedata.Data.FilterConfig;
          this.gridColConfigStatus=repsonsedata.Data.IsDefault;
          setTimeout(()=>{
          this.getLocalStorageData();
          this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
          },100)
          if (this.filterConfig !== null) {
            this.filterCount = this.filterConfig.length;
          } else {
            this.filterCount = 0;
          }
          if (repsonsedata.Data.GridConfig.length != 0) {
            colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Grid == true);
          }
          if (colArrSelected.length !== 0) {
            this.columns = colArrSelected;
            // <!-- --------@When: 26-APR-2023 @who:Adarsh singh @why: EWM-12059 -------- -->
          this.columnsWithAction = this.columns;

            // End
          } else {
            this.columns = this.colArr;
             // <!-- --------@When: 26-APR-2023 @who:Adarsh singh @why: EWM-12059 -------- -->
          this.columnsWithAction = this.columns;

          // End
          }
        }
        this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
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
    @Name: getContactListByClientId
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: get contact list for client
  */
  getContactListByClientId(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll:boolean) {
    if (isSearch == true) {
      this.loading = false;
    } else if(isScroll) {
      this.loading = false;
    }else{
      this.loading = true;
    }
    let jsonObj = {};
    if (this.filterConfig !== null) {
       jsonObj['FilterParams'] = this.filterConfig;
     } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['ClientId'] = this.clientId;
    jsonObj['Search'] = searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    this.clientService.fetchContactListById(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.selectedCandidate = [];
            this.commonserviceService?.selectedContact.next(this.selectedCandidate);
            if(isScroll){
              let nextgridView = [];
              nextgridView = data['Data'];

              this.gridListData = this.gridListData.concat(nextgridView);
            }else{
              this.gridListData = data.Data;
            };
            // if(this.gridColConfigStatus){
            //   this.fitColumns();
            // }
            if (isSearch == true) {
              this.clientContactCount.emit(false);
            }else{
              this.clientContactCount.emit(true);
            };
          this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
            this.loadingSearch = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.selectedCandidate = [];
            this.commonserviceService?.selectedContact.next(this.selectedCandidate);
            if(isScroll){
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            }else{
              this.gridListData = data.Data;
            }

            this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
            this.loadingSearch = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
          }
        }, err => {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }

/*
    @Type: File, <ts>
    @Name: pageChange
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for page no
  */
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData.length) {
      this.pagneNo = this.pagneNo + 1;
      this.getContactListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, true);
    } else {
      this.loadingscroll = false;
    }
  }

/*
    @Type: File, <ts>
    @Name: sortChange
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for shorting
  */
    public sortChange($event): void {
      this.sortDirection = $event[0].dir;
      if (this.sortDirection == null || this.sortDirection == undefined) {
        this.sortDirection = 'asc';
      } else {
        this.sortingValue = $event[0]?.field + ',' + this.sortDirection;
      }
      // who:maneesh,what:ewm-16068 for no sorting  ownersfield,when:20/02/2024
      if ($event[0]?.field=='Owners') {
        this.sort=[];
      }
      if ($event[0]?.field!='Owners') {
        this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
      }
    }
/*
    @Type: File, <ts>
    @Name: showTooltip
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for tooltip
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
    else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      }
      else {
        this.tooltipDir.toggle(element);
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

/*
    @Type: File, <ts>
    @Name: switchListMode
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for mode
  */
  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";

    } else {
      this.viewMode = "listMode";
    }
  }

/*
    @Type: File, <ts>
    @Name: onFilter
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for search
  */
  isFilter: boolean = false;
  public onFilter(inputValue: string): void {
    this.isFilter = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);
  }

/*
    @Type: File, <ts>
    @Name: onFilterClear
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for clear serch
  */
  loadingSearch: boolean;
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
  }


/*
    @Type: File, <ts>
    @Name: sortName
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for short Name
  */
sortName(Name) {
  if (Name) {
    let finalNameArr = Name.split(' ').slice(0, 2);

if(finalNameArr.length>=2){
const Name = finalNameArr[0] + " " + finalNameArr[1];

    const ShortName1 = Name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');

     let first= ShortName1.slice(0,1);
     let last=ShortName1.slice(-1);
     let ShortName = first.concat(last.toString());
     return ShortName.toUpperCase();

}else{
 const ShortName1 = finalNameArr[0].split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
    let singleName = ShortName1.slice(0, 1);
    return singleName.toUpperCase();

}
  }
}


 /*
    @Type: File, <ts>
    @Name: deleteClientContact
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: delete client contact
  */
 deleteClientContact(val): void {
   const message = '';
  // @When: 01-08-2024 @who:Amit @why: EWM-17798 @what: label changes
  //  const title = 'label_titleDialogContentSiteDomain';
  const title = 'Contacts_delinkclient';
  //  const subTitle = 'message_delinkContact';
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
       this.loading = true;
       this.clientService.deLinkClientContact_V2(this.selectedCandidate).subscribe(//who:maneesh,what:ewm-16065 for fixed delete functionality fixed V2 api,when:29/06/2024
         (repsonsedata:any) => {
           if (repsonsedata['HttpStatusCode'] == 200) {
             this.loading = false;
             this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
             this.pagneNo = 1;
             this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
             this.clientContactCount.emit(true);
            } else {
              this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

         })
     } else {
       // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
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
    @Name: openFilterModalDialog
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for open filter model
  */

 openFilterModalDialog() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
  const dialogRef = this.dialog.open(CommonFilterDiologComponent, {
    data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
    panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {    
    if (res != false) {
      this.loading = true;
     this.filterCount = res.data.length;
      let filterParamArr = [];
      res.data.forEach(element => {
        filterParamArr.push({
          'FilterValue': element.ParamValue,
          'ColumnName': element.filterParam.Field,
          'ColumnType': element.filterParam.Type,
          'FilterOption': element.condition,
          'FilterCondition': 'AND'
        })
      });
      this.filterConfig = filterParamArr;
      this.loading = true;
     this.setConfiguration(this.filterConfig);
     this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
     this.setConfiguration(this.filterConfig);
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
    @Type: File, <ts>
    @Name: clearFilterData
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for clear filter
  */

clearFilterData(viewMode): void {
  const message = `label_confirmDialogJob`;
  const title = 'label_Client';
  const subTitle = 'label_contact';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    this.result = dialogResult;
    if (dialogResult == true) {
      this.filterConfig = [];
      let JobFilter = [];
      this.loading = true;
      this.filterCount = 0;
      setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
        this.getLocalStorageData();
        this.setLocalStorageData('commonFilterDataStore',null);
            },100)
      this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);

    }
  });
}

 /*
    @Type: File, <ts>
    @Name: openQuickAddContactModal
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: to open quick add contact modal dialog
  */
 openQuickAddContactModal() {
  const dialogRef = this.dialog.open(QuickAddContactComponent, {
    data: new Object({ formType:"AddClientContactForm", clientId:this.clientId,clientIdData:this.clientIdDatalist,contactRelatedData:true}),
    panelClass: ['xeople-modal-lg', 'quickAddClientContact', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.getFilterConfig(false);
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
@Name: setConfiguration function
@Who: Adarsh singh
@When: 26-APRIL-2023
@Why: ROST-12059
@What: For saving the setting config WITH WIdth of columns
*/
setConfiguration(columnsConfig) {
  let gridConf = {};
  let tempArr: any[] = this.colArr;
  columnsConfig?.forEach(x => {
    let objIndex: any = tempArr.findIndex((obj => obj.Field == x.field));
    if (objIndex >= 0) {
      tempArr[objIndex].Format = x.format,
        tempArr[objIndex].Locked = x.locked,
        tempArr[objIndex].Order = x.leafIndex + 1,
        tempArr[objIndex].Selected = true,
        tempArr[objIndex].Type = x.filter,
        tempArr[objIndex].width = String(x._width)
    }
  });
  gridConf['GridId'] = this.GridId;
  gridConf['GridConfig'] = tempArr;
  gridConf['CardConfig'] = [];
  gridConf['FilterAlert'] = this.filterAlert;
  gridConf['filterConfig'] = this.filterConfig;
  gridConf['QuickFilter'] = this.quickFilterStatus;
  this.jobService.setfilterConfig(gridConf).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;      
        setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            this.getLocalStorageData();
            this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
                },100)
      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}
/*
@Type: File, <ts>
@Name: fitColumns function
@Who: Adarsh singh
@When: 26-APRIL-12059
@Why: ROST-12059
@What: fit columns auto width increase from config
*/
public fitColumns(): void {
  this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
    this.grid.autoFitColumns();
  });
}
 /*
    @Type: File, <ts>
    @Name: openQuickAddContactModal
    @Who: maneesh
    @When: 29-may-2023
    @Why: EWM-11569
    @What: to open quick add AssignContactModal dialog
  */
    openQuickAddAssignContactModal() {
      const dialogRef = this.dialog.open(AssignContactComponent, {
        data: new Object({  clientId:this.clientId}),
        panelClass: ['xeople-modal-lg', 'quickAddClientContact', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
        // <!-- who:bantee,what:ewm.13153  On Assign contact any further details are not getting refreshed on tab and no notification triggers. ,when:04/08/2023 -->

        this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);

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
 @Name: openNewEmailModal function
 @Who: Suika
 @When:24-July-2023
 @Why: EWM-13288 EWM-13179
 @What: opening new mail
 */
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
    data: { 'contactEmail': true, 'openType': localStorage.getItem('emailConnection'),'candidateMail': email,openDocumentPopUpFor:'Contact',isBulkEmail:false,'candidateId':ContactId},
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


  // @When: 27-09-2023 @who:Amit @why: EWM-14465 @what: btn animation function
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
   @Name: copyCandidateEmailId function
   @Who: Suika
   @When:24-July-2023
   @Why: EWM-13288 EWM-13179
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
public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;
selectableSettings:SelectableSettings = {
  checkboxOnly: true
}

//who:maneesh,what:ewm-16065 for fixed toggle primary contact functionality,when:29/06/2024
isPrimaryContact(data,Id){
  this.loading = true;
  let primarycontact={}
  primarycontact['ClientId']=this.clientId;
  primarycontact['Id']=Id;
    if (data.checked) {
    primarycontact['IsPrimary']=1;
    }else{
       primarycontact['IsPrimary']=0;
     }
     this.clientService.isPrimaryContact(primarycontact).subscribe(
        (repsonsedata:any) => {
            this.pagneNo = 1;
            this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
    })
}
selectionChange(event:any){
  this.selectedCandidate=event;  
  this.commonserviceService?.selectedContact.next(this.selectedCandidate);
  if(this.selectedCandidate?.length>0){
    this.commonserviceService?.showJobTag.next({IsJobTag:true});
  }
}
smsHistoryDetails(can) {
  this.contactPhone=can?.PhoneNo;  //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
  this.contactId = can.ContactId;
  this.getSMSHistory();
  this.smsHistoryToggel = true;
  this.quickFilterToggel=false;
  setTimeout(() => {
    this.openDrawer(can);
  }, 1000);
}

openDrawer(can){
  setTimeout(() => {
    if(this.SMSHistory?.length>0){
      this.smsHistoryDrawer.open();
      this.isSmsHistoryForm = true;
      this.contactId = can?.ContactId;
      let dataItemObj = {};
  dataItemObj['PhoneNumber'] = can?.PhoneNo;
  dataItemObj['Name'] = can?.FullName;
  dataItemObj['CandidateId'] = can?.ContactId;
  dataItemObj['PhoneCode'] = can?.PhoneCode;
  can=dataItemObj;
       this.candidateDetails = can;
    }else{
      this.openJobSMSForCandidate(can)
    }
  }, 1500);
}

openJobSMSForCandidate(dataItem) {
  let dataItemObj = {};
  dataItemObj['PhoneNumber'] = dataItem?.PhoneNo;
  dataItemObj['Name'] = dataItem?.FullName;
  dataItemObj['CandidateId'] = dataItem?.ContactId;
  dataItemObj['PhoneCode'] = dataItem?.PhoneCode;
  dataItem=dataItemObj;
  this.contactId=dataItem?.CandidateId;
  this.candidateIdData=dataItem?.CandidateId;
  const dialogRef = this.dialog.open(JobSMSComponent, {
    data: new Object({ jobdetailsData: dataItem,UserType:this.UserType}),
    panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.getSMSHistory();
    }
    this.loading = false;
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
  })
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
}

getSMSHistory() {
  this.loading = true;  
  this.systemSettingService.getSMSHistory('?Id='+this.contactId+'&UserType='+'CONT').subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.SMSHistory = [];
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    })
}

fetchDataFromSMSHistory(event){
  if(event){
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
    this.smsHistoryDrawer.close();
  }
}

refresh(){
  this.getContactListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
 }
 // who:maneesh,what: ewm-16292 sms close drawer, when:04/03/2024
 toggleDrwer(start: any) {
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
  start.toggle();
  }

  openDrawerWithBg(value){
    this.matDrawerBgClass = value;
  }
  viewContactSummery(id){
    const baseUrl = window.location.origin;
    const router = RouterData.contactSummery;
    const url = baseUrl+router+"?ContactId="+id;
     window.open(url, '_blank');
        }
        // Function to get the current config data from localStorage
 getLocalStorageData() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
  const data = this.CommonFilterdilogsrvs.getLocalStorage('commonFilterDataStore');
  return data ? JSON.parse(data) : {};
}

// Function to save config data to localStorage
 setLocalStorageData(key, data) {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
  this.CommonFilterdilogsrvs.setLocalStorage(key,JSON.stringify(data));
}
}
