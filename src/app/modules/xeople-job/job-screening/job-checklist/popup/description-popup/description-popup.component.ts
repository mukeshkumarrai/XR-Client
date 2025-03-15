import { Component, OnInit, Inject,NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {take} from 'rxjs/operators';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({
  selector: 'app-description-popup',
  templateUrl: './description-popup.component.html',
  styleUrls: ['./description-popup.component.scss']
})
export class DescriptionPopupComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  public DescriptionResult = {
    Description:'',
    RowIndex:-1,
    IsMandatory:0,
    Action: 'SAVE',
    Source:''
  }
  taskComments: string;
  jobDesc:FormGroup;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<DescriptionPopupComponent>,@Inject(MAT_DIALOG_DATA) public DescriptionData: any,
  private _ngZone: NgZone) { 
    if(DescriptionData && DescriptionData!==undefined){
      this.DescriptionResult=DescriptionData.DescriptionData;
    }
    this.jobDesc = this.fb.group({
      Description: ['']
    })
  }

  ngOnInit(): void {
    if(this.DescriptionResult?.Description){
      this.jobDesc.patchValue({Description: this.DescriptionResult.Description});
      this.taskComments=this.DescriptionResult.Description;
    }
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
  onSave(){
    this.DescriptionResult.Description = this.jobDesc.get('Description').value;
    if(this.DescriptionResult.Description==undefined){
      this.DescriptionResult.Description='';
    }
    this.DescriptionResult.Description=this.DescriptionResult?.Description.trim();
    this.DescriptionResult.Action='SAVE';
    document.getElementsByClassName("add_jobDescription")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_jobDescription")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{
      this.dialogRef.close(this.DescriptionResult);
    },200);
  }

  onDismiss(){
    document.getElementsByClassName("add_jobDescription")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_jobDescription")[0].classList.add("animate__zoomOut");
    this.DescriptionResult.Action='DISMISS';
    setTimeout(() => {
       this.dialogRef.close(this.DescriptionResult); 
      }, 200);
  }

}
