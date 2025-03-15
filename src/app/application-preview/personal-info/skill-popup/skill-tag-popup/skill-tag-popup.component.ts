/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Suika
    @When: 11-Nov-2021
    @Why: EWM-3556 EWM-3643
    @What:  This page is creted for bulk edit
*/
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, ButtonTypes } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';


@Component({
  selector: 'app-skill-tag-popup',
  templateUrl: './skill-tag-popup.component.html',
  styleUrls: ['./skill-tag-popup.component.scss']
})
export class SkillTagPopupComponent implements OnInit {
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
  search = new FormControl();
  ///@ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('skillInput') skillInput: NgSelectComponent;
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;
  private _mobileQueryListener: () => void;
  maxMoreLength: any;
  public loader: boolean = false;
  skillSelectedListId: any[] = [];
  skillsListByTag: any = [];
  animationVar: any;
  messageCount: string;

  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialogRef<SkillTagPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public systemSettingService: SystemSettingService, private snackBService: SnackBarService, private commonServiesService: CommonServiesService,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, private serviceListClass: ServiceListClass,
    private translateService: TranslateService, public candidateService: CandidateService, private quickJobService: QuickJobService, public dialog: MatDialog,
    private appSettingsService: AppSettingsService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.candidateId = this.data.candidateId;
    this.addForm = this.fb.group({
      Id: [''],
      // name: ['', [Validators.maxLength(20), Validators.minLength(3)]],
      SkillTag: ['', Validators.required],
      /* WeightageId: [null],
       Weightage: [null],
       status: [null],
       StatusName: ['', Validators.required],
       DisplaySequence: ['', [Validators.pattern("^[0-9]*$"), Validators.maxLength(8), Validators.min(0)]],
       HideExternal: [false],
       Renewal: [false],
       DocumentRequired: [false],*/

    });

    //////SkillTags //////////////
    this.dropDownSkillTagsConfig['IsDisabled'] = false;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillsTagList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = true;
    this.dropDownSkillTagsConfig['IsRequired'] = true;
    this.dropDownSkillTagsConfig['searchEnable'] = false;
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
    this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification;
    this.dropDownQualificationConfig['placeholder'] = 'quickjob_qualification';
    this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
    this.dropDownQualificationConfig['IsRequired'] = false;
    this.dropDownQualificationConfig['searchEnable'] = true;
    this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
    this.dropDownQualificationConfig['multiple'] = true;

    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiry();
    };
    this.forSmallSmartphones.addListener(this._mobileQueryListener);
  }


  ngOnInit(): void {
    this.screenMediaQuiry();
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
    this.tagSkillsList();
    this.animationVar = ButtonTypes;
  }



  /*
   @Type: File, <ts>
   @Name: onDismiss
    @Who: Anup singh
    @When: 13-Aug-2021
    @Why: EWM-2242.EWM-2506
   @What: for close popup
   */
  onDismiss(): void {
    // const editFormArray = this.addForm.get("skillsData") as FormArray;
    // editFormArray.clear();
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

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

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
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
      this.addForm.patchValue({
        'SkillTag': 1
      })
      this.SkillTag.clearValidators();
      this.SkillTag.updateValueAndValidity();
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
  @Who: Anup Singh
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3605
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
          this.getSkillsByTagId(TagData.Id)
        }
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
   @Name: onConfirm function
   @Who: Anup
   @When: 16-Aug-2021
   @Why: EWM-2242.EWM-2507
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
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }



  /*
     @Type: File, <ts>
     @Name: addSkills function
     @Who: Anup
     @When: 16-Aug-2021
     @Why: EWM-2242.EWM-2507
     @What:Add Skills List
     */
  addSkills() {
    this.loading = true;
    let SkillsJsonObj = {}
    this.loading = false;
    // this.getAllSkills();
    SkillsJsonObj['Skills'] =  this.skillSelectedList.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t.Id === thing.Id
    ))
    );
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(SkillsJsonObj); }, 200);

  }

  /*
     @Type: File, <ts>
     @Name: updateSkills function
     @Who: Anup
     @When: 16-Aug-2021
     @Why: EWM-2242.EWM-2507
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
@When: 25-Nov-2020
@Why: ROST-405
@What: service call for get list for user role data
*/
// @When: 13-08-2024 @who:Amit @why: EWM-17886 @what: skill count & tag lable show
mintitle:string;
  openPopupForSkillCountOfTag(count, SkillDataByTag, tagName): void {

    let countSkill: string = count;
    let message = countSkill;

    if (message=='1' ||message=='0') {  
      this.mintitle ='JobSummary_AddSkills_0_value';
      message = this.commonServiesService.getreplaceSkill(this.mintitle, tagName, count);
      } else {
       this.mintitle ='JobSummary_AddSkills';
      message = this.commonServiesService.getreplaceSkill(this.mintitle, tagName, count);
    }

    let titellabel=message;
    let title=''
    const dialogData = new ConfirmDialogModel(title, titellabel, this.messageCount);
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
          this.skillSelectedList.push(element);
          this.skillSelectedListId.push(element);
        }
        this.SkillTag.patchValue(this.skillSelectedListId);
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
  /*
     @Who: Renu
     @When: 28-July-2022
     @Why: EWM-7968 EWM-8026
     @What: to compare objects selected patch value
   */
  compareFn(c1: any, c2: any): boolean {
    // let keyValue:string='Name';
    return c1 && c2 ? c1['Id'] === c2['Id'] : c1 === c2;
  }

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

  // refreshComponent(){
  // this.getAllSkillGroupLists();
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
  public selectedSkills(eventData): void {
    let event = eventData[eventData.length - 1];
    this.addForm.patchValue({
      'SkillTag': event?.Id
    })
    if (event?.IsTag === 0) {
      if (this.skillSelectedList.some(el => el.SkillName == event?.SkillName)) {
      }
      else {
        this.skillSelectedList.push({
          'Id': event?.Id,
          'SkillName': event?.SkillName,
          'Weightage': event?.Weightage,

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
      this.skillSelectedListId = this.skillSelectedListId.filter(s => s?.Id != event?.Id);
      this.skillTag.push({
        'Id': event?.Id,
        'TagName': event?.TagName,
      });
      this.getskillListByTagId(event?.Id, event?.TagName);
    }
    //this.searchskillList = [];
    //this.skillInput.nativeElement.value = '';
    // this.getSkillById(event.option.value.Id, event.option.viewValue);
  }

  screenMediaQuiry() {
    if (this.forSmallSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forSmartphones.matches == true) {
      this.maxMoreLength = 0;
    } else if (this.forLargeSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forIpads.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forMiniLapi.matches == true) {
      this.maxMoreLength = 4;
    } else {
      this.maxMoreLength = 2;
    }
  }
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Id.toLocaleLowerCase().indexOf(term) > -1 ;
}


  public onsearchSkills(inputValue: string) {
    this.currentSearchValue = inputValue;
    this.loadingSearch = true;
    if (inputValue.length === 0) {
      //this.searchskillList = [];
      this.tagSkillsList();
      this.loadingSearch = false;
      this.searchValue='';
    }
    if (inputValue.length > 0 && inputValue.length > 1) {
      this.searchValue = inputValue;
      this.loadingSearch = false;
      this.quickJobService.getAllSkillAndTag("?Search=" + inputValue + '?FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND').subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.searchskillList = repsonsedata.Data;
            if (repsonsedata.Data != null) {
              this.skillCount = repsonsedata.Data[0]?.SkillCount;
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

  refreshComponent(event) {
    // this.onsearchSkills(this.currentSearchValue);
    this.searchValue='';
    this.loader=true;
    this.tagSkillsList();
  }

  /*
  @Type: File, <ts>
  @Name: tagSkillsList function
  @Who: Renu
  @When: 27-July-2022
  @Why: EWM-7968 EWM-8026
  @What: service call for get list for skills
  */

  public tagSkillsList() {
    this.loadingSearch = true;
    this.quickJobService.getAllSkillAndTagWithoutFilter('?FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loader = false;
          this.loadingSearch = false;
          this.searchskillList = repsonsedata.Data;
          if (repsonsedata.Data != null) {
            this.skillCount = repsonsedata.Data[0]?.SkillCount;
          }
        } else {
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
}

