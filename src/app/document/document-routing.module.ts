import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './document.component';
import { GenrateOtpComponent } from './genrate-otp/genrate-otp.component';
import{DocumentlistComponent} from 'src/app/document/documentlist/documentlist.component';
import { RequestGdprContentPageComponent } from './request-gdpr-content-page/request-gdpr-content-page.component';
const routes: Routes = [
  {
    path: '',
    component: DocumentComponent,
    children: [
      { path: 'genrate-otp', component: GenrateOtpComponent },
      { path: 'list-details', component: DocumentlistComponent }, 
      { path: '**', component: GenrateOtpComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule { }
