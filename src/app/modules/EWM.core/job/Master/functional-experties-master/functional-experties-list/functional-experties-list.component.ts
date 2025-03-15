/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
  @When: 21-May-2021
  @Why: EWM-1445 EWM-1596
  @What:  This page will be use for Tag List Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
@Component({
  providers: [MessageService],
  selector: 'app-functional-experties-list',
  templateUrl: './functional-experties-list.component.html',
  styleUrls: ['./functional-experties-list.component.scss'],
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
export class FunctionalExpertiesListComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/

  loading: boolean = false;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  private rtl = false;
  private ltr = true;
  public listData: any[] = [];
  public pageSize = 5;
  public listView: any[];
  public formtitle: string = 'grid';
  public active = false;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  viewMode: string = "listMode";
  @Input() name: string;
  searchChar: string;
  result: string = '';
  activestatus: string = 'Add';
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "FunctionalExpertise,asc";
  public sortedcolumnName: string = 'FunctionalExpertise';
  public sortDirection = 'asc';
  isvisible: boolean=false;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  private targetInput = 'Description';
  public searchValue: string = "";
  public maxCharacterLengthSubHead = 130;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;
  public userpreferences: Userpreferences;
  public pageLabel : any = "label_functionalExpertiesHead";
   // animate and scroll page size
   pageOption: any;
   animationState = false;

   animationVar: any;
   public isCardMode:boolean = false;
   public isListMode:boolean = true;
   dirctionalLang
  searchSubject$ = new Subject<any>();
  public loadingSearch: boolean;
  fetchfunctionalExpertiesData: Subscription;
   // animate and scroll page size
  // next: number = 0;
  // listDataview: any[] = [];
  /* 
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
   @What:  This page will be use for the Functional Experties list Component ts file
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private jobService: JobService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, private systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file

    this.pagesize = this.appSettingsService.pagesize;

    this.auditParameter = encodeURIComponent('Functional Expertise Master');

  }
  /* 
 @Type: File, <ts>
 @Name: ngOnInit function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
 @What: For calling 
 */
  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    this.userpreferences = this._userpreferencesService.getuserpreferences();


    this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue)
    this.animationVar = ButtonTypes;
     //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
     this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue)
    });
  }



  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    })

    ///////geting Data Via Routing from add people Master component///////
    this.routes.queryParams.subscribe((params) => {
      this.viewMode = params['viewModeData'];
    });
    this.switchListMode(this.viewMode);
  }
  // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pagneNo=1;
    this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue)
  }
  //////////////////

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
  @Name: onAdd() function 
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: For Navigate add form and also sending data via routing
  */

  onAdd() {
    let ViewModeDataValue: any = this.viewMode
    this.route.navigate(['/client/core/administrators/functional-experties/add-functional-experties'], {
      queryParams: { ViewModeDataValue }
    })
  }


  /*
  @Type: File, <ts>
  @Name: onEdit() function 
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: For Navigate Edit form and also sending data via routing
  */
  onEdit(id) {
    let ViewModeDataValue: any = this.viewMode
    this.route.navigate(['/client/core/administrators/functional-experties/add-functional-experties', { id: id }], {
      queryParams: { ViewModeDataValue }
    })
  }



  /* 
  @Type: File, <ts>
  @Name: fetchfunctionalExpertiesList function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: service call for List data
  */
  fetchfunctionalExpertiesList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.fetchfunctionalExpertiesData=this.jobService.fetchfunctionalExpertiseList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listView = repsonsedata['Data'];
          this.listData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
 //  who:maneesh,what:ewm-12630 for apply debounce and handel 204 ,when:08/06/2023
        }else if(repsonsedata['HttpStatusCode'] ===204){
          this.loading = false;
          this.loadingSearch = false;
          this.listView = repsonsedata['Data'];
          this.listData = repsonsedata['Data'];
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
  @Name: fetchfunctionalExpertiesList function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: service call for searching  List data
  */
  //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
  fetchfunctionalExpertiesListSearch(value){
    if (value.length > 0 && value.length < 3) {
        return;
    }
   this.loadingSearch = true;
   this.pagneNo = 1;
   //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
     this.searchSubject$.next(value);
   }
   // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
    
  // fetchfunctionalExpertiesListSearch(event: any) {
  //   this.searchChar = event.target.value;
  //   let numberOfCharacters = event.target.value.length;
  //   this.pagneNo = 1;
  //   let maxNumberOfCharacters = 3;
  //   if (numberOfCharacters < 1 || numberOfCharacters > 3) {
  //     if (numberOfCharacters > maxNumberOfCharacters) {
  //       this.loadingPopup = true;
  //       this.listData = []
  //       this.jobService.fetchfunctionalExpertiseListSearch(this.searchChar).subscribe(
  //         repsonsedata => {
  //           this.loadingPopup = false;
  //           this.listData = repsonsedata['Data'];
  //           // this.reloadListData();
  //           // this.doNext();
  //           // this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue)

  //         }, err => {
  //           this.loadingPopup = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //         })
  //     } else {
  //       this.jobService.fetchfunctionalExpertiseList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,).subscribe(
  //         repsonsedata => {
  //           this.listData = repsonsedata['Data'];
  //           // this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue)
  //           this.loadingPopup = false;
  //         }, err => {
  //           this.loading = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //           this.loadingPopup = false;
  //         })
  //     }
  //   }
  // }



  /**
    @(C): Entire Software
    @Type: Function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
    @What: This function responsible to change list and card view
   */
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.isCardMode = true;
      this.isListMode = false;
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.isCardMode = false;
      this.isListMode = true;
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "listMode";
      this.isvisible = false;
      // listHeader.classList.remove("hide");
      this.animate();
    }

    localStorage.setItem("mode", this.viewMode);
  }


  /* 
  @Type: File, <ts>
  @Name: DeletefetchfunctionalExpertiesList function 
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: call Api for delete record using ID.
  */
  public deletestatus: boolean;
  confirmDialog(val: any,index): void {
    const formData = {
      SmsId: val
    };
    const message = `label_titleDialogContent`;
    const subtitle = 'label_functionalExperties';
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
        this.jobService.deletefunctionalExpertiseById(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              //this.listDataview.splice(index, 1);
              this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);

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
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: for pagination whenever user scroll down
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.listData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchfunctionalExpertiesListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }


  /* 
  @Type: File, <ts>
  @Name: fetchfunctionalExpertiesListScroll function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: service call for listing sms list data on scroll
  */
  fetchfunctionalExpertiesListScroll(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this.jobService.fetchfunctionalExpertiseList(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
          //console.log(this.listData,uniqueUsers,"Data")
          this.listView = this.listData;
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
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: This function is used for sorting asc /desc based on column Clicked
  */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this.jobService.fetchfunctionalExpertiseList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          document.getElementById('contentdata').scrollTo(0, 0)
          this.loading = false;
          this.listData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
          this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue)

          this.loadingscroll = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1596
  @What: Reload Api's when user change organization
 */

  reloadApiBasedOnorg() {
    this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
    this.formtitle = 'grid';
  }


   /*
@Name: onFilterClear function
@Who: Nitin Bhati
@When: 19-Dec-2021
@Why: EWM-2274
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchValue='';
  this.fetchfunctionalExpertiesList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
}

  // doNext() {
  //   if (this.next < this.listData.length) {
  //     this.listDataview.push(this.listData[this.next++]);
  //   }
  // }

  //  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  //  reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // }


  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the fetchfunctionalExpertiesList API 
*/
ngOnDestroy(): void {
  this.fetchfunctionalExpertiesData.unsubscribe();
 
 }
}