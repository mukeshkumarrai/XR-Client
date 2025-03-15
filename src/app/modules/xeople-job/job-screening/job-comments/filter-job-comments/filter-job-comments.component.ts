/*
  @Type: File, <ts>
  @Name: Filter-job-comments.component.ts
  @Who: Nitin Bhati
  @When: 15-June-2023
  @Why: EWM-12640
  @What: popup component for job comments filter
  */
import { Component,Inject,OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData} from 'src/app/shared/models';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
@Component({
  selector: 'app-filter-job-comments',
  templateUrl: './filter-job-comments.component.html',
  styleUrls: ['./filter-job-comments.component.scss']
})
export class FilterJobCommentsComponent implements OnInit {
  addForm: FormGroup;
  public ActiveMenu: string;
  public active = false;
  public loading: boolean;
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public result: string = '';
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  next: number = 0;
  isStarActive: any = [];
  selectedList: any = [];
  selectedCandidateList: any = [];
  public gridListData: any[];
  public pagesize;
  public pageSizeOptions;
  public pagneNo = 1;
  public positionMatDrawer: string = 'end';
  public candidateId: any;
  public saveStatus = true;
  public gridListCandidateData: any[];
  public matDrawerBgClass;
  filteredCandidateId: any;
  filteredRecruiterId:any
  /*
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 15th-06-2023
    @Why: EWM-12640
    @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<FilterJobCommentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService,
    private jobService: JobService) {
    this.pageSize = this.appSettingsService.pagesize;
    this.gridListCandidateData = data?.candidate;
    this.filteredCandidateId = data?.filteredCandidateId;
    this.filteredRecruiterId = data?.filteredRecruiterId;

if(!this.filteredCandidateId.length){
    this.gridListCandidateData.forEach(element => {
      element['IsSelected'] = 0;
    });
  }

  if(this.filteredCandidateId.length>0 || this.filteredRecruiterId.length>0){
    this.saveStatus=false;
  }
    this.addForm = this.fb.group({
      Id: [''],
      status: [''],
    });
  }
  ngOnInit(): void {
   this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });
    this.getCommentsList();
  }

  /*
  @Type: File, <ts>
  @Name: getCommentsList function
  @Who: Nitin Bhati
  @When: 15-June-2023
  @Why: EWM-12640
  @What: getting Comments list data
*/
  getCommentsList() {
    this.loading = true;
    this.jobService.getJobActionRecuirters().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridListData = repsonsedata.Data;
            if(this.filteredRecruiterId.length>0){
              this.gridListData.forEach(element => {
                
                let selectedRecruiter=this.filteredRecruiterId.findIndex((recId => recId == element.Id));
                if (selectedRecruiter != -1) {
                  element['IsSelected'] = 1;
            
                }
              });
            }else{
              this.gridListData.forEach(element => {
                element['IsSelected'] = 0;
              });
            }
           
          }
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
   @Name: clickevent function
   @Who: Nitin Bhati
   @When: 29th-Sep-2021
   @Why: EWM-2980
   @What: call Get data.
  */
  clickevent(id, selected) {
    if (selected == 0) {
      this.isStarActive = 1;
    } else {
      this.isStarActive = 0;
    }
    let selectedArray = this.gridListData.filter(x => x['Id'] == id);
    selectedArray.forEach(element => {
      element['IsSelected'] = this.isStarActive;
    });
    var item = this.gridListData.filter(x => x['IsSelected'] === 1);
    var itemRec=this.gridListCandidateData.filter(x => x['IsSelected'] === 1);
    if (item.length === 0 && itemRec.length===0) {
      this.saveStatus = true;
    } else {
      this.saveStatus = false;
    }
  }
  /*
   @Type: File, <ts>
   @Name: clickevent function
   @Who: Nitin Bhati
   @When: 29th-Sep-2021
   @Why: EWM-2980
   @What: call Get data.
  */
  clickeCandidatevent(id, selected) {
    if (selected == 0) {
      this.isStarActive = 1;
    } else {
      this.isStarActive = 0;
    }
    let selectedArray = this.gridListCandidateData.filter(x => x['CandidateId'] == id);
    selectedArray.forEach(element => {
      element['IsSelected'] = this.isStarActive;
    });
    var item = this.gridListCandidateData.filter(x => x['IsSelected'] === 1);
    var itemCand = this.gridListData.filter(x => x['IsSelected'] === 1);

    if (item.length === 0 && itemCand.length===0) {
      this.saveStatus = true;
    } else {
      this.saveStatus = false;
    }
  }
  /* 
     @Type: File, <ts>
     @Name: onSave function
     @Who: Nitin Bhati
     @When: 29th-Sep-2021
     @Why: EWM-2980
     @What: For saving candidate job mapping data
    */
  onSave(value) {
    this.loading = true;
    let updateObj = [];
    this.selectedList = [];
    this.selectedList = this.gridListData?.filter(x => x['IsSelected'] == '1');
    this.selectedList?.forEach(element => {
      updateObj.push(element.Id);
    });

    let updateCandidateObj = [];
    this.selectedCandidateList = [];
    this.selectedCandidateList = this.gridListCandidateData?.filter(x => x['IsSelected'] == '1');
    this.selectedCandidateList?.forEach(element => {
      updateCandidateObj.push(element.CandidateId);
    });
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ 'recuiter': updateObj,'cand': updateCandidateObj, 'result': true }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    } if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  openDrawerWithBg(value, id) {
    this.matDrawerBgClass = value;
    this.candidateId = id;
    }

  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }
/* 
     @Type: File, <ts>
     @Name: onDismiss function
     @Who: Nitin Bhati
     @When: 15th-06-2021
     @Why: EWM-12640
     @What: For dismiss
    */
  onDismiss() {
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'result': false}); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }


}
