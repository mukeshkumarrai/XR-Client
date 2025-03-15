import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuickCompanyComponent } from '../../../modules/EWM.core/shared/quick-modal/quick-company/quick-company.component';
import { AddLeadComponent } from '../add-lead/add-lead.component';

@Component({
  selector: 'app-quick-company-choose',
  templateUrl: './quick-company-choose.component.html',
  styleUrls: ['./quick-company-choose.component.scss']
})
export class QuickCompanyChooseComponent implements OnInit {
  private dirctionalLang:any;
  PageUrl='/client/leads/lead/lead-landing'
  
  constructor(public dialogRef: MatDialogRef<QuickCompanyChooseComponent>,public dialogObj: MatDialog,public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openQuickCompanyModal() {
    this.dialog.open(QuickCompanyComponent, {
      data: new Object({ formType:"AddForm"}),
      panelClass: ['xeople-modal-full-screen', 'quickCompany', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }

  addLeadModal() {
    const dialogRef = this.dialog.open(AddLeadComponent, {
     data: new Object({ PageUrl:this.PageUrl}),
      panelClass: ['xeople-modal-md', 'add-lead', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.dialogRef.close();
      }
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    })
  }

  onDismiss(): void {
    document.getElementsByClassName("chooseCompanyModal")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("chooseCompanyModal")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
}
