import { Component, EventEmitter, Inject, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { Subscription } from 'rxjs';
import { customDescriptionConfig } from '@app/modules/EWM.core/shared/datamodels';

@Component({
  selector: 'app-job-indeed-description',
  templateUrl: './job-indeed-description.component.html',
  styleUrls: ['./job-indeed-description.component.scss']
})
export class JobIndeedDescriptionComponent implements OnInit {

  errMsg: boolean = false;
  public CancelValue = ``;
  //@ViewChild('descriptionBox') descriptionBox;
  selectedDescription: any;
  descrpConfigData: customDescriptionConfig[] = [];
  public isJobDescription: any;
  jobDesc:FormGroup;
  //  kendo image uploader Adarsh singh 01-Aug-2023
  @ViewChild('editor') editor: EditorComponent;
  subscription$: Subscription;
  loading:boolean;
  // End 
  /*
   @Type: File, <ts>
   @Name: constructor function
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: constructor for injecting services and formbuilder and other dependency injections
    */
  constructor(private fb: FormBuilder, public _sidebarService: SidebarService,
    public dialogRef: MatDialogRef<JobIndeedDescriptionComponent>, @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog,
    public dialog: MatDialog,  private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private appSettingsService: AppSettingsService ) {
    // this.descrpConfigData['TextLength'] = 500;
    this.descrpConfigData['LabelName'] = 'quickjob_jobDescription';
    this.descrpConfigData['IsRequired'] = false;
    this.jobDesc = this.fb.group({
      Description: ['', [Validators.required,Validators.maxLength(15000)]]
    })
  }

  ngOnInit(): void {
    this.CancelValue = this.data.DescriptionData;
    if (this.data.DescriptionData != ' ') {
      this.isJobDescription = this.data?.DescriptionData;
      this.selectedDescription = this.data?.DescriptionData;
      // this.jobDesc.patchValue({
      //   Description: this.data?.DescriptionData
      // })
    } 
    // else {
    //   this.CancelValue = this.data.DescriptionData;
    //   this.selectedDescription = this.data.DescriptionData;
    // }

  }

  // ngAfterViewInit() {
  // setTimeout(() => {
  //  this.descriptionBox.focus();
  // }, 1000);
  //}


  /*
   @Type: File, <ts>
   @Name: getDescription function
   @Who:  ANUP
   @When: 06-Sep-2021
   @Why: EWM-2682 EWM-2725
   @What: For get descripyion data
    */
  getDescription(dataDes) {
    if (dataDes == null || dataDes == undefined || dataDes == "" || dataDes.length == 0 || dataDes.length == 1) {
      this.selectedDescription = "";
      this.errMsg = false;
    }
    else {
      // if(dataDes.length > this.descrpConfigData['TextLength']){
      //   this.errMsg = true;
      // }else{
      this.selectedDescription = dataDes;
      this.errMsg = true;
      // }

    }
  }



  /* 
  @Type: File, <ts>
  @Name: sendDescription function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: For decription value and also popup close
 */

  sendDescription(value) {
    document.getElementsByClassName("add_jobDescription")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_jobDescription")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(value.Description); }, 200);
  }

  /* 
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: For popup close
  */
  onDismiss() {
    document.getElementsByClassName("add_jobDescription")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_jobDescription")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.CancelValue); }, 200);

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
