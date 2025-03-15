/*
   @Type: File, <ts>
    @Name: contact-receipent-popup.component.ts
    @Who: Renu
    @When: 24-March-2021
    @Why: EWM-1181
    @What: common component for contact-receipent Selection option
  */
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs-compat';
import { map, startWith } from 'rxjs/operators';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { ContactReceipentService } from '../../../../shared/services/contact-recipient/contact-receipent.service';
import { ResponceData } from 'src/app/shared/models';
import { QuickJobService } from '../services/quickJob/quickJob.service';

@Component({
  selector: 'app-contact-receipent-popup',
  templateUrl: './contact-receipent-popup.component.html',
  styleUrls: ['./contact-receipent-popup.component.scss']
})
export class ContactReceipentPopupComponent implements OnInit {

  /************************Global Variables decaraed her*********************** */
  public loadingPopup: boolean;
  public searchValue: string = "";
  public searchListUser: any = [];
  public PreviewUrl: string;
  searchUser = [];
  private Isuser: boolean = true;
  userType: string = 'Blank';
  filterFor: string = '';
  orgId: string='';
  errorMsg: string = '';
  public recordFor:string='';
  constructor(public dialogRef: MatDialogRef<ContactReceipentPopupComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private snackBService: SnackBarService, private quickJobService: QuickJobService) {
    this.PreviewUrl = "/assets/user.svg";
    if (data != undefined && data != null) {
      this.Isuser = data.isUser;
      this.userType = data.userType;
      this.filterFor = data.filterFor;
      this.recordFor = data.recordFor;
    }
  }

  ngOnInit(): void {
  }

  /*
   @Type: File, <ts>
    @Name: closePopup()
    @Who: Renu
    @When: 24-Mar-2021
    @Why: EWM-1181
    @What: closing the image from dialog ref
  */
  closePopup() {
    document.getElementsByClassName("contact_receipent")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("contact_receipent")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: this.searchUser }); }, 200);

  }

  onSearch(inputValue: string) {
    if (inputValue.length === 0) {
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      if (this.filterFor == 'usergroup' && this.filterFor != undefined) {
        this.onSearchUserDetsils(inputValue);
      } else {
        this.onSearchUser(inputValue);
      }
    }
  }

  /*
@Type: File, <ts>
 @Name: onSearchUser()
 @Who: Renu
 @When: 24-Mar-2021
 @Why: EWM-1181
 @What: closing the image from dialog ref
*/
  onSearchUser(inputValue: string) {
    if (inputValue.length === 0) {
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      this.loadingPopup = true;
      this.searchValue = inputValue;
      this._settingService.getUserDirectoryList(inputValue, this.Isuser, this.userType,this.recordFor).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.errorMsg = '';
            this.loadingPopup = false;
            this.searchListUser = repsonsedata.Data;
          }
          else {
            this.loadingPopup = false;
            this.searchListUser = [];
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.errorMsg = repsonsedata.Message;
          }
        }, err => {
          this.errorMsg = err.Message;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loadingPopup = false;
        })

    }
  }


  /*
@Type: File, <ts>
@Name: onSearchUser()
@Who: Renu
@When: 24-Mar-2021
@Why: EWM-1181
@What: closing the image from dialog ref
*/
  onSearchUserDetsils(inputValue: string) {
    if (inputValue.length === 0) {
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      this.loadingPopup = true;
      this.searchValue = inputValue;
      // who:maneesh,what:ewm-11940 for by pass paging true,when:19/04/2023
      this._settingService.getUserInviteListGroupMember(inputValue, this.Isuser, this.userType +'?ByPassPaging=true').subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.errorMsg = '';
            this.loadingPopup = false;
            let filterArray = repsonsedata.Data;
            filterArray.filter(res => { res.SiteAccess == 1 && res.UserTypeCode == 'EMPL' });
            this.searchListUser = filterArray;
          }
          else {
            this.loadingPopup = false;
            this.searchListUser = [];
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.errorMsg = repsonsedata.Message;
          }
        }, err => {
          this.errorMsg = err.Message;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loadingPopup = false;
        })

    }
  }

  /*
   @Type: File, <ts>
    @Name: AddSelectUser()
    @Who: Renu
    @When: 24-Mar-2021
    @Why: EWM-1181
    @What: closing the image from dialog ref
  */
  AddSelectUser(userData: any, userName: string) {
    if (this.Isuser) {
      const index = this.searchUser.findIndex(x => x.emailId === userData.EmailId);
      if (index !== -1) {
        // this.searchUser.splice(index, 1);
      } else {
        this.searchUser.push({
          'emailId': ((userData.EmailId!=undefined) && (userData.EmailId!=null) && (userData.EmailId!=''))?userData.EmailId:userData.Email,
          'userName': ((userData.UserName!=undefined) && (userData.UserName!=null) && (userData.UserName!=''))?userData.UserName:userData.FullName,
          'userId': ((userData.UserId!=undefined) && (userData.UserId!=null) && (userData.UserId!=''))?userData.UserId:userData.Id,
          'PreviewUrl': ((userData.PreviewUrl!=undefined) && (userData.PreviewUrl!=null))?userData.PreviewUrl:userData.ProfileImageUrl,
          'FullNameEmail':(((userData.UserName!=undefined) && (userData.UserName!=null) && (userData.UserName!=''))?userData.UserName:userData.FullName) + '(' + (((userData.EmailId!=undefined) && (userData.EmailId!=null) && (userData.EmailId!=''))?userData.EmailId:userData.Email) + ')',

        })
      }
    }
    else {
      const index = this.searchUser.findIndex(x => x.emailId === userData.EmailId);
      if (index !== -1) {
        // this.searchUser.splice(index, 1);
      } else {
        this.searchUser.push({
          'emailId': ((userData.EmailId!=undefined) && (userData.EmailId!=null) && (userData.EmailId!=''))?userData.EmailId:userData.Email,
          'userName': ((userData.UserName!=undefined) && (userData.UserName!=null) && (userData.UserName!=''))?userData.UserName:userData.FullName,
          'userId': ((userData.UserId!=undefined) && (userData.UserId!=null) && (userData.UserId!=''))?userData.UserId:userData.Id,
          'PreviewUrl': ((userData.PreviewUrl!=undefined) && (userData.PreviewUrl!=null) && (userData.PreviewUrl!=''))?userData.PreviewUrl:userData.ProfileImageUrl,
          'FullNameEmail':(((userData.UserName!=undefined) && (userData.UserName!=null) && (userData.UserName!=''))?userData.UserName:userData.FullName) + '(' + (((userData.EmailId!=undefined) && (userData.EmailId!=null) && (userData.EmailId!=''))?userData.EmailId:userData.Email) + ')',

        })

      }
    }
//console.log(this.searchUser, userData,"userData")
    this.searchValue = '';
    this.searchListUser = [];
  }

  /*
@Type: File, <ts>
 @Name: onUserRemove()
 @Who: Renu
 @When: 25-Mar-2021
 @Why: EWM-1173
 @What: when user remove from chip
*/
  onUserRemove(emailId) {
    const index = this.searchUser.findIndex(x => x.emailId === emailId);
    if (index !== -1) {
      this.searchUser.splice(index, 1);
    }
  }
  /*
 @Type: File, <ts>
  @Name: onDismiss()
  @Who: Renu
  @When: 25-Mar-2021
  @Why: EWM-1173
  @What: cancel button to close the dialog
*/
  onDismiss() {
    document.getElementsByClassName("contact_receipent")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("contact_receipent")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: '' }) }, 200);
  }
  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();
  }

  // <!-- who:bantee,what: ewm-12592 cross icon are missing in the From, CC and BCC fields  ,when:18/09/2023 -->

  public onSearchClear(): void {
    this.searchValue = '';
    this.onSearchUser('');

  }
}
