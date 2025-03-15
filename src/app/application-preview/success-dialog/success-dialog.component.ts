import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreviewSaveService } from '../shared/preview-save.service';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent implements OnInit {
  loading:boolean=false;
  successMsg: boolean;
  orgName: any;
  thankYouMsg: any;
  constructor( private routes: ActivatedRoute,private  previewSaveService:PreviewSaveService) { }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.req==1) {
        this.successMsg=true;
      }else{
        this.successMsg=false;
      }
    })
    let getClasswrapper = document.getElementById("preview-section");
    getClasswrapper.classList.add('thanku-preview-section');
    this.previewSaveService.orgNameChange.subscribe((data: any) => {
      this.orgName = data;
    });
    this.previewSaveService.successMsgChange.subscribe((data: any) => {
      this.thankYouMsg = data;
    });
  }

}
