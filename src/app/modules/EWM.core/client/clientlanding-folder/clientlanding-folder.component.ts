import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CandidateFolderService } from '../../shared/services/candidate/candidate-folder.service';
import { ManageCandidateFolderComponent } from '@app/modules/EWM-Candidate/candidate-folder/manage-candidate-folder/manage-candidate-folder.component';
import { ConfirmDialogModel } from '../../shared/quick-modal/quickpeople/quickpeople.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ClientfolderlistService } from '@app/shared/services/clientfolderlist.service';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from '@app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ClientFolderMaster } from '@app/shared/models/client-folder';
import { Userpreferences } from '@app/shared/models';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { AlertDialogComponent } from '@app/shared/modal/alert-dialog/alert-dialog.component';
import { ManageclientfolderComponent } from '../manageclientfolder/manageclientfolder.component';

@Component({
  selector: 'app-clientlanding-folder',
  templateUrl: './clientlanding-folder.component.html',
  styleUrls: ['./clientlanding-folder.component.scss']
})
export class ClientlandingFolderComponent implements OnInit {

  public pageNo: number = 1;
  public viewMode: string;
  public isvisible: boolean;
  public maxCharacterLengthSubHead = 130;
  public gridView: any = [];
  public searchVal = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public auditParameter;
  public idFolder = '';
  public idName = 'Id';
  pageLabel: any = "label_folder";
  public listDataview: any[] = [];
  userType;
  searchSubject$ = new Subject<any>();
  public folderId:number=0;
  public folderName:string;
  dirctionalLang;
  animationVar: any;
  public loading: boolean;
  public sortingValue: string ;
  private destroySubject: Subject<void> = new Subject();
  public datas: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200];
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'FolderName',
      dir: 'asc'
    }],
  };
  zoomPhoneCallRegistrationCode: string;
  zoomCheckStatus: boolean = false;
  public state: State;
  totalContactCount: number;
  searchvalue:any
  public createFolder:boolean=false;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public userpreferences: Userpreferences;

  constructor(public dialogRef: MatDialogRef<ClientlandingFolderComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, public ClientfolderlistService:ClientfolderlistService,
    private translateService: TranslateService, public _CandidateFolderService: CandidateFolderService,private appSettingsService: AppSettingsService,
    public _userpreferencesService: UserpreferencesService,) {
    this.userType=data?.userType;
    this.gridView = data?.folderList;
    this.listData = data?.folderList; 
    this.createFolder = data?.createFolder;  
    this.folderId = data?.folderId;
    this.folderName = data?.folderName;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    }
  ngOnInit(): void {
    this.state = { ...this.initialstate }
    this.datas= this.listData;
    this.sendRequest(this.state); 

    if (this.createFolder==true) {
       this.sendRequest(this.state); 
     }
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
       this.sendRequest(this.state);
       });
       this.animationVar = ButtonTypes;
  }
  refreshComponent() {
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);

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

  public sendRequest(state: State): void {
    this.pageNo = 1;
    this.loading = true;
    let queryString=this.ClientfolderlistService.ClientFolderQueryString(this.searchVal);
    this._CandidateFolderService.getClientFolderListAll(state,queryString).subscribe((response: GridDataResult) => {
        this.datas = response;                
        this.loading = false;
        this.loadingSearch = false;
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  clickFolderRouter(id,name) {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: id,name:name }); }, 200);
  }
  public onFilter(inputValue: string): void {
    this.searchVal = inputValue;
    if (inputValue?.length > 0 && inputValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.state.skip=0;
    this.searchSubject$.next(inputValue);
  }

  public onFilterClear(): void {
    this.searchVal='';
    this.sendRequest(this.state); 
  }

  openQuickAddFolderModal(id: any, tag: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ManageclientfolderComponent, {
      data: new Object({ editId: id, activityStatus: tag ,clientData:true
      }),
      panelClass: ['xeople-modal', 'add_folderManage','animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.sendRequest(this.state); 
      } else {
        this.loading = false;
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
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);
  }
  onDismiss(): void {

    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: this.folderId,name:this.folderName,cancel:true }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

  }

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
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



  openQuickEditFolderModal(id: any, tag: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ManageclientfolderComponent, {
      data: new Object({ editclientFoldrId: id, editClientFolder: true, }),
      panelClass: ['xeople-modal', 'add_folderManage','animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
        // who:maneesh,what:ewm-13207 for api calling issu when cancel PopupCloseEvent,when:21/07/2023
      if (res == true) {
        // this.loading = true;
        this.sendRequest(this.state);
      } else {
        this.loading = false;
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
  public result: string = '';

  DeleteFolderInfo(folderData: any): void {
    let folderObj = {};
    folderObj = folderData;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_folder';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = false;
      this.result = dialogResult;
      if (dialogResult == true) {
        this._CandidateFolderService.clientlistfolderDelete(folderObj).subscribe(
          (data: ClientFolderMaster) => {
            // this.active = false;
            if (data.HttpStatusCode === 200) {
              this.loading = false;
              this.pageNo = 1;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.sendRequest(this.state);
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }

  confirmDialog(){
    const message = `label_clientfolderAlertmessg`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData, isButtonShow: true},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
    dialogRef.afterClosed().subscribe(dialogResult => {
    })
    }
}
