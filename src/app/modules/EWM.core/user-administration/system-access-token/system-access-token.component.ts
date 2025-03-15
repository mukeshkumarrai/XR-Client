/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 06-April-2022
    @Why: EWM-5580 EWM-6098
    @What:  This page wil be use only for system-access-token Component ts
*/

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { GenerateTokenPopupComponent } from './generate-token-popup/generate-token-popup.component';
import { ButtonTypes } from 'src/app/shared/models';
import { ConfirmDialogModel } from '../../shared/quick-modal/quickpeople/quickpeople.component';
import { ConfirmDialogComponent } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { fadeInRightBigAnimation } from 'angular-animations';
import { NewApiTokenPopupComponent } from './new-api-token-popup/new-api-token-popup.component';
import { AfterRevokeAccessMessagePopupComponent } from './after-revoke-access-message-popup/after-revoke-access-message-popup.component';

@Component({
  selector: 'app-system-access-token',
  templateUrl: './system-access-token.component.html',
  styleUrls: ['./system-access-token.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class SystemAccessTokenComponent implements OnInit {
  public loading: boolean = false;

  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public submitted = false;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Name,asc";
  public sortedcolumnName: string = 'Name';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public pagneNo = 1;
  public searchVal: string = '';
  public listData: any = [];
  public loadingSearch: boolean=false;
  public totalDataCount: any=0;
  public gridViewList: any = [];
  public viewMode: string="listMode";
  public isvisible: boolean;
  public auditParameter: string;
  anchorTagLength: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public pageLabel: any = "label_notesCategory";
  public idWeightage='';
  public idName='Id';
  public userpreferences: Userpreferences;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  dirctionalLang;


  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private route: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService:TextChangeLngService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService, 
    public _userpreferencesService: UserpreferencesService, 
    private appSettingsService:AppSettingsService) { 

       // page option from config file
    this.pageOption = this._appSetting.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    }

    ngOnInit(): void {
      let URL = this.route.url;
      let URL_AS_LIST = URL.split('/');
      this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
      this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
      
       setInterval(() => {
         this.canLoad = true;
         if (this.pendingLoad) {
         }
       }, 2000);

       this.ascIcon = 'north';
       this.auditParameter = encodeURIComponent('System Access Token');
       this.userpreferences = this._userpreferencesService.getuserpreferences();
      // this.animationVar = ButtonTypes;


      this.getSystemAccessTokenList(this.sortingValue)
     }
   
 
     /* 
  @Type: File, <ts>
  @Name: openModelGenerateToken
  @Who: Anup Singh
  @When: 13-April-2022
  @Why: EWM-5580 EWM-6099
  @What: for open popup generate token.
*/
  openModelGenerateToken() {
    const dialogRef = this.dialog.open(GenerateTokenPopupComponent, {
      //  data: new Object({ Id: value.Id, clientId:this.data?.clientId}),
       panelClass: ['xeople-modal', 'generateToken', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        this.getSystemAccessTokenList(this.sortingValue)
      }
      else {
        // console.log("false")
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
  @Name: animate delaAnimation function
  @Who: Anup Singh
  @When: 13-April-2022
  @Why: EWM-5580 EWM-6099
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

  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;
 
  }


  /*
 @Type: File, <ts>
 @Name: getSystemAccessTokenList function
 @Who: Anup Singh
 @When: 13-April-2022
 @Why: EWM-5580 EWM-6099
 @What: For showing the list of token data
*/
 getSystemAccessTokenList(sortingValue) {
    this.loading = true;
    this._SystemSettingService.getSystemAccessToken(sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
            this.gridViewList = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
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
 @Name: openModelGenerateNewApiToken function
 @Who: Anup Singh
 @When: 13-April-2022
 @Why: EWM-5580 EWM-6099
 @What: For view secret key and client id
*/
  openModelGenerateNewApiToken(resData) {
    const dialogRef = this.dialog.open(NewApiTokenPopupComponent, {
      data: new Object({ ClientId: resData?.ClientId, ClientSecret: resData?.ClientSecret, EmailId:'', isPopUpClose:true}),
      panelClass: ['xeople-modal', 'generateNewApiToken', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        
      
      }
      else {
        // console.log("false")
      }
  
    });

    /* RTL code */
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }

  

  /*
 @Type: File, <ts>
 @Name: revokeSystemAccessToken function
 @Who: Anup Singh
 @When: 13-April-2022
 @Why: EWM-5580 EWM-6099
 @What: FOR DIALOG BOX confirmation
*/
revokeSystemAccessToken(val): void {
    let revokeObj = {};
    revokeObj = val;
    const message = `label_titleDialogContentSiteDomain`;
    const title = '';
    const subTitle = 'label_revokeAccess';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._SystemSettingService.revokeSystemAccessToken(revokeObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {

              this.openModelAfterRevokeAccessMsg(val.Name);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
            }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }


   /*
 @Type: File, <ts>
 @Name: openModelAfterRevokeAccessMsg function
 @Who: Anup Singh
 @When: 13-April-2022
 @Why: EWM-5580 EWM-6099
 @What: FOR after revoke access msg
*/
  openModelAfterRevokeAccessMsg(name) {
    const dialogRef = this.dialog.open(AfterRevokeAccessMessagePopupComponent, {
      data: new Object({ name:name}),
      panelClass: ['xeople-modal', 'afterRevokePopupMsg', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        this.getSystemAccessTokenList(this.sortingValue);
      }
      else {
        // console.log("false")
      }
  
    });
  }





  /**
 @(C): Entire Software
 @Type: switchListMode Function
 @Who: Anup Singh
 @When: 13-April-2022
 @Why: EWM-5580 EWM-6099
 @What: This function responsible to change list and card view
  */
  switchListMode(viewMode) {
    let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
      //listHeader.classList.remove("hide");
    }
  }


/*
 @Type: File, <ts>
 @Name: onSort function
 @Who: Anup Singh
 @When: 13-April-2022
 @Why: EWM-5580 EWM-6099
 @What: FOR sorting the data
  */
  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.getSystemAccessTokenList(this.sortingValue);
  
   }

}

  

