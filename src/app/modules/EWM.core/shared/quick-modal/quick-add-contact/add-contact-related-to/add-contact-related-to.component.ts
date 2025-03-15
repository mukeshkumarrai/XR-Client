import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FilterDialogComponent } from '../../../../job/landingpage/filter-dialog/filter-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from '../../../../../../shared/models';
import { CommonserviceService } from '../../../../../../shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from '../../../../../../shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from '../../../../../../shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../services/Job/job.service';
import { ProfileInfoService } from '../../../services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
import { Router } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-add-contact-related-to',
  templateUrl: './add-contact-related-to.component.html',
  styleUrls: ['./add-contact-related-to.component.scss']
})
export class AddContactRelatedToComponent implements OnInit {
  public canLoad = false;
  public pendingLoad = false;
  addContactForm: FormGroup;
  public loadingscroll: boolean;
  gridListData1 = [];
  public loading: boolean;
  public loadingSearch: boolean;
  public GridId: any = 'ContactRelatedTo_grid_001';
  public sortingValue: string = "";
  public searchValue: string = "";
  public searchVal: string = '';
  public gridListData: any[];
  public pageSize;
  public pagneNo = 1;
  public candidateId: any = 'eafc968a-d825-4d8e-b80e-b47458e3b245';
  public filterConfig: any[] = [];
  public colArr: any = [];
  public columns: ColumnSetting[] = [];

  isStarActive: any = [];
  selectedList: any = [];
  public saveStatus = true;
  public filterCount: number = 0;
  @Output() refreshgetjobApi = new EventEmitter();

  keyword = 'JobTitle';
  totalDataCount: number; 

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddContactRelatedToComponent>,
    private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService,private _appSetting: AppSettingsService) {
      this.pageSize = this._appSetting.pagesize;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    //console.log(this.data.Id,"Id")
    this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false,false);

    this.filterConfig = null;
  }



  /* 
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup Singh
  @When: 26-Nov-2021
  @Why: EWM-3700 
  @What: for close popup.
*/
  onDismiss(): void {
    document.getElementsByClassName("AddContactRelatedTo")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddContactRelatedTo")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: false }); }, 200);
  }


  /*
@Type: File, <ts>
@Name: getFilterConfig function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  // getFilterConfig() {
  //   this.loading = true;
  //   this.jobService.getfilterConfig(this.GridId).subscribe(
  //     (repsonsedata: any) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.loading = false;
  //         let colArrSelected = [];
  //         if (repsonsedata.Data !== null) {
  //           this.colArr = repsonsedata.Data.GridConfig;
  //           this.filterConfig = repsonsedata.Data.FilterConfig;
  //           if (this.filterConfig !== null) {
  //             this.filterCount = this.filterConfig.length;
  //           } else {
  //             this.filterCount = 0;
  //           }

  //           if (repsonsedata.Data.GridConfig.length != 0) {
  //             colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
  //           }
  //           if (colArrSelected.length !== 0) {
  //             this.columns = colArrSelected;
  //           } else {
  //             this.columns = this.colArr;
  //           }
  //         }
  //         this.loading = false;
  //        this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false);
  //       } else {
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //         this.loading = false;
  //       }
  //     }, err => {
  //       this.loading = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //     })
  // }

  /*
  @Type: File, <ts>
  @Name: getContactRelatedClientall function
  @Who: Anup Singh
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: For getting the contact related list 
  */
  getContactRelatedClientall(pagesize, pagneNo, sortingValue, searchVal, JobFilter, isclearfilter: boolean,isScroll:boolean) {
    if (searchVal != undefined && searchVal != null && searchVal != '') {
      this.loading = false;
    } else if(isScroll==true) {
      this.loading = false;
    }else {
      this.loading = true;
    }
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }

    jsonObj['GridId'] = this.GridId;
    if(this.data?.clientId!=undefined && this.data?.clientId!=null && this.data?.clientId!=''){
      jsonObj['ClientId'] = this.data?.clientId;
    }else{
      jsonObj['ClientId'] = '00000000-0000-0000-0000-000000000000'
    }
    jsonObj['Search'] = searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;

    this.systemSettingService.fetchContactRelatedClientall(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
        if (isScroll === true) {
            this.loading = false;
            let nextgridView = [];
            nextgridView = repsonsedata.Data;
            //this.gridListData1;
             this.gridListData1 = this.gridListData1.concat(nextgridView);
             this.gridListData1.forEach(element => {
              element['IsSelected'] = 0;
            });
            this.gridListData = this.gridListData1;
            this.loadingscroll = false;
          } else {
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
          }
          this.totalDataCount = repsonsedata.TotalRecord;
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
          if (isclearfilter === true) {
            //  this.filterCount = 0;
          }
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        if (isclearfilter === true) {
          //  this.filterCount = 0;
        }

      })
  }



  /*
  @Type: File, <ts>
  @Name: clickevent function
  @Who: Anup Singh
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: call Get data.
   */
  clickevent(value) {
    if (value?.IsSelected == 0) {
      this.isStarActive = 1;
    } else {
      this.isStarActive = 0;
    }
    let selectedArray = this.gridListData.filter(x => x['ClientId'] == value?.ClientId);
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
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: For sending data of client details on 1st popup
    */
  onSave() {
    this.loading = true;
    this.selectedList = [];
    this.selectedList = this.gridListData.filter(x => x['IsSelected'] == '1');

    const arr = [];
    for (let i = 0; i < this.selectedList.length; i++) {
      arr.push({
        'ClientId': this.selectedList[i].ClientId,
        'ClientName': this.selectedList[i].ClientName
      })
    }

    document.getElementsByClassName("AddContactRelatedTo")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddContactRelatedTo")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: true, clientArr: arr }); }, 200);
  }


  /*
  @Name: sortName function
  @Who: Anup Singh
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
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
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
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
        this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false,false);
      }
    })
  }


  /*
  @Type: File, <ts>
  @Name: clearFilterData function
  @Who: Anup Singh
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: FOR DIALOG BOX confirmation
  */
  clearFilterData(): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_contactRelatedTo';
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
        this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, true,false);

      }
    });
  }



  /*
   @Name: onFilter function
   @Who: Anup Singh
   @When: 29-Nov-2021
   @Why: EWM-3700 EWM-3916
   @What: use for Searching records
    */
  public onFilter(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, inputValue, this.filterConfig, false,false);


  }


  /*
 @Name: onFilterClear function
 @Who: Anup Singh
 @When: 29-Nov-2021
 @Why: EWM-3700 EWM-3916
 @What: use Clear for Searching records
 */
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    this.searchValue = '';
    this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false,false);
  }



  goToClientDetails(ClientId) {
    this.route.navigate(['/client/core/clients/list/client-detail'], {
      queryParams: { clientId: ClientId }
    });

    document.getElementsByClassName("AddContactRelatedTo")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddContactRelatedTo")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: "goToClientDetail" }); }, 200);

    // [routerLink]="['/client/core/clients/list/client-detail']"
    //              [queryParams]="{clientId:data.ClientId}"
  }


  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridListData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.getContactRelatedClientall(this.pageSize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false,true);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

}
