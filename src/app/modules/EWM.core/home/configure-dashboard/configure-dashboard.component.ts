/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Anup Singh
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
 @What: quick job Section
 */

 import { Component, ElementRef, Input, OnInit } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
 import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
 import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
 import { TranslateService } from '@ngx-translate/core';
 import { CustomizingWidgetService } from 'src/app/shared/services/dashboard-widget/customizing-widget/customizing-widget.service';
 import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
 import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
 import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
 import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subscription } from 'rxjs';
import { ResponceData } from '@app/shared/models';

@Component({
  selector: 'app-configure-dashboard',
  templateUrl: './configure-dashboard.component.html',
  styleUrls: ['./configure-dashboard.component.scss']
})
export class configureDashboardComponent implements OnInit {

  loading: boolean;
  public companyId: string="";
  dashboard:string;
   token:string;
   public userEmail: string="";
   SessionId='';
   dashboardsetttingStatus:boolean=false; 
  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Anup Singh
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
 @What: constructor for injecting services and formbuilder and other dependency injections
 */
 getDasboardAll: Subscription;
 dasboardurl:string =''
 constructor(public _sidebarService: SidebarService, private router: Router,
  public snackBService: SnackBarService, private commonServiesService: CommonServiesService,private translateService: TranslateService, private customizingWidgetService: CustomizingWidgetService,
  private _appSetting: AppSettingsService,public _userpreferencesService: UserpreferencesService,
  
  private _commonserviceService: CommonserviceService) {
    this.companyId = localStorage.getItem('tenantDomain');
    let Token = localStorage.getItem('Token');
    this.companyId= localStorage.getItem('tenantDomain')
    this.token=Token;
    const storedUserInfo = localStorage.getItem('currentUser'); 
    let userInfo = JSON.parse(storedUserInfo);
    this.SessionId=userInfo?.SessionId;
    this.dasboardurl =this._appSetting.dashboardurl;
    
 }
  ngOnInit(): void {
    
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
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.userEmail=tenantData.EmailId;
    //this.inlazationPage()
    
     this.dashboard = this.dasboardurl+"/authcheck?source=xr&email="+this.userEmail+"&companyId="+this.companyId+"&orignUrl="+window.location.origin+"&SessionId="+this.SessionId;
    this.commonServiesService.searchEnableCheck(1);
  }
  openDashboard(url:any, page?:string){ //by maneesh redirect dashboard
    let urltemp= url+"&token="+localStorage.getItem('Token');
    if (page==='setting'){
      let finalUrl=urltemp+'&redirect=setting'
      window.open(finalUrl, '_blank');
    }
    else{
      window.open(urltemp, '_blank');
    }
  } 

  inlazationPage(){
  
    this.getDasboardAll= this.customizingWidgetService.getDasboardAll().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          if(repsonsedata.Data?.length === 0){
            this.dashboardsetttingStatus=true;
          }
         
           } else if(repsonsedata.HttpStatusCode == '204'){
            this.dashboardsetttingStatus=false;
            } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.dashboardsetttingStatus=false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
}
