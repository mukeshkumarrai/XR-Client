/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 16-Sep-2021
  @Why: EWM-2861
  @What: This page will be use for the manage access template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ManageAccessService } from 'src/app/modules/EWM.core/shared/services/candidate/manage-access.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { RemoveAccessListComponent } from 'src/app/modules/EWM-Candidate/candidate-document/manage-access/remove-access-list/remove-access-list.component';
import { ClientService } from '../../shared/services/client/client.service';


@Component({
  selector: 'app-client-visibility',
  templateUrl: './client-visibility.component.html',
  styleUrls: ['./client-visibility.component.scss']
})
export class ClientVisibilityComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
  addForm: FormGroup;
  public loading: boolean = false;
  public submitted = false;
  public AddObj = {};
  selectedAccessModeId = 1;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchUserCtrl = new FormControl();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  clientAccessModeList: any = [];
  userSelectedList: any = [];
  searchUserList: any = [];
  public searchValue: string = "";
  userListLengthMore: any = 5;
  public loadingSearch: boolean;
  orgId: any;
  public searchListUser: any = [];
  FolderId: any;
  FolderName: any;
  clientId: any;
  clientName:any;
  UserName: any;
  AccessName;
  AccessId = 2;
  PermissionName;
  Link = 'https://sso-client-dev-ewm.entiredev.in/';
  public divStatus: boolean = false;
  public divprotected: boolean = false;
  public divpublic: boolean = false;
  public divprivate: boolean = false;
  maxMessage = 1000;
  currentUser: any;
  accessModeId;
  PermissionNameEditStatus;
  public PreviewUrl: string;
  /* 
   @Type: File, <ts>
   @Name: constructor function
   @Who: Nitin Bhati
   @When: 16-Sep-2021
   @Why: EWM-2859
   @What: For injection of service class and other dependencies
  */
  constructor(public dialogRef: MatDialogRef<ClientVisibilityComponent>, public dialog: MatDialog,private _appSetting: AppSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService,
    private snackBService: SnackBarService, private _ManageAccessService: ManageAccessService,private clientService:ClientService, private _CommonserviceService: CommonserviceService) {
    this.PreviewUrl = "/assets/user.svg";
    this.clientId = data.clientId;
    this.clientName = data.clientName;
   
    this.addForm = this.fb.group({
      Id: [''],
      AccessId: [''],
      PermissionName: [''],
      PermissionNameView: [true],
      PermissionNameEdit: []
    });
  }

  ngOnInit(): void {
    this.getClientAccessMode();
    this.getClientAccessModeById();
    this.orgId = localStorage.getItem('OrganizationId'); 
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));   
    this.currentUser = tenantData;
    if (this.AccessId === 3) {
      this.selectedAccessModeId = this.AccessId;   
      this.divprivate = false;
      this.divprotected = true;      
      this.divpublic = false;
      this.addForm.controls["PermissionNameEdit"].enable();
    } else if (this.AccessId === 2) {
      this.divprotected = false;
      this.divprivate = false;
      this.divpublic = true;
      this.selectedAccessModeId = this.AccessId;
      this.addForm.controls["PermissionNameEdit"].enable();
    } else {
      this.selectedAccessModeId = this.AccessId;
      this.divpublic = false;
      this.divprivate = true;
      this.divprotected = false;
      this.addForm.patchValue({
        PermissionNameEdit: true,
      });
     // this.addForm.controls["PermissionNameEdit"].disable();
    }

  }

  /* 
    @Type: File, <ts>
    @Name: getClientAccessMode function
    @Who:  Suika
    @When: 03-Dec-2021
    @Why: EWM-3867
    @What: get Client Access Mode List
    */
  public getClientAccessMode() {
    this.loading = true;
    this.clientService.getClientAccessModeList().subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.clientAccessModeList = repsonsedata.Data;
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
    @Name: getClientAccessModeById function
    @Who:  Suika
    @When: 03-Dec-2021
    @Why: EWM-3867
    @What: get Client Access Mode List
    */
   public getClientAccessModeById() {
    this.loading = true;
    this.clientService.getClientAccessModeListById("?ClientId="+this.clientId).subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.clickAccessData({Id:repsonsedata.Data.VisibilityType,Name:repsonsedata.Data.VisibilityName});
          this.selectedAccessModeId = repsonsedata.Data.VisibilityType
          if(repsonsedata.Data.PermissionType==2){
            this.addForm.patchValue({
              PermissionNameEdit: true,
              PermissionNameView:true
            });
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
   @Name: onSave function
   @Who:  Suika
   @When: 03-Dec-2021
   @Why: EWM-3867
   @What: For Data save to serve
  */
  onSave(value: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.createManageAccess(value);
  }
  /* 
     @Type: File, <ts>
     @Name: createManageAccess function
     @Who:  Suika
     @When: 03-Dec-2021
     @Why: EWM-3867
     @What: For saving manage access data
    */
  createManageAccess(value: any) {
    let clientAccessModeListById = this.clientAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = clientAccessModeListById[0].Name;
    if (value.PermissionNameEdit === true) {
      this.PermissionName = 'edit';
    } else {
      this.PermissionName = 'view';
    }
    this.loading = true;
    this.AddObj['VisibilityType'] = this.AccessId;
    this.AddObj['VisibilityName'] = this.AccessName;
    this.AddObj['PermissionType'] = this.PermissionName;
    this.AddObj['ClientId'] = this.clientId;
    this.AddObj['ClientName'] = this.clientName;
    this.AddObj['UserName'] = this.currentUser.FirstName + ' ' + this.currentUser.LastName;
    //this.AddObj['Link'] = this._appSetting.baseUrl;
    this.clientService.createGrantClientAccess(this.AddObj).subscribe((repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        document.getElementsByClassName("edit-visibilty")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("edit-visibilty")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(true); }, 200);
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
     @Name: clickAccessData
     @Who:  Suika
     @When: 03-Dec-2021
     @Why: EWM-3867
     @What: for hide and show div
  */
  public clickAccessData(accessData: any) {
    this.AccessName = accessData.Name;
    this.AccessId = accessData.Id;
    if (accessData.Id === 3) {
      this.divprotected = true;
      this.divprivate = false;
      this.divpublic = false;
      this.addForm.patchValue({
        PermissionNameEdit: false,
      });
      this.addForm.controls["PermissionNameEdit"].enable();
    } else if (accessData.Id === 2) {
      this.divprivate = false;
      this.divpublic = true;
      this.divprotected = false;
      this.addForm.patchValue({
        PermissionNameEdit: false,
      });
      this.addForm.controls["PermissionNameEdit"].enable();
    } else {
       this.divpublic = false;
       this.divprotected = false;
       this.divprivate = true;
      this.addForm.patchValue({
        PermissionNameEdit: true,
      });
     // this.addForm.controls["PermissionNameEdit"].disable();
      //this.PermissionNameEditStatus='disabled';
    }
  }
  /*
     @Type: File, <ts>
     @Name: openRemoveAccessModal
     @Who:  Suika
     @When: 03-Dec-2021
     @Why: EWM-3867
     @What: to open remove access
  */
  public openRemoveAccessModal() {
    let clientAccessModeListById = this.clientAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = clientAccessModeListById[0].Name;
    const dialogRef = this.dialog.open(RemoveAccessListComponent, {
      maxWidth: "1000px",
      data: new Object({
        FolderId: this.FolderId, FolderName: this.FolderName,
        AccessId: this.AccessId, AccessName: this.AccessName,
        candidateId: this.clientId
      }),
      width: "95%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'remove_Access', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    })
  }
  /* 
   @Type: File, <ts>
   @Name: onMessage function
   @Who:  Suika
   @When: 03-Dec-2021
   @Why: EWM-3867
   @What: For showing max message validation
   */
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 1000 - value.length;
    }
  }
  /* 
   @Type: File, <ts>
   @Name: clickMoreRecord function
   @Who:  Suika
   @When: 03-Dec-2021
   @Why: EWM-3867
   @What: For showing more chip data
   */
  public clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }
  /*
    @Name: onDismiss
    @Who:  Suika
    @When: 03-Dec-2021
    @Why: EWM-3867
    @What: Function will call when user click on cancel button.
  */
  onDismiss(): void {
    document.getElementsByClassName("edit-visibilty")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("edit-visibilty")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();

  }

}



