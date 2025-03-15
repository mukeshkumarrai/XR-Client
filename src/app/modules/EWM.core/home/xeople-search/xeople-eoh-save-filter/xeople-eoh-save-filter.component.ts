/*
@(C): Entire Software
@Type: File, <ts>
@Name: xeople-eoh-save-filter.component.ts
@Who: Renu
@When: 21-09-2023
@Why: EWM-14255 EWM-14421
@What: this component used for save filter for EOH
*/
import { Component, ElementRef,OnInit, ViewChild,Inject } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ManageAccessService } from '../../../shared/services/candidate/manage-access.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { RevokeActivityAccessComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/revoke-activity-access/revoke-activity-access.component';
import { XeopleSearchService } from '../../../shared/services/xeople-search/xeople-search.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-xeople-eoh-save-filter',
  templateUrl: './xeople-eoh-save-filter.component.html',
  styleUrls: ['./xeople-eoh-save-filter.component.scss']
})
export class XeopleEohSaveFilterComponent implements OnInit {

  addForm: FormGroup;
  public loading: boolean = false;
  public submitted = false;
  public AddObj = {};
  selectedAccessModeId:number ;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchUserCtrl = new FormControl();
  EmailList=new FormControl();
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  documentAccessModeList: any = [];
  userSelectedList: any = [];
  searchUserList: any = [];
  public searchValue: string = "";
  userListLengthMore: any = 5;
  public loadingSearch: boolean;
  public loadingSearchFilter:boolean;
  orgId: any;
  public searchListUser: any = [];
  ToEmailIds: any;
  UserName: any;
  AccessName;
  AccessId;
  PermissionName;
  public divStatus: boolean = false;
  maxMessage = 1000;
  currentUser: any;
  accessModeId;
  PermissionNameEditStatus;
  public PreviewUrl: string;
  EmailIds: any=[];
  matchAcessDesc:any = '';
  ActivityType: any;
  GrantAccesList: any;  
  public emailNotExist : boolean = false;
  public pagesize: any;
  public pageSizeOptions: any;
  public pagneNo = 1;
  public searchVal: any;
  public sortingValue: string = "FilterName,asc";
  public filterList: any[]=[];
  public searchSubject$ = new Subject<any>();
  public filterInfo: any;
  public changeVal: string;
  public oldVal: string;
 
  constructor(public dialogRef: MatDialogRef<XeopleEohSaveFilterComponent>, public dialog: MatDialog,private _appSetting: AppSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService,
    private snackBService: SnackBarService, private _ManageAccessService: ManageAccessService, private xeopleSearchService: XeopleSearchService) {
    this.PreviewUrl = "/assets/user.svg";
    this.filterInfo = data.filterInfo;
    this.AccessId =(data.filterInfo?.AccessId && data.filterInfo?.AccessId!=0)?(data.filterInfo?.AccessId):2;
    this.EmailIds=data.GrantAccessList?data.GrantAccessList.GrantAccesList:'';
    this.GrantAccesList=data.filterInfo?data.filterInfo.GrantAccesList:'';
    this.pagesize = this._appSetting.pagesize;
    this.pageSizeOptions = this._appSetting.pageSizeOptions;
    this.addForm = this.fb.group({
      Id: [data?.filterInfo?.Id],
      filterName:[data?.filterInfo?.FilterName,[Validators.required,Validators.maxLength(150)]],
      AccessId: ['',[Validators.required]],
      PermissionName: [''],
      PermissionNameView: [true],
      PermissionNameEdit: [],
      ToEmailIds: [''],
      View: [false],
      Edit: [false],
      Delete: [false],
      IsAdminFilter:[data?.filterInfo?.IsAdminFilter]
    });
    
  }

  ngOnInit(): void {
    this.getDocumentAccessMode();
    this.orgId = localStorage.getItem('OrganizationId'); 
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData;
    if (this.AccessId === 3) {
      this.addForm.patchValue({
      'AccessId':this.AccessId
      })
      this.selectedAccessModeId = this.AccessId;
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
          'UserName':x.UserName
        });
       });
       if(this.userSelectedList.length>0)
      { 
        this.EmailList.setValue(this.EmailIds);
        this.EmailList.clearValidators();
        this.EmailList.updateValueAndValidity();
      }
      
    } else if (this.AccessId === 2) {
      this.addForm.patchValue({
        'AccessId':this.AccessId
        })
      this.divStatus = false;
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.selectedAccessModeId = this.AccessId;
      this.addForm.controls["PermissionNameEdit"].enable();
    } else {
      this.addForm.patchValue({
        'AccessId':this.AccessId
        })
      this.selectedAccessModeId = this.AccessId;
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
      this.divStatus = false;
      this.addForm.patchValue({
        PermissionNameEdit: true,
      });
      this.addForm.controls["PermissionNameEdit"].disable();
    }

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearchFilter = true;
      this.selectedFilterCheck(val);
    });

    this.addForm.get("filterName").valueChanges.subscribe(val => {  
     this.changeVal=val;
     this.oldVal=this.addForm.value.filterName
    });
  }


/*
  @Name: getDocumentAccessMode @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:get Document Access Mode List
*/ 
  public getDocumentAccessMode() {
    this.loading = true;
    this._ManageAccessService.getManageAccessModeList().subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.documentAccessModeList = repsonsedata.Data.filter(x => x['Status'] === 1);
          if(this.AccessId !=undefined && this.AccessId !=null && this.AccessId !=''){
            let documentAccessModeCollection= this.documentAccessModeList.filter(x => x['Id'] === this.AccessId);
            this.clickAccessData(documentAccessModeCollection[0])
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
  @Name: onsearchByName @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:  get search by user List
*/ 
  public onsearchByName(inputValue: string) {
    if (inputValue.length === 0) {
      this.searchUserList = [];
      this.loadingSearch = false;
      this.emailNotExist = false;
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
          }else if (repsonsedata.HttpStatusCode === 204) {
            this.emailNotExist = true;
            this.searchUserList = [];
            this.loadingSearch = false;
          } else {
            this.emailNotExist = false;
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
  @Name: remove @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:  get remove chips skills
*/ 
  remove(Id: any): void {
    const index = this.userSelectedList.findIndex(x => x.UserId === Id);
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
  @Name: selectedUserEmail @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:get selected user name and email List
*/ 

  public selectedUserEmail(event: MatAutocompleteSelectedEvent): void {
    let duplicateCheck = this.userSelectedList.filter(x => x['EmailId'] === event.option.value.Email);
    if (duplicateCheck.length == 0) {
      this.userSelectedList.push({
        'UserId': event.option.value.UserId,
        'EmailId': event.option.value.Email,
        'FullNameEmail': event.option.value.FullName + '(' + event.option.value.Email + ')',
        'UserName':event.option.value.FullName
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
  @Name: onSave @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:For Data save to serve
*/ 
  onSave(value: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.createManageAccess(value);
  }

/*
  @Name: createManageAccess @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:For saving manage access data
*/  
  createManageAccess(value: any) {
    let documentAccessModeListById = this.documentAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = documentAccessModeListById[0].AccessName;
    document.getElementsByClassName("xeople-search-save-filter-modal")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("xeople-search-save-filter-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'isSubmit':true,'AccessId':documentAccessModeListById,'AccessName':this.AccessName,
    'ToEmailIds':this.userSelectedList,'value':this.addForm.value,'filterStatus':this.oldVal==this.changeVal?'Edit':'Add'}); }, 200);   
   
  }

/*
  @Name: clickAccessData @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:  for hide and show div
*/
 selectCheckBoxOption;
  public clickAccessData(accessData: any) {
    this.AccessName = accessData.AccessName;
    this.AccessId = accessData.Id;
    this.matchAcessDesc = accessData.AccessName;

    if (accessData.Id === 3) {
      this.divStatus = true;
      if(this.userSelectedList==undefined || this.userSelectedList==null || this.userSelectedList.length==0 ){
        this.EmailList.setValidators([Validators.required]);
        this.EmailList.updateValueAndValidity();
       this.EmailList.reset();
      }
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
      this.addForm.controls["PermissionNameEdit"].enable();
    } else if (accessData.Id === 2) {
      this.divStatus = false;
      this.userSelectedList=[];
      this.searchUserList=[];
      this.EmailList.setValue(this.EmailIds);
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
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
      
    } else {
      this.userSelectedList=[];
      this.searchUserList=[];
       this.divStatus = false;
     this.EmailList.setValue(this.EmailIds);
      this.EmailList.clearValidators();
      this.EmailList.updateValueAndValidity();
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

/*
  @Name: openRemoveAccessModal @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What: to open remove access
*/
  public openRemoveAccessModal() {
    let documentAccessModeListById = this.documentAccessModeList.filter(x => x['Id'] === this.AccessId);
    this.AccessName = documentAccessModeListById[0].AccessName;
    const dialogRef = this.dialog.open(RevokeActivityAccessComponent, {
      maxWidth: "1000px",
      data: new Object({
        AccessId: this.AccessId, AccessName: this.AccessName,
        ActivityType:this.ActivityType,
        GrantAccesList:this.GrantAccesList,
        userSelectedList:this.userSelectedList
      }),
      width: "95%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'remove_Access', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.userSelectedList=res;
      this.GrantAccesList=res;
        if (res.length==0) {
        this.addForm.reset();
        this.userSelectedList=[];
        this.addForm.patchValue({
         searchUserCtrl:null
         }) 
        }
        if (res == false) {
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

/*
  @Name: onMessage @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What: For showing max message validation
*/
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 1000 - value.length;
    }
  }

/*
  @Name: clickMoreRecord @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What:For showing more chip data.
*/
  public clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }

/*
  @Name: onDismiss @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What: Function will call when user click on cancel button.
*/
  onDismiss(): void {
    document.getElementsByClassName("xeople-search-save-filter-modal")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("xeople-search-save-filter-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'isSubmit':false}); }, 200);
  }

/*
  @Name: onsearchByFilter @Who: Renu  @When: 21-09-2023  @Why:  EWM-14255 EWM-14421  @What: on SEARCH BY FILTER
*/
  onsearchByFilter(searchVal:string){
    this.loading = false;
      if(searchVal.length > 0 && searchVal.length < 3) {
      this.loadingSearchFilter = false;
      return;
    }
    this.searchSubject$.next(searchVal);
    
  }
   
  
/*
  @Name: selectedFilterCheck @Who: Renu  @When: 14-Feb-2023  @Why:  EWM-14255 EWM-14421  @What: on chose filter search for uniquenes for the filter
*/
  selectedFilterCheck(value){
    let obj={};
    obj['Id']=this.addForm.get("Id").value?this.addForm.get("Id").value:0;
    obj['Value']=value;
    this.xeopleSearchService.uniqueCheckEOHFilter(obj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingSearchFilter=false;
          this.addForm.get("filterName").clearValidators();
          this.addForm.get("filterName").markAsPristine();
          this.addForm.get('filterName').setValidators([Validators.required,Validators.maxLength(150)]);
         
        }if (repsonsedata.HttpStatusCode === 402) {
          this.loadingSearchFilter=false;
          this.addForm.get("filterName").setErrors({ codeTaken: true });
          this.addForm.get("filterName").markAsDirty();
          this.addForm.get("filterName").markAsTouched();
         
        } else {
          this.loadingSearchFilter=false;
             }
      }, err => {
        this.loadingSearchFilter=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();

  }


}
