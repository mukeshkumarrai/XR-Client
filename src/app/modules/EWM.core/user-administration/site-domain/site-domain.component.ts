/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 25-Nov-2020
  @Why: ROST-370 ROST-427
  @What:  This page will be use for the site domain Component ts file
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAdministrationService } from '../../shared/services/user-administration/user-administration.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomainConfirmDialogComponent, DomainConfirmDialogModel } from '../../../../shared/modal/domain-confirm-dialog/domain-confirm-dialog.component';
import { HeaderComponent } from 'src/app/core/layout/header/header.component';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { ResponceData } from 'src/app/shared/models';

@Component({
  providers: [MessageService],
  selector: 'app-site-domain',
  templateUrl: './site-domain.component.html',
  styleUrls: ['./site-domain.component.scss']
})
export class SiteDomainComponent implements OnInit {
  /*
    @Type: File, <ts>
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: Decalaration of Global Variables
  */
  @ViewChild(HeaderComponent, { static: true }) headerComponent: HeaderComponent;
  siteDomainFrom: FormGroup;
  submitted = false;
  status: boolean = false;
  loading: boolean;
  result: string = '';
  public value = ``;
  SubDomainName: string;
  domainNames: string;
  private rtl = false;
  private ltr = true;
  public listData: any[];
  dialog: any;
  cancel: any;
  active: boolean;
  public specialcharPattern = "^[A-Za-z0-9_]+$";
  public maxCharacterLengthSubHead = 115;
  
  constructor(public dialogObj: MatDialog, private validateCode: ValidateCode, private fb: FormBuilder,
    private _userAdministrationService: UserAdministrationService, private route: Router,
    private snackBService: SnackBarService, private commonserviceService: CommonserviceService,private translate: TranslateService,
    public _sidebarService: SidebarService, private messages: MessageService, private authenticationService: LoginService) {
    this.siteDomainFrom = this.fb.group({
      Domain: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(this.specialcharPattern)], [this.validateCode.checkdDomainDuplicay.bind(this.validateCode)]]
    })
  }


  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    //this.domainName=localStorage.getItem('domain');
    this.commonserviceService.event.subscribe(res => {
      if (res == 'rtl') {
        this.messages.notify(this.ltr);
      } else if (res == 'ltr') {
        this.messages.notify(this.rtl);
      }
    })
    this.getSiteDomainInfo();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
  }



  /* 
    @Type: File, <ts>
    @Name: Site Domain Change function
    @Who: Naresh Singh
    @When: 15-Jan-2021
    @Why: ROST-715
    @What: service call to update Site Domain
  */



  openConfrmDialog(value): void {
    const message = `label_titleDialogContentSiteDomain`;
    const title = 'label_update';
    const subtitle = 'label_siteDomain';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated','animate__zoomIn'],
      disableClose: true,
    });
    this.submitted = true;
    if (this.siteDomainFrom.invalid) {
      return;
    } else {
      this.loading = true;
      const formData = {
        "Domain": value.Domain
      }

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
        if (dialogResult == true) {
          this.loading = true;
          this._userAdministrationService.updateSiteDomainInfo(JSON.stringify(formData)).subscribe(responseData => {
            this.active = false;
            this.loading = false;
            if (responseData.HttpStatusCode == 200) {

              if (responseData.Status == true) {

                this.snackBService.showSuccessSnackBar(this.translate.instant('label_siteDomain')+" "+this.translate.instant(responseData.Message), responseData.Httpstatuscode);
                this.openConfirmationDialog(formData);
              }
            } else if (responseData.HttpStatusCode == 400) {
              if (responseData.Status == false) {
                this.snackBService.showErrorSnackBar(this.translate.instant(responseData.Message), responseData.Httpstatuscode);
              }
            }

          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translate.instant(err.Message), err.StatusCode);
            
          })

        } else {
          //this.snackBService.showErrorSnackBar("Cancelled the request", this.result);
          this.loading = false;
        }
      });
    }
  }

  /*
 @Type: File, <ts>
 @Name: getSiteDomainInfo function
 @Who: Nitin Bhati
 @When: 07-jan-2021
 @Why: ROST-428
 @What: call Get method from services for showing data into grid.
  */
  getSiteDomainInfo() {
    this.loading = true;
    this._userAdministrationService.getSiteDomainInfo().subscribe(
      repsonsedata => {
        //this.listData = repsonsedata['Data']; 
        this.SubDomainName = repsonsedata['Data']['SubDomainName'];
        this.siteDomainFrom.patchValue({
          'Domain': this.SubDomainName
        })
        this.domainNames = repsonsedata['Data']['DomainName'];
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translate.instant(err.Message), err.StatusCode);
      
      })
  }


  /*
 @Type: File, <ts>
 @Name: openConfirmationDialog function
 @Who: Renu
 @When: 11-Feb-2021
 @Why: ROST-866
 @What: to open confrm dialog to redirect the user
  */

  openConfirmationDialog(formData) {
    const message = `Are you sure you want to do this?`;
    const title = 'label_update';
    const subtitle = 'label_siteDomain';
    const dialogData = new DomainConfirmDialogModel(title, subtitle, message);
    const dialogRefdomain = this.dialogObj.open(DomainConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData,
      panelClass: 'custom-modalbox'
    });

    dialogRefdomain.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      this.updateSiteDomain(formData, dialogResult);

    })
  }

  /*
 @Type: File, <ts>
 @Name: updateSiteDomain function
 @Who: Renu
 @When: 11-Feb-2021
 @Why: ROST-866
 @What: when user choose yes then it will redirect it to its domain
  */
  updateSiteDomain(formData, dialogResult) {
    if (dialogResult == true) {
      this._userAdministrationService.getSubDomainAvailable(formData.Domain).subscribe(
        // repsonsedata => {
        //   let DomainName = repsonsedata['Data']['DomainName'];
        //   window.location.href = DomainName;
        //   this.authenticationService.logout(false);
        //   this.authenticationService.serverlogout(1);
          (repsonsedata:ResponceData) => {
            if(repsonsedata.HttpStatusCode===200){
              this.authenticationService.serverlogout(1).subscribe( (repsonsedata: ResponceData) => {
                if (repsonsedata.HttpStatusCode === 200){
                this.authenticationService.logout(false);
                }
            });
            }
          this.loading = false;
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translate.instant(err.Message), err.StatusCode);
         
        })
    
    }
  }

  /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

 reloadApiBasedOnorg(){
  this.getSiteDomainInfo();
}
}
