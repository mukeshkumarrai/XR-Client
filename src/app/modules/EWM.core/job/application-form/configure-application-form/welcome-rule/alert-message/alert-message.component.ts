import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent implements OnInit {


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
  @Input() isStatusSelected:boolean=false; 
  @Input() defaultCandStatus:any;
  @Input() pageLabel:any;
  @Output() alertDetails =  new EventEmitter(); 
  @Output() closeMsgSection =  new  EventEmitter();
  @Input() canTagData:any;
  @Input() jobTagData:any;
   animationVar: any;
   defaultSMSCandStatus = "Thank you for your application for the  {{Jobs.JobTitle}} at {{Jobs.Company}}. We really appreciate your interest in joining our company and we want to thank you for the time and energy you invested in your application. We received a large number of applications, and after carefully reviewing all of them, unfortunately, we have to inform you that this time we won’t be able to invite you to the next round of our hiring process. Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process. However, we really appreciated your application and you are welcome to apply again at {{Jobs.Company}} in the future. We wish you all the best in your job search.";       
  canData: any;
  jobData: any;
  subscriptionOnChange$: Subscription;
    constructor(private fb: FormBuilder,private systemSettingService: SystemSettingService, private snackBService: SnackBarService, private translateService: TranslateService,) { 
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
  }


  patchData(){
    if(this.pageLabel=='Welcome_Page'){
      if(this.isStatusSelected){
        this.addForm.patchValue({
          TemplateText:this.defaultCandStatus!=''?this.defaultCandStatus:this.defaultSMSCandStatus
        })
      }
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
    if(this.pageLabel=="Welcome_Page"){
      this.alertDetails.emit({alertMMsg:this.addForm.get('TemplateText').value});     
    }
  
   
   
  }

  restMessage(){
    if(this.pageLabel=='Welcome_Page'){
      if(this.isStatusSelected){
        this.addForm.patchValue({
          TemplateText:this.defaultSMSCandStatus
        })
      } 
    }
  }

  clearAlertMsg(){
    this.closeMsgSection.emit(true);
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
  ngOnDestroy() {
    this.subscriptionOnChange$.unsubscribe();
  }
}
