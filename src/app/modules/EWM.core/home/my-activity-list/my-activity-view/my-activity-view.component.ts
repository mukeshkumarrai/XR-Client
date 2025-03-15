/*
@Type: File, <ts>
@Name: my-activity-view.component.ts
@Who: Anup
@When: 18-jan-2022
@Why: EWM-4478 EWM-4715
@What: my activity view
*/
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ClientService } from '../../../shared/services/client/client.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-my-activity-view',
  templateUrl: './my-activity-view.component.html',
  styleUrls: ['./my-activity-view.component.scss']
})
export class MyActivityViewComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<MyActivityViewComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute, private systemSettingService: SystemSettingService,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService,
    private jobService: JobService, private clientService: ClientService) { }

  ngOnInit(): void {
    this.myActivityDataBy(this.data?.activityId)
  }




  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Anup
@When: 18-jan-2022
@Why: EWM-4478 EWM-4715
@What: For close popup
*/
  onDismiss() {
    document.getElementsByClassName("viewActivity")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("viewActivity")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }




  /*
 @Type: File, <ts>
 @Name: myActivityDataBy function
 @Who: Anup
 @When: 18-jan-2022
 @Why: EWM-4478 EWM-4715
 @What: getting my activity data based on specific Id
*/
  oldPatchValues: any = {};
  loading: boolean = false;
  myActivityDataBy(Id: any) {
    this.loading = true;
    this.systemSettingService.getMyActivityById('?id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.oldPatchValues = data.Data;
            this.loading = false;

          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }


}
