/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 18-Nov-2020
  @Why: ROST-369 ROST-412
  @What:  This page will be use for the account prefrences Component ts file
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';
import { Router } from '@angular/router';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';

@Component({
  selector: 'app-account-prefrences',
  templateUrl: './account-prefrences.component.html',
  styleUrls: ['./account-prefrences.component.scss']
})
export class AccountPrefrencesComponent implements OnInit {
  /*
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-413
  @What: Decalaration of Global Variables
*/
  userGeneralSettingList = [];
  preferenceFrom: FormGroup;
  submitted = false;
  status: boolean = false;
  loading: boolean;
  result: string = '';
  public value = ``;
  public gridLanguage: any[];
  public gridTimeZone1: any[];
  public gridTimeZone: any[];
  public gridInternationalization: any[];
  distinctRegion = [];
  timezoneDetails = [];
  LanguageName: String;
  RegionName: string;
  TimeZoneName: string;
  userPreferanceLanguage: string;
  userPreferanceTempLanguage: string;
  selected = [];
  public maxCharacterLengthSubHead = 115;
  public setAnimations: any = 0;
  public setXeepAnimation: any=0;
  
  constructor(private translateService: TranslateService, private fb: FormBuilder, private _profileInfoService: ProfileInfoService,
    private route: Router, private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private _userpreferencesService: UserpreferencesService) {
    this.preferenceFrom = this.fb.group({
      UserLanguage: ['', Validators.required],
      RegionId: ['', Validators.required],
      UserTimezone: ['', Validators.required],
       animation: [false],
       XeepAnimation:[false]
    }),
      this.userPreferanceLanguage = localStorage.getItem('Language');
    this.userPreferanceTempLanguage = localStorage.getItem('Language');
  }
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    //this.getAccountPreference();
    this.getAllLanguage();
    this.getAllRegion();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
   // this.preferenceFrom.controls["UserLanguage"].disable();
  }
  /*
    @Type: File, <ts>
    @Name: ngOnDestroy function
    @Who: Nitin Bhati
    @When: 21-Dec-2020
    @Why: ROST-413
    @What: call Get method for destroy ..
  */
  ngOnDestroy() {
    let userPrefLang = this.userPreferanceLanguage;
    let defaultLang;
    if (userPrefLang == null || userPrefLang == '') {
      defaultLang = localStorage.getItem('Language');
    } else {
      defaultLang = this.userPreferanceLanguage;
    }
    this.commonserviceService.onUserLanguage.next(localStorage.setItem('Language', defaultLang));
  }
  /*
   @Type: File, <ts>
   @Name: click function
   @Who: Satya Prakash
   @When: 18-Nov-2020
   @Why: ROST-368 ROST-401
   @What: click function for left sidebar
 */
  clickEvent() {
    this.status = !this.status;
  }
  /*
    @Type: File, <ts>
    @Name: getAllLanguage function
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: call Get method from services for showing data into grid.
    @What: .
  */
  getAllLanguage() {
    this.loading = true;
    this._profileInfoService.getLanguage().subscribe(
      repsonsedata => {
        this.gridLanguage = repsonsedata['Data'];
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: getAllRegion function
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: call Get method from services for showing data into grid..
  */
  getAllRegion() {
    this.loading = true;
    this._profileInfoService.getTimezone().subscribe(
      repsonsedata => {
        this.gridTimeZone = repsonsedata['Data'];
        if (this.gridTimeZone.length > 0) {
          this.loading = false;
          this.getDataPreference();
          this.distinctRegion = this.gridTimeZone.filter(
            (thing, i, arr) => arr.findIndex(t => t.Region === thing.Region) === i
          );
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: getAllTimeZone function
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: call Get method from services for showing data into grid..
  */
  getAllTimeZone(region, status) {
    if (status == "onchange" && this.gridTimeZone.length > 0) {
      this.timezoneDetails = this.gridTimeZone.filter(x => x['Region'] === region);
      this.preferenceFrom.patchValue({
        'UserTimezone': ''
      })
    } else {
      if (this.gridTimeZone) {
        let regionId;
        regionId = this.gridTimeZone.filter(x => x['Id'] == region);
        if (regionId != '') {
          this.timezoneDetails = this.gridTimeZone.filter(y => y['Region'] === regionId[0]['Region']);
          this.preferenceFrom.patchValue({
            'UserTimezone': region,
            'RegionId': regionId[0].Region
          })
        }
      }
    }
  }
  /*
    @Type: File, <ts>
    @Name: getDataPreference function
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: call Get method for calling account preference data.
  */
  getDataPreference() {
    if (this.gridTimeZone) {
      this.getAccountPreference();
    }
  }
  /*
  @Type: File, <ts>
  @Name: updateSetting
  @Who: Nitin Bhati
  @When: 24-Nov-2020/23-June-2021
  @Why: ROST-307/EWM-1877
  @What: For update all user Language and Timezone Setting Information
  */
  updateSetting(value) {
    this.loading = true;
    this.submitted = true;
    let updateObj={};
    updateObj['UserLanguage']=value.UserLanguage;
    updateObj['RegionId']=value.RegionId;
    updateObj['UserTimezone']=value.UserTimezone;
    updateObj['IsXeepAnimation']=value.XeepAnimation?1:0;
    if(value.animation===true){
      updateObj['IsAnimation']=1;
    }else{
      updateObj['IsAnimation']=0;
    }
    
    if (this.preferenceFrom.invalid) {
      return;
    } else {
      this._profileInfoService.updatePreference(updateObj).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            localStorage.setItem('TimeZone', repsonsedata.Data['TimeZoneOffset']);
            this._userpreferencesService.changeTimeZoneFormat(repsonsedata.Data['TimeZoneOffset']);
            this.userPreferanceTempLanguage = repsonsedata.Data['UserLanguage'];
            this.lang = String(repsonsedata.Data['UserLanguage']);
            this.commonserviceService.onUserLanguage.next(localStorage.setItem('Language', this.userPreferanceTempLanguage));
            this.getAccountPreference();

            /////text change for client and Employee in header and side menu By Anup Singh////
          
            ////////////
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
  /*
    @Type: File, <ts>
    @Name: getAccountPreference function
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: call Get method from services for showing data into grid.
    @What: .
  */
  getAccountPreference() {
    this.loading = true;
    this._profileInfoService.getPreference().subscribe(
      (repsonsedata:any)=> {
        this.loading = false;
        
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.userPreferanceLanguage = repsonsedata['Data']['UserLanguage'];
          this.commonserviceService.onUserLanguage.next(localStorage.setItem('Language', this.userPreferanceTempLanguage));
          this.LanguageName = repsonsedata['Data']['UserLanguage'];
          this.RegionName = repsonsedata['Data']['UserTimezone'];
          this.TimeZoneName = repsonsedata['Data']['UserTimezone'];
          localStorage.setItem('UserTimezone', this.TimeZoneName);
          
          this.preferenceFrom.patchValue({
            'UserLanguage': repsonsedata['Data']['UserLanguage'],

          })
          this.getAllTimeZone(repsonsedata['Data']['UserTimezone'], "onload");
          if(repsonsedata.Data.IsXeepAnimation === 1){
            this.preferenceFrom.patchValue({
              'XeepAnimation':true
            })
          }else{
            this.preferenceFrom.patchValue({
              'XeepAnimation':false
            })
          }
         
          if(repsonsedata.Data.IsAnimation === 1){
            this.preferenceFrom.patchValue({
              'animation':true
            })
          }
          else{
            this.preferenceFrom.patchValue({
              'animation':false
            })
          }
          this.setAnimations=repsonsedata.Data.IsAnimation;
          this.setXeepAnimation=repsonsedata.Data.IsXeepAnimation;
          localStorage.setItem('animation', this.setAnimations);
          localStorage.setItem('XeepAnimation', this.setXeepAnimation);
         
        }
      }, err => {

        // if(err.StatusCode==undefined)
        // {
        //   this.loading=false;
        // }
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
  @Type: File, <ts>
  @Name: useLanguage function
  @Who: Nitin Bhati
  @When: 21-Dec-2020/23-June-2021
  @Why: this function used for change language of application.
  @What: .
*/
  lang: string;
  public useLanguage(langChangeTemp): void {
    this.userPreferanceTempLanguage = langChangeTemp;
    this.lang = String(langChangeTemp);
    this.commonserviceService.onUserLanguage.next(localStorage.setItem('Language', this.userPreferanceTempLanguage));
  }

  /*
     @Type: File, <ts>
     @Name: reloadApiBasedOnorg function
     @Who: Renu
     @When: 13-Apr-2021
     @Why: EWM-1356
     @What: Reload Api's when user change organization
   */

  reloadApiBasedOnorg() {
    this.getAllLanguage();
    this.getAllRegion();
  }
  
}




