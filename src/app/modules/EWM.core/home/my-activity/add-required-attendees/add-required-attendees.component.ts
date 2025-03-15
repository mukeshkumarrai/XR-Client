/*
    @Type: File, <ts>
    @Name: add-required-attendees.component.ts
    @Who: Anup Singh
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: popup component for add-required-attendees
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ContactReceipentService } from 'src/app/shared/services/contact-recipient/contact-receipent.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
// import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
import {  Optional } from '@angular/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-required-attendees',
  templateUrl: './add-required-attendees.component.html',
  styleUrls: ['./add-required-attendees.component.scss']
})
export class AddRequiredAttendeesComponent implements OnInit {
  public loading: boolean = false;
  public loadingSearch:boolean = false;
  public saveStatus:boolean=false

  pagesize=500;
  pageNo = 1;
  public loadingPopup: boolean;
  public searchValue: string = "";
  public searchListAttendees: any = [];
  searchAttendees = [];
  maxMsg: boolean = false;
  noRecordFound: string;
  maxContactSelect: any;
  saveEnableDisable: boolean = true;
  activityForAttendees:string;
  isActivityRelated:boolean = false;
  clientIdData: any;
  isClientActive:boolean = true;
  popUpType: string ;
  labelFor = null;
  placeholderText;
  emailPlaceholder;
  isSelectType = false;
  public removable = true;
  invalidEmailError:boolean;
searchSubject$ = new Subject<any>();


  constructor(public dialogRef: MatDialogRef<AddRequiredAttendeesComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService,) {
    this.maxContactSelect = this.appSettingsService.maxSelectEmail;
    this.clientIdData=this.data?.clientIdData;
    if(this.clientIdData!=undefined){
      this.isClientActive = true;
    }else{
      this.isClientActive = false;
    }
    
    // EWM-8043 by-Adarsh singh 29-july-2022
    if (data?.popUpType == 'shareJob') {
      this.onChangeActivityRelatedTo('CAND');
      this.popUpType = 'shareJob';
      this.labelFor = 'CAND';
      this.placeholderText = this.translateService.instant('label_selectType');
      this.emailPlaceholder = this.translateService.instant('label_searchAndAddEmail');
      
    }else if(data?.popUpType == 'optionalAttendees'){
      this.popUpType = 'optionalAttendees';
      this.placeholderText = this.translateService.instant('label_usertype');
    /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10770 EWM-10648 @What: label correction **/

      this.emailPlaceholder = this.translateService.instant('label_search')+' '+this.translateService.instant('label_optionalAttendees');
    }else{/*** @When: 17-03-2023 @Who:Renu @Why: EWM-11055 EWM-11095 @What:  optional attendees handling **/
      this.popUpType = 'requiredAttendees';
      this.placeholderText = this.translateService.instant('label_usertype');
      this.emailPlaceholder = this.translateService.instant('label_search')+' '+this.translateService.instant('label_RequiredAttendees');
 
    }
    // End Adarsh 
  }

 
  ngOnInit(): void {
    this.searchAttendees = this.data.requiredAttendeesList;
    if (this.data?.popUpType == 'shareJob') {
      this.searchAttendees = [];
      }
  // this.activityForAttendees = this.data?.activityForAttendees

  this.searchSubject$.pipe(debounceTime(500)).subscribe(val => {
    this.multipleFunction(val)
  });
    
  }

/*
  @Type: File, <ts>
  @Name: onChangeActivityRelatedTo
  @Who: Anup Singh
  @When: 11-jan-2022
  @Why:EWM-4467 EWM-4529
  @What: 
  */
 onChangeActivityRelatedTo(activityFor){
   if(activityFor == "CAND" || activityFor == "EMPL" || activityFor == "CLIE" || activityFor == "JOB" ||
   activityFor == "CONT" || activityFor == "ATTE"){
    this.searchListAttendees = [];
    this.searchValue='';
    this.isActivityRelated = false;
    this.activityForAttendees = activityFor;
    this.noRecordFound = "";
    this.isSelectType = false;
   }else{
    this.searchListAttendees = [];
    this.searchValue='';
    this.noRecordFound = "";
    this.isActivityRelated = true;
    this.activityForAttendees = activityFor;

    if (this.data?.popUpType == 'shareJob') {
      this.isSelectType = true;
      this.isActivityRelated = false;
    }
   
   }
;
}

  /*
@Type: File, <ts>
 @Name: onsearchAttendees()
 @Who: Anup Singh
 @When: 08-jan-2022
 @Why:EWM-4467 EWM-4529
 @What: search for Attendees list
*/

  onsearchAttendees(inputValue: string) {
    this.searchValue = inputValue; //who:maneesh, what:ewm-16056, when:14/02/2024
    this.searchSubject$.next(inputValue);

  }
/* 
  @Type: File, <ts>
  @Name: onSearchFilterClear
  @Who: Adarsh singh
  @When: 21-07-22
  @Why: EWM-7916
  @What: For clear Filter search value
*/
public onSearchFilterClear(): void {
  this.loadingSearch = false;
  this.searchValue = '';
  this.onsearchAttendees(this.searchValue)
  this.invalidEmailError = false;
  this.saveEnableDisable = false;
}
  multipleFunction(inputValue){
    if(this.activityForAttendees==undefined || this.activityForAttendees==null || this.activityForAttendees== ''){
      this.isActivityRelated = true;
    }else{
      this.isActivityRelated = false;
    }

    if (inputValue.length === 0) {
      this.noRecordFound = "";
      this.searchListAttendees = [];
    }
    if (inputValue.length >0) { //who:maneesh, what:ewm-16056, when:14/02/2024
      this.loadingPopup = true;
      // this.searchValue = inputValue;
      if(this.activityForAttendees=="CAND"){
        this.systemSettingService.getAllJobForCandidate(inputValue).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.loadingPopup = false;
              this.searchListAttendees = repsonsedata.Data;
              if(repsonsedata.Data == null){
                this.noRecordFound = "label_noRecordFound";
              }else{
                this.noRecordFound = "";
              }
               this.maxMsg = false;
            }
            else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
              this.loadingPopup = false;
              this.noRecordFound = repsonsedata.Message;
              this.searchListAttendees = [];
              this.maxMsg = false;
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            }
            else {
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
              this.loadingPopup = false;
              this.noRecordFound = "";
              this.maxMsg = false;
            }
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            this.loadingPopup = false;
            this.noRecordFound = ""
            this.maxMsg = false;
          })
      }else if(this.activityForAttendees=="EMPL"){
        this.systemSettingService.getAllEmployeeForAttendees(inputValue).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.loadingPopup = false;
              this.searchListAttendees = repsonsedata.Data;
              if(repsonsedata.Data == null){
                this.noRecordFound = "label_noRecordFound";
              }else{
                this.noRecordFound = "";
              }
              // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
               this.maxMsg = false;
            }
            else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
              this.loadingPopup = false;
              this.noRecordFound = repsonsedata.Message;
              this.searchListAttendees = [];
              this.maxMsg = false;
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            }
            else {
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
              this.loadingPopup = false;
              this.noRecordFound = "";
              this.maxMsg = false;
            }
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            this.loadingPopup = false;
            this.noRecordFound = ""
            this.maxMsg = false;
          })
      }
      else if(this.activityForAttendees=="CLIE"){
        // api chnages by Adarsh singh for " CLIE " for EWM-9151 on 20 OCT 2022
          this.systemSettingService.getAllClientForAttendees(inputValue).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loadingPopup = false;
              this.searchListAttendees = repsonsedata.Data;
              if(repsonsedata.Data == null){
                this.noRecordFound = "label_noRecordFound";
              }else{
                this.noRecordFound = "";
              }
              // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
               this.maxMsg = false;
            }
            else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
              this.loadingPopup = false;
              this.noRecordFound = repsonsedata.Message;
              this.searchListAttendees = [];
              this.maxMsg = false;
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            }
            else {
              // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
              this.loadingPopup = false;
              this.noRecordFound = "";
              this.maxMsg = false;
            }
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            this.loadingPopup = false;
            this.noRecordFound = ""
            this.maxMsg = false;
          }) 
      }
      else if(this.activityForAttendees=="CONT"){
        this.getContacts(inputValue);
      }
       else{
         this.loadingPopup = false;
       }
 
    }

    if (this.activityForAttendees == 'ATTE') {
      if (inputValue.length >= 3) {
        this.getExternalAttendeeName(inputValue)
      }else{
        this.searchListAttendees = [];
      }
    }
  }
  /*
   @Type: File, <ts>
    @Name: AddSelectrequiredAttendeesList()
    @Who: Anup
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: add contact after searching in searchAttendees Array
  */
  AddSelectrequiredAttendeesList(userData: any,Name: string) {
    if (this.searchAttendees.length < this.maxContactSelect) {
      let condtion = this.activityForAttendees == "CONT" ? userData.ContactId : userData.Id
      let index;
      if (this.activityForAttendees == "ATTE") {
        index = this.searchAttendees.findIndex(x => x.Email === userData.Email);
        if (index !== -1) { }
        else {
          this.searchAttendees.push({
            'Id': condtion,
            'Name': userData.Name,
            'Email': userData.Email ? userData.Email : userData.EmailId,
            'Type': this.activityForAttendees == 'ATTE' ? 'External' : this.activityForAttendees
          })
          this.maxMsg = false;
        }
      }
      else{
        const index = this.searchAttendees.findIndex(x => x.Id === condtion );
        if (index !== -1) {} 
        else {
          // add conditions for pushing data by Adarsh singh for " CLIE " for EWM-9151 on 20 OCT 2022 (becoz res data Key is different that's why need to some extra code here)
          let arr:any = [];
          arr.push({
            'Id': this.activityForAttendees=="CONT" ? userData.ContactId : userData.Id,
            'Name': userData.Name,
            'Email': userData.Email ? userData.Email : userData.EmailId,
            'Type': this.activityForAttendees == 'ATTE' ? 'External' : this.activityForAttendees
            })
            this.searchAttendees = [...this.searchAttendees, ...arr]
          this.maxMsg = false;
        }
      }
      
    }
    else {
      this.maxMsg = true;
    }

    if (this.searchAttendees.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }

  }

  /*
      @Type: File, <ts>
       @Name: saveRequiredAttendees()
       @Who: Anup Singh
       @When: 08-jan-2022
       @Why:EWM-4467 EWM-4529
       @What: submit All selected contact
     */
  saveRequiredAttendees() {
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.searchAttendees); }, 200);
  }

 


  /*
@Type: File, <ts>
@Name: onrequiredAttendeesListRemove()
@Who: Anup Singh
@When: 08-jan-2022
@Why:EWM-4467 EWM-4529
@What: when Teammate remove from chip
*/
  onrequiredAttendeesListRemove(Id) {
    const index = this.searchAttendees.findIndex(x => x.Id === Id);
    if (index !== -1) {
      let arr:any = [...this.searchAttendees]
      arr.splice(index, 1);
      this.searchAttendees = [...arr]
      this.maxMsg = false;
    }

    if (this.searchAttendees.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }
  }



  /*
  @Type: File, <ts>
  @Name: onDismiss()
  @Who: Anup Singh
  @When: 08-jan-2022
  @Why:EWM-4467 EWM-4529
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddRequiredAttendees")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }


/* 
  @Type: File, <ts>
  @Name: addAttendees
  @Who: Renu
  @When: 20-March-2022
  @Why: EWM-11055 EWM-11410
  @What: to add disabled feature
*/
  addAttendees(user: { Id: any; Email:string}){
    let index;
    if (this.activityForAttendees == 'ATTE') {
      index = this.searchAttendees.findIndex(x => x.Email === user.Email);
    }
    else{
      index = this.searchAttendees.findIndex(x => x.Id === user.Id);
    }
    
    if (index !== -1) {
      return true;
          } else {
      return false;
    }
    
  }
  getContacts(inputValue){
    this.systemSettingService.getClientContactListAll(inputValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingPopup = false;
          this.searchListAttendees = repsonsedata.Data;
          if(repsonsedata.Data == null){
            this.noRecordFound = "label_noRecordFound";
          }else{
            this.noRecordFound = "";
          }
           this.maxMsg = false;
        }
        else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
          this.loadingPopup = false;
          this.noRecordFound = repsonsedata.Message;
          this.searchListAttendees = [];
          this.maxMsg = false;
        }
        else {
          this.loadingPopup = false;
          this.noRecordFound = "";
          this.maxMsg = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingPopup = false;
        this.noRecordFound = ""
        this.maxMsg = false;
      }) 
  }

  // EWM-15147 by-Adarsh singh 20-11-2023
  addExternalEmail(email) {
    if (this.activityForAttendees == 'ATTE' && email) {
      if (this.validateEmail(email)) {
        const index = this.searchAttendees.findIndex(x => x.Email === email);
        if (index == -1) {
        this.searchListAttendees = [];
          this.searchAttendees.push({
            'Id': '',
            // 'Name': email,
            'Email': email,
            'Type': this.activityForAttendees == 'ATTE' ? 'External' : this.activityForAttendees
          })
          this.searchValue = '';
          this.saveEnableDisable = false;
        }
      }
    }
  }
  // EWM-15147 by-Adarsh singh 20-11-2023
  validateEmail(email) {
    if (email?.trim()?.length>1) {
      var regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return regex.test(email);
    }
    else{
      return false;
    }
    
  }

  // EWM-15147 by-Adarsh singh 20-11-2023
  checkAttendeesEmail(email){
    let res = this.validateEmail(email);
    if (email?.trim()?.length>1) {
      if (res) {
        this.invalidEmailError = false;
        this.saveEnableDisable = false;
      }
      else {
        this.invalidEmailError = true;
        this.saveEnableDisable = true;
      }
    }else{
      this.invalidEmailError = false;
      this.saveEnableDisable = false;
    }
  }
  // EWM-15147 by-Adarsh singh 30-11-2023
  getExternalAttendeeName(inputValue){
    this.systemSettingService.getExternalAttendees('?search='+inputValue).subscribe(
      (repsonsedata: any) => {
        
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingPopup = false;
          let arr:any = [];
          repsonsedata.Data?.forEach(element => {
            arr.push({...element,Id: this.generateGuid()})
          });
          this.searchListAttendees = [...arr]
          
          if(repsonsedata.Data == null){
            this.noRecordFound = "label_noRecordFound";
          }else{
            this.noRecordFound = "";
          }
          this.maxMsg = false;
          if (inputValue.length >= 3) {
            this.searchListAttendees = repsonsedata.Data;
          }
        }
        else if (repsonsedata.HttpStatusCode === 400 || repsonsedata.Data == null) {
          this.loadingPopup = false;
          this.searchListAttendees = [];
          this.maxMsg = false;
          this.checkAttendeesEmail(inputValue)
        }
        else {
          this.loadingPopup = false;
          this.noRecordFound = "";
          this.maxMsg = false;
          this.checkAttendeesEmail(inputValue)
        } 
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingPopup = false;
        this.noRecordFound = ""
        this.maxMsg = false;
      }) 
  }

  // EWM-15147 by-Adarsh singh 30-11-2023
    generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}