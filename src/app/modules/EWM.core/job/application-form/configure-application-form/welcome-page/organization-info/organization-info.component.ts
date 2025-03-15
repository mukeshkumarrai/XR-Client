 /*
  @Type: File, <ts>
  @Name: getSMSHistory
  @Who: Renu
  @When: 04-Oct-2022
  @Why: EWM-8902 EWM-9111
  @What: to open details for organization info
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ButtonTypes } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-organization-info',
  templateUrl: './organization-info.component.html',
  styleUrls: ['./organization-info.component.scss']
})
export class OrganizationInfoComponent implements OnInit {
  public orgInfo: any;
  public phoneArr: any;
  public emailArr: any;
  animationVar: any;
  loading: boolean = false;
  OrgId: any;
  public viewMode: string;
  OrganizationId:string;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<OrganizationInfoComponent>,
  private _userAdministrationService:UserAdministrationService,private routes: ActivatedRoute,
  private route: ActivatedRoute, private snackBService: SnackBarService, private translateService: TranslateService, private router: Router) { }

  ngOnInit(): void {
    this.orgInfo=this.data?.orgInfo?.OrganizationAddress[0];
    this.phoneArr=this.data?.orgInfo?.Phone;
    this.emailArr=this.data?.orgInfo?.Email;
    this.animationVar = ButtonTypes;
    let queryParams = this.routes.snapshot.params.id;
    this.OrganizationId = localStorage.getItem('OrganizationId')

     this.route.queryParams.subscribe((params) => {
      this.viewMode = params['viewModeData'];
    })
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
@Name: refreshComponent function
@Who: Renu
@When: 04-Oct-2022
@Why: EWM-8902 EWM-9111
@What: TO close the modal
*/
  refreshComponent(){
    this.getOrganizationInfo();
  }

  
  /*
 @Type: File, <ts>
 @Name: getOrganizationInfo
 @Who: Renu
 @When: 04-Oct-2022
 @Why: ROST-8902 EWM-9111
 @What: for organization info
 */
 getOrganizationInfo(){
  this.loading=true;
  this._userAdministrationService.getOrganizationById(localStorage.getItem('OrganizationId')).subscribe(
    (data: any) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
       this.orgInfo=data.Data?.OrganizationAddress[0];  
       this.phoneArr=data.Data?.Phone;
       this.emailArr=data.Data?.Email;
       this.OrgId=data.Data?.OrganizationAddress[0].OrgId;
       
      }
      else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
 }
  /*
@Name: onDismiss function
@Who: Renu
@When: 04-Oct-2022
@Why: EWM-8902 EWM-9111
@What: TO close the modal
*/
onDismiss()
{
  document.getElementsByClassName("xeople-modal")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("xeople-modal")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}

  /*
@Name: redirect function
@Who: maneesh
@When:16-jan-2023
@Why: EWM-8902 EWM-9571
@What: redirect to edit page oragnazation
*/
redirect(){
  let URL = 'client/core/administrators/organization-details/add-organization-details?id='+this.OrganizationId;
  window.open(URL, '_blank');
}
}
