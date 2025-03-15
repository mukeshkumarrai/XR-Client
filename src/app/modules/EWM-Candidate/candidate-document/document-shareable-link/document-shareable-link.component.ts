import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import {RevokeaccessComponent} from 'src/app/modules/EWM-Candidate/candidate-document/document-shareable-link/revokeaccess/revokeaccess.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { date } from '@rxweb/reactive-form-validators';
import { ResponceData } from 'src/app/shared/models';
@Component({
  selector: 'app-document-shareable-link',
  templateUrl: './document-shareable-link.component.html',
  styleUrls: ['./document-shareable-link.component.scss']
})
export class DocumentShareableLinkComponent implements OnInit {

  shareDocUserList: any = [];
  addForm: FormGroup;
  maxMessage: number = 1000;
  loadingSearch: boolean = false;
  searchUserList: any;
  userSelectedList: any = [];
  userListLengthMore: any;
  searchUserCtrl = new FormControl();
  emailpattern: string //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  candidateId: any;

  pageNo: number;
  loadingscroll:boolean=false;
  gridView:any=[];
  pagesize: any;
  pagneNo: any = 1;
  searchVal: any = '';
  loading: boolean = false;
  totalRecords;
  isBtnDisabled:boolean = false;
  jobId: string;


  constructor(private fb: FormBuilder, private _Service: DocumentCategoryService, public dialogRef: MatDialogRef<DocumentShareableLinkComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBService: SnackBarService, private translateService: TranslateService,private _services:DocumentService,public dialog: MatDialog,private _appSetting: AppSettingsService,
    private appSettingsService: AppSettingsService) {
      this.emailpattern=this._appSetting.emailPattern;
      this.pagesize = this._appSetting.pagesize;
    this.pageNo = this._appSetting.pagesize;
    if(data)
      {
        this.jobId=data?.jobId
      }

    this.addForm = this.fb.group({
      DocumentId: [''],
      Id: [''],
      SharedEmailIds: ['', Validators.required],
      SharedLink: [`${this.appSettingsService.ExternalSharedLink}`],
      // Message: ['', [Validators.maxLength(1000)]],
      LinkExpiryDays: []
    });
  }

  ngOnInit(): void {
    this.getAllData(false,false);
  }
  onDismiss() {
    document.getElementsByClassName("add_shareableLink")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_shareableLink")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  remove(Id): void {
    const index = this.userSelectedList.findIndex(x => x.id === Id);
    if (index !== -1) {
      this.userSelectedList.splice(index, 1);
    }
    if (this.userSelectedList.length == 0) {
     
    }
    if (this.userSelectedList.length > 0) {
    } else {
      this.addForm.controls['SharedEmailIds'].setErrors({ 'required': true });
    }
  }
  addEmail(value) {
    if(value==''){
      this.addForm.get("SharedEmailIds").clearValidators();
      this.addForm.get("SharedEmailIds").markAsPristine();
      this.addForm.get('SharedEmailIds').updateValueAndValidity();
      if(this.userSelectedList.length>0){
        this.addForm.get("SharedEmailIds").clearValidators();
        this.addForm.get("SharedEmailIds").markAsPristine();
        this.addForm.get('SharedEmailIds').updateValueAndValidity();
      }else{
        this.addForm.get("SharedEmailIds").setErrors({ required: true });
        this.addForm.get('SharedEmailIds').setValidators([Validators.required]);
      }
      return;
    }
    if(value.toLowerCase().match(this.emailpattern)==null){
     this.addForm.get("SharedEmailIds").setErrors({pattern: true});
     this.addForm.get("SharedEmailIds").markAsDirty();
     return;
    }
    let duplicateCheck = this.userSelectedList.filter(x => x.email=== value); 
    if(duplicateCheck.length>0){
      
     this.addForm.get("SharedEmailIds").setErrors({hasEamil: true});
     this.addForm.get("SharedEmailIds").markAsDirty();
      return;
    }
    let emailnode;
    if (this.userSelectedList.length == 0) {
      emailnode = {
        id: 1,
        email: value
      };
    } else {
      emailnode = {
        id: (this.userSelectedList[this.userSelectedList.length - 1].id) + 1,
        email: value
      };
    }
    this.userSelectedList.push(emailnode);
    this.nameInput.nativeElement.value = '';
  }

  clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }
  
  onMessage(value) {
    if (value != undefined && value != null) {
      this.maxMessage = 1000 - value.length;
    }
  }

  onSave(value) {
    let Emails = [];
    this.userSelectedList.forEach(element => {
      Emails.push(element.email);
    });
    value.jobId=this.jobId;
    value.SharedEmailIds = Emails;
    value.SharedLink=`${this.appSettingsService.ExternalSharedLink}`;
    document.getElementsByClassName("add_shareableLink")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_shareableLink")[0].classList.add("animate__zoomOut");
    if (value.LinkExpiryDays == null) {
      value.LinkExpiryDays = 0;
    }else{
      value.LinkExpiryDays = value.LinkExpiryDays
    }
    
    setTimeout(() => { this.dialogRef.close(value); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  revokeAccess(){
    const dialogRef = this.dialog.open(RevokeaccessComponent, {
      data:this.data,
      panelClass: ['xeople-modal-lg', 'quick-modalbox', 'reovoke_access', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(!dialogResult)
      {
        return;
      }
    });
  }

/*
  @Type: File, <ts>
  @Name: getAllData()
  @Who: Adarsh singh
  @When: 04-Aug-2022
  @Why: EWM-8133
  @What: get All data by id
*/
  getAllData(isScroll: boolean, isSearch: boolean) {
    this.loadingscroll=isScroll; 
    this.loadingSearch=isSearch;
    this.loading=true;

    if(!isScroll&&!isSearch){
      this.loading=true;
    }
    this._services.getDataForRevokeAccess(this.pageNo, this.pagesize, this.searchVal,this.data.DocumentId)
    .subscribe((data:ResponceData)=>{
      if(data.HttpStatusCode==200)
      {
       if(isScroll){ 
         let nextgridView = [];
         nextgridView = data.Data;
         this.gridView = this.gridView.concat(nextgridView);
        //  this.loadingscroll = false;
       }else{
        this.gridView=data.Data;
        this.totalRecords=data.TotalRecord;
        this.loading=false;
        // this.loadingSearch = false;
        // this.loadingscroll = false;
       }
       if (data.Data.length > 0) {
        this.isBtnDisabled = false;
       }else{
         this.isBtnDisabled = true;
       }
      }
      else if(data.HttpStatusCode==204){
        if(!isScroll){
          this.gridView=null;
        }
       this.totalRecords=data.TotalRecord;
       this.loading=false;
       this.loadingSearch = false;
       this.loadingscroll = false;
       this.isBtnDisabled = true;
      }else {
       this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
       this.loadingscroll = false;
       this.loading = false;
       this.loadingSearch = false;
     }
   }, err => {
     this.loading = false;
     this.loadingSearch = false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
  }

  conditionChcek() {
    let values = this.addForm.get("LinkExpiryDays").value;
    if (values === null || values === undefined || values === ''){
      this.addForm.get("LinkExpiryDays").clearValidators();
      this.addForm.get("LinkExpiryDays").markAsPristine();
    }
    else if (366 > values && values>0) {
      this.addForm.get("LinkExpiryDays").clearValidators();
      this.addForm.get("LinkExpiryDays").markAsPristine();
      // this.addForm.get('LinkExpiryDays').setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(5)]);
    } else {
      this.addForm.get("LinkExpiryDays").setErrors({ numbercheck: true });
      this.addForm.get("LinkExpiryDays").markAsDirty();
    }
  }

}
