import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';


@Component({
  selector: 'app-alert-message-same-job',
  templateUrl: './alert-message-same-job.component.html',
  styleUrls: ['./alert-message-same-job.component.scss']
})
export class AlertMessageSameJobComponent implements OnInit {


  @ViewChild('editor') editor: EditorComponent;
  
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  public pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: true
  };

  addForm: FormGroup;  
  @Input() defaultMsgForSameJob:any;
  @Input() defaultMsgForKnockOut:any;
  @Input() pageLabel:any;
  @Input() isSameJobAlertMsg:any;
  @Output() alertDetails =  new EventEmitter();
  @Output() alertMsgSameJobDetails =  new EventEmitter(); 
  @Output() alertMsgKnockOutDetails =  new EventEmitter(); 
  @Output() closeSameJobMsgSection = new  EventEmitter(); 
  @Input() canTagData:any;
  @Input() jobTagData:any;
   animationVar: any;
   defaultSMSForSameJob =   "Thank you for your job application for the position {{Jobs.JobTitle}}. We would like to inform you that your application {{Jobs.ApplicationReferenceNo}} is already submitted and is under process. We will get back to you when you job application status changes to next stage.";
   defaultSMSForKnockOut = "Thank you for taking the time to consider {{Jobs.Company}}. Our hiring team reviewed your application and we’d like to inform you that we will not move forward with your application for the {{Jobs.JobTitle}} position at this time. We encourage you to apply again in the future, if you find an open role at our company that suits you. Thank you again for applying to {{Jobs.Company}} and we wish you all the best in your job search."; 
  canData: any;
  jobData: any;
      
//  kendo image uploader Adarsh singh 01-Aug-2023
subscription$: Subscription;
loading:boolean;
  subscriptionOnChange$: Subscription;
// End 
public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public tagList:any=['Jobs'];
public basic:any=[];
getEmailEditorVal:string=''
resetEditorValue: Subject<any> = new Subject<any>();
getRequiredValidationMassage: Subject<any> = new Subject<any>();
  constructor(private fb: FormBuilder,private appSettingsService: AppSettingsService,public dialog: MatDialog,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,private commonService: CommonserviceService,) { 
    this.addForm = this.fb.group({
      ID: [0],
      RelatedTo: ['Job', [Validators.required]],
      TemplateText: ['', [Validators.required, Validators.minLength(2)]],   
    });
  }

  ngOnInit(): void {
    this.getJobPlaceholderData();
    this.getCanPlaceholderData();
    setTimeout(() => {
     this.patchData();     
    }, 2000);
    this.subscriptionOnChange$= this.addForm?.valueChanges?.subscribe(x => {
      this.onSave();
    });
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_alert_message',
      Tag:[],
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
  }


  patchData(){
    if(this.pageLabel=='Welcome_Page'){
      this.addForm.patchValue({
        TemplateText:this.defaultMsgForSameJob!=null?this.defaultMsgForSameJob:this.defaultSMSForSameJob
      })
      this.getEditorVal=this.defaultMsgForSameJob!=null?this.defaultMsgForSameJob:this.defaultSMSForSameJob;
      }
    if(this.pageLabel=='Knockout_Questions'){
      this.addForm.patchValue({
        TemplateText:this.defaultMsgForKnockOut!=null?this.defaultMsgForKnockOut:this.defaultSMSForKnockOut
      })
      this.getEditorVal=this.defaultMsgForKnockOut!=null?this.defaultMsgForKnockOut:this.defaultSMSForKnockOut;

    }
  }
  /*
    @Type: File, <ts>
    @Name: add remove animation function
    @Who: Satya Prakash Gupta
    @When: 29-Dec-2022
    @Why: EWM-9629 EWM-9900
    @What: add and remove animation
  */

  mouseoverAnimation(matIconId, animationName) {
  let amin = localStorage.getItem('animation');
  if (Number(amin) != 0) {
    document.getElementById(matIconId)?.classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList.remove(animationName)
  }

 
  onSave(){
    if(this.pageLabel=="Welcome_Page" && !this.isSameJobAlertMsg){
      this.alertDetails.emit({alertMMsg:this.addForm.get('TemplateText').value});     
    }
    if(this.pageLabel=="Welcome_Page" && this.isSameJobAlertMsg){
      this.alertMsgSameJobDetails.emit({alertMMsg:this.addForm.get('TemplateText').value});
    }
    if(this.pageLabel=="Knockout_Questions" && this.isSameJobAlertMsg){
      this.alertMsgKnockOutDetails.emit({alertMMsg:this.addForm.get('TemplateText').value});
    }
   
   
  }

  restMessage(){
    if(this.pageLabel=='Welcome_Page'){
      this.addForm.patchValue({
        TemplateText:this.defaultSMSForSameJob
      })  
      this.getEditorVal=this.defaultSMSForSameJob;

    }else if(this.pageLabel=='Knockout_Questions'){
      this.addForm.patchValue({
        TemplateText:this.defaultSMSForKnockOut
      })
      this.getEditorVal=this.defaultSMSForKnockOut;

    }
  }

  clearAlertMsg(){
    this.closeSameJobMsgSection.emit(true);
    this.patchData();   
  }

  getJobPlaceholderData(){
    if (this.jobTagData) {
      let existing: any[] = this._toolButtons$.getValue();
       let plcData = [];
      for (let plc of this.jobTagData) {
        plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
      }
      let peopleButton: string = 'Jobs';
      // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
      existing.push({ text: peopleButton, data: plcData }); 
      let jobData: any = existing?.filter((item) => {
        return item.text === "Jobs"
      });
      //this._toolButtons$.next(jobData); 
      this.jobData = jobData;
    }
  }
 
  

  getCanPlaceholderData(){
    if (this.canTagData) {
      let existing: any[] = this._toolButtons$.getValue();
      this.plcData = [];
      for (let plc of this.canTagData) {
        this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
      }
      let peopleButton: string = 'Candidate';
      // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
      existing.push({ text: peopleButton, data: this.plcData }); 
      let candidateData: any = existing?.filter((item) => {
        return item.text === "Candidate"
      });
      //this._toolButtons$.next(candidateData);
      this.canData = candidateData;
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
openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
     if (res.data != undefined && res.data != '') {
       this.loading = true;
       if (res.event === 1) {
        this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
           this.editor.exec('insertImage', res);
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
           this.editor.exec('insertImage', res);
           this.loading = false;
         })
       }
     }
   })
}

ngOnDestroy(){
  this.subscription$?.unsubscribe();
  this.subscriptionOnChange$?.unsubscribe();
}

getEditorFormInfo(event){
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  this.ownerList=event?.ownerList;
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDesc=false;
    this.addForm.get('TemplateText').setValue(event?.val);
    this.sendDataToParent();

  }
  else if(sources == undefined && event?.val==null ){
    this.editConfig();
    this.sendDataToParent();

  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.addForm.get('TemplateText').setValue('');
    this.addForm.get('TemplateText').setValidators([Validators.required]);
    this.addForm.get('TemplateText').updateValueAndValidity();
    this.addForm.get("TemplateText").markAsTouched();
    this.sendDataToParent();

  }
}
getEditorImageFormInfo(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.showErrorDesc=false;
    this.addForm.get('TemplateText').setValue(event?.val);
    this.sendDataToParent();

  }else  if(event?.val!='' && sources==undefined){
    this.showErrorDesc=false;
    this.addForm.get('TemplateText').setValue(event?.val);
    this.sendDataToParent();

  }
  else if(sources == undefined && event?.val==null ){
    this.editConfig();
    this.sendDataToParent();

  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.addForm.get('TemplateText').setValue('');
    this.addForm.get('TemplateText').setValidators([Validators.required]);
    this.addForm.get('TemplateText').updateValueAndValidity();
    this.addForm.get("TemplateText").markAsTouched();
    this.sendDataToParent();

  }  

}
editConfig(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_alert_message',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
  this.showErrorDesc=true;
  this.getRequiredValidationMassage.next(this.editorConfig);
    this.addForm.get('TemplateText').updateValueAndValidity();  
    this.addForm.get("TemplateText").markAsTouched();
}
sendDataToParent() {
  this.commonService.configueApplicationFormAlertMessage.next(this.addForm);
  
}
}
