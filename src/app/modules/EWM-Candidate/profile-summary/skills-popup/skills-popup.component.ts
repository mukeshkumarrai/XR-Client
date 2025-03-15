/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup singh
  @When: 13-Aug-2021
  @Why: EWM-2242.EWM-2506
  @What:  This page will be use for the skills popup Component ts file
*/

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleService } from 'src/app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-skills-popup',
  templateUrl: './skills-popup.component.html',
  styleUrls: ['./skills-popup.component.scss']
})
export class SkillsPopupComponent implements OnInit {

  skillsForm: FormGroup;
  actionType: any;
  candidateId: any;
  loading: boolean = false;
  skillsListData: any = [];
  @ViewChild('target') private myScrollContainer: ElementRef;
  public dropDoneConfig: customDropdownConfig[] = [];
  toggleData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  public selectedSkillType: any = {};
  public sortingValue: string = "SkillName,asc";
  public sortedcolumnName: string = 'Order';
  public pageNo: number = 1;
  public pageSize: number = 200;
  searchVal: string = 'Active';
  editData: any = [];
  constructor(public dialogRef: MatDialogRef<SkillsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private countryMasterService: CountryMasterService, public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private profileInfoService: ProfileInfoService, private quickpeopleService: QuickpeopleService,
    public _GeneralInformationService: GeneralInformationService, private router: ActivatedRoute, private serviceListClass: ServiceListClass) {

    this.candidateId = this.data.candidateId;

    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getAllSkillsList + '?search=Active';
    this.dropDoneConfig['placeholder'] = 'candidate_skils';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/skills';
    this.dropDoneConfig['IsRequired'] = true;
    this.dropDoneConfig['bindLabel'] = 'SkillName';
    this.dropDoneConfig['multiple'] = false;

    this.skillsForm = this.fb.group({
      skillsData: this.fb.array([this.createSkills()])
    })



    /* this.skillsForm.get('skillsData').valueChanges.subscribe(res=>{
       console.log("res ",res);
     })*/

  }

  ngOnInit(): void {
    this.actionType = this.data.actionType;
    this.getAllSkills();
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }

  /*
    @Type: File, <ts>
    @Name: createSkills
    @Who: Anup singh
    @When: 13-Aug-2021
    @Why: EWM-2242.EWM-2506
    @What: when user click on add to create form group with same formcontrol
    */

  createSkills(): FormGroup {
    return this.fb.group({
      SkillsId: [],
      SkillName: [[], [Validators.required, RxwebValidators.unique()]],
      Rating: [1],
      CandidateId: [this.candidateId]

    });
  }

  /*
  @Type: File, <ts>
  @Name: skillsInfo
  @Who: Anup singh
  @When: 13-Aug-2021
  @Why: EWM-2242.EWM-2506
  @What: for getting the formarray with this instance
  */

  skillsInfo(): FormArray {
    return this.skillsForm.get("skillsData") as FormArray
  }

  /*
    @Type: File, <ts>
    @Name: addSkillsRow
    @Who: Anup singh
    @When: 13-Aug-2021
    @Why: EWM-2242.EWM-2506
    @What: on add mulitple row
    */

  addSkillsRow(el) {
    this.skillsInfo().push(this.createSkills());
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);
  }

  /*
   @Type: File, <ts>
   @Name: removeRow
    @Who: Anup singh
    @When: 13-Aug-2021
    @Why: EWM-2242.EWM-2506
   @What: for removing the single row
   */
  removeRow(i: number) {
    this.skillsInfo().removeAt(i);  
  }


  /*
  @Type: File, <ts>
  @Name: confirmDialog
   @Who: Anup singh
   @When: 16-Aug-2021
   @Why: EWM-2242.EWM-2506
  @What: for removing the single row with dilog box of delete
  */
  result: any;
  confirmDialog(i): void {
    const message = `label_titleDialogContent`;
    const subtitle = 'candidate_skils';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    this.loading = true;
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = false;
        this.skillsInfo().removeAt(i);
      } else {
        this.loading = false;
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });
  }



  /*
   @Type: File, <ts>
   @Name: onDismiss
    @Who: Anup singh
    @When: 13-Aug-2021
    @Why: EWM-2242.EWM-2506
   @What: for close popup
   */
  onDismiss(): void {
    const editFormArray = this.skillsForm.get("skillsData") as FormArray;
    editFormArray.clear();
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }

  /*
    @Type: File, <ts>
    @Name: getAllSkills function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: get AllSkills List
    */
  getAllSkills() {
    this.loading = true;
    this.candidateService.getAllSkillsData('?CandidateId=' + this.candidateId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.editData = repsonsedata.Data;
          if (this.actionType == 'edit') {
            this.patchValueInFormArray();
          }
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
     @Type: File, <ts>
     @Name: patchValueInFormArray function
     @Who: Anup
     @When: 16-Aug-2021
     @Why: EWM-2242.EWM-2507
     @What: patch Value In FormArray
     */
  patchValueInFormArray() {
    const editFormArray = this.skillsForm.get("skillsData") as FormArray;
    editFormArray.clear();
    this.editData.forEach((element, key) => {
      let data = { Id: element.SkillsId, SkillName: element.SkillName, BtnId: null, HideExternal: 1, StatusName: "Active", Status: 1, LastUpdated: "", PageName: null };
      editFormArray.push(
        this.fb.group({
          SkillsId: [element.SkillsId],
          SkillName: [data, [Validators.required, RxwebValidators.unique()]],
          Rating: [element.Rating],
          CandidateId: [element.CandidateId]
        })
      );
      this.selectedSkillType[key] = data;
      this.onSkillTypechange(data, key);
    });
  }


  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Anup
     @When: 16-Aug-2021
     @Why: EWM-2242.EWM-2507
     @What: Submit Skills Data
     */
  onConfirm(): void {
    if (this.skillsForm.invalid) {
      return;
    }
    if (this.actionType == 'add') {
      this.addSkills();
    } else {
      this.updateSkills();
    }
  }

  /*
     @Type: File, <ts>
     @Name: addSkills function
     @Who: Anup
     @When: 16-Aug-2021
     @Why: EWM-2242.EWM-2507
     @What:Add Skills List
     */
  addSkills() {
    this.loading = true;
    this.candidateService.addSkillsData(this.skillsForm.value.skillsData).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getAllSkills();
          document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
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
     @Name: updateSkills function
     @Who: Anup
     @When: 16-Aug-2021
     @Why: EWM-2242.EWM-2507
     @What: Update Skills List
     */

  updateSkills() {
    this.loading = true;
    let updateObj = {
      "From": this.editData,
      "To": this.skillsForm.value.skillsData,
    };
    this.candidateService.updateSkillsData(updateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getAllSkills();
          document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
    @Name: onDegreeTypechange
    @Who: Suika
    @When: 18-Aug-2021
    @Why: EWM-2243
    @What: when realtion drop down changes 
  */

  onSkillTypechange(data, index) {
    const editFormArray = this.skillsForm.get("skillsData") as FormArray;
    if (data == null || data == "") {
      editFormArray.at(index).get('skillName').setErrors({ required: true });
      editFormArray.at(index).get('skillName').markAsTouched();
      editFormArray.at(index).get('skillName').markAsDirty();
    }
    else {
      this.selectedSkillType[index] = data;
      editFormArray.at(index).patchValue({
        SkillsId: data.Id,
        SkillName: data.SkillName
      });


      //this.onNameChanges(data.Id,data.SkillName,index);

    }
  }
  checkValue(value, arr) {
    var status = 0;

    for (var i = 0; i < arr.length; i++) {
      var name = arr[i]['SkillName'];
     // console.log("name", name);
      if (name == value) {
        status = 1;
        break;
      }
    }

    return status;
  }


  /*
    @Type: File, <ts>
    @Name: onNameChanges function
    @Who:  Suika
    @When: 13-May-2021
    @Why: EWM-1506
    @What: This function is used for checking duplicacy for code
    */
  onNameChanges(data, index) {
    let indexExist = 0;
    const editFormArray = this.skillsForm.get("skillsData") as FormArray;
    editFormArray.at(index).patchValue({
      SkillsId: data.Id,
      SkillName: data.SkillName
    });
    if (this.actionType == 'edit') {
      indexExist = this.checkValue(data.SkillName, this.editData);
    }
    let skillarr = {};
    skillarr['SkillsName'] = data.SkillName;
    skillarr['Id'] = data.SkillsId;
    skillarr['CandidateId'] = this.candidateId;
    if (data.skillName != '' && indexExist != 1) {
      const editFormArray = this.skillsForm.get("skillsData") as FormArray;
      this.systemSettingService.checkcandidateSkillsDuplicay(skillarr).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              editFormArray.at(index).get('SkillName').setErrors({ nameTaken: true });
              editFormArray.at(index).get('SkillName').markAsTouched();
              editFormArray.at(index).get('SkillName').markAsDirty();
            }
          } else if (repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              editFormArray.at(index).get('SkillName').clearValidators();
              editFormArray.at(index).get('SkillName').markAsPristine();
              editFormArray.at(index).get('SkillName').setValidators([Validators.required, RxwebValidators.unique()]);
            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            editFormArray.at(index).get('SkillName').clearValidators();
            editFormArray.at(index).get('SkillName').markAsPristine();
            editFormArray.at(index).get('SkillName').setValidators([Validators.required, RxwebValidators.unique()]);

          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
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
    else {
      editFormArray.at(index).get('SkillName').setValidators([Validators.required, RxwebValidators.unique()]);

    }
    editFormArray.at(index).get('SkillName').updateValueAndValidity();
  }



  /*
  @Type: File, <ts>
  @Name: skillsList function
  @Who: Suika
  @When: 07-September-2021
  @Why: ROST-2693
  @What: service call for get list for skills data
  */

  skillsList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.systemSettingService.getskillsList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.skillsListData = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode == '204') {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']); 
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }


  redirect() {
    window.open('./client/core/administrators/skills', '_blank');
  }

  getUpdateOptions() {
    this.loading = true;
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }
}
