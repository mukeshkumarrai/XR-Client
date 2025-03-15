
/*
     @Type: File, <ts>
    @Name: invite-a-teammate.component.ts
    @Who: Anup Singh
    @When: 25-May-2021
    @Why: EWM-1434 EWM-1612
    @What: popup component for Invite Teammate
  */
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, Optional } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { SnackBarService } from '../../../shared/services/snackbar/snack-bar.service';
import { ContactReceipentService } from '../../../shared/services/contact-recipient/contact-receipent.service';
import { SystemSettingService } from '../shared/services/system-setting/system-setting.service';
import { IinviteTeammate, Iteammate } from './Iinvite-a-teammate';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Subject } from 'rxjs';
//import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-invite-a-teammate',
  templateUrl: './invite-a-teammate.component.html',
  styleUrls: ['./invite-a-teammate.component.scss']
})
export class InviteATeammateComponent implements OnInit {

  /************************Global Variables decaraed her*********************** */
  public loadingPopup: boolean;
  public searchValue: string = "";
  public searchListUser: any = [];
  public PreviewUrl: string;
  searchTeammate = [];
  orgId: any;
  maxMsg: boolean = false;
  loading: boolean;
  noRecordFound: boolean = false;
  maxSelectEmail: any;
  saveEnableDisable: boolean = true;

  searchSubject$ = new Subject<any>(); 
  constructor(public dialogRef: MatDialogRef<InviteATeammateComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService,) {
    this.PreviewUrl = "/assets/user.svg";

    this.maxSelectEmail = this.appSettingsService.maxSelectEmail;

  }

  ngOnInit(): void {
    this.orgId = localStorage.getItem('OrganizationId');

        // @suika @EWM-14427 @Whn 27-09-2023
        this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
          this.loadingPopup = true;
           this.onsearchTeammate(val);
           });
    
  }



  // @suika @EWM-14427 @Whn 27-09-2023
 public onFilter(inputValue: string): void {
  this.searchValue = inputValue;
  if (inputValue?.length > 0 && inputValue?.length <= 2) {
    this.loadingPopup = false;
    return;
  }
  this.searchSubject$.next(inputValue);
}

  /*
@Type: File, <ts>
 @Name: onsearchTeammate()
 @Who: Anup Singh
 @When: 27-May-2021
 @Why: EWM-1434 EWM-1613
 @What: search for invite teammate
*/
  onsearchTeammate(inputValue: string) {
    if (inputValue.length === 0) {
      this.noRecordFound = false;
      this.loadingPopup = false;
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      this.loadingPopup = true;
      this.searchValue = inputValue;
      this.systemSettingService.getInviteTeammateList("?Search=" + inputValue + "&OrganizationId=" + this.orgId).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loadingPopup = false;
            this.searchListUser = repsonsedata.Data;
            this.noRecordFound = false;
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
             this.maxMsg = false;
          }else  if (repsonsedata.HttpStatusCode === 204) {
            this.loadingPopup = false;
            this.searchListUser = repsonsedata.Data;;
            this.noRecordFound = true;
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.maxMsg = false;
          } 
          else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
            this.loadingPopup = false;
            this.noRecordFound = false;
            this.searchListUser = [];
            this.maxMsg = false;
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
          else {
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.loadingPopup = false;
            this.noRecordFound = false;
            this.maxMsg = false;
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loadingPopup = false;
          this.noRecordFound = false
          this.maxMsg = false;
        })

    }
  }

  /*
   @Type: File, <ts>
    @Name: AddSelectTeammate()
    @Who: Anup
    @When: 27-May-2021
    @Why: EWM-1434 EWM-1613
    @What: add teammate after searching in searchTeammate Array
  */
  AddSelectTeammate(userData: any, userName: string) {

    if (this.searchTeammate.length < this.maxSelectEmail) {
      const index = this.searchTeammate.findIndex(x => x.id === userData.Id);
      if (index !== -1) {
        //  this.searchTeammate.splice(index, 1);
      } else {
        this.searchTeammate.push({
          'id': userData.Id,
          'email': userData.Email,
          'fullName': userData.FullName,
          'firstName': userData.FirstName,
          'middleName': userData.MiddleName,
          'lastName': userData.LastName,
          'orgId': userData.OrgId,
          'userTypeCode': userData.UserTypeCode,
          'PreviewUrl': userData.ProfileImageUrl
        })
        this.maxMsg = false;
      }
    }
    else {
      this.maxMsg = true;
    }

    if (this.searchTeammate.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }

  }

  /*
      @Type: File, <ts>
       @Name: saveTeamMates()
       @Who: Anup Singh
       @When: 27-May-2021
       @Why: EWM-1434 EWM-1613
       @What: submit All selected Teammate
     */
  saveTeamMates() {
    this.loading = true;
    const teammatesRequest = JSON.stringify(this.createRequest())  
    this.systemSettingService.createTeammate(teammatesRequest).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

          document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__slideInDown")
          document.getElementsByClassName("add_teamMate")[0].classList.add("animate__slideOutUp");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  }

  /*
      @Type: File, <ts>
       @Name: createRequest()
       @Who: Anup Singh
       @When: 27-May-2021
       @Why: EWM-1434 EWM-1613
       @What: make method for multi select teammate for submit
     */
  public createRequest(): IinviteTeammate {
    let requestData: IinviteTeammate = {};
    let teammateList: Iteammate[] = [];

    requestData.OrganizationId = this.orgId;

    if (this.searchTeammate.length > 0) {
      this.searchTeammate.forEach((element) => {
        let teammate: Iteammate = {};
        teammate.Id = element.id;
        teammate.Email = element.email;
        teammate.FirstName = element.firstName;
        teammate.LastName = element.lastName;
        teammate.UserTypeCode = element.userTypeCode;
        teammateList.push(teammate)
      });
      requestData.Teammates = teammateList;
    }

    return requestData
  }



  /*
@Type: File, <ts>
@Name: onTeammateRemove()
@Who: Anup Singh
@When: 27-May-2021
@Why: EWM-1434 EWM-1613
@What: when Teammate remove from chip
*/
  onTeammateRemove(Id) {
    const index = this.searchTeammate.findIndex(x => x.id === Id);
    if (index !== -1) {
      this.searchTeammate.splice(index, 1);
      this.maxMsg = false;
    }

    if (this.searchTeammate.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }
  }



  /*
  @Type: File, <ts>
  @Name: onDismiss()
  @Who: Anup Singh
  @When: 27-May-2021
  @Why: EWM-1434 EWM-1613
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__slideOutUp");
    setTimeout(() => { this.dialogRef.close(true); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
    // this.dialogRef.close({ data: '' })
  }
}