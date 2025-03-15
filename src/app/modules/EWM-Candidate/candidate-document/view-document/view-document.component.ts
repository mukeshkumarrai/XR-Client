import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  documentData:any=null;
  loading: boolean=false;
  userpreferences: Userpreferences;
  constructor(public _userpreferencesService: UserpreferencesService,public dialogRef: MatDialogRef<ViewDocumentComponent>,@Inject(MAT_DIALOG_DATA) public data: any, 
  private _services:DocumentService,  private translateService: TranslateService, private snackBService: SnackBarService,
  private appSettingsService: AppSettingsService) { }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getDocumentDetails()
  }
  onDismiss()
  {
    document.getElementsByClassName("view_Document")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("view_Document")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  getDocumentDetails()
  {
    this.loading=true;
    this._services.getDocuemntById(this.data.Id,this.data.isExternal,this.data.jobId?this.data.jobId:'00000000-0000-0000-0000-000000000000')
    .subscribe((data:ResponceData)=>{
      if(data.HttpStatusCode==200)
      {
        this.loading=false;
        this.documentData=data.Data;
        
      }
      else if(data.HttpStatusCode==204)
      {
        this.loading=false;
       this.documentData=null;
      
      }else {
       this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);      
       this.loading = false;
     }
   }, err => {
     this.loading = false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
  }
}
