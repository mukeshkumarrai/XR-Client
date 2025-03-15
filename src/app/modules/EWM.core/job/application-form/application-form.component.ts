/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: application-form.ts
  @Who: Adarsh singh
  @When: 13-05-2022
  @Why: EWM-6552 EWM-6673
*/

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { JobService } from '../../shared/services/Job/job.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class ApplicationFormComponent implements OnInit {
  loading: boolean;
  animationVar: any;
  animationState = false;
  pageOption: any;
  public pageSize;
  public loadingSearch: boolean;
  public pageNo: number = 1;
  public sortingValue: string = "Name,asc";
  public sortedcolumnName: string = 'Name';
  public sortDirection = 'asc';
  public searchVal: string = '';
  public idName = 'Id';
  public idWeightage = '';
  public gridViewList: any = [];
  public formtitle: string = 'grid';
  public viewMode: string;
  public isvisible: boolean;
  public auditParameter: string;
  public userpreferences: Userpreferences;
  loadingscroll= false;
  public ascIcon: string;
  public descIcon: string;
  isDefault;
  public canLoad = false;
  public pendingLoad = false;
  public totalDataCount: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;


  public pageLabel : any = "label_applicationForm";
  searchSubject$ = new Subject<any>();

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService,
    private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService, private jobService: JobService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.auditParameter = encodeURIComponent('Application Form');

  }


  ngOnInit(): void {
    this.animationVar = ButtonTypes;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';

    this.getApplicationFormAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, false);
         //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
         this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
          this.loadingSearch = true;
          this.getApplicationFormAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, false);
        });
  }


  /*
 @Type: File, <ts>
 @Name: getApplicationFormAll function
 @Who: Adarsh singh
 @When: 13-05-2022
@Why: EWM-6552 EWM-6673
 @What: For showing the list of formApplication data
*/

  getApplicationFormAll(pageSize, pageNo, sortingValue, searchVal,isScroll: boolean) {
    if (isScroll) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.jobService.getApplicationFormAllWithoutFilter(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {

          if (isScroll) {
            let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.gridViewList = this.gridViewList?.concat(nextgridView);
          }else{
            this.gridViewList = repsonsedata.Data;
          }
          
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.totalDataCount = repsonsedata.TotalRecord;
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
 @Type: File, <ts>
 @Name: updateApplicationForm function
 @Who: Adarsh singh
 @When: 13-05-2022
@Why: EWM-6552 EWM-6673
 @What: update isDefault toggle button
*/
  updateApplicationForm(isDefault, data) {
    this.loading = true;
    let fromObj = data;
    fromObj['Id'] = fromObj.Id;
    fromObj['Name'] = fromObj.Name;
    fromObj['CountryId'] = fromObj.CountryId;
    fromObj['CountryName'] = fromObj.CountryName;
    fromObj['IndustryId'] = fromObj.IndustryId;
    fromObj['LanguageCode'] = fromObj.LanguageCode;
    fromObj['QualificationId'] = fromObj.QualificationId;
    fromObj['JobTypeId'] = fromObj.JobTypeId;
    fromObj['IsDefault'] = isDefault;
    fromObj['StatusId'] = fromObj.StatusId;

    this.jobService.updateIsDefault(fromObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 400) {
          this.loading = false;
          this.pageNo = 1;
          this.jobService.getApplicationFormAllWithoutFilter(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
            (repsonsedata: ResponceData) => {
              if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                this.animate();
                this.loading = false;
                this.loadingSearch = false;
                this.loadingscroll = false;
                this.gridViewList =  repsonsedata.Data;
                
              } else {
                this.loading = false;
                this.loadingscroll = false;
                this.loadingSearch = false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              }
            }, err => {
              this.loading = false;
              this.loadingscroll = false;
              this.loadingSearch = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
        }
        else {
          this.loadingscroll = false;
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    )
  }

  /*
 @Type: File, <ts>
 @Name: toggleVisibility function
 @Who: Adarsh singh
 @When: 13-05-2022
@Why: EWM-6552 EWM-6673
 @What: on chnage toggle button
*/
// @When: 07-08-2024 @who:Amit @why: EWM-17819 @what: label change
  toggleVisibility(isDefaultValue: any, gridData) {
      const message = '';
      const title = '';
      const subTitle = 'label_applicationForm_defaultApplication';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "355px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.isDefault = 1;
          this.updateApplicationForm(this.isDefault, gridData);
        } else {
          this.pageNo = 1;
          this.jobService.getApplicationFormAllWithoutFilter(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
            (repsonsedata: ResponceData) => {
              if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                this.animate();
                this.loading = false;
                this.loadingSearch = false;
                this.loadingscroll = false;
                this.gridViewList = repsonsedata.Data;
              } else {
                this.loading = false;
                this.loadingscroll = false;
                this.loadingSearch = false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              }
            }, err => {
              this.loading = false;
              this.loadingscroll = false;
              this.loadingSearch = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
        }
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
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
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

  /**
  @(C): Entire Software
  @Type: switchListMode Function
   @Who: Adarsh singh
  @When: 13-05-2022
  @Why: EWM-6552 EWM-6673
  @What: This function responsible to change list and card view
 */

  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
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
      //listHeader.classList.remove("hide");
    }
  }

  /* 
   @Type: File, <ts>
   @Name: onFilter
    @Who: Adarsh singh
    @When: 13-05-2022
    @Why: EWM-6552 EWM-6673
   @What: For search value
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
  //   // this.loading = false;
  //   this.searchVal = inputValue;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length <= 2) {
  //     this.loadingSearch = false;
  //     return;
  //   }
    
  //   this.jobService.getApplicationFormAllWithoutFilter(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.animate();
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         this.loadingscroll = false;
  //         this.gridViewList = repsonsedata.Data;
  //       } else {
  //         this.loading = false;
  //         this.loadingscroll = false;
  //         this.loadingSearch = false;
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //       }
  //     }, err => {
  //       this.loading = false;
  //       this.loadingscroll = false;
  //       this.loadingSearch = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //     })

  // }

  /*
@Name: onFilterClear function
@Who: Adarsh singh
@When: 13-05-2022
@Why: EWM-6552 EWM-6673
@What: use Clear for Searching records
*/
  public onFilterClear(): void {
    this.searchVal = '';
    this.pageNo  = 1;
    this.getApplicationFormAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, false);

  }
  /*
  @Type: File, <ts>
  @Name: onSort function
  @Who: Adarsh singh
@When: 13-05-2022
@Why: EWM-6552 EWM-6673
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
    this.jobService.getApplicationFormAllWithoutFilter(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.gridViewList = repsonsedata.Data;
          this.loading = false;
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
  @Name: onScrollDown
  @Who: Adarsh singh
@When: 13-05-2022
@Why: EWM-6552 EWM-6673
  @What: To add data on page scroll.
  */

 onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.gridViewList.length) {
      this.pageNo = this.pageNo + 1;
      this.getApplicationFormAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, true);
    } else {
      this.loadingscroll = false;
    }
  } else {
    this.loadingscroll = false;
    this.pendingLoad = true;
  }
}

  /*
  @Type: File, <ts>
  @Name: refreshComponent function
  @Who: Adarsh singh
  @When: 13-05-2022
  @Why: EWM-6552 EWM-6673
  @What: FOR refresh the component
*/
  refreshComponent() {
    this.pageNo = 1;
    this.getApplicationFormAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, false);
  }
}
