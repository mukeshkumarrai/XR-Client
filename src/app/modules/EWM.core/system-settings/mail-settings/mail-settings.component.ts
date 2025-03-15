/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 23-Nov-2020
  @Why: ROST-414
  @What:  This page will be use for the Email Setting Component ts file
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { minLength } from '@rxweb/reactive-form-validators';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | FormGroup | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  loading: boolean;
  submitted = false;
  mailSettingForm: FormGroup;
  ELEMENT_DATA: any[] = [];
  displayedColumns: string[] = ['Name', 'UserName'];
  dataSource;
  smptppassword = true;
  osmptppassword = true;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public userNamePattern = "^[A-Za-z0-9_@.-]+$"
  public Ispartial = true;
  public matcher;
  public maxCharacterLengthSubHead = 115;
  isOutgoingValidates: boolean=false;
  public isIncomingValidates:boolean=false;
  
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();  
  public plcData = [];
  
  @ViewChild('editor') editor: EditorComponent;
  public pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: true
  };

public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public tagList:any=['Employee'];
public basic:any=[];
  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Renu
  @When: 23-Nov-2020
  @Why: ROST-414
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, private translateService: TranslateService,
     public _encryptionDecryptionService: EncryptionDecryptionService,private commonserviceService: CommonserviceService) {
    this.mailSettingForm = this.fb.group({
      DisplayName: ["", [Validators.required, Validators.pattern(this.specialcharPattern), Validators.minLength(2), Validators.maxLength(30)]],
      IHostName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      IUserName: ["", [Validators.required, Validators.pattern(this.userNamePattern), Validators.minLength(2), Validators.maxLength(50)]],
      IPort: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(2), Validators.maxLength(6)]],
      IServerName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      ISsl: ["", [Validators.required]],
      Ismtppwd: ["", [Validators.required, Validators.minLength(4)]],
      OHostName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      OUserName: ["", [Validators.required, Validators.pattern(this.userNamePattern), Validators.minLength(2), Validators.maxLength(50)]],
      Osmtppwd: ["", [Validators.required, Validators.minLength(4)]],
      OSsl: ["", [Validators.required]],
      OPort: ["", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(2), Validators.maxLength(6)]],
      CompanySignature: [' ']
    });
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.mailsettingFetch();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })

     this.getData();
     this.editorConfig={
      REQUIRED:false,
      DESC_VALUE:null,
      PLACEHOLDER:'', 
      Tag:this.tagList,
      EditorTools:this.basic,
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    };
  }

  /*
    @Type: File, <ts>
    @Name: changePwd function
    @Who: Renu
    @When: 24-Nov-2020
    @Why: ROST-415
    @What: service call to fetch data for mail settings
  */

  mailsettingFetch() {
    this.loading = true;
    this.systemSettingService.fetchmailSettingList().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.ELEMENT_DATA.push({
            'UserName': repsonsedata['Data']['EntireEmail'],
          })
          this.dataSource = this.ELEMENT_DATA;
          let OPwd;
          if (repsonsedata['Data']['OPassword'] != null) {
            OPwd =this._encryptionDecryptionService.decrypt(repsonsedata['Data']['OPassword'])
            // atob(repsonsedata['Data']['OPassword'])
          } else {
            OPwd = repsonsedata['Data']['OPassword'];
          }
          let IPwd;
          if (repsonsedata['Data']['IPassword'] != null) {
            IPwd = this._encryptionDecryptionService.decrypt(repsonsedata['Data']['IPassword'])
          } else {
            IPwd = repsonsedata['Data']['IPassword'];
          }
          this.mailSettingForm.patchValue({
            'DisplayName': repsonsedata['Data']['DisplayName'],
            'IHostName': repsonsedata['Data']['IHostName'],
            'IUserName': repsonsedata['Data']['IUserName'],
            'IPort': repsonsedata['Data']['IPort'],
            'OPort': repsonsedata['Data']['OPort'],
            'IServerName': repsonsedata['Data']['IServerName'],
            'ISsl': repsonsedata['Data']['ISsl'],
            'OHostName': repsonsedata['Data']['OHostName'],
            'OUserName': repsonsedata['Data']['OUserName'],
            'OSsl': repsonsedata['Data']['OSsl'],
            'Ismtppwd': IPwd,
            'Osmtppwd': OPwd,
            'CompanySignature': this._encryptionDecryptionService.decrypt(repsonsedata['Data']['CompanySignature']),
          });
          // condition added by priti on 9-march-2021
          if(this.mailSettingForm.valid)
          {
          this.isIncomingValidates=true;
          this.isOutgoingValidates=true;
        }
          //this.snackBService.showSuccessSnackBar("Password Updated Successfully", repsonsedata.Httpstatuscode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }

  /*
    @Type: File, <ts>
    @Name: changePwd function
    @Who: Renu
    @When: 24-Nov-2020
    @Why: ROST-415
    @What: service call to update data for mail settings
  */

  updateMailSettings(value) {
    this.submitted = true;
    if (this.mailSettingForm.invalid) {
      return;
    } else {
      console.log(this.mailSettingForm.get("CompanySignature").value);
      this.loading = true;
      value['OPassword'] = this._encryptionDecryptionService.encryptData(value.Osmtppwd);
      value['IPassword'] = this._encryptionDecryptionService.encryptData(value.Ismtppwd);
      value['ISsl'] = Number(value.ISsl);
      value['OSsl'] = Number(value.OSsl);      
      value['CompanySignature'] = this._encryptionDecryptionService.encryptData(this.mailSettingForm.get("CompanySignature").value);
      delete value.smtppwd;
      delete value.Ismtppwd;
      delete value.Osmtppwd;
      this.systemSettingService.updateMailSettingDetails(value).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          
        })
    }
  }


  IncomingMailCredentailCheck(value) {
    this.loading = true;
    let hasValue: boolean = true;
    if (value['IUserName'] == undefined || value['IUserName'] == null || value['IUserName'] == '') {

      this.mailSettingForm.get("IUserName").setErrors({ required: true });
      this.mailSettingForm.get("IUserName").markAsDirty();
      hasValue = false;
    }
    if (value['IHostName'] == undefined || value['IHostName'] == null || value['IHostName'] == '') {

      this.mailSettingForm.get("IHostName").setErrors({ required: true });
      this.mailSettingForm.get("IHostName").markAsDirty();
      this.mailSettingForm.get("IHostName").updateValueAndValidity();
      hasValue = false;
    }
    if (value['IPort'] == undefined || value['IPort'] == null || value['IPort'] == '') {

      this.mailSettingForm.get("IPort").setErrors({ required: true });
      this.mailSettingForm.get("IPort").markAsDirty();
      this.mailSettingForm.get("IPort").updateValueAndValidity();
      hasValue = false;
    }
    if (value['Ismtppwd'] == undefined || value['Ismtppwd'] == null || value['Ismtppwd'] == '') {

      this.mailSettingForm.get("Ismtppwd").setErrors({ required: true });
      this.mailSettingForm.get("Ismtppwd").markAsDirty();
      this.mailSettingForm.get("Ismtppwd").updateValueAndValidity();
      hasValue = false;
    }
    if (value['DisplayName'] == undefined || value['DisplayName'] == null || value['DisplayName'] == '') {

      this.mailSettingForm.get("DisplayName").setErrors({ required: true });
      this.mailSettingForm.get("DisplayName").markAsDirty();
      this.mailSettingForm.get("DisplayName").updateValueAndValidity();
      hasValue = false;
    }
    if (value['IServerName'] == undefined || value['IServerName'] == null || value['IServerName'] == '') {

      this.mailSettingForm.get("IServerName").setErrors({ required: true });
      this.mailSettingForm.get("IServerName").markAsDirty();
      this.mailSettingForm.get("IServerName").updateValueAndValidity();
      hasValue = false;
    }
    if (!hasValue) {
      this.loading = false;
      return;
    }
   
    let postdata= {
      UserName:value['IUserName'],
      Password:this._encryptionDecryptionService.encryptData(value['Ismtppwd']),
      Host:value['IHostName'],
      Port:Number(value['IPort']),
      EnableSsl:true,
      UseDefaultCredentials:false,
      MailSettingType:'Incoming'
    }
    this.systemSettingService.checkEmailCredentils(postdata).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }
  OutgoingMailCredentailCheck(value) {
    this.loading = true;
    let hasValue: boolean = true;
    if (value['OUserName'] == undefined || value['OUserName'] == null || value['OUserName'] == '') {

      this.mailSettingForm.get("OUserName").setErrors({ required: true });
      this.mailSettingForm.get("OUserName").markAsDirty();
      hasValue = false;
    }
    if (value['OHostName'] == undefined || value['OHostName'] == null || value['OHostName'] == '') {

      this.mailSettingForm.get("OHostName").setErrors({ required: true });
      this.mailSettingForm.get("OHostName").markAsDirty();
      this.mailSettingForm.get("OHostName").updateValueAndValidity();
      hasValue = false;
    }
    if (value['OPort'] == undefined || value['OPort'] == null || value['OPort'] == '') {

      this.mailSettingForm.get("OPort").setErrors({ required: true });
      this.mailSettingForm.get("OPort").markAsDirty();
      this.mailSettingForm.get("OPort").updateValueAndValidity();
      hasValue = false;
    }
    if (value['Osmtppwd'] == undefined || value['Osmtppwd'] == null || value['Osmtppwd'] == '') {

      this.mailSettingForm.get("Osmtppwd").setErrors({ required: true });
      this.mailSettingForm.get("Osmtppwd").markAsDirty();
      this.mailSettingForm.get("Osmtppwd").updateValueAndValidity();
      hasValue = false;
    }
    if (!hasValue) {
      this.loading = false;
      return;
    }
    let postData={
      UserName:value['OUserName'],
      Password:this._encryptionDecryptionService.encryptData(value['Osmtppwd']),
      Host:value['OHostName'],
      Port:Number(value['OPort']),
      EnableSsl:true,
      UseDefaultCredentials:false,
      MailSettingType:'outgoing'
    }
    this.systemSettingService.checkEmailCredentils(postData).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
  }
doIncomingbtnEnable(value:any,control:string)
{   let hasValue: boolean = true;
  if (value[control] == undefined || value[control] == null || value[control] == '') {
    this.mailSettingForm.get(control).setErrors({ required: true });
    this.mailSettingForm.get(control).markAsDirty();
    hasValue = false;
  }
  if (!hasValue) {
    return;
  }
  else{
    
    if (value['IUserName'] == undefined || value['IUserName'] == null || value['IUserName'] == '') {
      
      hasValue = false;
    }
    else{
      if(this.mailSettingForm.controls['IUserName'].hasError('pattern') ||this.mailSettingForm.controls['IUserName'].hasError('maxlength')||this.mailSettingForm.controls['IUserName'].hasError('minlength') )
      {
        hasValue = false;
      }
    }
    if (value['IHostName'] == undefined || value['IHostName'] == null || value['IHostName'] == '') {

      hasValue = false;
    } else{
      if(this.mailSettingForm.controls['IHostName'].hasError('maxlength')||this.mailSettingForm.controls['IHostName'].hasError('minlength') )
      {
        hasValue = false;
      }
    }
    if (value['IPort'] == undefined || value['IPort'] == null || value['IPort'] == '') {

      hasValue = false;
    } 
    else{
      if(this.mailSettingForm.controls['IPort'].hasError('pattern') ||this.mailSettingForm.controls['IPort'].hasError('maxlength')||this.mailSettingForm.controls['IPort'].hasError('minlength') )
      {
        hasValue = false;
      }
    }
    if (value['Ismtppwd'] == undefined || value['Ismtppwd'] == null || value['Ismtppwd'] == '') {

      hasValue = false;
    } 
    else{
      if(this.mailSettingForm.controls['Ismtppwd'].hasError('minlength') )
      {
        hasValue = false;
      }
    }
    if (value['DisplayName'] == undefined || value['DisplayName'] == null || value['DisplayName'] == '') {

      hasValue = false;
    }
    else{
      if(this.mailSettingForm.controls['DisplayName'].hasError('pattern') ||this.mailSettingForm.controls['DisplayName'].hasError('maxlength')||this.mailSettingForm.controls['DisplayName'].hasError('minlength') )
      {
        hasValue = false;
      }
    }
    if (value['IServerName'] == undefined || value['IServerName'] == null || value['IServerName'] == '') {

      hasValue = false;
    } else{
      if(this.mailSettingForm.controls['IServerName'].hasError('maxlength')||this.mailSettingForm.controls['IServerName'].hasError('minlength') )
      {
        hasValue = false;
      }
    }
    this.isIncomingValidates=hasValue;
  }}

  doOutingbtnEnable(value:any,control:string)
  { 
    //debugger; 
    let hasValue: boolean = true;
    if (value[control] == undefined || value[control] == null || value[control] == '') {
      this.mailSettingForm.get(control).setErrors({ required: true });
      this.mailSettingForm.get(control).markAsDirty();
      hasValue = false;
    }
    if (!hasValue) {
      return;
    }
    else{
      if (value['OUserName'] == undefined || value['OUserName'] == null || value['OUserName'] == '') {
        hasValue = false;
      }
      else{
        if(this.mailSettingForm.controls['OUserName'].hasError('maxlength')||this.mailSettingForm.controls['OUserName'].hasError('minlength')||this.mailSettingForm.controls['OUserName'].hasError('pattern') )
        {
          hasValue = false;
        }
      }
      if (value['OHostName'] == undefined || value['OHostName'] == null || value['OHostName'] == '') {
        hasValue = false;
      }
      else{
        if(this.mailSettingForm.controls['OHostName'].hasError('minlength')  || this.mailSettingForm.controls['OHostName'].hasError('maxlength') )
        {
          hasValue = false;
        }
      }
      if (value['OPort'] == undefined || value['OPort'] == null || value['OPort'] == '') {
        hasValue = false;
      }
      else{
        if(this.mailSettingForm.controls['OPort'].hasError('maxlength')||this.mailSettingForm.controls['OPort'].hasError('minlength')||this.mailSettingForm.controls['OPort'].hasError('pattern') )
        {
          hasValue = false;
        }
      }
      if (value['Osmtppwd'] == undefined || value['Osmtppwd'] == null || value['Osmtppwd'] == '') {
        hasValue = false;
      }
      else{
        if(this.mailSettingForm.controls['Osmtppwd'].hasError('minlength') )
        {
          hasValue = false;
        }
      }
      this.isOutgoingValidates=hasValue;
    }
  }

  
    /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

    reloadApiBasedOnorg(){
      this.mailsettingFetch();
      }


      
  getData() {
    this.systemSettingService.getPlaceholderTypeAll().subscribe(
      repsonsedata => {
        let peopleData =  repsonsedata['Data'].filter(x => x['Type'] === 'Employee');
        for (let result of peopleData) {
          this.systemSettingService.getPlaceholderByType(result['Type']).subscribe(
            respdata => {
              if (respdata['Data']) {
                let existing: any[] = this._toolButtons$.getValue();
                this.plcData = [];
                for (let plc of respdata['Data']) {
                  this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
                }
                let peopleButton: string = result['Type'];
                // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
                existing.push({ text: peopleButton, data: this.plcData });
                this._toolButtons$.next(existing);
              }
            }, err => {
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            });
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }
    //  @Who: maneesh, @When: 14-03-2024,@Why: EWM-16343-EWM-16207 @What: on changes on kendo editor catch the event here
    getEditorFormInfo(event) {
      this.ownerList = event?.ownerList;        
      if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
        this.showErrorDesc = false;
        this.mailSettingForm.get('CompanySignature').setValue(event?.val);
      } else {
        this.showErrorDesc = true;
        this.mailSettingForm.get('CompanySignature').setValue('');
        this.mailSettingForm.get('CompanySignature').updateValueAndValidity();
        this.mailSettingForm.get("CompanySignature").markAsTouched();
      }
    }
}
