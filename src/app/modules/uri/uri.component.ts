import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { LoginResponce, ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-uri',
  templateUrl: './uri.component.html',
  styleUrls: ['./uri.component.scss'],
  providers: [DummyService]
})
export class UriComponent implements OnInit {
  public shortUrl:string;
  loading: boolean;
  userDefoultLang: string;
  langflag: string;
  public showResetMes : boolean = false;
  public uriCoderArray={};
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;


  constructor(private http: HttpClient,public router: Router,private route: ActivatedRoute,private _serviceListClass:ServiceListClass,
    private authenticationService: LoginService,private _appSetting: AppSettingsService,
    private translateService: TranslateService,
    public dummyService: DummyService,
    public dialog: MatDialog,
    private commonserviceService: CommonserviceService,
    private _snackBarService: SnackBarService, private deviceService: DeviceDetectorService, 
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
    let URL = this.router.url;
    let URL_AS_LIST = URL.split('?');
    let URL_PARAM_AS_LIST = URL_AS_LIST[1].split('=');
    this.shortUrl = URL_PARAM_AS_LIST[1];

    this.redirectToMainURL(this.shortUrl);
    this.document.body.classList.add('login-screen-body');
  }

  redirectToMainURL(sURL: string)
  {
    this.uriCoderArray['ShortUrl'] = sURL;
    this.uriCoderArray['MachineOS'] = this.deviceService.os + " | " + this.deviceService.os_version;
    this.uriCoderArray['ClientBrowser'] = this.deviceService.browser + " | " + this.deviceService.browser_version;
    this.uriCoderArray['IpAddress'] = ''; //this.authenticationService.getMachineIP();

    this.authenticationService.decodeUri(this.uriCoderArray).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode == 200) {
        this.showResetMes = false;
        window.location.href = data.Data;
        
      } else {
        this.loading = false;
        this.showResetMes = true;
        // commented by Adarsh singh on 16-08-22- by Mukesh sir EWM-6964
        // setTimeout(function(){
        //   window.location.href = '/';
        // }, 5000);
      }

    },
    error => {
      this.showResetMes = true;
      this.loading = false;
      // setTimeout(function(){
      //   window.location.href = '/';
      // }, 5000);
    });
  }

  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
    this.langflag = lang;
  }

  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Open modal window
  // @What: this function used for open policy and terem modal window.
  // @Return: None
  // @Params :
  // 1. lang - language code.

  openDialog(param): void {
    if (param === 'privacy') {
      this.modaldata = this.dummyService.getPolicy();
    }
    if (param === 'term') {
      this.modaldata = this.dummyService.getTerm();
    }
    const dialogRef = this.dialog.open(FooterDialogComponent, {
      maxWidth:"750px",
      width: '90%',
      disableClose: true,
      data: this.modaldata,
      panelClass: ['footerPopUp', 'animate__slow', 'animate__animated', 'animate__fadeInUpBig']
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
