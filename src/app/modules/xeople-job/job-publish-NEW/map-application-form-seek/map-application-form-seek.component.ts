import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, ButtonTypes } from 'src/app/shared/models';
import { I } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { UserAdministrationService } from '@app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { ServiceListClass } from '@app/shared/services/sevicelist';

@Component({
  selector: 'app-map-application-form-seek',
  templateUrl: './map-application-form-seek.component.html',
  styleUrls: ['./map-application-form-seek.component.scss']
})
export class MapApplicationFormSeekComponent implements OnInit {

   
  public loading: boolean = false;
  public gridView: any;
  public maxCharacterLength = 150;
  public totalDataCount: any;
  public searchVal: string = '';
  public pagesize: any;
  public pagneNo: any;
  public sortingValue: any = '';
  public canLoad = false;
  public pendingLoad = false;
  public viewMode = 'cardMode';
  public formtitle = 'grid';
  public inputArray: any = [];
  public isDelete: any;
  public loadingSearch: boolean = false;
  public filterConfig: any = 0;
  public GridId: string = 'Assessment_grid_001';
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public perWorkflowMapMaxAessment: number = 1;
  public newArray: any = [];
  JobId: any;
  gridListData: any = [];
  ApplicationFormId: number;
  checkIsMapedApplication;
  public result: string = '';
  @Input() JobName: any;
  @Input() WorkflowId: any;
  @Input() WorkflowName: any;
  JobTitle: any;
  loadingscroll: boolean;
  animationVar : any;
  // applicationFormName: string;
  public applicationFormName:any={};

  applicationFormNamePatch: string;
  isChecked;
  searchSubject$ = new Subject<any>();
  public hideChip :boolean;
  allGridListData: any = [];
  applicationFormId;
  isNotMappedClicked: boolean = false;
  clickedData:any;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<MapApplicationFormSeekComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService, private userAdministrationService: UserAdministrationService, private serviceListClass: ServiceListClass,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private jobService: JobService) {
    // page option from config file    
    this.pagneNo = this.appSettingsService.pageOption;
    this.pagesize = this.appSettingsService.pagesize;
    if (data.jobId != undefined) {
      this.newArray = JSON.parse(JSON.stringify(this.data?.jobId));
      this.JobId = data.jobId;
      this.JobTitle = data.JobTitle;
      this.applicationFormName=data.applicationFormName;
    }
    if(data?.applicationFormName  && Object.keys(data?.applicationFormName).length !== 0)
    {
      this.inputArray = [data?.applicationFormName];
      this.applicationFormId = data?.applicationFormId;
    }
  }
  /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAll
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: To get more data from server on page scroll.
     */
  ngOnInit(): void {
    this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, true);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      //this.loadingSearch = true;
      this.pagneNo=1;
      this.getApplicationJobMappingToJobAllSearch(this.JobId, val, this.pagneNo, this.pagesize, this.sortingValue, true);
       });

      //  if (this.applicationFormName) {
      //   this.hideChip= true;
      //  }else{
      //   this.hideChip= false;

      //  }
  }

  /*
   @Type: File, <ts>
   @Name: getApplicationJobMappingToJobAll
   @Who: Nitin Bhati
   @When: 20-09-2022
   @Why: ROST-8845
   @What: To get more data from server on page scroll.
  */
  getApplicationJobMappingToJobAll(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
    if (isLoader) {
      this.loading = true;
    } else {
      this.loading = false;
    }
    this.jobService.getApplicationJobMappingToJob(jobId, search, pageNo, pageSize, sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingscroll = false;
          this.loading = false;
          let nextgridView = [];
          nextgridView = repsonsedata.Data;
        this.gridView = repsonsedata.Data;
          this.gridListData = this.gridListData.concat(nextgridView);
          this.allGridListData = [...repsonsedata.Data]
          // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
          // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
          this.totalDataCount = repsonsedata.TotalRecord;
          if(this.inputArray.length==0)
          {
            this.gridView.forEach(element => {
              element['IsDefault'] = 0;
              element['IsMapped'] = 0;
            }); 
          }else{
            this.gridView.filter(x=>{
              if(x['Id']==this.data?.applicationFormName?.Id)
              {
                x['IsDefault']=1;
              }else{
                x['IsDefault']=0;
              }
            });
          }
        } else if(repsonsedata.HttpStatusCode == '204') {
          this.loadingscroll = false;
          this.loading = false;
          this.gridListData = [];
          this.allGridListData = [];
         }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Nitin Bhati
  @When: 20-09-2022
  @Why: ROST-8845
  @What: To add data on page scroll.
  */
  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridListData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, false);
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
      @Name: getApplicationJobMappingToJobAll
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: To get more data from server on page scroll.
     */
  deleteItem(assessmentData) {
    //  assessmentData.isDelete=0;
    // this.inputArray = this.inputArray.filter(x => x['Id'] != assessmentData.Id); 
    // <!---------@When: 13-Jan-2023 @who:Adarsh singh @why: EWM-9587 Desc: handle while click on delete icon at first time mat card border was not removing --------->
    if (this.inputArray[0]?.Id) {
      const index = this.inputArray.findIndex(x => x.Id == assessmentData.Id);
      if (index !== -1) {
        this.inputArray.splice(index, 1);
      }
      this.inputArray.forEach(x => {
        if (x.Id == assessmentData.Id) {
          x.isDelete = 0;
        }
      });
      this.gridView.forEach(x => {
        if (x.Id == assessmentData.Id) {
          x.IsMapped = 0;
        }
      });
    } else {
      const index = this.inputArray.findIndex(x => this.applicationFormId == assessmentData.Id);
      if (index !== -1) {
        this.inputArray.splice(index, 1);
      }

      this.gridView.forEach(x => {
        if (x.Id == assessmentData.Id) {
          x.isDelete = 0;
          x.IsMapped = 0;
        }
      });
    }
  // end 
  }

  /*
    @Type: File, <ts>
    @Name: getApplicationJobMappingToJobAll
    @Who: Nitin Bhati
    @When: 20-09-2022
    @Why: ROST-8845
    @What: To get more data from server on page scroll.
   */
  public onFilterClear(): void {
    this.searchVal = '';
    this.pagneNo=1;
    this.getApplicationJobMappingToJobAllFilter(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, true);
  }
  /*
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 20-09-2022
  @Why: ROST-8845
  @What: use for Searching records
  */
  public onFilter(inputValue: string): void {
    this.loading = false;
    //this.loadingSearch = true;
     if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
   this.searchSubject$.next(inputValue);

  }
  /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAllFilter
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: To search data into application form.
     */
  getApplicationJobMappingToJobAllFilter(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
    this.loading = true;
    this.pagneNo=1;
    this.jobService.getApplicationJobMappingToJob(jobId, search, this.pagneNo, pageSize, sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.gridListData = repsonsedata.Data;
          // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
          // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
          this.totalDataCount = repsonsedata.TotalRecord;
        } else if(repsonsedata.HttpStatusCode == '204') {
           this.loading = false;
          this.gridListData = [];
         }else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

   /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAllFilter
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: To search data into application form.
     */
      getApplicationJobMappingToJobAllSearch(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
        this.jobService.getApplicationJobMappingToJob(jobId, search, pageNo, pageSize, sortingValue).subscribe(
          (repsonsedata: ResponceData) => {
            this.loadingSearch = true;
            if (repsonsedata.HttpStatusCode == '200') {
              this.loadingSearch = false;
              this.gridListData = repsonsedata.Data;
              // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
              // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
              this.totalDataCount = repsonsedata.TotalRecord;
            } else if(repsonsedata.HttpStatusCode == '204') {
               this.loadingSearch = false;
              this.gridListData = [];
             }else {
              this.loadingSearch = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
             }
          }, err => {
            this.loadingSearch = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
  /*
     @Type: File, <ts>
     @Name: getCurrentStatus
     @Who: Nitin Bhati
     @When: 20-09-2022
     @Why: ROST-8845
     @What: To cureent status.
    */
  getCurrentStatus(assessmentData) {
    let selectedArray = this.inputArray?.filter(x => x['Id'] === assessmentData?.Id);
    if (selectedArray != '') {
      assessmentData.isDelete = 1;
    } else {
      assessmentData.isDelete = 0;
    }
  }
  /*
      @Type: File, <ts>
      @Name: getCandidateMapAppId
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: For view candidate view.
     */
  getCandidateMapAppId(id) {
    let navigate = './client/core/administrators/application-form/application-form-configure' + '?Id=' + id+'&isPreviewMode='+ true;
    window.open(navigate, '_blank');
  }
  /*
    @Type: File, <ts>
    @Name: onApplicationJobMapping
    @Who: Nitin Bhati
    @When: 20-09-2022
    @Why: ROST-8845
    @What: For mapping data.
   */
  onApplicationJobMapping(data, i) {
    this.ApplicationFormId = data.Id;
    this.isChecked = i;
    this.alreadyMapedToggleBtn(data);
    this.applicationFormNamePatch = data.Name;
    this.clickedData = data;
  }
  /*
      @Type: File, <ts>
      @Name: alreadyMapedToggleBtn
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: For showing Default value.
     */
  alreadyMapedToggleBtn(data) {
    let checkIsMaped = this.allGridListData.filter(x => x.IsMapped == 1);
    this.checkIsMapedApplication = checkIsMaped[0];

    if (this.checkIsMapedApplication?.IsMapped == 1) {
      if (this.isChecked.checked == false) {
        this.removeMapApplication(data);
      } else {
        this.toggleMapApplication(data);
      }
    }
    else if (data.IsMapped == 0) {
      this.onToggleMapApplication(data);
    }
    else {
      // this.updateApplicationJobMappingToJobAll();
    }

  }
  /*
      @Type: File, <ts>
      @Name: removeMapApplication
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: for remove data
     */
  removeMapApplication(data: any): void {
    let folderObj = {};
    folderObj = data;
    const message = 'label_titleDialogContentSiteDomain';
    const title = 'label_removeMappingOf';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        let obj = {};
        obj['JobId'] = this.JobId;
        obj['JobTitle'] = this.JobName;
        // obj['ApplicationFormId'] = this.ApplicationFormId;
        // obj['ApplicationFormName'] = this.applicationFormName;

        this.jobService.updateApplicationJobMappingToJob(obj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
              this.applicationFormName=this.applicationFormNamePatch
              this.getApplicationJobMappingToJobAllWithoutConcat();
              //this.onMapApplicationForm.emit(true);
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.getApplicationJobMappingToJobAllWithoutConcat();
      }
    });
  }
  /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAll
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: To get more data from server on page scroll.
     */
  toggleMapApplication(data: any): void {
    let folderObj = {};
    folderObj = data;
    //const message = this.checkIsMapedApplication.Name + this.translateService.instant('label_isAlreadyMapped');
    const message = 'label_ApplicationConfirmation';
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      this.result = dialogResult;
      if (dialogResult == true) {
        this.updateApplicationJobMappingToJobAll();
        // this.hideChip=true;
        this.appSectionMap(data);

      } else {
        this.getApplicationJobMappingToJobAllWithoutConcat();
      }
    });
  }
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
      @Name: onToggleMapApplication
      @Who: Adarsh singh
      @When: 03-12-2022
      @Why: ROST-9675
      @What: For confirm modal
     */
    onToggleMapApplication(data: any): void {
      let folderObj = {};
      folderObj = data;
      //const message = this.checkIsMapedApplication.Name + this.translateService.instant('label_isAlreadyMapped');
      const message = 'label_ApplicationConfirmationWithoutMapped';
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.loading = true;
        this.result = dialogResult;
        if (dialogResult == true) {
          this.isNotMappedClicked = true;
          this.updateApplicationJobMappingToJobAll();
          
        } else {
          this.loading = false;
          // this.getApplicationJobMappingToJobAllWithoutConcat();
        }
      });
    }
 
  
  updateApplicationJobMappingToJobAll() {
    this.loading = true;
    let obj = {};
    obj['JobId'] = this.JobId;
    obj['JobTitle'] = this.JobTitle;
    obj['ApplicationFormId'] = this.ApplicationFormId;
    obj['ApplicationFormName'] = this.applicationFormName;
    this.jobService.updateApplicationJobMappingToJob(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          //this.onMapApplicationForm.emit(true);
          this.applicationFormName=this.applicationFormNamePatch
          this.getApplicationJobMappingToJobAllWithoutConcat();
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
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
      @Name: getApplicationJobMappingToJobAllWithoutConcat
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: To get more data from server on page scroll.
     */
  getApplicationJobMappingToJobAllWithoutConcat() {
    this.pagneNo = 1;
    this.jobService.getApplicationJobMappingToJob(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridListData = repsonsedata?.Data;
          this.gridView = repsonsedata?.Data;
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 --------->
          if (this.isNotMappedClicked) {
          this.applicationFormName=this.applicationFormNamePatch;
            this.inputArray=[];
            const data = this.inputArray.filter(x => x['Id'] == this.clickedData.Id);
            if (data == '') {
              this.inputArray.push(this.clickedData);
            }
          }
          this.isNotMappedClicked = false;
          // End 
          // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
          // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
          
        } else if(repsonsedata.HttpStatusCode == '204'){
          this.loading = false;
          this.loadingSearch = false;
          this.gridListData = [];
        } else {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
     @Type: File, <ts>
     @Name: onDismiss
     @Who: Nitin Bhati
     @When: 20-09-2022
     @Why: ROST-8845
     @What: For dismiss button .
    */
  onDismiss() {
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ res: false,Name: this.applicationFormName,Id: this.ApplicationFormId }); }, 200);
  }
  /*
      @Type: File, <ts>
      @Name: onSave
      @Who: Nitin Bhati
      @When: 20-09-2022
      @Why: ROST-8845
      @What: For Save button.
     */
  onSave() {
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ res: true,Name: this.applicationFormName,Id: this.ApplicationFormId }); }, 200);
  }

  removable = true;
  public isMapAppToggled;

  removeDefaultApplication(appInfo: any) {
    const index = this.inputArray.findIndex(x=>x['Id']===appInfo.Id);
    if (index >= 0) {
      this.inputArray.splice(index, 1);
    }
    this.gridView.filter(x => {
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 --------->
      if (x['Id'] === appInfo.Id ? appInfo.Id : this.applicationFormId) {
        x['IsMapped'] = 0;
      }
    });
  }

}
