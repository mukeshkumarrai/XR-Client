import { Component, OnInit } from '@angular/core';
import { ResponceData } from 'src/app/shared/models';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-access-permission',
  templateUrl: './access-permission.component.html',
  styleUrls: ['./access-permission.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class AccessPermissionComponent implements OnInit {

  public accessData: any = [];
  public isvisible: boolean;
  public viewMode: string;
  public userpreferences: Userpreferences;
  public loadingscroll: boolean;
  public loading: boolean;
  statusId: number;
  statusname: string;

  public sortedcolumnName: string = 'UserTypeName';
  public pageLabel: any = "Access Permission";
  public formtitle: string = 'grid';
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  getAccessPermissionData: Subscription;
  // animate and scroll page size

  constructor(private _systemSettingService: SystemSettingService, public _userpreferencesService: UserpreferencesService,
    private snackBService: SnackBarService, private translateService: TranslateService,) { }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getAccessPermission();
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
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }

  getAccessPermission() {
    this.loading = true;
    this.getAccessPermissionData = this._systemSettingService.getAccessPermission().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          if (repsonsedata.Data) {
            this.accessData = repsonsedata.Data;
          }
        } else {
          this.loadingscroll = false;
          this.loading = false;
        }
      },
      err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    )
  }

  updateAccessPermission(oldPatchValues, statusId, statusName) {
    this.loading = true;
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = oldPatchValues;

    toObj['Id'] = oldPatchValues.Id;
    toObj['AccessName'] = oldPatchValues.AccessName;
    toObj['Description'] = oldPatchValues.Description;
    toObj['Status'] = statusId;
    toObj['StatusName'] = statusName;
    toObj['LastUpdated'] = oldPatchValues.LastUpdated;

    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._systemSettingService.updateAccessPermission(updateObj[0]).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          // this.getAccessPermission();
        }
        else if (repsonsedata.HttpStatusCode === 400) {
          this.loading = false;
          // this.getAccessPermission();
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        else {
          this.loadingscroll = false;
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    )
  }
  toggleVisibility(data: any, i, accessPermissionData) {
    if (data == 1) {
      this.statusId = 1;
      this.statusname = 'Active';
    }
    else {
      this.statusId = 2;
      this.statusname = 'Inactive';
    }
    this.updateAccessPermission(accessPermissionData, this.statusId, this.statusname);
    setTimeout(() => {
      this.getAccessPermission();
    }, 300);
  }


  switchListMode(viewMode) {
    let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
    }
  }

  // refresh button onclick method by Adarsh Singh
  refreshComponent() {
    this.getAccessPermission();
  }


  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getAccessPermissionData API 
*/
  ngOnDestroy(): void {
    this.getAccessPermissionData.unsubscribe();

  }
}