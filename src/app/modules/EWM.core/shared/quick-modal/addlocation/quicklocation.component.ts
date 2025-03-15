/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 23-june-2021
  @Why: EWM-1748
  @What: this section handle all quick people location
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { QuickpeopleService } from '../../services/quick-people/quickpeople.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Subject } from 'rxjs';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { ActivatedRoute } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-quicklocation',
  templateUrl: './quicklocation.component.html',
  styleUrls: ['./quicklocation.component.scss']
})
export class QuicklocationComponent implements OnInit {

  public addressAutoFillData: any = [];
  public mode: any;
  public IsDisabled: boolean;
  public formTitle: any;
  public addressData: any;
  public candidateId: any;
  public methodType: any;

  constructor(public dialogRef: MatDialogRef<QuicklocationComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private snackBService: SnackBarService,
    private textChangeLngService: TextChangeLngService, private routes: ActivatedRoute,
    private translateService: TranslateService, private quickpeopleService: QuickpeopleService,
    private commonserviceService: CommonserviceService, public systemSettingService: SystemSettingService, private appSettingsService: AppSettingsService) {
    this.addressData = data.address;
    this.methodType=data.mode;
  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((value) => {
      this.candidateId = value.CandidateId;
    });

  }



  /*
  @Name: onDismiss
  @Who: Renu
  @When: 23-June-2021
  @Why: EWM-1748
  @What: Function will call when user click on cancel button.
*/

  onDismiss(): void {
    document.getElementsByClassName("add_location")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_location")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: this.addressData }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }



  value: any;
  googleMapAddress(addData: any) {
    if (addData == null || addData == undefined || addData == "") {
    } else {
      this.value = addData;
    }
  }

  validAddressForm: boolean
  AddressFormValid(validData) {
    this.validAddressForm = validData;
  }

  /*
     @Name: onSubmit
     @Who: Renu
     @When: 23-June-2021
     @Why: EWM-1748
     @What: Function will to save data 
   */
  onSubmit() {
    let locationArr = {};
      locationArr['AddressLine1'] = this.value.AddressLine1,
      locationArr['AddressLine2'] = this.value.AddressLine2;
      if(this.value.AddressLinkToMap!=undefined && this.value.AddressLinkToMap!=null && this.value.AddressLinkToMap!=''){
        locationArr['AddressLinkToMap'] = this.value.AddressLinkToMap;
      }else{
        let addresswithoutApi:any = ""
        addresswithoutApi = this.value.AddressLine1 + ", " +this.value.PostalCode + ", " + this.value?.CountryName;
        locationArr['AddressLinkToMap'] = addresswithoutApi
      }
     
      locationArr['CountryId'] = this.value.CountryId,
      locationArr['CountryName'] = this.value.CountryName,
      locationArr['District_Suburb'] = this.value.District_Suburb,
      locationArr['Latitude'] = this.value.Latitude.toString(),
      locationArr['Longitude'] = this.value.Longitude.toString(),
      locationArr['StateId'] = this.value.StateId ? parseInt(this.value.StateId) : 0,
      locationArr['StateName'] = this.value.StateName;
      locationArr['PostalCode'] = this.value.PostalCode,
      locationArr['TownCity'] = this.value.TownCity,
      locationArr['TypeId'] = 0,
      locationArr['Name'] = "",
      
    document.getElementsByClassName("add_location")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_location")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: locationArr }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }






}
