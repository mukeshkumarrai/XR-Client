import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import {ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DisconnectEmailComponent } from 'src/app/shared/modal/disconnect-email/disconnect-email.component';
import { EmailConfirmDialogComponent } from 'src/app/shared/modal/email-confirm-dialog/email-confirm-dialog.component';
import { ButtonTypes,ResponceData} from 'src/app/shared/models';
import { candidateEntity, JobScreening } from 'src/app/shared/models/job-screening';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobActivityListComponent } from '../header-panel/job-activity-list/job-activity-list.component';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { JobActivityCalenderComponent } from '../job-activity-calender/job-activity-calender.component';
import { WarningDialogComponent } from 'src/app/shared/modal/warning-dialog/warning-dialog.component';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
@Component({
  selector: 'app-job-interview',
  templateUrl: './job-interview.component.html',
  styleUrls: ['./job-interview.component.scss']
})
export class JobInterviewComponent implements OnInit {
  public loading: boolean;
  public jobInterviewForm: FormGroup;
  public candidateListOfArray: candidateEntity[];  
  // @suika @EWM-11782 Whn 01-06-2023
  @Output() reloadDataEvent = new EventEmitter();
  public allDetailsData: JobScreening;
  subscription1: Subscription;
  onActiveCandidateList: candidateEntity[];
  activeCandidateList: any=[];
  jobId: string;
  stageId: string;
  userId: any;
  FirstName: any;
  LastName: any;
  OrganiserName: string;
  OrganiserColorCode: string; 
  activityForAttendees: any;
  public EmpClientContactList: any[] = [];
  translateService: any;
  gridTimeZone: any;
  public utctimezonName: any = localStorage.getItem('UserTimezone');
  public timezonName: any = localStorage.getItem('UserTimezone');
  emailConnection: boolean;
  environment_color = '#5844DA';
  maxMoreLength=3;
  public CandidateActivityCountList: any[] = [];
  activityObj = {};
  syncInterviewDataList:any=[];
  syncStatus: boolean=false;
  syncDataList: any=[];
  syncOrganiserDataList: any=[];
  animationVar: any;
  searchInterviewer;
  searchCandidate;
  ColorCode='#5844DA';
  syncCalender: boolean=true;
  attendeesInterviewDataList:any[]=[];
  searchTextCandidate;

  ColorCodeArr:any[] = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#1E88E5",
    "#0288D1",
    "#0097A7",
    "#009688",
    "#43A047",
    "#558B2F",
    "#827717",
    "#E65100",
    "#F4511E",
    "#795548",
    "#757575",
    "#607D8B",
    "#B71C1C",
    "#880E4F",
    "#4A148C",
    "#311B92",
    "#1A237E",
    "#0D47A1",
    "#01579B",
    "#006064",
    "#004D40",
    "#1B5E20",
    "#BF360C",
    "#3E2723",
    "#263238",
]
  SelectedCandidateList: candidateEntity[];
  smallScreenTagData: number;
  largeScreenTag: boolean;
  mobileScreenTag: boolean;
  largeScreenTagData: any;
  isStarActive: number;
  saveStatus: boolean;
  isSelectedcandidateListOfArray:any=[];
  isNoRecordCategory: boolean = false;
  StatusOrganiserCheckbox: boolean=true;
  StatusInterviewerCheckbox: boolean=false;
  StatusCandidateCheckbox: boolean=false;
  syncBtnStatus=false;
  syncBtnInterviewStatus=false;
  ServiceSelectedInterviewer:any[]=[];
  ServiceSelectedCandidate:any[]=[];
  attendeesDataListService: any[];
  maxMoreLengthInterview:any;
  maxMoreLengthCandidates:any;
  subscriptionActivityNotCreated: Subscription;
  public currentMenuWidth: number;
  public clearCheckEmailConnection;
  selectedInterviewer:any[] = [];
  eventInterviewer = []
  selectedCandidate:any[] = [];
  ColorCodeIndex:number = 0;
  reloadData: boolean=false;
  @Input() ClientId:any;
  
  
  constructor(private fb: FormBuilder, private _commonService: CommonserviceService,public dialog: MatDialog,
    private systemSettingService: SystemSettingService,public _snackBarService: SnackBarService,private quickJobService: QuickJobService,
    private snackBService: SnackBarService, private _profileInfoService: ProfileInfoService,private mailService: MailServiceService) {
   }

  ngOnInit(): void {
    // this.screenMediaQuiry();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.OrganiserColorCode = primaryColor;
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.userId = currentUser?.UserId;
    this.FirstName = currentUser?.FirstName;
    this.LastName = currentUser?.LastName;
    this.OrganiserName=this.FirstName+' '+this.LastName;
     this.subscription1 = this._commonService.getJobScreeningInfo().subscribe((data: JobScreening) => {
      this.allDetailsData = data;
      this.candidateListOfArray = data?.CandidateList;
      this.candidateListOfArray?.forEach(element => {
        element['IsSelected'] = 1;
        element['Name'] = element.CandidateName;
        element['ColorCode'] = '';
        element['syncStatus'] = 0
      });
      this.SelectedCandidateList = this.candidateListOfArray?.filter(x => x['IsSelected'] === 1);
       this.initializedOnStarting();
   });
  this.activityObj['jobName'] = this.allDetailsData.JobTitle;
  this.activityObj['jobId'] = this.allDetailsData.JobId;
  this.subscriptionActivityNotCreated = this._commonService.getActivityNotCreatedInfo().subscribe((withoutActivity) => {
     let candidateOutActiity = withoutActivity?.filter(x => x['ServiceId'] === 1);
    let interviewerOutActiity = withoutActivity?.filter(x => x['ServiceId'] === 2);
    // Employee  and Client Contact List showing withour color  
    this.EmpClientContactList?.forEach( array1Ttem => {
       interviewerOutActiity?.forEach( array2Item => {
         if(array1Ttem?.Id === array2Item?.Id){
          array1Ttem['ColorCode'] = '',
          array1Ttem['syncStatus'] = 0
         }                        
      })
    });
     this.selectedInterviewer?.forEach( abc => {
      interviewerOutActiity?.forEach( xyz => {
        if(abc?.Id === xyz?.Id){
         abc['ColorCode'] = '',
         abc['syncStatus'] = 0
        }                        
     })
   });
   // For Candidate showing withour color  
   this.candidateListOfArray?.forEach( array1Ttem => {
    candidateOutActiity?.forEach( array2Item => {
      if(array1Ttem?.CandidateId === array2Item?.Id){
       array1Ttem['ColorCode'] = '',
       array1Ttem['syncStatus'] = 0
      }                        
   })
 });
 this.SelectedCandidateList?.forEach( abc => {
  candidateOutActiity?.forEach( xyz => {
     if(abc?.CandidateId === xyz?.Id){
      abc['ColorCode'] = '',
      abc['syncStatus'] = 0
     }                        
   })
  });

  // Fill blanck color for unselected candidate  
let unselectedCandidate = this.candidateListOfArray?.filter(x => x['IsSelected'] === 0);
this.candidateListOfArray?.forEach( array1Ttem => {
  unselectedCandidate?.forEach( array2Item => {
     if(array1Ttem?.CandidateId === array2Item?.CandidateId){
      array1Ttem['ColorCode'] = '',
      array1Ttem['syncStatus'] = 0
     }                        
  })
});
this.candidateListOfArray.sort((a,b)=> b.IsSelected-a.IsSelected);
// Fill blanck color for unselected Interview  
let unselectedInterview = this.EmpClientContactList?.filter(x => x['IsSelected'] === 0);
this.EmpClientContactList?.forEach( array1Ttem => {
  unselectedInterview?.forEach( array2Item => {
     if(array1Ttem?.Id === array2Item?.Id){
      array1Ttem['ColorCode'] = '',
      array1Ttem['syncStatus'] = 0
     }                        
  })
});
this.EmpClientContactList.sort((a,b)=> b.IsSelected-a.IsSelected);

});
    this.currentMenuWidth = window.innerWidth;
    this.detectScreenSize();
    this.clearCheckEmailConnection = setInterval(() => {
      if(localStorage.getItem('emailConnection')=='1'){
        this.emailConnection=true;
        clearInterval(this.clearCheckEmailConnection);
       }else{
        this.emailConnection=false;
       }
    }, 1000);
    
  }

  detectScreenSize(){
    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 500) {
      this.maxMoreLengthInterview = 1;
      this.maxMoreLengthCandidates=1;
    } else if (this.currentMenuWidth > 511 && this.currentMenuWidth < 635) {
      this.maxMoreLengthInterview = 1;
      this.maxMoreLengthCandidates=1;
    } else if (this.currentMenuWidth > 636 && this.currentMenuWidth < 767) {
      this.maxMoreLengthInterview = 1;
      this.maxMoreLengthCandidates=2;
    } else if (this.currentMenuWidth >  768 && this.currentMenuWidth < 1024) {
      this.maxMoreLengthInterview = 1;
      this.maxMoreLengthCandidates=3;
    } else if (this.currentMenuWidth >  1025 && this.currentMenuWidth < 1366) {
      this.maxMoreLengthInterview = 1;
      this.maxMoreLengthCandidates=2;
    } else {
      this.maxMoreLengthInterview = 1;
      this.maxMoreLengthCandidates=3;
    }
  }

  @HostListener("window:resize", ['$event'])
  public onResize(event) {
    event.target.innerWidth;
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
  }

    /* 
      @Name: initializedOnStarting
      @Who: Nitin Bhati
      @When: 26-06-2023
      @Why: EWM-12836
      @What: geting record for initialized staring 
    */
      initializedOnStarting() {
        this.stageId = this.allDetailsData.WorkFlowStageId;
        this.jobId = this.allDetailsData.JobId;
         this.onActiveCandidateList = this.candidateListOfArray;
         this.candidateListOfArray?.forEach(element => {
          element['Id'] = element['CandidateId'],
          element['Name'] = element['CandidateName'],
          element['Email'] = element['EmailId']
          element['Mode'] = 0,
          element['MappingId'] = 0
        });

        this.getCandidateActivityCount(this.candidateListOfArray);
        this.animationVar = ButtonTypes;
        this.jobInterviewForm = this.fb.group({
          Id: [],
          JobId: [this.allDetailsData.JobId],
          JobName: [this.allDetailsData.JobTitle],
          OrganizerOrAssignees: [this.OrganiserName],
          RelatedUserType: ['EMPL', [Validators.required]],
          RelatedUserTypeName: ['Employee'], 
          InterviewerNameTo: [''],
          Candidates: [this.candidateListOfArray,[Validators.required]],
          TimeZone: ['', [Validators.required]], 
          OrganizerCheckbox:[true,],
          InterviewerCheckbox:[false],
          CandidatesCheckbox:[false],
          selectedInterviewerField:[],
        })       
        this.onChangeActivityRelatedTo('EMPL'); 
        this.getTimeZone();
        this.checkEmailConnection();
        this.syncActivityByDefualt();
        
        // adding code code on staring Adarsh singh
        let selectInterviewrArr =[...this.jobInterviewForm.get('Candidates').value];
        selectInterviewrArr.forEach(e => {
          this.selectedCandidate.push({
            ...e
          })
        })
        let newFormulalist =  this.selectedCandidate?.filter((v,i) => this.selectedCandidate.findIndex(item => item.CandidateId == v.CandidateId) === i);
        this.selectedCandidate = [...newFormulalist]
        // End 
      }

      
  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

/*
  @Type: File, <ts>
  @Name: getcanJobActivities function
  @Who: Nitin Bhati
  @When: 23-June-2023
  @Why: EWM-11778 EWM-12836
  @What: get candidate Job avtivity details
*/
getcanJobActivities(IsHaveActivity) {
  if(IsHaveActivity>0){
    const dialogRef = this.dialog.open(JobActivityListComponent, {
      data: { eventFor: 'Interview',activityStatus:true},
      /* @When: 12-06-2023 @who:Amit @what: popup size & class change */
      panelClass: ['xeople-drawer', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
  }
 
}
/*
  @Type: File, <ts>
  @Name: onActivityChange
  @Who: Nitin Bhati
  @When: 20-mar-2022
  @Why:EWM-11254 EWM-11257
  @What: get data when activity change
*/
compareFn(c1: any, c2: any): boolean {
  return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
}
 /*
    @Type: File, <ts>
    @Name: onChangeActivityRelatedTo
    @Who: Nitin Bhati
    @When: 23-June-2023
    @Why: EWM-11778 EWM-12836
    @What: 
    */
    onChangeActivityRelatedTo(activityFor) {
      this.activityForAttendees = activityFor;
      this.EmpClientContactList=[]
      if (activityFor == "EMPL") {
        this.getEmployeeData();
         this.jobInterviewForm.patchValue({
           'RelatedUserType':activityFor
         })
      } else if (activityFor == "CLIE") {
        this.getClientContactData();
        this.jobInterviewForm.patchValue({
          'RelatedUserType': activityFor
        })
      } 
    }

     /*
    @Type: File, <ts>
    @Name: getActivityTypeCategory
    @Who: Nitin Bhati
    @When: 23-June-2023
    @Why: EWM-11778 EWM-12836
    @What: get data category when selcet activity related to
    */
  getEmployeeData() {
    // this.loading = true; //by maneesh ewm-17723 when:29/07/2024 comment this
    this.EmpClientContactList=[]
    this.selectedInterviewer=[];
    this.systemSettingService.getEmployeeList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.EmpClientContactList = repsonsedata.Data;
          this.EmpClientContactList?.forEach(element => {
            element['IsSelected'] = 0;
            //element['ColorCode'] = this.ColorCode;
          });
          this.selectedInterviewer = this.EmpClientContactList?.filter(x => x['IsSelected'] === 1);
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

   /*
    @Type: File, <ts>
    @Name: getActivityTypeCategory
    @Who: Nitin Bhati
    @When: 23-June-2023
    @Why: EWM-11778 EWM-12836
    @What: get data category when selcet activity related to
    */
    getClientContactData() {
      this.loading = true;
      this.EmpClientContactList=[]
      this.selectedInterviewer=[];
      let jsonObj = {};
      jsonObj['GridId'] = 'CandidateJobMapping_grid_001';
      jsonObj['ClientId'] = this.ClientId;
      this.quickJobService.getCompanyDetailsList(jsonObj).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
            this.loading = false;
            this.EmpClientContactList = repsonsedata.Data; 
            this.EmpClientContactList?.forEach(element => {
              element['IsSelected'] = 0;
              element['Name'] = element.FullName;
            });
            this.selectedInterviewer = this.EmpClientContactList?.filter(x => x['IsSelected'] === 1);
          } else {
            // @suika @EWM-13721 @whn 08-08-2023 handle 400 error
            this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);  
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
        })
    }

  
    /*
   @Type: File, <ts>
   @Name: getRelatedTo function
   @Who: Nitin Bhati
   @When: 23-June-2023
   @Why: EWM-11778 EWM-12836
   @What: for getting Related to user candidate
 */
  getColorCodeIndexingWise(){
    this.ColorCodeIndex += 1;
    return this.ColorCodeArr[this.ColorCodeIndex];
  }
  /*
  @Type: File, <ts>
  @Name: withSyncInterviewer function
  @Who: Nitin Bhati
  @When: 23-June-2023
  @Why: EWM-11778 EWM-12836
  @What: For sync Interview
*/
  withSyncInterviewer(){
    this.jobInterviewForm.patchValue({
      InterviewerNameTo: this.selectedInterviewer
    })
    let selectInterviewrArr =[...this.jobInterviewForm.value.InterviewerNameTo];
    this.selectedInterviewer = []
    selectInterviewrArr?.forEach(e => {
      this.selectedInterviewer.push({
        ...e,
        ColorCode : this.getColorCodeIndexingWise(),
        syncStatus: 1
      })
    })
     let newFormulalist =  this.selectedInterviewer?.filter((v,i) => this.selectedInterviewer.findIndex(item => item.Id == v.Id) === i);
    this.selectedInterviewer = [...newFormulalist];
    this.EmpClientContactList.forEach( array1Ttem => {
      this.selectedInterviewer.forEach( array2Item => {
         if(array1Ttem.Id == array2Item.Id && array1Ttem.IsSelected == 1 ){
          array1Ttem['ColorCode'] = array2Item['ColorCode'],
          array1Ttem['ServiceId'] = 2,
          array1Ttem['Mode'] = 0,
          array1Ttem['MappingId'] = 0,
          array1Ttem['syncStatus'] = 1
         }         
      })
    });
    this.ServiceSelectedInterviewer = this.EmpClientContactList?.filter(x => x['IsSelected'] === 1); 
  }
/*
  @Type: File, <ts>
  @Name: withSyncCandidate function
  @Who: Nitin Bhati
  @When: 23-June-2023
  @Why: EWM-11778 EWM-12836
  @What: For sync candidate
*/
  withSyncCandidate(){
    let selectInterviewrArr = [...this.jobInterviewForm.value.Candidates];
    this.SelectedCandidateList = this.candidateListOfArray?.filter(x => x['IsSelected'] === 1);
    this.SelectedCandidateList = [];
    selectInterviewrArr.forEach(e => {
      this.SelectedCandidateList.push({
        ...e,
        ColorCode: this.getColorCodeIndexingWise(),
        syncStatus: 1,
      })
    })
      this.candidateListOfArray.forEach( array1Ttem => {
      this.SelectedCandidateList.forEach( array2Item => {
         if(array1Ttem.CandidateId == array2Item.CandidateId && array1Ttem.IsSelected == 1 ){
          array1Ttem['ColorCode'] = array2Item['ColorCode'];
          array1Ttem['Id'] = array2Item['CandidateId'];
          array1Ttem['ServiceId'] = 1;
          array1Ttem['Email'] = array2Item['EmailId'];
          array1Ttem['Mode'] = 0;
          array1Ttem['MappingId'] = 0;
          array1Ttem['syncStatus'] = 1;
         }         
      })
    });
    this.SelectedCandidateList = this.candidateListOfArray?.filter(x => x['IsSelected'] === 1);
    this.ServiceSelectedCandidate = [...this.SelectedCandidateList];
    }
 
/*
   @Type: File, <ts>
   @Name: getTimeZone
   @Who: Nitin Bhati
   @When: 23-June-2023
   @Why: EWM-11778 EWM-12837
   @What: for getting all timezone info
   */

   getTimeZone() {
    this._profileInfoService.getTimezone().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == 200) {
          this.gridTimeZone = repsonsedata.Data;
          let gridTimeZone = this.gridTimeZone?.filter(x => x['Id'] === this.timezonName);
          this.utctimezonName = gridTimeZone[0]?.Timezone;
          this.jobInterviewForm.patchValue({
            'TimeZone': {Id:gridTimeZone[0]?.Id,Timezone:gridTimeZone[0]?.Timezone},
         })       
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
@Type: File, <ts>
@Name: disConnectEmail function
@Who: Nitin Bhati
@When: 23-June-2023
@Why: EWM-11778 EWM-12837
@What: service call for email disconnection
*/
disConnectEmail(): void {
  const message = `label_areYouSureDisconnectionMsg`;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(EmailConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.emaildisconnection();
    }
  })

}

/*
@Type: File, <ts>
@Name: emaildisconnection function
@Who: Nitin Bhati
@When: 23-June-2023
@Why: EWM-11778 EWM-12837
@What: service call for email disconnection
*/
emaildisconnection() {
  this.loading = true;
  this.mailService.emailDisconnection().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.emailConnection=false;
        // <!---------@When: 19-12-2022 @who:Adarsh singh @why: EWM-9908 --------->
        let isEmail:any = 0;
        localStorage.setItem("emailConnection", isEmail);
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this.dialog.open(DisconnectEmailComponent, {
          maxWidth: '350px',
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
       // this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
       this.clearCheckEmailConnection = setInterval(() => {
        if(localStorage.getItem('emailConnection')=='1'){
          this.emailConnection=true;
          clearInterval(this.clearCheckEmailConnection);
         }else{
          this.emailConnection=false;
         }
      }, 1000);
      }

      //this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), String(data.HttpStatusCode));
      this.loading = false;

    }, err => {
      this.loading = false;
      this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

/*
  @Type: File, <ts>
  @Name: checkEmailConnection function
  @Who: Nitin Bhati
  @When: 23-June-2023
  @Why: EWM-11778 EWM-12837
  @What: check email connection is established or not
  */
  checkEmailConnection(){
    this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          if(data.Data.IsEmailConnected==1){
           this.emailConnection=true;
          }else{
            this.emailConnection=false;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
       this.loading = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
    }

/*
@Type: File, <ts>
@Name: onChangeTimezone()
@Who: Nitin Bhati
@When: 23-June-2023
@Why: EWM-11778 EWM-12836
@What: get time according to chosen timezone
*/
onChangeTimezone(event){
   this._commonService.setJobInterviewTimeZoneInfo(event?.Id);

}

  /* 
  @Name: getBackgroundColor function
  @Who: Nitin Bhati
  @When: 23-June-2023
  @Why: EWM-11778 EWM-12836
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}

  /*
    @Type: File, <ts>
    @Name: getActivityTypeCategory
    @Who: Nitin Bhati
    @When: 23-June-2023
    @Why: EWM-11778 EWM-12836
    @What: get data category when selcet activity related to
    */
    getCandidateActivityCount(activeCandidateList) {
      let Obj = {};
      Obj['JobId'] = this.jobId;
      Obj['CandidateList'] = activeCandidateList;
      this.systemSettingService.getCandidateActivityCount(Obj).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
            //  this.loading = false;
            this.CandidateActivityCountList = repsonsedata?.Data?.CandidateList;
          } else {
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
        })
    }
    /*
    @Type: File, <ts>
    @Name: checkSYNCForWhich
    @Who: Nitin Bhati
    @When: 29-June-2023
    @Why: EWM-11778 EWM-12837
    @What: Click for checkbox
    */
    checkSYNCForWhich(isChecked, checkboxName){
      if(checkboxName=='Organizer'){
        //this.syncOrganiserDataList.push({ "Id": this.userId, "ColorCode": this.OrganiserColorCode,"ServiceId": 3,"Name":this.OrganiserName });
        if(isChecked==true){
          this.syncOrganiserDataList.forEach(element => {
            element['Id'] = this.userId;
          });
        }else{
          this.syncOrganiserDataList.forEach(element => {
            element['Id'] = '00000000-0000-0000-0000-000000000000';
          });
        }
        this.StatusOrganiserCheckbox=isChecked;
      }else if(checkboxName=='Interviewer'){
        this.syncBtnStatus=isChecked;
        this.StatusInterviewerCheckbox=isChecked;
      }else if(checkboxName=='Candidates'){
        this.syncBtnStatus=isChecked;
        this.StatusCandidateCheckbox=isChecked;
      }
    }
    /*
    @Type: File, <ts>
    @Name: syncActivity
    @Who: Nitin Bhati
    @When: 28-June-2023
    @Why: EWM-11778 EWM-12837
    @What: Click for sync Activity
    */
    syncActivity(value){
      localStorage.setItem('interviewStatus','1');
      this.ColorCodeIndex= 0;
      this.syncCalender=false;
      this.syncDataList=[];
      this.syncInterviewDataList=[];
      this.attendeesInterviewDataList=[];
      //this.syncOrganiserDataList=[];
      this.ServiceSelectedCandidate=[];
      this.ServiceSelectedInterviewer=[];
   
    if(this.StatusOrganiserCheckbox==true && this.StatusInterviewerCheckbox==true && this.StatusCandidateCheckbox==true){     
      this.syncDataList=this.activeCandidateList;
      this.syncInterviewDataList=value.InterviewerNameTo;
      this.withSyncCandidate();
      this.withSyncInterviewer();
      }else if(this.StatusOrganiserCheckbox==true && this.StatusInterviewerCheckbox==true && this.StatusCandidateCheckbox==false ){
        this.syncInterviewDataList=value.InterviewerNameTo;
        this.withSyncInterviewer();
      }else if(this.StatusOrganiserCheckbox==true && this.StatusCandidateCheckbox==true && this.StatusInterviewerCheckbox==false ){
       this.syncDataList=this.activeCandidateList;
       this.withSyncCandidate();
       }else if(this.StatusInterviewerCheckbox==true && this.StatusCandidateCheckbox==true && this.StatusOrganiserCheckbox==false){
      this.syncDataList=this.activeCandidateList;
      this.syncInterviewDataList=value.InterviewerNameTo;
      this.withSyncCandidate();
      this.withSyncInterviewer();
      }else if(this.StatusOrganiserCheckbox==false && this.StatusCandidateCheckbox==true && this.StatusInterviewerCheckbox==false ){
        this.syncDataList=this.activeCandidateList;
        this.withSyncCandidate();
      }else if(this.StatusOrganiserCheckbox==false && this.StatusInterviewerCheckbox==true && this.StatusCandidateCheckbox==false ){
        this.syncInterviewDataList=value.InterviewerNameTo;
        this.withSyncInterviewer();
      }
      this.syncCalender=true;
      this.syncStatus=true;
      this.attendeesInterviewDataList=[...this.syncOrganiserDataList,...this.ServiceSelectedCandidate,...this.ServiceSelectedInterviewer];
      this.getCandidateActivityCount(this.candidateListOfArray);
      this._commonService.setJobInterviewInfo(this.attendeesInterviewDataList);
      }
      
      /*
    @Type: File, <ts>
    @Name: syncActivityByDefualt
    @Who: Nitin Bhati
    @When: 28-June-2023
    @Why: EWM-11778 EWM-12837
    @What: Click for sync Activity
    */
    syncActivityByDefualt(){
       this.syncStatus=false;
      this.syncDataList=this.candidateListOfArray;
      this.syncInterviewDataList=[];
      //this.syncOrganiserDataList=[this.userId];
      this.syncOrganiserDataList.push({ "Id": this.userId, "ColorCode": this.OrganiserColorCode,"ServiceId": 3,"Name":this.OrganiserName });
  // this.JobActivityCalenderComponent.childMethod(this.syncDataList);
      }
  /*
    @Type: File, <ts>
    @Name: removeCandidate function
    @Who: Nitin Bhati
    @When: 4-July-2023
    @Why: EWM-12970
    @What:select removeCandidate list
    */
    removeCandidate(value: any) {
      if(this.SelectedCandidateList.length>1){
        let selectedArray = this.SelectedCandidateList?.filter(x => x['CandidateId'] == value?.CandidateId);   
        selectedArray.forEach(element => {
          element['IsSelected'] = 0;
        });
        this.SelectedCandidateList = this.SelectedCandidateList?.filter(x => x['IsSelected'] === 1);
        
        let selectedCandidateArray = this.candidateListOfArray?.filter(x => x['CandidateId'] == value?.CandidateId);   
        selectedCandidateArray.forEach(element => {
          element['IsSelected'] = 0;
          //element['ColorCode'] = '';
        });
      }
      let attendeesDataListService=[];
      attendeesDataListService=[...this.SelectedCandidateList,...this.selectedInterviewer];
      this._commonService.setJobInterviewAttendeeInfo(attendeesDataListService);
      //console.log("removeCandidate Service:",this.SelectedCandidateList);
     } 
    /*
    @Type: File, <ts>
    @Name: updateCandidateList function
    @Who: Nitin Bhati
    @When: 4-July-2023
    @Why: EWM-12970
    @What:select tag list
    */
    updateCandidateList($event: any, value: any) {
      $event.stopPropagation();
      $event.preventDefault();
      if (value?.IsSelected == 0) {
        this.isStarActive = 1;
      } else {
        this.isStarActive = 0;
      }
      let validationCheck = this.selectedInterviewer.length+this.SelectedCandidateList.length;
        if(validationCheck<=28){
          if(this.SelectedCandidateList.length>1){
            let selectedArray = this.candidateListOfArray?.filter(x => x['CandidateId'] == value?.CandidateId);   
            selectedArray.forEach(element => {
              element['IsSelected'] = this.isStarActive;
              //element['ColorCode'] = '';
            });
            this.SelectedCandidateList = this.candidateListOfArray?.filter(x => x['IsSelected'] === 1);
            this.candidateListOfArray.sort((a,b)=> b.IsSelected-a.IsSelected)
            }else if(this.SelectedCandidateList.length==1){
              let selectedArray = this.candidateListOfArray?.filter(x => x['CandidateId'] == value?.CandidateId);   
              selectedArray.forEach(element => {
                element['IsSelected'] = 1;
                //element['ColorCode'] = '';
              });
              this.SelectedCandidateList = this.candidateListOfArray?.filter(x => x['IsSelected'] === 1);
              this.candidateListOfArray.sort((a,b)=> b.IsSelected-a.IsSelected)
            }
        }else{
          let selectedArray = this.candidateListOfArray?.filter(x => x['CandidateId'] == value?.CandidateId);   
            selectedArray.forEach(element => {
              element['IsSelected'] = 0;
              //element['ColorCode'] = '';
            });
            this.SelectedCandidateList = this.candidateListOfArray?.filter(x => x['IsSelected'] === 1);
            this.candidateListOfArray.sort((a,b)=> b.IsSelected-a.IsSelected);   
            let validationCheckAgain = this.selectedInterviewer.length+this.SelectedCandidateList.length;
          if(validationCheckAgain<=28){
          }else{
            this.getValidationMaxSelected();
          }
           // this.getValidationMaxSelected();
        }     
        let attendeesDataListService=[];
        attendeesDataListService=[...this.SelectedCandidateList,...this.selectedInterviewer];
        this._commonService.setJobInterviewAttendeeInfo(attendeesDataListService);
        //console.log("updateCandidateList Service:",this.SelectedCandidateList);
     }  
   /*
    @Type: File, <ts>
    @Name: updateInterviewerList function
    @Who: Nitin Bhati
    @When: 4-July-2023
    @Why: EWM-12970
    @What:select update Interview list
    */
    updateInterviewerList($event: any, value: any) {
      $event.stopPropagation();
      $event.preventDefault();
        let validationCheck = this.selectedInterviewer.length+this.SelectedCandidateList.length;
        if (value?.IsSelected == 0) {
          this.isStarActive = 1;
        } else {
          this.isStarActive = 0;
        }
        if(validationCheck<=28){
          let selectedArray = this.EmpClientContactList?.filter(x => x['Id'] == value?.Id);   
          selectedArray.forEach(element => {
            element['IsSelected'] = this.isStarActive;
          });
          this.selectedInterviewer = this.EmpClientContactList?.filter(x => x['IsSelected'] === 1);
          this.EmpClientContactList.sort((a,b)=> b.IsSelected-a.IsSelected)
        }else{
          let selectedArray = this.EmpClientContactList?.filter(x => x['Id'] == value?.Id);   
          selectedArray.forEach(element => {
            element['IsSelected'] = 0;
          });
          this.selectedInterviewer = this.EmpClientContactList?.filter(x => x['IsSelected'] === 1);
          this.EmpClientContactList.sort((a,b)=> b.IsSelected-a.IsSelected);
          let validationCheckAgain = this.selectedInterviewer.length+this.SelectedCandidateList.length;
          if(validationCheckAgain<=28){
          }else{
            this.getValidationMaxSelected();
          }         
        }
        let attendeesDataListService=[];
        attendeesDataListService=[...this.SelectedCandidateList,...this.selectedInterviewer];
        this._commonService.setJobInterviewAttendeeInfo(attendeesDataListService);    
          
      }  

   /*
    @Type: File, <ts>
    @Name: removeInterview function
    @Who: Nitin Bhati
    @When: 4-July-2023
    @Why: EWM-12970
    @What:select removeInterview list
    */
    removeInterview(value: any) {
      let selectedArray = this.selectedInterviewer?.filter(x => x['Id'] == value?.Id);   
      selectedArray.forEach(element => {
        element['IsSelected'] = 0;
      });
      this.selectedInterviewer = this.selectedInterviewer?.filter(x => x['IsSelected'] === 1);
      let selectedEmpClientArray = this.EmpClientContactList?.filter(x => x['Id'] == value?.Id);   
      selectedEmpClientArray.forEach(element => {
        element['IsSelected'] = 0;
      });
      let attendeesDataListService=[];
      attendeesDataListService=[...this.SelectedCandidateList,...this.selectedInterviewer];
      this._commonService.setJobInterviewAttendeeInfo(attendeesDataListService);
     }   

/* 
  @Name: ngOnDestroy
  @Who: Nitin Bhati
  @When: 6-July-2023
  @Why: EWM-12970
  @What: to store data in service 
*/
ngOnDestroy(): void {
  this.subscription1.unsubscribe();
}

 /*
     @Type: File, <ts>
     @Name: getValidationMaxSelected function
     @Who: Nitin Bhati
     @When: 07-07-2023
     @Why: EWM-12972
     @What: For validation for selected 
   */
     getValidationMaxSelected() {
      const message = `label_maxInterviewerValidation`;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(WarningDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
       
      });
  
    }
    connectEmail(){
      window.open('./client/core/profile/email-integration', '_blank'); 
    }
 
   // @suika @EWM-13433 Whn 19-07-2023 To send reload api event on data saving.
  getReloadDataEvent(event) {
    if (event) {
      this.reloadData = true;
      this.reloadDataEvent.emit(true);
    } else {
      this.reloadData = false;
      this.reloadDataEvent.emit(false);
    }
  }

}
