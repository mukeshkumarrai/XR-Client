/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 10-Aug-2021
  @Why: EWM-2020 EWM-2363
  @What:  This page will be use for candidate landing page filter advanced Component ts file
*/
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-advanced-filter-candidate',
  templateUrl: './advanced-filter-candidate.component.html',
  styleUrls: ['./advanced-filter-candidate.component.scss']
})
export class AdvancedFilterCandidateComponent implements OnInit {
  /*************************global variables decalre here ************************/
  filterForm: FormGroup;
  public filterOptions = [];
  public gridConfigArr: any[] = [];
  public Selectedcolumns: any[] = [];
  public selectedcolGrid: any[] = [];
  public colGrid: any[] = [];
  public loading: boolean;
  public GridId: any = 'CandidateLanding_grid_001';
  public showDateInput: boolean = false;
  public showOtherInput: boolean = true;
  public dateOpen = new Date();
  public clearFilterBtnEnable: boolean;
  public isSaveForClearBtn: boolean;
  @ViewChild('target') private myScrollContainer: ElementRef;
  public filterOptionsFilter: any[] = [];
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AdvancedFilterCandidateComponent>,
    private fb: FormBuilder, private candidateService: CandidateService, private snackBService: SnackBarService,
    private translateService: TranslateService, private jobService: JobService, private http: HttpClient) {

    this.filterForm = this.fb.group({
      filterInfo: this.fb.array([])
    })
  if(data.gridId!==null || data.gridId!==undefined){
   this.GridId=data.gridId;
  }
    if (data.filterObj !== null) {
      this.clearFilterBtnEnable = false;
      this.patchFilters(data.filterObj);
    } else {
      this.clearFilterBtnEnable = true;
      this.filterInfo().push(this.createItem());
    }
  }

  ngOnInit(): void {
    this.http.get("assets/config/filter-config.json").subscribe(data => {
      this.filterOptions = JSON.parse(JSON.stringify(data));
    })
    this.getFilterConfig();
  }

  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: For getting the deafult config for the user
   */
  getFilterConfig() {
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== null) {
            this.gridConfigArr = repsonsedata.Data.GridConfig;
            if (repsonsedata.Data.GridConfig.length != 0) {
              this.selectedcolGrid = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
              this.colGrid = repsonsedata.Data.GridConfig.filter(x => x.Selected == false);
            }
          }
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
  @Name: filterInfo function
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: For filterinfo alias
   */

  filterInfo(): FormArray {
    return this.filterForm.get("filterInfo") as FormArray;
  }

  /*
 @Type: File, <ts>
 @Name: showFilter function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For filterinfo alias
  */
  showFilter(el) {
    this.filterInfo().push(this.createItem());
    this.clearFilterBtnEnable = false;
    this.isSaveForClearBtn = false;
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
 @Name: createItem function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For mulitple create items row
  */

  createItem(): FormGroup {
    return this.fb.group({
      filterParam: [[], [Validators.required]],
      condition: [[], [Validators.required]],
      ParamValue: ['', Validators.required]
    });
  }

  /*
 @Type: File, <ts>
 @Name: onReset function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: clear the form array
  */

  onReset() {
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    this.clearFilterBtnEnable = true;
    this.isSaveForClearBtn = true;
  }


  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What:losing the pop-up
  */
  onDismiss() {
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  /*
 @Type: File, <ts>
 @Name: onConfirm function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For saving the persist data of user filter
  */
  onConfirm() {
    let filterdata = this.filterForm.value.filterInfo;
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: filterdata }); }, 200);
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
  }

  /*
   @Who: Renu
   @When: 10-Aug-2021
   @Why: ROST-2363
   @What: to compare objects selected
 */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Field === c2.Field : c1 === c2;
  }

  /*
   @Type: File, <ts>
   @Name: patchFilters function
   @Who: Renu
   @When: 10-Aug-2021
   @Why: ROST-2363
   @What: For showing already the persist data of user filter
    */

  patchFilters(filterObj) {
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    filterObj.forEach((x) => {
      let col = { 'Field': x.ColumnName, 'Type': x.ColumnType };
      control.push(
        this.fb.group({
          filterParam: [col, [Validators.required]],
          condition: [x.FilterOption, [Validators.required]],
          ParamValue: [x.FilterValue, [Validators.required]]
        })
      )
    })
  }

  /*
  @Type: File, <ts>
  @Name: removeRow
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: for removing the single row
  */
  removeRow(i: number) {
    this.filterInfo().removeAt(i);
  }


  /*
   @Type: File, <ts>
   @Name: filterConditionType
   @Who: Renu
   @When: 20-Sep-2021
   @Why: ROST-2896
   @What: for filtering filter condition type based on type selected
   */

  filterConditionType(event: any, i: number) {
    //  this.filterOptionsFilter[i]=event;
    let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
    frmArray.get('condition').reset();
    frmArray.get('ParamValue').reset();
    this.filterOptionsFilter[i] = this.filterOptions.filter(x => x['Type'] === event.Type);

    if (event.Type == 'Text') {
      frmArray.get('ParamValue').setValidators([Validators.required])
    } else if (event.Type == 'Numeric') {
      frmArray.get('ParamValue').setValidators([Validators.required, Validators.pattern(this.numberPattern)])
    } else {
      frmArray.get('ParamValue').setValidators([Validators.required])
    }
  }
 /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date 
     */
    clearEndDate(e){
      this.filterForm.patchValue({
        ParamValue: null
      });
    }
}
