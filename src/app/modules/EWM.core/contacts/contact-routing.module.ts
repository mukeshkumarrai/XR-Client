import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { LinkDeniedComponent } from '@app/modules/errors/link-denied/link-denied.component';


const routes: Routes = [
  {
        path: 'contacts',
        children: [
          { path: 'contact-list', component: ContactsComponent , canActivate: [AuthGuard]},
          { path: 'contact-detail', component: ContactDetailComponent },
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: '**', redirectTo: 'contact-list' }
        ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
