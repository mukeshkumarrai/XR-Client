import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UriComponent } from './modules/uri/uri.component';
import { MaileremailverificationComponent } from './shared/mailer/maileremailverification/maileremailverification.component';
import { MfaComponent } from '../app/modules/EWM.core/mfa/mfa.component';
import { MfaSettingsComponent } from '../app/modules/EWM.core/mfa/mfa-settings/mfa-settings.component'
import { FooterComponent } from './core/layout/footer/footer.component';
import { LandingComponent } from './modules/landing/landing.component';
import { AppInitializationComponent } from './modules/app-initialization/app-initialization.component';
import { LinkExpireComponent } from './modules/errors/link-expire/link-expire.component';
import { AccessDeniedComponent } from './modules/errors/access-denied/access-denied.component';
import { LinkDeniedComponent } from './modules/errors/link-denied/link-denied.component';
import { TenantUserComponent } from './modules/tenant-user/tenant-user.component';
import { EmailTemplatesManageComponent } from './modules/EWM.core/system-settings/email-templates/email-templates-manage/email-templates-manage.component';
import { WelcomeComponent } from './modules/welcome/welcome.component';
import { AuthenticatorComponent } from './modules/authenticator/authenticator.component';
import { RequestGdprContentPageComponent } from './document/request-gdpr-content-page/request-gdpr-content-page.component';
import { CareerPageComponent } from './document/career-page/career-page.component';
import { SeekLinkoutCareerComponent } from './modules/errors/seek-linkout-career/seek-linkout-career.component';
import { SessionExpiredComponent } from './modules/sign-in/session-expired/session-expired.component';
import { SessionExpiredLoginComponent } from './modules/sign-in/session-expired-login/session-expired-login.component';
import { SignInComponent } from './modules/sign-in/sign-in.component';
import { NewForgotPasswordComponent } from './modules/new-forgot-password/new-forgot-password.component';
import { NewForgotEmailComponent } from './modules/new-forgot-email/new-forgot-email.component';

const routes: Routes = [
  { path: 'login', component: SignInComponent },
  // { path: 'sign-in', component: SignInComponent },
  { path: 'uri', component: UriComponent },
  { path: 'appintialization', component: AppInitializationComponent },
  { path: 'landingpage', component: LandingComponent },
  { path: 'session-expired', component: SessionExpiredComponent },
  { path: 'session-expired-login', component: SessionExpiredLoginComponent },
  { path: 'link-expired', component: LinkExpireComponent },
  { path: 'unauthorized-access', component: AccessDeniedComponent },
  { path: 'forgot-email', component: NewForgotEmailComponent },
  { path: 'tenant-user', component: TenantUserComponent },
  { path: 'forgot-password', component: NewForgotPasswordComponent },
  // { path: 'new-forgot-password', component: NewForgotPasswordComponent },
  // { path: 'new-forgot-email', component: NewForgotEmailComponent },
  { path: 'seek-linkout-career', component: SeekLinkoutCareerComponent },
  //{ path: 'component', component: UIComponent, canActivate: [AuthGuard] },
  //{ path: 'commonfunction', component: CommonComponent, canActivate: [AuthGuard, SecureInnerPagesGuard], data: { component: 'commonfunction' } },
  //{ path: 'grid', component: GridListComponent, canActivate: [AuthGuard, SecureInnerPagesGuard], data: { component: 'grid' } },

  // { path: 'site', loadChildren: () => import(`./site/site-routing.module`).then(m => m.SiteRoutingModule) },
  { path: 'client', loadChildren: () => import(`./modules/module-routing.module`).then(m => m.ModuleRoutingModule),data:{title:'client'}  },
  { path: 'maileremailverification', component: MaileremailverificationComponent },
  { path: 'mfa', component: MfaComponent },
  { path: 'mfa-settings', component: MfaSettingsComponent },
  { path: 'welcomepopup', component: WelcomeComponent},
  { path: 'authentication', component: AuthenticatorComponent},
  { path: 'gdpr/consent-request', component: RequestGdprContentPageComponent},
  { path: 'career-page', component: CareerPageComponent},
  { path: 'document', loadChildren: () => import(`./document/document-routing.module`).then(m => m.DocumentRoutingModule) },
  { path: 'assessment', loadChildren: () => import(`./assessment-preview/assessment-routing.module`).then(m => m.AssessmentRoutingModule) },
  { path: 'application', loadChildren: () => import(`./application-preview/application-preview-routing.module`).then(m => m.ApplicationPreviewRoutingModule) },
  { path: '**', redirectTo: 'appintialization' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})

export class AppRoutingModule { }
