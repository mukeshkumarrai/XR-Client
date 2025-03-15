import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DummyService } from '@app/shared/data/dummy.data';
import { FooterDialogComponent } from '@app/shared/modal/footer-dialog/footer-dialog.component';
import { AppSettingsService } from '@app/shared/services/app-settings.service';

@Component({
  selector: 'app-outer-footer',
  templateUrl: './outer-footer.component.html',
  styleUrls: ['./outer-footer.component.scss'],
  providers: [DummyService],
})
export class OuterFooterComponent implements OnInit {
  public currentYear: any;
  modaldata: any;
  public loginFooterSecurityNoticeboard:string;
  public loginFooterTermsOfUse:string;
  public loginFooterPrivacyPolicy:string;
  constructor(public dummyService: DummyService, public dialog: MatDialog,private _appSetting: AppSettingsService) { 
    this.loginFooterSecurityNoticeboard = this._appSetting?.FooterSecurityNoticeboardUrl;
    this.loginFooterTermsOfUse = this._appSetting?.FooterTermsOfUseUrl;
    this.loginFooterPrivacyPolicy = this._appSetting?.FooterPrivacyPolicyUrl;
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    
  }
  /**
    @(C): Entire Software
    @Type: Function
    @Who: Mukesh kumar rai
    @When: 10-Sept-2020
    @Why:  Open for modal window
    @What: This function responsible to open and close the modal window.
    @Return: None
    @Params :
    1. param -button name so we can check it come from which link.
   */
    openDialog(param): void {
      if (param === 'privacy') {
        this.modaldata = this.dummyService.getPolicy();
      }
      if (param === 'term') {
        this.modaldata = this.dummyService.getTerm();
      }
      const dialogRef = this.dialog.open(FooterDialogComponent, {
        disableClose: true,
        data: this.modaldata,
        panelClass: ['xeople-modal-lg', 'footerPopUp', 'animate__animated', 'animate__slow', 'animate__fadeInUpBig']
      });
      dialogRef.afterClosed().subscribe(result => {
  
      });
    }
}
