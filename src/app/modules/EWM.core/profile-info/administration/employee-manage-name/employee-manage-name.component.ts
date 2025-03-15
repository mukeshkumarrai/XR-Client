/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 16-July-2021
  @Why: EWM-2056
  @What:  This page will be use for the employee manage-name Component ts file
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';
import { Router } from '@angular/router';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { LoginResponce, ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-employee-manage-name',
  templateUrl: './employee-manage-name.component.html',
  styleUrls: ['./employee-manage-name.component.scss']
})
export class EmployeeManageNameComponent implements OnInit {
  /*
   @Type: File, <ts>
   @Who: Nitin Bhati
   @When: 17-July-2021
   @Why: EWM-2067
   @What: Decalaration of Global Variables
 */
  userGeneralSettingList = [];
  manageNameFrom: FormGroup;
  submitted = false;
  status: boolean = false;
  loading: boolean;
  result: string = '';
  public value = ``;
  public gridClientName: any[];
  selected = [];
  public auditParameter;
  public clientDiv = true;
  public clientTypeName;
  public employeeNameId;
  public buttonStatus = false;
  employee: any;
  griddata:any={};
  public isDirty:boolean;

  public data = {
    "employee": {
      "employee": "Clerk",
      "eng": "Clerk",
      "hin": "लिपिक",
      "ara": "كاتب ملفات"
    },
    "employees": {
      "employee": "Clerk",
      "eng": "Clerk",
      "hin": "लिपिक",
      "ara": "كاتب ملفات"
    }
  }
  public gridDataId: any[];
  public clientNameId;
  val: any;
  private manageNameParendIDName:string;
  constructor(private translateService: TranslateService, private fb: FormBuilder, private _profileInfoService: ProfileInfoService,
    private route: Router, private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService,private _snackBarService: SnackBarService) {
    this.employeeNameId = this._appSetting.employeeNameId;
    this.clientNameId=this._appSetting.clientNameId;
    this.manageNameParendIDName=this._appSetting.manageNameParendID;
    this.auditParameter = encodeURIComponent('Employee Name Manage');
    this.manageNameFrom = this.fb.group({
      Id: [''],
      ClientNameId: ['', Validators.required],
      Singular: ['', Validators.required],
      Plural: ['', Validators.required],
      Status: [false],
      IsDefault:[]
    })
  }
  ngOnInit(): void {
    this.commonserviceService.ononnameManageChangeObs.subscribe(value=>{
      this.val=value;
     })
   // this.getAllEmployeeName();
    this.getAllEmployeeNameAdmin();
   
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    
  }

  /*
    @Type: File, <ts>
    @Name: getAllEmployeeName function
    @Who: Nitin Bhati
    @When: 17-July-2021
    @Why: EWM-2067
    @What: call Get method from services for showing data into grid.
   */
  getAllEmployeeName() {
    this.loading = true;
    this._profileInfoService.getManageNameList('?ParentId=' + this.employeeNameId).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          let IsStatus;
          if (repsonsedata['Data']['IsDefault'] == 1) {
            IsStatus = true;
        // <!-- @Who: bantee ,@When: 6-04-2023, @Why: EWM-11742 ,What: name manage menu(back button and cancel button added) -->

           // this.buttonStatus = true;
            this.manageNameFrom.controls["ClientNameId"].disable();
            this.manageNameFrom.controls["Singular"].disable();
            this.manageNameFrom.controls["Plural"].disable();
          } else {
            IsStatus = true;
           // this.buttonStatus = true;
            this.manageNameFrom.controls["ClientNameId"].disable();
            this.manageNameFrom.controls["Singular"].disable();
            this.manageNameFrom.controls["Plural"].disable();
          }
          this.manageNameFrom.patchValue({
           // Status: IsStatus,
            ClientNameId: repsonsedata['Data']['TypeId'],
            Singular: repsonsedata['Data']['Singular'],
            Plural: repsonsedata['Data']['Plural'],
            IsDefault:repsonsedata['Data']['IsDefault'],
          })
          let ClientId=repsonsedata['Data']['TypeId'];
          this.clientTypeName = this.gridClientName.filter(x => x['Id'] === ClientId);
          this.commonserviceService.onOrgSelectJsonId.next([this.clientTypeName[0].Data]);
        } else if (repsonsedata['HttpStatusCode'] == '204') {
          this.getAllEmployeeNameAdminById();
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: getAllEmployeeNameAdmin function
    @Who: Nitin Bhati
    @When: 17-July-2021
    @Why: EWM-2067
    @What: call Get method from services for showing data into grid.
   */
  getAllEmployeeNameAdminById() {
    this.loading = true;
    this._profileInfoService.getmanageNameValueListAdmin('?NameId=' + this.employeeNameId).subscribe(
      repsonsedata => {
        this.gridClientName = repsonsedata['Data'];
        this.gridDataId = this.gridClientName.filter((dl: any) => dl.IsDefault == 1);
        this.loading = false;
        let IsStatus;
        if (this.gridDataId[0].IsDefault == 1) {
          IsStatus = false;
        // <!-- @Who: bantee ,@When: 6-04-2023, @Why: EWM-11742 ,What: name manage menu(back button and cancel button added) -->

         // this.buttonStatus = true;
          this.manageNameFrom.controls["ClientNameId"].disable();
          this.manageNameFrom.controls["Singular"].disable();
          this.manageNameFrom.controls["Plural"].disable();
        } else {
          IsStatus = false;
          //this.buttonStatus = true;
          this.manageNameFrom.controls["ClientNameId"].disable();
          this.manageNameFrom.controls["Singular"].disable();
          this.manageNameFrom.controls["Plural"].disable();
        }
        this.manageNameFrom.patchValue({
          Status: IsStatus,
          ClientNameId: this.gridDataId[0].Id,
          Singular: this.gridDataId[0].Singular,
          Plural: this.gridDataId[0].Plural,
          IsDefault:this.gridDataId[0].IsDefault,
        })
        this.commonserviceService.onOrgSelectJsonId.next([this.gridDataId[0].Data]);
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  getAllEmployeeNameAdmin() {
    this.loading = true;
    this._profileInfoService.getmanageNameValueListAdmin('?NameId=' + this.employeeNameId).subscribe(
      repsonsedata => {
        this.gridClientName = repsonsedata['Data'];
        this.getAllEmployeeName();
   
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
    @Type: File, <ts>
    @Name: clickEmployeeNameID function
    @Who: Nitin Bhati
    @When: 17-July-2021
    @Why: EWM-2067
    @What: call Get method from services for showing data into grid.
  */
  clickEmployeeNameID(Id) {
    this.clientTypeName = this.gridClientName.filter(x => x['Id'] === Id);
    this.commonserviceService.onOrgSelectJsonId.next([this.clientTypeName[0].Data]);
    this.griddata = this.clientTypeName[0].Data;
    this.manageNameFrom.patchValue({
      Singular: this.clientTypeName[0].Singular,
      Plural: this.clientTypeName[0].Plural,
      IsDefault:this.clientTypeName[0].IsDefault,
    });
    this.isDirty=false;
    this.manageNameFrom.controls["Singular"].disable();
    this.manageNameFrom.controls["Plural"].disable();
  }
  /*
  @Type: File, <ts>
  @Name: updateEmployeeManageName
  @Who: Nitin Bhati
  @When: 17-July-2021
  @Why: EWM-2067
  @What: For update all employee Manage Name Information
  */
  updateEmployeeManageName(value) {
    let updateClientObj = {};
    let isStatus: any;
    if (value.Status == true) {
      isStatus = 1;
    } else {
      isStatus = 2;
    }
    this.clientTypeName = this.gridClientName.filter(x => x['Id'] === parseInt(value.ClientNameId));
    updateClientObj['ParentId'] = parseInt(this.employeeNameId);
    updateClientObj['TypeId'] = parseInt(value.ClientNameId);
    updateClientObj['TypeName'] = this.clientTypeName[0].Name;
    updateClientObj['Singular'] = value.Singular;
    updateClientObj['Plural'] = value.Plural;
    updateClientObj['Status'] = parseInt(isStatus);
    updateClientObj['IsDefault'] = value.IsDefault;
    this.loading = true;
    this.submitted = true;
    if (this.manageNameFrom.invalid) {
      return;
    } else {
      this._profileInfoService.createManageName(updateClientObj).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
        // <!-- @Who: bantee ,@When: 6-04-2023, @Why: EWM-11742 ,What: name manage menu(back button and cancel button added) -->

            let IsStatus;
     IsStatus = false;
    this.manageNameFrom.patchValue({
      Status: IsStatus
      
    })
            this.buttonStatus=false;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.getAllEmployeeName();
            this.changeManageNameGetNewManageName(value);
            this.getManageListAll();
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    }
  }

  /*
  @Type: File, <ts>
  @Name: setDefault
  @Who: Nitin Bhati
  @When: 17-July-2021
  @Why: EWM-2067
  @What: For default Employee Manage Name Information
  */
  setDefault(e) {
    if (e.checked === false) {
      // this.buttonStatus = false;
      // this.manageNameFrom.controls["ClientNameId"].disable();
      // this.manageNameFrom.controls["Singular"].disable();
      // this.manageNameFrom.controls["Plural"].disable();
        // <!-- @Who: bantee ,@When: 6-04-2023, @Why: EWM-11742 ,What: name manage menu(back button and cancel button added) -->

      this.buttonStatus = false;
      this.isDirty==false;
      this.manageNameFrom.controls["ClientNameId"].disable();
      this.manageNameFrom.controls["Singular"].disable();
      this.manageNameFrom.controls["Plural"].disable();
     this.gridDataId = this.gridClientName.filter((dl: any) => dl.IsDefault == 1);
     let IsStatus;
     IsStatus = false;
     this.manageNameFrom.patchValue({
      Status: IsStatus,
      ClientNameId: this.gridDataId[0].Id,
      Singular: this.gridDataId[0].Singular,
      Plural: this.gridDataId[0].Plural,
      IsDefault: this.gridDataId[0].IsDefault,
      
    })
    } else {
      this.buttonStatus = true;
      this.isDirty=true;

      this.manageNameFrom.controls["ClientNameId"].enable();
      this.manageNameFrom.controls["Singular"].disable();
      this.manageNameFrom.controls["Plural"].disable();
    }

  }



  /*
 @Type: File, <ts>
 @Name: changeManageNameGetNewManageName
 @Who: Anup Singh
 @When: 06-Aug-2021
 @Why: EWM-2008 EWM-2285
 @What: For set data for Employee value (Manage Name)
 */

  changeManageNameGetNewManageName(Data) {
    let employeeSingular = JSON.parse(Data.Singular)
    let employeePlural = JSON.parse(Data.Plural)
    let employeeDataValue: any = {
      singular: employeeSingular,
      plural: employeePlural
    }
    localStorage.setItem("employee", JSON.stringify(employeeDataValue));
    /////text change for client and Employee in header and side menu By Anup Singh////
    this.commonserviceService.onChangeLngForEmployeeText.next(this.textChangeLngService.getDataEmployee('singular'));
    this.commonserviceService.onChangeLngForEmployeesText.next(this.textChangeLngService.getDataEmployee('plural'));

   /// again reload employee value 
    this.employee = this.textChangeLngService.getDataEmployee('singular');

  }

 /*
     @Type: File, <ts>
     @Name: getManageListAll function
     @Who: Nitin Bhati
     @When: 27-aug-2021
     @Why: EWM-2669
     @What: get defualt manage Name All
     */

     getManageListAll(){
      this._profileInfoService.getManageNameAllList('?ParentId=' +this.manageNameParendIDName).subscribe(
       (repsonsedata:ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          let data=repsonsedata.Data.Data;
           localStorage.setItem("ManageName", JSON.stringify(data));
           this.commonserviceService.onnameManageChange.next(data)
         }
       },
       err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }


}

