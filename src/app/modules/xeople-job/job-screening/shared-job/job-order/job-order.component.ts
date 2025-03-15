import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { DRP_CONFIG } from '../../../../../shared/models/common-dropdown';
import { Subject } from 'rxjs';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { PushCandidateEOHService } from '../../../../EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { ResponceData } from '../../../../../shared/models/responce.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
import { shareClientJSON } from '@app/modules/EWM.core/client/client-detail/share-client-eoh/share-client-model';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import * as moment from 'moment';
import { CommonserviceService } from '../../../../../shared/services/commonservice/commonservice.service';
import { JobOrderShare } from '../../../../../shared/enums/job-detail.enum';
import { JobService } from '../../../../EWM.core/shared/services/Job/job.service';

@Component({
  selector: 'app-job-order',
  templateUrl: './job-order.component.html',
  styleUrls: ['./job-order.component.scss']
})
export class JobOrderComponent implements OnInit {

  
  @Input() tabIndex: number; // Optional input for tab index
  @Output() onBackBtn = new EventEmitter<any>(); // Output to emit submitted form data
  shareJobOrderForm: FormGroup;
  eohRegistrationCode: string;
  EOHIntegrationObj: any;
  IsEOHIntergrated: any;
  Office_Dropdown_Config: DRP_CONFIG;
  resetOfficeDrp: Subject<any> = new Subject<any>();
  public selectedOffice:any={};
  public selectedShift:any={};
  dropdownInitilize:boolean = false;
  public loading: boolean=false;
  searchVal: string='';
  searchSubject$ = new Subject<any>();
  resetPriorityDrp: Subject<any> = new Subject<any>();
  public selectedPriority:any={};
  resetQualDrp: Subject<any> = new Subject<any>();
  resetShiftDrp: Subject<any> = new Subject<any>();
  public selectedQual:any={};
  ClientAdmin_Dropdown_Config: DRP_CONFIG;
  resetClientAdminDrp: Subject<any> = new Subject<any>();
  public selectedClientAdmin:any={};
  isResponseGet: boolean=false;
  brandAppSetting: any=[];
  EOHLogo: any;
  title: string;
  today = new Date();
  public TimeStartValue: any;
  public TimeEndValue: any;
  public gridTimeZone: any[];
  isMinTimeCondotion: boolean = false;
  isEndTmeRequired: boolean = false;
  isStartTmeRequired: boolean = false;
  maxMessage: number = 200;
  @Input() assignMember:any;
  Shift_Dropdown_Config: DRP_CONFIG;
  Qualification_Dropdown_Config: DRP_CONFIG;
  EOHClientId: string;
  endDay: Date;

  constructor(private fb: FormBuilder,private appSettingsService: AppSettingsService,private clientService:ClientService,
    private serviceListClass: ServiceListClass,private pushCandidateEOHService: PushCandidateEOHService, private snackBService: SnackBarService,
  public dialogRef: MatDialogRef<JobOrderComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private translateService: TranslateService,
  private commonServiesService: CommonserviceService,private _jobService:JobService) {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    let FirstName = currentUser?.FirstName;
    let LastName = currentUser?.LastName;
    this.shareJobOrderForm = this.fb.group({
      CandidateId:[this.data?.candidateId],
      locationName: [{ value: this.data?.ClientName, disabled: true }, Validators.required],
      locationId: [{ value: this.data?.savedClientId, disabled: true }, Validators.required],
      Qualification: ['', Validators.required],
      QualificationId: [],
      ShiftType: [null, Validators.required],
      ShiftTypeId: [],
      MemberName: [{ value: this.data?.clientName, disabled: true }, Validators.required],
      MemberId:[],
      AssignCandidateMember: ['', Validators.required],
      ContactPerson: [{value:FirstName+' '+LastName,disabled:true}, Validators.required],
      DateFrom:[this.today,[Validators.required,CustomValidatorService.dateValidator]],
      DateTo:[this.today,[Validators.required,CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      TimeEnd: [null, [Validators.required]],
      Notes: ['',[Validators.maxLength(200)]],
      ServicingOffice:[null,[Validators.required]],
      ServicingOfficeId:[]

    });
    
    this.title=data.dialogData?.title;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
   }

  ngOnInit(): void {
    let currentDate = new Date();
    let nowTime = new Date(currentDate.getTime());
    this.TimeStartValue = new Date(nowTime.setHours(9, 0, 0, 0));
    this.TimeEndValue = new Date(nowTime.setHours(17, 0, 0, 0));
    this.shareJobOrderForm.patchValue(
      {
        ServiceLocation:this.assignMember,
        AssignCandidateMember:this.assignMember,
      });
    this.shareJobOrderForm.get('ServiceLocation')?.disable();
    this.shareJobOrderForm.get('AssignCandidateMember')?.disable();
    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople);
    this.EOHLogo=filteredBrands[0]?.logo;
    this.commonServiesService.ClientIdEOH$.subscribe(val=>{
      this.EOHClientId=val;
    })
    this.selectedShift={'Id':'AM'}
    this.dropdownConfig();
  }

  /* @Name: dropdownConfig @Who:  Renu @When: 18-Feb-2024 @Why: EWM-19576 EWM-19552 @What: dropdown Configuration*/
  dropdownConfig(){
  
    //Qualification dropdown config
    this.Qualification_Dropdown_Config = {
      API: this.serviceListClass.getJobQualificationEOH+'?eohClientId='+this.EOHClientId,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_ShareJobOrder_RoleQualification',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:false
    }

    //Shift dropdown config
    this.Shift_Dropdown_Config = {
      API: this.serviceListClass.getJobShiftTypeEOH+'?eohClientId='+this.EOHClientId,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_ShareJobOrder_ShiftType',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:false
    }
   
  //Office dropdown config
  this.Office_Dropdown_Config = {
    API: this.serviceListClass.getOfficeList,
    MANAGE: '',
    BINDBY: 'OfficeName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_shareClient_ServicingOffice',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'OfficeID',
    ONLOAD_ERROR_SHOW:false
  }


  }

  getAllEOHDropdownList(){
    const params = {
      
    };
  this.clientService.getAllClientEOHShareData(params).subscribe(
    (data) => {
      console.log('All data fetched:', data);
      // Process the data as needed
    },
    (error) => {
      console.error('Error fetching data:', error);
    }
  );
}
  submitForm() {
    console.log("djdjd",this.shareJobOrderForm)
    this.isResponseGet=true;
    const formData:JobOrderShare= {
      BookingNotes: this.shareJobOrderForm.get('Notes')?.value,
      ContactPersonName: this.shareJobOrderForm.get('ContactPerson')?.value,
      EndTime: this.shareJobOrderForm.get('TimeEnd')?.value,
      StartTime: this.shareJobOrderForm.get('TimeStart')?.value,
      ShiftType: this.shareJobOrderForm.get('ShiftTypeId')?.value,
      To: this.shareJobOrderForm.get('DateTo')?.value,
      From: this.shareJobOrderForm.get('DateFrom')?.value,
      Qualification: this.shareJobOrderForm.get('Qualification')?.value,
      QualificationCode: this.shareJobOrderForm.get('QualificationId')?.value,
      MemberName: this.data?.candidateName,
      MemberId: this.data?.CandidateId,
      CandidateId: this.shareJobOrderForm.get('CandidateId')?.value,
      ServicingOfficeId: this.shareJobOrderForm.get('ServicingOfficeId')?.value,
      ServicingOffice: this.shareJobOrderForm.get('ServicingOffice')?.value,
      ServiceLocation: this.shareJobOrderForm.get('locationName')?.value,
      ServiceLocationId: this.EOHClientId,
      ClientId: this.data?.savedClientId,
      JobId: this.data?.JobId,
      JobTitle: this.data?.JobTitle
    };

                this._jobService.shareJobEOH(formData).subscribe(
                (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                  this.shareJobOrderForm.reset();
                  document.getElementsByClassName("share-job-to-eoh-modal")[0].classList.remove("animate__fadeInDownBig")
                  document.getElementsByClassName("share-job-to-eoh-modal")[0].classList.add("animate__fadeOutUpBig");
                  setTimeout(() => { this.dialogRef.close(true); }, 200);
                this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                this.loading = false;
                this.isResponseGet=false;
                }
                else if (data.HttpStatusCode === 204) {
                  this.isResponseGet=false;
                this.loading = false;
                }else if(data.HttpStatusCode === 402){
                  this.isResponseGet=false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(data?.Message), data.HttpStatusCode);
                this.loading = false;
                }else if(data.HttpStatusCode === 400){
                  this.isResponseGet=false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(data?.Message), data.HttpStatusCode);
                }
                else {
                  this.isResponseGet=false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
                this.loading = false;
                }
                }, err => {
                this.loading = false;
                this.isResponseGet=false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                });
  }

  onBack(){
    this.onBackBtn.emit(3);
  }

     /* @Name: onOfficechange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of Office*/
     onOfficechange(data){
      if (data == null || data == "" || data.length == 0) {
        this.selectedOffice = null;
        this.shareJobOrderForm.patchValue(
          {
            ServicingOffice:null,
            ServicingOfficeId:null
          });
      }
      else {
        this.selectedOffice = data;
        this.shareJobOrderForm.patchValue({
          ServicingOffice: data?.OfficeName,
          ServicingOfficeId:data?.OfficeID 
        });
      }
    }

   
    getInputVal(e) {
      this.searchSubject$.next(e);
    }

    

 /* @Name: onPrioritychange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of Priority*/
       onPrioritychange(data){
      if (data == null || data == "" || data.length == 0) {
        this.selectedPriority = null;
        this.shareJobOrderForm.patchValue(
          {
            Priority:null,
            PriorityId:null
          });
      }
      else {
        this.selectedPriority = data;
        this.shareJobOrderForm.patchValue({
          Priority: data?.Name,
          PriorityId:data?.Id
        });
      }
    }

    /* @Name: onQualchange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of qaulification*/
    onQualchange(data){
    
      if (data == null || data == "" || data.length == 0) {
        this.selectedQual = null;
        this.shareJobOrderForm.patchValue(
          {
            Qualification:null,
            QualificationId:null
          });
      }
      else {
        this.selectedQual = data;
        this.shareJobOrderForm.patchValue({
          Qualification: data?.Name,
          QualificationId:data?.Id
        });
      }
    }

/* @Name: onCheckedEOHClient @Who:  Renu @When: 19-02-2025 @Why: EWM-19576 EWM-19552 @What:when EOH CLIENT (ADmin) checkbox status change*/
 onCheckedEOHClient($event){
  if($event.checked){
    this.ClientAdmin_Dropdown_Config.API = this.serviceListClass.getEOHClient;
    this.ClientAdmin_Dropdown_Config.DISABLED=false; 
    this.resetClientAdminDrp.next(this.ClientAdmin_Dropdown_Config);
    this.shareJobOrderForm.get('parentClient')?.setValidators([Validators.required]);
    this.shareJobOrderForm.get('parentClient')?.updateValueAndValidity();
  }else{
    this.selectedClientAdmin=null;
    this.ClientAdmin_Dropdown_Config.API = '';
    this.ClientAdmin_Dropdown_Config.DISABLED=true; 
    this.resetClientAdminDrp.next(this.ClientAdmin_Dropdown_Config);
    this.shareJobOrderForm.get('parentClient')?.clearValidators();
    this.shareJobOrderForm.get('parentClient')?.updateValueAndValidity();
  }
}

/* @Name: onClientAdminChange @Who:  Renu @When: 19-02-2025 @Why: EWM-19576 EWM-19552 @What:when client eoh (admin only) value changes*/

onClientAdminChange(data: any | null){
  if (data == null || data == "" || data.length == 0) {
    this.selectedClientAdmin = null;
    this.shareJobOrderForm.patchValue(
      {
        parentClient:null,
        parentClientId:null
      });
  }
  else {
    this.selectedClientAdmin = data;
    this.shareJobOrderForm.patchValue({
      parentClient: data?.ClientName,
      parentClientId:data?.ClientId 
    });
  }
}

onDismiss() {
  document.getElementsByClassName("share-client-eoh")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("share-client-eoh")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}


handleChangeStartTime(e: any) {
  if(e==null){
    return false;
  }
  //this.TimeStartValue = e;
  /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
  let date = new Date(e);
  let mnth: any = ("0" + (date.getMonth() + 1)).slice(-2);
  let day: any = ("0" + date.getDate()).slice(-2);
  //const dateEnd = new Date(Date.now() + 10 * 60 * 1000) 
  let DateEnd = this.appSettingsService.getUtcDateFormat([date.getFullYear(), mnth, day].join("-"));

  // let startTime = value.TimeStart.split(":");
  this.TimeStartValue = new Date(date.getFullYear(), mnth, day, date.getHours(), date.getMinutes(), 0);
  this.TimeEndValue = new Date(date.getFullYear(), mnth, day, date.getHours() + 1, date.getMinutes(), 0);

  this.shareJobOrderForm.patchValue({
    TimeStart: new Date(this.TimeStartValue).toString().slice(16, 21),
    TimeEnd: new Date(this.TimeEndValue).toString().slice(16, 21),
  });
  /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
 this.isStartTmeRequired = false;
  this.onChangeEndTime();
}
/*
@Type: File, <ts>
@Name: onChangeEndTime()
@Who: renu
@When: 17-mar-2023
@Why:EWM-11055 EWM-11093 
@What: change time
*/
onChangeEndTime() {
  let getStartTimeHM: any = new Date(this.TimeStartValue).toString().slice(16, 21);
  let getEndTimeHM: any = new Date(this.TimeEndValue).toString().slice(16, 21);
  let local_startDate = moment.utc(this.shareJobOrderForm.get("DateStart").value).local().format('YYYY-MM-DD');
  let local_endDate = moment.utc(this.shareJobOrderForm.get("DateEnd").value).local().format('YYYY-MM-DD');
  if (local_startDate == local_endDate) {
    const date1 = new Date('2023-01-01 ' + getStartTimeHM);
    const date2 = new Date('2023-01-01 ' + getEndTimeHM);
    if (date2.getTime() > date1.getTime()) {
      this.isMinTimeCondotion = false;
    }
    else {
      this.isMinTimeCondotion = true;
    }
  } else {
    this.isMinTimeCondotion = false;
  }
 
  this.isEndTmeRequired = false;
}

handleChangeEndTime(e: any) {
  this.TimeEndValue = e;
  this.onChangeEndTime();
}

public onMessage(value: any) {
  if (value != undefined && value != null) {
    this.maxMessage = 200 - value?.length;
  }
  if(value?.length>200){
    this.shareJobOrderForm.get('Notes')?.markAsTouched();
    this.shareJobOrderForm.get('Notes')?.setErrors({maxlength:true});
  }
}

/* @Name: onShiftchange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of Shift*/
onShiftchange(data){
  if (data == null || data == "" || data.length == 0) {
    this.selectedShift = null;
    this.shareJobOrderForm.patchValue(
      {
        ShiftType:null,
        ShiftTypeId:null
      });
  }
  else {
    this.selectedShift = data;
    this.TimeStartValue = this.convertToDate(data.StartTime)
    this.TimeEndValue = this.convertToDate(data.EndTime);
    
    this.shareJobOrderForm.patchValue({
      ShiftType: data?.Name,
      ShiftTypeId:data?.Id,
      TimeStart:new Date(this.TimeStartValue).toString().slice(16, 21),
      TimeEnd: new Date(this.TimeEndValue).toString().slice(16, 21)
    });
  }
}

convertToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

inputEventStart(startDate) {
   if(startDate){
    this.endDay = new Date(startDate);
    this.endDay.setDate(this.endDay.getDate()+1);}
}

}


