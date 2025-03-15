import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../shared/services/Job/job.service';
import { QuickJobService } from '../../shared/services/quickJob/quickJob.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { CandidateService } from '../../shared/services/candidates/candidate.service';

export type ChartOptions = {
  

  series1: ApexAxisChartSeries;
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
  states: ApexStates;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-job-header',
  templateUrl: './job-header.component.html',
  styleUrls: ['./job-header.component.scss']
})
export class JobHeaderComponent implements OnInit {
  loading: boolean;
  animationVar: any;
  tagSelecteditem: any;
  JobTags: any;
  tagLength: any;
  tagLengthStatus: boolean;
  loadingscroll: boolean;
  expiryDate: any = 0;
  public days: number;
  hours: number;
  minutes: number;
  seconds: number;
  largeScreenTagData: any;
  smallScreenTagData: any;
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false;
  currentMenuWidth: any;
  public screnSizePerStage: number;
  public headerExpand: boolean = true;
  totalStages: any;
  public screenPreviewClass: string = "";

  pieChartData: any = [];
  public pieheight = 260;
  public piechartType: any = 'pie';
  public pieDataLegends = [];
  public pieData: any[];
  public pieDataColors = [];
  public cOptions1: Partial<ChartOptions>;
  public cOptions: Partial<ChartOptions>;
  public pieloading: boolean = false;
  public totalSource: any = 0;
  JobId: any;
  public Source: any;

  public userpreferences: Userpreferences;

  JobPostDate: any;
  loaderStatus: number;
  public loadingAssignJobSaved: boolean;
  public headerListData: any = [];
  public headerListDataCount: any = [];
  HeaderCount: any;
  JobDetails: any;
  JobName: any;
  WorkflowId: any;
  WorkflowName: any;
  OwnersList: any = [];
  public IsApplicationFormAvailable: any = 0;
  isClientId:string;
  smallScreenTagDataOwner: number;
  largeScreenTagOwner: boolean;
  mobileScreenTagOwner: boolean;
  MobileMapTagSelectedOwner: any[];
  largeScreenTagDataOwner: any;
  OwnerName: any;
  JobStatus: any;
  jobStatuslength: any;
  currentStatus: any;
  JobLatitude: any;
  JobLongitude: any;
  jobLocation: any;
  searchTextTag;

  constructor(private quickJobService: QuickJobService, private snackBService: SnackBarService,
    private translateService: TranslateService, private renderer: Renderer2, private jobService: JobService,
    public _userpreferencesService: UserpreferencesService, public candidateService: CandidateService) { }

  ngOnInit(): void {
    this.animationVar = ButtonTypes;
    this.userpreferences = this._userpreferencesService.getuserpreferences();

  }



  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }
  /*
      @Type: File, <ts>
      @Name: maxNumberClass function
      @Who: Nitin Bhati
      @When: 15-June-2022
      @Why: EWM-7044
      @What: For max number class config for the user
       */
  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = 'flext-start';
    } else {
      this.screenPreviewClass = '';
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }
    this.detectScreenSize();

    if (this.currentMenuWidth > 1750 && this.currentMenuWidth < 1800) {
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1650 && this.currentMenuWidth < 1750) {
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1500 && this.currentMenuWidth < 1650) {
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1400 && this.currentMenuWidth < 1500) {
      this.screnSizePerStage = 5;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1300 && this.currentMenuWidth < 1400) {
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 950 && this.currentMenuWidth < 1300) {
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 800 && this.currentMenuWidth < 950) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 600 && this.currentMenuWidth < 800) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 440 && this.currentMenuWidth < 600) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 580 && this.currentMenuWidth < 600) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 280 && this.currentMenuWidth < 441) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else {
      this.screnSizePerStage = 9;
      this.maxNumberClass(this.screnSizePerStage);
    }

    if (this.currentMenuWidth < 767) {
      this.headerExpand = false
    } else {
      this.headerExpand = true
    }
  }
  headerExpandCollapse() {
    this.headerExpand = !this.headerExpand;
  }
  /*
  @Type: File, <ts>
  @Name: detectScreenSize
  @Who: Niitn Bhati
  @When: 15-June-2022
  @Why: EWM-7043
  @What: Detect screen curerent size and change the menu list accordingly for small screen
*/

  private detectScreenSize() {
    this.mobileMenu(this.tagSelecteditem);
  }


  /*
  @Type: File, <TS>
  @Name: mobileMenu()
  @Who: Nitin Bhati
  @When: 14-June-2022
  @Why: EWM-7043
  @What: menu which will be shown as an header for screen size smaller
  */
  MobileMapTagSelected: any;
  mobileMenu(data) {
    if (data) {
      this.smallScreenTagData = 0;
      let items = data.slice(0, 2);
      let threeDotItems = data.slice(2, data.length);
      this.largeScreenTag = true;
      this.mobileScreenTag = false;
      this.MobileMapTagSelected = [];
      this.largeScreenTagData = items;
      this.smallScreenTagData = threeDotItems;

    }

  }

  /*
   @Type: File, <ts>
   @Name: getCandidateMappedJobHeaderTag function
   @Who: Nitin Bhati
   @When: 12-Oct-2021
   @Why: EWM-3144
   @What: For showing Candidate mapped job Header Tag data
  */
  reversecounter() {
    const timer = setInterval(() => {
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      // let distance = new Date(this.expiryDate).getTime() - now;
      let distance = Math.round(this.expiryDate) - now;

      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.abs(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes = Math.abs(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds = Math.abs(Math.floor((distance % (1000 * 60)) / 1000));

      // If the count down is finished, write some text
      if (distance < 0) {
        //  clearInterval(timer);
      }
    }, 1000);
  }

  getCandidateMappedJobHeaderTag(JobId) {
    //this.loading = true;
    this.quickJobService.getCandidateMappedJobHeadertags(JobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          // this.loading = false;

          this.JobTags = repsonsedata.Data;
          // this.JobTags = this.headerListData.JobTags;

          this.tagSelecteditem = this.JobTags.filter(x => x['IsSelected'] === 1);
          //console.log("items:",this.tagSelecteditem);
          this.tagLength = this.tagSelecteditem?.length;
          this.mobileMenu(this.tagSelecteditem);
          if (this.tagLength === 0) {
            this.tagLengthStatus = true;
          } else {
            this.tagLengthStatus = false;
          }
          this.reversecounter();
          //this.switchListMode(this.viewMode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          // this.loading = false;
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Suika
   @When: 12-Sept-2022
   @Why: EWM-7478-EWM-8497
   @What: Display Total data on piechart
*/
  getJobsummaryHeaderSourcepichart() {
    //this.pieloading = true;
    this.jobService.getJobsummaryHeaderSourcepichart('?jobid=' + this.JobId)
      .subscribe((data: ResponceData) => {
        this.pieData = [];
        this.pieDataLegends = [];
        this.pieDataColors = [];
        if (data.HttpStatusCode == 200) {
          this.pieChartData = data.Data;
          this.pieChartData.forEach(res => {
            res['legends'] = res.Source + '(' + res.Count + ')';
            this.pieData?.push(res.Count);
            this.pieDataLegends?.push(res.Source);
            //this.pieDataColors.push(res.ColorCode);
            this.totalSource += res.Count;
          })
          //this.pieloading = false;

          this.drawPiechart('');
        }
        else if (data.HttpStatusCode == 204) {
          this.pieChartData = [];
          this.pieData = [];
          this.pieDataLegends = [];
          this.pieDataColors = [];
          //this.pieloading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          //this.pieloading = false;
        }
      }, err => {
        //this.pieloading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  public drawPiechart(type: any) {
    this.cOptions = {
      series: this.pieData,
      chart: {
        events: {
          dataPointSelection: (event, chartContext, config) => {
            let pChartData = this.pieChartData[config.dataPointIndex];
            this.Source = pChartData.Source;
            this.getJobsummaryHeaderSourcepichart();
            // this.getCandidateListByJob(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
          },
          dataPointMouseEnter: function (event) {
            event.path[0].style.cursor = "pointer";
          }

        },
        height: this.pieheight,
        type: this.piechartType,// 'pie',
      },
      labels: this.pieDataLegends,
      // responsive: [{
      //   breakpoint: 480,
      //   options: {
      //     chart: {
      //       width: 300,
      //       zoom: {
      //         enabled: true
      //       }
      //     },
      //     legend: {
      //       position: 'bottom'
      //     }
      //   }
      // }]
    };



  }

  /*
  @Type: File, <ts>
  @Name: getCandidateMappedJobHeader function
  @Who: Nitin Bhati
  @When: 04-Oct-2021
  @Why: EWM-3144
  @What: For showing Candidate mapped job Header data
 */
  getCandidateMappedJobHeader(JobId) {
    // this.loading = true;
    if (this.loaderStatus === 1) {
      this.loadingAssignJobSaved = true;
    } else {
      this.loading = true;
    }
    this.quickJobService.getCandidateMappedJobHeader(JobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          // this.loading = false;
          this.loadingAssignJobSaved = false;

          this.headerListData = repsonsedata.Data;
          this.HeaderCount = this.headerListData.HeaderCount;
          this.JobDetails = this.headerListData.JobDetails;
          this.JobName = this.headerListData.JobDetails.JobTitle;
          this.WorkflowId = this.headerListData.JobDetails.WorkflowId;
          this.WorkflowName = this.headerListData.JobDetails.WorkflowName;
          this.OwnersList = this.headerListData.JobDetails.OwnersList;
          this.IsApplicationFormAvailable = this.headerListData.JobDetails.IsApplicationFormAvailable;
          this.isClientId = this.headerListData.JobDetails?.ClientId;

          // send data for job document share 
          this.candidateService.setCandidateName(this.JobName);

          this.smallScreenTagDataOwner = 0;
          let items = this.OwnersList.slice(0, 10);
          let threeDotItemsOwner = this.OwnersList.slice(10, this.OwnersList?.length);
          this.largeScreenTagOwner = true;
          this.mobileScreenTagOwner = false;
          this.MobileMapTagSelectedOwner = [];
          this.largeScreenTagDataOwner = items;
          this.smallScreenTagDataOwner = threeDotItemsOwner;

          this.OwnerName = this.headerListData.JobDetails.OwnerName;
          this.expiryDate = this.headerListData.JobDetails.ExpireIn;
          this.JobStatus = this.headerListData.JobStatus;
          this.jobStatuslength = this.headerListData.JobStatus?.length - 1;
          var currentSatausfilter = this.JobStatus.filter(x => x['CurrentStatus'] === 1);
          this.currentStatus = currentSatausfilter[0].Name;
          //this.JobTags = this.headerListData.JobTags;
          this.JobPostDate = this.headerListData.JobDetails.Ageing;
          this.JobLatitude = this.headerListData.JobDetails.Latitude;
          this.JobLongitude = this.headerListData.JobDetails.Longitude;
          this.jobLocation = this.headerListData.JobDetails.Location;

          // var item = this.JobTags.filter(x => x['IsSelected'] === 1);
          // this.tagLength = item.length;
          // if (this.tagLength === 0) {
          //   this.tagLengthStatus = true;
          // } else {
          //   this.tagLengthStatus = false;
          // }
          this.reversecounter();
          // this.switchListMode(this.viewMode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          // this.loading = false;
          this.loadingAssignJobSaved = false;
        }
      }, err => {
        //  this.loading = false;
        this.loadingAssignJobSaved = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: getCandidateEmailAndPhone function
  @Who: Adarsh singh
  @When: 05-Sep-2022
  @Why: EWM-7477
  @What: For showing Candidate emaisl and phones
*/
EmailsAndPhonesData;
largeEmailsAndPhonesData:[] = [];
smallEmailsAndPhonesData;
getResponseEmailPhone:any;
skillData:[]= [];
largeSkill:[]= [];

  getCandidateEmailAndPhone(JobId) {
    this.loading = true;
    this.quickJobService.getCandidateEmailAndPhone(JobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.EmailsAndPhonesData = repsonsedata.Data.ListCompanyContact;
          this.skillData = repsonsedata.Data.Skills;
          this.largeSkill = repsonsedata.Data.Skills;
          this.getResponseEmailPhone = repsonsedata.Data;
          let items = repsonsedata.Data.ListCompanyContact.slice(0, 2);
          this.largeEmailsAndPhonesData = items;
          let threeDotItemsEmailPhone =  this.EmailsAndPhonesData.slice(2, this.EmailsAndPhonesData?.length);
          this.smallEmailsAndPhonesData = threeDotItemsEmailPhone;
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
           this.loading = false;
        }
      }, err => {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Type: File, <ts>
   @Name: openNewTabForClientGoogleMapLocation
   @Who: Nitin Bhati
   @When: 14-JUne-2022
   @Why: EWM-7044
   @What: to open New window Tab For Client Google Map Location show
 */
   openNewTabForClientGoogleMapLocation(Latitude, Longitude, Location) {
    if ((Latitude != undefined && Latitude != null && Latitude != "") &&
      (Longitude != undefined && Longitude != null && Longitude != "")) {
      let urlloc = "https://www.google.com/maps/place/" + Latitude + ',' + Longitude;
      window.open(urlloc, '_blank');
    }
    else if (Location != undefined && Location != null && Location != "") {
      let urlloc = "https://www.google.com/maps/place/" + Location;
      window.open(urlloc, '_blank');
    }
    else {
      // console.log(canData)
    }
  }

}
