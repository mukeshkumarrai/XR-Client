import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDeniedComponent } from '../errors/link-denied/link-denied.component';
import { ModulesComponent } from '../modules.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { GeneralInformationComponent } from './profile-summary/general-information/general-information.component';
import { CandidateLocationComponent } from './profile-summary/general-information/candidate-location/candidate-location.component';
import { CandidateExperienceComponent } from './profile-summary/candidate-experience/candidate-experience.component';
import { CandidateFolderComponent } from './candidate-folder/candidate-folder.component';
import { ManageCandidateFolderComponent } from './candidate-folder/manage-candidate-folder/manage-candidate-folder.component';
import { CandidateFolderFilterComponent } from './profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { SampleComponent } from '../EWM.core/sample/sample.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { ManageCandidateSkillsComponent } from './profile-summary/manage-candidate-skills/manage-candidate-skills.component';
import { ViewCandidateApplicationComponent } from './candidate-list/view-candidate-application/view-candidate-application.component';
import { CreateCandidateComponent } from './candidate-list/create-candidate/create-candidate.component';
import { MapApplicationFormCandidateComponent } from './candidate-list/map-application-form-candidate/map-application-form-candidate.component';

const routes: Routes = [

  {
    // path: '',
    // component: ModulesComponent,
    // children: [
    //   {
        path: 'candidate',
        children: [
          { path: 'create-candidate', component: CreateCandidateComponent, canActivate: [AuthGuard]},
          { path: 'candidate-list', component: CandidateListComponent, canActivate: [AuthGuard]},
          { path: 'candidate', component: ProfileSummaryComponent,canActivate: [AuthGuard]},
          { path: 'general-information', component: GeneralInformationComponent,canActivate: [AuthGuard]},
          { path: 'candidate-location', component: CandidateLocationComponent,canActivate: [AuthGuard]},
          { path: 'candidate-experience', component: CandidateExperienceComponent,canActivate: [AuthGuard]},
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'candidate-folder', component: CandidateFolderComponent,canActivate: [AuthGuard]},
          { path: 'manage-candidate-folder', component: ManageCandidateFolderComponent,canActivate: [AuthGuard]},
          { path: 'candidate-folder-filter', component: CandidateFolderFilterComponent,canActivate: [AuthGuard]},
          { path: 'report', component: SampleComponent},
          { path: 'masters', component: SampleComponent},
          { path: 'skill-edit', component:   ManageCandidateSkillsComponent},
          { path: 'view-candidate-application', component: ViewCandidateApplicationComponent, canActivate: [AuthGuard] },
          { path: 'applicationform-candidate', component: MapApplicationFormCandidateComponent},
          { path: '**', redirectTo: 'candidate-list' }

        ]


     // },

    //]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule {


}
