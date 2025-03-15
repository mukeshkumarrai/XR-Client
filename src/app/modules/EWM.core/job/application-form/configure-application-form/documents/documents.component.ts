import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddSkillsDocumentComponent } from './add-skills-document/add-skills-document.component';
import { AddQualificationDocumentComponent } from './add-qualification-document/add-qualification-document.component';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { WarningDialogComponent } from 'src/app/shared/modal/warning-dialog/warning-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class DocumentsComponent implements OnInit {
  @Input() documentIdData: any;
  @Input() IsDocuments = ''; // decorate the property with @Input()
  loading: boolean;
  animationVar: any;
  animationState = false;
  pageOption: any;
  public pageSize;
  public loadingSearch: boolean;
  public pageNo: number = 1;
  public sortingValue: string = "DocumentCategory,asc";
  public sortedcolumnName: string = 'DocumentCategory';
  public sortDirection = 'asc';
  public searchVal: string = '';
  public idName = 'Id';
  public idWeightage = '';
  public gridViewList: any = [];
  public gridViewListone: any = [];
  public checkdata: any = [];
  public formtitle: string = 'grid';
  public viewMode: string;
  public isvisible: boolean;
  public auditParameter: string;
  public userpreferences: Userpreferences;
  loadingscroll = false;
  public ascIcon: string;
  public descIcon: string;
  isDefault;
  public canLoad = false;
  public pendingLoad = false;
  public totalDataCount: any;
  background80: any;
  documentForm: FormGroup;
  applicationFormId: any;
  skillDataFromPop = [];
  qualificationDataFromPop = [];
  dirctionalLang;
  userDefoultLang: string;
  private _jsonURL;
  rtlVal: string = 'ltr';
  userDefoultConvert: string;

  // show field
  completed: boolean;
  allComplete: boolean = false;

  // mandatory
  completedMandatory: boolean;
  allCompleteMandatory: boolean = false;
  searchSubject$ = new Subject<any>();
  @Output() isShowAllChecked = new EventEmitter<any>();
  @Output() isShowAll = new EventEmitter<any>();

  @Output() isDocumentAll = new EventEmitter<any>();
  @Input () FormData :any;
  @Input () applicationForm :any;
  FormsData: any;
  welcomeStatus: boolean=true;
  knockoutStatus: boolean=false;
  thankYouStatus: boolean=false;
  assessmentQueStatus: boolean=false;
  documentsStatus: boolean=false;
  personalInformationStatus: boolean=false;
  isImportantLinkPage:boolean=false
  url = '../application-form-configure?Id=482'
  PageLabel: any;
  @Input() pageLabel: any;
  @Input() isSectionClick:Boolean;
  @Output() openCOnfirmDilog =new EventEmitter<any>();
  pagelabelDocument: any;
  document:boolean=true;
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService, private commonService: CommonserviceService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService,
    private domSanitizer: DomSanitizer, private http: HttpClient,
    private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService, private jobService: JobService, private fb: FormBuilder,
   ) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.auditParameter = encodeURIComponent('Application Form');
    this.useLanguage(localStorage.getItem('Language'));
    this.useLanguage(localStorage.getItem('Language'));

    this.documentForm = this.fb.group({  
      allDocument: []
    })

  }

  ngOnInit(): void {
        // this.allComplete = false;     
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.applicationFormId = parseInt(parms?.Id)        
        this.getFormDocumentAll(this.applicationFormId, this.pageNo, this.pageSize, this.sortingValue, this.searchVal, true);
      }
    });
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background80 = this.hexToRGB(primaryColor, 0.80);
    this.sendDataToParent();

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      let applicationId = '?applicationId=' + this.applicationFormId;
    this.jobService.getFormDocumentAllPage(applicationId, this.pageNo, this.pageSize, this.sortingValue, value).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.gridViewList = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.documentForm.patchValue({
            allDocument: this.gridViewList
          });
          this.sendDataToParent();
          this.isDocumentAll.emit(this.gridViewList)
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
       });
  }
  // who:maneesh,what:ewm-9594 ngOnDestroy fixed popup when  if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  ngOnDestroy(){
    this.FormsData=this.FormData;
    // let data = this.FormsData.value.allDocument?.filter(x=>x.IsDefault===1 || x.IsMandatory===1);
    this.openCOnfirmDilog.emit({applicationFormId:this.applicationFormId,applicationForm:true})
  }
  sendDataToParent() { 
    this.commonService.configueApplicationForm.next(this.documentForm);
  }
  /*
  @Type: File, <ts>
  @Name: getFormDocumentAll function
  @Who: Adarsh singh
  @When: 20-05-2022
  @Why: EWM-6550 EWM-6696
  @What: For showing the list of Document data
  */
  getFormDocumentAll(Id, pageSize, pageNo, sortingValue, searchVal, isLoader) {
    if (isLoader == true) {
      this.loading = true;
    } else {
      this.loading = false;
    }
    let applicationId = '?applicationId=' + Id;
    this.jobService.getFormDocumentAllPage(applicationId, pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.gridViewList = repsonsedata.Data;
          // this.gridViewList = this.gridViewList.concat(nextgridView);
          // who:maneesh,what:ewm-11924 for handel checkbox issu this.checkflag=flag;,when:13/06/2023
                if (this.checkflag==true) {
                 this.gridViewList = this.gridViewList.concat(this.checkdata);
                 const uniqueUsers = Array.from(this.gridViewList.reduce((map,obj) => map.set(obj.DocumentId,obj),new Map()).values());
                 this.gridViewList = uniqueUsers;
                 }else{
                   this.gridViewList = repsonsedata.Data;
                }
          this.allComplete = false;
          
          this.totalDataCount = repsonsedata.TotalRecord;

          this.updateAllComplete();
          this.updateAllCompleteMandatory();
          let isShow =  this.gridViewList.filter(e =>e.IsHidden == 1);          
          let isNotShow =  this.gridViewList.filter(e =>e.IsHidden == 0);
          
          isShow.forEach((element:any,i:any) => {
            setTimeout(() => {
              let elements = document.getElementById('MandatoryField'+element.DocumentId);
              elements.style.pointerEvents = 'auto';
            }, 200);
            
          });
          isNotShow.forEach((element,i) => {
            setTimeout(() => {
              let elements = document.getElementById('MandatoryField'+element.DocumentId);
              elements.style.pointerEvents = 'none';
            }, 200);
          });
          
          this.documentForm.patchValue({
            allDocument: this.gridViewList
          });
          this.sendDataToParent();
          this.allComplete = false;

          // <!---------@When: 07-12-2022 @who:Adarsh singh @why: EWM-9594 --------->    
          this.isDocumentAll.emit(this.gridViewList)
          this.allComplete = false;

        } else {
          this.loading = false;
          this.loadingscroll = false;
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
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  /**
  @(C): Entire Software
  @Type: switchListMode Function
  @Who: Adarsh singh
  @When: 19-05-2022
  @Why: EWM-6550 EWM-6696
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
    }
  }

  /*
  @Type: File, <ts>
  @Name: onSort function
  @Who: Adarsh singh
  @When: 19-05-2022
  @Why: EWM-6550 EWM-6696
  @What: FOR sorting the data
  */
  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    let applicationId = '?applicationId=' + this.applicationFormId
    this.jobService.getFormDocumentAllPage(applicationId, this.pageNo, this.pageSize, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.gridViewList = repsonsedata.Data;
          this.loading = false;
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
@Name: onMandatoryField function
@Who: Adarsh singh
@When: 19-05-2022
@Why: EWM-6550 EWM-6696
@What: FOR check mandatory fields is on or off 
*/
  onMandatoryField(isChecked, data) {
    if (isChecked.checked == true) {
      this.gridViewList.forEach(element => {
        if (element.DocumentId == data.DocumentId) {
          element.IsMandatory = 1
          // element.IsHidden = 0
        } 
      });
    }
    else {
      this.gridViewList.forEach(element => {
        if (element.DocumentId == data.DocumentId) {
          element.IsMandatory = 0
          // element.IsHidden = 1
        }
      });
    } 
      // who:maneesh,what:ewm-11924 for handel checkbox issu,when:14/06/2023
      this.gridViewListone = this.gridViewListone.concat(this.gridViewList);
      this.checkdata =  this.gridViewListone.filter(e =>e.IsMandatory == 1);  
  // who:maneesh,what:ewm-9594 comment this  discuss with  abhisek sir and mukesh sir,when:04/04/2023
    // this.isShowAllChecked.emit(this.gridViewList);
    this.isShowAll.emit(this.gridViewList);

    this.updateAllCompleteMandatory();
    this.documentForm.patchValue({
      allDocument: this.gridViewList
    });
    this.sendDataToParent();
  }
  /*
@Type: File, <ts>
@Name: onHideField function
@Who: Adarsh singh
@When: 19-05-2022
@Why: EWM-6550 EWM-6696
@What: FOR check Hide fields is on or off 
*/
  onHideField(isChecked, data) {
    let element = document.getElementById('MandatoryField'+data.DocumentId);
    if (isChecked.checked == true) {
      element.style.pointerEvents = 'auto';       
      this.gridViewList.forEach(element => {
        if (element.DocumentId == data.DocumentId) {
          element.IsHidden = 1
          // element.IsMandatory = 1
        }
      });     
    }
    else {
      element.style.pointerEvents = 'none';
      this.gridViewList.forEach(element => {
        if (element.DocumentId == data.DocumentId) {
          element.IsHidden = 0
           element.IsMandatory = 0
        }
      });     
    }
  // who:maneesh,what:ewm-11924 for handel checkbox issu,when:13/06/2023
    this.gridViewListone = this.gridViewListone.concat(this.gridViewList);
     this.checkdata =  this.gridViewListone.filter(e =>e.IsHidden == 1);        
  // who:maneesh,what:ewm-9594 comment this  discuss with  abhisek sir and mukesh sir,when:04/04/2023
    // this.isShowAllChecked.emit(this.gridViewList);
    this.isShowAll.emit(this.gridViewList);
    this.updateAllComplete();
    this.documentForm.patchValue({
      allDocument: this.gridViewList
    });
    this.sendDataToParent();
  }

  /*
  @Type: File, <ts>
  @Name: openSkillsModal
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: to open Skills modal dialog
  */
  openSkillsModal(action, gridData, index) {
    this.skillDataFromPop = this.gridViewList[index]?.Skills;
    const dialogRef = this.dialog.open(AddSkillsDocumentComponent, {
      panelClass: ['xeople-modal', 'add_skills', 'animate__animated', 'animate__zoomIn'],
      data: { skillData: this.skillDataFromPop, action: action },
      disableClose: true,
    });

    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

    dialogRef.afterClosed().subscribe(res => {
      if (res?.resType === true) {
        this.skillDataFromPop = res?.skillAllData;
        this.gridViewList.forEach(element => {
          if (element.DocumentId == gridData?.DocumentId) {
            element.Skills = this.skillDataFromPop
          }
        });
        this.documentForm.patchValue({
          allDocument: this.gridViewList
        });
        this.sendDataToParent();
      } else {

      }
    });
  }

  /*
  @Type: File, <ts>
  @Name: openQualificationModal
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: to open qualification modal dialog
  */
  openQualificationModal(action, gridData, index) {
    this.qualificationDataFromPop = this.gridViewList[index]?.Qualifications;
    const dialogRef = this.dialog.open(AddQualificationDocumentComponent, {
      panelClass: ['xeople-modal', 'add_skills', 'animate__animated', 'animate__zoomIn'],
      data: { qualificationDatas: this.qualificationDataFromPop, action: action },
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {
      if (res?.resType === true) {
        this.qualificationDataFromPop = res?.qualificationAllData;
        this.gridViewList.forEach(element => {
          if (element.DocumentId == gridData?.DocumentId) {
            element.Qualifications = this.qualificationDataFromPop
          }
        });
        this.documentForm.patchValue({
          allDocument: this.gridViewList
        });
        this.sendDataToParent();
      } else {

      }
    });
  }

  /* 
  @Type: File, <ts>
  @Name: onFilter
  @Who: Adarsh singh
  @When: 19-05-2022
  @Why: EWM-6550 EWM-6696
  @What: For search value
  */
  public onFilter(inputValue: string): void {
    this.searchVal = inputValue;
    // this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.searchSubject$.next(inputValue);

    
  }

  /*
  @Name: onFilterClear function
  @Who: Adarsh singh
  @When: 19-05-2022
  @Why: EWM-6550 EWM-6696
  @What: use Clear for Searching records
  */
  checkflag:boolean=false;
  public onFilterClear(flag): void {
  // who:maneesh,what:ewm-11924 for handel checkbox issu this.checkflag=flag and cooment this ,when:13/06/2023 
    this.checkflag=flag;
    this.searchVal = '';
    this.loadingSearch = true;
    this.getFormDocumentAll(this.applicationFormId, this.pageNo, this.pageSize, this.sortingValue, this.searchVal, true);
  //   let applicationId = '?applicationId=' + this.applicationFormId;
  // this.jobService.getFormDocumentAllPage(applicationId, this.pageNo, this.pageSize, this.sortingValue, this.searchVal).subscribe(
  //   (repsonsedata: ResponceData) => {
  //     if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //       this.animate();
  //       this.loading = false;
  //       this.loadingSearch = false;
  //       this.loadingscroll = false;
  //       this.gridViewList = repsonsedata.Data;
  //       console.log('this.gridViewList',this.gridViewList);
        
  //       this.totalDataCount = repsonsedata.TotalRecord;
  //       this.documentForm.patchValue({
  //         allDocument: this.gridViewList
  //       });
  //       this.sendDataToParent();
  //     } else {
  //       this.loading = false;
  //       this.loadingscroll = false;
  //       this.loadingSearch = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //     }
  //   }, err => {
  //     this.loading = false;
  //     this.loadingSearch = false;
  //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //   })
  }

  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Adarsh singh
  @When: 13-05-2022
  @Why: EWM-6552 EWM-6673
  @What: To add data on page scroll.
  */
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.getFormDocumentAll(this.applicationFormId, this.pageNo, this.pageSize, this.sortingValue, this.searchVal, false);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

  // add RTL by adarsh singh 26-05-2022 EWM-6552 EWM-6673
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching language
  // @What: this function used for change language of application.
  // @Return: None
  // @Params :
  // 1. lang - language code.

  public useLanguage(lang): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
    this.getJSON(lang).subscribe(data => {
      this.dirctionalLang = data._sys_language_direction;
      this.toggleLtrRtl(this.dirctionalLang);
    });
  }

  // @(C): Entire Software
  // @Type: Function
  // @Who: Nitin Bhati
  // @When: 13-Oct-2020
  // @Why:  For read json File data
  // @What: this function used for change Json File dynamically of application.
  // @Return: None
  // @Params : lang, _jsonURL
  public getJSON(lang): Observable<any> {
    this._jsonURL = 'assets/i18n/' + lang + '.json';
    // return this.http.get(this._jsonURL);
    let jsonURLSanitze: any = this.domSanitizer.bypassSecurityTrustUrl(this._jsonURL)
    return this.http.get(jsonURLSanitze.changingThisBreaksApplicationSecurity);
  }
  /*
 @Type: File, <TS>
 @Name: header.component.ts
 @Who: Nitin Bhati
 @When: 09-Oct-2020
 @Why: ROST-247
 @What: Implementation of Header Section Flip with Logo Icon
 */

  data = 'Initial Data';
  toggleLtrRtl(value) {
    this.rtlVal = value;
    this.commonService.emitEvent(this.rtlVal);
    if (value == 'ltr') {
      this.commonService.onUserLanguageDirection.next('ltr');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'ltr';
      document.body.dir = 'ltr';
    } else {
      this.commonService.onUserLanguageDirection.next('rtl');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'rtl';
      document.body.dir = 'rtl';
    }
  }

  // End RTL by adarsh singh 26-05-2022 EWM-6552 EWM-6673
  /*
    @Type: File, <ts>
    @Name: activestate function
    @Who: Satya Prakash
    @When: 02-Aug-2022
    @Why: EWM-6553 EWM-6709
    @What: disable all action button
    */
  activestate() {
    return !this.IsDocuments;
  }

  /*
    @Type: File, <ts>
    @Name: setAll function
    @Who: Adarsh singh
    @When: 02-Aug-2022
     @When: 30-Sep-2022
    @What: to set all checked for show field for show
  */

  setAll(completed: boolean) {
    if (completed) {
      this.allComplete = completed;      
      if (this.gridViewList == null) return;
      this.gridViewList.forEach((t) => {
        setTimeout(() => {
          let elements = document.getElementById('MandatoryField'+t.DocumentId);
          elements.style.pointerEvents = 'auto';
        }, 200);
        t.IsHidden = 1
      });    
    }
    else {
      this.allComplete = completed;
      this.gridViewList.forEach((t:any) => {
     setTimeout(() => {
      let element = document.getElementById('MandatoryField'+t.DocumentId);
      element.style.pointerEvents = 'none';
     }, 200);
        t.IsHidden = 0;
        t.IsMandatory = 0;
        this.allCompleteMandatory = false;
      }); 
  // who:maneesh,what:ewm-9594 comment this  discuss with  abhisek sir and mukesh sir,when:04/04/2023
      // this.snackBService.showErrorSnackBar(this.translateService.instant('label_DocumnetAtLeastOneEnable'),'400'); 
    }    
    this.isShowAll.emit(this.gridViewList);
    this.documentForm.patchValue({
      allDocument: this.gridViewList
    });
    this.sendDataToParent();
  }
 


/*
  @Type: File, <ts>
  @Name: someComplete function
  @Who: Adarsh singh
  @When: 30-Sep-2022
  @Why: EWM-8898 EWM-9090
*/

  someComplete(): boolean {
    if (this.gridViewList == null) {
      return;
    }
    return this.gridViewList.filter(t => t.IsHidden).length > 0 && !this.allComplete;
  }

/*
  @Type: File, <ts>
  @Name: updateAllComplete function
  @Who: Adarsh singh
  @When: 02-Aug-2022
  @When: 30-Sep-2022
  @What: update checked or unchecked checkbox for show
*/
  updateAllComplete() {  
    this.allComplete = this.gridViewList != null && this.gridViewList.every(t => t.IsHidden == 1);    
  }

  // mandatory
  /*
    @Type: File, <ts>
    @Name: setAllMandatory function
    @Who: Adarsh singh
    @When: 02-Aug-2022
     @When: 30-Sep-2022
    @What: to set all checked for show field for mandatory
  */

  setAllMandatory(completed: boolean) {
    if (completed) {
      this.allCompleteMandatory = completed;
      if (this.gridViewList == null) return;
      this.gridViewList.forEach((t)=> {
        let element = document.getElementById('MandatoryField'+t.DocumentId);
        element.style.pointerEvents = 'auto';
        t.IsMandatory = 1
      });
      this.gridViewList.forEach((t) => {t.IsHidden = 1});
      this.allComplete = true;     
    }
    else {
      this.allCompleteMandatory = completed;
      this.gridViewList.forEach(t => t.IsMandatory = 0);      
    }
  // who:maneesh,what:ewm-9594 comment this  discuss with  abhisek sir and mukesh sir,when:04/04/2023
    // this.isShowAllChecked.emit(this.gridViewList);
    this.isShowAll.emit(this.gridViewList);

    this.documentForm.patchValue({
      allDocument: this.gridViewList
    });
    this.sendDataToParent();
  }

/*
  @Type: File, <ts>
  @Name: someCompleteMandatory function
  @Who: Adarsh singh
  @When: 30-Sep-2022
  @Why: EWM-8898 EWM-9090
*/

  someCompleteMandatory() {
    if (this.gridViewList == null) {
      return;
    }
    return this.gridViewList.filter(t => t.IsMandatory).length > 0 && !this.allCompleteMandatory;
  }

/*
  @Type: File, <ts>
  @Name: updateAllCompleteMandatory function
  @Who: Adarsh singh
  @When: 02-Aug-2022
  @When: 30-Sep-2022
  @What: update checked or unchecked checkbox for mandatory
*/

  updateAllCompleteMandatory() {
    this.allCompleteMandatory = this.gridViewList != null && this.gridViewList.every(t => t.IsMandatory == 1);
  }
}
