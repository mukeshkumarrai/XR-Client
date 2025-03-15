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
import { X } from '@angular/cdk/keycodes';
import { letProto } from 'rxjs-compat/operator/let';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';


@Component({
  selector: 'app-add-checklist-group',
  templateUrl: './add-checklist-group.component.html',
  styleUrls: ['./add-checklist-group.component.scss']
})
export class AddChecklistGroupComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public checklistJsonObj = {};
  public codePattern = "^[a-z A-Z]+$";//'^[A-Za-z0-9]{1,150}$';
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
  public addQuestionArr =[];
  public addChecklistArr =[];
  panelOpenState: boolean = false;
  sectionCount: number;  
  public isSubmit:boolean = false;
  dirctionalLang;
  @ViewChild('target') private myScrollContainer: ElementRef;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    private appSettingsService: AppSettingsService,public systemSettingService: SystemSettingService,
    private snackBService: SnackBarService,private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService,private translateService: TranslateService, public dialog: MatDialog,
    private serviceListClass: ServiceListClass) {

    this.addForm = this.fb.group({
      Id: [''],
      ChecklistType:['Group'],
      GroupName:['',[Validators.required,Validators.maxLength(100),this.noWhitespaceValidator()]],
      RelatedTo:[''],
      RelatedToValue:[''],
      status: ["1", Validators.required],//<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
      groupCheckListInfo:this.fb.array([],Validators.required),
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

  


  onFilterKeyboard(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

   /*
  @Type: File, <ts>
  @Name: groupCheckListInfo
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for getting the formarray with this instance
  */

 groupCheckListInfo(): FormArray {
  return <FormArray>this.addForm.get("groupCheckListInfo") as FormArray
}


   /*
  @Type: File, <ts>
  @Name: questionInfo
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for getting the formarray with this instance
  */
questionInfo(Index: number): FormArray {
  return this.groupCheckListInfo()
    .at(Index)
    .get('Question') as FormArray;
}


   /*
  @Type: File, <ts>
  @Name: createQuestion
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for creating the formarray with this instance
  */
createQuestion() {
  return this.fb.group({
    Question: ['', [Validators.required,Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
    // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
    IsResponseFreeText:[false],
    IsAttachment:[false],
    DisplaySequence:[],     
    Attachment: [[]],
    // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
    IsMandatory:[false]
  });
}

patchQuestion(param) {
  param.forEach(y => {
    return this.fb.group({
      Question: [y.Question, [Validators.required,Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
    // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
      IsResponseFreeText:[y.IsResponseFreeText],
      IsAttachment: [y.IsAttachment],
      // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
      IsMandatory:[y.IsMandatory],
      DisplaySequence:[y.DisplaySequence],     
      Attachment: [y.Attachment]
    });
  });

}

  /*
  @Type: File, <ts>
  @Name: createCheckList
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for creating the formarray with this instance
  */
createCheckList(){
  return this.fb.group({
    checklistType: [''],
    isEditable:[false],
    Id:[0],
    Name: ['', [Validators.required,Validators.maxLength(100),RxwebValidators.unique(),this.noWhitespaceValidator()]],
    Question:this.fb.array([],Validators.required)
  });
}

/*
 @Type: File, <ts>
 @Name: onEditSection
 @Who: Suika
 @When: 03 Aug 2022
 @Why: EWM-7427 EWM-7635
 @What: for editing Section
 */
onEditSection(editedRow:any){
  editedRow?.get('isEditable').setValue(true);
  }


  sectionEdit(index:number){
    if(index!=(this.sectionCount-1)){
      return true;
    }else{
      return false;
    }
  }

    /*
   @Type: File, <ts>
   @Name: onSaveSection
   @Who: Suika
   @When: 03 Aug 2022
   @Why: EWM-7427 EWM-7635
   @What: on section edit
   */
  onSaveSection(editedRow:FormGroup){
    editedRow.get('isEditable').setValue(false);
  }
   /*
   @Type: File, <ts>
   @Name: onCancelSection
   @Who: Suika
   @When: 03 Aug 2022
   @Why: EWM-7427 EWM-7635
   @What: prefetch section name info
   */
  onCancelSection(editedRow:FormGroup){
    editedRow.get('isEditable').setValue(false);
   }

 /*
  @Type: File, <ts>
  @Name: removeCheckList
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for removing element
  */
removeCheckList(Index: number) {
  this.groupCheckListInfo().removeAt(Index);
}


 /*
  @Type: File, <ts>
  @Name: addCheckList
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for removing element
  */
addCheckList() {
  this.groupCheckListInfo().controls?.forEach(res=>{
    res.patchValue({
      isEditable:false 
    })
  })
  this.groupCheckListInfo().push(this.createCheckList()); 
  setTimeout(() => {
    this.myScrollContainer.nativeElement?.scroll({
      top: this.myScrollContainer.nativeElement?.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }, 0);
  if(this.tempID!=undefined){
    this.actionStatus = 'Edit';
  }else{
    this.actionStatus = 'Add';
  }
 
  this.groupCheckListInfo().at(this.groupCheckListInfo().controls?.length-1)?.get('isEditable').patchValue({
    isEditable:true
  })
  //this.addChecklistArr.push(this.groupCheckListInfo().controls?.length-1);
   //this.onEditSection(this.groupCheckListInfo().controls?.length);
  
  this.sectionCount=this.groupCheckListInfo().controls?.length;
}


 /*
  @Type: File, <ts>
  @Name: patchValues
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for patching value
  */
patchValues(formvalues) {
 const control = <FormArray>this.addForm.controls['groupCheckListInfo'] as FormArray;
 control.clear();
 if (formvalues?.length > 0) {
 //  console.log(formvalues,"formvalues");
   formvalues.forEach((x,xindex) => {
     this.sectionEdit(xindex);
     //this.onEditSection(xindex);
    this.addChecklistArr.push(xindex);
     control.push(
       this.fb.group({
        Id:[x.Id],
        checklistType: [''],
        isEditable:[false],
        Name: [x.Name, [Validators.required,Validators.maxLength(100),RxwebValidators.unique(),this.noWhitespaceValidator()]],
        Question:this.fb.array([]),
       })
     )//this.createQuestion()
     let ques =  this.groupCheckListInfo().at(xindex)?.get('Question') as FormArray; 
     //ques.clear();
    x.Question?.forEach((element,index) => {
    
     // ques.clear();  
    let fileAttachments = [];
    fileAttachments?.push(element?.Attachment);
    this.addQuestionArr.push(element?.Question);
    ques?.push(
      this.fb.group({    
        ChecklistId:[x.Id],      
        Question:[element?.Question,[Validators.required,Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
        IsResponseFreeText: element?.IsResponseFreeText==true?1:0,
        // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
        IsAttachment: element?.IsAttachment==true?1:0,
        // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
        IsMandatory:element?.IsMandatory==true?1:0,
        DisplaySequence:(this.questionList.length-1), //sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
        Attachment:fileAttachments    
      })
    )  
     }); 
    
     this.sectionCount=this.addChecklistArr.length;
     
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
    this.systemSettingService.getChecklistGroupById('?id=' + Id).subscribe(
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
        
         setTimeout(() => {   
           this.selectedRelatedToValue =  data['Data'].RelatedToValue.map(function(obj) {
          return {Id: obj.Id,Name:obj.Name};
           }); }, 1500);
        
      
       
          this.addForm.patchValue({
            Id: Id,
            ChecklistType:data['Data'].ChecklistType,
            GroupId: data['Data'].GroupId,
            GroupName: data['Data'].GroupName,
            RelatedTo: data['Data'].RelatedTo,
            RelatedToValue:  data['Data'].RelatedToValue,           
            status: data['Data'].Status.toString(),
            hideExternally: data['Data'].HideExternally,
          });
          this.isRelatedTo = true;
          this.isRelatedToValue = true;
          this.addForm.get('RelatedTo').disable();
          this.addForm.get('RelatedToValue').disable();        
          this.patchValues(data['Data'].groupCheckList);
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
  @Name: onSave
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for saving value
  */

  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.isSubmit = true;
    this.onChecklistGroupChanges();
   

  }



 /*
  @Type: File, <ts>
  @Name: createChecklistGroup
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for createChecklistGroup value
  */

  createChecklistGroup(value) {
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
          'Name':element.PositionName?element.PositionName:"Position"
        })
      });
    }else{
      arr=[];
    }   
    this.checklistJsonObj['GroupId'] = parseInt(Id);
    this.checklistJsonObj['ChecklistType'] = value.ChecklistType;
    this.checklistJsonObj['GroupName'] = value.GroupName;
    this.checklistJsonObj['RelatedTo'] =(this.selectedRelatedTo?.Name)?(this.selectedRelatedTo?.Name):'';
    this.checklistJsonObj['RelatedToId']=(this.selectedRelatedTo?.Id)?(this.selectedRelatedTo?.Id):0;
    this.checklistJsonObj['RelatedToValue'] = arr;
    this.checklistJsonObj['groupCheckList'] = this.addForm.controls['groupCheckListInfo'].value;
    this.checklistJsonObj['status'] = parseInt(value.status);
    this.checklistJsonObj['HideExternally'] = this.isHideExternally;
    this.systemSettingService.createChecklistGroup(this.checklistJsonObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.router.navigate(['./client/core/administrators/checklist']);
        this.isSubmit = false;
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit = false;
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
  @Name: updateCheckListGroup
  @Who: Suika
  @When: 03 Aug 2022
  @Why: EWM-7427 EWM-7635
  @What: for updateCheckListGroup value
  */

  updateCheckListGroup(value) {
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
    toObj['GroupId'] = parseInt(Id);
    toObj['ChecklistType'] = value.ChecklistType;
    toObj['GroupName'] = value.GroupName;
    toObj['RelatedTo'] =(this.selectedRelatedTo?.Name)?(this.selectedRelatedTo?.Name):'';
    toObj['RelatedToId']=(this.selectedRelatedTo?.Id)?(this.selectedRelatedTo?.Id):0;
    toObj['RelatedToValue'] = arr;
    toObj['groupCheckList'] = this.addForm.controls['groupCheckListInfo'].value;
    toObj['status'] = parseInt(value.status);
    toObj['HideExternally'] = this.isHideExternally;
   
    fromObj = this.oldPatchValue;
    updateObj = [{
      "From": fromObj,
      "To":  toObj
    }];
    this.systemSettingService.updateCheckListGroupById(updateObj[0]).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.isSubmit = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.router.navigate(['./client/core/administrators/checklist']);
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
        this.isSubmit = false;
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
  @Name: onChecklistGroupChanges function
  @Who: Suika
  @When: 01-aug-2022
  @Why: EWM-1734 EWM-7427
  @What: This function is used for checking duplicacy for code
  */


  onChecklistGroupChanges() {
    let alreadyExistCheckObj = {};
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = 0;
    }
    alreadyExistCheckObj['Id'] = parseInt(Id);
    alreadyExistCheckObj['Value'] = this.addForm.get("GroupName").value;
    alreadyExistCheckObj['ChecklistType'] = 'Group';
    if (this.addForm.get("GroupName").value) {
      this.systemSettingService.checkduplicateGrouplist(alreadyExistCheckObj).subscribe(
       
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
           this.addForm.get("GroupName").setErrors({codeTaken: true});
           this.addForm.get("GroupName").markAsDirty();
           this.isSubmit = true;
          }
        }
        else if (data.HttpStatusCode == 204) {        
            this.addForm.get("GroupName").clearValidators();
            this.addForm.get("GroupName").markAsPristine();
            this.addForm.get('GroupName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
            this.addForm.get("GroupName").updateValueAndValidity();
            if (this.addForm.valid && this.isSubmit==true) {
            if (this.actionStatus == 'Add') {
              this.createChecklistGroup(this.addForm.value);
            } else {              
              this.updateCheckListGroup(this.addForm.value);
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


  /*
  @Type: File, <ts>
  @Name: onChecklistChanges function
  @Who: Suika
  @When: 01-aug-2022
  @Why: EWM-1734 EWM-7427
  @What: This function is used for checking duplicacy for code
  */

  
  onChecklistChanges(value,checklistdata) { 
    if(checklistdata.get('Name').invalid){
      return;
    }
    let alreadyExistCheckObj = {};
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = 0;
    }
    alreadyExistCheckObj['GroupId'] = parseInt(Id);
    alreadyExistCheckObj['Value'] = value;
    alreadyExistCheckObj['Id'] = checklistdata.get('Id').value;
    alreadyExistCheckObj['ChecklistType'] = 'Group';
    if (value!=null) {
      this.systemSettingService.checkduplicateChecklist(alreadyExistCheckObj).subscribe(
       
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            checklistdata.get("Name").setErrors({checkListTaken: true});
            checklistdata.get("Name").markAsDirty();
          }
        }
        else if (data.HttpStatusCode == 204) {        
            checklistdata.get("Name").clearValidators();
            checklistdata.get("Name").markAsPristine();
            checklistdata.get("Name").setValidators([Validators.required, Validators.maxLength(100),RxwebValidators.unique(),this.noWhitespaceValidator()]);
            checklistdata.get("Name").updateValueAndValidity();
         
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
        RelatedTo:data.Name
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
  onQuesTypeSelection(editedRow:any='',sectionIndex:number=undefined,quesIndex:number=undefined,checklistData){
    const dialogRef = this.dialog.open(AddQuestionsComponent, {
       data: {editedRow:editedRow,questionList:this.questionList,sectionIndex:sectionIndex,checklistId:checklistData.Id,checklistDataArr:checklistData.Question},
       panelClass: ['xeople-modal', 'assessment-question', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     });     
      dialogRef.afterClosed().subscribe(res => {          
       let response=res;
       if(response!=false){ 
        this.questionList.push(response);  
         if(quesIndex==undefined && sectionIndex!=undefined){ 
          const control = this.groupCheckListInfo().at(sectionIndex)?.get('Question') as FormArray;
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);        
          control.push(
            this.fb.group({  
              ChecklistId:[response?.ChecklistId],        
              Question:[response?.Question, [Validators.required,Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
              IsMandatory:response?.IsMandatory==true?1:0,
              DisplaySequence:(this.questionList.length-1), //sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:fileAttachments    
            })
          )  
          this.addChecklistArr.push(sectionIndex);
          this.addQuestionArr.push(quesIndex);
          this.sectionCount=this.addChecklistArr.length;
         }else{ 
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);                    
          (<FormArray>this.groupCheckListInfo().at(sectionIndex).get('Question')).at(quesIndex).patchValue(
            {   
              ChecklistId:response?.ChecklistId,         
              Question:response?.Question,
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
              IsMandatory:response?.IsMandatory==true?1:0,
              DisplaySequence:response?.DisplaySequence,//sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:response?.Attachment
            }
          )
         } 
          
       }else{
       // (<FormArray>this.groupCheckListInfo().at(sectionIndex).get('Question')).at(quesIndex).reset();
       }
      })
      
   }
 
  /*
   @Type: File, <ts>
   @Name: onQuesTypeSelection
   @Who: Suika
   @When: 03 Aug 2022
   @Why: EWM-7427 EWM-7635
   @What: on questiontype Seelction
   */
  onQuesTypeEditSelection(editedRow:any='',sectionIndex:number=undefined,quesIndex:number=undefined,checklistData){
    let checkListArr = [];
    checklistData.forEach(element => {
      checkListArr.push(element.value);
    });
   // console.log(checkListArr,"checkListArr");
    const dialogRef = this.dialog.open(AddQuestionsComponent, {
       data: {editedRow:editedRow,questionList:this.questionList,sectionIndex:sectionIndex,checklistId:checklistData[0].value.ChecklistId,checklistDataArr:checkListArr},
       panelClass: ['xeople-modal', 'assessment-question', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     });     
      dialogRef.afterClosed().subscribe(res => {          
       let response=res;
       if(response!=false){ 
        this.questionList.push(response);  
         if(quesIndex==undefined && sectionIndex!=undefined){ 
          const control = this.groupCheckListInfo().at(sectionIndex)?.get('Question') as FormArray;
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);        
          control.push(
            this.fb.group({  
              ChecklistId:[response?.ChecklistId],        
              Question:[response?.Question, [Validators.required,Validators.maxLength(300),RxwebValidators.unique(),this.noWhitespaceValidator()]],
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
              IsMandatory:response?.IsMandatory==true?1:0,
              DisplaySequence:(this.questionList.length-1), //sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:fileAttachments    
            })
          )  
          this.addChecklistArr.push(sectionIndex);
          this.addQuestionArr.push(quesIndex);
          this.sectionCount=this.addChecklistArr.length;
         }else{ 
           let fileAttachments = [];
           fileAttachments.push(response?.Attachment);                    
          (<FormArray>this.groupCheckListInfo().at(sectionIndex).get('Question')).at(quesIndex).patchValue(
            {   
              ChecklistId:response?.ChecklistId,         
              Question:response?.Question,
              IsResponseFreeText: response?.IsResponseFreeText==true?1:0,
              // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
              IsAttachment: response?.IsAttachment==true?1:0,
              // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:08Jul24
              IsMandatory:response?.IsMandatory==true?1:0,
              DisplaySequence:response?.DisplaySequence,//sectionIndex?sectionIndex:0,//response?.DisplaySequence?response?.DisplaySequence:0,    
              Attachment:response?.Attachment
            }
          )
         } 
          
       }else{
       // (<FormArray>this.groupCheckListInfo().at(sectionIndex).get('Question')).at(quesIndex).reset();
       }
      })
      /* RTL code */
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
   }
 

/*
   @Type: File, <ts>
   @Name: removeRow
   @Who: Suika
   @When: 08-Aug-2022
   @Why: ROST-7427
   @What: for removing the single row
   */
  removeRow(i: number, quesIndex: number) {  
    this.questionInfo(i).removeAt(quesIndex);
  }


   /*
   @Type: File, <ts>
   @Name: confirmDialog function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: FOR DIALOG BOX confirmation
 */
 confirmDialog(index,quesIndex): void {
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
      this.removeRow(index,quesIndex);
    }
  });

  /* RTL code */
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
      
}



   /*
   @Type: File, <ts>
   @Name: confirmDialog function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: FOR DIALOG BOX confirmation
 */
confirmDialogChecklist(index): void {
  const message = 'label_titleDialogContent';
  const title = 'label_delete';
  const subTitle = 'label_checklist';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    
    if (dialogResult == true) {
      this.removeCheckList(index);
    }
  });
    /* RTL code */
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
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
      control =  (<FormArray>this.groupCheckListInfo().at(index).get('Question')) as FormArray;
      this.moveItemInFormArray(control,event.previousIndex, event.currentIndex)
    
   } 

   moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);
    if (from === to) {
      return;
    }
    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
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
      this.onQuesTypeSelection(editedRow,sectionIndex,quesIndex,'');
     
      //}
    }


/* 
@Type: File, <ts>
@Name: togglePanel function
@Who: Suika
@When: 17-Aug-2022
@Why: ROST-7427 EWM-7635
@What: to close already opened toggle 
*/
togglePanel() {
  this.panelOpenState = !this.panelOpenState
}


noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

}

