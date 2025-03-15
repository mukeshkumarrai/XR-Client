import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Router } from '@angular/router';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-datatable-sample',
  templateUrl: './datatable-sample.component.html',
  styleUrls: ['./datatable-sample.component.scss'],
})
export class DatatableSampleComponent implements OnInit {
  pagesize = 5;
  pagneNo = 1;
  totalLength;
  sortingValue: string = "Name asc";
  public searchValue:string="";
  public listView: any[];
  public listData: any[];
  displayedColumns = ['Id', 'Name', 'Description', 'Is_system_defined'];
  dataSource: MatTableDataSource<Data>;
  PageEvent:PageEvent;
  public sortDirection='asc';
  public sortDirectionValue='';
  searchVal1: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private systemSettingService:SystemSettingService,private snackBService:SnackBarService,
    public _sidebarService: SidebarService, private route: Router,private translateService: TranslateService) {
  }
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue); 
  }
/* 
  @Type: File, <ts>
  @Name: ngAfterViewInit function
  @Who: Nitin Bhati
  @When: 22-Jan-2021
  @Why: ROST-675
  @What: Set the paginator and sort after the view init since this component will, and be able to query its view for the initialized paginator and sort
*/
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 /* 
  @Type: File, <ts>
  @Name: userRoleList function
  @Who: Nitin Bhati
  @When: 22-Jan-2021
  @Why: ROST-675
  @What: service call for creating User Role data
*/
 userRoleList(pagesize,pagneNo,sortingValue,searchVal)
 {
   //this.loading=true;
   this.systemSettingService.fetchuserRoleList(pagesize,pagneNo,sortingValue,searchVal).subscribe(
     repsonsedata=>{     
       if(repsonsedata['HttpStatusCode']=='200')
       {
        // this.loading=false;
        this.dataSource=repsonsedata['Data'];
        this.pagneNo=repsonsedata['PageNumber'];
        this.pagesize=repsonsedata['PageSize'];
        this.totalLength=repsonsedata['TotalRecord'];
        this.dataSource.sort = this.sort;
        }else
       {
         this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata['HttpStatusCode']);
         //this.loading=false;
       }
     },err=>{
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
       //this.loading=false;
       })
 }
/* 
  @Type: File, <ts>
  @Name: sortData function
  @Who: Nitin Bhati
  @When: 22-Jan-2021
  @Why: ROST-675
  @What: For sorting Data
*/
 sortData(sort: Sort) {
   this.sortDirectionValue=sort.active;
   this.sortDirection=sort.direction;
   if(this.sortDirection==''){
     this.sortingValue='';
   }else{
    this.sortingValue=this.sortDirectionValue+' '+this.sortDirection;
   }
   this.systemSettingService.fetchuserRoleList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.dataSource = repsonsedata['Data'];
        }else
        {
          this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata['HttpStatusCode']);
          //this.loadingscroll = false;
        }
      }, err => {
        //this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
      })
}
/* 
  @Type: File, <ts>
  @Name: onPaginatorChange function
  @Who: Nitin Bhati
  @When: 22-Jan-2021
  @Why: ROST-675
  @What: For pagination Data
*/
 onPaginatorChange(event:PageEvent){
  let pagneNo=event.pageIndex;
  let pagesize=event.pageSize;
  pagneNo=pagneNo+1;
  this.systemSettingService.fetchuserRoleList(pagesize,pagneNo,this.sortingValue,this.searchValue).subscribe(
    repsonsedata=>{     
      if(repsonsedata['HttpStatusCode']=='200')
      {
       this.dataSource=repsonsedata['Data'];
       this.pagneNo=repsonsedata['PageNumber'];
       this.pagesize=repsonsedata['PageSize'];
       this.totalLength=repsonsedata['TotalRecord'];
     
     }else
      {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata['HttpStatusCode']);
      }
    },err=>{
       this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
      })
 }
/* 
  @Type: File, <ts>
  @Name: applyFilter function
  @Who: Nitin Bhati
  @When: 22-Jan-2021
  @Why: ROST-675
  @What: For Filter Data
*/
 applyFilter(filterValue: string) {
   filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  let numberOfCharacters = filterValue.length;
  this.pagneNo=1;
  let maxNumberOfCharacters = 3;
  if(numberOfCharacters<1 ||numberOfCharacters>3){
  if (numberOfCharacters > maxNumberOfCharacters) {
 this.systemSettingService.searchRoleList(filterValue).subscribe(
    repsonsedata=>{     
    this.dataSource=repsonsedata['Data'];
     },err=>{
    this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
    })
  }else{
   this.systemSettingService.fetchuserRoleList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue).subscribe(
     repsonsedata=>{     
      this.dataSource=repsonsedata['Data'];
      this.pagneNo=repsonsedata['PageNumber'];
      this.pagesize=repsonsedata['PageSize'];
      this.totalLength=repsonsedata['TotalRecord'];
      this.dataSource.sort = this.sort;
      },err=>{        
     this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
     })
    }
   }
 }

}


