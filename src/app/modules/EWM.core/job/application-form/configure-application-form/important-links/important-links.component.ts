import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewNotesComponent } from 'src/app/modules/EWM-Candidate/recentnotes/view-notes/view-notes.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddImportantLinksComponent } from './add-important-links/add-important-links.component';

@Component({
  selector: 'app-important-links',
  templateUrl: './important-links.component.html',
  styleUrls: ['./important-links.component.scss']
})
export class ImportantLinksComponent implements OnInit {
  loading: boolean;
  importantLinksList = [];
  ApplicationFormId: number;
  dirctionalLang;
  @Input() IsImportant = '';
  TotalCount: number;
  public isReadMore: any[] = [false];
  importantLinksForm: FormGroup;


  constructor(public dialog: MatDialog, private routes: ActivatedRoute, private _commonService: CommonserviceService,
    private _jobService: JobService, private snackBService: SnackBarService, private translateService: TranslateService,
    private fb: FormBuilder) {
      this.importantLinksForm = this.fb.group({
        allImportantList: []
      })
     }
  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.ApplicationFormId = parseInt(parms?.Id)
        this.getImportantLinksByApplicationId(parseInt(parms?.Id))
      }
    });
  }


  sendDataToParent() {
    this._commonService.importantLinksForm.next(this.importantLinksForm);
  }

/*
@Type: File, <ts>
@Name: getImportantLinksByApplicationId function
@Who: Adarsh singh
@When: 30-Oct-2022
@Why: EWM-8897 EWM-9270
@What: get data
*/
  getImportantLinksByApplicationId(ApplicationFormId: any) {
   // this.loading = true;
    this._jobService.getImportantLinksAll('?applicationId=' + ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.TotalCount = data?.Data.Count;          
          if (data.Data?.ImportantLinkDetails?.length != 0 || data?.Data?.ImportantLinkDetails != undefined && data?.Data?.ImportantLinkDetails != null && data?.Data?.ImportantLinkDetails != '') {
            this.importantLinksList = data?.Data.ImportantLinkDetails;
            // this.importantLinksList = this.data;
            this.importantLinksForm.patchValue({
              allImportantList: this.importantLinksList
            });
            this.sendDataToParent();   
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /* 
  @Type: File, <ts>
  @Name: findIndexToUpdate function
  @Who: Adarsh singh
  @When: 30-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: return index value
  */
  findIndexToUpdate(newItem) {
    return newItem.Heading === this;
  }

  /* 
  @Type: File, <ts>
  @Name: openAddImportantLinksModal function
  @Who: Adarsh singh
  @When: 30-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: For open add important links form
  */

  openAddImportantLinksModal(type, data:any) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(AddImportantLinksComponent, {
      data: new Object({ editId: type, ApplicationFormId: this.ApplicationFormId, dataByEdit: data ,importantLinksList: this.importantLinksList}),
      panelClass: ['xeople-modal', 'add_ImportantLinks', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
      }
      else {
        if (res.status == 'Edit') {
          let updateItem = this.importantLinksList.find(this.findIndexToUpdate, data.Heading);
          let index = this.importantLinksList.indexOf(updateItem);
          this.importantLinksList[index] = res.data;
        }
        else {
          this.importantLinksList.push({
            Heading: res.data.Heading,
            SubHeading: res.data.SubHeading,
            IconPath: res.data.IconPath,
            URL: res.data.URL,
            Description: res.data.Description,
            DisplaySequence: 0
          })
        }
        this.importantLinksForm.patchValue({
          allImportantList: this.importantLinksList
        });
        this.sendDataToParent();  
      }
      
    })
  }

  /* 
  @Type: File, <ts>
  @Name: drop function
  @Who: Adarsh singh
  @When: 30-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: For drop and drag values
  */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.importantLinksList, event.previousIndex, event.currentIndex);
    this.importantLinksForm.patchValue({
      allImportantList: this.importantLinksList
    });
    this.sendDataToParent();  
  }

  /*
  @Type: File, <ts>
  @Name: activestate function
  @Who: Adarsh singh
  @When: 30-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: disable all action button
  */
  activestate() {
    return !this.IsImportant;
  }

  /*
  @Type: File, <ts>
  @Name: deleteImportant links function
  @Who: Adarsh singh
  @When: 30-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: FOR DIALOG BOX confirmation for delete
  */
  deleteImportantList(val, name, Id): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.importantLinksList.forEach((element, index) => {
          if (element.Heading == name) val.splice(index, 1);
        });
        this.importantLinksForm.patchValue({
          allImportantList: this.importantLinksList
        });
        this.sendDataToParent();  
      }
    });
  }

  /*
  @Type: File, <ts>
  @Name: OpenViewPopUp function
  @Who: Adarsh singh
  @When: 30-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: for view detailed record
  */
  // OpenViewPopUp(data: any) {
  //   const dialogRef = this.dialog.open(ViewNotesComponent, {
  //     data: { notesViewInfo: data },
  //     panelClass: ['xeople-modal-lg', 'view_notes', 'animate__animated', 'animate__zoomIn'],
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     if (dialogResult) {}
  //   });
  // }
/* 
   @Type: File, <ts>
   @Name: socialURL function
   @Who: Adarsh singh
   @When: 31-Oct-2022
   @Why: EWM-8897 EWM-9270
   @What: for redirect on new tab with url 
*/
socialURL(url){
  let http = url.search('http')
  let tempurl;
  if(http===-1){
    tempurl = "http://"+url;
  }else{
    tempurl = url;
  }
  if(url!=''){
    window.open(tempurl,'_blank')
  }
}
}
