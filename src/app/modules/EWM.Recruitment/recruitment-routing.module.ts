import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulesComponent } from '../modules.component';
import { RecruitmentLandingPageComponent } from './recruitment-landing-page/recruitment-landing-page.component';

const routes: Routes = [
 // {
    // path: '',
    // component: ModulesComponent,
    // children: [
  
      {
        path: '',
        children: [
           { path: '',component: RecruitmentLandingPageComponent}
        ]
      }
   // ]
 // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule { }
