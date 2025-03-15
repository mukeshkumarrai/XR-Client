/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 28-may-2023
  @Why: EWM-11569-EWM-11569
  @What:  This page will be use for assign contact Component ts file
*/

import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, GridComponent, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models/index'
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { CandidateService } from '../../../../services/candidates/candidate.service';
import { SystemSettingService } from '../../../../services/system-setting/system-setting.service';
import { contact } from 'src/app/shared/models';
import { JobService } from '../../../../services/Job/job.service';
@Component({
  selector: 'app-assign-contact',
  templateUrl: './assign-contact.component.html',
  styleUrls: ['./assign-contact.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class AssignContactComponent implements OnInit {

  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  public loading: boolean=false;
  public load:boolean=false;
  public pagesize ;
  public pagneNo = 1;
  GridId="ClientContacts_grid_001";
  public searchValue: string = "";
  public gridListDataModelList: contact;
  gridListData: any=[];
  public sortDirection = 'asc';
  public sortingValue: string = "FullName,asc";
  public sort: any[] = [{
    field: 'FullName',
    dir: 'asc'
  }];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public loadingscroll: boolean =false;
  public canLoad = false;
  public pendingLoad = false;
  public viewMode: string = 'listMode';
  public kendoLoading: boolean;
  @ViewChild(GridComponent)
  public totalDataCount: number;
  public searchVal: string = '';
  public loadingSearch: boolean;
  designationId = '';
  loaderStatus: number;
  scrolledValue: any;
  animationVar: any;
  pageOption: any;
  animationState = false;
  @Input() resetFormSubject: Subject<any> = new Subject<any>();
  searchSubject$ = new Subject<any>();
  PhoneNumber: any;
  public status: boolean;
  public candidateId: any=[];
  public positionMatDrawer: string = 'end';
  @ViewChild('activityAdd') public sidenav: MatSidenav;
  public allComplete: boolean = false;
  public filterValue: any;
  activeJobPipeline: number;
  public dirctionalLang: any;
  public userpreferences: Userpreferences;
  isFilter: boolean = false;
  clientId: any;
  ascIcon: string;
  public assignbtn:boolean=false;
  checks:boolean=false;
  descIcon: string;
  filterCount: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AssignContactComponent>,private routes: ActivatedRoute,
   private route: Router, public dialog: MatDialog, private candidateService: CandidateService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService, private jobService: JobService,
    public _sidebarService: SidebarService, public _userpreferencesService: UserpreferencesService,
    private commonserviceService: CommonserviceService,
    public systemSettingService: SystemSettingService) {
      this.clientId =this.data; 
    this.pageOption = this.appSettingsService.pageOption;
    this.pagesize = this.appSettingsService.pagesize;

  }

  ngOnInit(): void {
    this.ascIcon = 'north';
    this.clientId =this.data; 
    this.animationVar = ButtonTypes;
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];

    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]); 
    this.getCandidateList();
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
     this.loadingSearch = true;
     this.getCandidateList();
    }); 

  this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
   /* 
    @Type: File, <ts>
    @Name: onDismissEdit
    @Who: maneesh
    @When: 29-may-2023
    @Why: EWM-11569
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onDismissEdit(): void {
    document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
 
   /* 
    @Type: File, <ts>
    @Name: onFilter
    @Who: maneesh
    @When: 29-may-2023
    @Why: EWM-11569
    @What: Function will call when user search onFilter
  */
    public onFilter(inputValue: string): void {
      this.isFilter = true;
      this.checks=false;
     // this.loadingSearch = true;
      if (inputValue?.length > 0 && inputValue?.length < 3) {
        this.loadingSearch = false;
        return;
      }
      this.pagneNo = 1;
      this.searchSubject$.next(inputValue);
     
    
  
    }
       /* 
    @Type: File, <ts>
    @Name: onFilterClear
    @Who: maneesh
    @When: 29-may-2023
    @Why: EWM-11569
    @What: Function will call when user search onFilterClear
  */
    public onFilterClear(): void {
      this.loadingSearch = false;
      this.searchValue = '';      
      if (this.candidateId.length!=0) {
        this.assignbtn=false
      }else{
      this.assignbtn=true;
      }
      this.getCandidateList();
   
    }
   /*
  @Type: File, <ts>
  @Name: updateAllComplete function
  @Who: maneesh
  @When: 29-may-2023
  @Why: EWM-11569
*/
  onCheckField(isChecked, data) { 
    this.assignbtn=true;
    this.checks=isChecked.checked         
    if (this.checks == true) {
      this.candidateId.push(data?.Id)
      this.assignbtn=false;
      this.gridListData.forEach(element => { 
        if (element.Id == data.Id) {
          element.IsDefault = 1
        }
      });  
    }else if(this.checks==false){
      const index = this.candidateId?.indexOf(data?.Id);
      if (index >= 0) {
        this.candidateId?.splice(index, 1);
           this.gridListData.forEach(element => { 
        if (element.Id == data.Id) {
          element.IsDefault = 0
        }
      });
      }
  }
    if (this.candidateId?.length!=0) {
      this.assignbtn=false;
      }else{
      this.assignbtn=true;
      }
  }


  /* 
@Type: File, <ts>
@Name: animate delaAnimation function
@Who: maneesh
@When: 29-may-2023
@Why: EWM-29/05/2023
@What: creating animation
*/

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }

  /*
 @Type: File, <ts>
 @Name: getCandidateList function
 @Who: maneesh
 @When: 29-may-2023
 @Why: EWM-11569
 @What: For getting the candidate contact list
  */
  getCandidateList() {
    this.loading = true;
    this.assignbtn=true;
    this.animate();
    let ClientContact = {};
    ClientContact['ClientId'] = this.clientId.clientId;
    ClientContact['GridId'] = this.GridId;
    ClientContact['PageNumber'] = this.pagneNo;
    ClientContact['Search'] = this.searchValue;
    ClientContact['OrderBy'] = this.sortingValue;
    ClientContact['pagesize'] = this.pagesize;    
    this.systemSettingService.getClientContact(ClientContact).subscribe(
      (repsonsedata: ResponceData) => {
    this.checks=false;
  if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.kendoLoading = false;
          this.gridListDataModelList = repsonsedata.Data;
          this.candidateId=[]
          this.gridListData=this.gridListDataModelList;
          this.loadingSearch = false;
        } else {
          this.loading = false;
          this.loadingSearch = false;
        } 
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

   /*
 @Type: File, <ts>
 @Name: getCandidateList function
 @Who: maneesh
 @When: 29-may-2023
 @Why: EWM-11569
 @What: For getting the candidate contact list
  */
 getClientAssignContact() {
  this.loading = true;
  this.animate();
  let ClientContact = {};
  ClientContact['ClientId'] = this.clientId.clientId;
  ClientContact['Id'] = this.candidateId;
  this.systemSettingService.getClientAssignContact(ClientContact).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        this.kendoLoading = false;
        this.gridListDataModelList = repsonsedata.Data;
        this.loadingSearch = false;
        document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        // <!-- who:bantee,what:ewm.13153  On Assign contact any further details are not getting refreshed on tab and no notification triggers. ,when:04/08/2023 -->

        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.loadingSearch = false;
        document.getElementsByClassName("quickAddContact")[0].classList.remove("animate__fadeInDownBig")
        document.getElementsByClassName("quickAddContact")[0].classList.add("animate__fadeOutUpBig");
        setTimeout(() => { this.dialogRef.close(true); 
        }, 200);
      } 
    }, err => {
      this.loading = false;
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
  /*
 @Type: File, <ts>
 @Name: showTooltip function
 @Who: maneesh
 @When: 29-may-2023
 @Why:EWM-11569
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
@Name: pageChange
@Who: maneesh
@When: 31-jan-2023
@Why:EWM-11569
@What: for pageChange
*/ 
    public sortChange($event): void {
          // who:maneesh,what:ewm-16068 for no sorting  ownersfield,when:20/02/2024 
 console.log('$event[0].field',$event[0].field);       
    if ($event[0].field=='Owners') {
      this.sort=[];
    }
    if ($event[0].field!='Owners') {
      this.sortDirection = $event[0].dir;
      if (this.sortDirection == null || this.sortDirection == undefined) {
        this.sortDirection = 'asc';
      } else {
        this.sortingValue = $event[0].field + ',' + this.sortDirection;
      }
      this.getCandidateList();
    }
      // this.getCandidateList();
    }
  /*
@Type: File, <ts>
@Name: pageChange
@Who: maneesh
@When: 31-jan-2023
@Why:EWM-11569
@What: for pageChange
*/
  divScroll(e) {
    if (e.srcElement.scrollTop >= 20) {
      this.scrolledValue = e.isTrusted;
    } else {
      this.scrolledValue = false;
    }
  }

  /*
@Type: File, <ts>
@Name: pageChange
@Who: maneesh
@When: 31-jan-2023
@Why:EWM-11569
@What: for pageChange
*/
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }
  /*
@Type: File, <ts>
@Name: pageChange
@Who: maneesh
@When: 31-jan-2023
@Why:EWM-11569
@What: for pageChange
*/
public pageChange(event: PageChangeEvent): void {
  this.loadingscroll = true;
  if (this.totalDataCount > this.gridListData.length) {
    this.pagneNo = this.pagneNo + 1;
    this.getCandidateList();
  } else {
    this.loadingscroll = false;
  }

}
}
