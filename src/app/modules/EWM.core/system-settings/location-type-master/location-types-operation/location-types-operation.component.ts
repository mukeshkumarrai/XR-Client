/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 13-May-2021
  @Why: EWM-1526
  @What:  This page will be use for the sms template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { locationMaster } from '../../../shared/datamodels/location-type';
import { ResponceData } from '../../../shared/datamodels/location-type';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusList } from '../../../shared/datamodels/common.model';

@Component({
  providers: [ MessageService ],
  selector: 'app-location-types-operation',
  templateUrl: './location-types-operation.component.html',
  styleUrls: ['./location-types-operation.component.scss']
})
export class LocationTypesOperationComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
  addForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public submitted = false;
  public LocAddObj = {};
  public tempID: number;
  public specialcharPattern = "[A-Za-z0-9. ]+$";
  public  statusList: any=[];
  public viewMode: any;

/* 
@Type: File, <ts>
@Name: constructor function
@Who: Nitin Bhati
@When: 14-May-2021
@Why: ROST-1527
@What: constructor for injecting services and formbuilder and other dependency injections
*/
  constructor(private fb: FormBuilder,private systemSettingService:SystemSettingService,private snackBService:SnackBarService,
    public _sidebarService: SidebarService,private route: Router, public dialog: MatDialog,
    private translateService: TranslateService,private routes: ActivatedRoute,private commonserviceService:CommonserviceService ) {
      this.addForm = this.fb.group({
        Id: [''],
        Description: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator]],
        BuiltIn: [false],
        Status: ["1", Validators.required] //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
      });
    }
 /* 
@Type: File, <ts>
@Name: ngOnInit function
@Who: Nitin Bhati
@When: 14-Dec-2020
@Why: ROST-487
@What: For calling 
*/
  ngOnInit(): void {
    this.getStatusList();
    let URL = this.route.url;
   // let URL_AS_LIST = URL.split('/');
   let URL_AS_LIST;
   if(URL.substring(0, URL.indexOf("?"))==''){
    URL_AS_LIST = URL.split('/');
   }else
   {
    URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
   }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.routes.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.activestatus = 'Edit';
          this.tempID = params['id'];
          this.editForm(this.tempID);
        }
        if(params['V'] != undefined)
        {
          this.viewMode=params['V'];
        }
      });

    // this.routes.params.subscribe(
    //   params => {
    //     if (params['id'] != undefined) {
    //       this.activestatus = 'Edit';
    //       this.tempID = params['id'];
    //       this.editForm(this.tempID);
    //     }
    //   });
}    
/* 
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 19-May-2021
   @Why: ROST-1527
   @What: For setting value in the edit form
  */
   editForm(Id: Number) {
    this.loading = true;
    this.systemSettingService.getLocationTypeByID('?id=' + Id).subscribe(
      (data: locationMaster) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          let isBuiltIn;
         // let isActive;
          if (data['Data'].IsBuiltIn == 1) {
            isBuiltIn = true;
          } else {
            isBuiltIn = false;
          }
          //  if (data['Data'].IsActive == 1) {
          //   isActive = '1';
          // } else {
          //   isActive = '2';
          // }
          this.addForm.patchValue({
            Id: data['Data'].Id,
            BuiltIn: isBuiltIn,
            Description: data['Data'].Name,
            Status: data['Data'].Status.toString(),
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
   @Who: Nitin Bhati
   @When: 19-May-2021
   @Why: ROST-1527
   @What: For checking wheather the data save or edit on the basis on active satatus
  */

  onSave(value) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createLocationMaster(value);
    } else {
      this.updateLocationMaster(value);
    }

  }

  /* 
   @Type: File, <ts>
   @Name: createLocationMaster function
   @Who: Nitin Bhati
   @When: 19-May-2021
   @Why: ROST-1527
   @What: For saving location master data
  */

  createLocationMaster(value) {
    this.loading = true;
    this.LocAddObj['Name'] = value.Description;
    //this.GrupAddObj['is_builtin'] = parseInt(isBuiltIn);
    this.LocAddObj['Status'] = parseInt(value.Status);
    this.systemSettingService.locationTypeCreate(this.LocAddObj).subscribe((repsonsedata:locationMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.route.navigate(['./client/core/administrators/location-types'],{ queryParams: {V:this.viewMode}});
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
   @Name: updateLocationMaster function
   @Who: Nitin Bhati
   @When: 19-May-2021
   @Why: EWM-1527
   @What: For updating location master data
  */
  updateLocationMaster(value) {
    let updateLocObj={};
    this.loading = true;
    let isBuiltIn: any;
    if (value.BuiltIn == true) {
      isBuiltIn = 1;
    } else {
      isBuiltIn = 0;
    }
    updateLocObj['Id'] = value.Id;
    updateLocObj['Name'] = value.Description;
    updateLocObj['Status'] = parseInt(value.Status);
    this.systemSettingService.updateLocationType(updateLocObj).subscribe((repsonsedata:locationMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.route.navigate(['./client/core/administrators/location-types'],{ queryParams: {V:this.viewMode}});
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         
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
   @Name: duplicayCheck function
   @Who: Nitin Bhati
   @When: 19-May-2021
   @Why: ROST-1527
   @What: For checking duplicacy for code and description
  */
   duplicayCheck() {
   let locationTypeID = this.addForm.get("Id").value;
     if (locationTypeID == null) {
      locationTypeID = 0;
     }
     if (locationTypeID == '') {
      locationTypeID = 0;
     }
     

    this.systemSettingService.checkLocationTypeDuplicacy('?locationtype=' + this.addForm.get("Description").value  + '&id='+locationTypeID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data == true) {
            this.addForm.get("Description").setErrors({ codeTaken: true });
            this.addForm.get("Description").markAsDirty();
          }
        }
        else if (data.HttpStatusCode == 400) {
          if (data.Data == false) {
            this.addForm.get("Description").clearValidators();
            this.addForm.get("Description").markAsPristine();
            this.addForm.get('Description').setValidators([Validators.required, Validators.maxLength(100),Validators.pattern(this.specialcharPattern)]);
          }
        }
        else {
    //  <!-- who:maneesh,what:ewm-12790 comment this and  handel white space validation ,when:16/06/2023 -->
          // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }
  
 /* 
   @Type: File, <ts>
   @Name: getStatusList function
   @Who: Nitin Bhti
   @When: 20-May-2021
   @Why: ROST-1527
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

    //  <!-- who:maneesh,what:ewm-12790 for handel white space validation,when:16/06/2023 -->
    public noWhitespaceValidator(control: FormControl) {
      const isWhitespace = (control.value || '').trim()?.length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
  }
}