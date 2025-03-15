import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralInformationComponent } from '../general-information/general-information.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DependentpopupComponent } from '../../dependentpopup/dependentpopup.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Icandidate } from './Icandidate.interface'
import { SkillsPopupComponent } from '../skills-popup/skills-popup.component';
import { CandidateExperienceComponent } from '../candidate-experience/candidate-experience.component';
import { CandidateAddressComponent } from '../candidate-address/candidate-address.component';
import { ResponceData } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from 'src/app/shared/models';
import { CandidateEducationComponent } from '../../candidate-education/candidate-education.component';
import { CandidateExperienceService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-experience.service';
import { CandidateEmergencyContactsComponent } from '../candidate-emergency-contacts/candidate-emergency-contacts.component';
import { CandidateFolderFilterComponent } from '../candidate-folder-filter/candidate-folder-filter.component';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { AdditionalInfoPopupComponent } from '../additional-info-popup/additional-info-popup.component';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { delay } from 'rxjs/operators';
import { CandidateSkillsComponent } from '../candidate-skills/candidate-skills.component';
import { ManageCandidateSkillsComponent } from '../manage-candidate-skills/manage-candidate-skills.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { SCREEN_SIZE } from 'src/app/shared/models';

@Component({
  selector: 'app-candidate-summary',
  templateUrl: './candidate-summary.component.html',
  styleUrls: ['./candidate-summary.component.scss']
})
export class CandidateSummaryComponent implements OnInit {

  public sourceIdExp: string='Form';
  public sourceIdEdu: string='Form';
  background10: any;
  background15: any;
  background20: any;
  background30: any;
  background80: any;
  dialog: any;
  loading: boolean = true;
  //public candidateIdData: any;
  @Input() candidateIdData: any;
  // @Input() CandidateSummaryData: any;
  public GridDataEducationList: any = [];
  GridDataListCan: any = {};
  public result: string = '';
  dateStart = new Date();
  dateEnd = new Date();
  today = new Date();

  public generalInformationData: any = {};
  public InformationData: any;

  public candidateAddressData: any = [];
  public candidateDependentsData: any = [];
  public emergencyContactsData: any = [];
  public candidateFoldersData: any = [];

  public skillsData: any = [];
  public candidateAdditionalInfoData: any = {};
  public candidateExperienceData: any = [];
  public candidateEducationData: any = [];

  public folderLoader: boolean;
  public addressLoader: boolean;
  public experienceLoader: boolean;
  public EmergencyContactLoader: boolean;
  public loaderDependent: boolean;
  public skillLoader: boolean
  public generalLoader: boolean;
  public loaderAddInfo: boolean;
  public loaderEducation: boolean;
  public sourceLabel : any = 'Form';
  public userpreferencesDate = 'MMM d y';
  orderlistLeft = [];
  orderlistRight = [];
  ConfigData: any = []
  public sourceList:any=[];
  public statusList: any = [];
  dirctionalLang;
  @Output() candidateEmail = new EventEmitter<any>();
  @Output() childConsentTypeEvent = new EventEmitter();
  @Output() candidateData = new EventEmitter<any>();

  @Input() activeTabForScreening:any;

  @ViewChild('scrollForScreeningEducation') scrollForScreeningEducation: ElementRef;
  @ViewChild('scrollForScreeningExperience') scrollForScreeningExperience: ElementRef;
  ImmediateAvailableText: any;
  @Input() candidateName: string;
  groupCodeCandidateSummaryPage:any;
  public userpreferences: Userpreferences;
  public selectedEducationSource: any='Form';//{Id:'Form',Name: 'Form',Status:1,StatusName:'Active'};
  public selectedExperienceSource:any='Form';//{Id:'Form',Name: 'Form',Status:1,StatusName:'Active'};
  public isReadMore: any[] = [false];
  public isReadMoreText: any[] = [false];
  //who:Ankit Rawat,what:EWM-16075-EWM-16122 Add new label Recruiter,When:21 Feb 2024
  public RecruitersName: string='';
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false
  candidateMapTagSelected = [];
  largeScreenTagData: any;
  smallScreenTagData: any;
  isOpen: boolean = true;
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
  prefix: string = 'is-';
  currentMenuWidth: number;
  constructor(public _dialog: MatDialog, private snackBService: SnackBarService, public candidateService: CandidateService,
    private commonServiesService: CommonServiesService, private validateCode: ValidateCode, private rtlLtrService: RtlLtrService,
    private route: Router, public _sidebarService: SidebarService,
    private appSettingsService: AppSettingsService, private translateService: TranslateService,
    private systemSettingService: SystemSettingService, public _userpreferencesService: UserpreferencesService,
    private routes: ActivatedRoute, private _CandidateExperienceService: CandidateExperienceService, private _appSetting: AppSettingsService,
    public dialogModel: MatDialog, public _CandidateFolderService: CandidateFolderService, private serviceListClass: ServiceListClass,
    public _GeneralInformationService: GeneralInformationService, private commonserviceService: CommonserviceService,private elementRef: ElementRef) {

     this.groupCodeCandidateSummaryPage=this.appSettingsService.candidateID;
    }

    ngOnInit(): void {
      this.currentMenuWidth = window.innerWidth;
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.getSourceList();
      this.getFilterConfig();
      this.commonserviceService.changecandidatesummaryDashboardObs.pipe(delay(0)).subscribe(value => {
        if (value === true) {
          this.getFilterConfig();
        }
      })

      this.commonserviceService.onOrgSelectFolderId.subscribe(value => {
        if (value !== null) {
          this.reloadApiBasedOnorg();
        }
      });
//by maneesh,what:ewm-17168 for while update status then also update status from genral information,when:23/05/2024
      this.commonserviceService.UpdateChangeStatus.subscribe(value => {
        if (value == true) {
          this.generalChunkList();
        }
      });
      this.generalChunkList();
      this.getCandidateEducationList();
      this.getCandidateDependentList();
      this.addressChunkList();
      this.experienceChunkList()
      this.getAllAdditionalInfo();
      this.folderChunkList();
      this.emergencyContactChunkList();
      this.getAllSkills();

      let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');

     this.background10 = this.hexToRGB(primaryColor, 0.10);
      this.background15 = this.hexToRGB(primaryColor, 0.15);
      this.background20 = this.hexToRGB(primaryColor, 0.20);
      this.background30 = this.hexToRGB(primaryColor, 0.30);
      this.background80 = this.hexToRGB(primaryColor, 0.80);
    }


    ngAfterViewInit() {
      this.routes.queryParams.subscribe((value) => {
        if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
          if(this.candidateIdData!=value?.CandidateId){
            this.candidateIdData = value?.CandidateId;
            this.reloadApiBasedOnorg();
          }
        }
      });
      setTimeout(() => {
        if(this.activeTabForScreening=='Screening-Experience'){
          this.scrollForScreeningExperience.nativeElement.scrollIntoView({behavior: 'smooth'});
        }else if(this.activeTabForScreening=='Screening-Education'){
        this.scrollForScreeningEducation.nativeElement.scrollIntoView({behavior: 'smooth'});
        }
      }, 3000);
    }
     /*
@Type: File, <ts>
@Name: getFilterConfig function
@Who: Anup
@When: 05-oct-2021
@Why: EWM-3088 EWM-3138
@What: For get filter config data
*/
  getFilterConfig() {
    this.loading = true;
    this.candidateService.getfilterConfigCandidate().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== undefined && repsonsedata.Data !== null) {
            this.ConfigData = repsonsedata.Data.GridConfig;
            this.LeftConfigData(this.ConfigData);
            this.RightConfigData(this.ConfigData);
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

  /*
@Type: File, <ts>
@Name: LeftConfigData function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: left config data filter from configdata
*/
  LeftConfigData(leftColumnList: any) {
    this.orderlistLeft = [];
    if (leftColumnList != undefined && leftColumnList != null && leftColumnList.length > 0) {
      this.orderlistLeft = this.ConfigData.filter((item) => {
        return item.Alighment == "Left"
      });
      this.getOrderListLeftSide('General Information');
    }

  }

  /*
@Type: File, <ts>
@Name: getOrderListLeftSide function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: for ordering of left side
*/
  getOrderListLeftSide(panelName) {
    let orderId = this.orderlistLeft.find(item => item.Title === panelName)
    if (orderId !== undefined) {
      return orderId['Order'];
    }
  }

  /*
@Type: File, <ts>
@Name: RightConfigData function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: right config data filter from configdata
*/
  RightConfigData(rightColumnList: any) {
    this.orderlistRight = [];
    if (rightColumnList != undefined && rightColumnList != null && rightColumnList.length > 0) {
      this.orderlistRight = this.ConfigData.filter((item) => {
        return item.Alighment == "Right"
      })
      this.getOrderListRightSide('Skills');
    }

  }

  /*
@Type: File, <ts>
@Name: getOrderListRightSide function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: for ordering of right side
*/
  getOrderListRightSide(panelName) {
    let orderId = this.orderlistRight.find(item => item.Title === panelName)
    if (orderId !== undefined) {
      return orderId['Order'];
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

  /*
  @Type: File, <ts>
  @Name: generalChunkList
  @Who: Nitin Bhati
  @When: 24-Aug-2021
  @Why: EWM-2424
  @What: reintialisation the General Information list for candidate
*/
  generalChunkList() {
    this.generalLoader = true;
    this._GeneralInformationService.getGeneralInformationList('?candidateid=' + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.generalInformationData = repsonsedata.Data;
          //who:Ankit Rawat,what:EWM-16075-EWM-16122 Add new label Recruiter,When:21 Feb 2024
          this.RecruitersName=this.generalInformationData.RecruiterDetails?.map(item => item.RecruiterName).join(', ');
          this.candidateMapTagSelected=this.generalInformationData.RecruiterDetails?.map(item => item.RecruiterName);
          this.mobileMenu(this.candidateMapTagSelected);
          this.InformationData = repsonsedata.Data;

          if (repsonsedata.Data.IsImmediateAvailable== null) {
            this.ImmediateAvailableText = '';
          }else if (repsonsedata.Data?.IsImmediateAvailable== 1) {
            this.ImmediateAvailableText = 'Yes';
          }else if(repsonsedata.Data?.IsImmediateAvailable== 0){
            this.ImmediateAvailableText = 'No';
          }else{
            this.ImmediateAvailableText = ' ';
          }
          this.candidateEmail.emit(this.generalInformationData?this.generalInformationData.Email:'');
    //Entire Software : Bantee Kumar : 22-Sep-2023 :  EWM-14292

          this.candidateData.emit(this.generalInformationData?this.generalInformationData:'');

          this.generalLoader = false;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.generalLoader = false;
        }
      }, err => {
        this.loading = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
      @Type: File, <ts>
      @Name: openQuickGeneralInfoModal
      @Who: Nitin Bhati
      @When: 11-Aug-2021
      @Why: EWM-2424
      @What: to open quick add General Information modal dialog
    */
  openQuickGeneralInfoModal(type:string) {
    // 'c81dacbe-3e57-4a32-805d-001380c65303'
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    // @Who: Bantee Kumar,@Why:EWM-10891,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.

    const dialogRef = this._dialog.open(GeneralInformationComponent, {
      data: new Object({ candidateId: this.candidateIdData,GeneralInformationFor: 'CAND', groupCode:  this.groupCodeCandidateSummaryPage,UserType: 'CANDIDATE',formType:type }),
      // data: dialogData,
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.generalLoader = true;
        this.generalChunkList();
      } else {
        this.generalLoader = false;
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }



  openDependentModal(editId, formType) {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(DependentpopupComponent, {
      // maxWidth: "1000px",
      // width: "65%",
      // maxHeight: "85%",
      data: new Object({ candidateId: this.candidateIdData, editId: editId, candidateDependentsData: this.candidateDependentsData, formType: formType }),
      panelClass: ['xeople-modal', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getCandidateDependentList();
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
     @Name: openQuickGeneralInfoModal
     @Who: Anup
     @When: 11-Aug-2021
     @Why: EWM-2242 EWM-2506
     @What: to open Skills modal dialog SkillsPopupComponent
   */
  openSkillsModal(action) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(CandidateSkillsComponent, {
      data: { actionType: action, candidateId: this.candidateIdData, candidateName: this.candidateName },
      panelClass: ['xeople-modal', 'add_skills', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getAllSkills();
      }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }

  /*
   @Type: File, <ts>
   @Name: getAllSkills function
   @Who: Anup
   @When: 16-Aug-2021
   @Why: EWM-2242.EWM-2507
   @What: get AllSkills List
   */
  getAllSkills() {
    this.skillLoader = true;
    this.candidateService.getCanAllSkillsData('?CandidateId=' + this.candidateIdData).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.skillsData = repsonsedata.Data;
          this.skillLoader = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.skillLoader = false;
        }
      }, err => {
        this.skillLoader = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
      @Type: File, <ts>
      @Name: openQuickExperiencrModal
      @Who: Nitin Bhati
      @When: 11-Aug-2021
      @Why: EWM-2424
      @What: to open quick add Experience modal dialog
    */
  openQuickExperiencrModal(id: any, tag: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(CandidateExperienceComponent, {
      // maxWidth: "1000px",
      data: new Object({ candidateId: this.candidateIdData, editId: id, activityStatus: tag }),
      // width: "65%",
      // maxHeight: "85%",
      // data: dialogData,
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.experienceLoader = true;
        this.experienceChunkList();
        this.generalChunkList();
      } else {
        this.experienceLoader = false;
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
@Name: experienceChunkList
@Who: Nitin Bhati
@When: 18-Aug-2021
@Why: EWM-2529
@What: reintialisation the Experience list for candidate
*/
  experienceChunkList() {
    this.experienceLoader = true;
    this._CandidateExperienceService.getExperienceList('?candidateid=' + this.candidateIdData+'&source='+this.sourceLabel).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.experienceLoader = false;
          this.candidateExperienceData = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.experienceLoader = false;
        }
      }, err => {
        this.loading = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
    @Type: File, <ts>
    @Name: DeleteExperienceById function
    @Who: Nitin Bhati
    @When: 17-Aug-2021
    @Why: EWM-2529
    @What: FOR DIALOG BOX confirmation
  */

  DeleteExperienceById(experienceData: any): void {
    let experienceObj = {};
    experienceObj = experienceData;
    experienceObj['DateStart'] = new Date(experienceData.DateStart);
    experienceObj['DateEnd'] = new Date(experienceData.DateEnd);
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_experience';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.experienceLoader = true;
      //this.result = dialogResult;
      if (dialogResult == true) {
        this._CandidateExperienceService.deleteExperience(experienceObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.experienceChunkList();
              this.generalChunkList();
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.experienceLoader = false;
            } else if (data.HttpStatusCode == 400) {
              this.experienceLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.experienceLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.experienceLoader = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.experienceLoader = false;
      }
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

  openEducationModal(eduId: any, formType: string) {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(CandidateEducationComponent, {
      // maxWidth: "1000px",
      // width: "65%",
      // maxHeight: "85%",
      data: new Object({ candidateId: this.candidateIdData, editId: eduId, candidateEducationData: this.candidateEducationData, formType: formType }),
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.getCandidateEducationList();
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
  @Name: getCandidateEducationList function
  @Who: Suika
  @When: 13-August-2021
  @Why: EWM-2376 EWM-2214
  @What: service call for creating notes List data  this.candidateIdData
  */
  getCandidateEducationList() {
    this.loaderEducation = true;
    this.candidateService.getCandidateEducationList("?candidateid=" + this.candidateIdData +'&source='+this.sourceLabel).subscribe(
      (repsonsedata: Icandidate) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loaderEducation = false;
          this.candidateEducationData = repsonsedata.Data;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loaderEducation = false;
        }
      }, err => {
        this.loaderEducation = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }




  /*
  @Type: File, <ts>
  @Name: getCandidateEducationList function
  @Who: Suika
  @When: 13-August-2021
  @Why: EWM-2376 EWM-2214
  @What: service call for creating dependent List data  this.candidateIdData
  */
  getCandidateDependentList() {
    this.loaderDependent = true;
    this.candidateService.getCandidatedependentList("?candidateid=" + this.candidateIdData).subscribe(
      (repsonsedata: Icandidate) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loaderDependent = false;
          this.candidateDependentsData = repsonsedata.Data;
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loaderDependent = false;
        }
      }, err => {
        this.loaderDependent = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }





  /*
      @Type: File, <ts>
      @Name: getAdressById
      @Who: Renu
      @When: 16-Aug-2021
      @Why: EWM-2531
      @What: get candidate adress By Id
    */
  getAdressById(methodType: string, Id: any) {
    let candidateAddressById: any = [];
    if (methodType == 'Add') {
      candidateAddressById = [];
      this.openDialogCandidateAdress(methodType, candidateAddressById);
    } else {
      this.candidateService.getCandidateAdressById('?id=' + Id + '&candidateid=' + this.candidateIdData).subscribe(
        (repsonsedata: ResponceData) => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            candidateAddressById = repsonsedata.Data;
            this.openDialogCandidateAdress(methodType, candidateAddressById);
          }
        }, err => {
          this.loading = false;
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })

    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

  /*
      @Type: File, <ts>
      @Name: openDialogCandidateAdress
      @Who: Renu
      @When: 16-Aug-2021
      @Why: EWM-2531
      @What: for opening modal address popup
    */
  openDialogCandidateAdress(methodType: string, candidateAddressById: any) {
    const dialogRef = this.dialogModel.open(CandidateAddressComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ methodType: methodType, AutoFilldata: candidateAddressById, candidateId: this.candidateIdData }),
      panelClass: ['xeople-modal', 'add_canAddress', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.addressLoader = true;
        this.addressChunkList();
      } else {
        this.addressLoader = false;
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
    @Name: addressChunkList
    @Who: Renu
    @When: 16-Aug-2021
    @Why: EWM-2531
    @What: reintialisation the address list for candidate
  */

  addressChunkList() {
    this.addressLoader = true;
    this.candidateService.getCandidateAdressAll('?candidateid=' + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.addressLoader = false;
          this.candidateAddressData = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.addressLoader = false;
        }
      }, err => {
        this.addressLoader = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: deleteConfirmAddress
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2531
  @What: delete confirmation to delet candidate address
*/

  deleteConfirmAddress(addressData: any) {
    let addressObj = {};
    addressObj = addressData;
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'candidate_address';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.addressLoader = true;
      if (dialogResult == true) {
        this.candidateService.deleteCandidateAddress(addressObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.addressChunkList();
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

            } else if (data.HttpStatusCode == 400) {
              this.addressLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.addressLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.addressLoader = false;
      }
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

  /*
  @Type: File, <ts>
  @Name: emergencyContactChunkList
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2196 EWM-2428
  @What: emergnecy contacts lists after any actons performed
*/

  emergencyContactChunkList() {
    this.EmergencyContactLoader = true;
    this.candidateService.getEmergencyContactAll('?candidateid=' + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.EmergencyContactLoader = false;
          this.emergencyContactsData = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.EmergencyContactLoader = false;
        }
      }, err => {
        this.EmergencyContactLoader = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
  @Type: File, <ts>
  @Name: deleteConfirmEmergencyContacts
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2196 EWM-2428
  @What: delete confirmation to delet candidate address
*/

  deleteConfirmEmergencyContacts(contactData: any) {
    let ContactsObj = {};
    ContactsObj = contactData;
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'candidate_emergencyContacts';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.EmergencyContactLoader = true;
      if (dialogResult == true) {
        this.candidateService.deleteEmergencyContact(ContactsObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.emergencyContactChunkList();
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

            } else if (data.HttpStatusCode == 400) {
              this.EmergencyContactLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.EmergencyContactLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.EmergencyContactLoader = false;
      }
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }


  /*
  @Type: File, <ts>
  @Name: getEmergencyContactById
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2196 EWM-2428
  @What: emergency contacts single row based on id
*/

  getEmergencyContactById(methodType: string, Id: any) {
    let EmergencyContacsById: any = [];
    if (methodType == 'Add') {
      EmergencyContacsById = [];
      this.openDialogEmergencyContacts(methodType, EmergencyContacsById);
    } else {
      this.candidateService.getEmergencyContactById('?id=' + Id + '&candidateid=' + this.candidateIdData).subscribe(
        (repsonsedata: ResponceData) => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            EmergencyContacsById = repsonsedata.Data;
            this.openDialogEmergencyContacts(methodType, EmergencyContacsById);
          }
        }, err => {
          this.loading = false;
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })

    }
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
   @Name: openDialogEmergencyContacts
   @Who: Renu
   @When: 18-Aug-2021
   @Why: EWM-2196 EWM-2428
   @What: open dialog for emergency contacts
 */


  openDialogEmergencyContacts(methodType: string, EmergencyContactById: any) {
    const dialogRef = this.dialogModel.open(CandidateEmergencyContactsComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ methodType: methodType, AutoFilldata: EmergencyContactById, candidateId: this.candidateIdData }),
      panelClass: ['xeople-modal', 'add_candidateContacts', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.EmergencyContactLoader = true;
        this.emergencyContactChunkList();
      } else {
        this.EmergencyContactLoader = false;
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
 @Name: DeleteEducationById function
 @Who: Suika
 @When: 17-Aug-2021
 @Why: EWM-2249
 @What: FOR DIALOG BOX confirmation
*/

  DeleteEducationById(educationData: any): void {
    let experienceObj = {};
    experienceObj = educationData;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_education';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loaderEducation = true;
      if (dialogResult == true) {
        this.candidateService.deleteEducationById(experienceObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.getCandidateEducationList();
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.loaderEducation = false;
            } else if (data.HttpStatusCode == 400) {
              this.loaderEducation = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.loaderEducation = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.loaderEducation = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.loaderEducation = false;
      }
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }


  /*
    @Type: File, <ts>
    @Name: folderChunkList
    @Who: Nitin Bhati
    @When: 20-Aug-2021
    @Why: EWM-2495
    @What: reintialisation the folder list for candidate
  */
  folderChunkList() {
    this.folderLoader = true;
    this._CandidateFolderService.getCandidateFilterFolderList('?id=' + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.folderLoader = false;
          this.candidateFoldersData = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.folderLoader = false;
        }
      }, err => {
        this.folderLoader = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
       @Type: File, <ts>
       @Name: openQuickFolderModal
       @Who: Nitin Bhati
       @When: 20-Aug-2021
       @Why: EWM-2495
       @What: to open quick add Folder Filter modal dialog
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
        this.folderLoader = true;
        this.folderChunkList();
      } else {
        this.folderLoader = false;
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
 @Name: DeleteDependentById function
 @Who: Suika
 @When: 20-Aug-2021
 @Why: EWM-2243
 @What: FOR DIALOG BOX confirmation
*/

  DeleteDependentById(dependantData: any): void {
    let experienceObj = {};
    experienceObj = dependantData;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_dependent';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loaderDependent = true;
      if (dialogResult == true) {
        this.candidateService.deleteDependentById(experienceObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.getCandidateDependentList();
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.loaderDependent = false;
            } else if (data.HttpStatusCode == 400) {
              this.loaderDependent = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.loaderDependent = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.loaderDependent = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.loaderDependent = false;
      }
    });
    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }






  /*
     @Type: File, <ts>
     @Name: editPopupAdditionalInfo
     @Who: Anup
     @When: 21-Aug-2021
     @Why: EWM-2242 EWM-2506
     @What: to open AdditionalInfo modal dialog
   */
  editPopupAdditionalInfo() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(AdditionalInfoPopupComponent, {
      // maxWidth: "1000px",
      data: { candidateId: this.candidateIdData, candidateAdditionalInfoData: this.candidateAdditionalInfoData,label:'Candidate' },
      // width: "90%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal-lg', 'add_additionalInfo', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res == true) {
        this.getAllAdditionalInfo();
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
    @Name: deleteAdditionalInfo function
    @Who: Suika
    @When: 01-Dec-2021
    @Why: EWM-3867
    @What: FOR DIALOG BOX confirmation
  */

 deleteAdditionalInfo(additionalInfo: any): void {
  let additionalInfoObj = {};
  additionalInfoObj = additionalInfo;
  additionalInfoObj['DateBirth'] = new Date(additionalInfo.DateBirth);
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'candidate_additionalInformation';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    this.loaderAddInfo = true;
    //this.result = dialogResult;
    if (dialogResult == true) {
      this.candidateService.deleteCandidateAdditionalInfo(additionalInfoObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.getAllAdditionalInfo();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.loaderAddInfo = false;
          } else if (data.HttpStatusCode == 400) {
            this.loaderAddInfo = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.loaderAddInfo = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }

        }, err => {
          if (err.StatusCode == undefined) {
            this.loaderAddInfo = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    } else {
      this.loaderAddInfo = false;
    }
  });
}


  /*
  @Type: File, <ts>
  @Name: getAllAdditionalInfo function
  @Who:  ANUP
  @When: 21-Aug-2021
  @Why: EWM-2191 EWM-2586
  @What: For showing the getAllAdditionalInfo
  */

  getAllAdditionalInfo() {
    this.loaderAddInfo = true;
    this.candidateService.getAllAdditionalInfoData('?CandidateId=' + this.candidateIdData).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loaderAddInfo = false;
          this.candidateAdditionalInfoData = repsonsedata.Data;
          this.childConsentTypeEvent.emit(this.candidateAdditionalInfoData?.ConsentStatus);
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loaderAddInfo = false;
        }
      }, err => {
        this.loaderAddInfo = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Anup Singh
  @When: 27-Aug-2021
  @Why: EWM-2240 EWM-2665
  @What: Reload Api's when user change organization
 */
  reloadApiBasedOnorg() {
    this.generalChunkList();
    this.getCandidateEducationList();
    this.getCandidateDependentList();
    this.addressChunkList();
    this.experienceChunkList()
    this.getAllAdditionalInfo();
    this.folderChunkList();
    this.emergencyContactChunkList();
    this.getAllSkills();
  }




  openQuickSkillEdidModal(data,activestatus) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folder';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(ManageCandidateSkillsComponent, {
        data:{candidateId:this.candidateIdData,FolderId:123,Name:'this.headerlabel',skilldata:data,activestatus:activestatus},
        panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        this.folderLoader = true;
        this.folderChunkList();
      } else {
        this.folderLoader = false;
      }
    })
  }


   /*
  @Type: File, <ts>
  @Name: deleteConfirmEmergencyContacts
  @Who: Suika
  @When: 12-Nov-2021
  @Why: EWM-3556 EWM-3643
  @What: delete confirmation to delet candidate address
*/

deleteConfirmskills(data: any) {
  let ContactsObj = {};
  ContactsObj = data;
  const message = 'label_titleDialogContent';
  const title = 'label_delete';
  const subTitle = 'label_skill';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialogModel.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    this.skillLoader = true;
    if (dialogResult == true) {
      this.candidateService.deleteCandidateSkill(ContactsObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.getAllSkills();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

          } else if (data.HttpStatusCode == 400) {
            this.skillLoader = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.skillLoader = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }
        }, err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    } else {
      this.skillLoader = false;
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
    @Name: onSourcechange
    @Who:  Suika
    @When: 19-Jan-2022
    @Why: EWM-4368/4722
    @What: when Source drop down changes
*/
onSourcechange(data,labelfor) {
  this.sourceLabel = data.Name;
  if(labelfor=='education'){
    this.selectedEducationSource=data;
    this.getCandidateEducationList();
  }else{
    this.selectedExperienceSource=data;
    this.experienceChunkList();
  }
}


/*
   @Type: File, <ts>
   @Name: getStatusList function
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1871
   @What: For status listing
  */
 getSourceList() {
  this.commonserviceService.getSourceList().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.sourceList = repsonsedata.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

/*
   @Type: File, <ts>
   @Name: socialURL function
   @Who: Adarsh singh
   @When: 28-Oct-2022
   @Why: ROST-9259
   @What: for redirect on new tab with url
*/

socialURL(url){
  let http = url.search('http')
  let tempurl;
  if(http===-1){
    tempurl = "http://"+url;
  }else{
    tempurl = url;
  }
  if(url!=''){
    window.open(tempurl,'_blank')
  }
}
//who:Ankit Rawat,what:EWM-16075-EWM-16122 Added view more popup to show Recruiters,When:21 Feb 2024
private detectScreenSize() {
  const currentSize = this.sizes.find(x => {
    // get the HTML element
    const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
    // check its display property value
  })

  this.mobileMenu(this.candidateMapTagSelected);
}
MobileMapTagSelected: any;
//who:Ankit Rawat,what:EWM-16075-EWM-16122 Added view more popup to show Recruiters,When:21 Feb 2024
mobileMenu(data) {
  if (data) {
    let items = data.slice(0, 4);
    let threeDotItems = data.slice(4, data.length);

    this.MobileMapTagSelected = [];

    this.largeScreenTagData = items;
    this.smallScreenTagData = threeDotItems;

    if (this.currentMenuWidth > 1312 && this.currentMenuWidth < 1432) {
      this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 3));
      this.MobileMapTagSelected = items;
      this.largeScreenTag = false;
      this.mobileScreenTag = true;
    } else if (this.currentMenuWidth > 981 && this.currentMenuWidth < 1311) {
      this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(1, 5));
      this.MobileMapTagSelected = items;
      this.largeScreenTag = false;
      this.mobileScreenTag = true;

    } else if (this.currentMenuWidth > 826 && this.currentMenuWidth < 980) {
      this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(5, 6));
      this.MobileMapTagSelected = items;
      this.largeScreenTag = false;
      this.mobileScreenTag = true;

    } else if (this.currentMenuWidth > 551 && this.currentMenuWidth < 825) {
      this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(3, 7));
      this.MobileMapTagSelected = items;
      this.largeScreenTag = false;
      this.mobileScreenTag = true;

    } else if (this.currentMenuWidth > 320 && this.currentMenuWidth < 550) {
      this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(1, 8));
      this.MobileMapTagSelected = items;
      this.largeScreenTag = false;
      this.mobileScreenTag = true;

    } else {
      this.largeScreenTag = true;
      this.mobileScreenTag = false;
    }
  }else{
    this.MobileMapTagSelected = [];
      this.largeScreenTagData=[];
  }
}
@HostListener("window:resize", ['$event'])
private onResize(event) {
  this.currentMenuWidth = event.target.innerWidth;
  this.detectScreenSize();
  event.target.innerWidth;
  if (this.currentMenuWidth < 1060) {
    this.isOpen = false
  } else {
    this.isOpen = true
  }
}


}
