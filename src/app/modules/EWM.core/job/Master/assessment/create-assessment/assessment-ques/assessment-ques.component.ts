import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Observable ,of as observableOf, of} from 'rxjs';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-assessment-ques',
  templateUrl: './assessment-ques.component.html',
  styleUrls: ['./assessment-ques.component.scss']
})
export class AssessmentQuesComponent implements OnInit {


  addForm:FormGroup;
  submitted: boolean;
  loading:boolean=false;
  questionType:Number;
  quesName: string;
  evalCriteriaId: any;
  editedRow: any;
  runningWeightage: number;
  maxOptions: number;
  counter: number=1;
  edition: boolean=false;
  selected: any;
  oldRunningWeightage: number=0;
  exhaustedWeightage: number=0;
  weigthageList: any;
  public pageNo = 1;
  public searchVal: string = '';
  public idWeightage='';
  public idName='Id';
  pageOption: any;
  pageSize: any;
  public sortingValue: string = "";
  fileAttachments: any[];
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
  animationVar: any;
  dirctionalLang;
  constructor(public dialogRef: MatDialogRef<AssessmentQuesComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
  private fb: FormBuilder,public dialog: MatDialog,public _appSetting: AppSettingsService,
  private snackBService: SnackBarService,private _SystemSettingService: SystemSettingService ) { 
    this.questionType=this.data.Questype;
    this.evalCriteriaId=this.data.evalCriteriaId;
    this.editedRow=this.data.editedRow;
    this.runningWeightage=this.data.weightageSum?data.weightageSum:0;
    this.oldRunningWeightage=this.data.weightageSum?data.weightageSum:0;
    this.exhaustedWeightage=this.data.weightageSum?data.weightageSum:0;
    this.maxUploadFile = _appSetting.maxUploadFile;
    this.addForm =this.fb.group({
      TypeName: [],
      Id:[],
      TypeId:[],
      QuestionDesc:['',[Validators.required,Validators.maxLength(2000),this.noWhitespaceValidator()]],
      Weightage:['',[Validators.required]],
      Instruction:['',[Validators.maxLength(150)]],
      DisplaySeq:[],
      Options:this.fb.array([this.createItem()],atLeastOneCheckboxCheckedValidator(this.questionType))
    });
    this.maxOptions=this._appSetting.maxOptions;
       // page option from config file
       this.pageOption = this._appSetting.pageOption;
       // page option from config file
       this.pageSize = this._appSetting.pagesize;

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
    this.getWeightageList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idWeightage);
  if(this.questionType==1){
    this.quesName='Free Text';
  }else if(this.questionType==2){
    this.quesName='Single Select';
  }else if(this.questionType==3){
    this.quesName='Multi Select';
  }else{
    this.quesName='Attachments';
  }
    this.addForm.reset();
    if(this.editedRow){
      this.patchValuesEdit(this.editedRow);
      }
      this.animationVar = ButtonTypes;
  }


   /*
   @Type: File, <ts>
   @Name: patchValuesEdit
   @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: when user clieck on edit 
   */
   patchValuesEdit(editedRow: any) {
    this.edition=true;
    this.fileAttachments = editedRow.Files;
    this.addForm.patchValue({
      Weightage:parseInt(editedRow.Weightage),  
      Instruction:editedRow.Instruction,
      WeightageId:editedRow.WeightageId,
      Files:editedRow.Files,
      QuestionDesc:editedRow.QuestionDesc,
      TypeName:editedRow.TypeName,
      Id:editedRow.Id,
      TypeId:editedRow.TypeId,
      DisplaySeq:editedRow.DisplaySeq,
      Options:[]
    })
   // this.runningWeightage=this.runningWeightage-editedRow.Weightage;
  
//   this.exhaustedWeightage=Number(this.runningWeightage)-Number(editedRow.Weightage);   // comment @suika as per story EWM-8839, EWM--10122
  // this.oldRunningWeightage=Number(this.exhaustedWeightage);   // comment @suika as per story EWM-8839, EWM--10122
    const OptionsInfo = this.addForm.get('Options') as FormArray;
    OptionsInfo.clear();
    if(editedRow.Options!=null)
    {
      editedRow.Options.forEach((x,index) => {
        OptionsInfo.push(
          this.fb.group({
            Id:[x['Id']],
            IsCorrect: [x['IsCorrect']],
            Description: [x['Description'],RxwebValidators.unique()],
            DisplaySeq:parseInt(index+1)
          })
        )
      });
    }
  }

   // comment  @suika as per story EWM-8839, EWM--10122
   /*
   @Type: File, <ts>
   @Name: formControlValueChanged
   @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: when user changes the value for weightage
   

   formControlValueChanged(value) {
    if(this.evalCriteriaId==2){
      this.addForm.get('Weightage').setValidators([Validators.required,Validators.pattern(/^\d*$/)]);
      this.addForm.get('Weightage').updateValueAndValidity();
      //let exhaustedWeightage=Number(this.runningWeightage)+Number(value);
      this.runningWeightage=Number(this.exhaustedWeightage)+Number(value);
      if(this.runningWeightage>100)
      {
          this.addForm.get("Weightage").setErrors({ weightage: true });
          this.addForm.get("Weightage").markAsTouched();
          this.addForm.get("Weightage").markAsDirty();
      }else{
        this.addForm.get("Weightage").clearValidators();
        this.addForm.get("Weightage").markAsPristine();
      }
     
    }else{
      this.addForm.get('Weightage').clearValidators();
      this.addForm.get('Weightage').updateValueAndValidity();
    }
    
  } */

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
   @Name: createItem
   @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: when user click on add to create form group with same formcontrol
   */

   createItem(): FormGroup {
    return this.fb.group({
      Id:[0],
      IsCorrect: [],
      Description: [null,RxwebValidators.unique()],
      DisplaySeq:[]
    });
    
  }

   /*
   @Type: File, <ts>
   @Name: QuesInfo
    @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: for getting the formarray with this instance
   */
   QuesInfo() : FormArray {
    return this.addForm.get("Options") as FormArray
  }

  /*
   @Type: File, <ts>
   @Name: addQuesRow
   @Who: Renu
    @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: on add mulitple row
   */
   
   addQuesRow() {
     this.counter=this.counter+1;
    this.QuesInfo().push(this.createItem());
  }

  /*
    @Name: onDismiss
    @Who:Renu
    @When: 07-Mar-2022
    @Why:   EWM-3571 EWM-4175
    @What: Function will call when user click on cancel button.
  */
    onDismiss(): void {
      document.getElementsByClassName("assessment-question")[0].classList.remove("animate__zoomIn");
      document.getElementsByClassName("assessment-question")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({'isSubmit':false}); }, 200);
    }

    
  /*
    @Name: updateSelection
    @Who:Renu
    @When: 07-Mar-2022
    @Why:   EWM-3571 EWM-4175
    @What: for radio buttons checking on update
  */
    updateSelection(quesControls,ques){
    quesControls.forEach(x => {
      x.controls.IsCorrect.setValue(false)
    })
    ques.controls.IsCorrect.setValue(true);
    }
/* 
   @Type: File, <ts>
   @Name: onSave function
   @Who: Renu
   @When: 07-Mar-2022
   @Why:   EWM-3571 EWM-4175
   @What: For Data save to serve
*/

  onSave(value: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.createQuestionBank(value);
  }

  /* 
  @Type: File, <ts>
  @Name: createQuestionBank function
  @Who: Renu
  @When: 07-Mar-2022
  @Why:   EWM-3571 EWM-4175
  @What: For saving manage access data
  */

  createQuestionBank(value: any) {
  /* let fileAttached = [];
   this.fileAttachments.forEach(element=>{
    fileAttached.push({
      'AttachmentName':element.AttachmentName,
      'FileSize':element.FileSize,
      'AttachmentLocation':element.AttachmentLocation
    })
   })   */
    value['Files']=this.fileAttachments;
    if(this.questionType==1){
      value['TypeName']='Free Text';
      value['TypeId']=1;
    }else if(this.questionType==2){
      value['TypeName']='Single Select';
      value['TypeId']=2;
    }else  if(this.questionType==3){
      value['TypeName']='Multi Select';
      value['TypeId']=3;
    }else{
      value['TypeName']='Attachements';
      value['TypeId']=4;
    }
    value['WeightageId'] =value.Weightage.Id;
    value['Weightage'] =value.Weightage.Weightage; 
    document.getElementsByClassName("assessment-question")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("assessment-question")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'isSubmit':true,'res':value,'operation':this.edition}); }, 200);
  
  }

 
  /*
 @Type: File, <ts>
 @Name: confirmDialog
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: delete row of questions added
 */

confirmDialog(index:number){
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = '';//labeloptions
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.QuesInfo().removeAt(index);
      this.counter=this.counter-1;
    }
  });
  /* Confirm dialog add RTL code */
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
}
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 26-dec-2022
   @Why: EWM-9957
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;    
    return isWhitespace ? { whitespace: true } : null;
  };
}

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 27-dec-2022
   @Why: EWM-9957
   @What: Remove whitespace in options field
*/
blankval:boolean = false;
 availableEmail(event: any, i: number){
  let frmArray = (<FormArray>this.addForm.get('Options'))?.at(i) as FormArray;
  const isWhitespace = (frmArray.value.Description as string || '')?.trim().length === 0;  
  if(isWhitespace==true && frmArray.value.Description!=''){    
         this.blankval=true;
      }else{
         this.blankval=false;
            }
     }


/* 
 @Type: File, <ts>
 @Name: getWeightageList function
 @Who: Suika
 @When: 06-01-2023
 @Why: EWM-8839 EWM-10122
 @What: get weightageList List
 */
getWeightageList(pageSize, pageNo, sortingValue, searchVal, idName, idWeightage) {
  this.loading = true;
  this._SystemSettingService.getWeightageList(pageSize, pageNo, sortingValue, searchVal, idName, idWeightage).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
          this.weigthageList = repsonsedata.Data;
          }
      } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}



/*
   @Type: File, <ts>
   @Name: openMultipleAttachmentModal function
   @Who: Suika
   @When: 04-Aug-2022
   @Why: EWM-7427 EWM-7635
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
  @Name: getFilterConfig function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2087
  @What: For getting the deafult config for the user
   */
  onSwiper(swiper) {
    // console.log(swiper);
  }

    /*
   @Type: File, <ts>
   @Name: removeAttachment function
   @Who: Suika
   @When: 10-Feb-2022
   @Why:EWM-8839 EWM-10122
   @What: For remove Attachment
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


 /*
    @Type: File, <ts>
    @Name: confirmAttachment function
    @Who: Suika
    @When: 13-May-2021
    @Why: ROST-1506
    @What: FOR DIALOG BOX confirmation
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


}

export function atLeastOneCheckboxCheckedValidator(questionType,
  minRequired = 1
): ValidatorFn {
  
  return function validate(formGroup: FormGroup) {
    let checked = 0;
   if(questionType==2 || questionType==3){
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key]
      if (control.value.IsCorrect==true) {
        checked++
      }
    })

    if (checked < minRequired) {
      return {
        requireCheckboxToBeChecked: true,
      }
    }
    return null
  
   }else{
     return null;
   }
  
}




}


