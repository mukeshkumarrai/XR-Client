/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
  @When: 19-oct-2021
  @Why:EWM-3039 EWM-3407
  @What:  This page will be use for asign job of candidate Component ts file
*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FilterDialogComponent } from 'src/app/modules/EWM.core/job/landingpage/filter-dialog/filter-dialog.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-asign-job',
  templateUrl: './asign-job.component.html',
  styleUrls: ['./asign-job.component.scss']
})
export class AsignJobComponent implements OnInit {

  public loading: boolean;
  public loadingSearch: boolean;
  public GridId: any = 'gridCJ003';
  public sortingValue: string = "";
  public searchValue: string = "";
  public searchVal: string = '';
  public gridListData: any[];
  public pageSize;
  public pagneNo = 1;
  public candidateId: any;
  public filterConfig: any[] = [];
  public colArr: any = [];
  public columns: ColumnSetting[] = [];

  isStarActive: any = [];
  selectedList: any = [];
  public saveStatus = true;
  public filterCount: number = 0;
  @Output() refreshgetjobApi = new EventEmitter();

  keyword = 'JobTitle';
  candidateJobSearchData: any = [];
  @Output() childButtonEvent = new EventEmitter();
  dirctionalLang;
  pageType:string;

  constructor(public dialog: MatDialog,
    private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService, private jobService: JobService) {
    this.pageSize = this.appSettingsService.pagesize;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.candidateId = value.CandidateId;
      this.pageType = value?.Type;
    });
    this.getJobMappedToCandidateAllForSerch();

   /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-4087 (on initial label blank)*/
   // this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
    this.filterConfig = null;
  }

  /*
@Type: File, <ts>
@Name: getFilterConfig function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  //  getFilterConfig() {
  //     this.loading = true;
  //     this.jobService.getfilterConfig(this.GridId).subscribe(
  //       (repsonsedata: ResponceData) => {
  //         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //           this.loading = false;
  //           let colArrSelected = [];
  //           if (repsonsedata.Data !== null) {
  //             this.colArr = repsonsedata.Data.GridConfig;
  //             this.filterConfig = repsonsedata.Data.FilterConfig;
  //             if (this.filterConfig !== null) {
  //               this.filterCount = this.filterConfig.length;
  //             } else {
  //               this.filterCount = 0;
  //             }

  //             if (repsonsedata.Data.GridConfig.length != 0) {
  //               colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
  //             }
  //             if (colArrSelected.length !== 0) {
  //               this.columns = colArrSelected;
  //             } else {
  //               this.columns = this.colArr;
  //             }
  //           }
  //           this.loading = false;
  //          this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
  //         } else {
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //           this.loading = false;
  //         }
  //       }, err => {
  //         this.loading = false;
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //       })
  //   }

  /*
@Type: File, <ts>
@Name: getJobNotMappedToCandidateAll function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039 EWM-3405
@What: For getting the job list 
*/
  getJobNotMappedToCandidateAll(pagesize, pagneNo, sortingValue, searchVal, candidateId, JobFilter, isclearfilter: boolean) {
    if (searchVal != undefined && searchVal != null && searchVal != '') {
      this.loading = false;
    } else {
      this.loading = true;
    }
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }

    jsonObj['GridId'] = this.GridId;
    jsonObj['CandidateId'] = candidateId;
    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    this.jobService.fetchJobNotMappedToCandidateAll(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          let gridListData1 = repsonsedata.Data;
          gridListData1.forEach(element => {
            element['IsSelected'] = 0;
          });
          this.gridListData = gridListData1;
          if (isclearfilter === true) {
            this.filterCount = 0;
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch = false;
          this.gridListData = repsonsedata.Data;
          if (isclearfilter === true) {
            this.filterCount = 0;
          }
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
    @Name: clickevent function
    @Who: Anup Singh
    @When: 20-oct-2021
    @Why: EWM-3039 EWM-3405
    @What: call Get data.
   */
  clickevent(value) {
    if (value?.IsSelected == 0) {
      this.isStarActive = 1;
    } else {
      this.isStarActive = 0;
    }
    let selectedArray = this.gridListData.filter(x => x['Id'] == value?.Id);   
    selectedArray.forEach(element => {
      element['IsSelected'] = this.isStarActive;
    });
    var item = this.gridListData.filter(x => x['IsSelected'] === 1);
    if (item.length === 0) {
      this.saveStatus = true;
    } else {
      this.saveStatus = false;
    }

  }


  /* 
     @Type: File, <ts>
     @Name: onSave function
     @Who: Anup Singh
     @When: 20-oct-2021
     @Why: EWM-3039 EWM-3405
     @What: For saving candidate job mapping data
    */
   
  onSave() {
    this.loading = true;
    
    let updateObj = {};
    this.selectedList = [];
    this.selectedList = this.gridListData.filter(x => x['IsSelected'] == '1');
    updateObj['CandidateId'] = this.candidateId;
    updateObj['CandidateName'] = this.selectedList[0]?.CandidateName;

    const arr = [];
    for (let i = 0; i < this.selectedList.length; i++) {
      arr.push({
        'JobId': this.selectedList[i].Id,
        'JobRefNo': this.selectedList[i].JobRefNo,
        'WorkflowId': this.selectedList[i].WorkflowId,
        // passing workflow name by Adarsh singh for EWM_9620 on 28-11-22
        'WorkflowName': this.selectedList[i].WorkflowName, 
        'JobTitle' : this.selectedList[i].JobTitle   //who:maneesh,what:pass JobTitle ,when:08/12/2023 
      })
    }
    updateObj['Jobs'] = arr;
    updateObj['PageName'] = "AssignJobToCandidate";
    updateObj['BtnId'] = "btnSave";
    this.jobService.JobMappedToCandidateCreate(updateObj).subscribe((
      repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        // this.getFilterConfig();
        //this.loaderStatus=1;
        this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
        this.refreshgetjobApi.emit(true);
        this.loading = false;
        this.saveStatus = true;
        this.childButtonEvent.emit(false)
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }


  /*
@Name: sortName function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039 EWM-3405
@What: For showing shortname on image icon
*/
  sortName(Name) {
    if (Name) {
      let finalNameArr = Name.split(' ').slice(0, 2);

      if (finalNameArr.length >= 2) {
        const Name = finalNameArr[0] + " " + finalNameArr[1];

        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');

        let first = ShortName1.slice(0, 1);
        let last = ShortName1.slice(-1);
        let ShortName = first.concat(last.toString());
        return ShortName.toUpperCase();

      } else {
        const ShortName1 = finalNameArr[0].split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let singleName = ShortName1.slice(0, 1);
        return singleName.toUpperCase();

      }
    }
  }


  /*
@Type: File, <ts>
@Name: openFilterModalDialog function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039 EWM-3405
@What: For opening filter  dialog box
*/

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data.length;
        let filterParamArr = [];
        res.data.forEach(element => {
          filterParamArr.push({
            'FilterValue': element.ParamValue,
            'ColumnName': element.filterParam.Field,
            'ColumnType': element.filterParam.Type,
            'FilterOption': element.condition,
            'FilterCondition': 'AND'
          })
        });
        this.filterConfig = filterParamArr;
        this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
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


  /*
    @Type: File, <ts>
    @Name: clearFilterData function
    @Who: Anup Singh
    @When: 20-oct-2021
    @Why: EWM-3039
    @What: FOR DIALOG BOX confirmation
  */
  clearFilterData(): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'jobdetails_AddCandidateToJob';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.filterConfig = [];
        this.filterCount=0;
      /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-4087 (on initial label blank)*/
      if(this.searchValue==undefined || this.searchValue==null || this.searchValue==''){
       this.gridListData= null;
      }else{
        this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, true);
      }
          
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
@Name: selectEventForSerch function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  selectEventForSerch(data) {
    let inputValue: string =  data.JobTitle;
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.searchValue = inputValue;
    this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
  }

  /*
 @Type: File, <ts>
 @Name: selectEventForSerch function
 @Who: Anup Singh
 @When: 20-oct-2021
 @Why: EWM-3039
 */
onChangeSearch(inputValue: string) {    
  this.loading = false;
  this.loadingSearch = true;
  if (inputValue.length > 0 && inputValue.length <= 2) {
    this.loadingSearch = false;
    return; }
  this.searchValue = inputValue;
  this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, inputValue, this.candidateId, this.filterConfig, false);
}

  /*
@Type: File, <ts>
@Name: selectEventForSerch function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  onClearSearch(data) {
    /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-4087 (on initial label blank)*/
    this.searchValue='';
   if(this.filterConfig==undefined || this.filterConfig==null || this.filterConfig.length==0){
      this.gridListData= null;
     }else{
      this.getJobNotMappedToCandidateAll(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
 }

  }

  /*
 @Type: File, <ts>
 @Name: selectEventForSerch function
 @Who: Anup Singh
 @When: 20-oct-2021
 @Why: EWM-3039
 */
  onFocused(e) {
    // do something
  }

  /*
  @Type: File, <ts>
  @Name: getJobMappedToCandidateAllForSerch function
  @Who: Anup Singh
  @When: 20-oct-2021
  @Why: EWM-3039 
  @What: For Job Mapped To Candidate All ForSerch
  */

  getJobMappedToCandidateAllForSerch() {
    this.loading = true;
    this.jobService.fetchJobMappedToCandidateAllForSerch("?search=" + '').subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.candidateJobSearchData = repsonsedata['Data'];
        }else if(repsonsedata['HttpStatusCode'] == '204'){
          this.loading = false;
          this.candidateJobSearchData = [];
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

}
