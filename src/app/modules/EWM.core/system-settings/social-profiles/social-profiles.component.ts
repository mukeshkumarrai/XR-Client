/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 18-May-2021
  @Why: EWM-1481 EWM-1554
  @What:  This page will be use for the Social Profile Cmponent ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { SystemLookFeelService } from '../../shared/services/look-n-feel/system-look-feel.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-social-profiles',
  templateUrl: './social-profiles.component.html',
  styleUrls: ['./social-profiles.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
    transition("* => void", [
      animate(
        300,
        keyframes([
          style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
        ])
      )
    ])
    ]),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class SocialProfilesComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  status: boolean = false;
  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;

  public logoPreviewUrl: string;
  public logoImagePath: string;
  public selectedFiles = '';
  public fileBinary: File;
  imagePreview: string;
  imagePreviewStatus: boolean;
  public imagePreviewloading: boolean = false;
  public imagePreviewFeviconloading: boolean = false;
  private rtl = false;
  private ltr = true;
  public socailListData: any[];
  public isNew = false;
  public previousNext = true;
  public listView: any[];
  public type: 'numeric' | 'input' = 'numeric';
  public info = true;
  public buttonCount = 5;
  public mySelection: string[] = [];
  public formtitle: string = 'grid';
  public active = false;
  socialProfileForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  viewMode: string = "listMode";
  public personTag: string = '';
  public jobTag: string = '';
  public smstemplate: string = '';
  @Input() name: string;
  searchChar: string;
  croppedImage: any;
  result: string = '';
  public smstemplateDescriptuion: string = '';
  ckeConfig: any;
  show = false;
  showMore: boolean;
  showLess = false;
  divId;
  //public activestatus: string;
  activestatus: string = 'Add';
  smsById;
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon: string;
  public descIcon: string;
  orderBy: string = "ProfileName,asc";
  public sortedcolumnName: string = 'ProfileName';
  public sortDirection = 'asc';
  isvisible: boolean;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  private targetInput = 'Description';
  public searchVal: string = "";
  public maxCharacterLengthSubHead = 130;
  moduleArray: any = [];
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  remainingchr: number = 1600;
  totalDataCount: any;
  selectedModuleName: any;
  public auditParameter;
  public idSms = '';
  public idName = 'Id';
  IconImagePath: string;
  IconPreviewUrl: string;
  addUserTypeForm: any;
  pageNo: number = 1;
  next: number = 0;
  listDataview: any[] = [];
  pageLabel: any = "label_socialProfile";
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  dirctionalLang;
  searchSubject$ = new Subject<any>();
  public loadingSearch: boolean;
  socialProfileData: Subscription;

  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Satya Prakash Gupta
  @When: 18-May-2021
  @Why: EWM-1481 EWM-1554
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private _appSetting: AppSettingsService, public _systemLookFeelService: SystemLookFeelService, private _imageUploadService: ImageUploadService, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('Social Profile');
  }
  /* 
  @Type: File, <ts>
  @Name: ngOnInit function
  @Who: Satya Prakash Gupta
  @When: 18-May-2021
  @Why: EWM-1481 EWM-1554
  @What: For calling 
 */
  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.socialProfileList(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.animationVar = ButtonTypes;
   //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
   this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
   this.loadingSearch = true;
   this.socialProfileList(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
  });
  }
 // refresh button onclick method by Piyush Singh
refreshComponent(){
  this.pagneNo=1;
  this.socialProfileList(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
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
   @Name: socialProfileList function
   @Who: Satya Prakash Gupta
   @When: 18-May-2021
   @Why: EWM-1481 EWM-1554
   @What: service call for creating Sms data
   */
  socialProfileList(pagneNo, pagesize, orderBy, searchVal) {
    this.loading = true;
    this.socialProfileData=this.systemSettingService.fetchSocialProfile(pagneNo, pagesize, orderBy, searchVal).subscribe(
      repsonsedata => { 
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.animate();
          this.loading = false;
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listView = repsonsedata['Data'];
          this.socailListData = repsonsedata['Data'];
          this.loadingSearch = false;

          // this.reloadListData();
          // this.doNext();
        } //  who:maneesh,what:ewm-12630 for in  case 204 apply debounce when search data,when:06/06/2023
        else if(repsonsedata['HttpStatusCode'] === 204) { 
           this.loadingSearch = false;
           this.socailListData = repsonsedata['Data'];
           this.loading = false;
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /* 
    @Type: File, <ts>
    @Name: socialProfileList function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: service call for searching Sms data
  */
     //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
     socialProfileListSearch(value)
     {
        if (value.length > 0 && value.length < 3) {
          return;
        }
        this.loadingSearch = true;
        this.pagneNo=1;
        this.searchSubject$.next(value);
     }
     // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
 
  // socialProfileListSearch(event: any) {
  //   this.searchChar = event.target.value;
  //   let numberOfCharacters = event.target.value.length;
  //   this.pagneNo = 1;
  //   let maxNumberOfCharacters = 3;
  //   if (numberOfCharacters < 1 || numberOfCharacters > 3) {
  //     if (numberOfCharacters > maxNumberOfCharacters) {
  //       this.loadingPopup = true;
  //       this.systemSettingService.fetchSocialProfileSearch(this.searchChar).subscribe(
  //         repsonsedata => {
  //           this.loadingPopup = false;
  //           this.socailListData = repsonsedata['Data'];
  //           // this.reloadListData();
  //           // this.doNext();
  //         }, err => {
  //           this.loadingPopup = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //         })
  //     } else {
  //       this.systemSettingService.fetchSocialProfile(this.pagneNo, this.pagesize, this.orderBy, this.searchVal).subscribe(
  //         repsonsedata => {
  //           this.socailListData = repsonsedata['Data'];
  //         }, err => {
  //           this.loading = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //         })
  //     }
  //   }
  // }
  /**
    @(C): Entire Software
    @Type: Function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: This function responsible to change list and card view
  */
  // switchListMode(viewMode) {
  //   let listHeader = document.getElementById("listHeader");
  //   if (viewMode === 'cardMode') {
  //     this.maxCharacterLength = 80;
  //     this.maxCharacterLengthName = 40;
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //   } else {
  //     this.maxCharacterLength = 80;
  //     this.maxCharacterLengthName = 40;
  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     listHeader.classList.remove("hide");
  //     this.animate();
  //   }
  // }

  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
       //listHeader.classList.remove("hide");
     }
   }



  /* 
    @Type: File, <ts>
    @Name: DeleteSocailProfile function 
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: call Api for delete record using ID.
  */
  public deletestatus: boolean;
  DeleteSocailProfile(val,index): void {
    const message = `label_titleDialogContent`;
    const subtitle = 'label_socialProfile';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        this.systemSettingService.deleteSocialProfile(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.listDataview.splice(index, 1);
              this.socialProfileList(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
              this.socialProfileForm.reset();
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
            this.cancel.emit();
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	

  }
  /* 
    @Type: File, <ts>
    @Name: onScrollDown function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: for pagination whenever user scroll down
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.socailListData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.socialProfileListScroll(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
    }
  }


  /* 
    @Type: File, <ts>
    @Name: socialProfileListScroll function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: service call for listing sms list data on scroll
  */
  socialProfileListScroll(pagneNo, pagesize, orderBy, searchVal) {
    // this.loadingscroll=true;
    this.systemSettingService.fetchSocialProfile(pagneNo, pagesize, orderBy, searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.socailListData = this.socailListData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.socailListData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.socailListData = uniqueUsers;
         // console.log(this.socailListData,uniqueUsers,"Data")

          this.listView = this.socailListData;
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: This function is used for sorting asc /desc based on column Clicked
  */

  /*
    @Type: File, <ts>
    @Name: short column  
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: To short column on the basis of column name.
  */

  onSort(columnName)
{
  this.loading = true;
  this.sortedcolumnName=columnName;
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.ascIcon='north';
  this.descIcon='south';
  this.orderBy=this.sortedcolumnName+','+this.sortDirection;
  this.pagneNo=1;
  this.socialProfileList(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
}


  /**
    @(C): Entire Software
    @Type: Function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @Why:  Open for modal window
    @What: This function responsible to open and close the modal window.
    @Return: None
    @Params : 1. param -button name so we can check it come from which link.
  */
  imagePreviewModal(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '240px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated','animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // doNext() {
  //   if (this.next < this.socailListData.length) {
  //     this.listDataview.push(this.socailListData[this.next++]);
  //   }
  // }

  
  // /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  // reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // }
  public onFilterClear(): void {
    this.searchVal='';
    this.socialProfileList(this.pagneNo, this.pagesize, this.orderBy, this.searchVal);
  }

  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the socialProfileData API 
*/
ngOnDestroy(): void {
  this.socialProfileData.unsubscribe();

}
}
