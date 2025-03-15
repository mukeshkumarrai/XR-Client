/*
  @Type: File, <ts>
  @Name: manage-salary-band.component.ts
  @Who: Renu
  @When: 18-June-2021
  @Why:EWM-1860
  @What: manage salary Band master list data
 */

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';

@Component({
  selector: 'app-manage-salary-band',
  templateUrl: './manage-salary-band.component.html',
  styleUrls: ['./manage-salary-band.component.scss']
})
export class ManageSalaryBandComponent implements OnInit {

 /**********************All generic variables declarations for accessing any where inside functions********/
addSalaryForm: FormGroup;
public loading: boolean = false;
public activestatus: string = 'Add';
public submitted = false;
public SalaryAddObj = {};
public tempID: number;
public statusList: any = [];
public viewMode: any;
public specialcharPattern = "[A-Za-z0-9- ]*$";
public numberPattern = new RegExp('^[1-9]\\d*$');
public  selectedCurrencyValue: number;

/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Renu
 @When: 18-June-2021
 @Why: ROST-1860
 @What: For injection of service class and other dependencies
*/

constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
  private snackBService: SnackBarService, private jobMasterService: JobService, private route: Router, 
  private commonserviceService: CommonserviceService) {
  this.addSalaryForm = this.fb.group({
    Id: [''],
    CurrencyCode: ['', [Validators.required]],
    SalaryBandName: ['', [Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100)]],
    MinSalary:['',[Validators.required,Validators.maxLength(15),Validators.pattern(this.numberPattern)]],
    MaxSalary:['',[Validators.required,Validators.maxLength(15),Validators.pattern(this.numberPattern)]],
    Status: ["1", [Validators.required]] //   <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
  });
}


ngOnInit(): void {
  this.getStatusList();
  this.router.queryParams.subscribe(
    params => {
      if (params['id'] != undefined) {
        this.activestatus = 'Edit';
        this.tempID = params['id'];
        this.editForm(this.tempID);
      }
      if (params['V'] != undefined) {
        this.viewMode = params['V'];
      }
    });
}

/* 
 @Type: File, <ts>
 @Name: editForm function
 @Who: Renu
 @When: 18-June-2021
 @Why: ROST-1860
 @What: For setting value in the edit form
*/

editForm(Id: Number) {
  this.loading = true;
  this.jobMasterService.getSalaryBandByID('?id=' + Id).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        let isActive;
        let CurrencyCode;
        if (data.Data.Status == 1) {
          isActive = '1';
        } else {
          isActive = '2';
        }
        if (data.Data.CurrencyId == null || data.Data.CurrencyId == '') {
          CurrencyCode = Number(0);
        } else {
          CurrencyCode = Number(data.Data.CurrencyId) ;
        }
        
        this.addSalaryForm.patchValue({
          Id: data.Data.Id,
          CurrencyCode: CurrencyCode,
          SalaryBandName: data.Data.SalaryBandName,
          MaxSalary: data.Data.MaxSalary,
          MinSalary: data.Data.MinSalary,
          Status: isActive,
        });
        this.ddlCurrencychange(CurrencyCode);
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
  @Name: onSave function
  @Who: Renu
  @When: 18-June-2021
  @Why: ROST-1860
  @What: For checking wheather the data save or edit on the basis on active satatus
 */

onSave(value) {
  this.submitted = true;
  if (this.addSalaryForm.invalid) {
    return;
  }
  this.salaryduplicayCheck();
}

/* 
 @Type: File, <ts>
 @Name: createSalaryBand function
 @Who: Renu
 @When: 18-June-2021
 @Why: ROST-1860
 @What: For saving Job master data
*/

createSalaryBand(value) {
  this.loading = true;
  
  this.SalaryAddObj['CurrencyId'] = value.CurrencyCode;
  this.SalaryAddObj['SalaryBandName'] = value.SalaryBandName;
  this.SalaryAddObj['MinSalary'] = parseInt(value.MinSalary);
  this.SalaryAddObj['MaxSalary'] = parseInt(value.MaxSalary);
  this.SalaryAddObj['Status'] = parseInt(value.Status);
  this.jobMasterService.AddSalaryBand(this.SalaryAddObj).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      //this.route.navigate(['./client/core/administrators/salary-band'], { queryParams: { V: this.viewMode } });
      this.route.navigate(['./client/core/administrators/salary-band']);
    } else if (repsonsedata.HttpStatusCode === 400) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      this.loading = false;
    }
    else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
@Name: updateSalaryBand function
@Who: Renu
@When: 18-June-2021
@Why: ROST-1860
@What: For updating Job master data
*/

updateSalaryBand(value) {
  let updateJobObj = {};
  this.loading = true;
  updateJobObj['Id'] = value.Id;
  updateJobObj['CurrencyId'] = value.CurrencyCode;
  updateJobObj['SalaryBandName'] = value.SalaryBandName;
  updateJobObj['MinSalary'] = parseInt(value.MinSalary);
  updateJobObj['MaxSalary'] = parseInt(value.MaxSalary);
  updateJobObj['Status'] = parseInt(value.Status);
  this.jobMasterService.updateSalaryBand(updateJobObj).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
     // this.route.navigate(['./client/core/administrators/salary-band'], { queryParams: { V: this.viewMode } });
     this.route.navigate(['./client/core/administrators/salary-band']);
    } else if (repsonsedata.HttpStatusCode === 400) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      this.loading = false;
    }
    else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
@Name: JobduplicayCheck function
@Who: Renu
@When: 18-June-2021
@Why: ROST-1860
@What: For checking duplicacy for Job Name
*/
salaryduplicayCheck() {
  let JobId;
  if (this.tempID != undefined) {
    JobId = this.tempID;
  } else {
    JobId = 0;
  }
  if (this.addSalaryForm.get('SalaryBandName').value == '') {
    return false;
  }
  this.jobMasterService.checkSalaryBandIsExists('?salaryBandName=' + this.addSalaryForm.get('SalaryBandName').value + '&id=' + JobId ).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        if (repsonsedata.Status == true) {
            this.addSalaryForm.get("SalaryBandName").setErrors({ codeTaken: true });
            this.addSalaryForm.get("SalaryBandName").markAsDirty();
        }
        }  else if (repsonsedata.HttpStatusCode === 204) {
           if (repsonsedata.Status == false) { 
            this.addSalaryForm.get("SalaryBandName").clearValidators();
            this.addSalaryForm.get("SalaryBandName").markAsPristine();
            this.addSalaryForm.get('SalaryBandName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern),Validators.maxLength(100)]);
            if(this.submitted==true){
            if ( this.tempID  == undefined ||  this.tempID  == null) {
              this.createSalaryBand(this.addSalaryForm.value);
            } else {
              this.updateSalaryBand(this.addSalaryForm.value);
            }
          }
        }
      } 
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        this.loading = false;
      }
      // this.addSalaryForm.get('Name').updateValueAndValidity();
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });
}

/* 
 @Type: File, <ts>
 @Name: getStatusList function
 @Who: Renu
 @When: 18-June-2021
 @Why: ROST-1860
 @What: For status listing 
*/
getStatusList() {
  this.commonserviceService.getStatusList().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.statusList = repsonsedata.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
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
        this.addSalaryForm.get("CurrencyCode").setErrors({ required: true });
        this.addSalaryForm.get("CurrencyCode").markAsTouched();
        this.addSalaryForm.get("CurrencyCode").markAsDirty();
      }
      else
      {
        this.addSalaryForm.get("CurrencyCode").clearValidators();
        this.addSalaryForm.get("CurrencyCode").markAsPristine();
        this.selectedCurrencyValue=data;
        this.addSalaryForm.patchValue(
          {
            CurrencyCode:data
          }
        )
      }
}

/*
    @Who: Renu
    @When: 22-june-2021
    @Why: EWM-1860
    @What: min validator
  */
onChangeMin(curval){
  if (!curval || !this.addSalaryForm.get("MaxSalary").value) { return  }
   if(Number(curval)>Number(this.addSalaryForm.get("MaxSalary").value)){
    this.addSalaryForm.get("MinSalary").setErrors({ min: true });
    this.addSalaryForm.get("MinSalary").markAsTouched();
    this.addSalaryForm.get("MinSalary").markAsDirty();
   }else{
    this.addSalaryForm.get("MinSalary").clearValidators();
    this.addSalaryForm.get("MinSalary").markAsPristine();
    this.addSalaryForm.get('MinSalary').setValidators([Validators.required,Validators.maxLength(15),Validators.pattern(this.numberPattern)]);
   }
}
/*
    @Who: Renu
    @When: 22-june-2021
    @Why: EWM-1860
    @What: max validator
  */
onChangeMax(curval){
  if (!curval || !this.addSalaryForm.get("MinSalary").value) { return  }
   if(Number(curval)<Number(this.addSalaryForm.get("MinSalary").value)){
    this.addSalaryForm.get("MaxSalary").setErrors({ max: true });
    this.addSalaryForm.get("MaxSalary").markAsTouched();
    this.addSalaryForm.get("MaxSalary").markAsDirty();
   }else{
    this.addSalaryForm.get("MaxSalary").clearValidators();
    this.addSalaryForm.get("MaxSalary").markAsPristine();
    this.addSalaryForm.get('MaxSalary').setValidators([Validators.required,Validators.maxLength(15),Validators.pattern(this.numberPattern)]);
   }
}

}
