/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-status.component.ts
  @Who: Renu
  @When: 18-May-2021
  @Why: ROST-1539
  @What: status master edit/add manage forms
 */

import { Color, NgxMatColorPickerInput } from '@angular-material-components/color-picker';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { statusList } from '../../../shared/datamodels/common.model';
import { statusMaster } from '../../../shared/datamodels/status-master';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortalDirective } from '@angular/cdk/portal';

@Component({
  selector: 'app-manage-status',
  templateUrl: './manage-status.component.html',
  styleUrls: ['./manage-status.component.scss']
})
export class ManageStatusComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
addStatusForm: FormGroup;
public loading:boolean=false;
public activestatus: string = 'Add';
public primaryBgColor:string;
public  tempID: number;
public submitted = false;
public statusAddObj = {};
public GroupId: any;
public specialcharPattern = "[A-Za-z0-9 ]+$";
public  statusList: any=[];
public viewMode: any;
public codePattern =  new RegExp(/^[A-Z0-9]{1,15}$/); //^[A-Z0-9]{1,20}$ by maneesh for change max length 15 ewm-17841 when:07/08/2024
public StatusDataId: any[];
public StatusDataName:string;
defaultColorValue = '#FFFFFF';


// color picker varibale 
showColorPallateContainer = false;
color: any = '#2883e9'
selctedColor = '#FFFFFF';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
isOpen = false;
isMoreColorClicked!: boolean;
public status:string;
public Keyword:string='';
// color picker End  

/* 
@Type: File, <ts>
@Name: constructor function
@Who: Renu
@When: 18-May-2021
@Why: ROST-1539
@What: For injection of service class and other dependencies
*/

constructor(private fb: FormBuilder,private translateService: TranslateService,private router: ActivatedRoute,
  private snackBService: SnackBarService,private statusService:SystemSettingService,private route:Router, 
  public _sidebarService: SidebarService,private commonserviceService:CommonserviceService,
  public overlay: Overlay, public viewContainerRef: ViewContainerRef ) {
  this.addStatusForm = this.fb.group({
    ID: [''],
    StatusCode: ['', [Validators.required,Validators.pattern(this.codePattern)]],
    ShortDescription: ['', [Validators.required,Validators.maxLength(30)]],
    Description:['',Validators.maxLength(100)],
    ColorCode:[this.defaultColorValue],
    Order:['',[Validators.pattern("^[0-9]*$"),Validators.maxLength(8)]],
    IsBuiltIn: [true],
    status: ['1', Validators.required] // <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
  });

    this.primaryBgColor = '#FFFFFF';
  }


  ngOnInit(): void {  
    this.getStatusList();
    this.getColorCodeAll();
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
    this.router.queryParams.subscribe(
      params => {
        this.GroupId = params['groupId'];
        if (params['Id'] != undefined) {
          this.activestatus = 'Edit'
          this.tempID = params['Id'];
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
 @When: 18-May-2021
 @Why: ROST-1539
 @What: For setting value in the edit form
*/

  editForm(Id: Number) {
    this.loading = true;
    this.statusService.getStatusByID('?GroupId=' + this.GroupId + '&StatusId=' + Id).subscribe(
      (data: statusMaster) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.addStatusForm.patchValue({
            ID: data.Data.Id,
            StatusCode: data.Data.Code,
            ShortDescription: data.Data.ShortDescription,
            Description: data.Data.Description,
            Order: data.Data.DisplaySequence,
            ColorCode: (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode,
           // IsBuiltIn: Boolean(data.Data.BuiltIn),
            status: String(data.Data.Status)
          });
          this.status=String(data.Data?.Status);
          this.Keyword=data.Data?.Keyword;
          this.StatusDataName = data.Data?.StatusName;
          this.selctedColor = data.Data?.ColorCode;
          if (data.Data?.Keyword?.toLowerCase()=='lead') {         //by maneesh ewm-19248   
            this.addStatusForm.controls['status']?.disable();
        }else{
          this.addStatusForm.controls['status']?.enable(); 
        }
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
     @Why: ROST-1539
     @What: For checking wheather the data save or edit on the basis on active satatus
    */

  onSave(value) {
    this.submitted = true;
    if (this.addStatusForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createStatusMaster(value);
    } else {
      this.updateStatusMaster(value);
    }

  }

  /*
     @Type: File, <ts>
     @Name: createStatusMaster function
     @Who: Renu
     @When: 18-May-2021
     @Why: ROST-1539
     @What: For saving data for status master
    */

  createStatusMaster(value: any) {

    this.loading = true;
    let isBuiltIn: any;
    let seqOrder: any;
    // if (value.IsBuiltIn == true) {
    //   isBuiltIn = 1;
    // } else {
    //   isBuiltIn = 0;
    // }
    if (value.Order == '' || value.Order == null) {
      seqOrder = 0;
    } else {
      seqOrder = value.Order;
    }

    this.statusAddObj['GroupId'] = this.GroupId;
    this.statusAddObj['Code'] = value.StatusCode;
    this.statusAddObj['ShortDescription'] = value.ShortDescription;
    this.statusAddObj['Description'] = value.Description;
    this.statusAddObj['ColorCode'] =  this.selctedColor;
    this.statusAddObj['DisplaySequence'] = parseInt(seqOrder);
    //this.statusAddObj['BuiltIn'] = parseInt(isBuiltIn);
    this.statusAddObj['Status'] = parseInt(value.status);
    this.statusAddObj['StatusName'] = this.StatusDataName;


    this.statusService.statusCreate(this.statusAddObj).subscribe((repsonsedata: statusMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
   
        //this.route.navigate(['./client/core/administrators/group-master/status'], { queryParams: { groupId: this.GroupId,V:this.viewMode } });
        this.route.navigate(['./client/core/administrators/group-master/status'],{
          queryParams: {
            groupId: this.GroupId
          },
        });
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
   @Name: updateStatusMaster function
   @Who: Renu
   @When: 18-May-2021
   @Why: ROST-1539
   @What: For saving data for status master
  */

  updateStatusMaster(value: any) {  
    let updateStatusObj = {};
    this.loading = true;
   // let isBuiltIn: any;
    let seqOrder: any;
    // if (value.IsBuiltIn == true) {
    //   isBuiltIn = 1;
    // } else {
    //   isBuiltIn = 0;
    // }
    if (value.Order == '' || value == null) {
      seqOrder = 0;
    } else {
      seqOrder = value.Order;
    }
    updateStatusObj['Id'] = value.ID;
    updateStatusObj['GroupId'] = this.GroupId;
    updateStatusObj['Code'] = value.StatusCode;
    updateStatusObj['ShortDescription'] = value.ShortDescription;
    updateStatusObj['Description'] = value.Description;
    updateStatusObj['ColorCode'] =  this.selctedColor
    updateStatusObj['DisplaySequence'] = parseInt(seqOrder);
    //updateStatusObj['BuiltIn'] = parseInt(isBuiltIn);
    updateStatusObj['Status'] = this.Keyword?.toLowerCase()=='lead'? parseInt(this.status): parseInt(value?.status);
    updateStatusObj['StatusName'] = this.StatusDataName;

    this.statusService.updateStatus(updateStatusObj).subscribe((repsonsedata: statusMaster) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
   
        //this.route.navigate(['./client/core/administrators/group-master/status'], { queryParams: { groupId: this.GroupId,V:this.viewMode } });
        this.route.navigate(['./client/core/administrators/group-master/status'],{
          queryParams: {
            groupId: this.GroupId
          },
        });
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
     @Name: checkCodeKeywordUnique function
     @Who: Renu
     @When: 18-May-2021
     @Why: ROST-1539
     @What: For checking duplicacy for code
    */
  checkCodeUnique() {
    let StatusId;
    if (this.tempID != undefined) {
      StatusId = this.tempID;
    } else {
      StatusId = '';
    }
    if (this.addStatusForm.controls['StatusCode'].value == '') {
      return false;
    }
    this.statusService.checkCodeDuplicacy('?StatusValue=' + this.addStatusForm.controls['StatusCode'].value + '&StatusId=' + StatusId + '&GroupId=' + this.GroupId ).subscribe(
      (repsonsedata: statusMaster) => {
      /*  @Who: Adarsh @When: 26-05-2023 @Dsc- somebody remove this added by me for ewm-11779 story*/
        if (repsonsedata.HttpStatusCode === 200) {
          this.addStatusForm.get("StatusCode").clearValidators();
          this.addStatusForm.get("StatusCode").markAsPristine();
          this.addStatusForm.get('StatusCode').setValidators([Validators.required, Validators.pattern(this.codePattern)]);
        } else if (repsonsedata['HttpStatusCode'] == 402) {
          this.addStatusForm.get("StatusCode").setErrors({ statusCodeTaken: true });
          this.addStatusForm.get("StatusCode").markAsDirty();
        }
        // End 
        else {
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
     @Name: checkshortDescUnique function
     @Who: Renu
     @When: 18-May-2021
     @Why: ROST-1539
     @What: For checking duplicacy for short desc
    */
  checkshortDescUnique(value) {
    if (value == '') {
      return false;
    }
    let StatusId: any;
    if (this.tempID != undefined) {
      StatusId = this.tempID;
    } else {
      StatusId = '';
    }
    this.statusService.checkDescDuplicacy('?ShortDescription=' + value + '&GroupId=' + this.GroupId + '&StatusId=' + StatusId).subscribe(
      (repsonsedata: statusMaster) => {
      /*  @Who: Adarsh @When: 26-05-2023 @Dsc- somebody remove this added by me for ewm-11779 story*/
         if (repsonsedata.HttpStatusCode === 200) {
          this.addStatusForm.get("ShortDescription").clearValidators();
          this.addStatusForm.get("ShortDescription").markAsPristine();
          this.addStatusForm.get('ShortDescription').setValidators([Validators.required, Validators.maxLength(30)]);
        } else if (repsonsedata['HttpStatusCode'] == 402) {
          this.addStatusForm.get("ShortDescription").setErrors({ desccheckTaken: true });
          this.addStatusForm.get("ShortDescription").markAsDirty();
        }
        // End 
        else {
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

    /* 
   @Type: File, <ts>
   @Name: onChange function
   @Who: Adarsh Singh
   @When: 06-07-2022
   @Why: EWM-7363 EWM-7607
   @What: For change color on chnage while select color
*/
public onChange(getColor: string): void {
  const color = getColor;
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
  this.defaultColorValue = hex;
}


/* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: Adarsh singh
   @When: 23-Aug-2022
   @Why: EWM-8238
   @What: For status Click event
*/

clickStatusID(Id) {
  this.StatusDataId = this.statusList.filter((dl: any) => dl.StatusId == Id);
  this.StatusDataName = this.StatusDataId[0]?.StatusName;
}


// color picker start 
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: Adarsh singh
  @When: 10-Mar-2023
  @Why: EWM-11033
  @What: for open color picker dropdown
*/
showColorPallate(e:any) {
  this.overlayViewjob=!this.overlayViewjob;
  this.showColorPallateContainer = !this.showColorPallateContainer;
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: Adarsh singh
  @When: 10-Mar-2023
  @Why: EWM-11033
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.addStatusForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.addStatusForm.patchValue({
      ColorCode: null
    })
    this.selctedColor = null;
  }
  
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: Adarsh singh
  @When: 10-Mar-2023
  @Why: EWM-11033
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.addStatusForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: Adarsh singh
  @When: 10-Mar-2023
  @Why: EWM-11033
  @What: close dropdown while click on more label
*/
closeTemplate() {
  this.showColorPallateContainer = true;
  this.isMoreColorClicked = true;
  setTimeout(() => {
    this.isMoreColorClicked = false;
  }, 100);
}
/*
  @Type: File, <ts>
  @Name: getColorCodeAll funtion
  @Who: Adarsh singh
  @When: 10-Mar-2023
  @Why: EWM-11033
  @What: get all custom color code from config file
*/
  getColorCodeAll() {
    this.loading = true;
    this.commonserviceService.getAllColorCode().subscribe((data: statusMaster) => {
      this.loading = false;
      this.themeColors = data[0]?.themeColors;
      this.standardColor = data[1]?.standardColors;
    },
      err => {
        this.loading = false;
      })
  }
// color picker End  


}
