import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './core/app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceListClass } from './shared/services/sevicelist';
import { DatePipe, DecimalPipe } from '@angular/common';
import { environment } from '../environments/environment';
import { ResizableDirective } from './shared/directive/resizable-directive.directive';
import { UsertimetrackService } from './shared/services/usertimetrack.service'
import { UserIdleModule } from 'angular-user-idle';
import { AuthInterceptorsService, ErrorInterceptor } from './shared/helper';
import { GoogleLoginProvider } from 'angularx-social-login';
import { ValidateCode } from './shared/helper/commonserverside'
import { ENVIRONMENTER } from '../environments/environmeter.token';
import { ResizeService } from './shared/services/resize.service';
import { StatePersistingService } from './shared/services/kendogrid/state-persisting.service';
import { SharedModule } from './shared/shared.module';
import { ModulesModule } from './modules/modules.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { AppSettingsService } from './shared/services/app-settings.service';
import { EncryptionDecryptionService } from './shared/services/encryption-decryption.service';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { FileUploaderService } from './shared/services/file-uploader.service';
import { DynamicMenuService } from './shared/services/commonservice/dynamic-menu.service';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { DocumentModule } from './document/document.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { SparklineModule } from '@progress/kendo-angular-charts';
import { OrgchartModule } from '@dabeng/ng-orgchart';
import {
  MsalModule,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration,
} from '@azure/msal-angular';
import { Configuration } from 'msal';
import { ThemingService } from './shared/services/theming.service';
import { AuthGuard } from './shared/guard/auth.guard';
import { RouteByPassGuardService } from './shared/guard/route-by-pass-guard.service';
import { AuthService } from './shared/services/auth.service';
import { BrowserAnim } from './modules/EWM.core/profile-info/account-prefrences/browseranim';
import { ApplicationPreviewModule } from './application-preview/application-preview.module';
import { AssessmentModule } from './assessment-preview/assessment.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ToastrModule, ToastrService } from 'ngx-toastr';


export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];


const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;


function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: environment.MicrosftClientId,
      authority: "https://login.microsoftonline.com/common/",
      validateAuthority: true,
      redirectUri: window.location.href.split('?')[0],
      postLogoutRedirectUri: window.location.href.split('?')[0],
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: !isIE,
    consentScopes: [
      "openid",
      "profile"
    ],
    unprotectedResources: [],
    protectedResourceMap,

    extraQueryParameters: { domain_hint: 'organizations' }
  };
}

export function appInit(appConfigService: AppSettingsService) {
  return () => appConfigService.loadConfig();
}
/*----
  @Type: File, <ts>
  @Name: loadEnvVariable
  @Who: Nitin Bhati
  @When: 1-Dec-2022
  @Why: 
  @What: For load environment file
*/
export function loadEnvVariable(appConfigService: AppSettingsService) {
  return () => appConfigService.loadEnvVariable();
}

export function appOnInit(_serviceListClass: ServiceListClass) {
  return () => _serviceListClass.Url();
}



@NgModule({
  declarations: [
    AppComponent,
    ResizableDirective
  ],

  imports: [
    BrowserModule,
    ChartsModule,
    OrgchartModule,
    SparklineModule,
    AppRoutingModule,
    HttpClientModule,
    HammerModule,
    MatFileUploadModule,
    NgOtpInputModule,
    NgxFileDropModule,
    UserIdleModule.forRoot({ idle: 500, timeout: 6000, ping: 120 }),
    SharedModule,
    MsalModule,
    NgxOrgChartModule,
    DocumentModule,
    ApplicationPreviewModule,
    AutocompleteLibModule,
    AgmCoreModule.forRoot({
      apiKey: environment.AgmApiKey
    }),
    AgmDirectionModule,

    BrowserAnim.checkAnim ? BrowserAnimationsModule : NoopAnimationsModule,
    BrowserAnimationsModule,
    AssessmentModule,
    ScrollViewModule,
    EditorModule,
    ToastrModule.forRoot()
  ],

  providers: [DecimalPipe, UsertimetrackService, ValidateCode, ServiceListClass, DynamicMenuService, AuthService,
    AuthGuard, RouteByPassGuardService,
    {
      provide: APP_INITIALIZER,
      useFactory: appOnInit,
      multi: true,
      deps: [ServiceListClass]
    },
    ResizeService, StatePersistingService, ThemingService,
    ThemingService, EncryptionDecryptionService,
    AppSettingsService,
    //@suika @whn 27-06-2023 @EWM-12865 To set default format of date dd-mm-yyyy
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AppSettingsService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadEnvVariable,
      multi: true,
      deps: [AppSettingsService]
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    MsalService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorsService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ENVIRONMENTER, useValue: environment },
    [DatePipe],
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {

            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GoogleLogin
            ),
          },
        ]
      }
    },
    FileUploaderService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }

