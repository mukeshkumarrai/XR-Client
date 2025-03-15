/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job-workflows.component.ts
  @Who: Renu
  @When: 14-june-2021
  @Why: ROST-1871.
  @What: Job-workflow
 */

import { Component, OnInit } from '@angular/core';
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
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-job-workflows',
  templateUrl: './job-workflows.component.html',
  styleUrls: ['./job-workflows.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ]),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class JobWorkflowsComponent implements OnInit {

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
   public gridView: any = [];
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
   public pageLabel : any = "label_jobworkflow";
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
     public _sidebarService: SidebarService, private jobWorkflowService: JobService, private appSettingsService: AppSettingsService) {
     // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
     // page option from config file
     this.pageSize = this.appSettingsService.pagesize;
     this.auditParameter=encodeURIComponent('Job Workflows'); 
   }
 
   ngOnInit(): void {
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
     this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
     //this.statusList();
     setInterval(() => {
       this.canLoad = true;
       if (this.pendingLoad) {
         this.onScrollDown();
       }
     }, 2000);
     this.ascIcon = 'north';
     this.animationVar = ButtonTypes;
     //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
     this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
     this.loadingSearch = true;
     this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
   });
   }

   // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    
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

   fetchMoreRecord(pagesize, pagneNo, sortingValue) {
    this.loadingscroll=true;
    this.jobWorkflowService.getJobworkflowList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: jobWorkFlow) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;

          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.gridView = this.gridView.concat(nextgridView);
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loadingscroll=false;
          
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


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
 
   onScrollDown(ev?) {
     this.loadingscroll = true;
     if (this.canLoad) {
       this.canLoad = false;
       this.pendingLoad = false;
       if (this.totalDataCount > this.gridView.length) {
         this.pageNo = this.pageNo + 1;
          this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
       }
       else {
         this.loadingscroll = false;
       }
     } else {
       this.loadingscroll = false;
       this.pendingLoad = true;
     }
   }
 
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
  @Name: getWorkFlowList
  @Who: Renu
  @When: 19-june-2021
  @Why:EWM-1872
  @What: for listing job workflow
  */
 
   getWorkFlowList(pageSize, pageNo, sortingValue, searchVal) {
     this.loading = true;
     this.jobWorkFlowData=this.jobWorkflowService.getJobworkflowList(pageSize, pageNo, sortingValue, searchVal).subscribe(
       (repsonsedata: jobWorkFlow) => {
         if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
           this.loading = false;
           this.loadingSearch = false;
           this.gridView = repsonsedata.Data;
           
           this.totalDataCount = repsonsedata.TotalRecord;
          //  this.reloadListData();
          //  this.doNext();
             //  who:maneesh,what:ewm-12630 for apply debounce and handel 204 ,when:08/06/2023
            }else if(repsonsedata.HttpStatusCode === 204){
              this.loading = false;
              this.loadingSearch = false;
              this.gridView = repsonsedata.Data;
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
          //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
 onFilter(value){
 if (value.length > 0 && value.length < 3) {
  return;
 }
this.loadingSearch = true;
 this.pageNo = 1;
 //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
  this.searchSubject$.next(value);
 }
  // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
          
    // public onFilter(inputValue: string): void {
    //   this.loading = false;
    //   this.loadingSearch = true;
    //   if (inputValue.length > 0 && inputValue.length < 3) {
    //     this.loadingSearch = false;
    //     return;
    //   }
    //   this.pageNo = 1;
    //   this.jobWorkflowService.getJobworkflowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
    //     (repsonsedata: jobWorkFlow) => {
    //       if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
    //         this.loading = false;
    //         this.loadingSearch = false;
    //         this.gridView = repsonsedata.Data;
    //         //this.reloadListData();
    //         //this.doNext();
  
    //       } else {
  
    //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
    //         this.loading = false;
    //         this.loadingSearch = false;
    //       }
    //     }, err => {
    //       this.loading = false;
    //       this.loadingSearch = false;
    //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
    //     })
  
    // }
   /*
      @Type: File, <ts>
      @Name: onSort function
      @Who: Renu
      @When: 19-june-2021
      @Why:EWM-1871 EWM-1872
      @What: FOR sorting the data
    */
  
      onSort(columnName) {
       this.loading = true;
       this.sortedcolumnName = columnName;
       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
       this.ascIcon = 'north';
       this.descIcon = 'south';
       this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
       this.pageNo = 1;
       this.jobWorkflowService.getJobworkflowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
         (repsonsedata: jobWorkFlow) => {
           if (repsonsedata.HttpStatusCode === 200) {
             document.getElementById('contentdata').scrollTo(0, 0);
             this.loading = false;
             this.gridView = repsonsedata.Data;
            //  this.reloadListData();
            //  this.doNext();
           } else {
             this.loading = false;
             this.loadingscroll = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
   
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         });
     }
  
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
     const subTitle = 'label_jobworkflow';
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
         this.jobWorkflowService.deleteWorkflowById('?workflowId=' + val).subscribe(
           (data: jobWorkFlow) => {
             this.active = false;
             if (data.HttpStatusCode === 200) {
               this.pageNo = 1;
               this.viewMode=viewMode;
               this.searchVal='';
               this.listDataview.splice(index, 1);
               this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
             
               this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
 
   /**@what: for animation @by: renu on @date: 03/07/2021 */
   doNext() {
    if (this.next < this.gridView.length) {
      this.listDataview.push(this.gridView[this.next++]);
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
  this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
}

      /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the jobWorkFlowData API 
*/
ngOnDestroy(): void {
  this.jobWorkFlowData.unsubscribe();
 
 }
/* @Who: Renu @When: 09-04-2023 @Why:EWM-16594 EWM-16607 @What: toggle default workflow */
toggleVisibility(isDefaultValue: any, gridData) {
  if (gridData?.IsDefault === 1) {
    this.snackBService.showErrorSnackBar(this.translateService.instant('label_defaultJobWorkflowCannot'), '400');
    this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
      this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    }
  });
}

/* @Who: Renu @When: 09-04-2023 @Why:EWM-16594 EWM-16607 @What: update workflow for job workflow */
updateIsDefault(gridData){
  this.loading = true;
  this.jobWorkflowService.setDefaultWorkflow(gridData.Id).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.getWorkFlowList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
}
