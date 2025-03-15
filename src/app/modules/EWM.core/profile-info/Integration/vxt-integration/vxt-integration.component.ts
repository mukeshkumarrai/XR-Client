// <!-- This page is creted for Vxt feature integration Integration UI Component HTML by maneesh ewm-17967 ,when:30-08-2024-->

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
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-vxt-integration',
  templateUrl: './vxt-integration.component.html',
  styleUrls: ['./vxt-integration.component.scss']
})
export class VxtIntegrationComponent implements OnInit {

  public showTabData: boolean = true;
  public totalStages: number;
  public screenPreviewClass: string="";
  public currentMenuWidth: number;
  public screnSizePerStage:number;
  public loading: boolean = false;
  public activestatus: string;
  public RegistrationCode:string;
  public IntegratorName:string;
  visibilityStatus:boolean;
  gridViewList: any;
  LogoUrl: string;
  Description: string;
  IntegrationImages: string;
  VideoUrl: string;
  IntegrationLocations: string;
  LocationName: string;
  LocationType: string;
  Country: string;
  AddressLine1: string;
  District: string;
  TownCity: string;
  State: string;
  AddressLine2: string;
  TagCode: any;
  PostalCode: any;
  IsUser:number;
  animationVar: any;
  TypeName: string;
  googleMeetMeetingInviteRegistrationCode: any;
  dirctionalLang;

  constructor(public dialog: MatDialog,private fb: FormBuilder, public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,private route: Router,
    private snackBService: SnackBarService,
    private translateService: TranslateService,private _systemSettingService:SystemSettingService,private router: ActivatedRoute,private _appSetting: AppSettingsService) {
      this.googleMeetMeetingInviteRegistrationCode = this._appSetting.googleMeetMeetingInviteRegistrationCode;
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
      this.getIntegrationVxt();
      this.getIntegrationRegistrationByCode();
      this.animationVar = ButtonTypes;
  }
  // For showing Integration Registration Code
getIntegrationRegistrationByCode() {
  this.loading = true;
  this._systemSettingService.getVxtIntegrationRegistrationByCode(this.RegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if (repsonsedata.Data) {
           this.gridViewList = repsonsedata?.Data;
           this.IsUser = this.gridViewList?.IsUser;
           this.LogoUrl = this.gridViewList?.LogoUrl;
            this.Description = this.gridViewList?.Description;
           this.IntegrationImages = this.gridViewList?.IntegrationImages;
           this.VideoUrl = this.gridViewList?.VideoUrl;
           this.TagCode = this.gridViewList?.TagCode;
           this.LocationName = this.gridViewList?.IntegrationLocations?.LocationName;
           this.LocationType = this.gridViewList?.IntegrationLocations?.LocationType;
           this.Country = this.gridViewList?.IntegrationLocations?.LocationCountryName;
           this.AddressLine1 = this.gridViewList?.IntegrationLocations?.AddressLine1;
           this.AddressLine2 = this.gridViewList?.IntegrationLocations?.AddressLine2;
           this.District = this.gridViewList?.IntegrationLocations?.District;
           this.TownCity = this.gridViewList?.IntegrationLocations?.TownCity;
           this.State = this.gridViewList?.IntegrationLocations?.StateId;
           this.PostalCode = this.gridViewList?.IntegrationLocations?.PostalCode;    
           this.TypeName = this.gridViewList?.TypeName;           
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
    // For saving tenant feature integration  enable and disable data
   EnableSave() {
    this.loading = true;
    let AddObj={};
    AddObj['RegistrationCode'] = this.RegistrationCode;
    AddObj['Enable'] = true;
    AddObj['IsExternalConsumer'] = true;
    AddObj['RedirectURL'] = '';
      this._systemSettingService.getVxtIntegrationStatus(AddObj).subscribe((repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          // this.showSeekFormData = false;
          this.showTabData = true;
           this.getIntegrationVxt();   
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


  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  // FOR DIALOG BOX confirmation
      disconnectPopUp(): void {
        let DisconnectObj={};
        DisconnectObj['RegistrationCode'] = this.RegistrationCode;
        DisconnectObj['Enable'] = false;
        DisconnectObj['IsExternalConsumer'] = true;
        DisconnectObj['RedirectURL'] = '';
        const message = ``;
        const title = '';
        let subTitle = 'label_VXT_disableIntegration';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",       
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult == true) {
              this._systemSettingService.getVxtIntegrationStatus(DisconnectObj).subscribe(
                (data: ResponceData) => {
                  if (data.HttpStatusCode === 200) {
                    this.getIntegrationVxt();
                    this.showTabData = true;
                    this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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

        let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	 

      }

  // <!-- by maneesh  ewm-17967 fixed vxt integration when:29/08/2024 -->
  getIntegrationVxt() {
    this.loading = true;
    this._systemSettingService.getIntegrationCheckstatusVxt(this.RegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {        
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.visibilityStatus = repsonsedata.Data?.IsConnected;            
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  // For back to Integration page
     backToIntegration() {
      this.route.navigate(['/client/core/administrators/integration-interface-board']);
    }

}
