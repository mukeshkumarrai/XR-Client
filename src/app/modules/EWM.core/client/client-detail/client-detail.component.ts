import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
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
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';

import { SCREEN_SIZE } from 'src/app/shared/models';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { JobService } from '../../shared/services/Job/job.service';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { CandidateConfigureDashboardComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-configure-dashboard/candidate-configure-dashboard.component';
import { ClientSummaryModel, Icandidate } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-summary/Icandidate.interface';
import { CandidateFolderFilterComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { QuickCompanyComponent } from '../../shared/quick-modal/quick-company/quick-company.component';
import { ClientService } from '../../shared/services/client/client.service';
import { UserpreferencesService } from '../../../../shared/services/commonservice/userpreferences.service';
import { EditOwnerComponent } from '../edit-owner/edit-owner.component';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { ClientSummaryComponent } from './client-summary/client-summary.component';
import { ButtonTypes } from 'src/app/shared/models';
import { CandidateBulkSmsComponent } from '@app/modules/EWM-Candidate/candidate-list/candidate-bulk-sms/candidate-bulk-sms.component';
import { CandidateBulkEmailComponent } from '@app/modules/EWM-Candidate/candidate-list/candidate-bulk-email/candidate-bulk-email.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { UpdateclientAccess } from 'src/app/shared/models';
import { ManageAccessActivityComponent } from '@app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { PreviousRouteServiceService } from 'src/app/shared/services/PreviousRouteService/previous-route-service.service';
import { NavigationService } from '../../../../shared/helper/navigation.service';
import { ShareClientEohComponent } from './share-client-eoh/share-client-eoh.component';
import { Userpreferences } from '../../../../shared/models';
import { AlertDialogComponent } from '../../../../shared/modal/alert-dialog/alert-dialog.component';;
import { ConfigureCreateJobComponent } from '../../../EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-create-job/configure-create-job.component'


enum Tab {
  'Summary',
  'Jobs',
  'Locations',
  'Contacts',
  'History',
  'Inbox',
  'Notes',
  'Activities',
  'Documents',
  'Team',
  'SMS',
  'Call'
}



@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  // styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  background20: any;
  sticky: boolean = false;
  elementPosition: any;
  loading: boolean;
  images = [];
  public GridId: any = 'ClientTeamDetails_grid_001';
  isInbox: boolean = false;
  isClientSummary: boolean = false;

  selectedTabIndex: any = 0;
  profileImagePreview: string;
  profileImage: string = '';
  public imagePreviewloading: boolean = false;
  public imagePreviewStatus: boolean = true;

  selectedFiles: any;
  scrolledValue: any;
  totalDataCount: number;
  @Input() clientId: any;
  public clientIdData: any;
  public clientIdDatalist: any;
  public candidateName: any;
  public GridDataListNotes: any = [];
  public gridDataClient: any = {};
  searchTextTag;
  candidateMapTagAll = [];
  candidateMapTagSelected = [];
  public tabActive: string;
  animationVar: any;
 

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
  public downloadresumeEnable: boolean;
  dataTotalDocs: any;
  public dataTotalDocCount: number;
  public candidateTabMenu: any = [];
  public dataTotalMail: any = 0;
  public dataTotalNotes: any = 0;
  public showSummary: boolean = false;
  public showResume: boolean = false;
  public showSocial: boolean = false;
  public showInbox: boolean = false;
  public showLocation: boolean = true;
  public showJob: boolean = false;
  public showRecent_Activities: boolean = false;
  public showNotes: boolean = false;
  public showDocuments: boolean = false;
  public showHistory: boolean = false;
  public showsms: boolean = false;
  //public candidateEmail: any;
  clientName: any;
  IndustryName: any;
  OwnerNameList: any;
  Visibility: any;
  HoldingCompany: any;
  ImmediateParentName: any;
  Location: any;
  ClientStatus: any;
  ColorCode: any;
  gridDataClientList: any;
  clientDataList: any;
  addForm: FormGroup;
  currentStatus: any;
  currentStatusID: any;
  tagLength: number;
  tagLengthStatus: boolean = true;
  gridListData: any;
  ownerLength: number;
  ownerLengthStatus: boolean;
  OrganizationId: string;
  orgData = [];
  @Output() clientEmail = new EventEmitter<any>();
  public clientEmailId: any;
  public openJobTab: string = '';

  statusId: any;
  headerLoader: boolean;
  public category: string = 'CLIE';
  public documentForClient = 'Client'
  isOpen: boolean = true;
  dataTotalActivity: any;
  public pagesize;
  public pagneNo = 1;
  public sortingValue: string = "EmployeeName,desc";
  public searchValue: string = "";
  positionMatTab: any;
  tabIndex: number = 0;
  activatedRoute: any;
  @ViewChild('updateAddress') updateAddress: ClientSummaryComponent;
  public selectedCandidate: any = [];
  SMSCheckStatus: boolean = false;
  burstSMSRegistrationCode: string;
  selectedcontact:any=[]
  UserType:string='CONT';
  toEmailList: any;
  public multipleEmail:boolean = false;
  getCandidateData:any = [];
  getAllEmailIdFormMappedJob:any = [];
  IsEmailConnected: number;
  public selectedContactEmail:any=[];
  clientIdUnique: string='00000000-0000-0000-0000-000000000000';
  TabIndexNumber:any 
  public showCall: boolean = false;
  callDataCount:number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  IsJobTag:boolean=false;
  public clientType: string='client';
  public oldPatchValues = {};
  public clientTypeLabel: string='label_backToClientList';
  leadworkId: string='00000000-0000-0000-0000-000000000000';
  leadworkName: string;
  previousleadWorkId: string='00000000-0000-0000-0000-000000000000';
  IsEOHIntergrated: any;
  eohRegistrationCode: any;
  dirctionalLang;
  brandAppSetting: any=[];
  EOHLogo: any;
  public userpreferences: Userpreferences;
  extractEnableClientCheck: number=0;

  constructor(
    private fb: FormBuilder, private router: ActivatedRoute, private _imageUploadService: ImageUploadService,
    private commonserviceService: CommonserviceService,private previousRouteService: PreviousRouteServiceService,
    public dialog: MatDialog, private snackBService: SnackBarService, public candidateService: CandidateService,
    private commonServiesService: CommonServiesService, private validateCode: ValidateCode, private rtlLtrService: RtlLtrService,
    private route: Router, public _sidebarService: SidebarService, private _appSetting: AppSettingsService,
    public _dialog: MatDialog, private translateService: TranslateService,private navigationService:NavigationService,
    private elementRef: ElementRef, private jobService: JobService,private location: Location,
    private routes: ActivatedRoute, private dynamicMenuService: DynamicMenuService, private appSettingsService: AppSettingsService,
    private renderer: Renderer2, private mailService: MailServiceService, private _clientService: ClientService, 
    public _userpreferencesService: UserpreferencesService,
  ) {
    this.pagesize = _appSetting.pagesize;
  // who:maneesh,what: ewm-16067 for send  sms threedot client,when:01/03/2024
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    this.burstSMSRegistrationCode = this.appSettingsService?.burstSMSRegistrationCode;
    let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
    this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
    this.addForm = this.fb.group({
      ClientName: [[]],
      Status: [[]]
    });
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
    let eohRegistrationCode = otherIntegrations?.filter(res => res.RegistrationCode === this.eohRegistrationCode);
    this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected; 
    let EOHIntegrationSubscribe = JSON.parse(localStorage.getItem('EOHIntegration'));
    this.extractEnableClientCheck=EOHIntegrationSubscribe?.clientExtractEnable;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
  }

  ngOnInit(): void {
    this._sidebarService.searchEnable.next('1');
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this._sidebarService.searchEnable.next('1');
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })
    //this.OrganizationId = localStorage.getItem('OrganizationId');
    //@who:priti @why:EWM-2973 @what:if candidate id is coming as input @when:28-sep-2021
    if (this.clientId != undefined) {
      this.clientIdData = this.clientId;
    }
    if (this.clientIdData == undefined) {// condition added by priti srivastava at 28-sep-2021 @why: EWM-2973
      this.routes.queryParams.subscribe((value) => {        
        this.clientIdData = value?.clientId;
        this.clientType = value?.type ? value.type.toUpperCase() : this.clientType;
        this.openJobTab = value?.openTab;
        if (this.openJobTab === 'job') {
          this.selectedTabIndex = 1;
        }
      });
    }
    this.countVxtCall(this.clientIdData)
    this.commonserviceService.countRefreshForContact.subscribe(res => {
      if (res?.clientCall==true) {
      this.countVxtCall(this.clientIdData);     
      }
    });
    this.CandidateTabMenuAccess();
    this.getAlldocumentCount();
    this.commonserviceService.documentAdded.subscribe(value => {
      if (value !== null) {
        this.getAlldocumentCount();
      }
    });
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);

    this.currentMenuWidth = window.innerWidth;

    this.getClientNameList();
    this.getClientSummaryHeaderList();
    this.getClientmappingTagList();
    this.getLocationCount();
    this.getClientContactCount();
    this.getClientJobCount();
    this.getClientNotesCount();
    this.getMailCount('v');
    //this.getAssignedJobCount();
    this.getClientTeamCount();
    this.getClientActivityCount();
    this.commonserviceService.onClientSelectId.subscribe(value => {  // add api calling when change client dropdown ewm-18382 when:30/10/2024
      if (value !== null) {
       this.clientIdData = value;
       this.getClientSummaryHeaderList();
       this.getClientmappingTagList();
       this.getLocationCount();
       this.getClientContactCount();
       this.getClientJobCount();
       this.getClientNotesCount();
       this.getMailCount('v');
       this.getClientTeamCount();
       this.getClientActivityCount();
       this.countVxtCall(this.clientIdData);  
       this.getAlldocumentCount();
       this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
      }
    })
    this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
    if (this.currentMenuWidth < 1060) {
      this.isOpen = false
    } else {
      this.isOpen = true
    }

    this.tabActive = 'Summary';
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user Share Notes, Recent Activity, Documents via Protected mode and Internal share, it should redirects user to that particular Note, Recent Activity and Documents -->
    // @Who: Bantee Kumar,@Why:EWM-12464,@When: 17-May-2023,@What:On View client detail side overlay screen, when user clicks on Summary, Resume, Job, etc. from title bar, then on job detail page sections changes from Candidates to Search Candidates, Notes and so on. -->

    this.animationVar = ButtonTypes;
    this.activatedRoute = this.routes.url;
    if (this.clientType==='LEAD') {
      
      this.clientTypeLabel = 'label_backToLeadLanding';
      this.routes.queryParams.subscribe((value) => {                  
        if (value.cliTabIndex == 0) {
          this.selectedTabIndex = 0;
          this.showSummary = true;
          this.tabActive = "Summary";
        }  else if (value.cliTabIndex == 1) {
          this.selectedTabIndex = 1;
          this.showLocation = true;
          this.isInbox = true;
          this.tabActive = "Locations";
        } else if (value.cliTabIndex == 2) {
          this.isInbox = false;
          this.selectedTabIndex = 2;
          this.tabActive = "Contacts";
        } else if (value.cliTabIndex == 3) {
          this.isInbox = false;
          this.showHistory = true;
          this.selectedTabIndex = 3;
          this.tabActive = "History";
        } else if (value.cliTabIndex == 4) {
          this.selectedTabIndex = 4;
          this.showInbox = true;
          this.tabActive = "Inbox";
        }
        else if (value.cliTabIndex == 5) {
          this.selectedTabIndex = 5;
          this.showNotes = true;
          this.tabActive = "Notes";
        }
        else if (value.cliTabIndex == 6) {
          this.selectedTabIndex = 6;
          this.showRecent_Activities = true;
          this.tabActive = "Activities";
        }
        else if (value.cliTabIndex == 7) {
          this.selectedTabIndex = 7;
          this.showDocuments = true;
          this.tabActive = "Documents";//by maneesh ewm-17755 when:31/07/2024
        }
        else if (value.cliTabIndex == 8) {
          this.selectedTabIndex = 8;
          this.tabActive = "Team";
        }else if (value.cliTabIndex == 9) {
          this.selectedTabIndex = 9;
          this.showsms = true;
          this.tabActive = "sms";
        }else if (value.cliTabIndex == 10) {
          this.selectedTabIndex = 10;
          this.showCall = true;
          this.tabActive = "Call";
        }
         else {
          this.selectedTabIndex = 0;
          this.showSummary = true;
          this.tabActive = "Summary";
        }
      }) 
    }else{
      this.clientTypeLabel = 'label_backToClientList';
      this.routes.queryParams.subscribe((value) => { 
        if (value.cliTabIndex == 0) {
          this.selectedTabIndex = 0;
          this.showSummary = true;
          this.tabActive = "Summary";
        } else if (value.cliTabIndex == 1) {
          this.selectedTabIndex = 1;
          this.showJob = true;
          this.tabActive = "Jobs";
        } else if (value.cliTabIndex == 2) {
          this.selectedTabIndex = 2;
          this.showLocation = true;
          this.tabActive = "Locations";
        } else if (value.cliTabIndex == 3) {
          this.selectedTabIndex = 3;
          this.tabActive = "Contacts";
        } else if (value.cliTabIndex == 4) {
          this.selectedTabIndex = 4;
          this.tabActive = "History";
          this.showHistory = true;
        } else if (value.cliTabIndex == 5) {
          this.selectedTabIndex = 5;
          this.showInbox = true;
          this.tabActive = "Inbox";
        }/*-- @Who: Satya Prakash Gupta,@Why:EWM-13283 EWM-13405,@When:24-Jul-2023,@What:Show Inbox Tab-*/
        else if (value.cliTabIndex == 6) {
          this.selectedTabIndex = 6;
          this.showNotes = true;
          this.tabActive = "Notes";
        }
        else if (value.cliTabIndex == 7) {
          this.selectedTabIndex = 7;
          this.showRecent_Activities = true;
          this.tabActive = "Activities";
        }
        else if (value.cliTabIndex == 8) {
          this.selectedTabIndex = 8;
          this.showDocuments = true;
          this.tabActive = "Documents";//by maneesh ewm-17755 when:31/07/2024
        }
        else if (value.cliTabIndex == 9) {
          this.selectedTabIndex = 9;
          this.tabActive = "Team";
        }else if (value.cliTabIndex == 10) {
          this.selectedTabIndex = 10;
          this.showsms = true;
          this.tabActive = "sms";
        }else if (value.cliTabIndex == 11) {
          this.selectedTabIndex = 11;
          this.showCall = true;
          this.tabActive = "call";
        }
         else {
          this.selectedTabIndex = 0;
          this.showSummary = true;
          this.tabActive = "Summary";
        }
      })
    }

  // who:maneesh,what: ewm-16067 for send  sms threedot client,when:01/03/2024
    this.commonserviceService?.selectedContactForSms.subscribe(res => {
      if (res!=null) {
      this.selectedcontact=res;      
      this.getBulkSmsFlag(); 
      }
    });

      // who:maneesh,what: ewm-18367 for shoe job tag,when:07/10/2024
  this.commonserviceService?.showJobTagThreedotEmail.subscribe(res => {
    if (res?.IsJobTag==true) {
      this.IsJobTag=res?.IsJobTag;
    }
  });

  this.getclientAccessById(this.clientIdData);

  const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople);
  this.EOHLogo=filteredBrands[0]?.logo;

    
  }

  ngOnDestroy(){
    this.commonserviceService.onClientSelectId.next(null);
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

          case "Jobs":
            if(this.clientType ==='LEAD'){
              this.showJob = false;
              }else {
                this.showJob = true;
            }
         break;

          case "Locations":
            this.showLocation = true;
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
            if(this.clientType ==='LEAD'){
              this.showJob = false;
              }else {
                this.showJob = true;
            }
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
            this.showsms = true;
            break;
            case "Call":
              this.showCall = true;
              break;
          default:
            this.showSummary = false;
            this.showResume = false;
            this.showLocation = false;
            this.showSocial = false;
            this.showInbox = false;
            this.showJob = false;
            this.showRecent_Activities = false;
            this.showNotes = false;
            this.showDocuments = false;
            this.showHistory = false;
            this.showsms = false;
            this.showCall = false;
            break;
        }

      }
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



  // Open Tab Location Count ////
  activetabFromLocationCard(data: any) {
    if (data == true) {
      this.clientType.toUpperCase()==='LEAD'?this.selectedTabIndex = 1:this.selectedTabIndex = 2;
      
    } else {
      this.selectedTabIndex = 0;
    }
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
  /*
  @Type: File, <ts>
  @Name: getClientmappingTagList function
  @Who:  Nitin bhati
  @When: 22-Nov-2021
  @Why: EWM-3836
  @What: service call for creating Tag List data
  */
  getClientmappingTagList() {
    this._clientService.getClientMappingTagList("?clientid=" + this.clientIdData).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.candidateMapTagAll = repsonsedata.Data;
          if (this.candidateMapTagAll != null)// condition added by priti on 3 sep 2021
          {
            const filterselectedTag = this.candidateMapTagAll.filter((e: any) => {
              return e.IsSelected === 1;
            });
            this.candidateMapTagSelected = filterselectedTag;
            this.tagLength = this.candidateMapTagSelected.length;
            if (this.tagLength === 0) {
              this.tagLengthStatus = true;
            } else {
              this.tagLengthStatus = false;
            }
            this.mobileMenu(this.candidateMapTagSelected);
            //console.log("tagdata:",this.candidateMapTagSelected);
          }

        } else if (repsonsedata['HttpStatusCode'] == '204') {
          this.tagLengthStatus = true;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  input($event: any) {
    //  who:maneesh,why:ewm-9126  this.searchTextTag=''",when:24/01/2023
    this.searchTextTag = ''
    $event.stopPropagation();
    // $event.preventDefault();
  }
  /*
      @Type: File, <ts>
      @Name: selectTagList function
      @Who: Nitin Bhati
      @When: 22-Nov-2021
      @Why: EWM-3836
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
      @Who: Nitin Bhati
      @When: 22-Nov-2021
      @Why: EWM-3836
      @What:update tag list
      */
  UpdateMapTagList(tagData) {
    //this.loading = true;
    let tagUpdateObj = {};
    tagUpdateObj['ClientId'] = this.clientIdData;
    tagUpdateObj['TagId'] = tagData.TagId;
    tagUpdateObj['TagName'] = tagData.TagName;
    tagUpdateObj['Color'] = tagData.Color;
    tagUpdateObj['IsSelected'] = tagData.IsSelected;
    //tagUpdateObj['RecordFor'] = 'EMPL';

    this._clientService.updateClientMappingTagList(tagUpdateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getClientmappingTagList();
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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



  divScroll(e) {
    // console.log(e.srcElement, "e.srcElement.scrollTop")
    if (e.srcElement.scrollTop >= 100) {
      this.scrolledValue = e.isTrusted;
    } else {
      this.scrolledValue = false;
    }
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

  candidateConfigureDashboard() {
    const dialogRef = this.dialog.open(CandidateConfigureDashboardComponent, {
      panelClass: ['xeople-modal', 'candidateConfigureDashboard', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }




  /*
  @Type: File, <ts>
  @Name: getClientSummaryHeaderList function
  @Who:  Nitin Bhati
  @When: 22-Nov-2021
  @Why: EWM-3834
  @What: service call for creating Header List data
  */
phoneNumber='';
  getClientSummaryHeaderList() {
    this.loading = true;
    this.isInbox = false;
    this._clientService.getClientSummaryHeaderList(this.clientIdData,this.clientType).subscribe(
      (repsonsedata: ClientSummaryModel) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.loading = false;
          this.headerLoader = false;
          if (repsonsedata.Data != null) {
            this.gridDataClient = repsonsedata.Data;
              localStorage.setItem('ClientCallLogDatass',JSON.stringify(repsonsedata?.Data) ); //by maneesh           
            if (repsonsedata.Data.ClientDetails != null) {
         
              this.clientDataList = this.gridDataClient?.ClientDetails;
              this.phoneNumber ='+'+this.gridDataClient?.PhoneCode + this.gridDataClient?.PhoneNo;
              this.clientName = this.gridDataClient?.ClientDetails?.ClientName;
              this.IndustryName = this.gridDataClient?.ClientDetails?.IndustryName;
              this.OwnerNameList = this.gridDataClient?.ClientDetails?.ClientRMList;
              this.Visibility = this.gridDataClient?.ClientDetails?.Visibility;
              this.HoldingCompany = this.gridDataClient?.ClientDetails?.HoldingCompany;
              this.ImmediateParentName = this.gridDataClient?.ClientDetails?.ImmediateParentName;
              this.Location = this.gridDataClient?.ClientDetails?.Location;
              this.clientEmail.emit(this.gridDataClient ? this.gridDataClient?.ClientDetails?.EmailId : '');
              this.clientEmailId = this.gridDataClient ? this.gridDataClient?.ClientDetails?.EmailId : '';
              this.clientName = this.gridDataClient ? this.gridDataClient?.ClientDetails?.ClientName : '';
              this.candidateService.setCandidateName(this.clientName);
              if(this.clientIdUnique!='00000000-0000-0000-0000-000000000000'){
                this.getMailCount(this.clientEmailId);
              }
              
              this.isInbox = true;
              this.isClientSummary = true;
              // if(this.clientEmailId){
              //   this.getMailCount(this.clientEmailId);
              // }
              const pageTitle= this.clientType=='LEAD'?'label_Menuleads':'label_Menuclients';
              const subpageTitle = ' | ' +this.clientName;
              this.commonserviceService.setTitle(pageTitle,subpageTitle);
            }
            if (repsonsedata.Data.ClientStatus != null) {
              this.ClientStatus = this.gridDataClient?.ClientStatus;
              var currentSatausfilter = this.ClientStatus?.filter(x => x['CurrentStatus'] === 1);
              this.currentStatus = currentSatausfilter?.Name;
              this.currentStatusID = currentSatausfilter?.Id;
              this.addForm.patchValue({
                Status: this.currentStatusID,
                ClientName: this.gridDataClient?.ClientDetails?.ClientId,
              });
            }
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.headerLoader = false;
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.headerLoader = false;
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
    @Name: ActiveTab
    @Who: Renu
    @When: 16-Aug-2021
    @Why: EWM-2199 EWM-2531
    @What: for getting the active tab and load data accordingly
  */
//by maneesh when:01/08/2024 ewm-17755 
  tabClick(event: MouseEvent) {
    let el = event.target as Element;
    let index: number;
  
    if (el.classList.contains("mat-tab-label")) {
        index = +el.id.substring(el.id.length - 1);
    }
    const ppEl = el.parentElement.parentElement
    if (ppEl.classList.contains("mat-tab-label")) {
        index = +ppEl.id.substring(ppEl.id?.length - 1);
    }
    if (index === this.tabIndex) {
        // console.log("click on selected");//maneesh 
    }
  
  }
  ActiveTab(event : MatTabChangeEvent) {
    setTimeout(() => {
      this.TabIndexNumber=event;      
      this.tabIndex = event.index;
      if (this.tabIndex==10) {
        this.showCall=true;
      }
      // this.tabActive = Tab[event]; 
  });
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user Share Notes, Recent Activity, Documents via Protected mode and Internal share, it should redirects user to that particular Note, Recent Activity and Documents -->
    // @Who: Bantee Kumar,@Why:EWM-12464,@When: 17-May-2023,@What:On View client detail side overlay screen, when user clicks on Summary, Resume, Job, etc. from title bar, then on job detail page sections changes from Candidates to Search Candidates, Notes and so on. -->
    this.route.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { cliTabIndex: event },
      queryParamsHandling: 'merge'
    });
    this.commonserviceService?.showJobTag.next({IsJobTag:true});// by maneesh ewm-18367 for show job tag in mail tab when send email

  }

  ngAfterViewInit(): void {
    this.routes.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
        if(this.clientIdUnique!=value?.clientId){
          this.clientIdData = value?.clientId;
          this.clientIdUnique = value?.clientId;
          this.reloadApiBasedOnorg();
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
    @Who: Nitin Bhati
    @When: 22-Nov-2021
    @Why: EWM-3826
    @What: menu which will be shown as an header for screen size smaller
    */

  MobileMapTagSelected: any;
  mobileMenu(data) {
    if (data) {
      let items = data.slice(0, 6);
      let threeDotItems = data.slice(6, data.length);

      this.MobileMapTagSelected = [];

      this.largeScreenTagData = items;
      this.smallScreenTagData = threeDotItems;

      if (this.currentMenuWidth > 1312 && this.currentMenuWidth < 1432) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 1));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      } else if (this.currentMenuWidth > 1192 && this.currentMenuWidth < 1313) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 2));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      } else if (this.currentMenuWidth > 1032 && this.currentMenuWidth < 1193) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 3));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else if (this.currentMenuWidth > 952 && this.currentMenuWidth < 1033) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 4));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else if (this.currentMenuWidth > 832 && this.currentMenuWidth < 953) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 5));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else if (this.currentMenuWidth > 319 && this.currentMenuWidth < 833) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 6));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      } else {
        // this.getClientmappingTagList()
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
    this.getClientSummaryHeaderList();
    this.getClientmappingTagList();
    this.getLocationCount();
    this.getClientContactCount();
    this.getClientJobCount();
    this.getClientNotesCount();
    this.getClientTeamCount();
    this.getClientActivityCount();
    this.getAlldocumentCount();
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
      data: new Object({ candidateId: this.clientIdData }),
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

  onDownloadResume(url: any, FileName: any) {
    //FileSaver.saveAs(url, this.gridDataCandidate.Name);
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
    delObj['CandidateId'] = this.clientIdData;
    //delObj['Name'] = this.gridDataCandidate?.Name;
    const message = 'label_titleDialogContentSiteDomain';
    const title = 'label_delete';
    const subTitle = 'label_candidate';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
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
  }



  getAlldocumentCount() {
    this.loading = true;
    this.candidateService.getDocumentCount('?usertypeid=' + this.clientIdData)
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
    //console.log("countEmail:",event);
    this.clientEmail = event;
    this.getMailCount(this.clientEmailId);
  }

  /*
 @Type: File, <ts>
 @Name: getMailCount
 @Who: Renu
 @When: 20-Oct-2021
 @Why: EWM-1733 EWM-3126
 @What: To get mail count Info for particular candidate
 */
  getMailCount(clientEmail: any) {
    this.mailService.fetchMailClientCount(this.clientIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalMail = repsonsedata?.Data?.Inbox;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalMail = repsonsedata?.Data?.Inbox;

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
    @Name: sortName function
    @Who: Nitin Bhati
    @When: 22-Nov-2021
    @Why: EWM-3836
    @What: For showing shortname on image icon
    */
  sortName(fisrtName) {
    if (fisrtName) {
      const Name = fisrtName;
      let charCount = Name.split(" ").length - 1;
      if (charCount > 0) {
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let last = ShortName1.slice(-1);
        let ShortName = first.concat(last.toString());
        return ShortName.toUpperCase();
      } else {
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let ShortName = first;
        return ShortName.toUpperCase();
      }
    }
  }

  /*
 @Name: fetchassignLocationCount function
 @Who: Suika
 @When: 18-nov-2021
 @Why: EWM-3840
 */
  fetchassignLocationCount(value) {
    if (value == true) {
      this.getLocationCount();
    }
  }


  /*
@Type: File, <ts>
@Name: getLocationCount
@Who: Suika
@When: 26-Nov-2021
@Why: EWM-3697 EWM-3867
@What: To get Location count for particular candidate
*/
  dataTotalLocation: any = 0;
  getLocationCount() {
    this._clientService.fetchLocationCount("?clientId=" + this.clientIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalLocation = repsonsedata.Data.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalLocation = repsonsedata.Data.Count;
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
@Name: openQuickCompanyModal
@Who: Anup Singh
@When: 22-Nov-2021
@Why: EWM-3638 EWM-3847
@What: to open Quick Company Modal for edit
*/
  openQuickCompanyModal() {
    const dialogRef = this.dialog.open(QuickCompanyComponent, {
      // maxWidth: "1000px",
      /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

      data: new Object({ clientId: this.clientIdData, formType: "edit",clientLeadType:this.clientType}),
      // width: "90%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal-lg', 'clientEdit', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    this.isClientSummary = false;
    dialogRef.afterClosed().subscribe(res => {

      if (res == true) {
        this.isClientSummary = true;
        this.getClientNameList();
        this.getClientSummaryHeaderList();
        this.getClientmappingTagList();
        this.getLocationCount();
        this.getClientTeamCount();
        // <!--@who:bantee @why:EWM-14511 @what:Location is not updated after editing the client address. @when:28-sep-2023-->
        this.getclientAccessById(this.clientIdData);
        this.updateAddress.addressChunkList();
      } else {
        this.isClientSummary = true;
        this.loading = false;
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
  @Name: clickStatus function
  @Who:  Nitin bhati
  @When: 23-Nov-2021
  @Why: EWM-3635
  @What: service call for creating Status List data
  */
  clickStatusID(Id, statusId) {
    //this.loading = true;
    this.statusId = statusId;
    let statusUpdateObj = {};
    statusUpdateObj['ClientID'] = this.clientIdData;
    statusUpdateObj['StatusID'] = statusId;
    this._clientService.updateClientStatusList(statusUpdateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getClientSummaryHeaderList();
          // this.getClientmappingTagList();
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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



  /*
 @Type: File, <ts>
 @Name: getClientNameList
 @Who: Nitin Bhati
 @When: 26-Nov-2021
 @Why: EWM-3929
 @What: To get client list
 */
  getClientNameList() {
    let temp ="&IsLead=" + (this.clientType.toLowerCase()==='lead'?1:0);
    this._clientService.getClientNameList("?OrganizationId=" + this.OrganizationId + temp).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.orgData = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {

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
   @Name: ChangeClientName function
   @Who:  Nitin bhati
   @When: 26-Nov-2021
   @Why: EWM-3635
   @What: service call for creating client Name List data
   */
  ChangeClientName(Id, ClientId: any) {
    //console.log("clickId:",ClientId);
    this.headerLoader = true;
    this.clientIdData = ClientId;
    this.commonserviceService.onClientSelectId.next(this.clientIdData);
    this.reloadApiBasedOnorg();
    // this.headerLoader=false;
  }




  /*
@Type: File, <ts>
@Name: openVisibility
@Who: Suika 
@When: 01-Dec-2021
@Why: EWM-3697 EWM-3867
@What: to open client Visiblity Modal for edit
*/
public UpdateclientAccess :UpdateclientAccess;
   openVisibility() {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      data: new Object({ clientId: this.clientIdData, clientName: this.clientName, formType: "EditForm", AccessModeId: this.oldPatchValues }),
      panelClass: ['xeople-modal', 'add_manageAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.AccessId?.length  > 0) {
        let UpdateclientAccess = {
          "ClientId":this.clientIdData,
          "ClientName":this.clientName,
          "AccessId": res.AccessId[0]?.Id,
          "AccessName": res.AccessId[0]?.AccessName,
          "GrantAccessList": res.ToEmailIds,
          "PageURL":  window.location.origin + this.previousRouteService.getCurrentUrl()
        }
       
        this._clientService.updateclientAccess(UpdateclientAccess).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.loading = false;
              this.getclientAccessById(this.clientIdData);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

            }
            else if (repsonsedata.HttpStatusCode === 400) {
              this.loading = false;
             
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            }
            else {
              
              this.loading = false;
            }
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          }
        )
        this.getClientSummaryHeaderList();
        // this.getClientmappingTagList();
        // this.getLocationCount();
      } else {
        this.loading = false;
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
  @Name: openEditOwner
  @Who: Suika
  @When: 01-Dec-2021
  @Why: EWM-3697 EWM-3867
  @What: to open edit owner modal for edit
  */
  openEditOwner() {
    const dialogRef = this.dialog.open(EditOwnerComponent, {
      data: new Object({ clientId: this.clientIdData, clientName: this.clientName, formType: "EditForm" }),
      panelClass: ['xeople-modal', 'edit-visibilty', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        //  this.getClientNameList();
        this.getClientSummaryHeaderList();
        this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
        // this.getClientmappingTagList();
        // this.getLocationCount();
      } else {
        this.loading = false;
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
   @Name: getClientContactCount function
   @Who: Anup
   @When: 01-Dec-2021
   @Why: EWM-3696 EWM-3970
   @What: for contact count
 */
  dataTotalContact: any = 0;
  getClientContactCount() {
    this._clientService.fetchContactCount("?clientId=" + this.clientIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalContact = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalContact = repsonsedata.Data?.Count;
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
   @Name: fetchClientContactCount function
   @Who: Anup
   @When: 01-Dec-2021
   @Why: EWM-3696 EWM-3970
   @What: for contact count when add new contact
 */
  fetchClientContactCount(value) {    
    if (value == true) {
      this.getClientContactCount();
    }
  }

  /*
  @Type: File, <ts>
  @Name: fetchClientTeamCount function
  @Who: Anup
  @When: 01-Dec-2021
  @Why: EWM-3696 EWM-3970
  @What: for contact count when add new contact
*/
  fetchClientTeamCount(value) {
    if (value == true) {
      this.getClientTeamCount();
    }
  }



  /*
     @Type: File, <ts>
     @Name: addNewJob function
     @Who: Anup
     @When: 02-Dec-2021
     @Why: EWM-3639 EWM-3964
     @What: for add new job for client
   */
  addNewJob() {
    const dialogRef = this.dialog.open(ConfigureCreateJobComponent,{
      data: new Object({JobId:'JobId'}),
      panelClass: ['xeople-modal', 'ConfigureJobFields', 'ConfigureJobFields', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

 
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    //this.route.navigate(['/client/core/job/create-job', { workFlowLenght: 1, type: "AddJobClient", clientId: this.clientIdData }],);
  }




  /*
 @Type: File, <ts>
 @Name: getClientJobCount function
 @Who: Anup
 @When: 03-Dec-2021
 @Why: EWM-3696 EWM-3968
 @What: for job count
*/
  dataTotalJob: any = 0;
  getClientJobCount() {
    this._clientService.fetchJobCount("?clientId=" + this.clientIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalJob = repsonsedata.Data?.Count;
          this.isClientJobPageRedirectFromJbCreate();
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalJob = repsonsedata.Data?.Count;
          this.isClientJobPageRedirectFromJbCreate();
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
    @Name: getClientJobCount function
    @Who: Adarsh singh
    @When: 05-Sept-2022
    @Why:
    @What: for showing client job page while redirect from complete-create-job page after create successfull job
  */
  isClientJobPageRedirectFromJbCreate() {
    this.routes.queryParams.subscribe((data) => {
      if (data['openTab']) {
        this.tabActive = "Jobs";
        this.selectedTabIndex = 1;
      }
    })
  }
  /*
   @Type: File, <ts>
   @Name: fetchClientContactCount function
   @Who: Anup
   @When: 03-Dec-2021
   @Why: EWM-3696 EWM-3968
   @What: for job count when add new job
  */
  fetchclientJobCount(value) {
    if (value == true) {
      this.getClientJobCount();
    }
  }

  backToLandingPage() {
    if(this.clientType==='LEAD'){
      if(this.leadworkId!=this.previousleadWorkId){
        this.route.navigate(['/client/leads/lead/lead-details'], { queryParams: { workflowId: this.leadworkId,WorkflowName:this.leadworkName } });
      }else{
        const previousUrl = this.navigationService.getPreviousUrl();
        if (previousUrl.url) {
          this.route.navigate([previousUrl.url], { queryParams: previousUrl.queryParams }).catch(err => {
            console.error('Navigation error:', err);
          });
        } 
      }
    }else{
    this.route.navigate(['/client/core/clients/list'], {
    queryParams: { viewModeData:'listMode'}});
    }
    
   }

  /*
    @Type: File, <ts>
    @Name: fetchclientNotesCount function
    @Who: Renu
    @When: 01-Dec-2021
    @Why: EWM-3696 EWM-3970
    @What: for client count when add new Notes
  */
  fetchclientNotesCount(value) {
    if (value == true) {
      this.getClientNotesCount();
    }
  }
  /*
     @Type: File, <ts>
     @Name: getClientNotesCount function
     @Who: Renu
     @When: 01-Dec-2021
     @Why: EWM-3696 EWM-3970
     @What: for client count when add new Notes api call
   */
  getClientNotesCount() {
    let currentYear = (new Date()).getFullYear();
    this._clientService.fetchClientNoteTotal("?clientId=" + this.clientIdData).subscribe(
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
     @Name: getClientContactCount function
     @Who: Anup
     @When: 01-Dec-2021
     @Why: EWM-3696 EWM-3970
     @What: for contact count
   */
  dataTotalTeam: any = 0;
  getClientTeamCount() {
    this._clientService.fetchTeamCount("?clientId=" + this.clientIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalTeam = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalTeam = repsonsedata.Data?.Count;
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
    @Name: fetchClientActivityCount function
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: for Employee count when add new Activity
  */
  fetchClientActivityCount(value) {
    if (value == true) {
      this.getClientActivityCount();
    }
  }
  /*
     @Type: File, <ts>
     @Name: getClientActivityCount function
      @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: for client count when add new Activity api call
   */
  getClientActivityCount() {
    let currentYear = (new Date()).getFullYear();
    this.candidateService.fetchActivityTotal("?relateduserid=" + this.clientIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalActivity = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalActivity = repsonsedata.Data?.Count;
          this.loading = false;
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

  getClientTeamAll(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll: boolean) {
    if (isSearch == true) {
      this.loading = false;
    } else if (isScroll) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    let jsonObj = {};
    jsonObj['FilterParams'] = [];
    jsonObj['GridId'] = this.GridId;
    jsonObj['ClientId'] = this.clientIdData;
    jsonObj['search'] = searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;

    this._clientService.clientTeamDetails(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridListData = data.Data.filter(x => x['IsOwner'] === 1 && x['IsCurrent'] === 0);
            let ownerList = this.gridListData.filter(x => x['IsOwner'] === 1 && x['IsCurrent'] === 0);
            this.ownerLength = this.gridListData?.length;
            if (this.ownerLength === 0) {
              this.ownerLengthStatus = true;
            } else {
              this.ownerLengthStatus = false;
            }
            this.loading = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridListData = data.Data?.filter(x => x['IsOwner'] === 1 && x['IsCurrent'] === 0);
            this.ownerLength = this.gridListData?.length;
            if (this.ownerLength === 0) {
              this.ownerLengthStatus = true;
            } else {
              this.ownerLengthStatus = false;
            }
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            //  this.loadingAssignJobSaved = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

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
  // who:maneesh,what: ewm-16067 for send  sms threedot client,when:01/03/2024
  
  getBulkSmsFlag(){
    if(!this.SMSCheckStatus && this.selectedcontact==null ||this.selectedcontact==undefined || this.selectedcontact?.length==0){
      return true;
    }else{
      let checkStage = this.selectedcontact != null && this.selectedcontact?.filter(t=>t?.PhoneNo!='' && t?.PhoneNo!=null && t?.PhoneNo!=undefined);    
      if(!this.SMSCheckStatus || checkStage?.length>0){
        return false;
      }{
        return true;
      }
    }
  }

  openJobBulkSMSForCantacts() {
    this.selectedcontact.forEach(x => {
          x['PhoneNumber'] = x?.PhoneNo;
          x['Name'] = x?.FullName;
          x['CandidateId'] = x?.ContactId;
      });
     const dialogRef = this.dialog.open(CandidateBulkSmsComponent,{
     data: new Object({selectedCandidates:this.selectedcontact,UserType:this.UserType}),
     panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(res => {    
    // who:maneesh,what: ewm-16065 for send  sms after checkbox uncheck  contct,when:04/03/2024
     this.commonserviceService?.sendsmsResponce?.next(res);
     this.loading = false;
   })
   // RTL Code
   let dir: string;
   dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
   let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
   for (let i = 0; i < classList.length; i++) {
     classList[i].setAttribute('dir', this.dirctionalLang);
   }
  }
    // who:maneesh,what: ewm-16067 for send bulk email  contct landing summery,when:04/03/2024
  onBulkEmail(){
    this.toEmailList =  this.selectedcontact.map(({ EmailId }) => ({ EmailId: EmailId }));
    this.loading = false;
    this.toEmailList =  this.toEmailList.filter(entry => entry?.EmailId !== null);
    this.selectedCandidate =  this.selectedCandidate.filter(item => item?.EmailId !== null);
    this.getAllEmailIdFromMappedJob(this.selectedCandidate);
    this.openMail(this.selectedcontact, this.IsEmailConnected, true);
   }
   getAllEmailIdFromMappedJob(data){
    let arr = data;
    this.getAllEmailIdFormMappedJob = data?.map(function (el: { Email: any; }) { return el.Email; });
    this.getCandidateData = [];
    arr?.forEach(element => {
      this.getCandidateData.push({
       "ModuleType": "Jobs",
       "Id": element.ContactId,
       "EmailTo": element.EmailId
      })
    });
   this.getCandidateData.filter((value , index) =>{
     data.indexOf(value) === index
   })
 }
    // who:maneesh,what: ewm-16067 for send bulk email  contct landing summery,when:04/03/2024
    openMail(responseData: any, IsEmailConnected: number, isBulkEmail:boolean) {
   this.selectedContactEmail=this.selectedcontact?.map(item=>({
  'ModuleType': "Jobs",
  'EmailTo':item?.EmailId,
  'Id':item?.ContactId
}));
 let subObj = {}
 const message = ``;
 const title = 'label_disabled';
 const subtitle = 'label_securitymfa';
 const dialogData = new ConfirmDialogModel(title, subtitle, message);
 const dialogRef = this.dialog.open(CandidateBulkEmailComponent, {
   maxWidth: "750px",
   width: "95%",
   height: "100%",
   maxHeight: "100%",
   data: { 'candidateres': responseData, 'IsEmailConnected': IsEmailConnected,
    'isBulkEmail': isBulkEmail,'toEmailList':this.toEmailList,'candiateDetails': this.selectedContactEmail,
    openDocumentPopUpFor:'Contact',multipleEmail: this.multipleEmail},
   panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
   disableClose: true,
 });
 dialogRef.afterClosed().subscribe(dialogResult => {
  if (dialogResult?.draft==false) {
  this.commonserviceService?.sendsmsResponce?.next(true);   
  }
   this.multipleEmail = false;
   this.selectedCandidate=[];
 })

 // RTL Code
 let dir: string;
   dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
   let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
   for (let i = 0; i < classList.length; i++) {
     classList[i].setAttribute('dir', this.dirctionalLang);
   }
}

countVxtCall(Id) {
  this.candidateService.countVxtCall("?id=" + Id + "&usertype=" + 'CLIE').pipe(takeUntil(this.destroy$)).subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200) {
         this.loading = false;
         this.callDataCount =  repsonsedata.Data;
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

  getclientAccessById(Id) {
    this._clientService.getclientAccessById('?Id='+Id).subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200) {
         this.loading = false;
         this.oldPatchValues = repsonsedata?.Data;
       } else if (repsonsedata.HttpStatusCode === 204) {
         this.oldPatchValues ={};
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

 getLeadworkflowUpdated(event) {
  this.leadworkId=event?.leadId;
  this.leadworkName=event?.leadName;
  this.previousleadWorkId=event?.previousleadWorkflowId;
}

// who:Renu,why: EWM-19410 EWM-19551 what: FOR OPENING FORM TO SHARE CLIENT,when:12/02/2025
openEOHShareClientPopUp(){
  if(this.clientDataList?.EOHClientId !==null && this.clientDataList?.EOHClientId !==''){
    const message = this.clientDataList?.ClientName +' '+this.translateService.instant('label_ShareClientEOHAlreadyPush')+this.clientDataList?.EOHClientId;
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
      
   const message = ``;
    const title = 'label_shareClientEOH';
    const subtitle = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ShareClientEohComponent, {
      data: new Object({'ClientName':this.clientName,'clientId':this.clientIdData,dialogData: dialogData}),
      panelClass: ['xeople-modal', 'share-client-eoh', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res)
      {
        this.getClientSummaryHeaderList();
      }
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

}


