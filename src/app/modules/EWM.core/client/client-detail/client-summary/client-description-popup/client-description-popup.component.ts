import { Component, EventEmitter, Inject, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { TranslateService } from '@ngx-translate/core';
import { customDescriptionConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
@Component({
  selector: 'app-client-description-popup',
  templateUrl: './client-description-popup.component.html',
  styleUrls: ['./client-description-popup.component.scss']
})
export class ClientDescriptionPopupComponent implements OnInit {
  errMsg: boolean;
  public CancelValue = ``;
  //@ViewChild('descriptionBox') descriptionBox;
  selectedDescription: any;
  descrpConfigData: customDescriptionConfig[] = [];
  addForm: FormGroup;
  fromdata: any;
  public activestatus: string ='add';
  isDisabled:boolean;
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string;
  ownerList: string[]=[];
  public showErrorDesc: boolean = false;
  public tagList:any=['Jobs'];
  public basic:any=[];
  spaceError:boolean=false;
  lable_description: string='label_clientDescription';
  constructor(public dialogRef: MatDialogRef<ClientDescriptionPopupComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private snackBService: SnackBarService,
    private translateService: TranslateService, private _clientService: ClientService, private fb: FormBuilder,private appSettingsService: AppSettingsService) {

    this.addForm = this.fb.group({
      ClientID: [''],
      Id: [''],
      Description: ['', [Validators.required]],

    });
    this.descrpConfigData['LabelName'] = 'label_clientDescription';
    this.descrpConfigData['IsRequired'] = false;
  }



  ngOnInit(): void {
    this.CancelValue = this.data?.DescriptionData;
           //  @Who: maneesh, @When: 13-03-2024,@Why: EWM-16342-EWM-16207 @What: on changes on kendo editor catch the event here
           this.editorConfig={
            REQUIRED:false,
            DESC_VALUE:null,
            PLACEHOLDER:'quickjob_jobDescription',
            Tag:[],
            EditorTools:this.basic,
            MentionStatus:false,
            maxLength:0,
            MaxlengthErrormessage:false,
            JobActionComment:false,
            hideIcon:true

          };
    // if(this.data.formType!="add"){
    //   this.activestatus = 'add';

    //   this.selectedDescription = this.data.DescriptionData;
    //   this.addForm.patchValue(
    //     {
    //       ClientID: this.data.candidateId,
    //       Id: this.data.editId,
    //       Description: this.data.DescriptionData
    //     }
    //   );
    //   this.fromdata = this.addForm.value;
    // }else{
    //   this.addForm.patchValue(
    //     {
    //       ClientID: this.data.candidateId,
    //       Id: this.data.editId,
    //     }
    //   );
    // } 
    if(this.data?.clientType==='LEAD'){
     this.lable_description='label_lead_description';
    }else{
      this.lable_description='label_clientDescription';
    }
    if(this.data.formType!='edit'){
      this.activestatus = 'view';

      this.selectedDescription = this.data?.DescriptionData;
      this.addForm.patchValue(
        {
          ClientID: this.data?.candidateId,
          Id: this.data?.editId,
          Description: this.data?.DescriptionData
        }
      );
      this.getEditorVal=this.data?.DescriptionData;//by maneesh
      this.fromdata = this.addForm?.value;
    }else{
      this.addForm?.patchValue(
        {
          ClientID: this.data?.candidateId,
          Id: this.data?.editId,
        }
      );
    } 
    if(this.data?.formType!='view'){
      this.activestatus = 'edit';

      this.selectedDescription = this.data?.DescriptionData;
      this.addForm.patchValue(
        {
          ClientID: this.data?.candidateId,
          Id: this.data?.editId,
          Description: this.data?.DescriptionData
        }
      );
      this.getEditorVal=this.data?.DescriptionData;//by maneesh
      this.fromdata = this.addForm?.value;
    }else{
      this.addForm.patchValue(
        {
          ClientID: this.data?.candidateId,
          Id: this.data?.editId,
        }
      );
    }
    if (this.data?.formType=='add') {
      this.activestatus = 'add';
    }
    // console.log('this.activestatus',this.activestatus);

  }


  /*
   @Type: File, <ts>
   @Name: getDescription function
   @Who:  Priti
   @When: 22-Nov-2021
   @Why: EWM-3853
   @What: For get description data
    */
  getDescription(dataDes) {
    // <!-- commneted by Adarsh singh for EWM-8719  -->
    if (dataDes) {
     setTimeout(() => {
      let pTag:any = document.querySelectorAll('.ProseMirror > p');
      let olTag:any = document.querySelectorAll('.ProseMirror > ol');
      let ulTag:any = document.querySelectorAll('.ProseMirror > ul');

      if (pTag) {
        for (let i = 0; i < pTag?.length; i++) {
          if (pTag[i].textContent.trim()) {
            this.isDisabled = false;
            break;
          }else{
            this.isDisabled = true;
          }
        }
      }

      if ((olTag?.length > 0 )|| (ulTag?.length > 0)) {
        this.isDisabled = false;
      }
      
     }, 200);
    }
    // End 
    
    if (dataDes == null || dataDes == undefined || dataDes == "") {
      this.selectedDescription = "";
      this.errMsg = false;
      this.selectedDescription = dataDes;
      this.addForm.patchValue({
        Description: this.selectedDescription
      });
      this.getEditorVal=this.selectedDescription;//by maneesh
      }
    else {
      if (dataDes.length > this.descrpConfigData['TextLength']) {
        this.errMsg = true;
        } else {
        this.selectedDescription = dataDes;
        this.addForm.patchValue({
          Description: dataDes
        })
      this.getEditorVal=dataDes;//by maneesh

        this.errMsg = false;
      }

    }
  }

  /* 
  @Type: File, <ts>
  @Name: sendDescription function
  @Who: priti
  @When: 22-Nov-2021
  @Why: EWM-3853
  @What: For decription value and also popup close
 */

  sendDescription() {
    if (this.data?.editId != undefined && this.data?.editId != '' && this.data?.editId != '0') {
      const formdata = {
        From: this.fromdata,
        To: this.addForm.value
      }
      this._clientService.updatedescription(formdata).subscribe(
        (responseData: ResponceData) => {
          if (responseData.HttpStatusCode === 200) {
            this.addForm.reset();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

            document.getElementsByClassName("add_description")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("add_description")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(true); }, 200);

          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }
    else {
      const formdata = this.addForm.value;
      delete formdata.Id;
      this._clientService.createdescription(formdata).subscribe(
        (responseData: ResponceData) => {
          if (responseData.HttpStatusCode === 200) {
            this.addForm.reset();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

            document.getElementsByClassName("add_description")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("add_description")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(true); }, 200);

          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /* 
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: priti
  @When: 22-nov-2021
  @Why: EWM-3853
  @What: For popup close
  */
  onDismiss() {
    document.getElementsByClassName("add_description")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_description")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
      //  @Who: maneesh, @When: 14-03-2024,@Why: EWM-16343-EWM-16207 @What: on changes on kendo editor catch the event here
      getEditorFormInfo(event) {
        const regex = /<(?!img\s*\/?)[^>]+>/gi;   
        let result= event.val?.replace(regex, '\n')?.trim();
        this.ownerList = event?.ownerList;                
        if(result?.length !== 0) {
          this.showErrorDesc = false;
          this.isDisabled = false;
          this.spaceError = false;
          this.addForm.get('Description').setValue(event?.val);
        }  else if (event?.val=='' || event?.val ==null) {
          this.isDisabled = true;
          this.spaceError = false;
        }
        else if (result?.length == 0) {
          this.spaceError = true;
        }
         else {
          this.isDisabled = false;
          this.spaceError = false;
          this.addForm.get('Description').setValue(event?.val);
          this.addForm.get('Description').updateValueAndValidity();
          this.addForm.get("Description").markAsTouched();
        }
      }

    // who:maneesh,what: this is use for patch first time image upload data,when:02/04/2024
    getEditorImageFormInfo(event){            
      this.addForm.get('Description').setValue(event?.val);
      if (event?.val=='' || event?.val ==null) {
        this.isDisabled = true;
      }else{
        this.isDisabled = false;
      }
    }
}
