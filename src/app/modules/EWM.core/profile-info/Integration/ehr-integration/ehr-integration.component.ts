import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { EohSubscriptionFeaturesComponent } from './eoh-subscription-features/eoh-subscription-features.component';
import { IntegrationImagesEntity, IntegrationLocations, ValidateEOH } from '../../../../EWM.core/shared/datamodels/marketplace-eoh';
import { eohRegisteration } from '../../../../EWM.core/shared/datamodels/marketplace-eoh';
import { eohRegDetails } from '../../../../EWM.core/shared/datamodels/marketplace-eoh';
import { AppSettingsService } from '@app/shared/services/app-settings.service';


enum EmployeeType {
  'Normal user/employee',
  'Admin',
  'Super Admin'
}


@Component({
  selector: 'app-ehr-integration',
  templateUrl: './ehr-integration.component.html',
  styleUrls: ['./ehr-integration.component.scss']
})
export class EhrIntegrationComponent implements OnInit {

  public showTabData: boolean = true;
  public showEohFormData: boolean = false;
  eohIntegrationForm: FormGroup;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public totalStages: number;
  public screenPreviewClass: string = "";
  public currentMenuWidth: number;
  public screnSizePerStage: number;
  public loading: boolean = false;
  public activestatus: string;
  RegistrationCode: string;
  IntegratorName: string;
  visibilityStatus: boolean;
  gridViewList: eohRegisteration;
  IntegrationImages: IntegrationImagesEntity;
  IntegrationLocations: IntegrationLocations;
  animationVar: any;
  dirctionalLang: string;
  showSubscriptionTabData: boolean;
  employeesList: any = [];
  orgEmployeeList: any[] = [];
  pagesize = 50;
  pageNo = 1;
  IsSearchExtractNotificationEnable: number = 0;
  IsPushJobNotificationEnable: number = 0;
  validateclient: ValidateEOH;
  UserDetails :any= [];
  employeesListforPushJob: any = [];
  UserDetailPushJob = [];
  UserDetailSearchExt = [];
  EmployeeType = EmployeeType;
  activeSubsFeatuBtn: boolean;
  activeUpdatebtn: boolean;
  activeSubscJobBtn: boolean;
  activeSubscPushBtn: boolean;
  oldValue?: ValidateEOH;
  step = 0;
  isCreateMode: boolean = true;
  validClient: boolean=false;
  public pushNotificationStatus: number;


  activeSubscCandBtn: boolean;
  IsCANDExtractNotificationEnable: number = 0;
  reqType:number = 0;
  IsShareClientNotificationEnable: number=0;
  activeSubsClientBtn: boolean;
  clientList: any=[];
  jobList: any=[];
  contactList: any=[];
  IsShareContactNotificationEnable: number=0;
  IsShareJobNotificationEnable: number=0;
  activeSubsContactBtn: boolean;
  activeSubsJobBtn: boolean;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private systemSettingService: SystemSettingService, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService, private route: Router,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private _systemSettingService: SystemSettingService, private router: ActivatedRoute,
    
  ) {
    this.pushNotificationStatus = this.appSettingsService.pushNotificationStatus;
    this.eohIntegrationForm = this.fb.group({
      Id: [0],
      ClientId: ['', [Validators.required,  this.noWhitespaceValidator(),Validators.maxLength(100)]],
      ClientSecret: ['', [Validators.required, this.noWhitespaceValidator(),Validators.maxLength(100)]],
      OrganizationName: ['']
    });

  }

  ngOnInit(): void {
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth, 'onload');
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
          this.IntegratorName = params['name'];
        }
      });
    this.getIntegrationCheckstatus();
    this.getIntegrationRegistrationByCode();
    this.animationVar = ButtonTypes;
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let eohRegistrationCode=otherIntegrations?.find(res=>res.RegistrationCode==this.appSettingsService.eohRegistrationCode);
    if (eohRegistrationCode?.Connected) {
      this.subscribeFeatures();
    }
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
  }

  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = 'flext-start';
    } else {
      this.screenPreviewClass = '';
    }
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }

    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 3000) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }

 // who:bantee,why:ewm-13864 what:backToJob  ,when:5/09/2023

  backToJob() {
    this.route.navigate(['/client/core/administrators/integration-interface-board']);
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

 // who:bantee,why:ewm-13864 what:getIntegrationCheckstatus for the connection ,when:5/09/2023

  getIntegrationCheckstatus() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatus(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatus = repsonsedata.Data?.Connected;
            if (this.visibilityStatus === true) {
              this.visibilityStatus = true;
              this.isCreateMode=false;
            } else {
              this.visibilityStatus = false;
              this.isCreateMode=true;
            }
          }
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  setStep(index: number) {
    this.step = index;
  }

 // who:bantee,why:ewm-13864 what:getIntegrationData ,when:5/09/2023

  getIntegrationRegistrationByCode() {
    this.loading = true;
    this._systemSettingService.getIntegrationRegistrationByCode(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;

          }
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

 // who:bantee,why:ewm-13864 what:backToIntegration to the main page ,when:5/09/2023

  backToIntegration() {
    this.route.navigate(['/client/core/administrators/integration-interface-board']);
  }

 // who:bantee,why:ewm-13864 what:open eoh form to add and edit  ,when:5/09/2023

  openEohFormData(values) {
    if (values == 'Add') {
      this.activestatus = 'Add';
      this.showEohFormData = true;
      this.showTabData = false;

    } else {
      this.geteohIntegrationDetails();
      this.activestatus = 'Edit';
      this.showEohFormData = true;
      this.showTabData = false;
      this.showSubscriptionTabData = false;
      this.activeSubsFeatuBtn = false;
      this.activeUpdatebtn = true;
      this.validClient=false;
    }
    this.isCreateMode = false;

  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

 // who:bantee,why:ewm-13864 what:validate the form  ,when:5/09/2023

  onValidateSeekAdvertiseId(value: any) {

    let ClientId = value.ClientId.trim();
    let ClientSecret = value.ClientSecret.trim();

    this.loading = true;
    this._systemSettingService.onValidateEohClientById(ClientId, ClientSecret).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.validClient=true;
        } else {
          
          this.eohIntegrationForm.get('ClientId').setErrors({ invalid: true });
          this.eohIntegrationForm.get('ClientSecret').setErrors({ invalid: true});
          this.eohIntegrationForm.get('ClientId').markAsTouched();
          this.eohIntegrationForm.get('ClientSecret').markAsTouched();


        }
        this.validateclient = data.Data;

        this.eohIntegrationForm.patchValue({
          OrganizationName: this.validateclient?.OrganizationName
        })


      },
      err => {
        if (err.status == undefined) {
          this.snackBService.showErrorSnackBar(this.translateService.instant('label_ehrSecretIDwrong'), '400');
        }
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

 // who:bantee,why:ewm-13864 what:reset validate the form  ,when:5/09/2023
//  <!-- // @bantee @whn 19-09-2023 @EWM-14361  Entire On Hire Card: As per the story the Field size for Client Id and Secret Key should be 100 characters -->

  resetValidateForm(){
    if(this.eohIntegrationForm.value?.ClientId){
    var control=this.eohIntegrationForm.get('ClientId');
    delete control?.errors?.invalid;
    control.updateValueAndValidity();
  }
    if(this.eohIntegrationForm.value?.ClientSecret){
    var control=this.eohIntegrationForm.get('ClientSecret');
    delete control?.errors?.invalid;
    control.updateValueAndValidity();
  
  }
    this.eohIntegrationForm.updateValueAndValidity();
    this.validClient=false;
  }

 // who:bantee,why:ewm-13864 what:save the form  ,when:5/09/2023

  onSave(value) {
    if (this.eohIntegrationForm.invalid) {
      return;
    }
    this.createIntegration(value);

  }

 // who:bantee,why:ewm-13864 what:get the validation data  ,when:5/09/2023

  geteohIntegrationDetails() {
    this.loading = true;
    this._systemSettingService.getEOHIntegrationDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        let updateEOHForm: eohRegDetails = repsonsedata['Data'];
        this.eohIntegrationForm.patchValue({
          Id: updateEOHForm.Id,
          ClientId: updateEOHForm.ClientID,
          ClientSecret: updateEOHForm.SecretKey,
          OrganizationName: updateEOHForm.OrganizationName
        })
        this.showEohFormData = true;
        this.showTabData = false;
        this.showSubscriptionTabData = false;
        this.visibilityStatus = true;
        this.isCreateMode = false;
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

 // who:bantee,why:ewm-13864 what:Integrate the EOH in arket place  ,when:5/09/2023

  createIntegration(value: any) {
    this.loading = true;
    let AddObj = {};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['Id'] = value.Id;
    AddObj['ClientID'] = value.ClientId.trim();
    AddObj['SecretKey'] = value.ClientSecret.trim();
    AddObj['OrganizationName'] = value.OrganizationName;

    this._systemSettingService.EOHIntegrationConnectCreate(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.showEohFormData = false;
        this.showTabData = false;
        this.showSubscriptionTabData = true;
        this.visibilityStatus = true;
        this.isCreateMode = false;
        this.activeSubsFeatuBtn = true;
        this.activeUpdatebtn = false;
       if( this.activestatus=='Edit'){
        this.getEOHSrhExtSubsDetails();
        this.getEOHPushJobSubsDetails();
        this.getEOHCANDExtSubsDetails();
       }
        /* @Who: Renu @When: 11-Sept-2023 @Why: EWM-9625 EWM-10071 @What: for update localstorage for EOH*/
        let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
        let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
        otherIntegrations[objIndex].Connected = this.visibilityStatus;
        localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));

        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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

 // who:bantee,why:ewm-13864 what:disconnect the popup  ,when:5/09/2023

  disconnectPopUp(): void {
    let discjson = {};
    discjson['RegistrationCode'] = this.RegistrationCode;
    // @When: 30-07-2024 @who:Amit @why: EWM-17748 @what: label change & remove
    const message = `label_EOHdisconnect`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._systemSettingService.disconnectEOHIntegration(discjson).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.eohIntegrationForm.reset();
              this.eohIntegrationForm.patchValue({
                Id: 0
              })
              this.isCreateMode = true;
              this.showEohFormData = false;
              this.showTabData = true;
              this.visibilityStatus = false;
              this.showSubscriptionTabData = false;
              let subscribeSrhExt = {};
              subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;

              if (this.IsSearchExtractNotificationEnable === 1) {
                subscribeSrhExt['IsSearchExtractNotificationEnable'] = 0;

                this.onSaveSubsFeature('UnsubSearchExtractNotf', subscribeSrhExt)
              }

              if (this.IsCANDExtractNotificationEnable === 1) {
                subscribeSrhExt['IsPushCandidateNotificationEnable'] = 0;
                this.onSaveSubsFeature('UnsubCANDExtractNotf', subscribeSrhExt)
              }
              if (this.IsPushJobNotificationEnable === 1) {
                subscribeSrhExt['IsPushJobNotificationEnable'] = 0;

                this.onSaveSubsFeature('UnSubsPushJobNotf', subscribeSrhExt)
              }
 
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
               /* @Who: Renu @When: 11-Sept-2023 @Why: EWM-9625 EWM-10071 @What: for update localstorage for EOH*/
              let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
              let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
              otherIntegrations[objIndex].Connected = this.visibilityStatus;
              localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
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

 // who:bantee,why:ewm-13864 what:remove the employee from chip  ,when:5/09/2023

  remove(i, subsFor) {
    if (subsFor === 'searchJob') {
      this.employeesList.splice(i, 1);
    }
    else if (subsFor === 'CANDJob') {
      this.candidateList.splice(i, 1);
    }
    else if (subsFor === 'pushJob'){
      this.employeesListforPushJob.splice(i, 1);
    }
    else if(subsFor === 'shareClient')
    {
      this.clientList.splice(i, 1);
    }  
    else if(subsFor === 'shareJob')
    {
      this.jobList.splice(i, 1);
    }
     if(subsFor === 'shareContact')
      this.contactList.splice(i, 1);

  }


 // who:bantee,why:ewm-13864 what:open the popup for manage employees  ,when:5/09/2023

  openManageEmployeesModal(openSubsModalFor) {
    let employee
    if (openSubsModalFor === 'openSearchExtractNotf') {
      employee = this.employeesList;
     
    }
    else if (openSubsModalFor === 'openCANDExtractNotf') {
      employee = this.candidateList;
    }
    if (openSubsModalFor === 'openPushJobNotf') {
      employee = this.employeesListforPushJob;
      
    }

    if (openSubsModalFor === 'openClientNotf') {
      employee = this.clientList;
    }

    if (openSubsModalFor === 'openContactNotf') {
      employee = this.contactList;
    }

    if (openSubsModalFor === 'openJobNotf') {
      employee = this.jobList;
    }
    const dialogRef = this.dialog.open(EohSubscriptionFeaturesComponent, {
      data: new Object({
        employees: employee,
        openSubsPopfor: openSubsModalFor
      }),
      panelClass: ['xeople-modal', 'quick-modalbox', 'AddRequiredAttendees', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.subsFeatureFor === 'openSearchExtractNotf') {
        this.employeesList = res.selectedEmp;
      } else if (res?.subsFeatureFor === 'openCANDExtractNotf') {
        this.candidateList = res.selectedEmp;
      }
      else if (res?.subsFeatureFor === 'openPushJobNotf') {
        this.employeesListforPushJob = res.selectedEmp;
      }
      else if (openSubsModalFor === 'openClientNotf') {
        this.clientList =  res.selectedEmp;
      }
      else if (openSubsModalFor === 'openContactNotf') {
        this.contactList =  res.selectedEmp;
      }
      else if (openSubsModalFor === 'openJobNotf') {
        this.jobList =  res.selectedEmp;
      }
    })
  }

 // who:bantee,why:ewm-13864 what:Cancel the form on Validation page  ,when:5/09/2023

  onCancel() {
    if (this.activestatus == 'Add') {
      this.showEohFormData = false;
      this.showTabData = true;
      this.showSubscriptionTabData = false;
      this.eohIntegrationForm.reset();
      this.eohIntegrationForm.patchValue({
        Id: 0
      })
      this.isCreateMode = true;
      this.validClient=false;
      ;
    } else {
      this.showSubscriptionTabData = true;
      this.showTabData = false;
      this.showEohFormData = false;
      this.activeUpdatebtn = false;
      this.activeSubsFeatuBtn = true;
      this.getEOHSrhExtSubsDetails();
      this.getEOHPushJobSubsDetails();
      this.getEOHCANDExtSubsDetails();
      this.getEOHShareClientSubsDetails();
      this.validClient=false;

    }
  }

 // who:bantee,why:ewm-13864 what:subscribe the EOH search Extract Notification  ,when:5/09/2023
 
  subEOHSearchExtNotf(subs: number) {
    let subscribeSrhExt = {};
    subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;
    subscribeSrhExt['IsSearchExtractNotificationEnable'] = subs;

    if (subs === 0) {
      const message = `label_EhrIntegration_Unsubscribe_Confirmation`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.activeSubscJobBtn = false;

          this.onSaveSubsFeature('UnsubSearchExtractNotf', subscribeSrhExt);

        }
        this.loading = false;
      });
    } else {
      this.activeSubscJobBtn = true;
      this.loading = true;

      this._systemSettingService.subscribeEOHSearchExtNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.IsSearchExtractNotificationEnable = repsonsedata['Data'].IsSearchExtractNotificationEnable;
          localStorage.setItem('IsSearchExtractNotificationEnable',repsonsedata.Data.IsSearchExtractNotificationEnable);
          this.setEohIntegrationObj();
          this.getSuperAdminTenant('SearchExtNotf');

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
  }

 // who:bantee,why:ewm-13864 what:subscribe the EOH Push Job Notification  ,when:5/09/2023

  subEOHPushJobNotf(subs: number) {
    let subscribePushJob = {};
    subscribePushJob['RegistrationCode'] = this.RegistrationCode;
    subscribePushJob['IsPushJobNotificationEnable'] = subs;
    if (subs === 0) {
      const message = `label_EhrIntegration_Unsubscribe_Confirmation`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.activeSubscPushBtn = false;

          this.onSaveSubsFeature('UnSubsPushJobNotf', subscribePushJob);


        }
        this.loading = false;
      })
    } else {
      this.loading = true;
      this.activeSubscPushBtn = true;
      this._systemSettingService.subscribeEOHPushJobNotf(subscribePushJob).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.IsPushJobNotificationEnable = repsonsedata['Data'].IsPushJobNotificationEnable;
          this.getSuperAdminTenant('PushJobNotf');
          localStorage.setItem('IsPushJobNotificationEnable',repsonsedata.Data.IsPushJobNotificationEnable);
          this.setEohIntegrationObj();
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
  }

 // who:bantee,why:ewm-13864 what:get the subscribed employees for EOH search Extract Subscription  ,when:5/09/2023

  getsubEOHSearchExtNotf(subscribeSrhExt) {
    this._systemSettingService.subscribeEOHSearchExtNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsSearchExtractNotificationEnable = repsonsedata['Data'].IsSearchExtractNotificationEnable;
        localStorage.setItem('IsSearchExtractNotificationEnable',this.IsSearchExtractNotificationEnable.toString());
        this.setEohIntegrationObj();
        this.employeesList = [];
        if (this.IsSearchExtractNotificationEnable === 0) {
          this.activeSubscJobBtn = false;

        }
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

 // who:bantee,why:ewm-13864 what:get the subscribed employees for Push JOb Subscription  ,when:5/09/2023

  getsubPushJobNotf(subscribePushJob) {
    this._systemSettingService.subscribeEOHPushJobNotf(subscribePushJob).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsPushJobNotificationEnable = repsonsedata['Data'].IsPushJobNotificationEnable;
        localStorage.setItem('IsPushJobNotificationEnable',this.IsPushJobNotificationEnable.toString());
        this.setEohIntegrationObj();
        this.employeesListforPushJob = [];
        if(this.IsPushJobNotificationEnable===0){
          this.activeSubscPushBtn=false;
        }
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


 // who:bantee,why:ewm-13864 what: method on subscribeFeatures Tab,when:5/09/2023

  subscribeFeatures() {
    this.showEohFormData = false;
    this.showTabData = false;
    this.showSubscriptionTabData = true;
    this.activeSubsFeatuBtn = true;
    this.activeUpdatebtn = false;
    this.getEOHSrhExtSubsDetails();
    this.getEOHPushJobSubsDetails();
    this.getEOHCANDExtSubsDetails();
    this.getEOHShareClientSubsDetails();
    this.getEOHShareContactSubsDetails();
    this.getEOHShareJobSubsDetails();
  }

 // who:bantee,why:ewm-13864 what: save the individual subscrption ,when:5/09/2023

  onSaveSubsFeature(subFeature, unSubData?) {
    this.loading = true;
    let saveSubscribeFeature = {};
    saveSubscribeFeature['RegistrationCode'] = this.RegistrationCode;
    if (subFeature === 'SearchExtractNotf') {
      saveSubscribeFeature['IsSearchExtractNotificationEnable'] = 1;
      saveSubscribeFeature['UserDetails'] = this.employeesList;
    }
    else if (subFeature === 'CANDExtractNotf') {
      saveSubscribeFeature['IsPushCandidateNotificationEnable'] = 1;
      saveSubscribeFeature['UserDetails'] = this.candidateList;
    }
    
    if (subFeature === 'PushJobNotf') {
      saveSubscribeFeature['IsPushJobNotificationEnable'] = 1;
      saveSubscribeFeature['UserDetails'] = this.employeesListforPushJob;

    }

    if (subFeature === 'SearchClientNotf') {
      saveSubscribeFeature['IsShareClientNotificationEnable'] = 1;
      saveSubscribeFeature['UserDetails'] = this.clientList;
    }

    if (subFeature === 'SearchJobNotf') {
      saveSubscribeFeature['IsShareJobNotificationEnable'] = 1;
      saveSubscribeFeature['UserDetails'] = this.jobList;
    }

    if (subFeature === 'SearchContactNotf') {
      saveSubscribeFeature['IsShareContactNotificationEnable'] = 1;
      saveSubscribeFeature['UserDetails'] = this.contactList;
    }
  ////Unsubscribe
    if (subFeature === 'UnsubSearchExtractNotf') {
      saveSubscribeFeature['IsSearchExtractNotificationEnable'] = 1;
      let UserDetailSearchExt = [];
      saveSubscribeFeature['UserDetails'] = UserDetailSearchExt;
    }
    if (subFeature === 'UnSubsPushJobNotf') {
      saveSubscribeFeature['IsPushJobNotificationEnable'] = 1;
      let UserDetailSearchExt = [];
      saveSubscribeFeature['UserDetails'] = UserDetailSearchExt;
    }
    if (subFeature === 'UnsubCANDExtractNotf') {
      saveSubscribeFeature['IsPushCandidateNotificationEnable'] = 1;
      let UserDetailSearchExt = [];
      saveSubscribeFeature['UserDetails'] = UserDetailSearchExt;
    }
    if (subFeature === 'UnsubClientNotf') {
      saveSubscribeFeature['IsShareClientNotificationEnable'] = 1;
      let UserDetailSearchExt = [];
      saveSubscribeFeature['UserDetails'] = UserDetailSearchExt;
    }

    if (subFeature === 'UnsubJobNotf') {
      saveSubscribeFeature['IsShareContactNotificationEnable'] = 1;
      let UserDetailSearchExt = [];
      saveSubscribeFeature['UserDetails'] = UserDetailSearchExt;
    } 

    if (subFeature === 'UnsubContactNotf') {
      saveSubscribeFeature['IsShareContactNotificationEnable'] = 1;
      let UserDetailSearchExt = [];
      saveSubscribeFeature['UserDetails'] = UserDetailSearchExt;
    }
    
    this._systemSettingService.saveEOHSubsFeatures(saveSubscribeFeature).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        if (subFeature === 'UnsubSearchExtractNotf') {
          this.getsubEOHSearchExtNotf(unSubData);
        }
        if (subFeature === 'UnSubsPushJobNotf') {
          this.getsubPushJobNotf(unSubData);
        }
        if (subFeature === 'UnsubCANDExtractNotf') {
          this.getsubEOHCANDExtNotf(unSubData);
        }

        if (subFeature === 'UnsubClientNotf') {
          this.getsubEOHClientExtNotf(unSubData);
        }

        if (subFeature === 'UnsubJobNotf') {
         this.getsubEOHJobExtNotf(unSubData);
        }

        if (subFeature === 'UnsubContactNotf') {
         this.getsubEOHContactExtNotf(unSubData);
        }

        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      return new Promise(res => res(false))
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        return new Promise((res, rej) => rej());
      });
  }

 // who:bantee,why:ewm-13864 what: get superAdmin data ,when:5/09/2023

  getSuperAdminTenant(subsUserInviteFor) {
    this.loading = true;

    this.systemSettingService.getSuperAdminDetails().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {

          if (subsUserInviteFor === 'SearchExtNotf') {
            this.employeesList.unshift(repsonsedata.Data);
            this.onSaveSubsFeature('SearchExtractNotf');

          }
          if (subsUserInviteFor === 'CANDExtNotf') {
            this.candidateList.unshift(repsonsedata.Data);
            this.onSaveSubsFeature('CANDExtractNotf');

          }
          if (subsUserInviteFor === 'PushJobNotf') {
            this.employeesListforPushJob.unshift(repsonsedata.Data);
            this.onSaveSubsFeature('PushJobNotf');

          }

          if (subsUserInviteFor === 'SearchClientNotf') {
            this.clientList.unshift(repsonsedata.Data);
            this.onSaveSubsFeature('SearchClientNotf');

          }

          if (subsUserInviteFor === 'SearchJobNotf') {
            this.jobList.unshift(repsonsedata.Data);
            this.onSaveSubsFeature('SearchJobNotf');

          }

          if (subsUserInviteFor === 'SearchContactNotf') {
            this.contactList.unshift(repsonsedata.Data);
            this.onSaveSubsFeature('SearchContactNotf');

          }
        }
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

 // who:bantee,why:ewm-13864 what: getEOHSrhExtSubsDetails ,when:5/09/2023

  getEOHSrhExtSubsDetails() {
    this.loading = true;
    this._systemSettingService.getEOHSrhExtSubsDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsSearchExtractNotificationEnable = repsonsedata.Data.IsSearchExtractNotificationEnable;
        if (this.IsSearchExtractNotificationEnable == 1) {
          this.activeSubscJobBtn = true;
          // this.getSuperAdminTenant('SearchExtNotf');
        } else {
          this.activeSubscJobBtn = false;
        }

        repsonsedata.Data.UserDetails.forEach(x => delete x['IsSuperUser']);
        this.employeesList = repsonsedata.Data.UserDetails;
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

 // who:bantee,why:ewm-13864 what: getEOHPushJobSubsDetails ,when:5/09/2023

  getEOHPushJobSubsDetails() {
    this.loading = true;
    this._systemSettingService.getEOHPushJobSubsDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsPushJobNotificationEnable = repsonsedata.Data.IsPushJobNotificationEnable;
        if (this.IsPushJobNotificationEnable == 1) {
          this.activeSubscPushBtn = true;
          //this.getSuperAdminTenant('PushJobNotf');

        } else {
          this.activeSubscPushBtn = false;
        }
        repsonsedata.Data.UserDetails.forEach(x => delete x['IsSuperUser']);
        this.employeesListforPushJob = repsonsedata.Data.UserDetails;

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

 // who:Adarsh singh ,why:ewm-15858 what: subEOHCANDExtNotf ,when:30/01/2024
  subEOHCANDExtNotf(subs: number) {
    let subscribeSrhExt = {};
    subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;
    subscribeSrhExt['IsPushCandidateNotificationEnable'] = subs;

    if (subs === 0) {
      const message = `label_EhrIntegration_Unsubscribe_Confirmation`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.activeSubscCandBtn = false;
          this.onSaveSubsFeature('UnsubCANDExtractNotf', subscribeSrhExt);
        }
        this.loading = false;
      });
    } else {
      this.activeSubscCandBtn = true;
      this.loading = true;

      this._systemSettingService.subscribeNotification(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.IsCANDExtractNotificationEnable = repsonsedata['Data'].IsPushCandidateNotificationEnable;
          localStorage.setItem('IsCANDExtractNotificationEnable',repsonsedata.Data.IsPushCandidateNotificationEnable);
          this.setEohIntegrationObj();
          this.getSuperAdminTenant('CANDExtNotf');
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
  }
  


 // who:Adarsh singh ,why:ewm-15858 what: getsubEOHCANDExtNotf ,when:30/01/2024
  getsubEOHCANDExtNotf(subscribeSrhExt) {
    this._systemSettingService.subscribeNotification(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsCANDExtractNotificationEnable = repsonsedata['Data'].IsPushCandidateNotificationEnable;
        localStorage.setItem('IsCANDExtractNotificationEnable',this.IsCANDExtractNotificationEnable.toString());
        this.setEohIntegrationObj();
        this.candidateList = [];
        if (this.IsCANDExtractNotificationEnable === 0) {
          this.activeSubscCandBtn = false;
        }
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

  candidateList:any = [];
 // who:Adarsh singh ,why:ewm-15858 what: getEOHCANDExtSubsDetails ,when:30/01/2024
  getEOHCANDExtSubsDetails() {
    this.loading = true;
    this._systemSettingService.getEOHCandidateSubsDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsCANDExtractNotificationEnable = repsonsedata.Data.IsPushCandidateNotificationEnable;
        if (this.IsCANDExtractNotificationEnable == 1) {
          this.activeSubscCandBtn = true;
        } else {
          this.activeSubscCandBtn = false;
        }

        repsonsedata.Data.UserDetails.forEach(x => delete x['IsSuperUser']);
        this.candidateList = repsonsedata.Data.UserDetails;
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
  
 // who:Adarsh singh ,why:ewm-15858 what: setEohIntegrationObj ,when:30/01/2024
  setEohIntegrationObj(){
    let objc:{searchExtractEnable: number, pushJobEnable: number,candExtractEnable: number,clientExtractEnable:number,
      jobExtractEnable:number,contactExtractEnable:number} = {
      searchExtractEnable: this.IsSearchExtractNotificationEnable,
      pushJobEnable: this.IsPushJobNotificationEnable,
      candExtractEnable: this.IsCANDExtractNotificationEnable,
      clientExtractEnable: this.IsShareClientNotificationEnable,
      jobExtractEnable:this.IsShareJobNotificationEnable,
      contactExtractEnable:this.IsShareContactNotificationEnable
    }
    localStorage.setItem('EOHIntegration', JSON.stringify(objc))
  }
  
  // who: Renu ,why: EWM-19382 ewm-19514 what: getEOHShareClientSubsDetails ,when:10/02/2024
  getEOHShareClientSubsDetails() {
    this.loading = true;
    this._systemSettingService.getEOHClientsubsDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false; 
        this.IsShareClientNotificationEnable = repsonsedata.Data.IsShareClientNotificationEnable;
        if (this.IsShareClientNotificationEnable == 1) {
          this.activeSubsClientBtn = true;
        } else {
          this.activeSubsClientBtn = false;
        }

        repsonsedata.Data.UserDetails.forEach(x => delete x['IsSuperUser']);
        this.clientList = repsonsedata.Data.UserDetails;
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

  // who: Renu ,why: EWM-19382 ewm-19514 what: subEOHShareClientNotf ,when:10/02/2024
  subEOHShareClientNotf(subs: number) {
    let subscribeSrhExt = {};
    subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;
    subscribeSrhExt['IsShareClientNotificationEnable'] = subs;

    if (subs === 0) {
      const message = `label_EhrIntegration_Unsubscribe_Confirmation`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.activeSubsClientBtn = false;
          this.onSaveSubsFeature('UnsubClientNotf', subscribeSrhExt);
        }
        this.loading = false;
      });
    } else {
      this.activeSubsClientBtn = true;
      this.loading = true;

      this._systemSettingService.subscribeEOHShareClientNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.IsShareClientNotificationEnable = repsonsedata['Data'].IsShareClientNotificationEnable;
          localStorage.setItem('IsShareClientNotificationEnable',repsonsedata.Data.IsShareClientNotificationEnable);
          this.setEohIntegrationObj();
          this.getSuperAdminTenant('SearchClientNotf');
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
  }

   // who: Renu ,why: EWM-19382 EWM-19514 what: getsubEOHClientExtNotf ,when:10/02/2025
   getsubEOHClientExtNotf(subscribeSrhExt) {
    this._systemSettingService.subscribeEOHShareClientNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsShareClientNotificationEnable = repsonsedata['Data'].IsShareClientNotificationEnable;
        localStorage.setItem('IsShareClientNotificationEnable',this.IsShareClientNotificationEnable.toString());
        this.setEohIntegrationObj();
        this.clientList = [];
        if (this.IsShareClientNotificationEnable === 0) {
          this.activeSubsClientBtn = false;
        }
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

   // who: Renu ,why: EWM-19382 ewm-19514 what: getEOHShareContactSubsDetails ,when:10/02/2024
   getEOHShareContactSubsDetails() {
    this.loading = true;
    this._systemSettingService.getEOHContactsubsDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false; 
        this.IsShareContactNotificationEnable = repsonsedata.Data.IsShareContactNotificationEnable;
        if (this.IsShareContactNotificationEnable == 1) {
          this.activeSubsContactBtn = true;
        } else {
          this.activeSubsContactBtn = false;
        }

        repsonsedata.Data.UserDetails.forEach(x => delete x['IsSuperUser']);
        this.contactList = repsonsedata.Data.UserDetails;
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

  // who: Renu ,why: EWM-19382 ewm-19514 what: subEOHShareContactNotf ,when:10/02/2024
  subEOHShareContactNotf(subs: number) {
    let subscribeSrhExt = {};
    subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;
    subscribeSrhExt['IsShareContactNotificationEnable'] = subs;

    if (subs === 0) {
      const message = `label_EhrIntegration_Unsubscribe_Confirmation`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this.activeSubsContactBtn = false;
          this.onSaveSubsFeature('UnsubContactNotf', subscribeSrhExt);
        }
        this.loading = false;
      });
    } else {
      this.activeSubsContactBtn = true;
      this.loading = true;

      this._systemSettingService.subscribeEOHShareContactNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.IsShareContactNotificationEnable = repsonsedata['Data'].IsShareContactNotificationEnable;
          localStorage.setItem('IsShareContactNotificationEnable',repsonsedata.Data.IsShareContactNotificationEnable);
          this.setEohIntegrationObj();
          this.getSuperAdminTenant('SearchContactNotf');
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
  }

   // who: Renu ,why: EWM-19382 EWM-19514 what: getsubEOHContactExtNotf ,when:10/02/2025
   getsubEOHContactExtNotf(subscribeSrhExt) {
    this._systemSettingService.subscribeEOHShareContactNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.IsShareContactNotificationEnable = repsonsedata['Data'].IsShareContactNotificationEnable;
        localStorage.setItem('IsShareContactNotificationEnable',this.IsShareContactNotificationEnable.toString());
        this.setEohIntegrationObj();
        this.contactList = [];
        if (this.IsShareContactNotificationEnable === 0) {
          this.activeSubsContactBtn = false;
        }
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

     // who: Renu ,why: EWM-19382 ewm-19514 what: getEOHShareJobSubsDetails ,when:10/02/2024
     getEOHShareJobSubsDetails() {
      this.loading = true;
      this._systemSettingService.getEOHJobsubsDetails(this.RegistrationCode).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false; 
          this.IsShareJobNotificationEnable = repsonsedata.Data.IsShareJobNotificationEnable;
          if (this.IsShareJobNotificationEnable == 1) {
            this.activeSubsJobBtn = true;
          } else {
            this.activeSubsJobBtn = false;
          }
  
          repsonsedata.Data.UserDetails.forEach(x => delete x['IsSuperUser']);
          this.jobList = repsonsedata.Data.UserDetails;
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
  
    // who: Renu ,why: EWM-19382 ewm-19514 what: subEOHShareJobNotf ,when:10/02/2024
    subEOHShareJobNotf(subs: number) {
      let subscribeSrhExt = {};
      subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;
      subscribeSrhExt['IsShareJobNotificationEnable'] = subs;
  
      if (subs === 0) {
        const message = `label_EhrIntegration_Unsubscribe_Confirmation`;
        const title = '';
        const subTitle = '';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
            this.activeSubsJobBtn = false;
            this.onSaveSubsFeature('UnsubJobNotf', subscribeSrhExt);
          }
          this.loading = false;
        });
      } else {
        this.activeSubsJobBtn = true;
        this.loading = true;
  
        this._systemSettingService.subscribeEOHShareJobNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            this.IsShareJobNotificationEnable = repsonsedata['Data'].IsShareJobNotificationEnable;
            localStorage.setItem('IsShareJobNotificationEnable',repsonsedata.Data.IsShareJobNotificationEnable);
            this.setEohIntegrationObj();
            this.getSuperAdminTenant('SearchJobNotf');
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
    }
  
     // who: Renu ,why: EWM-19382 EWM-19514 what: getsubEOHJobExtNotf ,when:10/02/2025
     getsubEOHJobExtNotf(subscribeSrhExt) {
      this._systemSettingService.subscribeEOHShareJobNotf(subscribeSrhExt).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.IsShareJobNotificationEnable = repsonsedata['Data'].IsShareJobNotificationEnable;
          localStorage.setItem('IsShareJobNotificationEnable',this.IsShareJobNotificationEnable.toString());
          this.setEohIntegrationObj();
          this.jobList = [];
          if (this.IsShareJobNotificationEnable === 0) {
            this.activeSubsJobBtn = false;
          }
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
}
