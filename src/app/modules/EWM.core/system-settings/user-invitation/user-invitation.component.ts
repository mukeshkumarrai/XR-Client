import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { MatDialog} from '@angular/material/dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { LockUserInvitedData } from 'src/app/shared/models/lockusersInvited';


import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export interface UserEmails {
  email: string;
}
enum EmployeeTag{
 'Normal user/employee',
 'Admin',
 'Super Admin'
 }
 enum Tab{
  'people',
   'client',
   'supplier'
   }
@Component({
  providers: [MessageService],
  selector: 'app-user-invitation',
  templateUrl: './user-invitation.component.html',
  styleUrls: ['./user-invitation.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class UserInvitationComponent implements OnInit {
 
  loading: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('utypeSelect') utypeSelect;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  private rtl = false;
  private ltr = true;
  viewMode: string = "listMode";
  ListFilterForm: FormGroup;
  userEmail: UserEmails[] = [];
  public userRoles: any[];
  public userTypes: any[];
  public accessLevels: any[];
  public userInviteArray = {};
  public searchValue: string = '';
  pagesize;
  pagneNo = 1;
  sortingValue: string = "Email,asc";
  roleType = '';
  userListType = '';
  public gridViewClient: any[];
  public gridViewSupplier: any[];
  public gridData: any[];
  public sortedcolumnName: string = 'Email';
  public sortDirection = 'asc';
  public ascIcon: string;
  public descIcon: string;
  loadingscroll: boolean;
  canLoad = false;
  pendingLoad = false;
  public maxCharacterLengthSubHead = 130;
  public userpreferences: Userpreferences;
  totalDataCount: any;
  tabActive:string='people';
  totalClientDataCount: any;
  totalSupplierDataCount: any;
  eEmployeeType=EmployeeTag;
  auditParameter: string;
  selectedTabIndex: any=0;
  revokeAccessBtn: boolean=false;
  client:any;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  loadingSearch:boolean = false;
  searchSubject$ = new Subject<any>();  
  UserId: string;
  public lockUserList: any[];
  userTypeValue:number;
  OrganizationName:string;
  SubDomainName:string;
  constructor(  private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private textChangeLngService:TextChangeLngService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public elementRef: ElementRef, private _formGroup: FormBuilder, private routes: ActivatedRoute,
    private appSettingsService: AppSettingsService,
    public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;

    this.ListFilterForm = this._formGroup.group({
      ddlListAccessLevel: [[]],
      ddlListRoles: [[]]
    });
    let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'));//by maneesh what:16918 when:02/05/2024
    this.userTypeValue=currentUserDetails?.UserType;
  }

  ngOnInit(): void {
   

    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
      URL_AS_LIST = URL.split('/');
     }else
     {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
     }

     /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.getRolesList();
    this.getUserTypeList();
    this.getAccessLevelList();
    this.auditParameter='Users'
    this.ListFilterForm.patchValue({
      'ddlListAccessLevel': [],
      'ddlListRoles': []
    });
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.routes.queryParams.subscribe((params) => {
     if(Object.keys(params).length!=0){
      this.viewMode = params['mode'];
      this.tabActive=params['tab'];
      this.selectedTabIndex=Tab[this.tabActive];
     }
    });
    this.switchListMode(this.viewMode);
    this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive);
   // this.sortedcolumnName = 'A.email';
    this.ascIcon = 'north';
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    });
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;

        // @suika @EWM-14427 @Whn 27-09-2023
        this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
          this.loading = true;
           this.sendRequest(val);
           });
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      // this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd1, this.search, res);
    })
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

mouseoverAnimation(matIconId, animationName) {
  let amin= localStorage.getItem('animation');
  if(Number(amin) !=0){
    document.getElementById(matIconId).classList.add(animationName);
  }
}
mouseleaveAnimation(matIconId, animationName) {
  document.getElementById(matIconId).classList.remove(animationName)
}

  // private validateArrayNotEmpty(c: FormControl) {
  //   if (c.value && c.value.length === 0) {
  //     return {
  //       validateArrayNotEmpty: { valid: false }
  //     };
  //   }
  //   return null;
  // }
  isvisible: boolean;
  // switchListMode(viewMode) {
  //   let listHeader = document.getElementById("listHeader");
  //   if (viewMode === 'cardMode') {
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //   } else {
  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     this.animate();
  //   }
  // }

  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
       //listHeader.classList.remove("hide");
     }
   }

  

  public openForm(formType, id,isView:boolean) {
    if (formType === 'Details') {
      this.route.navigate(['./client/core/user-management/user-invitation/user-invitationmanage/' + id],
      {queryParams: {mode: this.viewMode,tab:this.tabActive,v:isView}});
    }
    else {
      this.route.navigate(['./client/core/user-management/user-invitation/user-invite'],
      {queryParams: {mode: this.viewMode,tab:this.tabActive}});
    }
    
  }

 
 

  getRolesList() {
    this.systemSettingService.fetchuUserInvitationRoleList().subscribe(
      repsonsedata => {
        this.userRoles = repsonsedata['Data'];
        this.ListFilterForm.patchValue({
          'ddlListAccessLevel': [],
          'ddlListRoles': []
        });
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


  // getSelectedAccessLevel(AccLevel) {
  //   if (parseInt(AccLevel) > 0) {
  //     this.UserInviteForm.patchValue({
  //       'ddlAccessLevel': AccLevel
  //     });
  //   }
  //   else {
  //     this.UserInviteForm.get("ddlAccessLevel").setErrors({ required: true });
  //     this.UserInviteForm.get("ddlAccessLevel").markAsDirty();
  //   }
  // }

  // getSelectedUserRole(uRole) {
  //   if (parseInt(uRole) > 0) {
  //     this.UserInviteForm.patchValue({
  //       'ddlRoles': uRole
  //     });
  //   }
  //   else {
  //     this.UserInviteForm.get("ddlRoles").setErrors({ required: true });
  //     this.UserInviteForm.get("ddlRoles").markAsDirty();
  //   }
  // }

  getSelectedUserListType(uType) {
    if(uType.length=='0')
    this.userListType='';
    else{
      this.userListType=''
      uType.forEach(element => {
        this.userListType =this.userListType===''?element.Id:this.userListType+','+element.Id;
      });
   
    }
    this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive);
  }

  getSelectedUserRoleList(uRole) {
    if(uRole.length=='0')
    this.roleType='';
    else
    {
      this.roleType=''
      uRole.forEach(element => {
        this.roleType =this.roleType===''?element.RoleCode:this.roleType+','+element.RoleCode;
      });
    }
    this.revokeAccessBtn=false;
    this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive);
  }


  userInviteList(pagesize, pagneNo, sortingValue, searchVal, uType, uRole,recordFor:string) {
    this.loading = true;
    if(this.revokeAccessBtn==true){
      this.loading = false;
    }else{
      this.loading = true;
    }
   
    this.systemSettingService.fetchUserInviteList(pagesize, pagneNo, sortingValue, searchVal, uType, uRole,recordFor).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.animate();
          this.loading = false;
          if(this.tabActive=='people'){
          this.totalDataCount=repsonsedata['TotalRecord'];
          this.gridData = repsonsedata['Data'];
          }
          else if(this.tabActive=='client'){
          this.gridViewClient = repsonsedata['Data'];
          this.totalClientDataCount=repsonsedata['TotalRecord'];
        }
         else{ this.gridViewSupplier = repsonsedata['Data'];
         this.totalSupplierDataCount=repsonsedata['TotalRecord'];}
        }
          else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
  }

  // @suika @EWM-14427 @Whn 27-09-2023
public onFilter(inputValue: string): void {
  this.searchValue = inputValue;
  if (inputValue?.length > 0 && inputValue?.length <= 2) {
    this.loading = false;
    return;
  }
  this.searchSubject$.next(inputValue);
}

  public sendRequest(inputValue: string): void {
    this.pagneNo = 1;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.loadingSearch = true;
    this.systemSettingService.fetchUserInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loadingSearch = false;
          this.loading = false;
          if(this.tabActive=='people'){
            this.totalDataCount=repsonsedata['TotalRecord'];
            this.gridData = repsonsedata['Data'];
            }
            else if(this.tabActive=='client'){
            this.gridViewClient = repsonsedata['Data'];
            this.totalClientDataCount=repsonsedata['TotalRecord'];
          }
           else{ this.gridViewSupplier = repsonsedata['Data'];
           this.totalSupplierDataCount=repsonsedata['TotalRecord'];}
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        
      })
  }

  onSort(columnName) {
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this.revokeAccessBtn=false;
    this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive);
  }

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'TD') {
      if (parseInt(element.getAttribute('ng-reflect-col-index')) < 2) {
        this.tooltipDir.toggle(element);
      }
      else {
        this.tooltipDir.hide();
      }
    } else {
      this.tooltipDir.hide();
    }
  }

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
       /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
    if(this.totalDataCount>this.gridData.length){
      this.pagneNo = this.pagneNo + 1;
      this.userInviteListScroll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType);
    }else {
      this.loadingscroll = false;
    }
   } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }

  userInviteListScroll(pagesize, pagneNo, sortingValue, searchValue, uType, uRole) {
    //this.loadingscroll = true;
    this.systemSettingService.fetchUserInviteList(pagesize, pagneNo, sortingValue, searchValue, uType, uRole,this.tabActive).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];  
          if(this.tabActive=='people'){
            this.gridData = this.gridData.concat(nextgridView);
            }
            else if(this.tabActive=='client'){
            this.gridViewClient = this.gridViewClient.concat(nextgridView);
          }
           else{ this.gridViewSupplier = this.gridViewSupplier.concat(nextgridView);
          }
          
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loadingscroll = false;
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }
  /*
      @Type: File, <ts>
      @Name: reloadApiBasedOnorg function
      @Who: Renu
      @When: 13-Apr-2021
      @Why: EWM-1356
      @What: Reload Api's when user change organization
    */

  reloadApiBasedOnorg() {
    this.getRolesList();
    this.getUserTypeList();
    this.getAccessLevelList();
    this.revokeAccessBtn=false;
    this.userInviteList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.roleType,this.userListType,this.tabActive)
   // this.formtitle = 'grid';
  }
  /*
   @Name: tab clicked function
      @Who: priti srivastava
      @When: 26-may-2021
      @Why: EWM-1640
      @What: reset data as per selected tab
  */
 ActiveTab(event)
 { 
//  if(event.index==1)
//     {
//       this.tabActive='client';
//     }else if(event.index==2)
//     {
//       this.tabActive='supplier';
//     }else{
//       this.tabActive='people';
//     }
 this.tabActive=Tab[event.index]   ;
this.roleType='';
this.userListType='';
this.ListFilterForm.reset();
this.revokeAccessBtn=false;
this.userInviteList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.userListType, this.roleType,this.tabActive);
this.getUserTypeList();
          
 }


revokeAccess(ID:number,checked:boolean)
{
  let userData={Id:ID,IsSiteAccess:checked?1:0}
  this.systemSettingService.RevokeUserAccess(userData).subscribe(
    (res:ResponceData)=> 
    {
      if(res.HttpStatusCode==200)
      {
          this.revokeAccessBtn=true;
          this.userInviteList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.userListType,this.roleType,this.tabActive);
      }
      else
      {
        this.snackBService.showErrorSnackBar(this.translateService.instant(res.Message), res.HttpStatusCode.toString());
           
      }
   },err=>
   {
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
   }
   );
}

// refresh button onclick method by Adarsh Singh
refreshComponent(){
  this.userInviteList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.roleType,this.userListType,this.tabActive);
}

/*
@Name: onFilterClear function
@Who: Adarsh singh
@When: 18-july-22
@Why: EWM-5982 
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchValue='';
  this.pagneNo = 1;
  this.userInviteList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.roleType,this.userListType,this.tabActive);
 }

 //by maneesh,what:ewm-16918 when:01/05/2024
 resetUser(data:any){
  this.UserId=data;
  this.resetlockedUser(this.UserId);
}
resetlockedUser(UserId) {
  this.loading = true;
  this.systemSettingService.resetlockedUser(UserId).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {        
      this.loading = false;
      this.userInviteList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.roleType,this.userListType,this.tabActive);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode); 
      } else {
      this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
      } 

    }), err => {
      if(err.StatusCode==undefined)
      {
        this.loadingSearch=false;
      }
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loadingSearch = false;
      this.loading = false;

    }
}

UserInvite(email,UserId,UserName) {
  this.loading = true;
this.OrganizationName=localStorage.getItem('OrganizationName');
this.SubDomainName=localStorage.getItem('tenantDomain');
  let userInvite:LockUserInvitedData = {
    UserId:UserId,
    UserName:UserName,
    Email:email,
    OrganizationName:this.OrganizationName,
    SubDomainName:this.SubDomainName,
  }
 this.systemSettingService.invitedlockedUser(userInvite).subscribe(
  repsonsedata => {
    if (repsonsedata.HttpStatusCode == 200) {
      this.userInviteList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.roleType,this.userListType,this.tabActive);
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
    } else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
      this.loading = false;
      // this.isResponseGet = false;
    }
  }, err => {
    this.loading = false;
    // this.isResponseGet = false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
   
  })
}
}
