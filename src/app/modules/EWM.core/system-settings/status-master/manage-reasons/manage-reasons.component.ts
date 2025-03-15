/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-reasons.component.ts
  @Who: Renu
  @When: 18-May-2021
  @Why: ROST-1540
  @What: reason master edit/add manage forms
 */

  import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { statusList } from '../../../shared/datamodels/common.model';
import { reasonMaster } from '../../../shared/datamodels/status-master';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-manage-reasons',
  templateUrl: './manage-reasons.component.html',
  styleUrls: ['./manage-reasons.component.scss']
})
export class ManageReasonsComponent implements OnInit {
 /**********************All generic variables declarations for accessing any where inside functions********/
 addReasonForm: FormGroup;
 public loading: boolean = false;
 public activestatus: string = 'Add';
 public tempID: number;
 public submitted = false;
 public reasonCreateObj = {};
 public statusId: any;
 public groupId: any;
 public statusList: any=[];
 public viewMode: any;
   
/* 
@Type: File, <ts>
@Name: constructor function
@Who: Renu
@When: 12-May-2021
@Why: ROST-1540
@What: For injection of service class and other dependencies
*/
 constructor(private fb: FormBuilder,private translateService: TranslateService,private router: ActivatedRoute,
   private snackBService: SnackBarService,private reasonsService:SystemSettingService,private route:Router,
   public _sidebarService: SidebarService,private commonserviceService:CommonserviceService) { 

     this.addReasonForm = this.fb.group({
       ID: [''],
       ReasonDescription: ['', [Validators.required,Validators.maxLength(100)]],
       //IsBuiltIn: [true],
       status: ['1', Validators.required] // <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
     });
   }

 ngOnInit(): void {
  this.getStatusList();
  let URL = this.route.url;
  //let URL_AS_LIST = URL.split('/');
  let URL_AS_LIST;
  if(URL.substring(0, URL.indexOf("?"))==''){
   URL_AS_LIST = URL.split('/');
  }else
  {
   URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
  }
  this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
  this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
     this.router.queryParams.subscribe(
       params => {
         this.statusId=params['statusId'];
         this.groupId=params['GroupId'];                  
         if (params['Id'] != undefined) {
         this.activestatus = 'Edit'
         this.tempID = parseInt(params['Id']);
         this.editForm(this.tempID);
       } else {
         this.activestatus = 'Add';
       }
       if(params['V'] != undefined)
       {
         this.viewMode=params['V'];
       }
     });
 }
 /*
  @Type: File, <ts>
  @Name: editForm function
  @Who: Renu
  @When: 12-May-2021
  @Why: ROST-1540
  @What: For setting valu in the edit form
 */

 editForm(Id: Number) {
   this.loading = false;
   this.reasonsService.getReasonByID('?StatusId=' + this.statusId + '&Id=' + Id + '&GroupId='+ this.groupId).subscribe(
     (data: reasonMaster) => {
       this.loading = false;
       if (data.HttpStatusCode === 200) {
         this.addReasonForm.patchValue({
           ID: data.Data.Id,
           ReasonDescription: data.Data.Description,
          // IsBuiltIn: Boolean(data.Data.BuiltIn),
           status: String(data.Data.Status)
         });

       }
       else {
         this.loading = false;
         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

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
    @Who: Renu
    @When: 18-May-2021
    @Why: ROST-1540
    @What: For checking wheather the data save or edit on the basis on active satatus
   */


 onSave(value) {
   this.submitted = true;
   if (this.addReasonForm.invalid) {
     return;
   }
   if (this.activestatus == 'Add') {
     this.createReasonMaster(value);
   } else {
     this.updateReasonMaster(value);
   }

 }


 /*
  @Type: File, <ts>
  @Name: createReasonMaster function
  @Who: Renu
  @When: 18-May-2021
  @Why: ROST-1540
  @What: For saving data for Reason master
 */
 createReasonMaster(value: any) {
   this.loading = true;
  //  let isBuiltIn: any;
  //  if (value.IsBuiltIn == true) {
  //    isBuiltIn = 1;
  //  } else {
  //    isBuiltIn = 0;
  //  }
   this.reasonCreateObj['StatusId'] = this.statusId;
   this.reasonCreateObj['Description'] = value.ReasonDescription;
   // who:maneesh,EWM-11414 for delete data in job and candidate pass GroupId,when:21/03/2023,
   this.reasonCreateObj['GroupId'] = this.groupId;
  // this.reasonCreateObj['BuiltIn'] = parseInt(isBuiltIn);
   this.reasonCreateObj['Status'] = parseInt(value.status);
   this.reasonsService.reasonCreate(this.reasonCreateObj).subscribe((repsonsedata: reasonMaster) => {
     if (repsonsedata.HttpStatusCode === 200) {
       this.loading = false;
       this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
   
       this.route.navigate(['./client/core/administrators/group-master/reason'],{ queryParams: {GroupId:this.groupId,statusId: this.statusId,V:this.viewMode}});

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
    @Name: updateReasonMaster function
    @Who: Renu
    @When: 18-May-2021
    @Why: ROST-1540
    @What: For updating data for Reason master
   */

 updateReasonMaster(value: any) {
   let updateReasonObj = {};
   this.loading = true;
  //  let isBuiltIn: any;
  //  if (value.IsBuiltIn == true) {
  //    isBuiltIn = 1;
  //  } else {
  //    isBuiltIn = 0;
  //  }

   updateReasonObj['Id'] = value.ID;
   updateReasonObj['StatusId'] =this.statusId;
   updateReasonObj['GroupId'] =this.groupId;

   updateReasonObj['Description'] = value.ReasonDescription;
  // updateReasonObj['BuiltIn'] = parseInt(isBuiltIn);
   updateReasonObj['Status'] = parseInt(value.status);

   this.reasonsService.updateReason(updateReasonObj).subscribe((repsonsedata: reasonMaster) => {
     if (repsonsedata.HttpStatusCode === 200) {
       this.loading = false;
       this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
   
       this.route.navigate(['./client/core/administrators/group-master/reason'],{ queryParams: {GroupId:this.groupId,statusId: this.statusId,V:this.viewMode}});

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
   @Name: getStatusList function
   @Who: Renu
   @When: 20-May-2021
   @Why: ROST-1539
   @What: For status listing 
  */
   getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
            this.statusList=repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
}
