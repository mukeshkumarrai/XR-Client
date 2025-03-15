/*--
 @(C): Entire Software
 @Type: File, <TS>
 @Name: crm-routing.module.ts
 @Who: Renu
 @When: 22-Dec-2020
 @Why: ROST-572
 @What: To handle the navigation from one view to the next for crm Module
 @param: 1. path refers to the part of the URL that determines a unique view that should be displayed
         2. component refers to the Angular component that needs to be associated with a path.

 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LandingPageComponent } from './landing-page/landing-page.component';
import { ModulesComponent } from '../modules.component';
import { CrmLandingPageComponent } from './crm-landing-page/crm-landing-page.component';

const routes: Routes = [
  {
    // path: '',
    // component: ModulesComponent,
    // children: [

    //   {
        path: '',
        children: [
           { path: '',component: CrmLandingPageComponent}
        ]
     // }
    //]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
