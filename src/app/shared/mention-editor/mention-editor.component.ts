import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ImageUploadKendoEditorPopComponent } from '../modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { AppSettingsService } from '../services/app-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { KendoEditorImageUploaderService } from '../services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EditorComponent, Schema ,schema,Plugin} from '@progress/kendo-angular-editor';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ResponceData } from '../models/responce.model';
import {addMentionNodes, addTagNodes, getMentionsPlugin} from 'prosemirror-mentions';
import { EDITOR_CONFIG } from './mention-modal';
import { ShortNameColorCode } from '../models/background-color';
import { VoiceRecognitionService } from '../services/speech-to-text/voice-recognition.service'
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../services/snackbar/snack-bar.service';
import { CommonserviceService } from '../services/commonservice/commonservice.service';
@Component({
  selector: 'app-mention-editor',
  templateUrl: './mention-editor.component.html',
  styleUrls: ['./mention-editor.component.scss']
})
export class MentionEditorComponent implements OnInit {
  @Input() resetConfiguration: Subject<any> = new Subject<any>();
  @ViewChild('editor') editor: EditorComponent;
  subscription$: Subscription;
  loading:boolean = false;
  editorFormControl=new FormControl('');
  empAllObs: Subscription;
  subscriptionEditor$: Subscription;
  ownerList: string[]=[];
  pagesize:number;
  @Input() configuration: EDITOR_CONFIG;
  @Output() editorValueEmit: EventEmitter<any> = new EventEmitter<any>();
  public pagneNo: number = 1;
  sortingValue: string = "";
  searchValue:string='';
  results: any;
  Subscription$: Subscription;
  public recognizingVoice=false;
  notestimestampSubscription$: Subscription;
  @Input() set getEditorVal(value: string) {   
    if (!value || value== undefined || value== '' || value== ' ') {
      this.editorFormControl.setValue(null); 
     }
    else {
        this.editorFormControl.setValue(value);
    }
  }
  @Input() set getEmailEditorVal(value: string) {   //this line use for dash board threedot email 
    if (value==undefined) {
      this.editorFormControl.setValue(null); 
     }
    else {
        this.editorFormControl.setValue(value);
    }
  }
  isStillRecoginze = false;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  @Input() otherInputIcon:boolean;
  public mentionPlaceholder:boolean;
  placeholder:string;
  @Input() maxlengthValidation: Subject<any> = new Subject<any>();
  maxlengthData:boolean
  maxlengthEditor$: Subscription;
  showerrorMaxlength:boolean=false;
  maxlengthcount:number;
  @Output() editorImageValueEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() getRequiredValidationMassage: Subject<any> = new Subject<any>();
  @Input() canTagData:any;
  @Input() jobTagData:any;
  @Input() ThankUpage:boolean;
  @Input() ValidationMessageReset: Subject<any> = new Subject<any>();
  hideIcon:boolean=false;
  hideIconForAddCommonCallLog:boolean=false;
  @Input() handelWhitespace: boolean=false; //this line use for handel whitespace in call log editor by maneesh
  constructor(private appSettingsService: AppSettingsService,public dialog: MatDialog, private quickJobService: QuickJobService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,public voiceRecognitionService: VoiceRecognitionService,
    public systemSettingService: SystemSettingService,private translateService: TranslateService,
    public snackBService: SnackBarService,private _SystemSettingService: SystemSettingService,private commonserviceService: CommonserviceService) {
      this.pagesize = appSettingsService.pagesize;
      this.mentionPlaceholder=this.configuration?.MentionStatus;
    }
  ngOnInit(): void {    
    this.notestimestampSubscription$= this.commonserviceService.notestimestampResp?.subscribe(value => {
       if (value?.userTimeStamp!=undefined) {
        this.editor.exec('insertText', { text: value?.userTimeStamp });
      }
    });
    this.getJobPlaceholderData(); 
    this.getCanPlaceholderData();
    this.getEmployeeList(this.pagneNo,this.sortingValue,this.searchValue);
    this.subscriptionEditor$ = this.ValidationMessageReset.subscribe((data: EDITOR_CONFIG) => {      //by maneesh use for additional information popup      
      if (data) {
        this.showerrorMaxlength=true;
        this.editorFormControl.markAllAsTouched();
        this.editorFormControl.updateValueAndValidity();
      }
    })
    if(this.configuration?.REQUIRED){
      this.editorFormControl.setValidators([Validators.required]);
      this.editorFormControl.updateValueAndValidity();
    }

    
    this.subscriptionEditor$ = this.resetConfiguration.subscribe((data: EDITOR_CONFIG) => { 
      if (data) {
        this.editorFormControl.reset();
       this.editorFormControl.setValue(data?.DESC_VALUE??' ');
       if(this.configuration?.DISABLED){
        this.editorFormControl.disable();
      }
      }
    })
    // <!-- //who:maneesh,what:this condition use for hide and show dropdown icon,when:15/03/2024 -->
    if (this.configuration?.Tag?.length!=0) {
    this.getInsertPlaceholderByType(this.configuration?.Tag);    
    }
    if (this.configuration?.MentionStatus == true){ //show and hide place holder by maneesh
      this.placeholder='label_KendoEditor'
     }else{
    this.placeholder=''
  }
  this.maxlengthEditor$ = this.maxlengthValidation.subscribe((data: EDITOR_CONFIG) => {
    this.maxlengthData=data?.MaxlengthErrormessage;
    this.maxlengthcount=data?.maxLength;
    if(data?.MaxlengthErrormessage){
      this.showerrorMaxlength=true;
      this.editorFormControl.setErrors({maxlength:true});
      this.editorFormControl.markAllAsTouched();
      this.editorFormControl.updateValueAndValidity();
    }
    if(data?.ValidationMessage){ // @When: 01-05-2024 @who:Maneesh @why: EWM-16926 @what: use for only additional information 
      this.showerrorMaxlength=false;
      this.editorFormControl.markAllAsTouched();
      this.editorFormControl.updateValueAndValidity();
    }
  })
  this.getRequiredValidationMassage.subscribe((data: EDITOR_CONFIG) => {
    if(data?.REQUIRED==true){
      this.editorFormControl.setErrors({required:true});
      this.editorFormControl.setValidators([Validators.required]);
      this.editorFormControl.updateValueAndValidity();
      this.editorFormControl.markAllAsTouched();
    }
    if (data?.DESC_VALUE=='JobComments' && data?.REQUIRED==true) { //by maneesh this line use for only job action clear comment editor  value
      this.editorFormControl.setValue(' ');
      this.editorFormControl.reset();
      this.editorFormControl.setErrors({required:true});
      this.editorFormControl.setValidators([Validators.required]);
      this.editorFormControl.updateValueAndValidity();
      this.editorFormControl.markAllAsTouched(); 
    }
    if (data?.DESC_VALUE=='JobActionNotes' && data?.REQUIRED==true) { //by maneesh this line use for only job action clear comment editor  value
      this.editorFormControl.setValue(' ');
      this.editorFormControl.reset();
      this.editorFormControl.setErrors({required:true});
      this.editorFormControl.setValidators([Validators.required]);
      this.editorFormControl.updateValueAndValidity();
      this.editorFormControl.markAllAsTouched(); 
    }
    if (data?.DESC_VALUE=='EmployeeNotes' && data?.REQUIRED==true) { //by maneesh this line use for only job action clear comment editor  value
      this.editorFormControl.setValue(' ');
      this.editorFormControl.reset();
      this.editorFormControl.setErrors({required:true});
      this.editorFormControl.setValidators([Validators.required]);
      this.editorFormControl.updateValueAndValidity();
      this.editorFormControl.markAllAsTouched(); 
    }
  })
  if (this.ThankUpage) {
    this.getPlaceHolder();    
    }

    if (this.configuration?.hideIcon == true){ // hide icon for summery page edit discription ewm-17037  by maneesh
      this.hideIcon=this.configuration?.hideIcon;
        }else{
          this.hideIcon=false;
        }
   if (this.configuration?.hideIconForAddCommonCallLog == true){ // hide icon for add call log ewm-18655  by maneesh
      this.hideIconForAddCommonCallLog=this.configuration?.hideIconForAddCommonCallLog;
    }else{
      this.hideIconForAddCommonCallLog=false;
  }
  }
  ngOnDestroy() {
    this.notestimestampSubscription$.unsubscribe();
    this.Subscription$?.unsubscribe();
    this.subscriptionEditor$?.unsubscribe();
    this.empAllObs?.unsubscribe();
    this.maxlengthEditor$?.unsubscribe();
    this.voiceRecognitionService.text='';
  }
      /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 11-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/
openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'], ratioStatus:true, recommendedDimensionSize:true, recommendedDimensionWidth:'700',recommendedDimensionHeight:'700', }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
     if (res?.data != undefined && res?.data != '') {
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
 /*@Name: getEmployeeList @Who:Renu @When: 20-Feb-2024  @Why: EWM-16108 @What: user list of employee*/
 getEmployeeList(pagneNo?: number, orderBy?: string, searchVal?: string) {
  if (this.empAllObs) {
    this.empAllObs.unsubscribe();
 }
 this.empAllObs=this.quickJobService.getEmployeeList(pagneNo, this.pagesize, orderBy, searchVal).subscribe(
    (Responce: ResponceData) => {
      if (Responce.HttpStatusCode === 200) {
        this.loading = false;
        this.ownerList = Responce.Data.map((x: { [x: string]: any; })=>{return {
          'id':x['UserId'],
          'name':x['UserName'],
          'email':x['Email'],
          'ProfilePath':x['ProfileImageUrl'],
          'UserType':x['UserTypeCode'],
          'ProfileImage':x['ProfileImage'],
          'ShortName':x['ShortName']
        }
        });
      } else {
        this.loading = false;
        this.ownerList=[];
      }
    }, err => {
      this.loading = false;
      this.ownerList=[];
    });
    return  this.ownerList;
  }
    //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What: default schema
  mySchema = new Schema({
    nodes: addTagNodes(addMentionNodes(schema.spec.nodes)),
    marks: schema.spec.marks,
  });
    //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What: define your in build plugin
  public plugin = new getMentionsPlugin({
    getSuggestions: (type, text, done) => {
      if (type === "mention") {
        let res= this.ownerList.filter(val => val['name'].toLowerCase().startsWith(text.toLowerCase()));
        if(res?.length!==0){
          done(res);
        }
      }
    },
    getSuggestionsHTML: (items, type) => {
      if (type === "mention") {
        if(items?.length!==0)
        return this.getMentionSuggestionsHTML(items);
      }
    },
  });
    //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What: reintialise the plugin for kendo editor
  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    this.plugin,
    ...defaultPlugins,
  ];
    //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What:create html dropdown
   getMentionSuggestionsHTML = (items) => {
    return (
      '<div class="suggestion-item-list">' +items?.map((i) =>
      '<div class="suggestion-item" >'+
      ((i.ProfilePath && i.ProfilePath!='')? '<img src="'+i.ProfilePath+'">': '<span style="background-color:'+this.getBackgroundColor(i?.ShortName)+'">'+i.ShortName+'</span>')
      +'<div><div>'+ i.name+'</div><small>'+i.email+'</small></div>' + '</div>') ?.join("") +
        '</div>'
    );
  };
    //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What:om value change on editor
 //  @Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What: change background color
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }
  //@Who: Renu, @When: 27-Feb-2024,@Why: EWM-15213-EWM-16109 @What:om value change on editor
  valueChange(value: string){
    const sources = value?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
                          ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
   this.editorImageValueEmit.emit({val:this.editorFormControl.value});
   if (sources?.length>0) {
   this.editorImageValueEmit.emit({val:this.editorFormControl.value});
    this.editorFormControl.setErrors({required:false});
   }
    if(value?.replace(/(<([^>]+)>)/ig,"")=='' && sources==undefined){
      this.editorFormControl.setErrors({required:true});
      this.editorFormControl.markAllAsTouched();
      this.editorFormControl.setValue('');
    }
    //who:maneesh this condition use for show maxlength error,when:21/03/2024
    if(this.maxlengthData==true && value?.replace(/(<([^>]+)>)/ig,"")?.length>this.maxlengthcount ){
            this.showerrorMaxlength=true;
          this.editorFormControl.updateValueAndValidity();
          this.editorFormControl.markAllAsTouched();
        }else{
          this.showerrorMaxlength=false
        }
        this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length!==0? this.editorValueEmit?.emit({val:this.editorFormControl.value,ownerList:this.ownerList}):this.editorValueEmit?.emit({val:'',ownerList:this.ownerList});
        if (this.handelWhitespace==true) { //this line use for handel whitespace in call log editor
       this.valueChangeForAddCallLogeditor(value);    
        }
  }
   // @Who: Renu, @When: 12-March-2024,@Why: EWM-15213-EWM-16109 @What:to trigger touched event to parent for validation
  touch(evt: any) {    
    this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length!==0? this.editorValueEmit?.emit({val:this.editorFormControl.value,ownerList:this.ownerList}):this.editorValueEmit?.emit({val:'',ownerList:this.ownerList});
    //this.editorValueEmit.emit({val:this.editorFormControl.value,ownerList:this.ownerList});
    this.editorImageValueEmit.emit({val:this.editorFormControl.value});

  }
  recognizedText: string;
  recognitionSubscription: Subscription;
  startService() {
    this.voiceRecognitionService.init();
    this.isStillRecoginze = this.voiceRecognitionService.start() === true ? true : false;

  }
  startListening() {
    this.isStillRecoginze = true;
    this.voiceRecognitionService.startListening(this.editorFormControl?.value).then(result => {
      this.isStillRecoginze = true;
//this.editor.exec();
      this.editorFormControl.setValue(result);
      setTimeout(() => {
        this.stopListening()
      },100)
    this.valueChange(result);
    }).catch(error => {
      console.error('Voice recognition error:', error);
    });
  }
  stopListening() {
    this.isStillRecoginze = this.voiceRecognitionService.stop(this.editorFormControl?.value) === false ? false : true;
    this.voiceRecognitionService.stopListening();
  }
  stopService() {
    this.isStillRecoginze = this.voiceRecognitionService.stop(this.editorFormControl?.value) === false ? false : true;
    setTimeout(() => {
    this.editorFormControl.setValue(this.voiceRecognitionService.text);
    this.valueChange(this.voiceRecognitionService.text);
    },200)
  }


  getInsertPlaceholderByType(insertType) {    
    this.systemSettingService.getPlaceholderByType(insertType).subscribe(
      respdata => {
        if (respdata['Data']) {
          let existing: any[] = this._toolButtons$.getValue();
          this.plcData = [];          
          for (let plc of respdata['Data']) {
            this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
          }
          let peopleButton: string = insertType;
          // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
          existing.push({ text: peopleButton, data: this.plcData });
          let jobData: any = existing?.filter((item) => {
                return item.text === insertType
              });
              this._toolButtons$.next(jobData);
       }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

//  start // this code use for only application form configur inputRules,when:16/04/2024
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
      // this._toolButtons$.next(jobData); 
      // this.jobData = jobData;
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
      // this._toolButtons$.next(candidateData);
      // this.canData = candidateData;
    }
  }
//  end // this code use for only application form configur inputRules,when:16/04/2024


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

      valueChangeForAddCallLogeditor(value: string){//this line use for handel whitespace in call log editor by maneesh
          const sources = value?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1')); 
          this.editorImageValueEmit.emit({val:this.editorFormControl.value});
          if (sources?.length>0) {
          this.editorImageValueEmit.emit({val:this.editorFormControl.value});
            this.editorFormControl.setErrors({required:false});
            this.touch('');
          }
            if(value?.replace(/(<([^>]+)>)/ig,"")=='' && sources==undefined){
              this.editorFormControl.setErrors({required:true});
              this.editorFormControl.markAllAsTouched();
              this.editorFormControl.setValue('');
            }
            if(value.replace(/<p>\s*<\/p>/g, '').trim()?.length==0 && sources==undefined){
              this.editorFormControl.setErrors({required:true});
              this.editorFormControl.markAllAsTouched();
              this.editorFormControl.setValue('');
            }
            //who:maneesh this condition use for show maxlength error,when:21/03/2024
            if(this.maxlengthData==true && value?.replace(/(<([^>]+)>)/ig,"")?.length>this.maxlengthcount ){
                  this.showerrorMaxlength=true;
                  this.editorFormControl.updateValueAndValidity();
                  this.editorFormControl.markAllAsTouched();
                }else{
                  this.showerrorMaxlength=false
                }
                if(value.replace(/<p>\s*<\/p>/g, '').trim()?.length!=0 && sources==undefined){
                  this.editorFormControl.setErrors({required:false});
                  this.editorFormControl.value?.replace(/<p>\s*<\/p>/g, '').trim()?.length!==0? this.editorValueEmit?.emit({val:value.replace(/<p>\s*<\/p>/g, ''),ownerList:this.ownerList}):this.editorValueEmit?.emit({val:'',ownerList:this.ownerList});                  
                }
          if (this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length==0 && sources!=undefined) {
          this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length==0? this.editorValueEmit?.emit({val:this.editorFormControl.value,ownerList:this.ownerList}):this.editorValueEmit?.emit({val:'',ownerList:this.ownerList});  
          }else if(this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length==0 && sources==undefined) {
          this.editorFormControl.setErrors({whitespace:true});
          this.editorFormControl.updateValueAndValidity();
          this.editorFormControl.markAllAsTouched();
          this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length!==0? this.editorValueEmit?.emit({val:this.editorFormControl.value,ownerList:this.ownerList}):this.editorValueEmit?.emit({val:'',ownerList:this.ownerList}); 
          }
          if(sources!=undefined){
            this.editorFormControl.setErrors({required:false});
            this.editorValueEmit?.emit({val:this.editorFormControl.value,ownerList:this.ownerList})          
          }else{
            this.editorFormControl.value?.replace(/(<([^>]+)>)/ig, "").length!==0? this.editorValueEmit?.emit({val:this.editorFormControl.value,ownerList:this.ownerList}):this.editorValueEmit?.emit({val:'',ownerList:this.ownerList});
          }
          }
}
