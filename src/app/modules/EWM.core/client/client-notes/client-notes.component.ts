/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 14-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What:  This page will be use for client Notes
*/

import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { Subject, Subscription } from 'rxjs';
import { ViewNotesComponent } from 'src/app/modules/EWM-Candidate/recentnotes/view-notes/view-notes.component';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CustomValidatorService } from '../../../../shared/services/custome-validator/custom-validator.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { customDropdownConfig } from '../../shared/datamodels';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { ClientService } from '../../shared/services/client/client.service';
import { JobService } from '../../shared/services/Job/job.service';
import { ClientJobCategoryComponent } from './client-job-category/client-job-category.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { OwnerFilterComponent } from './owner-filter/owner-filter.component';
import { ButtonTypes } from 'src/app/shared/models';
import { debounceTime } from 'rxjs/operators';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { XRNotifications,NotifyUser, clientNotesEntity } from '@app/shared/models/notes';
import { SearchNoteByContactComponent } from './search-note-by-contact/search-note-by-contact.component';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-client-notes',
  templateUrl: './client-notes.component.html',
  styleUrls: ['./client-notes.component.scss']
})
export class ClientNotesComponent implements OnInit, OnDestroy {

  @ViewChild('asignJob') public asignJob: MatSidenav;
  @ViewChild('notesAdd') public notesAdd: MatSidenav;
  @Output() clientNotesCount = new EventEmitter();
  public filterConfig: any;//<!-- who:Bantee,why:ewm.11723 Two popup open on on click filter button ,when:10/04/2023 -->
  public loadingscroll: boolean;
  public loading: boolean;
  public positionMatDrawer: string = 'end';
  mobileQuery: MediaQueryList;
  yearFilter: MediaQueryList;
  private _mobileQueryListener: () => void;
  public clientId: any;
  @Input() clientIdData: any;
  public userpreferences: Userpreferences;
  public gridList: any = [];
  public gridMonthYearCount: any;
  public pagesize: any;
  public pagneNo: any = 1;
  public currentYear: number;
  public clientNotesForm: FormGroup;
  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public dateFill = new Date();
  public today = new Date();
  public todayOpenDate = new Date();
  public todayFillDate = new Date();
  public selectedFiles: any;
  public fileBinary: File;
  public myfilename = '';
  public filePath: any;
  public previewUrl: any;
  public maxMessage: number = 200;
  @ViewChild('notesAdd') public sidenav: MatSidenav;
  notesCategory: any;
  public selectedCategory: any = {};
  public dropDoneConfig: customDropdownConfig[] = [];
  CategoryId: any;
  public activestatus: string = 'Add';
  accessEmailId: any = [];
  changeText: boolean = false;
  public yearFilterRes: number;
  public monthFilterRes: string;
  public GridId = 'ClientNotes_grid_001';
  public filterCount: number = 0;
  public isShowFilter: boolean = false;
  public colArr: any = [];
  public isReadMore: any[] = [false];
  public columns: ColumnSetting[] = [];
  public ToDate: any;
  public FromDate: any;
  public OwnerIds: any = [];
  public assignJobDrawerPos: string;
  public notesDrawerPos: string = 'end';
  public oldPatchValues: any;
  public formHeading: string;
  public CategoryIds: any = [];
  public selectedIndex: number = null;
  @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
  public totalDataCount: number;
  public hoverIndex: number = -1;
  public tagNotesKey: any[] = [];
  public maxCharacterLengthSubHead = 500;
  public filterCountCategory: number = 0;
  public filterCountOwner: number = 0;
  public canLoad = false;
  public pendingLoad = false;
  public filterCountDate: any = 0;
  documentTypeOptions: any;
  uploadedFileName: any;
  timelineMonth: any;
  timelineYear: any;
  isCategory: boolean = true;
  public oldPatchValuesAccessMode: any = [];
  public hideAddButton: boolean = false;
  isDrawerOpened: boolean = false;
  getDateFormat: any;
  AccessName: any;
  AccessId: any;
  dirctionalLang;
  selectedItemListForActiveClass = null;
  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  //  kendo image uploader Adarsh singh 01-Aug-2023
  @ViewChild('editor') editor: EditorComponent;
  subscription$: Subscription;
  saveEnableDisable: boolean = false;
  // End
  animationVar: any;
  public searchSubject$ = new Subject<any>();
  public searchNotes: Subscription;
  public loadingSearch: boolean;
  public searchValue: string = '';
  public gridListData: any = [];
  public searchdata: any = [];
  public selectedOrDeSelected = [];
  public oldValue: any = [];
  public currentCatogryValue: [] = [];
  public selectedorDeselectedOwner: [];

  //Who:Ankit Rawat, What:EWM-16073-EWM-16218 Add new control Contact Dropdown, When:27Feb24
  public ContactsDropdownConfig: DRP_CONFIG;
  public selectedContactsItems: any = {};
  public currentMenuWidth: number;
  public maxMoreLengthForContacts: number = 5;
  public contactList: string;
  uniqueId: number=0;
  //Who:Renu, What:EWM-16207 EWM-16299 @Why: for new editor with tagging, When:04-mar-2024
  mentionList: any[] = [];
  ShowEditor: boolean;
  public showErrorDesc: boolean = false;
  ownerList: string[] = [];
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string;
  logedInUser: string;
  public gridListView: any = [];
  activatedRoute: any;
  notificationLoading:string='label_loading';
 getRequiredValidationMassage: Subject<any> = new Subject<any>();
  ContactsIds: any=[];
  filterCountContacts: number = 0;
  public selectedorDeselectedContact: [];
  @Input() dataTotalJob:any;
  PatchFromDate: string;
  PatchToDate: string;
  CallReferenceId:number;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private fb: FormBuilder, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private http: HttpClient,
    private jobService: JobService, private snackBService: SnackBarService, private clientService: ClientService,private router: Router,
    public candidateService: CandidateService, private renderer: Renderer2,
    private serviceListClass: ServiceListClass, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,private cache : CacheServiceService) {
    // who:maneesh,what:ewm-11655 for access name public value  ,when:19/04/2023
    this.logedInUser= JSON.parse(localStorage.getItem('currentUser'));
    this.AccessName = this.appSettingsService.getDefaultaccessName;
    this.AccessId = this.appSettingsService.getDefaultAccessId;
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this.yearFilter = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.pagesize = appSettingsService.pagesize;
    this.currentYear = (new Date()).getFullYear();
    this.clientNotesForm = this.fb.group({
      // @When: 13-03-2023 @who:maneesh singh @why: EWM-10160 add    [placeholder]="getDateFormat"  and remove open method
      NotesDate: ['', [Validators.required, CustomValidatorService.dateValidator]],
      CategoryId: [''],
      // who:maneesh,what:ewm-15142 fixed validation ,when:16/11/2023
      Subject: ['', [Validators.maxLength(200)]],
      Description: ['', [Validators.required]],
      file: [''],
      AccessId: [],
      AccessName: ['', [Validators.required]],
      ClientId: [],
      Id: []
    });
    this.fileType = appSettingsService.file_file_type_extralarge;
    // who:bantee,what:ewm-13757 ,when:16/08/2023

    this.fileSizetoShow = appSettingsService.file_file_size_extraExtraLarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }

    this.yearFilterRes = this.currentYear;

    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    })
  }

  ngOnInit(): void {
    this.activatedRoute = this.routes.url;
    //Who:Ankit Rawat, What:EWM-16073-EWM-16218 Add new control Contact Dropdown, When:27Feb24
    this.selectedContactsItems = []
    this.dropdownConfigContacts();
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForContacts();
    //  who:maneesh:what:ewm-15142 for searchdata,when:20/11/2023
    this.searchNotes = this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, value);
      this.getClientYearMonthList();
    });
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.routes.queryParams.subscribe((value) => {
      if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
        this.clientId = value.clientId;
      }
    });

    this.commonserviceService.onClientSelectId.subscribe(value => {
      if (value !== null) {
        this.clientIdData = value;
        this.getFilterConfig(true);
        this.getClientYearMonthList();
        // add api calling when change client dropdown ewm-18382 when:30/10/2024
        this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
        //  this.getNoteCateogoryList();
      }
    })

    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType=CLIE' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDoneConfig['placeholder'] = 'label_notesCategory';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/notes-category';
    this.dropDoneConfig['bindLabel'] = 'CategoryName';
    this.dropDoneConfig['IsRequired'] = true;
    localStorage.removeItem('ClientNotes_grid_001');
    this.getFilterConfig(true);
    this.getClientYearMonthList();
    //this.getNoteCateogoryList();
    this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
    this.animationVar = ButtonTypes;
  }
  ngAfterViewInit() {
    this.routes.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
        this.sidenav.close();
        this.uniqueId = value?.uniqueId;
        this.clientIdData= value?.clientId;
        this.formHeading = 'View';
        this.sidenav.toggle();
        this.gridListView=[];
        this.viewNotesById(this.uniqueId,this.formHeading,this.clientIdData); 
        if(this.clientIdData!=value?.clientId){
          this.clientIdData = value?.clientId;
          this.getFilterConfig(true);
         this.getClientYearMonthList();
        }
      }
    });
  }
  viewNotesById(Id: number,formtype:string,clientIdData:string) {
    this.formHeading = formtype;
    this.loading = true;
    this.clientService.getRedirectedClientNotebyid('?ClientId='+clientIdData+'&NotesId='+Id)
    .subscribe(
      (data: ResponceData) => {
        this.router.navigate([],{
          relativeTo: this.activatedRoute,
          queryParams: {uniqueId: null},
          queryParamsHandling: 'merge'
         });
        if (data.HttpStatusCode === 200) {
          this.notificationLoading='label_RecordDeleted';
          this.loading = false;
          this.gridListView?.push(data.Data);
          }
        else if (data.HttpStatusCode === 204) {
          this.loading = false;
          this.gridListView=[];
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
   /*
     @Type: File, <ts>
     @Name: openAsignJob
     @Who: Renu
     @When: 20-Dec-2021
     @Why: EWM-3751/4175
     @What: when openAsignJob
   */
     addNotes(){
      this.clientNotesForm.enable();
       this.formHeading='Add';
       this.clientNotesForm.reset();
       this.selectedCategory={};
       this.oldPatchValues=[];
       this.maxMessage=200;
       this.isDrawerOpened = false;
       this.fileAttachments=[];
       this.EditorEventCapture();
       this.getEditorVal='';
  }

  /*
 @Type: File, <ts>
 @Name: openFilterModalDialog function
 @Who: Renu
 @When: 26-oct-2021
 @Why: ROST-1734 EWM-3271
 @What: For opening filter  dialog box
  */

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: 'ClientNotes_grid_001' }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data.length;
        let filterParamArr = [];
        res?.data?.forEach(element => {
          filterParamArr?.push({
            'FilterValue': element.ParamValue,
            'ColumnName': element.filterParam.Field,
            'ColumnType': element.filterParam.Type,
            'FilterOption': element.condition,
            'FilterCondition': 'AND'
          })
        });
        this.loading = true;
        let jsonObjFilter = {};
        jsonObjFilter['ClientId'] = this.clientIdData;
        jsonObjFilter['Year'] = this.yearFilterRes ? this.yearFilterRes : 0;
        jsonObjFilter['Month'] = this.monthFilterRes ? this.monthFilterRes : '';
        if (this.OwnerIds) {
          jsonObjFilter['OwnerIds'] = this.OwnerIds;
        } else {
          jsonObjFilter['OwnerIds'] = [];
        }
        if (this.CategoryIds) {
          jsonObjFilter['CategoryIds'] = this.CategoryIds;
        } else {
          jsonObjFilter['CategoryIds'] = [];
        }
        if (this.ContactsIds) {
          jsonObjFilter['ContactId'] = this.ContactsIds;
        } else {
          jsonObjFilter['ContactId'] = [];
        }

        jsonObjFilter['NotesFilterParams'] = filterParamArr;
        jsonObjFilter['PageNumber'] = this.pagneNo;
        jsonObjFilter['PageSize'] = this.pagesize;
        //jsonObjFilter['OrderBy']='';
        jsonObjFilter['OrderBy'] = 'LastUpdated, ASC';
        jsonObjFilter['GridId'] = this.GridId;
        jsonObjFilter['FromDate'] = this.FromDate ? this.FromDate : null;
        jsonObjFilter['ToDate'] = this.ToDate ? this.ToDate : null;
        let jsonObjFilterG = {};
        this.filterConfig = filterParamArr;
        jsonObjFilterG['FilterConfig'] =res?.data?.length=='0'? null:filterParamArr;
        jsonObjFilterG['GridConfig'] = this.colArr;
        var element = document.getElementById("filter-advance");
        element.classList.add("active");
        this.cache.setLocalStorage(this.GridId,JSON.stringify(jsonObjFilterG));
        this.clientService.fetchClientNotesAll(jsonObjFilter).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
              this.gridList = repsonsedata.Data;
              this.totalDataCount = repsonsedata.TotalRecord;
              this.hideAddButton = true;
              this.getClientYearMonthList();
              //this.getFilterConfig(false);
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

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
    @Name: onCategorychange
    @Who: Renu
    @When: 15-Dec-2021
    @Why: EWM-3751/4175
    @What: when category drop down changes
  */
  onCategorychange(data) {
    if (data == null || data == '') {
      this.isCategory = true;
    } else {
      this.isCategory = false;
      this.CategoryId = data.Id;
    }
    this.CategoryId = data.Id;

  }

  ngOnDestroy(): void {
    this.subscription$?.unsubscribe();
    this.searchNotes?.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getClientYearMonthList() {
    let jsonObj = {};
    jsonObj['ClientId'] = this.clientIdData;
    if (this.OwnerIds) {
      jsonObj['OwnerIds'] = this.OwnerIds;
    } else {
      jsonObj['OwnerIds'] = [];
    }
    if (this.CategoryIds) {
      jsonObj['CategoryIds'] = this.CategoryIds;
    } else {
      jsonObj['CategoryIds'] = [];
    }
    if (this.ContactsIds) {
      jsonObj['ContactId'] = this.ContactsIds;
    } else {
      jsonObj['ContactId'] = [];
    }
    if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
      jsonObj['NotesFilterParams'] = this.filterConfig;
    } else {
      jsonObj['NotesFilterParams'] = [];
    }
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    jsonObj['GridId'] = this.GridId;
    jsonObj['Search'] = this.searchValue;
    this.clientService.fetchNotesMonthYearCountAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridMonthYearCount = data.Data;
            this.loading = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridMonthYearCount = [];
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;

          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }
  setIndex(index: number) {
    this.selectedIndex = index;
  }


  /*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who: Renu
   @When: 26-oct-2021
   @Why: ROST-1734 EWM-3271
   @What: FOR DIALOG BOX confirmation
 */

  clearFilterData(viewMode: string): void {
 // @When: 31-07-2024 @who:Amit @why: EWM-17747 @what: label changes
    const message = ``;
    const title = '';
    const subTitle = 'label_Notes_Filterbycategory';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
      if (dialogResult == true) {
        //this.filterConfig = [];

        this.loading = true;
        let jsonObj = {};
        if (viewMode == 'Owner') {
          this.OwnerIds = [];
        }
        if (viewMode == 'Contact') {
          this.ContactsIds = [];
        }
        if (viewMode == 'Category') {
          this.CategoryIds = [];
        }
        if (viewMode == 'Filter') {
          this.filterConfig = [];
        }
        jsonObj['ClientId'] = this.clientIdData;
        jsonObj['Year'] = this.currentYear ? this.currentYear : 0;
        jsonObj['Month'] = this.monthFilterRes ? this.monthFilterRes : '';

        jsonObj['OwnerIds'] = viewMode == 'Owner' ? [] : this.OwnerIds;
        jsonObj['CategoryIds'] = viewMode == 'Category' ? [] : this.CategoryIds;
        if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
          jsonObj['NotesFilterParams'] = viewMode == 'Filter' ? [] : this.filterConfig;
        } else {
          jsonObj['NotesFilterParams'] = [];
        }
        //jsonObj['NotesFilterParams'] = viewMode == 'Filter' ? [] : this.filterConfig;
        jsonObj['ContactId'] = viewMode == 'Contact' ? [] : this.ContactsIds;

        jsonObj['PageNumber'] = this.pagneNo;
        jsonObj['PageSize'] = this.pagesize;
        //jsonObj['OrderBy']='';
        jsonObj['OrderBy'] = 'LastUpdated, ASC';
        jsonObj['GridId'] = this.GridId;

        if (viewMode == 'Date') {
          this.FromDate = null;
          this.ToDate = null;
        }
        jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
        jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
        //this.filterCountContacts=0;
        //this.filterCountDate=0;
        //this.ContactsIds=[];
        let jsonObjFilterG = {};
        jsonObjFilterG['FilterConfig'] =viewMode == 'Filter' ? null : this.filterConfig;
        jsonObjFilterG['GridConfig'] = this.colArr;
        this.clientService.fetchClientNotesAll(jsonObj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
              this.gridList = repsonsedata.Data;
              this.totalDataCount = repsonsedata.TotalRecord;
              this.hideAddButton = true;
              this.cache.setLocalStorage(this.GridId,JSON.stringify(jsonObjFilterG));
              this.getClientYearMonthList();
              //this.getFilterConfig(false);
              if (viewMode == 'Category') {
                this.filterCountCategory = 0;
                this.selectedOrDeSelected.forEach(ele => {
                  ele['IsSelected'] = 0;
                })
                sessionStorage.removeItem('SelectedClieNotsCatogry');
                var element = document.getElementById("filter-category");
                element.classList.remove("active");
              }
              if (viewMode == 'Owner') {
                this.filterCountOwner = 0;
                this.selectedorDeselectedOwner = [];//who:maneesh,what:ewm-15980,when:08/02/2024
                var element = document.getElementById("filter-owner");
                element.classList.remove("active");
              }
              if (viewMode == 'Date') {
                this.filterCountDate = 0;
                var element = document.getElementById("filter-date");
                element.classList.remove("active");
              }

              if (viewMode == 'Filter') {
                this.filterCount = 0;
                var element = document.getElementById("filter-advance");
                element.classList.remove("active");
              }
              if (viewMode == 'Contact') {
                this.filterCountContacts = 0;
                this.selectedorDeselectedContact = [];
                var element = document.getElementById("filter-contacts");
                element.classList.remove("active");
              }
            }
             else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
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



  getClientNotesList(clientId: any, year: number, month: string, pageNo, value) {
    this.searchdata = value;
    this.timelineMonth = month;
    this.timelineYear = year;
    this.loading = true;
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj = {};
    jsonObj['ClientId'] = this.clientIdData;
    jsonObj['search'] = value;
    jsonObj['Year'] = this.yearFilterRes ? this.yearFilterRes : 0;
    jsonObj['Month'] = this.monthFilterRes ? this.monthFilterRes : '';
    if (this.OwnerIds) {
      jsonObj['OwnerIds'] = this.OwnerIds;
    } else {
      jsonObj['OwnerIds'] = [];
    }
    if (this.CategoryIds) {
      jsonObj['CategoryIds'] = this.CategoryIds;
    } else {
      jsonObj['CategoryIds'] = [];
    }
    if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
      jsonObj['NotesFilterParams'] = this.filterConfig;
    } else {
      jsonObj['NotesFilterParams'] = [];
    }
    if (this.ContactsIds) {
      jsonObj['ContactId'] = this.ContactsIds;
    } else {
      jsonObj['ContactId'] = [];
    }
    //jsonObj['NotesFilterParams'] =this.filterConfig;
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
    jsonObj['OrderBy'] = 'LastUpdated, ASC';
    jsonObj['GridId'] = this.GridId;
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    this.clientService.fetchClientNotesAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.totalDataCount = data.TotalRecord;
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loading = false;
            this.loadingSearch = false;
            this.hideAddButton = true;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loading = false;
            this.loadingSearch = false;
            this.hideAddButton = false;
          }
          else {
            this.gridListData = data.Data;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingSearch = false;

          }
        }, err => {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }
  /*
@Type: File, <ts>
@Name: dirChange
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
@What: for ltr and rtr
*/
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }


  /*
     @Type: File, <ts>
     @Name: selectFile function
     @Who: Renu
     @When: 14-Aug-2021
     @Why: ROST-2493
     @What: on selecting file
   */

  selectFile(fileInput: any) {
    this.selectedFiles = fileInput.target.files;
    this.fileBinary = fileInput.target.files[0];
    if (!this.validateFile(fileInput.target.files[0].name)) {
      this.clientNotesForm.get('file').setErrors({ fileTaken: true });
      this.clientNotesForm.get("file").markAsDirty();
      return false;
    } else if (fileInput.target.files[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      this.loading = false;
      fileInput = null;
      return;
    } else {
      this.clientNotesForm.get("file").markAsPristine();
      this.myfilename = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        this.myfilename = file.name;
      });
      this.clientNotesForm.get('file').setValue(this.myfilename);
      localStorage.setItem('Image', '1');
      this.uploadAttachementFile(this.fileBinary);
    }

  }


  /*
   @Type: File, <ts>
   @Name: uploadAttachementFile function
   @Who: Renu
   @When: 14-Aug-2021
   @Why: ROST-2493
   @What: on uploading file
 */

  uploadAttachementFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    //formData.append('resources', 'resume');
    this.candidateService.FileUploadClient(formData).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.filePath = responseData.Data[0].FilePathOnServer;
          this.previewUrl = responseData.Data[0].Preview;
          this.uploadedFileName = responseData.Data[0].UploadFileName;
          localStorage.setItem('Image', '2');
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
    @Type: File, <ts>
    @Name: validateFile function
    @Who: Renu
    @When: 14-Aug-2021
    @Why: ROST-2493
    @What: on validating file
  */
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    // if (ext.toLowerCase() == 'pdf') {
    //   return true;
    // } else if (ext.toLowerCase() == 'doc') {
    //   return true;
    // } else if (ext.toLowerCase() == 'rar') {
    //   return true;
    // }
    if (this.fileType.includes(ext.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  /*
     @Type: File, <ts>
     @Name: onMessage function
     @Who: Renu
     @When: 15-Dec-2021
     @Why: ROST-3751 ROST-4175
     @What: on validating file
   */
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 200 - value.length;
    }
  }

  /*
   @Type: File, <ts>
   @Name: onDismiss function
   @Who: Renu
   @When: 15-Dec-2021
   @Why: ROST-3751 ROST-4175
   @What: on closing the mat drawer
 */

  onDismiss(): void {
    this.clientNotesForm.enable();
    this.isDrawerOpened = false;
    this.sidenav.close();
    this.clientNotesForm.reset();
    this.selectedCategory = {};
    this.oldPatchValues = [];
    this.maxMessage = 200;
    this.fileAttachments = [];
    this.getEditorVal = '';
    this.EditorEventCapture();
  }

  /*
  @Type: File, <ts>
  @Name: onSave function
  @Who: Renu
  @When: 15-Dec-2021
  @Why: ROST-3751 ROST-4175
  @What: on saving the data
*/
  onSave(value) {
    setTimeout(() => {

      this.hideAddButton = true;

    }, 3000);
    if (this.activestatus == 'Add') {
      this.createClientNotes(value);
      this.hideAddButton = true;
    } else {
      this.updateClientNotes(value);
      this.hideAddButton = true;
    }
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->

    this.saveEnableDisable = true;
  }

  /*
  @Type: File, <ts>
  @Name: updateClientNotes function
  @Who: Renu
  @When: 15-Dec-2021
  @Why: ROST-3751 ROST-4175
  @What: on update the data client Notes
*/
  updateClientNotes(value) {
    this.getMentionInfo(value.Description?.trim());
    this.loading = true;
    let files = [];
    this.fileAttachments.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    let updateObj = [];
    let fromObj = this.oldPatchValues;
    let NotifyUser:NotifyUser[]=[];
    this.mentionList?.filter(item=>{
     this.ownerList.filter(element=> {
       if(element['name']==item)
       {
         NotifyUser.push({
           ID: element['id'],
           Name: element['name'],
           ProfilePath: element['ProfileImage'],
           UserType: element['UserType']
         });
       }
   });
 });
    let XRNotificationsArr:XRNotifications={
      NotifyUser:NotifyUser,
      UserProfilePic:this.logedInUser['ProfileUrl'],
      NavigateUrl:'client/core/clients/list/client-detail?clientId='+ this.clientIdData+'&cliTabIndex=6&uniqueId=',
      CompletePath:window.location.href+'&uniqueId='
    };
    const d = new Date(value.NotesDate);
      
    // who:maneesh,what:ewm-12708 for pass UserTypeCode when:05/06/2023
    let typeCode = this.GridId === 'ClientNotes_grid_001' ? 'CLIE' : '';
    let updateNotesObj:clientNotesEntity = {
      ClientId:this.clientIdData,
      NotesDate:new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString(),
      CategoryId:this.CategoryId,
      Subject:value.Subject?.trim(),
      Description: value.Description === null ? '' : value.Description,
      Attachment: this.filePath,
      AttachmentName: this.uploadedFileName,
      AccessId: value.AccessId,
      Id:value.Id,
      GrantAccesList:this.accessEmailId,
      NotesURL:window.location.href,
      Files:files,
      UserTypeCode:typeCode,
      NotesContacts:(this.selectedContactsItems?.length > 0)?this.selectedContactsItems?.map(item => ({
        'ContactId': item.Id,
        'FirstName': item.FirstName,
        'LastName': item.LastName
      })):null,
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null,
      CallReferenceId:this.CallReferenceId
    };

    updateObj = [{
      "From": fromObj,
      "To": updateNotesObj
    }];
  
    this.clientService.EditClientNotesAll(updateObj[0])
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.sidenav.close();
            this.isDrawerOpened = false;
            this.tagNotesKey[value.Id] = 'updated';
            this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
            this.clientNotesForm.reset();
            this.selectedCategory = {};
            this.oldPatchValues = [];
            this.maxMessage = 200;
            this.filePath = null;
            this.uploadedFileName = null;
            // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
            this.getEditorVal = '';
            this.EditorEventCapture();
            this.fileAttachments = [];
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;

          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;

          }
          // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->

          this.saveEnableDisable = false;
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }
  /*
  @Type: File, <ts>
  @Name: createClientNotes function
  @Who: Renu
  @When: 15-Dec-2021
  @Why: ROST-3751 ROST-4175
  @What: on saving the data client Notes
*/
  createClientNotes(value) {
    //  <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13758 @Desc Multiple Uploading - Tenant ->Home →Job→ Job Summary → Notes --------->
    this.getMentionInfo(value.Description?.trim());
    this.loading = true;
    let files = [];
    this.fileAttachments.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    let NotifyUser:NotifyUser[]=[];
    this.mentionList?.filter(item=>{
     this.ownerList.filter(element=> {
       if(element['name']==item)
       {
         NotifyUser.push({
           ID: element['id'],
           Name: element['name'],
           ProfilePath: element['ProfileImage'],
           UserType: element['UserType']
         });
       }
   });
 });
    let XRNotificationsArr:XRNotifications={
      NotifyUser:NotifyUser,
      UserProfilePic:this.logedInUser['ProfileUrl'],
      NavigateUrl:'client/core/clients/list/client-detail?clientId='+ this.clientIdData+'&cliTabIndex=6&uniqueId=',
      CompletePath:window.location.href+'&uniqueId='
    };
    const d = new Date(value.NotesDate);    // who:maneesh,what:ewm-12708 for pass UserTypeCode when:05/06/2023
    let typeCode = this.GridId === 'ClientNotes_grid_001' ? 'CLIE' : '';

    let AddNotesObj:clientNotesEntity= {
      ClientId:this.clientIdData,
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null,
      NotesDate:new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString(),
      CategoryId:this.CategoryId,
      Subject:value.Subject?.trim(),
      Description:value.Description === null ? '' : value.Description,
      Attachment:this.filePath,
      AttachmentName:this.uploadedFileName,
      AccessId:value.AccessId,
      GrantAccesList:this.accessEmailId,
      NotesURL:window.location.href,
      Files:files,
      UserTypeCode:typeCode,
      NotesContacts:(this.selectedContactsItems?.length > 0)?this.selectedContactsItems?.map(item => ({
        'ContactId': item.Id,
        'FirstName': item.FirstName,
        'LastName': item.LastName
      })):null
    };
 
    this.clientService.AddClientNotesAll(AddNotesObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.sidenav.close();
            this.isDrawerOpened = false;
            this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
            this.getClientYearMonthList();
            this.clientNotesCount.emit(true);
            this.clientNotesForm.reset();
            this.selectedCategory = {};
            this.oldPatchValues = [];
            this.maxMessage = 200;
            this.filePath = null;
            this.uploadedFileName = null;
            // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->

            this.fileAttachments = [];
            this.getEditorVal = '';
            this.EditorEventCapture();
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;

          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;

          }
          // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->

          this.saveEnableDisable = false;
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }

  /*
  @Type: File, <ts>
  @Name: getNoteCateogoryList function
  @Who: Renu
  @When: 15-Dec-2021
  @Why: ROST-3751 ROST-4175
  @What: getting notes category list data
*/

  getNoteCateogoryList() {
    this.loading = true;
    let category = 'CLIE';
    this.clientService.getNotesCategoryList(category + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.notesCategory = repsonsedata.Data;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  //   showText() {
  //     this.isReadMore = !this.isReadMore
  //  }

  /*
  @Type: File, <ts>
  @Name: editClientForm function
  @Who: Renu
  @When: 15-Dec-2021
  @Why: ROST-3751 ROST-4175
  @What: getting notes data based on specific Id
*/
  editClientForm(Id:number,formtype:string,CallReferenceId) {
    this.CallReferenceId=CallReferenceId;
    this.ShowEditor=true;
    this.activestatus = 'Edit';
    this.formHeading = formtype;
    this.isDrawerOpened = true;
    this.loading = true;
    this.clientService.getClientNotesById('?Id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.oldPatchValues = data.Data;
            this.oldPatchValuesAccessMode = data.Data;
            this.loading = false;
            let res = data.Data;
            let local_date = this.commonserviceService.getUtCToLocalDate(res.NotesDate);

            // @Who: Ankit Rawat, @When: 27-Feb-2024, @Why: EWM-16073 EWM-16218 (set contacts value to view selected items in edit mode)
            this.selectedContactsItems = data.Data?.NotesContacts?.map(item => ({
              'Id': item.ContactId,
              'Name': (item.LastName && item.LastName.trim() !== '') ? (item.FirstName + ' ' + item.LastName) : (item.FirstName || ''),
              'FirstName': item.FirstName,
              'LastName': item.LastName
            }));

            this.clientNotesForm.patchValue({
              'NotesDate': local_date,
              'Description': res.Description,
              'Subject': res.Subject,
              'CategoryId': res.CategoryId,
              'Id': res.Id,
              'AccessName': res.AccessName,
              'AccessId': res.AccessId,
              'file': res.AttachmentName
            });
            if (this.clientNotesForm.get('Subject')?.value?.length != undefined) {
              this.maxMessage = 200 - this.clientNotesForm.get('Subject')?.value?.length;//who:maneesh,what:ewm-15439 for charachter count show,when:15/12/2023 
            } else {
              this.maxMessage = 200;
            }
            this.fileAttachments = res.Files;
            if (this.fileAttachments?.length > 2) {
              this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
            } else {
              this.fileAttachmentsOnlyTow = this.fileAttachments
            }
            this.selectedCategory = { 'Id': res.CategoryId };
            /////@Anup Singh patch for category id/////
            this.CategoryId = res.CategoryId;
            this.uploadedFileName = res.AttachmentName;
            if (res.CategoryId != null && res.CategoryId != ' ' && res.CategoryId != undefined) {
              this.isCategory = false;
            }
            this.getEditorVal = res.Description;
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }

  openDialogforowner() {
    const dialogRef = this.dialog.open(OwnerFilterComponent, {
      data: { selectedorDeselected: this.selectedorDeselectedOwner },
      panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        let arr = [];
        this.selectedorDeselectedOwner = result?.selectedorDeselected;
        result.res.Teammates.forEach(element => {
          arr.push(element.Id)
        });

        this.OwnerIds = arr;
        this.filterCountOwner = this.OwnerIds.length;
        var element = document.getElementById("filter-owner");
        element.classList.add("active");
        this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
        this.getClientYearMonthList();
      }

    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }


  // @When: 27-09-2023 @who:Amit @why: EWM-14465 @what: btn animation function
  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }


  /*
    @Type: File, <ts>
    @Name: openManageAccessModal
    @Who:Renu
    @When: 16-Dec-2021
    @Why: EWM-3751 EWM-4175
    @What: to open quick add Manage Access modal dialog
  */
  //   openManageAccessModal() {
  //     const dialogRef = this.dialog.open(ManageClientAccessComponent, {
  //     // maxWidth: "8550px",
  //     data:{candidateId:this.clientId,Id:this.clientNotesForm.value.Id?this.clientNotesForm.value.Id:0,AccessModeId:this.oldPatchValues},
  //     // width: "95%",
  //     // maxHeight: "85%",
  //     panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess',  'animate__animated', 'animate__zoomIn'],
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe(res => {
  //     let mode:number;
  //     if(this.formHeading=='Add'){
  //         mode=0;
  //     }else{
  //       mode=1;
  //     }
  //   res.ToEmailIds.forEach(element => {
  //     this.accessEmailId.push({
  //         'UserId':element['UserId'],
  //         'EmailId':element['EmailId'],
  //         'UserName':element['UserName'],
  //         'MappingId':element[''],
  //         'Mode':mode
  //     })
  //   });

  //    this.clientNotesForm.patchValue({
  //     'AccessName': res.AccessName,
  //     'AccessId':res.AccessId[0].Id
  //    })
  //   })
  // }


  openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      // maxWidth: "550px",
      data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValuesAccessMode, ActivityType: 2 },
      // width: "95%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res.isSubmit == true) {
        this.oldPatchValuesAccessMode = {};
        this.accessEmailId = [];
        let mode: number;
        if (this.formHeading == 'Add') {
          mode = 0;
        } else {
          mode = 1;
        }
        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': mode
          });
        });

        this.clientNotesForm.patchValue({
          'AccessName': res.AccessName,
          'AccessId': res.AccessId[0].Id
        });
        this.oldPatchValuesAccessMode = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

      } else {

      }


    })


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
  @Name: deleteClientNotes function
  @Who: Renu
  @When: 16-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: call Api for delete record .
  */
  deleteClientNotes(val): void {
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'candidate_note';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "355px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.loading = true;
        let delObj = {};

        delObj = val;
        this.clientService.deleteClientNotes(delObj).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;

              this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
              this.getClientYearMonthList();
              this.clientNotesCount.emit(true);
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
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
  @Name: getFilterConfig function
  @Who: Renu
  @When: 16-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: filter config
  */
  getFilterConfig(loaderValue: boolean) {
    // this.loading = loaderValue;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          // this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.isShowFilter = true;
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            this.cache.setLocalStorage(this.GridId,JSON.stringify(repsonsedata.Data));
            this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
            this.getClientYearMonthList();
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig?.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected.length !== 0) {
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }
          if (loaderValue == true) {
            // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false);
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          // this.loading = false;
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
 @Type: File, <ts>
 @Name: openDateFilterDialog function
 @Who: Renu
 @When: 16-Dec-2021
 @Why: EWM-3751 EWM-4175
 @What: open date filter dialog
 */
  openDateFilterDialog() {
    const dialogRef = this.dialog.open(DateFilterComponent, {
      data: new Object({
        fromDate: this.PatchFromDate, ToDate: this.PatchToDate,filterCountDateNotes:this.filterCountDate
      }),
      panelClass: ['xeople-modal-sm', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.resType==true){
      this.FromDate = result.FromDate;
      this.ToDate = result.ToDate;
      if (this.FromDate && this.ToDate) {
        this.filterCountDate = 1;
        this.PatchFromDate = result?.value?.FromDate;
        this.PatchToDate = result?.value?.ToDate;
        var element = document.getElementById("filter-date");
        element.classList.add("active");
      }
      this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
      this.getClientYearMonthList();
    }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
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
 @Name: openDialogJobCategory function
 @Who: Renu
 @When: 16-Dec-2021
 @Why: EWM-3751 EWM-4175
 @What: job category dialog
 */
  openDialogJobCategory() {
    const dialogRef = this.dialog.open(ClientJobCategoryComponent, {
      data: new Object({ searchFor: "CLIE", selectedOrDeSelected: this.selectedOrDeSelected }),
      panelClass: ['xeople-modal-lg', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.CategoryIds=result.res;
      if (result != false) {
        sessionStorage.setItem('SelectedClieNotsCatogry', JSON.stringify(result.selectedOrDeSelected));
        this.oldValue = result?.res;
        this.CategoryIds = result.res;
        this.selectedOrDeSelected = result?.selectedOrDeSelected;
        this.currentCatogryValue = result?.selectedOrDeSelected;//who:maneesh,what:ewm-15484 for patch data when edit search catogry,when:05/02/2024
        this.filterCountCategory = this.CategoryIds?.length;
        if (result?.selectedOrDeSelected != undefined) {
          let selectedArray = result?.selectedOrDeSelected?.filter(x => x?.IsSelected == 1); //who:maneesh,what:ewm-15484 for patch data when edit search catogry,when:05/02/2024
          this.filterCountCategory = selectedArray?.length;
        }
      } else {
        this.CategoryIds = this.oldValue;
        this.selectedOrDeSelected = JSON.parse(sessionStorage.getItem('SelectedClieNotsCatogry'));
        if (this.selectedOrDeSelected.length == 0) {
          this.filterCountCategory = 0;
        }
      }
      this.filterCountOwner = this.OwnerIds?.length;
      var element = document.getElementById("filter-category");
      element.classList.add("active");
      this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
      this.getClientYearMonthList();
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }

  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridList.length) {
        this.pagneNo = this.pagneNo + 1;
        this.getClientNotesListScroll(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }


  }

  getClientNotesListScroll(clientId: any, year: number, month: string, pageNo) {
    this.loading = true;
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj = {};
    jsonObj['ClientId'] = this.clientIdData;
    jsonObj['Year'] = this.yearFilterRes ? this.yearFilterRes : 0;
    jsonObj['Month'] = this.monthFilterRes ? this.monthFilterRes : '';
    if (this.OwnerIds) {
      jsonObj['OwnerIds'] = this.OwnerIds;
    } else {
      jsonObj['OwnerIds'] = [];
    }
    if (this.CategoryIds) {
      jsonObj['CategoryIds'] = this.CategoryIds;
    } else {
      jsonObj['CategoryIds'] = [];
    }
    if(this.ContactsIds) {
      jsonObj['ContactId'] = this.ContactsIds;
    } else {
      jsonObj['ContactId'] = [];
    }
    jsonObj['NotesFilterParams'] = [];
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
    //jsonObj['OrderBy']='';
    jsonObj['OrderBy'] = 'LastUpdated, ASC';
    jsonObj['GridId'] = this.GridId;
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    jsonObj['search'] = this.searchValue;

    this.clientService.fetchClientNotesAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loadingscroll = false;
            this.loading = false;
            let nextgridView = [];
            nextgridView = data.Data;
            this.gridList = this.gridList.concat(nextgridView);
          }
          else if (data.HttpStatusCode === 204) {
            this.loadingscroll = false;
            this.gridList = data.Data;
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingscroll = false;

          }
        }, err => {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }

  onHover(i: number) {
    this.hoverIndex = i;
    var element = document.getElementById("flex-box-hover");
    if (i != -1) {
      element.classList.add("renutest");
    } else {
      this.hoverIndex = i;

      element.classList.remove("renutest");
    }


  }

  getIcon(uploadDocument) {
    if (uploadDocument) {
      const list = uploadDocument.split('.');
      const fileType = list[list.length - 1];
      let FileTypeJson = this.documentTypeOptions.filter(x => x['type'] === fileType.toLocaleLowerCase());

      if (FileTypeJson[0]) {
        let logo = FileTypeJson[0].logo;
        return logo;
      }


    }
  }

  /*
@Type: File, <ts>
@Name: openDateFilterDialog function
@Who: Anup Singh
@When: 27-Dec-2021
@Why: EWM-4037 EWM-4363
@What: for form type update like add edit
*/
  formType(value) {
    this.clientNotesForm.enable();
    this.ShowEditor=true;
    // @Who: Ankit Rawat, @When: 27-Feb-2024,@Why: EWM-16073 EWM-16218 (removed selected items from contact dropdown)
    this.selectedContactsItems = [];
    // who:maneesh,what:ewm-11655 for by default public button patch,when:18/04/2023
    this.clientNotesForm.patchValue({
      'AccessName': this.AccessName,
      'AccessId': this.AccessId
    });
    this.oldPatchValuesAccessMode = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
    this.activestatus = value;
    this.formHeading = value;
    this.dateFill = new Date();
    this.isDrawerOpened = true;
    if (value == 'Add') {  //who:maneesh,what:ewm-15285 for handel save enabel disabel,when:07/12/2023
      this.isCategory = true;
    }
  }

  /*
     @Type: File, <ts>
     @Name: OpenViewPopUp function
     @Who: Renu
     @When: 11-Aprl-2021
     @Why: ROST-5654 ROST-5905
     @What: for view detailed record
   */

  OpenViewPopUp(data: any) {
    const dialogRef = this.dialog.open(ViewNotesComponent, {
      data: { notesViewInfo: data },
      panelClass: ['xeople-modal-lg', 'view_notes', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    
  }
  /*
     @Type: File, <ts>
     @Name: clearEndDate function
     @Who: maneesh
     @When: 14-dec-2022
     @Why: EWM-9802
     @What: For clear end  date
      */
  clearEndDate(e) {
    // @When: 13-03-2023 @who:maneesh singh @why: EWM-10160 add NotesDate patch value null when clear date
    this.clientNotesForm.patchValue({
      ToDate: null,
      NotesDate: null
    });
  }


  /*
    @Type: File, <ts>
    @Name: openImageUpload function
    @Who: Adarsh singh
    @When: 1-Aug-2023
    @Why: EWM-13233
    @What: open modal for set image in kendo editor
  */
  openImageUpload(): void {
    const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
      data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
      panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.loading = true;
        if (res.event === 1) {
          this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
            this.editor.exec('insertImage', res);
            this.loading = false;
          })
        }
        else {
          this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
            this.editor.exec('insertImage', res);
            this.loading = false;
          })
        }
      }
    })
  }

  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13758 @Desc Multiple Uploading - Tenant ->Home →Job→ Job Summary → Notes --------->

  removeAttachment(fileInfo: any) {
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
      this.fileAttachments.splice(index, 1);
    }

    if (this.fileAttachments.length > 2) {
      this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
    } else {
      this.fileAttachmentsOnlyTow = this.fileAttachments
    }
  }
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13758 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->

  openMultipleAttachmentModal() {
    let files = [];
    this.fileAttachments.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
      maxWidth: "600px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: files
      }),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res.fileAttachments;

        if (this.fileAttachments.length > 2) {
          this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2);
        } else {
          this.fileAttachmentsOnlyTow = this.fileAttachments;
        }
      }
    })

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
@Name: refreshComponent function
@Who:maneesh
@When: 10-10-2023
@Why: EWM-14684
@What: refreshComponent for refress  get client list
*/
  refreshComponent() {
    // this.selectedorDeselectedContact=[];
    // this.selectedOrDeSelected=[];
    // this.selectedorDeselectedOwner = [];
    // this.OwnerIds = [];
    // this.ContactsIds = [];
    // this.CategoryIds = [];
    // this.filterConfig = [];
    // this.FromDate = null;
    // this.ToDate = null;
    // this.filterCountContacts=0;
    // this.filterCountDate=0;
    // this.filterCountOwner=0;
    // this.filterCountCategory=0;
    // this.filterCount=0;
    // this.monthFilterRes='';
    // this.yearFilterRes = this.currentYear;
    this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
    this.getClientYearMonthList();
  }
  //  who:maneesh:what:ewm-15142 for searchdata ,function:onFilter,when:20/11/2023
  public onFilter(inputValue: string): void {
    // if (inputValue?.length > 0 && inputValue?.length < 3) {
    //   this.loadingSearch = false;
    //   return;
    // }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);
  }
  //  who:maneesh:what:ewm-15142 for clear searchdata ,function:onFilterClear,when:20/11/2023
  public onFilterClear(): void {
    this.searchValue = '';
    this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
    this.getClientYearMonthList();
    this.searchdata = 'inputValue';
  }
  /*
@Name: getBackgroundColor function
@Who: maneesh
@When: 22-11-2023
@Why: EWM-15031
@What: set background color
*/
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }

  //Who:Ankit Rawat, What:EWM-16073-EWM-16218 Add new control Contact Dropdown, When:27Feb24
  dropdownConfigContacts() {
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_recentnotesdescription',
      Tag:[],
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    this.ContactsDropdownConfig = {
      API: this.serviceListClass.getContactByClientId + '?ClientId=' + this.clientIdData,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_JobContacts',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: 'Email',
      IMG_BIND_VALUE: 'ProfileImage',
      FIND_BY_INDEX: 'Id'
    }
  }
  //Who:Ankit Rawat, What:EWM-16073-EWM-16218 Add new control Contact Dropdown, When:27Feb24
  onContactschange(data) {
    this.selectedContactsItems = null;
    if (data) {
      this.selectedContactsItems = data;
    }
    else this.selectedContactsItems = null;
  }

  //Who:Ankit Rawat, What:EWM-16073-EWM-16218 Add new control Contact Dropdown, When:27Feb24
  screenMediaQuiryForContacts() {
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
      this.maxMoreLengthForContacts = 1;
    } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
      this.maxMoreLengthForContacts = 2;
    } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
      this.maxMoreLengthForContacts = 3;
    } else {
      this.maxMoreLengthForContacts = 4;
    }
  }
  //  @Who: Renu, @When: 04-03-2024,@Why: EWM-16207-EWM-16299 @What: on changes on kendo editor catch the event here

  getEditorFormInfo(event) {
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
    ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
    this.ownerList = event?.ownerList;
    if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
      this.showErrorDesc = false;
      this.clientNotesForm.get('Description').setValue(event?.val);
    } else if(sources == undefined && event?.val==null ){
      this.editConfig();
      this.showErrorDesc = true;
      this.clientNotesForm.get('Description').setValue('');
      this.clientNotesForm.get('Description').setValidators([Validators.required]);
      this.clientNotesForm.get('Description').updateValueAndValidity();
      this.clientNotesForm.get("Description").markAsTouched();    }
    else if(sources == undefined && event?.val==''){
      this.showErrorDesc = true;
      this.clientNotesForm.get('Description').setValue('');
      this.clientNotesForm.get('Description').setValidators([Validators.required]);
    }
  }
  //  @Who: Renu, @When:@When: 04-03-2024,@Why: EWM-16207-EWM-16299 @What:get all mentions info from html tags on save/update
  getMentionInfo(value) {
    const tempContainer = this.renderer.createElement('div');
    this.renderer.setProperty(tempContainer, 'innerHTML', value);
    const mentionNodes = tempContainer.querySelectorAll('.prosemirror-mention-node');
    mentionNodes.forEach(node => {
      if (node.hasAttribute("data-mention-name")) {
        let mentionId = node.getAttribute('data-mention-name');
        this.mentionList.push(mentionId);
      }else{
        let mentionId =node.innerHTML.substring(1); 
        this.mentionList.push(mentionId);
      }
     
    });
    this.mentionList=  this.mentionList.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
  })
  }

  //  @Who: Renu, @When: 04-03-2024,@Why: EWM-16207 EWM-16299 @What: get all event for editor here
  EditorEventCapture() {
    this.ShowEditor = false;
    let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
    mentionDiv.forEach(node => {
      node.style.display = 'none';
    });
  }
   // who:maneesh,what: this is use for patch first time image upload data,when:04/04/2024
 
   getEditorImageFormInfo(event){ 
    this.showErrorDesc=false;
    let disValue=this.clientNotesForm.get('Description').value;
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
    ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
    if(event?.val!='' && sources!=undefined){
      this.showErrorDesc=false;
      this.clientNotesForm.get('Description').setValue(event?.val);
    }else if(disValue!='' && event?.val?.length!=0 ){          
      this.showErrorDesc = false;
      this.clientNotesForm.get('Description').updateValueAndValidity();
      this.clientNotesForm.get("Description").markAsTouched(); 
    }
    else{
      this.showErrorDesc = true;
      this.clientNotesForm.get('Description').setValue('');
      this.clientNotesForm.get('Description').setValidators([Validators.required]);
      this.clientNotesForm.get('Description').updateValueAndValidity();
      this.clientNotesForm.get("Description").markAsTouched(); 
    }
  }
  //this config call agaon required validation  by maneesh
  editConfig(){
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_recentnotesdescription',
      Tag:[],
      EditorTools:[], 
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    this.showErrorDesc=true;
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.clientNotesForm.get('Description').updateValueAndValidity();
    this.clientNotesForm.get('Description').markAsTouched();
  }

  openDialogSearchByContact() {
    const dialogRef = this.dialog.open(SearchNoteByContactComponent, {
      data: { selectedorDeselected: this.selectedorDeselectedContact,clientId:this.clientIdData },
      panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        let arr = [];
        this.selectedorDeselectedContact = result?.selectedorDeselected;
        result?.res?.Teammates?.forEach(element => {
          arr?.push(element?.Id)
        });
        this.ContactsIds = arr;
        this.filterCountContacts = this.ContactsIds?.length;
        var element = document.getElementById("filter-contacts");
        element.classList.add("active");
        this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo, this.searchValue);
        this.getClientYearMonthList();
      }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

}
