import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss']
})
export class AuthenticatorComponent implements OnInit {
  public code: any;
  public msg: string;
  public state: any;

  public emailConnection: boolean = false;
  constructor(public _appSetting: AppSettingsService, private router: ActivatedRoute, public route: Router,
    private cookieService: CookieService, @Inject(DOCUMENT) private document: Document, private commonserviceService: CommonserviceService) { }

  ngOnInit(): void {
    this.document.body.classList.add('login-screen-body');
 }

  public ngAfterViewInit(): void {
    this.router.queryParams.subscribe(
      params => {
        if (params['code'] != undefined) {
          this.code = params['code'];
          this.emailConnection = true;
          this.state = params['state'];
          let timer = setInterval(() => {
            window.location.href = this.state + '?code=' + this.code;
          }, 3000);
          // this.route.navigate([this.state]);
          // this.officeConfigure(this.code);
          // this.test(this.code);
          // window.close();
        }else{
          this.route.navigate(['/login']);
        }
      });

  }

  // microsoftIntegration() {

  //   let responseType = this._appSetting.getResponseType365();
  //   let state = this._appSetting.getState365();
  //   let scope = this._appSetting.getScope365();
  //   let clientId = this._appSetting.getClientIdOffice365();
  //   let redirectUri = this._appSetting.getRedirectUri365();
  //   let responseMode = this._appSetting.getresponseMode365();
  //   window.open('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=' + clientId + '&state=' + state + '&scope=' + scope + '&response_mode=' + responseMode + '&redirect_uri=' + redirectUri + '&response_type=' + responseType + '', "_self");


  // }


}
