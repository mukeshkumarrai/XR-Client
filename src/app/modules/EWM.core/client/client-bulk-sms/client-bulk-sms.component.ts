/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:  Nitin Bhati
    @When: 16-02-2024
    @Why: EWM-16074,EWM-16092
    @What:  This page is sms for client contact
*/
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { SmsTemplateComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/templates/sms-template/sms-template.component';
import { Router } from '@angular/router';
import { XeopleSearchMsgComponent } from '../../home/xeople-search/xeople-search-msg/xeople-search-msg.component';
@Component({
  selector: 'app-client-bulk-sms',
  templateUrl: './client-bulk-sms.component.html',
  styleUrls: ['./client-bulk-sms.component.scss']
})
export class ClientBulkSmsComponent implements OnInit {
  sendSMSForm: FormGroup;
  maxMessage: number = 612;
  loading: boolean;
  public smsCount:number = 0;
  public msgLength:number =0;
  public maxsmsLength:number=0;
  public balanceSMS:number=0;
  public mappedPhones:any=[];
  public removable:boolean=true;
  selectedClientContacts:any=[];
  dirctionalLang;
  AllContacts:any=[];
  PrimaryContacts:any=[];
  isNotValidSMS:boolean = false;
  SmsList=new FormControl('')
  checkboxDisabled: boolean = true;
  PrimaryContactStatus: boolean=false;
  AllContactsStatus: boolean=false;
  selectedClient: any=[];
  ClientId: string='00000000-0000-0000-0000-000000000000';
  searchTextPhoneNo: string;
  checkboxDisabledRedirect: boolean = true;
  ContactStatus:boolean;
  AllStatusChecklist: boolean=false;
  StatusClientChecklist: boolean=false;
  primarymappedPhones: any=[];
  contactmappedPhones: any=[];
  clientmappedPhones: any=[];
  allmappedPhones: any=[];
  ContactCheckboxDisabled:boolean=true;
  ClientCheckboxDisabled:boolean=true;
  UserType:string='CONT';
  public errorField:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private snackBService: SnackBarService,public dialogRef: MatDialogRef<ClientBulkSmsComponent>, public dialog: MatDialog, private translateService: TranslateService,
     public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService,private router: Router) {
      this.maxsmsLength = this._appSetting.maxsmslength;
      this.sendSMSForm = this.fb.group({
      Subject:['', [Validators.required,Validators.maxLength(75),Validators.minLength(1)]],
      MessageBody: ['', [Validators.required,Validators.maxLength(this.maxsmsLength),Validators.minLength(1)]],
      ToPhonesIds: [[]]
    });
  }
ngOnInit(): void { 
  this.selectedClientContacts=[];
  this.clientmappedPhones=[];
    this.getBalance();
    if(this.data?.selectedClient.length=='1'){
      this.checkboxDisabledRedirect=true;
    }else{
      this.checkboxDisabledRedirect=false;
    }
    const arrayOfObjectsClient  = this.data?.selectedClient;
    let  mappedClientPhone = arrayOfObjectsClient.filter((obj, index, self) =>
    index === self.findIndex((o) => o?.PhoneNo === obj?.PhoneNo)
    );
    let mappedClientPhones =  this.data?.selectedClient?.filter(res=>res?.PhoneNo!='' && res?.PhoneNo!=null && res?.PhoneNo!=undefined);
    if(mappedClientPhone?.length>=1){
      this.clientmappedPhones = [...mappedClientPhones];
      this.ClientCheckboxDisabled=false;
    }
    this.selectedClient=this.data?.selectedClient;
    this.selectedClient?.forEach(element => {
      this.selectedClientContacts?.push(element?.ClientId);
      });
      this.ClientId= this.selectedClientContacts[0];
    this.getClientContactsList();
  }
/*
@Type: File, <ts>
@Name: onDismiss function
@Who:  Nitin Bhati
@When: 19-02-2024
@Why: EWM-16074,EWM-16092
@What: For cancel popup
*/
  onDismiss(): void {
   document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    localStorage.removeItem('selectSMSTemp');
  }
/*
@Type: File, <ts>
@Name: onMessage function
@Who:  Nitin Bhati
@When: 19-02-2024
@Why: EWM-16074,EWM-16092
@What: For message count
*/
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.msgLength = value.length;
      this.maxMessage = 612 - value.length;
      if(value.length==0){
        this.smsCount  = 0;
      }else if(value.length<=160){
        this.smsCount  = 1;
      }else if(value.length<=306){
        this.smsCount  = 2;
      }else if(value.length<=459){
        this.smsCount  = 3;
      }else if(value.length<=612){
        this.smsCount  = 4;
      }else{
        this.smsCount  = 5;
      }
    }
  }
/*
@Type: File, <ts>
@Name: onConfirm function
@Who:  Nitin Bhati
@When: 19-02-2024
@Why: EWM-16074,EWM-16092
@What: For send SMS
*/
  onConfirm(value) {
    this.loading = true;
    let smsObj = {};
    let PhoneList:any[] = []; 
    this.mappedPhones?.forEach(element => {
      let ToPhone={};
      ToPhone["Id"] = element?.ContactId,
      ToPhone["Name"] = element?.ContactName,
      ToPhone["ToPhone"] = element?.PhoneNumber,
      ToPhone["UserType"] = element?.UserType,
      PhoneList.push(ToPhone);
    }); 
       smsObj["PhoneList"] = PhoneList,
       smsObj["Subject"] = value.Subject,
       smsObj["MessageBody"] = value.MessageBody,
       smsObj["Provider"] = "Burst",
       smsObj["Type"] = "SmsNotification";
       smsObj["UserType"] = 'CONT';
    this.systemSettingService.sendBulkSmsForClient(smsObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
        localStorage.removeItem('selectSMSTemp');
          this.loading = false;
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.errorField=repsonsedata?.ErrorFields;          
          if (this.errorField?.length!=0) {
            this.openMsgFilterModal()
          }
          this.snackBService.showThankyouSMSSnackBar(this.translateService.instant('label_sendSMS'), '');
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
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
/*
  @Type: File, <ts>
  @Name: openTemplateModal
  @Who:  Nitin Bhati
  @When: 19-02-2024
  @Why: EWM-16074,EWM-16092
  @What: to open template modal dialog
*/
openTemplateModal() {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_insertTemplate';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(SmsTemplateComponent, {
      panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     if(res!=false){
     this.onMessage(res.data?.SmsBody);
       this.sendSMSForm.patchValue({
        'Subject': res.data?.Title,
        'MessageBody': res.data?.SmsBody.replace(/<[^>]*>/g, '')
      });    
     }
     })
     let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	
  }
/*
  @Type: File, <ts>
  @Name: getBalance
  @Who:  Nitin Bhati
  @When: 19-02-2024
  @Why: EWM-16074,EWM-16092
  @What: to open template modal dialog
*/
  getBalance() {
    this.systemSettingService.getBalance('?provider=Burst').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.balanceSMS = repsonsedata?.Data?.Balance;
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.balanceSMS = 0;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
 /*
   @Type: File, <ts>
   @Name: removeSkill function
   @Who:  Nitin Bhati
   @When: 19-02-2024
   @Why: EWM-16074,EWM-16092
   @What: For remove skill chip
  */
 removeSMS(contactId: string): void {
  this.mappedPhones = this.mappedPhones?.filter(item => item?.ContactId !== contactId);
  //  const index = this.mappedPhones.indexOf(mappedPhones);
  //  if (index >= 0) {
  //    this.mappedPhones?.splice(index, 1);
  //  }
   if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones?.length == 0) {
     this.mappedPhones = [];
     this.sendSMSForm.get('ToPhonesIds').reset();  
     this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
     this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
     this.SmsList.setValidators([Validators.required]);
     //this.SmsList.setValue('');
     this.SmsList.markAsTouched();
     this.sendSMSForm.get('ToPhonesIds').markAsTouched();
     this.isNotValidSMS = true;
     this.PrimaryContactStatus=false;
   } else {
      this.isNotValidSMS = false;
     this.sendSMSForm.get("ToPhonesIds").clearValidators();
     this.sendSMSForm.get("ToPhonesIds").markAsPristine();
   }
 }
 getClientContactsList() {
  this.loading = true;
  this.systemSettingService.getClientContactsList(this.selectedClientContacts).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata?.HttpStatusCode === 200) {
        this.loading = false;
        this.PrimaryContacts = repsonsedata?.Data?.PrimaryContacts;
        this.AllContacts = repsonsedata?.Data?.AllContacts;
        if(repsonsedata?.Data?.AllContacts?.length>=1){
          this.ContactCheckboxDisabled=false;
         }
        const arrayOfObjectsPrimary  = repsonsedata?.Data?.PrimaryContacts;
        this.PrimaryContacts = arrayOfObjectsPrimary.filter((obj, index, self) =>
            index === self.findIndex((o) => o.PhoneNumber === obj?.PhoneNumber)
          );
          const arrayOfObjectsAllContacts = repsonsedata?.Data?.AllContacts;
        this.AllContacts = arrayOfObjectsAllContacts.filter((obj, index, self) =>
            index === self.findIndex((o) => o.PhoneNumber === obj?.PhoneNumber)
          );
        if(repsonsedata?.Data?.PrimaryContacts?.length>=1){
          this.checkboxDisabledRedirect=false;
          this.checkboxDisabled=false;
          this.PrimaryContactStatus=true;
          this.AllContactsStatus=false;
          this.mappedPhones = [];
          this.mappedPhones  =  this.PrimaryContacts?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);
          if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
            this.mappedPhones = [];
            this.sendSMSForm.get('ToPhonesIds').reset();  
            this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
            this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
            this.SmsList.setValidators([Validators.required]);
            this.SmsList.markAsTouched();
            this.sendSMSForm.get('ToPhonesIds').markAsTouched();
            this.isNotValidSMS = true;
          } else {
            this.primarymappedPhones= [...this.mappedPhones];
             this.isNotValidSMS = false;
            this.sendSMSForm.get("ToPhonesIds").clearValidators();
            this.sendSMSForm.get("ToPhonesIds").markAsPristine();
          }
        }else{
          this.PrimaryContactStatus=false;
          this.AllContactsStatus=true;
          this.mappedPhones = [];
          this.mappedPhones =  this.AllContacts?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);
          if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
            this.mappedPhones = [];
            this.sendSMSForm.get('ToPhonesIds').reset();  
            this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
            this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
            this.SmsList.setValidators([Validators.required]);
            this.SmsList.markAsTouched();
            this.sendSMSForm.get('ToPhonesIds').markAsTouched();
            this.isNotValidSMS = true;
          }else{
           // this.contactmappedPhones= [...this.mappedPhones];
            this.isNotValidSMS = false;
            this.sendSMSForm.get("ToPhonesIds").clearValidators();
            this.sendSMSForm.get("ToPhonesIds").markAsPristine();
          }
        }
      }else if(repsonsedata?.HttpStatusCode === 204){
        this.ContactStatus = true;
        this.mappedPhones = [];
        this.loading = false;
      } else if (repsonsedata?.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })

}

statusPrimary(values){
  this.mappedPhones = [];
     if(values===true){
      this.mappedPhones =  this.PrimaryContacts?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);
      this.StatusClientChecklist=false;
      this.AllStatusChecklist=false;
      this.PrimaryContactStatus=true;
      this.AllContactsStatus=false;
      this.isNotValidSMS = false;
      if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
        this.mappedPhones = [];
        this.sendSMSForm.get('ToPhonesIds').reset();  
        this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
        this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
        this.SmsList.setValidators([Validators.required]);
        this.SmsList.markAsTouched();
        this.sendSMSForm.get('ToPhonesIds').markAsTouched();
        this.isNotValidSMS = true;
      }else{
        this.isNotValidSMS = false;
        this.ContactStatus=false;
        let PhoneList:any[] = []; 
        this.mappedPhones?.forEach(element => {
          let ToPhone={};
          ToPhone["Id"] = element?.ContactId,
          ToPhone["Name"] = element?.ContactName,
          ToPhone["ToPhone"] = element?.PhoneNumber,
          PhoneList?.push(ToPhone);
          this.sendSMSForm?.patchValue({
            ToPhonesIds: PhoneList
          })
        });
      }       
    }else{
     this.StatusClientChecklist=false;
     this.AllStatusChecklist=false;
     this.PrimaryContactStatus=false;
     this.AllContactsStatus=false;
     this.ContactStatus=true;
     this.isNotValidSMS = true;
     this.sendSMSForm?.get('ToPhonesIds').reset();  
    }
 }
 statusAllContact(values){
  this.mappedPhones = [];
  if(values===true){
    this.StatusClientChecklist=false;
    this.AllStatusChecklist=false;
    this.PrimaryContactStatus=false;
    this.AllContactsStatus=true;
    this.isNotValidSMS = false;
    this.mappedPhones =  this.AllContacts?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);
    if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
      this.mappedPhones = [];
      this.sendSMSForm.get('ToPhonesIds').reset();  
      this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
      this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
      this.SmsList.setValidators([Validators.required]);
      this.SmsList.markAsTouched();
      this.sendSMSForm.get('ToPhonesIds').markAsTouched();
      this.isNotValidSMS = true;
    }else{
      this.isNotValidSMS = false;
      this.ContactStatus=false;
      let PhoneList:any[] = []; 
      this.mappedPhones?.forEach(element => {
        let ToPhone={};
        ToPhone["Id"] = element?.ContactId,
        ToPhone["Name"] = element?.ContactName,
        ToPhone["ToPhone"] = element?.PhoneNumber,
        PhoneList?.push(ToPhone);
      }); 
      this.sendSMSForm.patchValue({
        ToPhonesIds: PhoneList
      });
    } 
  }else{
    this.sendSMSForm.get('ToPhonesIds').reset();  
    this.StatusClientChecklist=false;
    this.AllStatusChecklist=false;
    this.PrimaryContactStatus=false;
    this.AllContactsStatus=false;
    this.ContactStatus=true;
    this.isNotValidSMS = true;
  }
 }
 showAll(){
   this.searchTextPhoneNo='';
 }

 statusClients(values){
  this.mappedPhones = [];
  this.clientmappedPhones=[];
  if(values===true){
    const arrayOfObjectsClient  = this.data?.selectedClient;
    let mappedPhones = arrayOfObjectsClient?.filter((obj, index, self) =>
          index === self?.findIndex((o) => o?.PhoneNo === obj?.PhoneNo)
        );
    this.mappedPhones =  mappedPhones?.filter(res=>res?.PhoneNo!='' && res?.PhoneNo!=null && res?.PhoneNo!=undefined);
    this.StatusClientChecklist=true;
    this.AllStatusChecklist=false;
    this.PrimaryContactStatus=false;
    this.AllContactsStatus=false;
    this.isNotValidSMS = false;
    this.UserType='CLIE';
    if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
      this.mappedPhones = [];
      this.sendSMSForm.get('ToPhonesIds').reset();  
      this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
      this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
      this.SmsList.setValidators([Validators.required]);
      this.SmsList.markAsTouched();
      this.sendSMSForm.get('ToPhonesIds').markAsTouched();
      this.isNotValidSMS = true;
    }else{
      this.isNotValidSMS = false;
      this.ContactStatus=false;
      let PhoneList:any[] = []; 
      this.mappedPhones?.forEach(element => {
        let ToPhone={};
        ToPhone["Id"] = element?.ClientId,
        ToPhone["Name"] = element?.ClientName,
        ToPhone["ToPhone"] = '+'+element?.PhoneCode+''+element?.PhoneNo,
        ToPhone["ContactId"] = element?.ClientId,
        ToPhone["ContactName"] = element?.ClientName,
        PhoneList?.push(ToPhone);
        this.sendSMSForm?.patchValue({
          ToPhonesIds: PhoneList
        })
      });
      this.clientmappedPhones= [...this.mappedPhones];
    }       
  }else{
   this.UserType='CONT';
   this.StatusClientChecklist=false;
   this.AllStatusChecklist=false;
   this.PrimaryContactStatus=false;
   this.AllContactsStatus=false;
   this.ContactStatus=true;
   this.isNotValidSMS = true;
   this.sendSMSForm?.get('ToPhonesIds').reset();  
  }
 }
 
 AllStatus(values){
  this.mappedPhones = [];
   if(values===true){
     this.allmappedPhones=[...this.AllContacts, ...this.PrimaryContacts,...this.clientmappedPhones];
     const arrayOfObjectStatus  = this.allmappedPhones;
    let allmappedPhones = arrayOfObjectStatus?.filter((obj, index, self) =>
          index === self?.findIndex((o) => o?.PhoneNumber === obj?.PhoneNumber)
        );
    this.mappedPhones =  allmappedPhones?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);
    this.StatusClientChecklist=false;
    this.AllStatusChecklist=true;
    this.PrimaryContactStatus=false;
    this.AllContactsStatus=false;
    this.isNotValidSMS = false;
    if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
      this.mappedPhones = [];
      this.sendSMSForm.get('ToPhonesIds').reset();  
      this.sendSMSForm.get("ToPhonesIds").setErrors({ required: true });
      this.sendSMSForm.get('ToPhonesIds').setValidators([Validators.required]);
      this.SmsList.setValidators([Validators.required]);
      this.SmsList.markAsTouched();
      this.sendSMSForm.get('ToPhonesIds').markAsTouched();
      this.isNotValidSMS = true;
    }else{
      this.isNotValidSMS = false;
      this.ContactStatus=false;
      let PhoneList:any[] = []; 
      this.mappedPhones?.forEach(element => {
        let ToPhone={};
        ToPhone["Id"] = element?.ContactId,
        ToPhone["Name"] = element?.ContactName,
        ToPhone["ToPhone"] = element?.PhoneNumber,
        PhoneList?.push(ToPhone);
        this.sendSMSForm?.patchValue({
          ToPhonesIds: PhoneList
        })
      });
    }       
  }else{
   this.StatusClientChecklist=false;
   this.AllStatusChecklist=false;
   this.PrimaryContactStatus=false;
   this.AllContactsStatus=false;
   this.ContactStatus=true;
   this.isNotValidSMS = true;
   this.sendSMSForm?.get('ToPhonesIds').reset();  
  }
 }
//by maneesh,when:21/05/2024 what:ewm-17100
 openMsgFilterModal() {
  const dialogRef = this.dialog.open(XeopleSearchMsgComponent, {
    data: { errorFieldData: this.errorField },
    panelClass: ['xeople-modal-sm', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
  })
}
}
