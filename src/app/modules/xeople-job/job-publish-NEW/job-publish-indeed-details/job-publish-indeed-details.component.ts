import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder,FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject} from 'rxjs';
import { Userpreferences } from '@app/shared/models';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { JobDescriptionPopupEditorComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';

@Component({
  selector: 'app-job-publish-indeed-details',
  templateUrl: './job-publish-indeed-details.component.html',
  styleUrls: ['./job-publish-indeed-details.component.scss']
})
export class JobPublishIndeedDetailsComponent implements OnInit {

  public loading: boolean = false;
  addForm: FormGroup;
  public searchDataList: any = [];
  public divStatus: boolean = false;
  public loadingSearch: boolean;
  public loadingSearchS:boolean;
  currency:string = '';
  city:string = '';
  country:string ='';
  public divLoopStatus:number=1;
  step = 0;
  jobPublishArray = {};
  jobId: any;
  jobRefId: any;
  JobCount: any;
  LastJobPostdate: any;
  public userpreferences: Userpreferences;
  @Input() selectedIndexId:any;
  public divStatusKey: boolean = false;
  payTypeName: string;
  selected = -1;
  result: string = '';
  workflowId: any;
  jobDataById: any;
  JobTitle: any;
  Location: any;
  selected1: any;
  JobDescription: any;
  public divStatusJobDetails: boolean = false;
  jobDetailsById: string;
  filledCount: number = 0;
  radiofilledCount: number = 0;
  totalfilledCount: number = 0;
  @ViewChildren('textboxes') textboxes: QueryList<ElementRef>;
  filledCount1: number;
  jobTitle: any;
  totalFilledPercentage: number=100;
  DescriptionValue: any = ` `;
  selectedIndex: number;
  Published: any;
  dateStart = new Date();
  minDate: Date;
  maxDate: Date;
  applyType: any;
  private destroy:Subject<null> = new Subject();
  tabIndexStatus: boolean=false;
  DefaultJobDetail: any;
  applicationFormName: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  logoURL:string;
  shareJobApplicationUrl: string;
  experienceName: string;
  categoryList: any=[];
  experienceList: any=[];
  educationList: any=[];
  remoteTypeValue: boolean;
  isHidePayInformationStatus: boolean;
  constructor(private fb: FormBuilder, private router: Router,
    public _sidebarService: SidebarService,public _userpreferencesService: UserpreferencesService,private route: ActivatedRoute,public dialogObj: MatDialog,private commonserviceService: CommonserviceService) { 
    this.addForm = this.fb.group({
      clientName: [],
      clientHoldingName: [],
      emailIds: [],
      applicationFormNameValue: [],
      applicationURL:[],
      careerSiteURL:[''],
      jobTitle: [],
      category:[],
      categoryId:[],
      jobType: [],
      DateExpiry: [],
      curency: [],
      PayType: [],
      SalaryRangeMinimum:[],
      SalaryRangeMaximum:[],
      payLabelCheck:[],
      jobDetailsCheck:[],
      jobDescription:[],
      remoteJob:[],
      workplaceType:[],
      experience:[],
      education:[],
      Address1: [],
      Address2: [],
      address: this.fb.group({
        'AddressLinkToMap': [],
      }),
      Latitude :[],
      Longitude :[]
      
    }); 
  }
  ngOnInit(): void {
  this.addForm.disable();    
    this.commonserviceService.onSeekJobformValidSelectIdActive.subscribe(data => {    
      this.tabIndexStatus=data;
      this.addForm.disable();
      if (this.tabIndexStatus === true) {
        this.commonserviceService.onSeekJobPreviewSelectId.subscribe(value => {
          if (value !== null && this.tabIndexStatus===true && value?.jobType=='indeed') {
             this.jobDataById = value;
              this.addForm.patchValue({
              clientName:this.jobDataById?.job?.clientName,
              clientHoldingName:this.jobDataById?.job?.holdingCompany,
              emailIds:this.jobDataById?.job?.emailID,
              applicationFormNameValue:this.jobDataById?.job?.ApplicationFormName,
              careerSiteURL:this.jobDataById?.job?.trackingUrl,
              jobTitle:this.jobDataById?.job?.jobTittle,
              AddressLinkToMap:this.jobDataById?.job?.streetAddress,
              category:this.jobDataById?.job?.category,
              jobType:this.jobDataById?.job?.jobType,
              DateExpiry:new Date(this.jobDataById?.job?.jobExpiryDate),
              curency:this.jobDataById?.job?.currency,
              PayType:this.jobDataById?.job?.payType,
              SalaryRangeMinimum:this.jobDataById?.job?.salaryMin,
              SalaryRangeMaximum:this.jobDataById?.job?.salaryMax,
              jobDescription:this.jobDataById?.job?.JobDescription,
              remoteJob:this.jobDataById?.job?.isRemoteJob,
              experience:this.jobDataById?.experience,
              education:this.jobDataById?.job?.education,
              payLabelCheck:this.jobDataById?.job?.isHidePayInformation,
              jobDetailsCheck:this.jobDataById?.job?.jobDetailsCheck
            });
            if(this.jobDataById?.job?.isRemoteJob==1){
              this.remoteTypeValue=true;
              this.addForm.patchValue(
                {
                  workplaceType: this.jobDataById?.job?.workplaceType,
                })
            }else{
              this.remoteTypeValue=false;
            }
            this.isHidePayInformationStatus=this.jobDataById?.job?.isHidePayInformation;
            this.categoryList=this.jobDataById?.job?.category;
            this.experienceList=this.jobDataById?.job?.experience;
            this.educationList=this.jobDataById?.job?.education;
             this.DescriptionValue=this.jobDataById?.job?.jobDescription;
            this.shareJobApplicationUrl=this.jobDataById?.job?.applicationURL;
              this.applicationFormName=this.jobDataById?.applicationFormName;
              this.LastJobPostdate=this.jobDataById?.LastJobPostdate;
              this.JobCount=this.jobDataById?.JobCount;
              this.logoURL=localStorage.getItem('IndeedLogoURL');
              this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(this.jobDataById?.job?.streetAddress);
                 }         
        });
        } 
    });
 this.route.params.subscribe(
      params => {
        if (params['jobId'] != undefined) {
          this.jobId = params['jobId'];
          this.jobRefId = params['jobRefId'];
          this.workflowId = params['workId'];
        }
      });
     
      this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
   setStep(index: number) {
      this.step = index;
    }
  
    nextStep() {
      this.step++;
    }
  
    prevStep() {
      this.step--;
    }
    
  /*
     @Type: File, <ts>
     @Name: oncancel
     @Who: Nitin Bhati
     @When: 19-Nov-2023
     @Why: EWM-14478
     @What: Redirect to job landing page
  */
    oncancel(){
      this.router.navigate(['/client/core/job/job-landingpage/' + this.workflowId]);
    }
   /* 
    @Type: File, <ts>
    @Name: openDialogforDescription function
    @Who: Nitin Bhati
    @When: 19-Nov-2023
    @Why: EWM-14478
    @What:Dialog for html Editor for description
   */
  openDialogforDescription() {
    const dialogRef = this.dialogObj.open(JobDescriptionPopupEditorComponent, {
      maxWidth: "750px",
      data: { DescriptionData: this.DescriptionValue, },
      panelClass: ['quick-modalbox', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(DescriptionData => {
      this.addForm.patchValue({
        jobDescription: DescriptionData
      });
      this.DescriptionValue = DescriptionData;
     });
  } 
/*
  @Name: ngOnDestroy
  @Who: Nitin Bhati
  @When: 19-Nov-2023
  @Why: EWM-14478
  @What: use for unsubsribe service
*/
ngOnDestroy() {
  this.destroy$.next(true);
  this.destroy$.unsubscribe();
  }

}
