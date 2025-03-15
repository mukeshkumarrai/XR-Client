import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { Color } from '@angular-material-components/color-picker';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusMaster } from '../../../shared/datamodels/status-master';
import { ValueAxisComponent } from '@progress/kendo-angular-charts';


@Component({
  selector: 'app-candidate-rank',
  templateUrl: './candidate-rank.component.html',
  styleUrls: ['./candidate-rank.component.scss']
})
export class CandidateRankComponent implements OnInit {
  candiateRankForm:FormGroup;
  loading:boolean;
  JobId:any;
  candidateId:any;
  isColorRank:any
  public defaultColorValue = "#ffffff";
// color picker varibale 
showColorPallateContainer = false;
color: any = '#2883e9'
selctedColor = '#FFFFFF';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
isOpen = false;
isMoreColorClicked!: boolean;
// color picker End 
  constructor(  private commonserviceService: CommonserviceService,private fb: FormBuilder,private jobService: JobService,private translateService: TranslateService,
    private snackBService: SnackBarService,private routes: ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CandidateRankComponent>,) { 
      this.candiateRankForm = this.fb.group({
        CandidateRank: [null, [Validators.required,Validators.pattern("^[0-9]*$"), Validators.maxLength(5)]],
        RankColorCode: []
      })
  }

  ngOnInit(): void {
    this.getColorCodeAll()
    this.JobId = this.data?.jobId;
    this.candidateId = this.data?.candidate?.CandidateId;
      // who:maneesh,what:ewm-11116,for patch color picker Value,when:13/02/2023
    this.selctedColor = (this.data?.candidate?.RankColorCode == null) ? '#ffffff': this.data?.candidate?.RankColorCode;

    if (this.selctedColor != null) {
      let candiData = this.data?.candidate;
      // who:maneesh,what:ewm-11116,for patch color picker Value,when:12/02/2023
      this.candiateRankForm.patchValue({
        CandidateRank: candiData?.CandidateRank,
        RankColorCode: this.selctedColor,
      })
    }
  }
  
  onDismiss(){
    document.getElementsByClassName("candidateTimeline")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateTimeline")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  onConfirm(fromData){
    let uptObj={};
    uptObj['CandidateId'] = this.candidateId;
    uptObj['JobId'] = this.JobId;
    uptObj['CandidateRank'] = parseInt(fromData.CandidateRank);
    // who:maneesh,what:ewm-11116,for patch color picker Value,when:12/02/2023
    uptObj['RankColorCode'] = this.selctedColor;
 
    this.jobService.createUpdateCandidateRank(uptObj).subscribe((repsonsedata)=>{
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        setTimeout(() => { this.dialogRef.close(true); }, 200);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
        setTimeout(() => { this.dialogRef.close(true); }, 200);
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
  }

    /*
  @Type: File, <ts>
  @Name: hexToRgb
  @Who: Adarsh singh
  @When: 29-June-2021
  @Why: EWM-7081
  @What: TO CONVERT color to hex code 
  */
 hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

  conditionChcek() {
    let values = this.candiateRankForm.get("CandidateRank").value;
    if (10000 > values) {
      this.candiateRankForm.get("CandidateRank").clearValidators();
      this.candiateRankForm.get("CandidateRank").markAsPristine();
      this.candiateRankForm.get('CandidateRank').setValidators([Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(5)]);
    } else {
      this.candiateRankForm.get("CandidateRank").setErrors({ numbercheck: true });
      this.candiateRankForm.get("CandidateRank").markAsDirty();
    }
  }

  /* 
   @Type: File, <ts>
   @Name: onChange function
   @Who: Adarsh Singh
   @When: 06-07-2022
   @Why: EWM-7363 EWM-7607
   @What: For change color on chnage while select color
*/
public onChange(getColor: string): void {
  const color = getColor;
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
  this.defaultColorValue = hex;
}
// color picker start 
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11116
  @What: for open color picker dropdown
*/
showColorPallate(e:any) {
  this.overlayViewjob=!this.overlayViewjob;
  this.showColorPallateContainer = !this.showColorPallateContainer;
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11116
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.candiateRankForm.patchValue({
      RankColorCode: this.selctedColor
    })
  }else{
    this.candiateRankForm.patchValue({
      RankColorCode: null
    })
    this.selctedColor = null;
  }
  
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11116
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.candiateRankForm.patchValue({
    RankColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11116
  @What: close dropdown while click on more label
*/
closeTemplate() {
  this.showColorPallateContainer = true;
  this.isMoreColorClicked = true;
  setTimeout(() => {
    this.isMoreColorClicked = false;
  }, 100);
}
/*
  @Type: File, <ts>
  @Name: getColorCodeAll funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11116
  @What: get all custom color code from config file
*/
  getColorCodeAll() {
    this.loading = true;
    this.commonserviceService.getAllColorCode().subscribe((data: statusMaster) => {
      this.loading = false;
      this.themeColors = data[0]?.themeColors;
      this.standardColor = data[1]?.standardColors;
    },
      err => {
        this.loading = false;
      })
  }
// color picker End  

}
