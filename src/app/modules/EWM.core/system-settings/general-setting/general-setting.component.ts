/*
 @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 23-Nov-2020
  @Why: ROST-309
  @What: this file contains general setting page
*/

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorComponent, EditorModule } from '@progress/kendo-angular-editor';
import { Router } from '@angular/router';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { filter } from '@progress/kendo-data-query/dist/npm/transducers';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

@Component({
  providers: [MessageService],
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export class GeneralSettingComponent implements OnInit {
  /*
    @Type: File, <ts>
    @Who: Nitin Bhati
    @When: 23-Nov-2020
    @Why: ROST-309
    @What: Decalaration of Global Variables
  */
  userGeneralSettingList = [];
  userFrom: FormGroup;
  submitted = false;
  status: boolean = false;
  loading: boolean;
  result: string = '';
  public value = ``;
  ckeConfig: any;
  private rtl = false;
  private ltr = true;
  public maxCharacterLengthSubHead = 115;
  public appTitle;

  //  kendo image uploader Adarsh singh 01-Aug-2023
 subscription$: Subscription;
 @ViewChild('editor') editor: EditorComponent;

 // End
public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
public gridListView: any = [];
public maxlenth:number;
ownerList: string[]=[];
private maxlength = new BehaviorSubject<any[]>([]);
public toolButtons$: Observable<any> = this.maxlength.asObservable();
maxLengthEditorValue: Subject<any> = new Subject<any>();
showMaxlengthError:boolean=false;
getRequiredValidationMassage: Subject<any> = new Subject<any>();
  constructor(private translateService: TranslateService, private fb: FormBuilder, private _systemSettingService: SystemSettingService,
    private route: Router, private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService,   private messages: MessageService,private _appSetting: AppSettingsService,
    public dialog: MatDialog, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
    
    this.userFrom = this.fb.group({
      AppTitle: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      AppIntroduction: ['', [Validators.required]],
    });
    this.commonserviceService.refreshSearchComponent(); 
  }
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.ckeConfig = {
      title:"",
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      toolbar: [
        // { name: "editing", items: ["Scayt"] },
        // { name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"] },
        // { name: "links", items: ["Link", "Unlink", "Anchor"] },
        // { name: "tools", items: ["Maximize", "ShowBlocks", "Preview", "Print", "Templates"] },
       // { name: "document", items: ["Source"] },
       // { name: "insert", items: ["Image"] },
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote"] },
        { name: "justify", items: ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"] },
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor"] }
      ]
    };
    this.getUserGeneralSettingInfo();
    this.commonserviceService.event.subscribe(res => {
      //this.rtlLtrService.gridLtrToRtl(this.gridAdd,this.gridAdd1,this.search,res);
      if (res == 'rtl') {
        this.messages.notify(this.ltr);
      } else if (res == 'ltr') {
        this.messages.notify(this.rtl);
      }
    });
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
    //  @Who: maneesh, @When: 14-03-2024,@Why: EWM-16342-EWM-16361 fixed editor config 
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_applicationIntroduction',
      Tag:[],
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
   };
  }
  clickEvent() {
    this.status = !this.status;
  }
  router(url) {
    this.route.navigate(['./client/' + url]);
  }
  /*
  @Type: File, <ts>
  @Name: getUserGeneralSettingInfo
  @Who: Nitin Bhati
  @When: 23-Nov-2020
  @Why: ROST-309
  @What: to get all User Email Setting related Information
  */
  getUserGeneralSettingInfo() {
    this.loading = true;
    this._systemSettingService.getGeneralSettingInfo().subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          let AppIntroduction;
          if (repsonsedata['Data']['AppIntroduction']) {
            AppIntroduction = repsonsedata['Data']['AppIntroduction'];
            //this.commonserviceService.setTitle(repsonsedata['Data']['AppTitle']);
            localStorage.setItem('AppTitle',repsonsedata['Data']['AppTitle']);
          } else {
            //this.commonserviceService.setTitle('Entire Workforce Management');
            AppIntroduction = '';
            localStorage.setItem('AppTitle','Entire Workforce Management');
          }

          this.userFrom.patchValue({
            'AppTitle': repsonsedata['Data']['AppTitle'],
            'AppIntroduction': AppIntroduction
          })
          this.getEditorVal=AppIntroduction; //who:maneesh,what:ewm-16207 ewm-16361,when:14/03/2024
        }
      }, err => {  
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }
  /*
  @Type: File, <ts>
  @Name: updateGeneralSetting
  @Who: Nitin Bhati
  @When: 23-Nov-2020
  @Why: ROST-309
  @What: For update all user Email Setting Information
  */
  updateGeneralSetting(value) {
    this.loading = true;
    this.submitted = true;
    if (this.userFrom.invalid) {
      return;
    } else {
      value['AppTitle'] = value.AppTitle;
      value['AppIntroduction'] = value.AppIntroduction;
      this._systemSettingService.updateGeneralSettingInfo(JSON.stringify(value)).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.getUserGeneralSettingInfo();
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

  
  /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

    reloadApiBasedOnorg(){
    this.getUserGeneralSettingInfo();
    }

/*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 2-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this._appSetting.imageUploadConfigForKendoEditor['file_img_type_small'], size: this._appSetting.imageUploadConfigForKendoEditor['file_img_size_small'] }),
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
 //who:maneesh,what:ewm-16207 ewm-16358,when:14/03/2024
 getEditorFormInfo(event) {  
  this.ownerList = event?.ownerList;
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  let result= event.val?.replace(regex, '\n');
  if (result?.length>255) {
    this.maxlenth=result?.length;
    this.editConfig();  
    this.showMaxlengthError=true;
  }else if(result?.length<=255 && result?.length>0){
    this.showMaxlengthError=false;
    this.userFrom.get('AppIntroduction').setValue(event?.val?.replace(/(<([^>]+)>)/ig,""));
  }else if(result?.length==0 && sources == undefined ){
    this.showMaxlengthError=true;
    this.editConfigRequired();

  }
  else if(sources != undefined && result?.length<=255 ){
    this.userFrom.get('AppIntroduction').setValue(event?.val);    
  }
  // if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
  //   this.showMaxlengthError=false;
  //   if (event?.val?.replace(/(<([^>]+)>)/ig, "")?.length>255) {
  //     this.maxlenth=event?.val?.replace(/(<([^>]+)>)/ig, "")?.length;
  //     this.editConfig(); 
  //   this.showMaxlengthError=true;

  //     }else if(event?.val?.replace(/(<([^>]+)>)/ig, "")?.length<=255){
  //       this.userFrom.get('AppIntroduction').setValue(event?.val);
  //       this.showMaxlengthError=false;

  //     }  }
  else if(sources == undefined && event?.val==null ){
    this.editConfigRequired();
    this.showMaxlengthError=true;
    this.userFrom.get('AppIntroduction').setValue('');
    this.userFrom.get('AppIntroduction').setValidators([Validators.required]);
    this.userFrom.get('AppIntroduction').updateValueAndValidity();
    this.userFrom.get("AppIntroduction").markAsTouched();
  }
  else if(sources == undefined && event?.val==''){
    this.editConfigRequired();
    this.showMaxlengthError=true;
    this.userFrom.get('AppIntroduction').setValue('');
    this.userFrom.get('AppIntroduction').setValidators([Validators.required]);
    this.userFrom.get('AppIntroduction').updateValueAndValidity();
    this.userFrom.get("AppIntroduction").markAsTouched();
  }
}

editConfig(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_applicationIntroduction',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:255,
    MaxlengthErrormessage:true,
    JobActionComment:false
    }
    if (this.maxlenth>255) {
      this.showMaxlengthError=true;
    }else{
    this.showMaxlengthError=false;
    }
    this.userFrom.get('AppIntroduction').setValidators([Validators.required]);
    this.maxLengthEditorValue.next(this.editorConfig);
    this.userFrom.get('AppIntroduction').updateValueAndValidity();
    this.userFrom.get("AppIntroduction").markAsTouched();
}
getEditorImageFormInfo(event){
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  const regex = /<(?!img\s*\/?)[^>]+>/gi;   
  let result= event.val?.replace(regex, '\n');  
  if (result?.length>255) {
  this.editConfig();  
  this.showMaxlengthError=true;
}else if(result?.length<=255){
  this.showMaxlengthError=false;
  this.userFrom.get('AppIntroduction').setValue(event?.val?.replace(/(<([^>]+)>)/ig,""));
}  else if(sources != undefined && result?.length<=255 ){
  this.userFrom.get('AppIntroduction').setValue(event?.val);  
}
 else if(sources == undefined && event?.val==null ){
  this.editConfigRequired();
  this.showMaxlengthError=true;
  this.userFrom.get('AppIntroduction').setValue('');
  this.userFrom.get('AppIntroduction').setValidators([Validators.required]);
  this.userFrom.get('AppIntroduction').updateValueAndValidity();
  this.userFrom.get("AppIntroduction").markAsTouched();  
}
else if(sources == undefined && event?.val==''){
  this.editConfigRequired();
  this.showMaxlengthError=true;
  this.userFrom.get('AppIntroduction').setValue('');
  this.userFrom.get('AppIntroduction').setValidators([Validators.required]);
  this.userFrom.get('AppIntroduction').updateValueAndValidity();
  this.userFrom.get("AppIntroduction").markAsTouched();
}
}
editConfigRequired(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_applicationIntroduction',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.userFrom.get('AppIntroduction').updateValueAndValidity();
    this.userFrom.get("AppIntroduction").markAsTouched();
}
}
