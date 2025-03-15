import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsHistoryComponent } from '@app/modules/EWM.core/job/job/job-sms/sms-history/sms-history.component';
import { BidiModule } from '@angular/cdk/bidi';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { EditorModule } from '@progress/kendo-angular-editor';
import { GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SocialLoginModule } from 'angularx-social-login';
import { ConnectionServiceModule } from 'ng-connection-service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMarkjsModule } from 'ngx-markjs';
import { createTranslateLoader } from './shared.module';
import { MentionEditorComponent } from './mention-editor/mention-editor.component';
import { ParsedResumeKeywordSearchComponent } from './parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';
import { CandidateResumeParseComponent } from '@app/modules/EWM-Candidate/profile-summary/candidate-resume/candidate-resume-parse/candidate-resume-parse.component';


@NgModule({
  declarations: [
    SmsHistoryComponent,
    MentionEditorComponent,
   ParsedResumeKeywordSearchComponent,
   CandidateResumeParseComponent

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
        useFactory: createTranslateLoader,
        deps: [HttpClient],
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
    NgxMarkjsModule
  ],
  exports: [
    SmsHistoryComponent,
    MentionEditorComponent,
    ParsedResumeKeywordSearchComponent,
    CandidateResumeParseComponent
  ],
  providers: []
})
//  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
//{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
export class CommonSharedModule { }
