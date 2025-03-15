import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { StateKey } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CandidateBulkEmailComponent } from '@app/modules/EWM-Candidate/candidate-list/candidate-bulk-email/candidate-bulk-email.component';
import { CandidateBulkSmsComponent } from '@app/modules/EWM-Candidate/candidate-list/candidate-bulk-sms/candidate-bulk-sms.component';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobSMSComponent } from '../job/job/job-sms/job-sms.component';
import { NewEmailComponent } from '../shared/quick-modal/new-email/new-email.component';
import { QuickAddContactComponent } from '../shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { ClientService } from '../shared/services/client/client.service';
import { JobService } from '../shared/services/Job/job.service';
import { SystemSettingService } from '../shared/services/system-setting/system-setting.service';
import { ProximitySearchComponent } from 'src/app/shared/popups/proximity-search/proximity-search.component';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  public ActiveMenu: string;
  public loading: boolean;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  public sort: any[] = [{
    field: 'FirstName',
    dir: 'asc'
  }];

  public GridId: string = 'ContactsLandingGrid_001';
  public sortingValue: string = "FullName,asc";
  public searchValue: string = "";
  public columns: ColumnSetting[] = [];
  public filterCount: number = 0;
  public colArr: any = [];
  public filterConfig: any;
  public sortDirection: string = 'asc';
  public userpreferences: Userpreferences;
  public loadingscroll: boolean;
  public viewMode: string = 'listMode';
  public totalDataCount: number;
  public loadingSearch: boolean;
  public searchVal: string = '';
  animationVar: any;
  searchSubject$ = new Subject<any>();
  dirctionalLang;
  gridColConfigStatus: boolean = false;
  loaderStatus: number;
  public columnsWithAction: any[] = [];
  @ViewChild(GridComponent) public grid: GridComponent;
  totalContactCount: number;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  private destroySubject: Subject<void> = new Subject();
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200];
  public initialstate: State = {
    skip: 0,
    take: 200,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'FullName',
      dir: 'asc'
    }]

  };
  zoomPhoneCallRegistrationCode: string;
  zoomCheckStatus: boolean = false;
  public state: State;
  public selectedCandidate: any = [];
  selectableSettings:SelectableSettings = {
    checkboxOnly: true
  }
  SMSCheckStatus: boolean = false;
  burstSMSRegistrationCode: string;
  isSMSStatus: boolean;
  contactId: string;
  SMSHistory:any=[];
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  isSmsHistoryForm: boolean = false;
  smsHistoryToggel: boolean;
  quickFilterToggel: boolean;
  candidateDetails: any;
  UserType='CONT';
  toEmailList: any;
  public multipleEmail:boolean = false;
  getCandidateData:any = [];
  getAllEmailIdFormMappedJob:any = [];
  IsEmailConnected: number;
  //Who:Ankit Rawat, What:EWM-16158 EWM-16311 Add Proximity Search, When:05March24
 public IsProximitySearch: boolean=false;
 public ProximitySearchResult = {
   Latitude: 0,
   Longitude: 0,
   Distance:0,
   Unit:'KM',
   Address:'',
   //@When: 11-03-2024 @who:Amit @why: EWM-16399 @what: label changes
   Source:this.translateService.instant('label_ProxmitySearch_SearchContacts') +' "Location" '+this.translateService.instant('label_ProxmitySearch_WithinTheSpecifiedRange')
 }
  //Who:Ankit Rawat, What:EWM-16158 Proximity sorting on page init, When:07March24
 public isOnInit: boolean=false;
 public contactPhone:number;
 ShowClientContactsProximity:number;
  message: string;
  ProximityAddress:string;
  constructor(private clientService: ClientService,
    private snackBService: SnackBarService,
    private translateService: TranslateService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService, private route: Router,
    public _sidebarService: SidebarService, private jobService: JobService, private commonserviceService: CommonserviceService,
    private ngZone: NgZone,public systemSettingService: SystemSettingService) {

    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.sizes=this.appSettingsService.pageSizeOptions;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
  }

  ngOnInit(): void {
    this.isOnInit=true;
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');
    this.state = { ...this.initialstate }
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);

    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('contact-list');

    this.getFilterConfig(false);
    this.animationVar = ButtonTypes;
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.commonserviceService.onOrgSelectId.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(searchValue => {   // put this code in ngOnIt section
      this.loadingSearch = true;
      this.sendRequest(this.state);

    });
    this._sidebarService.searchEnable.next('1');

    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let zoomCallIntegrationObj = otherIntegrations?.filter(res => res.RegistrationCode == this.zoomPhoneCallRegistrationCode);
    this.zoomCheckStatus = zoomCallIntegrationObj[0]?.Connected;
       // SMS
  let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
  this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;

  }
  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: dataStateChange function for kendogrid

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if(state.sort[0]?.field=="Owners"){
      state.sort[0]['dir']='asc';
      }
    if(state.sort[0]?.field!="Owners"){
    this.sendRequest(state);
    }
  }

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: sendRequest function to get the data

  public sendRequest(state: State): void {
    this.loading=true;    
    if (this.ShowClientContactsProximity==undefined || this.ShowClientContactsProximity==null) {//by maneesh ewm-18154
       this.ShowClientContactsProximity=0;
    }
    this.clientService.fetch(state, this.searchValue, this.IsProximitySearch,this.ProximitySearchResult?.Latitude,this.ProximitySearchResult?.Longitude,this.ProximitySearchResult?.Distance,this.ProximitySearchResult.Unit,this.ShowClientContactsProximity).pipe(
      takeUntil(this.destroySubject)
    ).subscribe((response: GridDataResult) => {
      this.data = response;
      this.selectedCandidate = [];
      this.totalContactCount = response.total;
      this.loading = false;
      this.loadingSearch = false;
    }, err => {
      this.loading = false;
      this.loadingscroll = false;
      this.message='label_Opration_failed';
      this.snackBService.showErrorSnackBar(this.translateService.instant(this.message),'');
    })
    // this.loading = false;
  }

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: mouseoverAnimation function

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: mouseoverAnimation function


  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }



  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: refreshComponent function

  refreshComponent() {
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);

  }


  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: fitColumns function


  public fitColumns(): void {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
    });
  }


  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: onFilter function



  public onFilter(): void {
    if (this.searchValue?.length > 0 && this.searchValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.state.skip = 0;
	  this.searchSubject$.next(this.searchValue);
  }

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: onSearchFilterClear function

  onSearchFilterClear(){
    this.searchValue = '';
    this.searchSubject$.next(this.searchValue);

  }

  reloadApiBasedOnorg() {
    this.getFilterConfig(false);
    //  this.getFolderListAll();
  }

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: showTooltip function

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('ng-star-inserted') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
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

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: openQuickAddContactModal function

  openQuickAddContactModal() {
    const dialogRef = this.dialog.open(QuickAddContactComponent, {
      data: new Object({ formType: "AddForm", showAddContact: true }),
      panelClass: ['xeople-modal-lg', 'quickAddContact', 'animate__animated', 'animate__zoomIn'],
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

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: getFilterConfig function

  getFilterConfig(loaderValue: boolean,proximityData:any=null) {
    this.loading = loaderValue;
    this.clientService.getfilterConfig(this.GridId).pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if(repsonsedata.Data!==null)
          {
            this.ProximityAddress=repsonsedata.Data?.Address;

             //Who:Ankit Rawat, What:EWM-16158 EWM-16311 retain Proximity, When:05March24
             if(proximityData!=null){
              this.ProximitySearchResult.Latitude=proximityData?.Latitude ?? 0;
              this.ProximitySearchResult.Longitude=proximityData?.Longitude ?? 0;
              this.ProximitySearchResult.Address=proximityData?.Address;
              this.ProximitySearchResult.Distance=proximityData?.Distance ?? 0;
            }
            else{
            this.ProximitySearchResult.Latitude=repsonsedata.Data?.Latitude ?? 0;
            this.ProximitySearchResult.Longitude=repsonsedata.Data?.Longitude ?? 0;
            this.ProximitySearchResult.Address=repsonsedata.Data?.Address;
            this.ProximitySearchResult.Distance=repsonsedata.Data?.Distance ?? 0;
            }
            if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
              this.IsProximitySearch=true;
            }
            this.colArr = repsonsedata.Data.GridConfig;
            this.ShowClientContactsProximity=repsonsedata.Data?.ShowClientContactsProximity;//by maneesh ewm-18154
            //Who:Ankit Rawat, What:EWM-16158 EWM-16311 set proximity value TRUE, When:05March24
            let proximityObject:any = this.colArr.find(obj => obj.Field === 'Proximity');
             if (proximityObject) {
              proximityObject.Grid = proximityObject.Selected = this.IsProximitySearch;
             }
              /*--@Who:Ankit Rawat,@When:07March24 @Why: EWM-16114,@what:Applied proximity sorting if proximity flag is ON--*/
            if(this.isOnInit){
              if(this.IsProximitySearch) {
                this.state.sort[0].field='Proximity';
                this.state.sort[0].dir = 'asc';
                this.sort[0].field='Proximity';
                this.sort[0].dir='asc';
              }
              }
              this.isOnInit=false;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            this.gridColConfigStatus = repsonsedata.Data.IsDefault;
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
              this.columnsWithAction = this.columns;
              this.columnsWithAction.splice(0, 0, {
                "Type": "Action",
                "Field": null,
                "Order": 0,
                "Title": null,
                "Selected": true,
                "Format": "{0:c}",
                "Locked": true,
                "width": "40px",
                "Alighment": null,
                "ColumnAlignment": "Left",
                "Grid": true,
                "Filter": false,
                "API": null,
                "APIKey": null,
                "Label": null
              });
              // End
            } else {
              this.columns = this.colArr;
              this.columnsWithAction = this.columns;
              this.columnsWithAction.splice(0, 0, {
                "Type": "Action",
                "Field": null,
                "Order": 0,
                "Title": null,
                "Selected": true,
                "Format": "{0:c}",
                "Locked": true,
                "width": "40px",
                "Alighment": null,
                "Grid": true,
                "ColumnAlignment": "Left",
                "Filter": false,
                "API": null,
                "APIKey": null,
                "Label": null
              });
              // End
            }
          }
          this.sendRequest(this.state);

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: openNewEmailModal function

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
      data: { 'contactEmail': true,'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, openDocumentPopUpFor: 'Contact', isBulkEmail: false,'candidateId':ContactId },
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

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: setConfiguration function

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
    gridConf['filterConfig'] = this.filterConfig;
    //Who:Ankit Rawat, What:EWM-16158 EWM-16311 set proximity data, When:05M- oarch24
    gridConf['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    gridConf['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    gridConf['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    gridConf['Address']=this.ProximitySearchResult?.Address;
    gridConf['ShowClientContactsProximity']=this.ShowClientContactsProximity;//by maneesh changes ewm-18154
    this.jobService.setfilterConfig(gridConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

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

  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: ngOnDestroy function

  ngOnDestroy() {
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            ?.filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }

    this.destroySubject.next();

  }
  public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;
  selectionChange(event:any){
    if(event?.length==1){
      this.selectedCandidate=event;
    }
  }
  getBulkSmsFlag(){
    if(!this.SMSCheckStatus && this.selectedCandidate==null ||this.selectedCandidate==undefined || this.selectedCandidate?.length==0){
      return true;
    }else{
      let checkStage = this.selectedCandidate != null && this.selectedCandidate?.filter(t=>t?.PhoneNo!='' && t?.PhoneNo!=null && t?.PhoneNo!=undefined);
      if(!this.SMSCheckStatus || checkStage?.length>0){
        return false;
      }{
        return true;
      }
    }
  }
  openJobBulkSMSForCantacts() {
    this.selectedCandidate.forEach(x => {
          x['PhoneNumber'] = x.PhoneNo;
          x['Name'] = x.FullName;
          x['CandidateId'] = x.ContactId;
      });
     const dialogRef = this.dialog.open(CandidateBulkSmsComponent,{
     data: new Object({selectedCandidates:this.selectedCandidate,UserType:this.UserType}),
     panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(res => {
     if (res != true) {
       this.loading = false;
       this.selectedCandidate=[];
     }else{
      this.selectedCandidate=[];
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

  smsHistoryDetails(can) {
    this.contactPhone=can?.PhoneNo; //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
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
      if(this.SMSHistory.length>0){
        this.smsHistoryDrawer.open();
        this.isSmsHistoryForm = true;
        this.contactId = can.ContactId;
        let dataItemObj = {};
    dataItemObj['PhoneNumber'] = can.PhoneNo;
    dataItemObj['Name'] = can.FullName;
    dataItemObj['CandidateId'] = can.ContactId;
    dataItemObj['PhoneCode'] = can.PhoneCode;
    can=dataItemObj;
         this.candidateDetails = can;
      }else{
        this.openJobSMSForCandidate(can)
      }
    }, 1500);
  }

  openJobSMSForCandidate(dataItem) {
    let dataItemObj = {};
    dataItemObj['PhoneNumber'] = dataItem.PhoneNo;
    dataItemObj['Name'] = dataItem.FullName;
    dataItemObj['CandidateId'] = dataItem.ContactId;
    dataItemObj['PhoneCode'] = dataItem.PhoneCode;
    dataItem=dataItemObj;
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
    this.systemSettingService.getSMSHistory('?Id='+this.contactId+'&UserType='+this.UserType).subscribe(
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

  toggleDrawer(start: any) {
    localStorage.removeItem('selectEmailTemp');
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
    start.toggle();
  }

  onBulkEmail(){
    this.toEmailList =  this.selectedCandidate.map(({ EmailId }) => ({ EmailId: EmailId }));
    this.loading = false;
    this.toEmailList =  this.toEmailList.filter(entry => entry.EmailId !== null);
    this.selectedCandidate =  this.selectedCandidate.filter(item => item.EmailId !== null);
    this.getAllEmailIdFromMappedJob(this.selectedCandidate);
    this.openMail(this.selectedCandidate, this.IsEmailConnected, true);
   }
   getAllEmailIdFromMappedJob(data){
    let arr = data;
    this.getAllEmailIdFormMappedJob = data?.map(function (el: { Email: any; }) { return el.Email; });
    this.getCandidateData = [];
    arr?.forEach(element => {
      this.getCandidateData.push({
       "ModuleType": "Jobs",
       "Id": element.ContactId,
       "EmailTo": element.EmailId
      })
    });
   this.getCandidateData.filter((value , index) =>{
     data.indexOf(value) === index
   })
 }
/***********  @Name: openMail @Who: Renu @When: 21-Nov-2021 @Why:EWM-15174 EWM-15186 @What: To open Mail ***********/
openMail(responseData: any, IsEmailConnected: number, isBulkEmail:boolean) {
 let subObj = {}
 const message = ``;
 const title = 'label_disabled';
 const subtitle = 'label_securitymfa';
 const dialogData = new ConfirmDialogModel(title, subtitle, message);
 const dialogRef = this.dialog.open(CandidateBulkEmailComponent, {
   maxWidth: "750px",
   width: "95%",
   height: "100%",
   maxHeight: "100%",
   data: { 'candidateres': responseData, 'IsEmailConnected': IsEmailConnected,
    'isBulkEmail': isBulkEmail,'toEmailList':this.toEmailList,'candiateDetails': this.getCandidateData,
    openDocumentPopUpFor:'Contact',multipleEmail: this.multipleEmail},
   panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
   disableClose: true,
 });
 dialogRef.afterClosed().subscribe(dialogResult => {
   this.multipleEmail = false;
   this.selectedCandidate=[];
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
  @Name: openProximitySearchDialog function
  @Who: Ankit Rawat
  @When: 04-March-2024
  @Why: EWM-16158 EWM-16311
  */
  openProximitySearchDialog() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ProximitySearchComponent, {
      panelClass: ['xeople-modal', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
      data: { 'proximitySearchData': this.ProximitySearchResult,contactPageProximityData:true,ShowClientContactsProximity:this.ShowClientContactsProximity,
        Address:this.ProximityAddress
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      this.ShowClientContactsProximity=res?.ShowClientContactsProximity;//by maneesh changes ewm-18154
      if(res.Action.toUpperCase()=='SEARCH'){
        this.ProximitySearchResult=res;
      }
      else if(res.Action.toUpperCase()=='DISMISS'){
        if(this.IsProximitySearch==false){
          this.ProximitySearchResult.Latitude=this.ProximitySearchResult.Longitude=0;
          this.ProximitySearchResult.Address='';
          this.ProximitySearchResult.Distance=0;
        }
      }
      if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
        this.IsProximitySearch=true;
        if(res.Action.toUpperCase()=='SEARCH') {
          this.setProximityData().then(() => {
            setTimeout(() => {
              this.state.sort[0].field='Proximity';
                this.state.sort[0].dir = 'asc';
                this.sort[0].field='Proximity';
                this.sort[0].dir='asc';
              this.getProximityData().then(() => {
              });
            }, 1000);
          });
        }
      }
      else  {
        this.IsProximitySearch=false;
      }
    })
    }

  //Who:Ankit Rawat, What:EWM-16158 EWM-16311 cleared Proximity search, When:04March24 -->
    onClearProximitySearch(): void {
      const message = `label_confirmDialog_Proximity`;
      const title = '';
      const subTitle = 'label_contact';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.IsProximitySearch=false;
          this.ProximitySearchResult.Latitude=this.ProximitySearchResult.Longitude=0;
          this.ProximitySearchResult.Address='';
          this.ProximitySearchResult.Distance=0;
          this.setProximityData().then(() => {
            setTimeout(() => {
                this.state.sort[0].field='FullName';
                this.state.sort[0].dir = 'asc';
                this.sort[0].field='FullName';
                this.sort[0].dir='asc';
              this.getProximityData(this.ProximitySearchResult).then(() => {
              });
            }, 1000);
          });
        }
      });
    }


    proximityConfiguration(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            ?.filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }
  }

  setProximityData() {
    return new Promise<void>((resolve) => {
      this.proximityConfiguration();
      resolve();
    });
  }


  getProximityData(proximityData:any=null) {
    return new Promise<void>((resolve) => {
        this.getFilterConfig(false,proximityData);
        resolve();
    });
  }

}
