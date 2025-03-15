
/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 02-Nov-2021
    @Why: EWM-3132 EWM-3605
    @What:  This page is creted for bulk edit
*/
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../../shared/datamodels';

@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.scss']
})
export class BulkEditComponent implements OnInit {
  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public codePattern = '^[A-Z]{5,20}$';
  public isHideExternally: number = 0;
  public isRenewal: number = 0;
  public isdocument: number = 0;
  public scorePattern = new RegExp(/^(?:100(?:\.0)?|\d{1,3}(?:\.\d{1,2})?)$/);
  tempID: string;
  public statusList: any = [];
  public industryId;
  viewModeValue: any;
  public oldPatchValues: any = {};

  public isBulkEdit: boolean = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  Skills: any[] = [];

  public dropDownSkillTagsConfig: customDropdownConfig[] = [];
  public selectedSkillTags: any = {};
  public SkillTags: any[] = [];

  public dropDownWeightageConfig: customDropdownConfig[] = [];
  public selectedWeightage: any = {};

  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};
  public SkillIndustries: any[] = [];

  public dropDownQualificationConfig: customDropdownConfig[] = [];
  public selectedQualification: any = {};
  public SkillQualifications: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, private serviceListClass: ServiceListClass,
    private translateService: TranslateService, public dialog: MatDialog) {
    this.addForm = this.fb.group({
      Id: [''],
      // name: ['', [Validators.maxLength(20), Validators.minLength(3)]],
      // SkillTag: ['', Validators.required],
      WeightageId: [null],
      Weightage: [null],
      status: [null],
      StatusName: [[], Validators.required],
      DisplaySequence: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.min(0)]],
      HideExternal: [false],
      Renewal: [false],
      DocumentRequired: [false],


    });

    //////SkillTags //////////////
    this.dropDownSkillTagsConfig['IsDisabled'] = false;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillGroupList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = '/client/core/administrators/skill-group;can=candidate';
    this.dropDownSkillTagsConfig['IsRequired'] = true;
    this.dropDownSkillTagsConfig['searchEnable'] = true;
    this.dropDownSkillTagsConfig['bindLabel'] = 'GroupName';
    this.dropDownSkillTagsConfig['multiple'] = false;


    //////Weightage //////////////
    this.dropDownWeightageConfig['IsDisabled'] = false;
    this.dropDownWeightageConfig['apiEndPoint'] = this.serviceListClass.getWeightageList;
    this.dropDownWeightageConfig['placeholder'] = 'label_weightage';
    this.dropDownWeightageConfig['IsManage'] = '/client/core/administrators/weightage';
    this.dropDownWeightageConfig['IsRequired'] = false;
    this.dropDownWeightageConfig['searchEnable'] = true;
    this.dropDownWeightageConfig['bindLabel'] = 'Weightage';
    this.dropDownWeightageConfig['multiple'] = false;


    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;


    //////Qualification//////////////
    this.dropDownQualificationConfig['IsDisabled'] = false;
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification;
    this.dropDownQualificationConfig['placeholder'] = 'quickjob_qualification';
    this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
    this.dropDownQualificationConfig['IsRequired'] = false;
    this.dropDownQualificationConfig['searchEnable'] = true;
    this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
    this.dropDownQualificationConfig['multiple'] = true;
  }


  ngOnInit(): void {
    let URL = this.router.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');


    this.route.queryParams.subscribe((params) => {
      this.viewModeValue = params['viewModeData'];
    })

    this.getStatusList();
    let status = {StatusId:1,StatusName:'Active'}
    this.onchangeStatus(status); //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
 
  }






  /*
    @Type: File, <ts>
    @Name: onSave function
    @Who: Anup Singh
    @When: 02-Nov-2021
    @Why: EWM-3132 EWM-3605
    @What: For save form value in edit or create
   */

  onSave(value) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    this.updateBulkEdit(value);
  }




  /*
  @Type: File, <ts>
  @Name: onCancel function
   @Who: Anup Singh
   @When: 02-Nov-2021
   @Why: EWM-3132 EWM-3605
  @What: For cancel
 */
  onCancel(e) {
    e.preventDefault();
    this.addForm.reset();
    this.actionStatus = 'Add';
    let viewModeData: any = this.viewModeValue;
    /* this.router.navigate(['./client/core/administrators/skills'], {
       queryParams: { viewModeData }
     }) */
    this.router.navigate(['./client/core/administrators/skills']);

  }



  /*
    @Type: File, <ts>
    @Name: getStatusList function
    @Who: Anup Singh
    @When: 02-Nov-2021
    @Why: EWM-3132 EWM-3605
    @What: For status listing
   */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: Industry) => {
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
   @Name: removeSkill function
   @Who: Anup Singh
   @When: 02-Nov-2021
   @Why: EWM-3132 EWM-3605
   @What: For remove skill chip
  */

  isSkillValidation: boolean = true;
  removeSkill(skill: any): void {
    const index = this.Skills.indexOf(skill);

    if (index >= 0) {
      this.Skills.splice(index, 1);
    }

    // for validation
    if (this.Skills == undefined || this.Skills == null || this.Skills.length == 0) {
      this.isSkillValidation = false;
    } else {
      this.isSkillValidation = true;
    }
  }





  /////weightages list
  /* 
 @Type: File, <ts>
 @Name: onWeightagechange function
 @Who: Anup Singh
 @When: 02-Nov-2021
 @Why: EWM-3132 EWM-3605
 @What: get weightage List and patch
 */
  onWeightagechange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedWeightage = null;
      this.addForm.patchValue(
        {
          WeightageId: null,
          Weightage: null,
        }
      )
    }
    else {
      this.selectedWeightage = data;

      this.addForm.patchValue(
        {
          WeightageId: data.Id,
          Weightage: data.Weightage,
        }
      )

    }
  }


  /////industry
  /* 
 @Type: File, <ts>
 @Name: onIndustrychange function
 @Who: Anup Singh
 @When: 02-Nov-2021
 @Why: EWM-3132 EWM-3605
 @What: get industry List 
 */

  onIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;

    }
    else {
      this.selectedIndustry = data;
      this.SkillIndustries = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        this.SkillIndustries.push({ Id: element.Id, Name: element.Description })
      }


    }
  }



  ///Qualification All
  /* 
@Type: File, <ts>
@Name: onQualificationchange function
 @Who: Anup Singh
 @When: 02-Nov-2021
 @Why: EWM-3132 EWM-3605
@What: get Qualification List
*/
  onQualificationchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedQualification = null;
    }
    else {
      this.selectedQualification = data;
      this.SkillQualifications = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        this.SkillQualifications.push({ Id: element.Id, Name: element.QualificationName })
      }

    }
  }


  /* 
  @Type: File, <ts>
  @Name: onchangeStatus function
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
  @What: get staatus collection and patch
  */
  onchangeStatus(value) {
    this.addForm.patchValue(
      {
        status: value.StatusId,
        StatusName: value.StatusName,
      }
    )

  }

  /* 
  @Type: File, <ts>
  @Name: setDefaultSignature function
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
  @What: for HideExternal toggle 
  */

  setDefaultSignature(e) {
    if (e.checked === false) {
      this.isHideExternally = 0;
    } else {
      this.isHideExternally = 1;
    }

  }

  /* 
@Type: File, <ts>
@Name: setDefaultSignature function
@Who: Anup Singh
@When: 02-Nov-2021
@Why: EWM-3132 EWM-3605
@What: for renewal toggle 
*/

  setDefaultRenewal(e) {
    if (e.checked === false) {
      this.isRenewal = 0;
    } else {
      this.isRenewal = 1;
    }
  }

  /* 
@Type: File, <ts>
@Name: setDefaultSignature function
@Who: Anup Singh
@When: 02-Nov-2021
@Why: EWM-3132 EWM-3605
@What: for Default Document toggle 
*/
  setDefaultDocumentRequired(e) {
    if (e.checked === false) {
      this.isdocument = 0;
    } else {
      this.isdocument = 1;
    }
  }


  /////skill tag
  /* 
 @Type: File, <ts>
 @Name: onSkillTagschange function
 @Who: Anup Singh
 @When: 02-Nov-2021
 @Why: EWM-3132 EWM-3605
 @What: get skill group List and patch
 */
  onSkillTagschange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedSkillTags = null;
    }
    else {
      this.selectedSkillTags = data;
      this.SkillTags = [];
      this.getSkillNameCount(data);
    }
  }

  /* 
  @Type: File, <ts>
  @Name: getSkillNameCount function
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
  @What: get total skill count
  */

  getSkillNameCount(TagData) {
    this.systemSettingService.fetchSkillNameCount("?skilltagid=" + TagData.Id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          let countSkill = repsonsedata?.Data?.Count;
          this.openBulkEditMsgPopup(countSkill, TagData)
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /* 
  @Type: File, <ts>
  @Name: openBulkEditMsgPopup function
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
  @What: open popup for bulk edit
  */
  openBulkEditMsgPopup(count, TagData): void {
    let countSkill: string = count;

    const message = countSkill;
    const title = 'label_popupSkillMsg';
    const subTitle = TagData?.GroupName;

    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {

        this.isBulkEdit = true;

        this.getSkillsByTagId(TagData.Id)

      }
    });
  }

  /* 
  @Type: File, <ts>
  @Name: getSkillsByTagId function
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
  @What: get skill by tag Id
  */
  getSkillsByTagId(tagId) {
    this.systemSettingService.fetchSkillsByTagId("?skilltagid=" + tagId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.Skills = repsonsedata?.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /* 
  @Type: File, <ts>
  @Name: updateBulkEdit function
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
  @What: for Update bulk edit skills 
  */
  updateBulkEdit(value) {
    this.loading = true;

    let SkillsJsonObj = {}
    SkillsJsonObj['Skills'] = this.Skills;
    // SkillsJsonObj['SkillTags'] = this.SkillTags;
    if (value?.WeightageId != undefined && value?.WeightageId != null && value?.WeightageId != '') {
      SkillsJsonObj['WeightageId'] = value.WeightageId;
    } else {
      SkillsJsonObj['WeightageId'] = 0
    }

    if (value?.Weightage != undefined && value?.Weightage != null && value?.Weightage != '') {
      SkillsJsonObj['Weightage'] = value.Weightage;
    } else {
      SkillsJsonObj['Weightage'] = 0
    }
    SkillsJsonObj['SkillIndustries'] = this.SkillIndustries;
    SkillsJsonObj['SkillQualifications'] = this.SkillQualifications;
    SkillsJsonObj['Status'] = value.status;
    SkillsJsonObj['StatusName'] = value.StatusName;
    if (value?.DisplaySequence != undefined && value?.DisplaySequence != null && value?.DisplaySequence != '') {
      SkillsJsonObj['DisplaySequence'] = parseInt(value.DisplaySequence);
    } else {
      SkillsJsonObj['DisplaySequence'] = 0
    }
    SkillsJsonObj['HideExternal'] = this.isHideExternally;
    SkillsJsonObj['Renewal'] = this.isRenewal;
    SkillsJsonObj['DocumentRequired'] = this.isdocument;
    this.systemSettingService.updateBulkEdit(SkillsJsonObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        let viewModeData: any = this.viewModeValue;
        /* this.router.navigate(['./client/core/administrators/skills'], {
           queryParams: { viewModeData }
         })*/
        this.router.navigate(['./client/core/administrators/skills']);

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
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

  editSkill(skill){
       this.router.navigate(['./client/core/administrators/skills/manage-skill', { id: skill.Id }]) 
  }

}
