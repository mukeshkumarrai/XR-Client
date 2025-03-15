import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from './slidemenu-animation';
import { AppSettingsService } from '@app/shared/services/app-settings.service';

@Component({
  selector: 'app-outer-header-new',
  templateUrl: './outer-header-new.component.html',
  styleUrls: ['./outer-header-new.component.scss'],
  animations: [SlideInOutAnimation]
})
export class OuterHeaderNewComponent implements OnInit {
  animationState = 'out';
  public anouncmenturlOne:string;
 public loginHeaderKnowledgeBase:string;
 public loginHeaderResources:string;
 public loginHeaderSignUpCreateAccount:string;
 public loginHeaderHelpCenter:string;
 public loginFooterSecurityNoticeboard:string;
 public loginFooterTermsOfUse:string;
 public loginFooterPrivacyPolicy:string;

  constructor(private _appSetting: AppSettingsService,) {
  this.anouncmenturlOne = this._appSetting?.anouncmenturlOne;    
  this.loginHeaderKnowledgeBase = this._appSetting?.loginHeaderKnowledgeBase;
  this.loginHeaderResources = this._appSetting?.loginHeaderResources;
  this.loginHeaderSignUpCreateAccount = this._appSetting?.loginHeaderSignUpCreateAccount;
  this.loginHeaderHelpCenter = this._appSetting?.loginHeaderHelpCenter;
  this.loginFooterSecurityNoticeboard = this._appSetting?.loginFooterSecurityNoticeboard;
  this.loginFooterTermsOfUse = this._appSetting?.loginFooterTermsOfUse;
  this.loginFooterPrivacyPolicy = this._appSetting?.loginFooterPrivacyPolicy;

  }
  ngOnInit(): void {
  }

  toggleShowDiv(divName: string) {
    if (divName === 'mobile-menu-links') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }

}
