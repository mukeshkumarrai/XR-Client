/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: link-expire.component
  @Who: Satya Prakash Gupta
  @When: 15-Mar-2021
  @Why: EWM-1017 EWM-1066
  @What: This file handle all functionality related to link expired
*/
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
  providers: [DummyService]
})
export class AccessDeniedComponent implements OnInit {

  userDefoultLang: string;
  langflag: string;
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  
  constructor(private translateService: TranslateService,private commonserviceService: CommonserviceService, 
    public router: Router,
    public dummyService: DummyService,
    public dialog: MatDialog,
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
  /*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: link-denied.component
  @Who: Nitin Bhati
  @When: 12-Mar-2021
  @Why: EWM-1146
  @What: for redirect login module
*/
public domainDenied(){
  this.router.navigate(['/login']);
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
