/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Naresh Singh
    @When: 
    @Modified: Oct 25 2021
    @Why: EWM-3040 EWM-3453
    @What:  This page is creted for Integration interface board UI Component TS
*/
import { Component, HostListener, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { IntegrationsBoardService } from './../../../shared/services/profile-info/integrations-board.service';

@Component({
  selector: 'app-integration-interface-board',
  templateUrl: './integration-interface-board.component.html',
  styleUrls: ['./integration-interface-board.component.scss']
})
export class IntegrationInterfaceBoardComponent implements OnInit {
  loading: boolean = false;
  activeType: string;
  selectedTag = null;
  selectedCategory = null;
  selectedAvaible = null;
  selectedStatus = null;
  statusList: any[] = [];
  categoryList: any[] = [];
  availbleList: any[] = [];
  tagList: any[] = [];
  dataList: any[] = [];
  public totalStages: number;
  public screenPreviewClass: string = "";
  public currentMenuWidth: number;
  public screnSizePerStage: number;
  integrationList: any[] = [];
  filteredDataList: any[];
  typeList: any;
  seekRegistrationCode: any;
  daxtraRegistrationCode: any;
  directionValue: string;
  xeopleSMSRegistrationCode: any;
  xeopleCallRegistrationCode: any;
  zoomMeetingInviteRegistrationCode: any;
  zoomPhoneCallRegistrationCode: any;
  mSTeamMeetingInviteRegistrationCode:any;
  googleMeetMeetingInviteRegistrationCode: any;
  Broadbeanregistrationcode: any;
  burstSMSRegistrationCode: any;
  loader:boolean = false;
  redirectActiveTab:any;
  selectedTabIndex :number;
  eohRegistrationCode: string;
  public indeedRagistrationCode:string;
  public  visibilityStatusForInneedInvite: boolean=true;
  visibilityStatusForEohInvite: boolean=false;
  public vxtRagistrationCode:string;
  public  visibilityStatusForVxtInvite: boolean=true;
  constructor(public _integrationsBoardService: IntegrationsBoardService, private route: Router,
    private _systemSettingService: SystemSettingService,
    public activateroute: ActivatedRoute, public _sidebarService: SidebarService, private snackBService: SnackBarService, private translateService: TranslateService, private _appSetting: AppSettingsService, private commonServiesService: CommonServiesService) {
    this.seekRegistrationCode = this._appSetting.seekRegistrationCode;
    this.daxtraRegistrationCode = this._appSetting.daxtraRegistrationCode;
    this.xeopleSMSRegistrationCode = this._appSetting.xeopleSMSRegistrationCode;
    this.xeopleCallRegistrationCode = this._appSetting.xeopleCallRegistrationCode;
    this.zoomMeetingInviteRegistrationCode = this._appSetting.zoomMeetingInviteRegistrationCode;
    this.zoomPhoneCallRegistrationCode = this._appSetting.zoomPhoneCallRegistrationCode;
    this.mSTeamMeetingInviteRegistrationCode = this._appSetting.mSTeamMeetingInviteRegistrationCode;
    this.googleMeetMeetingInviteRegistrationCode = this._appSetting.googleMeetMeetingInviteRegistrationCode;
    this.Broadbeanregistrationcode = this._appSetting.Broadbeanregistrationcode;  
    this.burstSMSRegistrationCode = this._appSetting.burstSMSRegistrationCode;      
    this.eohRegistrationCode=this._appSetting.eohRegistrationCode;
    this.indeedRagistrationCode = this._appSetting.indeedRagistrationCode;
    this.vxtRagistrationCode = this._appSetting?.vxtRagistrationCode;

  }

  ngOnInit(): void {
    this.commonServiesService.event.subscribe(res => {
      this.directionValue = res;
    })


     // @suika @EWM-13291 @EWM-13572 redirect url from manage job posting
    this.activateroute.queryParams.subscribe((params) => {
      if(params['type']!=undefined){
      this.redirectActiveTab =  params['type'];
      }          
    })
    this.getIntegrationAll();
    this.getIntegrationBoardData();
   
    this.gettagList();
    this.getCategoryList();
    this.getStatusList();
    this.getbillingTypeList();

    this.getIntegrationCheckstatusForZoomPhon();
    this.getIntegrationCheckstatusForZoomInvite();

    this.getIntegrationCheckstatusForMSTeamInvite();
    this.getIntegrationCheckstatusForGoogleMeetInvite();
    this.getIntegrationCheckstatusForSMSInvite();
    this.getIntegrationCheckstatusForEohInvite();
    this.getIntegrationInDeed();
    this.getIntegrationVxt();
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //this._sidebarService.activesubMenuObs.next('masterdata');
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth, 'onload');

   
 
  }


  /*
     @Type: File, <ts>
     @Name: ngAfterViewInit
     @Who: Suika
     @When: 26-July-2023
     @Why: EWM-13179 EWM-13226
     @What: to open virsion dialog when version is not updated
   */
  ngAfterViewInit() { 
    this.getTypeList();
    }



 // @suika @EWM-13291 @EWM-13572 redirect url from manage job posting
  getDataByType(type) {
    // --------@When: 18-05-2023 @who:Adarsh singh @why: EWM-12560 --------
    this.activeType = type.tab ? type.tab.textLabel : this.activeType;
   setTimeout(() => {
    this.filteredDataList = this.dataList?.filter((dl: any) => dl.TypeName == this.activeType);    
    if (this.integrationList.length === 0) {
      this.filteredDataList = this.dataList?.filter((dl: any) => dl.TypeName == this.activeType);
    } else {
      let res = this.filteredDataList.filter(val =>
        this.integrationList.some(({ RegistrationCode }) => (val.RegistrationCode as any) === (RegistrationCode as any))
      );
      res.forEach(element => {
        element['IsSelected'] = 1;
      });
    }
    this.selectedTag = null;
    this.selectedCategory = null;
    this.selectedAvaible = null;
    this.selectedStatus = null;
   }, 500);
  }

  getIntegrationBoardData() {
    this.loading = true;
    this.loader = true;
    this._integrationsBoardService.getIntegrationBoard().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.loader = false;
          this.dataList = repsonsedata.Data;
          this.filteredDataList = this.dataList.filter((dl: any) => dl.TypeName == this.activeType);          
        } else {
          this.dataList = null;
          this.loading = false;
          this.loader = false;
        }
      }, err => {
        this.loading = false;
        this.loader = false;
      });
  }
  getSearchedData(field: string, value: string) {
    switch (field) {
      case 'Tag':
        this.selectedTag = value;
        break;
      case 'Category':
        this.selectedCategory = value;
        break;
      case 'Available':
        this.selectedAvaible = value;
        break;
      case 'Status':
        this.selectedStatus = value;
        // this.snackBService.showErrorSnackBar(this.translateService.instant('label_undermaintenance'),'200');
        break;
      default:
        break;
    }
    this.filteredDataList = this.dataList.filter((dl: any) => dl.TypeName == this.activeType
      && (this.selectedAvaible == null || dl.BillingTypeId == this.selectedAvaible)
      && (this.selectedCategory == null || dl.CategoryId == this.selectedCategory)
      && (this.selectedTag == null || dl.IntegratorTagId == this.selectedTag));
    //&&  (this.selectedStatus==null || dl.Status==this.selectedStatus));
  }
  // setDdlData()
  // {
  //   this.tagList= this.dataList.filter((dl:any)=>dl.Type==this.activeType).map(item => item.Tag)
  //     .filter((value, index, self) => self.indexOf(value) === index).sort();
  //     this.categoryList= this.dataList.filter((dl:any)=>dl.Type==this.activeType).map(item => item.Category)
  //     .filter((value, index, self) => self.indexOf(value) === index).sort();

  // }

  getTypeList() {
    this.loading = true;
    this._integrationsBoardService.getIntegrationType().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.typeList = repsonsedata.Data;
          let typeListdata: any;
          // @suika @EWM-13291 @EWM-13572 redirect url from manage job posting
          if(this.redirectActiveTab!=undefined){
            typeListdata = this.typeList?.filter(res=>res.TypeName==this.redirectActiveTab);
            this.selectedTabIndex = 1;
            typeListdata['textLabel'] = typeListdata[0].TypeName;
          }else{
            typeListdata = this.typeList;
            this.selectedTabIndex = 0;
            typeListdata['textLabel'] = typeListdata[0].TypeName;
          }       
          this.activeType = typeListdata[0] ? typeListdata[0].TypeName : '';
          this.getDataByType(typeListdata[0]);
          } else {
          this.typeList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      });
  }
  gettagList() {
    this.loading = true;
    this._integrationsBoardService.getIntegrationTag().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.tagList = repsonsedata.Data;
        } else {
          this.tagList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  getbillingTypeList() {
    this.loading = true;
    this._integrationsBoardService.fetchIntegrationBilingType().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.availbleList = repsonsedata.Data;
          this.activeType = this.typeList ? this.typeList[0].TypeName : '';
        } else {
          this.availbleList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  getCategoryList() {
    this.loading = true;
    this._integrationsBoardService.getIntegrationCategory().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.categoryList = repsonsedata.Data;
        } else {
          this.categoryList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  getStatusList() {
    this.loading = true;
    this._integrationsBoardService.getIntegrationStatus().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.statusList = repsonsedata.Data;
        } else {
          this.statusList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  changeStatus() {

    this.snackBService.showErrorSnackBar(this.translateService.instant('label_undermaintenance'), '200');

  }

  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    //  console.log('slide change');
  }

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
    if (this.currentMenuWidth > 1900 && this.currentMenuWidth < 2501) {
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    }
    if (this.currentMenuWidth > 1600 && this.currentMenuWidth < 1901) {
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    }
    if (this.currentMenuWidth > 1200 && this.currentMenuWidth < 1601) {
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    }
    if (this.currentMenuWidth > 960 && this.currentMenuWidth < 1201) {
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    }
    else if (this.currentMenuWidth > 700 && this.currentMenuWidth < 961) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    }
    else if (this.currentMenuWidth > 540 && this.currentMenuWidth < 701) {
      this.screnSizePerStage = 1;
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
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }
  /*
   @Type: File, <ts>
   @Name: getIntegrationAll function
   @Who: Nitin Bhati
   @When: 03-Nov-2021
   @Why: EWM-3450
   @What: For getting registration code data 
  */
  getIntegrationAll() {
    this.loading = true;
    this._integrationsBoardService.getIntegrationAll().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.integrationList = repsonsedata.Data;
          //this.getIntegrationBoardData();
        } else {
          this.integrationList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }




  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatus function
   @Who: Anup Singh
   @When: 11-Feb-2021
   @Why: EWM-3275 EWM-4199
   @What: For showing check status 
  */
  visibilityStatusForZoomCall: boolean
  getIntegrationCheckstatusForZoomPhon() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatus(this.zoomPhoneCallRegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatusForZoomCall = repsonsedata.Data.Connected;
          }
        } else {
          this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatusForZoomInvite function
   @Who: Anup Singh
   @When: 11-Feb-2021
   @Why: EWM-3275 EWM-4199
   @What: For showing check status 
  */
  visibilityStatusForZoomInvite: boolean
  getIntegrationCheckstatusForZoomInvite() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatus(this.zoomMeetingInviteRegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatusForZoomInvite = repsonsedata.Data.Connected;
          }
        } else {
          this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatusForMSTeamInvite function
   @Who: Nitin Bhati
   @When: 13-April-2022
   @Why: EWM-6189
   @What: For showing check status 
  */
   visibilityStatusForMSTeamInvite: boolean
   getIntegrationCheckstatusForMSTeamInvite() {
     this.loading = true;
     this._systemSettingService.getIntegrationCheckstatus(this.mSTeamMeetingInviteRegistrationCode).subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           if (repsonsedata.Data) {
             this.visibilityStatusForMSTeamInvite = repsonsedata.Data.Connected;
           }
         } else {
           this.loading = false;
           // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
       }, err => {
         this.loading = false;
         //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }
 

    /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatusForGoogleMeetInvite function
   @Who: Nitin Bhati
   @When: 13-April-2022
   @Why: EWM-6189
   @What: For showing check status 
  */
   visibilityStatusForGoogleMeetInvite: boolean
   getIntegrationCheckstatusForGoogleMeetInvite() {
     this.loading = true;
     this._systemSettingService.getIntegrationCheckstatus(this.googleMeetMeetingInviteRegistrationCode).subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           if (repsonsedata.Data) {
             this.visibilityStatusForGoogleMeetInvite = repsonsedata.Data.Connected;
           }
         } else {
           this.loading = false;
           // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
       }, err => {
         this.loading = false;
         //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }

    /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatusForGoogleMeetInvite function
   @Who: Nitin Bhati
   @When: 18-July-2022
   @Why: EWM-7822
   @What: For showing check statusfor SMS
  */
   visibilityStatusForSMSInvite: boolean
   getIntegrationCheckstatusForSMSInvite() {
     this.loading = true;
     this._systemSettingService.getIntegrationCheckstatus(this.xeopleSMSRegistrationCode).subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           if (repsonsedata.Data) {
             this.visibilityStatusForSMSInvite = repsonsedata.Data.Connected;
           }
         } else {
           this.loading = false;
           // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
       }, err => {
         this.loading = false;
         //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }
 


   getIntegrationCheckstatusForEohInvite() {
     this.loading = true;
     this._systemSettingService.getIntegrationCheckstatus(this.eohRegistrationCode).subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           if (repsonsedata.Data) {
             this.visibilityStatusForEohInvite = repsonsedata.Data.Connected;
           }
         } else {
           this.loading = false;
           // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
       }, err => {
         this.loading = false;
         //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }
   /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatusForGoogleMeetInvite function
   @Who: maneesh
   @When: 08-11-2023
   @Why: EWM-14477
   @What: For showing check statusfor indeed
  */
   getIntegrationInDeed() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatus(this.indeedRagistrationCode).subscribe(
      (repsonsedata: ResponceData) => {        
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatusForInneedInvite = repsonsedata.Data.Connected;
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  // <!-- by maneesh  ewm-17967 fixed vxt integration when:29/08/2024 -->
   getIntegrationVxt() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatusVxt(this.vxtRagistrationCode).subscribe(
      (repsonsedata: ResponceData) => {        
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatusForVxtInvite = repsonsedata.Data?.IsConnected;            
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
}
