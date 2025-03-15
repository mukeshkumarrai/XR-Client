import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-recentnotes-popup',
  templateUrl: './recentnotes-popup.component.html',
  styleUrls: ['./recentnotes-popup.component.scss']
})
export class RecentnotesPopupComponent implements OnInit {
  addNotesForm: FormGroup;
  loading: boolean;  
  public candidateIdData: any;
  public specialcharPattern = "^[a-z A-Z]+$";
  public tempID :  any;
  public GridDataListNotes:any = [];
  public gridDataListNotesById : any = [];
  public formType : string;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<RecentnotesPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,
    public candidateService: CandidateService,private routes: ActivatedRoute,
    private snackBService: SnackBarService,private translateService: TranslateService) { 
      this.tempID = data.NoteId;
      this.GridDataListNotes = data.GridDataListNotes;
      this.formType = data.formType;
    this.candidateIdData=data.candidateId;//@who:priti @why:EWM-2973 @what:'candidate id' is coming as input @when:30-sep-2021
    this.addNotesForm = this.fb.group({
      noteId: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required,Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    //@who:priti @why:EWM-2973 @what:code commented because 'candidate id' is coming as input @when:30-sep-2021
    // this.routes.queryParams.subscribe((value) => {
    //   this.candidateIdData = value.CandidateId
    // });

  this.gridDataListNotesById =  this.GridDataListNotes.filter(x => x['NoteId'] === this.tempID);

  if (this.tempID != undefined) {
    this.editForm(this.tempID);
  }

  
  if (this.formType === 'view') {

    this.addNotesForm.disable();  
  }
  
  }

  onConfirm(value): void {
    if (this.tempID != undefined) {
     this.updateNotes(value);
    }else{
      this.createNotes(value);
    }    
  }

  onDismiss():void {
    document.getElementsByClassName("add_people")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("add_people")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
  }



  
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Suika
   @When: 13-Aug-2021
   @Why: ROST-2214
   @What: For setting value in the edit form
  */

 editForm(Id: String) {  
        this.addNotesForm.patchValue({
          noteId: Id,
          name: this.gridDataListNotesById[0].NoteTitle,
          description: this.gridDataListNotesById[0].Description,
         
        });

      }

  
  createNotes(value) {
    this.loading = true;   
    let noteId;
    if (this.tempID != undefined) {
      noteId = this.tempID;
    } else {
      noteId = '0';
    }
    let notesObj = {};
    notesObj['CandidateId'] = this.candidateIdData;
    notesObj['NoteTitle'] = value.name;
    notesObj['Description'] = value.description; 
    notesObj['NoteId'] = noteId;    
    this.candidateService.createCandidateNotes(notesObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);         
          setTimeout(() => { this.dialogRef.close(true); }, 200);
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }

  updateNotes(value) {
    this.loading = true;   
    let noteId;
    if (this.tempID != undefined) {
      noteId = this.tempID;
    } else {
      noteId = '0';
    }
    let notesObj = [];
    let fromObj = {};
    let toObj = {};
    
    
    fromObj = this.gridDataListNotesById[0];
    fromObj['CandidateId'] = this.candidateIdData;  
    toObj['CandidateId'] = this.candidateIdData;
    toObj['NoteTitle'] = value.name;
    toObj['Description'] = value.description; 
    toObj['NoteId'] = noteId;  
    toObj['LastUpdated'] = this.gridDataListNotesById[0].LastUpdated;
    toObj['Status'] = this.gridDataListNotesById[0].Status;
    toObj['StatusId'] = this.gridDataListNotesById[0].StatusId;
    toObj['UName'] = this.gridDataListNotesById[0].UName;
   // console.log("toObj "+JSON.stringify(toObj));
   
    notesObj = [{
    "From":fromObj,
    "To":toObj
    }]
    
   
    this.candidateService.updateCandidateNotes(notesObj[0]).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        setTimeout(() => { this.dialogRef.close(true); }, 200);
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }


  


}
