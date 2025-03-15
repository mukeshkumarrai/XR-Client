import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {

  @Input() thankYouStatusData: any;
  loading: boolean = false;
  thankYouFrom: FormGroup;
  public headingCount: any = 50;
  headingInputValue: string = '';
  subHeadingInputValue: string = '';
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  @ViewChild('editor') editor: EditorComponent;
  isEnabled:boolean = false;
  public deafultThankyouMsg='<p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Dear&nbsp;{{Candidate.FirstName}}&nbsp;{{Candidate.LastName}},</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Thank you for taking the time to submit your application for the&nbsp;{{Jobs.JobTitle}}&nbsp;position. We are glad that you are interested in a career at&nbsp;{{Candidate.CompanyName}}&nbsp;and were here to help you find your perfect fit.</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We are currently reviewing your application. If your profile is a good fit for this position, we will contact you about next steps. We may also consider your application for other positions. This could happen a few times and it is part of our recruitment process.</span></p><p></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Is your profile telling your story?</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">A key part of our review process is to assess your&nbsp;[Candidate Profile URL]&nbsp;with job requirements. Please ensure your profile is accurate and extensive as it is our first step in getting to know you. You can build your profile by importing information from your resume or manually updating it.</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">To view your application updates, click&nbsp;[View My Applications URL].</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">We encourage you to visit our&nbsp;[Career Centre URL]&nbsp;frequently and continue to look for opportunities that match your interests.</span></p><p></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Thank you,</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">Talent Acquisition Team,</span></p><p><span style="color: rgb(68, 68, 68); font-family: Calibri, sans-serif, &quot;Mongolian Baiti&quot;, &quot;Microsoft Yi Baiti&quot;, &quot;Javanese Text&quot;, &quot;Yu Gothic&quot;; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">{{Jobs.Company}}</span></p>';
  public defaultMsg = "On submitting the application form you declare that all the information given in this application form and resume is true and correct to the best of my knowledge.";
  selfDeclarationCount: number=500;
  ThankUpage:boolean=true;
  public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public tagList:any=['Jobs'];
public basic:any=[];
getEmailEditorVal:string=''
resetEditorValue: Subject<any> = new Subject<any>();
getRequiredValidationMassage: Subject<any> = new Subject<any>();
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService, private fb: FormBuilder,
    private _imageUploadService: ImageUploadService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService,
    private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService, private commonService: CommonserviceService,
    private appSettingsService: AppSettingsService, private jobService: JobService) {
    this.thankYouFrom = this.fb.group({
      Id: [0],
      ApplicationFormId: [0],
      SelfDeclarationMessage: [this.defaultMsg, [Validators.required, Validators.maxLength(500)]],
      ThankYouMessage: [this.deafultThankyouMsg, [Validators.required]],
      SelfDeclaration: [true, Validators.required]
    })

    // this.getPlaceHolder();
  }

  ngOnInit(): void {

    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.thankYouFrom.patchValue({
          ApplicationFormId: parseInt(parms?.Id),
        })
        this.getThankYouPageById(parseInt(parms?.Id))
      }
    });

    this.sendDataToParent(null);
    this.editorConfig={ 
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_ThankYouMessage',
      Tag:[],
      EditorTools:[],
      MentionStatus:false, 
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
  }

  /*
  @Type: File, <ts>
  @Name: getPlaceHolder function
  @Who: Renu
  @When: 03-10-2022
  @Why: EWM-8901 EWM-9096
  @What: get data
  */

  getPlaceHolder() {
 
    this._SystemSettingService.getPlaceholderTypeAll().subscribe(
      repsonsedata => {

        let Placeholder = repsonsedata['Data']?.filter(x => x.Type != 'Roster' && x.Type != 'Clients' && x.Type != 'Employee');
        
        for (let result of Placeholder) {
          this._SystemSettingService.getPlaceholderByType(result['Type']).subscribe(
            respdata => {
              let existing: any[] = this._toolButtons$.getValue();

              this.plcData = [];
              for (let plc of respdata['Data']) {
                this.plcData.push({
                  text: plc['Placeholder'], icon: '',
                  click: () => {
                    this.editor.exec('insertText', { text: plc['PlaceholderTag'] });
                  }
                })
              }
              let peopleButton: string = result['Type'];
              existing.push({ text: peopleButton, data: this.plcData });
              this._toolButtons$.next(existing);
            }, err => {
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            });
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + '%';
    }

    return value;
  }

  /*
@Type: File, <ts>
@Name: getThankYouPageById function
@Who:Renu
@When: 17-05-2022
@Why:EWM-8901 EWM-9096
@What: get data
*/
  getThankYouPageById(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.fetchThankYouDataById('?applicationId=' + ApplicationFormId).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.loading = false;
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.thankYouFrom.patchValue({
              Id: data?.Data?.Id,
              ApplicationFormId: ApplicationFormId,
              ThankYouMessage: data?.Data?.ThankYouMessage,
              SelfDeclarationMessage: data?.Data?.SelfDeclarationMessage,
              SelfDeclaration: (data?.Data?.SelfDeclaration == 1) ? true : false
            });
           this.getEditorVal=data?.Data?.ThankYouMessage;
            this.inputCountValue( data?.Data?.SelfDeclarationMessage);
            this.sendDataToParent(null);
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
@Name: sendDataToParent function
@Who:Renu
@When: 17-05-2022
@Why:EWM-8901 EWM-9096
@What: send form data parent to child
*/
  sendDataToParent(event) {
    
  if(event && !event?.checked){
      this.isEnabled=true;
  }else{
    this.isEnabled=false;
  }
    this.commonService.configueApplicationForm.next(this.thankYouFrom);
  }

 
  /* 
@Type: File, <ts>
@Name: inputCountValue function
@Who:Renu
@When: 17-05-2022
@Why:EWM-8901 EWM-9096
@What: input count for sub heading
*/
  inputCountValue(selfDeclarationData:string) {
    this.selfDeclarationCount = 500 - selfDeclarationData.length;
    this.subHeadingInputValue = selfDeclarationData;
  }


  
getEditorFormInfo(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  this.ownerList=event?.ownerList;
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDesc=false;
    this.thankYouFrom.get('ThankYouMessage').setValue(event?.val);
    this.sendDataToParent(this.thankYouFrom.get('ThankYouMessage').value);

  }
  else if(sources == undefined && event?.val==null ){
    this.editConfig();
    this.sendDataToParent(null);

  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.thankYouFrom.get('ThankYouMessage').setValue('');
    this.thankYouFrom.get('ThankYouMessage').setValidators([Validators.required]);
    this.thankYouFrom.get('ThankYouMessage').updateValueAndValidity();
    this.thankYouFrom.get("ThankYouMessage").markAsTouched();
    this.sendDataToParent(null);

  }
}
getEditorImageFormInfo(event){
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.showErrorDesc=false;
    this.thankYouFrom.get('ThankYouMessage').setValue(event?.val);
    this.sendDataToParent(this.thankYouFrom.get('ThankYouMessage').value);
  }else  if(event?.val!='' && sources==undefined){
    this.showErrorDesc=false;
    this.thankYouFrom.get('ThankYouMessage').setValue(event?.val);
    this.sendDataToParent(this.thankYouFrom.get('ThankYouMessage').value);

  }
  else if(sources == undefined && event?.val==null ){
    this.editConfig();
    this.sendDataToParent(null); 

  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.thankYouFrom.get('ThankYouMessage').setValue('');
    this.thankYouFrom.get('ThankYouMessage').setValidators([Validators.required]);
    this.thankYouFrom.get('ThankYouMessage').updateValueAndValidity();
    this.thankYouFrom.get("ThankYouMessage").markAsTouched();
    this.sendDataToParent(null);

  }  

}
editConfig(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_ThankYouMessage',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
  this.showErrorDesc=true;
  this.getRequiredValidationMassage.next(this.editorConfig);
    this.thankYouFrom.get('ThankYouMessage').updateValueAndValidity();  
    this.thankYouFrom.get("ThankYouMessage").markAsTouched();
  this.sendDataToParent(null);

}

}
