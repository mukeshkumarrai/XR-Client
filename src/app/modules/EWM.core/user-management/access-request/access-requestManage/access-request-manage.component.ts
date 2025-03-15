import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { UserAdministrationService } from '../../../shared/services/user-administration/user-administration.service';
import { UserManagmentService } from '../../../shared/services/user-management/user-managment.service';
import { UserpreferencesService } from '../../../../../shared/services/commonservice/userpreferences.service';
import { Userpreferences } from '../../../../../shared/models/common.model';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { ResponceData } from 'src/app/shared/models';


@Component({
  providers: [MessageService],
  selector: 'app-access-request-manage',
  templateUrl: './access-request-manage.component.html',
  styleUrls: ['./access-request-manage.component.scss'],
})
export class AccessRequestManageComponent implements OnInit {

  loading: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('utypeSelect') utypeSelect;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  UserAccessRequestForm: FormGroup;
  public userRoles: any[];
  public accessLevels: any[];
  public maxCharacterLengthSubHead = 130;
  submitted = false;
  result: string = '';
  public userInviteDetailsEmailID: string
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  OrganizationData: any;
  personFName: string;
  personLName: string;
  requestedDate: any;
  selected: any;
  OrgListForDefaltOrg: any;
  public userpreferences: Userpreferences;
  public slideOut: boolean;
  UserType: any;
  public disabledCondition: boolean=true;
  public UserTypeCode: any;
  ProfileImagePath: any;
  viewMode: string = "listMode";
  activeTab: any;
  CandidateId: any;

  constructor(public dialogObj: MatDialog, private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog, private commonserviceService: CommonserviceService,
    public elementRef: ElementRef, private translate: TranslateService,
    public _userpreferencesService: UserpreferencesService,private router:ActivatedRoute,
    private _UserManagmentService: UserManagmentService, private translateService: TranslateService,
    private _userAdministrationService: UserAdministrationService) {

    this.UserAccessRequestForm = this.fb.group({
      FirstName: [''],
      MiddleName: [''],
      LastName: [''],
      Organizations: [null, [Validators.required]],
      Email: [''],
      DefaultOrganisationId: [null, [Validators.required]],
      DefaultOrganisationName: [null, [Validators.required]],
      RoleCode: [null, [Validators.required]],
      RoleName: [null, [Validators.required]],
      AccessLevelId: [null, [Validators.required]],
      AccessLevelName: [null, [Validators.required]],
      IsApproved: [''],
      RequestDate: [''],
      EmployeeType:[],
      UserId:[],
      TimeZone:[]
    });


  }

  ngOnInit(): void {
    this.slideOut = true;
    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
      URL_AS_LIST = URL.split('/');
     }else
     {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
     }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

   // this.getRolesList();
    this.getAccessLevelList();
    this.getOrganizationList();
    this.editForm(this.router.snapshot.params.id);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.router.queryParams.subscribe((params) => {
      if(Object.keys(params).length!=0){
       this.viewMode = params['mode'];
       this.activeTab = params['tab'];
      }
     });
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      // this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd1, this.search, res);
    })
  }

  editForm(id) {
    this.loading = true;
    this._UserManagmentService.getUninvitedUserById(id).subscribe(
      (repsonsedata:ResponceData) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200) {
          this.userInviteDetailsEmailID = repsonsedata.Data.UserEmail;
          this.personFName = repsonsedata.Data.UserFirstName;
          this.personLName = repsonsedata.Data.UserLastName
          this.requestedDate = repsonsedata.Data.RequestedDate;
          this.UserType = repsonsedata.Data.UserType;
          this.UserTypeCode = repsonsedata.Data.UserTypeCode;
          if (repsonsedata.Data.ProfileImagePath=='') {
            this.ProfileImagePath = "/assets/user.svg";
          } else {
            this.ProfileImagePath=repsonsedata.Data.ProfileImagePath;
          }
          this.getRolesList( repsonsedata.Data.UserTypeCode);
          if(this.UserType.toLowerCase()=='employee'){
              this.disabledCondition=false;
          }else{
            this.disabledCondition=true;
          }
         this.CandidateId=repsonsedata.Data.CandidateId;
          // this.UserAccessRequestForm.patchValue({
          //   FirstName: repsonsedata['Data'].UserFirstName,
          //   LastName: repsonsedata['Data'].UserLastName,
          //   Email: repsonsedata['Data'].UserEmail,
          //   RequestDate: repsonsedata['Data'].RequestedDate
          //   });
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
         
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        
      })
  }

  public onCancel(): void {
    this.UserAccessRequestForm.reset();
    this.slideOut = false;
    setTimeout(() => {
      this.route.navigate(['./client/core/user-management/access-request'],{queryParams: {mode: this.viewMode,tab:this.activeTab}});
    }, 700);

  }

  /*
  @Type: File, <ts>
  @Name: getRolesList
  @Who: Renu
  @When: 30-May-2021
  @Why: ROST-1646
  @What: Role List based on filter
   */
  getRolesList(columnValue) {
    let columnName='usertypecode';
    this.systemSettingService.getUserRoleListWithFilter(columnName,columnValue).subscribe(
      (repsonsedata:ResponceData) => {
        this.loading=false;
        this.userRoles = repsonsedata.Data;
        this.UserAccessRequestForm.patchValue({
          RoleCode:  this.userRoles[0].RoleCode,
          RoleName: this.userRoles[0].Name,
        })
      }, err => {
        this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  getOrganizationList() {
    this.systemSettingService.getOrganizationList().subscribe(
      repsonseData => {
        this.loading=false;
        this.OrganizationData = repsonseData['Data'];
      }, err => {
        this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    )
  }
  getAccessLevelList() {
    this.systemSettingService.fetchuUserInvitationAccessLevelList().subscribe(
      repsonsedata => {
        this.loading=false;
        this.accessLevels = repsonsedata['Data'];
      }, err => {
        this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  onSave(value: any, isGrant: boolean) {
    
   // @suika @EWM-10629 @whn 27-03-2023 to add timezone param
   let timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.UserAccessRequestForm.patchValue(
      {
        Organizations: this.OrgListForDefaltOrg,
        IsApproved: isGrant,
        FirstName: this.personFName,
        LastName: this.personLName,
        Email: this.userInviteDetailsEmailID,
        RequestDate: this.requestedDate,
        EmployeeType:this.UserTypeCode,
        UserId:this.CandidateId,
        TimeZone:timezone.replace("Asia/Calcutta", "Asia/Kolkata")
      }
    );

    if (this.UserAccessRequestForm.invalid && isGrant) {
      return;
    } else {
      this.loading = true;
      this._UserManagmentService.updateAccessGrant(this.UserAccessRequestForm.value).subscribe(
        repsonsedata => {
          this.loading = false;

          if (repsonsedata.HttpStatusCode == 200) {
            this.UserAccessRequestForm.reset();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.route.navigate(['./client/core/user-management/access-request'],{queryParams: {mode: this.viewMode,tab:this.activeTab}});
          } else {
            this.route.navigate(['./client/core/user-management/access-request'],{queryParams: {mode: this.viewMode,tab:this.activeTab}});
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          }
        }, err => {
          this.UserAccessRequestForm.patchValue(
            {
              Organizations: this.selected
            });
          this.UserAccessRequestForm.updateValueAndValidity();
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    }
  }


  openConfrmDialog(value): void {
    const message = 'label_titleDialogContentSiteDomain';
    const title = '';
    const subtitle = 'label_denyAccess';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    this.submitted = true;
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.UserAccessRequestForm.patchValue(
          {
            AccessLevelId: 0,
            AccessLevelName: '',
            RoleCode: '',
            RoleName: ''
          });
        this.onSave(value, false);
      }
      else {
        //this.snackBService.showErrorSnackBar("Cancelled the request", this.result);
        this.loading = false;
      }
    });

  }

  grantAccessDialog(val) {
    const message = 'label_titleDialogContentSiteDomain';
    const title = '';
    const subtitle = 'label_grantAccessBtn';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {

        this.onSave(val, true);
      } else {
        //this.snackBService.showErrorSnackBar("Cancelled the request", this.result);
      }
    });
  }
  getSelecteddata() {
    this.OrgListForDefaltOrg = this.OrganizationData.filter(s => this.selected.some(y => y === s.OrganizationId));
    this.UserAccessRequestForm.patchValue(
      {
        DefaultOrganisationId: this.OrgListForDefaltOrg[0].OrganizationId,
        DefaultOrganisationName: this.OrgListForDefaltOrg[0].OrganizationName
      }
    )
  }
  getDefaultOrg(event: any) {
    this.UserAccessRequestForm.patchValue(
      {
        DefaultOrganisationId: event.OrganizationId,
        DefaultOrganisationName: event.OrganizationName
      }
    )
  }
  getSelectedRole(event: any) {
    this.UserAccessRequestForm.patchValue(
      {
        RoleCode: event.RoleCode,
        RoleName: event.Name
      }
    )
  }
  getSelectedAccessLevel(event: any) {
    this.UserAccessRequestForm.patchValue(
      {
        AccessLevelId: event.Id,
        AccessLevelName: event.Name
      }
    )
  }
}
