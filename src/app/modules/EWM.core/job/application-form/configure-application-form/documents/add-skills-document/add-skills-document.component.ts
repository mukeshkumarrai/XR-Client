import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { json, RxwebValidators } from '@rxweb/reactive-form-validators';
import { BehaviorSubject } from 'rxjs';
import { CandidateSkillsComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-skills/candidate-skills.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, ButtonTypes } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';

@Component({
  selector: 'app-add-skills-document',
  templateUrl: './add-skills-document.component.html',
  styleUrls: ['./add-skills-document.component.scss']
})
export class AddSkillsDocumentComponent implements OnInit {

  public pageNo: number = 1;
  public pageSize;
  public sortingValue: string = "SkillName,asc";
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
  skillSelectedList: any = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl();
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  skillListLengthMore: any = 5;
  public newArray: any[] = [];
  public skillCount:any;  
  animationVar: any;
  SkillTag = new FormControl();
  forSmallSmartphones: MediaQueryList;
  public maxMoreLength: any = 3;
  public forSmartphones: MediaQueryList;
  public forLargeSmartphones:MediaQueryList;
  public forIpads:MediaQueryList;
  public forMiniLapi:MediaQueryList;
  public skillSelectedListId: any[] = [];
  public skillsListByTag: any = []
  skillData: any;
  search = new FormControl();
  messageCount: string;

  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, public dialogRef: MatDialogRef<CandidateSkillsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private serviceListClass: ServiceListClass, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public candidateService: CandidateService, private quickJobService: QuickJobService, public dialog: MatDialog,
    private commonService: CommonserviceService) {

    this.addSkillForm = this.fb.group({
      //skillName: [0],
      Id: [],
      SkillTag: [''],
    })
  }

  ngOnInit(): void {
    this.skillSelectedListId = [...this.data?.skillData];
    // who:maneesh,what:ewm-10553   qualificationSelectedList when:03/03/2023
    this.skillData=this.skillSelectedListId.map((x)=>x.SkillName )
    this.newArray = JSON.parse(JSON.stringify(this.data?.skillData));
    this.actionType = this.data?.action;
    this.animationVar = ButtonTypes;
    // who:maneesh,what:ewm-10553 for patch data when edit when:03/03/2023
    this.addSkillForm.patchValue({
      SkillTag: this.skillData
    });
// who:maneesh ,what: for ewm-10533 this.tagSkillsList() ,when:03/03/2023
    this.tagSkillsList()
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
    // who:maneesh,what:ewm-10553 for remove duplicate value ,when:04/03/2023
    const result = Array?.from(this.skillSelectedListId?.reduce((m, t) => m.set(t?.SkillName, t), new Map()).values());    
    setTimeout(() => { this.dialogRef.close({ resType: true, skillAllData: result }); }, 200);
  }
  /*
 @Type: File, <ts>
 @Name: onConfirm function
 @Who: Adarsh singh
 @When: 23-05-2022
 @Why: EWM-6550 EWM-6696
 @What: For cancel data
 */
  onDismiss() {
    document.getElementsByClassName("add_skills")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_skills")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: true, skillAllData: this.newArray }); }, 200);
  }
  /*
  @Type: File, <ts>
  @Name: getAllSkillListData function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: For getting the  data from api
  */
  getAllSkillListData(pagesize, pageNo, sortingValue, searchVal, JobFilter, isclearfilter: boolean, isScroll: boolean) {
    if (searchVal != undefined && searchVal != null && searchVal != '') {
      this.loadingSearch = true;
    } else if (isScroll == true) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    this.systemSettingService.getskillsListWithFilter(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          if (isScroll === true) {
            let nextgridView = [];
            nextgridView = repsonsedata['Data'];
            this.searchskillList = repsonsedata['Data'];            
            this.loadingscroll = false;
          } else {
            this.searchskillList = repsonsedata.Data;
            this.loading = false;
            this.loadingSearch = false;
          }
          this.totalDataCount = repsonsedata.TotalRecord;
          if (isclearfilter === true) {
            // this.getFilterConfig();
          }
        } else if (repsonsedata.HttpStatusCode === 204) {

          if (isScroll === true) {
            let nextgridView = [];
            nextgridView = repsonsedata['Data'];
            this.loadingscroll = false;
          } else {
            this.searchskillList = repsonsedata.Data;
            this.loading = false;
            this.loadingSearch = false;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /* 
  @Type: File, <ts>
  @Name: add function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get add skills List
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
  @What: get remove chips skills
  */
  remove(Id): void {
    const index = this.skillSelectedListId.findIndex(x => x.Id === Id);
    if (index !== -1) {
      this.skillSelectedListId.splice(index, 1);
    }
    if (this.skillSelectedListId.length > 0) {
    } else {
    }
  }

  /* 
  @Type: File, <ts>
  @Name: onsearchSkills function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get skills List
  */
  currentSearchValue;
  searchValue;
 /* public onsearchSkills(inputValue: string) {
    this.currentSearchValue = inputValue;
    if (inputValue.length === 0) {
      this.searchskillList = [];
    }
    if (inputValue.length > 0 && inputValue.length > 3) {
      this.searchValue = inputValue;
      this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.currentSearchValue, this.filterConfig, false, false);
    }
  }*/
  /* 
  @Type: File, <ts>
  @Name: selectedSkills function
  @Who: Adarsh singh
  @When: 23-05-2022
  @Why: EWM-6550 EWM-6696
  @What: get select skills List
  */
  public skillTag: any = [];
 /* public selectedSkills(event: MatAutocompleteSelectedEvent): void {
    this.searchskillList = [];
    this.skillInput.nativeElement.value = '';
    let duplicateCheck = this.skillSelectedList.filter(x => x['Id'] === event.option.value.Id);
    if (duplicateCheck.length == 0) {
      this.skillSelectedList.push(event.option.value);
    }
  }*/
/* 
@Type: File, <ts>
@Name: clickMoreRecord function
@Who: Adarsh singh
@When: 23-05-2022
@Why: EWM-6550 EWM-6696
@What: For showing more chip data
*/
   public clickForMoreRecord() {
    this.skillListLengthMore = this.skillSelectedListId.length;
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
// who:maneesh ,what: for ewm-10533 this.searchValue='' this.tagSkillsList() ,when:03/03/2023
this.searchValue='';
this.tagSkillsList();
// this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.currentSearchValue, this.filterConfig, false, false);
   }


// who:maneesh ,what:comment this for ewm-10533,when:03/03/2023
  //  public onsearchSkills(inputValue: string) {
  //   this.currentSearchValue = inputValue;
  //   this.loadingSearch = true;
  //   if (inputValue.length === 0) {
  //     this.searchskillList = [];
  //     this.loadingSearch = false;
  //   }
  //   if (inputValue.length > 0 && inputValue.length > 1) {
  //     this.searchValue = inputValue;
  //     this.loadingSearch = false;
  //     this.quickJobService.getAllSkillAndTag("?Search=" + inputValue).subscribe(
  //       (repsonsedata: any) => {        
  //         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //           this.searchskillList = repsonsedata.Data;
  //   if (repsonsedata.Data != null) {
  //       this.skillCount = repsonsedata.Data[0]?.SkillCount;
  //      }            
  //         } else {
  //           // this.loadingSearch = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //         }
  //       }, err => {
  //         // this.loadingSearch = false;
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //       })
  //   }
  // }
       /*
@Type: File, <ts>
@Name: onsearchSkills function
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: onsearchSkills for searchskillList  
*/
  public onsearchSkills(inputValue: string) {
    this.currentSearchValue = inputValue;
    this.loadingSearch = true;
    if (inputValue.length === 0) {
      this.tagSkillsList();
      this.loadingSearch = false;
      this.searchValue='';
    }
    if (inputValue.length > 0 && inputValue.length > 1) {
      this.searchValue = inputValue;
      this.loadingSearch = false;
      this.quickJobService.getAllSkillAndTag("?Search=" + inputValue +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.searchskillList = repsonsedata.Data;
            if (repsonsedata.Data != null) {
              this.skillCount = repsonsedata.Data[0]?.SkillCount;
            }
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  }
     /*
@Type: File, <ts>
@Name: tagSkillsList function
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: tagSkillsList for searchskillList  
*/
  public tagSkillsList() {
    this.loadingSearch = true;
    this.quickJobService.getAllSkillAndTagWithoutFilter('?FilterParams.ColumnName=Status&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
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
// who:maneesh ,what:comment this for ewm-10533,when:03/03/2023
 // public skillTag: any = [];
  // public selectedSkills(event: MatAutocompleteSelectedEvent): void {
  // //  console.log("values:",event.option.value);
  //   this.addSkillForm.patchValue({
  //     'SkillTag':event.option.value.Id
  //   })
  //   if (event.option.value.IsTag === 0) {
  //     if (this.skillSelectedList.some(el => el.SkillName == event.option.value.SkillName)) {

  //     } else {
  //       this.skillSelectedList.push({
  //         'Id': event.option.value.Id,
  //         'SkillName': event.option.value.SkillName,
  //         'Weightage': event.option.value.Weightage
  //       });
  //     }

  //   } else {
  //     // if (this.skillTag.some(el => el.TagName == event.option.value.TagName)) {

  //     // } else {
  //     //   this.skillTag.push({
  //     //     'Id': event.option.value.Id,
  //     //     'TagName': event.option.value.TagName,
  //     //   });
       
      
  //     //   this.getskillListByTagId(event.option.value.Id, event.option.value.TagName)
  //     // }
  //     this.skillTag.push({
  //       'Id': event.option.value.Id,
  //       'TagName': event.option.value.TagName,
  //     });
  //     this.getskillListByTagId(event.option.value.Id, event.option.value.TagName);
  //   }
  //   this.searchskillList = [];
  //   this.skillInput.nativeElement.value = '';


  //   // this.getSkillById(event.option.value.Id, event.option.viewValue);
  // }


     /*
@Type: File, <ts>
@Name: selectedSkills function
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: selectedSkills for skill  
*/
public selectedSkills(eventData): void {
let event = eventData[eventData.length - 1];
if (event?.IsTag === 0) {
  if (this.skillSelectedList.some(el => el.SkillName == event?.SkillName)) {
  }
  else {
    this.skillSelectedListId.push({
      'Id': event?.Id,
      'SkillName': event?.SkillName,
      'Weightage': event?.Weightage,

    });
  }
} else {
  this.skillSelectedListId = this.skillSelectedListId.filter(s => s?.Id != event?.Id);
  this.skillTag.push({
    'Id': event?.Id,
    'TagName': event?.TagName,
  });
  this.getskillListByTagId(event?.Id, event?.TagName);
}
}


// who:maneesh ,what:comment this for ewm-10533,when:03/03/2023
  // skillsListByTag: any = []
  // getskillListByTagId(id, tagName) {
  //   this.systemSettingService.fetchSkillsByTagId("?skilltagid=" + id).subscribe(
  //     (repsonsedata: any) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.skillsListByTag = repsonsedata.Data;
  //         let totalRecord = repsonsedata.TotalRecord;
  //         this.openPopupForSkillCountOfTag(totalRecord, this.skillsListByTag, tagName)

  //       } else {
  //         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //       }
  //     }, err => {
  //       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //     })

  // }

     /*
@Type: File, <ts>
@Name: getskillListByTagId function
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: getskillListByTagId for skill tag 
*/
  getskillListByTagId(id, tagName) {
    this.systemSettingService.fetchSkillsByTagId("?skilltagid=" + id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.skillsListByTag = repsonsedata.Data;
          let totalRecord = repsonsedata.TotalRecord;
          this.openPopupForSkillCountOfTag(totalRecord, this.skillsListByTag, tagName,)

        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

   /*
@Type: File, <ts>
@Name: userRoleList function
@Who: Renu
@When: 25-Nov-2020
@Why: ROST-405
@What: service call for get list for user role data
*/
// who:maneesh ,what:comment this for ewm-10533,when:03/03/2023

// openPopupForSkillCountOfTag(count, SkillDataByTag, tagName): void {
//   let countSkill: string = count;

//   const message = countSkill;
//   const title = 'label_skillLinked';
//   let lng = this.translateService.instant('label_tagName');
//   const subTitle = tagName + ' ' + lng + '.' + this.translateService.instant('label_skillDoYouWant');
//   const dialogData = new ConfirmDialogModel(title, subTitle, message);
//   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
//     maxWidth: "350px",
//     data: dialogData,
//     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
//     disableClose: true,
//   });
//   dialogRef.afterClosed().subscribe(dialogResult => {
//     if (dialogResult == true) {
//       for (let index = 0; index < SkillDataByTag.length; index++) {
//         const element = SkillDataByTag[index];
//       //  console.log("taglist:",element);
//         this.skillSelectedList.push(element);
//       }
//       //this.skillSelectedList.forEach(element => {
//       // this.skillIds.push(element.Id);
//       //  });

//     } else {
//       const index = this.skillTag.findIndex(x => x.TagName === tagName);
//       if (index !== -1) {
//         this.skillTag.splice(index, 1);
//       }
//     }

//   });
// }
   /*
@Type: File, <ts>
@Name: openPopupForSkillCountOfTag function
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: openPopupForSkillCountOfTag for skill tag count and popup
*/
// @When: 13-08-2024 @who:Amit @why: EWM-17869 @what: skill count & tag lable show
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
      this.addSkillForm.patchValue({
        SkillTag: this.skillSelectedListId
      });
  
    } else {
      const index = this.skillTag.findIndex(x => x.TagName === tagName);
      if (index !== -1) {
        this.skillTag.splice(index, 1);
      }
    }
  });
  }

  /*
@Type: File, <ts>
@Name: screenMediaQuiryForSkills function
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: for showing data according to screen size
*/

screenMediaQuiryForSkills() {
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
/*
@Who: maneesh
@When: 03-03-2023
@Why: ewm-10553
@What: to compare objects selected patch value
*/
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1['Id'] === c2['Id'] : c1 === c2;
  }
}
