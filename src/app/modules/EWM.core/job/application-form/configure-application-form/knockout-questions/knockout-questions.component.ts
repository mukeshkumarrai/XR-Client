import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AddKnockoutQuestionsComponent } from './add-knockout-questions/add-knockout-questions.component';
import { ActivatedRoute } from '@angular/router';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-knockout-questions',
  templateUrl: './knockout-questions.component.html',
  styleUrls: ['./knockout-questions.component.scss']
})
export class KnockoutQuestionsComponent implements OnInit {
  @Input() IsKnockoutQuestion = ''; // decorate the property with @Input()
   knockoutQuestionList=[];
   knockoutQuestionData=[];
  ApplicationFormId: number;
  loading: boolean = false;
  knockoutQuestionListDelete: [];
  dirctionalLang;
  public pageLabels="knockout";
  @Input() isKnockOutEnable:number;
  @Output() isKnockOutEnableFlag= new EventEmitter();
  isActionButtonDisabledFromSeekPreview:boolean = false;
  constructor(public dialog: MatDialog,private routes: ActivatedRoute,private _commonService: CommonserviceService,
    private _jobService: JobService,private snackBService: SnackBarService,private translateService: TranslateService) { }
  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
       this.ApplicationFormId= parseInt(parms?.Id)
         this.getKnockoutQuestionByApplicationId(parseInt(parms?.Id))
      }
       // <!---------@When: 13-Jan-2023 @who:Adarsh singh @why: EWM-9587 --------->
       if (parms?.isPreviewMode) {
        this.isActionButtonDisabledFromSeekPreview= parms['isPreviewMode']
       }
      //  End 
    });
    /*EWM-8629,Who-Nitin Bhati, When-09th Sep22, api calling two times due to this--*/
    // this._commonService.knockoutQuestionFormSaveStatus.subscribe((res:any)=>{
    //   if(res){
    //     this.getKnockoutQuestionByApplicationId(this.ApplicationFormId);
    //   }
    // });
    this._jobService.isKnockoutEnable.subscribe(res=>{
     this.isKnockOutEnable = res;
    })
  }

  
/* 
  @Type: File, <ts>
  @Name: drop function
  @Who: Nitin Bhati
  @When: 18-may-2022
  @Why: EWM-6678
  @What: For drop and drag values
 */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.knockoutQuestionList, event.previousIndex, event.currentIndex);
    this._commonService.knockoutQuestionForm.next(this.knockoutQuestionList);  
  }
/* 
  @Type: File, <ts>
  @Name: openQuickAddKnockOutModal function
  @Who: Nitin Bhati
  @When: 18-may-2022
  @Why: EWM-6678
  @What: For open add knockout question form
 */
  openQuickAddKnockOutModal(type,data) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(AddKnockoutQuestionsComponent, {
      data: new Object({ editId: type,ApplicationFormId: this.ApplicationFormId,knockoutQuestionList: this.knockoutQuestionList,dataByEdit:data }),
      panelClass: ['xeople-modal', 'add_knockoutQuestion','animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
    dialogRef.afterClosed().subscribe(res => {
      if(res == false){
      //  this.getKnockoutQuestionByApplicationId(this.ApplicationFormId);
      }else {
        if(res.status=='Edit'){
            let updateItem = this.knockoutQuestionList.find(this.findIndexToUpdate, data.Question);
            let index = this.knockoutQuestionList.indexOf(updateItem);
            this.knockoutQuestionList[index] = res.data;
          //this.knockoutQuestionList.find(item=>item.Question==res.data.Question).Question=res.data.Question;         
        }else{
          this.knockoutQuestionList.push({
            //ApplicatinFormId: this.ApplicationFormId,
            Question: res.data.Question,
            Answer: res.data.Answer
          });  
        }      
      this._commonService.knockoutQuestionForm.next(this.knockoutQuestionList);  
       }       
    })
  }
/* 
  @Type: File, <ts>
  @Name: findIndexToUpdate function
  @Who: Nitin Bhati
  @When: 26-may-2022
  @Why: EWM-6678
  @What: return index value
 */
  findIndexToUpdate(newItem) { 
    return newItem.Question === this;
}
/*
@Type: File, <ts>
@Name: getKnockoutQuestionByApplicationId function
@Who: Nitin Bhati
@When: 18-may-2022
@Why: EWM-6678
@What: get data
*/
getKnockoutQuestionByApplicationId(ApplicationFormId: any) {
  this.loading = true;
  this._jobService.getKnockoutQuestionAll('?applicationId='+ApplicationFormId).subscribe(
    (data: any) => {
      this.loading = false;
      if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
        if(data?.Data!=undefined && data?.Data!=null && data?.Data!=''){
          this.knockoutQuestionList=data?.Data;  
          /*EWM-8629,Who-Nitin Bhati, When-09th Sep22, For enable save and preview save button--*/
          this._commonService.knockoutQuestionForm.next(this.knockoutQuestionList);    
        }      
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}
  /*
      @Type: File, <ts>
      @Name: deleteKnockoutquestion function
      @Who: Nitin Bhati
      @When: 10-Dec-2021
      @Why: EWM-4140
      @What: FOR DIALOG BOX confirmation for delete
    */
      deleteKnockoutquestion(val, name,Id): void {
        const message = `label_titleDialogContent`;
        const title = '';
        const subTitle = '';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
            this.knockoutQuestionList.forEach((element,index)=>{
              if(element.Question==name) val.splice(index,1);
           });
          this._commonService.knockoutQuestionForm.next(this.knockoutQuestionList);  
          }
        });
      }
/*
  @Type: File, <ts>
  @Name: activestate function
  @Who: Satya Prakash
  @When: 02-Aug-2022
  @Why: EWM-6553 EWM-6709
  @What: disable all action button
  */
  activestate(){
    return !this.IsKnockoutQuestion;
  }

  setDefaultKnockout(e) {
    if (e.checked === false) {
      this.isKnockOutEnable = 0;
    } else {
      this.isKnockOutEnable = 1;
    }
    this.isKnockOutEnableFlag.emit(this.isKnockOutEnable);
  }
}
