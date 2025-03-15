/* 
  @(C): Entire Software
  @Type: File, <scss>
  @Who: Renu
  @When: 06-Oct-2022
  @Why: EWM-8902 EWM-9112
  @What:  This page will be use for the section configure Component

*/

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-section-configure',
  templateUrl: './section-configure.component.html',
  styleUrls: ['./section-configure.component.scss']
})
export class SectionConfigureComponent implements OnInit {

  public sectionArr: any[] = [];
  public loading: boolean = false;
  sectionForm: FormGroup;
  public submitted: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private fb: FormBuilder,
    public dialogRef: MatDialogRef<SectionConfigureComponent>, private snackBService: SnackBarService, private translateService: TranslateService,
    public jobService: JobService) {
    this.sectionArr = this.data.configureList;
    this.sectionForm = this.fb.group({
      sectionInfo: this.fb.array([this.createSection()])
    })
  }

  ngOnInit(): void {
    this.sectionPatch();

  }
  sectionPatch() {
    const control = <FormArray>this.sectionForm.controls['sectionInfo'];
    control.clear();
    if (this.sectionArr.length > 0) {
      this.sectionArr.forEach((x) => {
        control.push(
          this.fb.group({
            Id: [x['Id']],
            Title: [x['Title'], [Validators.required, Validators.maxLength(50), RxwebValidators.unique(), this.uniqueValidator(this.sectionForm)]],
            PageName: [x['PageName']],
            DisplaySequence: [x['DisplaySequence']]
          })
        );
      });
    }
  }

  /*
 @Type: File, <ts>
 @Name: createSection
 @Who: Renu
 @When: 08-Oct-2022
 @Why: ROST-8902 ROST-9112
 @What: when user click on add to create form group with same formcontrol
 */
  createSection(): FormGroup {
    return this.fb.group({
      Id: [''],
      Title: ['', [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],
      PageName: [],
      DisplaySequence: []
    });
  }

  /*
     @Type: File, <ts>
     @Name: sectionInfo
     @Who: Renu
    @When: 08-Oct-2022
     @Why: ROST-8902 ROST-9112
     @What: for getting the formarray with this instance
     */
  sectionInfo(): FormArray {
    return this.sectionForm.get("sectionInfo") as FormArray
  }

  /*
 @Type: File, <ts>
 @Name: dropLeft function
 @Who: Renu
 @When: 06-oct-2021
 @Why: EWM-8902 EWM-9112
 @What: drop sections
 */
  dropSection(event: CdkDragDrop<string[]>) {
    this.moveItemInArrayIfAllowed(
      this.sectionArr,
      event.previousIndex,
      event.currentIndex
    );
    // moveItemInArray(this.sectionArr, event.previousIndex, event.currentIndex);
    this.sectionArr.forEach((element, index) => {
      element['DisplaySequence'] = index + 1;
    });
    this.sectionPatch();
    this.submitted = true;
  }
  /*
@Type: File, <ts>
@Name: moveItemInArrayIfAllowed function
@Who: Renu
@When: 05-Dec-2022
@Why: EWM-8902 EWM-9112
@What: drop sections
*/
  private moveItemInArrayIfAllowed(array: any[], fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, array.length - 1);
    const to = this.clamp(toIndex, array.length - 1);

    if (from === to) {
      return;
    }

    const target = array[from];
    const delta = to < from ? -1 : 1;
    const affectedItems = array.filter((item, index) =>
      delta > 0 ? index >= from && index <= to : index >= to && index <= from
    );
    if (affectedItems.some((i) => i.IsToggled === 0 ? true : false)) {
      return;
    }
    for (let i = from; i !== to; i += delta) {
      array[i] = array[i + delta];
    }
    array[to] = target;
  }

  private clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }


  /*
 @Type: File, <ts>
 @Name: onSave function
 @Who: Renu
 @When: 04-oct-2021
 @Why: EWM-3088 EWM-3138
 @What: save data after drag and drop
 */
  onSave() {
    this.loading = true;
    setTimeout(() => {
      if (this.submitted == true) {
        this.saveWelcomePageData();
        //this.loading=true;
      } else {
        this.loading = false;
      }
    }, 1500);

  }

  /*
 @Type: File, <ts>
 @Name: saveWelcomePageData function
 @Who: Renu
 @When: 04-oct-2021
 @Why: EWM-3088 EWM-3138
 @What: save data after drag and drop
 */
  saveWelcomePageData() {
    this.loading = true;
    let SectionConf = {};
    SectionConf['ApplicationFormId'] = this.sectionArr[0]?.ApplicationFormId;
    SectionConf['Titles'] = this.sectionForm.value.sectionInfo;
    this.jobService.sectionUpdate(SectionConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.submitted = false;
          document.getElementsByClassName("candidateConfigureDashboard")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("candidateConfigureDashboard")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.submitted = false;
        }
      }, err => {
        this.loading = false;
        this.submitted = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Renu
  @When: 06-oct-2021
  @Why: EWM-8902 EWM-9112
  @What: For closing popup
  */

  onDismiss(): void {
    this.submitted = false;
    document.getElementsByClassName("candidateConfigureDashboard")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateConfigureDashboard")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  /*
  @Type: File, <ts>
  @Name: checkforSectionTitle function
  @Who: Renu
  @When: 06-oct-2021
  @Why: EWM-8902 EWM-9112
  @What: For checking duplicacy check
  */

  checkforSectionTitle(titleVal: string, Id: number, index: number) {
    const FormArray = this.sectionForm.get("sectionInfo") as FormArray;
    let obj = {};
    obj['Id'] = Id;
    obj['ApplicationFormId'] = this.sectionArr[0]?.ApplicationFormId;
    obj['Value'] = titleVal;
    this.jobService.sectionCheck(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          FormArray.at(index).get('Title').setErrors({ nameTaken: true });
          FormArray.at(index).get('Title').markAsTouched();
          FormArray.at(index).get('Title').markAsDirty();
          this.loading = false;
          this.submitted = false;
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.submitted = true;
          FormArray.at(index).get("Title").clearValidators();
          FormArray.at(index).get("Title").markAsPristine();
          FormArray.at(index).get('Title').setValidators([Validators.required, Validators.maxLength(50), RxwebValidators.unique(), this.uniqueValidator(this.sectionForm)]);
          this.loading = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.submitted = false;
        }
      }, err => {
        this.loading = false;
        this.submitted = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

   /*
  @Type: File, <ts>
  @Name: custom validator for unique section name
  @Who: Bantee
  @When: 23-Jan-2023
  @Why: EWM-9255 EWM-9306
  @What: For checking duplicacy check
  */
  uniqueValidator(form): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
                
      if (form.value.sectionInfo.filter(v => v.Title.toLowerCase().trim() === control.value.toLowerCase().trim()).length > 1) {
        return {
          notUnique: true
        };
      } else {
        return null;
      }
    }
  }
}



