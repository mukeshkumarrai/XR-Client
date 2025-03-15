/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: personal-info.component.ts
 @Who: Renu
 @When: 23-May-2022
 @Why: ROST-6558 EWM-6782
 @What: personal info
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImageUploadAdvancedComponent } from 'src/app/modules/EWM.core/shared/image-upload-advanced/image-upload-advanced.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { AddphonesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { PreviewSaveService } from '../shared/preview-save.service';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { MatStepper } from '@angular/material/stepper';
import { ExperiencePopupComponent } from './experience-popup/experience-popup.component';
import { EducationPopupComponent } from './education-popup/education-popup.component';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SkillPopupComponent } from './skill-popup/skill-popup.component';
import { knockOutInfo, personalInfo } from '../interface/applicationInfo';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Actions } from '../interface/actions';
import { ManageSkillsComponent } from './skill-popup/manage-skills/manage-skills.component';
import { ActionserviceService } from '../shared/actionservice.service';
import { CoverLetterPopupComponent } from './cover-letter-popup/cover-letter-popup.component';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { SkillTagPopupComponent } from './skill-popup/skill-tag-popup/skill-tag-popup.component';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  removable = true;
  public personalInfoForm: FormGroup;
  public profileImagePreview: string;
  croppedImage: any = '';
  profileImage: string = '';
  public imagePreviewloading: boolean = false;
  public skillsData: any = [];
  loading: boolean;
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public emailArr: [] = [];
  public phoneArr: [] = [];
  emails: any = [];
  phone: any = [];
  public dropDownSalaryUnitConfig: customDropdownConfig[] = [];
  public selectedSalaryUnit: any = {};
  currencyList: [] = [];
  public dropDownCurrencyConfig: customDropdownConfig[] = [];
  public selectedCurrency: any = {};
  @Input() totalStepsCount: number;
  currentStep: any;
  submitActive: boolean;
  resData: any;
  applicationParam: string;
  public addressLoader: boolean;
  public experienceLoader: boolean;
  public EmergencyContactLoader: boolean;
  candidateAddressData: {} = {};
  public addressBarData: any;
  @Output() stepperNext= new EventEmitter<any>();
  @Input() ApplicationFormId: any;
  mode: any;
  public experienceInfo: any = [];
  public educationInfo: any = [];
  public userpreferences: Userpreferences;
  public skillsInfo: any[] = [];
  public personalData: personalInfo;
  public autoFill: any;
  public docsInfo: personalInfo;
  public JobTittle: any;
  public knockoutInfo: knockOutInfo;
  public applicationId: any;
  public JobId: any;
  public knockoutStatus: knockOutInfo;
  private actions: Actions;
  public orgName: any;
  public ResumeFilePath: any;
  public ResumeName: any;
  public coverLetterEnable: any;
  public candidateId: any;
  public generalInformationData: any = {};
  public sourceLabel: any = 'Form';
  public readOnly: boolean = false;
  public candidateInfoData: [] = [];
  public orgId: any;
  coverletter: boolean=false;
  coverletterInfo: any;
  iconFileType: any;
  documentTypeOptions: any;
  parsedResumeData: any;
  resetFormSubjectCurrency: Subject<any> = new Subject<any>();
  resetFormSubjectSalaryUnit: Subject<any> = new Subject<any>();
  isPreviewMode:boolean;
  @Input() lableTitleName: string;
  constructor(private fb: FormBuilder, private _appSetting: AppSettingsService, public _dialog: MatDialog, public dialogModel: MatDialog,
    private _imageUploadService: ImageUploadService, public candidateService: CandidateService, private serviceListClass: ServiceListClass,
    private commonService: CommonserviceService, private routes: ActivatedRoute, public _GeneralInformationService: GeneralInformationService,
    private jobService: JobService, private previewSaveService: PreviewSaveService, private router: Router, private actionsService: ActionserviceService,
    private _userpreferencesService: UserpreferencesService, private snackBService: SnackBarService, private translateService: TranslateService,
    private http: HttpClient) {
      this.emailPattern=this._appSetting.emailPattern;
    this.personalInfoForm = this.fb.group({
      FirstName: [{ value: '', disabled: true }, [Validators.required]],
      LastName: [{ value: '', disabled: true }, [Validators.required]],
      salary: ['', [Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]],
      Currency: [],
      SalaryUnitId: [],
      NoticePeriod: ['', [Validators.pattern("^[0-9]*$"),Validators.maxLength(4)]],
      skills: [],
      Experience: [],
      Education: [],
      profilePic: [],
      CoverLetter: [],
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
      address: this.fb.group({
        'AddressLinkToMap': ['', [Validators.maxLength(250)]]
      }),
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
    });
    this.profileImagePreview = "/user.svg";
    this.actions = this.actionsService.constants;
  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.commonService.onstepperInfoChange.subscribe(res => {
      this.currentStep = res + 1;
      if (this.totalStepsCount == this.currentStep) {
        this.submitActive = true;
      } else {
        this.submitActive = false;
      }
    })
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     })
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId = parms?.applicationId;
        this.applicationParam = '?applicationId=' + parms?.applicationId;
      } else if (parms?.jobId) {
        this.JobId = parms?.jobId;
        this.applicationParam = '?jobId=' + parms?.jobId;
      }
      if (parms?.mode) {
        this.mode = parms?.mode;
        // <!---------@When: 16-03-2023 @who:Adarsh singh @why: EWM-10752 --------->
        this.isPreviewMode = parms?.mode == 'preview' ? this.isPreviewMode = true : this.isPreviewMode = false;
      }
    });
    this.getPersonalInfoPagById(this.applicationParam);
    this.previewSaveService.ononResumeUploadInfoChange.subscribe((res: any) => {
      if (res) {
        this.personalInfoForm.get('FirstName').reset();
        this.personalInfoForm.get('LastName').reset();
        this.emails = [];
        let index = this.emails.some(x => x['email'] == res.EmailId)
        if (!index) {
          this.emails.push({
            email: res.EmailId,
            type: 0,
            IsDefault: true,
            Name: 'Main'
          });
          const control = <FormGroup>this.personalInfoForm.get('emailmul');
          const childcontrol = <FormArray>control.controls.emailInfo;

          childcontrol.clear();
          childcontrol.push(
            this.fb.group({
              EmailId: [res.EmailId, [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(100), Validators.minLength(1), RxwebValidators.unique()]],
              Type: [0, [Validators.required, RxwebValidators.unique()]],
              IsDefault: [true]
            })
          )

          this.personalInfoForm.patchValue({
            FirstName: res.FirstName,
            LastName: res.LastName
          });
        }
      }
    });

   
    this.previewSaveService.onIsAutoFillInfoChange.subscribe((res: any) => {
      this.autoFill = res;
    });

    this.previewSaveService.onJobInfoChange.subscribe((res: any) => {
      this.JobTittle = res;
    });

    this.previewSaveService.ondocumentInfoChange.subscribe((res: personalInfo) => {
      this.docsInfo = res;
    });

    this.previewSaveService.onknockOutInfoChange.subscribe((data: knockOutInfo) => {
      this.knockoutInfo = data;
    });

    this.previewSaveService.konckoutStatusChange.subscribe((data: knockOutInfo) => {
      this.knockoutStatus = data;
    });

    this.previewSaveService.resumeUploadInfoChange.subscribe((data: any) => {
      if (data) {
        this.ResumeFilePath = data.ResumeFilePath;
        this.ResumeName = data.ResumeName;
      }
    });

    this.previewSaveService.coverLetterInfoChange.subscribe((data: any) => {
      this.coverLetterEnable = data;
    });
    this.previewSaveService.parsedResumeInfoChange.subscribe(res=>{
      this.parsedResumeData=res;
    })
    this.previewSaveService.currentCandidateExistsInfo.subscribe(res => {
      if (res?.CandidateId) {
        this.readOnly = true;
        this.candidateId = res.CandidateId;
        this.orgId = res.OrgId;
        this.fetchCandidateInfo();
        this.personalInfoForm.get('NoticePeriod')?.disable();
        this.personalInfoForm.get('salary')?.disable();
        this.dropDownSalaryUnitConfig['IsDisabled'] = true;
        this.dropDownCurrencyConfig['IsDisabled'] = true;
        this.resetFormSubjectCurrency.next(this.dropDownCurrencyConfig);
        this.resetFormSubjectSalaryUnit.next(this.dropDownSalaryUnitConfig);
      }else{
        this.patchParsedData(this.parsedResumeData);
        this.readOnly = false;
        const exclude: string[] = ['FirstName', 'LastName','emailmul'];
        Object.keys(this.personalInfoForm.controls).forEach(key => {
           if (exclude.findIndex(q => q === key) === -1) {
               this.personalInfoForm.get(key).reset();
           }
        });
        this.skillsInfo=[];
        this.educationInfo=[];
        this.experienceInfo=[];
        this.phone=[];
        this.profileImagePreview='/assets/user.svg';
        this.personalInfoForm.get('NoticePeriod')?.enable();
        this.personalInfoForm.get('salary')?.enable();
        this.dropDownSalaryUnitConfig['IsDisabled'] = false;
        this.dropDownCurrencyConfig['IsDisabled'] = false;
        this.resetFormSubjectCurrency.next(this.dropDownCurrencyConfig);
        this.resetFormSubjectSalaryUnit.next(this.dropDownSalaryUnitConfig);
      }
    });

    this.dropDownSalaryUnitConfig['IsRefresh'] = false;
    this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary;
    this.dropDownSalaryUnitConfig['placeholder'] = 'quickjob_salaryUnit';
    this.dropDownSalaryUnitConfig['IsManage'] = '';
    this.dropDownSalaryUnitConfig['IsRequired'] = false;
    this.dropDownSalaryUnitConfig['searchEnable'] = true;
    this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
    this.dropDownSalaryUnitConfig['multiple'] = false;

    this.dropDownCurrencyConfig['IsRefresh'] = false;
    this.dropDownCurrencyConfig['apiEndPoint'] = this.serviceListClass.currencyList;
    this.dropDownCurrencyConfig['placeholder'] = 'quickjob_currency';
    this.dropDownCurrencyConfig['IsManage'] = '';
    this.dropDownCurrencyConfig['IsRequired'] = false;
    this.dropDownCurrencyConfig['searchEnable'] = true;
    this.dropDownCurrencyConfig['bindLabel'] = 'CurrencyName';
    this.dropDownCurrencyConfig['multiple'] = false;
  }
   /*
      @Type: File, <ts>
      @Name: patchParsedData
      @Who: Renu
      @When: 06-06-2021
      @Why: EWM-6559 EWM-6789
      @What: when resumme parsed then patch value
    */
  patchParsedData(parsedInfo){
  if(parsedInfo){
    parsedInfo.EducationDetails.forEach(element => {
      this.educationInfo.push({
        'DegreeTitle': element?.DegreeName,
        'Institute': element?.SchoolName,
        'DateEnd': new Date(element?.EndDate),
        'DateStart': new Date(element?.StartDate)
      })
    });
   
    parsedInfo.EmploymentHistoryDetails.forEach(y => {
      let isCurrent: any;
      let Days: number;
      let DateEnd;
      if (y.EndDate == 'Present') {
        isCurrent = 1;
        DateEnd = null;
        let currentDate: any = new Date();
        Days = this.monthDiff(new Date(y.StartDate), currentDate);

      } else {
        isCurrent = 0;
        DateEnd = new Date(y.endDate);
        Days = this.monthDiff(new Date(y.StartDate), new Date(y.DateEnd));
      }
      this.experienceInfo.push({
        'PositionName': y.Designation,
        'Employer': y.OrganizationName,
        // 'Salary': y.Salary ? parseInt(y.Salary) : 0,
        // 'CurrencyId': y.CurrencyId ? parseInt(y.CurrencyId) : 0,
        // 'Currency': y.Currency ? y.Currency : '',
        // 'Symbol': y.Currency ? y.Currency : '',
        // 'SalaryUnitId': y.SalaryUnitId ? parseInt(y.SalaryUnitId) : 0,
        // 'SalaryUnit': y.SalaryUnit ? y.SalaryUnit : '',
        'DateStart': new Date(y.StartDate),
        'DateEnd':DateEnd,
        'Description': y.Description,
        'IsCurrent': isCurrent,
        //'Location': y.Location,
        'TotalExperience': Days
      })
    });
    this.personalInfoForm.patchValue({
      Education: this.educationInfo,
      Experience: this.experienceInfo,
    });
    
  }

  }
    /*
      @Type: File, <ts>
      @Name: monthDiff
      @Who: Renu
      @When: 06-06-2021
      @Why: EWM-6559 EWM-6789
      @What: too calculte difference between dates
    */
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

    /*
      @Type: File, <ts>
      @Name: fetchCandidateInfo
      @Who: Renu
      @When: 06-06-2021
      @Why: EWM-6559 EWM-6789
      @What: fetch candidate info in case of existing candidate
    */
  fetchCandidateInfo() {
    let obj = {};
    obj['candidateid'] = this.candidateId;
    obj['orgid'] = this.orgId;
    this.jobService.candidateDetails('?candidateid=' + this.candidateId + '&orgid=' + this.orgId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {

          let skillArr: any = [];
          this.phone=[];
          this.experienceInfo=[];
          this.educationInfo=[];
          repsonsedata.Data.Skills.forEach(z => {
            this.skillsInfo.push(z)
            skillArr.push(z.Id);
          });
       
          repsonsedata.Data.Experiences.forEach(y => {
            let isCurrent: any;
            let Days: number;
            let DateEnd;
            if (y.IsCurrent == 1) {
              isCurrent = 1;
              DateEnd = null;
              let currentDate: any = new Date();
              Days = this.monthDiff(new Date(y.DateStart), currentDate);

            } else {
              isCurrent = 0;
              DateEnd = new Date(y.endDate);
              Days = this.monthDiff(new Date(y.DateStart), new Date(y.DateEnd));
            }
            this.experienceInfo.push({
              'PositionName': y.PositionName,
              'Employer': y.Employer,
              'Salary': y.Salary ? parseInt(y.Salary) : 0,
              'CurrencyId': y.CurrencyId ? parseInt(y.CurrencyId) : 0,
              'Currency': y.Currency ? y.Currency : '',
              'Symbol': y.Currency ? y.Currency : '',
              'SalaryUnitId': y.SalaryUnitId ? parseInt(y.SalaryUnitId) : 0,
              'SalaryUnit': y.SalaryUnit ? y.SalaryUnit : '',
              'DateStart': new Date(y.DateStart),
               'DateEnd':DateEnd,
              'Description': y.Description,
              'IsCurrent': isCurrent,
              'Location': y.Location,
              'TotalExperience': Days
            })
          });
          repsonsedata.Data.Educations.forEach(x => {
            this.educationInfo.push({
              'DegreeTypeId': x.DegreeTypeId,
              'ScoreTypeId': x.ScoreTypeId,
              'DegreeTitle': x.DegreeTitle,
              'Description': x.Description,
              'FinalScore': parseInt(x.FinalScore),
              'Institute': x.Institute,
              'University': x.University,
              'DateEnd': new Date(x.DateEnd),
              'DateStart': new Date(x.DateStart),
              'CandidateLocation': x.CandidateLocation,
              'QualificationId': x.QualificationId,

            })
          });
          this.emails = [];
          repsonsedata.Data?.GeneralInformation?.Emails.forEach((elem, j) => {
            this.emails.push({
              email: elem.EmailId,
              type: elem.Type,
              IsDefault: elem.IsDefault,
              Name: elem.TypeName
            })
          });

          repsonsedata.Data?.GeneralInformation?.Phones.forEach((elem, j) => {
            this.phone.push({
              phone: elem.PhoneNumber,
              type: elem.Type,
              Name: elem.TypeName,
              IsDefault: elem.IsDefault,
              PhoneCode: elem.PhoneCode,
              phoneCodeName: elem.PhoneCode
            });
            const control = <FormGroup>this.personalInfoForm.get('phonemul');
            const childcontrol = <FormArray>control.controls.phoneInfo;
            if (this.phone.length == 1) {
              childcontrol.clear();
            }
  
            childcontrol.push(
              this.fb.group({
                PhoneNumber: [elem.PhoneNumber, [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
                Type: [elem.Type, [RxwebValidators.unique()]],
                phoneCode: [elem.PhoneCode],
                phoneCodeName: [elem.phoneCodeName]
              })
            );
           
          });
         this.selectedSalaryUnit={'Id':repsonsedata.Data?.GeneralInformation?.SalaryUnitId,'Name':repsonsedata.Data?.GeneralInformation?.Currency};
         this.selectedCurrency={'Id':repsonsedata.Data?.GeneralInformation?.CurrencyId,'CurrencyName':repsonsedata.Data?.GeneralInformation?.Currency};
         this.personalInfoForm.patchValue({
            FirstName:repsonsedata.Data?.GeneralInformation?.FirstName,
            LastName:repsonsedata.Data?.GeneralInformation?.LastName,
            Education: this.educationInfo,
            skills: skillArr,
            Experience: this.experienceInfo,
            salary: repsonsedata.Data?.GeneralInformation?.Salary,
            Currency: repsonsedata.Data?.GeneralInformation?.Currency,
           // CurrencyId: repsonsedata.Data?.GeneralInformation?.CurrencyId,
            SalaryUnitId: repsonsedata.Data?.GeneralInformation?.SalaryUnitId,
            NoticePeriod: repsonsedata.Data?.GeneralInformation?.NoticePeriod,
            profilePic: repsonsedata.Data?.GeneralInformation?.PreviewUrl
          });
          if(repsonsedata.Data?.GeneralInformation?.PreviewUrl)
          {
            this.profileImagePreview= repsonsedata.Data?.GeneralInformation?.PreviewUrl;
          }else{
            this.profileImagePreview = "/assets/user.svg";
          }
          
            let locationArr = {};
            locationArr['AddressLine1'] = repsonsedata.Data?.GeneralInformation?.Address1,
            locationArr['AddressLine2'] = repsonsedata.Data?.GeneralInformation?.Address2;
            if( repsonsedata.Data?.GeneralInformation?.AddressLinkToMap!=undefined &&  repsonsedata.Data?.GeneralInformation?.AddressLinkToMap!=null && repsonsedata.Data?.GeneralInformation?.AddressLinkToMap!=''){
              locationArr['AddressLinkToMap'] =  repsonsedata.Data?.GeneralInformation?.AddressLinkToMap;
            }else{
              let addresswithoutApi:any = ""
              addresswithoutApi =  repsonsedata.Data?.GeneralInformation?.Address1 + ", " + repsonsedata.Data?.GeneralInformation?.PostalCode + ", " +  repsonsedata.Data?.GeneralInformation?.CountryName;
              locationArr['AddressLinkToMap'] = addresswithoutApi
            }
            locationArr['CountryId'] = repsonsedata.Data?.GeneralInformation?.CountryId,
            locationArr['CountryName'] = repsonsedata.Data?.GeneralInformation?.CountryName,
            locationArr['District_Suburb'] = repsonsedata.Data?.GeneralInformation?.District,
            locationArr['Latitude'] = repsonsedata.Data?.GeneralInformation?.Latitude.toString(),
            locationArr['Longitude'] = repsonsedata.Data?.GeneralInformation?.Longitude.toString(),
            locationArr['StateId'] = repsonsedata.Data?.GeneralInformation?.StateId ? parseInt(repsonsedata.Data?.GeneralInformation?.StateId) : 0,
            locationArr['StateName'] = repsonsedata.Data?.GeneralInformation?.StateName;
            locationArr['PostalCode'] = repsonsedata.Data?.GeneralInformation?.PostalCode,
            locationArr['TownCity'] = repsonsedata.Data?.GeneralInformation?.City,
            locationArr['TypeId'] = 0,
            locationArr['Name'] = "",
            this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.setValue( repsonsedata.Data?.GeneralInformation?.AddressLinkToMap);
            this.candidateInfoData = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
     @Type: File, <ts>
     @Name: upload Image function
     @Who: Renu
     @When: 06-06-2021
     @Why: EWM-6559 EWM-6789
     @What: use for upload image on server
   */
  croppingImage() {
    // this.loading = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeMedium(),ratioStatus:true , recommendedDimensionSize:true, recommendedDimensionWidth:'700',recommendedDimensionHeight:'700' });
    const modalDialog = this._dialog.open(ImageUploadAdvancedComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        // this.loading = true;
        this.uploadImageFileInBase64();
        this.profileImagePreview = this.croppedImage;
      }
    })
  }

  /**
  @Name: upload Image function
  @Who: Renu
  @When: 06-06-2021
  @Why: EWM-6559 EWM-6789
  @What: This function responsible to open and close the modal window.
  @Return: None
  @Params :
  1. param -button name so we can check it come from which link.
  */
  openDialog(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this._dialog.open(ModalComponent, {
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  /*
 @Type: File, <ts>
 @Name: upload Image function
 @Who: Renu
 @When: 06-06-2021
 @Why: EWM-6559 EWM-6789
 @What: use for upload image on server
   */
  uploadImageFileInBase64() {
    this.imagePreviewloading = true;
    const formData = { 'base64ImageString': this.croppedImage };
    let result = this._imageUploadService.uploadByUrlMethod(this.croppedImage, 1);
    result.subscribe((res: any) => {
      if (res) {
        this.imagePreviewloading = false;
        this.profileImage = res.filePathOnServer;
        this.personalInfoForm.controls['profilePic'].setValue(this.profileImage);
      } else {
        this.imagePreviewloading = false;
      }
    });
  }

  /*
@Type: File, <ts>
@Name: openSkillsModal
@Who: Renu
@When: 06-06-2021
@Why: EWM-6559 EWM-6789
@What: to open Skills modal dialog SkillsPopupComponent
*/
  openSkillsModal(action) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(SkillTagPopupComponent, {
      data: { actionType: action, manageBtn: false },
      panelClass: ['xeople-modal', 'add_skills', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let skills = [];
        res.Skills?.forEach(element => {
          this.skillsInfo.push(element);
          skills.push(element.Id);
        });
        
        this.personalInfoForm.controls['skills'].patchValue(skills);

        //this.getAllSkills();
      }
    });
  }

  /*
    @Type: File, <ts>
    @Name: deleteConfirmEmergencyContacts
    @Who: Renu
    @When: 23-June-2022
    @Why: EWM-7153 EWM-7239
    @What: delete confirmation to delete skills
  */

  deleteConfirmskills(data: any) {
    const message = 'label_titleDialogContentSiteDomain';
    const title = 'label_delete';
    const subTitle = 'label_skill';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.skillsInfo = this.skillsInfo.filter(x => x['Id'] !== data['Id']);
        if (this.resData?.IsSkillsRequired == 1) {
          this.personalInfoForm.controls['skills'].patchValue('');
        }
      }
    });
  }

  /*
    @Type: File, <ts>
    @Name: openQuickSkillEdidModal
    @Who: Renu
    @When: 23-June-2022
    @Why: EWM-7153 EWM-7239
    @What: skills for editing
  */
  openQuickSkillEdidModal(data, activestatus) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folder';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(ManageSkillsComponent, {
      data: { Name: 'this.headerlabel', skilldata: data, activestatus: activestatus },
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
      }
    })
  }

  /*
    @Type: File, <ts>
    @Name: openDialogCandidateAdress
    @Who: Renu
    @When: 06-06-2021
    @Why: EWM-6559 EWM-6789
    @What: for opening modal address popup
  */
  openDialogCandidateAdress(methodType: string) {
    const dialogRef = this.dialogModel.open(QuicklocationComponent, {
      data: new Object({ address: this.addressBarData, mode: methodType }),
      panelClass: ['xeople-modal', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res != null) {

        this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap);
        this.addressBarData = res.data;
      }
    })
  }


  /*
      @Type: File, <ts>
      @Name: openQuickExperiencrModal
       @Who: Renu
      @When: 06-06-2021
      @Why: EWM-6559 EWM-6789
      @What: to open quick add Experience modal dialog
    */
  openQuickExperiencrModal(exp: any, tag: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(ExperiencePopupComponent, {
      data: new Object({ editdata: exp, activityStatus: tag,resData: this.resData }),
      // data: dialogData,
      panelClass: ['xeople-modal', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        if (tag !== 'edit') {
          this.experienceInfo.push(res);
        } else {
          let itemIndex = this.experienceInfo.findIndex(item => item.PositionName == exp.PositionName);
          this.experienceInfo[itemIndex] = res;
        }
        this.personalInfoForm.controls['Experience'].patchValue(this.experienceInfo);
      }
    })
  }

  /*
   @Type: File, <ts>
   @Name: DeleteExperienceById function
   @Who: Nitin Bhati
   @When: 17-Aug-2021
   @Why: EWM-2529
   @What: FOR DIALOG BOX confirmation
 */

  DeleteExperienceById(experienceData: any): void {
    let experienceObj = {};
    experienceObj = experienceData;
    experienceObj['DateStart'] = new Date(experienceData.DateStart);
    experienceObj['DateEnd'] = new Date(experienceData.DateEnd);
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_experience';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.experienceLoader = true;
      //this.result = dialogResult;
      if (dialogResult == true) {
        this.experienceInfo = this.experienceInfo.filter(x => x !== experienceData);
        if (this.resData?.IsExperienceRequired == 1) {
          this.personalInfoForm.controls['Experience'].patchValue('');
        }
      }
    });
  }

  /*
@Type: File, <ts>
@Name: DeleteEducationById function
@Who: Suika
@When: 17-Aug-2021
@Why: EWM-2249
@What: FOR DIALOG BOX confirmation
*/

  DeleteEducationById(educationData: any): void {
    let educationObj = {};
    educationObj = educationData;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_education';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.educationInfo = this.educationInfo.filter(x => x !== educationData);
        if (this.resData?.IsEducationRequired == 1) {
          this.personalInfoForm.controls['Education'].patchValue('');
        }
      }
    });
  }


  /*
      @Type: File, <ts>
      @Name: openEducationModal
       @Who: Renu
      @When: 06-06-2021
      @Why: EWM-6559 EWM-6789
      @What: to open quick add education modal dialog
    */
  openEducationModal(edu: any, formType: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(EducationPopupComponent, {
      data: new Object({ editData: edu, formType: formType, resData: this.resData }),
      panelClass: ['xeople-modal', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (formType !== 'edit') {
          this.educationInfo.push(dialogResult);
        } else {
          let itemIndex = this.educationInfo.findIndex(item => item.DegreeTitle == edu.DegreeTitle);
          this.educationInfo[itemIndex] = dialogResult;
        }

        this.personalInfoForm.controls['Education'].patchValue(this.educationInfo);
      }

    })
  }

  /* 
    @Type: File, <ts>
    @Name: addEmail
    @Who: Renu
    @When: 06-06-2021
    @Why: EWM-6559 EWM-6789
    @What: for opening the email dialog box
   */
  addEmail() {
    this.personalInfoForm.get('emailmul').reset();
    const dialogRef = this._dialog.open(AddemailComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ emailmul: this.personalInfoForm.get('emailmul'), emailsChip: this.emails, isMainEmailOptionDisabled: true, isMainDefault: true }),
      panelClass: ['xeople-modal', 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;
      if (this.emailArr) {
        for (let j = 0; j < this.emailArr.length; j++) {
          this.emails.push({
            email: this.emailArr[j]['EmailId'],
            type: this.emailArr[j]['Type'],
            IsDefault: this.emailArr[j]['IsDefault'],
            Name: this.emailArr[j]['Name']
          })
        }
      }
      else {
        if (this.emails.length == 0) {
          const control = this.personalInfoForm.get("emailmul").get("emailInfo") as FormArray
          control.clear();
          control.push(
            this.fb.group({
              EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
              Type: [[], [RxwebValidators.unique()]],
              TypeName: ['']
            })
          )
        }
        else {
          const control = this.personalInfoForm.get("emailmul").get("emailInfo") as FormArray
          control.clear();
          control.push(
            this.fb.group({
              EmailId: ['', [Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
              Type: [[], [RxwebValidators.unique()]],
              TypeName: ['']
            })
          )
        }
        }
    })
    // this.addPeopleForm.get('emailmul').markAsPristine();
    // this.addPeopleForm.get('emailmul').markAsUntouched();
    // this.addPeopleForm.get('emailmul').updateValueAndValidity();
  }

  /* 
  @Type: File, <ts>
  @Name: addPhone
  @Who: Renu
  @When: 06-06-2021
  @Why: EWM-6559 EWM-6789
  @What: for opening the phone dialog box
 */

  addPhone() {
    this.personalInfoForm.get('phonemul').reset();
    const dialogRef = this._dialog.open(AddphonesComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ phonemul: this.personalInfoForm.get('phonemul'), phoneChip: this.phone }),
      panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
        this.phoneArr = res.data;
        if (this.phoneArr) {

          for (let j = 0; j < this.phoneArr.length; j++) {
            this.phone.push({
              phone: this.phoneArr[j]['PhoneNumber'],
              type: this.phoneArr[j]['Type'],
              Name: this.phoneArr[j]['Name'],
              IsDefault: this.phoneArr[j]['IsDefault'],
              PhoneCode: this.phoneArr[j]['PhoneCode'],
              phoneCodeName: this.phoneArr[j]['phoneCodeName']
            });

            const control = <FormGroup>this.personalInfoForm.get('phonemul');
            const childcontrol = <FormArray>control.controls.phoneInfo;
            if (this.phone.length == 1) {
              childcontrol.clear();
            }

            childcontrol.push(
              this.fb.group({
                PhoneNumber: [this.phoneArr[j]['PhoneNumber'], [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
                Type: [this.phoneArr[j]['Type'], [RxwebValidators.unique()]],
                phoneCode: [this.phoneArr[j]['PhoneCode']],
                phoneCodeName: [this.phoneArr[j]['phoneCodeName']]
              })
            );

          }

        }
      // } else {
      //   this.personalInfoForm.get('phonemul').reset();
      //   const control = <FormGroup>this.personalInfoForm.get('phonemul');
      //   const childcontrol: any = <FormArray>control.controls.phoneInfo;
''
      //   if (this.phone.length == 0) {
      //     // childcontrol.clear();
      //   }
      // }
    })
  }

  /*
@Type: File, <ts>
@Name: createemail
@Who: Renu
@When: 26-May-2021
@Why: ROST-1586
@What: when user click on add to create form group with same formcontrol
*/
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [Validators.required, RxwebValidators.unique()]]
    });
  }


  /*
   @Type: File, <ts>
   @Name: createphone
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: when user click on add to create form group with same formcontrol
   */

  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [ Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName: []
    });
  }

  /* 
  @Type: File, <ts>
  @Name: onJobSalaryUnitchange function
  @Who: Renu
  @When: 06-06-2021
  @Why: EWM-6559 EWM-6789
  @What: get salary List
  */

  onJobSalaryUnitchange(data) {
    if (data == null || data == "") {
      this.selectedSalaryUnit = null;
      this.personalInfoForm.patchValue(
        {
          SalaryUnitId: null
        }
      )
      // this.quickJobForm.get("SalaryUnitId").setErrors({ required: true });
      // this.quickJobForm.get("SalaryUnitId").markAsTouched();
      // this.quickJobForm.get("SalaryUnitId").markAsDirty();
    }
    else {
      this.personalInfoForm.get("SalaryUnitId").clearValidators();
      this.personalInfoForm.get("SalaryUnitId").markAsPristine();
      this.selectedSalaryUnit = data;
      this.personalInfoForm.patchValue(
        {
          SalaryUnitId: data.Id
        }
      )
    }
  }

  /* 
  @Type: File, <ts>
  @Name: onCurrencychange function
  @Who: Renu
  @When: 06-06-2021
  @Why: EWM-6559 EWM-6789
  @What: get currency List
  */
  onCurrencychange(data) {
    if (data == null || data == "") {
      this.selectedCurrency = null;
      this.personalInfoForm.patchValue(
        {
          Currency: null
        }
      )

    }
    else {
      this.personalInfoForm.get("Currency").clearValidators();
      this.personalInfoForm.get("Currency").markAsPristine();
      this.selectedCurrency = data;
      this.personalInfoForm.patchValue(
        {
          Currency: data.Id
        }
      )
    }
  }
  /*
   @Type: File, <ts>
   @Name: getPersonalInfoPagById function
   @Who: Adarsh singh
   @When: 18-05-2022
   @Why: EWM-6553 EWM-6709
   @What: get data by id
   */
  getPersonalInfoPagById(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.fetchPersonalInfoFormPageById(ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.loading = false;
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.resData = data?.Data;
            if (this.resData.IsPhoneApplicable == 1) {
              this.personalInfoForm.addControl('phonemul', new FormControl(''));
              (this.personalInfoForm.get("phonemul") as FormGroup).addControl("phoneInfo", new FormControl(''));
              let required = this.resData.IsPhoneRequired == 1 ? true : false;
              let cntrl = this.personalInfoForm['controls'].phonemul['controls'].phoneInfo['controls'].at(0);
              if (required) {
                cntrl.setValidators([Validators.required]);
                cntrl.controls['PhoneNumber'].setValidators([Validators.required,Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]);
                cntrl.controls['Type'].setValidators([Validators.required,RxwebValidators.unique()]);
                cntrl.updateValueAndValidity();
              } else {
                cntrl.clearValidators();
                cntrl.controls['PhoneNumber'].clearValidators();
                cntrl.controls['Type'].clearValidators();
                cntrl.updateValueAndValidity();
              }
            } else {
              this.personalInfoForm.removeControl('phonemul');
              
            }
            // if (this.resData.IsAddressApplicable == 1) {
            
              let required = this.resData.IsAddressRequired == 1 ? true : false;
              this.personalInfoForm.addControl('address', new FormControl(''));
              (this.personalInfoForm.get("address") as FormGroup).addControl("AddressLinkToMap", new FormControl(''));

              if (required) {
                this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.setValidators([Validators.required]);
                this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.updateValueAndValidity();
              } else {
                this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.clearValidators();
                this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.updateValueAndValidity();
              }

            // } else {
            //   this.personalInfoForm.removeControl('Address');
            // }

            if (this.resData.CurrentSalary == 1) {
              this.personalInfoForm.addControl('salary', new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]));
              this.personalInfoForm.addControl('SalaryUnitId', new FormControl(''));
              this.personalInfoForm.addControl('Currency', new FormControl(''));
            } else {
              this.personalInfoForm.removeControl('salary');
              this.personalInfoForm.removeControl('SalaryUnitId');
              this.personalInfoForm.removeControl('Currency');
            }

            if (this.resData.IsNoticePeriodApplicable == 1) {
              let required = this.resData.IsNoticePeriodRequired == 1 ? true : false;
              this.personalInfoForm.addControl('NoticePeriod', new FormControl(''));
              if (required) {

                this.personalInfoForm.controls['NoticePeriod'].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),Validators.maxLength(4)]);
                this.personalInfoForm.controls['NoticePeriod'].updateValueAndValidity();
              } else {
                this.personalInfoForm.controls['NoticePeriod'].setValidators([Validators.pattern("^[0-9]*$"),Validators.maxLength(4)]);
                this.personalInfoForm.controls['NoticePeriod'].updateValueAndValidity();
              }

            } else {
              this.personalInfoForm.removeControl('NoticePeriod');
            }

           // if (this.resData.IsSkillsApplicable == 1) {
              this.checkValidation('skills', this.resData.IsSkillsRequired == 1 ? true : false);

            // } else {
            //   this.personalInfoForm.removeControl('skills');
            // }

            if (this.resData.IsExperienceApplicable == 1) {
              this.checkValidation('Experience', this.resData.IsExperienceRequired == 1 ? true : false);
            } else {
              this.personalInfoForm.removeControl('Experience');
            }
            if (this.resData.IsEducationApplicable == 1) {
              this.checkValidation('Education', this.resData.IsEducationRequired == 1 ? true : false);

            } else {
              this.personalInfoForm.removeControl('Education');
            }

            if (this.resData.IsProfilePicApplicable == 1) {
              this.checkValidation('profilePic', this.resData.IsProfilePicRequired == 1 ? true : false);

            }
          }
        }
        else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
   @Type: File, <ts>
   @Name: checkValidation function
   @Who: Renu
   @When: 03-June-2022
   @Why: EWM-6558 EWM-6782
   @What: generic function to check validation of forms
 */
  checkValidation(controlName: any, Isrequired: any) {

    this.personalInfoForm.addControl(controlName, new FormControl(''));
    if (Isrequired) {
      this.personalInfoForm.controls[controlName].setValidators([Validators.required]);
      this.personalInfoForm.controls[controlName].updateValueAndValidity();
    } else {
      this.personalInfoForm.controls[controlName].clearValidators();
      this.personalInfoForm.controls[controlName].updateValueAndValidity();
    }

  }

  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Renu
     @When: 03-June-2022
     @Why: EWM-6558 EWM-6782
     @What: on save pop-up button file
   */

  onConfirm(): void {
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
    if (this.mode == 'apply') {
      if (this.personalInfoForm.invalid) {
        return;
      }
      this.savepersonalInfo();
    } else {
      this.stepperNext.emit(true);
    }
  }
  /*
     @Type: File, <ts>
     @Name: savepersonalInfo function
     @Who: Renu
     @When: 03-June-2022
     @Why: EWM-6558 EWM-6782
     @What: on save pop-up button file
   */

  savepersonalInfo() {
    this.previewSaveService.setActionRunnerFn(this.actions.PERSONAL_INFO, this.getPersonalInfoData(this.personalInfoForm.getRawValue()));
    this.stepperNext.emit(true);
  }

  /*
 @Type: File, <ts>
 @Name: saveApplicationInfo
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for saving application overall  data
*/
  saveApplicationInfo() {
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
    if (this.mode == 'apply') {
      this.loading = true;
      this.previewSaveService.onpersonalInfo.next(null);
      this.previewSaveService.personalInfoChange.subscribe((data: personalInfo) => {
        if (data) {
          this.loading = false;
          this.personalData = data;
        } else {

          let persInfo = this.getPersonalInfoData(this.personalInfoForm.getRawValue());

          let obj = {};
          obj['KnockoutQuestions'] = this.knockoutInfo;
          obj['PersonalInfo'] = persInfo;
          obj['ApplicationFormId'] = this.applicationId ? this.applicationId : this.ApplicationFormId;
          obj['JobId'] = this.JobId ? this.JobId : '';
          obj['JobTitle'] = this.JobTittle ? this.JobTittle : '';
          obj['Documents'] = this.docsInfo;
          obj['IsAutoFill'] = this.autoFill;
          obj['IsKnockoutSuccess'] = this.knockoutStatus ? Number(this.knockoutStatus) : 1;
          obj['CandidateId'] = this.candidateId;

          this.jobService.saveApplicationPreview(obj).subscribe(
            (repsonsedata: ResponceData) => {
              if (repsonsedata.HttpStatusCode === 200) {
                this.loading = false;
                this.orgName = repsonsedata.Data.OrgName;
                this.previewSaveService.orgName.next(this.orgName);
                this.previewSaveService.successMsg.next(repsonsedata.Data?.ThankyouMessage);
                this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
              } else {
                this.loading = false;
              }
            }, err => {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            })
        }
      });

    } else {
      this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
    }
  }


  /*
 @Type: File, <ts>
 @Name: getPersonalInfoData
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for saving personalInfo overall  data
*/
  getPersonalInfoData(value: any) {
    let perInfo = {};
    let emailJson = [];
    let phoneJson = [];
    perInfo['FirstName'] = value.FirstName;
    perInfo['LastName'] = value.LastName;
    perInfo['ProfilePicture'] = this.profileImage;
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type, "EmailId": elem.email, "IsDefault": elem.IsDefault });
    });
    perInfo['Emails'] = emailJson;
    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "PhoneNumber": elem.phone, "IsDefault": elem.IsDefault, "PhoneCode": elem.PhoneCode.toString() });
    });
    perInfo['Phones'] = phoneJson;
    perInfo['Address'] = this.addressBarData ? [this.addressBarData] : [];
    perInfo['CurrentSalary'] = value.salary ? Number(value.salary) : 0;
    perInfo['CurrencyId'] =this.selectedCurrency.Id;
    perInfo['Currency'] =this.selectedCurrency.CurrencyName;
    perInfo['SalaryUnitId'] = this.selectedSalaryUnit.Id;
    perInfo['SalaryUnit'] =  this.selectedSalaryUnit.Name;
    perInfo['NoticePeriod'] = value.NoticePeriod ? Number(value.NoticePeriod) : 0;
    perInfo['Skills'] = value.skills;
    perInfo['Experiences'] = value.Experience;
    perInfo['Educations'] = value.Education;
    perInfo['ResumeFilePath'] = this.ResumeFilePath;
    perInfo['ResumeName'] = this.ResumeName;
    perInfo['CoverLetter'] = value.CoverLetter;
    return perInfo;
  }



  /*
  @Type: File, <ts>
  @Name: remove
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: to remove single chip via input
  */
  remove(items: any, type: string, index): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
        this.personalInfoForm.controls['emailmul'].setErrors({ 'required': true });
      }

    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
      }
      if (this.resData?.IsPhoneRequired == 1) {
        if (index !== 0) {
          //   //    let cntrl=this.personalInfoForm['controls'].phonemul['controls'].phoneInfo['controls'].removeAt(index);
          const control = <FormGroup>this.personalInfoForm.get('phonemul');
          const childcontrol = <FormArray>control.controls.phoneInfo;
          childcontrol.removeAt(index);
        }
        if (this.phone.length === 0) {
          this.personalInfoForm.setErrors({ 'invalid': true });
        } else {
          this.personalInfoForm.setErrors(null);
        }
      }
    }

  }

  /*
  @Type: File, <ts>
  @Name: openUploadCovePage function
  @Who: Suika
  @When: 13-May-2022
  @Why: ROST-6720
  @What: on upload cover page
*/
  openUploadCovePage() {
    const dialogRef = this._dialog.open(CoverLetterPopupComponent, {
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.coverletter=true;
        this.coverletterInfo=res?.data?.ActualFileName;
        const list = this.coverletterInfo.split('.');
        const fileType = list[list.length - 1];
        let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
        this.iconFileType= FileTypeJson[0]? FileTypeJson[0].logo:'';
        this.personalInfoForm.controls['CoverLetter'].setValue(res.data);
      }
    })
  }

  /*
 @Type: File, <ts>
 @Name: removeImage
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for remove document uploaded data
 */
 removeImage() {
  this.coverletter=false;
}
}
