/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: skill-popup.component.ts
 @Who: Renu
 @When: 22-June-2022
 @Why: ROST-7151 EWM-7233
 @What: skills popup
 */
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-skill-popup',
  templateUrl: './skill-popup.component.html',
  styleUrls: ['./skill-popup.component.scss']
})
export class SkillPopupComponent implements OnInit {
  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  actionType: any;
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
  editData: any = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  Skills: any[] = [];
  candidateId: any;
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
  skillSelectedList: any = [];
  currentSearchValue: string;
  loadingSearch: boolean;
  searchskillList: any[];
  searchValue: string;
  // quickJobService: any;
  skillCount: any;
  SkillTag = new FormControl();
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialogRef<SkillPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, private serviceListClass: ServiceListClass,
    private translateService: TranslateService, public candidateService: CandidateService, private quickJobService: QuickJobService, public dialog: MatDialog) {
    this.candidateId = this.data.candidateId;
    this.addForm = this.fb.group({
      Id: [''],
      SkillTag: ['', Validators.required],

    });

    //////SkillTags //////////////
    this.dropDownSkillTagsConfig['IsDisabled'] = false;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillsList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = false;
    this.dropDownSkillTagsConfig['IsRequired'] = true;
    this.dropDownSkillTagsConfig['searchEnable'] = true;
    this.dropDownSkillTagsConfig['bindLabel'] = 'SkillName';
    this.dropDownSkillTagsConfig['multiple'] = true;
    this.dropDownSkillTagsConfig['IsRefresh'] = false;

    //////Weightage //////////////
    this.dropDownWeightageConfig['IsDisabled'] = false;
    this.dropDownWeightageConfig['apiEndPoint'] = this.serviceListClass.getWeightageList;
    this.dropDownWeightageConfig['placeholder'] = 'label_weightage';
    this.dropDownWeightageConfig['IsManage'] = '/client/core/administrators/weightage';
    this.dropDownWeightageConfig['IsRequired'] = false;
    this.dropDownWeightageConfig['searchEnable'] = true;
    this.dropDownWeightageConfig['bindLabel'] = 'Weightage';
    this.dropDownWeightageConfig['multiple'] = false;
    this.dropDownWeightageConfig['IsRefresh'] = false;

    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;
    this.dropDownIndustryConfig['IsRefresh'] = false;

    //////Qualification//////////////
    this.dropDownQualificationConfig['IsDisabled'] = false;
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification;
    this.dropDownQualificationConfig['placeholder'] = 'quickjob_qualification';
    this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
    this.dropDownQualificationConfig['IsRequired'] = false;
    this.dropDownQualificationConfig['searchEnable'] = true;
    this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
    this.dropDownQualificationConfig['multiple'] = true;
    this.dropDownQualificationConfig['IsRefresh'] = false;
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
    this.actionType = this.data.actionType;
    this.getStatusList();
  }



  /*
   @Type: File, <ts>
   @Name: onDismiss
 @Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
   @What: for close popup
   */
  onDismiss(): void {
    // const editFormArray = this.addForm.get("skillsData") as FormArray;
    // editFormArray.clear();
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }

  /*
    @Type: File, <ts>
    @Name: getStatusList function
 @Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
  @Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
      //this.isSkillValidation = false;
      this.Skills = [];
      this.addForm.get('SkillTag').reset();
      this.isBulkEdit = false;
    } else {
      this.isSkillValidation = true;
    }
  }





  /////weightages list
  /* 
 @Type: File, <ts>
 @Name: onWeightagechange function
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
 @Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
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
@Who: Renu
@When: 22-June-2020
@Why: ROST-7151 ROST-7233
 @What: get skill group List and patch
 */
  onSkillTagschange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedSkillTags = null;
    }
    else {
      this.addForm.patchValue({
        'SkillTag': 1

      })
      this.SkillTag.clearValidators();
      this.SkillTag.updateValueAndValidity();
      this.selectedSkillTags = data;
      this.SkillTags = [];
     // this.getSkillNameCount(data);
    }
  }

  /* 
    @Type: File, <ts>
    @Name: getSkillNameCount function
    @Who: Renu
    @When: 22-June-2020
    @Why: ROST-7151 ROST-7233
    @What: get total skill count
  */

  getSkillNameCount(TagData) {
    this.systemSettingService.fetchSkillNameCount("?skilltagid=" + TagData.Id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          let countSkill = repsonsedata?.Data?.Count;
          // alert("countSkill "+countSkill);
          /*if(countSkill!=0){
            this.openBulkEditMsgPopup(countSkill, TagData);
          } */
          this.openBulkEditMsgPopup(countSkill, TagData);
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
    @Who: Renu
    @When: 22-June-2020
    @Why: ROST-7151 ROST-7233
    @What: open popup for bulk edit
  */
  openBulkEditMsgPopup(count, TagData): void {
    let countSkill: string = count;
    const message = countSkill;
    const title1 = 'label_skillLinked';
    let lng = this.translateService.instant('label_tagName')
    const subTitle = TagData?.GroupName + ' ' + lng + '.' + this.translateService.instant('label_skillDoYouWant');
    // const subTitle = '';
    const dialogData = new ConfirmDialogModel(title1, subTitle, message,);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (countSkill == '0') {
          this.isBulkEdit = false;
        } else {
          this.isBulkEdit = true;
          this.getSkillsByTagId(TagData.Id);
        }
      }
    });
  }

  /* 
  @Type: File, <ts>
  @Name: getSkillsByTagId function
  @Who: Renu
  @When: 22-June-2020
  @Why: ROST-7151 ROST-7233
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
    @Name: onConfirm function
    @Who: Renu
    @When: 22-June-2020
    @Why: ROST-7151 ROST-7233
    @What: Submit Skills Data
   */
  onConfirm(): void {
    if (this.addForm.invalid) {
      return;
    }
    // this.submitted = true;
    if (this.actionType == 'add') {
      this.addSkills();
    } else {
      this.updateSkills();
    }
  }



  /*
    @Type: File, <ts>
    @Name: addSkills function
    @Who: Renu
    @When: 22-June-2020
    @Why: ROST-7151 ROST-7233
    @What:Add Skills List
  */
  addSkills() {
    this.loading = true;
    let SkillsJsonObj = {}
    this.loading = false;
    // this.getAllSkills();
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.selectedSkillTags); }, 200);

  }

  /*
    @Type: File, <ts>
    @Name: updateSkills function
    @Who: Renu
    @When: 22-June-2020
    @Why: ROST-7151 ROST-7233
    @What: Update Skills List
  */

  updateSkills() {
    this.loading = true;
    let updateObj = {
      "From": this.editData,
      "To": this.addForm.value.skillsData,
    };
    this.candidateService.updateSkillsData(updateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          // this.getAllSkills();
          document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
  @Name: userRoleList function
  @Who: Renu
  @When: 22-June-2020
  @Why: ROST-7151 ROST-7233
  @What: service call for get list for user role data
  */

  openPopupForSkillCountOfTag(count, SkillDataByTag, tagName): void {
    let countSkill: string = count;

    const message = countSkill;
    const title = 'label_skillLinked';
    let lng = this.translateService.instant('label_tagName');
    const subTitle = tagName + ' ' + lng + '.' + this.translateService.instant('label_skillDoYouWant');
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        for (let index = 0; index < SkillDataByTag.length; index++) {
          const element = SkillDataByTag[index];
          //  console.log("taglist:",element);
          this.skillSelectedList.push(element);
        }
        //this.skillSelectedList.forEach(element => {
        // this.skillIds.push(element.Id);
        //  });

      } else {
        const index = this.skillTag.findIndex(x => x.TagName === tagName);
        if (index !== -1) {
          this.skillTag.splice(index, 1);
        }
      }

    });
  }

  skillsListByTag: any = []
  getskillListByTagId(id, tagName) {
    this.systemSettingService.fetchSkillsByTagId("?skilltagid=" + id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.skillsListByTag = repsonsedata.Data;
          let totalRecord = repsonsedata.TotalRecord;
          this.openPopupForSkillCountOfTag(totalRecord, this.skillsListByTag, tagName)

        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

  gridView;
  // getAllSkillGroupLists() {
  //   this.loading = true;
  //   this.commonserviceService.getAllSkillList().subscribe(
  //     repsonsedata => {
  //       if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
  //         this.loading = false;
  //         this.searchskillList = repsonsedata['Data'];
  //         this.gridView = repsonsedata['Data'];;
  //       } else {
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
  //         this.loading = false;
  //       }
  //     }, err => {
  //       this.loading = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //     })
  // }



  remove(Id): void {
    const index = this.skillSelectedList.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.skillSelectedList.splice(index, 1);
    }
    if (this.skillSelectedList.length > 0) {
      //this.saveEnableDisable = false;
    } else {
      //this.saveEnableDisable = true;
    }
    // this.currentSearchValue = '';
  }

  public skillTag: any = [];
  public selectedSkills(event: MatAutocompleteSelectedEvent): void {
    this.addForm.patchValue({
      'SkillTag': event.option.value.Id
    })
    if (event.option.value.IsTag === 0) {
      if (this.skillSelectedList.some(el => el.SkillName == event.option.value.SkillName)) {

      } else {
        this.skillSelectedList.push({
          'Id': event.option.value.Id,
          'SkillName': event.option.value.SkillName,
          'Weightage': event.option.value.Weightage,
        });

      }


    } else {
      // if (this.skillTag.some(el => el.TagName == event.option.value.TagName)) {

      // } else {
      //   this.skillTag.push({
      //     'Id': event.option.value.Id,
      //     'TagName': event.option.value.TagName,
      //   });


      //   this.getskillListByTagId(event.option.value.Id, event.option.value.TagName)
      // }
      this.skillTag.push({
        'Id': event.option.value.Id,
        'TagName': event.option.value.TagName,
      });
      this.getskillListByTagId(event.option.value.Id, event.option.value.TagName);
    }
    this.searchskillList = [];
    this.skillInput.nativeElement.value = '';


    // this.getSkillById(event.option.value.Id, event.option.viewValue);
  }






  public onsearchSkills(inputValue: string) {
    this.currentSearchValue = inputValue;
    this.loadingSearch = true;
    if (inputValue.length === 0) {
      this.searchskillList = [];
      this.loadingSearch = false;
    }
    if (inputValue.length > 0 && inputValue.length > 1) {
      this.searchValue = inputValue;
      this.loadingSearch = false;
      this.quickJobService.getAllSkillAndTag("?Search=" + inputValue).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.searchskillList = repsonsedata.Data;
            if (this.searchskillList) {
              this.skillCount = repsonsedata?.Data[0]?.Weightage;
            }

          } else {
            // this.loadingSearch = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          // this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  }

}
