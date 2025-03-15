import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ContactReceipentService } from 'src/app/shared/services/contact-recipient/contact-receipent.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
import {  Optional } from '@angular/core';
import { QuickAddContactComponent } from '../../quick-add-contact/quick-add-contact.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-company-contact-popup',
  templateUrl: './company-contact-popup.component.html',
  styleUrls: ['./company-contact-popup.component.scss']
})
export class CompanyContactPopupComponent implements OnInit {

  public loading: boolean = false;
  public contactRelatedTypeList: any = [];
  public loadingSearch:boolean = false;

  public saveStatus:boolean=false
    // @Who: Bantee Kumar,@Why:EWM-11134,@When: 11-Mar-2023,@What: Page size default will be 200.

  pagesize=200;
  pageNo = 1;
  public loadingPopup: boolean;
  public searchValue: string = "";
  public searchListUser: any = [];
  searchContact = [];
  maxMsg: boolean = false;
  noRecordFound: string;
  maxContactSelect: any;
  saveEnableDisable: boolean = true;
  constructor(public dialogRef: MatDialogRef<CompanyContactPopupComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService,public dialog: MatDialog) {

    this.maxContactSelect = this.appSettingsService.maxSelectEmail;
  }

 
  ngOnInit(): void {
    this.searchContact = this.data.clientContact;
  }



  /*
@Type: File, <ts>
 @Name: onsearchContact()
 @Who: Anup Singh
  @When: 13-Dec-2021
  @Why: EWM-3695 EWM-4124
 @What: search for contact list
*/
  onsearchContact(inputValue: string) {
    if (inputValue.length === 0) {
      this.noRecordFound = "";
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      this.loadingPopup = true;
     this.searchValue = inputValue;
      this.systemSettingService.getClientContactList(this.pagesize, this.pageNo, inputValue).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loadingPopup = false;
            this.searchListUser = repsonsedata.Data;
            this.noRecordFound = "";

  //           if(setContact){
  //  const newContact=this.searchListUser.filter((x:any)=>x.Name==inputValue);
  // if(newContact.length){this.searchContact.push(newContact[0]);}
  // }
// if(this.searchContact){
//   this.AddSelectClientContact(this.searchContact)
// }
            
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
             this.maxMsg = false;
          }
          else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
            this.loadingPopup = false;
            this.noRecordFound = repsonsedata.Message;
            this.searchListUser = [];
            this.maxMsg = false;
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
          else if(repsonsedata.HttpStatusCode === 204 && repsonsedata.Data == null){
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.loadingPopup = false;
            this.searchListUser = [];
           
             this.noRecordFound='No Records Found';
           
            this.maxMsg = false;
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
  }

  /*
   @Type: File, <ts>
    @Name: AddSelectClientContact()
    @Who: Anup
    @When: 13-Dec-2021
    @Why: EWM-3695 EWM-4124
    @What: add contact after searching in searchcontact Array
  */
  AddSelectClientContact(userData: any) {

    if (this.searchContact.length < this.maxContactSelect) {
      const index = this.searchContact.findIndex(x => x.Id === userData.Id);
      if (index !== -1) {
        //  this.searchTeammate.splice(index, 1);
        
      } else {
        this.searchContact.push({
          'Id': userData.Id,
          'Name': userData.Name,
        })
        this.maxMsg = false;
      }
    }
    else {
      this.maxMsg = true;
    }

    if (this.searchContact.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }

  }

  /*
      @Type: File, <ts>
       @Name: saveTeamMates()
       @Who: Anup Singh
       @When: 13-Dec-2021
       @Why: EWM-3695 EWM-4124
       @What: submit All selected contact
     */
  saveTeamMates() {
    document.getElementsByClassName("AddContactForCompany")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddContactForCompany")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.searchContact); }, 200);
  }

 


  /*
@Type: File, <ts>
@Name: onClientContactRemove()
@Who: Anup Singh
@When: 13-Dec-2021
@Why: EWM-3695 EWM-4124
@What: when Teammate remove from chip
*/
  onClientContactRemove(Id) {
    const index = this.searchContact.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.searchContact.splice(index, 1);
      this.maxMsg = false;
    }

    if (this.searchContact.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }
  }



  /*
  @Type: File, <ts>
  @Name: onDismiss()
  @Who: Anup Singh
  @When: 13-Dec-2021
  @Why: EWM-3695 EWM-4124
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("AddContactForCompany")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddContactForCompany")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }


   /*
  @Type: File, <ts>
  @Name: openQuickAddContactModal()
  @Who: Bantee Kumar
  @When: 10-March-2023
  @Why: EWM-10656 EWM-11050
  @What: open the openQuickAddContactModal
  */
  openQuickAddContactModal() {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickAddContactComponent, {
      // maxWidth: "1000px",
      // width: "90%",
      // maxHeight: "85%",
      data: new Object({ formType:"AddInstantContact"}),
      panelClass: ['xeople-modal-full-screen', 'quickAddContact', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    
    dialogRef.afterClosed().subscribe(userData => {
      //this.result = dialogResult;
    // this.onsearchContact(userData.FirstName+' '+userData.LastName, true);

     
       // const newContact=this.searchListUser.filter((x:any)=>x.Id==userData.Id);
      // if(newContact.length){this.searchContact.push(newContact[0]);}

    

       if(userData && userData.StatusName!='Inactive'){
      this.searchContact.push({
        'Id': userData.Id,
        'Name': userData.FirstName+' '+userData.LastName,
      })
    }
    });
  }

  addContact(user){
    const index = this.searchContact.findIndex(x => x.Id === user.Id);
    if (index !== -1) {
      return true;
          } else {
      return false;
    }
    
  }

}