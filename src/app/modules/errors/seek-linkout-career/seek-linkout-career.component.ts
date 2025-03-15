/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: seek-linkout-career.component
  @Who: Satya Prakash Gupta
  @When: 25-May-2021
  @Why: EWM-6587 EWM-6652
  @What: This file handle all functionality related to acess denied
*/
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-seek-linkout-career',
  templateUrl: './seek-linkout-career.component.html',
  styleUrls: ['./seek-linkout-career.component.scss'],
  providers: [DummyService]
})
export class SeekLinkoutCareerComponent implements OnInit {

  
  userDefoultLang: string;
  langflag: string;
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  constructor(private translateService: TranslateService,
    public dummyService: DummyService,
    public dialog: MatDialog,
    private commonserviceService: CommonserviceService,
    @Inject(DOCUMENT) private document: Document
    ) { 
    this.langflag = 'eng';
  }

  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
    this.document.body.classList.add('login-screen-body');
  }
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching language
  // @What: this function used for change language of application.
  // @Return: None
  // @Params :
  // 1. lang - language code.


  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
    this.langflag = lang;
  }
// @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Open modal window
  // @What: this function used for open policy and terem modal window.
  // @Return: None
  // @Params :
  // 1. lang - language code.

  openDialog(param): void {
    if (param === 'privacy') {
      this.modaldata = this.dummyService.getPolicy();
    }
    if (param === 'term') {
      this.modaldata = this.dummyService.getTerm();
    }
    const dialogRef = this.dialog.open(FooterDialogComponent, {
      maxWidth:"750px",
      width: '90%',
      disableClose: true,
      data: this.modaldata,
      panelClass: ['footerPopUp', 'animate__slow', 'animate__animated', 'animate__fadeInUpBig']
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
