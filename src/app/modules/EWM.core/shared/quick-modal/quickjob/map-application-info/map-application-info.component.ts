/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Renu
    @When: 27-Sep-2021
    @Why: ROST-7875 ROST-8992
    @What:  map application form to map with job
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../services/Job/job.service';
import { UserAdministrationService } from '../../../services/user-administration/user-administration.service';

@Component({
  selector: 'app-map-application-info',
  templateUrl: './map-application-info.component.html',
  styleUrls: ['./map-application-info.component.scss']
})
export class MapApplicationInfoComponent implements OnInit {

  public loading: boolean = false;
  searchSubject$ = new Subject<any>();
  public gridView: any;
  public totalDataCount: any;
  public searchVal: string = '';
  public pagesize: any;
  public pagneNo: any;
  public sortingValue: any = 'IsDefault,desc'; /*--@who: Nitin Bhati,@When:11-05-2023,@Why:12363--*/
  public canLoad = false;
  public pendingLoad = false;
  public inputArray: any = [];
  public isDelete: any;
  public loadingSearch: boolean = false;
  public filterConfig: any = 0;
  public defaultApplicationMax: number = 5;
  public newArray: any = [];
  loadingscroll: boolean;
  animationVar : any;
  
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<MapApplicationInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService, private userAdministrationService: UserAdministrationService, private serviceListClass: ServiceListClass,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private jobService: JobService) {
    // page option from config file    
    this.pagneNo = this.appSettingsService.pageOption;
    this.pagesize = this.appSettingsService.pagesize;
    this.defaultApplicationMax = 1;
    if (data.applicationList != undefined) {
      this.newArray = JSON.parse(JSON.stringify(data?.applicationList));
     
    }
    if(data?.applicationDefault  && Object.keys(data?.applicationDefault).length !== 0)
    {
      this.inputArray = [data?.applicationDefault];
    }
  }

  ngOnInit(): void {
    this.fetchApplicationList(this.pagesize, this.pagneNo, this.sortingValue);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.pagneNo=1;
      this.searchVal=val;
      this.fetchApplicationList(this.pagesize, this.pagneNo, this.sortingValue);
       });
  }

  onDismiss() {
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ res: false, inputArray: this.newArray }); }, 200);
  }

  onSave() {
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ res: true, inputArray: this.inputArray }); }, 200);
  }


  /*
 @Type: File, <ts>
 @Name: fetchApplicationList
 @Who: Renu
  @When: 27-Sep-2021
  @Why: ROST-7875 ROST-8992
 @What: To get more data from server on page scroll.
*/
  fetchApplicationList(pagesize, pagneNo, sortingValue) {
    this.loading=true;
    this.jobService.getApplicationFormAll(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          if(this.inputArray.length==0)
          {
            this.gridView.forEach(element => {
              element['IsDefault'] = 0;
            }); 
          }else{
            this.gridView.filter(x=>{
              if(x['Id']==this.data?.applicationDefault?.Id)
              {
                x['IsDefault']=1;
              }else{
                x['IsDefault']=0;
              }
            });
          }
          
          this.totalDataCount = repsonsedata.TotalRecord;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = [];
          this.totalDataCount = repsonsedata.TotalRecord;
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
@Who: Renu
@When: 27-Sep-2021
@Why: ROST-7875 ROST-8992
@What: To add data on page scroll.
*/

  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchAppDefaultMoreRecord(this.pagesize, this.pagneNo, this.sortingValue);
      } else {
        this.loading = false;
        this.loadingscroll = false;
      }
    } else {
      this.loading = false;
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

/*
@Type: File, <ts>
@Name: appSectionMap
@Who: Renu
@When: 27-Sep-2021
@Why: ROST-7875 ROST-8992
@What: To add application default application by click on add popup
*/
appSectionMap(appInfo){
  this.inputArray=[];
  const data = this.inputArray.filter(x => x['Id'] == appInfo.Id);
  if (data == '') {
    this.inputArray.push(appInfo);
  }
  appInfo.IsDefault = 1;
  this.gridView.filter(x => {
    if (x['Id'] === appInfo.Id) {
      x['IsDefault'] = 1;
    }else{
      x['IsDefault'] = 0;
    }
  });
}
/*
@Type: File, <ts>
@Name: addItem
@Who: Renu
@When: 27-Sep-2021
@Why: ROST-7875 ROST-8992
@What: To add application default application
*/
  addItem(appInfo) {
    if(this.inputArray.length==0){
      this.appSectionMap(appInfo);
      return;
    }
    const message = 'label_titleDialogContentSiteDomain';
    const title = '';
    const subTitle = 'label_deleteMapApplication';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.appSectionMap(appInfo);
      }
    })

  }


  public onFilterClear(): void {
    this.searchVal = '';
    this.fetchApplicationList(this.pagesize, this.pagneNo, this.sortingValue);
  }


  /*
  @Name: onFilter function
  @Who: Renu
  @When: 27-Sep-2021
  @Why: ROST-7875 ROST-8992
  @What: use for Searching records
  */


  public onFilter(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    this.pagneNo = 1;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.searchSubject$.next(inputValue); 
  
  }


  /* 
     @Type: File, <ts>
     @Name: onDesignationchange
     @Who: Renu
    @When: 27-Sep-2021
  @Why: ROST-7875 ROST-8992
     @What: when Designation drop down changes 
   */
  onchange(data) {
    if (data != undefined && data != null && data != '') {
      this.filterConfig = data.Id
      this.fetchApplicationList(this.pagesize, this.pagneNo, this.sortingValue);
    } else {
      this.filterConfig = 0;
      this.fetchApplicationList(this.pagesize, this.pagneNo, this.sortingValue);
    }

  }




  /*
 @Type: File, <ts>
 @Name: fetchAppDefaultMoreRecord
 @Who: Renu
  @When: 27-Sep-2021
  @Why: ROST-7875 ROST-8992
 @What: To get more data from server on page scroll.
 */

  fetchAppDefaultMoreRecord(pagesize, pagneNo, sortingValue) {
    this.jobService.getApplicationFormAll(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          if (repsonsedata.Data) {
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data;
            this.gridView = this.gridView.concat(nextgridView);
            this.totalDataCount = repsonsedata.TotalRecord;
          }

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = [];
          this.totalDataCount = repsonsedata.TotalRecord;
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
 @Name: onFilter function
 @Who: Renu
 @When: 27-Sep-2022
 @Why: EWM-7878/8992
 @What: to remove default application on remove
 */

  removeDefaultApplication(appInfo: any) {
    const index = this.inputArray.findIndex(x=>x['Id']===appInfo.Id);
    if (index >= 0) {
      this.inputArray.splice(index, 1);
    }
    this.gridView.filter(x => {
      if (x['Id'] === appInfo.Id) {
        x['IsDefault'] = 0;
      }
    });
  }

  /*
 @Name: showPreview function
 @Who: Renu
 @When: 27-Sep-2022
 @Why: EWM-7878/8992
 @What: to view preview in read only mode
 */
  showPreview(applicationId){
    let parm='?applicationId='+applicationId+'&mode=preview';
    let manageurl='./application/apply'+parm;
    window.open(manageurl, '_blank');
  }

}
