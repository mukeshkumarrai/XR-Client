/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 15-Sep-2021
  @Why: EWM-2518 EWM-2848
  @What:  This page will be use for the document Component ts file
*/
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { DummyService } from '../shared/data/dummy.data';
import { FooterDialogComponent } from '../shared/modal/footer-dialog/footer-dialog.component';
import { CommonserviceService } from '../shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DummyService],
})
export class DocumentComponent implements OnInit {
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  
  constructor(
    public dialog: MatDialog,
    public dummyService: DummyService,
    private commonserviceService: CommonserviceService,
  ) { }

  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
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
      maxWidth: '750px',
      width: '90%',
      disableClose: true,
      data: this.modaldata,
      panelClass: ['footerPopUp', 'animate__animated', 'animate__slow', 'animate__fadeInUpBig']
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

}
