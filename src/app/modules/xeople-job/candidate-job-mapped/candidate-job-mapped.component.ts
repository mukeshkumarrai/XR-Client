/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 28-Sept-2021
  @Why:EWM-2984/2980
  @What:  This page will be use for candidate job mapping Component ts file
*/
import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SIGWINCH } from 'constants';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { Subject } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { FilterDialogComponent } from '@app/modules/EWM.core/job/landingpage/filter-dialog/filter-dialog.component';


interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-candidate-job-mapped',
  templateUrl: './candidate-job-mapped.component.html',
  styleUrls: ['./candidate-job-mapped.component.scss']
})
export class CandidateJobMappedComponent implements OnInit {

  @Input() JobId:any;
  @Input() JobName:any;
  @Input() WorkflowId:any;
  @Input() WorkflowName:any;
  addForm: FormGroup;
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  public ascIcon: string;
  public descIcon: string;
  //public sortingValue: string = "Name,asc";
  public sortedcolumnName: string = 'Name';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public result: string = '';
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
  //public userpreferences: Userpreferences;
  next: number = 0;
  public menuId: string;
  public categoryData: any = [];
  public typeData: any = [];
  public listDataType: any = [];
  public listDataCategory: any = [];
  isStarActive: any = [];
  selectedList: any = [];
  public moduleId: string;
  public moduleName: string;
  public menuName: string;
  public typeId: number = 0;
  selectedType = null;
  selectedCategory = null;
  public filterCount: number = 0;
  public filterConfig: any;

  public GridId: any = 'grid002';
  public colArr: any = [];
  public columns: ColumnSetting[] = [];
  public sortingValue: string = "";
  public searchValue: string = "";
  public gridListData: any[];
  public pagesize;
  public pageSizeOptions;
  public pagneNo = 1;
  public positionMatDrawer: string = 'end';
 // public candidateId:string='be0bdf0a-0f9e-46a6-9f16-1e804f9024d6';
  public candidateId:any;
  public saveStatus = true;
  @Output() totalNotes = new EventEmitter();
  loaderStatus: number;
  public isAsignJob: boolean = false;
  @Output() childButtonEvent = new EventEmitter();
  private subjectKeyUpSearch = new Subject<any>();


  /*
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 29th-Sep-2021
    @Why: EWM-2984
    @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog,
     private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService, private jobService: JobService) {
    this.pageSize = this.appSettingsService.pagesize;
    
    this.addForm = this.fb.group({
      Id: [''],
      status: [''],
    });
  }
   ngOnInit(): void {
    /*  @Who: Renu @When: 01-Sep-2022 @Why: EWM-8596 EWM-8617 @What:Boolean param added to handle onload blank data to show*/
  /*start*/
    this.getFilterConfig(true);
 /*end*/
    /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-3899 (on initial label blank)*/
   // this.getCandidateJobMappedList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.JobId, this.filterConfig);
   
   // this.filterConfig=null;  
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });

      ///// for debounce time
      //  adarsh singh  EWM-6040 11-04-22 add debouncing

      this.subjectKeyUpSearch.pipe(debounceTime(1500),distinctUntilChanged()).subscribe((value)=>{
        this.getFilterData(value)
       })

  }

  

  getFilterConfig(param:boolean) {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }

            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected.length !== 0) {
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }
          this.loading = false;
          /*  @Who: Renu @When: 01-Sep-2022 @Why: EWM-8596 EWM-8617 @What:Boolean param added to handle onload blank data to show*/
          /*start*/
          if(param==false){
         this.getCandidateJobMappedList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.JobId, this.filterConfig);
          }
           /*end*/
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
@Type: File, <ts>
@Name: getCandidateJobMappedList function
@Who: Nitin Bhati
@When: 29th-Sep-2021
@Why: EWM-2980
@What: For getting the job list
*/
  getCandidateJobMappedList(pagesize, pagneNo, sortingValue, searchVal, JobId, JobFilter) {
    // if(this.loaderStatus===1){
    //   this.loading = false;
    // }else{
    //   this.loading = true;
    // }
   this.loading = true;
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['JobFilterParams'] = this.filterConfig;
    } else {
      jsonObj['JobFilterParams'] = [];
    }

    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['JobId'] = JobId;
    jsonObj['GridId'] = this.GridId;
    this.jobService.fetchCandidateJobMappedList(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          let gridListData1 = repsonsedata.Data;
           gridListData1.forEach(element => {
              element['IsSelected'] = 0;
          });
          this.gridListData=gridListData1;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
           this.gridListData = repsonsedata.Data;
         } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
   @Type: File, <ts>
   @Name: clickevent function
   @Who: Nitin Bhati
   @When: 29th-Sep-2021
   @Why: EWM-2980
   @What: call Get data.
  */
  clickevent(id, selected) {
    if (selected == 0) {
      this.isStarActive = 1;
     } else {
      this.isStarActive = 0;
    }
     let selectedArray = this.gridListData.filter(x => x['CandidateId'] == id);
    selectedArray.forEach(element => {
      element['IsSelected'] = this.isStarActive;
    });
    var item = this.gridListData.filter(x => x['IsSelected'] === 1);
     if(item.length===0){
     this.saveStatus=true;
    }else{
      this.saveStatus=false;
    }

  }
  
  /* 
     @Type: File, <ts>
     @Name: onSave function
     @Who: Nitin Bhati
     @When: 29th-Sep-2021
     @Why: EWM-2980
     @What: For saving candidate job mapping data
    */
  onSave(value) {
    this.loading = true;
    let updateObj = {};
    this.selectedList = [];
    this.selectedList = this.gridListData.filter(x => x['IsSelected'] == '1');
    updateObj['JobId'] = this.JobId;
    updateObj['JobName'] = this.JobName;
    updateObj['WorkflowId'] = this.WorkflowId;
    updateObj['WorkflowName'] = this.WorkflowName;
    const arr = [];
    for (let i = 0; i < this.selectedList.length; i++) {
      arr.push({
        'CandidateId': this.selectedList[i].CandidateId,
        'CandidateName': this.selectedList[i].Name
      })
    }
    updateObj['Candidates'] = arr;
    updateObj['PageName'] = 'Job Deatils Page';
    updateObj['BtnId'] = 'btnAssignCandidate';
    this.jobService.candidateNotMappedToJobCreate(updateObj).subscribe((
      repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        //this.getFilterConfig();
        //this.loaderStatus=1;
        this.totalNotes.emit(true);
        this.childButtonEvent.emit(false)
         this.loading = false;
         this.saveStatus = true;
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
@Type: File, <ts>
@Name: openFilterModalDialog function
@Who: Nitin Bhati
@When: 29th-Sep-2021
@Why: EWM-2980
@What: For opening filter  dialog box
*/

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });


    dialogRef.afterClosed().subscribe(res => {
      if (res != false && res.data?.length!==0) {
        this.loading = true;
        this.filterCount = res.data?.length;
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
        this.loading = true;
        let jsonObjFilter = {};
        this.filterConfig = filterParamArr;
        jsonObjFilter['JobFilterParams'] = filterParamArr;
        jsonObjFilter['search'] = this.searchValue;
        jsonObjFilter['PageNumber'] = this.pagneNo;
        jsonObjFilter['PageSize'] = this.pagesize;
        jsonObjFilter['OrderBy'] = this.sortingValue;
        jsonObjFilter['JobId'] = this.JobId;
        jsonObjFilter['GridId'] = this.GridId;
        this.filterConfig = filterParamArr;
        this.jobService.fetchCandidateJobMappedList(jsonObjFilter).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.loading = false;
              let gridListData1 = repsonsedata.Data;
              gridListData1.forEach(element => {
                element['IsSelected'] = 0;
            });
            this.gridListData=gridListData1;
          } else if(repsonsedata.HttpStatusCode === 204){
            this.loading = false;
            this.gridListData = repsonsedata.Data;
          } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      }
       if(res.data?.length==0){
      /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-3899 (on initial label blank)*/
      this.gridListData = null;
      this.filterCount = 0;
        /*  @Who: Renu @When: 01-Sep-2022 @Why: EWM-8596 EWM-8617 @What:Boolean param added to handle onload blank data to show*/
       /*start*/
      this.getFilterConfig(true);
      /*end*/
      }
    })
  }
  /*
      @Type: File, <ts>
      @Name: clearFilterData function
      @Who: Nitin Bhati
      @When: 29th-Sep-2021
      @Why: EWM-2980
      @What: FOR DIALOG BOX confirmation
    */
  clearFilterData(viewMode): void {
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
      this.result = dialogResult;
      if (dialogResult == true) {
      /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-3899 (on initial label blank)*/
         this.gridListData = null;
        // this.filterConfig = [];
         this.filterCount = 0;
           /*  @Who: Renu @When: 01-Sep-2022 @Why: EWM-8596 EWM-8617 @What:Boolean param added to handle onload blank data to show*/
          /*start*/
         this.getFilterConfig(true);
           /*end*/
        // this.filterConfig = null;
        // let JobFilter = [];
        // this.loading = true;
        // let jsonObjFilter = {};
        // jsonObjFilter['JobFilterParams'] = JobFilter;
        // jsonObjFilter['search'] = this.searchValue;
        // jsonObjFilter['PageNumber'] = this.pagneNo;
        // jsonObjFilter['PageSize'] = this.pagesize;
        // jsonObjFilter['OrderBy'] = this.sortingValue;
        // jsonObjFilter['JobId'] = this.JobId;
        // jsonObjFilter['GridId'] = this.GridId;
        // this.jobService.fetchCandidateJobMappedList(jsonObjFilter).subscribe(
        //   (repsonsedata: ResponceData) => {
        //     if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        //       this.loading = false;
        //       //this.gridListData = repsonsedata.Data;
        //       let gridListData1 = repsonsedata.Data;
        //       gridListData1.forEach(element => {
        //          element['IsSelected'] = 0;
        //      });
        //      this.gridListData=gridListData1;
        //    
        //      this.getFilterConfig();
        //    
        //      this.filterCount = 0;
        //     } else {
        //       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        //       this.loading = false;
        //     }
        //   }, err => {
        //     this.loading = false;
        //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        //   })

        // this.getJobList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.JobId,JobFilter);
        //  this.getFilterConfig();
      }
    });
  }

  /*
   @Name: onFilter function
   @Who: Nitin Bhati
   @When: 30-Sep-2021
   @Why: EWM-2980
   @What: use for Searching records
    */
   unScribeData:any;

  //  adarsh singh  EWM-6040 11-04-22
  public onFilter(inputValue: string): void {
    this.subjectKeyUpSearch.next(inputValue)
  }

 //  adarsh singh  EWM-6040 11-04-22 add debouncing
  getFilterData(inputValue){
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 2) {
      // this.loadingSearch = false;
      this.pageNo = 1;
      this.searchValue = inputValue;
      let jsonObj = {};
      if (this.filterConfig !== null) {
        jsonObj['JobFilterParams'] = this.filterConfig;
      } else {
        jsonObj['JobFilterParams'] = [];
      }
      jsonObj['search'] = inputValue;
      jsonObj['PageNumber'] = this.pagneNo;
      jsonObj['PageSize'] = this.pagesize;
      jsonObj['OrderBy'] = this.sortingValue;
      jsonObj['JobId'] = this.JobId;
      jsonObj['GridId'] = this.GridId;
   this.unScribeData =  this.jobService.fetchCandidateJobMappedList(jsonObj).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
                this.loadingSearch = false;
                let gridListData1 = repsonsedata.Data;
                gridListData1.forEach(element => {
                  element['IsSelected'] = 0;
              });
              this.gridListData=gridListData1;
            } else if(repsonsedata.HttpStatusCode === 204){
              this.loadingSearch = false;
              this.gridListData = repsonsedata.Data;
            }else if (repsonsedata.HttpStatusCode === 400) {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
            else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loadingSearch = false;
          }
        }, err => {
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
        })
    }
    else {
      this.loadingSearch = false;
      this.unScribeData.unsubscribe();
      this.gridListData = null;
    }
  }
  /*
  @Name: onFilterClear function
  @Who: Nitin
  @When: 30-Sep-2021
  @Why: EWM-2980
  @What: use Clear for Searching records
  */
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    this.searchValue='';
   // this.getFilterConfig();

   /*  @Who: Anup Singh @When: 21-Dec-2021 @Why: EWM-3842 EWM-3899 (on initial label blank)*/
  //  this.gridListData = null;
   this.getCandidateJobMappedList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.JobId, this.filterConfig);
  }
  /*
  @Name: sortName function
  @Who: Nitin
  @When: 30-Sep-2021
  @Why: EWM-2980
  @What: For showing shortname on image icon
  */
  sortName(fisrtName, lastName) {
    if(fisrtName|| lastName){

      const Name = fisrtName + " " + lastName;
  
      const ShortName1 = Name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
      
       let first= ShortName1.slice(0,1);
       let last=ShortName1.slice(-1);
       let ShortName = first.concat(last.toString());
   
      return ShortName.toUpperCase();
  
    }
  }


  public matDrawerBgClass;

    openDrawerWithBg(value,id){
      this.matDrawerBgClass = value;
      this.candidateId=id;
      //console.log("candidateId:",this.candidateId);
    }

    dirChange(res) {
      if (res == 'ltr') {
        this.positionMatDrawer = 'end';
      } else {
        this.positionMatDrawer = 'start';
      }
    }

}
