/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: landing-page.component.ts
 @Who: Renu
 @When: 23-May-2022
 @Why: ROST-6558 EWM-6782
 @What: preview automatic form component
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { PreviewSaveService } from '../shared/preview-save.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
 
  loading: boolean = false;
  imagePreviewStatus: boolean;
  public imagePreviewloading: boolean = false;
  public logoPreviewUrl: string;
  public opicityData="1";
  headingInputValue:string='';
  subHeadingInputValue:string='';
  AboutUs: any;
  showUploadResume: boolean=false;
 // typeResumeSelected: number;
  public stepperConfig: any;
  applicationParam: string;
  applicationFormId: any;
  IsAutoFill: any;
  mode: string;
  ApplicationFormId: any;

  constructor(private snackBService: SnackBarService, private jobService: JobService,private translateService: TranslateService,
    private routes: ActivatedRoute,private  previewSaveService:PreviewSaveService) { }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationParam='?applicationId='+parms?.applicationId;
      }else  if (parms?.jobId){
        this.applicationParam='?jobId='+parms?.jobId;
      }
      if(parms?.mode){
        this.mode=parms?.mode;
      }
    });

    this.previewSaveService.welcomePageInfoChange.subscribe((res:any)=>{
      if(res){
        this.getWelcomePageDataById(res);
      }
   
    });
    
    this.previewSaveService.stepperConfigInfo.subscribe((res:any)=>{
      this.stepperConfig=res;
    })
  
  }

/*
@Type: File, <ts>
@Name: getWelcomePageDataById function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6558 EWM-6782
@What: get data welcome page by Id
*/
getWelcomePageDataById(res: any) {
          this.ApplicationFormId=res?.ApplicationFormId;
          if (res?.BannerImageURL != '') {
            this.imagePreviewStatus = true;
            this.logoPreviewUrl = res?.BannerImageURL;
          } else {
            this.imagePreviewStatus = false;
            this.logoPreviewUrl =res?.BannerImageURL;
          }
          this.AboutUs=res?.AboutUs;
          this.IsAutoFill=res?.IsAutoFill;
          this.headingInputValue=res?.Heading;
          this.subHeadingInputValue=res?.SubHeading;
          this.opicityData = ((res?.BannerTransparency)/100).toString();
          this.previewSaveService.coverLetterInfo.next(res?.IsCoverLetter);
          this.previewSaveService.IsResumeInfo.next(res?.IsResume);
        }
   


/*
@Type: File, <ts>
@Name: goToManualApplyJob function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6558 EWM-6782
@What: get job manual/automatic
*/
goToManualApplyJob(type:number){
this.showUploadResume=true;
//this.typeResumeSelected=type;
this.previewSaveService.typeResumeSelectedInfo.next(type); 
this.previewSaveService.onIsAutoFillInfo.next(type==1?1:0);
}

/*
@Type: File, <ts>
@Name: showUploadResumeCheck function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6558 EWM-6782
@What: when click from previous button
*/
 
showUploadResumeCheck(event){
  this.showUploadResume=event;
}



}
