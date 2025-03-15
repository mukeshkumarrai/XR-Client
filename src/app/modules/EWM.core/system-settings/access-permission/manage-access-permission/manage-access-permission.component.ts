import { Component, OnInit } from '@angular/core';
import { ResponceData } from 'src/app/shared/models';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-manage-access-permission',
  templateUrl: './manage-access-permission.component.html',
  styleUrls: ['./manage-access-permission.component.scss']
})
export class ManageAccessPermissionComponent implements OnInit {

  public accessData: any = [];
  public isvisible: boolean;
  public viewMode: string;
  public userpreferences: Userpreferences;
  public loadingscroll: boolean;
  public loading: boolean;
  statusId: number;
  statusname: string;
  
  public sortedcolumnName: string = 'UserTypeName';
  public pageLabel: any = "Access Permission";
  public formtitle: string = 'grid';
   pageOption: any;
   animationState = false;
   dirctionalLang;
  checkedViewId: number;
  viewStatus: boolean=true;
  constructor(private _systemSettingService:SystemSettingService,public _userpreferencesService: UserpreferencesService,
    private snackBService: SnackBarService,private translateService: TranslateService,public dialog: MatDialog,private route: Router) {}
  
  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getAccessPermissionType();
  }
  
   /* 
    @Type: File, <ts>
    @Name: animate delaAnimation function
    @Who: Amit Rajput
    @When: 19-Jan-2022
    @Why: EWM-4368 EWM-4526
    @What: creating animation
  */
  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }
  delaAnimation(i:number){
    if(i<=25){
      return 0+i*80;
    }
    else{
      return 0;
    }
  }
   /* 
    @Type: File, <ts>
    @Name: getAccessPermissionType function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What: Access permission Type
  */
  getAccessPermissionType(){
    this.loading = true;
    this._systemSettingService.getAccessPermissionType().subscribe(
      (repsonsedata:ResponceData) =>{
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          if(repsonsedata.Data){
            this.accessData = repsonsedata.Data;
          }
        }else{
          this.loadingscroll = false;
          this.loading = false;
        }
      },
      err =>{
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       }
    )
  }
 /* 
    @Type: File, <ts>
    @Name: getAccessPermissionType function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What: checkbox for View
  */
  checkboxView(event,i,accessPermissionData){
     if(accessPermissionData.Edit===1 || accessPermissionData.Delete===1){
      this.viewStatus=true;
      this.checkedViewId=0;
      const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
      this.accessData[index].View = 0;
       this.alertValidationManageAccess(event,i,accessPermissionData);
    }else{
      let checkedViewId=event.checked===true?1:0;
      const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
      this.accessData[index].View = checkedViewId;
    }
    this.viewStatus=false;   
  }
  /* 
    @Type: File, <ts>
    @Name: checkboxEdit function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What: Checkbox for Edit
  */
  checkboxEdit(data:any,i,accessPermissionData){
    let checkedViewId=data===true?1:0;
    if(data===true){
      const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
      this.accessData[index].Edit = checkedViewId;
      this.accessData[index].View = 1;
      this.viewStatus=false;
    }else{
      const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
      this.accessData[index].Edit = checkedViewId;
      //this.accessData[index].View = 1;
      this.viewStatus=false;
    }
   
  }
   /* 
    @Type: File, <ts>
    @Name: checkboxDelete function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What: Check box delete 
  */
  checkboxDelete(data:any,i,accessPermissionData){
     let checkedViewId=data===true?1:0;
    if(data===true){
      const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
      this.accessData[index].Delete = checkedViewId;
      this.accessData[index].View = 1;
      this.accessData[index].Edit = 1;
      this.viewStatus=false;
    }else{ 
    const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
   this.accessData[index].Delete = checkedViewId;
   //this.accessData[index].View = 1;
   this.viewStatus=false;
    }
    
  }
 /* 
    @Type: File, <ts>
    @Name: alertValidationManageAccess function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What: For Alert validation message
  */
  public alertValidationManageAccess(data,i,accessPermissionData){
    const message = `label_titleDialogContentAlert`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData, isButtonShow: true},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
    dialogRef.afterClosed().subscribe(res => {
      
      this.viewStatus=false;
      this.checkedViewId=0;
      const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
      this.accessData[index].View = 0;
      this.checkboxViewPopup(data,i,accessPermissionData);
    })
  }
 /* 
    @Type: File, <ts>
    @Name: onSave function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What:For saving data
  */
  onSave(){
    this.loading = true;
    this._systemSettingService.updateAccess(this.accessData).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         this.route.navigate(['./client/core/administrators/access-permission'], { queryParams: { V: this.viewMode } });
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  /* 
    @Type: File, <ts>
    @Name: checkboxViewPopup function
    @Who: Nitin Bhati
    @When: 06-Jan-2022
    @Why: EWM-6873 EWM-7056
    @What: checkbox for View
  */
    checkboxViewPopup(event,i,accessPermissionData){
      //let checkedViewId=event.checked===true?1:0;
       const index = this.accessData.findIndex(x => x.Id == accessPermissionData.Id);
       this.accessData[index].View = 1;
       this.viewStatus=false;  
   }
  
  }


  