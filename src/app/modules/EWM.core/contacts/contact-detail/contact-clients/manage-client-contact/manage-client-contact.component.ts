import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';


interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
} 

@Component({
  selector: 'app-manage-client-contact',
  templateUrl: './manage-client-contact.component.html',
  styleUrls: ['./manage-client-contact.component.scss']
})
export class ManageClientContactComponent implements OnInit {
public contactId:string;
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
selectableSettings:SelectableSettings = {
  enabled: true,
  checkboxOnly: true,
  mode: 'multiple'
}
zoomPhoneCallRegistrationCode:string;
zoomCheckStatus:boolean= false;

public state:State;
selectedClients: string[]=[];
contactName: string;

allComplete: boolean = false;
isAllSelected:boolean = false;
totalclientcount:string;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogdata: any,private clientService: ClientService,
    private snackBService: SnackBarService,
    private translateService: TranslateService,
    public dialog: MatDialog,public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService,
    public _sidebarService: SidebarService,private jobService: JobService,private commonserviceService: CommonserviceService,
    private ngZone: NgZone,public dialogRef: MatDialogRef<ManageClientContactComponent>) { 
  this.contactId=this.dialogdata?.contactId;
  this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;  
   this.contactName=this.dialogdata?.contactName;
   this.totalclientcount =this.dialogdata?.totalClientcount;
  }

  ngOnInit(): void {
  this.state = {...this.initialstate}

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


  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);
}

    // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: sendRequest function to get the data 

public sendRequest(state: State): void {
  this.loading = true;
  
  this.clientService.fetchAssignedClientList(state,this.searchValue,this.contactId,true).pipe(
    takeUntil(this.destroySubject)
  ).subscribe((response: GridDataResult) => {
    this.data = response;
    this.totalContactCount=response.total;
      this.loading = false;
      this.loadingSearch=false;
      this.allComplete = false;
      this.isAllSelected=false; //who:maneesh,what:ewm-14804 for enabel assign btn,when:17/10/2023
  });
}


updateAssignment(){
  let clientId = [];
  this.data.data.forEach((t) => {
    if (t?.Checked == 1) {
      clientId.push(t.ClientId)
    }
  });
  const title = '';
  let text;
     const message:string=''
     // @When: 28-04-2024 @who:Amit @why: EWM-15057 @what: totalclientcount condition show
    //  if(clientId?.length > 1){
    //   text =this.translateService.instant('Contacts_client_assignclients2');
    //  }else{
    //   text =this.translateService.instant('Contacts_client_assignclients1');
    //  }
     if(Number(this.totalclientcount)>1)
      text =this.translateService.instant('Contacts_client_assignclients2');
    else
    text =this.translateService.instant('Contacts_client_assignclients1');

     const subTitle = text.replace(/##count##/g, this.totalclientcount);
     const dialogData = new ConfirmDialogModel(title, subTitle, message);
     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
       maxWidth: "350px",
       data:{dialogData,WithoutQuestionMark:true} ,
       panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     });
     dialogRef.afterClosed().subscribe(dialogResult => {
	       if (dialogResult == true) {
  this.loading = true;
  let UpdateObj = {};
  // const selectedClientIds = this.selectedClients.map(x => x.ClientId);
  
  UpdateObj['Client'] = clientId;
  UpdateObj['ContactId'] = Number(this.contactId);

  this.clientService.updateAssignment(UpdateObj).subscribe(
    repsonsedata => {
      this.loading = false;
      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
        document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(true); }, 200);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
      } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);

      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}
})
 
}

selectionChange(event:any){
  this.selectedClients = event;
}

public selectedCallback = (args: { dataItem: {}; }) => args.dataItem['ClientId'];

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

  refreshComponent(){
    this.state={...this.initialstate}
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
        if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
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
    // @Who: Bantee Kumar,@Why:EWM-13723 ,@When: 12-09-2023,@What: getfilter config function  

    
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
           
              this.columns = colArrSelected;
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


  onDismiss(): void {
    document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
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
  
  ngOnDestroy(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
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


    /*
    @Type: File, <ts>
    @Name: setAll function
    @Who: Adarsh singh
     @When: 22-Sept-2023
  @Why: EWM-14356
    @What: to set all checked for show field for show
  */
  selectAll(completed: boolean) {
    if (completed) {
      this.allComplete = completed;
      if (this.data.data == null) return;
      this.data.data.forEach((t) => {
        t.Checked = 1
      });
    }
    else {
      this.data.data.forEach((t) => {
        t.Checked = 0
      });
    }
    this.isAllSelected = this.data.data.filter(t => t.Checked).length > 0;    
  }
/*
    @Name: onSingleSelect function
    @Who: Adarsh singh
     @When: 22-Sept-2023
    @Why: EWM-14356
    @What: on single select
*/
  onSingleSelect(isChecked, data) {
    if (isChecked) {
      this.data.data.forEach(element => {
        if (element.ClientId == data.ClientId) {
          element.Checked = 1
        }
      });
    }
    else {
      this.data.data.forEach(element => {
        if (element.ClientId == data.ClientId) {
          element.Checked = 0
        }
      });
    }
    this.updateAllComplete();
    this.isAllSelected = this.data?.data?.filter(t => t.Checked)?.length > 0;//who:maneesh,what:ewm-14803 for enabel assign btn,when:17/10/2023
  }
  
/*
    @Name: someComplete function
    @Who: Adarsh singh
     @When: 22-Sept-2023
    @Why: EWM-14356
    @What: if any select
*/
  someComplete(): boolean {
    if (this.data.data == null) {
      return;
    }
    return this.data.data.filter(t => t.Checked).length > 0 && !this.allComplete;
  }

/*
  @Name: updateAllComplete function
  @Who: Adarsh singh
  @When: 22-Sept-2023
  @Why: EWM-14356
  @What: update checked or unchecked checkbox for show
*/
  updateAllComplete() {  
    this.allComplete = this.data.data != null && this.data.data.every(t => t.Checked == 1);    
  }
}
