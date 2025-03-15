import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactsComponent } from './contacts.component';
import { ContactSummaryComponent } from './contact-detail/contact-summary/contact-summary.component';
import { ContactAddressComponent } from './contact-detail/contact-summary/contact-address/contact-address.component';
import { ContactClientsComponent } from './contact-detail/contact-clients/contact-clients.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactPersonalInfoComponent } from './contact-detail/contact-summary/contact-personal-info/contact-personal-info.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManageClientContactComponent } from './contact-detail/contact-clients/manage-client-contact/manage-client-contact.component';
import { CommonSharedModule } from '../../../shared/common-shared.module';
import { ContactSmshistroyComponent } from './contact-smshistroy/contact-smshistroy.component';
import { ContactCallHistroyComponent } from './contact-detail/contact-summary/contact-call-histroy/contact-call-histroy.component';

@NgModule({
  declarations: [ContactsComponent, ContactDetailComponent, ContactSummaryComponent, 
    ContactAddressComponent, ContactClientsComponent, ContactPersonalInfoComponent, ManageClientContactComponent, ContactSmshistroyComponent, ContactCallHistroyComponent],
  imports: [
    CommonModule,SharedModule, ContactRoutingModule ,NgSelectModule,CommonSharedModule
  ],
  providers:[]
})
export class ContactModule { }
