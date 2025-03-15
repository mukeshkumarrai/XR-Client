/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 18-Nov-2020
  @Why: ROST-352 ROST-406
  @What:  This page will be use for the internationalization.component ts file
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-internationalization',
  templateUrl: './internationalization.component.html',
  styleUrls: ['./internationalization.component.scss']
})
export class InternationalizationComponent implements OnInit {
  /*
   @Type: File, <ts>
   @Who: Nitin Bhati
   @When: 23-Nov-2020
   @Why: ROST-309
   @What: Decalaration of Global Variables
 */
   defaultCurrencyString="label_defaultCurrency";
   defaultCountryString="label_defaultCountry";
  userGeneralSettingList = [];
  internatFrom: FormGroup;
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
  CountryList=[];
  CurrencyList=[];
  public maxCharacterLengthSubHead = 115;
  moreCountry: any;
  selectedValue: any;
  selectedCurrencyValue:number;
  countryList:any = [];
  constructor(private translateService: TranslateService, private fb: FormBuilder, private _systemSettingService: SystemSettingService,
    private route: Router, private snackBService: SnackBarService, private commonserviceService: CommonserviceService, public _sidebarService: SidebarService) {
    this.internatFrom = this.fb.group({
      LanguageCode: ['', Validators.required],
      RegionId: ['', Validators.required],
      TimeZoneId: ['', Validators.required],
      CountryId: ['', Validators.required],
      CurrencyId: ['', Validators.required],
    })
   }
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    //this.getInternationalization();
    this.getAllLanguage();
    this.getAllRegion();
    this.getAllCurrency();
    this._sidebarService.subManuGroup.next('system-settings');
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
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
    this._systemSettingService.getLanguageInternalization().subscribe(
      repsonsedata => {
        this.gridLanguage = repsonsedata['Data'];
        this.loading = false;
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
  /*
     @Type: File, <ts>
     @Name: getAllRegion function
     @Who: Nitin Bhati
     @When: 24-Nov-2020
     @Why: call Get method from services for showing data into grid.
     @What: .
  */
  getAllRegion() {
    this.loading = true;
    this._systemSettingService.getTimezoneInternalization().subscribe(
      repsonsedata => {
        this.loading = false;
        this.gridTimeZone = repsonsedata['Data'];
        this.loading = false;
        this.getDataInitialazation();
        this.distinctRegion = this.gridTimeZone.filter(
          (thing, i, arr) => arr.findIndex(t => t.Region === thing.Region) === i
        );
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
    @Why: call Get method from services for showing data into grid.
    @What: .
 */
  getAllTimeZone(region, status) {
    if (status == "onchange") {
      //this.timezoneDetails = this.gridTimeZone.filter(x => x['Region'] === region.source.triggerValue);
      this.timezoneDetails = this.gridTimeZone.filter(x => x['Region'] === region);
      this.internatFrom.patchValue({
        'TimeZoneId':''
       })  
    } else {
      let regionId;
      regionId = this.gridTimeZone.filter(x => x['Id'] == region);
     if (regionId != '') {
      this.timezoneDetails = this.gridTimeZone.filter(y => y['Region'] === regionId[0]['Region']);
      this.internatFrom.patchValue({
        'TimeZoneId': region,
        'RegionId': regionId[0].Region
      })
    }
   }
  }
  getDataInitialazation() {
    if (this.gridTimeZone) {
      this.getInternationalization();
    }
  }
  /*
    @Type: File, <ts>
    @Name: updateInternatinalizationSetting
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: For update all user Language and Timezone Setting Information
  */
  updateSetting(value) {
   // console.log(JSON.stringify(value));
    this.loading = true;
    this.submitted = true;
    if (this.internatFrom.invalid) {
      return;
    } else {
      this._systemSettingService.updateInternalization(JSON.stringify(value)).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.getInternationalization();
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        })
    }
  }
  /*
      @Type: File, <ts>
      @Name: getInternationalization function
      @Who: Nitin Bhati
      @When: 24-Nov-2020
      @Why: call Get method from services for showing data into grid.
      @What: .
*/
getInternationalization() {
    this.loading = true;
    this._systemSettingService.getInternalization().subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') { //CurrencyId
          this.LanguageName = repsonsedata['Data']['LanguageCode'];
          this.RegionName = repsonsedata['Data']['TimeZoneId'];
          this.TimeZoneName = repsonsedata['Data']['TimeZoneId'];         
          this.selectedValue={'Id':Number(repsonsedata['Data']['CountryId'])};        
          this.selectedCurrencyValue = Number(repsonsedata['Data']['CurrencyId']);         
          this.ddlchange(this.selectedValue);   
          this.ddlCurrencychange(this.selectedCurrencyValue);      
          this.getAllTimeZone(repsonsedata['Data']['TimeZoneId'], "onload");
          if(repsonsedata['Data']['LanguageCode']===null){
            this.internatFrom.patchValue({
            'LanguageCode': "",           
          })}else{
            this.internatFrom.patchValue({
              'LanguageCode': repsonsedata['Data']['LanguageCode']
            })
          }

          if(repsonsedata['Data']['CurrencyId']===null){ 
            this.internatFrom.patchValue({          
            'CurrencyId': 0  
          })}else{
            this.internatFrom.patchValue({
            'CurrencyId': repsonsedata['Data']['CurrencyId']
            })
          }

          if(repsonsedata['Data']['CountryId']===null){ 
            this.internatFrom.patchValue({          
            'CountryId': 0  
          })}else{
            this.internatFrom.patchValue({
            'CountryId': repsonsedata['Data']['CountryId']
            })
          }
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

    /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

    reloadApiBasedOnorg(){
      this.getAllLanguage();
      this.getAllRegion();
      }

 /*
  
    @Who: Suika
    @When: 16-june-2021
    @Why: EWM-1876
    @What: get selected data
  */
 ddlchange(data)
 {  
   if(data==null || data=="")
   {
     this.internatFrom.get("CountryId").setErrors({ required: true });
     this.internatFrom.get("CountryId").markAsTouched();
     this.internatFrom.get("CountryId").markAsDirty();
   }
   else
   {
     this.internatFrom.get("CountryId").clearValidators();
     this.internatFrom.get("CountryId").markAsPristine();
     this.selectedValue=data;
     this.internatFrom.patchValue(
       {
        CountryId:data.Id
       }
     )
   }
 }


 /*
  
    @Who: Suika
    @When: 16-june-2021
    @Why: EWM-1876
    @What: get selected data
  */
 ddlCurrencychange(data)
 {  
   if(data==null || data=="")
   {
     this.internatFrom.get("CurrencyId").setErrors({ required: true });
     this.internatFrom.get("CurrencyId").markAsTouched();
     this.internatFrom.get("CurrencyId").markAsDirty();
   }
   else
   {
     this.internatFrom.get("CurrencyId").clearValidators();
     this.internatFrom.get("CurrencyId").markAsPristine();
     this.selectedCurrencyValue=data;
     this.internatFrom.patchValue(
       {
        CurrencyId:data
       }
     )
   }
 }


 
  /*
      @Type: File, <ts>
      @Name: getCurrency function
      @Who: Suika
      @When: 16-06-2021
      @Why: call Get method from services for showing data into grid.
      @What: .
    */
   getAllCurrency() {
    this._systemSettingService.getCurrency().subscribe(
      (data: any) => {
        this.CurrencyList = data.Data;
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
}
