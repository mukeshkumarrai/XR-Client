import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { CategoryFilterComponent } from 'src/app/modules/EWM.core/home/my-activity-list/category-filter/category-filter.component';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
@Component({
  selector: 'app-job-category-filter',
  templateUrl: './job-category-filter.component.html',
  styleUrls: ['./job-category-filter.component.scss']
})
export class JobCategoryFilterComponent implements OnInit {

  @Input() JobId:any;
  @Input() JobName:any;
  @Input() WorkflowId:any;
  @Input() WorkflowName:any;
  addForm: FormGroup;
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean=false;
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

  /*
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 29th-Sep-2021
    @Why: EWM-2984
    @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<CategoryFilterComponent>,
     private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,private _SystemSettingService: SystemSettingService,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService, 
    private jobService: JobService,private clientService: ClientService) {
    this.pageSize = this.appSettingsService.pagesize;
    
    this.addForm = this.fb.group({
      Id: [''],
      status: [''],
    });
  }
   ngOnInit(): void {
 
    this.getActivityCateogoryList(this.pageSize, this.pageNo,this.searchVal,false);
  }

   /*
   @Type: File, <ts>
   @Name: getActivityCateogoryList function
   @Who: Bantee Kumar
   @When: 7-july-2023
   @Why:EWM-11778 EWM-13014
   @What: getting my activity category list data
 */
   getActivityCateogoryList(pageSize,pageNo,searchVal,isSearch:boolean) {
     if(isSearch==true){
      this.loading = false;
     }else{
      this.loading = true;
     }
     let IsInterviewedCategory=1
    this._SystemSettingService.getActivityCategoryListForFilter(pageSize,pageNo,searchVal,IsInterviewedCategory).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 ) {
          this.loading = false;
          this.loadingSearch= false;
          if (repsonsedata.Data) {
            this.gridListData = repsonsedata.Data;
            this.gridListData.forEach(element => {
              element['IsSelected'] = 0;
          });
    
            }
        } else if(repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch= false;
           this.gridListData = repsonsedata.Data;
            if (repsonsedata.Data) {
            this.gridListData.forEach(element => {
              element['IsSelected'] = 0;
          });
    
            }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
   @Type: File, <ts>
   @Name: clickevent function
   @Who: Bantee kUmar
   @When: 7-july-2023
   @Why:EWM-11778 EWM-13014
   @What: call Get data.
  */
  clickevent(id, selected) {
    if (selected == 0) {
      this.isStarActive = 1;
     } else {
      this.isStarActive = 0;
    }
     let selectedArray = this.gridListData.filter(x => x['Id'] == id);
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
     @Who: Bantee Kumar
     @When: 7-july-2023
     @Why:EWM-11778 EWM-13014
     @What: For saving category id
    */
  onSave(value) {
    this.loading = true;
    let updateObj = [];
    this.selectedList = [];
    this.selectedList = this.gridListData.filter(x => x['IsSelected'] == '1');
    this.selectedList.forEach(element => {
      updateObj.push(element.Id);
    });
    document.getElementsByClassName("categoryFilter")[0].classList.remove("animate__zoomIn");
      document.getElementsByClassName("categoryFilter")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({'res':updateObj}); }, 200);
  }


 /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Bantee Kumar
@When: 7-july-2023
@Why:EWM-11778 EWM-13014
@What: For close popup
*/
    onDismiss(){
      document.getElementsByClassName("categoryFilter")[0].classList.remove("animate__zoomIn");
      document.getElementsByClassName("categoryFilter")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    }



 /*
@Type: File, <ts>
@Name: onFilter function
@Who: Bantee Kumar
@When: 7-july-2023
@Why:EWM-11778 EWM-13014
@What: For serch 
*/
  isFilter: boolean = false;
  public onFilter(inputValue: string): void {
    //this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.JobId, this.filterConfig
    //this.loading = false;
    this.isFilter = true;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.getActivityCateogoryList(this.pageSize, this.pageNo,inputValue,true);
  }

 /*
@Type: File, <ts>
@Name: onFilter function
@Who: Bantee Kumar
@When: 7-july-2023
@Why:EWM-11778 EWM-13014
@What: For clear serch 
*/
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.searchVal='';
    this.getActivityCateogoryList(this.pageSize, this.pageNo,this.searchVal,false);

  }

}
