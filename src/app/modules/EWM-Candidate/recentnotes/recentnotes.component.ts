import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { Icandidate } from '../profile-summary/candidate-summary/Icandidate.interface';
import { RecentnotesPopupComponent } from './recentnotes-popup/recentnotes-popup.component';

@Component({
  selector: 'app-recentnotes',
  templateUrl: './recentnotes.component.html',
  styleUrls: ['./recentnotes.component.scss']
})
export class RecentnotesComponent implements OnInit {
  background20: any;
  loading: boolean;  
  //public candidateIdData: any;
  @Input() candidateIdData: any;
  public GridDataListNotes : any = [];
  public userpreferences: Userpreferences;
  @Output() totalNotes = new EventEmitter();

  constructor(public dialog: MatDialog,public candidateService: CandidateService,private routes: ActivatedRoute,
    private snackBService: SnackBarService,private translateService: TranslateService, public _userpreferencesService: UserpreferencesService) {
   }

  ngOnInit(): void {
     //@who:priti @why:EWM-2973 @what:code commented because 'candidate id' is coming as input @when:28-sep-2021
    // this.routes.queryParams.subscribe((value) => {
    //   this.candidateIdData = value.CandidateId
    // });
    let primaryColor= document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);

    this.getCandidateNotesList();
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }

  

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }




  

  openRecentNotesModal(NoteId,formType) {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(RecentnotesPopupComponent, {
      maxWidth: "1000px",
      width: "65%",
      maxHeight: "85%",
      data: new Object({ NoteId: NoteId,GridDataListNotes:this.GridDataListNotes,formType:formType,candidateId:this.candidateIdData}),
      panelClass: ['quick-modalbox', 'add_people', 'animate__slow', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {  
      if (dialogResult == true) {
        this.getCandidateNotesList(); 
      }
    })
  }


  
  /* 
  @Type: File, <ts>
  @Name: getCandidateNotesList function
  @Who: Suika
  @When: 13-August-2021
  @Why: EWM-2376 EWM-2214
  @What: service call for creating notes List data  this.candidateIdData
  */
 getCandidateNotesList() {
  this.loading = true;
  this.candidateService.getCandidateNotesList("?candidateid=" + this.candidateIdData).subscribe(
    (repsonsedata: Icandidate) => {
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        this.loading = false;
        this.GridDataListNotes = repsonsedata.Data;
        this.totalNotes.emit(this.GridDataListNotes?.length);
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}




/*
    @Type: File, <ts>
    @Name: confirmDialog function
    @Who: Suika
    @When: 13-May-2021
    @Why: ROST-1506
    @What: FOR DIALOG BOX confirmation
  */
 confirmDialog(data): void {
 let notesObj = {};
 notesObj = data;
 notesObj['CandidateId'] = this.candidateIdData;
  const message = 'label_titleDialogContentSiteDomain';
  const title = 'label_delete';
  const subTitle = 'label_recentnotes';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {  
    if (dialogResult == true) {
      this.candidateService.deleteNotesById(notesObj).subscribe(
        (data: Icandidate) => {
          if (data.HttpStatusCode == 200) {   
            this.getCandidateNotesList();         
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
         
          } else if (data.HttpStatusCode == 400) {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());           
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }

        }, err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  });
}

}
