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

const routes: Routes = [
  {}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule { }
