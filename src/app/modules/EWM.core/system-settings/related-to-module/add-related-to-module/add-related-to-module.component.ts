import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { statusList } from '../../../shared/datamodels/common.model';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels/common.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-related-to-module',
  templateUrl: './add-related-to-module.component.html',
  styleUrls: ['./add-related-to-module.component.scss']
})
export class AddRelatedToModuleComponent implements OnInit {
  addForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public submitted = false;
  public statusList: any = [];
  public viewMode: any;
  public relatedAddObj = {};
  public StatusData: any[];
  public StatusDataName;
  public StatusDataId;
  public tempID: any;
  editData:any=[];
  public oldPatchValues: any;

  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private clientTagService: ProfileInfoService, private route: Router,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService, private _SystemSettingService: SystemSettingService, private serviceListClass: ServiceListClass, private http: HttpClient) {
    this.addForm = this.fb.group({
      //  @Who: maneesh, @When: 29-dec-2022,@Why: EWM-10077 addnoWhitespaceValidator
      RelatedTo: ['', [Validators.required,this.noWhitespaceValidator()]],
      Status: [1, Validators.required],
      StatusName: ['Active'],
    });
  }

  ngOnInit(): void {
    this.getStatusList();
    this.router.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.activestatus = 'Edit';
          this.tempID = params['id'];
          this.getRelatedToById(this.tempID);
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }
      });
  }



   /* 
   @Type: File, <ts>
   @Name: getRelated data by id function
  @Who: Adarsh singh
 @When: 11 feb 22
 @Why: EWM-4953
   @What: For status listing 
  */
 getRelatedToById(Id: Number) {
  this.loading = true;
  this._SystemSettingService.getRelatedToModuleById('?id=' + Id).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      this.editData =  data.Data;
      if (data.HttpStatusCode == 200) {
        this.addForm.patchValue({
          RelatedTo: data['Data'].RelatedTo,
          Status: data['Data'].Status,
          StatusName: data['Data'].StatusName,
        });
        this.oldPatchValues = data['Data'];
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
@Name: getStatusList function
@Who: Adarsh singh
@When: 11 feb 22
@Why: EWM-4953
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
   @Name: createNoteRelatedModule function
   @Who: Adarsh singh
    @When: 11 feb 22
    @Why: EWM-4953
   @What: For saving related module
  */

 createRelatedTo(value) {
  this.loading = true;
  this.relatedAddObj['RelatedTo'] = value.RelatedTo;
  this.relatedAddObj['Status'] = value.Status;
  this.relatedAddObj['StatusName'] = value.StatusName;

 

  this._SystemSettingService.createRelatedToModule(this.relatedAddObj).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.route.navigate(['./client/core/administrators/related-to-module']);

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
 @Name: updateRelatedModule function
 @Who: Adarsh singh
 @When: 11 feb 22
 @Why: EWM-4953
 @What: For updating RealatedModule
*/
updateRelateToModule(value) {
  this.loading = true;
  value['Id']= parseInt(this.tempID);
  value['CreatedBy']= this.editData.CreatedBy;
  value['LastUpdated']= this.editData.LastUpdated;
  value['RelatedTo'] = value.RelatedTo;
  value['Status'] =  value.Status;
  value['StatusName'] = value.StatusName;
  var removeJsonId = value;
  let updateObj = {
    "From": this.editData,
    "To": removeJsonId,
  };

  this._SystemSettingService.updateRelatedToModule(updateObj).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.route.navigate(['./client/core/administrators/related-to-module']);
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
    @Name: checkStatusId function
     @Who: Adarsh singh
    @When: 11 feb 22
    @Why: EWM-4953
    @What: For update status and statusName
    */
   clickStatusID(Id:any){
    this.StatusData = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusData[0].StatusName;
    this.StatusDataId = this.StatusData[0].StatusId;
    this.addForm.patchValue({
      Status: this.StatusData[0].StatusId,
      StatusName: this.StatusData[0].StatusName,
    })
    }



    /* 
  @Type: File, <ts>
  @Name: onSave function
    @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: For checking wheather the data save or edit on the basis on active satatus
  */

  onSave(value) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    //this.activestatus=activestatus;
    this.duplicayCheck(true);
  }

/* 
  @Type: File, <ts>
  @Name: duplicayCheck function
  @Who: Adarsh singh
 @When: 11 feb 22
 @Why: EWM-4953
  @What: For checking duplicacy for notes category
 */
duplicayCheck(isSave:boolean) {
  let duplicacyExist = {};
  let relatedId;
  if (this.tempID != undefined) {
    relatedId = this.tempID;
  } else {
    relatedId = 0;
  }
  // if (value == '') {
  //   value = 0;
  //   return false;
  // }
  duplicacyExist['Value'] = this.addForm.get("RelatedTo").value;
  // duplicacyExist['categoryname'] = this.addForm.get("NoteCategory").value;
  duplicacyExist['Id'] = Number(relatedId);
  this._SystemSettingService.checkDuplicacyRelatedToModule(duplicacyExist).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 402 && repsonsedata.Status == false) {
        this.addForm.get("RelatedTo").setErrors({ codeTaken: true });
            this.addForm.get("RelatedTo").markAsDirty();
            this.submitted = false;
       
       } else if (repsonsedata.HttpStatusCode === 204 && repsonsedata.Status == true) {
      
            this.addForm.get("RelatedTo").clearValidators();
            this.addForm.get("RelatedTo").markAsPristine();
            this.addForm.get('RelatedTo').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(1),this.noWhitespaceValidator()]);
            this.addForm.get("RelatedTo").updateValueAndValidity();

            if (this.addForm && this.submitted == true && isSave===true){ 
              if(this.addForm && this.submitted == true && this.activestatus == 'Add'){
                this.createRelatedTo(this.addForm.value);
              }else{
                this.updateRelateToModule(this.addForm.value);
              }    
            }
           
                  
       
      } else {     
          this.addForm.get("RelatedTo").clearValidators();
          this.addForm.get("RelatedTo").markAsPristine();
          this.addForm.get('RelatedTo').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(1),this.noWhitespaceValidator()]);
        }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });
}

// timeout: any = null;
//   onKeySearch(event: any) {
//   clearTimeout(this.timeout);
//   var $this = this;
//   this.timeout = setTimeout(function () {
//     if (event.keyCode != 13) {
//       $this.duplicayCheck(event.target.value);
//     }
//   }, 500);
// }

// private executeListing(value: string) {
//   alert(value);
// }
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 29-dec-2022
   @Why: EWM-10077
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

}
