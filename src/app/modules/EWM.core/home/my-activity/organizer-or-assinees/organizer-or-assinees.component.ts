/*
    @Type: File, <ts>
    @Name: organizer-or-assinees.component.ts
    @Who: Anup Singh
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: popup component for organizer-or-assinees
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ContactReceipentService } from 'src/app/shared/services/contact-recipient/contact-receipent.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
// import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
import { Optional } from '@angular/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';

@Component({
  selector: 'app-organizer-or-assinees',
  templateUrl: './organizer-or-assinees.component.html',
  styleUrls: ['./organizer-or-assinees.component.scss']
})
export class OrganizerOrAssineesComponent implements OnInit {

  public loading: boolean = false;
  public UserOrgAssTypeList: any = [];
  public loadingSearch: boolean = false;

  public saveStatus: boolean = false

  pagesize = 500;
  pageNo = 1;
  public loadingPopup: boolean;
  public searchValue: string = "";
  public searchListUser: any = [];
  searchUser = [];
  maxMsg: boolean = false;
  noRecordFound: boolean = false;
  maxContactSelect: any;
  saveEnableDisable: boolean = true;
  userId:string;

  constructor(public dialogRef: MatDialogRef<OrganizerOrAssineesComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private quickJobService: QuickJobService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService,) {

    this.maxContactSelect = this.appSettingsService.maxSelectEmail;
  }


  ngOnInit(): void {
    this.searchUser = this.data.organizerOrAssigneesList;

    this.userId = this.data?.userId;
  }



  /*
@Type: File, <ts>
 @Name: onsearchUserOrgAss()
 @Who: Anup Singh
 @When: 08-jan-2022
 @Why:EWM-4467 EWM-4529
 @What: search for user
*/
  onsearchUserOrgAss(inputValue: string) {
 if (inputValue.length === 0) {
      this.noRecordFound = false;
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      this.loadingPopup = true;
      this.searchValue = inputValue;
      this.quickJobService.fetchUserInviteListOnbasisSearch(this.pagesize, this.pageNo, inputValue).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loadingPopup = false;
            this.searchListUser = repsonsedata.Data;          
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.maxMsg = false;
            this.noRecordFound = false;
          }else  if (repsonsedata.HttpStatusCode === 204) {
            this.loadingPopup = false;
            this.searchListUser = [];
            this.noRecordFound = true;
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.maxMsg = false;
          } else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
            this.loadingPopup = false;            
            this.searchListUser = [];
            this.maxMsg = false;
            this.noRecordFound = false;
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
          else {
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.loadingPopup = false;          
            this.maxMsg = false;
            this.noRecordFound = false;
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loadingPopup = false;         
          this.maxMsg = false;
          this.noRecordFound = false;
        })

    }
  }

  /*
   @Type: File, <ts>
    @Name: AddSelectUserOrgAss()
    @Who: Anup
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: add UserOrgAss after searching in searchUserOrgAss Array
  */
  AddSelectUserOrgAss(userData: any, Name: string) {

    if (this.searchUser.length < this.maxContactSelect) {
      const index = this.searchUser.findIndex(x => x.Id === userData.Id);
      if (index !== -1) {
        //  this.searchTeammate.splice(index, 1);
      } else {
        this.searchUser.push({
          'Id': userData.Id,
          'UserName': userData.UserName,
          'AccessLevel': userData.AccessLevel,
          'AccessLevelId': userData.AccessLevelId,
          'Email': userData.Email,
          'EmployeeTag': userData.EmployeeTag,
          'LastSignIn': userData.LastSignIn,
          'PeopleType': userData.PeopleType,
          'ProfileImageUrl': userData.ProfileImageUrl,
          'Role': userData.Role,
          'RoleCode': userData.RoleCode,
          'SiteAccess': userData.SiteAccess,
          'UserId': userData.UserId,
          'UserTypeCode': userData.UserTypeCode,
        })

        this.maxMsg = false;
      }
    }
    else {
      this.maxMsg = true;
    }

    if (this.searchUser.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }

  }

  /*
      @Type: File, <ts>
       @Name: saveUserOrgAss()
       @Who: Anup Singh
       @When: 08-jan-2022
       @Why:EWM-4467 EWM-4529
       @What: submit All user
     */
  saveUserOrgAss() {
    document.getElementsByClassName("AddOrganizerOrAssinees")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddOrganizerOrAssinees")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.searchUser); }, 200);
  }




  /*
@Type: File, <ts>
@Name: onUserOrgAssRemove()
@Who: Anup Singh
@When: 08-jan-2022
@Why:EWM-4467 EWM-4529
@What: when UserOrgAss remove from chip
*/
  onUserOrgAssRemove(Id) {
    const index = this.searchUser.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.searchUser.splice(index, 1);
      this.maxMsg = false;
    }

    if (this.searchUser.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }
  }



  /*
  @Type: File, <ts>
  @Name: onDismiss()
  @Who: Anup Singh
  @When: 08-jan-2022
  @Why:EWM-4467 EWM-4529
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("AddOrganizerOrAssinees")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddOrganizerOrAssinees")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }

}