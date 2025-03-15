/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Nitin Bhati
    @When: 01-Dec-2021
    @Why: EWM-3946
    @What:  This page is creted for Daxtra Integration UI Component
*/
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ButtonTypes } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-daxtra-integration',
  templateUrl: './daxtra-integration.component.html',
  styleUrls: ['./daxtra-integration.component.scss']
})
export class DaxtraIntegrationComponent implements OnInit {

  public showTabData: boolean = true;
  public showSeekFormData: boolean = false;
  seekIntegrationForm: FormGroup;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public totalStages: number;
  public screenPreviewClass: string="";
  public currentMenuWidth: number;
  public screnSizePerStage:number;
  public submitted = false;
  public loading: boolean = false;
  public activestatus: string;
  RegistrationCode;
  IntegratorName;
  public oldPatchValues: any;
  visibilityStatus:boolean;
  gridViewList: any;
  LogoUrl: any;
  Description: any;
  IntegrationImages: any;
  VideoUrl: any;
  IntegrationLocations: any;
  LocationName: any;
  LocationType: any;
  Country: any;
  AddressLine1: any;
  District: any;
  TownCity: any;
  State: any;
  AddressLine2: any;
  TagCode: any;
  PostalCode: any;
  animationVar: any;
  positionMatTab: any;

  constructor(public dialog: MatDialog,private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,private route: Router,
    private snackBService: SnackBarService,
    private translateService: TranslateService,private _systemSettingService:SystemSettingService,private router: ActivatedRoute,
    private commonserviceService: CommonserviceService) {
  }

  ngOnInit(): void {
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth,'onload');
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.RegistrationCode = params['code'];
          this.IntegratorName = params['name'];
        }
      });
      this.getIntegrationCheckstatus();
      this.getIntegrationRegistrationByCode();
      this.animationVar = ButtonTypes;
      

      this.commonserviceService.onUserLanguageDirections.subscribe(res => {
        this.positionMatTab=res;
      });
  }
/*
 @Type: File, <ts>
 @Name: getIntegrationRegistrationByCode function
 @Who: Nitin Bhati
 @When: 01-Dec-2021
 @Why: EWM-3946
 @What: For showing Integration Registration Code
*/
getIntegrationRegistrationByCode() {
  this.loading = true;
  this._systemSettingService.getIntegrationRegistrationByCode(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.gridViewList = repsonsedata.Data;
           this.LogoUrl = this.gridViewList.LogoUrl;
            this.Description = this.gridViewList.Description;
           this.IntegrationImages = this.gridViewList.IntegrationImages;
           this.VideoUrl = this.gridViewList.VideoUrl;
           this.TagCode = this.gridViewList.TagCode;
           this.LocationName = this.gridViewList.IntegrationLocations.LocationName;
           this.LocationType = this.gridViewList.IntegrationLocations.LocationType;
           this.Country = this.gridViewList.IntegrationLocations.LocationCountryName;
           this.AddressLine1 = this.gridViewList.IntegrationLocations.AddressLine1;
           this.AddressLine2 = this.gridViewList.IntegrationLocations.AddressLine2;
           this.District = this.gridViewList.IntegrationLocations.District;
           this.TownCity = this.gridViewList.IntegrationLocations.TownCity;
           this.State = this.gridViewList.IntegrationLocations.StateId;
           this.PostalCode = this.gridViewList.IntegrationLocations.PostalCode;            
           }
       } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
  onCancel(){
    this.showSeekFormData = false;
    this.showTabData = true;
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

  @HostListener("window:resize", ['$event'])
    private onResize(event,loadingType) {
      if(loadingType=='onload')
      {
        this.currentMenuWidth = event;
      }else{
        this.currentMenuWidth = event.target.innerWidth;
      }
    
      if (this.currentMenuWidth > 240 && this.currentMenuWidth < 3000) {
        this.screnSizePerStage = 1;
        this.maxNumberClass(this.screnSizePerStage);
      }     
    }

  /* 
   @Type: File, <ts>
   @Name: subscribeSave function
   @Who: Nitin Bhati
   @When: 01-Dec-2021
   @Why: EWM-3946
   @What: For saving daxtra subscribe data
  */
   subscribeSave() {
    this.loading = true;
    let AddObj={};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    this._systemSettingService.subscribeDaxtraIntegration(AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.showSeekFormData = false;
        this.showTabData = true;
         this.getIntegrationCheckstatus();   
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       } else if (repsonsedata.HttpStatusCode === 400) {
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
      @Name: disconnectPopUp function
      @Who: Nitin Bhati
      @When: 01-Dec-2021
      @Why: EWM-3946
      @What: FOR DIALOG BOX confirmation
    */
      disconnectPopUp(): void {
        let DisconnectObj={};
        //DisconnectObj = this.oldPatchValues;
        DisconnectObj['RegistrationCode'] = this.RegistrationCode;
        const message = ``;
        const title = '';
        const subTitle = 'marketplace_daxtra';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
            this._systemSettingService.unsubscribeDaxtraIntegration(DisconnectObj).subscribe(
              (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {
                  this.getIntegrationCheckstatus();
                  this.showSeekFormData = false;
                  this.showTabData = true;
                 
                    } else {
                  this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                } 
              }, err => {
                if (err.StatusCode == undefined) {
                  this.loading = false;
                }
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
              })
          }
        });
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

      /*
 @Type: File, <ts>
 @Name: getIntegrationCheckstatus function
 @Who: Nitin Bhati
 @When: 01-Dec-2021
 @Why: EWM-3946
 @What: For showing check status 
*/
getIntegrationCheckstatus() {
  this.loading = true;
  this._systemSettingService.getIntegrationCheckstatus(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.visibilityStatus = repsonsedata.Data?.Connected;
             // @suika @EWM-13681 Whn 03-08-2023
           let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
           let objIndex = otherIntegrations?.findIndex((obj => obj?.RegistrationCode == this.RegistrationCode));
           otherIntegrations[objIndex].Connected = this.visibilityStatus;
           localStorage.setItem('otherIntegrations',JSON.stringify(otherIntegrations));
          }
      } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

/*
     @Type: File, <ts>
     @Name: backToJob
     @Who: Nitin Bhati
     @When: 17-Dec-2021
     @Why: EWM-4169
     @What: For back to Integration page
   */
     backToJob() {
      this.route.navigate(['/client/core/administrators/integration-interface-board']);
    }

}
