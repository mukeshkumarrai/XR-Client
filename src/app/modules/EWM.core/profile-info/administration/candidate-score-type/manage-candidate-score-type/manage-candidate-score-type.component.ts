/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 10-Aug-2021
  @Why: EWM-2442
  @What:  This page will be use for the manage Score type template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild,AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ScoreTypeMaster } from '../../../../shared/datamodels/candidate-scoretype';
import { ResponceData } from '../../../../shared/datamodels/location-type';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusList } from '../../../../shared/datamodels/common.model';
import { ScoreTypeService } from 'src/app/modules/EWM.core/shared/services/candidate/score-type.service';

@Component({
  selector: 'app-manage-candidate-score-type',
  templateUrl: './manage-candidate-score-type.component.html',
  styleUrls: ['./manage-candidate-score-type.component.scss']
})
export class ManageCandidateScoreTypeComponent implements OnInit {
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

/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 10-Aug-2021
 @Why: EWM-2442
 @What: For injection of service class and other dependencies
*/
constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
  private snackBService: SnackBarService, private _scoreTypeService: ScoreTypeService, private route: Router,private commonserviceService:CommonserviceService) {
  this.addForm = this.fb.group({
    Id: [''],
    //  @Who: maneesh, @When: 04-jan-2023,@Why: EWM-10094 addnoWhitespaceValidator 
    ScoreTypeName: ['', [Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]],
    Description: ['', [Validators.maxLength(200)]],
    Status: [1, Validators.required]   //<!-----@suika@EWM-10681 EWM-10818  @02-03-2023 to set default values for status in master data---->
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
 @When: 10-Aug-2021
 @Why: EWM-2442
 @What: For setting value in the edit form
*/
editForm(Id: Number) {
  this.loading = true;
  this._scoreTypeService.getScoreTypeByID('?id=' + Id).subscribe(
    (data: ScoreTypeMaster) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        this.addForm.patchValue({
          Id: data['Data'].Id,
          ScoreTypeName: data['Data'].ScoreTypeName,
          Description: data['Data'].Description,
          Status: data['Data'].Status,
        });

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
 @When: 10-Aug-2021
 @Why: EWM-2442
 @What: For checking wheather the data save or edit on the basis on active status
*/
onSave(value) {
  this.submitted = true;
  if (this.addForm.invalid) {
    return;
  }

  this.duplicayCheck(true);
}

/* 
 @Type: File, <ts>
 @Name: createScoreType function
 @Who: Nitin Bhati
 @When: 10-Aug-2021
 @Why: EWM-2442
 @What: For saving Brands master data
*/

createScoreType(value) {
  this.loading = true;
  this.AddObj['ScoreTypeName'] = value.ScoreTypeName;
  this.AddObj['Description'] = value.Description;
  this.AddObj['Status'] = parseInt(value.Status);
  this._scoreTypeService.createScoreType(this.AddObj).subscribe((repsonsedata:ScoreTypeMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      //this.route.navigate(['./client/core/administrators/score-type'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/score-type']);
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
 @Name: updateScoreType function
 @Who: Nitin Bhati
 @When: 10-Aug-2021
 @Why: EWM-2442
 @What: For updating Score Type master data
*/
updateScoreType(value) {
  let updateBrandsObj={};
  this.loading = true;
  updateBrandsObj['Id'] = value.Id;
  updateBrandsObj['ScoreTypeName'] = value.ScoreTypeName;
  updateBrandsObj['Description'] = value.Description;
  updateBrandsObj['Status'] = parseInt(value.Status);
  this._scoreTypeService.updateScoreType(updateBrandsObj).subscribe((repsonsedata:ScoreTypeMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
     // this.route.navigate(['./client/core/administrators/score-type'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/score-type']);
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
 @When: 10-Aug-2021
 @Why: EWM-2442
 @What: For checking duplicacy for score type
*/
 duplicayCheck(isSave:boolean) {
   let scoreTypeID = this.addForm.get("Id").value;
   if (scoreTypeID == null) {
    scoreTypeID = 0;
   }
   if (scoreTypeID == '') {
    scoreTypeID = 0;
   }
   let duplicateJson={};
   duplicateJson['Id']= scoreTypeID;
   duplicateJson['Value']= this.addForm.get("ScoreTypeName").value;

  this._scoreTypeService.checkScoreTypeDuplicacy(duplicateJson).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 402) {
        if (data.Data == false) {
          this.addForm.get("ScoreTypeName").setErrors({codeTaken: true});
          this.addForm.get("ScoreTypeName").markAsDirty();
          this.submitted = false;
        }
      }
      else if (data.HttpStatusCode == 204) {
        if (data.Data == true) {
          this.addForm.get("ScoreTypeName").clearValidators();
          this.addForm.get("ScoreTypeName").markAsPristine();
          this.addForm.get('ScoreTypeName').setValidators([Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]);

          if (this.addForm && this.submitted == true && isSave===true){ 
            if(this.addForm && this.submitted == true && this.activestatus == 'Add'){
              this.createScoreType(this.addForm.value);
            }else{
              this.updateScoreType(this.addForm.value);
            }    
          }

        }
      }
      else if (data.HttpStatusCode == 400) {
          this.addForm.get("ScoreTypeName").clearValidators();
          this.addForm.get("ScoreTypeName").markAsPristine();
          this.addForm.get('ScoreTypeName').setValidators([Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]);
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
@When: 18-June-2021
@Why: EWM-1787
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
   @When: 04-jan-2023
   @Why: EWM-10094
   @What: Remove whitespace
*/

noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}


