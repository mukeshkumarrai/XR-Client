import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../../shared/datamodels';

@Component({
  selector: 'app-manage-skill',
  templateUrl: './manage-skill.component.html',
  styleUrls: ['./manage-skill.component.scss']
})
export class ManageSkillComponent implements OnInit {

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
    private translateService: TranslateService) {
    this.addForm = this.fb.group({
      Id: [''],
      name: ['', [Validators.maxLength(50), Validators.minLength(3)]],
      SkillTag: [],
      WeightageId: [null],
      Weightage: [null],
      Industry: [],
      status: [null],
      StatusName: [null, Validators.required],
      DisplaySequence: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.min(0)]],
      HideExternal: [false],
      Renewal: [false],
      DocumentRequired: [false],


    });

    //////SkillTags //////////////
    this.dropDownSkillTagsConfig['IsDisabled'] = false;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillGroupList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = '/client/core/administrators/skill-tag;can=candidate';
    this.dropDownSkillTagsConfig['IsRequired'] = false;
    this.dropDownSkillTagsConfig['searchEnable'] = true;
    this.dropDownSkillTagsConfig['bindLabel'] = 'GroupName';
    this.dropDownSkillTagsConfig['multiple'] = true;


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
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification+'?ByPassPaging=true';
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

    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = 'Edit'
          this.tempID = params['id'];
          this.editForm(this.tempID);
        } else {
          this.industryId = localStorage.getItem('IndustryId');
        }
      });

    this.route.queryParams.subscribe((params) => {
      this.viewModeValue = params['viewModeData'];
    })

    this.getStatusList();
    let status = {StatusId:1,StatusName:'Active'}
    this.onchangeStatus(status); //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
  }




  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Anup
   @When: 01-Nov-2021
   @Why: EWM-3132 EWM-3603
   @What: For setting value in the edit form
  */

  editForm(Id: String) {
    this.loading = true;
    this.systemSettingService.getskillsListById('?Id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.oldPatchValues = data.Data;

          this.selectedSkillTags = data?.Data?.Tags;
          this.SkillTags = data?.Data?.Tags;
          const SkillTagId = this.SkillTags.map((item: any) => {
            return item.Id
          });

          this.addForm.patchValue(
            {
              SkillTag: SkillTagId
            }
          )

          this.selectedIndustry = data?.Data?.Industry;
          this.SkillIndustries = data?.Data?.Industry;

          this.selectedQualification = data?.Data?.Qualification;
          this.SkillQualifications = data?.Data?.Qualification;
          this.selectedWeightage = {Id:data?.Data?.Skill?.WeightageId} 
          
          this.addForm.patchValue({
            Id: Id,
            name: data?.Data?.Skill?.SkillName,
            Weightage: data?.Data?.Skill?.Weightage,
            WeightageId: data?.Data?.Skill?.WeightageId,
            status: data?.Data?.Skill?.Status,
            StatusName: data?.Data?.Skill?.StatusName,
            DisplaySequence: data?.Data?.Skill?.DisplaySequence,
          });
          if (data?.Data?.Skill?.HideExternally == 1) {
            this.addForm.patchValue({
              HideExternal: true
            })
          } else {
            this.addForm.patchValue({
              HideExternal: false
            })
          }

          if (data?.Data?.Skill?.Renewal == 1) {
            this.addForm.patchValue({
              Renewal: true
            })
          } else {
            this.addForm.patchValue({
              Renewal: false
            })
          }
          if (data?.Data?.Skill?.DocumentRequired == 1) {
            this.addForm.patchValue({
              DocumentRequired: true
            })
          } else {
            this.addForm.patchValue({
              DocumentRequired: false
            })
          }
          this.isHideExternally = data?.Data?.Skill?.HideExternally;
          this.isRenewal = data?.Data?.Skill?.Renewal;
          this.isdocument = data?.Data?.Skill?.DocumentRequired;

          this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(3)]);

        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        } else {
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
    @Who: Anup
    @When: 01-Nov-2021
    @Why: EWM-3132 EWM-3603
    @What: For save form value in edit or create
   */

  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    if (actionStatus == 'Add') {
      this.createSkill(value);
    } else {
      this.updateSkill(value);
    }


  }


  /*
  @Type: File, <ts>
  @Name: updateSkill function
  @Who: Anup
  @When: 01-Nov-2021
  @Why: EWM-3132 EWM-3603
  @What: For update form value
 */

  updateSkill(value) {
    this.loading = true;
    let fromObj = {};
    fromObj = this.oldPatchValues;

    let skillObj = {}
    skillObj['Id'] = parseInt(value.Id);
    skillObj['SkillName'] = value.name;
    if (value?.WeightageId != undefined && value?.WeightageId != null && value?.WeightageId != '') {
      skillObj['WeightageId'] = value.WeightageId;
    } else {
      skillObj['WeightageId'] = 0
    }

    if (value?.Weightage != undefined && value?.Weightage != null && value?.Weightage != '') {
      skillObj['Weightage'] = value.Weightage;
    } else {
      skillObj['Weightage'] = 0
    }

    skillObj['Status'] = value.status;
    skillObj['StatusName'] = value.StatusName;
    if (value?.DisplaySequence != undefined && value?.DisplaySequence != null && value?.DisplaySequence != '') {
      skillObj['DisplaySequence'] = parseInt(value.DisplaySequence);
    } else {
      skillObj['DisplaySequence'] = 0
    }
    skillObj['HideExternally'] = this.isHideExternally;
    skillObj['Renewal'] = this.isRenewal;
    skillObj['DocumentRequired'] = this.isdocument;

    let SkillsJsonObj = {};
    SkillsJsonObj['Skill'] = skillObj;
    SkillsJsonObj['Tags'] = this.SkillTags;
    SkillsJsonObj['Industry'] = this.SkillIndustries;
    SkillsJsonObj['Qualification'] = this.SkillQualifications;

    let addObj = {};

    addObj = [{
      "From": fromObj,
      "To": SkillsJsonObj
    }];
    this.systemSettingService.updateSkills(addObj[0]).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        let viewModeData: any = this.viewModeValue;
        /* this.router.navigate(['./client/core/administrators/skills'], {
           queryParams: { viewModeData }
         })
         */
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


  /*
  @Type: File, <ts>
  @Name: onCancel function
  @Who: Anup
  @When: 01-Nov-2021
  @Why: EWM-3132 EWM-3603
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
  @Name: onNameChanges function
  @Who:  Suika
  @When: 13-May-2021
  @Why: EWM-1506
  @What: This function is used for checking duplicacy for code
  */

  onNameChanges() {
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = 0;
    }
    let skillName = this.addForm.get("name").value;
    let duplicacyObj = [
      {
        "Id": parseInt(Id),
        "SkillName": skillName,
      }
    ];

    if (this.addForm.get("name").value) {

      this.systemSettingService.checkSkillsDuplicay(duplicacyObj).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              this.addForm.get("name").setErrors({ nameTaken: true });
              this.addForm.get("name").markAsDirty();
            }
          } else if (repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              this.addForm.get("name").clearValidators();
              this.addForm.get("name").markAsPristine();
              this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(3)]);
            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.addForm.get("name").clearValidators();
            this.addForm.get("name").markAsPristine();
            this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(3)]);

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
    else {
      this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(50)]);

    }
    this.addForm.get('name').updateValueAndValidity();
  }



  /*
    @Type: File, <ts>
    @Name: getStatusList function
    @Who:  Suika
    @When: 20-May-2021
    @Why: ROST-1452
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
   @Name: addSkill function
   @Who:  Anup
   @When: 29-Oct-2021
   @Why: EWM-3132 EWM-3605
   @What: For add skill chip
  */
  isSkillValidation: boolean = true;
  isSkillMin: boolean = false;
  isSkillMax: boolean = false;
  addSkill(event: MatChipInputEvent): void {
    const value = event.value;
    const input = event.input;
    if (value.trim() != null && value.trim() != undefined && value.trim() != '') {
      if (value.trim().length <= 2) {
        this.isSkillMin = true;
        this.isSkillMax = false;
      } else if (value.trim().length > 50) {
        this.isSkillMin = false;
        this.isSkillMax = true;
      }
      else {
        // Add our Skill
        if ((value || '').trim()) {
          if (this.Skills.some(el => el.SkillName == value.trim())) {
           // this.isSkillduplicateValidation = false;
          } else {
            this.Skills.push({ SkillName: value.trim() });
            this.duplicacyCheckInChip(this.Skills);
            // this.isSkillValidation = true;
            // this.isSkillduplicateValidation = true;
          }
        }
        this.isSkillMin = false;
        this.isSkillMax = false;
      }
    }


    if (this.Skills == undefined || this.Skills == null || this.Skills.length == 0) {
      this.isSkillValidation = false;
    } else {
      this.isSkillValidation = true;
    }


    //Reset the input value
    if (input) {
      input.value = '';
    }

  }


  /*
   @Type: File, <ts>
   @Name: duplicacyCheckInChip function
   @Who:  Anup
   @When: 01-Nov-2021
   @Why: EWM-3132 EWM-3605
   @What: For  skill chip duplicate check
  */
  isSkillduplicateValidation: boolean = true;
  ErrorField: any = [];
  duplicacyCheckInChip(dataSkill) {
    if (dataSkill) {
      this.systemSettingService.checkSkillsDuplicay(dataSkill).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              this.isSkillduplicateValidation = false;
              this.ErrorField = repsonsedata.ErrorFields;
              // this.addForm.get("name").setErrors({ nameTaken: true });
              // this.addForm.get("name").markAsDirty();
            }
          } else if (repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              this.isSkillduplicateValidation = true;


              // this.addForm.get("name").clearValidators();
              // this.addForm.get("name").markAsPristine();
              // this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(20), Validators.minLength(3)]);
            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.isSkillduplicateValidation = true;
            // this.addForm.get("name").clearValidators();
            // this.addForm.get("name").markAsPristine();
            // this.addForm.get('name').setValidators([Validators.required,Validators.maxLength(20), Validators.minLength(3)]);

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
    else {
      //  this.addForm.get('name').setValidators([Validators.required, Validators.maxLength(100)]);

    }
    //  this.addForm.get('name').updateValueAndValidity();
  }



  /*
   @Type: File, <ts>
   @Name: removeSkill function
   @Who:  Anup
   @When: 29-Oct-2021
   @Why: EWM-3132 EWM-3605
   @What: For remove skill chip
  */
  removeSkill(skill: any): void {
    const index = this.Skills.indexOf(skill);

    if (index >= 0) {
      this.Skills.splice(index, 1);
    }

    // for validation
    if (this.Skills == undefined || this.Skills == null || this.Skills.length == 0) {
      this.isSkillValidation = false;
      this.isSkillduplicateValidation = true;
    } else {
      this.isSkillValidation = true;
      this.duplicacyCheckInChip(this.Skills);
    }
  }

  /////skill tag
  /* 
 @Type: File, <ts>
 @Name: onSkillTagschange function
 @Who: Anup
 @When: 29-Oct-2021
 @Why: EWM-3132 EWM-3605
 @What: get skill group List and patch
 */
  onSkillTagschange(data) {
    if (data == null || data == "" || data.length == 0) {    
      this.selectedSkillTags = null;
      // this.addForm.get("SkillTag").setErrors({ required: true });
      this.addForm.get('SkillTag').setValidators([Validators.required]);
      this.addForm.get("SkillTag").markAsTouched();
      this.addForm.get("SkillTag").markAsDirty();
      this.SkillTags=[];
    }
    else {    
      this.addForm.get("SkillTag").clearValidators(); 
      this.addForm.get("SkillTag").markAsPristine();
      // this.addForm.get('SkillTag').setValidators([Validators.required]);   
      this.selectedSkillTags = data;
      this.SkillTags = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        this.SkillTags.push({ Id: element.Id, Name: element.GroupName })
      }
      const SkillTagId = data.map((item: any) => {
        return item.Id
      });

      this.addForm.patchValue(
        {
          SkillTag: SkillTagId
        }
      )

    }
  }



  /////weightages list
  /* 
 @Type: File, <ts>
 @Name: onWeightagechange function
 @Who: Anup
 @When: 29-Oct-2021
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
 @Who: Anup
 @When: 29-Oct-2021
 @Why: EWM-3132 EWM-3605
 @What: get industry List 
 */

  onIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;
      this.addForm.patchValue(
        {
          Industry: null,
        })
      this.addForm.get('Industry').setValidators([Validators.required]);
      this.addForm.get("Industry").markAsTouched();
      this.addForm.get("Industry").markAsDirty();
      this.SkillIndustries=[];

    }
    else {
      this.addForm.get("Industry").clearValidators();
      this.addForm.get("Industry").markAsPristine();
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
@Who: Anup
 @When: 29-Oct-2021
 @Why: EWM-3132 EWM-3605
@What: get Qualification List
*/
  onQualificationchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedQualification = null;
      this.SkillQualifications = [];
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
  @Who: Anup
  @When: 29-Oct-2021
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
  @Who: Anup
  @When: 29-Oct-2021
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
@Who: Anup
@When: 29-Oct-2021
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
@Who: Anup
@When: 29-Oct-2021
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


  /* 
@Type: File, <ts>
@Name: createSkill function
@Who: Anup
@When: 29-Oct-2021
@Why: EWM-3132 EWM-3605
@What: for create skills 
*/
  createSkill(value) {
    this.loading = true;

    let SkillsJsonObj = {}
    SkillsJsonObj['Skills'] = this.Skills;
    SkillsJsonObj['SkillTags'] = this.SkillTags;
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
    SkillsJsonObj['PageName'] = "Skill";
    SkillsJsonObj['BtnId'] = "btnSave";
    this.systemSettingService.createSkills(SkillsJsonObj).subscribe(repsonsedata => {
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





}

