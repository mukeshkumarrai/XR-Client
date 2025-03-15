/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 11-Aug-2021
  @Why: EWM-2424
  @What: this section handle all candidate location
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Subject } from 'rxjs';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { GeneralInforLocationMaster } from 'src/app/modules/EWM.core/shared/datamodels/candidate-generalinformation';

@Component({
  selector: 'app-candidate-location',
  templateUrl: './candidate-location.component.html',
  styleUrls: ['./candidate-location.component.scss']
})
export class CandidateLocationComponent implements OnInit {

  /*******************common variables decalaration here ************************/
  public locationList:any=[];
  public selectedValue:any={};
  public StateList: any=[];
  addressForm:FormGroup;
  public addressBarData:Address;
  countryISO: string;
  eventsSubject: Subject<any> = new Subject<any>();
  employee:any;
  public candidateId;
  addForm: FormGroup;
  isGeneralInfo:boolean=false;
  constructor(public dialogRef: MatDialogRef<CandidateLocationComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private snackBService: SnackBarService,
    private textChangeLngService:TextChangeLngService, 
    private translateService: TranslateService,
    public _GeneralInformationService: GeneralInformationService) {
      this.candidateId=data.address;
      if(data?.isGeneralInfo!=undefined){
        this.isGeneralInfo = data?.isGeneralInfo;
      }
      this.addForm=this.fb.group({
        'Name':[''],
        'TypeId':[''],
        'AddressLinkToMap':[''],
        'AddressLine1':[''],
        'AddressLine2':[''],
        'District_Suburb':[''],
        'TownCity':[''],
        'StateId':[''],
        'PostalCode':[''],
        'CountryId':[''],
        'Longitude':[''],
        'Latitude':[''],
      })
    }

  ngOnInit(): void {
     //this.candidateId='2315662f-a310-4d45-9b16-2d67e5e2ed76';
        this.getGeneralInformation(this.candidateId);
  }

/* 
 @Type: File, <ts>
 @Name: getGeneralInformation function
 @Who: Nitin Bhati
 @When: 11-Aug-2021
 @Why: EWM-2424
 @What: For setting value in the edit form
*/
getGeneralInformation(Id: Number) {
  this._GeneralInformationService.getGeneralInformationList('?candidateid=' + Id).subscribe(
    (data: GeneralInforLocationMaster) => {
      if (data.HttpStatusCode == 200) {
        this.addForm.patchValue({
          Name: data['Data'].LocationName,
          TypeId: data['Data'].LocationType,
          AddressLinkToMap: data['Data'].AddressLinkToMap,
          AddressLine1: data['Data'].Address1,
          AddressLine2: data['Data'].Address2,
          District_Suburb: data['Data'].District,
          TownCity: data['Data'].City,
          StateId: data['Data'].StateName,
          PostalCode: data['Data'].PostalCode,
          CountryId: data['Data'].CountryName,
        });
        this.addForm.controls["Name"].disable();
        this.addForm.controls["TypeId"].disable();
        this.addForm.controls["AddressLinkToMap"].disable();
        this.addForm.controls["AddressLine1"].disable();
        this.addForm.controls["AddressLine2"].disable();
        this.addForm.controls["District_Suburb"].disable();
        this.addForm.controls["TownCity"].disable();
        this.addForm.controls["StateId"].disable();
        this.addForm.controls["PostalCode"].disable();
        this.addForm.controls["CountryId"].disable();

      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
      }
    },
    err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
  /*
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2424
    @What: Function will call when user click on cancel button.
  */

  onDismiss(): void {
    this.addForm.get('AddressLinkToMap').setValidators([Validators.required]);
    this.addForm.get('AddressLinkToMap').updateValueAndValidity();
    document.getElementsByClassName("add_location")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_location")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: '' }); }, 200);
  }
  
 /*
    @Name: onSubmit
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2424
    @What: Function will to save data 
  */
  onSubmit(){
    this.addForm.get('AddressLinkToMap').setValidators([Validators.required]);
    this.addForm.get('AddressLinkToMap').updateValueAndValidity();
    document.getElementsByClassName("add_location")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_location")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: '' }); }, 200);
  } 
}
