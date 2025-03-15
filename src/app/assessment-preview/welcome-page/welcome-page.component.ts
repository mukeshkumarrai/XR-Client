/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: welcome-page.component.ts
 @Who: Renu
 @When: 10-June-2022
 @Why: ROST-6656 EWM-7013
 @What: welcome page
 */
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  public getStartedBox: boolean = true;
  public allTest: boolean = false;
  public questionSet: boolean = false;
  public loading: boolean;
  public assessmentId: number;
  guideLines: any;
  assessmentList: any;
  assmentPreviwArr: any;
  currentSection: {} = {};
  completeSection: any[] = [];
  QuesComp: any[] = [];
  successMsg: boolean = false;

  constructor(private userAdministrationService: UserAdministrationService, private routes: ActivatedRoute, private snackBService: SnackBarService,
    private translateService: TranslateService, private route: Router, private commonService: CommonserviceService) {

  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.assessmentId = parseInt(parms?.Id);
        this.getGuideLines();
        this.assessmentDetails();
      }
    });
  }


  testSubmit() {
    this.successMsg = true;
    this.questionSet = false;
    this.getStartedBox = false;
    this.allTest = false;

  }
  getStarted() {
    if (this.assessmentList?.PatternId == 2) {
      this.questionSet = false;
      this.allTest = true;
      this.getStartedBox = false;
    } else {
      this.questionSet = true;
      this.allTest = false;
      this.getStartedBox = false;
    }

  }
  testStart(sectionName: string, sectionId) {
    this.currentSection = { sectionName: sectionName, sectionId: sectionId };
    this.questionSet = true;
    this.allTest = false;
    this.getStartedBox = false;

  }

  submitTest() {
    this.allTest = false;
    this.getStartedBox = true;
    this.questionSet = false;
  }




  /*
 @Type: File, <ts>
 @Name: assessmentDetails function
 @Who: Renu
 @When: 10-06-2022
 @Why: EWM-6656 EWM-7013
 @What: assessment Detials api
 */
  assessmentDetails() {
    this.loading = true;
    this.userAdministrationService.getStep1InfoById('?id=' + this.assessmentId).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.assessmentList = data.Data;
          this.reviewAssement();
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }



  /*
@Type: File, <ts>
@Name: getGuideLines function
@Who: Renu
@When: 10-06-2022
@Why: EWM-6656 EWM-7013
@What: Guidelines api call
*/
  getGuideLines() {
    this.loading = true;
    this.userAdministrationService.getStep3InfoById('?id=' + this.assessmentId).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.guideLines = data.Data;
        }
        else {
          this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
  @Type: File, <ts>
  @Name: reviewAssement function
  @Who: Renu
  @When: 10-06-2022
  @Why: EWM-6656 EWM-7013
  @What: assement review  api call
  */
  reviewAssement() {
    this.loading = true;
    this.userAdministrationService.getStep4Info(this.assessmentId, this.assessmentList?.PatternId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.assmentPreviwArr = repsonsedata.Data;
            this.commonService.assessmentTotalNoOfQuestion.next(this.assmentPreviwArr.TotalNoOfQuestion);
          }
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.assmentPreviwArr = [];
          this.loading = false;
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

  onsectionCompltion(event) {
    let completedQues = 0;
    for (let key in event.quesArr) {
      if (event.quesArr[key] == 2) {
        completedQues += 1;
      }
    }
    let xyz = { 'sectionId': event.sectionId, 'totalCompleteQues': completedQues };
    this.QuesComp.push(xyz);
    this.completeSection.push(event.sectionId);
    this.allTest = true;
    this.getStartedBox = false;
    this.questionSet = false;
  }
}

