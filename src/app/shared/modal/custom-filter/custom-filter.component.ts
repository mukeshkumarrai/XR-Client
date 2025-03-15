/*
@(C): Entire Software
@Type: File, <ts>
@Name: custom-filter.component.ts
@Who: Anup Singh
@When: 08-Dec-2021
@Why: EWM-3959 EWM-3614
@What:  This page wil be used for common filter based on given endpoint
 */
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
//import { customDropdownConfig } from '../../../shared/datamodels';
//import { JobService } from '../../../shared/services/Job/job.service';


@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent implements OnInit {
 
  /*************************global variables decalre here ************************/
  filterForm: FormGroup;
  public filterOptions = [];
  public gridConfigArr: any[] = [];
  public Selectedcolumns: any[] = [];
  public selectedcolGrid: any[] = [];
  public colGrid: any[] = [];
  public loading: boolean;
  //public GridId: any = 'grid001';
  public showDateInput: boolean = false;
  public showOtherInput: boolean = true;
  public dateOpen = new Date();
  public clearFilterBtnEnable: boolean;
  public isSaveForClearBtn: boolean;
  @ViewChild('target') private myScrollContainer: ElementRef;
  public filterOptionsFilter: any[] = [];

  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";
  inputType: any;
  @Output() setFilterData = new EventEmitter();
   @Input() isShowFilter : boolean
  
  config: any = [];
  dropList: any = [];
  public keyValue: any = [];
  loader: boolean = false;
  multiDropDownData: any = [];
 // singleDropDownData: any = {};
  apiGateWayUrl:any;
  public isMultiple : boolean = true;
  @Input() dataFilterConfigure:any;
  @Input() GridId:any;
  constructor(  private fb: FormBuilder, private jobService: JobService, private snackBService: SnackBarService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private http: HttpClient, private commonserviceService: CommonserviceService) {
      this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;
     
      this.filterForm = this.fb.group({
      filterInfo: this.fb.array([])
    });

    
  }
  ngOnInit(): void {
    
    if (this.GridId !== undefined) {
      this.GridId = this.GridId;
    }

    this.http.get("assets/config/filter-config.json").subscribe(data => {
      this.filterOptions = JSON.parse(JSON.stringify(data));
    })
    this.getFilterConfig();

    if(this.isShowFilter===false){
      const control = <FormArray>this.filterForm.controls['filterInfo'];
      control.clear();
    }
  

  }

  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Anup Singh
  @When: 08-Dec-2021
  @Why: EWM-3959 EWM-3614
  @What: For getting the deafult config for the user
   */
  getFilterConfig() {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== null) {
            // this.gridConfigArr=repsonsedata.Data.GridConfig;
            this.gridConfigArr = repsonsedata.Data.GridConfig.filter(item => item.Filter == true);

            if (this.dataFilterConfigure !== null) {
              this.clearFilterBtnEnable = false;
              this.ArrayCompareAndMakeCombineArray(this.dataFilterConfigure, this.gridConfigArr);
              //  console.log('filterdata',this.data.filterObj);
            } else {
              this.clearFilterBtnEnable = true;
              this.filterInfo().push(this.createItem());
            }

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
  @Who: Anup Singh
  @When: 08-Dec-2021
  @Why: EWM-3959 EWM-3614
  @What: For filterinfo alias
   */

  filterInfo(): FormArray {
    return this.filterForm.get("filterInfo") as FormArray;
  }

  /*
 @Type: File, <ts>
 @Name: showFilter function
  @Who: Anup Singh
  @When: 08-Dec-2021
  @Why: EWM-3959 EWM-3614
 @What: For filterinfo alias
  */
  showFilter() {
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
 @Who: Anup Singh
 @When: 08-Dec-2021
 @Why: EWM-3959 EWM-3614
 @What: For mulitple create items row
  */

  createItem(): FormGroup {
    return this.fb.group({
      filterParam: [[], [Validators.required]],
      condition: [[], [Validators.required]],
      ParamValue: ['', Validators.required],
      DropDwonName: ['']
    });
  }

  /*
 @Type: File, <ts>
 @Name: onReset function
 @Who: Anup Singh
 @When: 08-Dec-2021
 @Why: EWM-3959 EWM-3614
 @What: clear the form array
  */

  onReset() {
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    this.clearFilterBtnEnable = true;
    this.isSaveForClearBtn = true;

    this.inputTypedata = [];
    this.config = [];
    this.dropList = [];
    this.keyValue = [];

    let filterdata = [];
    this.setFilterData.emit(filterdata);
   
  }

  /*
 @Type: File, <ts>
 @Name: onConfirm function
 @Who: Anup Singh
 @When: 09-Dec-2021
 @Why: EWM-3959 EWM-3614
 @What: For saving the persist data of user filter
  */
  onConfirm() {
    let filterdata = this.filterForm.value.filterInfo;
    this.setFilterData.emit(filterdata);
   // const control = <FormArray>this.filterForm.controls['filterInfo'];
   // control.clear();
  }

  /*
  @Who: Anup Singh
  @When: 08-Dec-2021
  @Why: EWM-3959 EWM-3614
   @What: to compare objects selected
 */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Field === c2.Field : c1 === c2;
  }

  /*
   @Type: File, <ts>
   @Name: ArrayCompareAndMakeCombineArray function
   @Who: Anup Singh
   @When: 09-Dec-2021
   @Why: EWM-3959 EWM-3614
   @What: filterConfig array and GridConfig array compare and GridConfig array data push in filterConfig array data in same index 
    */
  ArrayCompareAndMakeCombineArray(filterObj, gridData) {
    this.loading = true;
    // console.log(filterObj,"filterObj")
    let filterObjdata: any = [];
    for (let index = 0; index < filterObj.length; index++) {
      const element = filterObj[index];

      let data: any = gridData.filter((item) => {
        return (item.Type == element.ColumnType) && (item.Field == element.ColumnName)
      })
      filterObjdata.push(data[0]);
    }
    var combined = filterObj.map(function (item, index) {
      return {
        FilterValue: item.FilterValue, ColumnName: item.ColumnName, ColumnType: item.ColumnType, FilterCondition: item.FilterCondition, FilterOption: item.FilterOption,
        API: filterObjdata[index].API,
        APIKey: filterObjdata[index].APIKey,
        Label: filterObjdata[index].Label,
        Title: filterObjdata[index].Title,
        Type: filterObjdata[index].Type,
      };
    });

    //console.log(combined, "combined")
    for (let index = 0; index < combined.length; index++) {
      const element = combined[index];
      this.inputTypedata[index] = element.Type + index;
      this.getdropdownList(element, index, false)
    }

    setTimeout(() => {
      this.loading = false;
      this.patchFilters(combined)
    }, 3000);

  }

  /*
 @Type: File, <ts>
 @Name: patchFilters function
 @Who: Anup Singh
 @When: 09-Dec-2021
 @Why: EWM-3959 EWM-3614
 @What: For showing already the persist data of user filter
  */
  patchFilters(filterObj) {
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    for (let Index = 0; Index < filterObj.length; Index++) {
      const element = filterObj[Index];
      let col = { 'Field': element.ColumnName, 'Type': element.ColumnType };

      if (element.ColumnType === "DropDown") {
        let FilterData: any;
        let arrdropdown: any = [];
        FilterData = element.FilterValue.split(",");
        for (let index = 0; index < FilterData.length; index++) {
          const element = FilterData[index];
          let selectDropDown: any = this.dropList[Index].filter(item => item.Id == element)
          arrdropdown.push(selectDropDown[0]);
        }
        this.multiDropDownData[Index] = arrdropdown;

        // this.singleDropDownData = arrdropdown[0]
        //  console.log(this.singleDropDownData, Index,"multiDropDownData")
      }

      control.push(
        this.fb.group({
          filterParam: [col, [Validators.required]],
          condition: [element.FilterOption, [Validators.required]],
          ParamValue: [element.FilterValue, [Validators.required]],
          DropDwonName: ['']
        })
      )

    }
  }

  /*
  @Type: File, <ts>
  @Name: removeRow
   @Who: Anup Singh
   @When: 09-Dec-2021
   @Why: EWM-3959 EWM-3614
  @What: for removing the single row
  */
  removeRow(i: number) {
    this.filterInfo().removeAt(i);
  }

  /*
   @Type: File, <ts>
   @Name: filterConditionType
   @Who: Anup Singh
   @When: 08-Dec-2021
   @Why: EWM-3959 EWM-3614
   @What: for filtering filter condition type based on type selected
   */
  inputTypedata: any = [];
  filterConditionType(event: any, i: number) {
    //  this.filterOptionsFilter[i]=event;
    let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
    frmArray.get('condition').reset();
    frmArray.get('ParamValue').reset();
    this.filterOptionsFilter[i] = this.filterOptions.filter(x => x['Type'] === event.Type);
    this.inputType = event.Type;
    this.inputTypedata[i] = event.Type + i;

    this.getdropdownList(event, i, false)


    if (this.filterOptionsFilter[i].length > 0) {
      if (event.Type == 'Text') {
        frmArray.get('ParamValue').setValidators([Validators.required])
      } else if (event.Type == 'Numeric') {
        frmArray.get('ParamValue').setValidators([Validators.required, Validators.pattern(this.numberPattern)])
      } else if (event.Type == 'Number') {
        frmArray.get('ParamValue').setValidators([Validators.required, Validators.pattern(this.numberPattern)])
      } else {
        frmArray.get('ParamValue').setValidators([Validators.required])
      }
    }

  }


  /*
  @Type: File, <ts>
  @Name: getdropdownList function
  @Who: Anup Singh
  @When: 08-Dec-2021
  @Why: EWM-3959 EWM-3614
  @What: get drop down list on baisis of api endpoint recived
*/

  getdropdownList(value, index, loader) {
    this.loader = loader;
    this.multiDropDownData[index] = null;
    if (value != undefined && value != null && value != '') {
      this.config.splice(index, 0, value);
      this.keyValue.splice(index, 0, value.APIKey);
      if (value.Type === 'DropDown') {
        this.commonserviceService.getGenericDropdownList(this.apiGateWayUrl + value?.API).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loader = false;
              this.dropList[index] = repsonsedata.Data;
            }
          }, err => {
            this.loader = false;
            this.dropList[index] = [];
          })
      }
    }


  }

  /* 
@Type: File, <ts>
@Name: onDropdownDatachange function
@Who: Anup Singh
@When: 08-Dec-2021
@Why: EWM-3959 EWM-3614
@What: patch data for dropdowm for submit 
*/
  onDropdownDatachange(data: any, index) {
    const filterform = this.filterForm.get('filterInfo') as FormArray;
    if (data == undefined || data == null || data == "" || data.length == 0) {
      this.multiDropDownData[index] = null;
      filterform.at(index).patchValue({
        ParamValue: null
      })
    }
    else {
      if (data.length > 0) {
        this.multiDropDownData[index] = data;
        const Id = data.map((item: any) => {
          return item.Id
        });
        filterform.at(index).patchValue({
          ParamValue: Id.toString(),
        });
      } else {
        filterform.at(index).patchValue({
          ParamValue: (data.Id).toString(),
          DropDwonName: data[this.keyValue[index]],
        })
      }

    }
  }


  getUpdateOptions(value, Index) {
    this.getdropdownList(value, Index, true)
  }


  public IsEmptyNotEmpty:boolean = true;
  getValue(val: any, i: number){
    if(val=='IsNotEmpty' || val=='IsEmpty'){
      let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
       frmArray.get('ParamValue').reset();
       frmArray.get('ParamValue').disable();
       frmArray.get("ParamValue").clearValidators();
       frmArray.get("ParamValue").markAsPristine();
       this.IsEmptyNotEmpty = false;
    }else{
      let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
      frmArray.get('ParamValue').enable();
      frmArray.get("ParamValue").setErrors({ required: true });
      frmArray.get("ParamValue").markAsTouched();
      frmArray.get("ParamValue").markAsDirty();
      this.IsEmptyNotEmpty = true;
    }
    
  }

}
