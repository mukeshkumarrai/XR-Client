import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  isLoading:boolean=true;
  show:boolean=false;
  viewer = 'viewer';  
  DemoDoc:string='';
  fileType: string;
  constructor(public dialogRef: MatDialogRef<PdfViewerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.isLoading=true;
    this.DemoDoc=data.url;
    this.fileType = data.fileType;
    if(this.DemoDoc!='')
    {
      this.show=true;
      setTimeout(()=>{this.isLoading=false;},1100);
     // const list = this.DemoDoc.split('.');
        //this.fileType = list[list.length - 1];       
          if(this.fileType=='PDF' || this.fileType=='pdf'){                 
            this.viewer = 'url';
          }else{
            this.viewer = 'office';
          }  
          
    }
   }

  ngOnInit(): void {
  }
  onDismiss()
  { document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);

  }
}
