/*
@(C): Entire Software
@Type: File, <ts>
@Name: custom-html-editor.component.ts
@Who: Anup
@When: 6-sep-2021
@Why: EWM-2682 EWM-2725
@What:  This page wil be used for common Html Editor based on given endpoint
 */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { Subscription } from 'rxjs';
import { customDescriptionConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { AppSettingsService } from '../../services/app-settings.service';
import { KendoEditorImageUploaderService } from '../../services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { ImageUploadKendoEditorPopComponent } from '../image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';

@Component({
  selector: 'app-custom-html-editor',
  templateUrl: './custom-html-editor.component.html',
  styleUrls: ['./custom-html-editor.component.scss']
})

export class CustomHtmlEditorComponent implements OnInit {
remainingchr:number;
form: FormGroup;
@Input() formType;
formTypeStatus: boolean=false;

 //  kendo image uploader Adarsh singh 01-Aug-2023
 subscription$: Subscription;
 loading:boolean;
 @ViewChild('editor') editor: EditorComponent;

 // End
 
/*
@Who: Anup
@When: 6-sep-2021
@Why: EWM-2682 EWM-2725
@What: get (Input) config Data from parent and get set method for trigger 
*/
//@Input() config:customDescriptionConfig;
_configvalue: customDescriptionConfig;
 @Input() set config(configvalue: customDescriptionConfig) {
   this._configvalue = configvalue;
   this.remainingchr = this._configvalue.TextLength;
}
get config(): customDescriptionConfig {  
 return this._configvalue;
}


/*
@Who: Anup
@When: 6-sep-2021
@Why: EWM-2682 EWM-2725
@What: get (Input) Description Data from parent and get set method for trigger 
*/
 private _descrpValueIn: any;
 @Input() set descrpValueIn(value: any) {
  this._descrpValueIn = value;
 if( this._descrpValueIn != undefined && this._descrpValueIn != null){
    this.valueChangeKendo(this._descrpValueIn);
  }
}
get descrpValueIn(): any {  
 return this._descrpValueIn;
}

/*
@Who: Anup
@When: 6-sep-2021
@Why: EWM-2682 EWM-2725
@What: send (output) Description Data from child to parent 
*/
@Output() descrpValueOut:EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly fb: FormBuilder,  public dialog: MatDialog,
    private appSettingsService: AppSettingsService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
    this.form = this.fb.group({
      description: ['']
    });
  }

  ngOnInit(): void {
    if(this.formType=='view'){
      this.formTypeStatus=true;
    }
    
    //this.form.controls.description.disable();
  }


 /*
  @Type: File, <ts>
  @Name: valueChangeKendo function
  @Who: Anup
  @When: 6-sep-2021
  @Why: EWM-2682 EWM-2725
  @What: get drop down list on baisis of api endpoint recived
  */
  valueChangeKendo(value: any){ 
    this.descrpValueOut.emit(value);
      if(value !=undefined && value != null  && value != ' '){
      this.remainingchr=this._configvalue.TextLength-value.length;
    }else{
      this.remainingchr=this._configvalue.TextLength;
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
}
}
