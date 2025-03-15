import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { JobActionsStoreService } from '@app/shared/services/commonservice/job-actions-store.service';
import { jobActionPushEOH } from '../pushCandidate-model';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { ResponceData } from '@app/shared/models/responce.model';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { PushCandidateSuccessPoupComponent } from '../../pushcandidate-to-eoh-from-popup/push-candidate-success-poup/push-candidate-success-poup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActionsTab } from '@app/shared/models/job-screening';
import { JobActionTabService } from '@app/shared/services/commonservice/job-action-tab.service';
import { Subscription } from 'rxjs';
import { jobActionPushMemeberEOH } from '../pushCandidateMember-model';
import { PushMemberSuccessPopupComponent } from '../../pushcandidate-to-eoh-from-popup/push-member-success-popup/push-member-success-popup.component';

@Component({
  selector: 'app-review-final-summary',
  templateUrl: './review-final-summary.component.html',
  styleUrls: ['./review-final-summary.component.scss']
})
export class ReviewFinalSummaryComponent implements OnInit {
  public candidateProfile: any;
  public screeningAction: any;
  public notesInfo: any;
  public employeeStatusInfo: any;
  public loading: boolean=false;
  dirctionalLang: string;
  private actions: ActionsTab;
  IsvalidForm: boolean;
  CanAlreadyPushedSubs: Subscription;
  candidateInformation: any;
  pushInfoObs: Subscription;
  @Input() memberStatus;
  @Input() publishedStatus;
   @Output() onMemberSubmit = new EventEmitter<any>(); // Output to emit submitted form data
   
  constructor(public _jobAction: JobActionsStoreService,private pushCandidateEOHService: PushCandidateEOHService,
    private snackBService: SnackBarService,private translateService: TranslateService,public dialog: MatDialog,
    private jobActionTabService: JobActionTabService) {
      this.actions = this.jobActionTabService.constants;
     }

  ngOnInit(): void {
    this.pushInfoObs=this._jobAction.isScreeningActionTabUpdate.subscribe((e:boolean)=>{
      if (e) {
        let ScreeningMasterArr = this._jobAction.getterEOHScreeningTab();
        ScreeningMasterArr.filter(e => {
          return e !== null
        });
         this.candidateProfile=ScreeningMasterArr[0];
        this.screeningAction=ScreeningMasterArr[1];
        this.notesInfo=ScreeningMasterArr[2];
        this.employeeStatusInfo=ScreeningMasterArr[3];
        if(this.memberStatus){
          this.IsvalidForm=this.candidateProfile && this.employeeStatusInfo?false:true;
        }else{
          this.IsvalidForm=this.candidateProfile && this.screeningAction?false:true;
        }
      }else{
        this.IsvalidForm=true;
      }
    })
    this.CanAlreadyPushedSubs = this.pushCandidateEOHService.SetAlreadyPushCandInfo.subscribe((cand: any)=>{
      if(cand?.IsXRCandidatePushedToEOH === 1 && cand?.MemberId!==null)  {
        this.candidateInformation =cand;
      }
    });
  }

   /* @Name: onSubmit @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: on submit data for push candidate*/
   onSubmit(){
    if(this.memberStatus){
      this.onSubmitMember();
      }else{
        this.onSubmitApplicant();
      }
   }
   onSubmitApplicant(){
      this.loading = true;
        let canObj:jobActionPushEOH;
        let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'));
        canObj={
          Title:this.candidateProfile?.Title,
          FirstName:this.candidateProfile?.FirstName,
          FamilyName:this.candidateProfile?.FamilyName,
          Gender:this.candidateProfile?.Gender,
          DOB:(this.candidateProfile?.DateOfBirth===undefined || this.candidateProfile?.DateOfBirth===null)?null:formatDate(this.candidateProfile?.DateOfBirth, 'YYYY-MM-dd', 'en_US'),
          FullAddress:this.candidateProfile?.Address,
          Street:this.candidateProfile?.Street,
          SuburbName:this.candidateProfile?.District_Suburb,
          PostCode:this.candidateProfile?.PostalCode,
          Latitude:this.candidateProfile?.Latitude.toString(),
          Longitude:this.candidateProfile?.Longitude.toString(),
          StateId:Number(this.candidateProfile?.StateId),
          StateCode:this.candidateProfile?.StateCode,
          StateName:this.candidateProfile?.StateName,
          CountryId:Number(this.candidateProfile?.CountryId),
          CountryCode:this.candidateProfile?.CountryCode,
          CountryName:this.candidateProfile?.CountryName,
          CountryCallingCode:this.candidateProfile?.PhoneCode.toString(),
          Email:this.candidateProfile?.Email,
          MobileNo:this.candidateProfile?.PhoneNo,
          QualificationID:this.candidateProfile?.Qualification,
          Qualification:this.candidateProfile?.QualificationId,
          Resume:(this.candidateProfile?.Resume)?(this.candidateProfile?.Resume):'null',
          OfficeID:this.candidateProfile?.OfficeApplyingFor,
          UserName:(currentUserDetails?.FirstName)?(currentUserDetails?.FirstName+' '+currentUserDetails?.LastName):'',
          IndustryID:this.candidateProfile?.IndustryID,
          Industry:this.candidateProfile?.Industry,
          HowDidYouHear:this.candidateProfile?.AboutUs,
          OrganizationId:localStorage.getItem('OrganizationId')?localStorage.getItem('OrganizationId'):'',
          OrganizationName:localStorage.getItem('OrganizationName')?localStorage.getItem('OrganizationName'):'',
          TenantID:(currentUserDetails?.Tenants[0]?.TenantId)?(currentUserDetails?.Tenants[0]?.TenantId):'',
          CandidateID:this.candidateProfile?.CandidateID,
          PhoneCountryId:this.candidateProfile?.PhoneCountryId.toString(),
          GenderId:Number(this.candidateProfile?.GenderId),
          CandidateStatus:this.candidateProfile?.CandidateStatus,
          CandidateCreationdDateTime:this.candidateProfile?.CandidateCreationdDateTime?formatDate(this.candidateProfile?.CandidateCreationdDateTime, 'YYYY/MM/dd hh:mm:ss', 'en_US'):null,
          RecruiterID:this.screeningAction?.RecruiterId,
          RecuriterName:this.screeningAction?.RecruiterName,
          ScreeningKeyword:(this.screeningAction?.ScreeningAction==2)?'LOGINONLY':(this.screeningAction?.ScreeningAction==3)?'INTERVIEW':'',
          TemplateId:this.screeningAction?.TemplateId,
          IsSendEmailToApplicant:this.memberStatus===true?(this.employeeStatusInfo.IsCheckedSendEmail):(this.screeningAction?.IsSendEmail?true:false),
          ScreeningNotes:this.notesInfo?.getEditorVal,
          EmployementStatusNotes:this.notesInfo?.getEditorValFromEmployee,
          InterviewDate:this.screeningAction?.ScreeningDate?formatDate(this.screeningAction?.ScreeningDate, 'YYYY/MM/dd', 'en_US'):null,
          // InterviewStartTime:this.screeningAction?.TimeSlot?.split('-')[0],
          // InterviewEndTime:this.screeningAction?.TimeSlot?.split('-')[1],
          InterviewStartTime:this.screeningAction?.UTCStartDateTime?formatDate(this.screeningAction?.UTCStartDateTime,'yyyy/MM/dd HH:mm:ss', 'en_US'):null,
          InterviewEndTime:this.screeningAction?.UTCEndDateTime?formatDate(this.screeningAction?.UTCEndDateTime,'yyyy/MM/dd HH:mm:ss', 'en_US'):null,
          TimeZone:this.screeningAction?.TimeZone,
          InterviewTitle:this.screeningAction?.ScreeningTitle,

          Type:this.memberStatus?'MEMBER':'APPLICANT',
          HiredDate:(this.employeeStatusInfo?.DateOfHired===undefined || this.employeeStatusInfo?.DateOfHired===null)?null:formatDate(this.employeeStatusInfo?.DateOfHired, 'YYYY-MM-dd', 'en_US'),
          MemberPriority:this.employeeStatusInfo?.MemberPriorityName,
          MemberPriorityId:this.employeeStatusInfo?.MemberPriorityId,
          EmploymentType:this.employeeStatusInfo?.EmployeeName,
          EmploymentTypeId:this.employeeStatusInfo?.EmployeeId

        };
        this.pushCandidateEOHService.pushCandidateToEOHV2(canObj).subscribe(
         (data: ResponceData) => {
          // this.pushCandidateForm.patchValue({
          //   candidaSubmittedStatusCode: data.HttpStatusCode
          // })

          // this.sendPushCandidateInfo.emit(this.pushCandidateForm);
           this.loading = false;
           if (data.HttpStatusCode === 200) {
            this.successConfirmPopup(data.HttpStatusCode,data.Data);
            this._jobAction.setActionRunnerFn(this.actions.SCREENING_INFO, null);
            this._jobAction.setActionRunnerFn(this.actions.SCREENING_CANDIDATE_PROFILE_INFO, null);
            this._jobAction.setActionRunnerFn(this.actions.SCREENING_NOTES_INFO, null);
            this._jobAction.setActionRunnerFn(this.actions.SCREENING_EMPLOYMENT_STATUS_INFO, null);
            this._jobAction.screening.next(null);
            this._jobAction.candidateProfile.next(null);
            this._jobAction.notesProfile.next(null);
            this._jobAction.employeeStatusInfo.next(null);
            this.pushCandidateEOHService.SetAlreadyPushCandInfo.next(null);
            this.pushCandidateEOHService.SetOfficeChangeAlert.next(null);
            this.pushInfoObs.unsubscribe();
            
             }
             else if (data.HttpStatusCode === 204) {
               this.loading = false;
             }else if(data.HttpStatusCode === 402){
              this.successConfirmPopup(data.HttpStatusCode,data.Data);
              // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg), data.HttpStatusCode);
              this.loading = false;
             }else if(data.HttpStatusCode === 400){
              this.successConfirmPopup(data.HttpStatusCode,data.Data);
             }else if(data.HttpStatusCode === 417){
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg),'400');

             }
           else {
            
             this.loading = false;
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         });
   }

/* @Name: successConfirmPopup @Who:  Renu @When: 26-05-2024 @Why: EWM-17104 EWM-17209 @What: on sucessfully pushed popup open*/
successConfirmPopup(httpstatus: number,CandidateInfo: string){
        const dialogRef = this.dialog.open(PushCandidateSuccessPoupComponent, {
          data: new Object({candidatePushedInfo:CandidateInfo,httpstatus:httpstatus}),
          panelClass: [ 'xeople-modal', 'view_pushCandidate','animate__animated','animate__zoomIn' ],
          disableClose: true,
        });
    
        // RTL Code
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
      }

      onSubmitMember(){
        this.loading = true;
          let canObj:jobActionPushMemeberEOH;
          let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'));
          canObj={
            Title:this.candidateProfile?.Title,
            FirstName:this.candidateProfile?.FirstName,
            FamilyName:this.candidateProfile?.FamilyName,
            Gender:this.candidateProfile?.Gender,
            DOB:(this.candidateProfile?.DateOfBirth===undefined || this.candidateProfile?.DateOfBirth===null)?null:formatDate(this.candidateProfile?.DateOfBirth, 'YYYY-MM-dd', 'en_US'),
            FullAddress:this.candidateProfile?.Address,
            Street:this.candidateProfile?.Street,
            SuburbName:this.candidateProfile?.District_Suburb,
            PostCode:this.candidateProfile?.PostalCode,
            Latitude:this.candidateProfile?.Latitude.toString(),
            Longitude:this.candidateProfile?.Longitude.toString(),
            StateId:Number(this.candidateProfile?.StateId),
            StateCode:this.candidateProfile?.StateCode,
            StateName:this.candidateProfile?.StateName,
            CountryId:Number(this.candidateProfile?.CountryId),
            CountryCode:this.candidateProfile?.CountryCode,
            CountryName:this.candidateProfile?.CountryName,
            CountryCallingCode:this.candidateProfile?.PhoneCode.toString(),
            Email:this.candidateProfile?.Email,
            MobileNo:this.candidateProfile?.PhoneNo,
            QualificationID:this.candidateProfile?.Qualification,
            Qualification:this.candidateProfile?.QualificationId,
            Resume:(this.candidateProfile?.Resume)?(this.candidateProfile?.Resume):'null',
            OfficeID:this.candidateProfile?.OfficeApplyingFor,
            UserName:(currentUserDetails?.FirstName)?(currentUserDetails?.FirstName+' '+currentUserDetails?.LastName):'',
            IndustryID:this.candidateProfile?.IndustryID,
            Industry:this.candidateProfile?.Industry,
            HowDidYouHear:this.candidateProfile?.AboutUs,
            OrganizationId:localStorage.getItem('OrganizationId')?localStorage.getItem('OrganizationId'):'',
            OrganizationName:localStorage.getItem('OrganizationName')?localStorage.getItem('OrganizationName'):'',
            TenantID:(currentUserDetails?.Tenants[0]?.TenantId)?(currentUserDetails?.Tenants[0]?.TenantId):'',
            CandidateID:this.candidateProfile?.CandidateID,
            PhoneCountryId:this.candidateProfile?.PhoneCountryId.toString(),
            GenderId:Number(this.candidateProfile?.GenderId),
            CandidateStatus:this.candidateProfile?.CandidateStatus,
            CandidateCreationdDateTime:this.candidateProfile?.CandidateCreationdDateTime?formatDate(this.candidateProfile?.CandidateCreationdDateTime, 'YYYY/MM/dd hh:mm:ss', 'en_US'):null,
            RecruiterID:this.screeningAction?.RecruiterId,
            RecuriterName:this.screeningAction?.RecruiterName,
            ScreeningKeyword:(this.screeningAction?.ScreeningAction==2)?'LOGINONLY':(this.screeningAction?.ScreeningAction==3)?'INTERVIEW':'',
            TemplateId:this.screeningAction?.TemplateId,
            IsSendEmailToApplicant:this.memberStatus===true?(this.employeeStatusInfo.IsCheckedSendEmail):(this.screeningAction?.IsSendEmail?true:false),
            ScreeningNotes:this.notesInfo?.getEditorVal,
            EmployementStatusNotes:this.notesInfo?.getEditorValFromEmployee,
            InterviewDate:this.screeningAction?.ScreeningDate?formatDate(this.screeningAction?.ScreeningDate, 'YYYY/MM/dd', 'en_US'):null,
            // InterviewStartTime:this.screeningAction?.TimeSlot?.split('-')[0],
            // InterviewEndTime:this.screeningAction?.TimeSlot?.split('-')[1],
            InterviewStartTime:this.screeningAction?.UTCStartDateTime?formatDate(this.screeningAction?.UTCStartDateTime,'yyyy/MM/dd HH:mm:ss', 'en_US'):null,
            InterviewEndTime:this.screeningAction?.UTCEndDateTime?formatDate(this.screeningAction?.UTCEndDateTime,'yyyy/MM/dd HH:mm:ss', 'en_US'):null,
            TimeZone:this.screeningAction?.TimeZone,
            InterviewTitle:this.screeningAction?.ScreeningTitle,
  
            Type:this.memberStatus?'MEMBER':'APPLICANT',
            HiredDate:(this.employeeStatusInfo?.DateOfHired===undefined || this.employeeStatusInfo?.DateOfHired===null)?null:formatDate(this.employeeStatusInfo?.DateOfHired, 'YYYY-MM-dd', 'en_US'),
            MemberPriority:this.employeeStatusInfo?.MemberPriorityName,
            MemberPriorityId:this.employeeStatusInfo?.MemberPriorityId,
            EmploymentType:this.employeeStatusInfo?.EmployeeName,
            EmploymentTypeId:this.employeeStatusInfo?.EmployeeId
  
          };
          this.pushCandidateEOHService.pushCandidateToEOHV2Member(canObj).subscribe(
           (data: ResponceData) => {
            this.loading = false;
             if (data.HttpStatusCode === 200) {
              this.successConfirmPopupMember(data.HttpStatusCode,data.Data);
              this._jobAction.setActionRunnerFn(this.actions.SCREENING_INFO, null);
              this._jobAction.setActionRunnerFn(this.actions.SCREENING_CANDIDATE_PROFILE_INFO, null);
              this._jobAction.setActionRunnerFn(this.actions.SCREENING_NOTES_INFO, null);
              this._jobAction.setActionRunnerFn(this.actions.SCREENING_EMPLOYMENT_STATUS_INFO, null);
              this._jobAction.screening.next(null);
              this._jobAction.candidateProfile.next(null);
              this._jobAction.notesProfile.next(null);
              this._jobAction.employeeStatusInfo.next(null);
              this.pushCandidateEOHService.SetAlreadyPushCandInfo.next(null);
              this.pushCandidateEOHService.SetOfficeChangeAlert.next(null);
              this.pushInfoObs.unsubscribe();
              this.onMemberSubmit.emit(2);
               }
               else if (data.HttpStatusCode === 204) {
                 this.loading = false;
               }else if(data.HttpStatusCode === 402){
                this.successConfirmPopupMember(data.HttpStatusCode,data.Data);
                // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg), data.HttpStatusCode);
                this.loading = false;
               }else if(data.HttpStatusCode === 400){
                this.successConfirmPopupMember(data.HttpStatusCode,data.Data);
               }else if(data.HttpStatusCode === 417){
                this.loading = false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg),'400');
  
               }
             else {
              
               this.loading = false;
             }
           }, err => {
             this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
           });
     }

     successConfirmPopupMember(httpstatus: number,CandidateInfo: string){
      const dialogRef = this.dialog.open(PushMemberSuccessPopupComponent, {
        data: new Object({candidatePushedInfo:CandidateInfo,httpstatus:httpstatus}),
        panelClass: [ 'xeople-modal', 'view_pushCandidate','animate__animated','animate__zoomIn' ],
        disableClose: true,
      });
  
      // RTL Code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    }


}
