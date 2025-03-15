/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 21-Aug-2021
  @Why: EWM-2502
  @What:  This page will be use for the manage degree type template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild,AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { DegreeTypeMaster } from '../../../../shared/datamodels/candidate-scoretype';
import { ResponceData } from '../../../../shared/datamodels/location-type';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusList } from '../../../../shared/datamodels/common.model';
import { CandidateDegreeTypeService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-degree-type.service';

@Component({
  selector: 'app-manage-candidate-degree-type',
  templateUrl: './manage-candidate-degree-type.component.html',
  styleUrls: ['./manage-candidate-degree-type.component.scss']
})
export class ManageCandidateDegreeTypeComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
addForm: FormGroup;
public loading: boolean = false;
public activestatus: string = 'Add';
public submitted = false;
public AddObj = {};
public tempID: number;
public specialcharPattern = "[A-Za-z0-9-+ ]+$";
statusData: any = [];
public viewMode: any;
public oldPatchValues: any;

/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 21-Aug-2021
 @Why: EWM-2502
 @What: For injection of service class and other dependencies
*/
constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
  private snackBService: SnackBarService, private _CandidateDegreeTypeService: CandidateDegreeTypeService, private route: Router,private commonserviceService:CommonserviceService) {
  this.addForm = this.fb.group({
    Id: [''],
    //  @Who: maneesh, @When: 05-jan-2023,@Why: EWM-10097 add noWhitespaceValidator
    DegreeTypeName: ['', [Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]],
    Description: ['', [Validators.required,Validators.maxLength(200),this.noWhitespaceValidator()]],
    Status: [1, Validators.required]  //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
  });
}
ngOnInit(): void {
  this.router.queryParams.subscribe(
    params => {
      if (params['id'] != undefined) {
        this.activestatus = 'Edit';
        this.tempID = params['id'];
        this.editForm(this.tempID);
      }
      if(params['V'] != undefined)
      {
        this.viewMode=params['V'];
      }
    });
  this.getAllStatus();
 
}

/* 
 @Type: File, <ts>
 @Name: editForm function
 @Who: Nitin Bhati
 @When: 21-Aug-2021
 @Why: EWM-2502
 @What: For setting value in the edit form
*/
editForm(Id: Number) {
  this.loading = true;
  this._CandidateDegreeTypeService.getDegreeTypeByID('?id=' + Id).subscribe(
    (data: DegreeTypeMaster) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        this.addForm.patchValue({
          Id: data['Data'].Id,
          DegreeTypeName: data['Data'].DegreeTypeName,
          Description: data['Data'].Description,
          Status: data['Data'].Status,
        });
        this.oldPatchValues = data['Data'];

      }
      else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
/* 
 @Type: File, <ts>
 @Name: onSave function
 @Who: Nitin Bhati
 @When: 21-Aug-2021
 @Why: EWM-2502 
 @What: For checking wheather the data save or edit on the basis on active status
*/
onSave(value) {
  this.submitted = true;
  if (this.addForm.invalid) {
    return;
  }
  if (this.activestatus == 'Add') {
    this.createDegreeType(value);
  } else {
    this.updatedegreeType(value);
  }

}

/* 
 @Type: File, <ts>
 @Name: createDegreeType function
 @Who: Nitin Bhati
 @When: 21-Aug-2021
 @Why: EWM-2502
 @What: For saving Degree master data
*/

createDegreeType(value) {
  this.loading = true;
  this.AddObj['DegreeTypeName'] = value.DegreeTypeName;
  this.AddObj['Description'] = value.Description;
  this.AddObj['Status'] = parseInt(value.Status);
  this._CandidateDegreeTypeService.createDegreeType(this.AddObj).subscribe((repsonsedata:DegreeTypeMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      //this.route.navigate(['./client/core/administrators/degree-type'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/degree-type']);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
     } else if (repsonsedata.HttpStatusCode === 400) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }
    else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }
  },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

/* 
 @Type: File, <ts>
 @Name: updatedegreeType function
 @Who: Nitin Bhati
 @When: 21-Aug-2021
 @Why: EWM-2502
 @What: For updating Degree Type master data
*/
updatedegreeType(value) {
  this.loading = true;
  let addObj = [];
  let fromObj = {};
  let toObj = {};
  fromObj = this.oldPatchValues;
  toObj['Id'] = value.Id;
  toObj['DegreeTypeName'] = value.DegreeTypeName;
  toObj['Description'] = value.Description;
  toObj['Status'] = parseInt(value.Status);
  addObj = [{
    "From": fromObj,
    "To": toObj
  }];
  this._CandidateDegreeTypeService.updateDegreeType(addObj[0]).subscribe((repsonsedata:DegreeTypeMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      //this.route.navigate(['./client/core/administrators/degree-type'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/degree-type']);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
    } else if (repsonsedata.HttpStatusCode === 400) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }
    else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }
  },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });

}
 /* 
 @Type: File, <ts>
 @Name: duplicayCheck function
 @Who: Nitin Bhati
 @When: 21-Aug-2021
 @Why: EWM-2502
 @What: For checking duplicacy for degree type
*/
 duplicayCheck() {
   let degreeTypeID = this.addForm.get("Id").value;
   if (degreeTypeID == null) {
    degreeTypeID = 0;
   }
   if (degreeTypeID == '') {
    degreeTypeID = 0;
   }
  this._CandidateDegreeTypeService.checkDegreeTypeDuplicacy('?degreeTypeName=' + this.addForm.get("DegreeTypeName").value + '&id='+degreeTypeID).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 402) {
        if (data.Data == false) {
          this.addForm.get("DegreeTypeName").setErrors({codeTaken: true});
          this.addForm.get("DegreeTypeName").markAsDirty();
        }
      }
      else if (data.HttpStatusCode == 204) {
        if (data.Data == true) {
          this.addForm.get("DegreeTypeName").clearValidators();
          this.addForm.get("DegreeTypeName").markAsPristine();
          this.addForm.get('DegreeTypeName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
        }
      }
      else if (data.HttpStatusCode == 400) {
          this.addForm.get("DegreeTypeName").clearValidators();
          this.addForm.get("DegreeTypeName").markAsPristine();
          this.addForm.get('DegreeTypeName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
        
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if(err.StatusCode==undefined)
      {
        this.loading=false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    });
}

/*
@Type: File, <ts>
@Name: getAllStatus function
@Who: Nitin Bhati
@When: 21-Aug-2021
@Why: EWM-2502
@What: call Get method from services for showing data into grid..
*/
getAllStatus() {
  this.loading = true;
  this.commonserviceService.getStatusList().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
        this.loading = false;
        this.statusData = data.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 05-jan-2023
   @Why: EWM-10097
   @What: Remove whitespace
*/

noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}



