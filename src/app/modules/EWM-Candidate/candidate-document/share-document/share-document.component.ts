  /*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Suika
  @When: 18-Sept-2021
  @Why: EWM-2522 EWM-2833
  @What: this section handle share document related functions
*/

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
import {  RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { QuickpeopleComponent } from '../../../EWM.core/shared/quick-modal/quickpeople/quickpeople.component';
import { ProfileInfoService } from '../../../EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleService } from '../../../EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from '../../../EWM.core/shared/services/system-setting/system-setting.service';
import { AddphonesComponent } from '../../../EWM.core/shared/quick-modal/addphones/addphones.component';
import { QuicklocationComponent } from '../../../EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { CandidateService } from '../../../EWM.core/shared/services/candidates/candidate.service';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-share-document',
  templateUrl: './share-document.component.html',
  styleUrls: ['./share-document.component.scss']
})
export class ShareDocumentComponent implements OnInit {  
  /**********************global variables decalared here **************/ 
  phone: any = [];
  shareDocUserList:any = [];
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
  public loading:boolean;
  public loadingSearch:boolean;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  public searchValue: string = "";
  searchUserCtrl = new FormControl();
  EmailList=new FormControl('',[Validators.required])//@when:1-nov-2021;@who:Priti Srivastva;@why: EWM-3465-->
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  documentAccessModeList: any = [];
  userSelectedList: any = [];
  searchUserList: any = [];
  currentUser:any;
  docName:any;
  docId:any;
  maxMessage=1000;
  userListLengthMore: any = 5;
  public PreviewUrl: string;
  activatedRoute:any;

  Link:string;
  documentType:string;
  public emailnotfound:boolean=false;
  public found:boolean=false;
  jobId: string;
  public redirectLink:boolean=false;
  public caontactTabIndex:number=7
  public clientId:string;
  internalShareLink: string;

  constructor(public dialogRef: MatDialogRef<QuickpeopleComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,private _Service:DocumentCategoryService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private appSettingsService: AppSettingsService, private router:Router,private route: Router,private routes: ActivatedRoute) {
      this.emailPattern=this.appSettingsService.emailPattern;
      this.PreviewUrl = "/assets/user.svg";
      if(data)
      {
        this.docName = data.documentData.Name; 
        this.docId = data.documentData.Id; 
        this.candidateId=data.candidateId;
        this.candidateName = data.candidateName;
        this.activityStatus = data.formType; 
        this.documentType = data.documentData.DocumentType; 
        this.jobId=data?.jobId;
        this.redirectLink=data?.shareData;
        this.internalShareLink=data?.internalShareLink;
      }
       
      this.addForm = this.fb.group({
      Id: [''],
      ToEmailIds: [[]],
      // message: ['', [Validators.maxLength(1000)]],       
      // edit: [''],
      // view: [1],
      // sendemail: [''] 
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
    let tenantData= JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData;
    this.getDocumentShareById();
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.
    
    // this.activatedRoute = this.routes.url;

    // this.route.navigate([],{
    //   relativeTo: this.activatedRoute,
    //   queryParams: { search: this.docName },
    //   queryParamsHandling: 'merge'
    // });
    //this.Link = window.location.href;
  }
 
 
 /* 
    @Type: File, <ts>
    @Name: onsearchByName function
    @Who: Suika
    @When: 18-Sept-2021
    @Why: EWM-2522 EWM-2833
    @What: search by name
    */
   public onsearchByName(inputValue: string) { 
            // who:maneesh,what:ewm. 8583,when:14/01/2023 start
    if (inputValue=='') {
      this.found=true;
      this.emailnotfound=false;
      this.addForm.get("EmailList")?.setErrors({ required: true });
      }
          // who:maneesh,what:ewm. 8583,when:14/01/2023 end

    if (inputValue.length === 0) {
      this.searchUserList = [];
      this.loadingSearch = false;
    }
    if (inputValue.length > 0 && inputValue.length > 3) {
      this.searchValue = inputValue;
      this.loadingSearch = true;
      this._Service.getSearchUserWithGroup("?search=" + inputValue).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {            
            let filterarr = repsonsedata.Data;
            // who:maneesh,what:ewm. 8583,when:14/01/2023 start
            if (inputValue==filterarr.Email) {
               this.emailnotfound=false;
               this.found=false;
               this.addForm.get("EmailList").setErrors({ required: false });
            }
            // who:maneesh,what:ewm. 8583,when:14/01/2023 end

            filterarr.forEach(element => {  
              if(element.Type=='group'){
                element['FullNameEmail'] = element.FullName+'('+element.Type+')';
              }else{
                element['FullNameEmail'] = element.FullName+'('+element.Email+')'; 
              }
            });
            this.searchUserList = filterarr;
            this.loadingSearch = false;
          } else if (repsonsedata.HttpStatusCode === 204) {
            // who:maneesh,what:ewm. 8583,when:14/01/2023 start
            if (this.searchValue) {
              this.emailnotfound=true;
              this.found=false;
            }else{
              this.emailnotfound=false;
            }
            // who:maneesh,what:ewm. 8583,when:14/01/2023 end 

            this.searchUserList = []
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
    @Who: Suika
    @When: 18-Sept-2021
    @Why: EWM-2522 EWM-2833
    @What: get remove chips skills
    */
  remove(Id): void {
    const index = this.userSelectedList.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.userSelectedList.splice(index, 1);
    }
    if (this.userSelectedList.length > 0) {
    } else {
      //@when:1-nov-2021;@who:Priti Srivastva;@why: EWM-3465
      this.EmailList.setValue('');
     }

  }
  /* 
   @Type: File, <ts>
   @Name: selectedUserEmail function
   @Who: Suika
   @When: 18-Sept-2021
   @Why: EWM-2522 EWM-2833
   @What: get selected user name and email List
   */
  public selectedUserEmail(event: MatAutocompleteSelectedEvent): void {
    let duplicateCheck = this.userSelectedList.filter(x => x['FullNameEmail'] === event.option.value.FullNameEmail);     
       if(duplicateCheck.length ==0){
          this.userSelectedList.push({
            'UserId':  event.option.value.UserId,
            'EmailId': event.option.value.Email,
            'TypeId':  event.option.value.Id,
            'Type':    event.option.value.Type,
            'FullNameEmail':  event.option.value.FullNameEmail
          });
        }
     //@when:1-nov-2021;@who:Priti Srivastva;@why: EWM-3465   
   if(this.userSelectedList.length>0)
   {
     this.EmailList.setValue(this.userSelectedList);
   }
   //end : EWM-3465 
    this.nameInput.nativeElement.value = '';
    this.searchUserCtrl.setValue(null);
  }


  public onMessage(value){
    if(value!=undefined && value!=null){
      this.maxMessage=1000-value.length;
     }
    
  
  }
  
  
  public clickForMoreRecord() {
    this.userListLengthMore = this.userSelectedList.length;
  }
  
 

  /* 
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Suika
    @When: 18-Sept-2021
    @Why: EWM-2522 EWM-2833
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {   
      this.shareDocument();
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }   
  }


  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();

  }


  shareDocument(){  
    //console.log("this.currentUser ",this.currentUser);
    if (this.addForm.invalid) {
      return;
    }
    let permissionName = "";
    if(this.addForm.value.edit!=''){
      permissionName = "edit";
    }else{
      permissionName = "view";
    }
    let createPeopJson = {};
    //createPeopJson['orgId'] = this.addPeopleForm.value.orgId;
    createPeopJson['Id'] =this.docId;
    createPeopJson['Name']=this.docName;
    // createPeopJson['PermissionName'] = permissionName;
    createPeopJson['Message'] = this.addForm.value.message;
    createPeopJson['CandidateId'] = this.candidateId;
    createPeopJson['CandidateName'] =this.candidateName; 
    createPeopJson['ToEmailIds'] = this.userSelectedList;
    createPeopJson['UserName'] =  this.currentUser.FirstName+' '+this.currentUser.LastName; 
    // createPeopJson['Link'] = window.location.href; //who:maneesh,what:ewm-14343 for redirect  when internal share pass caontactTabIndex,clientId:this.clientId when:15/09/2023
    if (this.redirectLink==true) { 
     // this.internalShareLink
     createPeopJson['Link'] = window.location.origin +this.internalShareLink;  
     // createPeopJson['Link'] = window.location.origin + '/client/core/clients/list/client-detail?clientId=' + this.clientId + '&cliTabIndex=' + this.caontactTabIndex;  
      }else{
      createPeopJson['Link'] = window.location.href; 
      }
    createPeopJson['DocumentType'] = this.documentType?this.documentType:'';
    // createPeopJson['SentEmail'] = (this.addForm.value.sendemail==true)?1:0;
    createPeopJson['DocumentType'] = this.documentType?this.documentType:'';
    createPeopJson['jobId'] = this.jobId?this.jobId:'00000000-0000-0000-0000-000000000000';
    this._Service.shareDocument(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addForm.reset();
          document.getElementsByClassName("share-docs")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("share-docs")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
 


  }



  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Suika
    @When: 18-Sept-2021
    @Why: EWM-2522 EWM-2833
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    document.getElementsByClassName("share-docs")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("share-docs")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

  }
  
  /* 
 @Type: File, <ts>
 @Name: getDocumentShareById function
  @Who: Suika
  @When: 18-Sept-2021
  @Why: EWM-2522 EWM-2833
 @What: get relationship type List
 */
getDocumentShareById() {
  this._Service.getshareDocumentById('?id='+this.docId).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.shareDocUserList = repsonsedata.Data;
       // console.log("this.shareDocUserList "+this.shareDocUserList);
      }else  if (repsonsedata.HttpStatusCode === 204) {
        this.shareDocUserList = [];        
       } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
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
