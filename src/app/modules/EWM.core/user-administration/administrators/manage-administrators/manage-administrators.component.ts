import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { UserAdministrationService } from '../../../shared/services/user-administration/user-administration.service';

@Component({
  selector: 'app-manage-administrators',
  templateUrl: './manage-administrators.component.html',
  styleUrls: ['./manage-administrators.component.scss']
})
export class ManageAdministratorsComponent implements OnInit {
  organizationFrom: FormGroup;
  PreviewUrl: string;
  public loading: boolean;
  public searchChar: string;
  public loadingPopup: boolean;
  public searchDataList = [];
  public searchTextProduct
  public noData: boolean=false;




  constructor(private translateService: TranslateService, private fb: FormBuilder,
    public _dialog: MatDialog,
    private _userAdministrationService: UserAdministrationService, private _profileInfoService: ProfileInfoService, private route: Router, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, public dialog: MatDialog, private rtlLtrService: RtlLtrService,
    private appSettingsService: AppSettingsService) {

    this.organizationFrom = this.fb.group({
      UserId: [''],
      searchTextFiltered: ['']
    })
    this.PreviewUrl = "/assets/user.svg";
  }

  ngOnInit(): void {
  }


  get f() { return this.organizationFrom.controls; }

  /* 
@Type: File, <ts>
@Name: getsearchDataList
@Who: Nitin Bhati
@When: 29-Nov-2020
@Why: ROST-309
@What: for serach user Information
*/
  getsearchDataList(event: any) {
    this.searchChar = event.target.value;
    let numberOfCharacters = event.target.value.length;
    let maxNumberOfCharacters = 2;
    if (numberOfCharacters > maxNumberOfCharacters) {
      this.loadingPopup = true;
      this._userAdministrationService.getSearchAdmin(this.searchChar).subscribe(
        repsonsedata => {
          this.loadingPopup = false;
          this.searchDataList = repsonsedata['Data'];
          this.noData =true;
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loadingPopup = false;
          this.noData =false;

        })
    }
  }

  /* 
   @Type: File, <ts>
   @Name: AddAdminUser
   @Who: Nitin Bhati
   @When: 26-Nov-2020
   @Why: ROST-428
   @What: For Add Organization Information
   */
  AddAdminUser(UserId, UserFirstName, UserLastName, UserEmail) {
    const formData = {
      UserId: UserId,
      UserFirstName: UserFirstName,
      UserLastName: UserLastName,
      UserEmail: UserEmail,
    };
    this.loading = true;
    this._userAdministrationService.AddAdministratorsUser(JSON.stringify(formData)).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = true;
          this._userAdministrationService.getSearchAdmin(this.searchChar).subscribe(
            repsonsedata => {
              this.loading = false;
              this.searchDataList = repsonsedata['Data'];
              this.route.navigate(['./client/core/administrators/administrators']);
            }, err => {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
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
