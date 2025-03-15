/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 24-Nov-2021
  @Why: EWM-3913
  @What: this section handle all Business Registration Details component related functions
*/
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-business-registration',
  templateUrl: './business-registration.component.html',
  styleUrls: ['./business-registration.component.scss']
})
export class BusinessRegistrationComponent implements OnInit {
  /**********************global variables decalared here **************/
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addForm: FormGroup;
  public userTypeList: any = [];
  public brandList: any = [];
  public industryList: any = [];
  public subIndustryList: any = [];
  public subIndustryListId: any = [];
  public selected: any = [];
  public statusList: any = [];
  public locationTypeList: any = [];
  public reasonList: any = [];
  public companyList: any = [];
  public selectedValue: any;
  events: Event[] = [];
  public client: any;
  public ClientDataById: any;
  public isEditForm: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<BusinessRegistrationComponent>, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService, private serviceListClass: ServiceListClass, private _clientService: ClientService,private appSettingsService: AppSettingsService) {
    this.addForm = this.fb.group({
      RegisteredName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      TradingName: ['', [Validators.maxLength(100)]],
      RegistrationNumber: ['', [Validators.maxLength(30), Validators.pattern("^[0-9 ]*$")]],
      CompanyNumber: ['', [Validators.maxLength(30), Validators.pattern("^[0-9 ]*$")]],
      BusinessType: ['', [Validators.maxLength(100)]]
    });

  }
  ngOnInit() {
    /*  @Who: Renu @When: 19-May-2022 @Why: EWM-5654 EWM-6318 */
    
      this.ClientDataById = this.data?.clientDetailsData;
      this.addForm.patchValue({
        'RegisteredName': this.ClientDataById.isRegisteredName==true?this.ClientDataById.holdingCompany:this.ClientDataById.RegisteredName,
        'TradingName': this.ClientDataById.TradingName,
        'RegistrationNumber': this.ClientDataById.RegistrationNumber,
        'CompanyNumber': this.ClientDataById.CompanyNumber,
        'BusinessType': this.ClientDataById.BusinessType
      })
  
    this.addForm.controls["BusinessType"].disable();

    this.addForm.controls["RegisteredName"].disable();
    //this.businessTypeList();

  }
  /* 
    @Type: File, <ts>
    @Name: onUpdate
    @Who: Nitin Bhati
    @When: 24-Nov-2021
    @Why: EWM-3913
    @What: For Update Business Registration details data
  */
  onUpdate(value): void {
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.ClientDataById;

    toObj['ClientId'] = this.ClientDataById.ClientId;
    toObj['RegisteredName'] = this.addForm.value.RegisteredName;
    toObj['TradingName'] = this.addForm.value.TradingName;
    toObj['RegistrationNumber'] = this.addForm.value.RegistrationNumber;
    toObj['CompanyNumber'] = this.addForm.value.CompanyNumber;
    toObj['BusinessType'] = this.addForm.value.BusinessType;
    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._clientService.updateBusinessRegistration(updateObj[0]).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addForm.reset();
          document.getElementsByClassName("quick-business")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("quick-business")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);

          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }

  }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: Function will call when user click on EDIT BUUTONS.
  */
  onDismiss(): void {
    document.getElementsByClassName("quick-business")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("quick-business")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
   @Type: File, <ts>
   @Name: businessTypeList
   @Who: Nitin Bhati
   @When: 24-Nov-2021
   @Why: EWM-3913
   @What: To get Data from Business Type 
   */
  businessTypeList() {
    this.systemSettingService.getBrandAllListAll('?FilterParams.ColumnName=statusname&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.brandList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


}

