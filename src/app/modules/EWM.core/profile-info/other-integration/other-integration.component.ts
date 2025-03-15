/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Anup
    @When: Feb 04 2022
    @Why: EWM-4063 EWM-4610
    @What:  This page is creted for Integration interface board UI Component TS
*/



import { Component, HostListener, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { IntegrationsBoardService } from '../../shared/services/profile-info/integrations-board.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-other-integration',
  templateUrl: './other-integration.component.html',
  styleUrls: ['./other-integration.component.scss']
})
export class OtherIntegrationComponent implements OnInit {

  loading: boolean = false;
  otherIntegrationList: any[] = [];
  seekRegistrationCode: any;
  daxtraRegistrationCode: any;
  directionValue: string;
  xeopleSMSRegistrationCode: any;
  xeopleCallRegistrationCode: any;
  zoomMeetingInviteRegistrationCode:any;
  zoomPhoneCallRegistrationCode:any;
  ZoomPhoneStatus:boolean;
  ZoomMeetingStatus:boolean;
  MSTeamStatus:boolean;
  GoogleMeetStatus:boolean;
  mSTeamMeetingInviteRegistrationCode: any;
  googleMeetMeetingInviteRegistrationCode: any;
  BroadbeanEnabelDesabelStatus:boolean;
  enabelBroadbeanregistrationcode:any;
  Broadbeanregistrationcode:any

  constructor(public _integrationsBoardService: IntegrationsBoardService, private route: Router,private _systemSettingService:SystemSettingService,
    public activateroute: ActivatedRoute, public _sidebarService: SidebarService, private snackBService: SnackBarService,
    private translateService: TranslateService, private _appSetting: AppSettingsService,
     private commonServiesService: CommonServiesService) {
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.daxtraRegistrationCode = this._appSetting.daxtraRegistrationCode;
    this.xeopleSMSRegistrationCode = this._appSetting.xeopleSMSRegistrationCode;
    this.xeopleCallRegistrationCode = this._appSetting.xeopleCallRegistrationCode;
    this.zoomMeetingInviteRegistrationCode = this._appSetting.zoomMeetingInviteRegistrationCode;
    this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
    this.mSTeamMeetingInviteRegistrationCode = this._appSetting.mSTeamMeetingInviteRegistrationCode;
    this.googleMeetMeetingInviteRegistrationCode = this._appSetting.googleMeetMeetingInviteRegistrationCode;
    this.enabelBroadbeanregistrationcode = this._appSetting.enabelBroadbeanregistrationcode;
    this.Broadbeanregistrationcode = this._appSetting.Broadbeanregistrationcode;



  }

  ngOnInit(): void {
    this.commonServiesService.event.subscribe(res => {
      this.directionValue = res;
    })


    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

 // @suika @EWM-13681 Whn 03-08-2023
   this.getOtherIntegrationCheckstatus();
    this.getOtherIntegrationAll();



    /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
    this.commonServiesService.searchEnableCheck(1);

  }

  /*
  @Type: File, <ts>
  @Name: getOtherIntegrationAll function
  @Who: Anup Singh
  @When: 04-Feb-2022
  @Why: EWM-4063 EWM-4610
  @What: For getting other integration data
 */
  getOtherIntegrationAll() {
    this.loading = true;
    this._integrationsBoardService.getOtherIntegrationAll().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.otherIntegrationList = repsonsedata.Data;
          //this.getIntegrationBoardData();
        } else {
          this.otherIntegrationList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }


  onclickSetRegCodeName(data){
   localStorage.setItem('otherIntegrationData', JSON.stringify(data));
  }



  /*
 @Type: File, <ts>
 @Name: getCheckZoomPhonCallCheckstatus function
 @Who: Anup
 @When: Feb 10 2022
 @Why: EWM-4063 EWM-4611
 @What: For showing check status of zoom phone call
*/
getCheckZoomPhonCallCheckstatus(otherIntegrationsData) {
  let zoomPhoneCallRegistrationCodeObj = otherIntegrationsData?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
  this.ZoomPhoneStatus =  zoomPhoneCallRegistrationCodeObj[0]?.Connected;
       // @suika @EWM-13681 Whn 03-08-2023
       let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
       let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.zoomPhoneCallRegistrationCode));
       otherIntegrations[objIndex].Connected = this.ZoomPhoneStatus;
       localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
}

 /*
 @Type: File, <ts>
 @Name: getCheckZoomMeetingCallCheckstatus function
 @Who: Nitin Bhati
 @When: March 2 2022
 @Why: EWM-5409
 @What: For showing check status of zoom meeting call
*/
getCheckZoomMeetingCallCheckstatus(otherIntegrationsData) {
  // @suika @EWM-13681 Whn 03-08-2023
  let zoomMeetingInviteRegistrationCodeObj = otherIntegrationsData?.filter(res=>res.RegistrationCode==this.zoomMeetingInviteRegistrationCode);
  this.ZoomMeetingStatus =  zoomMeetingInviteRegistrationCodeObj[0]?.Connected;
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
      let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.zoomMeetingInviteRegistrationCode));
      otherIntegrations[objIndex].Connected = this.ZoomMeetingStatus;
      localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
}

 /*
 @Type: File, <ts>
 @Name: getCheckMSTeamCallCheckstatus function
 @Who: Nitin Bhati
 @When: Apr 14 2022
 @Why: EWM-6183
 @What: For showing check status of MS Team meeting call
*/
getCheckMSTeamCallCheckstatus(otherIntegrationsData) {
   // @suika @EWM-13681 Whn 03-08-2023
  let mSTeamMeetingInviteRegistrationCodeObj = otherIntegrationsData?.filter(res=>res.RegistrationCode==this.mSTeamMeetingInviteRegistrationCode);
  this.MSTeamStatus =  mSTeamMeetingInviteRegistrationCodeObj[0]?.Connected;
  let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
  let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.mSTeamMeetingInviteRegistrationCode));
  otherIntegrations[objIndex].Connected = this.MSTeamStatus;
  localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
}

 /*
 @Type: File, <ts>
 @Name: getCheckGoogleMeetCallCheckstatus function
 @Who: Nitin Bhati
 @When: Apr 14 2022
 @Why: EWM-6183
 @What: For showing check status of Google Meet meeting call
*/
getCheckGoogleMeetCallCheckstatus(otherIntegrationsData) {
  // @suika @EWM-13681 Whn 03-08-2023
  let googleMeetMeetingInviteRegistrationCodeObj = otherIntegrationsData?.filter(res=>res.RegistrationCode==this.googleMeetMeetingInviteRegistrationCode);
  this.GoogleMeetStatus =  googleMeetMeetingInviteRegistrationCodeObj[0]?.Connected;
  let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
  let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.googleMeetMeetingInviteRegistrationCode));
  otherIntegrations[objIndex].Connected = this.GoogleMeetStatus;
  localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
}


 /*
 @Type: File, <ts>
 @Name: getBroadbeanEnabelDesabel function
 @Who: maneesh
 @When: 20-Sep-2022
 @Why: EWM-8676
 @What: For showing check status of get Broadbean Enabel Desabel
*/
getBroadbeanEnabelDesabel(otherIntegrationsData) {
   // @suika @EWM-13681 Whn 03-08-2023
  let BroadbeanregistrationcodeObj = otherIntegrationsData?.filter(res=>res.RegistrationCode==this.Broadbeanregistrationcode);
  this.BroadbeanEnabelDesabelStatus =  BroadbeanregistrationcodeObj[0].Connected;
  let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
  let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.Broadbeanregistrationcode));
  otherIntegrations[objIndex].Connected = this.BroadbeanEnabelDesabelStatus;
  localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
}


    /*
   @Type: File, <ts>
   @Name: getOtherIntegrationZoomCheckstatus function
   @Who: Suika
   @When: 03-Aug-2023
   @Why: EWM-13681
   @What: For showing check status
  */
 getOtherIntegrationCheckstatus() {
  this.loading = true;
  let postData = [
  {'RegistrationCode':this.mSTeamMeetingInviteRegistrationCode,'IsUser':1},
  {'RegistrationCode':this.zoomMeetingInviteRegistrationCode,'IsUser':1},
  {'RegistrationCode':this.zoomPhoneCallRegistrationCode,'IsUser':1},
  {'RegistrationCode':this.googleMeetMeetingInviteRegistrationCode,'IsUser':1},
 /* {'RegistrationCode':this.Broadbeanregistrationcode,'IsUser':0},
  {'RegistrationCode':this.seekRegistrationCode,'IsUser':0},
  {'RegistrationCode':this.daxtraRegistrationCode,'IsUser':0},
  {'RegistrationCode':this.xeopleSMSRegistrationCode,'IsUser':0},
  {'RegistrationCode':this.xeopleCallRegistrationCode,'IsUser':0},
  {'RegistrationCode':this.googleMeetMeetingInviteRegistrationCode,'IsUser':0},
  {'RegistrationCode':this.enabelBroadbeanregistrationcode,'IsUser':0}*/
  ];
   this._systemSettingService.getJobBoardsIntegrationCheckstatus(postData).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
          //localStorage.setItem('otherIntegrations',JSON.stringify(repsonsedata.Data));
          this.getCheckZoomPhonCallCheckstatus(repsonsedata.Data);
          this.getCheckZoomMeetingCallCheckstatus(repsonsedata.Data);
          this.getCheckMSTeamCallCheckstatus(repsonsedata.Data);
          this.getCheckGoogleMeetCallCheckstatus(repsonsedata.Data);
          //this.getBroadbeanEnabelDesabel(repsonsedata.Data);
        }
      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}

}
