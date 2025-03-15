import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentPreviewComponent } from './assessment-preview.component';
import { AssessmentTestComponent } from './assessment-test/assessment-test.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentPreviewComponent,
    children: [
      { path: 'preview', component: WelcomePageComponent },
      { path: '**', component: AssessmentPreviewComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentRoutingModule { }
