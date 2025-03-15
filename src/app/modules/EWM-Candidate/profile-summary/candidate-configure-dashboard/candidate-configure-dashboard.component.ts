import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-candidate-configure-dashboard',
  templateUrl: './candidate-configure-dashboard.component.html',
  styleUrls: ['./candidate-configure-dashboard.component.scss']
})
export class CandidateConfigureDashboardComponent implements OnInit {
  background20: any;
  loading: boolean = true;
  leftColumn = [];
  rightColumn = [];
  ConfigData: any = []


  constructor(public _dialog: MatDialog, public dialogRef: MatDialogRef<CandidateConfigureDashboardComponent>,
    private commonserviceService: CommonserviceService, public candidateService: CandidateService,
    private snackBService: SnackBarService, private translateService: TranslateService,) { }

  ngOnInit(): void {
    this.getFilterConfig();
    //false
    this.commonserviceService.candidatesummaryDashboardSubject.next(false);

    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);
  }


  /*
@Type: File, <ts>
@Name: getFilterConfig function
@Who: Anup
@When: 05-oct-2021
@Why: EWM-3088 EWM-3138
@What: For get filter config data
*/
  getFilterConfig() {
    this.loading = true;
    this.candidateService.getfilterConfigCandidate().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== null && repsonsedata.Data !== null) {
            this.ConfigData = repsonsedata.Data.GridConfig;

            if (this.ConfigData != undefined && this.ConfigData != null) {
              this.leftColumn = this.ConfigData.filter((item) => {
                return item.Alighment == "Left"
              })

              this.rightColumn = this.ConfigData.filter((item) => {
                return item.Alighment == "Right"
              })
            }

          }
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
 @Name: dropLeft function
 @Who: Anup
 @When: 04-oct-2021
 @Why: EWM-3088 EWM-3138
 @What: For get filter of left side after drop
 */
  dropLeft(event: CdkDragDrop<string[]>) {
    this.ConfigData = [];
    moveItemInArray(this.leftColumn, event.previousIndex, event.currentIndex);
    this.leftColumn = this.leftColumn;
    let leftarr: any = {}
    for (let index = 0; index < this.leftColumn.length; index++) {
      const element = this.leftColumn[index];
      leftarr = {
        "Type": "",
        "Field": "",
        "Order": index + 1,
        "Title": element.Title,
        "Selected": true,
        "Format": null,
        "Locked": true,
        "width": "100",
        "Alighment": "Left"
      }
      this.ConfigData.push(leftarr);
    }

    let rightarr: any = {}
    for (let index = 0; index < this.rightColumn.length; index++) {
      const element = this.rightColumn[index];
      rightarr = {
        "Type": "",
        "Field": "",
        "Order": index + 1,
        "Title": element.Title,
        "Selected": true,
        "Format": null,
        "Locked": true,
        "width": "100",
        "Alighment": "Right"
      }
      this.ConfigData.push(rightarr);
    }

  }


  /*
@Type: File, <ts>
@Name: dropRight function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: For get filter of right side after drop
*/
  dropRight(event: CdkDragDrop<string[]>) {
    this.ConfigData = [];
    moveItemInArray(this.rightColumn, event.previousIndex, event.currentIndex);
    this.rightColumn = this.rightColumn;
    let rightarr: any = {};
    for (let index = 0; index < this.rightColumn.length; index++) {
      const element = this.rightColumn[index];
      rightarr = {
        "Type": "",
        "Field": "",
        "Order": index + 1,
        "Title": element.Title,
        "Selected": true,
        "Format": null,
        "Locked": true,
        "width": "100",
        "Alighment": "Right"
      }
      this.ConfigData.push(rightarr);
    }

    let leftarr: any = {}
    for (let index = 0; index < this.leftColumn.length; index++) {
      const element = this.leftColumn[index];
      leftarr = {
        "Type": "",
        "Field": "",
        "Order": index + 1,
        "Title": element.Title,
        "Selected": true,
        "Format": null,
        "Locked": true,
        "width": "100",
        "Alighment": "Left"
      }
      this.ConfigData.push(leftarr);
    }

  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }


  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: For close popup
*/

  onDismiss(): void {
    document.getElementsByClassName("candidateConfigureDashboard")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateConfigureDashboard")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }



  /*
@Type: File, <ts>
@Name: onSave function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: save data after drag and drop
*/
  onSave() {
    let gridConf = {};
    gridConf['GridId'] = 'CandidateSummary_grid_001';
    gridConf['GridConfig'] = this.ConfigData;
    gridConf['CardConfig'] = [];
    this.candidateService.setfilterConfigCandidate(gridConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.commonserviceService.candidatesummaryDashboardSubject.next(true);
          document.getElementsByClassName("candidateConfigureDashboard")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("candidateConfigureDashboard")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })



  }





}
