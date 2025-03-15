/*
 @(C): Entire Software
 @Type: File, <TS>
 @Who: Anup Singh
 @When: 11-Feb-2022
 @Why: EWM-4671 EWM-5185
 @What: This page wil be use only for consent req. page tempalate Component TS
 */
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

@Component({
  selector: 'app-consent-req-page-template',
  templateUrl: './consent-req-page-template.component.html',
  styleUrls: ['./consent-req-page-template.component.scss']
})
export class ConsentReqPageTemplateComponent implements OnInit {

  public loading: boolean = false;
  public isCandidate: boolean = true;
  public isEmployee: boolean = false;

  @ViewChild('editorCandidate') editorCandidate: EditorComponent;
  private _toolButtonsCandidate$ = new BehaviorSubject<any[]>([]);
  public toolButtonsCandidate$: Observable<any> = this._toolButtonsCandidate$.asObservable();

  @ViewChild('editorEmployee') editorEmployee: EditorComponent;
  private _toolButtonsEmployee$ = new BehaviorSubject<any[]>([]);
  public toolButtonsEmployee$: Observable<any> = this._toolButtonsEmployee$.asObservable();

  public plcDataCandidate = [];
  public plcDataEmployee = [];

  @Output() consentReqPageTemp = new EventEmitter();

  public candPageTemp = ``;
  public emplPageTemp = ``;

  pageTempalateCandidateForm: FormGroup;
  pageTempalateEmployeeForm: FormGroup;
  positionMatTab: any;

   //  kendo image uploader Adarsh singh 01-Aug-2023
 subscription$: Subscription;
 // End
 public editorConfig: EDITOR_CONFIG;
 public getEditorVal:string;
 public showErrorDesc: boolean=false;
 getRequiredValidationMassage: Subject<any> = new Subject<any>();
public tagList:any=['Candidate'];
public tagListEmployee:any=['Employee'];

public getEditorValEmployee:string;
public showErrorDescEmployee: boolean=false;
resetEditorValue: Subject<any> = new Subject<any>();
 
  constructor(private systemSettingService: SystemSettingService, private snackBService: SnackBarService, private translateService: TranslateService,
    public _sidebarService: SidebarService, private route: Router,
      public fb: FormBuilder,public dialog: MatDialog, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private commonserviceService: CommonserviceService,   private appSettingsService: AppSettingsService) {


    this.pageTempalateCandidateForm = this.fb.group({
      Id: [0],
      CandidateModule: ['CAND'],
      CandidatePageTemplate: ['', [Validators.required]],
      Status: [0],
    });

    this.pageTempalateEmployeeForm = this.fb.group({
      Id: [0],
      EmployeeModule: ['EMPL'],
      EmployeePageTemplate: ['', [Validators.required]],
      Status: [0],
    });
  }

  ngOnInit(): void {
    this.getDataCandidate();
    this.getDataEmployee();

    this.getGDPRPageTempByModule('CAND');
    

    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab=res;
    });
        this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_pageTemplate',
      Tag:this.tagList,
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
  }



  /*
@Type: File, <ts>
@Name: selectedTabValue
@Who: Anup Singh
@When: 14-Feb-2022
@Why: EWM-4672 EWM-5191
@What: when tab change msg change
*/
  selectedTabValue(value: any) {
    this.loading = true;
    if (value.index == 0) {
      this.isCandidate = true;
      this.isEmployee = false;
      this.editorConfig={ 
        REQUIRED:false,
        DESC_VALUE:null,
        PLACEHOLDER:'label_pageTemplate',
        Tag:this.tagList,
        EditorTools:[],
        MentionStatus:false,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false 
      }  
      this.showErrorDesc=false;
      this.resetEditorValue.next(this.editorConfig);
      
      this.getGDPRPageTempByModule('CAND');
    } else if (value.index == 1) {
      this.isCandidate = false;
      this.isEmployee = true; 
    this.showErrorDescEmployee=false;  

      this.editConfigForEmployee();
      this.getGDPRPageTempByModule('EMPL');
    }
  }

  /*
@Type: File, <ts>
@Name: onDismiss
@Who: Anup Singh
@When: 14-Feb-2022
@Why: EWM-4672 EWM-5191
@What: for close drawer
*/
  onDismiss() {
    this.consentReqPageTemp.emit(true);
  }

  /*
 @Type: File, <ts>
 @Name: getDataCandidate
 @Who: Anup Singh
 @When: 11-Feb-2022
 @Why: EWM-4671 EWM-5185
 @What: get candidate dropdown html editor
 */

  getDataCandidate() {
    this.systemSettingService.getPlaceholderTypeAll().subscribe(
      repsonsedata => {
        for (let result of repsonsedata['Data']) {
          this.systemSettingService.getPlaceholderByType(result['Type']).subscribe(
            respdata => {
              if (respdata['Data']) {
                let existingCandidate: any[] = this._toolButtonsCandidate$.getValue();
                this.plcDataCandidate = [];
                for (let plc of respdata['Data']) {
                  this.plcDataCandidate.push({ text: plc['Placeholder'], icon: '', click: () => { this.editorCandidate.exec('insertText', { text: plc['PlaceholderTag'] }); } })
                }
                let peopleButton: string = result['Type'];
                // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
                existingCandidate.push({ text: peopleButton, data: this.plcDataCandidate });

                ///For Candidate
                let candidateData: any = existingCandidate.filter((item) => {
                  return item.text === "Candidate"
                })
                this._toolButtonsCandidate$.next(candidateData);
                //////     
              }
            }, err => {
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            });
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }

  /*
   @Type: File, <ts>
   @Name: getDataEmployee
   @Who: Anup Singh
   @When: 11-Feb-2022
   @Why: EWM-4671 EWM-5185
   @What: get Employee dropdown html editor
   */
  getDataEmployee() {
    this.systemSettingService.getPlaceholderTypeAll().subscribe(
      repsonsedata => {
        for (let result of repsonsedata['Data']) {
          this.systemSettingService.getPlaceholderByType(result['Type']).subscribe(
            respdata => {
              if (respdata['Data']) {
                let existingEmployee: any[] = this._toolButtonsEmployee$.getValue();
                this.plcDataEmployee = [];
                for (let plc of respdata['Data']) {
                  this.plcDataEmployee.push({ text: plc['Placeholder'], icon: '', click: () => { this.editorEmployee.exec('insertText', { text: plc['PlaceholderTag'] }); } })
                }
                let peopleButton: string = result['Type'];
                // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
                existingEmployee.push({ text: peopleButton, data: this.plcDataEmployee });

                ///For Employee
                let employeeData: any = existingEmployee.filter((item) => {
                  return item.text === "Employee"
                })
                this._toolButtonsEmployee$.next(employeeData);
                //////     

              }
            }, err => {
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            });
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }


  /*
 @Type: File, <ts>
 @Name: getGDPRPageTempByModule
 @Who: Anup
 @When: 15-Feb-2022
 @Why: EWM-4671 EWM-5186
 @What: get GDPR Page Temp ByModule
 */
  getGDPRPageTempByModule(module) {
    this.loading = true;
    this.systemSettingService.getGDPRPageTempByModule("?moduleType=" + module).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== undefined && repsonsedata.Data !== null && repsonsedata.Data !== '') {
            if (this.isCandidate === true) {
              this.candPageTemp = repsonsedata.Data?.Template;
              this.pageTempalateCandidateForm.patchValue({
                Id: repsonsedata.Data?.Id,
                CandidateModule: repsonsedata.Data?.ModuleType,
                CandidatePageTemplate: repsonsedata.Data?.Template,
                Status: repsonsedata.Data?.Status,
              });
                // this.showErrorDesc=false;
                this.getEditorVal=repsonsedata.Data?.Template; //by maneesh
            } else if (this.isEmployee === true) {
              this.candPageTemp = repsonsedata.Data?.Template;
              this.pageTempalateEmployeeForm.patchValue({
                Id: repsonsedata.Data?.Id,
                EmployeeModule: repsonsedata.Data?.ModuleType,
                EmployeePageTemplate: repsonsedata.Data?.Template,
                Status: repsonsedata.Data?.Status,
              });
              this.getEditorValEmployee=repsonsedata.Data?.Template;//by maneesh
            }
          }

        }
        else {

          this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {

        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
 @Type: File, <ts>
 @Name: OnSave
 @Who: Anup
 @When: 15-Feb-2022
 @Why: EWM-4671 EWM-5186
 @What: update Page Temp ByModule
 */
  OnSave(value, dataSaveFor) {
    let updatePageTemp = {};
    if (dataSaveFor == 'Candidate') {
      updatePageTemp['Id'] = value.Id;
      updatePageTemp['ModuleType'] = value.CandidateModule;
      updatePageTemp['Template'] = value.CandidatePageTemplate;
      updatePageTemp['Status'] = value.Status;
    }
    else if (dataSaveFor == 'Employee') {
      updatePageTemp['Id'] = value.Id;
      updatePageTemp['ModuleType'] = value.EmployeeModule;
      updatePageTemp['Template'] = value.EmployeePageTemplate;
      updatePageTemp['Status'] = value.Status;
    }

    this.loading = true;

    this.systemSettingService.updatePageTempByModule(updatePageTemp).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.consentReqPageTemp.emit(true);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


/*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
openImageUpload(val:number): void {
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
           if (val === 1) {
            this.editorCandidate.exec('insertImage', res);
           }
           else{
            this.editorEmployee.exec('insertImage', res);
           }
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
          if (val === 1) {
            this.editorCandidate.exec('insertImage', res);
           }
           else{
            this.editorEmployee.exec('insertImage', res);
           }
           this.loading = false;
         })
       }
     }
   })
}

ngOnDestroy(){
  this.subscription$?.unsubscribe();
}

getEditorFormInfo(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  // this.ownerList=event?.ownerList;
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  } else if(sources != undefined && event?.val==''){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==null ){
    this.showErrorDesc=true;
    this.editConfig();
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValidators([Validators.required]);
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').updateValueAndValidity();
    this.pageTempalateCandidateForm.get("CandidatePageTemplate").markAsTouched();
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue('');
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValidators([Validators.required]);
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').updateValueAndValidity();
    this.pageTempalateCandidateForm.get("CandidatePageTemplate").markAsTouched();
  }
}
getEditorImageFormInfo(event){ 
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  }else if(sources == undefined && event?.val==null ){
    this.showErrorDesc=true;
    this.editConfig();
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue('');
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValidators([Validators.required]);
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').updateValueAndValidity();
    this.pageTempalateCandidateForm.get("CandidatePageTemplate").markAsTouched();
  }
  else if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  }  else if(sources != undefined && event?.val==''){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDesc=false;
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val?.length==0){
    this.showErrorDesc=true;
    this.editConfig();
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').updateValueAndValidity();
    this.pageTempalateCandidateForm.get("CandidatePageTemplate").markAsTouched();
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').setValue('');   
  }

}
editConfig(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_pageTemplate',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
  this.showErrorDesc=true;
  this.getRequiredValidationMassage.next(this.editorConfig);
    this.pageTempalateCandidateForm.get('CandidatePageTemplate').updateValueAndValidity();
    this.pageTempalateCandidateForm.get("CandidatePageTemplate").markAsTouched();
} 


getEditorFormInforEmployee(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  } else if(sources != undefined && event?.val==''){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==null ){
    this.showErrorDescEmployee=true;
    this.editConfigForEmployee();
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValidators([Validators.required]);
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').updateValueAndValidity();
    this.pageTempalateEmployeeForm.get("EmployeePageTemplate").markAsTouched();
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDescEmployee=true;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue('');
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValidators([Validators.required]);
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').updateValueAndValidity();
    this.pageTempalateEmployeeForm.get("EmployeePageTemplate").markAsTouched();
  }
}
getEditorImageFormInforEmployee(event){ 
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  }else if(sources == undefined && event?.val==null ){
    this.showErrorDescEmployee=true;
    this.editConfigForEmployee();
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue('');
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValidators([Validators.required]);
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').updateValueAndValidity();
    this.pageTempalateEmployeeForm.get("EmployeePageTemplate").markAsTouched();
  }
  else if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  }  else if(sources != undefined && event?.val==''){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val?.length==0){
    this.showErrorDescEmployee=true;
    this.editConfigForEmployee();
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').updateValueAndValidity();
    this.pageTempalateEmployeeForm.get("EmployeePageTemplate").markAsTouched();
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').setValue('');   
  }

}
editConfigForEmployee(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_pageTemplate',
    Tag:this.tagListEmployee,
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,   
    JobActionComment:false
  }
  this.showErrorDescEmployee=false;
    this.pageTempalateEmployeeForm.get('EmployeePageTemplate').updateValueAndValidity();
    this.pageTempalateEmployeeForm.get("EmployeePageTemplate").markAsTouched(); 
} 
}
