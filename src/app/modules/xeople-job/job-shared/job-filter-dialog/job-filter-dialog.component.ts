/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 19-July-2021
  @Why: EWM-2086
  @What:  This page will be use for Job filter popup page Component ts file
*/
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ResponceData, ButtonTypes } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-job-filter-dialog',
  templateUrl: './job-filter-dialog.component.html',
  styleUrls: ['./job-filter-dialog.component.scss'],
})
export class JobFilterDialogComponent implements OnInit {
  /*************************global variables decalre here ************************/
  filterForm: FormGroup;
  public filterOptions = [];
  public gridConfigArr: any[] = [];
  public Selectedcolumns: any[] = [];
  public selectedcolGrid: any[] = [];
  public colGrid: any[] = [];
  public loading: boolean;
  public GridId: any = 'grid001';
  public showDateInput: boolean = false;
  public showOtherInput: boolean = true;
  public dateOpen = new Date();
  public clearFilterBtnEnable: boolean;
  public isSaveForClearBtn: boolean;
  public WorkflowId: string = '';
  @ViewChild('target') private myScrollContainer: ElementRef;
  public filterOptionsFilter: any[] = [];
  public numberPattern = '^[0-9]*$';
  public specialcharPattern = '^[a-z A-Z]+$';
  inputType: any;
  public IsEmptyNotEmpty: any[0] = [true];
  config: any = [];
  dropList: any = [];
  public keyValue: any = [];
  loader: boolean = false;
  multiDropDownData: any = [];
  // singleDropDownData: any = {};
  apiGateWayUrl: any;
  public isMultiple: boolean = true;
  isStatus: boolean = false;
  animationVar: any;
  isFilter: boolean = false;
  dateFormat: any;
  getDateFormat: any;
  public groupId: string;
  public employeeGroupId: string;
  public candidateGroupId: string;
  searchSubject$ = new Subject<any>();
  search = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JobFilterDialogComponent>,
    private fb: FormBuilder,
    private jobService: JobService,
    private snackBService: SnackBarService,
    private appSettingsService: AppSettingsService,
    private translateService: TranslateService,
    private http: HttpClient,
    private commonserviceService: CommonserviceService
  ) {
    this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;
    // who;maneesh,what:ewm-11422  fixed groupid for employee section filter  ,when:27/06/2023;
    this.employeeGroupId = this.appSettingsService.employeeID;
    this.candidateGroupId = this.appSettingsService.candidateID;

    if (data.GridId !== undefined) {
      this.GridId = data.GridId;
    }
    if (data.workflowId != undefined) {
      this.WorkflowId = data.workflowId;
    }

    if (data.isFilter != undefined) {
      this.isFilter = true;
    } else {
      this.isFilter = false;
    }
    // who;maneesh,what:ewm-11422  fixed groupid for employee section filter  ,when:27/06/2023;
    if (data.groupName == 'people') {
      this.groupId = this.employeeGroupId;
    } else {
      this.groupId = this.candidateGroupId;
    }
    // if(data.isMultiple!=undefined){
    //  this.isMultiple = data.isMultiple;
    // }
    this.filterForm = this.fb.group({
      filterInfo: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.http.get('assets/config/job-filter-config.json').subscribe((data) => {
      this.filterOptions = JSON.parse(JSON.stringify(data));
    });
    
    this.getFilterConfig();
    this.animationVar = ButtonTypes;
    this.dateFormat = localStorage.getItem('DateFormat');
    this.searchSubject$.pipe(debounceTime(1000)).subscribe((val) => {
      this.searchData(val);
    });
  }

  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2087
  @What: For getting the deafult config for the user
   */
  getFilterConfig() {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (
          repsonsedata.HttpStatusCode === 200 ||
          repsonsedata.HttpStatusCode === 204
        ) {
          this.loading = false;
          if (repsonsedata.Data !== null) {
            // this.gridConfigArr=repsonsedata.Data.GridConfig;
            this.gridConfigArr = repsonsedata.Data.GridConfig.filter(
              (item) => item.Filter == true
            );

            if (repsonsedata.Data?.FilterConfig !== null) {
              this.clearFilterBtnEnable = false;
              this.ArrayCompareAndMakeCombineArray(
                repsonsedata.Data?.FilterConfig,
                this.gridConfigArr
              );
            } else {
              this.clearFilterBtnEnable = true;
              this.filterInfo().push(this.createItem());
            }

            if (repsonsedata.Data.GridConfig?.length != 0) {
              this.selectedcolGrid = repsonsedata.Data.GridConfig.filter(
                (x) => x.Selected == true
              );
              this.colGrid = repsonsedata.Data.GridConfig.filter(
                (x) => x.Selected == false
              );
            }
          }
        } else {
          this.snackBService.showErrorSnackBar(
            this.translateService.instant(repsonsedata.Message),
            repsonsedata.HttpStatusCode
          );
          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(
          this.translateService.instant(err.Message),
          err.StatusCode
        );
      }
    );
  }

  /*
  @Type: File, <ts>
  @Name: filterInfo function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2087
  @What: For filterinfo alias
   */

  filterInfo(): FormArray {
    return this.filterForm.get('filterInfo') as FormArray;
  }

  /*
 @Type: File, <ts>
 @Name: showFilter function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For filterinfo alias
  */
  showFilter(el) {
    this.filterInfo().push(this.createItem());
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    this.IsEmptyNotEmpty[control.controls?.length - 1] = true;
    this.clearFilterBtnEnable = false;
    this.isSaveForClearBtn = false;
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 0);
  }

  /*
 @Type: File, <ts>
 @Name: createItem function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For mulitple create items row
  */

  createItem(): FormGroup {
    return this.fb.group({
      filterParam: [[], [Validators.required]],
      condition: [[], [Validators.required]],
      ParamValue: ['', [Validators.required, Validators.maxLength(50)]],
      DropDwonName: ['', [this.filterValidator()]],
    });
  }

  /*
 @Type: File, <ts>
 @Name: onReset function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
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
    document
      .getElementsByClassName('add_filterdialog')[0]
      .classList.remove('animate__zoomIn');
    document
      .getElementsByClassName('add_filterdialog')[0]
      .classList.add('animate__zoomOut');
    setTimeout(() => {
      this.dialogRef.close({ data: filterdata });
    }, 200);
    // const control = <FormArray>this.filterForm.controls['filterInfo'];
    // control.clear();
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById('main-comp').classList.remove('is-blurred');
    }
  }

  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What:losing the pop-up
  */
  onDismiss() {
    document
      .getElementsByClassName('add_filterdialog')[0]
      .classList.remove('animate__zoomIn');
    document
      .getElementsByClassName('add_filterdialog')[0]
      .classList.add('animate__zoomOut');
    setTimeout(() => {
      this.dialogRef.close(false);
    }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById('main-comp').classList.remove('is-blurred');
    }
  }
  /*
 @Type: File, <ts>
 @Name: onConfirm function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For saving the persist data of user filter
  */
  onConfirm() {
    let filterdata = this.filterForm.value.filterInfo;
    document
      .getElementsByClassName('add_filterdialog')[0]
      .classList.remove('animate__zoomIn');
    document
      .getElementsByClassName('add_filterdialog')[0]
      .classList.add('animate__zoomOut');
    setTimeout(() => {
      this.dialogRef.close({ data: filterdata });
    }, 200);
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById('main-comp').classList.remove('is-blurred');
    }
  }

  /*
  @Type: File, <ts>
  @Name: add remove animation function
  @Who: Satya Prakash Gupta
  @When: 25-Jul-2022
  @Why: NA
  @What: add and remove animation
   */

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName);
  }

  /*
   @Who: Renu
   @When: 28-june-2021
   @Why: EWM-1895
   @What: to compare objects selected
 */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Field === c2.Field : c1 === c2;
  }

  /*
   @Type: File, <ts>
   @Name: ArrayCompareAndMakeCombineArray function
   @Who: Anup
   @When: 12-Oct-2021
   @Why: EWM-3045 EWM-3289
   @What: filterConfig array and GridConfig array compare and GridConfig array data push in filterConfig array data in same index
    */
  ArrayCompareAndMakeCombineArray(filterObj, gridData) {    
    this.loading = true;
    // console.log(filterObj,"filterObj")
    let filterObjdata: any = [];
    for (let index = 0; index < filterObj?.length; index++) {
      const element = filterObj[index];

      let data: any = gridData.filter((item) => {
        return (
          item.Type == element.ColumnType && item.Field == element.ColumnName
        );
      });
      filterObjdata.push(data[0]);
    }
    var combined = filterObj.map(function (item, index) {
      return {
        FilterValue: item.FilterValue,
        ColumnName: item.ColumnName,
        ColumnType: item.ColumnType,
        FilterCondition: item.FilterCondition,
        FilterOption: item.FilterOption,
        API: filterObjdata[index]?.API,
        APIKey: filterObjdata[index]?.APIKey,
        Label: filterObjdata[index]?.Label,
        Title: filterObjdata[index]?.Title,
        Type: filterObjdata[index]?.Type,
        IsMultiple: filterObjdata[index]?.IsMultiple,
      };
    });

    //console.log(combined, "combined")
    for (let index = 0; index < combined?.length; index++) {
      const element = combined[index];
      this.inputTypedata[index] = element.Type + index;
      this.getdropdownList(element, index, false);
    }

    setTimeout(() => {
      this.loading = false;
      this.patchFilters(combined);
    }, 1500);
  }

  /*
 @Type: File, <ts>
 @Name: patchFilters function
 @Who: Anup Singh
 @When: 12-Oct-2021
 @Why: EWM-3045 EWM-3289
 @What: For showing already the persist data of user filter
  */
  patchFilters(filterObj) {
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    for (let Index = 0; Index < filterObj?.length; Index++) {
      const element = filterObj[Index];
      let col = { Field: element.ColumnName, Type: element.ColumnType };
      control.push(
        this.fb.group({
          filterParam: [col, [Validators.required]],
          condition: [element.FilterOption, [Validators.required]],
          ParamValue: [
            element.FilterValue,
            [Validators.required, Validators.maxLength(50)],
          ],
          DropDwonName: ['', [this.filterValidator()]],
        })
      );
      if (element.ColumnType === 'DropDown') {
        let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(
          Index
        ) as FormArray;
        frmArray.get('ParamValue').setValidators([Validators.required]);
        //console.log("dropList",this.dropList)
        let FilterData: any;
        let arrdropdown: any = [];
        FilterData = element.FilterValue.split(',');
        for (let index = 0; index < FilterData?.length; index++) {
          const element = FilterData[index];
          let selectDropDown: any = this.dropList[Index].filter(
            (item) => item.Id == element
          );
          arrdropdown.push(selectDropDown[0]);
        }
        //console.log("arrdropdown",arrdropdown)
        this.multiDropDownData[Index] = arrdropdown;
        // this.singleDropDownData = arrdropdown[0]
        //console.log(this.multiDropDownData[Index][0], Index,"multiDropDownData")
      }

      this.getValue(element.FilterOption, Index);

      this.filterOptionsFilter[Index] = this.filterOptions.filter(
        (x) => x['Type'] == element?.Type
      );
      // this.filterConditionType(element,Index);
      //console.log("this.isMultipl",this.isMultiple);
      // console.log("this.multiDropDownData",this.multiDropDownData[Index])
      if (
        this.isMultiple == false &&
        this.multiDropDownData[Index] &&
        this.multiDropDownData[Index] != null
      ) {
        this.onDropdownDatachange(this.multiDropDownData[Index][0], Index);
      }
    }
    //console.log("dkkddk",this.filterForm)
  }

  /*
  @Type: File, <ts>
  @Name: removeRow
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
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
  inputTypedata: any = [];
  filterConditionType(event: any, i: number) {
    //  this.filterOptionsFilter[i]=event;
    let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(
      i
    ) as FormArray;
    frmArray.get('condition').reset();
    frmArray.get('ParamValue').reset();
    frmArray.get('DropDwonName').reset();
    this.filterOptionsFilter[i] = this.filterOptions.filter(
      (x) => x['Type'] == event?.Type
    ); 
    //by maneesh,when:20/05/2024 what:17078 start
    frmArray
      .get('condition')
      .setValue(
        this.filterOptionsFilter[i][0]['name']
      ); 
    //by maneesh,when:20/05/2024 what:17078 end

    this.inputType = event?.Type;
    //<!---------@When: 30-03-2023 @who:Bantee @why: EWM-11225 --------->

    this.inputTypedata[i] = undefined;

    //this.inputTypedata=[...this.inputTypedata]
    this.getdropdownList(event, i, false);

    if (this.filterOptionsFilter[i]?.length > 0) {
      if (event.Type == 'Text') {
        frmArray
          .get('ParamValue')
          .setValidators([Validators.required, Validators.maxLength(50)]);
        // <!-----@suika @whn 14-03-2023 @whyEWM-11181  dynamic date filter validation---------->
      } else if (event.Type == 'Date') {
        frmArray
          .get('ParamValue')
          .setValidators([
            Validators.required,
            Validators.maxLength(50),
            CustomValidatorService.dateValidator,
          ]);
      } else if (event.Type == 'Numeric') {
        frmArray
          .get('ParamValue')
          .setValidators([
            Validators.required,
            Validators.pattern(this.numberPattern),
            Validators.maxLength(50),
          ]);
      } else if (event.Type == 'Number') {
        frmArray
          .get('ParamValue')
          .setValidators([
            Validators.required,
            Validators.pattern(this.numberPattern),
            Validators.maxLength(50),
          ]);
      } else {
        frmArray
          .get('ParamValue')
          .setValidators([Validators.required, Validators.maxLength(50)]);
      }
    }

    setTimeout(() => {
      this.inputTypedata[i] = event?.Type + i;
    }, 0);
  }

  /*
  @Type: File, <ts>
  @Name: getdropdownList function
  @Who: Anup
  @When: 11-Oct-2021
  @Why: EWM-3045 EWM-3268
  @What: get drop down list on baisis of api endpoint recived
*/

  getdropdownList(value, index, loader) {
    this.loader = loader;
    this.multiDropDownData[index] = null;
    if (value != undefined && value != null && value != '') {
      this.config?.splice(index, 0, value);
      this.keyValue?.splice(index, 0, value?.APIKey);
       this.isMultiple = true;
      if (value?.Field == 'StatusName') {
        this.isStatus = true;
      } else {
        this.isStatus = false;
      }
      if (value?.Type === 'DropDown') {
        let apiObj = '';
        if (value?.Field == 'JobTitle') {
          apiObj =
            this.apiGateWayUrl + value?.API + '?WorkflowId=' + this.WorkflowId;
        } else {
          apiObj = this.apiGateWayUrl + value?.API;
        }
        this.commonserviceService.getGenericDropdownList(apiObj).subscribe(
          (repsonsedata: ResponceData) => {
            if (
              repsonsedata.HttpStatusCode === 200 ||
              repsonsedata.HttpStatusCode === 204
            ) {
              this.loader = false;
              this.dropList[index] = repsonsedata.Data;
            }
          },
          (err) => {
            this.loader = false;
            this.dropList[index] = [];
          }
        );
      }
    }
  }

  /*
@Type: File, <ts>
@Name: onDropdownDatachange function
@Who: Anup
@When: 11-oct-2021
@Why: EWM-3045 EWM-3268
@What: patch data for dropdowm for submit
*/
  onDropdownDatachange(data: any, index) {
    let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(
      index
    ) as FormArray;
    const filterform = this.filterForm.get('filterInfo') as FormArray;
    // console.log("filterform",frmArray);
    frmArray.get('ParamValue').setValidators([Validators.required]);
    if (data == undefined || data == null || data == '' || data?.length == 0) {
      this.multiDropDownData[index] = null;
      filterform.at(index).patchValue({
        ParamValue: null,
      });
    } else {
      if (data?.length > 0) {
        this.multiDropDownData[index] = data;
        const Id = data.map((item: any) => {
          return item.Id;
        });

        filterform.at(index).patchValue({
          ParamValue: Id.toString(),
        });
      } else {
        filterform.at(index).patchValue({
          ParamValue: data.Id.toString(),
          DropDwonName: data[this.keyValue[index]],
        });
      }
    }
  }

  getUpdateOptions(value, Index) {
    this.getdropdownList(value, Index, true);
  }

  getValue(val: any, i: number) {
    if (val == 'IsNotEmpty' || val == 'IsEmpty') {
      let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(
        i
      ) as FormArray;
      frmArray.get('ParamValue').reset();
      frmArray.get('ParamValue').disable();
      frmArray.get('ParamValue').clearValidators();
      frmArray.get('ParamValue').markAsPristine();
      this.IsEmptyNotEmpty[i] = false;
    } else {
      let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(
        i
      ) as FormArray;
      frmArray.get('ParamValue').enable();
      if (frmArray.get('ParamValue').value == null) {
        frmArray.get('ParamValue').reset();
        frmArray.get('ParamValue').setErrors({ required: true });
        // frmArray.get("ParamValue").markAsTouched();
        // frmArray.get("ParamValue").markAsDirty();
      }

      this.IsEmptyNotEmpty[i] = true;
    }
    const filterform = this.filterForm.get('filterInfo') as FormArray;
  }

  /*
@Type: File, <ts>
@Name: redirect function
@Who: Adarsh
@When: 30-Mar-2022
@Why: EWM-5654 EWM-5899
@What: redirect on master data while click on manage in dropdown
*/
  redirect() {
    // who;maneesh,what:ewm-11422  fixed groupid for employee section filter  ,when:27/06/2023;
    // let manageurl='./client/core/administrators/group-master/status?groupId=c81dacbe-3e57-4a32-805d-001380c65303';
    let manageurl =
      './client/core/administrators/group-master/status?groupId=' +
      this.groupId;

    window.open(manageurl, '_blank');
  }
  /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date
     */
  clearEndDate(filterData) {
    filterData.patchValue({
      ParamValue: null,
    });
  }
  /*
   @Type: File, <ts>
    @Name: filterValidator
    @Who: Bantee
    @When: 31-Jan-2023
    @Why: EWM-9756 EWM-9762
    @What: validating the required error on null or undefined value
  */
  filterValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.touched && !control.value) {
        return {
          required: true,
        };
      } else {
        return null;
      }
    };
  }

  /*
   @Type: File, <ts>
    @Name: fireValidator
    @Who: Bantee
    @When: 31-Jan-2023
    @Why: EWM-9756 EWM-9762
    @What: validating the required error
  */
  fireValidator(control) {
    control.get('DropDwonName').updateValueAndValidity();
  }
  personLoading
  resetdroplist:boolean=false;
  reint(config,i){
    if(this.resetdroplist){
      let apiObj = this.apiGateWayUrl + config[i]?.API;
      this.commonserviceService.getGenericDropdownList(apiObj).subscribe(
        (repsonsedata: ResponceData) => {
          if (
            repsonsedata.HttpStatusCode === 200 ||
            repsonsedata.HttpStatusCode === 204
          ) {
            this.loader = false;
            this.personLoading = false;
            this.dropList[i] = repsonsedata.Data;
            this.resetdroplist=false;
          }
        },
        (err) => {
          this.loader = false;
          this.dropList[i] = [];
        }
      );
    }
   
    
  }
  searchdropdown(searchData, config, i) {
    if (searchData?.length > 0 && searchData?.length <= 2) {
      return;
    }
    let apiObj = {};
    let paramData='';
    paramData +='?pageSize=100';
    if(config[i]?.API.includes('?')){
      paramData = '&pageSize=100';
    }
    paramData += '&search=' + searchData;

    if (config.Field == 'JobTitle') {
      paramData += '?WorkflowId=' + this.WorkflowId;
    }
    apiObj['val'] = this.apiGateWayUrl + config[i]?.API + paramData;
    apiObj['index'] = i;
    this.searchSubject$.next(apiObj);
  }
  searchData(config) {
    this.resetdroplist=true;
    let i = config['index'];
    let apiObj = config['val'];
    this.commonserviceService.getGenericDropdownList(apiObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (
          repsonsedata.HttpStatusCode === 200 ||
          repsonsedata.HttpStatusCode === 204
        ) {
          this.loader = false;
          this.personLoading = false;
          this.dropList[i] = repsonsedata.Data;
        }
      },
      (err) => {
        this.loader = false;
        this.dropList[i] = [];
      }
    );
  }
}
