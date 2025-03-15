/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Renu
  @When: 09-March-2022
  @Why: EWM-5337 EWM-5461
  @What:  This page will be use for show assesment version By id
*/
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { fadeInRightBigAnimation } from 'angular-animations';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-assessment-version',
  templateUrl: './assessment-version.component.html',
  styleUrls: ['./assessment-version.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class AssessmentVersionComponent implements OnInit {

  public loadingscroll:boolean;
  public assementInfoList:[]=[];
  public loading: boolean;
  public assementInfoId: Number;
  public userpreferences: Userpreferences;
  public viewMode='listMode';
  public assessmentName: any;
  public pageOption: any;
  public pagesize: any;
  public sortedcolumnName: string = 'VersionName';
  animationState: boolean;
  public sortDirection = 'desc';
  public sortingValue: string = "VersionName,desc";
  pagneNo: any = 1;
  totalDataCount: number;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public sort: any[] = [{
    field: 'VersionName',
    dir: 'desc'
  }];
  public formtitle: string = 'grid';
   public ascIcon: string;
  public descIcon: string;
  public isvisible: boolean;
  public searchVal: string = '';

  constructor(public dialogRef: MatDialogRef<AssessmentVersionComponent>,private snackBService:SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,private userAdministrationService:UserAdministrationService,
    private translateService:TranslateService,private _userpreferencesService:UserpreferencesService,private appSettingsService: AppSettingsService) { 
      this.assementInfoId = data.assessmentId;
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = appSettingsService.pagesize;
    }

  ngOnInit(): void {
    this.assessmentInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal,this.assementInfoId);
  }

  /*
    @Type: File, <ts>
    @Name: assessmentInfo
    @Who: Renu
    @When: 09-March-2022
    @Why: EWM-5337 EWM-5461
    @What: to get list by info Id 
  */

    assessmentInfo(pageSize:Number,pageNo:Number,sortingValue:String,searchVal:String,Id:Number){
      this.loading = true;
      this.userAdministrationService.getAssessmentVersionById(pageSize, pageNo, sortingValue, searchVal,Id).subscribe(
        (data: ResponceData) => {
          this.loading = false;
          if (data.HttpStatusCode == 200) {
           this.assementInfoList=data.Data;
            this.assessmentName=data.Data[0]?.Name;
          } else if (data.HttpStatusCode == 400) {
            this.loading = false;
            this.assementInfoList=[];
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }
        },
        err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
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
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}

 /*
@Name: pageChange function
@Who: Renu
@When: 09-March-2022
@Why: EWM-5337 EWM-5461
@What: to get list by info Id 
*/
public pageChange(event: PageChangeEvent): void {
  this.loadingscroll = true;
  if (this.totalDataCount > this.assementInfoList.length) {
    this.pagneNo = this.pagneNo + 1;
   // this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, true);
  } else {
    this.loadingscroll = false;
  }
}

/*
@Name: sortChange function
@Who: Renu
@When: 09-March-2022
@Why: EWM-5337 EWM-5461
@What: to get list by info Id 
*/
public sortChange($event): void {
  this.sortDirection = $event[0].dir;
  if (this.sortDirection == null || this.sortDirection == undefined) {
    this.sortDirection = 'asc';
  } else {
    this.sortingValue = $event[0].field + ',' + this.sortDirection;
  }
  this.pagneNo=1;
  //this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
}

/*
@Name: showTooltip function
@Who: Renu
@When: 09-March-2022
@Why: EWM-5337 EWM-5461
@What: to get list by info Id 
*/
public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  //console.log("show Tooltip:", e.target as HTMLElement);
  //alert("show tooltip");

  if (element.nodeName === 'TD') {
    var attrr = element.getAttribute('ng-reflect-logical-col-index');
   // console.log("show Tooltip One:");
    if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
        this.tooltipDir.hide();
      //  console.log("show Tooltip two:");
      }
      else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
         // console.log("show Tooltip three:");
        } else {
        //  console.log("show Tooltip four:");
          this.tooltipDir.toggle(element);
        }
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }
  else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
    if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
      this.tooltipDir.hide();
    //  console.log("show Tooltip five:");
    }
    else {
    //  console.log("show Tooltip six:");
      this.tooltipDir.toggle(element);
    }
  }
  else {
    this.tooltipDir.hide();
  }
}

/*
@Name: onDismiss function
@Who: Renu
@When: 09-March-2022
@Why: EWM-5337 EWM-5461
@What: TO close the modal
*/
onDismiss()
  {
    document.getElementsByClassName("add_assessment")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_assessment")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Renu
    @When: 15-May-2021
    @Why: ROST-1500
    @What: FOR sorting the data
  */

    onSort(columnName) {
      this.loading = true;
      this.sortedcolumnName = columnName;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.ascIcon = 'north';
      this.descIcon = 'south';
      this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
      this.pagneNo = 1;
      this.userAdministrationService.getAssessmentVersionById(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal, this.assementInfoId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            document.getElementById('contentdata').scrollTo(0, 0);
            this.loading = false;
            if (repsonsedata.Data) {
              this.assementInfoList = repsonsedata.Data;
            }
            // this.reloadListData();
            // this.doNext();
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
  
}