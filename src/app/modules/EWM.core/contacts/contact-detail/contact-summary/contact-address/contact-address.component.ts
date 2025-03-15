import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { AddressData } from 'src/app/shared/models/contact';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.scss']
})
export class ContactAddressComponent implements OnInit {
  public contactId: string;
  public methodType: string;
  public oldPatchValues: AddressData;
  public IsDisabled: boolean=false;
  addressData:AddressData;
  
  constructor(public dialogRef: MatDialogRef<ContactAddressComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private snackBService: SnackBarService,
    private translateService: TranslateService,private routes: ActivatedRoute,
    public systemSettingService: SystemSettingService,
    private clientService: ClientService,private appSettingsService: AppSettingsService) {

     if(data.methodType){
      this.methodType=data.methodType;}
      this.oldPatchValues=data?.AutoFilldata;
      this.addressData=data?.AutoFilldata;
      this.contactId=data?.contactId
     }

  ngOnInit(): void {
   
   
  }
 
    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: onDismiss function  

  onDismiss(): void {
    document.getElementsByClassName("add_canAddress")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_canAddress")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  value: AddressData;
  googleMapAddress(addData: AddressData) {
    if (addData == null || addData == undefined) {
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
    @Who: Bantee
    @When: 12-sept-2023
    @Why: EWM-13723
    @What: Function will to save data according to methodtype 
  */
  onSubmit(){
    if(this.methodType=='Add'){
        this.createContactAddress();
    }else if(this.methodType=='Edit'){
      this.updateContactAddress();
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
/*
    @Name: updateContactAddress
   @Who: Bantee
    @When: 12-sept-2023
    @Why: EWM-13723
    @What: Function will update record
  */
  updateContactAddress(){
  
  let address = {};
 
    address['ContactId'] = Number(this.contactId);
    address['AddressLine1'] = this.value?.AddressLine1,
    address['AddressLine2'] = this.value?.AddressLine2,
    address['AddressLinkToMap'] = this.value?.AddressLinkToMap,
    address['CountryId'] = this.value?.CountryId,
    address['CountryName'] = this.value?.CountryName,
    address['District_Suburb'] = this.value?.District_Suburb,
    address['Latitude'] = this.value.Latitude?this.value.Latitude?.toString():'',
    address['Longitude'] = this.value.Longitude?this.value.Longitude?.toString():'',
    address['StateId'] = this.value.StateId ? this.value.StateId : 0,
    address['StateName'] = this.value?.StateName;
    address['PostalCode'] = this.value?.PostalCode,
    address['TownCity'] = this.value?.TownCity,
    address['LocationId'] = this.addressData?.LocationId,


    this.clientService.updateContactAddress(address).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          document.getElementsByClassName("add_canAddress")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_canAddress")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Name: updateContactAddress
   @Who: Bantee
    @When: 12-sept-2023
    @Why: EWM-13723
    @What: Function will save record
  */
 createContactAddress(){
    let locationArr={};

    locationArr['ContactId'] = Number(this.contactId);
    locationArr['AddressLine1'] = this.value?.AddressLine1,
    locationArr['AddressLine2'] = this.value?.AddressLine2,
    locationArr['AddressLinkToMap'] = this.value?.AddressLinkToMap,
    locationArr['CountryId'] = this.value?.CountryId,
    locationArr['CountryName'] = this.value?.CountryName,
    locationArr['District_Suburb'] = this.value.District_Suburb,
    locationArr['Latitude'] = this.value.Latitude?.toString(),
    locationArr['Longitude'] = this.value.Longitude?.toString(),
    locationArr['StateId'] = this.value.StateId ? this.value.StateId : 0,
    locationArr['StateName'] = this.value.StateName;
    locationArr['PostalCode'] = this.value.PostalCode,
    locationArr['TownCity'] = this.value.TownCity,

    this.clientService.createContactAddress(locationArr).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          document.getElementsByClassName("add_canAddress")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_canAddress")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
   
  }
}
