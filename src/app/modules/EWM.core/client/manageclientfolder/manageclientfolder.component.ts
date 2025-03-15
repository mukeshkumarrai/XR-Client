// who:maneesh,what:ewm-15817 create component for ladd and edit client folder listLazyRoutes,when:31/01/2023
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FolderMaster, ResponceData } from 'src/app/shared/models/candidate-folder';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ManageAccessService } from '@app/modules/EWM.core/shared/services/candidate/manage-access.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RevokeActivityAccessComponent } from '@app/modules/EWM-Employee/employee-detail/employee-activity/revoke-activity-access/revoke-activity-access.component';
import { ClientFolderMaster } from 'src/app/shared/models/client-folder';
import { ClientlandingFolderComponent } from '@app/modules/EWM.core/client/clientlanding-folder/clientlanding-folder.component';
import { PlatformLocation } from '@angular/common';
import { trim } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-manageclientfolder',
  templateUrl: './manageclientfolder.component.html',
  styleUrls: ['./manageclientfolder.component.scss']
})
export class ManageclientfolderComponent implements OnInit {
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
  public oldPatchValues: any;
  totalDataCountFolder: any;
  userType: any;
  public documentAccessModeList: any = [];
  public matchAcessDesc: any = '';
  public GrantAccesList: any;
  public selectedAccessModeId;
  public clientData: boolean = false;
  public emailNotExist: boolean = false;
  public loadingSearch: boolean;
  public searchValue: string = "";
  public userListLengthMore: any = 5;
  public AccessId: any;
  public defaultPublic: any = [];
  public selectCheckBoxOption;
  public AccessName;
  public PermissionName;
  public divStatus: boolean = false;
  public userSelectedList: any = [];
  public EmailList = new FormControl();
  public searchUserList: any = [];
  public EmailIds: any = [];
  public clientEmailIds: any = [];
  public arr = [];
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  public searchUserCtrl = new FormControl();
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public removable = true;
  public editClientFolder: boolean = false;
  public editClientFolderId: number;
  public toField: boolean = false;
  public clientUrl: string;
  public duplicateUserselectedEmail: any = [];
  public toFieldsss: boolean = false;
  public editfolderData: any = []
  public toFieldEmpty: boolean = false;
  public emptyRevocAccess:any=[];
  userSelectedListss: any;
  emailNotExisting:boolean=false;
  hideRevok:boolean=false
  public isResponseGet:boolean = false;
  public folderNameEmpty:string;
  public defaultPublicdata: any = [];
  constructor(public dialogRef: MatDialogRef<ManageclientfolderComponent>, public dialog: MatDialog,private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService,
    private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private router: Router,
    private commonserviceService: CommonserviceService, private appSettingsService: AppSettingsService,
    private _ManageAccessService: ManageAccessService, private pLocation: PlatformLocation) {
    this.activestatus = data.activityStatus;
    this.totalDataCountFolder = data.totalDataCountFolder;
    this.userType = data.userType;
    this.EmailIds = data.AccessModeId ? data.AccessModeId?.GrantAccesList : '';
    this.GrantAccesList = data.AccessModeId ? data.AccessModeId?.GrantAccesList : '';
    this.clientData = data?.clientData;  
    this.editClientFolderId = data?.editclientFoldrId;
    this.editClientFolder = data?.editClientFolder;
    this.clientUrl = (pLocation as any).location.href; //who:maneesh for creat client list folader  then send client url
    if (this.editClientFolderId != null && this.editClientFolderId != undefined && this.editClientFolderId != 0 && this.editClientFolder == true) {
      // this.getDocumentAccessMode();
      this.editClientfolderForm(this.editClientFolderId);
    }
    this.addForm = this.fb.group({
      FolderId: [''],
      FolderName: ['', [Validators.required, Validators.maxLength(50),this.noWhitespaceValidator()]],
      Description: ['', [Validators.maxLength(250)]],
      Count: [''],
      FolderOwner: [''],
      Id: [''],
      AccessId: ['', [Validators.required]],
      PermissionName: [''],
      PermissionNameView: [true],
      PermissionNameEdit: [],
      ToEmailIds: [],
      View: [false],
      Edit: [false],
      Delete: [false]
    });
  }
  ngOnInit(): void {
    if (this.clientData == true) {
      this.selectedAccessModeId=2
      this.getDocumentAccessMode();
      this.AccessId=2;
      if (this.AccessId === 3) {
        this.addForm.patchValue({
          'AccessId': this.AccessId
        })
        // this.selectedAccessModeId = this.AccessId;
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.addForm.patchValue({
          PermissionNameEdit: false,
        });
        this.divStatus = true;
        this.addForm.controls["PermissionNameEdit"].enable();
        this.EmailIds.forEach(x => {
          this.userSelectedList.push({
            'UserId': x.UserId,
            'EmailId': x.EmailId,
            'FullNameEmail': x.UserName + '(' + x.EmailId + ')',
            'UserName': x.UserName
          });
        });
        if (this.userSelectedList.length > 0) {
          this.EmailList.setValue(this.EmailIds);
          this.EmailList.clearValidators();
          this.EmailList.updateValueAndValidity();
        }

      } else if (this.AccessId === 2) {
        this.addForm.patchValue({
          'AccessId': this.AccessId
        })
        this.divStatus = false;
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
        this.selectedAccessModeId = this.AccessId;
        this.addForm.controls["PermissionNameEdit"].enable();
      } else if (this.AccessId === 1) {
        this.addForm.patchValue({
          'AccessId': this.AccessId
        })
        this.selectedAccessModeId = this.AccessId;
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
        this.divStatus = false;
        this.addForm.patchValue({
          PermissionNameEdit: true,
        });
        this.addForm.controls["PermissionNameEdit"].disable();
        // this.addForm.patchValue({
        //   PermissionNameEdit: false,
        //   View: true,
        //   Edit: true,
        //   Delete: true
        // });
      }
    }
  }


  onDismiss(): void {
    document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  openQuickAddFolderModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ClientlandingFolderComponent, {
      maxWidth: "1000px",
      data: new Object({ totalDataCountFolder: this.totalDataCountFolder, userType: this.userType }),
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

  //manage assec functionality for client create folder data start ,who:maneesh,what:ewm-15817,when:29/01/2024 
  public getDocumentAccessMode() {
    this.loading = true;
    this._ManageAccessService.getManageAccessModeList().subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.documentAccessModeList = repsonsedata.Data.filter(x => x['Status'] === 1);
            //this condition use for only edit case 
            this.defaultPublic = this.documentAccessModeList.filter(x => x['Id'] === this.selectedAccessModeId);
           if(this.selectedAccessModeId==3 && this.clientData ==undefined ){
              this.addForm.patchValue({
                View: this.defaultPublic[0]?.View===1?true:false,
                Edit: this.defaultPublic[0]?.Edit===1?true:false,
                Delete: this.defaultPublic[0]?.Delete===1?true:false,
              });
              this.addForm.controls["PermissionNameEdit"].enable(); 
            }else if (this.selectedAccessModeId==2 && this.clientData ==undefined){
              this.addForm.patchValue({
                PermissionNameEdit: false,
                View: false,
                Edit: false,
                Delete: false
              });
              this.addForm.controls["PermissionNameEdit"].enable();
              this.addForm.patchValue({
                View: this.defaultPublic[0]?.View===1?true:false,
                Edit: this.defaultPublic[0]?.Edit===1?true:false,
                Delete: this.defaultPublic[0]?.Delete===1?true:false,
              });
            }else if (this.selectedAccessModeId==1 && this.clientData ==undefined){
              this.addForm.patchValue({
                PermissionNameEdit: true,
                View: false,
                Edit: false,
                Delete: false
              });
              this.addForm.controls["PermissionNameEdit"].disable();
              this.addForm.patchValue({
                View: this.defaultPublic[0]?.View===1?true:false,
                Edit: this.defaultPublic[0]?.Edit===1?true:false,
                Delete: this.defaultPublic[0]?.Delete===1?true:false,
              });
            }
          // if (this.selectedAccessModeId != undefined && this.selectedAccessModeId != null && this.selectedAccessModeId != '' && this.clientData !=undefined) {
          //   let documentAccessModeCollection = this.documentAccessModeList.filter(x => x['Id'] === this.selectedAccessModeId);
          //   this.defaultPublic = this.documentAccessModeList.filter(x => x['Id'] === this.selectedAccessModeId);
          //   console.log('this.defaultPublic',this.defaultPublic);
          //   // this.clickAccessData(documentAccessModeCollection[0]);
          // }
            //this condition use for only add case 
            if (this.clientData == true) { 
              this.matchAcessDesc = 'Public';    
              this.defaultPublic = this.documentAccessModeList.filter(x => x['Id'] === this.selectedAccessModeId);              
             this.addForm.patchValue({
            View: this.defaultPublic[0]?.View===1?true:false,
            Edit: this.defaultPublic[0]?.Edit===1?true:false,
            Delete: this.defaultPublic[0]?.Delete===1?true:false,
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


  public clickAccessData(accessData: any) {
    // this.selectedAccessModeId = accessData.Id;        
    this.AccessName = accessData?.AccessName;
    this.AccessId = accessData?.Id;
    this.matchAcessDesc = accessData?.AccessName;    
if (accessData?.Id === 3 && this.clientData==true) 
  {
    this.addForm.patchValue({
      View: accessData?.View===1?true:false,
      Edit: accessData?.Edit===1?true:false,
      Delete: accessData?.Delete===1?true:false,
    });
    this.addForm.controls["PermissionNameEdit"].enable();  
      if (this.userSelectedList?.length == 0 && this.clientData==true) {
      this.toField = true;
      this.emailNotExist= false;
      this.toFieldEmpty=true;
      this.toFieldsss = false;
      this.EmailList.setValidators([Validators.required]);
      this.EmailList.updateValueAndValidity();
      this.EmailList.reset();
    }

    // this.userSelectedList=[];
    if (this.userSelectedList.length>0) {
      this.emailNotExist=false
      // this.searchUserList = [];
      this.divStatus = true;
      this.toFieldsss = false;
      this.hideRevok=false;
      this.toFieldEmpty=false;

      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.toField = false;
    }
  }

    if (accessData?.Id === 3 && this.editClientFolder != true) {
      this.divStatus = true;
      this.hideRevok=true;
      this.toFieldsss = false;
      this.emailNotExist= false;      
      // this.duplicateUserselectedEmail = [];
      this.selectedAccessModeId = accessData.Id;
      this.addForm.patchValue({
        View:accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
      this.addForm.controls["PermissionNameEdit"].enable(); 
      if (this.userSelectedList?.length > 0 && this.clientData==true) {
        this.toField = false;
        this.toFieldEmpty=false;
        this.emailNotExist= false;
        // this.EmailList.setValue(this.EmailIds);
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
      if (this.userSelectedList == undefined && this.userSelectedList == null && this.userSelectedList?.length == 0) {
        this.toField = true;
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.EmailList.reset();
        this.addForm.controls["PermissionNameEdit"].enable();
      } else if (this.userSelectedList?.length > 0 && this.clientData==true) {
        this.toField = false;
        this.emailNotExist= false;
        this.toFieldsss = false;

        this.EmailList.setValue(this.EmailIds);
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
    
    } else if (accessData?.Id === 3 && this.editClientFolder == true) {
      this.divStatus = false;
      this.toFieldsss = true;
      this.selectedAccessModeId = accessData?.Id;
      this.toFieldEmpty = false;    
      this.addForm.patchValue({
        View:   accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
      this.addForm.controls["PermissionNameEdit"].enable(); 
        // this.duplicateUserselectedEmail=[...this.userSelectedList];
         if (this.duplicateUserselectedEmail?.length==0 && this.clientData!=true) {
          this.EmailList.setValidators([Validators.required]);
          this.EmailList.updateValueAndValidity();
          this.EmailList.reset();
          this.toFieldEmpty = true;
          this.toField = true;
        }
      if (this.userSelectedList?.length == 0) {
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.EmailList.reset();
        this.toFieldEmpty = true;
        this.toField = true;
      } 
      if (this.userSelectedList.length>0) {
        this.toField=false;
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
    }
    else if (accessData?.Id === 2 ) {
      this.divStatus = false;
      this.toField = false;
      this.toFieldsss = false;
      this.hideRevok=false;
      this.addForm.patchValue({
        PermissionNameEdit: false,
        View: false,
        Edit: false,
        Delete: false
      });
      this.addForm.controls["PermissionNameEdit"].enable();
      this.addForm.patchValue({
        View: accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
      // this.userSelectedList=[];
      this.selectedAccessModeId = accessData?.Id;
      this.searchUserList = [];
      this.EmailList.setValue(this.EmailIds);
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();

    } else if(accessData?.Id === 1 ) {
      // this.userSelectedList=[];
      this.searchUserList = [];
      this.divStatus = false;
      this.toFieldsss = false;
      this.hideRevok=false;
      this.selectedAccessModeId = accessData?.Id;
      this.EmailList.setValue(this.EmailIds);
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.toField = false;
      this.addForm.patchValue({
        PermissionNameEdit: true,
        View: false,
        Edit: false,
        Delete: false
      });
      this.addForm.controls["PermissionNameEdit"].disable();
      this.addForm.patchValue({
        View: accessData?.View===1?true:false,
        Edit: accessData?.Edit===1?true:false,
        Delete: accessData?.Delete===1?true:false,
      });
    }
  }

  remove(Id: any, type): void {
    if (type == '') {
      const index = this.userSelectedList.findIndex(x => x?.UserId === Id);
      if (index !== -1) {
        this.userSelectedList.splice(index, 1);
      }
      if (this.userSelectedList?.length == 0 && this.clientData==true) {
        this.toField = true;
        this.emailNotExist= false;
        this.toFieldEmpty=true;
        this.toFieldsss = false;
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.EmailList.reset();
      }
    } else if (type == 'editfolder') {
      const duplicateUserselectedEmailindex = this.duplicateUserselectedEmail.findIndex(x => x?.UserId === Id);
      if (duplicateUserselectedEmailindex !== -1) {
        this.userSelectedList.splice(duplicateUserselectedEmailindex, 1);
        this.duplicateUserselectedEmail.splice(duplicateUserselectedEmailindex, 1);        
      }
      if (this.duplicateUserselectedEmail?.length == 0 && this.editClientFolder == true) {
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.toField = true;
        this.toFieldEmpty = true;

      } else {
        this.toField = false;
        this.toFieldEmpty = false;
      }
      if (this.userSelectedList.length>0) {
        this.toField=false;
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }else if(this.duplicateUserselectedEmail?.length == 0){
        this.toField=false;
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
      if (this.userSelectedList.length==0 && this.duplicateUserselectedEmail?.length == 0) {
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.toField = true;
        this.toFieldEmpty = true;
      }
    }

  }

  public selectedUserEmail(event: MatAutocompleteSelectedEvent): void {
    let duplicateCheck = this.userSelectedList.filter(x => x['EmailId'] === event.option.value.Email);
    if (duplicateCheck?.length == 0) {
      this.userSelectedList.push({
        'UserId': event.option.value.UserId,
        'EmailId': event.option.value.Email,
        'FullNameEmail': event.option.value.FullName + '(' + event.option.value.Email + ')',
        'UserName': event.option.value.FullName
      });
      if (this.userSelectedList?.length > 0) {
        this.toField = false;
        this.toFieldEmpty = false;
        this.toField = false;
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
      //  this.duplicateUserselectedEmail=[...this.userSelectedList];

      this.duplicateUserselectedEmail.push({
        'UserId': event.option.value.UserId,
        'EmailId': event.option.value.Email,
        'FullNameEmail': event.option.value.FullName + '(' + event.option.value.Email + ')',
        'UserName': event.option.value.FullName
      });
    }

    this.nameInput.nativeElement.value = '';
    this.searchUserCtrl.setValue(null);
  }

  public onsearchByName(inputValue: string) {    
    if (inputValue.length === 0) {
      this.searchUserList = [];
      this.loadingSearch = false;
      this.emailNotExist = false;
      this.emailNotExisting=false;
    }
    if (inputValue.length > 0 && inputValue.length > 3) {
      this.searchValue = inputValue;
      this.loadingSearch = true;
      this._ManageAccessService.getSearchUserWithGroup("?search=" + inputValue).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.searchUserList = repsonsedata.Data;
            this.loadingSearch = false;
            this.emailNotExist = false;
            this.emailNotExisting=false;
          } else if (repsonsedata.HttpStatusCode === 204) {
            this.emailNotExist = true;
            this.emailNotExisting=true;
            // this.toFieldEmpty=true;
            // this.addForm.get("searchUserCtrl").setErrors({ emailNotExisting: true });
            // this.addForm.get("ToEmailIds").setErrors({ emailNotExisting: true });
            // this.addForm.get("EmailList").setErrors({ emailNotExisting: true });

            this.searchUserList = [];
            this.loadingSearch = false;
          } else {
            this.emailNotExist = false;
            this.loadingSearch = false;
            this.emailNotExisting=false;

            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          this.loadingSearch = false;
          this.emailNotExisting=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })

    }
  }


  public clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }

  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();
  }

  onSaveFolderdata(value) {
    this.isResponseGet = true;
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.duplicayCheck(true)
    // if (this.activestatus == 'Add') {
    //   this.createClientFolderList(value);
    // } else {
    //   this.updateclientFolder(value);
    // }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  duplicayCheck(isSave) {
    let FolderId = this.addForm.get("FolderId").value;    
    if (FolderId == null) {
      FolderId = 0;
    }
    if (FolderId == '') {
      FolderId = 0;
    }
    let toObj = {};

    toObj['FolderId'] = FolderId;
    toObj['FolderName'] = this.addForm.get("FolderName")?.value.trim();
    this.folderNameEmpty=this.addForm.get("FolderName")?.value.trim()
    if (this.addForm.get("FolderName").value?.length!=0  && this.folderNameEmpty!='') {
      this._CandidateFolderService.getClientFolderDuplicacyCheck(toObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 402) {
          this.isResponseGet = false;
            if (data.Data == false) {
              this.submitted=false;
              this.addForm.get("FolderName").setErrors({ codeTaken: true });
              this.addForm.get("FolderName").markAsDirty();
              
            }
          }
          else if (data.HttpStatusCode == 204) {
          this.isResponseGet = false;
            if (data.Data == true) {
              this.addForm.get("FolderName").clearValidators();
              this.addForm.get("FolderName").markAsPristine();
              this.addForm.get('FolderName').setValidators([Validators.required, Validators.maxLength(50),this.noWhitespaceValidator()]);
              if (this.addForm && this.submitted == true && isSave==true) {
                if (this.activestatus == 'Add') {
                  this.isResponseGet = true;
                  this.createClientFolderList(this.addForm.value);
                } else {
                 this.isResponseGet = true;
                  this.updateclientFolder(this.addForm.value);
                }
              }
            }
          }
          else if (data.HttpStatusCode == 400) {
          this.isResponseGet = false;
            this.addForm.get("FolderName").clearValidators();
            this.addForm.get("FolderName").markAsPristine();
            this.addForm.get('FolderName').setValidators([Validators.required, Validators.maxLength(50),this.noWhitespaceValidator()]);
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.loading = false;
          this.isResponseGet = false;
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          this.isResponseGet = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
          this.isResponseGet = false;
        });  
    }

  }
  updateclientFolder(value) {
    this.isResponseGet = true;

    let addObj = [];
    let fromObj = {};
    let toObj = {};

    fromObj = this.oldPatchValues;
    toObj['FolderId'] = value.FolderId;
    toObj['FolderName'] = value.FolderName?.trim();;
    toObj['Description'] = value.Description?.trim();;
    toObj['AccessId'] = value?.AccessId;
    toObj['FolderAccessURL'] = this.clientUrl;
    if (value.AccessId == 3) {
      toObj['GrantAccessList'] = this.userSelectedList;
    }
    addObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this.duplicateUserselectedEmail = [];
    this._CandidateFolderService.updateClientFolder(addObj[0]).subscribe((repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.isResponseGet = false;
        this.loading = false;
        document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(true); }, 200);

        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;

      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;

      }
    },
      err => {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });

  }
  createClientFolderList(value) {
    this.AddObj['FolderName'] = value?.FolderName?.trim();;
    this.AddObj['Description'] = value?.Description?.trim();
    this.AddObj['AccessId'] = value?.AccessId;
    this.AddObj['FolderAccessURL'] = this.clientUrl;

    if (value.AccessId == 3) {
      this.AddObj['GrantAccessList'] = this.userSelectedList;
    }
    this.duplicateUserselectedEmail = [];
    this._CandidateFolderService.createClientFolderList(this.AddObj).subscribe((repsonsedata: ClientFolderMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.isResponseGet = false;
        if (this.totalDataCountFolder == '0') {
          document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.openClientAddFolderModal();
        } else {
        this.isResponseGet = false;
          document.getElementsByClassName("add_folderManage")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_folderManage")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        }
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
    },
      err => {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  openClientAddFolderModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ClientlandingFolderComponent, {
      maxWidth: "1000px",
      data: new Object({ totalDataCountFolder: this.totalDataCountFolder, userType: this.userType, createFolder: true }),
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

  editClientfolderForm(Id) {
    this.loading = true;
    this._CandidateFolderService.getClientFolderListByID('?id=' + Id).subscribe(
      (data: ClientFolderMaster) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.editfolderData = data['Data'];
          this.selectedAccessModeId = data['Data']?.AccessId,  
          this.getDocumentAccessMode();
          this.loading = false;
          this.oldPatchValues = data['Data'];
          this.duplicateUserselectedEmail = [];
          if (data['Data'].AccessId == 3) {            
            this.matchAcessDesc = "Protected";
            this.EmailList.setValidators([Validators.required]);
            this.EmailList.updateValueAndValidity();
            this.EmailList.reset();
            this.toFieldEmpty = true;
            this.toField = true;
            this.emailNotExist = true;
            this.toFieldsss = true;
            this.addForm.controls["PermissionNameEdit"].enable();
            this.clientEmailIds = data['Data'].GrantAccessList;
            this.clientEmailIds?.forEach(x => {
              this.userSelectedList.push({
                'UserId': x?.UserId,
                'EmailId': x?.EmailId,
                'FullNameEmail': x?.UserName + '(' + x?.EmailId + ')',
                'UserName': x?.UserName
              });
            });
            this.addForm.patchValue({
              FolderId: data['Data']?.FolderId,
              FolderName: data['Data']?.FolderName,
              Description: data['Data']?.Description,
              Count: data['Data']?.Count,
              FolderOwner: data['Data']?.FolderOwner,
              AccessId: data['Data']?.AccessId,
            });
            if (this.userSelectedList.length>0) {
              this.toField=false;
              this.EmailList.clearValidators();
              this.EmailList.updateValueAndValidity();
            }
       
          } else if (data['Data']?.AccessId == 2) {
            this.divStatus = false;
            this.addForm.patchValue({
              FolderId: data['Data']?.FolderId,
              FolderName: data['Data']?.FolderName,
              Description: data['Data']?.Description,
              Count: data['Data'].Count,
              FolderOwner: data['Data']?.FolderOwner,
              AccessId: data['Data']?.AccessId,
            });
            this.matchAcessDesc = "Public";
          } else if (data['Data']?.AccessId == 1) {
            this.divStatus = false;
            this.addForm.controls["PermissionNameEdit"].enable();
            this.matchAcessDesc = "Confidential";
            this.addForm.patchValue({
              FolderId: data['Data']?.FolderId,
              FolderName: data['Data']?.FolderName,
              Description: data['Data']?.Description,
              Count: data['Data']?.Count,
              FolderOwner: data['Data']?.FolderOwner,
              AccessId: data['Data']?.AccessId,
            });
          }
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
  public openRemoveAccessModal() {
    let documentAccessModeListById = this.documentAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = documentAccessModeListById[0]?.AccessName;
    const dialogRef = this.dialog.open(RevokeActivityAccessComponent, {
      maxWidth: "1000px",
      data: new Object({
        AccessId: this.AccessId,
        AccessName: this.AccessName,
        GrantAccesList: this.GrantAccesList,
        userSelectedList: this.userSelectedList,
        editClientFolder: this.editClientFolder,

      }),
      width: "95%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'remove_Access', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.userSelectedList = res;
      this.GrantAccesList = res;
      this.emptyRevocAccess=res;
      if (res.length != 0) {
      this.duplicateUserselectedEmail= res.filter((o1) => {
        return this.duplicateUserselectedEmail.some((o2) => o2?.UserId === o1?.UserId);
      });
    }
      if (this.duplicateUserselectedEmail.length==0 && this.userSelectedList.length==0) {
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
        this.EmailList.reset();
        this.toFieldEmpty = true;
        this.toField = true;
      }
        if (res.length == 0) {
        this.addForm.reset();
        this.userSelectedList = [];
        this.duplicateUserselectedEmail=[]
        this.toFieldsss=false;
        this.matchAcessDesc = "Public";
        this.toField = false;

        this.addForm.patchValue({
          searchUserCtrl: null,
          'AccessId': 2
        })
        // this.clickAccessData(this.defaultPublic[0]);
        this.addForm.patchValue({
          FolderId: this.editfolderData?.FolderId,
          FolderName: this.editfolderData?.FolderName,
          Description: this.editfolderData?.Description,
          Count: this.editfolderData?.Count,
          FolderOwner: this.editfolderData?.FolderOwner,
          AccessId: 2,
        });
        this.addForm.controls["PermissionNameEdit"].enable();     
        this.defaultPublic = this.documentAccessModeList.filter(x => x['Id'] === 2);           
        this.addForm.patchValue({
       View: this.defaultPublic[0]?.View===1?true:false,
       Edit: this.defaultPublic[0]?.Edit===1?true:false,
       Delete: this.defaultPublic[0]?.Delete===1?true:false,
           });
      }
      if (res == false) {
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '')?.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  // END manage assec functionality for client create folder data start ,who:maneesh,what:ewm-15817,when:29/01/2024

}



