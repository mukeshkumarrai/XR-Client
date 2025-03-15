import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ButtonTypes } from 'src/app/shared/models'; 
import { JobService } from '../../../shared/services/Job/job.service';


@Component({
  selector: 'app-nike-career',
  templateUrl: './nike-career.component.html',
  styleUrls: ['./nike-career.component.scss']
})
export class NikeCareerComponent implements OnInit {
  isCareerSitetype = false;
  animationVar: any;
  @ViewChild('gdprDrawer') public sideNavGDPRDrawer: MatSidenav;
  manageCareerFormData;
  CareerPageName;
  loading = false;
  gridData = 0;
  isCareerSite;
  listId;
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService,  private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
     public dialog: MatDialog, private appSettingsService: AppSettingsService, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService) {
     // page option from config file
     

  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe(
      params => {
        if ((this.routes.snapshot.queryParams.Id != null)) {
          this.listId = params['Id'];
          this.getByIdData(this.listId);
        }
      });
    this.jobService.manageCareerPageFormData.subscribe(msg => {
      this.manageCareerFormData = msg;
      this.CareerPageName = msg?.CareerPageName;
      this.animationVar = ButtonTypes;
    });

   
  }
    /*
 @Type: File, <ts>
 @Name: openDrawerPageTemplate
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
 @What: drwaer open page 
*/
openDrawerPageTemplate() {
  this.isCareerNetwork=false;
  this.isCareerSitetype = true;
  this.sideNavGDPRDrawer.open()

}

  /*
@Type: File, <ts>
@Name: consentReqPageTempCancelBtn
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
@What: drwaer close Page template from cancel btn
*/
consentReqPageTempCancelBtn(value){
  if(value==true){
  this.isCareerSitetype = false;
  this.sideNavGDPRDrawer.close();

  if ((this.routes.snapshot.queryParams.Id != null)) {
    this.getByIdData(this.listId);
  }else{

  }
  } 
}


mouseoverAnimation(matIconId, animationName) {
  let amin= localStorage.getItem('animation');
  if(Number(amin) !=0){
    document.getElementById(matIconId).classList.add(animationName);
  }
}
mouseleaveAnimation(matIconId, animationName) {
  document.getElementById(matIconId).classList.remove(animationName)
}


  /*
  @Type: File, <ts>
  @Name: closeDrawerConsentRequest
 @Who: Adarsh Singh
 @When: 26-Feb-2022
 @Why: EWM-6224 EWM-6369
  @What: to close Drawer 
  */

 closeDrawerConsentRequest() {
  this.isCareerSitetype = false;
  this.isCareerNetwork=false;
  this.sideNavGDPRDrawer.close();
}
getByIdData(Id){
  this.loading=true;
  this.jobService.getByIdCareerPage(Id).subscribe(
    repsonsedata=>{     
      if(repsonsedata['HttpStatusCode']=='200'){
        this.loading=false;
        this.gridData = repsonsedata['Data']?.CareerSiteType;

      }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    },err=>{
       this.loading=false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
 }


   /*
@Type: File, <ts>
@Name: openNetworkDrawer
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for open network drawer
*/
 isCareerNetwork:boolean=false;
 openNetworkDrawer(){  
  this.isCareerSitetype = false;
   this.isCareerNetwork=true;
   this.sideNavGDPRDrawer.open()
 }
  
   /*
@Type: File, <ts>
@Name: careerNetworkPage
@Who: Anup Singh
@When: 5-May-2022
@Why: EWM-6220 EWM-6502
@What: for close network drawer
*/
 careerNetworkPage(value){
  if(value==true){
  this.isCareerSitetype = false;
  this.isCareerNetwork=false;
  this.sideNavGDPRDrawer.close();
  }
}



}
