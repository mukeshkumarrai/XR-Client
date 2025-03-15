/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job-sub-type.component.ts
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1826
  @What: Job-sub-type master
 */
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
//import { JobCommitment } from '../../../shared/datamodels/Job-commitment';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-job-sub-type-list',
  templateUrl: './job-sub-type-list.component.html',
  styleUrls: ['./job-sub-type-list.component.scss'],
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
export class JobSubTypeListComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "JobSubType,asc";
  public sortedcolumnName: string = 'JobSubType';
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
  public gridView: any = [];
  public searchVal: string = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public userpreferences: Userpreferences;
  public auditParameter: string;
  JobTypeId: any;
  jobTypeName: any;
  next: number = 0;
  listDataview: any[] = [];
   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size
  pageLabel:string='label_jobTypeHead,label_jobSubTypeHead'

  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;

  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1826
  @What: For injection of service class and other dependencies
  */

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router, private jobService: JobService,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, @Inject(DOCUMENT) private _document: HTMLDocument,
    private translateService: TranslateService, private systemSettingService: SystemSettingService, private route: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
      // page option from config file
      this.pageOption = this.appSettingsService.pageOption;
      // page option from config file
    this.pageSize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('Job Sub Type');
  }

  ngOnInit(): void {
    let URL = this.router.url;

    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
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
    this.route.queryParams.subscribe((params) => {
      if (params['V'] != undefined) {
        this.viewMode = params['V'];
        this.switchListMode(this.viewMode);
      }

    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.route.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.JobTypeId = params['id']
          localStorage.setItem('JobTypeId', this.JobTypeId);
          this.jobSubTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.JobTypeId);
        }
        this.jobTypeName = params['jobType']
      });
      this.animationVar = ButtonTypes;

  }

  redirect(){

  }
   // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.jobSubTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.JobTypeId);
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
  @Name: jobSubTypeList function
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
  @What: For showing the list of group data
  */

  jobSubTypeList(pageSize, pageNo, sortingValue, searchVal, jobTypeId) {
    this.loading = true;
    this.jobService.getJobSubTypeList(pageSize, pageNo, sortingValue, searchVal, jobTypeId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.jobTypeName = repsonsedata.Data[0].JobType;
          this.totalDataCount = repsonsedata.TotalRecord;          
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          this.loading = true;
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
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchJobSubTypeRecord(this.pageSize, this.pageNo, this.sortingValue);
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
   @Name: fetchJobSubTypeRecord
   @Who: Anup
   @When: 22-june-2021
   @Why: EWM-1738 EWM-1828
   @What: To get more data from server on page scroll.
   */

  fetchJobSubTypeRecord(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this.jobService.getJobSubTypeList(pagesize, pagneNo, sortingValue, this.searchVal, this.JobTypeId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
         // console.log(this.listData,uniqueUsers,"Data")
          this.gridView = this.listData;
          this.loadingscroll = false;         
          // this.reloadListData();
          // this.doNext();
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
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
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
  @Name: onFilter function
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
  @What: use for Searching records
   */
  public onFilter(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.jobService.getJobSubTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.JobTypeId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;         
          // this.reloadListData();
          // this.doNext();
        } else {

          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
    @Name: confirmDialog function
    @Who: Anup
    @When: 22-june-2021
    @Why: EWM-1738 EWM-1828
    @What: FOR DIALOG BOX confirmation
  */
  confirmDialog(val, viewMode,index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_jobSubType';
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
        this.loading = true;
        this.jobService.deleteJobSubTypeList('?Id=' + val + '&JobTypeId=' + this.JobTypeId).subscribe(
          (data: any) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.jobSubTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.JobTypeId);
              this.loading = false;
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.loading = false;
            }

          }, err => {

            this.loading = false;

            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }


  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Anup
    @When: 22-june-2021
    @Why: EWM-1738 EWM-1828
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
    this.jobService.getJobSubTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.JobTypeId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data;          
          // this.reloadListData();
          // this.doNext();
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

  // doNext() {
  //   // alert(this.gridData.length)
  //   if (this.next < this.listData.length) {
  //     //alert('go')
  //     this.listDataview.push(this.listData[this.next++]);
  //   }
  // }

  //  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  //  reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
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
    this.jobSubTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.JobTypeId);
  }


}
