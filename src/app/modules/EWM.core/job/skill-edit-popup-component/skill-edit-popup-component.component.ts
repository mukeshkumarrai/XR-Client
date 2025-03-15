import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateEducationComponent } from 'src/app/modules/EWM-Candidate/candidate-education/candidate-education.component';
import { CandidateExperienceComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-experience/candidate-experience.component';
import { CandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-skills/candidate-skills.component';
import { Icandidate } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-summary/Icandidate.interface';
import { ManageCandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/manage-candidate-skills/manage-candidate-skills.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { CustomLatLongDistancePopupComponent } from 'src/app/shared/modal/custom-lat-long-distance-popup/custom-lat-long-distance-popup.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CandidatejobmappingService } from 'src/app/shared/services/candidate/candidatejobmapping.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateExperienceService } from '../../shared/services/candidate/candidate-experience.service';
import { GeneralInformationService } from '../../shared/services/candidate/general-information.service';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { QuickJobService } from '../../shared/services/quickJob/quickJob.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-skill-edit-popup-component',
  templateUrl: './skill-edit-popup-component.component.html',
  styleUrls: ['./skill-edit-popup-component.component.scss']
})
export class SkillEditPopupComponentComponent implements OnInit {

loading = false;
public skillsData: any = [];
public candidateIdData: any = "";
noOfRecords = 4;
 public loadingscroll: boolean;
 public canLoad = false;
 public pendingLoad = false;
 public totalDataCount: any;
 public pageNo: number = 1;
 public gridView: any = [];
 public listData: any = [];
//  pageOption: any = 1;
 public pageSize;
 isScroll = false;
  type: any;
  constructor(private route: Router, public _sidebarService: SidebarService, private snackBService: SnackBarService,private translateService: TranslateService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService,  public systemSettingService: SystemSettingService,
   public candidateService: CandidateService, 
    public dialogModel: MatDialog,public _GeneralInformationService: GeneralInformationService,
    private routes:ActivatedRoute,public dialogRef: MatDialogRef<SkillEditPopupComponentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _appSetting: AppSettingsService,) { 
      this.candidateIdData = this.data?.candidateId;
      this.type = this.data?.type;
      this.pageSize = this._appSetting.pagesize;
    }

  ngOnInit(): void {
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.getAllSkillsAll(this.pageSize, this.pageNo);
  }


   /*
      @Type: File, <ts>
      @Name: getAllSkills function
      @Who: Nitin Bhati
      @When: 07-oct-2022
      @Why: EWM-9027
       @What: get AllSkills List
       */
      getAllSkillsAll(PageSize, PageNumber) {
        // this.loading = true;
        this.candidateService.getCanAllSkillsData('?CandidateId=' + this.candidateIdData + '&PageSize='+ PageSize + '&PageNumber='+ PageNumber).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              const size = 4;
              // this.skillsData = repsonsedata.Data;
              // this.skillsData = [];
              this.listData = repsonsedata.Data;
              this.totalDataCount = repsonsedata.TotalRecord;
              if (this.isScroll) {
                this.skillsData = this.skillsData.concat(this.listData);
              }else{
                this.isScroll = false;
                if (this.isScroll == false) {
                  this.skillsData = repsonsedata.Data;
                }
                
              }
              
              this.loading = false;
              this.loadingscroll = false;
            } else {
               this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
              this.loadingscroll = false;
            }
          }, err => {
            this.loading = false;
            this.loadingscroll = false;
            // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }


     /*
      @Type: File, <ts>
      @Name: deleteConfirmEmergencyContacts
      @Who: Nitin Bhati
      @When: 07-oct-2022
      @Why: EWM-9027
      @What: delete confirmation to delet candidate address
    */
    
   deleteConfirmskills(data: any) {
    let ContactsObj = {};
    ContactsObj = data;
    // const message = 'label_titleDialogContentSiteDomain';
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'candidate_skils';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      // this.loading = true;
      if (dialogResult == true) {
        this.candidateService.deleteCandidateSkill(ContactsObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {       
              this.isScroll = false;    
              this.pageNo = 1;
             this.getAllSkillsAll(this.pageSize, this.pageNo);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else if (data.HttpStatusCode == 400) {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
           // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        // this.skillLoader = false;
      }
    });
  }
  
  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who: Nitin Bhati
 @When: 07-oct-2022
  @Why: EWM-9027
 @What:losing the pop-up
  */
 onDismiss() {
  document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}

/*
@Type: File, <ts>
@Name: onScrollDown
@Who: Nitin Bhati
@When: 07-oct-2022
@Why: EWM-9027
@What: To add data on page scroll.
*/
onScrollDown(ev?) {
  this.loadingscroll = true;
  this.isScroll = true;
  this.loading = false;
    if (this.totalDataCount > this.listData.length) {
      this.pageNo = this.pageNo + 1;
      this.getAllSkillsAll(this.pageSize, this.pageNo);
    }
    else {
      this.isScroll = false;
      this.loadingscroll = false;
      this.loading = false;
    }
   
  }

   /*
@Type: File, <ts>
@Name: openQuickSkillEdidModal function
@Who: Nitin Bhati
@When: 29-Sep-2022
@Why: EWM-8805 EWM-9033
@What: For open skill details
*/
openQuickSkillEdidModal(data,activestatus) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_folder';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(ManageCandidateSkillsComponent, {
      data:{candidateId:this.candidateIdData,FolderId:123,Name:'this.headerlabel',skilldata:data,activestatus:activestatus},
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == false) {
     // this.folderLoader = true;
      //this.folderChunkList();
    } else {
      //this.folderLoader = false;
    }
  })
}

}

