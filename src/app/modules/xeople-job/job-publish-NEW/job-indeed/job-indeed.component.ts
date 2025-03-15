import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList,ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MapApplicationFormSeekComponent } from '../map-application-form-seek/map-application-form-seek.component';
import { Subject, Subscription } from 'rxjs';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { QuickIndeedLocationComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/quick-indeed-location/quick-indeed-location.component';
import { JobIndeedDescriptionComponent } from '../job-indeed-description/job-indeed-description.component';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';

@Component({
  selector: 'app-job-indeed',
  templateUrl: './job-indeed.component.html',
  styleUrls: ['./job-indeed.component.scss']
})
export class JobIndeedComponent implements OnInit {

  public loading: boolean = false;
  addForm: FormGroup;
  public divStatus: boolean = false;
  currency:string = '';
  city:string = '';
  country:string ='';
  step = 0;
  
  jobId: any;
  jobRefId: any;
  
  JobCount: any;
  LastJobPostdate: any;
  public userpreferences: Userpreferences;
  @Input() selectedIndexId:any;

  selected = -1;
  jobDataById: any;
  JobTitle: any;
  Location: any;
  JobDescription: any;
  public divStatusJobDetails: boolean = false;
  jobDetailsById: string;
  filledCount: number = 0;
  radiofilledCount: number = 0;
  totalfilledCount: number = 0;
  @ViewChildren('textboxes') textboxes: QueryList<ElementRef>;
  filledCount1: number;
  totalFilledPercentage: number=0;
  DescriptionValue: any = ` `;
  selectedIndex: number;
  totalCount:number=4;
  dateStart = new Date(new Date().setDate(new Date().getDate()));
  dateStartNgModel = new Date(new Date().setDate(new Date().getDate()+1));
  minDate: Date;
  maxDate: Date;
  events: any;
  @Output() tabOneEvent = new EventEmitter();
  pattern = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
  );
  expireDate: number=0;
  dirctionalLang;
  public isHideChip:boolean=true;
dateFormat:any;
getDateFormat:any;
/*-@Nitin Bhati,@when:06-06-2023,@Why:EWM-12708,For calling unsubscribe--*/
  destroy$: Subject<boolean> = new Subject<boolean>();

  public dropDownCategoryConfig: customDropdownConfig[] = [];
  public selectedCategory: any = [];
  public selectedCategoryList: any = [];
  public dropDownSalaryUnitConfig: customDropdownConfig[] = [];
  public selectedSalaryUnit: any = {};

  public dropDownExperienceConfig: customDropdownConfig[] = [];
  public selectedExperience: any = [];
  public selectedExperienceList: any = [];

  public dropDownQualificationConfig: customDropdownConfig[] = [];
  public selectedQualification: any = [];
  public selectedQualificationList: any = [];
  public dropDownSalaryNameConfig: customDropdownConfig[] = [];
  public selectedSalaryName: any = {};
  currencyList: [] = [];
  shareJobApplicationUrl: string;
  public isCoppied:boolean=false;
  addressData:any;
  ClientLocationAddress:any=[];
  clientAddressList: any = {};
  selectedValue: any;
  StateIdData: any;
  stateList: [] = [];
  public selectedState: any = {};
  AddressLinkToMap: any;
  Latitude: any;
  Longitude: any;
 // public EmailPattern = /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/;
  urlPattern='(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  logoURL:string;
  clientHoldingList:[]=[];
  JobReferenceId: any;
  state: any;
  stateId: number=0;
  countryId: number=0;
  postalCode: any;
  streetAddress: any;
  experienceName: string;
  applicationBaseUrl: string;
  workflowId: any;
  PublishedOnIndeed: number;
  divexpanded: boolean;
  applicationFormId: number=0;
  applicationFormName: any;
  subdomain: string;
  preJobDescription: any;
  descriptionSatus: boolean;
  DescriptionValueUncheck: any;
  IsHidePayInformation:boolean=false;
  applicationFormNames: any;
  divStatusVideo: boolean;
  PostingIndeedDetailsObs: Subscription;
  jobPublishArray = {};
  result: string = '';
  remoteTypeValue: boolean;
  isCoppiedCareerUrl: boolean=false;
  jobDataByIdEdit: any;
  indeedId: number=0;
  careerSiteURLStatus: boolean=false;
  editStatus: boolean;
  emailPattern: string;
  locationStatus: boolean=false;
  AddressLine1: any;
  AddressLine2: any;
  District_Suburb: any;
  clientName: any;
  clientHoldingName: any;
  emailId: any;
  dateMax: Date;
  dateStartMax: Date;
  isDisabled: boolean = true;
  urlArrayString: any[];
  isReadonly:boolean = false;
  public ParentSource: String;
  
  constructor(private fb: FormBuilder,private _SystemSettingService: SystemSettingService, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService,private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,private route: ActivatedRoute,public dialogObj: MatDialog,private commonserviceService: CommonserviceService, private jobService: JobService,private _appSetting: AppSettingsService,
    private appSettingsService: AppSettingsService, private serviceListClass: ServiceListClass) { 
    this.applicationBaseUrl =  this._appSetting.applicationBaseUrl; 
    this.emailPattern = this._appSetting?.emailPattern;
    this.ParentSource=this._appSetting.SourceCodeParam['Indeed'];
    this.dropDownCategoryConfig['IsDisabled'] = this.jobId == undefined ? false : true;
    this.dropDownCategoryConfig['apiEndPoint'] = this.serviceListClass.getJobCategoryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownCategoryConfig['placeholder'] = 'quickjob_jobCategory';
    this.dropDownCategoryConfig['IsManage'] = '/client/core/administrators/job-category';
    this.dropDownCategoryConfig['IsRequired'] = false;
    this.dropDownCategoryConfig['searchEnable'] = true;
    this.dropDownCategoryConfig['bindLabel'] = 'JobCategory';
    this.dropDownCategoryConfig['multiple'] = true;

    //////Salary Unit//////////////
    this.dropDownSalaryUnitConfig['IsDisabled'] = false;
    this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownSalaryUnitConfig['placeholder'] = 'label_PayType';
    this.dropDownSalaryUnitConfig['IsManage'] = '/client/core/administrators/salaryunit';
    this.dropDownSalaryUnitConfig['IsRequired'] = false;
    this.dropDownSalaryUnitConfig['searchEnable'] = true;
    this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
    this.dropDownSalaryUnitConfig['multiple'] = false;

    //////////Experience//////////
    this.dropDownExperienceConfig['IsDisabled'] = false;
    this.dropDownExperienceConfig['apiEndPoint'] = this.serviceListClass.experienceAllListData + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownExperienceConfig['placeholder'] = 'quickjob_experience';
    this.dropDownExperienceConfig['IsManage'] = '/client/core/administrators/experience-type';
    this.dropDownExperienceConfig['IsRequired'] = false;
    this.dropDownExperienceConfig['searchEnable'] = true;
    this.dropDownExperienceConfig['bindLabel'] = 'Name';
    this.dropDownExperienceConfig['multiple'] = false;

    this.dropDownQualificationConfig['IsDisabled'] = false;
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?ByPassPaging=true' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownQualificationConfig['placeholder'] = 'label_education';
    this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
    this.dropDownQualificationConfig['IsRequired'] = false;
    this.dropDownQualificationConfig['searchEnable'] = true;
    this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
    this.dropDownQualificationConfig['multiple'] = true;

    this.dropDownSalaryNameConfig['IsDisabled'] = false;
    this.dropDownSalaryNameConfig['apiEndPoint'] = this.serviceListClass.currencyList + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&ByPassPaging=true';
    this.dropDownSalaryNameConfig['placeholder'] = 'Currency';
    this.dropDownSalaryNameConfig['IsManage'] = '';
    this.dropDownSalaryNameConfig['IsRequired'] = false;
    this.dropDownSalaryNameConfig['searchEnable'] = true;
    this.dropDownSalaryNameConfig['bindLabel'] = ['Symbol', 'CurrencyName'];
    this.dropDownSalaryNameConfig['multiple'] = false;

    this.addForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.emailPattern)]],
      applicationFormNameValue: ['',Validators.required],
      applicationURL:['',Validators.required],
      careerSiteURL:[''],
      jobTitle: ['', [Validators.required,Validators.maxLength(100)]],
      category:[],
      categoryId:[],
      jobType: [],
      DateExpiry: [, [CustomValidatorService.dateValidator]],
      curency: [, []],
      currencyId:[],
      PayType: [],
      payTypeId:[],
      SalaryRangeMinimum:['', [Validators.min(1),Validators.max(9999999999)]],
      SalaryRangeMaximum:['', [Validators.max(9999999999)]],
      payLabelCheck:[false],
      jobDetailsCheck:[false],
      jobDescription:['', Validators.required],
      remoteJob:[0],
      workplaceType:[],
      experience:[''],
      education:[''],
      Address1: ['', [Validators.maxLength(200)]],
      Address2: ['', [Validators.maxLength(200)]],
      address: this.fb.group({
        'AddressLinkToMap': ['', [Validators.required,Validators.maxLength(250)]],
      }),
      Latitude :[''],
      Longitude :['']
      
    });   
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.addForm.controls['jobDescription'].reset();  
    this.getPostingIndeedDetails();
    this.loading = true;
    this.route.params.subscribe(
      params => {
        if (params['jobId'] != undefined) {
          this.jobId = params['jobId'];
          this.jobRefId = params['jobRefId'];
          this.workflowId = params['workId'];
          this.PublishedOnIndeed = parseInt(params['pub']);
          this.indeedId = parseInt(params['indeedId']);
          if(this.PublishedOnIndeed===1){
            this.divexpanded=true;
            this.jobId=this.jobId;
            this.indeedId=this.indeedId;
            this.getEditIndeedJobPublishedDetailsById(this.jobId);
          }else{
            this.getJobDetailsByid(this.jobId);
          }         
        }
      });   
      this.logoURL=localStorage.getItem('IndeedLogoURL');
      this.subdomain=localStorage.getItem("tenantDomain");  
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.dateFormat = localStorage.getItem('DateFormat');
      
      this.shareJobApplicationUrl = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.jobId+'&domain='+this.subdomain+'&Source='+this.ParentSource+'&parentSource='+this.ParentSource;    
  }

/*
   @Type: File, <ts>
   @Name: getJobDetailsByid function
   @Who: Nitin Bhati
   @When: 23-March-2022
   @Why: EWM-5397
   @What: For getting record by id
  */
   getJobDetailsByid(jobId: any) {
    this.editStatus=true;
    this.loading = true;
    this.isReadonly=false;
     this.jobService.getJobDetailsByidV2('?JobId='+jobId).subscribe(
      (data: ResponceData) => {
        this.loading = true;
        if (data.HttpStatusCode === 200) {
          this.jobDataById = data.Data;
          if(this.jobDataById?.CategoryId=='00000000-0000-0000-0000-000000000000'){
           this.selectedCategory=[];
          }else{
            this.selectedCategory = [{ Id: this.jobDataById?.CategoryId,JobCategory:this.jobDataById?.CategoryName}];
            this.selectedCategoryList = [{ Id: this.jobDataById?.CategoryId,JobCategory:this.jobDataById?.CategoryName}];          
          }
          this.selectedSalaryUnit = { Id: this.jobDataById?.PayTypeId,Name:this.jobDataById?.SalaryUnitName};
          this.selectedExperience = { Id: this.jobDataById?.ExperienceId,Name:this.jobDataById?.Experience};
           this.selectedSalaryName = { Id: this.jobDataById?.CurrencyId,CurrencyName:this.jobDataById?.CurrencyName};
          this.selectedQualification = this.jobDataById?.Qualification;
          this.selectedQualificationList=this.jobDataById?.Qualification;
          this.JobDescription=this.jobDataById?.JobDescription;
          this.JobReferenceId=this.jobDataById?.JobReferenceId;
          if(this.jobDataById?.ClientId=='00000000-0000-0000-0000-000000000000'){
            this.clientName=this.jobDataById?.Organization;
            this.clientHoldingName=this.jobDataById?.Organization;
           }else{
            this.clientName=this.jobDataById?.ClientName;
            this.getClientHoldingName(this.jobDataById?.ClientId,this.jobDataById?.Organization);
          }
          
          this.ClientLocationAddress=[];
            this.ClientLocationAddress.push({  /*-@why:EWM-14693,@when:12-10-2023,@who:Nitin Bhati-*/
              'AddressLine1': this.jobDataById?.AddressLine1,
              'AddressLine2': this.jobDataById?.AddressLine2,
              'AddressLinkToMap': this.jobDataById?.AddressLinkToMap,
              'CountryId': this.jobDataById?.CountryId,
              'CountryName': this.jobDataById?.CountryName,
              'StateId': this.jobDataById?.StateId,
              'StateName': this.jobDataById?.StateName,
              'LocationId': this.jobDataById?.AddressLine1,
              'Latitude': this.jobDataById?.Latitude,
              'Longitude': this.jobDataById?.Longitude,
              'PostalCode': this.jobDataById?.ZipCode,
              'District_Suburb' :this.jobDataById?.DistrictSuburb,
              'TownCity' : this.jobDataById?.CityName
            });
            this.city=this.jobDataById?.CityName;
            this.state=this.jobDataById?.StateName;
            this.stateId=this.jobDataById?.StateId;
            this.country=this.jobDataById?.CountryName;
            this.countryId=this.jobDataById?.CountryId;
            this.postalCode=this.jobDataById?.ZipCode;
            this.streetAddress=this.jobDataById?.AddressLinkToMap;
            this.addressData=[...this.ClientLocationAddress];
          this.addForm.patchValue({
            //clientName:this.jobDataById.ClientName,
             jobTitle:this.jobDataById.JobTitle,
            category:this.jobDataById.CategoryId,
            DateExpiry:new Date(this.jobDataById.JobExpiry),
            curency:this.jobDataById.CurrencyName,
            currencyId:this.jobDataById.CurrencyId,
            payTypeId:this.jobDataById.PayTypeId,
            PayType:this.jobDataById.SalaryUnitName,
            //jobDescription:this.jobDataById.JobDescription,
           })

           this.dateMax = new Date(this.jobDataById.JobExpiry);
           this.dateStartMax = new Date(this.jobDataById.JobExpiry);
          this.JobTitle=this.jobDataById?.JobTitle;
          this.applicationFormId=this.jobDataById?.ApplicationFormId;
          this.applicationFormName=this.jobDataById?.ApplicationFormName;
          this.addForm.patchValue({
            applicationFormNameValue:this.applicationFormName,
            applicationURL:this.shareJobApplicationUrl
          });
          if(this.jobDataById?.AddressLinkToMap=='null' || this.jobDataById?.AddressLinkToMap=='' || this.jobDataById?.StateId=='0' || this.jobDataById?.StateName==null || this.jobDataById?.StateName=="" || this.jobDataById?.StateName=='undefined' || this.jobDataById?.CountryName=='null' || this.jobDataById?.CountryName=='undefined' || this.jobDataById?.CountryName==""|| this.jobDataById?.CountryId=='0' || this.jobDataById?.CityName=='null' || this.jobDataById?.CityName=="" || this.jobDataById?.CityName=='undefined'){     
            this.locationStatus=true;  
                this.addForm.get("address").clearValidators();
                this.addForm.get("address").markAsPristine();
                this.addForm.get('address').setValidators([Validators.required]);      
          }else{
            this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(this.jobDataById?.AddressLinkToMap);
            this.locationStatus=false;  
            this.onProgressCount(this.addForm.value,'location'); 
          }

          if(this.jobDataById?.ApplicationFormId==null || this.jobDataById?.ApplicationFormId=='' ){           
          }else{
            this.onProgressCount(this.addForm.value,'ApplicationForm'); 
          }
         
          // this.addForm.controls["clientName"].disable();
          // this.addForm.controls["clientHoldingName"].disable(); 
           this.loading = false;
          //this.tabOneEvent.emit({JobTitle:this.JobTitle,Published:this.PublishedOnIndeed});
         }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
     @Type: File, <ts>
     @Name: setStep
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for step
  */
    setStep(index: number) {
      this.step = index;
    }
  /*
     @Type: File, <ts>
     @Name: nextStep
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for next index tab
  */
    nextStep() {
      this.step++;
    }
  /*
     @Type: File, <ts>
     @Name: prevStep
     @Who: Nitin Bhati
     @When: 12-Dec-2021
     @Why: EWM-3759
     @What: for previous index tab
  */
    prevStep() {
      this.step--;
    }
 /*
     @Type: File, <ts>
     @Name: clickWorkType
     @Who: Nitin Bhati
     @When: 11-Feb-2022
     @Why: EWM-3759
     @What: for work type
  */
   public clickRemoteType(workTypes){
   // this.remoteTypeValue=workTypes;
    if(workTypes=='yes'){
      this.remoteTypeValue=true;
      this.addForm.patchValue({
        remoteJob:1
      })
    }else{
      this.remoteTypeValue=false;
      this.addForm.patchValue({
        remoteJob:0
      })
    }
    
    //this.onProgressCount(this.addForm.value,'worktype');
  }

 /*
     @Type: File, <ts>
     @Name: conditionChcek
     @Who: Nitin Bhati
     @When: 13-Dec-2022
     @Why: EWM-3759
     @What: for validate maximum salary and minimum salary
  */
     conditionChcek() {
      let SalaryRangeMinimum = Number(this.addForm.get("SalaryRangeMinimum").value);
      let SalaryRangeMaximum = Number(this.addForm.get("SalaryRangeMaximum").value); 
          if(SalaryRangeMaximum >SalaryRangeMinimum){
            this.addForm.get("SalaryRangeMaximum").clearValidators();
            this.addForm.get("SalaryRangeMaximum").markAsPristine();
            this.addForm.get('SalaryRangeMaximum').setValidators([Validators.max(9999999999)]);
          }else{
            this.addForm.get("SalaryRangeMaximum").setErrors({ numbercheck: true });
            this.addForm.get("SalaryRangeMaximum").markAsDirty();
          }
    }
   

/*
     @Type: File, <ts>
     @Name: openPopupForPostResponse
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: for posting seek data 
  */
     openPopupForPostResponse(value: any): void {
      const message = ``;
      const title = value;
      const subtitle = 'label_publishJob';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__slow', 'animate__zoomIn'],
        disableClose: true,
      });
      this.loading = true;
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        if (dialogResult == true) {
          this.router.navigate(['/client/core/job/job-landingpage/' + this.workflowId]);
        } else {
          this.router.navigate(['/client/core/job/job-landingpage/' + this.workflowId]);
          this.loading = false;
        }
      });
    }
  /*
     @Type: File, <ts>
     @Name: oncancel
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: Redirect to job landing page
  */
    oncancel(){
      this.router.navigate(['/client/core/job/job-landingpage/' + this.workflowId]);
    }
    onJobDetails(){
     let jobcheck =this.addForm.get("jobDetailsCheck").value;
      if(jobcheck===false){
        this.preJobDescription=this.JobDescription;//this.jobDataById.JobDescription;
        this.DescriptionValue=this.JobDescription;//this.jobDataById.JobDescription;
        this.divStatusJobDetails=true;
        this.descriptionSatus=false;
        if (this.JobDescription == ' '|| this.JobDescription==null || this.JobDescription== 'undefined') {
          this.descriptionSatus=true;
          this.addForm.controls['jobDescription'].reset();
          this.onProgressCountDecreased(this.addForm.value,'description');
         } else {
          this.descriptionSatus=false;
          this.addForm.patchValue({
            jobDescription: this.JobDescription
          });
          this.onProgressCount(this.addForm.value,'description'); 
        }
        }else{
          this.divStatusJobDetails=false;
           if(this.DescriptionValueUncheck == undefined){
            this.divStatusJobDetails=false;
            this.descriptionSatus=true;
            this.addForm.controls['jobDescription'].reset();
            this.DescriptionValue = ` `;
            this.addForm.patchValue({
              jobDescription: ''
            });
          this.onProgressCountDecreased(this.addForm.value,'description');
           }else{
            this.descriptionSatus=false;
            this.DescriptionValue=this.DescriptionValueUncheck;
            this.divStatusJobDetails=false;
          this.addForm.patchValue({
            jobDescription: this.DescriptionValue
          });
          this.onProgressCount(this.addForm.value,'description');
           }
          }
    }
/* 
    @Type: File, <ts>
    @Name: input function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
    input(value) {
        this.filledCount = this.textboxes?.filter(t => t.nativeElement.value).length;       
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
         this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
         //this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        if(this.addForm.invalid){
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);          
       }else{
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        this.onSave(this.addForm.getRawValue());
      } 
    }
  /* 
    @Type: File, <ts>
    @Name: inputwithoutValidation function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
    inputwithoutValidation(value) {
      let careerSiteURL =this.addForm.get("careerSiteURL").value;
      if(careerSiteURL==''){
        this.careerSiteURLStatus=false;
      }else{
        this.careerSiteURLStatus=true;
      }
     this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      if(this.addForm.invalid===false){
         this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
         this.onSave(value);
      }
     }

    onProgresswithoutValidation(value,types){
        if(this.addForm.invalid){
         this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
         }else{
           this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
           this.onSave(this.addForm.getRawValue());
         } 
         
      }
   /* 
    @Type: File, <ts>
    @Name: onProgressCount function
    @Who: Nitin Bhati
    @When: 16-Dec-2021
    @Why: EWM-3759
    @What:for progress bar count
   */
    radiocountArray=[];
    onProgressCount(value,types){
       const index = this.radiocountArray.findIndex(x => x.types == types);
       if (index>= 0) {
       }
      else {
        this.radiocountArray.push({types});
        this.radiofilledCount=this.radiofilledCount+1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
       }
       //this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      if(this.addForm.invalid){
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
        }else{
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          this.onSave(this.addForm.getRawValue());
        } 
        
     }

     onProgressCountDecreased(value,types){
       const index = this.radiocountArray.findIndex(x => x.types == types);
       if (index>= 0) {
        this.radiocountArray.splice(index, 1);
        this.radiofilledCount=this.radiofilledCount-1;
        this.totalfilledCount=this.filledCount+this.radiofilledCount;
        this.totalFilledPercentage=(this.totalfilledCount*100/this.totalCount);
        this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
         }else{
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
         }
        
     }
    /* 
    @Type: File, <ts>
    @Name: openDialogforDescription function
    @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
    @What:Dialog for html Editor for description
   */
 openDialogforDescription() {
    const dialogRef = this.dialogObj.open(JobIndeedDescriptionComponent, {
      // maxWidth: "750px",
      data: { DescriptionData: this.DescriptionValue, },
      panelClass: ['xeople-modal-md', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(DescriptionData => {
      if (DescriptionData == ' ' || DescriptionData == '' ) {
        this.descriptionSatus=true;
        this.onProgressCountDecreased(this.addForm.value,'description'); 
       } else {
        this.descriptionSatus=false;
        this.addForm.patchValue({
          jobDescription: DescriptionData
        });
        this.DescriptionValue = DescriptionData;
        this.DescriptionValueUncheck = DescriptionData;
        this.onProgressCount(this.addForm.value,'description'); 
       // this.addForm.controls['jobDescription'].setErrors({ 'required': true });
      }
      // this.addForm.patchValue({
      //   jobDescription: DescriptionData
      // });
      // this.DescriptionValue = DescriptionData;
      // this.onProgressCount(this.addForm.value,'description');
     });
  } 

   /* 
    @Type: File, <ts>
    @Name: clickInformation function
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-4980
    @What:For open window for seek information
   */
    clickInformation(){
      window.open('https://talent.seek.com.au/support/productterms/');
    }
/*
     @Type: File, <ts>
     @Name: numberOnly
     @Who: Nitin Bhati
     @When: 09-March-2022
     @Why: EWM-5445
     @What: for number validation only
  */
     numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true; 
    }
  
 /* 
    @Type: File, <ts>
    @Name: ResetMaximumValue function
    @Who: Nitin Bhati
    @When: 31-March-2022
    @Why: EWM-6080
    @What:When we insert value under minimum then maximum value is empty
   */
     ResetMaximumValue(){
      this.addForm.get("SalaryRangeMaximum").reset();
     }
/*
     @Type: File, <ts>
     @Name: onPayLabelDetailsCheck
     @Who: Nitin Bhati
     @When: 04-Feb-2022
     @Why: EWM-4980
     @What: for showing pay label checklist
  */
     onPayLabelDetailsCheck(){
      let payLabelCheck =this.addForm.get("payLabelCheck").value;
       if(payLabelCheck==false){
         this.IsHidePayInformation=false;       
       }else{
         this.IsHidePayInformation=true;
     }
     }

  /* @Type: File, <ts>
     @Name: openMapAllicationFormModule Name
     @Who: Nitin Bhati
     @When: 20-Sep-2022
     @Why: EWM-8845
     @What: for open map application form
    */
    openMapAllicationFormModule(){
        const dialogRef = this.dialogObj.open(MapApplicationFormSeekComponent, {
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 desc: sending apllicationId in popup--------->
          data: { jobId: this.jobId,JobTitle:this.JobTitle,applicationFormName:this.applicationFormName, applicationFormId: this.applicationFormId },
          panelClass: ['xeople-modal-lg', 'add-assessment-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
        dialogRef.afterClosed().subscribe(resData => {          
         if (resData.res==true) {
          this.addForm.patchValue({
            applicationFormNameValue:resData.Name
          })
          this.applicationFormId=resData.Id;  
          this.applicationFormName=resData.Name;
          this.applicationFormNames=resData.Name;
          this.isHideChip = true
          this.onProgressCount(this.addForm.value,'ApplicationForm');
          // this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          // if(this.addForm.invalid===false){
          //   this.totalFilledPercentage=100;
          //   this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          //   this.onSave(this.addForm.getRawValue());
          //   }else{
          //     this.totalFilledPercentage=(this.totalfilledCount*100/5);
          //   } 

        } else{
          this.onProgressCountDecreased(this.addForm.value,'ApplicationForm');
          // this.isHideChip = false

        } 
          //this.inputwithoutValidation(this.addForm.value);

        })     
    }
    

    removeApplication(){
      this.addForm.patchValue({
        applicationFormNameValue:''
      });
      this.applicationFormName='';
      this.isHideChip = false;
      this.updateApplicationJobMapping();
      this.onProgressCountDecreased(this.addForm.value,'ApplicationForm');
      // this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      // if(this.addForm.invalid===false){
      //   this.totalFilledPercentage=100;
      //   this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      //   this.onSave(this.addForm.getRawValue());
      //   }else{
      //     this.totalFilledPercentage=(this.totalfilledCount*100/5);
      //   }  
    }
/*
    @Type: File, <ts>
    @Name: clearExpiryDate function
    @Who: bantee
    @When: 24-march-2024
    @Why: EWM-11177
    @What: For clear expiry  date 
     */

    clearExpiryDate(){
      this.addForm.patchValue({
        DateExpiry: null
      });
    }

/*
  @Name: ngOnDestroy
  @Who: Nitin Bhati
  @When: 05-06-2023
  @Why: EWM-12708
  @What: use for unsubsribe service
*/
ngOnDestroy() {
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
  }

/* 
 @Type: File, <ts>
 @Name: onJobcategorychange function
 @Who: Nitin Bhati
 @When: 09-11-2023
 @Why: EWM-15083
 @What: get JOb category List
 */
 onCategorychange(data) {
   if (data == null || data == "") {
     this.selectedCategory = null;
     this.addForm.patchValue(
       {
         category: null,
       }
     )
     }
   else {
     this.addForm.get("category").clearValidators();
     this.addForm.get("category").markAsPristine();
     this.selectedCategory = data;
     this.selectedCategoryList=[];
     this.selectedCategory?.forEach(element => {
      this.selectedCategoryList.push({
        'Id': element['Id'],
        'JobCategory': element['JobCategory'],
      });
    })
      this.addForm.patchValue(
       {
         category: data.Id,
       }
     )
    
   }
   if(this.addForm.invalid){
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    }else{
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } 
}
/* 
@Type: File, <ts>
@Name: onJobSalaryUnitchange function
@Who: Nitin Bhati
 @When: 09-11-2023
 @Why: EWM-15083
@What: get salary List
*/
onJobSalaryUnitchange(data) {
  if (data == 'null' || data == 'undefined' || data == "") {
    this.selectedSalaryUnit = null;
    this.addForm.get("PayType").reset();
    this.addForm.get("payTypeId").reset();
    this.addForm.patchValue(
      {
        PayType: null,
        payTypeId:null
      }
    )
    }
  else {
    this.addForm.get("PayType").clearValidators();
    this.addForm.get("PayType").markAsPristine();
    this.selectedSalaryUnit = data;
    this.addForm.patchValue(
      {
         PayType: data.Name,
         payTypeId:data.Id
      }
    );
  }
  if(this.addForm.invalid){
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    }else{
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } 
}

onExperiencechange(data) {
  this.selectedExperienceList=[];
  this.selectedExperience = null;
  if (data == null || data == "") {
    this.selectedExperience = null;
    this.addForm.patchValue(
      {
        experience: null
      }
    )
    }
  else {
    this.addForm.get("experience").clearValidators();
    this.addForm.get("experience").markAsPristine();
    this.selectedExperience = data;
     this.selectedExperienceList.push({
          'Id': data?.Id,
          'Name': data?.Name
        });
    this.addForm.patchValue(
      {
        experience: data.Name,
      }
    );
  }
  if(this.addForm.invalid){
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    }else{
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } 
}

clickCurrency(Id) {
  let currencySelection: any = [];
  currencySelection = this.currencyList.filter((e: any) => e.Id === Id);
  // this.CurrencyName=currencySelection[0].CurrencyName;
  // this.CurrencySymbol=currencySelection[0].Symbol;
  // this.quickJobForm.patchValue(
  //   {
  //     CurrencyName: currencySelection[0].CurrencyName,
  //     CurrencySymbol: currencySelection[0].Symbol,
  //   }
  // )
}
onQualificationchange(data) {
  if (data == null || data == "") {
    this.selectedQualification = null;
    this.addForm.patchValue(
      {
        education: null
      }
    )
    }
  else {
    this.addForm.get("education").clearValidators();
    this.addForm.get("education").markAsPristine();
   // this.selectedQualification=[];
    this.selectedQualification = data;
    this.selectedQualificationList=[];
    this.selectedQualification?.forEach(element => {
      this.selectedQualificationList.push({
        'Id': element['Id'],
        'QualificationName': element['QualificationName'],
      });
    })
     //this.selectedQualification = { Id: data.Id,QualificationName:data?.QualificationName};
    this.addForm.patchValue(
      {
        education: data.QualificationName,
      }
    )
  }
  if(this.addForm.invalid){
    this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
    }else{
      this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
      this.onSave(this.addForm.getRawValue());
    } 
  
}

copyJobApplicationUrl(jobApplicationUrl){ 
  this.isCoppied = true;
  setTimeout(() => {
    this.isCoppied = false;
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

copyCareerUrl(){ 
  let jobCareerUrl =this.addForm.get("careerSiteURL").value;
  this.isCoppiedCareerUrl = true;
  setTimeout(() => {
    this.isCoppiedCareerUrl = false;
  }, 3000);
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = jobCareerUrl;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

 /*
     @Type: File, <ts>
     @Name: addAddress
     @Who: Nitin Bhati
     @When: 06-March-2023
     @Why: Ewm-11009
     @What: To get Data from address of client
     */
     addAddress() {
       const dialogRef = this.dialogObj.open(QuickIndeedLocationComponent, {
      data: new Object({AutoFilldata:(this.addressData && this.addressData[0]),methodType:'Edit'}),
     panelClass: ['xeople-modal', 'add_canAddress', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res != null) {
       this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap);
       this.selectedValue = { 'Id': Number(res?.data?.CountryId),'CountryName': res?.data?.CountryName  };
         this.selectedState = { 'Id': Number(res?.data?.StateId), 'StateName': res?.data?.StateName};
         this.AddressLinkToMap = res?.data?.AddressLinkToMap;
         this.Latitude = res?.data?.Latitude;
         this.Longitude = res?.data?.Longitude;
         this.clientAddressList=res?.data;

         this.ClientLocationAddress=[];
         this.ClientLocationAddress.push({ 
           'AddressLine1': res?.data?.AddressLine1,
           'AddressLine2': res?.data?.AddressLine2,
           'AddressLinkToMap': res?.data?.AddressLinkToMap,
           'CountryId': res?.data?.CountryId,
           'CountryName': res?.data?.CountryName,
           'StateId': res?.data?.StateId,
           'StateName': res?.data?.StateName,
           'LocationId': res?.data?.AddressLine1,
           'Latitude': res?.data?.Latitude,
           'Longitude': res?.data?.Longitude,
           'PostalCode': res?.data?.PostalCode,
           'District_Suburb' :res?.data?.District_Suburb,
           'TownCity' : res?.data?.TownCity
         });

         this.addressData=[...this.ClientLocationAddress];

          this.addForm.patchValue({
         Address1: res?.data?.AddressLine1,
         Address2: res?.data?.AddressLine2,
         StateId: res?.data?.StateId,
         City: res?.data?.TownCity,
         ZipCode: res?.data?.PostalCode,
         Latitude:res?.data?.Latitude,
         Longitude:res?.data?.Longitude,
         District_Suburb:res?.data?.District_Suburb,
       });
            this.city=res?.data?.TownCity;
            this.state=res?.data?.StateName;
            this.stateId=res?.data?.StateId;
            this.country=res?.data?.CountryName;
            this.countryId=res?.data?.CountryId;
            this.postalCode=res?.data?.PostalCode;
            this.streetAddress=res?.data?.AddressLinkToMap;

            this.AddressLine1=res?.data?.AddressLine1;
            this.AddressLine2=res?.data?.AddressLine2;
            this.District_Suburb=res?.data?.District_Suburb;
            this.Latitude=res?.data?.Latitude;
            this.Longitude=res?.data?.Longitude;
           
             if(res?.data?.stateId==0 || res?.data?.StateName==null || res?.data?.StateName=="" || res?.data?.StateName==undefined || res?.data?.CountryName==null || res?.data?.CountryName==undefined || res?.data?.CountryName==""|| res?.data?.CountryId==0 || res?.data?.TownCity==null || res?.data?.TownCity=="" || res?.data?.TownCity==undefined){   
               this.locationStatus=true;  
                this.addForm.get("address").clearValidators();
                this.addForm.get("address").markAsPristine();
                this.addForm.get('address').setValidators([Validators.required]);
            }else{
              this.locationStatus=false;  
              this.onProgressCount(this.addForm.value,'location'); 
            }
            //this.onProgressCount(this.addForm.value,'location'); 
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
    getClientHoldingName(clientid,orgName) {
      this.jobService.getClientHoldingName('?clientId='+clientid).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.clientHoldingName=repsonsedata.Data?.ClientDetails?.HoldingCompany;
            // this.addForm.patchValue({
            //   clientHoldingName: repsonsedata.Data?.ClientDetails?.HoldingCompany
            // });
            
          }else if(repsonsedata.HttpStatusCode === 204){
            this.clientHoldingName=orgName;
            // this.addForm.patchValue({
            //   clientHoldingName:orgName
            // })
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          // this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

    getPostingIndeedDetails() {
      this.loading = true;
      this.PostingIndeedDetailsObs= this.jobService.getPostingIndeedDetails().subscribe(
         (repsonsedata: ResponceData) => {
           if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
             this.loading = false;
             if (repsonsedata.Data) {
                this.JobCount = repsonsedata.Data.JobCount;
                this.LastJobPostdate = repsonsedata.Data.LastJobPostdate;
                }
           } else {
             this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         })
     } 

  /*
     @Type: File, <ts>
     @Name: onSave
     @Who: Nitin Bhati
     @When: 13-Dec-2021
     @Why: EWM-3759
     @What: for posting seek data 
  */
     public onSave(value){
      this.jobPublishArray['jobType'] = 'indeed';
      this.jobPublishArray['indeedlogoURL'] = this.logoURL;
      this.jobPublishArray['JobCount'] = this.JobCount;
      this.jobPublishArray['LastJobPostdate'] = this.LastJobPostdate;
       const d = new Date(value.DateExpiry)
       if(this.PublishedOnIndeed===1){
        this.jobPublishArray['indeedId'] = this.indeedId;
       };
       this.jobPublishArray['experienceName']= value.experience;
      this.jobPublishArray['applicationFormName'] = this.applicationFormName;
      this.jobPublishArray['Published']=3;
      this.jobPublishArray['jobId'] = this.jobId;
      this.jobPublishArray['jobRefNo'] = this.JobReferenceId;
       this.jobPublishArray['job'] = {
        "clientName": this.clientName,
        "holdingCompany": this.clientHoldingName,
        "emailID":value.emailId,
        "applicationURL": value.applicationURL,
        "applicationFormName": this.applicationFormName,
        "applicationFormId":this.applicationFormId,
        "jobTittle": value.jobTitle,
        "city":this.city,
        "state": this.state,
        "stateId": this.stateId,
        "country":this.country,
        "countryId": this.countryId,
        "postalCode": this.postalCode,
        "streetAddress":this.streetAddress,
        "category": this.selectedCategory,
        "jobType": value.jobType,
        "jobExpiryDate":new Date(d?.getFullYear(), d?.getMonth(), d?.getDate(), d?.getHours(), d?.getMinutes() - d?.getTimezoneOffset())?.toISOString(),
        "currency":value.curency,
        "currencyId": value.currencyId,
        "payType": value.PayType,
        "payTypeId": value.payTypeId,
        "salaryMin": value.SalaryRangeMinimum==''?0:value.SalaryRangeMinimum,
        "salaryMax":value.SalaryRangeMaximum==''?0:value.SalaryRangeMaximum,
        "jobDescription": value.jobDescription,
        "isRemoteJob": value.remoteJob,
        "workplaceType":value.workplaceType,
        "experience": this.selectedExperience,
        "education": this.selectedQualificationList,
        "referenceNumber":this.JobReferenceId,
        "trackingUrl": value.careerSiteURL,
        "isHidePayInformation": value.payLabelCheck,
        "jobDetailsCheck": value.jobDetailsCheck,
        "AddressLine1": this.AddressLine1,
        "AddressLine2":this.AddressLine2,
        "DistrictSuburb": this.District_Suburb,
        "Latitude": this.Latitude,
        "Longitude": this.Longitude,
      }
      this.commonserviceService.onSeekJobPreviewSelectId.next(this.jobPublishArray);
     this.selectedIndex=2;
      }
     
      onJobSalarychange(data) {
         if (data == null || data == "") {
          this.selectedSalaryName = null;
          this.addForm.patchValue(
            {
              curency: null,
              currencyId: null
            }
          )
          }
        else {
          this.addForm.get("curency").clearValidators();
          this.addForm.get("curency").markAsPristine();
             this.addForm.patchValue(
            {
              curency: data.CurrencyName,
              currencyId: data.Id,
            }
          );
        }
        if(this.addForm.invalid){
          this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
          }else{
            this.commonserviceService.onSeekJobformValidSelectId.next(this.addForm.invalid);
            this.onSave(this.addForm.getRawValue());
          } 
     
      }   

    /*
   @Type: File, <ts>
   @Name: getEditIndeedJobPublishedDetailsById function
   @Who: Nitin Bhati
   @When: 23-March-2022
   @Why: EWM-5397
   @What: For getting record by id
  */
   getEditIndeedJobPublishedDetailsById(jobId: any) {
     this.editStatus=false;
    this.loading = true;
    this.isReadonly=true;
    this._SystemSettingService.getIndeedJobPublishedDetailsById('?JobID='+this.jobId).subscribe(
      (data: ResponceData) => {
        this.loading = true;
        if (data.HttpStatusCode === 200) {
          this.jobDataByIdEdit = data.Data;
          this.clientName=this.jobDataByIdEdit?.ClientName,
          this.clientHoldingName=this.jobDataByIdEdit?.HoldingCompany,
           //this.addForm.disable();
          this.addForm.patchValue({
            // clientName:this.jobDataByIdEdit?.ClientName,
            // clientHoldingName:this.jobDataByIdEdit?.HoldingCompany,
            emailId:this.jobDataByIdEdit?.EmailID,
            applicationFormNameValue:this.jobDataByIdEdit?.ApplicationFormName,
            applicationURL:this.jobDataByIdEdit?.ApplicationURL,
            careerSiteURL:this.jobDataByIdEdit?.TrackingUrl,
            jobTitle:this.jobDataByIdEdit?.JobTittle,
            AddressLinkToMap:this.jobDataByIdEdit?.StreetAddress,
            category:this.jobDataByIdEdit?.JobCategories,
            jobType:this.jobDataByIdEdit?.JobType,
            DateExpiry:new Date(this.jobDataByIdEdit?.JobExpiryDate),
            curency:this.jobDataByIdEdit?.Currency,
            currencyId:this.jobDataByIdEdit?.CurrencyId,
            PayType:this.jobDataByIdEdit?.PayType,
            payTypeId:this.jobDataByIdEdit?.PayTypeId,
            SalaryRangeMinimum:this.jobDataByIdEdit?.SalaryMin=='0'?'':this.jobDataByIdEdit?.SalaryMin,
            SalaryRangeMaximum:this.jobDataByIdEdit?.SalaryMax=='0'?'':this.jobDataByIdEdit?.SalaryMax,
            jobDescription:this.jobDataByIdEdit?.JobDescription,
            remoteJob:this.jobDataByIdEdit?.IsRemoteJob,
            payLabelCheck:this.jobDataById?.IsHidePayInformation==1?true:false,
            experience:this.jobDataByIdEdit?.JobExperience,
            education:this.jobDataByIdEdit?.JobEducations,
            jobDetailsCheck:this.jobDataByIdEdit?.JobDescriptionCheck==1?true:false
          });
          if(this.jobDataByIdEdit?.TrackingUrl==''){
            this.careerSiteURLStatus=false;
          }else{
            this.careerSiteURLStatus=true;
          }
          this.clientName=this.jobDataByIdEdit?.ClientName,
          this.clientHoldingName=this.jobDataByIdEdit?.HoldingCompany,
          this.emailId=this.jobDataByIdEdit?.EmailID,
          this.dateMax = this.jobDataByIdEdit?.JobExpiryDate;
           this.dateStartMax = this.jobDataByIdEdit?.JobExpiryDate;
          this.JobReferenceId=this.jobDataByIdEdit?.JobRefNo;
          this.JobTitle=this.jobDataByIdEdit?.JobTittle,
          this.indeedId=this.jobDataByIdEdit?.Id;
          this.DescriptionValue=this.jobDataByIdEdit?.JobDescription;
          this.applicationFormName=this.jobDataByIdEdit?.ApplicationFormName;
          this.applicationFormId=this.jobDataByIdEdit?.ApplicationFormId;
          this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(this.jobDataByIdEdit?.StreetAddress);
           this.IsHidePayInformation=this.jobDataByIdEdit?.IsHidePayInformation==1?true:false;

         // this.selectedCategory = this.jobDataByIdEdit?.JobCategories;
          //this.selectedQualification=this.jobDataByIdEdit?.JobEducations;
         // this.selectedExperience = this.jobDataByIdEdit?.JobExperience;
          this.selectedCategory=[];
          this.jobDataByIdEdit?.JobCategories?.forEach(element => {
            this.selectedCategory.push({
              'Id': element['Id'],
              'JobCategory': element['JobCategory'],
            });
          });
           this.selectedQualificationList=[];
          this.jobDataByIdEdit?.JobEducations?.forEach(element => {
            this.selectedQualificationList.push({
              'Id': element['Id'],
              'QualificationName': element['QualificationName'],
            });
          });
          this.selectedQualification = [...this.selectedQualificationList];
          if(this.jobDataByIdEdit?.IsRemoteJob===1){
            this.remoteTypeValue=true;
            this.addForm.patchValue(
              {
                workplaceType: this.jobDataByIdEdit?.WorkplaceType,
              })
          }else{
            this.remoteTypeValue=false;
          }
          // this.selectedCategoryList=[...this.selectedCategory];
          // this.selectedQualificationList=[...this.selectedQualification];
             this.selectedSalaryName = { Id: this.jobDataByIdEdit?.CurrencyId,CurrencyName:this.jobDataByIdEdit?.Currency};     
             this.selectedSalaryUnit = { Id: this.jobDataByIdEdit?.PayTypeId,Name:this.jobDataByIdEdit?.PayType}; 
            this.selectedExperience = { Id: this.jobDataByIdEdit?.JobExperience[0]?.Id,Name:this.jobDataByIdEdit?.JobExperience[0]?.Name};
            // this.selectedExperienceList = { Id: this.jobDataByIdEdit?.JobExperience[0]?.Id,Name:this.jobDataByIdEdit?.JobExperience[0]?.Name};
            this.city=this.jobDataByIdEdit?.City;
            this.state=this.jobDataByIdEdit?.State;
            this.stateId=this.jobDataByIdEdit?.StateId;
            this.country=this.jobDataByIdEdit?.Country;
            this.countryId=this.jobDataByIdEdit?.CountryId;
            this.postalCode=this.jobDataByIdEdit?.PostalCode;
            this.streetAddress=this.jobDataByIdEdit?.StreetAddress;
            this.AddressLine1=this.jobDataByIdEdit?.AddressLine1;
            this.AddressLine2=this.jobDataByIdEdit?.AddressLine2;
            this.District_Suburb=this.jobDataByIdEdit?.DistrictSuburb;
            this.Latitude=this.jobDataByIdEdit?.Latitude;
            this.Longitude=this.jobDataByIdEdit?.Longitude;
            this.ClientLocationAddress=[];
            this.ClientLocationAddress.push({  /*-@why:EWM-14693,@when:12-10-2023,@who:Nitin Bhati-*/
              'AddressLine1': this.jobDataByIdEdit?.AddressLine1,
              'AddressLine2': this.jobDataByIdEdit?.AddressLine2,
              'AddressLinkToMap': this.jobDataByIdEdit?.StreetAddress,
              'CountryId': this.jobDataByIdEdit?.CountryId,
              'CountryName': this.jobDataByIdEdit?.Country,
              'StateId': this.jobDataByIdEdit?.StateId,
              'StateName': this.jobDataByIdEdit?.State,
              'LocationId': this.jobDataByIdEdit?.StateId,
              'Latitude': this.jobDataByIdEdit?.Latitude,
              'Longitude': this.jobDataByIdEdit?.Longitude,
              'PostalCode': this.jobDataByIdEdit?.PostalCode,
              'District_Suburb' :this.jobDataByIdEdit?.DistrictSuburb,
              'TownCity' : this.jobDataByIdEdit?.City
            });
           this.addressData=[...this.ClientLocationAddress];
           this.input(this.addForm.getRawValue());
           this.onProgressCount(this.addForm.value,'location'); 
           this.onProgressCount(this.addForm.value,'description'); 
           this.onProgressCount(this.addForm.value,'ApplicationForm'); 
          //  this.addForm.controls["clientName"].disable();
          //  this.addForm.controls["clientHoldingName"].disable(); 
           //this.addForm.controls["emailId"].disable();
           this.addForm.controls["applicationFormNameValue"].disable();
         
          this.loading = false;
          }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }  

   updateApplicationJobMapping() {
    //this.loading = true;
    let obj = {};
    obj['JobId'] = this.jobId;
    obj['JobTitle'] = this.JobTitle;
    obj['ApplicationFormId'] = 0;
    obj['ApplicationFormName'] = '';
    this.jobService.updateApplicationJobMappingToJob(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
         // this.loading = false;
          //this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        //this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

}
