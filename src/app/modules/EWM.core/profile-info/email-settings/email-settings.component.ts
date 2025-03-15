/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 20-Nov-2020
  @Why: ROST-366 ROST-398 ROST-399
  @What:  This page will be use for the security info Component ts file
*/
import { Component, ElementRef, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorComponent, EditorModule } from '@progress/kendo-angular-editor';
import { Router } from '@angular/router';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { MatDialog } from '@angular/material/dialog';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { Subject, Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

@Component({
 providers: [ MessageService ],
 //providers: [{ provide: MessageService, useValue: true }],
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss'],
})
export class EmailSettingsComponent implements OnInit {
  /*
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 20-Nov-2020
  @Why: ROST-399
  @What:  Decalaration of Global Variables
*/
  userEmailSettingList=[];
  userFrom:FormGroup;
  submitted = false;
  status: boolean = false;
  loading:boolean;
  result: string = '';
  public value = ``;
  ckeConfig: any;
  private rtl = false;
  private ltr=true;
  public maxCharacterLengthSubHead = 115;

//  kendo image uploader Adarsh singh 01-Aug-2023
@ViewChild('editor') editor: EditorComponent;
subscription$: Subscription;
// End
public editorConfig: EDITOR_CONFIG;
public getEditorVal:string;
ownerList: string[]=[];
getRequiredValidationMassage: Subject<any> = new Subject<any>();
ownerListData: string[]=[];

   constructor(private translateService:TranslateService,private fb: FormBuilder,private _profileInfoService:ProfileInfoService,
    private route: Router,private snackBService:SnackBarService,private commonserviceService:CommonserviceService,public _sidebarService: SidebarService,private messages: MessageService,
    public dialog: MatDialog, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private appSettingsService: AppSettingsService,private cache: CacheServiceService) {

    this.userFrom=this.fb.group({
      UserEmail:[''],
      EmailDisplayName:['',[Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      EmailSignature:['',[Validators.required]],
    })
  }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.getUserEmailSettingInfo();

    this.commonserviceService.event.subscribe(res => {
      //this.rtlLtrService.gridLtrToRtl(this.gridAdd,this.gridAdd1,this.search,res);
      if(res=='rtl'){
         this.messages.notify(this.ltr);
         }else if(res=='ltr'){
        this.messages.notify(this.rtl);
        }
      },err=>{
        this.loading = false;
      })

      this.commonserviceService.onOrgSelectId.subscribe(value => {
        if(value!==null)
        {
            this.reloadApiBasedOnorg();
        }
       })
       this.editorConfig={
        REQUIRED:true,
        DESC_VALUE:null,
        PLACEHOLDER:'label_yourEmailSignature',
        Tag:[],
        EditorTools:[],
        MentionStatus:false,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false
      }
  }
 clickEvent() {
    this.status = !this.status;
  }
  router(url){
    this.route.navigate(['./client/'+url]);
  }
 /*
  @Type: File, <ts>
  @Name: getUserProfileInfo
  @Who: Nitin Bhati
  @When: 20-Nov-2020
  @Why: ROST-399
  @What: to get all User Email Setting related Information
*/
getUserEmailSettingInfo()
{
  this.loading=true;
  this._profileInfoService.getUserEmailSettingInfo().subscribe(
    repsonsedata=>{
      this.loading=false;
      if(repsonsedata['HttpStatusCode']=='200')
      {
        let EmailSignature;
          if(repsonsedata['Data']['EmailSignature'])
          {
            EmailSignature=repsonsedata['Data']['EmailSignature'];
          }
         else
          {
            EmailSignature='';
          }

          this.userFrom.patchValue({
          'UserEmail':repsonsedata['Data']['UserEmail'],
          'EmailDisplayName':repsonsedata['Data']['EmailDisplayName'],
          'EmailSignature':EmailSignature
        })
      this.getEditorVal=EmailSignature; //by maneesh
      }
    },err=>{
      this.loading = false;
   // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
/*
  @Type: File, <ts>
  @Name: updateEmailSetting
  @Who: Nitin Bhati
  @When: 20-Nov-2020
  @Why: ROST-399
  @What: For update all user Email Setting Information
*/
updateEmailSetting(value)
  {
    this.loading=true;
    this.submitted = true;
    if (this.userFrom.invalid) {
    return;
    }else
    {
      value['UserEmail']=value.UserEmail;
      value['EmailDisplayName']=value.EmailDisplayName
      value['EmailSignature']=value.EmailSignature;
     this._profileInfoService.updateUserEmailSettingInfo(JSON.stringify(value)).subscribe(
        repsonsedata=>{
          this.loading=false;
          if(repsonsedata.HttpStatusCode==200)
          {
            //Who:Ankit Rawat, What:EWM-16493 EWM-16501 Set local storage for User Email Signature, When:20March2024
            this.cache.setLocalStorage("UserEmailSignature",value.EmailSignature);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.getUserEmailSettingInfo();
            }else{
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading=false;
          }
        },err=>{
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading=false;
        })
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
      this.getUserEmailSettingInfo();
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
}

editConfig(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_yourEmailSignature',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
  this.getRequiredValidationMassage.next(this.editorConfig);
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();
}

getEditorFormInfo(event) {
  this.ownerListData = event?.ownerList;        
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.userFrom.get('EmailSignature').setValue(event?.val);
    this.userFrom.get('EmailSignature').clearValidators();
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();

  }else if(event?.val!='' && sources==undefined){
    this.userFrom.get('EmailSignature').setValue(event?.val);
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();
  }
  else{
    this.userFrom.get('EmailSignature').setValue('');
    this.userFrom.get('EmailSignature').setValidators([Validators.required]);
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();
  }
}

getEditorImageFormInfo(event){
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.userFrom.get('EmailSignature').setValue(event?.val);
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();

  }
  else if(event?.val!='' && sources==undefined){
    this.userFrom.get('EmailSignature').setValue(event?.val);
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();
  }else{
    this.userFrom.get('EmailSignature').setValue('');
    this.userFrom.get('EmailSignature').setValidators([Validators.required]);
    this.userFrom.get('EmailSignature').updateValueAndValidity();
    this.userFrom.get("EmailSignature").markAsTouched();
  }

}
}
