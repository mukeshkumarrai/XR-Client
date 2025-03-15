// who:Adarsh singh ,why:ewm-15887 what: BasicConfigurationComoponent ,when:31/01/2024
import { Component, OnInit } from "@angular/core"
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../../shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from '../../shared/services/app-settings.service';
import { SystemSettingService } from '../../modules/EWM.core/shared/services/system-setting/system-setting.service';
import { IndexedDbService } from '../../shared/helper/indexed-db.service';
import { ProfileInfoService } from '../../modules/EWM.core/shared/services/profile-info/profile-info.service';
import { MailServiceService } from '../../shared/services/email-service/mail-service.service';


@Component({
    selector: 'global-config',
    template:``
})
export class BasicConfigurationComoponent implements OnInit {
    zoomPhoneCallRegistrationCode: string;
    seekRegistrationCode: string;
    Broadbeanregistrationcode: string;
    zoomMeetingInviteRegistrationCode: string;
    mSTeamMeetingInviteRegistrationCode: string;
    zoomCheckStatus: boolean = false;
    daxtraRegistrationCode: string;
    xeopleSMSRegistrationCode: string;
    xeopleCallRegistrationCode: string;
    googleMeetMeetingInviteRegistrationCode: string;
    enabelBroadbeanregistrationcode: string;
    IsenableIntegrationEOH: string;
    burstSMSRegistrationCode: string;
    indeedRagistrationCode: string;
  EOHRagistrationCode: string;
  VxtRegistrationCode: string;
    constructor(
        private translateService: TranslateService, private _snackBarService: SnackBarService,
        private _appSetting: AppSettingsService,
        public systemSettingService: SystemSettingService, private mailService: MailServiceService,
        private indexedDbService: IndexedDbService, private _profileInfoService: ProfileInfoService) {
        this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
        this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
        this.Broadbeanregistrationcode = this._appSetting.Broadbeanregistrationcode;
        this.zoomMeetingInviteRegistrationCode = this._appSetting.zoomMeetingInviteRegistrationCode;
        this.mSTeamMeetingInviteRegistrationCode = this._appSetting.mSTeamMeetingInviteRegistrationCode;
        this.daxtraRegistrationCode = this._appSetting.daxtraRegistrationCode;
        this.xeopleSMSRegistrationCode = this._appSetting.xeopleSMSRegistrationCode;
        this.xeopleCallRegistrationCode = this._appSetting.xeopleCallRegistrationCode;
        this.googleMeetMeetingInviteRegistrationCode = this._appSetting.googleMeetMeetingInviteRegistrationCode;
        this.enabelBroadbeanregistrationcode = this._appSetting.enabelBroadbeanregistrationcode;
        this.IsenableIntegrationEOH = this._appSetting.eohRegistrationCode;
        this.burstSMSRegistrationCode = this._appSetting.burstSMSRegistrationCode;
        this.indeedRagistrationCode = this._appSetting.indeedRagistrationCode;
      this.EOHRagistrationCode = this._appSetting.eohRegistrationCode;
        this.VxtRegistrationCode=this._appSetting.vxtRagistrationCode
    }
    ngOnInit(): void {
        this.getAllTimezone();
        this.getOtherIntegrationCheckstatus();
        this.checkEmailConnection();
        this.getAccountPreference();
    }
/*
   @Type: File, <ts>
   @Name: getOtherIntegrationZoomCheckstatus function
   @Who: Suika
   @When: 02-Aug-2023
   @Why: EWM-13542
   @What: For showing check status
  */
    getOtherIntegrationCheckstatus() {
        let postData = [
            { 'RegistrationCode': this.mSTeamMeetingInviteRegistrationCode, 'IsUser': 1 },
            { 'RegistrationCode': this.zoomMeetingInviteRegistrationCode, 'IsUser': 1 },
            { 'RegistrationCode': this.zoomPhoneCallRegistrationCode, 'IsUser': 1 },
            { 'RegistrationCode': this.Broadbeanregistrationcode, 'IsUser': 0 },
            { 'RegistrationCode': this.seekRegistrationCode, 'IsUser': 0 },
            { 'RegistrationCode': this.daxtraRegistrationCode, 'IsUser': 0 },
            { 'RegistrationCode': this.xeopleSMSRegistrationCode, 'IsUser': 0 },
            { 'RegistrationCode': this.xeopleCallRegistrationCode, 'IsUser': 0 },
            { 'RegistrationCode': this.googleMeetMeetingInviteRegistrationCode, 'IsUser': 0 },
            { 'RegistrationCode': this.enabelBroadbeanregistrationcode, 'IsUser': 0 },
            { 'RegistrationCode': this.enabelBroadbeanregistrationcode, 'IsUser': 0 },
            { 'RegistrationCode': this.IsenableIntegrationEOH, 'IsUser': 0 },
            { 'RegistrationCode': this.burstSMSRegistrationCode, 'IsUser': 0 },
          { 'RegistrationCode': this.indeedRagistrationCode, 'IsUser': 0 },
          { 'RegistrationCode': this.VxtRegistrationCode, 'IsUser': 1 },

        ];
        this.systemSettingService.getJobBoardsIntegrationCheckstatus(postData).subscribe(
            (repsonsedata: any) => {
                if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                    if (repsonsedata.Data) {
                        localStorage.setItem('otherIntegrations', JSON.stringify(repsonsedata.Data));
                        this.getEOHCANDExtSubsDetails();
                    }
                }
            })
    }
/*
@Type: File, <ts>
@Name: checkEmailConnection function
 @Who: Renu
 @When:19-Oct-2021
 @Why: EWM-1733 EWM-3126
@What: check email connection is established or not
*/
    checkEmailConnection() {
        this.mailService.getUserIsEmailConnected().subscribe(
            (data: any) => {
                if (data.HttpStatusCode === 200) {
                    if (data.Data.IsEmailConnected == 1) {
                        localStorage.setItem('emailConnection', '1');
                    } else {
                        localStorage.setItem('emailConnection', '0');
                    }
                } else {
                    this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                }
            }, err => {
                this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
    }
    getAccountPreference() {
        this._profileInfoService.getPreference().subscribe((repsonsedata: any) => {
            if (repsonsedata['HttpStatusCode'] == '200') {
                localStorage.setItem('animation', repsonsedata?.Data?.IsAnimation);
                localStorage.setItem('XeepAnimation', repsonsedata?.Data?.IsXeepAnimation);
                localStorage.setItem('UserTimezone', repsonsedata?.Data?.UserTimezone);
            }
        })
    }
    /*
       @Type: File, <ts>
       @Name: getAllTimezone function
       @Who: Adarsh singh
       @When: 22-Nov-2023
       @Why: EWM-15147
       @What: For store user time zone
    */
    getAllTimezone(): void {
        this._profileInfoService.getTimezone().subscribe((repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
                if (repsonsedata.Data) {
                    localStorage.setItem('TimeZoneList', JSON.stringify(repsonsedata['Data']))
                    const dataToSave = repsonsedata.Data;
                    this.indexedDbService.saveData(dataToSave);
                }
            }
        })
    }
    // who:Adarsh singh ,why:ewm-15858 what: getEOHCANDExtSubsDetails ,when:31/01/2024
    getEOHCANDExtSubsDetails() {
        let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
        let EOHIntegrationObj = otherIntegrations?.filter((res:any)=>res.RegistrationCode==this.EOHRagistrationCode);
        let EOHFeatures =  EOHIntegrationObj[0]?.Features;
        this.setEohIntegrationObj(EOHFeatures?.IsSearchExtractEnable, EOHFeatures?.IsPushJobEnable, EOHFeatures?.IsPushCandidateEnable,
            EOHFeatures?.IsShareContactNotificationEnable, EOHFeatures?.IsShareJobNotificationEnable,EOHFeatures?.IsShareClientNotificationEnable
        )
    }
    // who:Adarsh singh ,why:ewm-15858 what: setEohIntegrationObj ,when:31/01/2024
    setEohIntegrationObj(searchExtractEnable: number = 0, pushJobEnable: number = 0, candExtractEnable: number = 0,contactExtractEnable:number=0,
        jobExtractEnable:number=0,clientExtractEnable:number=0
    ) {
        let objc: { searchExtractEnable: number, pushJobEnable: number, candExtractEnable: number,contactExtractEnable:number,
            jobExtractEnable:number,clientExtractEnable:number } = {
            searchExtractEnable: searchExtractEnable ? 1 : 0,
            pushJobEnable: pushJobEnable ? 1 : 0,
            candExtractEnable: candExtractEnable ? 1 : 0,
            clientExtractEnable: clientExtractEnable?1:0,
            jobExtractEnable:jobExtractEnable?1:0,
            contactExtractEnable:contactExtractEnable?1:0
        }
        localStorage.setItem('EOHIntegration', JSON.stringify(objc))
    }
}
