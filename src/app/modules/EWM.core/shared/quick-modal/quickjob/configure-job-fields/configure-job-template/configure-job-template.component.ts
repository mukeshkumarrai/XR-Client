/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati 
  @When: 08-Feb-2023
  @Why: EWM-9628 EWM-10420
  @What:  This page will be use for the manage job template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { JobService } from '../../../../services/Job/job.service';
import { SystemSettingService } from '../../../../services/system-setting/system-setting.service';
import { QuickJobService } from '../../../../services/quickJob/quickJob.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { customDescriptionConfig } from '../../../../datamodels';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

@Component({
  providers: [MessageService],
  selector: 'app-configure-job-template',
  templateUrl: './configure-job-template.component.html',
  styleUrls: ['./configure-job-template.component.scss']
})
export class ConfigureJobTemplateComponent implements OnInit {

  
  /****************Decalaration of Global Variables*************************/
  // status: boolean = false;
  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;

  public formtitle: string = 'grid';
  jobTemplateForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  viewMode: string = "listMode";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  @Input() name: string;
  canLoad = false;
  pendingLoad = false;
  pagesize;
  loadingscroll: boolean;
  public ascIcon: string;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;
  public idSms = '';

  public disable: boolean = false;
  activestatus: string;
  viewModeValue: any;

  clientList: [] = [];
  categoryList: any[] = [];
  industryList: [] = [];
  experienceList: [] = [];
  jobTypeList: [] = [];
  workFlowList: [] = [];
  salaryBandList: [] = [];
  salaryList: [] = [];
  statusList: [] = [];
  public value = ``;

  client:any;

  selectedDescription:any;
  descrpConfigData:customDescriptionConfig[]=[];
  public createJobForm:any='';
  public workFlowLenght:any=0;

  //Who:Ankit Rawat, Replace workflow control with new dropdown, When:09Apr2024
  public selectedJobWorkflow: any = {};
  public workFlowDropdownConfig: DRP_CONFIG;
  public currentMenuWidth: number;
  public maxMoreLengthForWorkFlow: number = 5;
  ShowEditor: boolean;
  public showErrorDesc: boolean = false;
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string;
  public gridListView: any = [];
getRequiredValidationMassage: Subject<any> = new Subject<any>();
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati 
  @When: 08-Feb-2023
  @Why: EWM-9628 EWM-10420
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private jobService: JobService, 
    private snackBService: SnackBarService, private textChangeLngService:TextChangeLngService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, private systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,public dialogRef: MatDialogRef<ConfigureJobTemplateComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private serviceListClass: ServiceListClass) {
    this.pagesize = this.appSettingsService.pagesize;

    //this.descrpConfigData['TextLength'] = 500;
    this.descrpConfigData['LabelName'] = 'quickjob_jobDescription';
    this.descrpConfigData['IsRequired'] = true;
    

    this.jobTemplateForm = this.fb.group({
      Id: [],
      //  who:maneesh,what:ewm.9961 add this.noWhitespaceValidator() in name and job titel,when:27/12/2022 

      Name: [[], [Validators.required, Validators.maxLength(100), Validators.minLength(2),this.noWhitespaceValidator()]],
      ClientId: [],
      ClientName: [],
      JobTitle: [[], [Validators.required, Validators.maxLength(100), Validators.minLength(2),this.noWhitespaceValidator()]],
      JobCategoryId: [],
      IndustryId: [],
      ExperienceId: [],
      JobTypeId: [],
      WorkFlowId: [[], [Validators.required]],
      SalaryBandId: [],
      SalaryUnitId: [],
      Status: [[], [Validators.required]],
      JobDescription: ['', [Validators.required]],

    });

  }
  /* 
 @Type: File, <ts>
 @Name: ngOnInit function
 @Who: Nitin Bhati 
 @When: 08-Feb-2023
 @Why: EWM-9628 EWM-10420
 @What: For calling 
 */
  ngOnInit(): void {
  

    let URL = this.route.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    if (this.routes.snapshot.params.id != null) {
      this.editForm();
      this.disable = true;
      this.activestatus = "Edit";
    } else {
      this.activestatus = "Add";
      //Who:Ankit Rawat, What:EWM-16596 Default workflow selected, When:09Apr24
      this.setDefaultWorkflow();
    }

    ///////geting Data Via Routing from user contact type component///////
    this.routes.queryParams.subscribe((params) => {
      this.viewModeValue = params['ViewModeDataValue'];
    })
    this.routes.params.subscribe((params) => {
      this.createJobForm = params['createJobForm'];
      this.workFlowLenght = params['workFlowLenght'];
    })

    //Who:Ankit Rawat, Replace workflow control with new dropdown, When:09Apr2024
    this.dropdownConfigWorkflow();
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForWorkflow();

    this.getClientAllDetailsList();
    this.getCategoryList();
    this.getIndustryList();
    this.getExperienceList();
    this.getJobTypeList();
    this.getAllWorkFlowList();
    this.getAllSalaryBandList()
    this.getAllSalary();
    this.getStatusAllList();
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'quickjob_jobDescription',
      Tag:[],
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    };
  }



  /*
  @Type: File, <ts>
  @Name: onCancel() function 
  @Who: Nitin Bhati 
  @When: 08-Feb-2023
  @Why: EWM-9628 EWM-10420
  @What: For Navigate list component and also sending data via routing
 */
  onCancel() {
    document.getElementsByClassName("JobTemplateManage")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("JobTemplateManage")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  /* 
     @Type: File, <ts>
     @Name: onSave function
     @Who: Nitin Bhati 
     @When: 08-Feb-2023
     @Why: EWM-9628 EWM-10420
     @What:This function is used for update and save record into database
    */
  onSave(value) {
    this.submitted = true;
    if (this.jobTemplateForm.invalid) {
      return;
    }
   this.duplicacyCheckTemplateName();

  }

  /* 
   @Type: File, <ts>
   @Name: duplicacyCheckTemplateName Function
   @Who: Nitin Bhati 
   @When: 08-Feb-2023
   @Why: EWM-9628 EWM-10420
   @What:  For check duplicate value of Name
  */
  public duplicacyCheckTemplateName() {
    this.loading = false;
    let contactTypeID = this.jobTemplateForm.get("Id").value;
    if (contactTypeID == null) {
      contactTypeID = 0;
    }
    if (contactTypeID == '') {
      contactTypeID = 0;
    }
    let duplicacyNameObj = {};
    duplicacyNameObj['Id'] = contactTypeID;
    duplicacyNameObj['Value'] = this.jobTemplateForm.get("Name").value;
    duplicacyNameObj['CheckFor'] = "Name";
//<!-----@Adarsh singh @EWM-12796 @20-June-2023-----> 
   if (this.jobTemplateForm.value.Name?.trim()) {
    this.jobService.duplicayCheckNameAndTitle(duplicacyNameObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data == true) {
            this.jobTemplateForm.get("Name").setErrors({ codeTaken: true });
            this.jobTemplateForm.get("Name").markAsDirty();
            this.loading = false;
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (data.Data == false) {
            this.loading = false;
            //this.jobTemplateForm.get("Name").clearValidators();
            this.jobTemplateForm.get("Name").markAsPristine();
            if (this.jobTemplateForm && this.submitted == true) {
              if (this.routes.snapshot.params.id == null) {
                this.addJobTemplateListForm(this.jobTemplateForm.value);
              } else {
                this.updateJobTemplateListForm(this.jobTemplateForm.value);
              }
            }
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
      });
   }
  }
  /* 
     @Type: File, <ts>
     @Name: addJobTemplateListForm
     @Who: Nitin Bhati 
     @When: 08-Feb-2023
     @Why: EWM-9628 EWM-10420
     @What:  For submit the form data
    */
  addJobTemplateListForm(value) {
    this.loading = true;
    const formData = new FormData();
    var removeJsonId = value;
    delete removeJsonId.Id;
    this.jobService.createJobTemplateList(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.jobTemplateForm.reset();

          document.getElementsByClassName("JobTemplateManage")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("JobTemplateManage")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);

          this.loading = false;
          this.formtitle = 'grid';
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }


  /*
     @Type: File, <ts>
     @Name: editForm function
     @Who: Nitin Bhati 
     @When: 08-Feb-2023
     @Why: EWM-9628 EWM-10420
     @Why: use for set value in patch file for showing information.
     @What: .
    */
  editForm() {
    this.loading = true;
    this.jobService.getJobTemplateListById('?id=' + this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode == 200) {
          this.jobTemplateForm.patchValue({
            Id: data.Data.Id,
            Name: data.Data.Name,
            ClientId: data.Data.ClientId,
            JobTitle: data.Data.JobTitle,
            JobCategoryId: data.Data.JobCategoryId,
            IndustryId: data.Data.IndustryId,
            ExperienceId: data.Data.ExperienceId,
            JobTypeId: data.Data.JobTypeId,
            WorkFlowId: data.Data.WorkFlowId,
            SalaryBandId: data.Data.SalaryBandId,
            SalaryUnitId: data.Data.SalaryUnitId,
            Status: data.Data.Status,
            JobDescription: data.Data.JobDescription,
      });
      this.selectedDescription = data.Data.JobDescription;
      //Who:Ankit Rawat, What:EWM-16596 Default workflow selected, When:10Apr24
      this.selectedJobWorkflow = { Id: data.Data.WorkFlowId, WorkflowName: data.Data.WorkFlowName };

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
   @Name: updateJobTemplateListForm function
   @Who: Nitin Bhati 
   @When: 08-Feb-2023
   @Why: EWM-9628 EWM-10420
   @What: use for Edit user Tag List data.
  */
  updateJobTemplateListForm(value) {
    this.loading = true;
    this.jobService.updateJobTemplateListById(value).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.jobTemplateForm.reset();
         this.route.navigate(['/client/core/administrators/job-template-create']);
          this.loading = false;
          this.formtitle = 'grid';
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
/*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Nitin Bhati 
  @When: 08-Feb-2023
  @Why: EWM-9628 EWM-10420
  @What: Reload Api's when user change organization
*/
  reloadApiBasedOnorg() {
    this.formtitle = 'grid';
    if (this.routes.snapshot.params.id != null){
    //  this.route.navigate(['/client/core/administrators/job-template-create']);
    }else{
      this.route.navigate(['/client/core/administrators/job-template-create/manage'])
    }
  
  }






  /* 
@Type: File, <ts>
@Name: getClientAllDetailsList function
@Who: Anup
@When: 13-july-2021
@Why: EWM-2001 EWM-2070
@What: get company details
*/

  getClientAllDetailsList() {
    this.quickJobService.getClientAllDetailsList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.clientList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }


  /* 
 @Type: File, <ts>
 @Name: getCategoryList function
 @Who: Anup
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
 @What: get category List
 */
  getCategoryList() {
    this.quickJobService.getJobCategoryAll().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.categoryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /* 
 @Type: File, <ts>
 @Name: getIndustryList function
 @Who: Anup
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
 @What: get industry List
 */
  getIndustryList() {
    this.quickJobService.getIndustryAll().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.industryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
@Type: File, <ts>
@Name: getExperienceList function
@Who: Anup
@When: 13-july-2021
@Why: EWM-2001 EWM-2070
@What: get Experience List
*/
  getExperienceList() {
    this.quickJobService.getExperienceList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.experienceList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  ///////////////Job Type
  /* 
  @Type: File, <ts>
  @Name: getJobTypeList function
  @Who: Anup
  @When: 13-july-2021
  @Why: EWM-2001 EWM-2070
  @What: get Job Type List
  */
  getJobTypeList() {
    this.quickJobService.getJobTypeList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.jobTypeList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
@Type: File, <ts>
@Name: getAllWorkFlowList function
@Who: Anup
@When: 13-july-2021
@Why: EWM-2001 EWM-2070
@What: get Work Flow List
*/
  getAllWorkFlowList() {
    this.quickJobService.getAllWorkFlow().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.workFlowList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  /* 
@Type: File, <ts>
@Name: getAllSalaryBandList function
@Who: Anup
@When: 13-july-2021
@Why: EWM-2001 EWM-2070
@What: get salary Band List
*/
  getAllSalaryBandList() {
    /*-@Who: Nitin Bhati,@When: 03-March-2023,@Why: EWM-11009,@What:Pass Status Active parameter--*/
    this.quickJobService.getSalaryBandList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.salaryBandList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /* 
 @Type: File, <ts>
 @Name: getAllSalary function
 @Who: Anup
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
 @What: get salary List
 */
  getAllSalary() {
    this.quickJobService.getAllSalary('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.salaryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
@Type: File, <ts>
@Name: getStatusAllList function
@Who: Anup
@When: 13-july-2021
@Why: EWM-2001 EWM-2070
@What: get Status List
*/
  getStatusAllList() {
    this.loading = true;
    this.systemSettingService.getAllUserTypeStatus().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.statusList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


 /*
  @Type: File, <ts>
  @Name: getDescription function
  @Who:  ANUP
  @When: 06-Sep-2021
  @Why: EWM-2682 EWM-2725
  @What: For get descripyion data
   */

 getDescription(data){
    if (data == null || data == undefined || data == "") {
      this.selectedDescription = null;
      this.jobTemplateForm.patchValue({
        JobDescription:'',
      })
      this.jobTemplateForm.get("JobDescription").setErrors({ required: true });
      this.jobTemplateForm.get("JobDescription").touched;
      this.jobTemplateForm.get("JobDescription").markAsTouched();
      this.jobTemplateForm.get("JobDescription").markAsDirty();
     }
    else {
      if(data.length > this.descrpConfigData['TextLength']){
        //this.jobTemplateForm.get("JobDescription").setErrors({ maxLength: true });
      }else{
        this.jobTemplateForm.get("JobDescription").clearValidators();
        this.jobTemplateForm.get("JobDescription").markAsPristine();
        this.selectedDescription = data;
        
       this.jobTemplateForm.patchValue({
        JobDescription:data
      })

      }
    }
  }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 23-dec-2022
   @Why: EWM-9961
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let cntrl=control?.value?.toString();
    const isWhitespace = cntrl?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

//<!-----@Adarsh singh @EWM-12796 @20-June-2023-----> 
onClientName(Id:any){
  if (Id) {
    let getSelectedClient:any = this.clientList?.filter((e: any) => e?.ClientId === Id)[0];
    this.jobTemplateForm.patchValue({
      ClientName: getSelectedClient.ClientName
    })
  }
  else{
    this.jobTemplateForm.patchValue({
      ClientName: null
    })
  }
}

//Who:Ankit Rawat, Replace workflow control with new dropdown, When:09Apr2024
dropdownConfigWorkflow() {
  this.workFlowDropdownConfig = {
    API: this.serviceListClass.jobWorkFlowList +"?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND",
    MANAGE: '',
    BINDBY: 'WorkflowName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'quickjob_jobWorkflow',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: 'Email',
    IMG_BIND_VALUE: 'ProfileImage',
    FIND_BY_INDEX: 'Id'
  }
}

//Who:Ankit Rawat, Replace workflow control with new dropdown, When:09Apr2024
onWorkFlowchange(data) {
if (data == null || data == "") {
  this.selectedJobWorkflow = null;
  this.jobTemplateForm.patchValue(
    {
      WorkFlowId: null
    }
  )
  this.jobTemplateForm.get("WorkFlowId").setErrors({ required: true });
  this.jobTemplateForm.get("WorkFlowId").markAsTouched();
  this.jobTemplateForm.get("WorkFlowId").markAsDirty();
}
else {
  this.jobTemplateForm.get("WorkFlowId").clearValidators();
  this.jobTemplateForm.get("WorkFlowId").markAsPristine();
  this.selectedJobWorkflow = data;
  this.jobTemplateForm.patchValue(
    {
      WorkFlowId: data.Id
    }
  )
}
}

//Who:Ankit Rawat, Replace workflow control with new dropdown, When:09Apr2024
screenMediaQuiryForWorkflow() {
  if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
    this.maxMoreLengthForWorkFlow = 1;
  } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
    this.maxMoreLengthForWorkFlow = 2;
  } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
    this.maxMoreLengthForWorkFlow = 3;
  } else {
    this.maxMoreLengthForWorkFlow = 4;
  }
}

//Who:Ankit Rawat, What:EWM-16596 Default workflow selected, When:09Apr24
setDefaultWorkflow(){
this.jobService.getAllWorkFlowList().subscribe(
(repsonsedata:any) => {
  if (repsonsedata.HttpStatusCode === 200) {
    const selectedWorkflowItem=repsonsedata?.Data?.find(item => item.IsDefault === 1);
    if(selectedWorkflowItem){
      this.selectedJobWorkflow = {
        Id: selectedWorkflowItem.Id,
        WorkflowName: selectedWorkflowItem.WorkflowName
      };
      this.jobTemplateForm.patchValue(
        {
          WorkFlowId: this.selectedJobWorkflow.Id
        }
      )
    }
    else
    {
      this.selectedJobWorkflow = null;
      this.jobTemplateForm.patchValue(
        {
          WorkFlowId: null
        }
      )
    }
  } else {
    this.selectedJobWorkflow=null;
    this.jobTemplateForm.patchValue(
      {
        WorkFlowId: null
      }
    )
  }
}, err => {
  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
})
}

    // who:maneesh,what: this is use for patch first time image upload data,when:04/04/2024
 
    getEditorImageFormInfo(event){ 
      this.showErrorDesc=false;
      let disValue=this.jobTemplateForm.get('JobDescription').value;
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      if(event?.val!='' && sources!=undefined){
        this.showErrorDesc=false;
        this.jobTemplateForm.get('JobDescription').setValue(event?.val);
      }else if(disValue!='' && event?.val?.length!=0 ){          
        this.showErrorDesc = false;
        this.jobTemplateForm.get('JobDescription').updateValueAndValidity();
        this.jobTemplateForm.get("JobDescription").markAsTouched(); 
      }
      else{
        this.showErrorDesc = true;
        this.jobTemplateForm.get('JobDescription').setValue('');
        this.jobTemplateForm.get('JobDescription').setValidators([Validators.required]);
        this.jobTemplateForm.get('JobDescription').updateValueAndValidity();
        this.jobTemplateForm.get("JobDescription").markAsTouched(); 
      }
    }
    //this config call agaon required validation  by maneesh
    editConfig(){
      this.editorConfig={
        REQUIRED:true,
        DESC_VALUE:null,
        PLACEHOLDER:'quickjob_jobDescription',
        Tag:[],
        EditorTools:[],
        MentionStatus:false,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false
      };
      this.showErrorDesc=true;
      this.getRequiredValidationMassage.next(this.editorConfig);
      this.jobTemplateForm.get('JobDescription').updateValueAndValidity();
      this.jobTemplateForm.get('JobDescription').markAsTouched();
    }
    getEditorFormInfo(event) {
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
        this.showErrorDesc = false;
        this.jobTemplateForm.get('JobDescription').setValue(event?.val);
      } else if(sources == undefined && event?.val==null ){
        this.editConfig();
        this.showErrorDesc = true;
        this.jobTemplateForm.get('JobDescription').setValue('');
        this.jobTemplateForm.get('JobDescription').setValidators([Validators.required]);
        this.jobTemplateForm.get('JobDescription').updateValueAndValidity();
        this.jobTemplateForm.get("JobDescription").markAsTouched();    }
      else if(sources == undefined && event?.val==''){
        this.showErrorDesc = true;
        this.jobTemplateForm.get('JobDescription').setValue('');
        this.jobTemplateForm.get('JobDescription').setValidators([Validators.required]);
      }
    }
}
