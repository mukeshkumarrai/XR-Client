/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 02-Aug-2022
  @Why: EWM-6129 EWM-8108
  @What:  This page will be use for Job filter popup page Component ts file
*/
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { PersistFilterComponent } from './persist-filter/persist-filter.component';

@Component({
  selector: 'app-job-filter-dialog',
  templateUrl: './job-filter-dialog.component.html',
  styleUrls: ['./job-filter-dialog.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ]),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
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
  public WorkflowId :string='';
  @ViewChild('target') private myScrollContainer: ElementRef;
  public filterOptionsFilter: any[] = [];
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";
  inputType: any;
  public IsEmptyNotEmpty:any[0] = [true];
  config: any = [];
  dropList: any = [];
  public keyValue: any = [];
  loader: boolean = false;
  multiDropDownData: any = [];
 // singleDropDownData: any = {};
  apiGateWayUrl:any;
  public isMultiple : boolean = true;
  isStatus:boolean = false;
  animationVar:any;
  public activeTab: Number=0;
  viewMode: string = "listMode";
  public gridView: any[] = [];
  public animationState = false;
  public loadingscroll: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Name,asc";
  public sortedcolumnName: string = 'Name';
  public sortDirection = 'asc';
  public pagesize;
  public pagneNo = 1;
  public pageOption: any;
  public userpreferences: Userpreferences;
  public selectedIndex:number = 0;
  public saveFilternfo: any[]=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<JobFilterDialogComponent>,public dialog: MatDialog,
    private fb: FormBuilder, private jobService: JobService, private snackBService: SnackBarService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private http: HttpClient,  public _userpreferencesService: UserpreferencesService,private commonserviceService: CommonserviceService) {
      this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;
      console.log(this.data,"data");
    if (data.GridId !== undefined) {
      this.GridId = data.GridId;
    }
    if(data.workflowId!=undefined){
      this.WorkflowId = data.workflowId;

    }

    // if(data.isMultiple!=undefined){
    //  this.isMultiple = data.isMultiple;
    // }
    this.filterForm = this.fb.group({
      filterInfo: this.fb.array([])
    })

  }

  ngOnInit(): void {
    this.http.get("assets/config/filter-config.json").subscribe(data => {
      this.filterOptions = JSON.parse(JSON.stringify(data));
    })
    this.getFilterConfig(true);
    this.animationVar = ButtonTypes;
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      // if (this.totalDataCount > this.listData.length) {
      //   this.pagneNo = this.pagneNo + 1;
      //   this.ListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      // }
      //else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }
  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 08-Aug-2022
  @Why: ROST-6129 ROST-8108
  @What: For getting the deafult config for the user
   */
  editSavedFilter(filterObj:any){
    console.log("filterObj",filterObj);
    this.selectedIndex=0;
    this.ArrayCompareAndMakeCombineArray(filterObj?.FilterConfig, this.gridConfigArr);

  }
  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 03-Aug-2022
  @Why: ROST-6129 ROST-8108
  @What: For getting the deafult config for the user
   */
  getFilterConfig(param:boolean) {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== null) {
            // this.gridConfigArr=repsonsedata.Data.GridConfig;
            this.gridConfigArr = repsonsedata.Data.GridConfig.filter(item => item.Filter == true);
            if(param==true && this.data?.filterObj[0]?.IsPersist==1){
              this.gridView=this.data?.filterObj;
            }else{
              this.gridView=repsonsedata.Data.SavedFilterConfig;
            }

            console.log("this.gridView", this.gridView);
            if (this.data?.filterObj !== null && this.data?.filterObj?.length!==0) {
              this.clearFilterBtnEnable = false;
              if(this.data?.filterObj[0]?.IsPersist==1)
              {
                this.ArrayCompareAndMakeCombineArray(this.data?.filterObj[0]?.FilterConfig, this.gridConfigArr);
              }else{
                this.ArrayCompareAndMakeCombineArray(this.data?.filterObj, this.gridConfigArr);
              }
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
  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    //this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
  }

  /*
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: Amit Rajput
  @When: 19-Jan-2022
  @Why: EWM-4368 EWM-4526
  @What: creating animation
*/

animate() {
  this.animationState = false;
  setTimeout(() => {
    this.animationState = true;
  }, 0);
}
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}
  /*
  @Type: File, <ts>
  @Name: filterInfo function
  @Who: Renu
  @When: 03-Aug-2022
  @Why: ROST-6129 ROST-8108
  @What: For filterinfo alias
   */
  onCheckedFilter(event,filterInfo){
  console.log("Id",filterInfo);
  filterInfo.FilterConfig.forEach(element => {
    this.saveFilternfo.push(element);
  });
  }
  /*
  @Type: File, <ts>
  @Name: onSaveFilter function
  @Who: Renu
  @When: 03-Aug-2022
  @Why: ROST-6129 ROST-8108
  @What: For onSaveFilter
   */
  onSaveFilter(){
    let filterdata = this.filterForm.value.filterInfo;
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: this.saveFilternfo }); }, 200);
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
   /*
  @Type: File, <ts>
  @Name: filterInfo function
  @Who: Renu
  @When: 03-Aug-2022
  @Why: ROST-6129 ROST-8108
  @What: For filterinfo alias
   */
  filterInfo(): FormArray {
    return this.filterForm.get("filterInfo") as FormArray;
  }

  /*
 @Type: File, <ts>
 @Name: showFilter function
 @Who: Renu
 @When: 03-Aug-2022
 @Why: ROST-6129 ROST-8108
 @What: For filterinfo alias
  */
  showFilter(el) {
    this.filterInfo().push(this.createItem());
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    this.IsEmptyNotEmpty[control.controls.length-1]=true;
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
 @When: 03-Aug-2022
 @Why: ROST-6129 ROST-8108
 @What: For mulitple create items row
  */

  createItem(): FormGroup {
    return this.fb.group({
      filterParam: [[], [Validators.required]],
      condition: [[], [Validators.required]],
      ParamValue: ['', [Validators.required,Validators.maxLength(50)]],
      DropDwonName: ['']
    });
  }

  /*
 @Type: File, <ts>
 @Name: onReset function
 @Who: Renu
 @When: 03-Aug-2022
 @Why: ROST-6129 ROST-8108
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
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: filterdata,obj:{IsPersist:1} }); }, 200);
   // const control = <FormArray>this.filterForm.controls['filterInfo'];
   // control.clear();
   if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.remove("is-blurred");
  }
  }

 /*
    @Type: File, <ts>
    @Name: removedSavedFilter function
    @Who: Renu
    @When: 4-Aug-2022
    @Why: EWM-6129 EWM-8108
    @What: remove saved FIlter
    */
    removedSavedFilter(filterId: any) {
      const message = `label_titleDialogContent`;
      const title = '';
      const subTitle = 'label_filter';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
      let obj={};
      obj['Id']=filterId;
      this.jobService.deleteSavedConfig(obj).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.getFilterConfig(false);
          }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         // this.loading = false;
        }
      }, err => {
       // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
    }
  });
    }
  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who: Renu
 @When: 03-Aug-2022
 @Why: ROST-6129 ROST-8108
 @What:losing the pop-up
  */
  onDismiss() {
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /*
 @Type: File, <ts>
 @Name: onConfirm function
 @Who: Renu
 @When: 03-Aug-2022
 @Why: ROST-6129 ROST-8108
 @What: For saving the temp data of user filter
  */
  onConfirm() {
    let filterdata = this.filterForm.value.filterInfo;
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: filterdata }); }, 200);
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
 @Type: File, <ts>
 @Name: onSaveApply function
 @Who: Renu
 @When: 03-Aug-2022
 @Why: ROST-6129 ROST-8108
 @What: For saving the persist data of user filter
  */
 onSaveApply() {
  const dialogRef = this.dialog.open(PersistFilterComponent, {
    data: '',
    panelClass: ['xeople-modal', 'add_filter', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    console.log("dialogResult",dialogResult);
    let filterdata = this.filterForm.value.filterInfo;
    document.getElementsByClassName("add_filterdialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filterdialog")[0].classList.add("animate__zoomOut");
    let obj={
      'FilterName':dialogResult.Name,
      'Id':dialogResult.filterId,
      'IsPersist':1
    }
    setTimeout(() => { this.dialogRef.close({ data: filterdata,obj:obj}); }, 200);
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
  });
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.remove("is-blurred");
  }
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
        API: filterObjdata[index]?.API,
        APIKey: filterObjdata[index]?.APIKey,
        Label: filterObjdata[index]?.Label,
        Title: filterObjdata[index]?.Title,
        Type: filterObjdata[index]?.Type,
        IsMultiple:filterObjdata[index]?.IsMultiple
      };
    });

    //console.log(combined, "combined")
    for (let index = 0; index < combined.length; index++) {
      const element = combined[index];
      this.inputTypedata[index] = element.Type + index;
      this.getdropdownList(element, index, false);

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
 @When: 12-Oct-2021
 @Why: EWM-3045 EWM-3289
 @What: For showing already the persist data of user filter
  */
  patchFilters(filterObj) {
    //console.log("filterObj",filterObj)
    const control = <FormArray>this.filterForm.controls['filterInfo'];
    control.clear();
    for (let Index = 0; Index < filterObj.length; Index++) {
      const element = filterObj[Index];
      let col = { 'Field': element.ColumnName, 'Type': element.ColumnType };
      control.push(
        this.fb.group({
          filterParam: [col, [Validators.required]],
          condition: [element.FilterOption, [Validators.required]],
          ParamValue: [element.FilterValue, [Validators.required,Validators.maxLength(50)]],
          DropDwonName: ['']
        })
      )
      if (element.ColumnType === "DropDown") {
        let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(Index) as FormArray;
      frmArray.get('ParamValue').setValidators([Validators.required]);
         //console.log("dropList",this.dropList)
        let FilterData: any;
        let arrdropdown: any = [];
        FilterData = element.FilterValue.split(",");
        for (let index = 0; index < FilterData.length; index++) {
          const element = FilterData[index];
          let selectDropDown: any = this.dropList[Index].filter(item => item.Id == element)
          arrdropdown.push(selectDropDown[0]);
        }
        //console.log("arrdropdown",arrdropdown)
        this.multiDropDownData[Index] = arrdropdown;
        // this.singleDropDownData = arrdropdown[0]
          //console.log(this.multiDropDownData[Index][0], Index,"multiDropDownData")
      }

      this.getValue(element.FilterOption,Index);

      this.filterOptionsFilter[Index] = this.filterOptions.filter(x => x['Type'] == element?.Type);
     // this.filterConditionType(element,Index);
      //console.log("this.isMultipl",this.isMultiple);
    // console.log("this.multiDropDownData",this.multiDropDownData[Index])
      if(this.isMultiple==false){
        this.onDropdownDatachange(this.multiDropDownData[Index][0],Index)
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
    let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
    frmArray.get('condition').reset();
    frmArray.get('ParamValue').reset();
    frmArray.get('DropDwonName').reset();
    this.filterOptionsFilter[i] = this.filterOptions.filter(x => x['Type'] == event?.Type);
    this.inputType = event?.Type;
    this.inputTypedata[i] = event?.Type + i;

    this.getdropdownList(event, i, false)

    if (this.filterOptionsFilter[i].length > 0) {
      if (event.Type == 'Text') {
        frmArray.get('ParamValue').setValidators([Validators.required,Validators.maxLength(50)])
      } else if (event.Type == 'Numeric') {
        frmArray.get('ParamValue').setValidators([Validators.required, Validators.pattern(this.numberPattern),Validators.maxLength(50)])
      } else if (event.Type == 'Number') {
        frmArray.get('ParamValue').setValidators([Validators.required, Validators.pattern(this.numberPattern),Validators.maxLength(50)])
      } else {
        frmArray.get('ParamValue').setValidators([Validators.required, Validators.maxLength(50)])
      }
    }
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
      this.config.splice(index, 0, value);
      this.keyValue.splice(index, 0, value.APIKey);

      if(value.IsMultiple==false){
        this.isMultiple = false;
      }else{
        this.isMultiple = true;
      }
      if (value.Field == 'StatusName') {
          this.isStatus = true;
      }
      else{
        this.isStatus = false;
      }
      if (value.Type === 'DropDown') {
        let apiObj = '';
        if (value.Field == 'JobTitle') {
          apiObj = this.apiGateWayUrl + value?.API +'?WorkflowId='+this.WorkflowId;
        }else{
          apiObj = this.apiGateWayUrl + value?.API;
        }
        this.commonserviceService.getGenericDropdownList(apiObj).subscribe(
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
@Who: Anup
@When: 11-oct-2021
@Why: EWM-3045 EWM-3268
@What: patch data for dropdowm for submit
*/
  onDropdownDatachange(data: any, index) {
    //console.log("daata",data);
    let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(index) as FormArray;
    const filterform = this.filterForm.get('filterInfo') as FormArray;
   // console.log("filterform",frmArray);
    frmArray.get('ParamValue').setValidators([Validators.required]);
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


  getValue(val: any, i: number){
    if(val=='IsNotEmpty' || val=='IsEmpty'){
      let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
       frmArray.get('ParamValue').reset();
       frmArray.get('ParamValue').disable();
       frmArray.get("ParamValue").clearValidators();
       frmArray.get("ParamValue").markAsPristine();
       this.IsEmptyNotEmpty[i] = false;
    }else{
      let frmArray = (<FormArray>this.filterForm.get('filterInfo')).at(i) as FormArray;
      frmArray.get('ParamValue').enable();
      if( frmArray.get('ParamValue').value==null){
      frmArray.get('ParamValue').reset();
      frmArray.get("ParamValue").setErrors({ required: true });
     // frmArray.get("ParamValue").markAsTouched();
     // frmArray.get("ParamValue").markAsDirty();
      }

      this.IsEmptyNotEmpty[i] = true;
    }
    const filterform = this.filterForm.get('filterInfo') as FormArray;

  }
  mukesh(data){
    console.log('data',data);
    console.log('ji');
  }
    /*
@Type: File, <ts>
@Name: redirect function
@Who: Adarsh
@When: 30-Mar-2022
@Why: EWM-5654 EWM-5899
@What: redirect on master data while click on manage in dropdown
*/
  redirect(){
    let manageurl='./client/core/administrators/group-master/status?groupId=c81dacbe-3e57-4a32-805d-001380c65303';
    window.open(manageurl, '_blank');
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
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

    /*
@Type: File, <ts>
@Name: selectedTabValue
@Who: Anup Singh
@When: 14-Feb-2022
@Why: EWM-4672 EWM-5191
@What: when tab change msg change
*/

selectedTabValue(value: any) {
this.activeTab=value.index;
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
