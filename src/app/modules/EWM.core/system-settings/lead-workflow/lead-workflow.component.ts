/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: lead-workflow.component.ts
  @Who: Renu
  @When: 18-Dec-2024
  @Why: ROST-18938 EWM-18965
  @What: lead-workflow
 */

  import { Component, OnInit, ViewChild } from '@angular/core';
  import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MatDialog } from '@angular/material/dialog';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TranslateService } from '@ngx-translate/core';
  import { AppSettingsService } from '../../../../shared/services/app-settings.service';
  import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
  import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
  import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
  import { JobService } from '../../shared/services/Job/job.service';
  import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
  import { jobWorkFlow } from '../../shared/datamodels/jobworkflow';
  import { ResponceData } from 'src/app/shared/models';
  import { ButtonTypes } from 'src/app/shared/models';
  import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
  import { debounceTime, takeUntil } from 'rxjs/operators';
  import { Subject, Subscription } from 'rxjs';
import { LeadsService } from '../../shared/services/leads/leads.service';
import { leadWorkFlow } from '../../shared/datamodels/leadworkflow';
import { DataStateChangeEvent,GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-lead-workflow',
  templateUrl: './lead-workflow.component.html',
  styleUrls: ['./lead-workflow.component.scss']
})
export class LeadWorkflowComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
 
    public loading: boolean = false;
    public viewMode: string;
    public isvisible: boolean;
    public workFlowList: any = [];
    //for pagination and sorting
    public ascIcon: string;
    public descIcon: string;
    public sortingValue: string = "WorkflowName,asc";
    public sortedcolumnName: string = 'WorkflowName';
    public sortDirection = 'asc';
    public loadingscroll: boolean;
    public formtitle: string = 'grid';
    public canLoad = false;
    public pendingLoad = false;
    public pageNo: number = 1;
    public pageSize;
    public gridView: GridDataResult = { data: [], total: 0 };
    public searchVal: string = '';
    public totalDataCount: any;
    public ActiveMenu: string;
    public selectedSubMenu: string;
    public sideBarMenu: string;
    public loadingSearch: boolean;
    public result: string = '';
    public active = false;
    public auditParameter: string;
    public next: number = 0;
    public listDataview: any[] = [];
    public pageLabel : any = "label_MenuleadWorkflow";
    // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size
   animationVar: any;
   public isCardMode:boolean = false;
   public isListMode:boolean = true;
   dirctionalLang;
 searchSubject$ = new Subject<any>();
   jobWorkFlowData: Subscription;
     public state: State;
     private destroySubject: Subject<void> = new Subject();
     public initialstate: State = {
      skip: 0,
      take: 50,
      group: [],
      filter: { filters: [], logic: "and" },
      sort: [{
        field: 'WorkflowName',
        dir: 'asc'
      }],
    };
    public sizes = [];
     @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
    
    /*
    @Type: File, <ts>
    @Name: constructor function
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: For injection of service class and other dependencies
     */
  
    constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,public dialog: MatDialog,
      private route: Router, private commonserviceService: CommonserviceService, private snackBService: SnackBarService,
      public _sidebarService: SidebarService, private jobWorkflowService: JobService, private appSettingsService: AppSettingsService,
      private leadService: LeadsService) {
      // page option from config file
     this.pageOption = this.appSettingsService.pageOption;
      // page option from config file
      this.sizes = this.appSettingsService.pageSizeOptions;
      this.pageSize = this.appSettingsService.pagesize;
      this.initialstate.take=this.pageSize;
      this.auditParameter=encodeURIComponent('Lead Workflow'); 
    
    }
  
    ngOnInit(): void {
      this.state = { ...this.initialstate };
      let URL = this.route.url;
      let URL_AS_LIST = URL.split('/');
      this.ActiveMenu = URL_AS_LIST[3];
      this.sideBarMenu = this.ActiveMenu;
      this.selectedSubMenu = URL_AS_LIST[4];
      this._sidebarService.activesubMenuObs.next(this.selectedSubMenu);
      this._sidebarService.subManuGroup.next(this.sideBarMenu);     
     this._sidebarService.activesubMenuObs.next('masterdata');
      this._sidebarService.subManuGroupData.subscribe(value => {
        this.ActiveMenu = value;
      });
      this._sidebarService.activesubMenu.subscribe(value => {
        this.selectedSubMenu = value;
      });
      this.router.queryParams.subscribe((params)=>{
        if(params['V']!=undefined)
        {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
        
      })
      this.getLeadsList(this.state);
      //this.statusList();
  
      this.ascIcon = 'north';
      this.animationVar = ButtonTypes;
      //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getLeadsList(this.state);
    });
    }
 
    // refresh button onclick method by Piyush Singh
   refreshComponent(){
     this.pageNo=1;
     this.getLeadsList(this.state);
     
      }
 
        /* 
   @Type: File, <ts>
   @Name: animate delaAnimation function
   @Who: Amit Rajput
   @When: 19-Jan-2022
   @Why: EWM-4368 EWM-4526
   @What: creating animation
 */
 
 animate() {
   this.animationState = false;
   setTimeout(() => {
     this.animationState = true;
   }, 0);
 }
 delaAnimation(i:number){
   if(i<=25){
     return 0+i*80;
   }
   else{
     return 0;
   }
 }
  
    /*
    @Type: File, <ts>
    @Name: fetchMoreRecord
    @Who: Renu
    @When: 11-May-2021
    @Why: EWM-1538
    @What: To get more data from server on page scroll.
    */
 
  //   fetchMoreRecord(pagesize, pagneNo, sortingValue) {
  //    this.loadingscroll=true;
  //    this.jobWorkflowService.getJobworkflowList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
  //      (repsonsedata: jobWorkFlow) => {
  //        if (repsonsedata.HttpStatusCode === 200) {
  //          this.loading = false;
 
  //          let nextgridView: any = [];
  //          nextgridView = repsonsedata.Data;
  //          this.gridView = this.gridView.concat(nextgridView);
  //          this.totalDataCount = repsonsedata.TotalRecord;
  //          this.loadingscroll=false;
           
  //          // this.reloadListData();
  //          // this.doNext();
  //        } else {
  //          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //          this.loadingscroll = false;
  //          this.loading = false;
  //        }
  //      }, err => {
  //        this.loading = false;
  //        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //      })
  //  }
 
 
   mouseoverAnimation(matIconId, animationName) {
     let amin= localStorage.getItem('animation');
     if(Number(amin) !=0){
       document.getElementById(matIconId).classList.add(animationName);
     }
   }
   mouseleaveAnimation(matIconId, animationName) {
     document.getElementById(matIconId).classList.remove(animationName)
   }
 
    /*
    @Type: File, <ts>
    @Name: onScrollDown
    @Who: Renu
    @When: 21-May-2021
    @Why: EWM-1634
    @What: To add data on page scroll.
    */
  
    // onScrollDown(ev?) {
    //   this.loadingscroll = true;
    //   if (this.canLoad) {
    //     this.canLoad = false;
    //     this.pendingLoad = false;
    //     if (this.totalDataCount > this.gridView.length) {
    //       this.pageNo = this.pageNo + 1;
    //        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
    //     }
    //     else {
    //       this.loadingscroll = false;
    //     }
    //   } else {
    //     this.loadingscroll = false;
    //     this.pendingLoad = true;
    //   }
    // }
  
    /* 
     @Type: File, <ts>
     @Name: statusList function
     @Who: Renu
     @When: 14-June-2021
     @Why: ROST-1871
     @What: For status listing 
    */
    statusList() {
      this.commonserviceService.getStatusList().subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.workFlowList = repsonsedata.Data;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  
    /*
     @Type: File, <ts>
     @Name: switchListMode
     @Who: Renu
     @When: 15-june-2021
     @Why:EWM-1713 EWM-1817
     @What: To switch between card view to list view.
     */
  
    switchListMode(viewMode) {
      if (viewMode === 'cardMode') {
        this.isCardMode = true;
        this.isListMode = false;
        this.viewMode = "cardMode";
        this.isvisible = true;
        this.animate();
      } else {
        this.isCardMode = false;
        this.isListMode = true;
        this.viewMode = "listMode";
        this.isvisible = false;
        this.animate();
      }
    }
  
    /*
   @Type: File, <ts>
   @Name: getLeadsList
   @Who: Renu
   @When: 19-june-2021
   @Why:EWM-1872
   @What: for listing job workflow
   */
  
    getLeadsList(state:State) {
      this.loading = true;
     
      this.jobWorkFlowData=this.leadService.getLeadworkflowListInfo(state,this.searchVal).pipe(takeUntil(this.destroySubject)).subscribe(
        (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            this.loadingSearch = false;
            this.gridView = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
            this.totalDataCount = repsonsedata.TotalRecord;
             }else if(repsonsedata.HttpStatusCode === 204){
               this.loading = false;
               this.loadingSearch = false;
               this.gridView = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
             }else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loadingscroll = false;
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
     @Name: onFilter function
     @Who: Renu
     @When: 19-june-2021
     @Why:EWM-1871 EWM-1872
     @What: use for Searching records
      */
  onFilter(value){
  if (value.length > 0 && value.length < 3) {
   return;
  }
 this.loadingSearch = true;
  this.pageNo = 1;
  this.searchVal=value;
   this.searchSubject$.next(value);
  }
  
    /*
       @Type: File, <ts>
       @Name: onSort function
       @Who: Renu
       @When: 19-june-2021
       @Why:EWM-1871 EWM-1872
       @What: FOR sorting the data
     */
   
      //  onSort(columnName) {
      //   this.loading = true;
      //   this.sortedcolumnName = columnName;
      //   this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      //   this.ascIcon = 'north';
      //   this.descIcon = 'south';
      //   this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
      //   this.pageNo = 1;
      //   this.jobWorkflowService.getJobworkflowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      //     (repsonsedata: jobWorkFlow) => {
      //       if (repsonsedata.HttpStatusCode === 200) {
      //         document.getElementById('contentdata').scrollTo(0, 0);
      //         this.loading = false;
      //         this.gridView = repsonsedata.Data;
      //        //  this.reloadListData();
      //        //  this.doNext();
      //       } else {
      //         this.loading = false;
      //         this.loadingscroll = false;
      //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
    
      //       }
      //     }, err => {
      //       this.loading = false;
      //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      //     });
      // }
   
       /*
       @Type: File, <ts>
       @Name: confirmDialog function
       @Who: Anup
       @When: 15-june-2021
       @Why:EWM-1713 EWM-1817
       @What: FOR DIALOG BOX confirmation
     */
   
     confirmDialog(val,viewMode,index): void {
      const message = `label_titleDialogContent`;
      const title = '';
      const subTitle = 'label_MenuleadWorkflow';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        if (dialogResult == true) {
          this.leadService.deleteLeadflowById('?workflowId=' + val).subscribe(
            (data: jobWorkFlow) => {
              this.active = false;
              if (data.HttpStatusCode === 200) {
                this.pageNo = 1;
                this.viewMode=viewMode;
                this.searchVal='';
                this.listDataview.splice(index, 1);
                this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              
                this.getLeadsList(this.state);
              } else {
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              }
  
            }, err => {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
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
 
   
  /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
   reloadListData() {
     this.next=0;
     this.listDataview=[];
   }
 
   /*
 @Name: onFilterClear function
 @Who: Nitin Bhati
 @When: 19-Dec-2021
 @Why: EWM-2274
 @What: use Clear for Searching records
 */
 public onFilterClear(): void {
   this.searchVal='';
   this.getLeadsList(this.state);
 }
 
/* 
 @Name: ngOnDestroy
 @Who: Bantee
 @When: 19-Jun-2023
 @Why: EWM-10611.EWM-12747
 @What: to unsubscribe the jobWorkFlowData API 
 */
 ngOnDestroy(): void {
   this.destroySubject.unsubscribe();
  
  }
 /* @Who: Renu @When: 09-04-2023 @Why:EWM-16594 EWM-16607 @What: toggle default workflow */
 toggleVisibility(isDefaultValue: any, gridData) {
   if (gridData?.IsDefault === 1) {
     this.snackBService.showErrorSnackBar(this.translateService.instant('label_defaultJobWorkflowCannot'), '400');
     this.getLeadsList(this.state);
     return;
   }
   const message = 'label_titleDialogContentSiteDomain';
   const title = '';
   const subTitle = 'label_changeDefaultAppliction';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
     maxWidth: "355px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     if (dialogResult == true) {
        this.updateIsDefault( gridData);
     } else {
       this.getLeadsList(this.state);
     }
   });
 }
 
 /* @Who: Renu @When: 09-04-2023 @Why:EWM-16594 EWM-16607 @What: update workflow for job workflow */
 updateIsDefault(gridData){
   this.loading = true;
   this.leadService.setDefaultLeadWorkflow(gridData.Id).subscribe(
     (repsonsedata: any) => {
       if (repsonsedata.HttpStatusCode === 200) {
         this.loading = false;
         this.getLeadsList(this.state);
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         this.loading = false;
       }
     }, err => {
       this.loading = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     })
 }

  public onDataStateChange(state: DataStateChangeEvent): void {
     this.state = state;
     this.getLeadsList(state);
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
}
