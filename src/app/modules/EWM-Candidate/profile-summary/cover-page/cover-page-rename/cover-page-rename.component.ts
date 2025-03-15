import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-cover-page-rename',
  templateUrl: './cover-page-rename.component.html',
  styleUrls: ['./cover-page-rename.component.scss']
})
export class CoverPageRenameComponent implements OnInit {
  loading:boolean=false;
  addForm:FormGroup;
  isSubmit: boolean;
  pattern:"/^(\s+\S+\s*)*(?!\s).*$/";
  constructor(public dialogRef: MatDialogRef<CoverPageRenameComponent>,private fb:FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
    ,private _services:CandidateService,private translateService: TranslateService, private snackBService: SnackBarService,) { 
    this.addForm=this.fb.group({
      JobId:[0] ,
      Name: ['',[Validators.required, Validators.maxLength(150),Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
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
  }
  onSave()
  {
    this.isSubmit=true;
    this.checkDuplicity();
  }
  checkDuplicity()
  {
    if(this.addForm.controls['Name'].value=='')
    {
      return;
    }
   
   
    let  Id =this.data.folderId;
     let Value= this.addForm.controls['Name'].value;     
     let  UserTypeId =this.data.candidateId;
     let JobId =this.data.JobId;
    
    this._services.checkduplicity('?id='+Id+'&Value='+Value+'&UserTypeId='+UserTypeId+'&JobId='+JobId).subscribe(
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
            this.addForm.get('Name').setValidators([Validators.required, Validators.maxLength(150),Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]);
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
