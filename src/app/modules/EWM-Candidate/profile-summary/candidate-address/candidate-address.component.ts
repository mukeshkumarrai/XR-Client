/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: this section handle adding candidate location
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { QuickpeopleService } from '../../../EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from '../../../EWM.core/shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-candidate-address',
  templateUrl: './candidate-address.component.html',
  styleUrls: ['./candidate-address.component.scss']
})
export class CandidateAddressComponent implements OnInit {

  /*******************common variables decalaration here ************************/
  
  public candidateId: any;
  public methodType: any;
  public oldPatchValues: any;
  public IsDisabled: boolean=false;

  addressData:any;
  
  constructor(public dialogRef: MatDialogRef<CandidateAddressComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private snackBService: SnackBarService,
    private translateService: TranslateService,private routes: ActivatedRoute,
    public systemSettingService: SystemSettingService,
    public candidateService: CandidateService, private appSettingsService: AppSettingsService) {
      // @Who: Bantee Kumar,@Why:EWM-10893,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.

     if(data.methodType){
      this.methodType=data.methodType;}
      this.oldPatchValues=data.AutoFilldata;
      this.addressData=data.AutoFilldata;
      this.candidateId=data.candidateId;
     }

  ngOnInit(): void {
    //@who:priti @why:EWM-2973 @what:condition added because 'candidate id' is coming as input @when:29-sep-2021
   if( this.candidateId==undefined){
       this.routes.queryParams.subscribe((value) => {
      this.candidateId = value.CandidateId;
    });
   }
   
  }
 
  onDismiss(): void {
    document.getElementsByClassName("add_canAddress")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_canAddress")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
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
    @When: 16-Aug-2021
    @Why: EWM-2531
    @What: Function will to save data according to methodtype 
  */
  onSubmit(){
    if(this.methodType=='Add'){
        this.createCandidateAddress(this.value);
    }else if(this.methodType=='Edit'){
      this.updateCandidateAddress(this.value)
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
/*
    @Name: updateCandidateAddress
    @Who: Renu
    @When: 16-Aug-2021
    @Why: EWM-2531
    @What: Function will update record
  */
  updateCandidateAddress(value){
    let candidateId;
    if (this.candidateId != undefined) {
      candidateId = this.candidateId;
    } else {
      candidateId = '0';
    }
    let addObj = [];
    let fromObj = {};
    let toObj = {};
    
    fromObj = this.oldPatchValues;
      // @Who: Bantee Kumar,@Why:EWM-13303,@When: 19-July-2023,@What: The save button is not working when the user removes the latitude and longitude on the edit address details popup page.

    toObj=value;
    toObj['CandidateId'] = candidateId;
    toObj['Id'] = this.addressData?.Id;
    toObj['AddressLine1'] = this.value?.AddressLine1,
    toObj['AddressLine2'] = this.value?.AddressLine2,
    toObj['AddressLinkToMap'] = this.value?.AddressLinkToMap,
    toObj['CountryId'] = this.value?.CountryId,
    toObj['CountryName'] = this.value?.CountryName,
    toObj['District_Suburb'] = this.value?.District_Suburb,
    toObj['Latitude'] = this.value.Latitude?this.value.Latitude?.toString():'',
    toObj['Longitude'] = this.value.Longitude?this.value.Longitude?.toString():'',
    toObj['StateId'] = this.value.StateId ? parseInt(this.value.StateId) : 0,
    toObj['StateName'] = this.value?.StateName;
    toObj['PostalCode'] = this.value?.PostalCode,
    toObj['TownCity'] = this.value?.TownCity,
    toObj['TypeId'] = 0,
    toObj['Type'] = ""
    toObj['Name'] = "",
 
    addObj = [{
    "From":fromObj,
    "To":toObj
    }];

    this.candidateService.updateCandidateAddress(addObj[0]).subscribe(
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
    @Name: updateCandidateAddress
    @Who: Renu
    @When: 16-Aug-2021
    @Why: EWM-2531
    @What: Function will save record
  */
  createCandidateAddress(value){
    let locationArr={};

    locationArr['CandidateId'] = this.candidateId;
    locationArr['AddressLine1'] = this.value?.AddressLine1,
    locationArr['AddressLine2'] = this.value?.AddressLine2,
    locationArr['AddressLinkToMap'] = this.value?.AddressLinkToMap,
    locationArr['CountryId'] = this.value?.CountryId,
    locationArr['CountryName'] = this.value?.CountryName,
    locationArr['District_Suburb'] = this.value.District_Suburb,
    locationArr['Latitude'] = this.value.Latitude?.toString(),
    locationArr['Longitude'] = this.value.Longitude?.toString(),
    locationArr['StateId'] = this.value.StateId ? parseInt(this.value.StateId) : 0,
    locationArr['StateName'] = this.value.StateName;
    locationArr['PostalCode'] = this.value.PostalCode,
    locationArr['TownCity'] = this.value.TownCity,
    locationArr['TypeId'] = 0,
    locationArr['Type'] = "null",
    locationArr['Name'] = "null",
  
    this.candidateService.createCandidateAddress(locationArr).subscribe(
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
