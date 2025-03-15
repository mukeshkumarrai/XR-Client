import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ResponceData } from 'src/app/shared/models';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
 

@Component({
  selector: 'app-manage-sms-templates',
  templateUrl: './manage-sms-templates.component.html',
  styleUrls: ['./manage-sms-templates.component.scss']
})
export class ManageSmsTemplatesComponent implements OnInit {
  addUserSmsForm:FormGroup;
  public specialcharPattern="^[A-Za-z0-9 ]+$";
  maxMessage: number=1600;
  submitted = false;
  loading:boolean;
  activestatus: string='Add';
  selectedModuleName: any;
  moduleArray: any = [];
  pagneNo = 1;
  public searchValue:string="";
  public smstemplateDescriptuion: string='';
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  getUserId:any;
  public statusList: any = [];

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
  
  //  kendo image uploader Adarsh singh 01-Aug-2023
subscription$: Subscription;
// End 
isResponseGet:boolean = false;
public modulId:number;
  constructor(private fb: FormBuilder,private systemSettingService:SystemSettingService,private snackBService:SnackBarService,
    public _sidebarService: SidebarService,private route: Router,
    private router: ActivatedRoute,private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
     public dialog: MatDialog,private appSettingsService:AppSettingsService,
    private translateService: TranslateService) {

      this.systemSettingService.getModulesListByTenant().subscribe(
        repsonsedata => {
          this.moduleArray = repsonsedata['Data'];          
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }); 
      this.systemSettingService.getPlaceholderTypeAll().subscribe(
          repsonsedata => {
            // <!---------@When: 01-11-2023 @who:maneesh,why:15015  @Desc- show only candidate and job --------->
            let Placeholder = repsonsedata['Data']?.filter(x=>x.Type!='Roster' && x.Type!='Employee' &&x.Type!='Clients');
            for(let result of Placeholder){
              this.systemSettingService.getPlaceholderByType(result['Type']).subscribe(
                respdata => {
                  let existing: any[] = this._toolButtons$.getValue();
                  this.plcData = [];                
                  for(let plc of respdata['Data']){
                    this.plcData.push({ text: plc['Placeholder'], icon: '', 
                    click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
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
        
      this.addUserSmsForm=this.fb.group({
      moduleId:[],
      // who:maneesh,what:ewm-12302 for by default status active patch,when:03/05/2023
      StatusId:[1,[Validators.required]],
      // who:maneesh,what:ewm-15173 for change max length,when:01/12/2023
      name: ['',[Validators.required,Validators.maxLength(75),Validators.minLength(2),Validators.pattern(this.specialcharPattern)]],
      smsbody:['',[Validators.required,Validators.maxLength(612),Validators.minLength(2)]],
      personTag:[''],
      shareTag:[0],
      jobTag:[''],
      id:[''],
    });
    }
  ngOnInit(): void {
    this.router.queryParams.subscribe(
      params =>{
        if (params.id != undefined && params.id != null && params.id != '') {
          this.activestatus = 'Edit';
          this.getUserId = params.id;
          this.getUserSmsById(this.getUserId)
        }
        else {}
        
      }) 

    this.getAllStatus();

  }

  /* 
  @Type: File, <ts>
  @Name: onSave function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-486
  @What: FOR creating groups data
  */
 onSave(value,actionStatus) {
  this.submitted = true;
  this.isResponseGet = true;
  if (this.addUserSmsForm.invalid) {
    return;
  }
  //  who:maneesh,what:ewm-11920 comment this for titel already exit dispaly when enter duplicate titel data (blur)="onTitleChanges(),when:03/05/2023 -->
  // this.onTitleChanges();
  if(value){
    if (this.activestatus == 'Edit') {
      this.edituserSms(value);
    } else {
      this.adduserSms(value);
    }
  }
}

/*
@Type: File, <ts>
@Name: onTitleChanges function
@Who: Renu
@When: 06-Jan-2020
@Why: EWM-640
@What: This function is used for checking duplicacy for role Name
*/
public onTitleChanges()
{
  let value = this.addUserSmsForm.value;
  let tempID = this.addUserSmsForm.get("id").value;
  if(tempID == '') {
    tempID = 0;
  }else if(tempID == null)
  {
    tempID = 0;
  }
  if(this.addUserSmsForm.get("name").value){
  this.systemSettingService.checkSmsTitleDuplicacy('?Title=' + this.addUserSmsForm.get("name").value + '&Id='+tempID ).subscribe(
    repsonsedata=>{     
     if(repsonsedata['HttpStatusCode']==200)
      {
        //if(repsonsedata['Data'] == true) {
          this.addUserSmsForm.get("name").setErrors({ codeTaken: true });
          this.addUserSmsForm.get("name").markAsDirty();
        //}else if(repsonsedata['Data'] == false) {
        
          //}
          
      }
      else{
       // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
       this.addUserSmsForm.get("name").clearValidators();
       this.addUserSmsForm.get("name").markAsPristine();
       this.addUserSmsForm.get('name').setValidators([Validators.required,Validators.maxLength(75),Validators.minLength(2),Validators.pattern(this.specialcharPattern)]);
  //  who:maneesh,what:ewm-11920 comment this for titel already exit dispaly when enter duplicate titel data (blur)="onTitleChanges(),when:03/05/2023 -->
      //  if(value){
      //    if (this.activestatus == 'Edit') {
      //      this.edituserSms(value);
      //    } else {
      //      this.adduserSms(value);
      //    }
      //  }
       this.loading=false;
      }
    },
    err=>{
      this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
  });
  }else
  {
    this.addUserSmsForm.get('name').setValidators([Validators.required,Validators.maxLength(75),Validators.minLength(2),Validators.pattern(this.specialcharPattern)]);
 
  }
  this.addUserSmsForm.get('name').updateValueAndValidity();
}

  /* 
  @Type: File, <ts>
  @Name: adduserSms function
  @Who: Nitin Bhati
  @When: 15-Dec-2020
  @Why: ROST-487
  @What: service call for creating Sms data
  */
 onChangeModule(moduledata){
  this.selectedModuleName=this.moduleArray.filter(s =>s.ModuleId===moduledata)[0]?.ModuleName;
  //who:maneesh,what:ewm-14350 for fixed moduleId,when:11/12/2023
  this.modulId=this.moduleArray.filter(s =>s.ModuleId===moduledata)[0]?.ModuleId;
 }
adduserSms(value)
 {  
   let status = value.StatusId;
   if (status == '1') {
     value['Status']='Active';
     } else {
       value['Status']='Inactive';
     }
   value['ModuleName']=this.selectedModuleName;
   value['IsShared']= value.shareTag?1:0;
   value['moduleId']=this.modulId;//who:maneesh,what:ewm-14350 for fixed moduleId,when:11/12/2023
   delete value['shareTag'];
   value['smsbody']=value.smsbody.replace(/<\/?p[^>]*>/g, "");//who:maneesh,what:ewm-14371 remove p tag ,when:15/12/2023
   this.pagneNo=1;
   this.submitted = true;
   if (this.addUserSmsForm.invalid) {
   return;
   }else
   {
     this.loading=true;
     this.systemSettingService.userSMSCreate(value).subscribe(
       repsonsedata=>{     
         this.loading=false;
         if(repsonsedata.HttpStatusCode==200){
           this.route.navigate(['./client/core/profile/sms-template']); //who:maneesh,what:ewm-15173 change pathwhen:01/12/2023
           this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
           this.addUserSmsForm.patchValue({
             moduleId:0,
             StatusId:1
           });
           this.searchValue='';
          setTimeout(() => {
            this.isResponseGet = false;
          }, 500);
         }else{
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
           this.loading=false;
          this.isResponseGet = false;
         }
       },err=>{
         this.loading=false;
         this.isResponseGet = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     
       })
 }
 }

/* 
  @Type: File, <ts>
  @Name: edituserSms function
  @Who: Nitin Bhati
  @When: 15-Dec-2020
  @Why: ROST-488
  @What: service call for update sms data
  */
 edituserSms(value)
 {  
  //this.pagneNo=1;// commented by priti ,@why:EWM-1325 date:12-april-2021
  let status = value.StatusId;
  if (status == '1') {
    value['Status']='Active';
    } else {
      value['Status']='Inactive';
    }
    value['ModuleName']=this.selectedModuleName;
    value['IsShared']= value.shareTag?1:0;
    value['moduleId']= value.moduleId;//who:maneesh,what:ewm-14350 for fixed moduleId,when:11/12/2023
    delete value['shareTag'];
   value['smsbody']=value.smsbody.replace(/<\/?p[^>]*>/g, "");//who:maneesh,what:ewm-14371 remove p tag,when:23/01/2024 

   this.submitted = true;
   if (this.addUserSmsForm.invalid) {
   return;
   }else
   {
     this.loading=true;
     this.systemSettingService.updateSms(value).subscribe(
       repsonsedata=>{     
         this.loading=false;
         if(repsonsedata.HttpStatusCode==200)
         {
           this.route.navigate(['./client/core/profile/sms-template']);  //who:maneesh,what:ewm-15173 change pathwhen:01/12/2023
           this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
           this.addUserSmsForm.patchValue({
            moduleId:0,
            StatusId:1
          });
           this.activestatus = 'Add'; // added by priti to handle add after Update date:11-jan-2021
           setTimeout(() => {
            this.isResponseGet = false;
          }, 500);
         }else{
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
           this.loading=false;
          this.isResponseGet = false;
         }
       },err=>{
        this.loading=false;
        this.isResponseGet = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
       })
 }
 }

  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 1600 - value.length;
    }
  }

      /*
 @Type: File, <ts>
 @Name: editForm function
 @Who: Renu
 @When: 18-May-2021
 @Why: ROST-2104
 @What: For setting value in the edit form
*/
currentValueById;
getUserSmsById(Id: Number) {
  this.loading = true;
  this.systemSettingService.getUserSmsById(Id).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        this.currentValueById = data.Data;
        this.editForm(this.currentValueById)
      }
      else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

/*
    @Type: File, <ts>
    @Name: editForm function
    @Who: Nitin Bhati
    @When: 25-dec-2020
    @Why: use for set value in patch file for showing information.
    @What: .
  */
 editForm(items) {
  this.addUserSmsForm.patchValue({
    id: items.Id,
    name: items.Title,
    smsbody: items.SmsBody,
    moduleId:items.ModuleId,
    StatusId:items.StatusId,
    shareTag:items.IsShared?1:0
  });
  this.smstemplateDescriptuion=items.SmsBody;
  this.activestatus = 'Edit';
  this.onMessage(items.SmsBody);
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


getAllStatus() {
  this.loading = true;
  this.systemSettingService.getAllUserTypeStatus().subscribe(
    repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == '200') {
        this.loading = false;
        this.statusList = repsonsedata['Data'];
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
ngOnDestroy(){
  this.subscription$?.unsubscribe();
}

}
