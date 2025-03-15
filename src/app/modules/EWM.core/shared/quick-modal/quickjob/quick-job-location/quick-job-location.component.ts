/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When:09-March-2023
  @Why: EWM-11009
  @What: this section handle adding client location
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from '../../../services/system-setting/system-setting.service';

@Component({
  selector: 'app-quick-job-location',
  templateUrl: './quick-job-location.component.html',
  styleUrls: ['./quick-job-location.component.scss']
})
export class QuickJobLocationComponent implements OnInit {
  /*******************common variables decalaration here ************************/
  public methodType: string;//='Edit';
  public IsDisabled: boolean=false;
  addressData:any;
  value: any;
  validAddressForm: boolean;
  constructor(public dialogRef: MatDialogRef<QuickJobLocationComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,public systemSettingService: SystemSettingService,
    public candidateService: CandidateService, private appSettingsService: AppSettingsService) {
      this.addressData=data.AutoFilldata;
      this.methodType=data.methodType;
      }
  ngOnInit(): void {   
  }
   /*
    @Name: onDismiss
    @Who: Nitin Bhati
    @When:09-March-2023
    @Why: EWM-11009
    @What: For dismiss popup
  */
  onDismiss(): void {
    document.getElementsByClassName("add_canAddress")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_canAddress")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: this.addressData,'response':false }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /*
    @Name: googleMapAddress
    @Who: Nitin Bhati
    @When:09-March-2023
    @Why: EWM-11009
    @What: For mapping address to google map
  */
  googleMapAddress(addData: any) {
    if (addData == null || addData == undefined || addData == "") {
    } else {
      this.value = addData;
    }
  }
  /*
    @Name: AddressFormValid
    @Who: Nitin Bhati
    @When:09-March-2023
    @Why: EWM-11009
    @What: For address validation
  */
  AddressFormValid(validData) {
    this.validAddressForm = validData;
  } 
 /*
    @Name: onSubmit
    @Who: Nitin Bhati
    @When:09-March-2023
    @Why: EWM-11009
    @What: Function will to save data according to methodtype 
  */
  onSubmit(){
    this.updateAddress(this.value);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /*
    @Name: updateAddress
    @Who: Nitin Bhati
    @When:09-March-2023
    @Why: EWM-11009
    @What: Function will update records
  */
  updateAddress(value){
    let toObj = {};
     toObj=value;
     toObj['AddressLine1'] = this.value.AddressLine1,
    toObj['AddressLine2'] = this.value.AddressLine2;
            /*--@Who:bantee,@When:16/08/2023, EWM-13525 @What: common location changes--*/

    if(this.value.AddressLinkToMap!=undefined && this.value.AddressLinkToMap!=null && this.value.AddressLinkToMap!=''){
      toObj['AddressLinkToMap'] = this.value.AddressLinkToMap;
    }else{
      let addresswithoutApi:string = ""
      addresswithoutApi = this.value.AddressLine1 + ", " +this.value.PostalCode + ", " + this.value?.CountryName;
      toObj['AddressLinkToMap'] = addresswithoutApi
    }
    // toObj['AddressLinkToMap'] = this.value.AddressLinkToMap,
    toObj['CountryId'] = this.value.CountryId,
    toObj['CountryName'] = this.value.CountryName,
    toObj['District_Suburb'] = this.value.District_Suburb,
    toObj['Latitude'] = this.value.Latitude.toString(),
    toObj['Longitude'] = this.value.Longitude.toString(),
    toObj['StateId'] = this.value.StateId ? parseInt(this.value.StateId) : 0,
    toObj['StateName'] = this.value.StateName;
    toObj['PostalCode'] = this.value.PostalCode,
    toObj['TownCity'] = this.value.TownCity,
    toObj['TypeId'] = 0,
    toObj['Type'] = ""
    toObj['Name'] = "",
     document.getElementsByClassName("add_canAddress")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_canAddress")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close({ data: toObj ,'response':true}); }, 200);
     }
}
