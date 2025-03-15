/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: SubJobCategoryComponent.compenent.ts
  @Who: Nitin Bhati
  @When: 22-June-2021
  @Why: EWM-1823
  @What: sub Job Category.
 */
  import { Component, Inject, OnInit } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TranslateService } from '@ngx-translate/core';
  import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
  import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
  import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
  import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
  import { SubJobCategory } from '../../../../shared/datamodels/job-category';
  import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
  import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-sub-job-category',
  templateUrl: './sub-job-category.component.html',
  styleUrls: ['./sub-job-category.component.scss'],
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
            style({ opacity: 1, transform: "translateX(0)", offset: 0 }),
            style({ opacity: 1, transform: "translateX(-15px)", offset: 0.7 }),
            style({ opacity: 0, transform: "translateX(100%)", offset: 1.0 })
          ])
        )
      ])
    ]),
      fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})

export class SubJobCategoryComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public submitted = false;
  public loading: boolean;
  searchVal: string = '';
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "JobSubCategory,asc";
  public sortedcolumnName: string = 'JobSubCategory';
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
  public isvisible: boolean;
  public maxCharacterLengthSubHead = 130;
  public gridData: any =[];
  public JobCategoryId :string ;
  public totalDataCount: any;
  public jobcategoryName:any;
  public jobcategoryAutoId:any;
  anchorTagLength: any;
  public auditParameter;
  public listData: any = [];
  public gridView: any = [];
  public loadingSearch: boolean;
    // animate and scroll page size
    pageOption: any;
    animationState = false;
    // animate and scroll page size
    animationVar: any;
    public isCardMode:boolean = false;
    public isListMode:boolean = true;
public searchSubject$ = new Subject<any>();

  // next: number = 0;
  // listDataview: any[] = [];
  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 22-June-2021
 @Why: EWM-1823
 @What: For injection of service class and other dependencies
  */

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,public _sidebarService: SidebarService, private appSettingsService: AppSettingsService,
     private translateService: TranslateService,private _jobCategoryService:JobService) {
       // page option from config file
    this.pageSize = this.appSettingsService.pagesize;
    this.pageOption = this.appSettingsService.pageOption;
    this.auditParameter = encodeURIComponent('Job Sub Category');
    
  }

  ngOnInit(): void {
    let URL = this.router.url;
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
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';

    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {      
        this.JobCategoryId = params['id'];
        localStorage.setItem('JobCategoryId',this.JobCategoryId);
        this.subJobCategoryList(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
        }
      });
      
      this.route.queryParams.subscribe((params) => {     
        this.viewMode = params['viewModeData'];
         })
         this.switchListMode(this.viewMode);

         this.jobCategoryByIdForm();
         this.animationVar = ButtonTypes;
             //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.subJobCategoryList(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
    });
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
 
  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;
  }

  
  redirect(){
    this.router.navigate(['./client/core/administrators/masterdata']);
  }

  // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.subJobCategoryList(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
     }

/* 
  @Type: File, <ts>
  @Name: subJobCategoryList function
  @Who: Nitin Bhati
  @When: 22-June-2021
  @Why: EWM-1823
  @What: service call for get list for sub job category data
  */
  subJobCategoryList(JobCategoryId,pagesize, pagneNo, sortingValue,searchVal) {
    this.loading = true;
    this._jobCategoryService.getSubJobCategoryAll(JobCategoryId,pagesize, pagneNo, sortingValue,searchVal).subscribe(
      (repsonsedata: SubJobCategory)  => {
         if (repsonsedata.HttpStatusCode  == '200') {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.jobcategoryName=repsonsedata.Data[0].JobCategory;
          localStorage.setItem('jobcategoryname',this.jobcategoryName);//who:maneesh,what:ewm-15708 for patch job categry,when:06/01/2023
          this.jobcategoryAutoId=repsonsedata.Data[0].Id;
          //this.reloadListData();
          //.doNext();
        //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
      }else if(repsonsedata.HttpStatusCode === 204){
        this.loading = false;
        this.loadingSearch = false;
        this.gridView = repsonsedata.Data;
      }
         else {
         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;

        }
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
          this.loadingSearch = false;

        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.loadingSearch = false;

      })
  }

  /*
  @Type: File, <ts>
  @Name: onScrollDown 
  @Who: Nitin Bhati
  @When: 22-June-2021
  @Why: EWM-1823
  @What: To add data on page scroll.
  */
 onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchSubJobCategoryMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
   @Name: fetchSubJobCategoryMoreRecord
   @Who: Nitin Bhati
   @When: 22-June-2021
   @Why: EWM-1823
   @What: To get more data from server on page scroll.
   */

   fetchSubJobCategoryMoreRecord(pagesize, pagneNo, sortingValue) {
      this._jobCategoryService.getSubJobCategoryAll(this.JobCategoryId,pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: SubJobCategory) => {
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
  @When: 22-June-2021
  @Why: EWM-1823
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

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }
  

/*@Type: File, <ts>
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 22-June-2021
  @Why: EWM-1823
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
//   this._jobCategoryService.getSubJobCategoryAll(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
//     (repsonsedata: SubJobCategory) => {
//       if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
//         this.loading = false;
//         this.loadingSearch = false;
//         this.gridView = repsonsedata.Data;
//         this.listData = repsonsedata.Data;
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
//   }

  /*
    @Type: File, <ts>
    @Name: deleteSubJobCategoryInfo function
    @Who: Nitin Bhati
    @When: 22-June-2021
    @Why: ROST-1823
    @What: FOR DIALOG BOX confirmation
  */
    deleteSubJobCategoryInfo(val,index): void {
      const id = val;
      const message = 'label_titleDialogContent';
      const title = '';
      const subTitle = 'label_subJobCategory';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated','animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        if (dialogResult == true) {
          this._jobCategoryService.deleteSubJobCategoryById('?Id=' + id + '&JobCategoryId='+this.JobCategoryId).subscribe(
            (data: SubJobCategory) => {
              this.active = false;
              this.pageNo = 1;
              this.searchVal=''; 
              //this.listDataview.splice(index, 1); 
              if (data.HttpStatusCode = 200) {
                this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                this.subJobCategoryList(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
              }else  if(data.HttpStatusCode == 400) {             
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              } else {
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              }
             
            }, err => {
              if(err.StatusCode==undefined)
              {
                this.loading=false;
              }
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
        }
      });
    }
/*
  @Type: File, <ts>
  @Name: short column
  @Who: Nitin Bhati
  @When: 22-June-2021
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
  this._jobCategoryService.getSubJobCategoryAll(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue,this.searchVal).subscribe(
    (repsonsedata: SubJobCategory) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
        document.getElementById('contentdata').scrollTo(0, 0);
        this.loading = false;
        this.gridView = repsonsedata.Data;
        this.listData = repsonsedata.Data;
        this.totalDataCount = repsonsedata.TotalRecord;
        //this.reloadListData();
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
  @Type: File, <ts>
  @Name: jobCategoryByIdForm 
  @Who: Nitin Bhati
  @When: 22-June-2021
  @Why: EWM-1823
  @What: for showing details.
  */
jobCategoryByIdForm(){
  this.loading = true;
  this._jobCategoryService.getJobCategoryById('?Id=' + this.JobCategoryId).subscribe(
    (data: SubJobCategory) => {
      this.loading = false;
      if (data['HttpStatusCode'] == 200) { 
        this.jobcategoryName =  data.Data.JobCategory;    
        this.jobcategoryAutoId=data.Data.Id;  
      }else if (data['HttpStatusCode'] == 400) {  
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
       
      } else {       
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
       
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     
    })
}

// reloadListData() {
//   this.next=0;
//   this.listDataview=[];
// } 
// doNext() {
//   if (this.next < this.listData.length) {
//     this.listDataview.push(this.listData[this.next++]);
//   }
// }

/*
  @Name: onFilter function
  @Who: amit
  @When: 23-March-2022
  @Why: EWM-5656
  @What: use for Searching records
   */

  public onFilterClear(): void {
    this.searchVal='';
    this.subJobCategoryList(this.JobCategoryId,this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
  }

}
