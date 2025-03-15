/* @(C): Entire Software
    @Type: File, <html>
    @Name: candidate-summary.component.html
    @Who: Renu
    @When: 29-Oct-2021
    @Why: EWM-1734 EWM-3271
    @What:  This page wil be use only for the employee summary Component HTML
    */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from 'src/app/shared/models';
import { CandidateExperienceService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-experience.service';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { delay } from 'rxjs/operators';
import { GeneralInformationComponent } from 'src/app/modules/EWM-Candidate/profile-summary/general-information/general-information.component';
import { DependentpopupComponent } from 'src/app/modules/EWM-Candidate/dependentpopup/dependentpopup.component';
import { CandidateExperienceComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-experience/candidate-experience.component';
import { CandidateAddressComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-address/candidate-address.component';
import { CandidateFolderFilterComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { AdditionalInfoPopupComponent } from 'src/app/modules/EWM-Candidate/profile-summary/additional-info-popup/additional-info-popup.component';
import { CandidateEmergencyContactsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-emergency-contacts/candidate-emergency-contacts.component';
import { Icandidate } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-summary/Icandidate.interface';
import { CandidateEducationComponent } from 'src/app/modules/EWM-Candidate/candidate-education/candidate-education.component';
import { CandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-skills/candidate-skills.component';
import { ManageCandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/manage-candidate-skills/manage-candidate-skills.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.scss']
})
export class EmployeeSummaryComponent implements OnInit {


  background10: any;
  background15: any;
  background20: any;
  background30: any;
  background80: any;
  dialog: any;
  loading: boolean = true;
  public userpreferences: Userpreferences;
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
  public candidateAddressData: any = [];
  public candidateDependentsData: any = [];
  public emergencyContactsData: any = [];
  public candidateFoldersData: any = [];

  public skillsData: any = [];
  public candidateAdditionalInfoData: any = {};
  public candidateExperienceData: any = [];
  public candidateEducationData: any = [];
  public candidateJobsData: any = [];

  public folderLoader: boolean;
  public addressLoader: boolean;
  public experienceLoader: boolean;
  public EmergencyContactLoader: boolean;
  public loaderDependent: boolean;
  public skillLoader: boolean
  public generalLoader: boolean;
  public loaderAddInfo: boolean;
  public loaderEducation: boolean;
  public loaderJob: boolean

  public userpreferencesDate = 'MMM d y';
  orderlistLeft = [];
  orderlistRight = [];
  ConfigData: any = []
  @Output() candidateEmail = new EventEmitter<any>();
  @Output() childConsentTypeEvent = new EventEmitter();
  groupCodeEmployeeSummaryPage: any;
  dirctionalLang;
  public isReadMore: any[] = [false];
  public isReadMoreText: any[] = [false];

  constructor(public _dialog: MatDialog, private snackBService: SnackBarService, public candidateService: CandidateService,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService,
    private appSettingsService: AppSettingsService, private translateService: TranslateService,
    public _userpreferencesService: UserpreferencesService,
    private routes: ActivatedRoute, private _CandidateExperienceService: CandidateExperienceService, public dialogModel: MatDialog,
    public _CandidateFolderService: CandidateFolderService, public _GeneralInformationService: GeneralInformationService,
    private commonserviceService: CommonserviceService) { 
      this.groupCodeEmployeeSummaryPage = this._appSetting.groupCodeEmployeeSummaryPage;

    }


  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
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
this.commonserviceService.employeeUpdateChangeStatus.subscribe(value => {
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
    this.getCandidateJobList();

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




  /*
  @Type: File, <ts>
  @Name: getCandidateJobList function
  @Who: Anup Singh
  @When: 21-May-2021
  @Why: EWM-1445 EWM-1597
  @What: service call for get Data of Job
  */
  getCandidateJobList() {
    this.loaderJob = false;
    this.candidateJobsData = null;

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
          this.candidateEmail.emit(this.generalInformationData?this.generalInformationData.Email:''); 
          this.generalLoader = false;
        } else {
          this.generalLoader = false;
        }
      }, err => {
        this.loading = false;
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
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    // @Who: Bantee Kumar,@Why:EWM-10891,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.
    const dialogRef = this._dialog.open(GeneralInformationComponent, {
      data: new Object({ candidateId: this.candidateIdData,GeneralInformationFor: 'EMPL',groupCode: this.groupCodeEmployeeSummaryPage ,UserType: 'PEOPLE',formType:type}),
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



  openDependentModal(editId, formType) {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(DependentpopupComponent, {
      data: new Object({ candidateId: this.candidateIdData, editId: editId, candidateDependentsData: this.candidateDependentsData, formType: formType }),
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
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
     @What: to open Skills modal dialog
   */
  openSkillsModal(action) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(CandidateSkillsComponent, {
      data: { actionType: action, candidateId: this.candidateIdData },
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
          this.skillLoader = false;
        }
      }, err => {
        this.skillLoader = false;
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
      data: new Object({ candidateId: this.candidateIdData, editId: id, activityStatus: tag }),
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this. experienceChunkList()
        this.generalChunkList();
      } else {
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
    this._CandidateExperienceService.getExperienceList('?candidateid=' + this.candidateIdData).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.experienceLoader = false;
          this.candidateExperienceData = repsonsedata.Data;
        } else {
          this.experienceLoader = false;
        }
      }, err => {
        this.loading = false;
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
      if (dialogResult == true) {
        this._CandidateExperienceService.deleteExperience(experienceObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.experienceChunkList();
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
    this.candidateService.getCandidateEducationList("?candidateid=" + this.candidateIdData).subscribe(
      (repsonsedata: Icandidate) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loaderEducation = false;
          this.candidateEducationData = repsonsedata.Data;
                 
        } else {
          this.loaderEducation = false;
        }
      }, err => {
        this.loaderEducation = false;
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
          this.loaderDependent = false;
        }
      }, err => {
        this.loaderDependent = false;
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
          this.addressLoader = false;
        }
      }, err => {
        this.addressLoader = false;
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
          this.EmergencyContactLoader = false;
        }
      }, err => {
        this.EmergencyContactLoader = false;
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
    const title = 'label_deleteMessage';
    const subTitle = 'candidate_emergencyContact';
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
        })

    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
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
      maxWidth: "700px",
      width: "90%",
      data: new Object({ methodType: methodType, AutoFilldata: EmergencyContactById, candidateId: this.candidateIdData }),
      panelClass: ['quick-modalbox', 'add_candidateContacts', 'animate__animated', 'animate__zoomIn'],
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
          this.folderLoader = false;
        }
      }, err => {
        this.folderLoader = false;
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
      data: { candidateId: this.candidateIdData, candidateAdditionalInfoData: this.candidateAdditionalInfoData ,label:'Employee'},
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
          this.loaderAddInfo = false;
        }
      }, err => {
        this.loaderAddInfo = false;
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
    this.getCandidateJobList();
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
  const subTitle = 'quickjob_skills';
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



openQuickSkillEdidModal(data,activestatus) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_folder';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this._dialog.open(ManageCandidateSkillsComponent, {
    maxWidth: "550px",
      width: "90%",
      maxHeight: "85%",
      data:{candidateId:this.candidateIdData,FolderId:123,Name:'this.headerlabel',skilldata:data,activestatus:activestatus},
      panelClass: ['quick-modalbox', 'add_folder', 'animate__animated', 'animate__zoomIn'],
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



}
