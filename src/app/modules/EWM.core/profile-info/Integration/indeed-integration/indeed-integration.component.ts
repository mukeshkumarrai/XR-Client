// <!---
//     @(C): Entire Software
//     @Type: ehr-integration.component.html File, <html>
//     @Who: maneesh
//     @When: 08-11-2023
//     @Why: EWM-14477 
//     @What:  This page is creted for indeed feature integration Integration UI Component HTML
// -->
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { IntegrationsBoardService } from '@app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
@Component({
  selector: 'app-indeed-integration',
  templateUrl: './indeed-integration.component.html',
  styleUrls: ['./indeed-integration.component.scss']
})
export class IndeedIntegrationComponent implements OnInit {

  public showTabData: boolean = true;
  public showEohFormData: boolean = false;
  indeedIntegrationForm: FormGroup;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public loading: boolean = false;
  public activestatus: string;
  public RegistrationCode: string;
  public IntegratorName: string;
  public visibilityStatus: boolean;
  public gridViewList: any=[];
  public gridViewListdata:any=[];
  public animationVar: any;
  dirctionalLang: string;
  public isCreateMode: boolean = true;
  public dataList: any=[];
  public isResponseGet:boolean = false;
  constructor(public dialog: MatDialog, private fb: FormBuilder, public _settingService: SystemSettingService,
    private route: Router,public _integrationsBoardService: IntegrationsBoardService,
    private snackBService: SnackBarService, public _sidebarService: SidebarService,
    private translateService: TranslateService, private _systemSettingService: SystemSettingService, private router: ActivatedRoute,
    
  ) {
    this.indeedIntegrationForm = this.fb.group({
      Id: [0],
      ClientId: ['', [Validators.required,  this.noWhitespaceValidator(),Validators.maxLength(100)]],
      ClientSecret: ['', [Validators.required, this.noWhitespaceValidator(),Validators.maxLength(100)]],
      OrganizationName: ['']
    });
  }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);


    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
          this.IntegratorName = params['name'];
        }
      });
    this.animationVar = ButtonTypes;
    this.getIntegrationCheckstatus();
    this.getIntegrationRegistration();
    
  }
 
 // who:maneesh,why:ewm-14477 what:get data from job board  ,when:08/11/2023
  getIntegrationRegistration() {
    this.loading = true;
    this._systemSettingService.getIntegrationRegistrationByCode(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {      
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          if (repsonsedata.Data) {
             this.gridViewList = repsonsedata.Data;
            this.gridViewListdata =this.gridViewList
             }
         } else if(repsonsedata.HttpStatusCode === 204) {
          this.gridViewList = repsonsedata.Data;
          this.gridViewListdata =this.gridViewList
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
 // who:manesh,why:ewm-14477 what:check status conected or not  from job board  ,when:08/11/2023
  getIntegrationCheckstatus() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatus(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatus = repsonsedata.Data?.Connected;
            if (this.visibilityStatus === true) {
              this.activestatus = 'Edit';
              this.visibilityStatus = true;
              this.isCreateMode=false;
              // this.saveStatus = false;
            } else {
              this.activestatus = 'Add';
              this.visibilityStatus = false;
            }
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

   // who:maneesh,why:ewm-14477 what:open indeed form to add and edit  ,when:08/11/2023
   openEohFormData(values) {
    if (values == 'Add') {
      this.activestatus = 'Add';
      this.showEohFormData = true;
      this.showTabData = false;

    } else {
      this.getIntegrationRegistrationByCode();
      this.activestatus = 'Edit';
      this.showEohFormData = true;
      this.showTabData = false;
    }
    this.isCreateMode = false;

  }
 // who:maneesh,why:ewm-14477 what:getIntegrationData ,when:08/11/2023
  getIntegrationRegistrationByCode() {
    this.loading = true;
    this._systemSettingService.getIndeedIntegrationCheckstatus(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
             this.indeedIntegrationForm.patchValue({
             Id: repsonsedata.Data?.Id,
             ClientId:repsonsedata.Data?.ClientId,
             ClientSecret:repsonsedata.Data?.ClientSecret
             })
          }
      // this.gridViewListdata =  this.dataList?.filter((e:any) => e.Name.toLowerCase() === "indeed");
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }


 // who:maneesh,why:ewm-14477 what:for white space  ,when:08/11/2023

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  resetValidateForm(){
    if(this.indeedIntegrationForm.value?.ClientId){
   let control=this.indeedIntegrationForm.get('ClientId');
    delete control?.errors?.invalid;
    control.updateValueAndValidity();
  }
    if(this.indeedIntegrationForm.value?.ClientSecret){
    let control=this.indeedIntegrationForm.get('ClientSecret');
    delete control?.errors?.invalid;
    control.updateValueAndValidity();
  }
    this.indeedIntegrationForm.updateValueAndValidity();
  }
 // who:maneesh,why:ewm-14477 what:save the form  ,when:08/11/2023
  onSave(value) {
    this.isResponseGet = true;
    if (this.indeedIntegrationForm.invalid) {
      return;
    }
    this.createIntegration(value);
  }

 // who:maneesh,why:ewm-14477 what:Integrate indeed in market place  ,when:08/11/2023
  createIntegration(value: any) {
    let AddObj = {};    
    AddObj['Id'] = value?.Id==null ? 0 : value?.Id;
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['ClientId'] = value?.ClientId.trim();
    AddObj['ClientSecret'] = value?.ClientSecret.trim();

    this._systemSettingService.indeedIntegrationConnectCreate(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.showEohFormData = false;
        this.showTabData = true;
        this.visibilityStatus = true;
        this.isCreateMode = false;
        this.isResponseGet = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
    },
      err => {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

 // who:maneesh,why:ewm-14477 what:disconnect the popup  ,when:08/11/2023
  disconnectPopUp(): void {
    let discjson = {};
    discjson['RegistrationCode'] = this.RegistrationCode;
    const message = ``;
    const title = '';
    const subTitle = 'marketplace_indeed';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._systemSettingService.disconnectIndeedIntegration(discjson).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.indeedIntegrationForm.reset();
              this.indeedIntegrationForm.patchValue({
                Id: 0
              })
              this.isCreateMode = true;
              this.showEohFormData = false;
              this.showTabData = true;
              this.visibilityStatus = false;
              let subscribeSrhExt = {};
              subscribeSrhExt['RegistrationCode'] = this.RegistrationCode;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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

 // who:maneesh,why:ewm-14477 what:Cancel the form on Validation page  ,when:08/11/2023
  onCancel() {
    if (this.activestatus == 'Add') {
      this.showEohFormData = false;
      this.showTabData = true;
      this.indeedIntegrationForm.reset();
      this.isCreateMode = true;
    } else {
      this.showTabData = true;
      this.showEohFormData = false;
    }
  }
   // who:maneesh,why:ewm-14477 what:backToJob  ,when:08/11/2023
   backToJob() {
    this.route.navigate(['/client/core/administrators/integration-interface-board']);
  }
}

