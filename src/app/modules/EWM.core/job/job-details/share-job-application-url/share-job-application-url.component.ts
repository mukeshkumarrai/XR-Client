
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild, Input, Optional, EventEmitter, Output } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import {  RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ShareResumeInternalComponent } from '../../screening/share-resume-internal/share-resume-internal.component';
import { JobService } from '../../../shared/services/Job/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddRequiredAttendeesComponent } from '../../../home/my-activity/add-required-attendees/add-required-attendees.component';
import { ShortUrlService } from '@app/shared/services/shortUrlService/short-url.service';


@Component({
  selector: 'app-share-job-application-url',
  templateUrl: './share-job-application-url.component.html',
  styleUrls: ['./share-job-application-url.component.scss']
})
export class ShareJobApplicationUrlComponent implements OnInit {
/**********************global variables decalared here **************/ 
phone: any = [];
shareDocUserList:any = [];
addForm: FormGroup;
public organizationData = [];
public OrganizationId: string;
public userTypeList: any = [];
public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
public numberPattern = "^[0-9]*$";
public specialcharPattern = "^[a-z A-Z0-9]+$";
public statusList: any = [];
public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';  
public candidateId;
public candidateName;
public editId;
public activityStatus;
public oldPatchValues: any; 
public loading:boolean;
public loadingSearch:boolean;
selectable = true;
removable = true;
separatorKeysCodes: number[] = [ENTER, COMMA];
public searchValue: string = "";
public isCoppied:boolean=false;
searchUserCtrl = new FormControl();//@when:1-nov-2021;@who:Priti Srivastva;@why: EWM-3465-->
@ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
documentAccessModeList: any = [];
userSelectedList: any = [];
searchUserList: any = [];
currentUser:any;
docName:any;
docId:any;
ResumeLink:any;
maxMessage=1000;
userListLengthMore: any = 5;
public PreviewUrl: string;
baseUrl:any;
Link = 'https://sso-client-dev-ewm.entiredev.in/';
public shareJobApplicationUrl:any;
@Input() JobId: any;
@Input() JobName: any;
@Input() WorkflowId: any;
@Input() WorkflowName: any;
//emailpattern: string = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
EmailList=new FormControl('',[Validators.required]);
@Output() jobApplicationUrlDrawer = new EventEmitter();
  previewShareJobApplicationUrl: string;
  applicationBaseUrl: string;
  applicationLinkExpire: any;
  isResponseGet: boolean=false;
 @Input() JobExpiryDays:number; 
 public  ParentSource: string;

constructor(private route: Router,private routes: ActivatedRoute,private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,private _Service:JobService,
  public dialog: MatDialog, private translateService: TranslateService,private appConfigService: AppSettingsService, public systemSettingService: SystemSettingService,
  private bitly: ShortUrlService) {
    this.emailPattern=this.appConfigService.emailPattern;
    this.PreviewUrl = "/assets/user.svg";
    /*if(data!=undefined)
    {     
      this.candidateId = data.candidateId;
      this.JobId = data.JobId;
      //this.activityStatus = data.formType;  
    }*/
    this.emailPattern=this.appConfigService.emailPattern;
    this.applicationBaseUrl =  appConfigService.applicationBaseUrl;  
    this.baseUrl =  appConfigService.baseUrl;  
    this.applicationBaseUrl =  appConfigService.applicationBaseUrl; 
    this.addForm = this.fb.group({
    Id: [''],
    ToEmailIds: [[],Validators.required],
    SharedLink: [`${this.appConfigService.ExternalSharedLink}`]
  });
  this.routes.queryParams.subscribe((parmsValue) => {
    this.JobId = parmsValue.jobId;
  })
 // this.shareJobApplicationUrl = this.baseUrl+'/application/apply?mode=apply&jobId='+this.JobId;
  this.applicationLinkExpire = appConfigService.applicationLinkExprire;
  this.ParentSource=this.appConfigService.SourceCodeParam['ApplicationForm'];
}

ngOnInit() { 
  let URL = localStorage.getItem('redirectUrl'); 
  let URL_AS_LIST = URL.split('/'); 
  //this.shareJobApplicationUrl = URL_AS_LIST[0]+'//'+URL_AS_LIST[2]+'/application/apply?mode=apply&jobId='+this.JobId; 
  const subdomain=localStorage.getItem("tenantDomain");  
  let domain:string;
  if (subdomain) {
    domain = '&domain='+subdomain;
  }
  this.previewShareJobApplicationUrl = URL_AS_LIST[0]+'//'+URL_AS_LIST[2]+'/job/desc?mode=apply&jobId='+this.JobId; 
  let longUrlshareJobApplicationUrl = this.applicationBaseUrl+'/job/desc?mode=apply&jobId='+this.JobId+domain+'&parentSource='+this.ParentSource+'&Source='+this.ParentSource;   
  this.shorthandUrl(longUrlshareJobApplicationUrl);  
  this.commonserviceService.onOrgSelectId.subscribe(value => {
    if (value == null) {
      this.OrganizationId = localStorage.getItem('OrganizationId')
    } else {
      this.OrganizationId = value;
    }
  })  
  let tenantData= JSON.parse(localStorage.getItem('currentUser'));
  this.currentUser = tenantData;
  this.addForm.reset();
  this.userSelectedList = [];
}

  shorthandUrl(shareJobApplicationUrl: any){
    let uriEncodeJson = {};
    uriEncodeJson['CompleteUrl'] = shareJobApplicationUrl;
    uriEncodeJson['ExpiryDays'] = this.JobExpiryDays;
  try{
    this.bitly.shortenUrl(uriEncodeJson).subscribe((link:ResponceData) => {
       //console.log("link",link.Data?.ShortUrl)
       this.shareJobApplicationUrl=link.Data?.ShortUrl;
      },err=>{
        console.error(err);
      }
    );
  }catch(e){
    console.error(e);
  }
}

/* 
  @Type: File, <ts>
  @Name: remove function
  @Who: Suika
  @When: 05-July-2022
  @Why: EWM-6969.EWM-7521
  @What: get remove chips skills
  */

 removeEmail(data: any): void {
  if (this.userSelectedList.indexOf(data) >= 0) {
    this.userSelectedList.splice(this.userSelectedList.indexOf(data), 1);
  }

  let eMailVal = '';
  let invalidEmail = false;

  for (let i = 0; i < this.userSelectedList.length; i++) {
    if (this.userSelectedList[i].invalid === true) {
      invalidEmail = true;
    }

    if (eMailVal.length === 0 || eMailVal === '') {
      eMailVal = this.userSelectedList[i].Email;
    }
    else {
      eMailVal += ',' + this.userSelectedList[i].Email;
    }
  }

  this.addForm.patchValue({
    'ToEmailIds': eMailVal
  });

  if (eMailVal.length === 0 || eMailVal === '') {
    this.addForm.get("ToEmailIds").clearValidators();
    this.addForm.get("ToEmailIds").setErrors({ required: true });
    this.addForm.get("ToEmailIds").markAsDirty();
  }
  else {
    if (invalidEmail) {
      this.addForm.get("ToEmailIds").clearValidators();
      this.addForm.controls["ToEmailIds"].setErrors({ 'incorrectEmail': true });
    }
  }
}


addFrom(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  var IsDuplicate = false;
  
  if (event.value.trim()) {
    for (let i = 0; i < this.userSelectedList.length; i++) {
      if (this.userSelectedList[i].Email === value) {
        // console.log(this.userSelectedList[i].value, value);
        IsDuplicate = true;
      }
    }
    if (IsDuplicate === false) {
      if (this.validateEmail(event.value)) {
          this.userSelectedList.push({ Email: event.value, invalid: false });
          this.setFromEmailsValues();
             
      } else {
        this.userSelectedList.push({ Email: event.value, invalid: true });
        this.setFromEmailsValues();
        
        this.addForm.get("ToEmailIds").clearValidators();
        this.addForm.controls["ToEmailIds"].setErrors({ 'incorrectEmail': true });
      }
    }
  }
  else if (this.addForm.get("ToEmailIds").value === null || this.addForm.get("ToEmailIds").value === '') {
    this.addForm.get("ToEmailIds").clearValidators();
    this.addForm.get("ToEmailIds").setErrors({ required: true });
    this.addForm.get("ToEmailIds").markAsDirty();
  }
  if (event.input) {
    event.input.value = '';
  }
}



setFromEmailsValues() {
  let eMailVal = '';
  let IsValid = true;
  for (let i = 0; i < this.userSelectedList.length; i++) {
    if (this.validateEmail(this.userSelectedList[i].Email) === false) {
      IsValid = false;
    }else{
      IsValid = true;
    }

    if (eMailVal.length === 0 || eMailVal === '') {
      eMailVal = this.userSelectedList[i].Email;
    }
    else {
      eMailVal += ',' + this.userSelectedList[i].Email;
    }

  }
  this.addForm.patchValue({
    'ToEmailIds': eMailVal
  });

  if (IsValid === false) {
    this.addForm.get("ToEmailIds").clearValidators();
    this.addForm.controls["ToEmailIds"].setErrors({ 'incorrectEmail': true });
  }
}


private validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}




/* 
  @Type: File, <ts>
  @Name: confirm-dialog.compenent.ts
  @Who: Suika
  @When: 05-July-2022
  @Why: EWM-6969.EWM-7521
  @What: Function will call when user click on ADD/EDIT BUUTONS.
*/

onConfirm(): void {   
    this.shareJobApplicationForm();   
}


sortName(fisrtName, lastName) {
  const Name = fisrtName + " " + lastName;
  const ShortName = Name.match(/\b(\w)/g).join('');
  return ShortName.toUpperCase();

}


shareJobApplicationForm(){   
  if (this.addForm.invalid) {
    return;
  }  
  let createPeopJson = {};
  let SharedEmailIds = [];
  this.userSelectedList.forEach(element=>{    
        SharedEmailIds.push({ RecipientName: element.Name||null, RecipientEmailId: element.Email });  
  })
  createPeopJson['JobId'] = this.JobId;
  createPeopJson['ApplicationFormId'] =this.docId;
  createPeopJson['SharedEmailIds'] = SharedEmailIds;
  createPeopJson['SharedLink'] = this.shareJobApplicationUrl;
  createPeopJson['PageName'] = 'Share Job Application Url';
  createPeopJson['BtnId'] = 'btnSave';
  
  this._Service.createShareableLinkWithName(createPeopJson).subscribe(
    (responseData: ResponceData) => {
      if (responseData.HttpStatusCode === 200) {
        this.isCoppied = false;
        this.userSelectedList = [];
        this.addForm.reset();
        this.jobApplicationUrlDrawer.emit(true);
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
  @Name: onDismiss
  @Who: Suika
  @When: 05-July-2022
  @Why: EWM-6969.EWM-7521
  @What: Function will call when user click on ADD/EDIT BUUTONS.
*/

onDismiss(): void {
  this.userSelectedList = [];
  this.addForm.reset();
  this.jobApplicationUrlDrawer.emit(true);
}

  copyJobApplicationUrl(jobApplicationUrl){ 
    if (this.shareJobApplicationUrl!=undefined && jobApplicationUrl!=undefined && this.shareJobApplicationUrl!=null && jobApplicationUrl!=null) {
      this.isResponseGet=true;//maneesh
      this.isCoppied = true;
    }
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
    this.isResponseGet=false;
  }

   /*
   @Type: File, <ts>
   @Name: openModelAddRequiredAttendees
   @Who: Adarsh Singh
   @When: 29-07-2022
   @Why:EWM-7946 EWM-8043
   @What: open Modal for add candidate
   */
  confirmShareJobCandidate() {
    let userList = this.userSelectedList.filter((dn: any) => dn.invalid != false);
    
    const dialogRef = this.dialog.open(AddRequiredAttendeesComponent, {
      data: new Object({requiredAttendeesList: userList, activityForAttendees: 'CAND',clientIdData: null, popUpType: 'shareJob'}),
      panelClass: ['xeople-modal', 'quick-modalbox', 'AddRequiredAttendees', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        res.forEach(element => {
          this.userSelectedList.push(element);
        });
        let uniqueChars = [...new Set(this.userSelectedList)];
        this.userSelectedList = uniqueChars
        this.addForm.patchValue({
          'ToEmailIds': this.userSelectedList
        })
      }
      else {      
        this.addForm.patchValue({
          ToEmailIds: null,
        })
        if (this.userSelectedList.length == 0) {
          this.addForm.controls['ToEmailIds'].setErrors({ 'required': true });
          // this.IsAttendeesReq = true;
        } else {
          // this.IsAttendeesReq = false;
        }
      }   
    })
  }

}

/**
* Class to represent confirm dialog model.
*
* It has been kept here to keep it as part of shared component.
*/
export class ConfirmDialogModel {

constructor(public title: string, public subtitle: string, public message: string) {
}


}
