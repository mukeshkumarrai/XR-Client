import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { ResponceData } from '@app/shared/models';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import {PushCandidatePageType, pushCandidateModel} from '@app/modules/xeople-job/job-screening/push-candidate-to-eoh/pushCandidate-model';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { ConfirmDialogComponent,ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { PushCandidateSuccessPoupComponent } from './push-candidate-success-poup/push-candidate-success-poup.component';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-pushcandidate-to-eoh-from-popup',
  templateUrl: './pushcandidate-to-eoh-from-popup.component.html',
  styleUrls: ['./pushcandidate-to-eoh-from-popup.component.scss']
})
export class PushcandidateToEohFromPopupComponent implements OnInit {
  loading: boolean;
  candidateInfo: {};
  canFormVal: any;
  isFormValid: boolean=true;
  dirctionalLang: string;
  orgName: string;
  selectedValue = '1';
  selectedMemberStatus: boolean = false;
  public tabActive: string;
  selectedTabIndex: any = 0;
  IsOpenFor: number = PushCandidatePageType.Modal;
  IsOpenForNormal: number = PushCandidatePageType.Normal;
  stageType: string;
  lastActivity: string;
  @Input() candidateScreening;
  firstValue: boolean = true;
  secondValue: boolean = false;
  brandAppSetting: any=[];
  EOHLogo: any;
  publishedStatus: string;
  constructor( public dialogRef: MatDialogRef<PushcandidateToEohFromPopupComponent>,private pushCandidateEOHService: PushCandidateEOHService,
    @Inject(MAT_DIALOG_DATA) public data: any,private snackBService: SnackBarService,private translateService: TranslateService,
    private appSettingsService: AppSettingsService, public dialog: MatDialog) {
    this.candidateInfo={
      candidateId: data?.candidateId,
      candidateName: data?.candidateName
    };
    this.publishedStatus=data?.PublishedStatus;
    this.orgName=localStorage.getItem('OrganizationName');
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
   }
  ngOnInit(): void {
    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.EOH);
    this.EOHLogo="assets/brand/"+filteredBrands[0]?.logo;
  }
  /* @Name: onSubmit @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: on submit data for push candidate*/
  onSubmit(){
      const message = 'pushCandidateToEoh_confirmMsg1';
      const title = this.canFormVal?.FirstName+' '+this.canFormVal?.FamilyName;
      const subTitle = 'pushCandidateToEoh_confirmMsg2';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.loading = true;
        if (dialogResult == true) {
          let canObj:pushCandidateModel;
          let dob: Date;
          let CandidateDateTime:Date;
          if(this.canFormVal?.DateOfBirth)
          {
            dob = new Date(this.canFormVal?.DateOfBirth);

          }
          if(this.canFormVal?.CandidateCreationdDateTime)
          {
            CandidateDateTime = new Date(this.canFormVal?.CandidateCreationdDateTime);

          }

          let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'));
          canObj={
            Title:this.canFormVal?.Title,
            FirstName:this.canFormVal?.FirstName,
            FamilyName:this.canFormVal?.FamilyName,
            Gender:this.canFormVal?.Gender,
            DOB:(this.canFormVal?.DateOfBirth===undefined || this.canFormVal?.DateOfBirth===null)?null:formatDate(this.canFormVal?.DateOfBirth, 'YYYY-MM-dd', 'en_US'),
            FullAddress:this.canFormVal?.Address,
            Street:this.canFormVal?.Street,
            SuburbCode:this.canFormVal?.District_Suburb,
            SuburbName:this.canFormVal?.District_Suburb,
            PostCode:this.canFormVal?.PostalCode,
            Latitude:this.canFormVal?.Latitude.toString(),
            Longitude:this.canFormVal?.Longitude.toString(),
            StateId:Number(this.canFormVal?.StateId),
            StateCode:this.canFormVal?.StateCode,
            StateName:this.canFormVal?.StateName,
            CountryId:Number(this.canFormVal?.CountryId),
            CountryCode:this.canFormVal?.CountryCode,
            CountryName:this.canFormVal?.CountryName,
            CountryCallingCode:this.canFormVal?.PhoneCode.toString(),
            Email:this.canFormVal?.Email,
            MobileNo:this.canFormVal?.PhoneNo,
            QualificationID:this.canFormVal?.Qualification,
            Qualification:this.canFormVal?.QualificationId,
            Resume:(this.canFormVal?.Resume)?(this.canFormVal?.Resume):null,
            OfficeID:this.canFormVal?.OfficeApplyingFor,
            UserName:(currentUserDetails?.FirstName)?(currentUserDetails?.FirstName+' '+currentUserDetails?.LastName):'',
            IndustryID:this.canFormVal?.IndustryID,
            Industry:this.canFormVal?.Industry,
            HowDidYouHear:this.canFormVal?.AboutUs,
            OrganizationId:localStorage.getItem('OrganizationId')?localStorage.getItem('OrganizationId'):'',
            OrganizationName:localStorage.getItem('OrganizationName')?localStorage.getItem('OrganizationName'):'',
            TenantID:(currentUserDetails?.Tenants[0]?.TenantId)?(currentUserDetails?.Tenants[0]?.TenantId):'',
            CandidateID:this.canFormVal?.CandidateID,
            PhoneCountryId:this.canFormVal?.PhoneCountryId.toString(),
            GenderId:Number(this.canFormVal?.GenderId),
            CandidateStatus:this.canFormVal?.CandidateStatus,
            CandidateCreationdDateTime:this.canFormVal?.CandidateCreationdDateTime?formatDate(this.canFormVal?.CandidateCreationdDateTime, 'YYYY/MM/dd HH:mm:ss', 'en_US'):null
          };
          this.pushCandidateEOHService.pushCandidateToEOH(canObj).subscribe(
           (data: ResponceData) => {
            this.canFormVal.candidaSubmittedStatusCode = data.HttpStatusCode;
            this.canFormVal.ApplicantId = data.Data.ApplicantId;

             if (data.HttpStatusCode === 200) {
            this.successConfirmPopup(data.HttpStatusCode,data.Data);
             }
             else if (data.HttpStatusCode === 204) {
               this.loading = false;
             }else if(data.HttpStatusCode === 402){
              this.successConfirmPopup(data.HttpStatusCode,data.Data);
              //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg), data.HttpStatusCode);
              this.loading = false;
             }else if(data.HttpStatusCode === 400){
              this.successConfirmPopup(data.HttpStatusCode,data.Data);
             // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg), data.HttpStatusCode);
             }
             else {
               this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
               this.loading = false;
             }
           }, err => {
             this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
           });
        } else {
          this.loading = false;
        }
      });
  }
 /* @Name: successConfirmPopup @Who:  Renu @When: 02-feb-2024 @Why: EWM-15844 EWM-15853 @What: on sucessfully pushed popup open*/
  successConfirmPopup(httpstatus: number,CandidateInfo: string){
    const dialogRef = this.dialog.open(PushCandidateSuccessPoupComponent, {
      data: new Object({candidatePushedInfo:CandidateInfo,httpstatus:httpstatus}),
      panelClass: [ 'xeople-modal', 'view_pushCandidate','animate__animated','animate__zoomIn' ],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(httpstatus===200){
        this.onDismiss();
      }
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
   /* @Name: sendPushCandidateInfo @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: push candidate api calling*/
  sendPushCandidateInfo(formdata){
      if (formdata?.status === 'VALID') {
        this.canFormVal=formdata.getRawValue();
        this.isFormValid=formdata?.status === 'VALID'?false:true;
      }else{
        this.isFormValid=true;
      }
  }
 
  /* @Name: onDismiss @Who:  Renu @When: 02-feb-2024 @Why: EWM-15844 EWM-15853 @What: for closing popup*/
  onDismiss() {
    document?.getElementsByClassName("push-candidate-to-eoh")[0]?.classList?.remove("animate__zoomIn")
    document?.getElementsByClassName("push-candidate-to-eoh")[0]?.classList?.add("animate__zoomOut");
    let obj = {
      ApplicantId: this.canFormVal?.ApplicantId,
      StatsCode: this.canFormVal?.candidaSubmittedStatusCode
    }
    setTimeout(() => { this.dialogRef?.close(obj); }, 200);
  }

  onSelectionChange(event: any) {
    if (event?.value === '1') {
      this.selectedValue = event?.value;
      this.selectedMemberStatus = false;
      this.firstValue = true;
      this.secondValue = false;
    } else {
      this.stageType= this.data?.stageType,
      this.lastActivity= this.data?.lastActivity
      this.selectedValue = event?.value;
      this.selectedMemberStatus = true;
      this.firstValue = false;
      this.secondValue = true;
    }
  }

  nextTabMove($event) {
    if ($event) {
      this.selectedTabIndex = this.selectedTabIndex + 1;
    }
  }

  tabClick(tab: { index: any; }) {
    this.selectedTabIndex = tab?.index;
  }

  sendPushApplicantMemberStatus(value){
    this.selectedMemberStatus=value?.selectedMemberStatus;
    this.isFormValid=value?.isFormValid;
    this.canFormVal=value?.canFormVal;
}

}
