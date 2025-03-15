/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Renu
  @When: 04-March-2022
  @Why: EWM-5427 EWM-5467
  @What:  This page will be use for create assesment
*/
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { ManageAccessComponent } from 'src/app/modules/EWM-Candidate/candidate-document/manage-access/manage-access.component';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AssessmentQuesComponent } from './assessment-ques/assessment-ques.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WarningDialogComponent } from 'src/app/shared/modal/warning-dialog/warning-dialog.component';
import { Subject, Subscription } from 'rxjs';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ImageUploadAdvancedComponent } from 'src/app/modules/EWM.core/shared/image-upload-advanced/image-upload-advanced.component';
import { environment } from 'src/environments/environment';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
enum pattern{
  'Question Based',
  'Section-Question Based'
};

enum creteria{
  'Average',
  'Weightage Average',
  'N/A'
};
@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})
export class CreateAssessmentComponent implements OnInit {

 
  addAssessmentGroup:FormGroup;
  addQuesGroup:FormGroup;
  guideLinesGroup:FormGroup;
  reviewFormGroup:FormGroup;
  public isLinear = true;
  public selected: any;
  public selectedcolGrid:any[]=[];
  public steps: any = { hour: 1, minute: 1 };
  public statusList: any = [];
  public RelatedToList: []=[];
  public oldPatchValues: {};
  public accessEmailId: any[];
  public tempID: any;
  public submitted: boolean;
  public loading: boolean;
  public moduleArray: any;
  public apiGateWayUrl: String;
  public isMultiple : boolean = true;
  public keyValue: any = [];
  public dropList: []=[];
  public config: any = {};
  public selectedIn: any;
  public hideBtn:boolean=true;
  public addClass: any;
  public chosenLayout: number;
  public imagePreviewloading: boolean = false;
  public imagePreviewStatus: boolean = false;
  public croppedImage: any;
  public filePathOnServer: string;
  public previewImage: string
  public assementId: number;
  public ShowType: number;
  public relatedValue:any;
  public assesmentSelection: number;
  gridViewList: any[];
  evalCriteriaId: any;
  public selectedModuleName:any={};
  public ModuleConfig:customDropdownConfig[]=[];
  public relatedToConfig:customDropdownConfig[]=[];
  public relatedToValueConfig:customDropdownConfig[]=[];
  public selectedRelatedTo:any={};
  public selectedRelatedToValue:any={};
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  totalNoOfQues: any;
  totalWeightage: any;
  assmentPreviwArr: any={};
  weightageSum:number=0;
  arr=[];
  activeStepperIndex: number=0;
  minArr=[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
  resetFromSubjectRelatedTo: Subject<any> = new Subject<any>();
  panelOpenState: boolean = false;
  sectionCount: number;
  dirctionalLang;
  public AccessId: any;
  public AccessName: any;

//  kendo image uploader Adarsh singh 01-Aug-2023
@ViewChild('editor1') editor1: EditorComponent;
@ViewChild('editor2') editor2: EditorComponent;
@ViewChild('editor3') editor3: EditorComponent;
subscription$: Subscription;
// End 
public editorConfig: EDITOR_CONFIG;
public GuidLinesEditorConfig: EDITOR_CONFIG;
public getEditorVal:string;
public showErrorDesc: boolean=false;
public getRequiredValidationMassage: Subject<any> = new Subject<any>();
public getRequiredValidationMassageforGuidelines: Subject<any> = new Subject<any>();
public getRequiredValidationMassageForDis: Subject<any> = new Subject<any>();
public noSpaceDiscription:boolean
public getEditorValWelcomeText:string='';
public getEditorValWelcomeTextt:string='';
public getEditorValGuidelinest:string='';
  constructor(private commonService: CommonserviceService,private fb: FormBuilder, public dialog: MatDialog,private systemSettingService:SystemSettingService,
    private commonserviceService: CommonserviceService, private translateService: TranslateService,private serviceListClass: ServiceListClass,
    private snackBService: SnackBarService, private userAdministrationService:UserAdministrationService,private route: Router,
    private appSettingsService: AppSettingsService,private _imageUploadService: ImageUploadService, private routes: ActivatedRoute,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService, ) { 
            // who:maneesh,what:ewm-9383 for set access name public,when:11/05/2023
            this.AccessId=this.appSettingsService.getDefaultAccessId;
            this.AccessName=this.appSettingsService.getDefaultaccessName;
    this.addAssessmentGroup=this.fb.group({
      Id:[],
      Name:['',[Validators.required,Validators.maxLength(50),this.noWhitespaceValidator()]],
      Description:['',[Validators.required]],
      assessmentHrs:[0,[Validators.required]],
      assessmentMin:[15,[Validators.required]],
      ModuleId:[],
      RelatedTo:[],
      RelatedToValue:[],
      // who:maneesh,what:ewm-9383 for access name public value  ,when:11/05/2023
      AccessesPermissionName:[this.AccessName],
      AccessesPermissionId:[this.AccessId],
     // EvaluationCriteriaId:['3'],
      PatternId:['',[Validators.required]],
      Status:['',[Validators.required]]
    });

    this.addQuesGroup = this.fb.group({
      Id: [],
      SectionInfo: this.fb.array([]),
      QuesInfo:this.fb.array([]),
    });

    this.reviewFormGroup=this.fb.group({

    })

    this.guideLinesGroup=this.fb.group({
      Id:[],
      AssessmentId:[],
      Layout:['',[Validators.required]],
      LogoPath:['',[Validators.required]],
      WelcomeText:['',[Validators.required,this.noWhitespaceValidator()]],
      Guidelines:['',[Validators.required]]
    })
   
    this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;

      this.ModuleConfig['IsDisabled']=false;
      this.ModuleConfig['apiEndPoint']=this.serviceListClass.getModuleList;
      this.ModuleConfig['placeholder']='label_moduleName';
      this.ModuleConfig['searchEnable']=true;
      this.ModuleConfig['IsManage']='';
      this.ModuleConfig['IsRequired']=false;
      this.ModuleConfig['bindLabel']='ModuleName';
      this.ModuleConfig['multiple']=false;   

      this.relatedToConfig['IsDisabled']=false;
      this.relatedToConfig['apiEndPoint']=this.serviceListClass.getAssessmentRelatedTo;
      this.relatedToConfig['placeholder']='label_AssementRealtedTO';
      this.relatedToConfig['searchEnable']=true;
      this.relatedToConfig['IsManage']='';
      this.relatedToConfig['IsRequired']=false;
      this.relatedToConfig['bindLabel']='Name';
      this.relatedToConfig['multiple']=false;   

      this.relatedToValueConfig['IsDisabled']=false;
      this.relatedToValueConfig['searchEnable']=true;
      this.relatedToValueConfig['multiple']=true; 
      this.relatedToValueConfig['IsRequired']=false;
    


      
  }

  ngOnInit(): void {
    this.assementId=0;
    this.getStatusList();
    this.getRelatedTo();
    this.getModuleList();
    //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
    setTimeout(() => {
      this.selectedIn={Id: 1, StatusId: 1, StatusName: "Active"};
    }, 1500);
   
    this.evalCriteriaId='3';
    this.selectedLayout(1);
    this.routes.queryParams.subscribe((value) => {
      this.assementId = value.Id;
      if(this.assementId)
      {
        this.getStep1Info(this.assementId);
      }
    });
    this.showErrorDesc=false;
    this.editConfig();

    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_welcomeText',
      Tag:[],
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    // this.showErrorDesc=true;
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.GuidLinesEditorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_guidelines',
      Tag:[],
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    // this.showErrorDesc=true;
    this.getRequiredValidationMassageforGuidelines.next(this.GuidLinesEditorConfig);
  }

 
  /*
   @Type: File, <ts>
   @Name: openManageAccessModal
    @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
   @What: to open quick add Manage Access modal dialog
 */
   openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
     data: { candidateId:'', Id: Id, Name: Name, AccessModeId: this.oldPatchValues, ActivityType: 1 },
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isSubmit == true) {
        this.oldPatchValues = {};
        this.accessEmailId = [];
        
        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            //'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
           // 'MappingId': element[''],
          //  'Mode': 0
          });
        });

        this.addAssessmentGroup.patchValue({
          'AccessesPermissionName': res.AccessName,
          'AccessesPermissionId': res.AccessId[0].Id
        });
        this.oldPatchValues = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

      } else {

      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }


 /* 
  @Type: File, <ts>
  @Name: addSection function
  @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
  @What:creating assessment form array
*/
  addSection(){
    this.hideBtn=false;
  
    if(this.evalCriteriaId=='2' && this.weightageSum===100){
      this.openWarningDialog('label_SubtitleWeightage','label_TitleWeightage');
    }else{
      this.SectionInfo().push(this.createSection());
    }
    this.sectionCount=this.SectionInfo().length;
  //this.togglePanel();
  }

  
 /* 
  @Type: File, <ts>
  @Name: openWarningDialog function
  @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
  @What: on clicking next ADD SECTION
*/
  openWarningDialog(label_SubtitleWeightage,label_TitleWeightage){
    
    const message = label_SubtitleWeightage;
    const title = '';
    const subTitle = label_TitleWeightage;
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res==true){

      }
    })
  }
   /* 
  @Type: File, <ts>
  @Name: addQuestion function
  @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
  @What:creating assessment form array
*/
addQuestion(){
  this.hideBtn=false;
  this.questionInfo().push(this.createQuestion());
}

   /*
    @Type: File, <ts>
    @Name: createQuestion
    @Who: Renu
    @When: 07-March-2022
    @Why: EWM-1732 EWM-5338
    @What: for creating the single row
   */
    createQuestion() {
      return this.fb.group({
        ques: this.fb.array([])
      });
    }
  /*
  @Type: File, <ts>
  @Name: SectionInfo
  @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
  @What: for getting the formarray with this instance
  */

   SectionInfo(): FormArray {
    return this.addQuesGroup.get("SectionInfo") as FormArray
  }

   /*
  @Type: File, <ts>
  @Name: questionInfo
  @Who: Renu
  @When: 07-March-2022
  @Why: EWM-1732 EWM-5338
  @What: for getting the formarray with this instance
  */

  questionInfo(): FormArray {
    return this.addQuesGroup.get("QuesInfo") as FormArray
  }

  /*
    @Type: File, <ts>
    @Name: createSection
    @Who: Renu
    @When: 07-March-2022
    @Why: EWM-1732 EWM-5338
    @What: for creating the single row
   */
   createSection() {
    return this.fb.group({
      Id:[],
      isEditable:[true],
      Section: ['',[Validators.required,Validators.maxLength(50)]],
      ques: this.fb.array([],CustomValidatorQues.checkQues)
    });

  }

  /*
    @Type: File, <ts>
    @Name: addQuestainare
    @Who: Renu
    @When: 07-March-2022
    @Why: EWM-1732 EWM-5338
    @What: for creating the questionare mapped on particualr section
  */
    showQuesType(index:number){
      if(this.evalCriteriaId=='2'  && this.weightageSum===100){
        this.openWarningDialog('label_SubtitleWeightageMsg2','label_TitleWeightage');
      }else{
        this.ShowType=index;
      }
      
    }

  addQuestainare(i){
    const control = (<FormArray>this.addQuesGroup.controls['SectionInfo']).at(i).get('ques') as FormArray;
    control.push(this.createQuestions());
  }

   /*
   @Type: File, <ts>
   @Name: child
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1871
   @What: for getting the formarray with this instance
   */

  //  childInfo(pi): FormArray {
  //   return (<FormArray>this.addQuesGroup.controls['SectionInfo']).at(pi).get('ques') as FormArray;
  // }

/*
    @Type: File, <ts>
    @Name: createQuestions
    @Who: Renu
    @When: 07-March-2022
    @Why: EWM-1732 EWM-5338
    @What: for creating the questionare mapped on chosen question Type
  */
  createQuestions(){
    return this.fb.group({
      TypeName: ['', [Validators.required]],
      Id:[],
      TypeId:[],
      QuestionDesc:['',[Validators.required]],
      Weightage:[''],
      DisplaySeq:[],
      Options:this.fb.array([this.createItem()])
    });
    
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
      Description: ['',RxwebValidators.unique()],
      DisplaySeq:[]
    });
  }

  
  /*
   @Type: File, <ts>
   @Name: onCancelSection
   @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: prefetch section name info
   */
   onCancelSection(editedRow:FormGroup){
    editedRow.get('isEditable').setValue(false);
   }

    /*
   @Type: File, <ts>
   @Name: onSaveSection
   @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: on section edit
   */
   onSaveSection(editedRow:FormGroup){
    editedRow.get('isEditable').setValue(false);
    if(editedRow.get('Id').value==0 ||editedRow.get('Id').value=='' ||editedRow.get('Id').value==null){
     
    }else{
      let sectionArr={};
      if(editedRow.get('Id').value!==0 ||editedRow.get('Id').value!=='' ||editedRow.get('Id').value!==null){
      sectionArr['Id']=editedRow.get('Id').value?editedRow.get('Id').value:0;
      sectionArr['Name']=editedRow.get('Section').value?editedRow.get('Section').value:'';
      this.userAdministrationService.updateSectionName(sectionArr).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
      }
  
    }   
   }
   counter(i: number) {
    return new Array(i);
}
    /*
   @Type: File, <ts>
   @Name: onQuesTypeSelection
   @Who: Renu
   @When: 07 Mar 2022
   @Why: EWM-3571 EWM-4175
   @What: on questiontype Seelction
   */
  onQuesTypeSelection(i:number,type:number,editedRow:any,control:FormGroup,quesIndex:number){
   this.selected = type;
   let ques:any;
   let section:any;
   if(control!=null)
   {
    control.get('isEditable').setValue(false);
   }
 
   if(this.assesmentSelection==1){
    ques=(<FormArray>this.questionInfo()).at(i).get('ques');
   }else{
    section=(<FormArray>this.SectionInfo()).at(i).get('ques');
   }
  
   const dialogRef = this.dialog.open(AssessmentQuesComponent, {
      data: { Questype:type,evalCriteriaId:parseInt(this.evalCriteriaId),editedRow:editedRow,weightageSum:this.weightageSum},
      panelClass: ['xeople-modal-lg', 'assessment-question', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

  // --------@When: 16-01-2023 @who:Adarsh singh Desc- Adding RTL code --------
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

    // end 
     dialogRef.afterClosed().subscribe(res => {
      this.ShowType= -1;
      let response=res.res;
      let opArr=[];
      if(res.isSubmit==true){
        if(res.operation==true){
          if(this.assesmentSelection==1)
          {
            let opArr=[];
            if(response.TypeId===1 ||response.TypeId===4 )
            {
              opArr=[];
            }else{
              opArr=response.Options;
            }
        
            ques.controls[quesIndex].patchValue({
            TypeName: response.TypeName,
            Id:response.Id,
            TypeId:response.TypeId,
            QuestionDesc:response.QuestionDesc,
            Weightage:response.Weightage,
            WeightageId:response.WeightageId,
            Instruction:response.Instruction,
            Files:response.Files,
            DisplaySeq:response.DisplaySeq,
            Options:opArr
          })
          this.weightageSum=0;
          ques.value.forEach(element => {
            this.weightageSum= Number(this.weightageSum)+Number(element.Weightage);
          });
          }else{
            let opArr=[];
            if(response.TypeId===1 ||response.TypeId===4 )
            {
              opArr=[];
            }else{
              opArr=response.Options
            }
       
            section.controls[quesIndex].patchValue({
                  TypeName: response.TypeName,
                  Id:response.Id,
                  TypeId:response.TypeId,
                  QuestionDesc:response.QuestionDesc,
                  Weightage:response.Weightage,
                  WeightageId:response.WeightageId,
                  Instruction:response.Instruction,
                  Files:response.Files,
                  DisplaySeq:response.DisplaySeq,
                  Options:opArr
            })
            this.weightageSum=0;
           
            (this.SectionInfo().controls).forEach((element,index) => {
              let data=(<FormArray>element).controls['ques'] as FormArray;
              (data.controls).forEach((y,index) => {
               let val=(<FormArray>y).controls['Weightage'].value;
               this.weightageSum= Number(this.weightageSum)+Number(val);
              });
         
            });
          
          }
        }else{
          
          // this.arr.push(response.Weightage);
          // this.weightageSum=this.sumWeightage(this.arr);
          if(this.assesmentSelection==1)
          {
           
            if(response.TypeId===1 ||response.TypeId===4 )
            {
              opArr=[];
            }else{
              opArr=[response.Options]
            }
        
            (<FormArray>ques).push(
              this.fb.group({
                    TypeName: [response.TypeName,[Validators.required]],
                    Id:[response.Id],
                    TypeId:[response.TypeId],
                    QuestionDesc:[response.QuestionDesc,[Validators.required]],
                    Weightage:[response.Weightage],
                    WeightageId:[response.WeightageId],
                    Instruction:[response.Instruction],
                    Files:[response.Files],
                    DisplaySeq:[],
                    Options:opArr
              })
             )
             this.weightageSum=0;
            
             ques.value.forEach(element => {
               this.weightageSum= Number(this.weightageSum)+Number(element.Weightage);
             });
             
          }else{
           
            if(response.TypeId===1 ||response.TypeId===4 )
            {
              opArr=[];
            }else{
              opArr=[response.Options]
            }
          
          (<FormArray>section).push(
            this.fb.group({
                  TypeName: [response.TypeName,[Validators.required]],
                  Id:[response.Id],
                  TypeId:[response.TypeId],
                  QuestionDesc:[response.QuestionDesc,[Validators.required]],
                  Weightage:[response.Weightage],
                  WeightageId:[response.WeightageId],
                  Instruction:[response.Instruction],
                  Files:[response.Files],
                  DisplaySeq:[],
                  Options:opArr
            })
           )
           this.weightageSum=0;
       
           (this.SectionInfo().controls).forEach((element,index) => {
             let data=(<FormArray>element).controls['ques'] as FormArray;
             (data.controls).forEach((y,index) => {
              let val=(<FormArray>y).controls['Weightage'].value;
              this.weightageSum= Number(this.weightageSum)+Number(val);
             });
        
           });
         }
        }
     // this.snackBService.showSuccessSnackBar(this.translateService.instant('label_succcessmsg'), '200');
      }
     })
  }


   sumWeightage(arr) {  
    let sum = 0;   
    for (let i = 0; i < arr.length; i++)  
        sum = Number(sum)+ Number(arr[i]);  

    return sum;  
}  
  /*
  @Type: File, <ts>
  @Name: drop function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: For drag & drop functionality
   */
  drop(event: CdkDragDrop<string[]>,index:number) {
    let valueInfo:any;
    let control:any;
    if(this.assesmentSelection==1){
      control = (<FormArray>this.addQuesGroup.controls['QuesInfo']).at(index).get('ques') as FormArray;
      valueInfo= ((<FormArray>this.addQuesGroup.controls['QuesInfo']).at(index).get('ques') as FormArray).controls.values;
      this.moveItemInFormArray(control,event.previousIndex, event.currentIndex)
      //moveItemInArray(control.controls, event.previousIndex, event.currentIndex);
     // moveItemInArray(valueInfo, event.previousIndex, event.currentIndex);
    }else{
      control = (<FormArray>this.addQuesGroup.controls['SectionInfo']).at(index).get('ques') as FormArray;
      valueInfo= ((<FormArray>this.addQuesGroup.controls['SectionInfo']).at(index).get('ques') as FormArray).controls.values;
     // moveItemInArray(control.controls, event.previousIndex, event.currentIndex);
     // moveItemInArray(valueInfo, event.previousIndex, event.currentIndex);
     this.moveItemInFormArray(control,event.previousIndex, event.currentIndex)
    }
  
   }  

    /*
  @Type: File, <ts>
  @Name: moveItemInFormArray function
  @Who: Renu
  @When: 22-Aprl-2022
  @Why: ROST-2086
  @What:  Moves an item in a FormArray to another position.
   */
   
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
  @Who: Renu
  @When: 22-Aprl-2022
  @Why: ROST-2086
  @What:  Clamps a number between zero and a maximum.
   */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }

   /*
    @Type: File, <ts>
    @Name: getStatusList function
    @Who: Renu
    @When: 19-Jul-2021
    @Why: ROST-1732 EWM-5427
    @What: For status listing
   */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  
   /*
    @Type: File, <ts>
    @Name: getRelatedTo function
    @Who: Renu
    @When: 09-March-2022
    @Why: ROST-1732 EWM-5427
    @What: For Related TO listing
   */

  getRelatedTo(){
 this.userAdministrationService.fetchAssessmentRelatedTo().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.RelatedToList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /* 
@Type: File, <ts>
@Name: onAssesmentPatternSelection function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: get industry List
 */
onAssesmentPatternSelection(data) {
 this.assesmentSelection=data.value;
 
}

/* 
@Type: File, <ts>
@Name: onChangeRelatedTo function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: get industry List
 */
onChangeRelatedTo(value){
  this.relatedValue=[];
  this.getdropdownList(value);
}

/* 
@Type: File, <ts>
@Name: getdropdownList function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: get api dynamic call for realted to field chosen
 */
getdropdownList(value) {

  if (value != undefined && value != null && value != '') {
    this.config=value;
    this.keyValue=value.APIKey;
    if(value.IsMultiple==false){
      this.isMultiple = false;
    }else{
      this.isMultiple = true;
    }
      this.commonserviceService.getGenericDropdownList(this.apiGateWayUrl + value?.API).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          
            this.dropList = repsonsedata.Data;
          }
        }, err => {
         
          this.dropList= [];
        })
    
  }

}

/* 
@Type: File, <ts>
@Name: convertH2M function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: function to convert hh:mm into minutes in resultant
 */


convertH2M(timeInHour){
  var timeParts = timeInHour.split(":");
  return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

/* 
@Type: File, <ts>
@Name: convertH2M function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: function to convert minutes into hh:mm in resultant
 */

convertM2HM(value){
  let  temp = value * 60;
  const hours = Math.floor((temp/3600));
  const minutes: number = Math.floor((temp/ 60)/60);
  return hours + ':' + minutes;
}
/* 
@Type: File, <ts>
@Name: saveStep1 function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: save first step 1 data
 */
saveStep1(){
  this.submitted = true;
    if (this.addAssessmentGroup.invalid) {
      this.addAssessmentGroup.markAllAsTouched();
      return;
    }
  else{
    this.addAssessmentGroup.markAllAsTouched();
    this.insertStep1();
  }
}

/* 
@Type: File, <ts>
@Name: getStep1Info function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: get first step 1 information  by ID
 */

getStep1Info(assementId:number){
  if(this.assementId==0)
    {
      this.insertStep1();
    }else{
  this.loading = true;
  this.userAdministrationService.getStep1InfoById('?id=' + assementId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        if(data.Data.RelatedToId!=0)
        {
        let relatedData={Id:data.Data.RelatedToId,Name:data.Data.RelatedTo,APIKey:data.Data.APIKey,API:data.Data.API};
       this.onRealtedTochange(relatedData);
        }else{
          this.onRealtedTochange(null);
        }
        this.selectedIn={Id: 1, StatusId: 1, StatusName: "Active"};
        if(data.Data.Modules.length!=0){

        let moduleData={Id:data.Data.Modules[0]?.Id,ModuleName:data.Data.Modules[0]?.Name};
        this.onModulechange(moduleData);
        }else{
          this.onModulechange(null);
        }
      
        this.addAssessmentGroup.patchValue({
          Id:data.Data.Id,
          Name:data.Data.Name,
          Description:data.Data.Description,
          assessmentHrs:  Math.floor(data.Data.Duration / 60),
          assessmentMin:  Math.floor(data.Data.Duration % 60),
          AccessesPermissionName:data.Data.AccessPermissionName,
          AccessesPermissionId:data.Data.AccessPermissionId,
         // EvaluationCriteriaId:String(data.Data.EvaluationCriteriaId),
          PatternId:String(data.Data.PatternId),
        });
        this.getEditorVal=data.Data?.Description;//by maneesh
        this.oldPatchValues = { 'AccessId': data.Data.AccessPermissionId, 'GrantAccesList':data.Data.GrantAccesses }
        this.addAssessmentGroup.get('PatternId').disable();
       // this.addAssessmentGroup.get('EvaluationCriteriaId').disable();
        //this.onChangeRelatedTo(relatedData);
        let array = data.Data.RelatedToValue;
        this.selectedRelatedToValue = array.map(function(obj) {
            return {Id: obj.Id};
        });
        //this.evalCriteriaId=data.Data.EvaluationCriteriaId;
        this.assesmentSelection=Number(data.Data.PatternId);
      }
      else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
  }
}

compareFunction(c1, c2) {
  // any logic to compare the objects and return true or false
      return   c1 && c2 ? c1['Id'] === c2['Id'] : c1 === c2; 

    }
/* 
@Type: File, <ts>
@Name: insertStep1 function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: save first step 1 information
 */

insertStep1(){
  let value:any=this.addAssessmentGroup.getRawValue();
  let assementStep1={};
  assementStep1['Id']=value.Id?value.Id:0;
  assementStep1['Name']=value.Name?value.Name:'';
  assementStep1['Description']=(value?.Description)?(value?.Description):'';
  let duration=value.assessmentHrs+':'+value.assessmentMin;
  assementStep1['Duration']=duration?this.convertH2M(duration):0;
  let moduleArr:any[]=[];
  if(this.selectedModuleName && Object.keys(this.selectedModuleName).length)
  {
    moduleArr.push({
      'Id':this.selectedModuleName.Id,
      'Name':this.selectedModuleName.ModuleName
    });
  }else{
    moduleArr=[];
    }
  
  assementStep1['Modules']=moduleArr;
  assementStep1['RelatedTo']=(this.selectedRelatedTo)?(this.selectedRelatedTo?.Name):'';
  assementStep1['RelatedToId']=(this.selectedRelatedTo)?(this.selectedRelatedTo?.Id):0;
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
  
  assementStep1['RelatedToValue']=arr;
  assementStep1['AccessPermissionId']=(value?.AccessesPermissionId)?(value?.AccessesPermissionId):0;
  assementStep1['AccessPermissionName']=(value?.AccessesPermissionName)?(value?.AccessesPermissionName):'';
  //assementStep1['EvaluationCriteriaId']=(value?.EvaluationCriteriaId)?parseInt(value?.EvaluationCriteriaId):0;
  //assementStep1['EvaluationCriteriaName']=(value?.EvaluationCriteriaId)?creteria[parseInt(value?.EvaluationCriteriaId)-1]:0;
  assementStep1['PatternId']=(value?.PatternId)?parseInt(value?.PatternId):0;
  assementStep1['Pattern']=(value?.PatternId)?pattern[parseInt(value?.PatternId)-1]:'';
  assementStep1['StatusId']=(value?.Status)?(value?.Status?.StatusId):0;
  assementStep1['Status']=(value?.Status)?(value?.Status?.StatusName):0;
  assementStep1['GrantAccesses']=this.accessEmailId;

  this.userAdministrationService.addAssementStep(assementStep1).subscribe((repsonsedata: any) => {
    if (repsonsedata.HttpStatusCode == 200) {
      this.loading = false;
      if(this.assesmentSelection==1){
        this.questionInfo().clear();
        this.addQuestion();
      }else{
        this.SectionInfo().clear();
        this.addSection();
      }
      this.assementId=repsonsedata.Data?.Id;
      this.stepper.selected.completed = true;
      this.stepper.next();
      this.addAssessmentGroup.reset();
    //  this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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

/* 
@Type: File, <ts>
@Name: onChangeMinutes function
@Who: Renu
@When: 17-March-2022
@Why: ROST-1732 EWM-5427
@What: on change dropdown min
 */
onChangeMinutes(event){
if(this.addAssessmentGroup.get('assessmentHrs').value==0 && event<15){
  this.addAssessmentGroup.get("assessmentMin").setErrors({ 'minTaken': true });
  this.addAssessmentGroup.get("assessmentMin").markAsDirty();
}else{
  this.addAssessmentGroup.get("assessmentMin").setErrors({'minTaken': null});
  this.addAssessmentGroup.get("assessmentMin").updateValueAndValidity();

}
}

/* 
@Type: File, <ts>
@Name: onChangehrs function
@Who: Renu
@When: 17-March-2022
@Why: ROST-1732 EWM-5427
@What: when change the dropdown hrs
 */
onChangehrs(event){
  if(event==0 && this.addAssessmentGroup.get('assessmentMin').value<15){
    this.addAssessmentGroup.get("assessmentMin").setErrors({ 'minTaken': true });
    this.addAssessmentGroup.get("assessmentMin").markAsDirty();
  }else{
    this.addAssessmentGroup.get("assessmentMin").setErrors({'minTaken': null});
    this.addAssessmentGroup.get("assessmentMin").updateValueAndValidity();
  }
  }
  
/* 
@Type: File, <ts>
@Name: onNameChanges function
@Who: Renu
@When: 17-March-2022
@Why: ROST-1732 EWM-5427
@What: cehck duplicacy of the assessment Name
 */
onNameChanges() {
  let Id;
  if (this.tempID != undefined) {
    Id = this.tempID;
  } else {
    Id = "";
  }    
  
  Id = this.addAssessmentGroup.get("Id").value!=null?this.addAssessmentGroup.get("Id").value:0;
  let Name = this.addAssessmentGroup.get("Name").value;    

  if (this.addAssessmentGroup.get("Name").value) {
    this.userAdministrationService.checkAssessmentName(Id,Name).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Data== false) {
            this.addAssessmentGroup.get("Name").setErrors({ nameTaken: true });
            this.addAssessmentGroup.get("Name").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Data == true) {
            this.addAssessmentGroup.get("Name").clearValidators();
            this.addAssessmentGroup.get("Name").markAsPristine();
            this.addAssessmentGroup.get('Name').setValidators([Validators.required,Validators.maxLength(50),this.noWhitespaceValidator()]);
            if(this.submitted && !this.addAssessmentGroup.invalid){
             // this.updatePosition(this.addAssessmentGroup.value);
            }              
          }
        }
        else if (repsonsedata.HttpStatusCode === 400) {
          this.addAssessmentGroup.get("Name").clearValidators();
          this.addAssessmentGroup.get("Name").markAsPristine();
          this.addAssessmentGroup.get('Name').setValidators([Validators.required,Validators.maxLength(50),this.noWhitespaceValidator()]);

        }

        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
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
  else {
    this.addAssessmentGroup.get('Name').setValidators([Validators.required,this.noWhitespaceValidator()]);

  }
  this.addAssessmentGroup.get('Name').updateValueAndValidity();
}

/* 
@Type: File, <ts>
@Name: getModuleList function
@Who: Renu
@When: 21-March-2022
@Why: ROST-1732 EWM-5427
@What: get module List
 */

getModuleList(){
  this.systemSettingService.getModulesListByTenant().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.moduleArray = repsonsedata.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

 /*
    @Who: Renu
    @When: 28-june-2021
    @Why: EWM-1895
    @What: to compare objects selected
  */
    compareFn(c1: any, c2:any): boolean {   
      return c1 && c2 ? c1.Id === c2.Id : c1 === c2; 
  }
  

  /*
    @Who: Renu
    @When: 14-Aprl-2022
    @Why: EWM-5339 EWM-5481
    @What: for selection of layout 
  */
  selectedLayout(layoutId:number){
    this.chosenLayout=layoutId;
    this.guideLinesGroup.patchValue({
      Layout:layoutId
    })
  }

/* 
  @Type: File, <ts>
  @Name: saveStep3 function
  @Who: Renu
  @When: 21-March-2022
  @Why: ROST-1732 EWM-5427
  @What: save step 3 guidlines data
*/


  saveStep3(){
    this.submitted = true;
    if (this.guideLinesGroup.invalid) {
      this.guideLinesGroup.markAllAsTouched();
      return;
    }
  else{
    this.guideLinesGroup.markAllAsTouched();
    this.uploadImageFileInBase64();
   // this.insertStep3();
  }
}


/* 
  @Type: File, <ts>
  @Name: insertStep3 function
  @Who: Renu
  @When: 14-Aprl-2022
  @Why: ROST-1732 EWM-5427
  @What: save step 3 guidlines data
*/


insertStep3(){
  let value:any=this.guideLinesGroup.value;
  let assementStep3={};
  assementStep3['Id']=value.Id?value.Id:0;
  assementStep3['AssessmentId']=this.assementId?this.assementId:0;
  assementStep3['Guidelines']=value.Guidelines?value.Guidelines:'';
  assementStep3['Layout']=value.Layout?value.Layout:'';
  assementStep3['LogoPath']=value.LogoPath?value.LogoPath:'';
  assementStep3['WelcomeText']=value.WelcomeText?value.WelcomeText:'';
 
  this.userAdministrationService.addAssementGuidelinesStep(assementStep3).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode == 200) {
      this.loading = false;
      this.stepper.selected.completed = true;
      this.stepper.next();
     // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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


/*
 @Type: File, <ts>
 @Name: croppingImage
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-1732 EWM-5427
 @What: for cropping image logo
 */
 
    croppingImage(uploadMethod: any, logoPreviewUrl: any) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "";
      dialogConfig.width = "100%";
      dialogConfig.panelClass = 'myDialogCroppingImage';
      dialogConfig.data = new Object({ type: this.appSettingsService.getImageTypeSmall(), size: this.appSettingsService.getImageSizeLarge(), uploadMethod: uploadMethod, imageData: logoPreviewUrl,title:'Add Logo', ratioStatus:false , recommendedDimensionSize:true, recommendedDimensionWidth:'120',recommendedDimensionHeight:'50' });
  
      const modalDialog = this.dialog.open(ImageUploadAdvancedComponent, dialogConfig);
      modalDialog.afterClosed().subscribe(res => {
        if (res != undefined && res.data != undefined && res.data != '') {
       
          this.imagePreviewStatus=true;
          this.previewImage = res.data;
          this.croppedImage=res.data;
          this.guideLinesGroup.get('LogoPath').setValue(this.previewImage);
         // this.uploadImageFileInBase64();
        }
      })

      // RTL Code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

    }
  
  /*
 @Type: File, <ts>
 @Name: uploadImageFileInBase64
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-1732 EWM-5427
 @What: upload image file in base64
 */
  uploadImageFileInBase64() {
    this.imagePreviewloading = true;
    if(this.croppedImage){
      const formData = { 'base64ImageString': this.croppedImage };
      // this._imageUploadService.ImageUploadBase64(formData).subscribe(
      //   repsonsedata => {
          this.imagePreviewStatus = true;
          localStorage.setItem('Image', '2');
          this.imagePreviewloading = false;
          let result=this._imageUploadService.uploadByUrlMethod( this.croppedImage ,1);
          result.subscribe((res:any)=>{
            if(res){
             this.imagePreviewloading = false;
             this.previewImage =res.filePathOnServer;
             this.filePathOnServer = res.imagePreview;
             this.guideLinesGroup.get('LogoPath').setValue(this.previewImage);
             this.insertStep3();
            }else{
             this.imagePreviewloading = false;
            }
        // }, err => {
        //   //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
        //   this.imagePreviewloading = false;
      }) 
    }else{
      this.insertStep3();
      this.imagePreviewloading = false;
    }
    
  }

  /*
 @Type: File, <ts>
 @Name: openDialog
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-1732 EWM-5427
 @What: view image in full size
 */
    openDialog(Image): void {
      let data: any;
      data = { "title": 'title', "type": 'Image', "content": Image };
      const dialogRef = this.dialog.open(ModalComponent, {
        width: '224px',
        disableClose: true,
        data: data,
        panelClass:  ['imageModal', 'animate__animated','animate__zoomIn']
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  
 /*
 @Type: File, <ts>
 @Name: openDialog
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-1732 EWM-5427
 @What: to remove logo
 */

removeLogo() {
  this.filePathOnServer = '';
  this.previewImage = '';
  this.imagePreviewStatus = false;
  this.guideLinesGroup.patchValue({
    'LogoPath': ''
  })
}


 /*
 @Type: File, <ts>
 @Name: onStepChange
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-5340 EWM-5485
 @What: to check current active index
 */
public onStepChange(event: any): void {
  this.activeStepperIndex=event.selectedIndex;

  if(event.selectedIndex==0)
  {
    this.getStep1Info(this.assementId);
  }
  if(event.selectedIndex==1)
  {
    this.weightageSum=0;
    this.getStep2Info(this.assementId);
  }
  if(event.selectedIndex==2)
  {
    if(this.evalCriteriaId=='2' && this.weightageSum!=100){
      this.openWarningDialog('label_SubtitleWeightageMsg','label_TitleWeightage');
      this.stepper.selected.interacted = false;
        }else
        {
          this.getStep3Info(this.assementId);
        }

  }
  if(event.selectedIndex==3){
    if(this.evalCriteriaId=='2' && this.weightageSum!=100){
      this.openWarningDialog('label_SubtitleWeightageMsg','label_TitleWeightage');
      this. stepper.selected.interacted = false;
        }else{
 this.getStep4List();
        }
   
  }
  
 
  
}
/*
 @Type: File, <ts>
 @Name: getStep2Info
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: get list of step2 data
 */

getStep2Info(assementId:number){
  if(this.assementId==0)
  {
    this.insertStep2();
  }else{
this.loading = true;
this.userAdministrationService.getStep2InfoById('?id=' + assementId).subscribe(
  (data: ResponceData) => {
    this.loading = false;
    if (data.HttpStatusCode === 200) {
      this.arr=[];
      let res=data.Data;
      this.addQuesGroup.patchValue({
        Id: res.Id
      })
     if(this.assesmentSelection==1){
      const QuestInfo = this.addQuesGroup.get('QuesInfo') as FormArray;
      QuestInfo.clear();
      QuestInfo.push(
        this.fb.group({
          ques: this.fb.array([])
        })
      )
     
      res.Questions.forEach((y, index) => {
        let opArr=[];
        if(y.TypeId===1 ||y.TypeId===4 )
        {
          opArr=[];
        }else{
          opArr=[y.Options]
        }
        (<FormArray>QuestInfo.at(0).get('ques')).push(
          this.fb.group({
            TypeName: [y['TypeName'], [Validators.required]],
            Id:[y['Id']],
            TypeId:[y['TypeId']],
            QuestionDesc:[y['Description'],[Validators.required]],
            Weightage:[y['Weightage']],
            WeightageId:[y['WeightageId']],
            Instruction:[y['Instruction']],
            Files:[y['Files']],
            DisplaySeq:Number(index+1),
            Options:opArr        
          })
        )
        this.arr.push(y['Weightage']);
        this.weightageSum=this.sumWeightage(this.arr);
        });
     }else{
      
  
     
      const SectionInfo = this.addQuesGroup.get('SectionInfo') as FormArray;
      SectionInfo.clear();
      res.Sections.forEach((x, index) => {
        
        SectionInfo.push(
          this.fb.group({
            Id:[x['Id']],
            isEditable:[false],
            Section: [x['Name'], [Validators.required,Validators.maxLength(50)]],
            ques: this.fb.array([])
                      
          })
        )
        res.Sections[index].Questions.forEach((y, jindex) => {
          let opArr=[];
          if(y.TypeId===1 ||y.TypeId===4 )
          {
            opArr=[];
          }else{
            opArr=[y.Options]
          }
        const Ques = (<FormArray>this.SectionInfo()).at(index).get('ques') as FormArray;
        //Ques.clear();
        Ques.push(
          this.fb.group({
            TypeName: [y['TypeName'], [Validators.required]],
            Id:[y['Id']],
            TypeId:[y['TypeId']],
            QuestionDesc:[y['Description'],[Validators.required]],          
            Weightage:[y['Weightage']],
            WeightageId:[y['WeightageId']],
            Instruction:[y['Instruction']],
            Files:[y['Files']],
            DisplaySeq:Number(jindex+1),
            Options:opArr
          })
        )
        this.arr.push(y['Weightage']);
        this.weightageSum=this.sumWeightage(this.arr);
      })
     })
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
}
 /*
 @Type: File, <ts>
 @Name: getStep4List
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: get list of step4 data
 */
getStep4List(){
  this.loading = true;
  this.userAdministrationService.getStep4Info(this.assementId,this.assesmentSelection).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 ) {
        this.loading = false;
        if (repsonsedata.Data) {
          this.assmentPreviwArr=repsonsedata.Data;
          this.totalNoOfQues=repsonsedata.Data.TotalNoOfQuestion;
          this.totalWeightage=repsonsedata.Data.AssessmentWeightage;
          if(this.assesmentSelection==1){
            this.gridViewList = repsonsedata.Data.ReviewQuestions;
          }else{
            this.gridViewList = repsonsedata.Data.ReviewSections;
          }
        
        }
      
      } else if(repsonsedata.HttpStatusCode == 204) {          
        this.gridViewList = [];
         this.loading = false;
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
 @Name: confirmDialog
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: delete row of questions added
 */

confirmDialog(deleteRow:any,sectionIndex:number,quesIndex:number){
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = '';//lable_question
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      // this.weightageSum=Number(this.weightageSum)-Number(deleteRow.controls['Weightage'].value);
      // const index: number = this.arr.indexOf(deleteRow.controls['Weightage'].value);
      // if (index !== -1) {
      //     this.arr.splice(index, 1);
      // } 
      if(this.assesmentSelection==1){
        const control = (<FormArray>this.addQuesGroup.controls['QuesInfo']).at(sectionIndex).get('ques') as FormArray;
        control.removeAt(quesIndex);
        this.weightageSum=0;
             control.value.forEach(element => {
               this.weightageSum= Number(this.weightageSum)+Number(element.Weightage);
             });
          
      }else{
        const control = (<FormArray>this.addQuesGroup.controls['SectionInfo']).at(sectionIndex).get('ques') as FormArray;
        control.removeAt(quesIndex);
        this.weightageSum=0;
             control.value.forEach(element => {
               this.weightageSum= Number(this.weightageSum)+Number(element.Weightage);
             });
      }

    if(deleteRow.controls['Id'].value!=null){
      let delObj={};
      delObj['Id']=deleteRow.controls['Id'].value;
        this.userAdministrationService.deleteQuestion(delObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
  
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
    }
  
    }
  });
}

/* 
@Type: File, <ts>
@Name: onEvalCriteriaSelection function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: get selected evaluation criteria
 */

onEvalCriteriaSelection(event){
this.evalCriteriaId=event.value;
}

/* 
@Type: File, <ts>
@Name: saveStep2 function
@Who: Renu
@When: 09-March-2022
@Why: ROST-1732 EWM-5427
@What: save  step 2 data
 */
saveStep2(){
  if(this.evalCriteriaId=='2' && this.weightageSum!=100){
    this.openWarningDialog('label_SubtitleWeightageMsg','label_TitleWeightage');
    return;
  }
  this.submitted = true;
    if (this.addQuesGroup.invalid) {
      this.addQuesGroup.markAllAsTouched();
      return;
    }
  else{
    this.addQuesGroup.markAllAsTouched();
    this.insertStep2();
  }
}

/* 
@Type: File, <ts>
@Name: insertStep2 function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: save first step 1 information
 */

insertStep2(){
  
  let value:any=this.addQuesGroup.value;
  let quesArr:any[]=[];
  let sectionArr:any[]=[];
  let assementStep2={};
  assementStep2['Id']=this.assementId?this.assementId:0;
 //assementStep2['EvaluationCriteriaId']=parseInt(this.evalCriteriaId);
  if(this.assesmentSelection==1)
  {

    value?.QuesInfo[0]?.ques?.forEach((element,index) => {
      let options=[];
      if( element.Options!=null)
        {
      element.Options.forEach((x,xindex) => {
        options.push({
          'DisplaySeq':Number(xindex + 1),
          'Id':x.Id?x.Id:0,
          'IsCorrect':x.IsCorrect?Number(x.IsCorrect):0,
          'Description':x.Description,
          "WeightageId": x.WeightageId,
          "Weightage": x.Weightage,
          "Instruction": x.Instruction,
          "Files":x.Files
        })
        
      })
    }else{
      options=[];
    }
      quesArr.push({
        'DisplaySeq':Number(index + 1),
        'Id':element.Id?element.Id:0,
        'TypeId':element.TypeId?element.TypeId:0,
        'TypeName':element.TypeName,
        'Description':element.QuestionDesc,
        'Weightage':element.Weightage?Number(element.Weightage):0,
        "WeightageId": element.WeightageId,
        "Instruction": element.Instruction,
        'Options':options,
        "Files":element.Files
      })
    });
  }else{
    
    value?.SectionInfo.forEach((element,index) => {
      let arr=[];
     
      element?.ques.forEach((y,qindex) => {
        let options=[];
        if(y.Options!=null)
        {
          y.Options.forEach((x,xindex) => {
            options.push({
              'DisplaySeq':Number(xindex + 1),
              'Id':x.Id?x.Id:0,
              'IsCorrect':x.IsCorrect?Number(x.IsCorrect):0,
              'Description':x.Description,
              "Weightage": x.Weightage,
              "WeightageId": x.WeightageId,
              "Instruction": x.Instruction,
              "Files":x.Files
            })
          })
        }else{
          options=[];
        }
   
       arr.push({
          'DisplaySeq':Number(qindex + 1),
          'Id':y.Id?y.Id:0,
          'TypeId':y.TypeId?y.TypeId:0,
          'TypeName':y.TypeName,
          'Description':y.QuestionDesc,
          'Weightage':y.Weightage?Number(y.Weightage):0,
          'Options':options,
          "WeightageId": y.WeightageId,
          "Instruction": y.Instruction,
          "Files":y.Files
        })
       
      });
      sectionArr.push({
        'DisplaySeq':Number(index + 1),
        'Id':element.Id?element.Id:0,
        'Name':element.Section,
        'Questions':arr,
        "Weightage": element.Weightage,
        "WeightageId": element.WeightageId,
        "Instruction": element.Instruction,
        "Files":element.Files
      })
    });
  }
  
 
  assementStep2['Sections']=sectionArr?sectionArr:[];
  assementStep2['Questions']=quesArr?quesArr:[];

  this.userAdministrationService.addAssementQuestionsStep(assementStep2).subscribe((repsonsedata: any) => {
    if (repsonsedata.HttpStatusCode == 200) {
      this.loading = false;
      this.stepper.selected.completed = true;
      if(this.evalCriteriaId=='2' )
      {
         if(this.weightageSum===100){
          this.stepper.next();
          this.addQuesGroup.reset();
         }else{
          this.openWarningDialog('label_SubtitleWeightageMsg','label_TitleWeightage');
         }
       
      }else{
        this.stepper.next();
        this.addQuesGroup.reset();
      }
    
    //  this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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



/* 
@Type: File, <ts>
@Name: onModulechange function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: on change module name
 */

onModulechange(data){  
    if(data==null || data=="")
    {
      this.selectedModuleName=null;
      this.addAssessmentGroup.patchValue(
        {
          ModuleId:null
        })
      // this.addAssessmentGroup.get("ModuleId").setErrors({ required: true });
      // this.addAssessmentGroup.get("ModuleId").markAsTouched();
      // this.addAssessmentGroup.get("ModuleId").markAsDirty();
    }
    else
    {
      this.selectedModuleName=data;
      this.addAssessmentGroup.get("ModuleId").clearValidators();
      this.addAssessmentGroup.get("ModuleId").markAsPristine();
    
      this.addAssessmentGroup.patchValue(
        {
          ModuleId:data.Id
        }
     )
    
    }
  }
  
/* 
@Type: File, <ts>
@Name: onRealtedToValuechange function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
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
    this.addAssessmentGroup.get("RelatedToValue").clearValidators();
    this.addAssessmentGroup.get("RelatedToValue").markAsPristine();   
    this.addAssessmentGroup.patchValue(
      {
        RelatedToValue:data.Id
      }
   )
    }
}

  /* 
@Type: File, <ts>
@Name: onRealtedTochange function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: on change Realted To
 */

onRealtedTochange(data){    
  this.selectedRelatedToValue=null;
  if(data==null || data=="")
  {
   // this.addAssessmentGroup.get("RelatedTo").setErrors({ required: true });
   // this.addAssessmentGroup.get("RelatedTo").markAsTouched();
    //this.addAssessmentGroup.get("RelatedTo").markAsDirty();
    this.selectedRelatedTo=null;
    this.addAssessmentGroup.patchValue(
      {
        RelatedTo:null
      })
  }
  else
  {
    this.selectedRelatedTo=data;
    this.addAssessmentGroup.get("RelatedTo").clearValidators();
    this.addAssessmentGroup.get("RelatedTo").markAsPristine();   
    this.addAssessmentGroup.patchValue(
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
@Name: clearFormdata function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: on cancel click at any stage & redirection
*/
clearFormdata(){
  const message = ``;
  const title = '';
  const subTitle = 'label_onCancelAssesTitle';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult==true){
      this.route.navigate(['./client/core/administrators/assessment']);
    }     
  });
}

/*
  @Type: File, <ts>
  @Name: drop function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: For drag & drop functionality
   */
  dropReviewSection(event: CdkDragDrop<string[]>) {
      moveItemInArray(event.container.data,event.previousIndex,event.currentIndex);
      let quesArr=[];
      let sectionArr=[];
     if(this.assesmentSelection==1){
        this.assmentPreviwArr.ReviewQuestions.forEach((element,index) => {
          quesArr.push({
            'DisplaySeq': Number(index+1),
            'Id': element.Id,
            'Name': element.Name,
            'Type': element.Type,
            'Weightage': element.Weightage,
          })
        });

     }else{
        this.assmentPreviwArr.ReviewSections.forEach((element,index) => {
          sectionArr.push({
            'DisplaySeq': Number(index+1),
            'Id': element.Id,
            'Name': element.Name,
            'Type': element.Type,
            'Weightage': element.Weightage,
          })
        });
     
     }
      let delObj={};
      delObj['Id']=this.assementId;
      delObj['AssessmentPatternId']=Number(this.assesmentSelection);
      delObj['Deleted']=[];
      if(this.assesmentSelection==1){
      delObj['Rearrange']=quesArr?quesArr:[];
      }else{
        delObj['Rearrange']=sectionArr?sectionArr:[];
      }
  
        this.userAdministrationService.deleteAssessmentStep4(delObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
            //  this.getStep4List();
             } else {
            //  this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
  
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
  
   }  


   /*
 @Type: File, <ts>
 @Name: confirmDialogStep4
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: delete assement in step 4
 */

confirmDialogStep4(deleteRow:any){
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle ='';// deleteRow.Name +' '+ this.translateService.instant('label_DeleteAssement');
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      let quesArr=[];
      let sectionArr=[];
     if(this.assesmentSelection==1){
        const index: number =  this.assmentPreviwArr.ReviewQuestions.indexOf(deleteRow);
        if (index !== -1) {
            this.assmentPreviwArr.ReviewQuestions.splice(index, 1);
        }  
        this.assmentPreviwArr.ReviewQuestions.forEach((element,index) => {
          quesArr.push({
            'DisplaySeq': Number(index+1),
            'Id': element.Id,
            'Name': element.Name,
            'Type': element.Type,
            'Weightage': element.Weightage,
          })
        });

     }else{
      const index: number =  this.assmentPreviwArr.ReviewSections.indexOf(deleteRow);
      if (index !== -1) {
          this.assmentPreviwArr.ReviewSections.splice(index, 1);
      } 
      
        this.assmentPreviwArr.ReviewSections.forEach((element,index) => {
          sectionArr.push({
            'DisplaySeq': Number(index+1),
            'Id': element.Id,
            'Name': element.Name,
            'Type': element.Type,
            'Weightage': element.Weightage,
          })
        });
     
     }
    let delObj={};
    delObj['Id']=this.assementId;
    delObj['AssessmentPatternId']=Number(this.assesmentSelection);
    delObj['Deleted']=[deleteRow];
    if(this.assesmentSelection==1){
    delObj['Rearrange']=quesArr?quesArr:[];
    }else{
      delObj['Rearrange']=sectionArr?sectionArr:[];
    }

      this.userAdministrationService.deleteAssessmentStep4(delObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.getStep4List();
            // this.pageNo = 1;
            // this.viewMode = viewMode;
            // this.searchVal = '';
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            // //this.listDataview.splice(index, 1);
            // this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }

        }, err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  });

  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }

}

 /*
 @Type: File, <ts>
 @Name: checkWeightageSum
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: weightage sum check
 */
 checkWeightageSum(sections: FormArray): ValidationResult {
  if (sections) {
    let sumOfPercentages = 0;
    sections['controls'].forEach((sectionItem: FormGroup) => {
      sumOfPercentages = Number(sectionItem['controls'].Weightage.value) + Number(sumOfPercentages);
    });
    if (sumOfPercentages != 100) {
      return {"Invalid": true};
    }
  }
  return null;
}

/*
 @Type: File, <ts>
 @Name: onEditSection
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: for editing Section
 */
onEditSection(editedRow:any,sectionIndex:number){
editedRow.get('isEditable').setValue(true);
}
 /*
 @Type: File, <ts>
 @Name: onEditQuestions
 @Who: Renu
 @When: 20-April-2022
 @Why: ROST-5340 EWM-5485
 @What: for editing questions
 */
 onEditQuestions(editedRow:any,sectionIndex:number,quesIndex:number){
//if(editedRow.controls['Id'].value==null || editedRow.controls['Id'].value=='' || editedRow.controls['Id'].value==0){
  this.onQuesTypeSelection(sectionIndex,editedRow.controls['TypeId'].value,editedRow.value,null,quesIndex);
 
  //}
}
ngOnDestroy() {
  this.subscription$?.unsubscribe();
  if(this.assementId)
     {
       let delObj={};
       delObj['Id']=this.assementId;
       this.userAdministrationService.deleteAssessmentDraft(delObj).subscribe(
         (data: ResponceData) => {
           if (data.HttpStatusCode === 200) {
             } else {
           //  this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
           }
 
         }, err => {
           if (err.StatusCode == undefined) {
             this.loading = false;
           }
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         })
     }
 }


/* 
@Type: File, <ts>
@Name: getStep3Info function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: get first step 1 information  by ID
 */

getStep3Info(assementId:number){
  if(this.assementId==0)
    {
      this.insertStep3();
    }else{
  this.loading = true;
  this.userAdministrationService.getStep3InfoById('?id=' + assementId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        this.guideLinesGroup.patchValue({
          Id:data.Data.Id,
          AssessmentId:data.Data.AssessmentId,
          Layout:data.Data.Layout,
          LogoPath:data.Data.LogoPath,
          WelcomeText:data.Data.WelcomeText,
          Guidelines:data.Data.Guidelines
        });
        this.getEditorValWelcomeText=data.Data?.WelcomeText;//by maneesh
        this.getEditorValGuidelinest=data.Data?.Guidelines;//by maneesh

        this.chosenLayout=data.Data.Layout;
        this.imagePreviewStatus = true;
        this.previewImage=data.Data.PreviewLogoPath;
      }
      else {
        this.guideLinesGroup.patchValue({
          WelcomeText:'You have completed 0 out of 5 tests.Press <b>Continue</b> button when you are ready to continue your assessment.Good luck!',
          Guidelines:'This assessment consists of 2 tests with 30 questions.This test comprises of multiple-choice questions with multiple answers and questions with descriptive answers.All questions are compulsory and has some weightage.There shall not be any negative marking for any wrong answer.You are free to use a calculator, pen and paper.Do not use your cellular device during the test.We recommend completing the assessment in a single attempt.'
        })
        this.loading = false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
  }
}

/* 
@Type: File, <ts>
@Name: saveStep4 function
@Who: Renu
@When: 18-March-2022
@Why: ROST-1732 EWM-5427
@What: save step4 data
 */
saveStep4(){
  if(this.evalCriteriaId=='2' && this.weightageSum!=100){
    this.openWarningDialog('label_WeightageErrMsg','label_TitleWeightage');
    return;
  }
  let value:any=this.assmentPreviwArr;
   let assementStep4={};
    assementStep4['Id']=this.assementId?this.assementId:0;
    assementStep4['AssessmentPatternId']=Number(this.assesmentSelection);
    //assementStep4['EvaluationCriteriaId']=Number(this.evalCriteriaId);
    if(this.assesmentSelection==1)
    {
      let options=[];
      value.ReviewQuestions.forEach((element,index) => {
        options.push({
          'DisplaySeq':Number(index + 1),
          'Id':element.Id,
          'Name':element.Name,
          'Type':element.Type,
          'Weightage':element.Weightage
        })
      });
      assementStep4['ReviewQuestions']=options;
    assementStep4['ReviewSections']=[];
    }else{
      let options=[];
      value.ReviewSections.forEach((element,index) => {
        options.push({
          'DisplaySeq':Number(index + 1),
          'Id':element.Id,
          'Name':element.Name,
          'NoOfQuestions':element.NoOfQuestions,
          'Weightage':element.Weightage
        })
      });
      assementStep4['ReviewSections']=options;
      assementStep4['ReviewQuestions']=[];
    }
    assementStep4['TotalNoOfQuestion']=value.TotalNoOfQuestion;
    let URL = localStorage.getItem('redirectUrl'); 
    let URL_AS_LIST = URL.split('/'); 
    assementStep4['AssessmentPageURL']= URL_AS_LIST[0]+'//'+URL_AS_LIST[2]+'/client/core/administrators/assessment';

  this.userAdministrationService.addReviewStep(assementStep4).subscribe((repsonsedata: any) => {
    if (repsonsedata.HttpStatusCode == 200) {
      this.loading = false;
      this.stepper.selected.completed = true;
      this.stepper.reset();
      //this.addQuesGroup.reset();
      this.route.navigate(['/client/core/administrators/assessment']);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
@Name: goBack function
@Who: Renu
@When: 04-may-2022
@Why: ROST-1732 EWM-5427
@What: to go back stepper previous 
*/

goBack(stepper: MatStepper){
  stepper.previous();
}

/* 
@Type: File, <ts>
@Name: togglePanel function
@Who: Renu
@When: 04-may-2022
@Why: ROST-1732 EWM-5427
@What: to close already opened toggle 
*/
togglePanel() {
  this.panelOpenState = !this.panelOpenState
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
@Name: assementPreview function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6678 EWM-6782
@What: Show Preview 
*/
assementPreview(){
  let manageurl='./assessment/preview?Id='+ this.assementId;
  window.open(manageurl, '_blank');
}
/*
   @Type: File, <ts>
   @Name: WhitespaceValidator function
   @Who: maneesh
   @When: 28-dec-2022
   @Why: EWM-10052
   @What: Remove whitespace
*/
blankval:boolean = false;
WhitespaceValidator(event: any, i: number){
  let control = (<FormArray>this.addQuesGroup.controls['SectionInfo']).at(i).get('Section') as FormArray; 
  const isWhitespace = (control.value as string || '')?.trim().length === 0;
  if(isWhitespace==true && control.value!=''){
         this.blankval=true;
      }else{
         this.blankval=false;
            }
     }

       /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
 openImageUpload(num): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
    this.loading = true;
     if (res.data != undefined && res.data != '') {
       if (res.event === 1) {
        this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
          if(num === 1){
            this.editor1.exec('insertImage', res);
          }
          else if(num === 2){
            this.editor2.exec('insertImage', res);
          }
          else if(num === 3){
            this.editor3.exec('insertImage', res);
          }
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
          if(num === 1){
            this.editor1.exec('insertImage', res);
          }
          else if(num === 2){
            this.editor2.exec('insertImage', res);
          }
          else if(num === 3){
            this.editor3.exec('insertImage', res);
          }
           this.loading = false;
         })
       }
     }
   })
}
getEditorFormInfo(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  let result= event.val?.replace(regex, '\n')?.trim();  
  if(sources == undefined && result?.length==0){
    this.showErrorDesc=false;
    this.noSpaceDiscription=true;
    this.addAssessmentGroup.get('Description').updateValueAndValidity();
    this.addAssessmentGroup.get("Description").markAsTouched();    
  } else if(sources != undefined && event?.val==''){
    this.showErrorDesc=false;
    this.noSpaceDiscription=false;
    this.addAssessmentGroup.get('Description').setValue(event?.val);
  }
  if(result?.length!=0 && result?.length!=undefined){
    this.showErrorDesc=false;
    this.noSpaceDiscription=false;  
    this.addAssessmentGroup.get('Description').setValue(event?.val);    
  }
  else if(sources == undefined && event?.val==null ){
    this.showErrorDesc=true;
    this.noSpaceDiscription=false;
    this.editConfig();
    this.addAssessmentGroup.get('Description').setValidators([Validators.required]);
    this.addAssessmentGroup.get('Description').updateValueAndValidity();
    this.addAssessmentGroup.get("Description").markAsTouched();
  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.noSpaceDiscription=false;
    this.addAssessmentGroup.get('Description').setValue('');
    this.addAssessmentGroup.get('Description').setValidators([Validators.required]);
    this.addAssessmentGroup.get('Description').updateValueAndValidity();
    this.addAssessmentGroup.get("Description").markAsTouched();
    this.editConfig();
  }
}
  
  getEditorImageFormInfo(event){ 
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
    ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
    if(event?.val!='' && sources!=undefined){
      this.showErrorDesc=false;
      this.addAssessmentGroup.get('Description').setValue(event?.val);
    }else if(sources == undefined && event?.val==null ){
    this.showErrorDesc=true;
      this.editConfig();
      this.addAssessmentGroup.get('Description').setValue('');
      this.addAssessmentGroup.get('Description').setValidators([Validators.required]);
      this.addAssessmentGroup.get('Description').updateValueAndValidity();
      this.addAssessmentGroup.get("Description").markAsTouched();
    }
    else if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
      this.showErrorDesc=false;
      this.addAssessmentGroup.get('Description').setValue(event?.val);
    }  else if(sources != undefined && event?.val==''){
      this.showErrorDesc=false;
      this.addAssessmentGroup.get('Description').setValue(event?.val);
    } else if(sources == undefined && event?.val?.length!=0){
      this.showErrorDesc=false;
      this.addAssessmentGroup.get('Description').setValue(event?.val);
    }
    else if(sources == undefined && event?.val?.length==0){
      this.showErrorDesc=true;
      this.editConfig();
      this.addAssessmentGroup.get('Description').updateValueAndValidity();
      this.addAssessmentGroup.get("Description").markAsTouched();
      this.addAssessmentGroup.get('Description').setValue('');   
    }
  
  }
  editConfig(){
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_desc',
      Tag:[],
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    // this.showErrorDesc=true;
    this.getRequiredValidationMassageForDis.next(this.editorConfig)
      this.addAssessmentGroup.get('Description').updateValueAndValidity();
      this.addAssessmentGroup.get("Description").markAsTouched();

  }

  // this is use for welcomeText and remove this  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!=0){
  labelError:boolean=false;
  spaceError:boolean;
getEditorFormInfoWelcomeText(event,type){ 
 if (type=='WelcomeText') {
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  let result= event.val?.replace(regex, '\n')?.trim();
  if(sources == undefined && result?.length==0 ){
    this.labelError=false;
    this.spaceError=true;
    this.guideLinesGroup.get('WelcomeText').updateValueAndValidity();
    this.guideLinesGroup.get("WelcomeText").markAsTouched();    
  }
  if(result?.length!=0 && result?.length!=undefined){
    this.labelError=false;
    this.spaceError=false;   
    this.guideLinesGroup.get('WelcomeText').setValue(event?.val);
  } else if(sources != undefined && event?.val==''){
    this.labelError=false;
    this.guideLinesGroup.get('WelcomeText').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==null ){
    this.labelError=true;
    this.editConfigWelcomeText();
    this.guideLinesGroup.get('WelcomeText').setValue('');
    this.guideLinesGroup.get('WelcomeText').setValidators([Validators.required]);
    this.guideLinesGroup.get('WelcomeText').updateValueAndValidity();
    this.guideLinesGroup.get("WelcomeText").markAsTouched();    

  } else if(sources == undefined && result?.length!=0){
    this.labelError=false;
    this.spaceError=false;   
    this.guideLinesGroup.get('WelcomeText').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==''){
    this.labelError=true;
    this.spaceError=false;   
    this.guideLinesGroup.get('WelcomeText').setValue('');
    this.guideLinesGroup.get('WelcomeText').setValidators([Validators.required]);
    this.guideLinesGroup.get('WelcomeText').updateValueAndValidity();
    this.guideLinesGroup.get("WelcomeText").markAsTouched();
    this.editConfigWelcomeText();
  }

 }
}
  

  editConfigWelcomeText(){
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_welcomeText',
      Tag:[],
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    // this.showErrorDesc=true;
    this.getRequiredValidationMassage.next(this.editorConfig);
      this.guideLinesGroup.get('WelcomeText').updateValueAndValidity();
      this.guideLinesGroup.get("WelcomeText").markAsTouched();
  }
 // this is use for Guidelines
 whitespaceForGuidelines:boolean
 getEditorFormInfoGuidelines(event,type){
 if (type=='Guidelines') {
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  let result= event.val?.replace(regex, '\n')?.trim();
  if(sources == undefined &&  result?.length==0){
    this.showErrorDesc=false;
    this.whitespaceForGuidelines=true;
    this.guideLinesGroup.get('Guidelines').updateValueAndValidity();
    this.guideLinesGroup.get("Guidelines").markAsTouched();
  }
  if( result?.length!==0 && result?.length!=undefined){
    this.showErrorDesc=false;
    this.whitespaceForGuidelines=false;
    this.guideLinesGroup.get('Guidelines').setValue(event?.val);
  } else if(sources != undefined && event?.val==''){
    this.showErrorDesc=false;
    this.whitespaceForGuidelines=false;
    this.guideLinesGroup.get('Guidelines').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==null){
    this.showErrorDesc=true;
    this.whitespaceForGuidelines=false;
    this.editConfigGuidelines();
    this.guideLinesGroup.get('Guidelines').setValue('');
    this.guideLinesGroup.get('Guidelines').setValidators([Validators.required]);
    this.guideLinesGroup.get('Guidelines').updateValueAndValidity();
    this.guideLinesGroup.get("Guidelines").markAsTouched();
  } else if(sources == undefined &&  result?.length!=0){
    this.showErrorDesc=false;
    this.whitespaceForGuidelines=false;
    this.guideLinesGroup.get('Guidelines').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.whitespaceForGuidelines=false;
    this.guideLinesGroup.get('Guidelines').setValue('');
    this.guideLinesGroup.get('Guidelines').setValidators([Validators.required]);
    this.guideLinesGroup.get('Guidelines').updateValueAndValidity();
    this.guideLinesGroup.get("Guidelines").markAsTouched();
    this.editConfigGuidelines();
  }
 }
}
  

  editConfigGuidelines(){
    this.GuidLinesEditorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_guidelines',
      Tag:[],
      EditorTools:[],
      MentionStatus:true,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
    // this.showErrorDesc=true;
    this.getRequiredValidationMassageforGuidelines.next(this.GuidLinesEditorConfig);
      this.guideLinesGroup.get('Guidelines').updateValueAndValidity();
      this.guideLinesGroup.get("Guidelines").markAsTouched();
  }

}


export interface ValidationResult {
  [key: string]: boolean;
}


export class CustomValidatorQues {
  static checkQues(sections: FormArray): ValidationResult {
    if (sections) {
      if ( sections['controls'].length==0) {
        return {"Invalid": true};
      }
    }
    return null;
  }
}
//Custom Validator
export class CustomValidator {
  static checkWeightageSum(sections: FormArray): ValidationResult {
    if (sections) {
      let sumOfPercentages = 0;
      sections['controls'].forEach((sectionItem: FormGroup) => {
        sumOfPercentages = Number(sectionItem['controls'].Weightage.value) + Number(sumOfPercentages);
      });
      if (sumOfPercentages != 100) {
        return {"Invalid": true};
      }
    }
    return null;
  }

}