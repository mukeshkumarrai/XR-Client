/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Adarsh Singh
 @When: 16-july-2021
 @Why: EWM-6222 EWM-6363
 @What: career Section
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models'; 
import { ButtonTypes } from 'src/app/shared/models';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { QuickJobService } from '../../shared/services/quickJob/quickJob.service';
import { JobService } from '../../shared/services/Job/job.service';
import { ManageCareerComponent } from './manage-career/manage-career.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { fadeInRightBigAnimation } from 'angular-animations';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CareerComponent implements OnInit {
  animationVar: any;
  public active = false;
  canLoad = false;
  pendingLoad = false;
  public pageSize;
  pageNo = 1;
  loadingscroll: boolean;
  public ascIcon:string;
  public descIcon:string;
  public sortedcolumnName:string='Title';
  listDataview: any[] = [];
  public formtitle:string='grid';
  public userpreferences: Userpreferences;

  pageOption: any;
  public listData: any[];
  loading:boolean;
  totalDataCount:any;
  viewMode: string = "listMode";
// animate and scroll page size
animationState = false;
// animate and scroll page size
public sortDirection = 'asc';
  public searchVal: string = '';
  public gridViewList: any = [];
  public sortingValue: string = "CareerPageName,asc";
  public idName='Id';
  public idWeightage='';
public auditParameter;
dirctionalLang;


  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
     public dialog: MatDialog, private appSettingsService: AppSettingsService, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService) {
     // page option from config file
     this.pageOption = this.appSettingsService.pageOption;
     // page option from config file
     this.pageSize=this.appSettingsService.pagesize;

     this.auditParameter = encodeURIComponent('Career Page');

  }

  ngOnInit(): void {
    this.animationVar = ButtonTypes;
    this.getCareerPage(this.pageSize, this.pageNo, this.sortingValue, this.searchVal); 
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.route.navigate([], {
      queryParams: {
        'Id': null,
      },
      queryParamsHandling: 'merge'
    })

  }

  openPopUp(){
    const dialogRef = this.dialog.open(ManageCareerComponent, {
      panelClass: ['xeople-modal','careerPage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      // data:{name:this.headerlabel}
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      this.getCareerPage(this.pageSize, this.pageNo, this.sortingValue, this.searchVal); 
      }
    });
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }


 /* 
  @Type: File, <ts>
  @Name: getCareerPage function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
  @What: service call for get data
  */
 getCareerPage(pageSize, pageNo, sortingValue, searchVal){
   this.loading=true;
   this.jobService.getCareerPageAll(pageSize, pageNo, sortingValue, searchVal).subscribe(
     repsonsedata=>{     
       if(repsonsedata['HttpStatusCode']=='200'){
         this.loading=false;
         this.totalDataCount=repsonsedata['TotalRecord'];
         this.listData=repsonsedata['Data'];
       }else{
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.loading=false;
       }
     },err=>{
        this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
       })
 }

openPopUpForEdit(e,Id){
  this.route.navigate(['./client/core/job/career'], {queryParams: {Id}});

  const dialogRef = this.dialog.open(ManageCareerComponent, {
    maxWidth: "750px",
    width:"90%",
    panelClass: ['careerPage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    data:{Id:Id}
  });
  
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
     // console.log(dialogResult);
      this.getCareerPage(this.pageSize, this.pageNo, this.sortingValue, this.searchVal); 
    }
  });
}
 

 /*
  @Type: File, <ts>
  @Name: add remove animation function
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
  @What: add and remove animation
   */

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
    @Type: File, <ts>
    @Name: confirmDialog function
   @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
    @What: FOR delete data
  */

 DeleteCareerData(index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_careerPage';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      
      if (dialogResult == true) {
        let Obj = {}
        Obj['Id'] = index?.Id;
        Obj['BrandName'] = index?.BrandName;
        Obj['Created'] = index?.Created;
        Obj['IsDefault'] = index?.IsDefault;
        Obj['SocialProfiles'] = index?.SocialProfiles;
        Obj['CareerPageName'] = index?.CareerPageName;
        Obj['CareerSiteName'] = index?.CareerSiteName;
        Obj['BrandId'] = index?.BrandId;
        Obj['CareerSiteType'] = index?.CareerSiteType;

        this.jobService.deleteCareerPage(Obj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
               this.getCareerPage(this.pageSize, this.pageNo, this.sortingValue, this.searchVal); 
              
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }

    /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
    @What:shorting data
  */

 onSort(columnName) {
  this.loading = true;
  this.sortedcolumnName = columnName;
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.ascIcon = 'north';
  this.descIcon = 'south';
  this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
  this.pageNo = 1;
  this.jobService.getCareerPageAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        // document.getElementById('contentdata').scrollTo(0, 0);
        this.loading = false;
        if (repsonsedata.Data) {
          this.gridViewList = repsonsedata.Data;
        this.getCareerPage(this.pageSize, this.pageNo, this.sortingValue, this.searchVal); 

        }
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

     /*
 @Type: File, <ts>
 @Name: onScrollDown
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
 @What: To add data on page scroll.
 */
onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.listData.length) {
      this.pageNo = this.pageNo + 1;
      this.getCareerPage(this.pageSize, this.pageNo, this.sortingValue, this.searchVal); 
    }
    else {
      this.loadingscroll = false;
    }
  } else {
    this.loadingscroll = false;
    this.pendingLoad = true;
  }
}
}
