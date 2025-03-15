import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EmployeeService } from 'src/app/modules/EWM.core/shared/services/employee/employee.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ResponseData } from 'src/app/shared/services/common-servies.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-eoh-subscription-features',
  templateUrl: './eoh-subscription-features.component.html',
  styleUrls: ['./eoh-subscription-features.component.scss']
})
export class EohSubscriptionFeaturesComponent implements OnInit {
  public loading: boolean = false;
  pagesize: number;
  pageNo: number;
  public searchValue: string = "";
  public removable = true;
  organizationList:any;
  sortingValue: string = "OrganizationName,asc";
  orgnizations: any=[];
  employees: any=[];
  employeesList:any = [];
  orgEmployeeList:any = [];
  RecordFor = 'People';
  organizationId: string;
  @ViewChild('searchVal') private searchVal?: NgSelectComponent;
  public input$ = new Subject<string | null>()
  initialOrgEmplData = [];
  firstTime: boolean = true;
  orgCode: string;
  addEmployees: any[] = [];
  totalRecord: number;
  loadingscroll: boolean;
  subsFeatureFor: string;
  showMaxEmployee: boolean = false;
  searchSubject$ = new Subject<any>();
  loadingSearch: boolean;

  constructor(public dialogRef: MatDialogRef<EohSubscriptionFeaturesComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private _userAdministrationService: UserAdministrationService,
  ) {
    this.pagesize = this.appSettingsService.pagesize;
    this.pageNo = this.appSettingsService.pageOption;
    this.subsFeatureFor = data.openSubsPopfor;
    this.employees = JSON.parse(JSON.stringify(data.employees));
    this.showMaxEmployee = false;
  }

  ngOnInit(): void {
    this.getOrganizationInfo(this.pagesize, this.pageNo, this.sortingValue, this.searchValue);
    this.input$.pipe(debounceTime(1000)).subscribe((searchValue) => {
      if (searchValue) {
        this.searchValue = searchValue;
        this.pageNo = 1;
        this.getEmployeesByOrg(this.pagesize, this.pageNo, this.searchValue, this.RecordFor, this.organizationId, false);
      } else {
        this.clear();
      }
    });
  }

  // who:bantee,why:ewm-13864 what: getOrganizationInfo data ,when:5/09/2023

  getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue) {
    this.loading = true;
    this._userAdministrationService.getTenantBasedOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue).subscribe(
      repsonsedata => {
        this.organizationList = repsonsedata['Data'];

        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  // who:bantee,why:ewm-13864 what: onChangeOrganization ,when:5/09/2023

  onChangeOrganization(org) {
    if (org) {
      this.organizationId = org.OrganizationId;
      this.getEmployeesByOrg(this.pagesize, this.pageNo, this.searchValue, this.RecordFor, this.organizationId, false);
    } else {
      this.orgEmployeeList = [];
    }
  }

  // who:bantee,why:ewm-13864 what: onDismiss ,when:5/09/2023

  onDismiss() {
    this.addEmployees = [];
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  // who:bantee,why:ewm-13864 what: save the employees ,when:5/09/2023

  onSave() {

    const selectedEmp = JSON.parse(JSON.stringify(this.employees));

    document.getElementsByClassName("AddRequiredAttendees")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ selectedEmp: selectedEmp, subsFeatureFor: this.subsFeatureFor }); }, 200);
  }

  // who:bantee,why:ewm-13864 what: getEmployeesByOrg ,when:5/09/2023

  getEmployeesByOrg(pagesize, pagneNo, searchValue, RecordFor, OrganizationId, isScroll) {
    this.loadingSearch = true;
    this._userAdministrationService.getUserByOrganization(pagesize, pagneNo, searchValue, RecordFor, OrganizationId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          const emps = repsonsedata.Data.map(x => ({ UserId: x.UserId, Name: x.UserName }));
          emps.forEach(x => {
            x['OrgCode'] = this.orgnizations?.Key;
            x['OrganizationId'] = this.orgnizations?.OrganizationId;
          });

          if (isScroll) {

            this.orgEmployeeList = this.orgEmployeeList.concat(...emps);
          } else {
            this.orgEmployeeList = emps;
            if (this.firstTime == true) {
              this.initialOrgEmplData = [...emps];
              this.firstTime = false;
            }
          }
          this.totalRecord = repsonsedata.TotalRecord
          this.loadingSearch = false;
          this.loadingscroll = false;
        } else {
          this.orgEmployeeList = repsonsedata.Data
          this.loadingSearch = false;
          this.loadingscroll = false;
        }

      }, err => {
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  // who:bantee,why:ewm-13864 what: fetchMore data on scroll end ,when:5/09/2023

  fetchMore() {
    this.loadingscroll = true;

    if (this.totalRecord > this.orgEmployeeList.length) {
      this.pageNo = this.pageNo + 1;
      let isScroll = true;

      this.getEmployeesByOrg(this.pagesize, this.pageNo, this.searchValue, this.RecordFor, this.organizationId, isScroll);

    } else {
      this.loadingscroll = false;
    }


  }

  // who:bantee,why:ewm-13864 what: onSelectEmployee ,when:5/09/2023

  onSelectEmployee(e) {

    if (this.employees.length > 10) {
      this.showMaxEmployee = true
      this.employees = this.employees.slice(0, 10)
    } else {
      this.showMaxEmployee = false;
    }
  }


  // who:bantee,why:ewm-13864 what: clear ,when:5/09/2023

  clear() {
    this.searchValue = '';
    this.pageNo = 1;
    this.searchVal.searchTerm = '';
    this.orgEmployeeList = [...this.initialOrgEmplData];

  }

  // who:bantee,why:ewm-13864 what: remove employee ,when:5/09/2023

  removeEmployee(index) {
    this.employees.splice(index, 1);

    this.employees = JSON.parse(JSON.stringify(this.employees));
  }
}
