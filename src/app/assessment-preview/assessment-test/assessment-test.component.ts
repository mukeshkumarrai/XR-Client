import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ButtonTypes } from 'src/app/shared/models';

import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';

SwiperCore.use([Pagination, Navigation]);
@Component({
  selector: 'app-assessment-test',
  templateUrl: './assessment-test.component.html',
  styleUrls: ['./assessment-test.component.scss']
})
export class AssessmentTestComponent implements OnInit {

  display: any;
  public loading: boolean;
  public assessmentId: number;
  quesBasedAssement: []=[];
  sectionBasedAssement: []=[];
  @Input() guideLines:any;
  @Input() assessmentList:any;
  @Input() currentSection:any;
  @Input() assmentPreviwArr:any;
  curSectionTotalQues: any;
  currentQuesNo=1;
  currentQues: any;
  selectedOptionId: any;
  public successMsg:boolean=false;
  @Output() sectionCompltion= new EventEmitter<any>();
  className: string;
  selected: number;
  stateOfOptions: boolean[]=[false];
  quesViewStatus={};
  assessmentForm: FormGroup;
  public textValue: string;
  animationVar: any;
  public fileAttachments:any=[]
  public displayNo:any;
  fileAttachmentsOnlyTow: any[];
  fileType: any;
  fileSizetoShow: any;
  fileSize: number;
  UploadFileName: any = ""
  activestatus: string = 'Add';
  fileInfo= {};
  fileViewstatus: boolean = true;  
  filestatus: boolean = false;
  maxUploadFile:any;
  constructor(private userAdministrationService:UserAdministrationService,private routes: ActivatedRoute,private snackBService: SnackBarService,
    private translateService: TranslateService, public _dialog: MatDialog, route: Router,private fb: FormBuilder,public dialog: MatDialog,
    public _appSetting: AppSettingsService, private commonService: CommonserviceService) {
    this.assessmentForm=this.fb.group({
      CountryId: [''],
    })
    this.fileType = _appSetting.file_img_type_extralarge;
       this.fileSizetoShow = _appSetting.file_file_size_extralarge;
       if (this.fileSizetoShow?.includes('KB')) {
         let str = this.fileSizetoShow.replace('KB', '')
         this.fileSize = Number(str) * 1000;
       }
       else if (this.fileSizetoShow?.includes('MB')) {
         let str = this.fileSizetoShow.replace('MB', '')
         this.fileSize = Number(str) * 1000000;
       }
   }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.assessmentId = parseInt(parms?.Id);
        this.timer(this.assessmentList?.Duration);
        this.questionSectionType();
        
      }
    });
    this.animationVar = ButtonTypes;
    
  }

 /*
@Type: File, <ts>
@Name: submitTest function
@Who: Renu
@When: 10-06-2022
@Why: EWM-6656 EWM-7013
@What: when user submit the test
*/
  
  submitTest(){
    if(this.assessmentList?.PatternId==1){
      this.successMsg=true;
    }else{
      let obj={
        'sectionId':this.currentSection?.sectionId,
        'quesArr':this.quesViewStatus
      };
      this.sectionCompltion.emit(obj);
    }
  this.commonService.assessmentTotalQuestionsCount.next(this.quesViewStatus);

  }

  
  /*
@Type: File, <ts>
@Name: questionSectionType function
@Who: Renu
@When: 10-06-2022
@Why: EWM-6656 EWM-7013
@What: question/section type api
*/

questionSectionType(){
  this.loading = true;
this.userAdministrationService.getStep2InfoById('?id=' + this.assessmentId).subscribe(
  (data: ResponceData) => {
    this.loading = false;
    if (data.HttpStatusCode === 200) {
        this.quesBasedAssement=data.Data?.Questions;
        this.sectionBasedAssement=data.Data?.Sections;
        if(this.assessmentList?.PatternId==2)
        {
          this.curSectionTotalQues=this.sectionBasedAssement.filter(x=>x['Id']===this.currentSection.sectionId)[0];
          this.currentQues=this.curSectionTotalQues?.Questions.filter(y=>y['DisplaySeq']==1)[0];          
          this.currentQuesNo=this.currentQues?.Id;
          this.curSectionTotalQues.Questions.forEach(element => {
          
            if( this.currentQuesNo===element.Id)
            {
              this.quesViewStatus[element.Id]=0;
            }else{
              this.quesViewStatus[element.Id]=3;
            }
          });
        }else{
          this.curSectionTotalQues=this.quesBasedAssement;
          this.currentQues=this.curSectionTotalQues.filter(y=>y['DisplaySeq']==1)[0];
          this.currentQuesNo=this.currentQues?.Id;
         // console.log(" this.curSectionTotalQues", this.curSectionTotalQues)
          this.curSectionTotalQues.forEach(element => {
          
            if( this.currentQuesNo===element.Id)
            {
              this.quesViewStatus[element.Id]=0;
            }else{
              this.quesViewStatus[element.Id]=3;
            }
          });
        }
     }
    else {
      this.loading = false;
     // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
    }
  },
  err => {
    this.loading = false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  })
}
 /*
@Type: File, <ts>
@Name: select function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: selected option saved
*/
select(item,ques,value) {
  this.selected = (this.selected === item ? null : item); 
  Object.keys(this.quesViewStatus).forEach(key => {
    if(value!=''){
      if(Number(key)===ques.Id){
        this.quesViewStatus[ques.Id] = 2;
      }
    }else{
      if(Number(key)===ques.Id){
        this.quesViewStatus[ques.Id] = 1;
      }
    }
  }); 
};

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
@Name: isActive function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: isActive
*/

isActive(item) {
  return this.selected === item;
};
/*
@Type: File, <ts>
@Name: changeState function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: for multiple select
*/
changeState(index,ques,value) {
  this.stateOfOptions[index] = !this.stateOfOptions[index];
  Object.keys(this.quesViewStatus).forEach(key => {
    if(value==true){
    if(Number(key)===ques.Id){
      this.quesViewStatus[ques.Id] = 1;
    }
  }else{
    if(Number(key)===ques.Id){
      this.quesViewStatus[ques.Id] = 2;
    }
  }
  });
}
/*
@Type: File, <ts>
@Name: selectSingle function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: for single select
*/
selectSingle(item,ques,value){
  this.selected = (this.selected === item ? null : item); 
  Object.keys(this.quesViewStatus).forEach(key => {
    if(value==false){
      if(Number(key)===ques.Id){
        this.quesViewStatus[ques.Id] = 2;
      }
    }else{
      if(Number(key)===ques.Id){
        this.quesViewStatus[ques.Id] = 1;
      }
    }
  }); 
}

/*
@Type: File, <ts>
@Name: isActiveQues function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: active Ques
*/

isActiveQues(item) {
  let option=item.Options.filter(x=>x['Id']==this.selected)[0];
  if(option){
    return true;
  }else{
    return false;
  }
};
/*
@Type: File, <ts>
@Name: currentActiveQues function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: current active Ques
*/
currentActiveQues(ques:any,quesView:any){
  let prevoiuselectedQues:number=this.currentQuesNo; 
  this.currentQuesNo=(this.currentQuesNo === ques.Id ? null : ques.Id); 
  // console.log("this.ac",this.quesViewStatus);
  // console.log("ques",ques.Id);
  // console.log("prevoiuselectedQues",prevoiuselectedQues);
  // console.log("quesView",quesView)
  //this.quesViewStatus[ques.Id]=0;
  if(this.assessmentList?.PatternId==2)
  {
    if(this.quesViewStatus[prevoiuselectedQues]!==2){
      Object.keys(this.quesViewStatus)?.forEach(key => {
        //console.log("key",key);
        if(Number(key)===ques.Id){
          this.quesViewStatus[prevoiuselectedQues] = 1;
        }
          
      });
    }
    //console.log("this.ac",this.quesViewStatus);
    this.currentQues=this.curSectionTotalQues.Questions?.filter(y=>y['Id']==ques.Id)[0];
   this.stateOfOptions = Array(this.currentQues?.Options.length)?.fill(false);

  }else{
    if(this.quesViewStatus[prevoiuselectedQues]!==2){
      Object.keys(this.quesViewStatus)?.forEach(key => {
        //console.log("key",key);
        if(Number(key)===ques.Id){
          this.quesViewStatus[prevoiuselectedQues] = 1;
        }    
      });
    }
    this.currentQues=this.curSectionTotalQues?.filter(y=>y['Id']==ques?.Id)[0];
    this.stateOfOptions = Array(this.currentQues?.Options?.length)?.fill(false);
  }
}


nextQues(){
  let Index = this.curSectionTotalQues?.findIndex(x=>x?.Id==this.currentQues?.Id);
 if(this.quesViewStatus[this.curSectionTotalQues[Index]?.Id]!==2){
    Object.keys(this.quesViewStatus)?.forEach(key => {
      if(Number(key)===this.curSectionTotalQues[Index]?.Id){
        this.quesViewStatus[this.curSectionTotalQues[Index]?.Id] = 1;
      }    
    });
  }
    this.currentQuesNo=(this.currentQuesNo === this.curSectionTotalQues[Index+1]?.Id ? null : this.curSectionTotalQues[Index+1]?.Id); 
  this.currentQues=this.curSectionTotalQues?.filter(y=>y['Id']==this.curSectionTotalQues[Index+1]?.Id)[0];
 this.displayNo =  this.currentQues.DisplaySeq;
}

nextSectionQues(){
  let Index = this.curSectionTotalQues?.Questions?.findIndex(x=>x?.Id==this.currentQues?.Id);
 if(this.quesViewStatus[this.curSectionTotalQues?.Questions[Index]?.Id]!==2){
    Object.keys(this.quesViewStatus)?.forEach(key => {
      if(Number(key)===this.curSectionTotalQues?.Questions[Index]?.Id){
        this.quesViewStatus[this.curSectionTotalQues?.Questions[Index]?.Id] = 1;
      }    
    });
  }
    this.currentQuesNo=(this.currentQuesNo === this.curSectionTotalQues?.Questions[Index+1]?.Id ? null : this.curSectionTotalQues?.Questions[Index+1]?.Id); 
  this.currentQues=this.curSectionTotalQues?.Questions?.filter(y=>y['Id']==this.curSectionTotalQues?.Questions[Index+1]?.Id)[0];
   this.displayNo =  this.currentQues?.DisplaySeq;
}

previousQues(){
  let Index = this.curSectionTotalQues?.findIndex(x=>x.Id==this.currentQues?.Id);
  if(this.quesViewStatus[this.curSectionTotalQues[Index-1]?.Id]!==2){
    Object.keys(this.quesViewStatus)?.forEach(key => {
      if(Number(key)===this.curSectionTotalQues[Index-1]?.Id){
        this.quesViewStatus[this.curSectionTotalQues[Index-1]?.Id] = 1;
      }    
    });
  }
  this.currentQuesNo=(this.currentQuesNo === this.curSectionTotalQues[Index-1]?.Id ? null : this.curSectionTotalQues[Index-1]?.Id); 
  this.currentQues=this.curSectionTotalQues?.filter(y=>y['Id']==this.curSectionTotalQues[Index-1]?.Id)[0];
  this.displayNo =  this.currentQues.DisplaySeq;
}

previousSectionQues(){
  let Index = this.curSectionTotalQues?.Questions?.findIndex(x=>x.Id==this.currentQues?.Id);
  if(this.quesViewStatus[this.curSectionTotalQues?.Questions[Index-1]?.Id]!==2){
    Object.keys(this.quesViewStatus)?.forEach(key => {
      if(Number(key)===this.curSectionTotalQues?.Questions[Index-1]?.Id){
        this.quesViewStatus[this.curSectionTotalQues?.Questions[Index-1]?.Id] = 1;
      }    
    });
  }
  this.currentQuesNo=(this.currentQuesNo === this.curSectionTotalQues?.Questions[Index-1]?.Id ? null : this.curSectionTotalQues?.Questions[Index-1]?.Id); 
  this.currentQues=this.curSectionTotalQues?.Questions?.filter(y=>y['Id']==this.curSectionTotalQues?.Questions[Index-1]?.Id)[0];
  this.displayNo =  this.currentQues.DisplaySeq;
}
/*
@Type: File, <ts>
@Name: timer function
@Who: Renu
@When: 13-06-2022
@Why: EWM-6656 EWM-7013
@What: asseement test timer
*/
  timer(minute) {
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";
    
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        clearInterval(timer);
        this.submitTest();
      }
    }, 1000);
  }


   /*
  @Type: File, <ts>
  @Name: onSwiper function
  @Who: Suika
  @When: 11-jan-2023
  @Why: ROST-10122
  @What: For getting the deafult config for the user
   */
  onSwiper(swiper) {
    // console.log(swiper);
  }

/**
    @(C): Entire Software
    @Type: Function
    @Who:   Suika
    @When: 13-Jan-2022
    @Why:  Open for modal window
    @What: This function responsible to open and close the modal window.
    @Return: None
    @Params :
    1. param -button name so we can check it come from which link.
   */
  openDialog(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this._dialog.open(ModalComponent, {
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated','animate__zoomIn']
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
/*
   @Type: File, <ts>
   @Name: openMultipleAttachmentModal function
   @Who: maneesh
   @When: 12-may-2023
   @Why: EWM-9383
   @What: For Open Model For Multiple Attachment
 */
   openMultipleAttachmentModal() {
     const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
      maxWidth: "600px",
      data: new Object({ fileType:this.fileType, fileSize: this.fileSize , fileSizetoShow:this.fileSizetoShow, 
      fileAttachments: this.fileAttachments,isAssessment:true}),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['customAttachment', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isFile == true) {    
        this.fileAttachments=[];
         this.fileAttachments= res.fileAttachments;
      if(this.fileAttachments.length>2){
        this.fileAttachmentsOnlyTow=  this.fileAttachments.slice(0, 2)
      }else{
        this.fileAttachmentsOnlyTow=  this.fileAttachments
      }
  
      }
    })
  }
  /*
   @Type: File, <ts>
   @Name: confirmAttachment function
   @Who: maneesh
   @When: 12-may-2023
   @Why: EWM-9383
   @What: For Open Model For Multiple Attachment
 */
  confirmAttachment(fileInfo:any): void {
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'label_attachment';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
    this.removeAttachment(fileInfo);
      
    });
  }
  /*
   @Type: File, <ts>
   @Name: removeAttachment function
   @Who: maneesh
   @When: 12-may-2023
   @Why: EWM-9383
   @What: For Open Model For Multiple Attachment
 */
  removeAttachment(fileInfo: any) {
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
      this.fileAttachments.splice(index, 1);
    }
  
    if (this.fileAttachments.length > 2) {
      this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
    } else {
      this.fileAttachmentsOnlyTow = this.fileAttachments
    }
   
  }
}
