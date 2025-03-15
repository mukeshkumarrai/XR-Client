import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CandidateConfigureDashboardComponent } from './candidate-configure-dashboard/candidate-configure-dashboard.component';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { Icandidate } from './candidate-summary/Icandidate.interface';
import { ImageUploadPopupComponent } from '../../EWM.core/shared/image-upload-popup/image-upload-popup.component';
import { ProfileInfoService } from '../../EWM.core/shared/services/profile-info/profile-info.service';
import { SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CandidateFolderFilterComponent } from './candidate-folder-filter/candidate-folder-filter.component';
import * as FileSaver from 'file-saver';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { JobService } from '../../EWM.core/shared/services/Job/job.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { RequestGdprpopupComponent } from './request-gdprpopup/request-gdprpopup.component';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { MatSidenav } from '@angular/material/sidenav';
import { JobSMSComponent } from '../../EWM.core/job/job/job-sms/job-sms.component';
import { PushcandidateToEohFromPopupComponent } from '@app/modules/xeople-job/job-screening/pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { AlertDialogComponent } from '@app/shared/modal/alert-dialog/alert-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
enum Tab {
  'Summary',
  'Resume',
  'Social',
  'Job',
  'History',
  'Inbox',
  'Notes',
  'Activities',
  'SMS',
  'Attachements',
  'Call'
}
@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        // height: '50px',
        // opacity: 1,
      })),
      state('closed', style({
        // height: '120px',
        // opacity: 0,
      })),
      transition('open => closed', [
        animate('0.2s')
      ]),
      transition('closed => open', [
        animate('0.2s')
      ]),
      transition('* => closed', [
        animate('0.2s')
      ]),
      transition('* => open', [
        animate('0.2s')
      ]),
      transition('open <=> closed', [
        animate('0.2s')
      ]),
      transition('* => open', [
        animate('0.2s',
          style({ opacity: '*' }),
        ),
      ]),
      transition('* => *', [
        animate('0.2s')
      ]),
    ]),
  ],
})
export class ProfileSummaryComponent implements OnInit {
  background20: any;
  sticky: boolean = false;
  elementPosition: any;
  loading: boolean;
  images = [];


  selectedTabIndex: any = 0;
  profileImagePreview: string;
  profileImage: string = '';
  public imagePreviewloading: boolean = false;
  public imagePreviewStatus: boolean = true;

  selectedFiles: any;
  // scrolledValue: any;
  totalDataCount: number;
  @Input() candidateId: any;
  public candidateIdData: any;
  public candidateName: any;
  public GridDataListNotes: any = [];
  public gridDataCandidate: any = {};
  searchTextTag;
  candidateMapTagAll = [];
  candidateMapTagSelected = [];

  public tabActive: string;
  tabIndex:number=0;
  dirctionalLang;

  // candidateMapTagAll=[
  // {Id:1, Code:"Available",selected:1},
  // {Id:2, Code:"Blacklisted",selected:0},
  // {Id:3, Code:"Foreigner",selected:1},
  // {Id:4, Code:"Important",selected:0},

  // ]
  sizes = [
    {
      id: SCREEN_SIZE.small, name: 'small',
      css: `showMenu`
    },
    {
      id: SCREEN_SIZE.large, name: 'large',
      css: `hide`
    }
  ];
  prefix = 'is-';
  currentMenuWidth;
  overflowMenuItems;
  @ViewChild('mobileSide') mobileSide: MatMenuTrigger;
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false
  largeScreenTagData: any;
  smallScreenTagData: any;
  isMenuOpen = false;
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  public fileName: any;
  public fileUrl: any;
  public folderCancel;
  public downloadresumeEnable: boolean = false;
  dataTotalDocs: any;
  public dataTotalDocCount: number;
  public candidateTabMenu: any = [];
  public dataTotalMail: any;
  public showSummary: boolean = false;
  public showResume: boolean = false;
  public showSocial: boolean = false;
  public showInbox: boolean = false;
  public showJob: boolean = false;
  public showRecent_Activities: boolean = false;
  public showNotes: boolean = false;
  public showCall: boolean = false;
  public showDocuments: boolean = false;
  public showHistory: boolean = false;
  public showSms: boolean = false;
  public candidateEmail: any;
  public category: string = 'CAND';

  // header class
  mobileQuery: MediaQueryList;
  yearFilter: MediaQueryList;
  private _mobileQueryListener: () => void;
  isOpen: boolean = true;
  // header class

  public documentForCandidate: any = 'Candidate';
  public documentuserType: any = 'cand';
  public GridId = 'CandidateNotes_grid_001';
  dataTotalActivity: any;
  ConsentRequestStatus: any;
  msgOnConsentType: any;
  GDPRCompliance: any;
  isGdprSettings: any;
  activatedRoute:any;

  @Input() activeTabForScreening: any;
  public ActualFileName: string = '';
  positionMatTab: any;
  animationVar:any;
  section: any;
  public JobEmployeeGridId = 'JobCandidateGrid001';
  AlertMessage: any;
  IsRestricted: any;
  SMSHistory: any=[];
  smsHistoryToggel: boolean;
  quickFilterToggel: boolean;
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  isSmsHistoryForm: boolean;
  candidateDetails: any;
  burstSMSRegistrationCode: string;
  isSMSStatus: boolean;
  candidateData: any;
  candId: string;
  eohRegistrationCode: string;
  public IsEOHIntergrated: boolean=false;
  extractEnableCanCheck: boolean=false;
  IsXRCandidatePushedToEOH: number;
  referenceApplicantid: string;
  public userType='CAND';
  public contactPhone:number;
  candidateIdUnique: string;
  groupId:string;
  StatusName :string;
  StatusId:number
  StatusNameList: string;
  statusId: string;
  StatusNameListId: string;
  CandidateDatas:any=[];
  callDataCount:number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  brandAppSetting: any=[];
  EOHLogo: any;
  public userpreferences: Userpreferences;
  EOHId: string;
  constructor(
    private fb: FormBuilder, private router: ActivatedRoute, private _imageUploadService: ImageUploadService,
    private commonserviceService: CommonserviceService,
    public dialog: MatDialog, private snackBService: SnackBarService, public candidateService: CandidateService,
    private commonServiesService: CommonServiesService, private validateCode: ValidateCode, private rtlLtrService: RtlLtrService,
    private route: Router, public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private appSettingsService: AppSettingsService,
    public _dialog: MatDialog, private translateService: TranslateService, private _profileInfoService: ProfileInfoService,
    private systemSettingService: SystemSettingService, private elementRef: ElementRef, private jobService: JobService,
    private routes: ActivatedRoute, private dynamicMenuService: DynamicMenuService,
    private renderer: Renderer2, private mailService: MailServiceService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public _userpreferencesService: UserpreferencesService
  ) {
    this.profileImagePreview = "/assets/user.svg";
    // header class
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this.yearFilter = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef?.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    // if(this.mobileQuery.matches===true){
    //   this.isOpen=false;
    //   alert(this.isOpen)
    // }
    // header class
    this.burstSMSRegistrationCode = this._appSetting.burstSMSRegistrationCode;
    this.eohRegistrationCode = this._appSetting.eohRegistrationCode;
    this.groupId = this._appSetting?.candidateID;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;

  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.CandidateTabMenuAccess();
    this._sidebarService.searchEnable.next('1');
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    });
    //@who:priti @why:EWM-2973 @what:if candidate id is coming as input @when:28-sep-2021
    if (this.candidateId != undefined) {
      this.candidateIdData = this.candidateId;
      
    }
    if (this.candidateIdData == undefined) {// condition added by priti srivastava at 28-sep-2021 @why: EWM-2973
      this.routes.queryParams.subscribe((value) => {
        this.candidateIdData = value.CandidateId;
        if (value?.pageName != undefined && value?.pageName != null && value?.pageName != '') {
          if (value?.pageName == 'Documents') {
            this.selectedTabIndex = 9;
            this.tabActive = 'Documents';
          }
        }
        if (value?.pageName != undefined && value?.pageName != null && value?.pageName != '') {
          if (value?.pageName == 'Notes') {
            this.selectedTabIndex = 6;
            this.tabActive = 'Notes';
            setTimeout(() => {
              this.showSelectedRipple();
            }, 2500);
          }
        }
      });
    }
    this.getAlldocumentCount();
    this.commonserviceService.documentAdded.subscribe(value => {
      if (value !== null) {
        this.getAlldocumentCount();
      }
    });
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);

    this.currentMenuWidth = window.innerWidth;

    this.getCandidateSummaryList();
    this.getCandidatemappingTagList();
    this.getAssignedJobCount();
    this.getGDPRCompliance();

    if (this.currentMenuWidth < 1060) {
      this.isOpen = false
    } else {
      this.isOpen = true
    }
    this.fetchEmployeeNotesCount(true);
    this.fetchEmployeeActivityCount(true);

    if (this.activeTabForScreening == 'Recent Activity') {
      this.selectedTabIndex = 7;
      this.tabActive = 'Activities';
      // show recent tab selected on top EWM-6374  24-06-22 by Adarsh Singh
      setTimeout(() => {
        this.showSelectedRipple();
      }, 2500);
      // End here

    } else if (this.activeTabForScreening == 'Notes') {
      this.selectedTabIndex = 6;
      this.tabActive = 'Notes';
      // show recent tab selected on top EWM-6374  24-06-22 by Adarsh Singh
      setTimeout(() => {
        this.showSelectedRipple();
      }, 2500);
      // End here
    }
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });
    this.animationVar = ButtonTypes;
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user Share Notes, Recent Activity, Documents via Protected mode and Internal share, it should redirects user to that particular Note, Recent Activity and Documents -->

    this.activatedRoute = this.routes.url;

    this.routes.queryParams.subscribe((value) => {
      if(value.cantabIndex==0){
        this.selectedTabIndex = 0;
         this.showSummary = true;
         this.tabActive="Summary";

      }else if(value.cantabIndex==1){
        this.selectedTabIndex = 1;

        this.showResume = true;
        this.tabActive="Resume";

      }else if(value.cantabIndex==2){
        this.selectedTabIndex = 2;
        this.showSocial = true;
        this.tabActive="Social";
      }
      /*-- @Who: Satya Prakash Gupta,@Why:EWM-13283 EWM-13407,@When:21-Jul-2023,@What:Show Inbox Tab-*/
      else if(value.cantabIndex==5){
        this.selectedTabIndex = 5;
        this.showInbox = true;
        this.tabActive="Inbox";
      }else if(value.cantabIndex==3){
        this.selectedTabIndex = 3;
        this.showJob = true;
        this.tabActive="Job";
      }else if(value.cantabIndex==7){
        this.selectedTabIndex = 7;
       this.showRecent_Activities = true;
       this.tabActive="activities";

      }else if(value.cantabIndex==6){
        this.selectedTabIndex = 6;
        this.showNotes = true;
        this.tabActive="Notes";

      }else if(value.cantabIndex==9){
        this.selectedTabIndex = 9;
       this.showDocuments = true;
      this.tabActive="Attachements";

      }else if(value.cantabIndex==4){
        this.selectedTabIndex = 4;
        this.showHistory = true;
        this.tabActive="History";

      }else if(value.cantabIndex==8){
        this.selectedTabIndex = 8;
        this.showSms = true;
        this.tabActive="SMS";

      }else if(value.cantabIndex==10){
        this.selectedTabIndex = 10;
        this.showCall = true;
        this.tabActive="Call";
      }else{
        this.selectedTabIndex = 0;
        this.showSummary = true;
        this.tabActive="Summary";
      }

     })
this.getIntegrationCheckSMSstatus();
this.commonserviceService?.CandidateSummeryHeaderdata?.subscribe((data:any)=>{ //who:maneesh,what:ewm-14825 for update candidate data when,23/10/2023
  if (data==true) {
    this.getCandidateSummaryList();
  }
});
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let EOHIntegrationSubscribe = JSON.parse(localStorage.getItem('EOHIntegration'));
    let eohRegistrationCode=otherIntegrations?.filter(res=>res.RegistrationCode==this.eohRegistrationCode);
    this.IsEOHIntergrated =  eohRegistrationCode[0]?.Connected;
    this.extractEnableCanCheck=EOHIntegrationSubscribe?.candExtractEnable;
    this.getAllStatus();
    this.commonserviceService.countRefreshForContact.subscribe(res => {
      if (res?.candidateCall==true) {
      this.countVxtCall(res?.candidateId);     
      }
    });
    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople);
    this.EOHLogo=filteredBrands[0]?.logo;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    // @Who: Bantee Kumar,@Why:EWM-12446,@When: 22-Jun-2023,@What:global search header issue -->

    this._sidebarService.searchEnable.next('1');
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }


  /*
   @Type: File, <TS>
   @Name: CandidateTabMenuAccess
   @Who: Anup
   @When: 21-Sep-2021
   @Why: EWM-2682 EWM-2578
   @What: For Tab Menu Access For Candidate
   */
  CandidateTabMenuAccess() {
    let menuData: any[] = JSON.parse(localStorage.getItem('menuInfo'));
    if (menuData != undefined && menuData != null) {
      let candidateMenuData: any = menuData.filter((canData: any) => {
        return canData.Name == "candidate"
      })

      if (candidateMenuData[0]?.Children != undefined && candidateMenuData[0]?.Children != null) {
        let TabMenuData = candidateMenuData[0]?.Children.filter((childMenuData: any) => {
          return childMenuData.Name == "candidate-list"
        })

        this.candidateTabMenu = TabMenuData[0]?.Children;
      }
    }

    if (this.candidateTabMenu != undefined && this.candidateTabMenu != null) {
      for (let index = 0; index < this.candidateTabMenu.length; index++) {
        const element = this.candidateTabMenu[index];
        switch (element.Name) {
          case "Summary":
            this.showSummary = true;
            break;

          case "Resume":
            this.showResume = true;
            break;

          case "Social":
            this.showSocial = true;
            break;

          case "Inbox":
            this.showInbox = true;
            break;


          case "Job":
            this.showJob = true;
            break;


          case "Activities":
            this.showRecent_Activities = true;
            break;


          case "Notes":
            this.showNotes = true;
            break;


          case "Documents":
            this.showDocuments = true;
            break;

          case "History":
            this.showHistory = true;
            break;
            case "SMS":
              this.showSms = true;
              break;
              case "Call":
                this.showCall = true;
                break;
          default:
            this.showSummary = false;
            this.showResume = false;
            this.showSocial = false;
            this.showInbox = false;
            this.showJob = false;
            this.showRecent_Activities = false;
            this.showNotes = false;
            this.showDocuments = false;
            this.showHistory = false;
            this.showCall = false;
            break;
        }

      }
    }
  }





  // Total Notes Count ////
  dataTotalNotes: any;
  fetchDataFromNotes(data: any) {
    this.dataTotalNotes = data;
  }

  // Total Docs Count ////
  fetchDataFromDocs(data: any) {
    this.dataTotalDocs = data;
  }

  //// inbox count
  fetchDataFromInbox(data: any) {
    this.dataTotalMail = data;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // this.renderer.listen('window', 'click',(e:Event)=>{
    //   if(e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement){
    //       this.isMenuOpen=false;
    //  }
    // });
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
  @Name: getCandidateSummaryList function
  @Who:  Suika
  @When: 12-May-2021
  @Why: EWM-1445 EWM-1597
  @What: service call for creating Tag List data
  */
  getCandidatemappingTagList() {
    this.candidateService.getCandidateMappingTagList("?candidateid=" + this.candidateIdData).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.candidateMapTagAll = repsonsedata.Data;
          if (this.candidateMapTagAll != null)// condition added by priti on 3 sep 2021
          {
            const filterselectedTag = this.candidateMapTagAll.filter((e: any) => {
              return e.IsSelected === 1;
            });
            this.candidateMapTagSelected = filterselectedTag;

            this.mobileMenu(this.candidateMapTagSelected);
          }

        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }





  /*
      @Type: File, <ts>
      @Name: selectTagList function
      @Who: Anup
      @When: 18-Aug-2021
      @Why: EWM-2240.EWM-2547
      @What:select tag list
      */

  selectTagList($event: any, tag: any) {
    // this stops the menu from closing
    $event.stopPropagation();
    $event.preventDefault();

    var item = this.candidateMapTagAll.find(x => x.TagId == tag.TagId);
    if (item) {
      if (tag.IsSelected == 1) {
        item.IsSelected = 0;
      } else {
        item.IsSelected = 1;
      }

      this.UpdateMapTagList(item);
    }
  }

  /*
      @Type: File, <ts>
      @Name: UpdateMapTagList function
      @Who: Anup
      @When: 18-Aug-2021
      @Why: EWM-2240.EWM-2547
      @What:update tag list
      */

  UpdateMapTagList(tagData) {
    //this.loading = true;
    let tagUpdateObj = {};
    tagUpdateObj['CandidateId'] = this.candidateIdData,
      tagUpdateObj['TagId'] = tagData.TagId,
      tagUpdateObj['TagName'] = tagData.TagName,
      tagUpdateObj['Color'] = tagData.Color,
      tagUpdateObj['IsSelected'] = tagData.IsSelected

    this.candidateService.updateCandidateMappingTagList(tagUpdateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getCandidatemappingTagList();
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else if (repsonsedata.HttpStatusCode === 400) {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }



  // divScroll(e) {
  //   // console.log(e.srcElement, "e.srcElement.scrollTop")
  //   if (e.srcElement.scrollTop >= 100) {
  //     this.scrolledValue = e.isTrusted;
  //   } else {
  //     this.scrolledValue = false;
  //   }
  // }


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

  candidateConfigureDashboard() {
    const dialogRef = this.dialog.open(CandidateConfigureDashboardComponent, {
      panelClass: ['xeople-modal', 'candidateConfigureDashboard', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }




  /*
  @Type: File, <ts>
  @Name: getCandidateSummaryList function
  @Who:  Suika
  @When: 12-May-2021
  @Why: EWM-1445 EWM-1597
  @What: service call for creating Tag List data
  */
 CallLogdata:boolean=false
  getCandidateSummaryList() {
    this.loading = true;
    this.candidateService.getCandidateSummaryList("?candidateid=" + this.candidateIdData).subscribe(
      (repsonsedata: Icandidate) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.totalDataCount = repsonsedata['TotalRecord'];
          /*-@Why: Handle null check,@When: 22-08-2023,@Who: Maneesh--*/
          this.gridDataCandidate = repsonsedata?.Data;
          this.countVxtCall(repsonsedata?.Data?.CandidateId);
        // sessionStorage.setItem('CallLogDatass',JSON.stringify(repsonsedata?.Data) ); //by maneesh           
        localStorage.setItem('candidateCallLogData',JSON.stringify(repsonsedata?.Data) ); //by maneesh           
          this.candidateName = this.gridDataCandidate?.Name;
          this.CallLogdata=true;
          this.IsXRCandidatePushedToEOH=this.gridDataCandidate?.IsXRCandidatePushedToEOH;
          this.referenceApplicantid=this.gridDataCandidate?.MemberId;
          this.EOHId=this.gridDataCandidate?.EOHId;
          const pageTitle= 'label_Menucandidates';
          const subpageTitle = ' | ' +this.candidateName;
          this.commonserviceService.setTitle(pageTitle,subpageTitle);
          /*-@Why: EWM-12714,@When: EWM-12-06-2023,@Who: Nitin Bhati--*/
          this.AlertMessage = this.gridDataCandidate?.AlertMessage;
          this.IsRestricted = this.gridDataCandidate?.IsRestricted;

          this.fileName = this.gridDataCandidate.FileName;
          this.fileUrl = this.gridDataCandidate.ResumeUrl;
          this.ActualFileName = this.gridDataCandidate.ActualFileName;
          this.StatusNameList = this.gridDataCandidate?.StatusName;
          this.StatusNameListId = this.gridDataCandidate?.StatusId;
          // <!---------@When: 23-Aug-2023 @who:Adarsh singh @why: EWM-13921--------->
          let enc:string = btoa('selectedCand');
          localStorage.setItem(enc, this.gridDataCandidate.CandidateEmail);
          // end
          if (this.fileUrl === '') {
            this.downloadresumeEnable = true;
          } else {
            this.downloadresumeEnable = false;
          }
          this.candidateService.setCandidateName(this.candidateName);
          this.profileImagePreview = repsonsedata.Data?.ImageUrl;
          this.loading = false;
          if (!this.profileImagePreview) {
            this.profileImagePreview = "/assets/user.svg";
            this.loading = false;

          } else {
            this.profileImagePreview;
            this.loading = false;

          }

          // this.reloadListData();
          // this.doNext();

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        this.loading = false;
      })
  }





  openDialog(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '220px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /*
    @Type: File, <ts>
    @Name: updateCandidateImage
    @Who: Anup
    @When: 12-Aug-2021
    @Why: EWM-2240 EWM-2414
    @What: For update candidate Image
    */
  updateCandidateImage(profileImage) {
    this.loading = true;
    let imageUpdateObj = {}
    imageUpdateObj['Image'] = profileImage;
    imageUpdateObj['CandidateId'] = this.candidateIdData;
    this.imagePreviewloading = true;
    this.candidateService.updateCandidateImage(imageUpdateObj).subscribe(
      repsonsedata => {
        this.loading = false;
        this.imagePreviewloading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.loading = false;

          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })

  }



  /*
  @Type: File, <ts>
  @Name: upload Image function
  @Who: Anup
  @When: 12-Aug-2021
  @Why: EWM-2240 EWM-2414
  @What: use for upload image on server
*/
  uploadImageFileInBase64() {
    this.imagePreviewloading = true;
    const formData = { 'base64ImageString': this.croppedImage };
    this._profileInfoService.ImageUploadBase64(formData).subscribe(
      repsonsedata => {
        this.profileImagePreview = "";
        this.profileImage = '';
        this.imagePreviewStatus = false;
        this.profileImage = repsonsedata.Data[0].FilePathOnServer;
        this.profileImagePreview = repsonsedata.Data[0].Preview;
        this.gridDataCandidate.ImageUrl=repsonsedata.Data[0].Preview;
        this.updateCandidateImage(this.profileImage)
        if (!this.profileImagePreview) {
          this.profileImagePreview = "@app/assets/user.svg";
        } else {
          this.profileImagePreview;
        }
        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      })
  }

  /*
     @Type: File, <ts>
     @Name: upload Image function
     @Who: Anup
     @When: 12-Aug-2021
     @Why: EWM-2240 EWM-2414
     @What: use for upload image on server
   */
  croppedImage: any = '';
  croppingImage() {
    // this.loading = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    // @when:10-feb-2021 @who:priti @why:EWM-882  @What: pass data to image component to check size and type of image
    dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeMedium(),ratioStatus:true , recommendedDimensionSize:true, recommendedDimensionWidth:'700',recommendedDimensionHeight:'700' });
    const modalDialog = this._dialog.open(ImageUploadPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        // this.loading = true;
        this.uploadImageFileInBase64();
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
    @Name: ActiveTab
    @Who: Renu
    @When: 16-Aug-2021
    @Why: EWM-2199 EWM-2531
    @What: for getting the active tab and load data accordingly
  */
  ActiveTab(event) {
    this.tabActive = Tab[event.index];    
    if (this.activeTabForScreening == 'Recent Activity') {
      let recentActivityTab = document.querySelector<HTMLElement>('.candidate-tab .mat-tab-list');
      recentActivityTab.classList.remove('recentActivityTab');
    }
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user Share Notes, Recent Activity, Documents via Protected mode and Internal share, it should redirects user to that particular Note, Recent Activity and Documents -->

    this.tabIndex = event.index;
    this.route.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: { cantabIndex: this.tabIndex,'uniqueId': null, },
      queryParamsHandling: 'merge'
    });
 
  }

  ngAfterViewInit(): void {
    this.routes.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
        if(this.candidateIdUnique!=value?.CandidateId){
          this.candidateIdData = value?.CandidateId;
          this.candidateIdUnique = value?.CandidateId;
         this.reloadApiBasedOnorg();
         this.getAssignedJobCount();
         this.getEmployeeActivityCount();
         this.getAlldocumentCount();
         this.getEmployeeNotesCount();
        }
      }
    });
    //this.detectScreenSize();
  }

  /*
    @Type: File, <ts>
    @Name: detectScreenSize
    @Who: Anup
   @When: 20-Aug-2021
   @Why: EWM-2240 EWM-2564
    @What: Detect screen curerent size and change the menu list accordingly for small screen
*/

  private detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
      // check its display property value
    })

    this.mobileMenu(this.candidateMapTagSelected);
  }


  /*
     @Type: File, <TS>
     @Name: mobileMenu()
     @Who: Anup
     @When: 20-Aug-2021
     @Why: EWM-2240 EWM-2564
     @What: menu which will be shown as an header for screen size smaller
     */

  MobileMapTagSelected: any;
  mobileMenu(data) {
    if (data) {
      let items = data.slice(0, 5);
      let threeDotItems = data.slice(5, data.length);

      this.MobileMapTagSelected = [];

      this.largeScreenTagData = items;
      this.smallScreenTagData = threeDotItems;

      if (this.currentMenuWidth > 1312 && this.currentMenuWidth < 1432) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 3));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      } else if (this.currentMenuWidth > 1192 && this.currentMenuWidth < 1313) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 4));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      } else if (this.currentMenuWidth > 1032 && this.currentMenuWidth < 1193) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 5));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else if (this.currentMenuWidth > 952 && this.currentMenuWidth < 1033) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 6));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else if (this.currentMenuWidth > 832 && this.currentMenuWidth < 953) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 7));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else if (this.currentMenuWidth > 319 && this.currentMenuWidth < 833) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 8));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else {
        // this.getCandidatemappingTagList()
        //this.detectScreenSize();
        this.largeScreenTag = true;
        this.mobileScreenTag = false;
      }
    }

  }


  /*
   @Type: File, <TS>
   @Name: onResize
   @Who: Anup
   @When: 20-Aug-2021
   @Why: EWM-2240 EWM-2564
   @What: to ajust the mobile menu while resizing the screen
   */

  //candidateMapTagSelected;
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
    event.target.innerWidth;
    if (this.candidateMapTagSelected.length > 0) {
      //  this.mobileMenu();
    }
    if (this.currentMenuWidth < 1060) {
      this.isOpen = false
    } else {
      this.isOpen = true
    }
  }


  reloadApiBasedOnorg() {
    this.getCandidateSummaryList();
  }

  /*
    @Type: File, <TS>
    @Name: getResumeInfo
    @Who: Renu
    @When: 25-Aug-2021
    @Why: EWM-2240 EWM-2655
    @What: to get cureent candidate Resume info
    */

  openQuickFolderModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folder';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(CandidateFolderFilterComponent, {
      data: new Object({ candidateId: this.candidateIdData }),
      // data: dialogData,
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        this.folderCancel = 1;
        this.commonserviceService.onOrgSelectFolderId.next(this.folderCancel);
      } else {
        //this.folderLoader = false;
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


  getResumeInfo(event) {
    if (event == false) {
      this.downloadresumeEnable = true;
    } else {
      this.fileName = event.FileName;
      this.fileUrl = event.url;
      this.downloadresumeEnable = false;
    }
  }

  /*
    @Type: File, <ts>
    @Name: onDownloadResume function
    @Who: Renu
    @When: 25-Aug-2021
    @Why: EWM-2240 EWM-2655
    @What: on click download resume of candiate
  */

  onDownloadResume(url: any, ActualFileName: any) {
    FileSaver.saveAs(url, ActualFileName);
  }


  /*
    @Type: File, <ts>
    @Name: deleteCandidateInfo
    @Who: Renu
    @When: 27-Aug-2021
    @Why: EWM-2240 EWM-2654
    @What: delete confirmation to deletE candidate Info
  */

  deleteCandidateInfo() {
    let delObj = {};
    delObj['CandidateId'] = this.candidateIdData;
    delObj['Name'] = this.gridDataCandidate?.Name;
    // who:maneesh,what: ewm-13277 pass type  "CAND" parameter,when:03/08/2023
    delObj['Type'] = "CAND";
    const message = 'label_titleDialogContent';
    const title = this.gridDataCandidate?.Name;
    const subTitle = 'label_asCandidate';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.candidateService.deleteCandidateInfo(delObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.route.navigate(['./client/cand/candidate/candidate-list']);
            } else if (data.HttpStatusCode === 400) {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }



  getAlldocumentCount() {
    this.loading = true;
    this.candidateService.getDocumentCount('?usertypeid=' + this.candidateIdData)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          //console.log(data.Data.FileCount);
          this.dataTotalDocCount = data.Data.FileCount;
          // console.log("docs  "+this.dataTotalDocCount);
        }
        else if (data.HttpStatusCode == 204) {
          this.dataTotalDocs = 0;
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  getCandidateEmailInfo(event) {
    this.candidateEmail = event;
    this.getMailCount(this.candidateEmail);
  }

  /*
 @Type: File, <ts>
 @Name: getMailCount
 @Who: Renu
 @When: 20-Oct-2021
 @Why: EWM-1733 EWM-3126
 @What: To get mail count Info for particular candidate
 */
  getMailCount(candidateEmail: any) {
    //this.loading=true;
    // alert("profile "+candidateEmail);
    this.mailService.fetchMailCandidateCount(candidateEmail).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalMail = repsonsedata.Data.Inbox;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalMail = repsonsedata.Data.Inbox;

          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
 @Type: File, <ts>
 @Name: getAssignedJobCount
 @Who: Anup
 @When: 22-Oct-2021
 @Why: EWM-3039 EWM-3405
 @What: To get Assigned job count for particular candidate
 */
  dataTotalAssignJob: any;
  getAssignedJobCount() {
    this.jobService.fetchAssignJobCount("?candidateid=" + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalAssignJob = repsonsedata.Data.JobCount;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalAssignJob = repsonsedata.Data.JobCount;

          this.loading = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
@Name: fetchassignJobCount function
@Who: Anup Singh
@When: 22-oct-2021
@Why: EWM-3039
*/
  fetchassignJobCount(value) {
    if (value == true) {
      this.getAssignedJobCount();
    }
  }



  /*
     @Type: File, <ts>
     @Name: fetchEmployeeNotesCount function
     @Who: Renu
     @When: 01-Dec-2021
     @Why: EWM-3696 EWM-3970
     @What: for Employee count when add new Notes
   */
  fetchEmployeeNotesCount(value) {
    if (value == true) {
      this.getEmployeeNotesCount();
    }
  }
  /*
     @Type: File, <ts>
     @Name: getEmployeeNotesCount function
     @Who: Renu
     @When: 01-Dec-2021
     @Why: EWM-3696 EWM-3970
     @What: for client count when add new Notes api call
   */
  getEmployeeNotesCount() {
    let currentYear = (new Date()).getFullYear();
    this.candidateService.fetchNotesTotal("?candidateId=" + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalNotes = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalNotes = repsonsedata.Data?.Count;
          this.loading = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
 @Type: File, <ts>
 @Name: fetchEmployeeActivityCount function
 @Who: Nitin Bhati
 @When: 13-Jan-2022
 @Why: EWM-4545
 @What: for Employee count when add new Activity
*/
  fetchEmployeeActivityCount(value) {
    if (value == true) {
      this.getEmployeeActivityCount();
    }
  }
  /*
     @Type: File, <ts>
     @Name: getEmployeeActivityCount function
      @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: for client count when add new Activity api call
   */
  getEmployeeActivityCount() {
    let currentYear = (new Date()).getFullYear();
    this.candidateService.fetchActivityTotal("?relateduserid=" + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalActivity = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalActivity = repsonsedata.Data?.Count;
          this.loading = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
   @Type: File, <ts>
   @Name: requestGDPRConsent
   @Who: Nitin Bhati
   @When: 10-Feb-2022
   @Why: EWM-5145
   @What: open poup for Request GDPR Consent
 */
  requestGDPRConsent() {
    let requestGDPRObj = {};
    requestGDPRObj['CandidateId'] = this.candidateIdData;
    requestGDPRObj['CandidateType'] = 'CAND';
    requestGDPRObj['ConsentType'] = this.msgOnConsentType;
    this.gridDataCandidate?.Name;
    const message = 'candidate_popuprequestGDPRConsent';
    const title = this.gridDataCandidate?.Name;
    //const subTitle = this.gridDataCandidate?.Name;
      // who:maneesh,why:ewm-10895 for green line in opration completed popup add 'Consent Request successfully sent to',when:17/03/2023
    const Toastmessage ='Consent Request successfully sent to'+' '+ this.gridDataCandidate?.Name;
    const dialogData = new ConfirmDialogModel(title, '', message);
    const dialogRef = this._dialog.open(RequestGdprpopupComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.candidateService.sendGDPRRequest(requestGDPRObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.ConsentRequestStatus = data.Data.ConsentRequestStatus;
              if (this.ConsentRequestStatus === 1) {
                // who:maneesh,why:ewm-10895 for green line timer i am comment this and add new  this.snackBService.showSuccessSnackBar,when:09/03/2023
                this.snackBService.showSuccessSnackBar(this.translateService.instant(Toastmessage), data.HttpStatusCode.toString());
                // this.snackBService.showGDPRConsentSnackBar(Toastmessage, data.HttpStatusCode.toString());
              }
            } else if (data.HttpStatusCode === 400) {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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
    @Name: receivedMessageConsentTypeHandler
    @Who: Nitin Bhati
    @When: 18-Feb-2022
    @Why: EWM-5145
    @What: Receving contentType status from additonnal information
    */
  receivedMessageConsentTypeHandler(consentTypeValue) {
    this.msgOnConsentType = consentTypeValue;
  }

  /*
@Type: File, <ts>
@Name: getGDPRCompliance
@Who: Nitin Bhati
@When: 18-Feb-2022
@Why: EWM-5145
@What: for get gdpr Compliance
*/
  getGDPRCompliance() {
    this.systemSettingService.fetchGDPRCompliance().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          // this.GDPRCompliance = repsonsedata.Data;
          this.isGdprSettings = repsonsedata.Data.IsGDPREnabled;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

/*
@Type: File, <ts>
@Name: showSelectedRipple
@Who: Adarsh singh
@When: 24-06-22
@Why: EWM-6374
@What: for selected header will show
*/
  showSelectedRipple() {
    let recentActivityTab = document.querySelector<HTMLElement>('.candidate-tab .mat-tab-list');
    recentActivityTab?.classList.add('recentActivityTab');

    if (recentActivityTab) {
      let nextBtn = document.querySelector<HTMLElement>('.candidate-tab .mat-tab-header-pagination-before');
      let preBtn = document.querySelector<HTMLElement>('.candidate-tab .mat-tab-header-pagination-after');
      nextBtn.addEventListener('click', () => {
        recentActivityTab.classList.remove('recentActivityTab');
      })
      preBtn.addEventListener('click', () => {
        recentActivityTab.classList.remove('recentActivityTab');
      })
    }
  }


      /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 13-07-2023
  @Why: EWM-11687
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}


getIntegrationCheckSMSstatus() {
  // this.loading = true;
  this.systemSettingService.getIntegrationCheckstatus(this.burstSMSRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        //  this.loading = false;
        if (repsonsedata.Data) {
          this.isSMSStatus = repsonsedata.Data?.Connected;
        }
      } else {
        //  this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      // this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

getCandidateData(event){
  this.candidateData = event;
}
smsHistoryDetails(candidateData) {
  this.contactPhone=candidateData?.PhoneNumber; //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
  this.candId = candidateData.CandidateId;
  this.getSMSHistory();
  this.smsHistoryToggel = true;
  this.quickFilterToggel=false;
  setTimeout(() => {
    this.openDrawer(candidateData);
  }, 1000);

}

getSMSHistory() {
  this.loading = true;
  this.systemSettingService.getSMSHistory('?Id='+this.candId+'&UserType='+this.userType).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.SMSHistory = [];
        this.loading = false;
      } else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })

}

openDrawer(can){
  setTimeout(() => {
    if(this.SMSHistory.length>0){
      this.smsHistoryDrawer.open();
      this.isSmsHistoryForm = true;
      // can['JobName'] = this.JobName;
      this.candId = can.CandidateId;
       this.candidateDetails = can;
    }else{
      this.openJobSMSForCandidate(can)
    }
  }, 1500);
}

openJobSMSForCandidate(dataItem) {
  const dialogRef = this.dialog.open(JobSMSComponent, {
    // maxWidth: "700px",
    data: new Object({ jobdetailsData: dataItem,UserType:this.userType}),
   // width: "90%",
   // maxHeight: "85%",
    panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
      this.getSMSHistory();
      this.loading = false;
    } else {
      this.loading = false;
    }
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
  })

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

}

toggleDrawer(start: any) {
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
  start.toggle();
}

fetchDataFromSMSHistory(event){
  if(event){
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
    this.smsHistoryDrawer.close();
  }
}

  pushCandidateToEOH(){
    let ApplicantMemberPublishedStatus=this.EOHId?.substring(0, 3)?.toLowerCase();
    if(this.EOHId?.substring(0, 3).toLowerCase()==='mbr' && this.EOHId!=null && this.EOHId !==''){
    const message = this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg1')+this.candidateName+this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg2')+this.EOHId;
    const title = ''
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData, isButtonShow: true},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    }else{
      const dialogRef = this.dialog.open(PushcandidateToEohFromPopupComponent, {
        data: new Object({candidateId:this.candidateIdData,IsOpenFor:'popUp',candidateName:this.candidateName,PublishedStatus: ApplicantMemberPublishedStatus}),
        panelClass: ['xeople-modal', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    }


    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }

  redirectOnMarketPlace(){
    this.route.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode))
  }
//by maneesh,what:ewm-17168 for get all status then also update status,when:23/05/2024
  getAllStatus() {
    this.candidateService.getAllStatus('?GroupId='+this.groupId + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo')
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.StatusName = data.Data;
          this.StatusId = data.Data?.Id;
        }
        else if (data.HttpStatusCode == 204) {
        this.StatusName = data.Data;
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

//by maneesh,what:ewm-17168 for get all status and update status,when:23/05/2024
  clickStatusID(StatusName, statusId) {
    this.statusId = statusId;
    let formObj = {};
      formObj["CandidateID"] = this.candidateIdData,
      formObj["CandidateName"] = this.candidateName,
      formObj["StatusID"] = this.StatusNameListId,
      formObj["StatusName"] = this.StatusNameList,
      formObj["Type"] = "CAND"

    let saveObj = {};
      saveObj["CandidateID"] = this.candidateIdData,
      saveObj["CandidateName"] = this.candidateName,
      saveObj["StatusID"] = statusId,
      saveObj["StatusName"] = StatusName,
      saveObj["Type"] ="CAND"
    let updateObj = {
      "From": formObj,
      "To": saveObj,
    };  
    this.candidateService.updateCandidateStatusList(updateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getCandidateSummaryList();
//by maneesh,what:ewm-17168 this service use for while update status then also update status from genral information,when:23/05/2024
          this.commonserviceService.changeStatusCandidate.next(true);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }

  input($event: any) {
    this.searchTextTag = ''
    $event.stopPropagation();
  }

  countVxtCall(Id) {
    this.candidateService.countVxtCall("?id=" + Id + "&usertype=" + 'CAND').pipe(takeUntil(this.destroy$)).subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200) {
           this.loading = false;
           this.callDataCount = repsonsedata.Data;           
         } else if (repsonsedata.HttpStatusCode === 204) {
           this.callDataCount =  repsonsedata.Data;
           this.loading = false;
         } else {
           //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
           this.loading = false;
         }
       }, err => {
         this.loading = false;
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
    }
}






