/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-weightage.component.ts
  @Who: Nitin Bhati
  @When: 20-Oct-2021
  @Why: EWM-3431
  @What: Weightage master edit/add manage forms
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-manage-weightage',
  templateUrl: './manage-weightage.component.html',
  styleUrls: ['./manage-weightage.component.scss']
})
export class ManageWeightageComponent implements OnInit {

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
  public StatusData: any[];
  //<!--@Who: Bantee Kumar,@Why:EWM-11417,@When: 20-Mar-2023 -->

  public StatusDataName:any="Active"
  public StatusDataId;
  searchSubject$ = new Subject<any>();
  isBtnClicked:boolean;

  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 20-Oct-2021
  @Why: EWM-3431
  @What: For injection of service class and other dependencies
  */

  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private clientTagService: ProfileInfoService, private route: Router,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService, private _SystemSettingService: SystemSettingService, private serviceListClass: ServiceListClass) {
    this.addForm = this.fb.group({
      Id: [''],
      Weightage: [null, [Validators.required, Validators.maxLength(10)]],
      Status: ["1", Validators.required], //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
      HideExternally: [false],
      StatusName: [''],
      DisplaySequence: [null, [Validators.pattern("^[0-9]*$"), Validators.maxLength(8)]],
    });

    //<!-----@suika@EWM-10681 EWM-11415  @21-03-2023 to set default values for status in master data---->
    this.StatusDataName = "Active";
    this.StatusDataId = "1";
  }

  ngOnInit(): void {
    this.getStatusList();
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
          this.visibilityID = parseInt(params['R']);
          this.editForm(this.tempID);
        } else {
          this.activestatus = 'Add';
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }

      });
  //  @When: 15-12-2022 @who:maneesh  what:debounceTime ,distinctUntilChanged
      this.searchSubject$.pipe(debounceTime(1000),distinctUntilChanged()).subscribe(val => {   // put this code in ngOnIt section 
        this.duplicayCheck(true);
         });
  }
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 20-Oct-2021
   @Why: EWM-3431
   @What: For setting value in the edit form
  */
  editForm(Id: Number) {
    this.loading = true;
    this._SystemSettingService.getWeightageById('?id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.selectedRelation = { Id: data.Data.IndustryId, Name: data.Data.IndustryName };
          this.addForm.patchValue({
            Id: data.Data.Id,
            Weightage: data.Data.Weightage,
            Status: String(data.Data.Status),
            StatusName: data.Data.StatusName,
            HideExternally: data.Data.HideExternally,
            DisplaySequence: data.Data.DisplaySequence
          });
          this.oldPatchValues = data['Data'];
          this.StatusDataName = data.Data.StatusName;
          this.StatusDataId = data.Data.Status;
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
     @When: 20-Oct-2021
     @Why: EWM-3431
     @What: For checking wheather the data save or edit on the basis on active satatus
    */
  onSave(value: any, activestatus: any) {    
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
     // <!---------@When: 06-12-2022 @who:Adarsh @why: EWM-8459 --------->
  // if (this.activestatus == 'Add') {
  //   this.createWeightage(value);
  // } else {
  //   this.updateWeightage(value);
  // }
  // this.activestatus=activestatus;
  this.isBtnClicked = true;
  this.duplicayCheck(true);
  }
  /*
      @Type: File, <ts>
      @Name: createWeightageMaster function
      @Who: Nitin Bhati
      @When: 20-Oct-2021
      @Why: EWM-3431
      @What: For saving data for weightage master
     */
  createWeightageMaster(value: any) {
    this.loading = true;
     let HideExternally: any;     
    if (value.HideExternally == true) {
      HideExternally = 1;
    } else {
      HideExternally = 0;
    }
    if (value.DisplaySequence == null) {
      this.addObj['DisplaySequence'] = null;
    } else if(value.DisplaySequence == 0){
      this.addObj['DisplaySequence'] = null;
    } else {
      // <!-- who:maneesh,what:ewm-12281 for handel validation issu parseInt(value.DisplaySequence),when:24/05/2023 -->
      this.addObj['DisplaySequence'] = parseInt(value.DisplaySequence);
    }
    this.addObj['Weightage'] = value.Weightage;
    this.addObj['Status'] = parseInt(value.Status);
    this.addObj['HideExternally'] = parseInt(HideExternally);
    this.addObj['StatusName'] = this.StatusDataName;
    this._SystemSettingService.weightageCreate(this.addObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         this.route.navigate(['./client/core/administrators/weightage'], { queryParams: { V: this.viewMode } });
        //this.route.navigate(['./client/core/administrators/weightage']);
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
     @Name: updateWeightageMaster function
     @Who: Nitin Bhati
     @When: 20-Oct-2021
     @Why: EWM-3431
     @What: For saving data for Weightage master
    */
  updateWeightageMaster(value: any) {
    this.loading = true;
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.oldPatchValues;
    let HideExternally: any;
  if (value.HideExternally == true) {
    HideExternally = 1;
  } else {
    HideExternally = 0;
  }
    toObj['Id'] = value.Id;
    toObj['Weightage'] = value.Weightage;
    toObj['HideExternally'] = parseInt(HideExternally);
    if (value.DisplaySequence == null) {
      toObj['DisplaySequence'] = null;
    } else if(value.DisplaySequence == 0){
      toObj['DisplaySequence'] = null;
    } else {
      // <!-- who:maneesh,what:ewm-12281 for handel validation issu parseInt(value.DisplaySequence),when:24/05/2023 -->
      toObj['DisplaySequence'] = parseInt(value.DisplaySequence);
    }
    //toObj['DisplaySequence'] = value.DisplaySequence;
    toObj['Status'] = this.StatusDataId;
    toObj['StatusName'] = this.StatusDataName;
    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._SystemSettingService.updateWeightage(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['./client/core/administrators/weightage'], { queryParams: { V: this.viewMode } });
        //this.route.navigate(['./client/core/administrators/weightage']);
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
   @When: 20-Oct-2021
   @Why: EWM-3431
   @What: For checking duplicacy for weightage type
  */
  duplicayCheck(isClicked) {
    let duplicacyExist = {};
    let weightageId;
    if (this.tempID != undefined) {
      weightageId = this.tempID;
    } else {
      weightageId = 0;
    }
    let value = this.addForm.get("Weightage").value
    // who : maneesh,what:ewm.10683 i am comment this condition ,when:27/02/2023
    // if (value == '') {
    //   value = 0;
    //   return false;
    // }
    duplicacyExist['Id'] = Number(weightageId);
    duplicacyExist['Value'] = value;
    duplicacyExist['CheckFor'] = 'Weightage';
    // who : maneesh,what:ewm.10683 i am comment this condition ,when:27/02/2023
    // if (value && this.addForm.controls['Weightage'].valid) {
      this._SystemSettingService.checkDuplicityWeightage(duplicacyExist).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 402) {
            if (repsonsedata.Status == false) {
              this.addForm.get("Weightage").setErrors({ codeTaken: true });
              this.addForm.get("Weightage").markAsDirty();
              this.addForm.get("Weightage").markAsTouched();
              this.isBtnClicked = false;
            }
          } else if (repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Status == true) {
            this.conditionChcek();
              // this.addForm.get("Weightage").clearValidators();
              // this.addForm.get("Weightage").markAsPristine();
              // <!---------@When: 15-12-2022 @who:Adarsh @why: EWM-8459 --------->
              this.addForm.get('Weightage').setValidators([Validators.required, Validators.maxLength(10)]);
              if (isClicked) {
                if (this.addForm && this.submitted == true) {
              // @When: 15-12-2022 @who:maneesh  isBtnClicked
                  if (this.isBtnClicked) {
                    if (this.activestatus == 'Add') {
                      this.createWeightageMaster(this.addForm.value);
                    } else if (this.activestatus == 'Edit') {
                      this.updateWeightageMaster(this.addForm.value);
                    }
                  }
                }
              }
              // End 
            }
          }
          else if (repsonsedata.HttpStatusCode == 400) {
            this.addForm.get("Weightage").clearValidators();
            this.addForm.get("Weightage").markAsPristine();
            this.addForm.get('Weightage').setValidators([Validators.required, Validators.maxLength(10)]);
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.loading = false;
          }
  
        },
        err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    // }
  }
   // @When: 15-12-2022 @who:maneesh  onSearch
  onSearch(inputValue: string){
    this.searchSubject$.next(inputValue);

  }
  /* 
     @Type: File, <ts>
     @Name: getStatusList function
     @Who: Nitin Bhati
     @When: 20-Oct-2021
     @Why: EWM-3431
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
   @When: 20-Oct-2021
   @Why: EWM-3431
   @What: For status Click event
  */
  clickStatusID(Id) {
    this.StatusData = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusData[0].StatusName;
    this.StatusDataId = this.StatusData[0].StatusId;
  }
  /* 
    @Type: File, <ts>
    @Name: setDefaultExternally function
    @Who: Nitin Bhati
    @When: 20-Oct-2021
    @Why: EWM-3431
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
@Name: conditionChcek function
@Who: Nitin Bhati
@When: 20-Oct-2021
@Why: EWM-3431
@What: For checking condition for weightage
*/
  conditionChcek() {
    let values = this.addForm.get("Weightage").value;
    // <!---------@When: 14-01-2023 @who:Adarsh singh @why: EWM-8459 desc- fixed issue while testing --------->

    // who : maneesh,what:ewm.10683 i am comment this condition if (values == 0),when:27/02/2023
    // if (values == 0) {
    //   this.addForm.get("Weightage").setErrors({ numbercheck: true });
    //   this.addForm.get("Weightage").markAsDirty();
    //   this.addForm.get("Weightage").markAsTouched();
    //   return
    // }
    // who : maneesh,what:ewm.10683 i am comment this condition if (values == 0),when:27/02/2023
    
    // <!---------@When: 15-12-2022 @who:Adarsh singh @why: EWM-8459 --------->
    if (!values) {
      this.addForm.get("Weightage").clearValidators();
      this.addForm.get("Weightage").markAsPristine();
      this.addForm.get("Weightage").markAsTouched();
      this.addForm.get('Weightage').setValidators([Validators.required, Validators.maxLength(10)]);
      return;
    }
    // End 
    if (101 > values) {
    // who : maneesh,what:ewm.10683 apply = oprator in   if (values >= 0),when:27/02/2023
      if (values >= 0) {
        this.addForm.get("Weightage").clearValidators();
        this.addForm.get("Weightage").markAsPristine();
        this.addForm.get("Weightage").markAsTouched();
        this.addForm.get('Weightage').setValidators([Validators.required, Validators.maxLength(10)]);
  //  @When: 15-12-2022 @who:maneesh  return
        return
      } else {
        this.addForm.get("Weightage").setErrors({ numbercheck: true });
        this.addForm.get("Weightage").markAsDirty();
        this.addForm.get("Weightage").markAsTouched();
  //  @When: 15-12-2022 @who:maneesh  return
        return
      }
    } else {
      this.addForm.get("Weightage").setErrors({ numbercheck: true });
      this.addForm.get("Weightage").markAsDirty();
      this.addForm.get("Weightage").markAsTouched();
  //  @When: 15-12-2022 @who:maneesh  return
      return;
    }
  }

}
