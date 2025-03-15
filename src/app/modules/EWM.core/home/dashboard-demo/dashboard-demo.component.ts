/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 2-May-2023
  @Why: EWM-11814 EWM-12300
  @What:  This page will be use for the dashboard demo component ts file
*/

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEmailIntegration } from '../../shared/datamodels'
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CustomizingWidgetService } from 'src/app/shared/services/dashboard-widget/customizing-widget/customizing-widget.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { ClientService } from '../../shared/services/client/client.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

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

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  ClientId: string;
  ClientName: string;
  CountryCode: string;
  CountryName: string;
  CountryId: number;
  Address: string;
  draggable: boolean;
  icon: string;
  LocationId: string;
}

@Component({
  selector: 'app-dashboard-demo',
  templateUrl: './dashboard-demo.component.html',
  styleUrls: ['./dashboard-demo.component.scss']
})
export class DashboardDemoComponent implements OnInit {

  isShowActionList: any = [];
  public pageNo: number = 1;
  public pageSize = 200;
  public sortingValue: string = "Order,description,asc";
  public sortedcolumnName: string = 'Order';
  searchVal: string = '';
  public gridData: any = [];
  public leftGridData: any = [];
  public rightGridData: any = [];
  next: number = 0;
  public loading: boolean = false;
  listDataview: any[] = [];
  public totalDataCount: number;
  public IsEnabled: any;
  public groupId = '';
  public buttonArrayList: any = [2, 4];
  public isButtonActive: boolean = false;
  changeText: boolean;

  public chartOptions1: Partial<ChartOptions>;
  public cOptions1: Partial<ChartOptions>;

  public dasboardMapData: any;
  public dasboardMapPopUpData: any;
  public filterConfig: any;
  public maploading: boolean = false;
  TotalNoOfClient: number;
  TotalRecord: number;
  public loadingSearch: boolean;
  // google maps zoom level
  zoom: number = 8;
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;
  infoWindowOpened = null
  previous_info_window = null
  markers: marker[] = [];
  clientcountSub: any;
  public dasboardMapAllData: any;
  StateclientGridSub: any;
  public GridId: any = 'Clientdashboard_grid_001';
  public searchValue: string = "";
  public gridListData: any[];
  industryId = '00000000-0000-0000-0000-000000000000';
  countryId = 0;
  parentClinetId = '00000000-0000-0000-0000-000000000000';
  clientRMId = 0;
  public ClientId = '00000000-0000-0000-0000-000000000000';
  public LocationId = '00000000-0000-0000-0000-000000000000';
  public StatusId = '00000000-0000-0000-0000-000000000000';
  public pagesize: any;
  public pageSizeOptions;
  public pagneNo = 1;

  public origin: any;
  public destination: any;
  ShowDummyDashboard: number;

  constructor(public _sidebarService: SidebarService, private fb: FormBuilder, private router: Router, private routes: ActivatedRoute,
    private _profileInfoService: ProfileInfoService, public snackBService: SnackBarService, private commonServiesService: CommonServiesService, private _conmService: CommonserviceService,
    private translateService: TranslateService, private customizingWidgetService: CustomizingWidgetService, private _clientService: ClientService,private _appSetting: AppSettingsService) {
      this.ShowDummyDashboard = this._appSetting.ShowDummyDashboard;
    }

  ngOnInit(): void {
    this.getDirection();
    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    const pageTitle= 'label_dashboard';
    this._conmService.setTitle(pageTitle);
    let queryParams = this.routes.snapshot.params.id;
    this.groupId = decodeURIComponent(queryParams);
    if (this.groupId == 'undefined') {
      this.groupId = "";
    } else {
      this.groupId = decodeURIComponent(queryParams);
    }
  /*--@When:16-05-2023 @who:Nitin Bhati,@why:EWM-12445,@what:For redirect to dashboard demo page--*/
  //  if(this.ShowDummyDashboard==0){
  //   this.loading = false;
  //   this.router.navigate(['./client/core/home/dashboardv1']);
  //   }
    this.getWidgetList(this.pageSize, this.pageNo)
    this.drawBarChat();
    this.drawPieChart();
    this.dashboardStateClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.getClientCount(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
  }
  getDirection() {
    this.origin = { lat: 24.799448, lng: 120.979021 };
    this.destination = { lat: 24.799524, lng: 120.975017 };
  }
  getWidgetList(pagesize, pagneNo) {
    this.loading = true;
    this.customizingWidgetService.getdashboardWidgetList(pagneNo, pagesize).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.gridData = repsonsedata.Data;
          this.leftGridData = this.gridData?.filter(x => x['WidgetLocation'] === 'L');
          this.rightGridData = this.gridData?.filter(x => x['WidgetLocation'] === 'R');

          this.gridData = repsonsedata.Data;

          let lData = this.gridData?.filter(x => x['WidgetLocation'] === 'L' && x['IsEnabled'] == 1);
          this.leftGridData = lData?.sort(function (a, b) {
            return a.WidgetSequence - b.WidgetSequence;
          });
          let rData = this.gridData?.filter(x => x['WidgetLocation'] === 'R' && x['IsEnabled'] == 1);
          this.rightGridData = rData?.sort(function (a, b) {
            return a.WidgetSequence - b.WidgetSequence;
          });
          if (this.leftGridData?.length > 0 || this.rightGridData?.length > 0) {
            this.isButtonActive = false;
          } else {
            this.isButtonActive = true;
          }

          this.totalDataCount = repsonsedata.TotalRecord;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }


  customizeDashboard() {
    this.router.navigate(['./client/core/profile/customizing-widgets']);
    this._sidebarService.topMenuAciveObs.next('profile');
  }



  drawBarChat() {

    this.chartOptions1 = {
      series1: [
        {
          name: "",
          data: [22, 23, 24, 20, 15, 10]
        }
      ],
      chart: {
        type: "bar",
        width: "100%",
        height: 290,
        toolbar: { show: false },
        zoom: {
          enabled: true
        },
        events: {
          /* dataPointSelection: (event, chartContext, config) => {
             let bdata = this.dasboardBarChartData[config.dataPointIndex];
             this.parentClinetId = bdata.ParentClientId;
             this.reload();
           }*/
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Closed', 'Offered', 'Screened', 'Shortlisted', 'Expired', 'Opened']
      }
    };
  }


  drawPieChart() {
    this.cOptions1 = {
      series: [19, 11, 11, 12, 22, 18, 29],
      chart: {
        events: {
          dataPointSelection: (event, chartContext, config) => {
            // let bdata = this.dasboardBarChartData[config.dataPointIndex];
            // this.parentClinetId = bdata.ParentClientId;

          },

        },
        height: 260,
        type: 'pie',
      },
      labels: ["Application", "Form", "Seek", "Email", "LinkedIn", "Career Page"],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
            zoom: {
              enabled: true
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

  }


  /**********************map********************** */

  clickedMarker(ClientId: string, infoWindow, index: number, type: any, LocationId: string) {

    if (this.previous_info_window == null) {
      this.previous_info_window = infoWindow;
    }
    else {
      this.infoWindowOpened = infoWindow
      this.previous_info_window.close()
    }
    this.previous_info_window = infoWindow;
    this.dasboardMapPopUpData = this.dasboardMapAllData?.filter(x => {
      return (x.ClientId == ClientId) && (x.LocationId == LocationId)
    });

    if (this.dasboardMapPopUpData[0]?.CountryId != undefined && this.dasboardMapPopUpData[0]?.CountryId != null) {
      this.countryId = this.dasboardMapPopUpData[0].CountryId;
    }
    if (type == 'onload') {
      this.ClientId = ClientId;
      this.LocationId = LocationId;
      this.dashboardStateClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    }

    // this.dasboardMapData =  this.dasboardMapPopUpData;
    //console.log(`clicked the marker: ${CountryId || index}`)
  }

  mapReady(map) {
    map.setOptions({
      // zoom: 1,
      // minZoom: 1,
      zoomControl: "true",
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      fullscreenControl: false,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
    });
    //this.loader = true;
    map.addListener("dragend", () => {
      //this.loader = false;
      // do something with centerLatitude/centerLongitude
    });
  }

  mapClicked($event: any) {
    if (this.previous_info_window != null) {
      this.previous_info_window.close()
    }
    // console.log("$event.coords.la ",$event.coords.lat);
    /*this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      ClientId: $event.coords.ClientId,
      ClientName: $event.coords.ClientName,
      CountryCode: $event.coords.CountryCode,
      CountryId: $event.coords.CountryId,
      CountryName: $event.coords.CountryName,
      draggable: true
    });*/
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
  }

  /* this.markers = [
     {
       lat: 26.8309535,
       lng: 80.9244566,
       label: 'IN',
       draggable: true
     },
     {
       lat: -6.3627084,
       lng: 106.8430437,
       label: 'ID',
       draggable: false
     },
     {
       lat: 33.8688197,
       lng: 151.2092955,
       label: 'AU',
       draggable: true
     }
   ]*/
  /***************************8end********************** */
  /*
  @Type: File, <ts>
  @Name: dashboardStateClientDetails function
 @Who:  Suika
  @When: 29-Oct-2021
  @Why: EWM-3279/33516
  @What: For getting the client list
   */

  dashboardStateClientDetails(JobFilter, pagneNo, pagesize, sortingValue, searchVal) {
    this.maploading = true;
    let jsonObj = {};
    this.markers = [];
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";

    this.StateclientGridSub = this._clientService.dashboardStateClientDetails(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.dasboardMapAllData = repsonsedata.Data;
          // this.dasboardMapData  = [...new Map(repsonsedata.Data.map(item =>[item['ISOCode1'], item])).values()];
          this.dasboardMapData = repsonsedata.Data;
          let latsum = 0;
          let longsum = 0;
          let count = 1;

          this.dasboardMapData?.forEach(res => {
            this.markers.push({
              lat: Number(res.Latitude),
              lng: Number(res.Longitude),
              label: res.ISOCode1,
              ClientId: res.ClientId,
              ClientName: res.ClientName,
              CountryCode: res.CountryCode,
              CountryId: res.CountryId,
              CountryName: res.CountryName,
              Address: res.Address,
              draggable: false,
              icon: '/assets/icons/marker.png',
              LocationId: res.LocationId
            });

          });

          // this.lat = (latsum)/count ;
          //this.lng = (longsum)/ count;
          this.TotalRecord = repsonsedata.TotalRecord;
          this.maploading = false;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dasboardMapData = [];
          this.TotalRecord = repsonsedata.TotalRecord;
          this.maploading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.maploading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.maploading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
 @Type: File, <ts>
 @Name: getClientCount function
 @Who: Suika
 @When: 27-Oct-2021
 @Why: EWM-3279/33516
 @What: For getting the client list
 */

  getClientCount(JobFilter, pagesize, pagneNo, sortingValue, searchValue) {
    this.loading = true;
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    this.clientcountSub = this._clientService.dashboardClientCount(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.TotalNoOfClient = repsonsedata.Data.Count;
          this.loading = false;
          // this.kendoLoading = false;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.TotalNoOfClient = 0;
          this.loading = false;
          // this.kendoLoading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }



}



function ritate720Animation(): any {
  throw new Error('Function not implemented.');

}
