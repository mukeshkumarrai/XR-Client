/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 18-June-2021
  @Why: EWM-1787
  @What:  This page will be use for the brands template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CandidateFolderComponent } from '../candidate-folder.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ManageAccessService } from '@app/modules/EWM.core/shared/services/candidate/manage-access.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RevokeActivityAccessComponent } from '@app/modules/EWM-Employee/employee-detail/employee-activity/revoke-activity-access/revoke-activity-access.component';
import { ClientFolderMaster } from 'src/app/shared/models/client-folder';
import { ClientlandingFolderComponent } from '@app/modules/EWM.core/client/clientlanding-folder/clientlanding-folder.component';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-manage-candidate-folder',
  templateUrl: './manage-candidate-folder.component.html',
  styleUrls: ['./manage-candidate-folder.component.scss']
})
export class ManageCandidateFolderComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  addForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string;
  public submitted = false;
  public AddObj = {};
  public tempID: number;
  public specialcharPattern = "[A-Za-z0-9-+ ]+$";
  statusData: any = [];
  public viewMode: any;
  public editId;
  public oldPatchValues: any;
  totalDataCountFolder:any;
  userType: any;
  public documentAccessModeList: any = [];
  public  matchAcessDesc:any = '';
  public  GrantAccesList: any; 
  public  selectedAccessModeId ;
  public clientData:boolean=false;
  public emailNotExist : boolean = false;
  public loadingSearch: boolean;
  public searchValue: string = "";
  public userListLengthMore: any = 5;
  public AccessId:any;
  public defaultPublic:any=[];
  public selectCheckBoxOption;
  public AccessName;
  public PermissionName;

  /* 
   @Type: File, <ts>
   @Name: constructor function
   @Who: Nitin Bhati
   @When: 18-June-2021
   @Why: EWM-1787
   @What: For injection of service class and other dependencies
  */
  constructor(public dialogRef: MatDialogRef<ManageCandidateFolderComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, 
    private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private router: Router,
     private commonserviceService: CommonserviceService,private appSettingsService: AppSettingsService,
     private _ManageAccessService: ManageAccessService,private pLocation: PlatformLocation) {
    this.activestatus = data.activityStatus;
    this.editId = data.editId;
    this.totalDataCountFolder=data.totalDataCountFolder;
    this.userType=data.userType;
    if (data.editId != '0') {
      this.editId = data.editId;
      this.editForm(this.editId);
    }
    this.addForm = this.fb.group({
      FolderId: [''],
      FolderName: ['', [Validators.required, Validators.maxLength(50)]],
      Description: ['', [Validators.maxLength(250)]],
      Count: [''],
      FolderOwner: [''],
    });
  }
  ngOnInit(): void { 
  }


  /* 
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 18-June-2021
   @Why: EWM-1787
   @What: For setting value in the edit form
  */
  editForm(Id: Number) {
    this.loading = true;
    this._CandidateFolderService.getFolderByID('?id=' + Id).subscribe(
      (data: FolderMaster) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.addForm.patchValue({
            FolderId: data['Data'].FolderId,
            FolderName: data['Data'].FolderName,
            Description: data['Data'].Description,
            Count: data['Data'].Count,
            FolderOwner: data['Data'].FolderOwner,
          });
          this.oldPatchValues = data['Data'];
          
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /* 
   @Type: File, <ts>
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 18-June-2021
   @Why: EWM-1787
   @What: For checking wheather the data save or edit on the basis on active status
  */
  onSave(value) {    
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createFolder(value);
    } else {
      this.updateFolder(value);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }


  /* 
   @Type: File, <ts>
   @Name: createFolder function
   @Who: Nitin Bhati
   @When: 18-June-2021
   @Why: EWM-1787
   @What: For saving Brands master data
  */

  createFolder(value) {
    this.loading = true;
    this.AddObj['FolderName'] = value.FolderName;
    this.AddObj['Description'] = value.Description;
    this._CandidateFolderService.createFolder(this.AddObj).subscribe((repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        if (this.totalDataCountFolder == '0') {
          document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
        // who:maneesh,what:ewm-13207 for api calling issu when save PopupCloseEvent change the response true,when:21/07/2023
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.openQuickAddFolderModal();
         } else {
          document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
        // who:maneesh,what:ewm-13207 for api calling issu when save PopupCloseEvent change the response true,when:21/07/2023
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          }
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
   @Name: updateFolder function
   @Who: Nitin Bhati
   @When: 18-June-2021
   @Why: EWM-1787
   @What: For updating Brands master data
  */
  updateFolder(value) {
    this.loading = true;
    let addObj = [];
    let fromObj = {};
    let toObj = {};

    fromObj = this.oldPatchValues;
    toObj['FolderId'] = this.editId;
    toObj['FolderName'] = value.FolderName;
    toObj['Description'] = value.Description;
    addObj = [{
      "From": fromObj,
      "To": toObj
    }];

    this._CandidateFolderService.updateFolder(addObj[0]).subscribe((repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
        // who:maneesh,what:ewm-13207 for api calling issu when save PopupCloseEvent change the response true,when:21/07/2023
        setTimeout(() => { this.dialogRef.close(true); }, 200);
        
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
      @Name: onDismiss
      @Who: Nitin Bhati
      @When: 16-Aug-2021
      @Why: EWM-2529
      @What: Function will call when user click on cancel button.
    */
  onDismiss(): void {
    
    document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
      @Type: File, <ts>
      @Name: openQuickFolderModal
      @Who: Nitin Bhati
      @When: 18-Aug-2021
      @Why: EWM-2495
      @What: to open quick add Candidate Folder Folder modal dialog
    */
  openQuickAddFolderModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(CandidateFolderComponent, {
      maxWidth: "1000px",
      data: new Object({totalDataCountFolder:this.totalDataCountFolder,userType:this.userType}),
      width: "85%",
      maxHeight: "85%",
      // data: dialogData,
      panelClass: ['quick-modalbox', 'add_folder', 'animate__slow', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(false); }, 200);
      } else {
         }
    })

  }
}


