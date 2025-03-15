/*   
  @(C): Entire Software
  @Type: File, <TS>
  @Who: Adarsh singh
  @When: 30-Jan-2023
  @Why: EWM-10279 EWM-10329
  @What: for add-broadbean-activate-users ccomponent 
*/
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EmployeeService } from 'src/app/modules/EWM.core/shared/services/employee/employee.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-add-broadbean-activate-users',
  templateUrl: './add-broadbean-activate-users.component.html',
  styleUrls: ['./add-broadbean-activate-users.component.scss']
})
export class AddBroadbeanActivateUsersComponent implements OnInit {
  activatedUsersForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  gridListData: any;

  public pagesize;
  public pageSizeOptions;
  public pagneNo = 1;
  public sortingValue: string = "Email,asc";
  public searchValue: string = "";
  public filterConfig: any;
  selectUserData: any;
  RegistrationCode: any;
  public GridId: any = 'employeeLanding_grid_001';
  public folderId: any = 0;
  filteredData: any;
  public specialcharPattern = "[A-Za-z0-9. ]+$";
  searchSubject$ = new Subject<any>();
  userListType = '';
  roleType = '';
  tabActive:string='people';
  userList:any;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddBroadbeanActivateUsersComponent>,
    private snackBService: SnackBarService, private translateService: TranslateService, private employeeService: EmployeeService,
    private _systemSettingService: SystemSettingService, private router: ActivatedRoute,
    private appSettingsService: AppSettingsService,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.activatedUsersForm = this.fb.group({
      EmailId: [null, [Validators.required]],
      BroadbeanUserId: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator()]]
    });
    this.pagesize = this.appSettingsService.pagesize;
    // this.getEmployeeList(true,this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
    // this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive, true); //cooment by maneesh

    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
        }
      });

      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        // this.getEmployeeList(false,this.pagesize, this.pagneNo, this.sortingValue, val, this.filterConfig);
        this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive, false);
         });
      this.userList = this.data.userList;
  }

  /*
    @Type: File, <ts>
    @Name: onDismissEdit
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: To close Quick modal
  */
  onDismiss(): void {
    document.getElementsByClassName("AddBroadbeanActivateUsers")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddBroadbeanActivateUsers")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  /*
    @Type: File, <ts>
    @Name: getEmployeeList function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: for get all list
  */

  getEmployeeList(isLoader:boolean, pagesize:number, pagneNo:number, sortingValue:string, searchVal:string, JobFilter:any) {
    isLoader ? this.loading = true : this.loading = false;
    let jsonObj = {};
    jsonObj['CandidateFilterParams'] = [];
    jsonObj['FilterParams'] = [];
    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['GridId'] = this.GridId;
    jsonObj['FolderId'] = this.folderId;
    jsonObj['Type'] = '';
    jsonObj['StatusId'] = null;
    jsonObj['Designation'] = '';

    this.employeeService.fetchEmployeelist(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.gridListData = repsonsedata.Data;
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
    @Name: onEmailIdSelect function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: onEmailIdSelect
  */
  onEmailIdSelect(data: any) {
    this.selectUserData = data;
    this.checkDuplicity();

    if (!data) {
      // this.getEmployeeList(false,this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
      this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive, false);
    }
  }
  /*
    @Type: File, <ts>
    @Name: onFilteredList function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: onFilteredList
  */
  onFilteredList() {
    this.filteredData = this.gridListData?.filter((e: any) => e.UserId === this.selectUserData);
    return this.filteredData[0];
  }
  /*
    @Type: File, <ts>
    @Name: onConfirm function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: for saving record
  */
  onConfirm(value) {
    this.submitted = true;
    if (this.activatedUsersForm.invalid) {
      return;
    }
    // this.checkDuplicity()
    this.onAdd();

  }
/*
    @Type: File, <ts>
    @Name: onAdd function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What:for adding record
*/
  onAdd(){
    let empList = this.onFilteredList();
    let value:any = this.activatedUsersForm.value;
    let Obj = {}
    Obj['UserId'] = empList?.UserId;
    Obj['EmailId'] = empList?.Email;
    Obj['IsAccess'] = 1;
    Obj['BroadbeanUserId'] = value?.BroadbeanUserId;
    Obj['BroadbeanRegistrationCode'] = this.RegistrationCode;
    Obj['UserName'] = empList?.UserName;

    this.loading = true;
    this._systemSettingService.broadbeanAddUser(Obj).subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: onConfirm function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: for saving record
  */
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}


checkDuplicity(){  
  if(this.activatedUsersForm.controls['EmailId'].value==''){
    return;
  }
  let broadbeandata = {};
  let empList = this.onFilteredList();// by maneesh add payload
  broadbeandata['EmailId'] = this.onFilteredList()?.Email;
  broadbeandata['UserName'] = empList?.UserName;
  this._systemSettingService.checkBroadBeanUserIsExist(broadbeandata).subscribe(
    (data: ResponceData) => {
      if (data.Message == "400012") {
         this.activatedUsersForm.get("EmailId").setErrors({codeTaken: true});
         this.activatedUsersForm.get("EmailId").markAsDirty();
         this.activatedUsersForm.get("EmailId").markAllAsTouched();
         this.submitted = false;
      }
      else {        
          this.activatedUsersForm.get("EmailId").clearValidators();
          this.activatedUsersForm.get("EmailId").markAsPristine();
          this.activatedUsersForm.get('EmailId').setValidators([Validators.required]);
          this.activatedUsersForm.get("EmailId").updateValueAndValidity();
      }
      this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive, false);
      // this.getEmployeeList(false,this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
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

execKeypress(value){
  this.searchValue = value;
  this.searchSubject$.next(value);
}



onRefreshEmp(){
  this.searchValue = '';
  this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive, false);
  // this.getEmployeeList(false,this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);

}

  /*
    @Type: File, <ts>
    @Name: onConfirm function
    @Who: Adarsh singh
    @When: 07-feb-2023
    @Why: EWM-10279 EWM-10330
    @What: for changing api 
*/
userInviteList(pagesize:number, pagneNo:number, sortingValue:string, searchVal:string, uType:any, uRole:any,recordFor:string, isLoader:boolean) {
  isLoader ? this.loading = true : this.loading = false;
  this._systemSettingService.fetchUserInviteList(pagesize, pagneNo, sortingValue, searchVal, uType, uRole,recordFor).subscribe(
    (repsonsedata:any) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.gridListData = repsonsedata.Data;
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
    @Name: onUserIdCheckIsExist function
    @Who: Adarsh singh
    @When: 14-feb-2023
    @Why: EWM-10280 EWM-10428
    @What: for checking broadbean id is already in use or not 
*/
  onUserIdCheckIsExist(value:string){
    let data = this.userList?.filter((data:any)=>(data.BroadbeanUserId === value.trim()) && (data.IsAccess === 1));
    if (data.length>0) {
      this.activatedUsersForm.get("BroadbeanUserId").setErrors({codeTaken: true});
      this.activatedUsersForm.get("BroadbeanUserId").markAsDirty();
      this.activatedUsersForm.get("BroadbeanUserId").markAsTouched();
    }else{
      this.activatedUsersForm.get("BroadbeanUserId").clearValidators();
      this.activatedUsersForm.get("BroadbeanUserId").markAsPristine();
      this.activatedUsersForm.get("BroadbeanUserId").setValidators([Validators.required, Validators.maxLength(100), this.noWhitespaceValidator()]);
    }
  }
}
