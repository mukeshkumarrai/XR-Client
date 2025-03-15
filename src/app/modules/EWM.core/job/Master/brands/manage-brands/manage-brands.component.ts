/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 18-June-2021
  @Why: EWM-1787
  @What:  This page will be use for the brands template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { BrandsMaster } from '../../../../shared/datamodels/brand';
import { ResponceData } from '../../../../shared/datamodels/location-type';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusList } from '../../../../shared/datamodels/common.model';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';

@Component({
  providers: [ MessageService ],
  selector: 'app-manage-brands',
  templateUrl: './manage-brands.component.html',
  styleUrls: ['./manage-brands.component.scss']
})
export class ManageBrandsComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
addForm: FormGroup;
public loading: boolean = false;
public activestatus: string = 'Add';
public submitted = false;
public BrandsAddObj = {};
public tempID: number;
public specialcharPattern = "[A-Za-z0-9-+ ]+$";
statusData: any = [];
public viewMode: any;

/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 18-June-2021
 @Why: EWM-1787
 @What: For injection of service class and other dependencies
*/

constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
  private snackBService: SnackBarService, private _jobService: SystemSettingService, private route: Router,private commonserviceService:CommonserviceService) {
  this.addForm = this.fb.group({
    Id: [''],
    Brand: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(this.specialcharPattern)]],
    Status: [1, Validators.required] // <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
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
 @When: 18-June-2021
 @Why: EWM-1787
 @What: For setting value in the edit form
*/
editForm(Id: Number) {
  this.loading = true;
  this._jobService.getBrandById('?Id=' + Id).subscribe(
    (data: BrandsMaster) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        this.addForm.patchValue({
          Id: data['Data'].Id,
          Brand: data['Data'].Brand,
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
 @When: 18-June-2021
 @Why: EWM-1787
 @What: For checking wheather the data save or edit on the basis on active status
*/
onSave(value) {
  this.submitted = true;
  if (this.addForm.invalid) {
    return;
  }
  if (this.activestatus == 'Add') {
    this.createBrand(value);
  } else {
    this.updateBrand(value);
  }

}

/* 
 @Type: File, <ts>
 @Name: createBrand function
 @Who: Nitin Bhati
 @When: 18-June-2021
 @Why: EWM-1787
 @What: For saving Brands master data
*/

 createBrand(value) {
  this.loading = true;
  this.BrandsAddObj['Brand'] = value.Brand;
  this.BrandsAddObj['Status'] = parseInt(value.Status);
  this._jobService.createBrand(this.BrandsAddObj).subscribe((repsonsedata:BrandsMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      //this.route.navigate(['./client/core/administrators/brands'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/brands']);
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
 @Name: updateBrand function
 @Who: Nitin Bhati
 @When: 18-June-2021
 @Why: EWM-1787
 @What: For updating Brands master data
*/
updateBrand(value) {
  let updateBrandsObj={};
  this.loading = true;
  updateBrandsObj['Id'] = value.Id;
  updateBrandsObj['Brand'] = value.Brand;
  updateBrandsObj['Status'] = parseInt(value.Status);
  this._jobService.updateBrandById(updateBrandsObj).subscribe((repsonsedata:BrandsMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
     // this.route.navigate(['./client/core/administrators/brands'],{ queryParams: {V:this.viewMode}});
      this.route.navigate(['./client/core/administrators/brands']);
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
 @When: 18-June-2021
 @Why: EWM-1787
 @What: For checking duplicacy for code and description
*/
 duplicayCheck() {
   let brandsID = this.addForm.get("Id").value;
   if (brandsID == null) {
    brandsID = 0;
   }
   if (brandsID == '') {
    brandsID = 0;
   }
  this._jobService.checkBrandIsExist('?Value=' + this.addForm.get("Brand").value + '&Id='+brandsID).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
        if (data.Data == true) {
          this.addForm.get("Brand").setErrors({ codeTaken: true });
          this.addForm.get("experienceName").markAsDirty();
        }
      }
      else if (data.HttpStatusCode == 400) {
        if (data.Data == false) {

          this.addForm.get("Brand").clearValidators();
          this.addForm.get("Brand").markAsPristine();
        }
        // who:maneesh,what:ewm-12848 for handel 402 case when:23/06/2023
      } else if (data.HttpStatusCode == 402) {
        if (data.Data == false) {
          this.addForm.get("Brand").setErrors({ codeTaken: true });
          // this.addForm.get("Brand").clearValidators();
          this.addForm.get("Brand").markAsPristine();
        }
      }
      else {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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
@Name: getAllUserRole function
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
   @Name: WhitespaceValidator function
   @Who: maneesh
   @When: 10-jan-2023
   @Why: EWM-10078
   @What: Remove whitespace
*/
public blankval:boolean = false;
Whitespace(event:any){
  let ctrv = event.target?.value;
  const isWhitespace = (ctrv as string || '')?.trim().length === 0;  
  if(isWhitespace==true && ctrv!=''){    
         this.blankval=true;
      }else if (this.addForm.get('Brand').value==''){
        this.blankval=false;
        this.addForm.get("Brand").setErrors({ required: true } );
        this.addForm.get('Brand').setValidators([Validators.required, Validators.maxLength(100),Validators.pattern(this.specialcharPattern)]);

      }else{
         this.blankval=false;
            }
     }
     
}

