import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'cluster';
import { Observable, Subject, Subscription } from 'rxjs';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../services/candidates/candidate.service';
import { ClientService } from '../../services/client/client.service';
import { ProfileInfoService } from '../../services/profile-info/profile-info.service';
import { QuickJobService } from '../../services/quickJob/quickJob.service';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { AddemailComponent } from '../addemail/addemail.component';
import { QuicklocationComponent } from '../addlocation/quicklocation.component';
import { AddphonesComponent } from '../addphones/addphones.component';
import { ContactRelatedTypeComponent } from '../quick-add-contact/contact-related-type/contact-related-type.component';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';


@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  /**********************global variables decalared here **************/
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  phone: any = [];
  socials: any = [];
  emails: any = []
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  addTeamForm: FormGroup;

  public selected: any = [];
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any;
  public socialArr: any;
  addressBarData: Address;
  public locationTypeList: any = [];
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  events: Event[] = [];
  ownerList: [] = [];
  public employeeData: any[];
  selectedValue:any={};
  public oldPatchValues : any;
  public activityStatus:any;
  public LastUpdated:any;


  clientListById: any;
  client: any;
  public addressData: any;
  public locationArr: any;

  public ContactRelatedTo: any = [];
  public loading: boolean = false;
  genderList: any = [];
  clientId: any;

  emailValid:boolean=false;
  phoneValid:boolean=false;

  public patchData:any = {};
  public filteredOwnerList:any= [];
  public tempID: number;

  //  kendo image uploader Adarsh singh 01-Aug-2023
@ViewChild('editor') editor: EditorComponent;
subscription$: Subscription;
// End 
public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
public showErrorDesc: boolean = false;
public tagList:any=['jobs'];
public basic:any=[];
maxLengthEditorValue: Subject<any> = new Subject<any>();
showMaxlengthError:boolean=false;
public maxlenth:number;
getRequiredValidationMassage: Subject<any> = new Subject<any>();
public clientType:string;
public manageData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private routes: ActivatedRoute, public dialogRef: MatDialogRef<AddTeamComponent>, 
     public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private quickJobService: QuickJobService,private clientService: ClientService,
    private appSettingsService: AppSettingsService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
      this.emailPattern=this.appSettingsService.emailPattern;
     this.clientType= this.data?.clientType;
    this.addTeamForm = this.fb.group({
      Id: [null],
      Employee: [null, [Validators.required]],
      EmployeeName: [''],
      Email: ['', ],
      Contact: ['', ],
      RoleOfEmpWithClient: ['',[Validators.required,Validators.maxLength(500)] ],
      Status: [1, [Validators.required]],
      StatusName: ['Active'],

    });
  }

  public isEditForm: boolean;
  ngOnInit() {
    this.routes.queryParams.subscribe((value) => {
      if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
        this.clientId = value.clientId;
      }
    });
    this.commonserviceService.onClientSelectId.subscribe(value => {     
      if (value !== null) {
        this.clientId = value;  
      } 
    })
    if(this.data?.teamId != undefined && this.data?.teamId != null && this.data?.teamId != ''){
      this.getClientTeamById()
    }
    // this.clientId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    // console.log(this.clientId, "clientId")
    this.getAllStatus();
    this.getAllOwnerAndCompanyContacts();
    this.addTeamForm.controls["Email"].disable();
    this.addTeamForm.controls["Contact"].disable();
    let lebel= this.translateService.instant(this.clientType?.toLowerCase()=='lead' ? 'label_rolewith_lead':'label_rolewith_client')
    this.manageData = [JSON.parse(localStorage.getItem('ManageName'))];   
    let result =this.replaceText(lebel);
              //  @Who: maneesh, @When: 08-04-2024,@Why: EWM-16673-EWM-16207 @What: on changes on kendo editor catch the event here
              this.editorConfig={
                REQUIRED:true,
                DESC_VALUE:null,
                PLACEHOLDER:result,
                Tag:[],
                EditorTools:this.basic,
                MentionStatus:false,
                maxLength:0,
                MaxlengthErrormessage:false,
                JobActionComment:false
    
              };
  }
 
  /* 
@Type: File, <ts>
@Name: getAllOwnerAndCompanyContacts function
@Who: Adarsh
@When: 25-June-2021
@Why: 4052 EWM-4489
@What: get All Owner And Company Contacts
*/
getAllOwnerAndCompanyContacts() {
  this.quickJobService.fetchUserInviteList().subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.ownerList = repsonsedata.Data;
        let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
        let userId: string = currentUser?.UserId;
         const filtered = this.ownerList.filter(function(value:any, index, arr){ 
          return value.UserId != userId;
      });
      this.filteredOwnerList = filtered
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
    @Name: getAllStatus function
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What: For All status List
    */

  getAllStatus() {
    this.loading = true;
    this.systemSettingService.getAllUserTypeStatus().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
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
    @Name: onChangeEmployee function
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What: For patch data of email and contact
    */

   onChangeEmployee(employee) {
    //  console.log(employee,'employeeID');
    this.employeeData = this.filteredOwnerList.filter((dl: any) => dl.UserId == employee);
    
    this.addTeamForm.patchValue({
      Email: this.employeeData[0].Email,
      Contact: this.employeeData[0].PhoneNo,
    });
    this.clientTeamDlicayCheck();

  }

/*
    @Type: File, <ts>
    @Name: on reset
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What:when click on (cross) icon form will reset
    */
  resetForm(){
    this.addTeamForm.reset()
  }
  
 /*
    @Type: File, <ts>
    @Name: on confirm save and update
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What: For  save and Update
    */
  onConfirm(value){
    if(this.data?.teamId != undefined && this.data?.teamId != null && this.data?.teamId != ''){
      this.onUpdate(value);
    }
    else{
      this.onSave(value);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /* 
    @Type: File, <ts>
    @Name: on save data will save
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What: Function will call when user click on save Button
  */
  onSave(value): void {
    let createTeamJson = {};
     
    createTeamJson['EmployeeId'] = this.addTeamForm.value.Employee;
    createTeamJson['RoleOfEmpWithClient'] = this.addTeamForm.value.RoleOfEmpWithClient;
    createTeamJson['Status'] = this.addTeamForm.value.Status;
    createTeamJson['ClientId'] = this.clientId;
    // console.log(createTeamJson);

    this.clientService.createAddTeam(createTeamJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addTeamForm.reset();
          
            document.getElementsByClassName("addClientTeam")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("addClientTeam")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Type: File, <ts>
  @Name: onDismissEdit
  @Who: Adarsh Singh
  @When: 12-jan-2021
  @Why: 4052 EWM-4489
  @What: To close Quick Company Modal for edit
  */
  onDismiss(): void {
    document.getElementsByClassName("addClientTeam")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("addClientTeam")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

 /*
    @Type: File, <ts>
    @Name: get value of particular client and than patch value
    @Who: Adarsh Singh
    @When: 12-jan-2021
    @Why: 4052 EWM-4489
    @What: For patch value 
    */

  getClientTeamById(){
    this.clientService.getClientTeamById('?id=' +this.data?.teamId)
    .subscribe(
      (repsonsedata:ResponceData) =>{
        this.patchData = repsonsedata.Data;
      this.addTeamForm.patchValue({
        Id: repsonsedata.Data?.Id,
        Employee:repsonsedata.Data?.EmployeeId,
        EmployeeName:repsonsedata.Data?.EmployeeName,
        Email:repsonsedata.Data?.Email,
        Contact:repsonsedata.Data?.PhoneNo,
        RoleOfEmpWithClient:repsonsedata.Data?.RoleOfEmpWithClient,
        Status:repsonsedata.Data?.Status,
        StatusName:repsonsedata.Data?.StatusName,
      })
      this.getEditorVal=repsonsedata.Data?.RoleOfEmpWithClient;//maneesh
      this.LastUpdated=repsonsedata.Data?.LastUpdated;
      this.addTeamForm.controls["Employee"].disable();
      this.addTeamForm.controls["Email"].disable();
      this.addTeamForm.controls["Contact"].disable();
      }
    )
    
  }

/*  
@Type: File, <ts>
@Name: on update
@Who: Adarsh Singh
@When: 12-jan-2021
@Why: 4052 EWM-4489
@What: For Update
  */

  onUpdate(value){
   let toUpdatejson = {};
   toUpdatejson['Id']=value.Id;
   toUpdatejson['EmployeeId']=value.Employee;
   toUpdatejson['EmployeeName']=value.EmployeeName;
   toUpdatejson['Email']=value.Email;
   toUpdatejson['PhoneNo']=value.Contact;
   toUpdatejson['RoleOfEmpWithClient']=value.RoleOfEmpWithClient;
   toUpdatejson['Status']=value.Status;
   toUpdatejson['StatusName']=value.StatusName;
   toUpdatejson['LastUpdated']=this.LastUpdated;
   toUpdatejson['ClientId']=this.clientId;

   let updateTeamjson = {
      "From": this.patchData,
      "To": toUpdatejson
    }
    this.clientService.clientTeamUpdate(updateTeamjson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addTeamForm.reset();
          
          document.getElementsByClassName("addClientTeam")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("addClientTeam")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(true); }, 200);
           this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
  @Type: File, <ts>
  @Name: duplicayCheck function
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1828
  @What: For checking duplicacy for code and description
  */
 clientTeamDlicayCheck() {
  let id = 0;
  // let JobId;
  // if (this.tempID != undefined) {
  //   JobId = this.tempID;
  // } else {
  //   JobId = 0;
  // }
  // if (this.addTeamForm.get('Employee').value == '') {
  //   return false;
  // }
  
  let checkDuplicateJson = {};

  checkDuplicateJson['EmployeeId'] = this.addTeamForm.value.Employee;
  checkDuplicateJson['Id'] = id;
  checkDuplicateJson['ClientId'] = this.clientId;

  this.clientService.checkDuplicateEmployeeTeam(checkDuplicateJson).subscribe(
    (data: any) => {
      if (data.HttpStatusCode == 402) {
        if (data.Data == false) {
            this.addTeamForm.get("Employee").setErrors({ codeTaken: true });
            this.addTeamForm.get("Employee").markAsDirty();
        }
      }
      else if (data.HttpStatusCode == 204) {
          this.addTeamForm.get("Employee").clearValidators();
          this.addTeamForm.get("Employee").markAsPristine();
          this.addTeamForm.get("Employee").setValidators([Validators.required]);
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
      // if (repsonsedata.HttpStatusCode === 200) {
      //   if (repsonsedata.Status == true) {
      //     this.addTeamForm.get("Employee").setErrors({ codeTaken: true });
      //     this.addTeamForm.get("Employee").markAsDirty();
      //   }
      // } else if (repsonsedata.HttpStatusCode == 400) {
      //   if (repsonsedata.Status == false) {

      //     this.addTeamForm.get("Employee").clearValidators();
      //     this.addTeamForm.get("Employee").markAsPristine();
      //     this.addTeamForm.get('Employee').setValidators([Validators.required]);

      //     // if (this.addTeamForm && this.submitted == true) {
      //     //   if (this.tempID == undefined || this.tempID == null) {
      //     //     this.createJobMaster(this.addTeamForm.getRawValue());
      //     //   } else {
      //     //     this.updateJobMaster(this.addTeamForm.getRawValue());
      //     //   }
      //     // }
      //   }
      // }
      // else {
      //   this.addTeamForm.get("Employee").clearValidators();
      //   this.addTeamForm.get("Employee").markAsPristine();
      //   this.addTeamForm.get('Employee').setValidators([Validators.required]);
      // }
      // this.addTeamForm.get('Employee').updateValueAndValidity();
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

/*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
     if (res.data != undefined && res.data != '') {
       this.loading = true;
       if (res.event === 1) {
        this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
           this.editor.exec('insertImage', res);
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
           this.editor.exec('insertImage', res);
           this.loading = false;
         })
       }
     }
   })
}

ngOnDestroy(){
  this.subscription$?.unsubscribe();
}
//who:maneesh,what:ewm-16207 ewm-16673 for new speech editor,when:14/03/2024
getEditorFormInfo(event) {
  this.ownerList = event?.ownerList;
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));

   if(sources == undefined && event?.val==null ){
    this.editConfigRequired();
    this.showMaxlengthError=true;
    this.addTeamForm.get('RoleOfEmpWithClient').setValue('');
    this.addTeamForm.get('RoleOfEmpWithClient').setValidators([Validators.required]);
    this.addTeamForm.get('RoleOfEmpWithClient').updateValueAndValidity();
    this.addTeamForm.get("RoleOfEmpWithClient").markAsTouched();
  }
  else if(sources == undefined && event?.val==''){
    this.editConfigRequired();
    this.showMaxlengthError=true;
    this.addTeamForm.get('RoleOfEmpWithClient').setValue('');
    this.addTeamForm.get('RoleOfEmpWithClient').setValidators([Validators.required]);
    this.addTeamForm.get('RoleOfEmpWithClient').updateValueAndValidity();
    this.addTeamForm.get("RoleOfEmpWithClient").markAsTouched();
  }else if(sources != undefined && event?.val!=''){
    this.showMaxlengthError=false;
    this.addTeamForm.get('RoleOfEmpWithClient').setValue(event?.val);
    this.addTeamForm.get('RoleOfEmpWithClient').clearValidators();
    this.addTeamForm.get('RoleOfEmpWithClient').markAsPristine();  
  }else if(event?.val!=''){
    this.showMaxlengthError=false;
    this.addTeamForm.get('RoleOfEmpWithClient').setValue(event?.val);
    this.addTeamForm.get('RoleOfEmpWithClient').clearValidators();
    this.addTeamForm.get('RoleOfEmpWithClient').markAsPristine();
  }
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  let result= event.val?.replace(regex, '\n');
  if (result?.length>500) {
    this.maxlenth=result?.length;
    this.editConfigmaxlength();  
    this.showMaxlengthError=true;
  }else if(result?.length<=500){
    this.showMaxlengthError=false;
    this.addTeamForm.get('RoleOfEmpWithClient').setValue(event?.val);
  }
}


getEditorImageFormInfo(event){
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  this.showMaxlengthError=false;
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  if(sources == undefined && event?.val==null ){
  this.editConfigRequired();
  this.showMaxlengthError=true;
  this.addTeamForm.get('RoleOfEmpWithClient').setValue('');
  this.addTeamForm.get('RoleOfEmpWithClient').setValidators([Validators.required]);
  this.addTeamForm.get('RoleOfEmpWithClient').updateValueAndValidity();
  this.addTeamForm.get("RoleOfEmpWithClient").markAsTouched();
}
else if(sources == undefined && event?.val==''){
  this.editConfigRequired();
  this.showMaxlengthError=true;
  this.addTeamForm.get('RoleOfEmpWithClient').setValue('');
  this.addTeamForm.get('RoleOfEmpWithClient').setValidators([Validators.required]);
  this.addTeamForm.get('RoleOfEmpWithClient').updateValueAndValidity();
  this.addTeamForm.get("RoleOfEmpWithClient").markAsTouched();
}else if(sources != undefined && event?.val!=''){
  this.showMaxlengthError=false;
  this.addTeamForm.get('RoleOfEmpWithClient').setValue(event?.val);
  this.addTeamForm.get('RoleOfEmpWithClient').clearValidators();
  this.addTeamForm.get('RoleOfEmpWithClient').markAsPristine();
}else if(event?.val!=''){
  this.showMaxlengthError=false;
  this.addTeamForm.get('RoleOfEmpWithClient').setValue(event?.val);
  this.addTeamForm.get('RoleOfEmpWithClient').clearValidators();
  this.addTeamForm.get('RoleOfEmpWithClient').markAsPristine();
}
let result= event.val?.replace(regex, '\n');
if (result?.length>500) {
  this.maxlenth=result?.length;  
  this.editConfigmaxlength();  
  this.showMaxlengthError=true;
}else if(result?.length<=500){
  this.showMaxlengthError=false;
  this.addTeamForm.get('RoleOfEmpWithClient').setValue(event?.val);
}
}
editConfigRequired(){
 let lebel= this.translateService.instant(this.clientType?.toLowerCase()=='lead' ? 'label_rolewith_lead':'label_rolewith_client')
 this.manageData = [JSON.parse(localStorage.getItem('ManageName'))];
 let result =this.replaceText(lebel);
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:result,
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.addTeamForm.get('RoleOfEmpWithClient').updateValueAndValidity();
    this.addTeamForm.get("RoleOfEmpWithClient").markAsTouched();
}
editConfigmaxlength(){
  let lebel= this.translateService.instant(this.clientType?.toLowerCase()=='lead' ? 'label_rolewith_lead':'label_rolewith_client')
  this.manageData = [JSON.parse(localStorage.getItem('ManageName'))];
  let result =this.replaceText(lebel);
  this.editorConfig={
    REQUIRED:false,
    DESC_VALUE:null,
    PLACEHOLDER:result,
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:500,
    MaxlengthErrormessage:true,
    JobActionComment:false
    }
    this.showMaxlengthError=true;
    this.maxLengthEditorValue.next(this.editorConfig);
    this.addTeamForm.get('RoleOfEmpWithClient').updateValueAndValidity();
    this.addTeamForm.get("RoleOfEmpWithClient").markAsTouched();
}

replaceText(transString) {
  let result: string;
  let lang = localStorage.getItem('Language');
  for (let obj of this.manageData) {
    for (let key in obj) {
      let objKey = Object.assign({}, JSON.parse(obj[key]));
      let replacekey = '{{' + key.toLowerCase() + '}}';
      if (transString != undefined) {
        if (transString.includes(replacekey)) {
          if (transString.indexOf(replacekey) > 0) {
            result = transString.replaceAll(replacekey, objKey[lang].toLowerCase());
          }
          else {
            result = transString.replaceAll(replacekey, objKey[lang]);
          }
          return result;
        } else {
          result = transString;
        }
      }
    }
  }
  return result;
}
}
