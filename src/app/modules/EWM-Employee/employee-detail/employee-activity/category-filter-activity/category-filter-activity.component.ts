/*
  @Type: File, <ts>
  @Name: category-filter-activity.component.ts
  @Who: Nitin Bhati
  @When: 14-Jan-2022
  @Why: EWM-4545
  @What: popup component for job client category
  */
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
  import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
  import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
  import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
  import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';

  interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
@Component({
  selector: 'app-category-filter-activity',
  templateUrl: './category-filter-activity.component.html',
  styleUrls: ['./category-filter-activity.component.scss']
})
export class CategoryFilterActivityComponent implements OnInit {

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
  category: any;
  selectedArray:any=[]=[]
  /*
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 14-Jan-2022
    @Why: EWM-4545
    @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<CategoryFilterActivityComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
     private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,private _SystemSettingService: SystemSettingService,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService, 
    private jobService: JobService,private clientService: ClientService,) {
    this.pageSize = this.appSettingsService.pagesize;
    this.category = data.category;
    
    this.addForm = this.fb.group({
      Id: [''],
      status: [''],
    });
  }
   ngOnInit(): void {
   // this.getFilterConfig();
   // this.getActivityCateogoryList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.JobId, this.filterConfig);
    this.filterConfig=null;  

    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });
    this.getActivityCateogoryList();
  }

   /*
   @Type: File, <ts>
   @Name: getActivityCateogoryList function
   @Who: Nitin Bhati
   @When: 14-Jan-2022
   @Why: EWM-4545
   @What: getting activity category list data
 */
  
   getActivityCateogoryList() {
    this.loading = true;
    //let category='EMPL';
    this._SystemSettingService.getActivityCategoryListBySearch(this.category).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridListData = repsonsedata.Data;            
          //who:maneesh,what:ewm-15484 for patch data when edit search catogry,when:05/02/2024          
          if (this.data?.selectedOrDeSelected?.length > 0) {                        
            this.gridListData = this.data?.selectedOrDeSelected;
          }
          else{
               this.gridListData?.forEach(element => {
                  element['IsSelected'] = 0;
              });
          }
          let selectedArray = this.gridListData?.filter(x => x?.IsSelected == 1);
          if (  selectedArray?.length>0  ) {
           this.saveStatus=false;
          }
            }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

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
@When: 14-Jan-2022
@Why: EWM-4545
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
   @When: 14-Jan-2022
   @Why: EWM-4545
   @What: call Get data.
  */
  clickevent(id, selected) {
    let slType:number = 0; //who:maneesh,what:ewm-15427 for patch data when edit search catogry,when:24/01/2025
    if (selected == 0) {
      this.isStarActive = 1;
      slType = 1
     } else {
      this.isStarActive = 0;
      slType = 0
    }
    this.gridListData.forEach((ele) => { //who:maneesh,what:ewm-15427 for patch data when edit search catogry,when:024/01/2025
      if (ele['Id'] == id) {
        ele['IsSelected'] = slType;
      }
    })
     this.selectedArray = this.gridListData?.filter(x => x?.IsSelected==1);
    var item = this.gridListData?.filter(x => x['IsSelected'] === 1);
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
     @When: 14-Jan-2022
     @Why: EWM-4545
     @What: For saving candidate job mapping data
    */
  onSave(value) {
    this.loading = true;
    let updateObj = [];
    this.selectedList = [];
    this.selectedList = this.gridListData?.filter(x => x['IsSelected'] == '1'); 
    this.selectedList?.forEach(element => {
      updateObj.push(element?.Id);
    });
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn");
      document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({'res':updateObj,'selectedOrDeSelected': this.gridListData,}); }, 200);
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
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

    onDismiss(){
      var item = this.gridListData.filter(x => x['IsSelected'] === 1);
      if(item?.length===0){
      this.saveStatus=true;
     }else{
       this.saveStatus=false;
     }
      document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn");
      document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
    }

}
