/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 24-Aug-2021
  @Why: EWM-8055
  @What:  This page will be use for the state-manage configuration
*/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { customDropdownConfig, statusList } from 'src/app/modules/EWM.core/shared/datamodels/common.model';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-states-manage',
  templateUrl: './states-manage.component.html',
  styleUrls: ['./states-manage.component.scss']
})
export class StatesManageComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  addForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public primaryBgColor: string;
  public tempID: number;
  public submitted = false;
  public addObj = {};
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public viewMode: any;
  public codePattern = new RegExp(/^[A-Z0-9]{1,20}$/); //^[A-Z0-9]{1,20}$
  public visibility: number = 0;
  public visibilityID: number;
  public visibilityStatus = false;
  public client: any;
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public industryList: any = [];
  public isHideExternally: number = 0;
  public oldPatchValues: any;
  public StatusDataId: any[];
  public StatusDataName;
  public selectedValue: any;
  public isSubmitted: any;
  public viewModeValue: any;
  public stateId: any;
  public StatusName: any;
  public isSays: number;
  public stateCodeStatus = false;
  public stateNameStatus = false;
  public Savebtndisabel=false;
  countryList:any = [];
  searchCode$ = new Subject<any>();

  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: maneesh
  @When: 24-Aug-2021
  @Why: EWM-8055
  @What: For injection of service class and other dependencies
  */
  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private clientTagService: ProfileInfoService, private route: Router,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService, private _SystemSettingService: SystemSettingService, private serviceListClass: ServiceListClass) {
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['placeholder'] = 'label_status';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsRequired'] = false;
    this.addForm = this.fb.group({
      Id: [''], 
      Name: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(1), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      CountryName: ['', [Validators.required]],
      stateName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      Status: [1, [Validators.required]],  // <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
      StatusName: [''],
      CountryId: ['', [Validators.required]],

    });
  }
  ngOnInit(): void {
    this.getStatusList();
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.router.queryParams.subscribe(
      params => {
        if (params['Id'] != undefined) {
          this.activestatus = 'Edit'
          this.tempID = params['Id'];
          this.visibilityID = parseInt(params['R']);
          this.editForm(this.tempID);
        } else {
          this.activestatus = 'Add';
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }
      });
     // @bantee @UI changes to pass country ID while checking if the state code exists  @whn 18-09-2023

      this.searchCode$.pipe(debounceTime(1000)).subscribe(value => {   
        this.checkDuplicacyofStateCode(value)
         });
  }
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: maneesh
   @When: 24-Aug-2021
   @Why: EWM-8055
   @What: For setting value in the edit form
  */
  editForm(Id: Number) {
    this.loading = true;
    this._SystemSettingService.getStateByID('?Id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode == 200) {
          this.addForm.patchValue({
            Id: data['Data'].Id,
            stateName: data['Data'].StateName,
            CountryName: data['Data'].CountryName,
            Status: data['Data'].Status,
            Name: data['Data'].StateCode,
            CountryId: data['Data'].CountryId,
            StatusName: data['Data'].StatusName,
            
          });
          this.loading = false;
          this.oldPatchValues = data['Data'];
          this.StatusDataName = data['Data'].StatusName;
          this.isSays = this.oldPatchValues.IsSys;
          this.selectedValue = { Id: data.Data.CountryId, CountryId: data.Data.CountryId, CountryName: data.Data.CountryName };
          this.ddlchange(this.selectedValue);
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
      @Type: File, <ts>
      @Name: statesCreate function
      @Who: maneesh
      @When: 24-Aug-2021
      @Why: EWM-8055
      @What: For saving data for status master
     */
  statesCreate(value: any) {
        // who:maneesh,what:ewm-10582 for duplicate rocord display this.Savebtndisabel=false;,when:25/05/2023
    this.Savebtndisabel=true;
    this.loading = true;
    this.addObj['stateName'] = value.stateName.trim();
    this.addObj['StateCode'] = value.Name.trim();
    this.addObj['CountryId'] = value.Id;
    this.addObj['CountryName'] = value.CountryName;
    this.addObj['StatusName'] = this.StatusDataName;
    this.addObj['Status'] = value.Status;
    this.addObj['IsSys'] = value.IsSys;
    this.addObj['Status'] = parseInt(value.Status);
    this._SystemSettingService.statesCreate(this.addObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['./client/core/administrators/states'])
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        // who:maneesh,what:ewm-10582 for duplicate rocord display this.Savebtndisabel=false;,when:25/05/2023
        this.Savebtndisabel=false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  /*
     @Type: File, <ts>
     @Name: update  function
     @Who: maneesh
     @When: 25-Aug-2021
     @Why: EWM-8055
     @What: For saving data for states master
    */
  update(value) {
        // who:maneesh,what:ewm-10582 for duplicate rocord display this.Savebtndisabel=false;,when:25/05/2023
    this.Savebtndisabel=true;
    let addObj;
    // this.loading = true;
    let updateGrpObj = {};
    updateGrpObj['Id'] = +this.tempID;
    updateGrpObj['stateName'] = value.stateName.trim();
    updateGrpObj['StateCode'] = value.Name.trim();
    updateGrpObj['CountryId'] = value.Id;
    updateGrpObj['CountryName'] = value.CountryName;
    updateGrpObj['StatusName'] = this.StatusDataName;
    updateGrpObj['Status'] = parseInt(value.Status);
    updateGrpObj['IsSys'] = this.isSays;

    addObj = [{
      "From": this.oldPatchValues,
      "To": updateGrpObj
    }];

    this._SystemSettingService.updateState(addObj[0]).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
        // who:maneesh,what:ewm-10582 for duplicate rocord display this.Savebtndisabel=false;,when:12/06/2023
          this.Savebtndisabel=true;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          let viewModeData: any = this.viewModeValue;
          this.route.navigate(['./client/core/administrators/states'], { queryParams: { V: this.viewMode } });
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        // who:maneesh,what:ewm-10582 for duplicate rocord display this.Savebtndisabel=false;,when:25/05/2023
          // this.Savebtndisabel=true;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  /* 
   @Type: File, <ts>
   @Name: duplicayCheck function
   @Who: maneesh
   @When: 25-Aug-2021
   @Why: EWM-8055
   @What: For checking duplicacy for states type
  */
  public checkDuplicacyofState(value:string) {
    let stateNameValue = this.addForm.get("stateName").value?.trim(); // Remove whitespace
    this.loading = false;
    let stateID = this.addForm.get("Id").value;
    if (this.tempID != undefined) {
      stateID = this.tempID;
    } else {
      stateID = 0;
    }
    if (stateID == '') {
      stateID = 0;
    }
    let duplicacyNameObj = {};
    duplicacyNameObj['Id'] = Number(stateID);
    duplicacyNameObj['Value'] = stateNameValue;
     // @bantee @UI changes to pass country ID while checking if the state code exists  @whn 18-09-2023

    duplicacyNameObj['CountryId'] = this.addForm.get("CountryId").value;

    if (stateNameValue) {
      duplicacyNameObj['CheckFor'] = "Name";
      this._SystemSettingService.checkDuplicacyofState(duplicacyNameObj).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 402) {
            if (repsonsedata.Status == false) {
              this.stateNameStatus=false;
              this.addForm.get("stateName").setErrors({ stateTaken: true });
              this.addForm.get("stateName").markAsDirty();
              this.submitted = false;
             }
          } else if (repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Status == true) {
              // this.addForm.get("stateName").clearValidators();
              this.addForm.get("stateName").markAsPristine();
              this.addForm.get('stateName').setValidators([Validators.required, Validators.maxLength(100), Validators.minLength(1), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]);
              this.addForm.get("stateName").updateValueAndValidity();
                 if (this.addForm && this.submitted == true) {
                  if (this.activestatus == 'Add') {
                    this.statesCreate(this.addForm.value);
                  } else if (this.activestatus == 'Edit') {
        // who:maneesh,what:ewm-10582 for duplicate rocord display this.Savebtndisabel=false;,when:12/06/2023
                    this.Savebtndisabel=true;
                    this.update(this.addForm.value);
                  }
                }             
            }
          } else {
            this.addForm.get("stateName").clearValidators();
            this.addForm.get("stateName").markAsPristine();
            this.addForm.get('stateName').setValidators([Validators.required, Validators.maxLength(100), Validators.minLength(1), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]);
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        });
    }
  }

  /* 
   @Type: File, <ts>
   @Name: checkDuplicacyofStateCode function
   @Who: maneesh
   @When: 29-Aug-2021
   @Why: EWM-8055
   @What: For checking duplicacy for states type
  */


     // @bantee @UI changes to pass country ID while checking if the state code exists  @whn 18-09-2023
   
public checkDuplicacte(value){
  this.searchCode$.next(value);    

}
  public checkDuplicacyofStateCode(value) {
    this.loading = false;
    let stateID = this.addForm.get("Id").value;
    let stateCodeValue = this.addForm.get("Name").value.trim(); // Remove whitespace
    if (this.tempID != undefined) {
      stateID = this.tempID;
    } else {
      stateID = 0;
    }
    if (stateID == '') {
      stateID = 0;
    }
    let duplicacyNameObj = {};
    duplicacyNameObj['Id'] = Number(stateID);
    duplicacyNameObj['Value'] = stateCodeValue;
     // @bantee @UI changes to pass country ID while checking if the state code exists  @whn 18-09-2023

    duplicacyNameObj['CountryId'] = this.addForm.get("CountryId").value;

    if (stateCodeValue) {
      duplicacyNameObj['CheckFor'] = "Code";
      this._SystemSettingService.checkDuplicacyofState(duplicacyNameObj).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 402) {
            if (repsonsedata.Status == false) {
             // this.stateCodeStatus=false;
              this.addForm.get("Name").setErrors({ codeTaken: true });
              this.addForm.get("Name").markAsDirty();
              this.submitted = false;
              
            }
          } else if (repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Status == true) {
              // this.addForm.get("Name").clearValidators();
              this.addForm.get("Name").markAsPristine();
              this.addForm.get('Name').setValidators([Validators.required, Validators.maxLength(20), Validators.minLength(1), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]);
              this.addForm.get("Name").updateValueAndValidity();
              this.checkDuplicacyofState(value);
                //  if (this.addForm && this.submitted == true) {
                //   if (this.activestatus == 'Add') {
                //     this.statesCreate(this.addForm.value);
                //   } else if (this.activestatus == 'Edit') {
                //     this.update(this.addForm.value);
                //   }
                // }
                
            }
          } else {

            this.addForm.get("Name").clearValidators();
            this.addForm.get("Name").markAsPristine();
            this.addForm.get('Name').setValidators([Validators.required, Validators.maxLength(20), Validators.minLength(1), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]);
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        });
    }

  }

  // onNameChanges(checkFor) {


  /* 
    @Type: File, <ts>
    @Name: getStatusList function
    @Who: maneesh
    @When: 25-Aug-2021
    @Why: EWM-8055
    @What: For status listing 
   */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: maneesh
   @When: 25-Aug-2021
   @Why: EWM-8055
   @What: For status Click event
  */
  clickStatusID(Id) {
    this.StatusDataId = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusDataId[0].StatusName;
    this.addForm.patchValue(
      {
        StatusName: this.StatusDataId[0].StatusName,
      }
    )
  }
  /*
     @Name: ddlchange function
    @Who: maneesh
    @When: 25-Aug-2022
    @Why: EWM-8055
    @What: get selected data
  */
  ddlchange(data) {
    if (data == null || data == "" || data === undefined) {
      this.selectedValue = null;
      this.addForm.get("CountryId").setErrors({ required: true });
      this.addForm.get("CountryId").markAsTouched();
      this.addForm.get("CountryId").markAsDirty();

      this.addForm.patchValue(
        {
          CountryId: '',
          CountryName: '',
          Id: null
        }
      );
    }
    else {
      this.addForm.get("CountryId").clearValidators();
      this.addForm.get("CountryId").markAsPristine();
      this.addForm.get("CountryId").setValidators(Validators.required);
      this.selectedValue = data;
      this.addForm.patchValue(
        {
          CountryName: data.CountryName,
          CountryId: data.Id,
          Id: data.Id
        }
      )
    }
  }
  /*
    @Type: File, <ts>
    @Name: oncancel
    @Who: maneesh
    @When: 25-Aug-2022
    @Why: EWM-8055
    @What: Redirect to sates page
 */
  onCancel() {
    let viewModeData: any = this.viewModeValue;
    this.route.navigate(['/app/master/states'], {
      queryParams: { viewModeData }
    });
  }
  /*
       @Type: File, <ts>
       @Name: onSave function
       @Who: maneesh
       @When: 25-Aug-2021
       @Why: EWM-8055
       @What: For checking wheather the data save or edit on the basis on active satatus
      */
  onSave(value: any, activestatus: any) {
    this.Savebtndisabel=true;
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.checkDuplicacyofStateCode(value);
    // if (this.activestatus == 'Add') {
    //   this.statesCreate(value);
    // } else {
    //   this.checkDuplicacyofStateCode(value);
    //   // this.checkDuplicacyofState(value);
    //   //this.update(value);
    // }
    this.activestatus = activestatus;
  }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: Nitin Bhati
   @When: 05-Sep-2022
   @Why: EWM-8683
   @What: Remove whitespace
*/
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }


}

