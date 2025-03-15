/*
 @(C): Entire Software
 @Type: File, <ts>
 @Who: Anup Singh
 @When: 07-May-2022
 @Why: EWM-6220 EWM-6502
 @What: This page wil be use only career Network
*/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';


@Component({
  selector: 'app-career-network',
  templateUrl: './career-network.component.html',
  styleUrls: ['./career-network.component.scss']
})
export class CareerNetworkComponent implements OnInit {

  public careerId: any = null;
  public loading = false;
  public CareerNetworkForm: FormGroup;
  public SocialProfilesData: any = [];
  public networkData: any = {};
  @Output() careerNetworkPage = new EventEmitter();

  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService,) {
    this.CareerNetworkForm = this.fb.group({
      IsCareerPage: [false],
      IsJobDetailPage: [false]

    })

  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe(
      params => {
        if ((this.routes.snapshot.queryParams.Id != null)) {
          this.careerId = params['Id'];

          this.getByIdData(this.careerId);
        }
      });
  }


  /*
@Type: File, <ts>
@Name: getByIdData
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for get data of network
*/
  getByIdData(Id) {
    this.loading = true;
    this.jobService.getByIdCareerPage(Id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.networkData = repsonsedata?.Data;
          this.SocialProfilesData = repsonsedata?.Data?.SocialProfiles;
          this.SocialProfilesData.forEach(element => {
            if (element.SocialProfileURL != '') {
              element['isToggle'] = true
            } else {
              element['isToggle'] = false
            }

            if((element?.isToggle==true) && (element['SocialProfileURL'] == undefined || element['SocialProfileURL'] == null || element['SocialProfileURL'] == ''))
      {
        //this.isInputValidation = true;
        element['isInputValidation'] = true;
      }else if((element?.isToggle==true) && (element['SocialProfileURL'] != undefined && element['SocialProfileURL'] != null && element['SocialProfileURL'] != '')){
        //this.isInputValidation = false;
        element['isInputValidation'] = false;
      }
  
          });

         
          if (this.networkData?.DisplayOnPage == 1) {
            this.CareerNetworkForm.patchValue({
              IsCareerPage: true,
              IsJobDetailPage: false,
            });
          } else if (this.networkData.DisplayOnPage == 2) {
            this.CareerNetworkForm.patchValue({
              IsCareerPage: false,
              IsJobDetailPage: true,
            });
          } else if (this.networkData.DisplayOnPage == 3) {
            this.CareerNetworkForm.patchValue({
              IsCareerPage: true,
              IsJobDetailPage: true,
            });
          }

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
@Type: File, <ts>
@Name: onKeyupInput
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for change input
*/
  isInputValidation: boolean = false;
  onKeyupInput(data, value) {
    this.SocialProfilesData.forEach((element: any) => {
      if (element.SocialProfileId == data?.SocialProfileId) {
        element['SocialProfileURL'] = value;
      }
      if((element?.isToggle==true) && (element['SocialProfileURL'] == undefined || element['SocialProfileURL'] == null || element['SocialProfileURL'] == ''))
      {
       // this.isInputValidation = true;
        element['isInputValidation'] = true;
      }else if((element?.isToggle==true) && (element['SocialProfileURL'] != undefined && element['SocialProfileURL'] != null && element['SocialProfileURL'] != '')){
       // this.isInputValidation = false;
        element['isInputValidation'] = false;
      }
    });
    let res =  this.SocialProfilesData.some(item => item.isInputValidation == true);
    if(res){
      this.isInputValidation = true;
    }else{
      this.isInputValidation = false;
    }
  }

  /*
@Type: File, <ts>
@Name: onChangeToggle
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for change toggle button
*/
  onChangeToggle(enable: boolean, SocialProfiles) {
    if (enable) {
      this.SocialProfilesData.forEach((element: any) => {
        if (element.SocialProfileId == SocialProfiles?.SocialProfileId) {
              element['isToggle'] = true,
              element['isInputValidation'] = true,
              element['SocialProfileURL'] = SocialProfiles?.SocialProfileURL;
        }
        if (SocialProfiles?.SocialProfileURL == undefined || SocialProfiles?.SocialProfileURL == null || SocialProfiles?.SocialProfileURL == '') {
         // this.isInputValidation = true;
        } else {
         // this.isInputValidation = false;
        }
      });
    } else {
      this.SocialProfilesData.forEach((element: any) => {
        if (element.SocialProfileId == SocialProfiles?.SocialProfileId) {
          element['isToggle'] = false;
          element['SocialProfileURL'] = '';
          element['isInputValidation'] = false;
        // this.isInputValidation = false;
       
        }
      });
    }

    let res =  this.SocialProfilesData.some(item => item.isInputValidation == true);
    if(res){
      this.isInputValidation = true;
    }else{
      this.isInputValidation = false;
    }
  }




  /*
@Type: File, <ts>
@Name: onDismiss
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for close drawer
*/
  onDismiss() {
    this.careerNetworkPage.emit(true);
  }


  /*
@Type: File, <ts>
@Name: onConfirm
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for Save
*/
  onConfirm() {
    let DisplayOnPage: number = 0;
    if (this.CareerNetworkForm.controls['IsCareerPage'].value == true && this.CareerNetworkForm.controls['IsJobDetailPage'].value == false) {
      DisplayOnPage = 1;
    } else if (this.CareerNetworkForm.controls['IsCareerPage'].value == false && this.CareerNetworkForm.controls['IsJobDetailPage'].value == true) {
      DisplayOnPage = 2;
    } else if (this.CareerNetworkForm.controls['IsCareerPage'].value == true && this.CareerNetworkForm.controls['IsJobDetailPage'].value == true) {
      DisplayOnPage = 3;
    }
    let UpdateObj = {}
    UpdateObj['DisplayOnPage'] = DisplayOnPage;
    UpdateObj['CareerPageName'] = this.networkData?.CareerPageName;
    UpdateObj['CareerSiteName'] = this.networkData?.CareerSiteName;
    UpdateObj['Id'] = this.networkData?.Id;
    UpdateObj['CareerSiteType'] = this.networkData?.CareerSiteType;
    UpdateObj['SocialProfiles'] = this.SocialProfilesData;

    let SubmitData = {
      "From": this.networkData,
      "To": UpdateObj
    };
    this.loading = true;
    this.jobService.createNetworkPage(SubmitData).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.careerNetworkPage.emit(true);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

}
