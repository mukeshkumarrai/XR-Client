/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-activity-category.component.ts
  @Who: Nitin Bhati
  @When: 10-jan-2022
  @Why: EWM-4516
  @What: Activity Category master edit/add manage forms
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
import { HttpClient } from '@angular/common/http';
import { statusMaster } from '../../../shared/datamodels/status-master';
import { PickerService } from '@progress/kendo-angular-dateinputs';


@Component({
  selector: 'app-manage-activity-category',
  templateUrl: './manage-activity-category.component.html',
  styleUrls: ['./manage-activity-category.component.scss']
})
export class ManageActivityCategoryComponent implements OnInit {

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
  public StatusDataName;
  public StatusDataId;
  iconData: any;
  userTypeList: { StatusId: number; StatusName: string; };
  public AddObj = {};
  UserType: any;
  public typeStatus: boolean = true;
  UserTypes: any[];
public defaultColorValue = "#d9d9d9";
// color picker varibale 
showColorPallateContainer = false;
color: any = '#2883e9'
selctedColor = '#d9d9d9';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
isOpen = false;
isMoreColorClicked!: boolean;
// color picker End 

  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 10-jan-2022
  @Why: EWM-4516
  @What: For injection of service class and other dependencies
  */
  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private clientTagService: ProfileInfoService, private route: Router,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService, private _SystemSettingService: SystemSettingService, private serviceListClass: ServiceListClass, private http: HttpClient) {
    this.addForm = this.fb.group({
      Id: [''],
      // @Who: maneesh, @When: 21-dec-2022,@Why: EWM-9959 addnoWhitespaceValidator 
      ActivityCategory: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1),
      this.noWhitespaceValidator()]],
      UserType: [[], Validators.required],
      CategoryIcon: [[], Validators.required],
      ColorCode: [this.defaultColorValue,Validators.required],
      HideExternally: [false],
      // who:maneesh,what:ewm-12279 for new cr so that add new field IsCall IsInterview,when:22/05/2023
      IsCall: [false],
      IsInterview: [false],
      Status: ["1", Validators.required] //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
    });
    this.primaryBgColor = '#FFFFFF';
  }

  ngOnInit(): void {
    this.http.get<any>("assets/config/icon-name.json").subscribe((data)=>
      this.iconData = data
    )
    
    this.getuserTypeList();
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
    this._sidebarService.activesubMenuObs.next('masterdata');

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
    this.getColorCodeAll();

  }
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 10-jan-2022
   @Why: EWM-4516
   @What: For setting value in the edit form
  */
  editForm(Id: Number) {
    this.loading = true;
    this.typeStatus=false;
    this.addForm.controls["UserType"].disable();
    this._SystemSettingService.getActivityCategoryByID('?id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.addForm.patchValue({
            Id: data.Data.Id,
            UserType: data.Data.UserType,
            ActivityCategory: data.Data.ActivityCategory,
            CategoryIcon: data.Data.Icon,
            // ColorCode: data.Data.ColorCode,
    // who:maneesh,why:ewm-11122 for patch color Picker ,when:10/03/2023
            ColorCode: (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode,
            HideExternally: data.Data.HideExternally,
   // who:maneesh,what:ewm-12279 for new cr so that add new field IsCall IsInterview,when:22/05/2023
              IsCall: data['Data'].IsCall,
              IsInterview: data['Data'].IsInterview,  
            Status: data.Data.Status.toString(),
          });
    // who:maneesh,why:ewm-11122 for patch color Picker ,when:10/03/2023
          // this.defaultColorValue = (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode;
          this.selctedColor = data.Data.ColorCode;

          this.oldPatchValues = data['Data'];
          this.StatusDataName = data.Data.StatusName;
          this.StatusDataId = data.Data.Status;
          this.UserType=data.Data.UserType;
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
     @When: 10-jan-2022
     @Why: EWM-4516
     @What: For checking wheather the data save or edit on the basis on active satatus
    */
  onSave(value: any, activestatus: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    //  if (this.activestatus == 'Add') {
    //    this.createWeightageMaster(value);
    //  } else {
    //    this.updateWeightageMaster(value);
    //  }
    this.activestatus = activestatus;
    this.duplicayCheck(value);
  }
  /*
      @Type: File, <ts>
      @Name: createActivityCategoryMaster function
      @Who: Nitin Bhati
      @When: 10-jan-2022
      @Why: EWM-4516
      @What: For saving data for Note Category master
     */
  createActivityCategoryMaster(value: any) {
    this.loading = true;
    // who:maneesh,what:ewm-12279 for new cr so that add new field IsCall IsInterview and HideExternally any to number,when:22/05/2023
    let HideExternally: number;
  if (value.HideExternally == true) { 
    HideExternally = 1;
  } else {
    HideExternally = 0;
  }
        let IsCall: number;
        if (value.IsCall == true) {
          IsCall = 1;
        } else {
          IsCall = 0;
        }
        let IsInterview: number;
        if (value.IsInterview == true) {
          IsInterview = 1;
        } else {
          IsInterview = 0;
        }
    this.AddObj['ActivityCategory'] = value.ActivityCategory;
    this.AddObj['UserTypes'] = value.UserType;
    this.AddObj['Icon'] = value.CategoryIcon;
    // who:maneesh,why:ewm-12279 for change color Picker variabel,when:10/03/2023
    this.AddObj['ColorCode'] =  this.selctedColor;
    // who:maneesh,what:ewm-12279 for new cr so that add new field IsCall IsInterview and HideExternally any to number,when:22/05/2023
    this.AddObj['HideExternally'] = HideExternally;
    this.AddObj['IsCall'] = IsCall;
    this.AddObj['IsInterview'] = IsInterview;
    this.AddObj['Status'] = parseInt(value.Status);
    this._SystemSettingService.activityCategoryCreate(this.AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         this.route.navigate(['./client/core/administrators/activity-category'], { queryParams: { V: this.viewMode } });
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
     @Name: updateActivityCategoryMaster function
     @Who: Nitin Bhati
     @When: 10-jan-2022
     @Why: EWM-4516
     @What: For saving data for Note category master
    */
    updateActivityCategoryMaster(value: any) {
    this.loading = true;
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.oldPatchValues;
    //toObj['Id'] = value.Id;
    // who:maneesh,what:ewm-11788 for new cr so that add new field IsCall IsInterview and any to number,when:22/05/2023
    let HideExternally: number;
    if (value.HideExternally == true) {
      HideExternally = 1;
    } else {
      HideExternally = 0;
    }
         let IsCall: number;
         if (value.IsCall == true) {
           IsCall = 1;
         } else {
           IsCall = 0;
         }
         let IsInterview: number;
         if (value.IsInterview == true) {
           IsInterview = 1;
         } else {
           IsInterview = 0;
         }
    toObj['Id'] = value.Id;
    toObj['ActivityCategory'] = value.ActivityCategory;
    toObj['UserTypes'] = [];
    toObj['UserType'] = this.UserType;
    toObj['Icon'] = value.CategoryIcon;
    // who:maneesh,why:ewm-11122 for change color PickerService,when:10/03/2023
    toObj['ColorCode'] =  this.selctedColor;
    toObj['HideExternally'] = HideExternally;
    // who:maneesh,what:ewm-11788 for new cr so that add new field IsCall IsInterview,when:22/05/2023
    toObj['IsCall'] = IsCall;
    toObj['IsInterview'] = IsInterview;
    toObj['Status'] = parseInt(value.Status);
    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._SystemSettingService.updateActivityCategory(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['./client/core/administrators/activity-category'], { queryParams: { V: this.viewMode } });
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
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For checking duplicacy for Activity category type
  */
   duplicayCheck(value) {
    let duplicacyExist = {};
    let notecategoryId;
    if (this.tempID != undefined) {
      notecategoryId = this.tempID;
      this.UserTypes=[this.addForm.get("UserType").value];
    } else {
      notecategoryId = 0;
      this.UserTypes=this.addForm.get("UserType").value;
    }
    if (value == '') {
      value = 0;
      this.UserTypes=this.addForm.get("UserType").value;
      return false;
    }
    duplicacyExist['UserTypes'] = this.UserTypes; //this.addForm.get("UserType").value;
    duplicacyExist['ActivityCategory'] = this.addForm.get("ActivityCategory").value;
    duplicacyExist['Id'] = Number(notecategoryId);
    this._SystemSettingService.checkActivityCategoryDuplicacy(duplicacyExist).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {
           
              this.addForm.get("ActivityCategory").setErrors({ codeTaken: true });
              this.addForm.get("ActivityCategory").markAsDirty();
              this.submitted = false;
            
          } 
         } else if (repsonsedata.HttpStatusCode === 204) {
         if (repsonsedata.Status == true) {     
              this.addForm.get("ActivityCategory").clearValidators();
              this.addForm.get("ActivityCategory").markAsPristine();
              this.addForm.get('ActivityCategory').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(1),this.noWhitespaceValidator()]);
              this.addForm.get("ActivityCategory").updateValueAndValidity();
              if (this.addForm && this.submitted == true) { 
                if (this.activestatus == 'Add') {
                  this.createActivityCategoryMaster(this.addForm.value);
                } else if(this.activestatus == 'Edit') {
                  this.updateActivityCategoryMaster(this.addForm.value);
                }
              }           
          }
       } else {
            this.addForm.get("ActivityCategory").clearValidators();
            this.addForm.get("ActivityCategory").markAsPristine();
            this.addForm.get('ActivityCategory').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(1),this.noWhitespaceValidator()]);

          }
        
        // this.addForm.get('Code').updateValueAndValidity();
        // this.addForm.get('Description').updateValueAndValidity();

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }
  /* 
     @Type: File, <ts>
     @Name: getStatusList function
     @Who: Nitin Bhati
     @When: 10-jan-2022
     @Why: EWM-4516
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
   @When: 10-jan-2022
   @Why: EWM-4516
   @What: For status Click event
  */
  clickStatusID(Id) {
    this.StatusData = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusData[0].StatusName;
    this.StatusDataId = this.StatusData[0].StatusId;
  }
  /* 
   @Type: File, <ts>
   @Name: getuserTypeList function
   @Who: Nitin Bhati
   @When: 10-jan-2022
   @Why: EWM-4516
   @What: For user Type listing 
  */
   getuserTypeList() {
    this._SystemSettingService.getUserTypeList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.userTypeList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  changeCategory(){
    //this.addForm.get("ActivityCategory").reset();
   let Notcategoryname= this.addForm.get("ActivityCategory").value;
    if (Notcategoryname !== null) {
      this.duplicayCheck(Notcategoryname);
      } 
     
  }

  /* 
   @Type: File, <ts>
   @Name: onChange function
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
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
   @Name: noWhitespaceValidator function
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
// color picker start 
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
  @What: for open color picker dropdown
*/
showColorPallate(e:any) {
  this.overlayViewjob=!this.overlayViewjob;
  this.showColorPallateContainer = !this.showColorPallateContainer;
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {  
  if(codes){
    this.selctedColor = codes.colorCode;
    this.addForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.addForm.patchValue({
      ColorCode: null
    })
    this.selctedColor = null;
  }
  
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.addForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
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
  @Who: Maneesh
  @When: 10-Mar-2023
  @Why: EWM-11122
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
