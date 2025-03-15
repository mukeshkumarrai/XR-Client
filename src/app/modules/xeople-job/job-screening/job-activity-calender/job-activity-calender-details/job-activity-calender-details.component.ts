/* 
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 08-July-2023
    @Why: EWM-12972 EWM-12972
    @What: for showing the activity details on clicking particualr activity Id
   */
    import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { ActivatedRoute, Router } from '@angular/router';
    import { TranslateService } from '@ngx-translate/core';
    import { ZonedDate } from '@progress/kendo-date-math';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
    import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
    import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
    import { ResponceData, Userpreferences } from 'src/app/shared/models';
    import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
    import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-job-activity-calender-details',
  templateUrl: './job-activity-calender-details.component.html',
  styleUrls: ['./job-activity-calender-details.component.scss']
})
export class JobActivityCalenderDetailsComponent implements OnInit {

  maxMessage = 100;
  addForm: FormGroup;
  public divStatus: boolean = false;
  public toggleId: any;
  public loading: boolean = false;
  public activityInfo: any=[];
  public activityId: any;
  public userpreferences: Userpreferences;
  public isMyActivity:boolean=false;
  public submitted = false;
  public IsOwner: any;
  public readonly: any;
  public timezonName:any;
  timezoneName: any;
  source: any;
  xeopleImage: string;
  MeetingPlatformLogoUrl: any;
  public Zoopplaypassword:string='******';
  messageCopy:boolean;
  messageCopyPassword:boolean;
  label_copied:string='label_copied';
   /* 
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 08-July-2023
    @Why: EWM-12972 EWM-12972
    @What: For injection of service class and other dependencies
   */
  constructor(public dialogRef: MatDialogRef<JobActivityCalenderDetailsComponent>, public dialog: MatDialog,public _userpreferencesService: UserpreferencesService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private route: Router, public candidateService: CandidateService) {
   this.activityId=data.activityId;
   this.IsOwner=data.IsOwner;
  this.timezoneName=data.timezoneName;
   this.readonly=data.readonly;
   this.addForm = this.fb.group({
    Id: [''],
    activityTitle:[],
    activityDuration:[],
    attendees:[],
    organizer:[],
    Description: ['', [Validators.maxLength(100)]],
    MarkDoneTogle: [false],
  });
   if(this.readonly==1){
     this.divStatus=true;
     this.addForm.setErrors({ 'invalid': true });
     this.addForm.controls["MarkDoneTogle"].disable();
     this.addForm.controls["Description"].disable();
    
     this.editActivityForm(this.activityId);
   }else{
    this.divStatus=false;
   }
     
   }

  ngOnInit(): void {
    this.editActivityForm(this.activityId);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }

  /*
       @Name: clickToggleData
       @Who: Nitin Bhati
       @When: 08-July-2023
       @Why: EWM-12972 EWM-12972
       @What: For on/Off Toggle button.
     */
       clickToggleData(){
        this.toggleId= this.addForm.get("MarkDoneTogle").value;
        if(this.toggleId==true){
          this.divStatus=true; 
        }else{
          this.divStatus=false; 
        }
        }

         /*
       @Name: onDismiss
       @Who: Nitin Bhati
       @When: 08-July-2023
       @Why: EWM-12972 EWM-12972
       @What: Function will call when user click on cancel button.
     */
       onDismiss(): void {
        document.getElementsByClassName("add_Manage")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("add_Manage")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close({'isSave':false}); }, 200);
      }

  /*
  @Type: File, <ts>
  @Name: editActivityForm function
  @Who: Nitin Bhati
  @When: 08-July-2023
  @Why: EWM-12972 EWM-12972
  @What: getting notes data based on specific Id
*/
  editActivityForm(Id: any) {
    this.loading = true;
    this.candidateService.getActivityById('?id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            let activityInfoTemp = data.Data;
            let arr=[];
            arr.push(activityInfoTemp);
            arr.filter(x=>{
              // let startDate=new Date(x.ScheduleActivity['DateStartUTC'])
              // let endDate=new Date(x.ScheduleActivity['DateEndUTC'])
            //  x.ScheduleActivity['DateStartUTC']=ZonedDate.fromLocalDate(c, this.timezoneName);
            //  x.ScheduleActivity['DateEndUTC']=ZonedDate.fromLocalDate(endDate, this.timezoneName)
            x.ScheduleActivity['DateStartUTC'] = new Date(x.ScheduleActivity['DateStartUTC']).toLocaleString('en-US', { timeZone: this.timezoneName});
            x.ScheduleActivity['DateEndUTC'] = new Date(x.ScheduleActivity['DateEndUTC']).toLocaleString('en-US', { timeZone: this.timezoneName });
            })

          //  this.convertedTimeZone = ZonedDate.fromLocalDate(this.activityInfo, this.timezonName);
            this.activityInfo=arr[0];
            this.source=this.activityInfo.Source;
            this.MeetingPlatformLogoUrl=this.activityInfo.MeetingPlatformLogoUrl;
            if(this.source==='office365'){
              this.xeopleImage = "/assets/microsoft365.svg";
            }else{
              this.xeopleImage = "/assets/fab.png";
            }
            // this.activityInfo = data.Data;
            if(this.readonly==1){
              this.addForm.patchValue({
           
                'Description': this.activityInfo.Remarks,
                'MarkDoneTogle': this.activityInfo.CategoryId,
                'Id': this.activityInfo.Id
              });
            }else{
              this.addForm.patchValue({
                'ActivityTitle': this.activityInfo.ActivityTitle,
                'activityDuration': this.activityInfo.RelatedUserType,
                'attendees': this.activityInfo.ScheduleActivity,
                'organizer': this.activityInfo.Location,
                'ActivityUrl': this.activityInfo.ActivityUrl,
                //'Description': this.activityInfo.Description,
                //'MarkDoneTogle': this.activityInfo.CategoryId,
                'Id': this.activityInfo.Id
              });
            }
             
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

   /* 
  @Type: File, <ts>
  @Name: deleteActivity function 
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: call Api for delete record .
  */
  deleteActivity(val): void {
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'label_MenuActivity';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "355px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.loading = true;
        let delObj = {};
        delObj = val;
        this.candidateService.deleteActivityById(delObj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode == 200) {
              
              document.getElementsByClassName("add_Manage")[0].classList.remove("animate__zoomIn")
              document.getElementsByClassName("add_Manage")[0].classList.add("animate__zoomOut");
              setTimeout(() => { this.dialogRef.close({'isSave':true}); }, 200);
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
             
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      } 
    });
  }

  editActivity(acitivityInfo:any){
    document.getElementsByClassName("add_Manage")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_Manage")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({isEdit:true, activityId:acitivityInfo.Id,acitivityInfo:acitivityInfo}); }, 200);
   
  }

   /* 
    @Type: File, <ts>
    @Name: onSave function
    @Who: Renu
    @When: 18-Jan-2022
    @Why: EWM-4469 EWM-4559
    @What: For checking wheather the data save or edit on the basis on active status
   */
    onSave(value) {
      this.submitted = true;
      if (this.addForm.invalid) {
        return;
      }
      this.createRemarkStatus(value);
     }
    /* 
     @Type: File, <ts>
     @Name: createRemarkStatus function
    @Who: Nitin Bhati
    @When: 08-July-2023
    @Why: EWM-12972 EWM-12972
     @What: For saving Update activity Remark data
    */
  
    createRemarkStatus(value) {
      this.loading = true;
      let MarkDoneTogle: any;
      if (value.MarkDoneTogle == true) {
        MarkDoneTogle = 1;
      } else {
        MarkDoneTogle = 0;
      }
      let AddObj={};
      AddObj['Id'] = this.activityId;
      AddObj['IsCompleted'] = parseInt(MarkDoneTogle);
      AddObj['Remarks'] = value.Description;
      this.candidateService.createActivityReadMark(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
            document.getElementsByClassName("add_Manage")[0].classList.remove("animate__zoomIn");
            document.getElementsByClassName("add_Manage")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close({'isSave':true}); }, 200);
             this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
        err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }
  
    /*
       @Name: onMessage
       @Who: Nitin Bhati
      @When: 08-July-2023
      @Why: EWM-12972 EWM-12972
       @What: For Text count.
     */
   public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 100 - value.length;
    }
  }
     
     /*@Name: showpassword
       @Who: Nitin Bhati
       @When: 08-July-2023
       @Why: EWM-12972 EWM-12972
       @What: For showing password.
     */
  public showpassstatus:boolean=false;
  showpassword(password,showpassstatus){
    this.Zoopplaypassword = password;
    this.showpassstatus = !showpassstatus;
    }
   /*@Name: copyActivityPlayUrl
    @Who: Nitin Bhati
    @When: 08-July-2023
    @Why: EWM-12972 EWM-12972
    @What: For copy play url.
   */
copyActivityPlayUrl(jobApplicationUrl){ 
  this.messageCopy = true;
  this.label_copied='label_copiedMeetingRecordingUrl'
  setTimeout(() => {
    this.messageCopy = false;
  }, 3000);
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = jobApplicationUrl;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}
    /*@Name: copyZoomRecordingPassword
       @Who:Nitin Bhati
       @When: 31-March-2023
       @Why: EWM-11401
       @What: For copy zoom play url.
     */
copyZoomRecordingPassword(jobApplicationUrl){ 
  this.messageCopy = true;
  this.label_copied='label_copiedPassword'
  setTimeout(() => {
    this.messageCopy = false;
  }, 3000);
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = jobApplicationUrl;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

}
