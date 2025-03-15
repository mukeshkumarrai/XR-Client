/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
  @When: 15-May-2021
  @Why: EWM-1448 EWM-1495
  @What:  This page will be use for the add People Master Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponceData } from 'src/app/shared/models/responce.model';

@Component({
  providers: [MessageService],
  selector: 'app-add-communication-master',
  templateUrl: './add-communication-master.component.html',
  styleUrls: ['./add-communication-master.component.scss']
})
export class AddCommunicationMasterComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  // status: boolean = false;
  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public categoryList: any[];
  public formtitle: string = 'grid';
  addUserContactForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  viewMode: string = "listMode";
  //public specialcharPattern = "^[A-Za-z0-9 ]+$";
  //Who:Ankit Rawat, What:EWM-16432 Allow only alphabet pattern in Contact Type, When:14March24
  public specialcharPattern = "^[A-Za-z ]+$";
  @Input() name: string;
  canLoad = false;
  pendingLoad = false;
  pagesize;
  public ascIcon: string;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;
  public idSms = '';

  public disable: boolean = false;
  activestatus: string;
  statusList: [] = []
  viewModeValue: any;
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup Singh
  @When: 17-May-2020
   @Why: EWM-1448 EWM-1497
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,) {
    this.pagesize = this.appSettingsService.pagesize;

    this.addUserContactForm = this.fb.group({
      Id: [''],
      Category: [[], [Validators.required]],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),
         Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      Status: [1, [Validators.required]] // <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
    });

  }
  /* 
 @Type: File, <ts>
 @Name: ngOnInit function
 @Who: Anup Singh
  @When: 17-May-2020
   @Why: EWM-1448 EWM-1497
 @What: For calling 
 */
  ngOnInit(): void {
    let btnId = document.getElementById("btnSave");
  

    this.getAllCategoryList();
    this.getAllStatus();

    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    if (this.routes.snapshot.params.id != null) {
      this.editForm();
      this.disable = true;
      this.activestatus = "Edit";
    } else {
      this.activestatus = "Add";
    }
    // let queryParams = this.routes.snapshot.params.id;
    // this.idSms = decodeURIComponent(queryParams);
    // if (this.idSms == 'undefined') {
    //   this.idSms = "";
    // } else {
    //   this.idSms = decodeURIComponent(queryParams);
    // }

    ///////geting Data Via Routing from user contact type component///////
    this.routes.queryParams.subscribe((params) => {
 
      this.viewModeValue = params['ViewModeDataValue'];
    })
    ////////

  }



  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    })
  }


  /*
  @Type: File, <ts>
  @Name: onCancel() function 
  @Who: Anup Singh
  @When: 20-May-2020
  @Why: EWM-1448 EWM-1497
  @What: For Navigate list component and also sending data via routing
 */
  onCancel() {
    ////////For Sending Data Of view mode by routing and also doing routing/////////
    let viewModeData: any = this.viewModeValue;
   /* this.route.navigate(['/client/core/administrators/communication-master'], {
      queryParams: { viewModeData }
    })*/
    //////////////
    this.route.navigate(['/client/core/administrators/communication-master']);
  }

  /* 
   @Type: File, <ts>
   @Name: getAllStatus function
   @Who: Anup Singh
   @When: 20-May-2020
   @Why: EWM-1448 EWM-1497
   @What: For All status List
   */

  getAllStatus() {
    this.loading = true;
    this.systemSettingService.getAllUserTypeStatus().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.statusList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /* 
  @Type: File, <ts>
  @Name: getAllCategoryList function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: For All Category List
  */

  getAllCategoryList() {
    this.loading = true;
    this.systemSettingService.getAllCategory().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.categoryList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


   /* 
     @Type: File, <ts>
     @Name: onSave function
     @Who: Anup Singh
     @When: 17-May-2020
     @Why: EWM-1448 EWM-1497
     @What:This function is used for update and save record into database
    */
   onSave(value) {
    this.submitted = true;
    if (this.addUserContactForm.invalid) {
      return;
    }
   this.onContactNameChanges();
  }


  /* 
   @Type: File, <ts>
   @Name: onContactNameChanges Function
   @Who: Anup Singh
  @When: 19-May-2020
   @Why: EWM-1448 EWM-1497
   @What:  For check duplicate value
  */
  public onContactNameChanges() {
    let contactTypeID = this.addUserContactForm.get("Id").value;
    if (contactTypeID == null) {
      contactTypeID = 0;
    }
    if (contactTypeID == '') {
      contactTypeID = 0;
    }
    if(  this.addUserContactForm.get("Name").value != null && this.addUserContactForm.get("Name").value != '' &&  this.addUserContactForm.get("Name").value != undefined
    && this.addUserContactForm.get("Category").value != null && this.addUserContactForm.get("Category").value != '' &&  this.addUserContactForm.get("Category").value != undefined ){

    this.systemSettingService.checkdContactDuplicay('?contacttype=' + this.addUserContactForm.get("Name").value
    + '&category='+ this.addUserContactForm.get("Category").value + '&id=' + contactTypeID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data == true) {
            this.addUserContactForm.get("Name").setErrors({ codeTaken: true });
            this.addUserContactForm.get("Name").markAsDirty();
          }
          // who:maneesh,what:ewm-12804 for handel 204 case,when:23/06/2023
        } else if (data.HttpStatusCode == 204) {
          if (data.Data == false) {
            //this.addUserContactForm.get("Name").clearValidators();
            this.addUserContactForm.get("Name").markAsPristine();
            if(this.addUserContactForm && this.submitted == true){
              if (this.routes.snapshot.params.id == null) {
                this.addUserContactType(this.addUserContactForm.value);
              } else {
                this.addUserContactForm.controls.Category.enable();
                this.editUserContactType(this.addUserContactForm.value);
              }
            }
          }
        }
        else if (data.HttpStatusCode == 400) {
          if (data.Data == false) {
            //this.addUserContactForm.get("Name").clearValidators();
            this.addUserContactForm.get("Name").markAsPristine();
            if(this.addUserContactForm && this.submitted == true){
              if (this.routes.snapshot.params.id == null) {
                this.addUserContactType(this.addUserContactForm.value);
              } else {
                this.addUserContactForm.controls.Category.enable();
                this.editUserContactType(this.addUserContactForm.value);
              }
            }
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

    }
  }



  /*
      @Type: File, <ts>
      @Name: editForm function
      @Who: Anup Singh
     @When: 17-May-2020
     @Why: EWM-1448 EWM-1497
      @Why: use for set value in patch file for showing information.
      @What: .
     */
  editForm() {
    this.loading = true;
    this.systemSettingService.getPeopleMasterContactByID('?id=' + this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode == 200) {
          this.addUserContactForm.patchValue({
            Id: data.Data.Id,
            Category: data.Data.Category,
            Name: data.Data.Name,
            Status: data.Data.Status,

          });
          this.addUserContactForm.controls.Category.disable();
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })

  }


 

  /* 
      @Type: File, <ts>
      @Name: addUserContactType
     @Who: Anup Singh
     @When: 17-May-2020
     @Why: EWM-1448 EWM-1497
      @What:  For submit the form data
    */
  addUserContactType(value) {
    this.loading = true;
    const formData = new FormData();
    // if (value.Status == "1") {
    //   value['Status'] = 1;
    // } else {
    //   value['Status'] = 2;
    // }
    var removeJsonId = value;
    delete removeJsonId.Id;
    this.systemSettingService.createPeopleMasterUserContactType(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addUserContactForm.reset();

          ////////For Sending Data Of view mode by routing and also doing routing/////////
          let viewModeData: any = this.viewModeValue;
         /* this.route.navigate(['/client/core/administrators/communication-master'], {
            queryParams: { viewModeData }
          })*/

          this.route.navigate(['/client/core/administrators/communication-master']);
          //////////////

          this.loading = false;
          this.formtitle = 'grid';
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
      @Type: File, <ts>
      @Name: editUserContactType function
     @Who: Anup Singh
     @When: 17-May-2020
     @Why: EWM-1448 EWM-1497
     @What: use for Edit user Conatct Type data.
      
     */
  editUserContactType(value) {
    this.loading = true;
    this.systemSettingService.updatePeopleMasterContactType(value).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addUserContactForm.reset();

          ////////For Sending Data Of view mode by routing and also doing routing/////////
          let viewModeData: any = this.viewModeValue;
         /* this.route.navigate(['/client/core/administrators/communication-master'], {
            queryParams: { viewModeData }
          })*/
          this.route.navigate(['/client/core/administrators/communication-master']);
         
          this.loading = false;
          this.formtitle = 'grid';
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }



  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
   @Who: Anup Singh
     @When: 17-May-2020
     @Why: EWM-1448 EWM-1497
  @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.formtitle = 'grid';
    this.route.navigate(['/client/core/administrators/communication-master']);
  }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 23-dec-2022
   @Why: EWM-9958
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

}
