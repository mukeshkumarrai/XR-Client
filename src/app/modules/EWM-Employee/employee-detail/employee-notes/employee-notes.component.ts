/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 14-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What:  This page will be use for employee Notes
*/
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewNotesComponent } from 'src/app/modules/EWM-Candidate/recentnotes/view-notes/view-notes.component';
import { ClientJobCategoryComponent } from 'src/app/modules/EWM.core/client/client-notes/client-job-category/client-job-category.component';
import { DateFilterComponent } from 'src/app/modules/EWM.core/client/client-notes/date-filter/date-filter.component';
import { OwnerFilterComponent } from 'src/app/modules/EWM.core/client/client-notes/owner-filter/owner-filter.component';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { FilterDialogComponent } from 'src/app/modules/EWM.core/job/landingpage/filter-dialog/filter-dialog.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ManageAccessActivityComponent } from '../employee-activity/manage-access-activity/manage-access-activity.component';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { CommonDropDownService } from '@app/modules/EWM.core/shared/services/common-dropdown-service/common-dropdown.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { EmployeeNotesEntity,NotifyUser,XRNotifications } from '@app/shared/models/notes';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MentionEditorComponent } from '@app/shared/mention-editor/mention-editor.component';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
@Component({
  selector: 'app-employee-notes',
  templateUrl: './employee-notes.component.html',
  styleUrls: ['./employee-notes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeNotesComponent implements OnInit {
  @ViewChild('asignJob') public asignJob: MatSidenav;
  @ViewChild('notesAdd') public notesAdd: MatSidenav;
  @Output() clientNotesCount = new EventEmitter();
  public filterConfig: any; // <!-- who:Bantee,why:ewm.11723 Two popup open on on click filter button ,when:10/04/2023 -->
  public loadingscroll: boolean;
  public loading: boolean;
  public positionMatDrawer: string = 'end';
  mobileQuery: MediaQueryList;
  yearFilter: MediaQueryList;
  private _mobileQueryListener: () => void;
  public clientId: any;
  @Input() clientIdData: any;
  @Input() PageName: any;
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
  isCategory:boolean = true;
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
  // public GridId='ClientNotes_grid_001';
  @Input() GridId: any;
  public filterCount: number = 0;
  public isShowFilter: boolean = false;
  public colArr: any = [];
  public isReadMore: any[] = [false];
  public columns: ColumnSetting[] = [];
  public ToDate: any;
  public FromDate: any;
  public OwnerIds: any=[];
  public assignJobDrawerPos: string ;
 public notesDrawerPos:string='end';
 public oldPatchValues: any;
 public formHeading:string;
 public CategoryIds: any=[];
 public selectedIndex: number = null;
 @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
 public totalDataCount: number;
 public hoverIndex:number = -1;
 public tagNotesKey:any[]=[];
 public maxCharacterLengthSubHead=500;
 public filterCountCategory:number=0;
 public filterCountOwner: number=0;
 public canLoad = false;
 public pendingLoad = false;
 public filterCountDate: any=0;
 documentTypeOptions:any;
 @Input() candidateIdData: any;
 @Input()  category:string;
 uploadedFileName: any;
 timelineMonth:any;
 timelineYear:any;
 GridIdPop = "ClientNotes_grid_001";
 categoryName:string;
 @Input() candidateName: string;
 selectedItemListForActiveClass = null;
  public oldPatchValuesAccessMode:any=[];
  public hideAddButton: boolean = false;
  @Input() dateNotesDrawer: any="open";
  @Input() isAttendeesdefaultShow:boolean;
  @Input() relatedUserJobId:string;
  isDropdownShow:boolean = true;
  animationVar: any;
  dateFormat:any;
  getDateFormat:any;
  AccessId: any;
  AccessName: any;
  dirctionalLang;
  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  //  kendo image uploader Adarsh singh 01-Aug-2023
@ViewChild('editor') editor: EditorComponent;
  saveEnableDisable: boolean=false;
// End
common_DropdownC_Config:DRP_CONFIG;
public searchSubject$ = new Subject<any>();
public searchNotes: Subscription;
public loadingSearch: boolean;
public searchValue:string='';
public gridListData: any = [];
public searchdata:string='';
public selectedorDeselectedOwner:[];
public selectedOrDeSelected = [];
public oldValue: any=[];
empAllObs: Subscription;
ownerList: string[]=[];
sortingValue: string = "";
  logedInUser: string;
  uniqueId: number=0;
   //Who:Renu, What:EWM-16207 EWM-16299 @Why: for new editor with tagging, When:04-mar-2024
   mentionList: any[] = [];
   ShowEditor: boolean;
   public showErrorDesc: boolean = false;
   public editorConfig: EDITOR_CONFIG;
   public getEditorVal: string;
   public gridListView: any = [];
   responseData:any;
   viewNotificationData: Subscription;
  activatedRoute: any;
  notificationLoading:string='label_loading';
 getRequiredValidationMassage: Subject<any> = new Subject<any>();
 @ViewChild('mentionEditor') mentionEditor: MentionEditorComponent;
 PatchFromDate: string;
  PatchToDate: string;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private fb: FormBuilder,private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private http: HttpClient,
    private jobService: JobService, private snackBService: SnackBarService, private clientService: ClientService,private renderer: Renderer2,
    public candidateService: CandidateService,private dataService: CommonDropDownService, private quickJobService: QuickJobService,
    private serviceListClass: ServiceListClass, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,private route: Router,private cache : CacheServiceService) {
      // who:maneesh,what:ewm-11655 for access name public value  ,when:19/04/2023
      this.AccessId=this.appSettingsService.getDefaultAccessId;
      this.AccessName=this.appSettingsService.getDefaultaccessName;
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this.yearFilter = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.pagesize = appSettingsService.pagesize;
    this.currentYear = (new Date()).getFullYear();
    this.clientNotesForm = this.fb.group({
      NotesDate: ['',[Validators.required, CustomValidatorService.dateValidator]],
      CategoryId: [''],
        // who:maneesh,what:ewm-15142 fixed validation ,when:16/11/2023
      NoteTitle: ['', [Validators.maxLength(200)]],
      Description: ['',[Validators.required]],
      file: [''],
      AccessId: [],
      AccessName: ['', [Validators.required]],
      ClientId: [],
      Id: [],
      AccessDescription: ['']
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
    this.yearFilterRes=this.currentYear;
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    })
    this.logedInUser= JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit(): void {
    this.activatedRoute = this.routes.url;
    this.searchNotes= this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,value);
      this.getClientYearMonthList();
    });
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.dateFormat = localStorage.getItem('DateFormat');
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
      }
    })
    // setInterval(() => {
    //   this.canLoad = true;
    //   if (this.pendingLoad) {
    //     this.onScrollDown();
    //   }
    // }, 2000);
    localStorage.removeItem(this.GridId);
    this.getFilterConfig(true);
    this.getClientYearMonthList();
   // this.getNoteCateogoryList();
   this.dropDoneConfig['IsDisabled'] = false;
   this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList+'?UserType=' +this.category +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
   this.dropDoneConfig['placeholder'] = 'label_category';
   this.dropDoneConfig['searchEnable'] = true;
   this.dropDoneConfig['IsManage'] = './client/core/administrators/notes-category';
   this.dropDoneConfig['bindLabel'] = 'CategoryName';
   this.dropDoneConfig['IsRequired'] = true;
   var element = document.getElementById("add-new-note");
   // @When: 06-09-2023 @who:Amit @why: EWM-13836 @what: unused code remove
    //  element?.classList.remove("add-new-note");
    this.animationVar = ButtonTypes;
    this.common_DropdownC_Config = {
      API: this.serviceListClass.notesCategoryList+'?UserType=' +this.category +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
      MANAGE: './client/core/administrators/notes-category',
      BINDBY: 'CategoryName',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_notesCategory',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'ProfileImage',
      FIND_BY_INDEX: 'Id'
    }
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
    };
    this.renderer.listen('window', 'click', (e: Event) => {
      let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
      mentionDiv.forEach(node => {
        node.style.display = 'none';
      });
    });

    document.addEventListener('scroll',event=>{ 
      this.EditorEventCapture(true);
     }, true);
     this.renderer.listen('window', 'click', (e: Event) => {
       this.EditorEventCapture(true);
    });
  }
  ngAfterViewInit() {
    this.routes.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
        this.sidenav.close();
        this.uniqueId = value?.uniqueId;
        this.sidenav.toggle();
        this.formHeading = 'View';
        this.gridListView=[];
        if(this.candidateIdData!=value?.CandidateId){
          this.candidateIdData = value?.CandidateId;
          this.getFilterConfig(true);
          this.getClientYearMonthList();
        }
        this.viewNotesById(this.uniqueId,this.formHeading,this.candidateIdData); 
      }
    });
  }
  viewNotesById(Id: number,formtype:string,candidateIdData:string) {
    //this.ShowEditor=true;
     this.formHeading = formtype;
    this.loading = true;
    this.viewNotificationData=  this.candidateService.getCandidatenoteByYearfilterByid('?CandidateId='+candidateIdData+'&NotesId='+Id)
      .subscribe(
        (data: ResponceData) => {
          this.route.navigate([],{
          relativeTo: this.activatedRoute,
          queryParams: {uniqueId: null},
          queryParamsHandling: 'merge'
         });
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.gridListView?.push(data.Data);
            }
          else if (data.HttpStatusCode === 204) {
            this.notificationLoading='label_RecordDeleted';
            this.loading = false;
            this.gridListView=[];
          }else if (data.HttpStatusCode === 400) {
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

  drawerStatusChange(){
    if(this.dateNotesDrawer=="close"){
      return false;
    }else if(this.yearFilter.matches===false){
      return true;
    }else{
      return false;
    }
  }
  drawerModeStatus(){
    if(this.dateNotesDrawer=="close"){
      return "over"
    }else{
      if(this.yearFilter.matches===false){
        return "side";
      }else{
        return "over";
      }
    }
  }
  /*
    @Type: File, <ts>
    @Name: openAsignJob
    @Who: Renu
    @When: 20-Dec-2021
    @Why: EWM-3751/4175
    @What: when openAsignJob
  */
  addNotes() {
    this.clientNotesForm.enable();
    this.formHeading = 'Add';
    this.isDropdownShow = false;
    this.clientNotesForm.reset();
    this.selectedCategory = {};
    this.fileAttachments=[];
    this.getEditorVal='';
    this.EditorEventCapture();
    this.mentionEditor?.editorFormControl.setValue(null);
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
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data.length;
        let filterParamArr = [];
        res.data.forEach(element => {
          filterParamArr.push({
            'FilterValue': element.ParamValue,
            'ColumnName': element.filterParam.Field,
            'ColumnType': element.filterParam.Type,
            'FilterOption': element.condition,
            'FilterCondition': 'AND'
          })
        });
        this.loading = true;
        let jsonObjFilter = {};
        jsonObjFilter['CandidateId'] = this.candidateIdData;
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
        jsonObjFilter['NotesFilterParams'] = filterParamArr;
        jsonObjFilter['PageNumber'] = this.pagneNo;
        jsonObjFilter['PageSize'] = this.pagesize;
        //jsonObjFilter['OrderBy'] = '';
        jsonObjFilter['OrderBy']='LastUpdated, ASC';
        jsonObjFilter['GridId'] = this.GridId;
        jsonObjFilter['FromDate'] = this.FromDate ? this.FromDate : null;
        jsonObjFilter['ToDate'] = this.ToDate ? this.ToDate : null;
        var element = document.getElementById("filter-advance");
        element.classList.add("active");
        let jsonObjFilterG = {};
        this.filterConfig = filterParamArr;
        jsonObjFilterG['FilterConfig'] =res?.data?.length=='0'? null:filterParamArr;
        jsonObjFilterG['GridConfig'] = this.colArr;
        this.cache.setLocalStorage(this.GridId,JSON.stringify(jsonObjFilterG));
        this.candidateService.fetchNotesAll(jsonObjFilter).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
              this.gridList = repsonsedata.Data;
              this.totalDataCount = repsonsedata.TotalRecord;
              this.hideAddButton=true;
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
    if(data == null || data == ''){
      this.isCategory = true;
    }else{
      this.isCategory = false;
      this.CategoryId = data.Id;
      this.categoryName = data.CategoryName;
    }
  }
  ngOnDestroy(): void {
    this.viewNotificationData?.unsubscribe();
    this.searchNotes?.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.EditorEventCapture();
    document.removeEventListener('scroll',event=>{ 
      this.EditorEventCapture(true);
     }, true);
     this.editConfig();
    this.mentionEditor?.editorFormControl.setValue(null);

  }
  getClientYearMonthList() {
    let jsonObj = {};
    jsonObj['CandidateId'] = this.candidateIdData;
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
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    jsonObj['GridId'] = this.GridId;
    jsonObj['Search'] = this.searchValue;
    if (this.isAttendeesdefaultShow) {
    jsonObj['JobId'] = this.relatedUserJobId;
    }
    if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
      jsonObj['NotesFilterParams'] = this.filterConfig;
    } else {
      jsonObj['NotesFilterParams'] = [];
    }
    this.candidateService.fetchNotesMonthYearCountAll(jsonObj)
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
    // const message = `label_confirmDialogJob`;
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
          this.selectedorDeselectedOwner=[];//who:maneesh,what:ewm-15980,when:08/02/2024
        }
        if (viewMode == 'Category') {
          this.CategoryIds = [];
          this.selectedOrDeSelected.forEach(ele=>{
            ele['IsSelected']=0;
           })
          sessionStorage.removeItem('SelectedEmpNotsCatogry');
        }
        if (viewMode == 'Filter') {
          this.filterConfig = [];
        }
        jsonObj['CandidateId'] = this.candidateIdData;
        jsonObj['Year'] = this.currentYear ? this.currentYear : 0;
        jsonObj['Month'] = this.monthFilterRes ? this.monthFilterRes : '';
        jsonObj['OwnerIds'] = viewMode == 'Owner' ? [] : this.OwnerIds;
        jsonObj['CategoryIds'] = viewMode == 'Category' ? [] : this.CategoryIds;
        if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
          jsonObj['NotesFilterParams'] = viewMode == 'Filter' ? [] : this.filterConfig;
        } else {
          jsonObj['NotesFilterParams'] = [];
        }
       // jsonObj['NotesFilterParams'] = viewMode == 'Filter' ? [] : this.filterConfig;
        jsonObj['PageNumber'] = this.pagneNo;
        jsonObj['PageSize'] = this.pagesize;
       // jsonObj['OrderBy'] = '';
        jsonObj['OrderBy']='LastUpdated, ASC';
        jsonObj['GridId'] = this.GridId;
        if (viewMode == 'Date') {
          this.FromDate = null;
          this.ToDate = null;
        }
        jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
        jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
        let jsonObjFilterG = {};
        jsonObjFilterG['FilterConfig'] =viewMode == 'Filter' ? null : this.filterConfig;
        jsonObjFilterG['GridConfig'] = this.colArr;
        this.candidateService.fetchNotesAll(jsonObj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
              this.gridList = repsonsedata.Data;
              this.hideAddButton=true;
              this.cache.setLocalStorage(this.GridId,JSON.stringify(jsonObjFilterG));
              //this.getFilterConfig(false);
              this.getClientYearMonthList();
              if (viewMode == 'Category') {
                this.filterCountCategory = 0;
                var element = document.getElementById("filter-category");
                element.classList.remove("active");
              }
              if (viewMode == 'Owner') {
                this.filterCountOwner = 0;
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
            } else {
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
  getClientNotesList(clientId: any, year: number, month: string, pageNo,value) {
    this.searchdata=value;
    this.timelineMonth = month;
    this.timelineYear = year;
    this.loading = true;
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj = {};
    jsonObj['search'] = value;
    jsonObj['CandidateId'] = this.candidateIdData;
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
    //<!-- who:Bantee,why:ewm.11723 Two popup open on on click filter button ,when:10/04/2023 -->
    if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
      jsonObj['NotesFilterParams'] = this.filterConfig;
    } else {
      jsonObj['NotesFilterParams'] = [];
    }
    //jsonObj['NotesFilterParams'] = this.filterConfig;
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
    //jsonObj['OrderBy'] = '';
    jsonObj['OrderBy']='LastUpdated, ASC';
    jsonObj['GridId'] = this.GridId;
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    if (this.isAttendeesdefaultShow) {
    jsonObj['JobId'] = this.relatedUserJobId;
    }
    this.candidateService.fetchNotesAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.totalDataCount = data.TotalRecord;
            this.responseData = data;
            this.loadingSearch = false;
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loading = false;
            this.hideAddButton=true;
           }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loading = false;
            this.loadingSearch = false;
            this.hideAddButton=false;
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
    this.loading = true;
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
          this.loading = false;
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
    // }
    // else if (ext.toLowerCase() == 'doc') {
    //   return true;
    // }
    // else if (ext.toLowerCase() == 'rar') {
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
    this.maxMessage = 200;
    this.isDropdownShow = false;
    this.sidenav.close();
    this.selectedCategory = {};
    this.fileAttachments=[];
    this.clientNotesForm.reset();
    this.getEditorVal='';
    this.EditorEventCapture();
    this.mentionEditor?.editorFormControl.setValue(null);


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
      this.hideAddButton=true;
         } , 3000);
      if (this.activestatus == 'Add') {
        this.createClientNotes(value);
        this.hideAddButton=true;
      } else {
        this.updateClientNotes(value);
        this.hideAddButton=true;
      }
      // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
      this.saveEnableDisable=true;
    //}
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
    this.saveEnableDisable=true;
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
    let updateObj = [];
    let fromObj = this.oldPatchValues;
     // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
     let files = [];
     this.fileAttachments.forEach(element => {
       if(element.hasOwnProperty('Path')){
         files.push(element);
       }
     });
     let typeCode = this.GridId=== 'EmployeeNotes_grid_001' ? 'EMPL' : 'CAND';
     const d = new Date(value.NotesDate);

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
       NavigateUrl:typeCode=='EMPL'?'client/emp/employees/employee-detail?CandidateId='+this.candidateIdData+'&employeeType=EMPL&tabIndex=6&uniqueId=':
       "client/cand/candidate/candidate?CandidateId="+this.candidateIdData+'&Type='+typeCode+'&cantabIndex=6&uniqueId=',
       CompletePath:typeCode=='EMPL'?window.location.origin+'/client/emp/employees/employee-detail?CandidateId='+this.candidateIdData+'&employeeType=EMPL&tabIndex=6&uniqueId=':
       window.location.origin+"/client/cand/candidate/candidate?CandidateId="+this.candidateIdData+'&Type='+typeCode+'&cantabIndex=6&uniqueId='     };
  
     let updateNotesObj:EmployeeNotesEntity = {
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null,
      CandidateId:this.candidateIdData,
      UserTypeCode:typeCode,
      CandidateName:this.candidateName,
      NotesDate:new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString(),
      CategoryId:this.selectedCategory?.Id,
      CategoryName: this.selectedCategory?.CategoryName,
      NoteTitle:value.NoteTitle?.trim(),
      Description:value.Description === null ? '':value.Description,
      Attachment:this.filePath,
      AttachmentName:this.uploadedFileName,
      AccessId:value.AccessId,
      AccessName:value.AccessName,
      Id:value.Id,
      GrantAccesList:this.accessEmailId,
      IconName: this.IconName,
      CreateByName: this.CreateByName,
      PageName:this.PageName,
      Files:files,
      AccessDescription:(value.AccessDescription=='')?this.AccessDescription:value.AccessDescription,
      NotesURL:(this.isAttendeesdefaultShow)? window.location.origin+"/"+"client/cand/candidate/candidate?CandidateId="+this.candidateIdData +'&pageName=Notes': window.location.href,
      JobId: (this.isAttendeesdefaultShow)?this.relatedUserJobId:'00000000-0000-0000-0000-000000000000',
      CallReferenceId:this.CallReferenceId
    };
   
    updateObj = [{
      "From": fromObj,
      "To": updateNotesObj
    }];
    this.candidateService.EditNotesAll(updateObj[0])
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.sidenav.close();
            this.tagNotesKey[value.Id] = 'updated';
            this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
            this.clientNotesForm.reset();
            this.selectedCategory = {};
            this.fileBinary=null;
            this.filePath=null;
            this.uploadedFileName=null;
            // <!---------@When: 01-12-2022 @who:Adarsh singh @why: EWM-9142 --------->
            this.isDropdownShow = false;
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
            this.fileAttachments=[];
            this.maxMessage = 200;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.getEditorVal='';
            this.EditorEventCapture();
            this.mentionEditor?.editorFormControl.setValue(null);
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
            // <!---------@When: 01-12-2022 @who:Adarsh singh @why: EWM-9142 --------->
            this.isDropdownShow = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
          this.saveEnableDisable=false;
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
    this.getMentionInfo(value.Description?.trim());
    this.loading = true;
    // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
    let files:any[]=[];
    this.fileAttachments.forEach(element => {
      if(element.hasOwnProperty('Path')){
        files.push(element);
      }
    });
    const d = new Date(value.NotesDate);
    let typeCode = this.GridId=== 'EmployeeNotes_grid_001' ? 'EMPL' : 'CAND';
    let NotifyUser:NotifyUser[]=[];
   this.mentionList?.filter(item=>{
    this.ownerList?.filter(element=> {
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
      NavigateUrl:typeCode=='EMPL'?'client/emp/employees/employee-detail?CandidateId='+this.candidateIdData+'&employeeType=EMPL&tabIndex=6&uniqueId=':
      "client/cand/candidate/candidate?CandidateId="+this.candidateIdData+'&Type='+typeCode+'&cantabIndex=6&uniqueId=',
      CompletePath:typeCode=='EMPL'?window.location.origin+'/client/emp/employees/employee-detail?CandidateId='+this.candidateIdData+'&employeeType=EMPL&tabIndex=6&uniqueId=':
      window.location.origin+"/client/cand/candidate/candidate?CandidateId="+this.candidateIdData+'&Type='+typeCode+'&cantabIndex=6&uniqueId='
    };
    let notesObj:EmployeeNotesEntity={
      XRNotifications:this.mentionList.length>0?XRNotificationsArr:null,
      NotesURL:this.isAttendeesdefaultShow?(window.location.origin+"/"+"client/cand/candidate/candidate?CandidateId="+this.candidateIdData+ '&pageName=Notes'):window.location.href,
      CandidateId:this.candidateIdData,
      JobId:this.isAttendeesdefaultShow?this.relatedUserJobId:'00000000-0000-0000-0000-000000000000',
      CandidateName: this.candidateName,
      UserTypeCode:typeCode,
      PageName:this.PageName,
      Files:files,
     // AccessDescription: value.AccessDescription,
      GrantAccesList:this.accessEmailId,
      AccessName: value.AccessName,
      AccessId:value.AccessId,
      AttachmentName:this.uploadedFileName,
      Attachment:this.filePath,
      Description:value.Description === null ? '':value.Description,
      NoteTitle: value.NoteTitle?.trim(),
      CategoryName: this.selectedCategory?.CategoryName,
      CategoryId:this.selectedCategory?.Id,
      NotesDate: new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString()  
     };
    this.candidateService.AddNotesAll(notesObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            
            this.mentionList=[];
            this.loading = false;
            this.sidenav.close();
            this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
            this.getClientYearMonthList();
            this.clientNotesCount.emit(true);
            this.clientNotesForm.reset();
            this.selectedCategory = {};
            this.fileBinary=null;
            this.filePath=null;
            this.uploadedFileName=null;
            this.isDropdownShow = false;
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
            this.fileAttachments=[];
            this.getEditorVal='';
            this.EditorEventCapture();
            this.mentionEditor?.editorFormControl.setValue(null);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
            this.isDropdownShow = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
    // <!-- // who:bantee,what:ewm-14049 ,when:27/08/2023 Notesattachment issue -->
          this.saveEnableDisable=false;
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
    let category=this.category;
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
IconName: string;
CreateByName: string;
AccessDescription: string;
CallReferenceId:number;
  editClientForm(Id: number,formtype:string,CallReferenceId) {
    this.CallReferenceId=CallReferenceId;
    this.ShowEditor=true;
    this.activestatus = 'Edit';
    this.formHeading = formtype;
    this.loading = true;
    this.candidateService.getNotesById('?Id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.oldPatchValues = data.Data;
            this.oldPatchValuesAccessMode= data.Data;
            this.accessEmailId = this.oldPatchValues?.GrantAccesList;
            this.IconName = data.Data.IconName;
            this.CreateByName = data.Data.CreatedByName;
            this.AccessDescription = data.Data.AccessDescription;
            this.loading = false;
            let res = data.Data;
            this.isDropdownShow = true;
             let local_date = this.commonserviceService.getUtCToLocalDate(res.NotesDate);
            this.clientNotesForm.patchValue({
              'NotesDate': local_date,
              'Description': res.Description,
              'NoteTitle': res.NoteTitle,
              'CategoryId': res.CategoryId,
              'Id': res.Id,
              'AccessName': res.AccessName,
              'AccessId': res.AccessId,
              'file':res.AttachmentName,
            }); 
            this.getEditorVal= res?.Description; //patch data when edit by maneesh ,when:21/03/2024
            if(this.clientNotesForm.get('NoteTitle')?.value?.length!=undefined){
              this.maxMessage = 200 - this.clientNotesForm.get('NoteTitle')?.value?.length;//who:maneesh,what:ewm-15439 for charachter count show,when:15/12/2023 
            }else{
              this.maxMessage = 200;
            }           
            // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
            this.fileAttachments = res.Files;
            if (this.fileAttachments?.length > 2) {
              this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
            } else {
              this.fileAttachmentsOnlyTow = this.fileAttachments
            }
            this.selectedCategory = { 'Id': res.CategoryId, CategoryName: res.CategoryName };
          //  this.dataService.setSelectedData(this.selectedCategory);
            /////@Anup Singh patch for category id/////
            this.CategoryId = res.CategoryId;
            this.uploadedFileName=res.AttachmentName;
            if(res.CategoryId != null && res.CategoryId != ' ' && res.CategoryId != undefined){
              this.isCategory = false;
             // console.log(this.isCategory);
            }
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
      // maxWidth: "750px",
      // width: "90%",
      data: { selectedorDeselected: this.selectedorDeselectedOwner },
      panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        let arr = [];
        this.selectedorDeselectedOwner=result.selectedorDeselected;
        result.res.Teammates.forEach(element => {
          arr.push(element.Id)
        });
        this.OwnerIds = arr;
        this.filterCountOwner = this.OwnerIds.length;
        var element = document.getElementById("filter-owner");
        element.classList.add("active");
        this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
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
    @Name: openManageAccessModal
    @Who:Renu
    @When: 16-Dec-2021
    @Why: EWM-3751 EWM-4175
    @What: to open quick add Manage Access modal dialog
  */
  openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    if (this.formHeading == 'Add') {
   // who:maneesh,what:ewm-11958 for by default public button patch so comment this and add this.oldPatchValuesAccessMode ,when:19/04/2023
      // this.oldPatchValuesAccessMode = {};
     this.oldPatchValuesAccessMode = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
    }
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
          'AccessName': res.AccessId[0].AccessName,
          'AccessId': res.AccessId[0].Id,
          'AccessDescription': res.AccessId[0].Description,
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
        delObj["PageName"] = this.PageName;
        delObj['JobId'] = this.relatedUserJobId;
        let typeCode = this.GridId=== 'EmployeeNotes_grid_001' ? 'EMPL' : 'CAND'//who:maneesh,what:ewm-15775 for pass userTypecode,when:19/01/2023
        delObj['UserTypeCode'] = typeCode;
        this.candidateService.deleteCanEmpNotesById(delObj).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
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
           // <!-- who:Bantee,why:ewm.11723 Two popup open on on click filter button ,when:10/04/2023 -->
            this.filterConfig = repsonsedata.Data.FilterConfig;
            // console.log(this.filterConfig,"this.filterConfig")
            this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
            this.getClientYearMonthList();
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig?.filter(x => x.Selected == true);
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
      // maxWidth: "750px",
      // width: "90%",
      // data: dialogData,
      data: new Object({
        fromDate: this.PatchFromDate, ToDate: this.PatchToDate,filterCountDateNotes:this.filterCountDate
      }),
      panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
     /* const d = new Date(result.FromDate);
      this.FromDate =   new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
      const T = new Date(result.ToDate);
      this.ToDate =   new Date(T.getFullYear(), T.getMonth(), T.getDate(), T.getHours(), T.getMinutes() - T.getTimezoneOffset()).toISOString();
    */
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
    this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
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
      // maxWidth: "750px",
      // width: "90%",
      data: new Object({searchFor:this.category,selectedOrDeSelected: this.selectedOrDeSelected}),
      panelClass: ['xeople-modal-lg', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result!=false ) {
        sessionStorage.setItem('SelectedEmpNotsCatogry',JSON.stringify(result.selectedOrDeSelected) );
        this.oldValue=result?.res;
        this.CategoryIds=result.res;
        this.selectedOrDeSelected = result?.selectedOrDeSelected;//who:maneesh,what:ewm-15484 for patch data when edit search catogry,when:05/02/2024
        this.filterCountCategory=this.CategoryIds?.length;
        if (result?.selectedOrDeSelected!=undefined) {
        let selectedArray = result?.selectedOrDeSelected?.filter(x => x?.IsSelected == 1); //who:maneesh,what:ewm-15484 for patch data when edit search catogry,when:05/02/2024
        this.filterCountCategory=selectedArray?.length;
        }
      }else{
        this.CategoryIds=this.oldValue;
        this.selectedOrDeSelected=JSON.parse(sessionStorage.getItem('SelectedEmpNotsCatogry'));
        if (this.selectedOrDeSelected?.length==0) {
        this.filterCountCategory=0;      
        }
      }
      // this.CategoryIds = result.res;
      // this.filterCountCategory = this.CategoryIds.length;
      this.filterCountOwner = this.OwnerIds.length;
      var element = document.getElementById("filter-category");
      element.classList.add("active");
      this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
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
    this.getClientNotesListScroll(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
  }
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  scrolled(event: any){
    const end = this.viewPort?.getRenderedRange()?.end;
    const start = this.viewPort?.getRenderedRange()?.start;
    const total =this.viewPort?.getDataLength();
   if (end >= total) {
     this.nextBatch();
      }
   if (start == 0) {
   //  this.previousBatch(stageId,index);
   }
 } 
 nextBatch(){
  let maxSize = this.responseData?.TotalPages;
  let HeaderPageNo= this.pagneNo;
  if(HeaderPageNo<maxSize){
       this.pagneNo = Number(this.pagneNo+1);
       this.onScrollDown();
  }
 }

  getClientNotesListScroll(clientId: any, year: number, month: string, pageNo) {
    this.loading = true;
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj = {};
    jsonObj['CandidateId'] = this.candidateIdData;
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
    jsonObj['NotesFilterParams'] = [];
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
   // jsonObj['OrderBy'] = '';
    jsonObj['OrderBy']='LastUpdated, ASC';
    jsonObj['GridId'] = this.GridId;
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    jsonObj['search'] = this.searchValue;
    this.candidateService.fetchNotesAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            let nextgridView = [];
            nextgridView = data.Data;
            this.gridList = this.gridList.concat(nextgridView);
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
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
  onHover(i: number) {
    this.hoverIndex = i;
    var element = document.getElementById("flex-box-hover");
    if (i != -1) {
      element.classList.add("test");
    } else {
      this.hoverIndex = i;
      element.classList.remove("test");
    }
  }
  getIcon(uploadDocument) {
    if (uploadDocument) {
      const list = uploadDocument.split('.');
      const fileType = list[list.length - 1];
      let FileTypeJson = this.documentTypeOptions?.filter(x => x['type'] === fileType.toLocaleLowerCase());
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
 this.activestatus = value;
 this.formHeading = value;
 this.dateFill = new Date();
 this.isDropdownShow = true;
   //  who:maneesh,what:ewm-11958 for by default public button patch,when:18/04/2023
   this.clientNotesForm.patchValue({
    'AccessName': this.AccessName,
    'AccessId': this.AccessId
  });
  this.oldPatchValuesAccessMode = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
  if (value=='Add') {  //who:maneesh,what:ewm-15285 for handel save enabel disabel,when:05/12/2023
    this.isCategory = true; 
    this.EditorEventCapture(true);
    this.getEditorVal='';    
    this.mentionEditor?.editorFormControl.setValue(null);
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
    OpenViewPopUp(data:any){
      const dialogRef = this.dialog.open(ViewNotesComponent, {
        data:{notesViewInfo:data},
        panelClass: ['xeople-modal-lg', 'view_notes', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult)
        {
        }
      });
    }
/*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 24-march-2023
    @Why: EWM-9802
    @What: For clear end  date
     */
    clearEndDate(e){
      this.clientNotesForm.patchValue({
        NotesDate:null
      });
    }
    /*
    @Type: File, <ts>
    @Name: add remove animation function
    @Who: maneesh
    @When: 13-feb-2023
    @Why: EWM-10466
    @What: add and remove animation
     */
    mouseoverAnimation(matIconId, animationName) {
      let amin = localStorage.getItem('animation');
      if (Number(amin) != 0) {
        document.getElementById(matIconId).classList.add(animationName);
      }
    }
    mouseleaveAnimation(matIconId, animationName) {
      document.getElementById(matIconId).classList.remove(animationName)
    }
    // refresh button onclick method by maneesh
  refreshComponent(){
    // this.selectedOrDeSelected=[];
    // this.selectedorDeselectedOwner = [];
    // this.OwnerIds = [];
    // this.CategoryIds = [];
    // this.filterConfig = [];
    // this.FromDate = null;
    // this.ToDate = null;
    // this.filterCountDate=0;
    // this.filterCountOwner=0;
    // this.filterCountCategory=0;
    // this.filterCount=0;
    // this.monthFilterRes='';
    // this.yearFilterRes = this.currentYear;
    this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
    this.getClientYearMonthList();
  }
  // <!--@Who: Bantee Kumar,@When:15-May-2023,@Why:EWM-11943-->
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
        this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
          this.editor.exec('insertImage', res);
           this.loading = false;
        })
      }
      else {
        this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
          this.editor.exec('insertImage', res);
          this.loading = false;
        })
      }
    }
  })
}
// <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
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
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
  openMultipleAttachmentModal() {
    let files = [];
       this.fileAttachments.forEach(element => {
         if(element.hasOwnProperty('Path')){
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
  onChangeVal(e:any){    
    this.selectedCategory = e;
    if (this.selectedCategory.length!=0) { //maneesh,what:ewm-15285 for save btn iseu while update,when:04/12/2023
      this.isCategory = false;
    }
    else{
      this.isCategory = true;
    }
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
    this.getClientNotesList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
    this.getClientYearMonthList();
    this.searchdata='inputValue';
  }
 
    //  @Who: Renu, @When: 04-03-2024,@Why: EWM-15213-EWM-16313 @What: on changes on kendo editor catch the event here

    // getEditorFormInfo(event) {
    //   this.ownerList = event?.ownerList;
    //   if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
    //     this.showErrorDesc = false;
    //     this.clientNotesForm.get('Description').setValue(event?.val);
    //   } else {
    //     this.showErrorDesc = true;
    //     this.clientNotesForm.get('Description').setValue('');
    //     this.clientNotesForm.get('Description').setValidators([Validators.required]);
    //     this.clientNotesForm.get('Description').updateValueAndValidity();
    //     this.clientNotesForm.get("Description").markAsTouched();
    //   }
    // }
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
    //  @Who: Renu, @When:@When: 04-03-2024,@Why: EWM-15213-EWM-16313 @What:get all mentions info from html tags on save/update
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
  
    //  @Who: Renu, @When: 04-03-2024,@Why: EWM-15213 EWM-16313 @What: get all event for editor here
    EditorEventCapture(isEnable?:boolean) {
      if(!isEnable){
        this.ShowEditor=false;
      }
      let mentionDiv: any = document.querySelectorAll(".suggestion-item-container");
      mentionDiv.forEach(node => {
        node.style.display = 'none';
      });
    }
   /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 22-11-2023
  @Why: EWM-15061
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
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
        DESC_VALUE:'EmployeeNotes',
        PLACEHOLDER:'label_recentnotesdescription',
        Tag:[],
        EditorTools:[],
        MentionStatus:true,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false
      };
      this.showErrorDesc=true;
      this.getRequiredValidationMassage.next(this.editorConfig);
      this.clientNotesForm.get('Description').updateValueAndValidity();
      this.clientNotesForm.get('Description').markAsTouched();
    }
}
