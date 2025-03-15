/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job-automation.component.ts
  @Who: Nitin Bhati
  @When: 11-June-2024
  @Why: EWM-17075
  @What: Job Automation
 */
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from '@app/shared/models/responce.model';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { jobAction, ToArray, FromArray,JobActionUpdateToggle,JobActionFromToggleArray,JobActionToToggleArray,JobActionUpdateName,JobActionFromNameArray,JobActionToNameArray,UpdateSequenceModel, FromEntityOrToEntity} from 'src/app/shared/models/job-automation.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormBuilder} from '@angular/forms';
import { ButtonTypes } from 'src/app/shared/models';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';

@Component({
  selector: 'app-job-automation',
  templateUrl: './job-automation.component.html',
  styleUrls: ['./job-automation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JobAutomationComponent implements OnInit {
  public pageLabel : any = "label_jobAutomation";
  animationVar: any;
  loading: boolean;
  gridView: any;
  oldPatchValues: any;
  ToDisplaySequenceList: any=[];
  searchSubject$ = new Subject<any>();
  editData: any;
  indexId: number;
  public auditParameter: string;
  editCustomiseName: any;
  isMaxlength: number;
  isDuplicates: number;
  loadingGet: boolean;
  loadingSearch: boolean;
  public  emptyValue:boolean=false;
  public value:string;
  constructor(private fb: FormBuilder,private _jobService:JobService,private translateService: TranslateService, public _sidebarService: SidebarService, private snackBService: SnackBarService){}
  ngOnInit(): void {
    this.animationVar = ButtonTypes;
    this.auditParameter = encodeURIComponent('Job Automation');
    this.getJobActiontenantConfiguration();
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
       this.updateJobActionCustomiseName(val);
     });
     // @When: 20-06-2024 @who:Amit @why: EWM-17332 @what: global search show
     this._sidebarService.searchEnable.next('1');
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.gridView, event?.previousIndex, event?.currentIndex);
    this.gridView?.forEach((element,index) => {
      this.ToDisplaySequenceList?.push({
        'Id': element?.Id,
        'TabName': element?.TabName,
        'DisplaySequence': index+1
      })
    });
    let JobActionSequenceFromArray:FromEntityOrToEntity=this.gridView;
    let JobActionSequenceToArray:FromEntityOrToEntity=this.ToDisplaySequenceList;
    this.updateJobActionDisplaySequence(JobActionSequenceFromArray,JobActionSequenceToArray)
  }

  refreshComponent(){
    this.isMaxlength=0;
    this.isDuplicates=0;
    this.indexId=0;
    this.getJobActiontenantConfiguration();
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage?.getItem('animation');
    if(Number(amin) !=0){
      document?.getElementById(matIconId)?.classList?.add(animationName);
    }
  }

  mouseleaveAnimation(matIconId, animationName) {
    document?.getElementById(matIconId)?.classList?.remove(animationName)
  }

  getJobActiontenantConfiguration() {
    this.loadingGet = true;
    this._jobService.getJobActiontenantConfiguration().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingGet = false;
          let selectedArray=[];
          selectedArray = repsonsedata.Data;
          selectedArray.forEach(element => {
              element['IsSelected'] = 1;
            });
            this.gridView=[...selectedArray];
            }else if(repsonsedata.HttpStatusCode === 204){
          this.loadingGet = false;
          this.gridView = repsonsedata.Data;
        }
         else {
           this.loadingGet = false;
        }
      }, err => {
        this.loadingGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  updateJobActionToggle(event,data,i){
    if(event?.checked){
     this.gridView.forEach(element => {
       if(element?.Id===data?.Id){
         element['IsTabShow'] = 1;
       }
     });
    }else{
     this.gridView[i]['IsTabShow']=0;
    }
      let JobActionToggleFromArray:JobActionFromToggleArray={
      Id:data?.Id,
      TabName:data?.TabName,
      TabDisplayName:data?.TabDisplayName,
      IsTabShow:event?.checked===true?0:1,
      ChangeKey:'Show'
    };
    let JobActionToggleToArray:JobActionToToggleArray={
      Id:data?.Id,
      TabName:data?.TabName,
      TabDisplayName:data?.TabDisplayName,
      IsTabShow:event?.checked===true?1:0,
      ChangeKey:'Show'
    };
    this.updateJobActionNameandDisplay(JobActionToggleFromArray,JobActionToggleToArray);
  }
  updateJobActionNameandDisplay(updateAutoObjFrom,updateAutoObjTo) {
    this.loading = true;
    let updateObj = [];
    updateObj = [{
      "From": updateAutoObjFrom,
      "To": updateAutoObjTo
    }];
    this._jobService.updateJobActionNameandDisplay(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
       });
  }

  updateStageTypeMapping(data,Id,TabName,i,j,TabStatus,dataToggle){
      if(TabStatus=='1' && TabName !='Notes'){
        let ObjTo = {};
        ObjTo['StageTypeInternalCode'] = data?.StageTypeInternalCode;
        ObjTo['StageTypeName'] = data?.StageTypeName;
        ObjTo['IsSelected'] = data?.IsSelected===1?0:1;
        if(this.gridView[i]['Id'] === Id){
          this.gridView[i]['StageType'][j]=ObjTo;
         }  
         const index = dataToggle?.StageType.findIndex(x => x?.IsSelected == '1');
         if(index===-1){
          this.gridView.forEach(element => {
            if(element?.Id===Id){
              element['IsTabShow'] = 0;
            }
            let IsTabShow=false;
            this.updateJobActionToggleStage(IsTabShow,dataToggle,i)
          });
         }else{
          this.gridView[i]['IsTabShow']=1;
          let IsTabShow=true;
            this.updateJobActionToggleStage(IsTabShow,dataToggle,i)
         }
         let FromArr:FromArray={
          Id:Id,
          TabName:TabName,
          StageTypeInternalCode:data?.StageTypeInternalCode,
          StageTypeName:data?.StageTypeName,
          IsSelected:data?.IsSelected,
        };
         let ToArray:ToArray={
          Id: Id,
          TabName: TabName,
          StageTypeInternalCode: data?.StageTypeInternalCode,
          StageTypeName: data?.StageTypeName,
          IsSelected: data?.IsSelected===1?0:1,
        };
        this.updateJobActionStageTypeMapping(FromArr,ToArray);
      }
  }
  updateJobActionStageTypeMapping(updateAutoObjFrom,updateAutoObjTo) {
    this.loading = true;
    let updateObj = [];   
    updateObj = [{
      From: updateAutoObjFrom,
      To: updateAutoObjTo
    }];
    this._jobService.updateJobActionStageTypeMapping(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
       });
  }

  updateJobActionDisplaySequence(updateAutoObjFrom,updateAutoObjTo) {
    this.loading = true;
    let updateObj = [];   
    updateObj = [{
      From: updateAutoObjFrom,
      To: updateAutoObjTo
    }];
    this._jobService.updateJobActionDisplaySequence(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
       });
  }

  onEditCustomiseName(value,data,i) {
    // if (value?.length > 0 && value?.length < 2) {
    //   return;
    // }
    this.value=value?.trim().split(/[^a-zA-Z0-9 ]/).join('');//maneesh ewm-17636 when:18/07/2024
    if (this.value?.length == 0) {//maneesh ewm-17636 when:18/07/2024
      this.emptyValue=true;
      this.isDuplicates = 0;
      this.isMaxlength = 0;
      this.indexId=i;

    }else{
      this.emptyValue=false;
      this.indexId=i;

    }
    this.editCustomiseName=value?.trim().split(/[^a-zA-Z0-9 ]/).join('');
       const index = this.gridView?.findIndex(x => x?.TabDisplayName?.toLowerCase()?.trim() == this.editCustomiseName?.toLowerCase()?.trim() && x?.Id !=data?.Id );
    if (index>= 0) {
      let SelectedList = this.gridView?.filter(x => x['Id'] === data?.Id);
      if(data?.Id===SelectedList[0].Id){
        this.isDuplicates = 1;
        this.isMaxlength = 0;//by maneesh ewm-17635 and ewm-17636;
        this.indexId=i;
       }else{
        this.isDuplicates = 0;
        this.isMaxlength = 0;
        this.indexId=i;
      }
    }
    else {
        if(this.editCustomiseName?.length>20){
          this.isMaxlength = 1;
          this.isDuplicates = 0;//by maneesh ewm-17635 and ewm-17636;
          this.indexId=i;
         }else{
          this.isDuplicates = 0;
          this.isMaxlength = 0;
          this.indexId=i;
         }
      }
   
  }
  OnEditClick(data,i){
    this.indexId=0;
    this.isDuplicates = 0;
    this.isMaxlength = 0;
    this.editData=data;
    if(this.editCustomiseName!= undefined && this.editCustomiseName != null && this.editCustomiseName != ''){
      const index = this.gridView?.findIndex(x => x?.TabDisplayName?.toLowerCase()?.trim() == this.editCustomiseName?.toLowerCase()?.trim());
      if(index===-1){
       this.gridView[i]['IsSelected']=1;
       this.gridView[i]['TabDisplayName']=this.editCustomiseName;
       this.updateJobActionCustomiseName(this.editCustomiseName);
      }else{
       this.gridView[i]['IsSelected']=1;
       this.gridView[i]['TabDisplayName']=data?.TabDisplayName;
      }
    } else{
      this.gridView[i]['IsSelected']=1;
       this.gridView[i]['TabDisplayName']=data?.TabDisplayName;
    }
  }
  updateJobActionCustomiseName(inlineCustomiseValue){
    let JobActionToggleFromArray:JobActionFromToggleArray={
    Id:this.editData?.Id,
    TabName:this.editData?.TabName,
    TabDisplayName:this.editData?.TabDisplayName,
    IsTabShow:this.editData?.IsTabShow,
    ChangeKey:'Name'
  };
  let JobActionToggleToArray:JobActionToToggleArray={
    Id:this.editData?.Id,
    TabName:this.editData?.TabName,
    TabDisplayName:inlineCustomiseValue,
    IsTabShow:this.editData?.IsTabShow,
    ChangeKey:'Name'
  };
  this.updateJobActionNameandDisplay(JobActionToggleFromArray,JobActionToggleToArray);
}

viewTabDispalyName(data,Id,i){
  this.indexId=i;
    if (data?.TabName!='') { //by maneesh ewm-17336 17/07/2024
    this.isMaxlength=0;
    this.isDuplicates=0;
    this.emptyValue=false;
  }
  this.indexId=i;
  // this.editCustomiseName=data;//by maneesh ewm-17336 17/07/2024
  this.gridView.forEach(element => {
    if(element?.Id===Id){
      element['IsSelected'] = 0;
    }else{
      element['IsSelected'] = 1;
    }
  });
 }

 // @When: 20-06-2024 @who:Amit @why: EWM-17332 @what: search enable destroy
 ngOnDestroy(): void {
  this._sidebarService.searchEnable.next('1');
}

updateJobActionToggleStage(event,data,i){
  if(event){
   this.gridView.forEach(element => {
     if(element?.Id===data?.Id){
       element['IsTabShow'] = 1;
     }
   });
  }else{
   this.gridView[i]['IsTabShow']=0;
  }
    let JobActionToggleFromArray:JobActionFromToggleArray={
    Id:data?.Id,
    TabName:data?.TabName,
    TabDisplayName:data?.TabDisplayName,
    IsTabShow:event===true?0:1,
    ChangeKey:'Show'
  };
  let JobActionToggleToArray:JobActionToToggleArray={
    Id:data?.Id,
    TabName:data?.TabName,
    TabDisplayName:data?.TabDisplayName,
    IsTabShow:event===true?1:0,
    ChangeKey:'Show'
  };
  this.updateJobActionNameandDisplay(JobActionToggleFromArray,JobActionToggleToArray);
}

}
