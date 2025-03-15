/*
  @Type: File, <ts>
  @Name: manageRemoveReason.component.ts
  @Who: Piyush Singh
  @When: 24-Sept-2021
  @Why:EWM-2869.EWM-2924
  @What: remove reason unit master add and update
 */
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { SalaryunitService } from 'src/app/modules/EWM.core/shared/services/salary-unit/salaryunit.service';
import { PreviousRouteService } from 'src/app/shared/services/commonservice/previous-route-service.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';

@Component({
  selector: 'app-manage-remove-reason',
  templateUrl: './manage-remove-reason.component.html',
  styleUrls: ['./manage-remove-reason.component.scss']
})
export class ManageRemoveReasonComponent implements OnInit {

  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public categoryList: any[];
  addForm: FormGroup;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  @Input() name: string;
  loadingscroll: boolean;
  public auditParameter;
  public disable: boolean = false;
  activestatus: string;
  statusList: [] = []
  viewModeValue: any;
  editData = {};
  maxMessage = 200;
  reasonGroupId: any;
  reasonId: any;
  parentId: any;
  parentName: any;
  ModuleName: any;
  reasonGroupID:any;
  groupName:any;

  constructor(private fb: FormBuilder, private _salaryUnitServices: SalaryunitService, private jobService: JobService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private previousRouteService: PreviousRouteService,
    public dialog: MatDialog, private translateService: TranslateService, private routes: ActivatedRoute,) {
    this.addForm = this.fb.group({
      Id: [''],
      LastUpdated: [''],
      Description: ['', [Validators.maxLength(200)]],
      ReasonName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]], //@who:priti;@why:EWM-4094;@when:10-dec-2021;
     //ReasonName: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
      StatusName: [null, [Validators.required]],//@who:priti;@why:EWM-4095;@when:10-dec-2021;@what:required field condition
      Status: [0, [Validators.required]],//@who:priti;@why:EWM-4095;@when:10-dec-2021;@what: required field condition
    });

    this.jobService.activeModuleName.subscribe(res => {
      this.ModuleName = res;
    })
    this.jobService.activeReasonDeatils.subscribe(res => {
      // console.log(res);
      this.parentId = res.parentId;
      this.parentName = res.parentName;
    })

    if (localStorage.getItem('parentId') != undefined && localStorage.getItem('parentId') != null && localStorage.getItem('parentId') != '') {
      this.parentId = localStorage.getItem('parentId');
      this.parentName = localStorage.getItem('parentName');
      this.ModuleName = localStorage.getItem('moduleName');

    }

    this.routes.queryParams.subscribe((value) => {
      if(value?.id == undefined || value?.id == null || value?.id == '') {
        this.reasonGroupID = value.reasonId;
      }else{
        this.reasonGroupID = value.id;
      }

    //  console.log(value,'myData')
    });
// <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->                  
    let status = {StatusId:1,StatusName:'Active'};  
    this.onChangeStatus(status);
  }
  ngOnInit(): void {
    this.getAllStatus();
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
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
    this.routes.params.subscribe((params) => {
      this.reasonId = params.id;
    });
    this.routes.queryParams.subscribe((grpName)=>{
      this.groupName = grpName['groupName']
    })


  }



  // Cancel adding list button onclick method by Piyush Singh

  onCancel() {
    this.route.navigate(['./client/core/administrators/reason-module/reason'] ,{ queryParams: { id: this.reasonGroupID,groupName: this.groupName }});
  }
  
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

  onChangeStatus(value) {
    this.addForm.patchValue({
      Status: value.StatusId,
      StatusName: value.StatusName,
    })
  }

  onSave() {
    if (this.addForm.invalid) {
      return;
    }
    this.submitted = true;
     this.onNameChanges(true);
     //@who:priti;@why:EWM-4101;@when:10-dec-2021;@what:code commented 
    // if (this.addForm && this.submitted == true) {
    //   if (this.routes.snapshot.params.id == null) {
    //     this.add(this.addForm.value);
    //     // console.log(this.addForm.value)
    //   } else {
    //     this.update(this.addForm.value);
    //   }
    // }
  }


  public onNameChanges(isSave:boolean) {
    let ID = this.addForm.get("Id").value;
    if (ID == null || ID == '') {
      ID = 0;
    }
    let ReasonName = this.addForm.get("ReasonName").value;
    if (ReasonName == null || ReasonName == '') {
      return;
    }
    let duplicateJson={};
    duplicateJson['Id']= ID;
    duplicateJson['ReasonName']= ReasonName;
    duplicateJson['GroupName']= this.groupName;
    duplicateJson['ReasonGroupId']= parseInt(this.parentId);
    duplicateJson['ReasonGroupInternalCode']= parseInt(this.reasonGroupID);


    this.jobService.checkdDuplicayReason(duplicateJson).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.addForm.get("ReasonName").setErrors({ codeTaken: true });
            this.addForm.get("ReasonName").markAsDirty();
            this.submitted = false;
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (data.Data == true) {
            this.addForm.get("ReasonName").markAsPristine();
            if (this.addForm && this.submitted == true && isSave==true) {
              if (this.routes.snapshot.params.id == null) {
                this.add(this.addForm.value);
              } else {
                this.update(this.addForm.value);
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
  // edit button onclick method for the remove reason method by Piyush Singh
/*
    @Type: File, <ts>
    @Name: editForm function
    @Who:  Subhojit
    @When:06-APRil-2022
    @Why:  #EWM-6029-6125
    @What: for patching data while edit form
    */
  editForm() {
    this.loading = true;
    this.jobService.getReasonGroupById(this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.editData = data.Data;
          // console.log(" this.editData ",this.editData);
          this.addForm.patchValue({
            Id: data.Data.Id,
            LastUpdated: data.Data.LastUpdated,
            ReasonName: data.Data.ReasonName,
            Description: data.Data.Description,
            Status: data.Data.Status,
            StatusName: data.Data.StatusName
          });
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
  // Add button onclick method by Piyush Singh
  add(value) {
    this.loading = true;
    const formData = new FormData();
    value['GroupName'] = this.groupName;
    value['ReasonGroupId'] = parseInt(this.parentId);
    value['ReasonGroupInternalCode']= this.reasonGroupID;
    value['PageName'] = "manage-reason";
    value['BtnId'] = this.activestatus;
    var removeJsonId = value;
    delete removeJsonId.Id;
    this.jobService.CreateReason(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          // this.onCancel();
          let viewModeData: any = this.viewModeValue;
          this.route.navigate(['./client/core/administrators/reason-module/reason'],{ queryParams: { id: this.reasonGroupID, groupName: this.groupName }});
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        // this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  // Update operation method after edit on click by Piyush Singh
  update(value) {
    this.loading = true;
    value['GroupName'] = this.groupName;
    value['ReasonGroupId'] = parseInt(this.parentId);
    value['ReasonGroupInternalCode']= this.reasonGroupID;
    value['PageName'] = "manage-reason";
    value['BtnId'] = this.activestatus;
    var removeJsonId = {
      "From": this.editData,
      "To": value
    }
    this.jobService.UpdateReason(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.route.navigate(['./client/core/administrators/reason-module/reason'],{ queryParams: { id: this.reasonGroupID ,  groupName: this.groupName }});
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        // this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  reloadApiBasedOnorg() {
    this.route.navigate(['/client/core/administrators/reason']);
  }



  /* 
     @Type: File, <ts>
     @Name: onMessage function
     @Who: Suika
     @When: 21-Oct-2021
     @Why: EWM-3424
     @What: For showing max message validation
     */
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 200 - value.length;
    }
  }

}
