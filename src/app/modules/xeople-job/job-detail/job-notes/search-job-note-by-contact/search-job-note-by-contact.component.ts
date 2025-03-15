/*
    @Type: File, <ts>
    @Name: search-note-by-contact.component.ts
    @Who: Nitin Bhati
    @When: 15-04-2024
    @Why: EWM-16214,EWM-16731
    @What: popup component for search job notes by contacts
  */
    import { Component, Inject, OnInit, Optional } from '@angular/core';
    import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { TranslateService } from '@ngx-translate/core';
    import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
    import { ContactReceipentService } from '../../../../../shared/services/contact-recipient/contact-receipent.service';
    import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
    import { IinviteTeammate, Iteammate } from '@app/modules/EWM.core/invite-a-teammate/Iinvite-a-teammate';
    import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';

@Component({
  selector: 'app-search-job-note-by-contact',
  templateUrl: './search-job-note-by-contact.component.html',
  styleUrls: ['./search-job-note-by-contact.component.scss']
})
export class SearchJobNoteByContactComponent implements OnInit {
 /************************Global Variables decaraed her*********************** */
 public loadingPopup: boolean;
 public searchValue: string = "";
 public searchListUser: any = [];
 public PreviewUrl: string;
 searchContacs = [];
 orgId: any;
 maxMsg: boolean = false;
 loading: boolean;
 noRecordFound: string;
 maxSelectEmail: any;
 saveEnableDisable: boolean = true;
 public selecteddata:[]
 clientId: string;
 constructor(public dialogRef: MatDialogRef<SearchJobNoteByContactComponent>, @Optional()
 @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
   public _settingService: ContactReceipentService,
   private snackBService: SnackBarService, private appSettingsService: AppSettingsService,private _jobService: JobService) {
   this.PreviewUrl = "/assets/user.svg";
   this.maxSelectEmail = this.appSettingsService.maxSelectEmail;
   this.clientId=data.clientId;
 }
 ngOnInit(): void {
        this.selecteddata = this.data?.selectedorDeselected?.filter(x => x.IsSelected == 1);          
        if (this.selecteddata?.length>0) {
          this.searchContacs=this.selecteddata; 
          this.saveEnableDisable=false;  
        }
  }
 onsearchTeammate(inputValue: string) {
   if (inputValue?.length === 0) {
     this.noRecordFound = "";
     this.searchListUser = [];
   }
   if (inputValue?.length > 3) {
     this.loadingPopup = true;
     this.searchValue = inputValue;
     this._jobService.getJobNoteContactByJobId("?search="+inputValue+ "&ClientId="+this.clientId).subscribe(
       (repsonsedata: any) => {
         if (repsonsedata.HttpStatusCode === 200) {
           this.loadingPopup = false;
           this.searchListUser = repsonsedata?.Data;
           this.noRecordFound = "";
           this.maxMsg = false;
         }else if (repsonsedata.HttpStatusCode === 204) {
          this.loadingPopup = false;
          this.noRecordFound = repsonsedata.Message;
          this.searchListUser = [];
          this.maxMsg = false;
        }
         else if (repsonsedata?.HttpStatusCode === 400 && repsonsedata?.Data == null) {
           this.loadingPopup = false;
           this.noRecordFound = repsonsedata?.Message;
           this.searchListUser = [];
           this.maxMsg = false;
         }
         else {
           this.loadingPopup = false;
           this.noRecordFound = "";
           this.maxMsg = false;
         }
       }, err => {
         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         this.loadingPopup = false;
         this.noRecordFound = ""
         this.maxMsg = false;
       })
   }
 }
AddSelectTeammate(userData: any) {
     const index = this.searchContacs?.findIndex(x => x?.UserId === userData?.Id);
     if (index !== -1) {
       //  this.searchContacs.splice(index, 1);
     } else {
       this.searchContacs?.push({
         'UserId': userData?.Id,
         'email': userData?.Email,
         'fullName': userData?.Name,
         'ShortName': userData?.ShortName,
         'PreviewUrl': userData?.PreviewUrl,
         'IsSelected': 1
       })
    }
   if (this.searchContacs?.length > 0) {
     this.saveEnableDisable = false;
   } else {
     this.saveEnableDisable = true;
   }
 }
 saveTeamMates() {
   this.loading = true;
   const teammatesRequest = this.createRequest(); 
   document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
   document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
   setTimeout(() => { this.dialogRef.close({res: teammatesRequest,selectedorDeselected:this.searchContacs}); }, 200);
   if (this.appSettingsService?.isBlurredOn) {
     document.getElementById("main-comp").classList.remove("is-blurred");
   }
 }
public createRequest(): IinviteTeammate {
   let requestData: IinviteTeammate = {};
   let teammateList: Iteammate[] = [];
   requestData.OrganizationId = this.orgId;
   if (this.searchContacs?.length > 0) {
     this.searchContacs?.forEach((element) => {
       let teammate: Iteammate = {};
       teammate.Id = element?.UserId;
       teammateList?.push(teammate)
     });
     requestData.Teammates = teammateList;
   }
   return requestData
 }
onTeammateRemove(Id) {
   const index = this.searchContacs?.findIndex(x => x.UserId === Id);
   if (index !== -1) {
     this.searchContacs?.splice(index, 1);
     this.maxMsg = false;
   }
   if (this.searchContacs?.length > 0) {
     this.saveEnableDisable = false;
   } else {
     this.saveEnableDisable = true;
   }
 }
 onDismiss() {
   document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
   document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
   setTimeout(() => { this.dialogRef.close(true); }, 200);
   if (this.appSettingsService.isBlurredOn) {
     document.getElementById("main-comp").classList.remove("is-blurred");
   }
  }
}

