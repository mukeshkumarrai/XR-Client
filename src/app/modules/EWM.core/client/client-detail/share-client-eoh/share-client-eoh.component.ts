import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { ClientService } from '../../../shared/services/client/client.service';
import { DRP_CONFIG } from '../../../../../shared/models/common-dropdown';
import { Subject, Subscription } from 'rxjs';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { PushCandidateEOHService } from '../../../../EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { ResponceData } from '../../../../../shared/models/responce.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ButtonConfig, ClientBtnDetails, shareClientJSON } from './share-client-model';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonService } from '../../../../../shared/services/button-service/button.service';
import { RouterData } from '../../../../../shared/enums/router.enum';

@Component({
  selector: 'app-share-client-eoh',
  templateUrl: './share-client-eoh.component.html',
  styleUrls: ['./share-client-eoh.component.scss']
})
export class ShareClientEohComponent implements OnInit {
  ClientBtnDetails = ClientBtnDetails;
  
  @Input() tabIndex: number; // Optional input for tab index
  @Output() onClientSubmit = new EventEmitter<any>(); // Output to emit submitted form data
  shareClientForm: FormGroup;
  eohRegistrationCode: string;
  EOHIntegrationObj: any;
  IsEOHIntergrated: any;
  Office_Dropdown_Config: DRP_CONFIG;
  resetOfficeDrp: Subject<any> = new Subject<any>();
  public selectedOffice:any={};
  dropdownInitilize:boolean = false;
  public loading: boolean=false;
  Industry_Dropdown_Config: DRP_CONFIG;
  resetIndustryDrp: Subject<any> = new Subject<any>();
  public selectedIndustry:any={};
  IndustryList:[]=[];
  searchVal: string='';
  searchSubject$ = new Subject<any>();
  Priority_Dropdown_Config: DRP_CONFIG;
  resetPriorityDrp: Subject<any> = new Subject<any>();
  public selectedPriority:any={};
  Status_Dropdown_Config: DRP_CONFIG;
  resetStatusDrp: Subject<any> = new Subject<any>();
  public selectedStatus:any={};
  ClientAdmin_Dropdown_Config: DRP_CONFIG;
  resetClientAdminDrp: Subject<any> = new Subject<any>();
  public selectedClientAdmin:any={};
  isResponseGet: boolean=false;
  brandAppSetting: any=[];
  EOHLogo: any;
  title: string;
  savedClientId: string;
  @Input() IsOpenFor: any;
  btnSubscription: Subscription;
  //buttonConfigs: { CANCEL: ButtonConfig; SAVE_AND_NEXT: ButtonConfig; SHARE_CLIENT: ButtonConfig; };
  @Input() hideHeader: boolean = false; 
  buttonVisibility: { [key in ClientBtnDetails]: ButtonConfig };


  constructor(private fb: FormBuilder,private appSettingsService: AppSettingsService,private clientService:ClientService,
    private serviceListClass: ServiceListClass,private pushCandidateEOHService: PushCandidateEOHService, private snackBService: SnackBarService,
   public dialogRef: MatDialogRef<ShareClientEohComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private translateService: TranslateService,
   private buttonService:ButtonService) {
    console.log("hideHeader",this.hideHeader)
    this.savedClientId=this.data?.savedClientId;
    this.shareClientForm = this.fb.group({
      locationName: [{ value: this.data?.ClientName, disabled: true }, Validators.required], // Prefilled & non-editable
      locationId: [{ value: this.data?.clientId, disabled: true }, Validators.required], // Prefilled & non-editable
      locationType: [{ value: 'Admin and Service', disabled: true }, Validators.required], // Non-editable
      IndustryType: ['', Validators.required],
      IndustryTypeId: [],
      servicingOffice: ['', Validators.required],
      servicingOfficeId: [],
      Priority: ['', Validators.required],
      PriorityId: [],
      StatusId:[],
      Status: [],
      fetchParentClient: [false],
      parentClient:[],
      parentClientId:[]
      // parentClient: [{ value: '', disabled: true }], // Disabled initially
      // parentClientId: [{ value: '', disabled: true }] // Disabled initially
    });
    this.dropdownConfig();
    this.title=data.dialogData?.title;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
   }

  ngOnInit(): void {
 this.getIndustryInfo(50,this.searchVal);
    this.searchSubject$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.searchVal=value;
      this.getIndustryInfo(200,value);
    });
    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople);
    this.EOHLogo=filteredBrands[0]?.logo;
    this.btnSubscription=this.buttonService.buttonVisibility$.subscribe(configs => {
     // this.buttonConfigs = configs;
      this.buttonVisibility = this.buttonService.getButtonVisibility('Share-Client');
      console.log("this.buttonVisibility",this.buttonVisibility);
    });
    
  }

  /* @Name: dropdownConfig @Who:  Renu @When: 18-Feb-2024 @Why: EWM-19576 EWM-19552 @What: dropdown Configuration*/
  dropdownConfig(){
  
    //Status dropdown config
    this.Status_Dropdown_Config = {
      API: this.serviceListClass.getEOHStatus,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_shareClient_Status',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:false
    }

    //Priority dropdown config
    this.Priority_Dropdown_Config = {
      API: this.serviceListClass.getEOHPriority,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_shareClient_Priority',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:false
    }
    //Industry dropdown config
    this.Industry_Dropdown_Config = {
      API: this.serviceListClass.getIndustryList,
      MANAGE: '',
      BINDBY: 'IndustryName',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_industry',
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

  this.ClientAdmin_Dropdown_Config = {
    API: '',
    MANAGE: '',
    BINDBY: 'ClientName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_shareClient_ClientAdminOnly',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'ClientId'
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
    this.isResponseGet=true;
    if (!this.shareClientForm.valid) {
      return;
    }
    const router = RouterData.clientSummery;
    const baseUrl = window.location.origin;
    const formData :shareClientJSON= {
      ClientId: this.shareClientForm.get('locationId')?.value??this.savedClientId,
      LocationType: this.shareClientForm.get('locationType')?.value,
      ServicingOfficeId: this.shareClientForm.get('servicingOfficeId')?.value,
      ServicingOffice: this.shareClientForm.get('servicingOffice')?.value,
      LocationName: this.shareClientForm.get('locationName')?.value,
      PriorityId: this.shareClientForm.get('PriorityId')?.value,
      Priority: this.shareClientForm.get('Priority')?.value,
      StatusId: this.shareClientForm.get('StatusId')?.value,
      Status: this.shareClientForm.get('Status')?.value,
      IndustryId: this.shareClientForm.get('IndustryTypeId')?.value,
      Industry: this.shareClientForm.get('IndustryType')?.value,
      ParentId: this.shareClientForm.get('parentClientId')?.value,
      ParentName: this.shareClientForm.get('parentClient')?.value,
      ShareClientURL:baseUrl+router
    };
    
       this.clientService.shareClientTOEOH(formData).subscribe(
                (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                  this.shareClientForm.reset();
                  this.loading = false;
                  this.isResponseGet=false;
                  if(this.buttonVisibility[ClientBtnDetails.SAVE_AND_NEXT].visible){
                    this.onClientSubmit.emit(1);
                    return;
                   }
                  document.getElementsByClassName("share-client-eoh")[0]?.classList.remove("animate__fadeInDownBig")
                  document.getElementsByClassName("share-client-eoh")[0]?.classList.add("animate__fadeOutUpBig");
                  setTimeout(() => { this.dialogRef.close(true); }, 200);
                this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              
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


  onCancel(){
    document?.getElementsByClassName("share-client-eoh")[0]?.classList?.remove("animate__zoomIn")
    document?.getElementsByClassName("share-client-eoh")[0]?.classList?.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef?.close(false); }, 200);
  }
  

  /* @When: 04-03-2025 @who:Amit @why: EWM-19681 @what: industry dropdown clear */
  public Clear() {
    this.searchVal = '';
    this.getIndustryInfo(50, this.searchVal);
  }

  /* @Name: onIndustrychange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: get default value of industry*/
  onIndustrychange(data){
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;
      this.shareClientForm.patchValue(
        {
          IndustryType:null,
          IndustryTypeId:null
        });
    }
    else {
      let  selectedIndustryId = data.IndustryID;
      this.selectedIndustry = data;
      this.shareClientForm.patchValue({
        IndustryType: data?.IndustryName,
        IndustryTypeId:selectedIndustryId
      });
    }
  }

     /* @Name: onOfficechange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of Office*/
     onOfficechange(data){
      if (data == null || data == "" || data.length == 0) {
        this.selectedOffice = null;
        this.shareClientForm.patchValue(
          {
            servicingOffice:null,
            servicingOfficeId:null
          });
      }
      else {
        this.selectedOffice = data;
        this.shareClientForm.patchValue({
          servicingOffice: data?.OfficeName,
          servicingOfficeId:data?.OfficeID 
        });
      }
    }

    refreshAPI() {
      this.searchVal = '';
      this.getIndustryInfo(50,this.searchVal,this.selectedIndustry);
    }
    getInputVal(e) {
      this.searchSubject$.next(e);
    }

     /* @Name: getIndustryInfo @Who:  Renu @When: 18-FEB-2025 @Why: EWM-19576 EWM-19552 @What: get industry Information*/
      getIndustryInfo(pageSize: number,searchVal: string,selectedIndustry ?: any) {
        this.pushCandidateEOHService.getEOHIndustryMaster(pageSize,searchVal).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
              this.IndustryList=data?.Data?.IndustryList;
              if(selectedIndustry){
                this.selectedIndustry=selectedIndustry;
              }
              else
              this.selectedIndustry=data?.Data?.DefaultIndustry;
          
              this.shareClientForm.patchValue({'IndustryTypeId': this.selectedIndustry?.IndustryID,'IndustryType': this.selectedIndustry?.IndustryName});
            }
            else {
              //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
           // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          });
      }

 /* @Name: onPrioritychange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of Priority*/
       onPrioritychange(data){
      if (data == null || data == "" || data.length == 0) {
        this.selectedPriority = null;
        this.shareClientForm.patchValue(
          {
            Priority:null,
            PriorityId:null
          });
      }
      else {
        this.selectedPriority = data;
        this.shareClientForm.patchValue({
          Priority: data?.Name,
          PriorityId:data?.Id
        });
      }
    }

    /* @Name: onStatuschange @Who:  Renu @When: 18-Feb-2025 @Why: EWM-19576 EWM-19552 @What: get default value of Status*/
    onStatuschange(data){
    
      if (data == null || data == "" || data.length == 0) {
        this.selectedStatus = null;
        this.shareClientForm.patchValue(
          {
            Status:null,
            StatusId:null
          });
      }
      else {
        this.selectedStatus = data;
        this.shareClientForm.patchValue({
          Status: data?.Id,
          StatusId:data?.Name
        });
      }
    }

/* @Name: onCheckedEOHClient @Who:  Renu @When: 19-02-2025 @Why: EWM-19576 EWM-19552 @What:when EOH CLIENT (ADmin) checkbox status change*/
 onCheckedEOHClient($event){
  if($event.checked){
    this.ClientAdmin_Dropdown_Config.REQUIRED=true;
    this.ClientAdmin_Dropdown_Config.API = this.serviceListClass.getEOHClient;
    //this.ClientAdmin_Dropdown_Config.DISABLED=false; 
    this.resetClientAdminDrp.next(this.ClientAdmin_Dropdown_Config);
    this.shareClientForm.get('parentClient')?.setValidators([Validators.required]);
    this.shareClientForm.get('parentClient')?.updateValueAndValidity();

    setTimeout(() => {
      const dialogContent = document.querySelector('.share-dialog-content');
      if (dialogContent) {
        dialogContent.scrollTo({
          top: dialogContent.scrollHeight,
          behavior: 'smooth'  // This adds smooth scrolling
        });
      }
    }, 100);

    console.log(" this.shareClientForm", this.shareClientForm);
  }else{
    this.ClientAdmin_Dropdown_Config.REQUIRED=false;
    this.shareClientForm.patchValue(
      {
        parentClient:null,
        parentClientId:null
      });
    this.selectedClientAdmin=null;
    this.ClientAdmin_Dropdown_Config.API = '';
    //this.ClientAdmin_Dropdown_Config.DISABLED=true; 
    this.resetClientAdminDrp.next(this.ClientAdmin_Dropdown_Config);
    this.shareClientForm.get('parentClient')?.clearValidators();
    this.shareClientForm.get('parentClient')?.updateValueAndValidity();
  }
}

/* @Name: onClientAdminChange @Who:  Renu @When: 19-02-2025 @Why: EWM-19576 EWM-19552 @What:when client eoh (admin only) value changes*/

onClientAdminChange(data: any | null){
  if (data == null || data == "" || data.length == 0) {
    this.selectedClientAdmin = null;
    this.shareClientForm.patchValue(
      {
        parentClient:null,
        parentClientId:null
      });
  }
  else {
    this.selectedClientAdmin = data;
    this.shareClientForm.patchValue({
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

 ngOnDestroy(){
    this.btnSubscription?.unsubscribe();
  }
}
