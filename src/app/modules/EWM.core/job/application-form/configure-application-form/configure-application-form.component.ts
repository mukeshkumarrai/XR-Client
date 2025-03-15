import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkScrollable,
  Overlay
} from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
  AfterViewInit,
  Host,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SectionConfigureComponent } from './section-configure/section-configure.component';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { RtlService } from 'src/app/shared/services/commonservice/rtl/rtl.service';

@Component({
  selector: 'app-configure-application-form',
  templateUrl: './configure-application-form.component.html',
  styleUrls: ['./configure-application-form.component.scss']
})
export class ConfigureApplicationFormComponent implements OnInit {
  welcomeIdData: any;
  knockOutIdData: any;
  personalInformationIdData: any;
  documentIdData: any;
  assessmentQuestionIdData: any;
  thankYouStatusData: any;
  welcomeStatus: boolean=true;
  knockoutStatus: boolean=false;
  thankYouStatus: boolean=false;
  assessmentQueStatus: boolean=false;
  documentsStatus: boolean=false;
  personalInformationStatus: boolean=false;
  public FormData:any;
  public isSave:boolean = false;
  public loading:boolean = false;
  knockoutQuestion=[];
   public deafultThankyouMsg='<p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Dear&nbsp;{{Candidate.FirstName}}&nbsp;{{Candidate.LastName}},</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Thank you for taking the time to submit your application for the&nbsp;{{Jobs.JobTitle}}&nbsp;position. We are glad that you are interested in a career at&nbsp;{{Candidate.CompanyName}}&nbsp;and were here to help you find your perfect fit.</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We are currently reviewing your application. If your profile is a good fit for this position, we will contact you about next steps. We may also consider your application for other positions. This could happen a few times and it is part of our recruitment process.</span></p><p></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Is your profile telling your story?</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">A key part of our review process is to assess your&nbsp;[Candidate Profile URL]&nbsp;with job requirements. Please ensure your profile is accurate and extensive as it is our first step in getting to know you. You can build your profile by importing information from your resume or manually updating it.</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">To view your application updates, click&nbsp;[View My Applications URL].</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We encourage you to visit our&nbsp;[Career Centre URL]&nbsp;frequently and continue to look for opportunities that match your interests.</span></p><p></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Thank you,</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Talent Acquisition Team,</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">{{Jobs.Company}}</span></p>';
   public defaultMsg = "On submitting the application form you declare that all the information given in this application form and resume is true and correct to the best of my knowledge.";
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  ApplicationFormId: number;
  ApplicationFormconfigList: any;
  IsWelcomePage: any;
  IsKnockoutQuestion: any;
  IsPersonalInfo: any;
  IsDocuments: any;
  IsAssessment: any;
  IsThankYou: any;
  applicationConfigStatus: any[]=[];
  stepperStatus: any;
  IsWelcomePageUpdate: any;
  IsKnockoutQuestionUpdate: any;
  IsPersonalInfoUpdate: any;
  IsDocumentsUpdate: any;
  IsTrackingCodeUpdate: any;
  IsAssessmentUpdate: any;
  IsWelcomePageData: any;
  IsKnockoutQuestionData: any;
  IsDocumentsData: any;
  IsPersonalInfoData: any;
  IsAssessmentData: any;
  thankYouData: any;
  activeStatus:string='Welcome_Page';
  pageLabel: string='Welcome_Page';
  isImportantLinkPage: boolean=false;
  IsImportant:any;
  ImportantLinkDetails= [];

  selectedDataList:any=[];
  isDisabledButtonDocuments: boolean = false;
  public overlayConfigureRules:boolean=false;
  trigger= "trigger";
  ApplicationFormName: any;
  public positionMatDrawer: string = 'start';
  isKnockOutEnable: any = 1;
  sectionInfo: any;
  dirctionalLang;

  // configure ruls var
  @ViewChild("openConfigureRuleButton") openConfigureRuleButton;
  @ViewChild("overlayConfigureRules", { read: TemplateRef }) overlayConfigureRulesTemplate;
  overlayConfigureRulesPortal: any;
  overlayRefConfigureRules: any;
  // configure ruls var
  isActionButtonDisabledFromSeekPreview: boolean = false;
  IsEnabled: any;
  ApplicationFormconfig: any;
  pagelabelDocument: any;
  public doc='Documents';
  saveDisabled: any;
  selectedDataLis: any;
  pagelabelDoc: any;
  documentPagelabel: any;
  isDisabledButton:boolean=false;
  appId: any;
  applicationForm:boolean=false;
  toggeloff:boolean=true;
  selectedData: any=[];
  resFalse:boolean=false;
  sectionTab: any;
  isSectionClick: boolean = false;
  ApplicationFormconfi: any;
  selectedDataLi: any;
  isdocu:boolean;
  openConfermPopup:boolean;
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService, private fb: FormBuilder, private _rtlService:RtlService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService,
    private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService,private commonService:CommonserviceService,
    private appSettingsService: AppSettingsService, private jobService: JobService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private overlay: Overlay,
    private ConfigureRulesVCR: ViewContainerRef) { 
      this.mobileQuery = media.matchMedia('(max-width: 1024px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    }
  
  ngOnInit(): void {
  // who:maneesh,what:9594 for check uncheck save button enabel disabel,when:17/04/2023
    // this.commonService.documentPageLabelobs.subscribe((res:any)=>{
    //   if (res===true) {
    //     this.pagelabelDocument=this.ApplicationFormconfigList?.filter(x=>x.PageLabel==="Documents");
    //     this.onSectionClick(this.pagelabelDocument[0],this.doc)
    //   } 
    // });
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
       this.ApplicationFormId= parseInt(parms?.Id)
       this.getApplicationFormConfigurationById(this.ApplicationFormId)
      }
      // <!---------@When: 13-Jan-2023 @who:Adarsh singh @why: EWM-9587 --------->
      if (parms?.isPreviewMode) {
        this.isActionButtonDisabledFromSeekPreview= parms['isPreviewMode']
       }
      //  End 
    });

    this.commonService.configueApplicationFormObj.subscribe((res:any)=>{      
      if(res){ 
      this.FormData = res; 
      // this.selectedDataList =  this.FormData?.value?.allDocument?.filter(x=>x.IsHidden===1 || x.IsMandatory===1);  
        this.isSave = res?.valid;
       }    
    });
    this.commonService.knockoutQuestionFormObj.subscribe((res:any)=>{
      if(res){
        this.FormData = res;
        this.isSave = true; 
      }
    });

    this.commonService.importantlinkFormObj.subscribe((res:any)=>{
      if(res){
        this.FormData = res;
        this.isSave = true;
      }
    });
    this.saveThankYou();
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.overlayRefConfigureRules = this.overlay.create({
      // scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // hasBackdrop: false,
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.openConfigureRuleButton)
        .setOrigin(this.openConfigureRuleButton)
        // .withScrollableContainers([this.scrollContainer])
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top"
          }
        ])
        // .withFlexibleDimensions(false)
        // .withPush(false)
    });
    this.overlayConfigureRulesPortal = new TemplatePortal(this.overlayConfigureRulesTemplate, this.ConfigureRulesVCR);
  }


   /*
     @Type: File, <ts>
     @Name: goWelcomePage function
     @Who: Nitin Bhati
     @When: 16-May-2022
     @Why: EWM-6678
     @What: For Welocme page component
    */
  goWelcomePage() {
    this.welcomeStatus=true;
    this.knockoutStatus=false;
    this.thankYouStatus=false;
    this.assessmentQueStatus=false;
    this.documentsStatus=false;
    this.personalInformationStatus=false;
   // this.route.navigate(['/client/core/job/application-form/welcome-page']);
  }
  /*
     @Type: File, <ts>
     @Name: goKnockOutQuestion function
     @Who: Nitin Bhati
     @When: 16-May-2022
     @Why: EWM-6678
     @What: For KnockOut questions component
    */
  goKnockOutQuestion() {
    this.isSave = false;
    this.welcomeStatus=false;
    this.knockoutStatus=true;
    this.thankYouStatus=false;
    this.assessmentQueStatus=false;
    this.documentsStatus=false;
    this.personalInformationStatus=false;
    //this.route.navigate(['/client/core/job/application-form/knockout-question']);
  }
  /*
     @Type: File, <ts>
     @Name: goPersonalInformation function
     @Who: Nitin Bhati
     @When: 16-May-2022
     @Why: EWM-6678
     @What: For Personal Information component
    */
  goPersonalInformation() {
    this.welcomeStatus=false;
    this.knockoutStatus=false;
    this.thankYouStatus=false;
    this.assessmentQueStatus=false;
    this.documentsStatus=false;
    this.personalInformationStatus=true;
   // this.route.navigate(['/client/core/job/application-form/personal-information']);
  }
  /*
     @Type: File, <ts>
     @Name: goDocument function
     @Who: Nitin Bhati
     @When: 16-May-2022
     @Why: EWM-6678
     @What: For document component
    */
  goDocument() {
    //this.documentsStatus=true;
    this.welcomeStatus=false;
    this.knockoutStatus=false;
    this.thankYouStatus=false;
    this.assessmentQueStatus=false;
    this.documentsStatus=true;
    this.personalInformationStatus=false;
   // this.route.navigate(['/client/core/job/application-form/documents']);
  }
  /*
     @Type: File, <ts>
     @Name: goAssessmentQuestion function
     @Who: Nitin Bhati
     @When: 16-May-2022
     @Why: EWM-6678
     @What: For Assessment Question component
    */
  goAssessmentQuestion() {
    this.welcomeStatus=false;
    this.knockoutStatus=false;
    this.thankYouStatus=false;
    this.assessmentQueStatus=true;
    this.documentsStatus=false;
    this.personalInformationStatus=false;
    //this.route.navigate(['/client/core/job/application-form/assessment-question']);
  }
  /*
     @Type: File, <ts>
     @Name: goTrackingCode function
     @Who: Nitin Bhati
     @When: 16-May-2022
     @Why: EWM-6678
     @What: For Tracking Code component
    */
     goThankYou() {
    this.welcomeStatus=false;
    this.knockoutStatus=false;
    this.thankYouStatus=true;
    this.assessmentQueStatus=false;
    this.documentsStatus=false;
    this.personalInformationStatus=false;
    //this.route.navigate(['/client/core/job/application-form/tracking-code']);
  }



  /*
@Type: File, <ts>
@Name: onsave function
@Who: Anup singh
@When: 17-05-2022
@Why: EWM-6554 EWM-6678
@What: for save data
*/
  onsave() {    
    if(this.welcomeStatus==true){
      this.isWelcomePage();
    }
    else if (this.personalInformationStatus === true) {
        this.isPersonalInfoPage()
    }
    else if (this.documentsStatus == true) {
      this.isDocumentPage();
    }
    else if (this.knockoutStatus === true) {
      this.saveKnockoutQuestion()
  }
  else if (this.isImportantLinkPage === true) {
    this.saveimportantLinkPage();
  }
  else if (this.thankYouStatus === true) {
    this.saveThankYou();
}
}
  
isWelcomePage(){
    let fromObj = {};
    let value = this.FormData?.value;
    fromObj['Id'] = value?.Id;
    fromObj['ApplicationFormId'] = value?.ApplicationFormId;
    fromObj['BannerImage'] = value?.BannerImageURL;
    fromObj['Heading'] = value?.Heading;
    fromObj['SubHeading'] = value?.SubHeading;
    if(value?.BannerImageURL){
      fromObj['BannerTransparency'] = (value?.BannerTransparency) / 1000;
    }else{
      fromObj['BannerTransparency'] = 100;
    }
   
    fromObj['AboutUs'] = value?.AboutUs;
    fromObj['IsResume'] = value?.IsResume;
    fromObj['IsCoverLetter'] = value?.IsCoverLetter;
    fromObj['IsAutoFill'] = (value?.IsAutoFill == true) ? 1 : 0;
    fromObj['IsOrgnizationContactEnabled']=(value?.IsOrgInfo==true)?1:0;
    fromObj['OrganizationLogo']=value?.orgLogo;
    fromObj['RecruiterId']=value?.recruiter;
    fromObj['RecruiterName']=value?.UserName;
    fromObj['RecruiterProfileImage']=value?.ProfileImageUrl;
    fromObj['RecruiterEmail']=value?.Email;  
    fromObj['RecruiterPhone']=value?.PhoneNo;

    this.loading = true;
    this.jobService.createUpdateWelcomePage(fromObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
         // this.goKnockOutQuestion();
         //  this.router.navigate(['./client/core/job/application-form']);
         this.getApplicationFormConfigurationById(this.ApplicationFormId)
         this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
         
        }
        else if (repsonsedata.HttpStatusCode === 400) {
           this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    )
}

  /*
@Type: File, <ts>
@Name: isPersonalInfoPage function
@Who: Adarsh singh
@When: 18-05-2022
@Why: EWM-6553 EWM-6709
@What: Save data for personalInfo page
*/
isPersonalInfoPage(){
  let fromObj = {};
  let value = this.FormData?.value;
  fromObj['Id'] = value?.Id;
  fromObj['ApplicationFormId'] = parseInt(value?.ApplicationFormId);
  fromObj['IsFirstNameApplicable'] = (value?.IsFirstNameApplicable == true) ? 1 : 0;
  fromObj['IsFirstNameRequired'] = (value?.IsFirstNameRequired == true) ? 1 : 0;
  fromObj['IsLastNameApplicable'] = (value?.IsLastNameApplicable == true) ? 1 : 0;
  fromObj['IsLastNameRequired'] = (value?.IsLastNameRequired == true) ? 1 : 0;
  fromObj['IsEmailApplicable'] = (value?.IsEmailApplicable == true) ? 1 : 0;
  fromObj['IsEmailRequired'] = (value?.IsEmailRequired == true) ? 1 : 0;
  fromObj['IsPhoneApplicable'] = (value?.IsPhoneApplicable == true) ? 1 : 0;
  fromObj['IsPhoneRequired'] = (value?.IsPhoneRequired == true) ? 1 : 0;
  fromObj['IsProfilePicApplicable'] = (value?.IsProfilePicApplicable == true) ? 1 : 0;
  fromObj['IsProfilePicRequired'] = (value?.IsProfilePicRequired == true) ? 1 : 0;
  fromObj['IsAddressApplicable'] = (value?.IsAddressApplicable == true) ? 1 : 0;
  fromObj['IsAddressRequired'] = (value?.IsAddressRequired == true) ? 1 : 0;
  fromObj['IsNoticePeriodApplicable'] = (value?.IsNoticePeriodApplicable == true) ? 1 : 0;
  fromObj['IsNoticePeriodRequired'] = (value?.IsNoticePeriodRequired == true) ? 1 : 0;
  fromObj['IsSkillsApplicable'] = (value?.IsSkillsApplicable == true) ? 1 : 0;
  fromObj['IsSkillsRequired'] = (value?.IsSkillsRequired == true) ? 1 : 0;
  fromObj['IsExperienceApplicable'] = (value?.IsExperienceApplicable == true) ? 1 : 0;
  fromObj['IsExperienceRequired'] = (value?.IsExperienceRequired == true) ? 1 : 0;
  fromObj['IsEducationApplicable'] = (value?.IsEducationApplicable == true) ? 1 : 0;
  fromObj['IsEducationRequired'] = (value?.IsEducationRequired == true) ? 1 : 0;
  fromObj['CurrentSalary'] = (value?.CurrentSalary == true) ? 1 : 0;
  fromObj['IsExpectedSalaryRequired'] = (value?.IsExpectedSalaryRequired == true) ? 1 : 0;
  
  fromObj['IsPositionNameRequired'] = (value?.IsPositionNameRequired == true) ? 1 : 0;
  fromObj['IsEmployerRequired'] = (value?.IsEmployerRequired == true) ? 1 : 0;
  fromObj['IsCurrencyRequired'] = (value?.IsCurrencyRequired == true) ? 1 : 0;
  fromObj['IsSalaryRequired'] = (value?.IsSalaryRequired == true) ? 1 : 0;
  fromObj['IsSalaryUnitRequired'] = (value?.IsSalaryUnitRequired == true) ? 1 : 0;
  fromObj['IsStartDateExpRequired'] = (value?.IsStartDateExpRequired == true) ? 1 : 0;
  fromObj['IsEndDateExpRequired'] = (value?.IsEndDateExpRequired == true) ? 1 : 0;
  fromObj['IsLocationExpRequired'] = (value?.IsLocationExpRequired == true) ? 1 : 0;
  fromObj['IsDescriptionExpRequired'] = (value?.IsDescriptionExpRequired == true) ? 1 : 0;

  fromObj['IsDegreeTypeRequired'] = (value?.IsDegreeTypeRequired == true) ? 1 : 0;
  fromObj['IsDegreeTitleRequired'] = (value?.IsDegreeTitleRequired == true) ? 1 : 0;
  fromObj['IsNameInstituteRequired'] = (value?.IsNameInstituteRequired == true) ? 1 : 0;
  fromObj['IsNameUniversityRequired'] = (value?.IsNameUniversityRequired == true) ? 1 : 0;
  fromObj['IsQualificationRequired'] = (value?.IsQualificationRequired == true) ? 1 : 0;
  fromObj['IsStartDateEduRequired'] = (value?.IsStartDateEduRequired == true) ? 1 : 0;
  fromObj['IsEndDateEduRequired'] = (value?.IsEndDateEduRequired == true) ? 1 : 0;
  fromObj['IsLocationEduRequired'] = (value?.IsLocationEduRequired == true) ? 1 : 0;
  fromObj['IsDescriptionEduRequired'] = (value?.IsDescriptionEduRequired == true) ? 1 : 0;
  fromObj['IsScoreTypeRequired'] = (value?.IsScoreTypeRequired == true) ? 1 : 0;
  fromObj['IsFinalScoreRequired'] = (value?.IsFinalScoreRequired == true) ? 1 : 0;



  this.loading = true;
  this.jobService.createUpdatePersonalInfoFormPage(fromObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.getApplicationFormConfigurationById(this.ApplicationFormId)
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());      
      }
      else if (repsonsedata.HttpStatusCode === 400) {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }
  )
}

  /*
      @Type: File, <ts>
      @Name: createApplicationForm function
      @Who: Adarsh Singh
      @When: 16-May-2022
      @Why: EWM-6552,EWM-6673
      @What: For saving data for applicationForm data
     */

isDocumentPage() {
      let AddObj=[];
      this.selectedDataList =  this.FormData?.value?.allDocument?.filter(x=>x.IsHidden===1 || x.IsMandatory===1);  
        if(this.selectedDataList?.length==0){       
          AddObj = [{ApplicationFormId:this.ApplicationFormId,Documents:[]}];   
        }else{
          AddObj = [{ApplicationFormId:this.ApplicationFormId,Documents:this.FormData?.value?.allDocument}];  
        }
        this.jobService.createDocumentPage(AddObj[0]).subscribe((repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            this.getApplicationFormConfigurationById(this.ApplicationFormId)
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
            // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          });
      }
 /*
@Type: File, <ts>
@Name: saveKnockoutQuestion function
@Who: Nitin Bhati
@When: 18-05-2022
@Why: EWM-6678
@What: Save data for knockoutQuestion page
*/
saveKnockoutQuestion(){
  let fromObj = {};
   this.FormData?.forEach((element,index) => {
        this.knockoutQuestion.push({
         // 'Id': 0,
          'Question': element.Question,
          'Answer': element.Answer,
          'DisplaySequence': index+1,
          //'IsDeleted': 0
        })
      });
  fromObj['ApplicatinFormId'] = this.ApplicationFormId;
  fromObj['Knockout'] = this.knockoutQuestion;
   this.loading = true;
   this.jobService.createKnockoutQuestion(fromObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.knockoutQuestion=[];
        this.commonService.knockoutQuestionFormSaveStatus.next(true);  
        this.getApplicationFormConfigurationById(this.ApplicationFormId);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else if (repsonsedata.HttpStatusCode === 400) {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }
  )
}

/*
@Type: File, <ts>
@Name: showPreview function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6678 EWM-6782
@What: Show Preview 
*/
showPreview(){
  this.onsave();
  let parm='?applicationId='+this.ApplicationFormId+'&mode=preview';
  let manageurl='./application/apply'+parm;
  window.open(manageurl, '_blank');
}


/*
@Type: File, <ts>
@Name: getApplicationFormConfigurationById function
@Who: Nitin Bhati
@When: 18-may-2022
@Why: EWM-6678
@What: get data
*/
getApplicationFormConfigurationById(ApplicationFormId: any) {
  this.loading = true;
  this.jobService.getApplicationformConfigurationById('?applicationId='+ApplicationFormId).subscribe(
    (data: any) => {
      this.loading = false;
      if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
        if(data?.Data!=undefined && data?.Data!=null && data?.Data!=''){
          this.ApplicationFormconfigList=data?.Data;           
        this.pagelabelDoc=this.ApplicationFormconfigList?.filter(x=>x.PageLabel);
         this.ApplicationFormName= data?.Data[0].ApplicationFormName;
         this.ApplicationFormconfigList?.filter(x=>
          {
            if(x['PageLabel']==='Welcome_Page'){
              this.IsWelcomePage=x['IsEnabled']===1?true:false;
            }else  if(x['PageLabel']==='Knockout_Questions'){
              this.IsKnockoutQuestion=x['IsEnabled']===1?true:false;
              this.isKnockOutEnable = x['IsKnockoutContinue'];
              this.jobService.isKnockoutEnableInfo.next( this.isKnockOutEnable);
            }else  if(x['PageLabel']==='Personal_Information'){
              this.IsPersonalInfo=x['IsEnabled']===1?true:false;
            }else  if(x['PageLabel']==='Documents'){
              this.IsDocuments=x['IsEnabled']===1?true:false;
            }else  if(x['PageLabel']==='Important_Links'){
              this.IsImportant=x['IsEnabled']===1?true:false;
            }else  if(x['PageLabel']==='Thank_You'){
              this.IsThankYou=x['IsEnabled']===1?true:false;
            }
          });
        //  this.IsAssessment=data?.Data.IsAssessment;
          // this.IsWelcomePageData=data?.Data.IsWelcomeData;
          // this.IsKnockoutQuestionData=data?.Data.IsKnockoutData;
          // this.IsPersonalInfoData=data?.Data.IsPersonalInfoData;
          // this.IsDocumentsData=data?.Data.IsDocumentData;
          // this.IsAssessmentData=data?.Data.IsAssessmentData;
          // this.thankYouData=data?.Data.IsThankyouData;
        }      
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}


/*
@Type: File, <ts>
@Name: createApplicationformConfiguration function
@Who: Nitin Bhati
@When: 18-05-2022
@Why: EWM-6678
@What: Save data for ApplicationformConfiguration page
*/
// onStepperButton(stepperStatus: boolean,applicationConfigStatus){
//   let fromObj = {};
//   this.stepperStatus=stepperStatus;
//   this.applicationConfigStatus=applicationConfigStatus;
//   if(this.applicationConfigStatus=='IsWelcomePage'){
//     fromObj['IsWelcomePage'] = true;
//     fromObj['IsKnockoutQuestion'] = this.IsKnockoutQuestion;
//     fromObj['IsPersonalInfo'] = this.IsPersonalInfo;
//     fromObj['IsDocuments'] = this.IsDocuments;
//     fromObj['IsAssessment'] =this.IsAssessment;
//     fromObj['IsThankYou'] = this.IsThankYou;
//     this.IsWelcomePage=this.stepperStatus;
//    }else if(this.applicationConfigStatus=='IsKnockoutQuestion'){
//     this.isSave = false;
//     fromObj['IsWelcomePage'] = true;
//     fromObj['IsKnockoutQuestion'] = this.stepperStatus;
//     fromObj['IsPersonalInfo'] = this.IsPersonalInfo;
//     fromObj['IsDocuments'] = this.IsDocuments;
//     fromObj['IsAssessment'] =this.IsAssessment;
//     fromObj['IsThankYou'] = this.IsThankYou;
//     this.IsKnockoutQuestion=this.stepperStatus;
//   }else if(this.applicationConfigStatus=='IsPersonalInfo'){
//     fromObj['IsWelcomePage'] = true;
//     fromObj['IsKnockoutQuestion'] = this.IsKnockoutQuestion;
//     fromObj['IsPersonalInfo'] = this.stepperStatus == true;
//     fromObj['IsDocuments'] = this.IsDocuments;
//     fromObj['IsAssessment'] =this.IsAssessment;
//     fromObj['IsThankYou'] = this.IsThankYou;
//     this.IsPersonalInfo=this.stepperStatus;
//   }else if(this.applicationConfigStatus=='IsDocuments'){
//     fromObj['IsWelcomePage'] = true;
//     fromObj['IsKnockoutQuestion'] = this.IsKnockoutQuestion;
//     fromObj['IsPersonalInfo'] = this.IsPersonalInfo;
//     fromObj['IsDocuments'] = this.stepperStatus == true;
//     fromObj['IsAssessment'] =this.IsAssessment;
//     fromObj['IsThankYou'] = this.IsThankYou;
//     this.IsDocuments=this.stepperStatus;
//   }else if(this.applicationConfigStatus=='IsAssessment'){
//     fromObj['IsWelcomePage'] = true;
//     fromObj['IsKnockoutQuestion'] = this.IsKnockoutQuestion;
//     fromObj['IsPersonalInfo'] = this.IsPersonalInfo;
//     fromObj['IsDocuments'] = this.IsDocuments;
//     fromObj['IsAssessment'] =this.stepperStatus == true;
//     fromObj['IsThankYou'] = this.IsThankYou;
//     this.IsAssessment=this.stepperStatus;
//   }else if(this.applicationConfigStatus=='IsThankYou'){
//     fromObj['IsWelcomePage'] = true;
//     fromObj['IsKnockoutQuestion'] = this.IsKnockoutQuestion;
//     fromObj['IsPersonalInfo'] = this.IsPersonalInfo;
//     fromObj['IsDocuments'] = this.IsDocuments;
//     fromObj['IsAssessment'] =this.IsAssessment;
//     fromObj['IsThankYou'] = this.stepperStatus == true;
//     this.IsThankYou=this.stepperStatus;
//   }
//    fromObj['ApplicationFormId'] = this.ApplicationFormId;
//    this.loading = true;
//    this.jobService.createApplicationformConfiguration(fromObj).subscribe(
//     (repsonsedata: any) => {
//       if (repsonsedata.HttpStatusCode === 200) {
//         this.loading = false;
//         //this.getApplicationFormConfigurationById(this.ApplicationFormId);
//         //this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
//       }
//       else if (repsonsedata.HttpStatusCode === 400) {
//          this.loading = false;
//         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
//       }
//       else {
//         this.loading = false;
//       }
//     }, err => {
//       this.loading = false;
//       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
//     }
//   )
// }

/*
@Type: File, <ts>
@Name: saveThankYou function
@Who: Renu
@When: 03-10-2022
@Why: EWM-8901 EWM-9096
@What: Save data for Thank You page
*/
saveThankYou(){
  let fromObj = {};
    let value = this.FormData?.value;
    if(value && this.thankYouStatus === true){
    fromObj['Id'] = value?.Id;
    fromObj['ApplicationFormId'] = value?.ApplicationFormId;
    fromObj['ThankYouMessage'] = value?.ThankYouMessage;
    fromObj['SelfDeclaration'] = value?.SelfDeclaration?1:0;
    fromObj['SelfDeclarationMessage'] = value?.SelfDeclarationMessage;
    }else{
      fromObj['ApplicationFormId'] =this.ApplicationFormId;
      fromObj['ThankYouMessage'] =this.deafultThankyouMsg;
      fromObj['SelfDeclaration'] = 1;
      fromObj['SelfDeclarationMessage'] = this.defaultMsg;
    }
    
   this.loading = true;
   this.jobService.createThankYouInfo(fromObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.getApplicationFormConfigurationById(this.ApplicationFormId);
        if(this.thankYouStatus === true){
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
         }
      else if (repsonsedata.HttpStatusCode === 400) {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }
  )
}
/*
@Type: File, <ts>
@Name: sectionConfigureDashboard function
@Who: Renu
@When: 06-10-2022
@Why: EWM-8902 EWM-9112
@What: open pop up for configure sections
*/

sectionConfigureDashboard(pageLabel:string) {
 this.activeStatus=pageLabel;
  let originalitems=[...this.ApplicationFormconfigList ];
  const dialogRef = this.dialog.open(SectionConfigureComponent, {
    panelClass: ['xeople-modal', 'candidateConfigureDashboard', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    data: new Object({ configureList: originalitems})
  });
    dialogRef.afterClosed().subscribe(res => {
      if(res==true){
        this.getApplicationFormConfigurationById(this.ApplicationFormId)
      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	 
 
}

/*
@Type: File, <ts>
@Name: onSectionClick function
@Who: Renu
@When: 06-10-2022
@Why: EWM-8902 EWM-9112
@What: on section click event
*/
onSectionClick(sectionInfo:any,pageLabel:string){
this.sectionInfo = sectionInfo;
this.activeStatus=pageLabel;
this.pageLabel=sectionInfo.PageLabel;
this.isDisabledButtonDocuments = false;
if(this.pageLabel==='Welcome_Page'){
  this.welcomeStatus=true;
  this.knockoutStatus=false;
  this.thankYouStatus=false;
  this.assessmentQueStatus=false;
  this.documentsStatus=false;
  this.personalInformationStatus=false;
  this.isImportantLinkPage=false;  
  this.isDisabledButton = false;
  // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  if ((this.applicationForm===true && this.selectedDataList.length<1) && this.toggeloff==true) {
    this.clickConfirmPopup();
  }
}else if(this.pageLabel==='Personal_Information'){
  this.welcomeStatus=false;
  this.knockoutStatus=false;
  this.thankYouStatus=false;
  this.assessmentQueStatus=false;
  this.documentsStatus=false;
  this.personalInformationStatus=true;
  this.isImportantLinkPage=false;
  this.isDisabledButton = false;
  // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  if ((this.applicationForm===true && this.selectedDataList.length<1) && this.toggeloff==true) {
    this.clickConfirmPopup();
  }
}else if(this.pageLabel==='Knockout_Questions'){
  this.isSave = false;
  this.welcomeStatus=false;
  this.knockoutStatus=true;
  this.thankYouStatus=false;
  this.assessmentQueStatus=false;
  this.documentsStatus=false;
  this.personalInformationStatus=false;
  this.isImportantLinkPage=false;
  this.isDisabledButton = false;
  // this.applicationForm=true;
  // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  if ((this.applicationForm===true && this.selectedDataList.length<1) && this.toggeloff==true) {
    this.clickConfirmPopup();
  } 
}else if(this.pageLabel==='Documents'){
  this.welcomeStatus=false;
  this.knockoutStatus=false;
  this.thankYouStatus=false;
  this.assessmentQueStatus=false; 
  this.documentsStatus=true;
  this.personalInformationStatus=false;
  this.isImportantLinkPage=false;
  this.applicationForm=true;
  // who:maneesh,what:ewm-9594,when:25/04/2023
  if(this.selectedDataList?.length==0){          
    this.isDisabledButton = true;  
    this.toggeloff=false;
  }  else {
    this.isDisabledButton = false;
    this.isDisabledButtonDocuments = false;
    this.toggeloff = true;
  } 
  if (this.openConfermPopup==true ) {    
    this.toggeloff = true;
  }
}
else if(this.pageLabel==='Important_Links'){
  this.isSave = false;
  this.welcomeStatus=false;
  this.knockoutStatus=false;
  this.thankYouStatus=false;
  this.assessmentQueStatus=false;
  this.documentsStatus=false;
  this.personalInformationStatus=false;
  this.isImportantLinkPage=true;
  this.isDisabledButton = false;
  // this.applicationForm=true;
  // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  if ((this.applicationForm===true && this.selectedDataList.length<1) && this.toggeloff==true) {
    this.clickConfirmPopup();
  }
}
else if(this.pageLabel==='Thank_You'){
  this.welcomeStatus=false;
  this.knockoutStatus=false;
  this.thankYouStatus=true;
  this.assessmentQueStatus=false;
  this.documentsStatus=false;
  this.personalInformationStatus=false;
  this.isImportantLinkPage=false;
  this.isDisabledButton = false;
  // this.applicationForm=true;
  // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  if ((this.applicationForm===true && this.selectedDataList.length<1) && this.toggeloff==true) {
    this.clickConfirmPopup();
  }
}
}

/*
@Type: File, <ts>
@Name: onChangeToggle function
@Who: Renu
@When: 06-10-2022
@Why: EWM-8902 EWM-9112
@What: on toggle on/off save configuration
*/
onChangeToggle(stepperStatus: boolean,applicationConfigStatus:any){  
  let fromObj = {};  
  this.stepperStatus=stepperStatus;    
  this.applicationConfigStatus=[applicationConfigStatus];
  this.isDisabledButtonDocuments = false
  if(stepperStatus==true){    
   this.applicationConfigStatus?.filter(x=>x['IsEnabled']=1);
  }else{
    this.applicationConfigStatus?.filter(x=>x['IsEnabled']=0);
  }
  if(applicationConfigStatus.PageLabel==='Welcome_Page'){
    this.IsWelcomePage=this.stepperStatus;
  }else if(applicationConfigStatus.PageLabel==='Personal_Information'){
    this.IsPersonalInfo=this.stepperStatus;
  }else if(applicationConfigStatus.PageLabel==='Knockout_Questions'){
    this.IsKnockoutQuestion=this.stepperStatus;
  }else if(applicationConfigStatus.PageLabel=='Documents'){
    this.IsDocuments=this.stepperStatus;     
    this.openConfermPopup=this.stepperStatus;
    if ( this.openConfermPopup==true) {
      this.onSectionClick(applicationConfigStatus,'')
    }
    // <!---------@When: 07-12-2022 @who:Adarsh singh @why: EWM-9594 --------->    
    let data = this.FormData.value.allDocument?.filter(x=>x.IsHidden===1 || x.IsMandatory===1);        
    if (stepperStatus === true) {
      if (data?.length === 0) {
        this.isDisabledButtonDocuments = true;
      }
    } else {
      if (data?.length > 0) {
        this.isDisabledButtonDocuments = false;
      } else {
        this.isDisabledButtonDocuments = true;
      }
    }
    // end 
  }else if(applicationConfigStatus.PageLabel==='Important_Links'){
    this.IsImportant=this.stepperStatus;
  }else if(applicationConfigStatus.PageLabel==='Thank_You'){
    this.IsThankYou=this.stepperStatus;
  }
   fromObj['ApplicationFormId'] = this.ApplicationFormId;
   this.jobService.isKnockoutEnable.subscribe(res=>{
    this.isKnockOutEnable = res;
   })
   applicationConfigStatus.IsKnockoutContinue = this.isKnockOutEnable;
   this.loading = true;   
   this.jobService.createApplicationformConfiguration(this.applicationConfigStatus).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        //this.getApplicationFormConfigurationById(this.ApplicationFormId);
        //this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else if (repsonsedata.HttpStatusCode === 400) {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }
  )
}


 /*
@Type: File, <ts>
@Name: saveKnockoutQuestion function
@Who: Adarsh singh
@When: 30-Oct-2022
@Why: EWM-8897 EWM-9270
@What: Save data for Important links page
*/
saveimportantLinkPage(){
  let fromObj = {};
   this.FormData.value?.allImportantList?.forEach((element,index) => {
    this.ImportantLinkDetails.push({
      'Heading': element.Heading,
      'SubHeading': element.SubHeading,
      'IconPath': element.IconPath,
      'URL': element.URL,
      'Description': element.Description,
      'DisplaySequence': index+1,
    })
  });

  fromObj['ApplicationFormId'] = this.ApplicationFormId;
  fromObj['ImportantLinkDetails'] = this.ImportantLinkDetails;
  this.loading = true;
      
   this.jobService.createUpdateImportantLinksAll(fromObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.ImportantLinkDetails=[];
        this.commonService.knockoutQuestionFormSaveStatus.next(true);  
        this.getApplicationFormConfigurationById(this.ApplicationFormId);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else if (repsonsedata.HttpStatusCode === 400) {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
      else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }
  )
}
isShowAll(res){
  this.selectedDataList = res?.filter(x=>x.IsHidden===1 || x.IsMandatory===1);  
  // who:maneesh,what:ewm-9594,when:25/04/2023
  if(this.selectedDataList?.length==0){          
    this.isDisabledButton = true;  
  }  else {
    this.isDisabledButton = false;
    this.isDisabledButtonDocuments = false;
  }
  // who:maneesh,what:ewm-9594,when:25/04/2023

  let select = res?.filter(x=>x.IsHidden===0); 
  this.stepperStatus ===  false;
  if(this.selectedDataList?.length==0){          
    this.isDisabledButtonDocuments = true;
    
  }  else{
    this.isDisabledButtonDocuments = false;
    this.isSave=false;
  } 

}
  

isShowAllChecked(res){  
    this.selectedDataList = res?.filter(x=>x.IsHidden===1 || x.IsMandatory===1); 
    if(this.selectedDataList?.length==0){          
      this.IsDocuments = false;
      this.isDisabledButtonDocuments = true;
       // this.documentsStatus=false; 
         this.ApplicationFormconfigList?.filter(x=>{
          if(x['PageLabel']==='Documents'){
            x['IsEnabled'] = 0;
            this.IsDocuments=x['IsEnabled']===1?true:false;
          }
        });

    }  
    // <!---------@When: 07-12-2022 @who:Adarsh singh @why: EWM-9594 --------->    
    if (this.stepperStatus ===  true && this.applicationConfigStatus[0]['PageLabel']=='Documents') {
      if(this.selectedDataList?.length === 0){
        this.isDisabledButtonDocuments = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant('label_DocumnetAtLeastOneEnable'),'400'); 
      }else{
        this.isDisabledButtonDocuments = false;
      }
    }if(this.IsDocuments == false){
      if (this.selectedDataList?.length > 0) {
        this.isDisabledButtonDocuments = false;
      } else {
        this.isDisabledButtonDocuments = true;
      }
    }
  // end 
}

/*
@Type: File, <ts>
@Name: isDocumentAll function
@Who: Adarsh singh
@When: 07-Dec-2022
@Why: EWM-9594
@What: checking is documnet or not while clicking on document tab
*/
gridData:any;
isDocumentAll(data){
  this.gridData = data;  
  if (this.pageLabel === 'Documents') {
    let data = this.FormData.value.allDocument?.filter(x => x.IsHidden === 1 || x.IsMandatory === 1); 
  if (data?.length > 0) {
    this.isDisabledButton = false;
  }
    if (this.stepperStatus === true) {
      if (data?.length === 0) {
        this.isDisabledButtonDocuments = true;
      }
      else {
        this.isDisabledButtonDocuments = false;
      }
    } else {
      if (data?.length > 0) {
        this.isDisabledButtonDocuments = false;
      } else {
        this.isDisabledButtonDocuments = true;
      }
    }
  }
}


  openConfigureRules(pageLabel){
    this.overlayRefConfigureRules.attach(this.overlayConfigureRulesPortal);
    this.commonService.activePageLabel.next(pageLabel);
    this._rtlService.onOverlayDrawerRTLHandler();
  }
  
  closeConfigureRules(){
    // this.overlayConfigureRules=!this.overlayConfigureRules;
    this.overlayRefConfigureRules.detach(this.overlayConfigureRulesPortal);
  }

  cancelDrawer(event){ 
    this.closeConfigureRules();
  }
  /*
  @Name: footer.component.ts
  @Who: Nitin
  @When: 09-Oct-2020
  @Why: ROST-247
  @What: Implementation of Footer Section Flip with Logo Icon
  */
    dirChange(res) {
      if (res == 'ltr') {
        // this.keyboard_arrow_right = 'keyboard_arrow_right';
        // this.keyboard_arrow_left = 'keyboard_arrow_left';
        this.positionMatDrawer = 'start';
      } else {
        // this.keyboard_arrow_right = 'keyboard_arrow_left';
        // this.keyboard_arrow_left = 'keyboard_arrow_right';
        this.positionMatDrawer = 'end';
      }
    }

    isKnockOutEnableFlag(val){
      this.isKnockOutEnable = val;
      this.jobService.isKnockoutEnableInfo.next(this.isKnockOutEnable);
      this.knockoutEnable();
    }


    knockoutEnable(){
      this.applicationConfigStatus = [];
       this.loading = true;
       this.jobService.isKnockoutEnable.subscribe(res=>{
        this.isKnockOutEnable = res;
       })
       this.applicationConfigStatus = [this.sectionInfo];
       this.applicationConfigStatus[0].IsKnockoutContinue = this.isKnockOutEnable;
       this.jobService.createApplicationformConfiguration(this.applicationConfigStatus).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;          }
          else if (repsonsedata.HttpStatusCode === 400) {
             this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
          else {
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      )
    }
    // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  openCOnfirmDilog(data){
    this.applicationForm=data.applicationForm    
    this.appId=data.applicationFormId; 
  }
  // who:maneesh,what:ewm-9594 fixed popup on document if no data select discuss with with abhisek sir and mukesh sir,when:04/04/2023
  clickConfirmPopup(){
      const message ='';
      const title =  '';
      const subTitle = 'label_ForDocument_ApplicationForm';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {     
      if (res == true) {
              this.commonService.documentPageLabel.next(res);
              this.toggeloff=true;
              this.pagelabelDocument=this.ApplicationFormconfigList?.filter(x=>x.PageLabel==="Documents");
              this.onSectionClick(this.pagelabelDocument[0],this.doc)
            }else{
              this.toggeloff=false;
              this.ApplicationFormconfi=this.ApplicationFormconfigList?.filter(x=>x.PageLabel==="Documents");
              this.onChangeToggle(false,this.ApplicationFormconfi[0])
            }
    })
  }

}
