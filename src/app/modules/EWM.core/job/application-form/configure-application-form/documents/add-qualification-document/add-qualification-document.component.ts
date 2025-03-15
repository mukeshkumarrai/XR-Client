import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { BehaviorSubject, Subject } from 'rxjs';
import { CandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-skills/candidate-skills.component';
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


@Component({
  selector: 'app-add-qualification-document',
  templateUrl: './add-qualification-document.component.html',
  styleUrls: ['./add-qualification-document.component.scss']
})
export class AddQualificationDocumentComponent implements OnInit {
  public pageNo: number = 1;
  public pageSize;
  public sortingValue: string = "QualificationName,asc";
  loadingscroll;
  gridData;
  public filterConfig: any[] = [];
  public GridId: any = 'Skills_grid_001';
  totalDataCount;
  loading;
  loadingSearch;
  searchskillList: any;
  addSkillForm: FormGroup;
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedSkill: any = {};
  actionType = 'Add';
  addedSkill = [];
  qualificationSelectedList: any = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  skillListLengthMore: any = 5;
  public idName = 'Id';
  public idQualification = '';
  public newArray: any[] = [];
  animationVar: any;
  resetFormSubjectQualification: Subject<any> = new Subject<any>();
  public dropDownQualificationConfig: customDropdownConfig[] = [];
  public selectedQualification: any = [];
  public selectedQualificationList: any=[];
  public selectedQ:any
  skillData: any;
  search = new FormControl();

  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialogRef<CandidateSkillsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private serviceListClass: ServiceListClass,
    private translateService: TranslateService, public candidateService: CandidateService, private quickJobService: QuickJobService, public dialog: MatDialog,
    private commonService: CommonserviceService, private appSettingsService: AppSettingsService,) {
    // page option from config file
    this.pageSize = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this.appSettingsService.pagesize;
    // who:maneesh,what:ewm-10553 add custome dropdown when:03/03/2023
       //////Qualification//////////////
       this.dropDownQualificationConfig['IsDisabled'] = false;
       this.dropDownQualificationConfig['apiEndPoint'] = this.serviceListClass.getQualification + '?ByPassPaging=true' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';//who:maneesh,what:ewm-12430 add by passing true ,when:13/06/2023
       this.dropDownQualificationConfig['placeholder'] = 'quickjob_qualification';
       this.dropDownQualificationConfig['IsManage'] = '/client/core/administrators/qualification';
       this.dropDownQualificationConfig['IsRequired'] = false;
       this.dropDownQualificationConfig['searchEnable'] = true;
       this.dropDownQualificationConfig['bindLabel'] = 'QualificationName';
       this.dropDownQualificationConfig['multiple'] = true;
    this.addSkillForm = this.fb.group({
      skillName: [0],
      Id: []
    })
  }

  ngOnInit(): void {
    this.qualificationSelectedList = [...this.data?.qualificationDatas]; 
    // who:maneesh,what:ewm-10553   qualificationSelectedList when:03/03/2023
    this.skillData=this.qualificationSelectedList.map((x)=>x.QualificationName )    
    this.newArray = JSON.parse(JSON.stringify(this.data?.qualificationDatas));
    this.actionType = this.data?.action;
    this.animationVar = ButtonTypes;
    // who:maneesh,what:ewm-10553 for patch data when edit when:03/03/2023
    this.addSkillForm.patchValue({
      skillName: this.skillData
    });
  }
  /*
  @Type: File, <ts>
  @Name: onConfirm function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: For saving data
  */
  onConfirm() {
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    // who:maneesh,what:ewm-10553 change  qualificationAllData value selectedQualificatio when:03/03/2023
    //  this.selectedQ=this.qualificationSelectedList.filter(x=>x.QualificationName); 
    // who:maneesh,what:ewm-10553 for remove duplicate value ,when:04/03/2023
    if (this.qualificationSelectedList===null ||this.qualificationSelectedList===' '||this.qualificationSelectedList===undefined) {
       this.qualificationSelectedList=[];
     } 
     const result = Array?.from(this.qualificationSelectedList?.reduce((m, t) => m.set(t?.QualificationName, t), new Map()).values());
    setTimeout(() => { this.dialogRef.close({ resType: true, qualificationAllData: result }); }, 200);
  }
  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Adarsh singh
@When: 23-05-2022
@Why: EWM-6550 EWM-6696
@What: For cancel event
*/
  onDismiss() {
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: true, qualificationAllData: this.newArray }); }, 200);
  }
  /*
  @Type: File, <ts>
  @Name: getQualificationList function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: For getting the data from api 
  */
  getQualificationList(pageSize, pageNo, sortingValue, searchVal, idName, idQualification) {
    this.loadingSearch = true;
    this.systemSettingService.getQualificationList(pageSize, pageNo, sortingValue, searchVal, idName, idQualification).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.loading = false;
          if (repsonsedata.Data) {
            this.searchskillList = repsonsedata.Data;
          }
          this.totalDataCount = repsonsedata.TotalRecord;
        } else {
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
  @Type: File, <ts>
  @Name: add function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get add qualification List
  */
  add(event: MatChipInputEvent): void {
    //   alert("add");
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
  @Name: remove function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get remove chips qualification
  */
  remove(Id): void {
    const index = this.qualificationSelectedList.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.qualificationSelectedList.splice(index, 1);
    }
    if (this.qualificationSelectedList.length > 0) {
    } else {
    }
  }

  /* 
  @Type: File, <ts>
  @Name: onsearchSkills function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: on type api calling...
  */
  currentSearchValue;
  searchValue;
  public onsearchSkills(inputValue: string) {
    this.currentSearchValue = inputValue;
    if (inputValue.length === 0) {
      this.searchskillList = [];
    }
    if (inputValue.length > 0 && inputValue.length > 3) {
      this.searchValue = inputValue;
      this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.currentSearchValue, this.idName, this.idQualification);
    }
  }
  /* 
  @Type: File, <ts>
  @Name: selectedSkills function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get selected qualification List
  */
  public skillTag: any = [];
  public selectedSkills(event: MatAutocompleteSelectedEvent): void {
    this.searchskillList = [];
    this.skillInput.nativeElement.value = '';
    let duplicateCheck = this.qualificationSelectedList.filter(x => x['Id'] === event.option.value.Id);
    if (duplicateCheck.length == 0) {
      this.qualificationSelectedList.push(event.option.value);
    }
  }
/* 
@Type: File, <ts>
@Name: clickMoreRecord function
@Who: Adarsh singh
@When: 23-05-2022
@Why: EWM-6550 EWM-6696
@What: For showing more chip data
*/
public clickForMoreRecord() {
  this.skillListLengthMore = this.qualificationSelectedList.length;
}
 /* 
  @Type: File, <ts>
  @Name: refreshComponent function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get refresh data
  */
  refreshComponent() {
    // this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.currentSearchValue, this.idName, this.idQualification);
   }
     /* 
@Type: File, <ts>
@Name: onQualificationchange function
@Who: maneesh
@When: 03/03/2023-Aug-2021
@Why: EWM-10553
@What: get Qualification 
*/
  onQualificationchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.qualificationSelectedList = null;
      this.addSkillForm.patchValue(
        {
          QualificationId: null
        });
    }
    else {
      this.addSkillForm?.get("QualificationId")?.clearValidators();
      this.addSkillForm?.get("QualificationId")?.markAsPristine();
      this.qualificationSelectedList = data;      
      const qualificationId = data.map((item: any) => {
        return item.Id
      });
      this.addSkillForm.patchValue(
        {
          QualificationId: qualificationId
        }
      )
    }
   }
}
