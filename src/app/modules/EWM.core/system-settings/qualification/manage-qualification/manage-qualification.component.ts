/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-qualification.component.ts
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2595
  @What: Qualification master edit/add manage forms
 */

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { statusList } from '../../../shared/datamodels/common.model';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels/common.model';
import { DocumentCategoryService } from '../../../shared/services/profile-info/document-category.service';

@Component({
  selector: 'app-manage-qualification',
  templateUrl: './manage-qualification.component.html',
  styleUrls: ['./manage-qualification.component.scss']
})
export class ManageQualificationComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  addForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public primaryBgColor: string;
  public tempID: number;
  public submitted = false;
  public addObj = {};
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public weightageList: any = [];

  public viewMode: any;
  public codePattern = new RegExp(/^[A-Z0-9]{1,20}$/); //^[A-Z0-9]{1,20}$
  visibility: number = 0;
  public visibilityID: number;
  visibilityStatus = false;
  client: any;
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public industryList: any = [];
  public isHideExternally: number = 0;
  public oldPatchValues: any;
  public StatusDataId: any[];
  public WeightageDataId: any[];
  //<!--@Who: Bantee Kumar,@Why:EWM-11417,@When: 20-Mar-2023 -->

  public StatusDataName:any="Active"
  public weightageDataName;

  public getWeightageType:any=[];
  
  public Weightage;
  public selectedweightage: any = {};
  WeightageId: any;
  public WeightageValue;
  public WeightageIdData:any
  IsBuiltIn: number;
  Isedit:boolean;
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2595
  @What: For injection of service class and other dependencies
  */

  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private clientTagService: ProfileInfoService, private route: Router,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService, private _Service:DocumentCategoryService,private _SystemSettingService: SystemSettingService, private serviceListClass: ServiceListClass) {
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDoneConfig['placeholder'] = 'label_industry';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/industry-master';
    this.dropDoneConfig['bindLabel'] = 'Description';
    this.dropDoneConfig['IsRequired'] = false;
    this.addForm = this.fb.group({
      ID: [''],
      // who:maneesh,what: whitespace EWM.9956 , when:23/12/2023
      QualificationName: ['', [Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]],
      IndustryId: [null],
      HideExternally: [''],
      //  who:maneesh,what:ewm-12281 for handel validation issu,when:24/05/2023
      DisplaySequence: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.min(0)]],
      Status: ['1', [Validators.required]], //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
      StatusName: [''],
      Weightage: [null],
      WeightageId: [''],

    });
  }
  ngOnInit(): void {

    this.getIndustryList();
    this.getStatusList();
    this.getWeightageUserType()
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.router.queryParams.subscribe(
      params => {
        if (params['Id'] != undefined) {
          this.activestatus = 'Edit'
          this.tempID = params['Id'];
          this.Isedit=params['IsEdit']
          this.visibilityID = parseInt(params['R']);
          this.editForm(this.tempID);
        } else {
          this.activestatus = 'Add';
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }
        this.WeightageId = params['WeightageId'];
      });
  }
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 23Aug-2021
   @Why: EWM-2596
   @What: For setting value in the edit form
  */
  editForm(Id: Number) {  
    this.loading = true;
    this._SystemSettingService.getQualificationByID('?Id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.selectedRelation = { Id: data.Data.IndustryId, Name: data.Data.IndustryName };
          this.addForm.patchValue({
            ID: data.Data.Id,
            QualificationName: data.Data.QualificationName,
            IndustryId: this.selectedRelation.Id,
            HideExternally: data.Data.HideExternally,
            DisplaySequence: data.Data.DisplaySequence,
            StatusName: data.Data.StatusName,
            Status: String(data.Data.Status),
            Weightage: data.Data.Weightage,
            // WeightageId:this.selectedweightage.WeightageId

          });
          this.oldPatchValues = data['Data'];
        //  who:maneesh,what:ewm-12119 for readonly in edit case IsBuiltIn when:26/04/2023
          this.IsBuiltIn=1
          this.StatusDataName = data.Data.StatusName;
          this.weightageDataName = data.Data.Weightage;

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
     @When: 23Aug-2021
     @Why: EWM-2596
     @What: For checking wheather the data save or edit on the basis on active satatus
    */
  onSave(value) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.duplicayCheck(true)
    // if (this.activestatus == 'Add') {
    //   this.createQualificationMaster(value);
    // } else {
    //   this.updateQualificationMaster(value);
    // }
  }
  /*
      @Type: File, <ts>
      @Name: createQualificationMaster function
      @Who: Nitin Bhati
      @When: 23Aug-2021
      @Why: EWM-2596
      @What: For saving data for status master
     */
  createQualificationMaster(value: any) {
    
    this.loading = true;
    this.addObj['IndustryId'] = this.selectedRelation.Id;
    this.addObj['IndustryName'] = this.selectedRelation.Description;
    this.addObj['QualificationName'] = value.QualificationName;
    this.addObj['HideExternally'] = this.isHideExternally;
    
  
    // this.addObj['WeightageId'] = this.selectedweightage.Id;


    if(value.DisplaySequence==null){
      this.addObj['DisplaySequence'] = 1;
    }else{
      this.addObj['DisplaySequence'] = parseInt(value.DisplaySequence);
    }
     this.addObj['Status'] = parseInt(value.Status);
    this.addObj['StatusName'] = this.StatusDataName;
    this.addObj['Weightage'] = this.WeightageValue;
    this.addObj['WeightageId'] = this.WeightageIdData;
  

    this._SystemSettingService.qualificationCreate(this.addObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       // this.route.navigate(['./client/core/administrators/qualification'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['./client/core/administrators/qualification']);
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
     @Name: updateQualificationMaster function
     @Who: Nitin Bhati
     @When: 23Aug-2021
     @Why: EWM-2596
     @What: For saving data for Qualification master
    */
  updateQualificationMaster(value: any) {
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.oldPatchValues;
    toObj['Id'] = value.ID;
    toObj['IndustryId'] = this.selectedRelation.Id;
    toObj['IndustryName'] = this.selectedRelation.Description;
    toObj['QualificationName'] = value.QualificationName;
    toObj['HideExternally'] = this.isHideExternally;
    toObj['DisplaySequence'] =  parseInt(value.DisplaySequence);
    toObj['Status'] = parseInt(value.Status);
    toObj['StatusName'] = this.StatusDataName;
    // toObj['Weightage'] = this.weightageDataName;

    // toObj['Weightage'] = value.Weightage;
    // toObj['WeightageId'] = this.WeightageValue;
    toObj['Weightage'] = this.WeightageValue;
    toObj['WeightageId'] = this.WeightageIdData;

    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._SystemSettingService.qualificationUpdate(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       // this.route.navigate(['./client/core/administrators/qualification'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['./client/core/administrators/qualification']);
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
   @When: 21-Aug-2021
   @Why: EWM-2502
   @What: For checking duplicacy for Qualification type
  */
  duplicayCheck(isSave) {
    let qualificationID = this.addForm.get("ID").value;
    if (qualificationID == null) {
      qualificationID = 0;
    }
    if (qualificationID == '') {
      qualificationID = 0;
    }
    this._SystemSettingService.checkQualificationTypeDuplicacy('?Value=' + this.addForm.get("QualificationName").value + '&Id=' + qualificationID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.submitted=false;
            this.addForm.get("QualificationName").setErrors({ codeTaken: true });
            this.addForm.get("QualificationName").markAsDirty();
            
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (data.Data == true) {
            this.addForm.get("QualificationName").clearValidators();
            this.addForm.get("QualificationName").markAsPristine();
            this.addForm.get('QualificationName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
            if (this.addForm && this.submitted == true && isSave==true) {
              if (this.activestatus == 'Add') {
                this.createQualificationMaster(this.addForm.value);
              } else {
                this.updateQualificationMaster(this.addForm.value);
              }
            }
          }
        }
        else if (data.HttpStatusCode == 400) {
          this.addForm.get("QualificationName").clearValidators();
          this.addForm.get("QualificationName").markAsPristine();
          this.addForm.get('QualificationName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
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
  /* 
     @Type: File, <ts>
     @Name: getStatusList function
     @Who: Nitin Bhati
     @When: 23Aug-2021
     @Why: EWM-2596
     @What: For status listing 
    */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data;
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
   @Name: clickStatusID function
   @Who: Nitin Bhati
   @When: 24Aug-2021
   @Why: EWM-2596
   @What: For status Click event
  */
  clickStatusID(Id) {
    this.StatusDataId = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusDataId[0].StatusName;
  }
  /* 
   @Type: File, <ts>
   @Name: clickWeightage function
   @Who:maneesh
   @When: 24Aug-2021
   @Why: EWM-2596
   @What: For Weightage Click event
  */
  clickWeightage(Id) {
    
    this.WeightageDataId = this.getWeightageType.filter((dl: any) => dl.Id == Id);
    this.WeightageIdData = this.WeightageDataId[0].Id;
    this.WeightageValue = this.WeightageDataId[0].Weightage;

    // console.log('WeightageIdData',this.WeightageIdData);
    // console.log('this.WeightageValue',this.WeightageValue);

    
  }
  /* 
    @Type: File, <ts>
    @Name: setDefaultExternally function
    @Who: Nitin Bhati
    @When: 24Aug-2021
    @Why: EWM-2596
    @What: For Click Hide Externally event
   */
  setDefaultExternally(e) {
    if (e.checked === false) {
      this.isHideExternally = 0;
    } else {
      this.isHideExternally = 1;
    }
  }
  /* 
     @Type: File, <ts>
     @Name: onRelationchange
     @Who: Nitin Bhati
     @When: 23Aug-2021
     @Why: EWM-2596
     @What: when realtion drop down changes 
   */
  onRelationchange(data) {
    if (data == null || data == "") {
      this.addForm.get("IndustryId").setErrors({ required: true });
      this.addForm.get("IndustryId").markAsTouched();
      this.addForm.get("IndustryId").markAsDirty();
    }
    else {
      this.addForm.get("IndustryId").clearValidators();
      this.addForm.get("IndustryId").markAsPristine();
      this.selectedRelation = data;
      this.addForm.patchValue(
        {
          IndustryId: data.Id
        }
      )

    }
  }
  // onWeighagechange(data) {
  //   if (data == null || data == "") {
  //     this.addForm.get("WeightageId").setErrors({ required: true });
  //     this.addForm.get("WeightageId").markAsTouched();
  //     this.addForm.get("WeightageId").markAsDirty();
  //   }
  //   else {
  //     this.addForm.get("WeightageId").clearValidators();
  //     this.addForm.get("WeightageId").markAsPristine();
  //     this.selectedRelation = data;
  //     this.addForm.patchValue(
  //       {
  //         WeightageId: data.Id
  //       }
  //     )

  //   }
  // }
  /* 
     @Type: File, <ts>
     @Name: getIndustryList function
     @Who: Nitin Bhati
     @When: 23-Aug-2021
     @Why: EWm-2596
     @What: For Industry listing 
    */
  getIndustryList() {
    this._SystemSettingService.getIndustryList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.industryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
      /*
@Name: getWeightageUserType function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
  getWeightageUserType() {
    this._SystemSettingService.getWeightageUserType().subscribe(
      repsonsedata => {
        this.getWeightageType = repsonsedata['Data'];
        
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 23-dec-2022
   @Why: EWM-9956
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
// onUserTypeChange(value)
// {
//   let userTypename=this.getWeightageType.filter((ut:any)=>ut.Id==value);
//   this.addForm.patchValue({
//     UserTypeName:userTypename[0].Weightage
//   });
// }
}
