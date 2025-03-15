import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { SearchheaderComponent } from './layout/searchheader/searchheader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { OuterHeaderComponent } from './layout/outer-header/outer-header.component';
import { OuterFooterComponent } from './layout/outer-footer/outer-footer.component';
import { OuterHeaderNewComponent } from './layout/outer-header-new/outer-header-new.component';

@NgModule({
  declarations: [  SearchheaderComponent, SidebarComponent,FooterComponent, OuterHeaderComponent, OuterFooterComponent, OuterHeaderNewComponent],
  imports: [
    CommonModule,AppRoutingModule
  ],
  exports:[AppRoutingModule],
  providers:[]
})
export class CoreModule { }
