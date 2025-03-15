/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 31-jan-2023
  @Why: EWM-10305-EWM-9378
  @What:  This page will be use for xeople search assign job Component ts file
*/

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../../../modules/EWM.core/shared/services/Job/job.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service'
import { ResponceData } from '../../../../../shared/models';
import { CommonServiesService } from '../../../../../shared/services/common-servies.service'
import { FilterDialogComponent } from '../../../../../modules/EWM.core/job/landingpage/filter-dialog/filter-dialog.component'
import { UserpreferencesService } from '../../../../../shared/services/commonservice/userpreferences.service'
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../../shared/modal/confirm-dialog/confirm-dialog.component'
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-xeople-search-assign-job',
  templateUrl: './xeople-search-assign-job.component.html',
  styleUrls: ['./xeople-search-assign-job.component.scss']
})
export class XeopleSearchAssignJobComponent implements OnInit {

  public loading: boolean;
  public loadingSearch: boolean;
  public GridId: any = 'gridCJ003';
  public sortingValue: string = "";
  public searchValue: string = null;
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
  @Input() canidatedata: any;
  Email: any = []
  @Output() outputcanidatedata = new EventEmitter();
  xeopleSearchData:any=[];
  @Input() jobObj: { JobTitle: string; ClientName: string; };
  initialVal:string='';

  constructor(public dialog: MatDialog,
    private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService,
    private commonService: CommonserviceService,
     public _userpreferencesService: UserpreferencesService,
     private jobService: JobService) {
    this.pageSize = this.appSettingsService.pagesize;    
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((value) => {
      this.candidateId = value.CandidateId;
    });
    if(this.jobObj?.JobTitle && this.jobObj?.ClientName){
      this.getJobMappedToCandidateAllForSerch(this.jobObj?.JobTitle+', '+this.jobObj?.ClientName);
     this.initialVal=this.jobObj?.JobTitle+', '+this.jobObj?.ClientName;
    }else{
      this.getJobMappedToCandidateAllForSerch(''); 
      this.initialVal='';
    }
   
    this.filterConfig = null;
    this.Email = this.canidatedata;
    this.commonService.xeopleSearchServicedata.subscribe((data)=>{
      this.xeopleSearchData=data;    
      })
  }
  jobWithoutWorkflow(pagesize, pagneNo, sortingValue, searchVal, candidateId, JobFilter, isclearfilter: boolean) {
    //this.searchValue=null;
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
    //jsonObj['CandidateId'] = candidateId;
    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
     /*** @When: 18-01-2024 @Who:Renu @Why: EWM-15292 EWM-15720 @What: api changes to work workflow **/
    this.jobService.fetchJobNotMappedToCandidateAll(jsonObj).subscribe(

      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          let gridlistTemp = repsonsedata.Data;
          /*** @When: 20-09-2023 @Who:Renu @Why: EWM-14255 EWM-14421 @What: job assign pre fetch **/
          if(this.initialVal==''){
            gridlistTemp.forEach(element => {
              element['IsSelected'] = 0;
            });
            this.saveStatus = true;
          }else{
            gridlistTemp.forEach(element => {
              element['IsSelected'] = 1;
            });
            this.saveStatus = false;
          }
        
          this.gridListData = gridlistTemp;
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
    @Who: maneesh
    @When: 31-jan-2023
    @Why: EWM-10305-EWM-9378
    @What: call Get data.
   */
  clickevent(value) {
    if (value?.IsSelected == 0) {
      this.isStarActive = 1;
    } else {
      // this.Filter=true
      
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
     @Who: maneesh
     @When: 31-jan-2023
     @Why: EWM-10305-EWM-9378
     @What: For saving candidate job mapping data
    */

  onSave() {
    this.loading = true;
    let updateObj = {};
    this.selectedList = [];
    this.selectedList = this.gridListData.filter(x => x['IsSelected'] == '1');
    const arr = [];
    for (let i = 0; i < this.selectedList.length; i++) {
      arr.push({
        'JobId': this.selectedList[i].Id,
        "JobName": this.selectedList[i].JobTitle,
        'JobRefNo': this.selectedList[i].JobRefNo,
        'WorkflowId': this.selectedList[i].WorkflowId,
        'WorkflowName': this.selectedList[i].WorkflowName,
      })
    }
    updateObj['JobIds'] = arr;
    updateObj['Candidates'] = this.xeopleSearchData;
    updateObj['PageName'] = "AssignJobToCandidate";
    updateObj['BtnId'] = "btnSave";
    this.jobService.CandidateMappedJobAsignJob(updateObj).subscribe((
      repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        // this.jobWithoutWorkflow(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
        this.refreshgetjobApi.emit(true);
        this.loading = false;        
        this.saveStatus = true;
        this.childButtonEvent.emit(false)
        // this.outputcanidatedata.emit(true)
         this.commonService.xeopleSearchAssign.next(true);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString()); /**@When:09-10-2023 @Who:Renu @What: EWM-14145 EWM-14562 @Why: to show sucess msg */
        
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
@Who: maneesh
@When: 31-jan-2023
@Why: EWM-10305-EWM-9378
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
@Who: maneesh
@When: 31-jan-2023
@Why: EWM-10305-EWM-9378
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
        this.jobWithoutWorkflow(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
      }
    })
  }


  /*
    @Type: File, <ts>
    @Name: clearFilterData function
    @Who: maneesh
    @When: 31-jan-2023
    @Why: EWM-10305-EWM-9378
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
        this.filterConfig = null;
        this.saveStatus=false;
        this.filterCount = 0;
      
        this.jobWithoutWorkflow(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, true);
      }
    });
  }

  /*
@Type: File, <ts>
@Name: selectEventForSerch function
@Who: maneesh
@When: 31-jan-2023
@Why: EWM-10305-EWM-9378
*/
  selectEventForSerch(data) {
    let inputValue: string = data.JobTitle?data.JobTitle:data;
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.searchValue = inputValue;    
    this.jobWithoutWorkflow(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
  }

  /*
  @Type: File, <ts>
  @Name: onChangeSearch function
  @Who: maneesh
  @When: 31-jan-2023
  @Why: EWM-10305-EWM-9378
 */
  onChangeSearch(inputValue: string) {
     /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10970 EWM-11002 @What: job assign search not working as passing wrng data **/
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return; }
    this.searchValue = inputValue;
    this.jobWithoutWorkflow(this.pageSize, this.pagneNo, this.sortingValue, inputValue, this.candidateId, this.filterConfig, false);
  
  }

  /*
@Type: File, <ts>
@Name: onClearSearch function
  @Who: maneesh
  @When: 31-jan-2023
  @Why: EWM-10305-EWM-9378
*/
  onClearSearch(data) { 
    this.searchValue = '';    
    if (this.filterConfig == undefined || this.filterConfig == null || this.filterConfig.length == 0) {
      this.gridListData = null;
      this.getJobMappedToCandidateAllForSerch(''); 
      this.initialVal='';
    } else {
      this.initialVal='';
      this.jobWithoutWorkflow(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.candidateId, this.filterConfig, false);
    }

  }


  /*
  @Type: File, <ts>
  @Name: getJobMappedToCandidateAllForSerch function
  @Who: maneesh
  @When: 31-jan-2023
  @Why: EWM-10305-EWM-9378 
  @What: For Job Mapped To Candidate All ForSerch
  */

  getJobMappedToCandidateAllForSerch(defaultJob:string) {
    this.loading = true;
    this.jobService.fetchJobMappedToCandidateAllForSerch("?search=" + encodeURIComponent(defaultJob)).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.candidateJobSearchData = repsonsedata['Data'];          
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

