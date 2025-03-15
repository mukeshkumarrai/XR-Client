import { Component, Inject, Input, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ActivatedRoute } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { CoverPageViewDetailsComponent } from '../cover-page-view-details/cover-page-view-details.component';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-cover-page-version-history',
  templateUrl: './cover-page-version-history.component.html',
  styleUrls: ['./cover-page-version-history.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ]),
      fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CoverPageVersionHistoryComponent implements OnInit {
  public loading:boolean=false;
  public isLoading:boolean = false;
  animationState = false;
  public formtitle: string = 'grid';  
  public userpreferences: Userpreferences;
  @Input() candidateId: any
  public gridView:any=[];
  background20: any;
  public viewMode: string = "listMode";   
  public coverPageName: any;
  constructor( public _sidebarService: SidebarService,public candidateService: CandidateService,
     public dialogRef: MatDialogRef<CoverPageVersionHistoryComponent>,public _userpreferencesService: UserpreferencesService,
     public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,) {
      // console.log("data ",data);
      this.candidateId = data.Id;
      this.coverPageName = data.Name;
     }

  ngOnInit(): void {
    this.fetchVersionHistory('onClick');
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);
  }


  
      /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: Suika
  @When: 13-May-2022
  @Why: ROST-6720
  @What: creating animation
*/

animate() {
  this.animationState = false;
  setTimeout(() => {
    this.animationState = true;
  }, 0);
}
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}

mouseoverAnimation(matIconId, animationName) {
  let amin= localStorage.getItem('animation');
  if(Number(amin) !=0){
    document.getElementById(matIconId).classList.add(animationName);
  }
}
mouseleaveAnimation(matIconId, animationName) {
  document.getElementById(matIconId).classList.remove(animationName)
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

    /*
     @Type: File, <ts>
     @Name: fetchVersionHistory function
     @Who: Suika
     @When: 13-May-2022
     @Why: ROST-6720
     @What: on fetch resume history
   */
  fetchVersionHistory(callMethod: string) {
    if (callMethod == 'onload') {
      this.loading = true;
    } else {
      this.loading = false;
    }
    this.candidateService.fetchCoverPageVersionHistory("?id=" +this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.gridView = repsonsedata.Data;         
        } else if (repsonsedata.HttpStatusCode == 204) {         
          this.loading = false;
        } else {         
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      
      })
  }

  
   /*
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Suika
  @When: 17-May-2022
  @Why: EWM-6605 EWM-6720
  @What: for close popup
  */
 onDismiss() {
  document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({status:false}); }, 200);
}



openCoverPageViewDetails(Id){
  const dialogRef = this.dialog.open(CoverPageViewDetailsComponent, {
    data: {Id:Id},
    panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn' ],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {     
    if (res != false) {
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
  })
}

openCoverPage(coverData) {
  document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({coverData:coverData,status:false}); }, 200);
}


/*
   @Type: File, <ts>
   @Name: onDownloadResume function
   @Who: Suika
   @When: 22-May-2022
   @Why: ROST-6605,EWM-6720
   @What: on click doanload button
 */
onDownloadCoverPage(url: any, FileName: any) {
   FileSaver.saveAs(url, FileName);
 }

}
