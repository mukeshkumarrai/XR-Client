/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1602
  @What:  This page will be use for the experience template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { ExperienceMaster } from '../../../../shared/datamodels/experience';
import { ResponceData } from '../../../../shared/datamodels/location-type';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusList } from '../../../../shared/datamodels/common.model';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';

@Component({
  providers: [MessageService],
  selector: 'app-manage-experience-type',
  templateUrl: './manage-experience-type.component.html',
  styleUrls: ['./manage-experience-type.component.scss']
})
export class ManageExperienceTypeComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  addExperienceForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public submitted = false;
  public GrupAddObj = {};
  public tempID: number;
  public specialcharPattern = "[A-Za-z0-9-+ ]+$";
  statusData: any = [];
  public viewMode: any;
  public getWeightageType:any=[];
  WeightageId: any;
  public selectedweightage: any = {};
  weightageDataName: any;
  WeightageDataId: any;
  WeightageValue: any;
  public WeightageIdData:any

  /*
   @Type: File, <ts>
   @Name: constructor function
   @Who: Nitin Bhati
   @When: 24-May-2021
   @Why: EWM-1602
   @What: For injection of service class and other dependencies
  */

  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, public _sidebarService: SidebarService,
    private _experienceService: JobService, private route: Router, private commonserviceService: CommonserviceService
    ,private _SystemSettingService: SystemSettingService,) {
    this.addExperienceForm = this.fb.group({
      Id: [''],
      // @Who: maneesh, @When: 29-dec-2022,@Why: EWM-10085 addnoWhitespaceValidator 
      experienceName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      BuiltIn: [true],
      Status: [1, Validators.required],  //  <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
      Weightage: [null],
      WeightageId: [''],
    });
  }
  ngOnInit(): void {
    this.getWeightageUserType()

    this._sidebarService.activesubMenuObs.next('masterdata');
    this.router.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.activestatus = 'Edit';
          this.tempID = params['id'];
          this.editForm(this.tempID);
        }
        if (params['V'] != undefined) {
          // this.viewMode = params['V'];
        }
        this.WeightageId = params['WeightageId'];
      });
    this.getAllStatus();
  }

  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 24-May-2021
   @Why: EWM-1602
   @What: For setting value in the edit form
  */

  editForm(Id: Number) {
    this.loading = true;
    this._experienceService.getExperienceByID('?experienceId=' + Id).subscribe(
      (data: ExperienceMaster) => {
        
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.weightageDataName = data['Data'].Weightage;

          let isActive;
          if (data['Data'].Status == 1) {
            isActive = '1';
          } else {
            isActive = '2';
          }
          this.addExperienceForm.patchValue({
            Id: data['Data'].Id,
            experienceName: data['Data'].Name,
            Status: data['Data'].Status,
            Weightage: data['Data'].Weightage,
            // WeightageId: data['Data'].WeightageId,
            // WeightageId:this.selectedweightage.WeightageId

          });
          this.weightageDataName = data['Data'].Weightage;

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
    @When: 24-May-2021
    @Why: EWM-1602
    @What: For checking wheather the data save or edit on the basis on active satatus
   */
  onSave(value) {
    this.submitted = true;
    if (this.addExperienceForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createExperienceMaster(value);
    } else {
      this.updateExperienceMaster(value);
    }

  }

  /*
   @Type: File, <ts>
   @Name: createExperienceMaster function
   @Who: Nitin Bhati
   @When: 24-May-2021
   @Why: EWM-1602
   @What: For saving Job Experience master data
  */

  createExperienceMaster(value) {
    this.loading = true;
    this.GrupAddObj['Name'] = value.experienceName;
    this.GrupAddObj['Weightage'] = this.WeightageValue;
    this.GrupAddObj['WeightageId'] = this.WeightageIdData;
    this.GrupAddObj['Status'] = parseInt(value.Status);
    this._experienceService.experienceCreate(this.GrupAddObj).subscribe((repsonsedata: ExperienceMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        //this.route.navigate(['./client/core/administrators/experience-type'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['./client/core/administrators/experience-type']);
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
 @Name: updateExperienceMaster function
 @Who: Nitin Bhati
 @When: 24-May-2021
 @Why: EWM-1602
 @What: For updating Job experience master data
*/
  updateExperienceMaster(value) {
    let updateGrpObj = {};
    this.loading = true;
    updateGrpObj['Id'] = value.Id;
    updateGrpObj['Name'] = value.experienceName;
    // updateGrpObj['Weightage'] = value.Weightage;
  

    updateGrpObj['Status'] = parseInt(value.Status);
    updateGrpObj['Weightage'] = this.WeightageValue;
    updateGrpObj['WeightageId'] = this.WeightageIdData;
    this._experienceService.updateExperience(updateGrpObj).subscribe((repsonsedata: ExperienceMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
       // this.route.navigate(['./client/core/administrators/experience-type'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['./client/core/administrators/experience-type']);
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
  @When: 11-May-2021
  @Why: ROST-1520
  @What: For checking duplicacy for code and description
 */
  duplicayCheck() {
    let experienceID = this.addExperienceForm.get("Id").value;
    if (experienceID == null) {
      experienceID = 0;
    }
    if (experienceID == '') {
      experienceID = 0;
    }
    this._experienceService.checkExperienceDuplicacy('?experienceName=' + this.addExperienceForm.get("experienceName").value + '&experienceId=' + experienceID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data == true) {
            this.addExperienceForm.get("experienceName").setErrors({ codeTaken: true });
            this.addExperienceForm.get("experienceName").markAsDirty();
          }
        }
        else if (data.HttpStatusCode == 400) {
          if (data.Data == false) {
            this.addExperienceForm.get("experienceName").clearValidators();
            this.addExperienceForm.get("experienceName").markAsPristine();
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  /*
   @Type: File, <ts>
   @Name: getAllUserRole function
   @Who: Nitin Bhati
   @When: 24-May-2021
   @Why: EWM-1602
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

  getWeightageUserType() {
    this._SystemSettingService.getWeightageUserType().subscribe(
      repsonsedata => {
        this.getWeightageType = repsonsedata['Data'];
        
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
//   onUserTypeChange(value) 
// {
//   console.log(value);

//   let userTypename=this.getWeightageType.filter((ut:any)=>ut.Id==value);
//   console.log(userTypename);
  
//   this.addExperienceForm.patchValue({
//     UserTypeName:userTypename[0].WeightageId
//   });
// }


  /* 
   @Type: File, <ts>
   @Name: clickWeightage function
   @Who:maneesh
   @When: 24Aug-2021
   @Why: EWM-2596
   @What: For Weightage Click event
  */
   clickWeightage(Id) {
    
    this.WeightageDataId = this.getWeightageType.filter((dl: any) => dl.Id == Id);
    this.WeightageIdData = this.WeightageDataId[0].Id;
    this.WeightageValue = this.WeightageDataId[0].Weightage;
  }

  
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 29-dec-2022
   @Why: EWM-10085
   @What: Remove whitespace
*/

noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}

