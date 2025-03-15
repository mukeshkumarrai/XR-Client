/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job Category.compenent.ts
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1821.
  @What: Job Category.
 */

  import { Component, Inject, OnInit } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TranslateService } from '@ngx-translate/core';
  import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
  import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
  import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
  import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
  import { JobCategory } from '../../../shared/datamodels/job-category';
  import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
  import { DOCUMENT } from '@angular/common';
  import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
  import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
  import { fadeInRightBigAnimation } from 'angular-animations';
  import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-job-category',
  templateUrl: './job-category.component.html',
  styleUrls: ['./job-category.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class JobCategoryComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "JobCategory,asc";
  public sortedcolumnName: string = 'JobCategory';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public result: string = '';
  //public actionStatus: string = 'Add';
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  public viewMode: string;
  public isvisible: boolean =false;
  public maxCharacterLengthSubHead = 130;
  public gridView: any = [];
  public searchVal: string = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public auditParameter;
  public idJobCategory = '';
  public idName = '';
  public pageLabel : any = "label_jobCategory";
   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size
//   next: number = 0;
// listDataview: any[] = [];
animationVar: any;
public isCardMode:boolean = false;
public isListMode:boolean = true;
dirctionalLang;
searchSubject$ = new Subject<any>();
  jobCategoryData: Subscription;
   /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 21-June-2021
 @Why: EWM-1821/1823
 @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, @Inject(DOCUMENT) private _document: HTMLDocument,
    private translateService: TranslateService, private _jobCategoryService:JobService,private route: ActivatedRoute,private _systemSettingService:SystemSettingService) {
      // page option from config file
      this.pageOption = this.appSettingsService.pageOption;
      // page option from config file
      this.pageSize = this.appSettingsService.pagesize;
      this.auditParameter = encodeURIComponent('Job Category');

  }

  ngOnInit(): void {
  let URL = this.router.url;
  let URL_AS_LIST;
  if (URL.substring(0, URL.indexOf("?")) == '') {
    URL_AS_LIST = URL.split('/');
  } else {
    URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
  }
  this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
  this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
  this._sidebarService.activesubMenuObs.next('masterdata');
  let queryParams = this.route.snapshot.params.id;
  this.idJobCategory = decodeURIComponent(queryParams);
  if (this.idJobCategory == 'undefined') {
    this.idJobCategory = "";
  } else {
    this.idJobCategory = decodeURIComponent(queryParams);
  }
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.route.queryParams.subscribe((params)=>{
      if(params['viewModeData']!=undefined)
      {
        this.viewMode = params['viewModeData'];
        this.switchListMode(this.viewMode);
      }
    })

    this.jobCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory);
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
    this.loadingSearch = true;
    this.jobCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory);
   });
  }

  // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.jobCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory);
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
  @Name: jobCategoryList function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1821.
  @What: service call for get list for expertise data
  */
  jobCategoryList(pageSize, pageNo, sortingValue, searchVal,idName,idJobCategory) {
    this.loading = true;
    this.jobCategoryData=this._jobCategoryService.getJobCategoryAll(pageSize, pageNo, sortingValue, searchVal,idName,idJobCategory).subscribe(
      (repsonsedata: JobCategory) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          //this.reloadListData();
          //this.doNext();
         //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
        }else if(repsonsedata.HttpStatusCode === 204){
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
        }
         else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
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
  @Who: Nitin Bhati
  @When: 14-June-2021
  @Why: EWM-1831
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchJobCategoryMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
        //this.reloadListData();
        //this.doNext();
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
   @Name: fetchJobCategoryMoreRecord
   @Who: Nitin Bhati
   @When: 14-June-2021
   @Why: EWM-1823
   @What: To get more data from server on page scroll.
   */
   fetchJobCategoryMoreRecord(pagesize, pagneNo, sortingValue) {
    this._jobCategoryService.getJobCategoryAll(pagesize, pagneNo, sortingValue, this.searchVal,this.idName, this.idJobCategory).subscribe(
      (repsonsedata: JobCategory) => {
        if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
          //console.log(this.listData,uniqueUsers,"Data")
          this.gridView = this.listData;
          //this.reloadListData();
        //this.doNext();
       } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: switchListMode 
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1821/1823
  @What: To switch between card view to list view.
  */

  switchListMode(viewMode){
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
     }
   }

 /*@Type: File, <ts>
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: 1823
  @What: use for Searching record
   */ 
       //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
       onFilter(value)
       {
          if (value.length > 0 && value.length < 3) {
            return;
          }
          this.loadingSearch = true;
          this.pageNo=1;
         //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
         this.searchSubject$.next(value);
       }
       // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
       
  // public onFilter(inputValue: string): void {
  //   this.loading = false;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length <= 3) {
  //     this.loadingSearch = false;
  //     return;
  //   }
  //   this.pageNo = 1;
  //   this._jobCategoryService.getJobCategoryAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory).subscribe(
  //     (repsonsedata: JobCategory) => {
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
    @Name: DeleteJobcategoryInfo function
    @Who: Nitin Bhati
    @When: 21-June-2021
    @Why: EWM-1823
    @What: FOR DIALOG BOX confirmation
  */

    DeleteJobcategoryInfo(val,index): void {
    const message = 'label_titleDialogContent';
    const title = '';
    const subTitle = 'label_jobCategory';
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
        this._jobCategoryService.deleteJobCategoryById('?Id=' + val).subscribe(
          (data: JobCategory) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.searchVal='';
              //this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.jobCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory);
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


 /*
  @Type: File, <ts>
  @Name: short column
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1823
  @What: To short column on the basis of column name.
  */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this._jobCategoryService.getJobCategoryAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory).subscribe(
      (repsonsedata: JobCategory) => {
        if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
         // this.reloadListData();
          //this.doNext();
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
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
  this.jobCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idJobCategory);
}
  // reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // } 
  // doNext() {
  //   if (this.next < this.gridView.length) {
  //     this.listDataview.push(this.gridView[this.next++]);
  //   }
  // }



    /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the jobCategoryData API 
*/
ngOnDestroy(): void {
  this.jobCategoryData.unsubscribe();
 
 }
}
