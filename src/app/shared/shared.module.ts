import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
// import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SocialLoginModule } from 'angularx-social-login';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxCaptchaModule } from 'ngx-captcha';
import { BidiModule } from '@angular/cdk/bidi';
import { ConnectionServiceModule } from 'ng-connection-service';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { EditorModule } from '@progress/kendo-angular-editor';
import { PDFModule, SchedulerModule } from '@progress/kendo-angular-scheduler';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ServiceListClass } from './services/sevicelist';
import { CustomeNumberPipe } from './pipe/custome.numberpipe.pipe';
import { CustomeCurrencyPipe } from './pipe/custome.currencypipe.pipe';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { ModalComponent } from './modal/modal.component';
import { ConfirmDialogComponent } from './modal/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { DomainConfirmDialogComponent } from './modal/domain-confirm-dialog/domain-confirm-dialog.component';
import { InformDialogComponent } from './modal/inform-dialog/inform-dialog.component';
import { WarningDialogComponent } from './modal/warning-dialog/warning-dialog.component';
import { ErrorDialogComponent } from './modal/error-dialog/error-dialog.component';
import { CustomDatepipePipe } from './pipe/custom.datepipe.pipe';
import { FooterDialogComponent } from './modal/footer-dialog/footer-dialog.component';
import { CustomNgSelectComponent } from './modal/custom-ng-select/custom-ng-select.component';
import { CustomNgSelectCurrencyComponent } from './modal/custom-ng-select-currency/custom-ng-select-currency.component';
import { CustomNgSelectPhonecodeComponent } from './modal/custom-ng-select-phonecode/custom-ng-select-phonecode.component';
//import { OrderbyPipe } from './pipe/orderby.pipe';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DateAgoPipe } from './pipe/date-ago.pipe';
import { CustomDropdownComponent } from './modal/custom-dropdown/custom-dropdown.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CustomtranlatePipe } from './pipe/customtranlate.pipe';
import { HasPermissionDirective } from './directive/has-permission.directive';
import { CustomHtmlEditorComponent } from './modal/custom-html-editor/custom-html-editor.component';
import { DisconnectEmailComponent } from './modal/disconnect-email/disconnect-email.component';
import { EmailConfirmDialogComponent } from './modal/email-confirm-dialog/email-confirm-dialog.component';
import { CustomLocationComponent } from './modal/custom-location/custom-location.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { EmmailnotintegratedComponent } from './modal/emmailnotintegrated/emmailnotintegrated.component';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { CustomLatLongDistancePopupComponent } from './modal/custom-lat-long-distance-popup/custom-lat-long-distance-popup.component';
import { KilometerToMeterPipe } from './pipe/kilometer-to-meter.pipe';
import { CustomFilterComponent } from './modal/custom-filter/custom-filter.component';
import { NotesDetailsComponent } from './notes-details/notes-details.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonCaptchaComponent } from './modal/common-captcha/common-captcha.component';
import { CustomAttachmentPopupComponent } from './modal/custom-attachment-popup/custom-attachment-popup.component';
import { TimesecondsPipe } from './pipe/timeseconds.pipe';
import { TimezonePipe } from './pipe/timezone.pipe';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { AlertDialogComponent } from './modal/alert-dialog/alert-dialog.component';
import { UtctodatetimePipe } from './pipe/utctodatetime.pipe';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DigitOnlyDirective } from '../../app/modules/EWM.core/job/job-details/candidate-rank/digit-only.directive';
import { SafePipe } from '../shared/modal/google-maps-location-pop/safe.pipe';
import { SessionSwitchingComponent } from './modal/session-switching/session-switching.component';
import { DeleteConfirmationComponent } from './modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
// import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { CustomeDropdownWithTwoVariabelComponent } from './modal/custome-dropdown-with-two-variabel/custome-dropdown-with-two-variabel.component';
import { DocumentUploadComponent } from '../modules/EWM.core/shared/document-upload/document-upload.component';
import { FileSize } from './pipe/file-size.pipe';
import { GrabberDirective, ResizableDirective } from './directive/resizable.directive';
import { SortByOrderPipe  } from './pipe/sortByOrder.pipe';
import { FormgroupFilterPipe } from './pipe/formgroup-filter.pipe';
import { ArraySortPipe } from './pipe/custom.orderby';
import { CustomDropdownDynamicSearchComponent } from './modal/custom-dropdown-dynamic-search/custom-dropdown-dynamic-search.component';
import { XeopleSmartEmailJobComponent } from './popups/xeople-smart-email-job/xeople-smart-email-job.component';
import { BroadbeanJobBoardsStatusComponent } from './modal/broadbean-job-boards-status/broadbean-job-boards-status.component';
import { PhonePipe } from './pipe/phone.pipe';
import { UnsavedConfirmPopComponent } from './modal/unsaved-confirm-pop/unsaved-confirm-pop.component';
import { ShowPendingMandatoryListPopComponent } from './modal/show-pending-mandatory-list-pop/show-pending-mandatory-list-pop.component';
import { JobActivityCalenderComponent } from '../modules/xeople-job/job-screening/job-activity-calender/job-activity-calender.component';
import { JobActivityGridComponent } from '../modules/xeople-job/job-screening/header-panel/job-activity-grid/job-activity-grid.component';
import { JobCategoryFilterComponent } from '../modules/xeople-job/job-screening/header-panel/job-category-filter/job-category-filter.component';
import { JobActivityCalenderDetailsComponent } from '../modules/xeople-job/job-screening/job-activity-calender/job-activity-calender-details/job-activity-calender-details.component';
import { IntlModule } from '@progress/kendo-angular-intl';
import { ListViewModule } from '@progress/kendo-angular-listview';
import { Base64Pipe } from './pipe/base64.pipe';
import { OrderByFunPipe } from './pipe/order-by-fun.pipe';
import { UtctodatePipe } from './pipe/utctodate.pipe';
import { MulitpleCandidateFolderMappingComponent } from './modal/mulitple-candidate-folder-mapping/mulitple-candidate-folder-mapping.component';
import { CandidateWorkflowStagesMappedJobdetailsPopComponent } from './modal/candidate-workflow-stages-mapped-jobdetails-pop/candidate-workflow-stages-mapped-jobdetails-pop.component';
import { RemoveMultipleCandidateComponent } from './modal/remove-multiple-candidate/remove-multiple-candidate.component';
import { ViewAttachmentPopupComponent } from './modal/view-attachment-popup/view-attachment-popup.component';
import { DayHoursMinutesFormatPipe } from 'src/app/shared/pipe/dayHoursMinutesFormat.pipe';
import { DaysCountTillSecontsByDatePipe } from 'src/app/shared/pipe/dayscounttillsecountbydate.pipe';
import { FilterPipe } from '../shared/pipe/filter.pipe';
import { AccessPipe } from '../shared/pipe/access.pipe';
import { NumberToMonthPipe } from 'src/app/shared/pipe/numbertomonth.pipe';
import { CommonDropdownComponent } from './modal/common-dropdown/common-dropdown.component';
import { OrderTranslatePipe } from './pipe/order-translate.pipe';
import { CustomIndeedLocationComponent } from './modal/custom-indeed-location/custom-indeed-location.component';
import { CommonDropdownClientSideComponent } from './modal/common-dropdown-client-side/common-dropdown-client-side.component';
import { ReopenJobComponent } from './modal/reopen-job/reopen-job.component';
import { CustomTimePipe } from './pipe/custom-time.pipe';
import { NgxMarkjsModule } from 'ngx-markjs';
import { HighlightModule } from './helper/highlight/highlight.module';
import { APICallPipe } from '@app/shared/pipe/APICall.pipe';
import { UtcDiffPipe } from '@app/shared/pipe/UtcDiff.pipe';
import { ProximitySearchComponent } from './popups/proximity-search/proximity-search.component';
import { MailBodySanitizerPipe } from '@app/shared/pipe/mail-body-sanitizer.pipe';
import { TranslationService } from '@app/shared/services/CustomTranslateLoader';
import { ParsedResumeKeywordSearchComponent } from './parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';
import { CandidateResumeParseComponent } from '@app/modules/EWM-Candidate/profile-summary/candidate-resume/candidate-resume-parse/candidate-resume-parse.component';
import { CommonserviceService } from './services/commonservice/commonservice.service';
import { CustomPhonePipe } from './pipe/custom.phone.pipe';
import { AlphabetOnlyDirective } from '../../app/modules/EWM.core/job/Master/job-type/job-automation/alphabetic-only.directive';
import { ImageSizePipe } from '../shared/pipe/image-size.pipe';
import {QuickCompanyChooseComponent} from './modal/quick-company-choose/quick-company-choose.component';
import { AddLeadComponent } from './modal/add-lead/add-lead.component';
import { DisableIfJobClosedDirective } from '../modules/xeople-job/job-detail/disableI-JobClosed.directive';
import { ShareClientEohComponent } from '@app/modules/EWM.core/client/client-detail/share-client-eoh/share-client-eoh.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
const sharedAPIUrl='';
export function config(){
   this.http.get('assets/config/config.json').toPromise()
   .then((response: any) => {
     this.configurationobject = response;
     return  this.sharedAPIUrl =response.shared;
    
   }
   );
}
/*export class LocalStorage {
  public static get DateFormat() {
      return localStorage.getItem('DateFormat');
  }
}

const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMMM YYYY',
  },
  display: {
    dateInput: LocalStorage.DateFormat,// 'DD MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
*/
@NgModule({
  declarations: [
    CustomeNumberPipe,
    CustomeCurrencyPipe,
    CustomDatepipePipe,
    UtctodatetimePipe,
    SnackbarComponent,
    ModalComponent,
    ConfirmDialogComponent,
    DomainConfirmDialogComponent,
    InformDialogComponent,
    WarningDialogComponent,
    ErrorDialogComponent,
    FooterDialogComponent,
    CustomNgSelectComponent,
    CustomNgSelectCurrencyComponent,
    CustomNgSelectPhonecodeComponent,
    DateAgoPipe,
    APICallPipe,
    UtcDiffPipe,
    CustomTimePipe,
   SafeHtmlPipe,
    CustomDropdownComponent,
   // OrderbyPipe
   CustomHtmlEditorComponent,
   CustomLocationComponent,
   HasPermissionDirective,
   ResizableDirective,
   GrabberDirective,
   CustomHtmlEditorComponent,
   DisconnectEmailComponent,
   EmailConfirmDialogComponent,
   EmmailnotintegratedComponent,
   CustomLatLongDistancePopupComponent,
   KilometerToMeterPipe,
   CustomtranlatePipe,
   CustomFilterComponent,
   NotesDetailsComponent,
   CommonCaptchaComponent,
   CustomAttachmentPopupComponent,
   TimesecondsPipe,
   TimezonePipe,
   AlertDialogComponent,
   UtctodatetimePipe,
   DigitOnlyDirective,
   SafePipe,
   SessionSwitchingComponent,
   DeleteConfirmationComponent,
   CustomeDropdownWithTwoVariabelComponent,
   //HighchartsChartComponent
   DocumentUploadComponent,
   FileSize,
   SortByOrderPipe,
   ArraySortPipe,
   FormgroupFilterPipe,
   CustomDropdownDynamicSearchComponent,
   XeopleSmartEmailJobComponent,
   BroadbeanJobBoardsStatusComponent,
   PhonePipe,
   UnsavedConfirmPopComponent,
   ShowPendingMandatoryListPopComponent,
   JobActivityCalenderComponent,
   JobActivityGridComponent,
   JobCategoryFilterComponent,
   JobActivityCalenderDetailsComponent,
   Base64Pipe,
   OrderByFunPipe,
   UtctodatePipe,
   MulitpleCandidateFolderMappingComponent,
   CandidateWorkflowStagesMappedJobdetailsPopComponent,
   RemoveMultipleCandidateComponent,
   ViewAttachmentPopupComponent,
   DayHoursMinutesFormatPipe,
   DaysCountTillSecontsByDatePipe,
   FilterPipe,
   AccessPipe,
   NumberToMonthPipe,
   CommonDropdownComponent,
   OrderTranslatePipe,
   OrderTranslatePipe,
   CustomIndeedLocationComponent,
   CommonDropdownClientSideComponent,
   ReopenJobComponent,
   CustomTimePipe,
   ProximitySearchComponent,
   MailBodySanitizerPipe,
   CustomPhonePipe,
   AlphabetOnlyDirective
  // ParsedResumeKeywordSearchComponent,
   //CandidateResumeParseComponent
   ,ImageSizePipe,QuickCompanyChooseComponent,AddLeadComponent,
   DisableIfJobClosedDirective,ShareClientEohComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressBarModule,
    MatGridListModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTooltipModule,
    MatSliderModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatListModule,
    DragDropModule,
    MatDialogModule,
    MatBadgeModule,
    GooglePlaceModule,
    //devex
    //Social login
    SocialLoginModule,
    //
    MatProgressSpinnerModule,
    BidiModule,
    MatStepperModule,
    ConnectionServiceModule,
    EditorModule,
    InputsModule,
    DialogsModule,
    TooltipModule,
    GridModule,
    SchedulerModule,
    PDFModule,
    MatAutocompleteModule,
    MatMenuModule,
    ScrollingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient,ServiceListClass:ServiceListClass) => new TranslationService(http,ServiceListClass),
        deps: [HttpClient,ServiceListClass],
      },
    }),
    ScrollingModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxDocViewerModule,
    MatTreeModule,
    OverlayModule,
    NgxCaptchaModule,
    DateInputsModule,
    CdkStepperModule,
    FloatingLabelModule,
    IntlModule,
    NgxMarkjsModule,
    HighlightModule
  ],
  exports: [
    NgxMarkjsModule,
    HighlightModule,
    FloatingLabelModule,
    CdkStepperModule,
    OverlayModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTooltipModule,
    MatSliderModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatListModule,
    DragDropModule,
    MatDialogModule,
    MatBadgeModule,
    GooglePlaceModule,
    //devex
    //Social login
    SocialLoginModule,
    UtcDiffPipe,
    APICallPipe,
    MatProgressSpinnerModule,
    BidiModule,
    MatStepperModule,
    ConnectionServiceModule,
    EditorModule,
    InputsModule,
    DialogsModule,
    TooltipModule,
    GridModule,
    ListViewModule,
    SchedulerModule,
    PDFModule,
    MatAutocompleteModule,
    MatMenuModule,
    TranslateModule,
    CustomeNumberPipe,
    CustomDatepipePipe,
    UtctodatetimePipe,
    CustomeCurrencyPipe,
    ModalComponent,
    ConfirmDialogComponent,
    InformDialogComponent,
    WarningDialogComponent,
    ErrorDialogComponent,
    CustomNgSelectComponent,
    CustomNgSelectCurrencyComponent,
    CustomNgSelectPhonecodeComponent,
    NgxDocViewerModule,
    NgxCaptchaModule,
    DateAgoPipe,
    CustomTimePipe,
    SafeHtmlPipe,
    Base64Pipe,
    CustomDropdownComponent,
    CustomtranlatePipe,
    CustomHtmlEditorComponent,
    CustomLocationComponent,
    HasPermissionDirective,
    ResizableDirective,
    GrabberDirective,
    CustomHtmlEditorComponent,
    CustomLatLongDistancePopupComponent,
    MatTreeModule,
    CustomFilterComponent,
    CommonCaptchaComponent,
    CustomAttachmentPopupComponent,
    TimesecondsPipe,
    TimezonePipe,
    DateInputsModule,
    KilometerToMeterPipe,
    AlertDialogComponent,
    DigitOnlyDirective,
    SafePipe,
   DeleteConfirmationComponent,
   CustomeDropdownWithTwoVariabelComponent,
   DocumentUploadComponent,
   FileSize,
   SortByOrderPipe,
   ArraySortPipe,
   FormgroupFilterPipe,
   CustomDropdownDynamicSearchComponent,
   PhonePipe,
   JobActivityCalenderComponent,
   JobActivityGridComponent,
   JobCategoryFilterComponent,
   JobActivityCalenderDetailsComponent,
   IntlModule,
   OrderByFunPipe,
   UtctodatePipe,
   DayHoursMinutesFormatPipe,
   DaysCountTillSecontsByDatePipe,
   FilterPipe,
   AccessPipe,
   NumberToMonthPipe,
   CommonDropdownComponent,
   OrderTranslatePipe,
   OrderTranslatePipe,
   CustomIndeedLocationComponent,
   CommonDropdownClientSideComponent,
   MailBodySanitizerPipe,
   CustomPhonePipe,
   AlphabetOnlyDirective,
   ImageSizePipe,QuickCompanyChooseComponent,AddLeadComponent,
   DisableIfJobClosedDirective,ShareClientEohComponent
   //ParsedResumeKeywordSearchComponent,
  // CandidateResumeParseComponent
  //  MatMomentDateModule
  ],
  providers: [CommonserviceService]
})
//  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
//{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
export class SharedModule { }
