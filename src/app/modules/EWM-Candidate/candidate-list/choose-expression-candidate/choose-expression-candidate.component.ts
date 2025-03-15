import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuickCandidateComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quick-candidate/quick-candidate.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MapApplicationFormCandidateComponent } from '../map-application-form-candidate/map-application-form-candidate.component';
import { XeopleSmartEmailComponent } from '../xeople-smart-email/xeople-smart-email.component';


@Component({
  selector: 'app-choose-expression-candidate',
  templateUrl: './choose-expression-candidate.component.html',
  styleUrls: ['./choose-expression-candidate.component.scss']
})
export class ChooseExpressionCandidateComponent implements OnInit {
  dirctionalLang;
  constructor(public dialogRef: MatDialogRef<ChooseExpressionCandidateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,) { }


  ngOnInit(): void {
  }

  /*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
  */
  onDismiss(): void {
    document.getElementsByClassName("chooseExpressionCandidateModal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("chooseExpressionCandidateModal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    //this.route.navigate(['/client/cand/candidate/candidate', {CandidateId: this.candidateId}])
  }

  /*
    @Type: File, <ts>
    @Name: onAddCandidateForm function
    @Who: Adarsh Singh
    @When: 16-Dec-2022
    @Why: EWM-9627 EWM-9907
  */
  onAddCandidateForm() {
    this.dialogRef.close();
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickCandidateComponent, {
      panelClass: ['xeople-modal-full-screen', 'quickCandidateModal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: new Object({ isCandidate: true }),
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.dialogRef.close();
      }
      else {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this.dialog.open(ChooseExpressionCandidateComponent, {
          panelClass: ['xeople-modal-md', 'chooseExpressionCandidateModal', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }

  /*
    @Type: File, <ts>
    @Name: onXeopleSmaartEmail function
    @Who: Adarsh Singh
    @When: 16-Dec-2022
    @Why: EWM-9627 EWM-9907
  */
  onXeopleSmaartEmail() {
    this.dialogRef.close();
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(XeopleSmartEmailComponent, {
      panelClass: ['xeople-modal-md', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: new Object({ isCandidate: true }),
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) { }
      else if (res.pageName === 1) {
        this.dialogRef.close();
      }
      else {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this.dialog.open(ChooseExpressionCandidateComponent, {
          panelClass: ['xeople-modal-md', 'chooseExpressionCandidateModal', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }
  /* @Type: File, <ts>
     @Name: openMapAllicationFormModule Name
     @Who: Nitin Bhati
     @When: 20-Dec-2022
     @Why: EWM-9875
     @What: for open map application form
    */
     openMapAllicationFormModule(){
      const dialogRef = this.dialog.open(MapApplicationFormCandidateComponent, {
    // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 desc: sending apllicationId in popup--------->
        data: {  },
        panelClass: ['xeople-modal-lg', 'add-assessment-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
     
      dialogRef.afterClosed().subscribe(resData => {          
     
        //this.inputwithoutValidation(this.addForm.value);

      })     
  }

}
