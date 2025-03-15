/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: personal-info.component.ts
 @Who: Renu
 @When: 23-May-2022
 @Why: ROST-6558 EWM-6782
 @What: personal info
 */
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-skills/candidate-skills.component';
import { ImageUploadAdvancedComponent } from 'src/app/modules/EWM.core/shared/image-upload-advanced/image-upload-advanced.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { CandidateAddressComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-address/candidate-address.component';
import { CandidateExperienceComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-experience/candidate-experience.component';
import { CandidateEducationComponent } from 'src/app/modules/EWM-Candidate/candidate-education/candidate-education.component';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { AddphonesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { PreviewSaveService } from 'src/app/application-preview/shared/preview-save.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { X } from '@angular/cdk/keycodes';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-candidate-personal-information',
  templateUrl: './candidate-personal-information.component.html',
  styleUrls: ['./candidate-personal-information.component.scss']
})
export class CandidatePersonalInformationComponent implements OnInit {
 
  public personalInfoForm:FormGroup;
  public profileImagePreview: string;
  croppedImage: any = '';
  profileImage: string = '';
  public imagePreviewloading: boolean = false;
  public skillsData: any = [];
  loading: boolean;
  public emailPattern : string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public emailArr: []=[];
  public phoneArr: []=[];
  emails: any = [];
  phone: any = [];
  public dropDownSalaryUnitConfig: customDropdownConfig[] = [];
  public selectedSalaryUnit: any = {};
  currencyList: [] = [];
  public dropDownCurrencyConfig:customDropdownConfig[] = [];
  public selectedCurrency: any = {};
  @Input() totalStepsCount:number;
  currentStep: any;
  submitActive: boolean;
  resData: any;
  applicationParam: string;
  public addressLoader: boolean;
  public experienceLoader: boolean;
  public EmergencyContactLoader: boolean;
  candidateAddressData: {}={};
  public addressBarData: any;
  
  public userpreferences: Userpreferences;
  @Input() IsKnockoutSuccess:boolean ;  
 // @Output() IsKnockoutSuccess = new EventEmitter<any>();
  personalInformationIdData
  @Input() CandidateId:any;
  appId: any;
  textToSearch:any;
  resDataConfig: any;  
  searchSubject$ = new Subject<any>();
  loadingSearch:boolean=false;
  isSearchTextNotFound:boolean=false;  
  @ViewChild('target') private myScrollContainer: ElementRef;
  public JobId:string;
  constructor(private fb: FormBuilder, private _appSetting: AppSettingsService,public _dialog: MatDialog, public dialogModel: MatDialog,
     private _imageUploadService: ImageUploadService,public candidateService: CandidateService,  private serviceListClass: ServiceListClass,
     private commonService: CommonserviceService,private quickJobService: QuickJobService,private routes: ActivatedRoute,
      private jobService: JobService, private snackBService: SnackBarService, private translateService: TranslateService,
      private previewSaveService:PreviewSaveService, public _userpreferencesService: UserpreferencesService) {
        this.emailPattern=this._appSetting.emailPattern;
    this.personalInfoForm = this.fb.group({
      FirstName:[{value: '', disabled: true},[Validators.required]],
      LastName:[{value: '', disabled: true},[Validators.required]],
      salary:['',[Validators.pattern("^[0-9]*$")]],
      Currency:[],
      SalaryUnitId:[],
      NoticePeriod:['',[Validators.pattern("^[0-9]*$")]],
      skills:[],
      Experience:[],
      Education:[],
      profilePic:[],
      email: [''],
       address: this.fb.group({
        'AddressLinkToMap': ['', [Validators.maxLength(250)]]
      }),
      phone:[''],
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      applicationRefNumber:['']
    });
    this.profileImagePreview = "/assets/user.svg";
   }

  ngOnInit(): void {
  
    this.commonService.onstepperInfoChange.subscribe(res=>{
      this.currentStep=res+1;
      if(this.totalStepsCount==this.currentStep){
        this.submitActive=true;
      }
    })
   
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.CandidateId) {
        this.CandidateId= parms?.CandidateId;
    // who:maneesh,what:get jobId when:31/10/2023
        this.JobId=parms?.JobId; 
      }     
      if (parms?.appId) {
        this.appId= parms?.appId;
        this.getPersonalInfoPagById(this.appId);
      }  
    });
    this.getPersonalInfo(this.CandidateId);    
    this.previewSaveService.ononResumeUploadInfoChange.subscribe((res:any)=>{
      if(res){
       this.personalInfoForm.patchValue({
        FirstName:res.FirstName,
        LastName:res.LastName,
        EmailId:res.EmailId,
       });

       this.emails.push({
        email: res.EmailId,
        type: '',
        IsDefault: 1,
        Name: 'Main'
      })
    }
    });

    this.dropDownSalaryUnitConfig['IsDisabled'] =false;
    this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary;
    this.dropDownSalaryUnitConfig['placeholder'] = 'quickjob_salaryUnit';
    this.dropDownSalaryUnitConfig['IsManage'] = '';
    this.dropDownSalaryUnitConfig['IsRequired'] = false;
    this.dropDownSalaryUnitConfig['searchEnable'] = true;
    this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
    this.dropDownSalaryUnitConfig['multiple'] = false;
    

    this.dropDownCurrencyConfig['IsDisabled'] =false;
    this.dropDownCurrencyConfig['apiEndPoint'] = this.serviceListClass.currencyList;
    this.dropDownCurrencyConfig['placeholder'] = 'quickjob_currency';
    this.dropDownCurrencyConfig['IsManage'] = '';
    this.dropDownCurrencyConfig['IsRequired'] = false;
    this.dropDownCurrencyConfig['searchEnable'] = true;
    this.dropDownCurrencyConfig['bindLabel'] = 'CurrencyName';
    this.dropDownCurrencyConfig['multiple'] = false;

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.personalInfoForm.disable();

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      if(val==''){
        this.clearSearch();
      }else{
        this.highligthSearchText(val);
      } 
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
      croppingImage() {
        // this.loading = true;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = "modal-component";
        dialogConfig.height = "";
        dialogConfig.width = "100%";
        dialogConfig.panelClass = 'myDialogCroppingImage';
        dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeMedium() });
        const modalDialog = this._dialog.open(ImageUploadAdvancedComponent, dialogConfig);
        modalDialog.afterClosed().subscribe(res => {
          if (res.data != undefined && res.data != '') {
            this.croppedImage = res.data;
            // this.loading = true;
           // this.uploadImageFileInBase64();
           this.profileImagePreview= this.croppedImage;
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
      panelClass: ['imageModal', 'animate__animated','animate__zoomIn']
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
    uploadImageFileInBase64(value) {
      this.imagePreviewloading = true;
      const formData = { 'base64ImageString': this.croppedImage };
      let result=this._imageUploadService.uploadByUrlMethod( this.croppedImage ,1);
     result.subscribe((res:any)=>{
       if(res){
        this.imagePreviewloading = false;
        this.profileImage=res.filePathOnServer;
        //this.profileUploadingInfo(value);
       }else{
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
    const dialogRef = this._dialog.open(CandidateSkillsComponent, {
      data: { actionType: action,manageBtn:false },
      panelClass: ['xeople-modal-lg', 'add_skills', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getAllSkills();
      }
    });
  }

  
  /*
   @Type: File, <ts>
   @Name: getAllSkills function
   @Who: Renu
  @When: 06-06-2021
  @Why: EWM-6559 EWM-6789
   @What: get AllSkills List
   */
   getAllSkills() {  
    this.candidateService.getCanAllSkillsData('?CandidateId=155b84d4-12c4-42f8-9505-706d9fb61aee').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.skillsData = repsonsedata.Data;
         
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         // this.skillLoader = false;
        }
      }, err => {
       // this.skillLoader = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
      data: new Object({ address: this.addressBarData,  mode: methodType }),
      panelClass: ['xeople-modal', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res !=null) {
       this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap);
      this.addressBarData =  res.data;
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
      openQuickExperiencrModal(id: any, tag: string) {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this._dialog.open(CandidateExperienceComponent, {
          data: new Object({ editId: id, activityStatus: tag }),
          // data: dialogData,
          panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res == true) {
           
          } else {
           // this.experienceLoader = false;
          }
        })
      }

      openEducationModal(eduId: any, formType: string) {
        const message = `Are you sure you want to do this?`;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this._dialog.open(CandidateEducationComponent, {
          data: new Object({ candidateId: '155b84d4-12c4-42f8-9505-706d9fb61aee', editId: eduId, candidateEducationData: '', formType: formType }),
          panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
          //  this.getCandidateEducationList();
          }
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
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
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
    this.selectedSalaryUnit = data;
    this.personalInfoForm.patchValue(
      {
        Currency: data.Id
      }
    )
  }
}
 /*
  @Type: File, <ts>
  @Name: getPersonalInfo function
  @Who: Suika
  @When: 22-06-2022
  @Why: EWM-5334 EWM-7001
  @What: get data by id
  */
 getPersonalInfo(ApplicationFormId: any) {
    this.loading = true;
    // who:maneesh,what:pass jobId when:31/10/2023
    this.jobService.getPersonalInfo('?candidateId='+this.CandidateId +'&JobId=' + this.JobId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.loading = false;
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.resData = data?.Data;   
            this.IsKnockoutSuccess = this.resData.IsKnockoutSuccess==0?true:false;
            this.jobService.isKnockoutSuccessInfo.next(this.IsKnockoutSuccess); 
            this.personalInfoForm.patchValue({
              FirstName:this.resData.FirstName,
              LastName:this.resData.LastName,
              salary:this.resData.CurrentSalary,
              Currency:this.resData.CurrencyId,
              SalaryUnitId:this.resData.SalaryUnitId,
              NoticePeriod:this.resData.NoticePeriod,
              email:this.resData.Email,
              phone:this.resData.Phone,
             // Education:this.resData.FirstName,
             // profilePic:this.resData.FirstName,
             applicationRefNumber: this.resData.ApplicationReferenceNo
            })
          // console.log("this.resData.Address[0].AddressLinkToMap",this.resData.Address[0].AddressLinkToMap);
            this.personalInfoForm['controls'].address['controls'].AddressLinkToMap.patchValue(this.resData.Address[0]?.AddressLinkToMap);
          this.emails.push(this.resData.Email);
          }
          this.profileImagePreview = this.resData.ProfilePictureUrl? this.resData.ProfilePictureUrl:"/assets/user.svg";;
        }
        else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
    this.loadingSearch = false;

        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
    this.loadingSearch = false;

      })
  }

    /*
   @Type: File, <ts>
   @Name: getPersonalInfoPagById function
   @Who: Renu
   @When: 18-11-2022
   @Why: EWM-8900 EWM-9436
   @What: get data by id
   */
   getPersonalInfoPagById(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.fetchPersonalInfoFormPageById('?applicationId='+ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.loading = false;
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.resDataConfig = data?.Data;
     /*       if (this.resData.IsPhoneApplicable == 1) {
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
            if (this.resData.IsAddressApplicable == 1) {
              // this.checkValidation('AddressLinkToMap', this.resData.IsAddressRequired == 1 ? true : false);

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

            } else {
              this.personalInfoForm.removeControl('Address');
            }

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

            if (this.resData.IsSkillsApplicable == 1) {
              this.checkValidation('skills', this.resData.IsSkillsRequired == 1 ? true : false);

            } else {
              this.personalInfoForm.removeControl('skills');
            }

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

            
          }   */
        }  
        }
        else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
    this.loadingSearch = false;

        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
    this.loadingSearch = false;

      })
  }

  /*
   @Type: File, <ts>
   @Name: checkValidation function
   @Who: Renu
   @When: 18-11-2022
   @Why: EWM-8900 EWM-9436
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
   @Name: highligthSearchText function
   @Who: Suika
   @When: 18-11-2022
   @Why: EWM-8903 EWM-9277
   @What: generic function to highlight search text
 */
highligthSearchTextVal(e:any){
  let textToSearch = e.target.value
  if(textToSearch!=''){
    // who:maneesh,what:ewm.10018 fixed loading, when:27/12/2022
  this.loadingSearch = true;

    this.searchSubject$.next(textToSearch);
  }else{
  this.loadingSearch = false;

    this.searchSubject$.next('');
  }
 
}


  highligthSearchText(textToSearch){
    //let textToSearch = e.target.value
    this.unMarkAll(textToSearch);
    this.textToSearch  = textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");   
    let pattern = new RegExp(`${textToSearch}`,"gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null; 
    
    let arr= [];
    for(var x = 0; x<documentAll?.length; x++){
      if(documentAll[x].innerHTML.toLowerCase().match(textToSearch.toLowerCase())){      
        documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`);
        this.isSearchTextNotFound = false;
        arr.push(textToSearch);
        this.scrollData();
      }else{
        documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match);
       // window.scroll(0, 0);
       this.scrollTop();
      
      }
    } 

    setTimeout(() => {
      if(textToSearch!=''){
        if(arr?.length==0){      
         this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'),'400');       
        }
      }
    }, 1500);
   
   
    this.loadingSearch = false; 
  
  }



  /*
   @Type: File, <ts>
   @Name: clearSearch function
   @Who: Suika
   @When: 18-11-2022
   @Why: EWM-8903 EWM-9277
   @What: generic function to clear search text
 */  
  clearSearch(){  
    this.textToSearch = "";
    let pattern = new RegExp(`${this.textToSearch}`,"gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;   
    for(var x = 0; x<documentAll?.length; x++){ 
      documentAll[x].innerHTML =documentAll[x].textContent.replace(pattern, match => match);
    } 
     this.scrollTop();
  }


  unMarkAll(textToSearch){
    let pattern = new RegExp(`${textToSearch}`,"gi");
      const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;   
      for(var x = 0; x<documentAll?.length; x++){
        documentAll[x].innerHTML =documentAll[x].textContent.replace(pattern, match => match);
      }
  }


  scrollData(){
   // debugger;
    const highlightAll = document.getElementsByClassName('highlight') as HTMLCollectionOf<Element> | null;
    highlightAll[0].scrollIntoView({ behavior: "smooth" , block: 'center' });
  }

  scrollTop(){
    //document.body.scrollTop = 0;
   // debugger;
   /* setTimeout(() => {
      //this.myScrollContainer.nativeElement.scrollTop();
      this.myScrollContainer.nativeElement.scroll({
        top:0,//this.myScrollContainer.nativeElement.scrollHeight, 
        left: 0,
        behavior: 'smooth'
      });
}, 0);  */
const maindiv = document.getElementById('scrolltop');
maindiv.scrollTop = 0;
  }
}
