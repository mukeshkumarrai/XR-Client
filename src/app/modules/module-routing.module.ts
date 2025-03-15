/*--
 @(C): Entire Software
 @Type: File, <TS>
 @Name: module-routing.module.ts
 @Who: Renu
 @When: 22-Dec-2020
 @Why: ROST-572
 @What: To handle the navigation from one view to the next for core Module
 @param: 1. path refers to the part of the URL that determines a unique view that should be displayed
         2. component refers to the Angular component that needs to be associated with a path.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';

const routes: Routes = [
 {

   path: '',
   component: ModulesComponent,
   children: [
  { path: 'core', loadChildren: () => import(`./EWM.core/ewm.core-routing.module`).then(m => m.EWMCoreRoutingModule) },
  { path: 'Rosters', loadChildren: () => import(`./EWM.Rosters/rosters-routing.module`).then(m => m.RostersRoutingModule) },
  { path: 'Recuritment', loadChildren: () => import(`./EWM.Recruitment/recruitment-routing.module`).then(m => m.RecruitmentRoutingModule) },
  { path: 'Finance', loadChildren: () => import(`./EWM.Finance/finance-routing.module`).then(m => m.FinanceRoutingModule) },
  { path: 'CRM', loadChildren: () => import(`./EWM.CRM/crm-routing.module`).then(m => m.CrmRoutingModule) },
  { path: 'Allocation', loadChildren: () => import(`./EWM.Allocations/allocation-routing.module`).then(m => m.AllocationRoutingModule) },
  { path: 'cand', loadChildren: () => import(`./EWM-Candidate/candidate-routing.module`).then(m => m.CandidateRoutingModule) },
  { path: 'emp', loadChildren: () => import(`./EWM-Employee/employee-routing.module`).then(m => m.EmployeeRoutingModule) },
  { path: 'jobs', loadChildren: () => import(`./xeople-job/xeople-job-routing.module`).then(m => m.XeopleJobRoutingModule) }, 
  { path: 'cont', loadChildren: () => import(`./EWM.core/contacts/contact-routing.module`).then(m => m.ContactRoutingModule) },   
  { path: 'leads', loadChildren: () => import('./EWM-Lead/lead-routing.module').then(m => m.LeadRoutingModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule { }
