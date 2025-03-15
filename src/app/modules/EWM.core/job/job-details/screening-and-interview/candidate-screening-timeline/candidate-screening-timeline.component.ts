import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { ResponceData, Userpreferences } from '../../../../../../shared/models';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from '../../../../../../shared/services/commonservice/commonservice.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserpreferencesService } from '../../../../../../shared/services/commonservice/userpreferences.service';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { CandidatejobmappingService } from '../../../../../../shared/services/candidate/candidatejobmapping.service';
import { SnackBarService } from '../../../../../../shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-candidate-screening-timeline',
  templateUrl: './candidate-screening-timeline.component.html',
  styleUrls: ['./candidate-screening-timeline.component.scss'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('open', style({
        //height: '200px',
        marginBottom: '8px',
      })),
      state('closed', style({
        height: '0px',
        display: 'flex',
      })),
      transition('open => closed', [
        animate('.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ])
  ]
})
export class CandidateScreeningTimelineComponent implements OnInit {
  public totalStages: number;
  public screenPreviewClass: string="";
  public currentMenuWidth: number;
  public screnSizePerStage:number;
  private candidateId:string;
  private jobId:string;
  private workflowId:string;
  candidateData: any;
  timeLinePopUp: boolean;
  public userpreferences: Userpreferences;
  background30: any;
  timelineData: any=[];
  currenttimelineData: any=[];
  othertimelineData: any=[];
  hideMoreFields: boolean=false;

  otherTimeline
  @ViewChild('target') private myScrollContainer: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CandidateScreeningTimelineComponent>, public _userpreferencesService: UserpreferencesService, 
  private commonserviceService: CommonserviceService, public dialog: MatDialog,private _service: CandidatejobmappingService,
   private translateService: TranslateService, public systemSettingService: SystemSettingService,private snackBService: SnackBarService) { }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.candidateId=this.data.candidateId;
    this.jobId=this.data.jobId;
    this.workflowId=this.data.workflowId;
    this.getTimelinedetailsGrid();
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth,'onload');
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background30 = this.hexToRGB(primaryColor, 0.30);
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

  onDismiss(): void {
    document.getElementsByClassName("candidateTimeline")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateTimeline")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  isOpen;
  toggle(candidateData:any,timelineLength) {
    candidateData.isOpen = !candidateData.isOpen;
  }

  onSwiper(swiper) {
    // console.log(swiper);
   }
   onSlideChange() {
   //  console.log('slide change');
   }

  maxNumberClass(perSlide){
    if(this.totalStages>perSlide){
      this.screenPreviewClass = 'flext-start';
    }else{
      this.screenPreviewClass = '';
    }
  }
  // getTimelinedetails()
  // { 
  //   this.timeLinePopUp = true;
  //   this._service.getTimeLinedata(this.candidateId,this.workflowId,this.jobId).subscribe(
  //     (data: ResponceData) => {
  //       if (data.HttpStatusCode === 200) {
  //         this.candidateData = data.Data;
  //         this.totalStages = this.candidateData.TimelinesDetails.length;
  //         this.timeLinePopUp = false;

  //       }
  //       else if (data.HttpStatusCode === 204) {
  //         this.candidateData = data.Data;
  //         this.timeLinePopUp = false;
         
  //       }
  //       else {
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
  //         this.timeLinePopUp = false;
  //       }
  //     }, err => {
  //       this.timeLinePopUp = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //     });
  // }

  getTimelinedetailsGrid()
  { 
    this.timeLinePopUp = true;
    this._service.getCandidateMappedtoallJobTimelines(this.candidateId,this.workflowId,this.jobId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.timeLinePopUp = false;
         // this.candidateData = data.Data;
          this.timelineData= data.Data;
         this.currenttimelineData= this.timelineData.filter(x=>x.Timeline.JobId==this.jobId);
         this.othertimelineData= this.timelineData.filter(x=>x.Timeline.JobId!=this.jobId);

          //this.totalStages = this.timelineData?.TimelinesDetails?.length;
           this.timelineData.forEach(element => {
            element.isOpen=false           
           });

           //console.log("isOpen:",this.timelineData);
         
        }
        else if (data.HttpStatusCode === 204) {
          this.timeLinePopUp = false;
         // this.candidateData = data.Data;
         this.currenttimelineData = data.Data;
         
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.timeLinePopUp = false;
        }
      }, err => {
        this.timeLinePopUp = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event,loadingType) {
    if(loadingType=='onload')
    {
      this.currentMenuWidth = event;
    }else{
      this.currentMenuWidth = event.target.innerWidth;
    }
  
    if (this.currentMenuWidth > 960 && this.currentMenuWidth < 1200) {
      this.screnSizePerStage = 5;
      this.maxNumberClass(this.screnSizePerStage);
    } 
    else if (this.currentMenuWidth > 700 && this.currentMenuWidth < 961) {
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    }
    else if (this.currentMenuWidth > 540 && this.currentMenuWidth < 701) {
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    } 
    else if (this.currentMenuWidth > 420 && this.currentMenuWidth < 541) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } 
    else if (this.currentMenuWidth > 240 && this.currentMenuWidth < 421) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } 
    else {
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }

  onHideMoreField(el){
    setTimeout(() => { this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight, 
      left: 0, 
      behavior: 'smooth' }); }, 0);
    this.hideMoreFields=!this.hideMoreFields;
    
  }

}
