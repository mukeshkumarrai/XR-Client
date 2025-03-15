/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 25-Nov-2020
  @Why: ROST-370 ROST-427
  @What:  This page will be use for the organization details Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { UserAdministrationService } from '../../shared/services/user-administration/user-administration.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { ImageUploadService } from '../../../../shared/services/image-upload/image-upload.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressBarComponent } from 'src/app/shared/address-bar/address-bar.component';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ResponceData } from 'src/app/shared/models';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  providers: [MessageService],
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss'],
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
export class OrganizationDetailsComponent implements OnInit {
  /*
  @Type: File, <ts>
  @Name: product-plan.component.html
  @Who: Renu
  @When: 20-Sep-2020
  @Why: ROST-307
  @What: decalration of global variables
   */
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public gridData: any[];
  public gridRegion: any[];
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public pageSize = 5;
  public gridView: any[];
  public mySelection: string[] = [];
  public active = false;
  public isNew = false;
  public editDataItem: String;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  organizationFrom: FormGroup;
  submitted = false;
  countryArray: any = [{ "id": 1, "name": "Europe" }, { "id": 2, "name": "Asia" }, { "id": 3, "name": "Americas" }, { "id": 4, "name": "Oceania" }];
  fileBinary: File;
  @ViewChild('fileInput') fileInput: ElementRef;
  myproductIcon = '';
  myfilename = '';
  selectedFiles = '';
  fileType;
  result: string = '';
  formtitle: string = 'grid';
  public loading: boolean;
  private rtl = false;
  private ltr = true;
  //public imageUrl=environment.imageUrl;
  public filePathOnServer: string;
  filePatImagePreview: string;
  organizationArray = {};
  viewMode: string = "listMode";
  //public activestatus: string;
  activestatus: string = 'Add';
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "OrganizationName,asc";
  public sortedcolumnName: string = "OrganizationName";
  public sortDirection = 'asc';
  isvisible: boolean;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  imagePreview: string;
  imagePreviewStatus: boolean = false;
  public imagePreviewloading: boolean = false;
  countryList = [];
  public searchValue: string = "";
  croppedImage: any;
  public maxCharacterLengthSubHead = 130;
  public loadingPopup: boolean;
  pageNumbers = 1
  pageSizes = '200'
  moreCountry: any;
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  countryBuffer = [];
  totalDataCount: any;
  selectedValue: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public loadingSearch: boolean;
  public specialcharPattern = "[A-Za-z0-9. ]+$";
  public specialcharPatternBrn = "[A-Z0-9. ]+$";
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  regEx =  /^(?![0-9]+$)[A-Za-z0-9_-]{2,5}$/;
  orgId:any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  searchSubject$ = new Subject<any>();
  currentUserId: string='00000000-0000-0000-0000-000000000000';
  UserType: number=0;
  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Renu
  @When: 20-Sep-2020
  @Why: ROST-307
  @What: For injection of service class and other dependencies
   */
  constructor(private fb: FormBuilder, private _userAdministrationService: UserAdministrationService, private _imageUploadService: ImageUploadService, private snackBService: SnackBarService, private route: Router, public _sidebarService: SidebarService, public _dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, public dialog: MatDialog,
    private appSettingsService: AppSettingsService, private translateService: TranslateService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
     //Who:Ankit Rawat, What:EWM-16893 EWM-16894 Increased organization name length 30 to 50 characters, When:30Apr24
    this.organizationFrom = this.fb.group({
      OrganizationName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      LogoPath: [''],
      Country_ID: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      CountryName: [''],
      Address1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      Address2: ['', [Validators.required,Validators.minLength(1), Validators.maxLength(100)]],
      City: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      State: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      Zip: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern("^[0-9]*$")]],
      BRN: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30),Validators.pattern(this.specialcharPatternBrn)]],
      Key: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(this.regEx)]],

      OrgId: [''],
      Id: [''],
      LogoPathUrl: [''],
    })
  }
  public ngOnInit() {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserId = currentUser?.UserId; /*--@why:14123,@when:29-09-2023,@who: Nitin Bhati--*/
    this.UserType = currentUser?.UserType;
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');

     /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
     this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
     //
     
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
  
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
    this.animationVar = ButtonTypes;

    // @suika @EWM-14427 @Whn 27-09-2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.sendRequest(val);
       });
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd, this.search, res);
    })
  }
  get f() { return this.organizationFrom.controls; }

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
  @Name: getOrganizationInfo function
  @Who: Nitin Bhati
  @When: 26-Nov-2020
  @Why: ROST-428
  @What: call Get method from services for showing data into grid.
   */
  
  getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue) {
    this.loading = true;
    this._userAdministrationService.getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue).subscribe(
      repsonsedata => {
        this.animate();
        /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
        this.totalDataCount = repsonsedata['TotalRecord'];
        this.gridData = repsonsedata['Data'];
        this.gridView = repsonsedata['Data'];
        this.loading = false;
        // this.reloadListData();
        // this.doNext();
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


   /*
   @Type: File, <ts>
   @Name: onFilter
   @Who: Suika
   @When: 27-Sept-2023
   @Why: EWM-14427
   @What: For search value
 */
public onFilter(inputValue: string): void {
  this.searchValue = inputValue;
  if (inputValue?.length > 0 && inputValue?.length <= 2) {
    this.loadingSearch = false;
    return;
  }
  this.searchSubject$.next(inputValue);
}

  /*
  @Type: File, <ts>
  @Name: sendRequest function
  @Who: Nitin Bhati
  @When: 26-Nov-2020
  @Why: ROST-428
  @What: For Filtering Records
   */
  public sendRequest(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    this.pagneNo = 1;
    let value = '';
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }  
    this._userAdministrationService.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata['Data'];
          this.gridData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
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
 

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

 
  public addHandler() {
    //this.editDataItem = new CountryMaster();
    this.isNew = true;
  }
  public editHandler({ dataItem }) {
    this.editDataItem = dataItem;
    this.isNew = false;
  }
 

  /**
    @(C): Entire Software
    @Type: Function
    @Who: Satya Prakash
    @When: 15-Dec-2020
    @Why:  Switch mode List and card
    @What: This function responsible to change list and card view
   */
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      // this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.isCardMode = true;
       this.isListMode = false;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.isCardMode = false;
      this.isListMode = true;
      // this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
    }
  }

  /*
@Type: File, <ts>
@Name: onScrollDown function
@Who: Renu
@When: 30-Dec-2020
@Why: ROST-485
@What: for pagination whenever user scroll down
*/

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      // Append elements
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.gridData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.userOrganizationListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }


  /*
    @Type: File, <ts>
    @Name: userOrganizationListScroll function
    @Who: Renu
    @When: 30-Dec-2020
    @Why: ROST-488
    @What: service call for listing sms list data on scroll
    */
  userOrganizationListScroll(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this._userAdministrationService.getOrganizationInfo(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          this.gridView = repsonsedata['Data'];
          // this.listData=repsonsedata['Data'];
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridData = this.gridData.concat(nextgridView);
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
  @Who: Renu
  @When: 15-Dec-2020
  @Why: ROST-488
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
    this._userAdministrationService.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          // document.getElementById('contentdata').scrollTo(0, 0)
          this.loading = false;
          this.gridData = repsonsedata['Data'];
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
      @Name: getsearchDataList function
      @Who: Nitin Bhati
      @When: 20-march-2021
      @Why: EWM-1205
      @What: use for upload image on server
    */
  getsearchDataList(event: any) {
    this.loadingPopup = true;
    if (event.target.value) {
      this._userAdministrationService.fetchCountryInfoSearch(event.target.value).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200') {
            this.countryList = repsonsedata['Data'];
            this.loadingPopup = false;
          }
        }, err => {
          this.loading = false;
          this.loadingPopup = false;
        })

    } else {
      this.pagneNo = 1;
      this.loadingPopup = false;
    }
  }
  /*
    @Type: File, <ts>
    @Name: onScrollToEnd
    @Who: Nitin Bhati
   @When: 20-March-2021
    @Why: EWM-1205
    @What: to scroll all country related info
    */
  onScrollToEnd() {
    this.fetchMore();
  }
  /*
    @Type: File, <ts>
    @Name: onScroll
    @Who: Nitin Bhati
    @When: 20-March-2021
    @Why: EWM-1205
    @What: to scroll all country related info
    */
  onScroll({ end }) {
    if (this.loading || this.countryList.length <= this.countryBuffer.length) {
      return;
    }
    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.countryBuffer.length) {
      this.fetchMore();
    }
  }
 

  /*
    @Type: File, <ts>
    @Name: fetchMore
    @Who: Nitin Bhati
    @When: 20-March-2021
    @Why: EWM-1205
    @What: to scroll all country related info
    */
  private fetchMore() {
    this.loadingPopup = false;
    const len = this.countryBuffer.length;
    const more = this.countryList.slice(len, this.bufferSize + len);
    if (!more) {
      this.pageNumbers = this.pageNumbers + 1
      this._userAdministrationService.getCountryInfo(this.pageNumbers, this.pageSizes).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200') {
            this.moreCountry = repsonsedata['Data'];
            this.countryList = this.countryList.concat(this.moreCountry);
            this.loadingPopup = false;
          }
        }, err => {
          this.loading = false;
          this.loadingPopup = false;
        })
    }
    //this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      //this.loading = false;
      this.countryBuffer = this.countryBuffer.concat(more);
    }, 200)
  }


  /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

  reloadApiBasedOnorg() {
    this.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
    this.formtitle = 'grid';
  }

 
  public onFilterClear(): void {
    this.searchValue = '';
    this.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
  }
  /*
     @Type: File, <ts>
     @Name: duplicayCheck function
     @Who: Nitin Bhati
     @When: 11-Nov-2021
     @Why: EWM-3710
     @What: For checking duplicacy for key type
    */
  duplicayCheck() {
    this._userAdministrationService.checkDuplicityOrganizationKey(this.organizationFrom.get("Key").value).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {

            this.organizationFrom.get("Key").setErrors({ codeTaken: true });
            this.organizationFrom.get("Key").markAsDirty();

          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Status == true) {

            this.organizationFrom.get("Key").clearValidators();
            this.organizationFrom.get("Key").markAsPristine();
            this.organizationFrom.get('Key').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(this.regEx)]);
            
          }
        }
        else if (repsonsedata.HttpStatusCode == 400) {
          this.organizationFrom.get("Key").clearValidators();
          this.organizationFrom.get("Key").markAsPristine();
          this.organizationFrom.get('Key').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(this.regEx)]);
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.loading = false;
        }

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

// refresh button onclick method by Adarsh Singh
  refreshComponent(){
    this.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
  }

  getOrgId(id){
    this.orgId = id.OrganizationAddress[0].OrgId;
    this.route.navigate(['./client/core/administrators/organization-details/add-organization-details'], {queryParams: {id:this.orgId}});
  }
}
