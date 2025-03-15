/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Priti Srivastava
    @When: 2-june-2021
    @Why: EWM-1640
    @What:  This page wil be use only for the user invitation detail
 */
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { TranslateService } from '@ngx-translate/core';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ContactReceipentPopupComponent } from '../../../shared/contact-receipent-popup/contact-receipent-popup.component';

@Component({
  selector: 'app-user-invitation-details',
  templateUrl: './user-invitation-details.component.html', 
  styleUrls: ['./user-invitation-details.component.scss']
})
export class UserInvitationDetailsComponent implements OnInit {
  loading: boolean;
  @ViewChild('utypeSelect') utypeSelect;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  private rtl = false;
  private ltr = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  UserInviteDetailsForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON, SPACE];
  //userEmail: UserEmails[] = [];
  public emailList = [];
  public userRoles: any[];
  public userTypes: any[];
  public accessLevels: any[];
  public userInviteArray = {};
  loadingscroll: boolean;
  public userInviteDetailsEmailID: string;
  public maxCharacterLengthSubHead = 130;
  public userpreferences: Userpreferences;
  tabActive:string='people';
  LastSignIn:any=0;
  username: any;
  fromEmailList=[];
  isViewMode: boolean=true;
  userLocation: any='Noida';
  imgPreview: any='';
  viewMode: any;
  UserType: any;
  constructor(private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private rtlLtrService: RtlLtrService,private routes: ActivatedRoute,
    public elementRef: ElementRef, private _formGroup: FormBuilder,
    public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService) {
      this.UserInviteDetailsForm = this._formGroup.group({
        Id:0,
        ddlRoleDetails: [[], [Validators.required]],
        ddlAccessLevelDetail: [[], [Validators.required]],
        ddlPeopleDetail: [[], [Validators.required]],
        siteAccessDetail: [true],
        eMail: [''],
        project:[],
        group:[]
      }); }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
      URL_AS_LIST = URL.split('/');
     }else
     {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
     }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.routes.queryParams.subscribe((params) => {
      if(Object.keys(params).length!=0){
       this.viewMode = params['mode'];
       this.tabActive=params['tab'];
       this.isViewMode=params['v']=="true"?true:false;
      }
     });
    this.getRolesList();
    this.getUserTypeList();
    this.getAccessLevelList();
    if(this.routes.snapshot.params.id!=null){
    this.editForm(this.routes.snapshot.params.id);}
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    
  }
  getRolesList() {
    this.systemSettingService.fetchuUserInvitationRoleList().subscribe(
      repsonsedata => {
        this.userRoles = repsonsedata['Data'];
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  getUserTypeList() {
    this.systemSettingService.fetchuUserInvitationUserTypeList(this.tabActive).subscribe(
      repsonsedata => {
        this.userTypes = repsonsedata['Data'];
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  getAccessLevelList() {
    this.systemSettingService.fetchuUserInvitationAccessLevelList().subscribe(
      repsonsedata => {
        this.accessLevels = repsonsedata['Data'];
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  public onCancelShow(): void {
    this.UserInviteDetailsForm.reset();
    this.route.navigate(['./client/core/user-management/user-invitation'] ,
    {queryParams: {mode: this.viewMode,tab:this.tabActive}});
  }
  editForm(id) {
    this.loading = true;
    this.systemSettingService.getUserInviteByID('?Id=' + id).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == 200) {
          this.userInviteDetailsEmailID = repsonsedata['Data'].Email;
          this.username=repsonsedata['Data'].UserName;
          this.UserInviteDetailsForm.patchValue({
            Id:parseInt(id) ,
            ddlRoleDetails: repsonsedata['Data'].RoleCode,
            ddlAccessLevelDetail: repsonsedata['Data'].AccessLevelId,
            siteAccessDetail: parseInt(repsonsedata['Data'].SiteAccess) == 1 ? true : false,
            eMail: repsonsedata['Data'].Email,
            ddlPeopleDetail:repsonsedata['Data'].UserTypeCode,
            project:repsonsedata['Data'].ProjectName,
            group:repsonsedata['Data'].GroupName,
          });
          this.LastSignIn=repsonsedata['Data'].LastSignIn;
          this.userLocation=repsonsedata['Data'].Location;
          this.imgPreview=repsonsedata['Data'].PreviewUrl;
          this.UserType=repsonsedata['Data'].PopleType;
          if(this.isViewMode)
          {
            this.UserInviteDetailsForm.disable();
          }
          else{this.UserInviteDetailsForm.enable();
            this.ddlPeopleChange(repsonsedata['Data'].UserTypeCode)
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }
  ddlPeopleChange(peopleType){
      
    if(peopleType=='CONT')
    {
      this.UserInviteDetailsForm.controls['ddlRoleDetails'].disable();
    }
    else{
      this.UserInviteDetailsForm.controls['ddlRoleDetails'].enable();
    }
    }

    onUpdate(value)
    
    
{
  this.loading=true;
  let userData={
    Id: value.Id,
    UserTypeCode:value.ddlPeopleDetail,
    SiteAccessLevelId:value.ddlAccessLevelDetail,
    
    RoleCode: this.UserInviteDetailsForm.controls['ddlRoleDetails'].value,
    IsSiteAccess: value.siteAccessDetail?1:0
  }

  this.systemSettingService.updateUserInvitation(userData).subscribe(
    (res:ResponceData)=> 
    {
      
      if(res.HttpStatusCode==200)
      {
        this.snackBService.showSuccessSnackBar(this.translateService.instant(res.Message), res.HttpStatusCode.toString());
        this.loading=false;
        this.onCancelShow();
      }
      else
      {
        this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(res.Message), res.HttpStatusCode.toString());
        
      }
   },err=>
   {
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    this.loading=false;
   }
   );
}
}
