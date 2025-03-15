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
import { RemoveAccessListComponent } from './remove-access-list/remove-access-list.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss']
})
export class ManageAccessComponent implements OnInit {

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
  EmailList=new FormControl();//@when:29-oct-2021;@who:Priti Srivastva;@why: EWM-3470
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  documentAccessModeList: any = [];
  userSelectedList: any = [];
  searchUserList: any = [];
  public searchValue: string = "";
  userListLengthMore: any = 5;
  public loadingSearch: boolean;
  orgId: any;
  public searchListUser: any = [];
  FolderId: any;
  FolderName: any;
  candidateId: any;
  ToEmailIds: any;
  UserName: any;
  AccessName;
  AccessId;
  PermissionName;
  //Link = 'https://sso-client-dev-ewm.entiredev.in/';
  public divStatus: boolean = false;
  public isPublic: boolean = false;
  public isPrivate: boolean = false;
  maxMessage = 1000;
  currentUser: any;
  accessModeId;
  PermissionNameEditStatus;
  public PreviewUrl: string;
  public emailNotExist : boolean = false;
  matchAcessDesc:any = '';
  selectedAcessModeOptions;
  candidateName;
  activatedRoute:any;

  /* 
   @Type: File, <ts>
   @Name: constructor function
   @Who: Nitin Bhati
   @When: 16-Sep-2021
   @Why: EWM-2859
   @What: For injection of service class and other dependencies
  */
  constructor(public dialogRef: MatDialogRef<ManageAccessComponent>, public dialog: MatDialog,private _appSetting: AppSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService,
    private snackBService: SnackBarService, private _ManageAccessService: ManageAccessService, private _CommonserviceService: CommonserviceService,
    private appSettingsService:AppSettingsService,private routes: ActivatedRoute,private route: Router) {
    this.PreviewUrl = "/assets/user.svg";
    this.candidateId = data.candidateId;
    this.FolderId = data.Id;
    this.FolderName = data.Name;
    this.AccessId = data.AccessModeId; 
    this.candidateName = data?.candidateName;
    if(this.AccessId==1){
      this.matchAcessDesc = 'Private';
    }else if(this.AccessId==2){
      this.matchAcessDesc = 'Public';
    }if(this.AccessId==3){
      this.matchAcessDesc = 'Protected';
    }
   
    this.addForm = this.fb.group({
      Id: [''],
      AccessId: [''],
      PermissionName: [''],
     // PermissionNameView: [true],
     // PermissionNameEdit: [],
      ToEmailIds: [''],
     // Message: ['', [Validators.maxLength(1000)]],
      View: [false],
      Edit: [false],
      Delete: [false]
    });
  }

  ngOnInit(): void {
    this.getDocumentAccessMode();
    this.orgId = localStorage.getItem('OrganizationId'); 
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData;
    if (this.AccessId === 3) {
      this.selectedAccessModeId = this.AccessId;
      this.EmailList.setValidators([Validators.required]);
      this.EmailList.updateValueAndValidity();
      this.divStatus = true;
      
    } else if (this.AccessId === 2) {
      this.divStatus = false;
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.selectedAccessModeId = this.AccessId;
    } else {
      this.selectedAccessModeId = this.AccessId;
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.divStatus = false;
      this.addForm.patchValue({
        PermissionNameEdit: true,
      });
    }
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.

//When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.
    // this.activatedRoute = this.routes.url;

    // this.route.navigate([],{
    //   relativeTo: this.activatedRoute,
    //   queryParams: { search: this.FolderName },
    //   queryParamsHandling: 'merge'
    // });
  }

  /* 
    @Type: File, <ts>
    @Name: getDocumentAccessMode function
    @Who: Nitin Bhati
    @When: 16-Sep-2021
    @Why: EWM-2859
    @What: get Document Access Mode List
    */
  public getDocumentAccessMode() {
    this.loading = true;
    this._ManageAccessService.getManageAccessModeList().subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.documentAccessModeList = repsonsedata.Data.filter(x => x['Status'] === 1);
          this.selectedAcessModeOptions = repsonsedata.Data.filter(x => x['Id'] === this.AccessId);
          this.clickAccessData(this.selectedAcessModeOptions[0]);
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
    @Name: onsearchByName function
    @Who: Nitin Bhati
    @When: 16-Sep-2021
    @Why: EWM-2859
    @What: get skills List
    */
  public onsearchByName(inputValue: string) {
    if (inputValue.length === 0) {
      this.searchUserList = [];
      this.loadingSearch = false;
    }
    if (inputValue.length > 0 && inputValue.length > 3) {
      this.searchValue = inputValue;
      this.loadingSearch = true;
      this._ManageAccessService.getSearchUserWithGroup("?search=" + inputValue).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 ) {
            this.searchUserList = repsonsedata.Data;
            this.loadingSearch = false;
          }else if (repsonsedata.HttpStatusCode === 204) {
            this.emailNotExist = true;
            this.searchUserList = [];
            this.loadingSearch = false;
          } else {
            this.loadingSearch = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })

    }
  }
  /* 
    @Type: File, <ts>
    @Name: remove function
    @Who: Nitin Bhati
    @When: 16-Sep-2021
    @Why: EWM-2859
    @What: get remove chips skills
    */
  remove(Id: any): void {
    const index = this.userSelectedList.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.userSelectedList.splice(index, 1);
    }
    if (this.userSelectedList.length > 0) {
    } else {
      this.EmailList.setValue('');
      this.EmailList.setValidators([Validators.required]);
      this.EmailList.updateValueAndValidity();
    }
  }
  /* 
   @Type: File, <ts>
   @Name: selectedUserEmail function
   @Who: Nitin Bhati
   @When: 16-Sep-2021
   @Why: EWM-2859
   @What: get selected user name and email List
   */
  arr = [];
  public selectedUserEmail(event: MatAutocompleteSelectedEvent): void {
    let duplicateCheck = this.userSelectedList.filter(x => x['EmailId'] === event.option.value.Email);
    if (duplicateCheck.length == 0) {
      this.userSelectedList.push({
        'UserId': event.option.value.UserId,
        'EmailId': event.option.value.Email,
        'FullNameEmail': event.option.value.FullName + '(' + event.option.value.Email + ')',
      });
      if(this.userSelectedList.length>0)
      { this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
    }
   
    this.nameInput.nativeElement.value = '';
    this.searchUserCtrl.setValue(null);
  }
  /* 
   @Type: File, <ts>
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 16-Sep-2021
   @Why: EWM-2859
   @What: For Data save to serve
  */
  onSave(value: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.createManageAccess(value);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /* 
     @Type: File, <ts>
     @Name: createManageAccess function
     @Who: Nitin Bhati
     @When: 16-Sep-2021
     @Why: EWM-2859
     @What: For saving manage access data
    */
  createManageAccess(value: any) {
    let documentAccessModeListById = this.documentAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = documentAccessModeListById[0].AccessName;
    if(this.AccessId === 1) {
      this.PermissionName = 'view';
    } else {
      this.PermissionName = 'edit';
    }
    this.loading = true;
    this.AddObj['Id'] = this.FolderId;
    this.AddObj['Name'] = this.FolderName;
    this.AddObj['AccessId'] = this.AccessId;
    this.AddObj['AccessName'] = this.AccessName;
    this.AddObj['PermissionName'] = this.PermissionName;
    this.AddObj['Message'] = value.Message;
    this.AddObj['CandidateId'] = this.candidateId;
    this.AddObj['CandidateName'] = this.candidateName;
    this.AddObj['UserName'] = this.currentUser.FirstName + ' ' + this.currentUser.LastName;
    this.AddObj['ToEmailIds'] = this.userSelectedList;
    this.AddObj['Link'] = window.location.href;//@when:28-oct-2021;@who:Priti Srivastva;@why: Link should be dynamic 
    this._ManageAccessService.createGrantDocumentAccess(this.AddObj).subscribe((repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        document.getElementsByClassName("add_manageAccess")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("add_manageAccess")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(false); }, 200);
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
     @Who: Nitin Bhati
     @When: 17-Sep-2021
     @Why: EWM-2859
     @What: for hide and show div
  */
  public clickAccessData(accessData: any) {   
    this.AccessName = accessData.AccessName;
    this.AccessId = accessData.Id;
    this.matchAcessDesc = accessData.AccessName;
    if (accessData.Id === 3) {
      this.divStatus = true;
      this.isPublic = false;
      this.isPrivate = false;
      //@when:29-oct-2021;@who:Priti Srivastva;@why: EWM-3470
      this.EmailList.setValidators([Validators.required]);
      this.EmailList.updateValueAndValidity();
      this.addForm.patchValue({
        PermissionNameEdit: false,
        View: false,
        Edit: false,
        Delete: false
      });
      this.addForm.patchValue({
        View: accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
    //  this.addForm.controls["PermissionNameEdit"].enable();
    } else if (accessData.Id === 2) {
      this.divStatus = false;
      this.isPublic = true;
      this.isPrivate = false;
      //@when:29-oct-2021;@who:Priti Srivastva;@why: EWM-3470
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.addForm.patchValue({
        PermissionNameEdit: false,
        View: false,
        Edit: false,
        Delete: false
      });

      this.addForm.patchValue({
        View: accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
      //this.addForm.controls["PermissionNameEdit"].enable();
    } else {
      this.isPublic = false;
      this.isPrivate = true;
       this.divStatus = false;//@when:28-oct-2021;@who:Priti Srivastava;@why: EWM-3475 
     //@when:29-oct-2021;@who:Priti Srivastva;@why: EWM-3470
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.addForm.patchValue({
        PermissionNameEdit: true,
        View: false,
        Edit: false,
        Delete: false
      });
      this.addForm.patchValue({
        View: accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
     // this.addForm.controls["PermissionNameEdit"].disable();
      //this.PermissionNameEditStatus='disabled';
    }
  }
  /*
     @Type: File, <ts>
     @Name: openRemoveAccessModal
     @Who: Nitin Bhati
     @When: 17-Sep-2021
     @Why: EWM-2859
     @What: to open remove access
  */
  public openRemoveAccessModal() {
    let documentAccessModeListById = this.documentAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = documentAccessModeListById[0].AccessName;
    const dialogRef = this.dialog.open(RemoveAccessListComponent, {
      maxWidth: "1000px",
      data: new Object({
        FolderId: this.FolderId, FolderName: this.FolderName,
        AccessId: this.AccessId, AccessName: this.AccessName,
        candidateId: this.candidateId
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
   @Who: Nitin Bhati
   @When: 17-Sep-2021
   @Why: EWM-2859
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
   @Who: Nitin Bhati
   @When: 17-Sep-2021
   @Why: EWM-2859
   @What: For showing more chip data
   */
  public clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }
  /*
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 16-Sep-2021
    @Why: EWM-2859
    @What: Function will call when user click on cancel button.
  */
  onDismiss(): void {
    document.getElementsByClassName("add_manageAccess")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_manageAccess")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();

  }

}



