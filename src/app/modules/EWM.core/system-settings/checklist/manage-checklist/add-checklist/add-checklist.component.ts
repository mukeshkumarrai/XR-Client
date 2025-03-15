import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MatStepper } from '@angular/material/stepper';
import { Subject } from 'rxjs';
import { ConfirmDialogModel, ShareJobApplicationUrlComponent } from 'src/app/modules/EWM.core/job/job-details/share-job-application-url/share-job-application-url.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Industry } from '../../../industry/model/industry';
import { AddQuestionsComponent } from '../add-questions/add-questions.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponceData } from 'src/app/shared/models';
import { ResponseData } from 'src/app/shared/services/common-servies.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-add-checklist',
  templateUrl: './add-checklist.component.html',
  styleUrls: ['./add-checklist.component.scss']
})
export class AddChecklistComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public checklistJsonObj = {};
  public codePattern = "^[a-z A-Z]+$";
  public isHideExternally: number = 1;
  public isBuiltIn: number = 0;
  public scorePattern = new RegExp(/^(?:100(?:\.0)?|\d{1,3}(?:\.\d{1,2})?)$/);
  tempID: string;
  public statusList: any = [];
  public checkListId;
  viewModeValue: any;
  public selectedRelatedTo:any={};
  public selectedRelatedToValue:any={};  
  public relatedToConfig:customDropdownConfig[]=[];
  public relatedToValueConfig:customDropdownConfig[]=[];
  resetFromSubjectRelatedTo: Subject<any> = new Subject<any>();  
  public apiGateWayUrl: String;  
  questions: FormArray;
  public questionList:any=[];
  public oldPatchValue:any = [];
  public fileAttachments: any = []; 
  isRelatedTo:boolean=false;
  isRelatedToValue:boolean=false;
  isSubmit:boolean=false;
  @ViewChild('target') private myScrollContainer: ElementRef;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private appSettingsService: AppSettingsService,public systemSettingService: SystemSettingService,
    private snackBService: SnackBarService,private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService,private translateService: TranslateService, public dialog: MatDialog,
    private serviceListClass: ServiceListClass) {

    this.addForm = this.fb.group({
      Id: [''],
      ChecklistType:['Single'],
      checkListName:['',[Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]],
      RelatedTo:[''],
      Name:[''],
      RelatedToId:[''],
      RelatedToValue:[''],
      status: ['1',Validators.required], //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
      QuesInfo:this.fb.array([],Validators.required),
      hideExternally: [1],
    });

 

    this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;
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
    this.getStatusList();
    this.route.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = 'Edit'
          this.tempID = params['id'];
          this.editForm(this.tempID);
        } else {
          this.checkListId = localStorage.getItem('checkListId');
        }
      });

    this.route.queryParams.subscribe((params) => {
      this.viewModeValue = params['viewModeData'];
    })

    if(this.actionStatus=='Edit'){
      this.relatedToConfig['IsDisabled']=true;
      this.relatedToValueConfig['IsDisabled']=true;
    }else{
      this.relatedToConfig['IsDisabled']=false;
      this.relatedToValueConfig['IsDisabled']=false;
    }    
    this.relatedToConfig['apiEndPoint']=this.serviceListClass.getAssessmentRelatedTo;
    this.relatedToConfig['placeholder']='label_AssementRealtedTO';
    this.relatedToConfig['searchEnable']=true;
    this.relatedToConfig['IsManage']='';
    this.relatedToConfig['IsRequired']=false;
    this.relatedToConfig['bindLabel']='Name';
    this.relatedToConfig['multiple']=false;  
   
    this.relatedToValueConfig['searchEnable']=true;
    this.relatedToValueConfig['multiple']=true; 
    this.relatedToValueConfig['IsRequired']=false;



  }

  
   /*
  @Type: File, <ts>
  @Name: questionInfo
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for getting the formarray with this instance
  */

 questionInfo(): FormArray {
  return this.addForm.get("QuesInfo") as FormArray
}


   /*
  @Type: File, <ts>
  @Name: createQuestion
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for getting the formarray with this instance
  */

createQuestion() {
  return this.fb.group({
    Question: ['', [Validators.required,Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
    // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
    IsResponseFreeText:[false],
    DisplaySequence:[],     
    Attachment: [[]],
    IsAttachment:[false],
    // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
    IsMandatory:[false]
  });
}


   /*
  @Type: File, <ts>
  @Name: patchValues
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for patchValues the formarray with this instance
  */
patchValues(formvalues) {
  const control = <FormArray>this.addForm.controls['QuesInfo'];
  control.clear();  
  if (formvalues?.length > 0) {
    formvalues.forEach((x) => {
      control.push(
        this.fb.group({
          Question: [x.Question, [Validators.required, Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
          // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
          IsResponseFreeText: [x.IsResponseFreeText],
          IsAttachment: [x.IsAttachment],
          // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
          IsMandatory:[x.IsMandatory],
          DisplaySequence: [x.DisplaySequence],
          Attachment: [x.Attachment]
        })
      )
    })
  }
  if (this.actionStatus == 'View' || this.actionStatus == 'view') {
    control.disable();  
  }
}

 
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: For setting value in the edit form
  */

  editForm(Id: String) {
    this.loading = true;
    this.systemSettingService.getChecklistById('?id=' + Id).subscribe(
      (data: ResponseData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.oldPatchValue =  data['Data'];       
          this.isHideExternally = data['Data'].isHideExternally;
          if(data['Data'].RelatedTo!=null)
          {
          let relatedData={Id:data['Data'].RelatedToId,Name:data['Data'].RelatedTo,APIKey:data['Data'].APIKey,API:data['Data'].API};
            this.onRealtedTochange(relatedData);
          }else{
            this.onRealtedTochange(null);
          }
          //this.onRealtedTochange(this.selectedRelatedTo);
         this.selectedRelatedToValue = data['Data'].RelatedToValue,
         setTimeout(() => {   
           this.selectedRelatedToValue =  data['Data'].RelatedToValue.map(function(obj) {
          return {Id: obj.Id,Name:obj.Name};
           }); }, 1500);
        
      
        //  this.onRealtedToValuechange(this.selectedRelatedToValue);
          this.addForm.patchValue({
            // Id: Id,
            Id: data['Data'].Id,
            ChecklistType:data['Data'].ChecklistType,
            checkListName: data['Data'].Name,
            RelatedTo: data['Data'].RelatedTo,
            RelatedToValue:  data['Data'].RelatedToValue,           
            // status: data['Data'].Status.toString(),
            status:data['Data'].Status.toString(),
            Name: data['Data'].Name,


            hideExternally: data['Data'].HideExternally,
          });
          this.isRelatedTo = true;
          this.isRelatedToValue = true;            
         // this.questionList.push(data['Data'].Question); 
          this.questionList = data['Data'].Question;
          this.patchValues(data['Data'].Question);
          this.addForm.get('RelatedTo').disable();
          //who:maneesh comment this  // this.addForm.get('RelatedToValue').disable();
          // this.addForm.get('RelatedToValue').disable();
        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data['Message']), data['HttpStatusCode'].toString());

        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data['Message']), data['HttpStatusCode'].toString());

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
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: For saving value in the edit form
  */

  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.isSubmit = true;
    this.onChecklistChanges(true);

  }


    /*
   @Type: File, <ts>
   @Name: createChecklist function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: For saving value in the edit form
  */

  createChecklist(value) {
    this.loading = true;
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = '0';
    }
  
    let arr:any[]=[];
    if(this.selectedRelatedToValue && Object.keys(this.selectedRelatedToValue).length)
    {
      this.selectedRelatedToValue.forEach(element => {
        arr.push({
          'Id':element.Id,
          'Name':element.Code
        })
      });
    }else{
      arr=[];
    }   
    this.checklistJsonObj['id'] = parseInt(Id);
    this.checklistJsonObj['ChecklistType'] = value.ChecklistType;
    this.checklistJsonObj['Name'] = value.checkListName;
    this.checklistJsonObj['RelatedTo'] =(this.selectedRelatedTo?.Name)?(this.selectedRelatedTo?.Name):'';
    this.checklistJsonObj['RelatedToId']=(this.selectedRelatedTo?.Id)?(this.selectedRelatedTo?.Id):0;
    this.checklistJsonObj['RelatedToValue'] = arr;
    this.checklistJsonObj['Question'] = this.addForm.controls['QuesInfo'].value;
    this.checklistJsonObj['status'] = parseInt(value.status);
    this.checklistJsonObj['HideExternally'] = this.isHideExternally;
    this.systemSettingService.createCheckList(this.checklistJsonObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.isSubmit=false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.router.navigate(['./client/core/administrators/checklist']);

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit=false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit=false;
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
   @Name: updateChecklist function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: For saving value in the edit form
  */
  updateChecklist(value) {
    //this.oldPatchValue=value;
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    this.loading = true;
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = '0';
    }
  
    let arr:any[]=[];
    if(this.selectedRelatedToValue && Object.keys(this.selectedRelatedToValue).length)
    {
      this.selectedRelatedToValue.forEach(element => {
        arr.push({
          'Id':element.Id,
          'Name':element.Code
        })
      });
    }else{
      arr=[];
    }   
    toObj['id'] = parseInt(Id);
    toObj['ChecklistType'] = value.ChecklistType;
    toObj['Name'] = value.checkListName;
    toObj['RelatedTo'] =(this.selectedRelatedTo?.Name)?(this.selectedRelatedTo?.Name):'';
    toObj['RelatedToId']=(this.selectedRelatedTo?.Id)?(this.selectedRelatedTo?.Id):0;
    toObj['RelatedToValue'] = arr;
    toObj['Question'] = this.addForm.controls['QuesInfo'].value;
    toObj['status'] = parseInt(value.status);
    toObj['HideExternally'] = this.isHideExternally;   
    fromObj = this.oldPatchValue;
    updateObj = [{
      "From": toObj,
      "To":  toObj
    }];
    this.systemSettingService.updateCheckListById(updateObj[0]).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.isSubmit=false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.router.navigate(['./client/core/administrators/checklist']);
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit=false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit=false;
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

  onCancel(e) {
    e.preventDefault();
    this.addForm.reset();
    this.actionStatus = 'Add'; 
    this.router.navigate(['./client/core/administrators/checklist']);

  }





  /*
  @Type: File, <ts>
  @Name: onCodeChanges function
  @Who: Suika
  @When: 01-aug-2022
  @Why: EWM-1734 EWM-7427
  @What: This function is used for checking duplicacy for code
  */


  onChecklistChanges(isClicked:boolean) {
    let alreadyExistCheckObj = {};
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = 0;
    }
    alreadyExistCheckObj['Id'] = parseInt(Id);
    alreadyExistCheckObj['Value'] = this.addForm.get("checkListName").value;
    alreadyExistCheckObj['ChecklistType'] = 'Single';
    if (this.addForm.get("checkListName").value) {
      this.systemSettingService.checkduplicateChecklist(alreadyExistCheckObj).subscribe(
       
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {        
          if (data.Data == false) {
           this.addForm.get("checkListName").setErrors({codeTaken: true});
           this.addForm.get("checkListName").markAsDirty();
          }
          this.isSubmit==false;
        }
        else if (data.HttpStatusCode == 204) {        
            this.addForm.get("checkListName").clearValidators();
            this.addForm.get("checkListName").markAsPristine();
            this.addForm.get('checkListName').setValidators([Validators.required, Validators.maxLength(100)]);
            this.addForm.get("checkListName").updateValueAndValidity();
            // fixed bugs by Adarsh singh EWM-8507 on 18-11-2022
            if (this.addForm.valid && this.isSubmit==true && isClicked) {
              
            if (this.actionStatus == 'Add' && this.isSubmit==true) {
              this.createChecklist(this.addForm.value);
            } else {              
              this.updateChecklist(this.addForm.value);
            }
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
    }
  }


  setDefaultSignature(e) {
    if (e.checked === false) {
      this.isHideExternally = 0;
    } else {
      this.isHideExternally = 1;
    }

  }



  /*
    @Type: File, <ts>
    @Name: getStatusList function
    @Who: Suika
    @When: 01-aug-2022
    @Why: EWM-1734 EWM-7427
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
@Name: onRealtedTochange function
@Who: Suika
@When: 01-Aug-2022
@Why: ROST-7427
@What: on change Realted To
 */

onRealtedTochange(data){  
  this.selectedRelatedToValue=null;
  if(data==null || data=="")
  {
    this.selectedRelatedTo=null;
    this.addForm.patchValue(
      {
        RelatedTo:null
      })
  }
  else
  {
    this.selectedRelatedTo=data;
    this.addForm.get("RelatedTo").clearValidators();
    this.addForm.get("RelatedTo").markAsPristine();   
    this.addForm.patchValue(
      {
        RelatedTo:data.Name,
        RelatedToId:data.Id
      }
   )
  
  }
  this.relatedToValueConfig['apiEndPoint'] =this.apiGateWayUrl + data?.API;
  this.relatedToValueConfig['bindLabel'] =data?.APIKey;
  this.relatedToValueConfig['placeholder']=data?.Name;
  if(data?.Name=='Position')
  this.relatedToValueConfig['IsManage']='/client/core/administrators/position';
  else if(data?.Name=='Industry')
  this.relatedToValueConfig['IsManage']='/client/core/administrators/industry-master;can=job';
  else if(data?.Name=='Job')
  this.relatedToValueConfig['IsManage']='';
  else if(data?.Name=='Job Workflow')
  this.relatedToValueConfig['IsManage']='/client/core/administrators/job-workflows;can=job';
  if(this.selectedRelatedTo!=null){
    this.resetFromSubjectRelatedTo.next(this.relatedToValueConfig);
  }
 
  //this.onChangeRelatedTo(data);
  
}


  
/* 
@Type: File, <ts>
@Name: onRealtedToValuechange function
@Who: Suika
@When: 01-Aug-2022
@Why: ROST-7427
@What: on change Realted To
*/

onRealtedToValuechange(data){   
  if(data==null || data=="")
  {
    this.selectedRelatedToValue=null;
  }
  else
  { 
    this.selectedRelatedToValue=data;
    this.addForm.get("RelatedToValue").clearValidators();
    this.addForm.get("RelatedToValue").markAsPristine();   
    this.addForm.patchValue(
      {
        RelatedToValue:data.Id
      }
   )
    }
}


    /*
   @Type: File, <ts>
   @Name: onQuesTypeSelection
   @Who: Suika
   @When: 03 Aug 2022
   @Why: EWM-7427 EWM-7635
   @What: on questiontype Seelction
   */
  onQuesTypeSelection(editedRow:any='',sectionIndex:number=undefined){ 
    const dialogRef = this.dialog.open(AddQuestionsComponent, {
       data: {editedRow:editedRow,questionList:this.questionList,sectionIndex:sectionIndex,checklistId:this.tempID,checklistDataArr:this.questionList},
       panelClass: ['xeople-modal', 'assessment-question', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     }); 
      dialogRef.afterClosed().subscribe(res => {          
       let response=res;
       const control = <FormArray>this.addForm.controls['QuesInfo'];
       //control.clear();
       if(response!=false){ 
        this.questionList.push(response);  
         if(sectionIndex==undefined){ 
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);        
          control.push(
            this.fb.group({          
              Question:[response?.Question,[Validators.required, Validators.maxLength(300),RxwebValidators.unique()]],
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
              IsMandatory:response?.IsMandatory==true?1:0,
              DisplaySequence:(this.questionList.length), //sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:fileAttachments    
            })
          )  
          setTimeout(() => {
            this.myScrollContainer.nativeElement.scroll({
              top: this.myScrollContainer.nativeElement.scrollHeight,
              left: 0,
              behavior: 'smooth'
            });
          }, 0);
         }else{ 
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);                    
          (<FormArray>this.addForm.get('QuesInfo')).at(sectionIndex).patchValue(
            {            
              Question:response?.Question,
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
              IsMandatory:response?.IsMandatory==true?1:0,
              DisplaySequence:response?.DisplaySequence,//sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:response?.Attachment
            }
          )
         } 
          
       }
      })
      
   }
 

   onQuesTypeEditSelection(editedRow:any='',sectionIndex:number=undefined){
    const dialogRef = this.dialog.open(AddQuestionsComponent, {
       data: {editedRow:editedRow,questionList:this.questionList,sectionIndex:sectionIndex,checklistId:this.tempID,checklistDataArr:this.questionList},
       panelClass: ['xeople-modal', 'assessment-question', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     }); 
      dialogRef.afterClosed().subscribe(res => {          
       let response=res;
       const control = <FormArray>this.addForm.controls['QuesInfo'];
       //control.clear();
       if(response!=false){ 
        this.questionList.push(response);  
         if(sectionIndex==undefined){ 
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);        
          control.push(
            this.fb.group({          
              Question:[response?.Question,[Validators.required, Validators.maxLength(300),RxwebValidators.unique()]],
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
              IsMandatory: response?.IsMandatory==true?1:0,
              DisplaySequence:(this.questionList.length), //sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:fileAttachments    
            })
          )  
          setTimeout(() => {
            this.myScrollContainer.nativeElement.scroll({
              top: this.myScrollContainer.nativeElement.scrollHeight,
              left: 0,
              behavior: 'smooth'
            });
          }, 0);
         }else{ 
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);                    
          (<FormArray>this.addForm.get('QuesInfo')).at(sectionIndex).patchValue(
            {            
              Question:response?.Question,
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
              IsMandatory: response?.IsMandatory==true?1:0,
              DisplaySequence:response?.DisplaySequence,//sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:response?.Attachment
            }
          )
         } 
          
       }
      })
      
   }
 

/*
   @Type: File, <ts>
   @Name: removeRow
   @Who: Suika
   @When: 08-Aug-2022
   @Why: ROST-7427
   @What: for removing the single row
   */
  removeRow(i: number) {  
    const control = <FormArray>this.addForm.controls['QuesInfo'];
    control.removeAt(i);  
    this.questionList.splice(i,1); 
  }


   /*
   @Type: File, <ts>
   @Name: confirmDialog function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: FOR DIALOG BOX confirmation
 */
 confirmDialog(index): void {
  const message = 'label_titleDialogContent';
  const title = 'label_delete';
  const subTitle = 'label_question';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    
    if (dialogResult == true) {
      this.removeRow(index);
    }
  });
}

   /*
  @Type: File, <ts>
  @Name: drop function
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: For drag & drop functionality
   */
  drop(event: CdkDragDrop<string[]>,index:number) {
    let control:any;
      control = (<FormArray>this.addForm.controls['QuesInfo']) as FormArray;   
      this.moveItemInFormArray(control.value, event.previousIndex, event.currentIndex);
   }  

   

   moveItemInFormArray(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
     arr.splice(toIndex, 0, element);  
    const control = <FormArray>this.addForm.controls['QuesInfo'];
      control.clear();           
       if(arr?.length >0){ 
        arr.forEach((element,index) => {
          control.push(
            this.fb.group({          
              Question:element?.Question,
              IsResponseFreeText: element?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: element?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
              IsMandatory:element?.IsMandatory==true?1:0,
              DisplaySequence: index+1,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:[element?.Attachment]           
            })
          )  
     }); 
       
        //this.questionList.push(arr);    
       }
}


      /*
  @Type: File, <ts>
  @Name: clamp function
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What:  Clamps a number between zero and a maximum.
   */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }



  onEditQuestions(editedRow:any,sectionIndex:number,quesIndex:number){
    //if(editedRow.controls['Id'].value==null || editedRow.controls['Id'].value=='' || editedRow.controls['Id'].value==0){
      this.onQuesTypeSelection(editedRow,sectionIndex);
     
      //}
    }

    noWhitespaceValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
      };
    }
    
}

