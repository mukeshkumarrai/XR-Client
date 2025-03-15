/*
 @(C): Entire Software
 @Type: File, <TS>
 @Who: Anup Singh
 @When: 09-Feb-2022
 @Why: EWM-4674 EWM-5115
 @What: This page wil be use only for gdpr compliance Component TS
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from '../../../shared/datamodels/location-type';

@Component({
  selector: 'app-gdpr-compliance',
  templateUrl: './gdpr-compliance.component.html',
  styleUrls: ['./gdpr-compliance.component.scss']
})
export class GdprComplianceComponent implements OnInit {

  public loading: boolean = false;
  public isGdprSettings: boolean = false;
  public isGdprConsent: boolean = false;
  public isConsentRequest: boolean = false;

  public IsGDPREnabledToggle: boolean = false;
  public IsConsentSettingEnaledToggle: boolean = false;
  public IsConsentRequestEnableToggle: boolean = false;

  public IsGDPREnabled: number = 0;
  public IsConsentSettingEnaled: number = 0;
  public IsFormCandidate: number = 0;
  public IsAppliedCandidate: number = 0;
  public IsFormEmployee: number = 0;

  GDPRCompliance: any = {}
  @ViewChild('gdprDrawer') public sideNavGDPRDrawer: MatSidenav;

  constructor(private route: Router, private systemSettingService: SystemSettingService,
    public activateroute: ActivatedRoute, public _sidebarService: SidebarService, private snackBService: SnackBarService, private translateService: TranslateService,
    private _appSetting: AppSettingsService, private commonServiesService: CommonServiesService) { }

  ngOnInit(): void {

    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);


    this.getGDPRCompliance();
  }

  /*
  @Type: File, <ts>
  @Name: onChangeGdprAutomaticConsentRequest
  @Who: Anup Singh
  @When: 09-Feb-2022
  @Why: EWM-4674 EWM-5115
  @What: change toggle Gdpr Compliance Status
  */
  onChangeGdprComplianceStatus(gdprStatus) {
    if (gdprStatus.checked === true) {
      this.isGdprSettings = true;
      this.IsGDPREnabledToggle = true;
      this.IsGDPREnabled = 1;
      this.OnSubmit();
    } else {
      this.isGdprSettings = false;
      this.isGdprConsent = false;
      this.IsGDPREnabledToggle = false;
      this.IsGDPREnabled = 0;
      this.OnSubmit();

    }
  }

  /*
@Type: File, <ts>
@Name: onChangeGdprConsentSettings
@Who: Anup Singh
@When: 09-Feb-2022
@Why: EWM-4674 EWM-5115
@What: change toggle Gdpr Consent Settings
*/
  onChangeGdprConsentSettings(gdprSettings) {
    if (gdprSettings.checked === true) {
      this.isGdprConsent = true;
      this.IsConsentSettingEnaledToggle = true;
      this.IsConsentSettingEnaled = 1;
      this.OnSubmit();
    } else {
      this.isGdprConsent = false;
      this.IsConsentSettingEnaledToggle = false;
      this.IsConsentSettingEnaled = 0;
      this.OnSubmit();
    }

  }

  /*
  @Type: File, <ts>
  @Name: onChangeGdprAutomaticConsentRequest
  @Who: Anup Singh
  @When: 09-Feb-2022
  @Why: EWM-4674 EWM-5115
  @What: change toggle Automatic Consent Request
  */
  onChangeGdprAutomaticConsentRequest(gdprConsent) {
    if (gdprConsent.checked === true) {
      this.isPageTemplate = false;
      this.isEmailTemplate = false;
      this.isConsentRequest = true;
     // this.sideNavGDPRDrawer.open();
    } else {
      this.IsFormCandidate = 0;
      this.IsAppliedCandidate = 0;
      this.IsFormEmployee = 0;
      this.OnSubmit();
    }
  }



  /*
 @Type: File, <ts>
 @Name: openDrawerConsentRequest
 @Who: Anup Singh
 @When: 09-Feb-2022
 @Why: EWM-4674 EWM-5115
 @What: for child component load when click Automatic Consent Request toogle 
*/
  openDrawerConsentRequest() {
    this.isPageTemplate = false;
    this.isEmailTemplate = false;
    this.isConsentRequest = true;
    this.sideNavGDPRDrawer.open();
  }


  /*
  @Type: File, <ts>
  @Name: closeDrawerConsentRequest
  @Who: Anup Singh
  @When: 09-Feb-2022
  @Why: EWM-4674 EWM-5115
  @What: to close Drawer Automatic Consent Request
  */

  closeDrawerConsentRequest() {
    this.isConsentRequest = false;
    this.isPageTemplate = false;
    this.isEmailTemplate = false;

    if(this.IsFormCandidate == 1 || this.IsAppliedCandidate==1 || this.IsFormEmployee==1){
      this.IsConsentRequestEnableToggle = true;
    }else{
      this.IsConsentRequestEnableToggle = false;
    }
  }

  /*
  @Type: File, <ts>
  @Name: getGDPRCompliance
  @Who: Anup Singh
  @When: 10-Feb-2022
  @Why: EWM-4674 EWM-5116
  @What: for get gdpr Compliance
  */
  getGDPRCompliance() {
    this.systemSettingService.fetchGDPRCompliance().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.GDPRCompliance = repsonsedata.Data;
          let GDPRCompliance: any = repsonsedata.Data;
          if (GDPRCompliance.IsGDPREnabled == 1) {
            this.IsGDPREnabledToggle = true;
            this.isGdprSettings = true;

          } else {
            this.IsGDPREnabledToggle = false;
            this.isGdprSettings = false;
            this.isGdprConsent = false;
          }
          if (GDPRCompliance.IsConsentSettingEnaled == 1) {
            this.IsConsentSettingEnaledToggle = true;
            if (this.isGdprSettings === true) {
              this.isGdprConsent = true;
            }

          } else {
            this.IsConsentSettingEnaledToggle = false;
            this.isGdprConsent = false;
          }

           this.IsGDPREnabled = GDPRCompliance.IsGDPREnabled;
          this.IsConsentSettingEnaled = GDPRCompliance.IsConsentSettingEnaled;
          this.IsFormCandidate = GDPRCompliance.IsFormCandidate;
          this.IsAppliedCandidate = GDPRCompliance.IsAppliedCandidate;
          this.IsFormEmployee = GDPRCompliance.IsFormEmployee;

          if(this.IsFormCandidate == 1 || this.IsAppliedCandidate==1 || this.IsFormEmployee==1){
            this.IsConsentRequestEnableToggle = true;
          }else{
            this.IsConsentRequestEnableToggle = false;
          }
         

          this.isConsentRequest = true;

        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }


  /*
@Type: File, <ts>
@Name: getConsentReqValue
@Who: Anup Singh
@When: 10-Feb-2022
@Why: EWM-4674 EWM-5116
@What: get value from drawer Autometic consent request
*/
  getConsentReqValue(value) {
    if (value.isConsentReq == true) {
      this.IsFormCandidate = value.IsFormCandidate;
      this.IsAppliedCandidate = value.IsAppliedCandidate;
      this.IsFormEmployee = value.IsFormEmployee;

      this.OnSubmit();
    }

  }



  /*
@Type: File, <ts>
@Name: OnSubmit
@Who: Anup Singh
@When: 10-Feb-2022
@Why: EWM-4674 EWM-5116
@What: for update gdpr compliance value
*/
  OnSubmit() {
    let toObj = {}
    let updateObj = {
      "From": this.GDPRCompliance,
      "To": toObj
    }
    toObj['IsGDPREnabled'] = this.IsGDPREnabled;
    toObj['IsConsentSettingEnaled'] = this.IsConsentSettingEnaled;
    toObj['IsFormCandidate'] = this.IsFormCandidate;
    toObj['IsAppliedCandidate'] = this.IsAppliedCandidate;
    toObj['IsFormEmployee'] = this.IsFormEmployee;
    this.loading = true;
    this.systemSettingService.updateGDPRCompliance(updateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getGDPRCompliance()
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





    /*
 @Type: File, <ts>
 @Name: openDrawerPageTemplate
 @Who: Anup Singh
 @When: 11-Feb-2022
 @Why: EWM-4671 EWM-5185
 @What: drwaer open page template
*/
isPageTemplate:boolean=false;
openDrawerPageTemplate() {
  this.isEmailTemplate = false;
  this.isConsentRequest = false;
  this.isPageTemplate = true;
  this.sideNavGDPRDrawer.open();

}


    /*
 @Type: File, <ts>
 @Name: openDrawerEmailTemplate
 @Who: Anup Singh
 @When: 11-Feb-2022
 @Why: EWM-4671 EWM-5185
 @What: drwaer open Email template
*/
isEmailTemplate:boolean=false;
openDrawerEmailTemplate() {
  this.isPageTemplate = false;
  this.isConsentRequest = false;
  this.isEmailTemplate = true;
  this.sideNavGDPRDrawer.open();
}


/*
@Type: File, <ts>
@Name: consentReqPageTempCancelBtn
@Who: Anup Singh
@When: 14-Feb-2022
@Why: EWM-4671 EWM-5185
@What: drwaer close Page template from cancel btn
*/
consentReqPageTempCancelBtn(value){
  if(value==true){
    this.sideNavGDPRDrawer.close();
  this.isPageTemplate = false;
  } 
}

/*
@Type: File, <ts>
@Name: consentReqEmailTempCancelBtn
@Who: Anup Singh
@When: 14-Feb-2022
@Why: EWM-4671 EWM-5185
@What: drwaer close Email template from cancel btn
*/
consentReqEmailTempCancelBtn(value){
if(value==true){
this.sideNavGDPRDrawer.close();
this.isEmailTemplate = false;
}
}

}