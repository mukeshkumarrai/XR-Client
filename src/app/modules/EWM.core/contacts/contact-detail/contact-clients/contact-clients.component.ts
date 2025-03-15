import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent, GridDataResult, DataStateChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Userpreferences, ButtonTypes, ResponceData } from 'src/app/shared/models';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { ContactHeaderData } from 'src/app/shared/models/contact';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { NewEmailComponent } from '../../../shared/quick-modal/new-email/new-email.component';
import { QuickAddContactComponent } from '../../../shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { ClientService } from '../../../shared/services/client/client.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ManageClientContactComponent } from './manage-client-contact/manage-client-contact.component';
import { RouterData } from '@mainshared/enums/router.enum';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
@Component({
  selector: 'app-contact-clients',
  templateUrl: './contact-clients.component.html',
  styleUrls: ['./contact-clients.component.scss']
})
export class ContactClientsComponent implements OnInit {

  public ActiveMenu: string;
  public loading: boolean;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  public GridId: string = 'ContactsSummaryClientGrid_001';
  public sortingValue: string = "FullName,asc";
  public searchValue: string = "";
  public columns: ColumnSetting[] = [];
  public filterCount: number = 0;
  public colArr: any = [];
  public filterConfig: any;
  public sortDirection:string = 'asc';
  public userpreferences: Userpreferences;
  public loadingscroll: boolean;
  public viewMode: string = 'listMode';
  public totalDataCount: number;
  public loadingSearch: boolean;
  public searchVal: string = '';
  animationVar: any;
  searchSubject$ = new Subject<any>();
  dirctionalLang;
  gridColConfigStatus:boolean=false;
  loaderStatus: number;  
  public columnsWithAction: any[] = [];
  @ViewChild(GridComponent) public grid: GridComponent;
  totalContactCount:number;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  private destroySubject: Subject<void> = new Subject();
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200];
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'ClientName',
      dir: 'asc'
    }],
  };
  zoomPhoneCallRegistrationCode:string;
  zoomCheckStatus:boolean= false;
  public state:State;
  @Input() contactId: string;
  selectedClients: string[]=[];
  @Output() clientJobCount = new EventEmitter();
  @Input() contactHeaderData: ContactHeaderData;
  @Output() onSynchedClient = new EventEmitter();

  constructor(private clientService: ClientService,
    private snackBService: SnackBarService,
    private translateService: TranslateService,
    public dialog: MatDialog,public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService,private route: Router,
    public _sidebarService: SidebarService,private jobService: JobService,private commonserviceService: CommonserviceService,
    private ngZone: NgZone,) { 

     this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;  

    }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');
this.state={...this.initialstate}
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
       let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
        this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
   
  }
    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: dataStateChange function for kendogrid 

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);
}

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: sendRequest function to get the data 

public sendRequest(state: State): void {
  this.loading = true;
  this.clientService.fetchAssignedClientList(state,this.searchValue,this.contactId).pipe(
    takeUntil(this.destroySubject)
  ).subscribe((response: GridDataResult) => {
    this.data = response;
    this.totalContactCount=response.total;
    this.clientJobCount.emit(this.totalContactCount);
      this.loading = false;
      this.loadingSearch=false;
      this.selectedClients=[];//who:maneesh,what:ewm-14803 for change page then uncheck checkbox ,when:17/10/2023
  });
}

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: mouseoverAnimation function 

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: mouseoverAnimation function  


  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }



    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: refreshComponent function  

  refreshComponent(){
    this.state={...this.initialstate}
    this.sendRequest(this.state);

  }


    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: fitColumns function  


  public fitColumns(): void {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
    });
}


    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: onFilter function  
 


  public onFilter(): void {
    if (this.searchValue?.length > 0 && this.searchValue?.length <= 2) {
      this.loadingSearch = false;
      return;
      }
   this.state.skip=0;
   this.searchSubject$.next(this.searchValue);
  }

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: onSearchFilterClear function  

  onSearchFilterClear(){
    this.searchValue='';
    this.searchSubject$.next(this.searchValue);

  }

  reloadApiBasedOnorg() {
    this.getFilterConfig(false);
  //  this.getFolderListAll();
  }

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: showTooltip function  

    public showTooltip(e: MouseEvent): void {
      const element = e.target as HTMLElement;
      if (element.nodeName === 'TD') {
        var attrr = element.getAttribute('ng-reflect-logical-col-index');
        if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
          if (element.classList.contains('k-virtual-content') === true || element.classList.contains('ng-star-inserted') === true|| element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: openQuickAddContactModal function  

  openQuickAddContactModal() {  
    const dialogRef = this.dialog.open(QuickAddContactComponent, {
      data: new Object({ formType:"AddForm", showAddContact:true}),
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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: getFilterConfig function  

  getFilterConfig(loaderValue: boolean) {
    this.loading = loaderValue;
    this.clientService.getfilterConfig(this.GridId).pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Grid == true);
            }
             
            this.columns = this.colArr;
            this.columnsWithAction = this.columns;
          
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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: openNewEmailModal function  

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
      data: { 'res': responseData,'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'),'candidateMail': email,openDocumentPopUpFor:'Candidate',isBulkEmail:false },
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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: setConfiguration function  

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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: ngOnDestroy function  


  openManageClientContactModal() {  
    const dialogRef = this.dialog.open(ManageClientContactComponent, {
      data: new Object({contactId:this.contactId, contactName:this.contactHeaderData?.Name,totalClientcount:this.totalContactCount}),
      panelClass: ['xeople-modal-lg', 'quickAddClientContact', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.sendRequest(this.state);

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

  selectableSettings:SelectableSettings = {
    checkboxOnly: true,
  }

  delinkContact() {
     
    const message = ``;
    const title = '';
    const subTitle = 'Contacts_delinkclient';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      if (dialogResult == true) {
        let delink={};
        delink['Client']=this.selectedClients;
        delink['ContactId']=Number(this.contactId);
        this.clientService.delinkContact(delink).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.sendRequest(this.state);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } 
            this.selectedClients=[];
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
      this.loading = false;
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }	
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }


  ngOnDestroy(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            ?.filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig); 
    }
   
    this.destroySubject.next();
  
  }
  viewClientSummery(clientId){
    const baseUrl = window.location.origin;
    const router = RouterData.clientSummery;
    const url = baseUrl+router+"?clientId="+clientId;
     window.open(url, '_blank');
    }
    filteredData: any[] = [];
  selectionChange(event:any){
      let selectedClientsEvent=event;
      let filteredData = this.data?.data?.filter(item => selectedClientsEvent?.includes(item?.ClientId));
      this.selectedClients = filteredData?.filter(t => t?.ClientEOHId != null);
      if(filteredData?.length===this.selectedClients?.length){
        this.onSynchedClient.emit(this.selectedClients);
      }else{
        this.selectedClients=[];
        this.onSynchedClient.emit(this.selectedClients);
      }
    }

}
