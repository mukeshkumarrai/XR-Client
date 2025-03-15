
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
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
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ShareResumeInternalComponent } from '../share-resume-internal/share-resume-internal.component';


@Component({
  selector: 'app-share-resume',
  templateUrl: './share-resume.component.html',
  styleUrls: ['./share-resume.component.scss']
})
export class ShareResumeComponent implements OnInit {
  /**********************global variables decalared here **************/
  phone: any = [];
  shareDocUserList: any = [];
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
  public loading: boolean;
  public loadingSearch: boolean;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  public searchValue: string = "";
  searchUserCtrl = new FormControl();
  EmailList = new FormControl('', [Validators.required])//@when:1-nov-2021;@who:Priti Srivastva;@why: EWM-3465-->
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList: ElementRef<HTMLInputElement>;

  documentAccessModeList: any = [];
  userSelectedList: any = [];
  searchUserList: any = [];
  currentUser: any;
  docName: any;
  docId: any;
  ResumeLink: any;
  maxMessage = 1000;
  userListLengthMore: any = 5;
  public PreviewUrl: string;
  baseUrl: any;
  Link = 'https://sso-client-dev-ewm.entiredev.in/';
  //emailpattern: string = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  isNotValidEmail: boolean = false;

  constructor(public dialogRef: MatDialogRef<ShareResumeComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService, private _Service: DocumentCategoryService,
    public dialog: MatDialog, private translateService: TranslateService, private appConfigService: AppSettingsService, public systemSettingService: SystemSettingService) {
    this.PreviewUrl = "/assets/user.svg";
    this.emailPattern=this.appConfigService.emailPattern;
    if (data) {
      // console.log("documentData ",data.documentData);
      this.docName = data.documentData.Name;
      this.docId = data.documentData.Id;
      this.ResumeLink = data.documentData.ResumeLink;
      this.candidateId = data.candidateId;
      this.candidateName = data.candidateName;
      this.activityStatus = data.formType;
    }
    this.baseUrl = appConfigService.baseUrl;
    // console.log(this.baseUrl,"baseUrl");
    this.addForm = this.fb.group({
      Id: [''],
      ToEmailIds: [[]],
      SharedLink: [`${this.appConfigService.ExternalSharedLink}`]
    });
  }

  ngOnInit() {
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData;
  }

  /* 
    @Type: File, <ts>
    @Name: remove function
    @Who: Suika
    @When: 28-Sept-2022
    @Why: EWM-5342
    @What: get remove chips skills
    */
  remove(Id): void {
    const index = this.userSelectedList.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.userSelectedList.splice(index, 1);
    }
    if (this.userSelectedList.length > 0) {
    } else {
      this.EmailList.setValue('');
    }

  }
  /* 
   @Type: File, <ts>
   @Name: selectedUserEmail function
   @Who: Suika
   @When: 28-Sept-2022
   @Why: EWM-5342
   @What: get selected user name and email List
   */
  public selectedUserEmail(event: MatAutocompleteSelectedEvent): void {
    let duplicateCheck = this.userSelectedList.filter(x => x['FullNameEmail'] === event.option.value.FullNameEmail);
    if (duplicateCheck.length == 0) {
      this.userSelectedList.push({
        'UserId': event.option.value.UserId,
        'EmailId': event.option.value.Email,
        'TypeId': event.option.value.Id,
        'Type': event.option.value.Type,
        'FullNameEmail': event.option.value.FullNameEmail,
        'GroupEmails': event.option.value.GroupEmails
      });
    }
    if (this.userSelectedList.length > 0) {
      this.EmailList.setValue(this.userSelectedList);
    }
    this.nameInput.nativeElement.value = '';
    this.searchUserCtrl.setValue(null);
  }


  public onMessage(value) {
    if (value != undefined && value != null) {
      this.maxMessage = 1000 - value.length;
    }


  }


  public clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }



  /* 
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Suika
    @When: 28-Sept-2022
    @Why: EWM-5342
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {
    this.shareDocument();
  }


  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();

  }


  shareDocument() {
    if (this.addForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let SharedEmailIds = [];
    this.userSelectedList.forEach(element => {
      if (element.Type == 'group') {
        if (element.GroupEmails.length > 0) {
          SharedEmailIds.push(element.GroupEmails.toString());
        }
      } else {
        SharedEmailIds.push(element.EmailId);
      }
    })
    createPeopJson['ResumeLink'] = this.ResumeLink;
    createPeopJson['DocumentId'] = this.docId;
    createPeopJson['DocumentName'] = this.docName;
    createPeopJson['Message'] = this.addForm.value.message;
    createPeopJson['CandidateId'] = this.candidateId;
    createPeopJson['CandidateName'] = this.candidateName;
    createPeopJson['SharedEmailIds'] = SharedEmailIds;
    createPeopJson['UserName'] = this.currentUser.FirstName + ' ' + this.currentUser.LastName;
    createPeopJson['SharedLink'] = this.addForm.value.SharedLink;
    createPeopJson['SharedDocumentType'] = "Resume",
      createPeopJson['PageName'] = 'Share Resume';
    createPeopJson['BtnId'] = 'btnSave';

    this._Service.shareResume(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addForm.reset();
          document.getElementsByClassName("resume-docs")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("resume-docs")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

isEmail;
  addEmail(value) {
    
    if (value == '') {
       this.isNotValidEmail = false 
      this.addForm.get("ToEmailIds").clearValidators();
      this.addForm.get("ToEmailIds").markAsPristine();
     
      if (this.userSelectedList.length > 0) {
        this.isNotValidEmail = false;
        this.addForm.get("ToEmailIds").clearValidators();
        this.addForm.get("ToEmailIds").markAsPristine();
        // this.addForm.get("ToEmailIds").setErrors({ required: false });
        // this.addForm.get("ToEmailIds").updateValueAndValidity();
      } else {
        this.addForm.get("ToEmailIds").setErrors({ required: true });
        this.addForm.get('ToEmailIds').setValidators([Validators.required]);
        this.isNotValidEmail = false;
      }
      return;
    }
    if (value.toLowerCase().match(this.emailPattern) == null) {
      this.isNotValidEmail = true;
      this.addForm.get("ToEmailIds").setErrors({ pattern: true });
      this.addForm.get("ToEmailIds").markAsDirty();
      return;
    }
    if(this.userSelectedList.length > 0){
      this.addForm.get("ToEmailIds").clearValidators();
      this.addForm.get("ToEmailIds").markAsPristine();
    }else{
      this.addForm.get("ToEmailIds").clearValidators();
      this.addForm.get("ToEmailIds").markAsPristine();
    }
    let duplicateCheck = this.userSelectedList.filter(x => x.email === value);
    if (duplicateCheck.length > 0) {
      this.isNotValidEmail = false;
      this.addForm.get("ToEmailIds").setErrors({ hasEamil: true });
      this.addForm.get("ToEmailIds").markAsDirty();
      return;
    }
    let emailnode;
    if (this.userSelectedList.length == 0) {
      this.isNotValidEmail = false;

      emailnode = {
        id: 1,
        email: value,
        EmailId: value,
        FullNameEmail: value
      };
    } else {
      this.isNotValidEmail = false;
      emailnode = {
        id: (this.userSelectedList[this.userSelectedList.length - 1].id) + 1,
        email: value,
        EmailId: value,
        FullNameEmail: value
      };

    }
    this.userSelectedList.push(emailnode);
    if (this.userSelectedList.length > 0) {
      this.EmailList.setValue(this.userSelectedList);
      this.isNotValidEmail = false;
    }
    this.nameInput.nativeElement.value = '';
    this.searchUserCtrl.setValue(null);
  }


  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Suika
    @When: 28-Sept-2022
    @Why: EWM-5342
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    document.getElementsByClassName("resume-docs")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("resume-docs")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }





  /*
   @Type: File, <ts>
   @Name: confirmShareDocument
   @Who: Suika
   @When: 28-Sept-2022
   @Why: EWM-5342
   @What: To confirm share document as an attachment.
   */


  confirmShareDocument() {
    let documentData = {};
    documentData['Name'] = this.docName ? this.docName : 'Resume';
    documentData['ResumeLink'] = this.ResumeLink;
    documentData['Id'] = this.docId;
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ShareResumeInternalComponent, {
      data: new Object({ documentData: documentData, candidateId: this.candidateId, candidateName: this.candidateName }),
      panelClass: ['xeople-modal', 'share-resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult != "") {
        dialogResult.data.forEach(element => {
          this.userSelectedList.push(element);
        });
        if (this.userSelectedList.length > 0) {
          this.EmailList.setValue(this.userSelectedList);
          this.addForm.get('ToEmailIds').patchValue(this.userSelectedList);
        }
      }
    });
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
