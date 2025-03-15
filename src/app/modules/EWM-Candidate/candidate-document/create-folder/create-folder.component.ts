import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit {
  loading:boolean=false;
  addForm:FormGroup;
  isSubmit: boolean;
  constructor(public dialogRef: MatDialogRef<CreateFolderComponent>,private fb:FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
    ,private _services:DocumentService,  private translateService: TranslateService, private snackBService: SnackBarService,private appSettingsService: AppSettingsService) { 
    this.addForm=this.fb.group({
      ParentId:[0] ,
      Name: ['',[Validators.required, Validators.maxLength(100)]],//@when:1-nov-2021;@who:Priti Srivastva;@why: EWM-3298
      UserTypeId: [''],
      PageName:[''],
      BtnId: [''],
      Id:[],
    });
  }

  ngOnInit(): void {
    if(this.data.folderId!=undefined && this.data.folderId!=0)
    {
    this.addForm.patchValue({
       Name:this.data.name,
       Id:this.data.folderId
      });
    }
  }
  onDismiss()
  {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  onSave()
  {
    this.isSubmit=true;
    this.checkDuplicity();
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  checkDuplicity()
  {
    if(this.addForm.controls['Name'].value=='')
    {
      return;
    }
    let isfolder=1;
    if(this.data.type=='Document')
    {
      isfolder=0;
    }
    const formdata={
      Id:this.data.folderId,
      Value: this.addForm.controls['Name'].value,
      CheckFor: "Name",
      IsFolder:isfolder,
      UserTypeId:this.data.candidateId,
      ParentId:this.data.parentId
    };
    this._services.checkduplicity(formdata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.addForm.get("Name").setErrors({codeTaken: true});
            this.addForm.get("Name").markAsDirty();
          }
        }
        else if (data.HttpStatusCode == 204) {
         if(this.isSubmit==true) { 
           document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
         document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
         setTimeout(() => { this.dialogRef.close(this.addForm.value); }, 200);}
        
            this.addForm.get("Name").clearValidators();
            this.addForm.get("Name").markAsPristine();
            this.addForm.get('Name').setValidators([Validators.required, Validators.maxLength(100)]);
         // }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }
}
