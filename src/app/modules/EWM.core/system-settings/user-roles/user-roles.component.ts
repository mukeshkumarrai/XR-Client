import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ValidateCode } from '../../../../shared/helper/commonserverside';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiesService } from '../../../../shared/services/common-servies.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';
import { ResponceData } from 'src/app/shared/models';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  providers: [MessageService],
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class UserRolesComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  status: boolean = false;
  submitted = false;
  loading: boolean;
  loadingscroll: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  private rtl = false;
  private ltr = true;
  public gridData: any[];
  public isNew = false;
  public gridView: any[];
  public type: 'numeric' | 'input' = 'numeric';
  public info = true;
  public buttonCount = 5;
  public mySelection: string[] = [];
  public formtitle: string = 'grid';
  public active = false;
  addUserRoleForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  viewMode: string = "listMode";
  //public activestatus: string;
  activestatus: string = 'Add';
  roleId: any[];
  result: string = '';
  public deletestatus: boolean;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  modalOpen = false;
  // Checkers
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "Is_system_defined,desc";
  public sortedcolumnName: string = 'Is_system_defined';
  public sortDirection = 'desc';
  public maxCharacterLength = 50;
  public maxCharacterLengthName = 30;
  isvisible: boolean;
  searchVal: string;
  public maxSubHeadCharacterLengthName = 250;
  isPermission: boolean = false;
  permissionforRole: string;
  Menudata=[];
@ViewChild('curtain') divCurtain: ElementRef;
  scrolposistion: any;
  totalDataCount: any;
  isCollaps: any;
  allchecked: any=false;
  addPermissionForm: any;
  auditParameter: string;
  isViewMode: boolean;
  next: number = 0;
  listDataview: any[] = []; 
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
 public loadingSearch: boolean;
 public isCardMode:boolean = false;
 public isListMode:boolean = true;

 searchSubject$ = new Subject<any>();
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-483
  @What: constructor for injecting services and formbuilder and other dependency injections
  */

  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public elementRef: ElementRef, private appSettingsService: AppSettingsService, private translateService: TranslateService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    this.addUserRoleForm = this.fb.group({
      RoleCode: [''],
      CloneFrom:[],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),
      Validators.pattern(this.specialcharPattern)]],
      Description: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      Is_system_defined:[0]
    });
    this.addPermissionForm=this.fb.group({
      RoleCode:[''],
      Menus:[]}); 
      this.auditParameter = encodeURIComponent('User Role');
  }

  ngOnInit(): void {

    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.searchVal = '';
    this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
     this.animationVar = ButtonTypes;

     this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {   // put this code in ngOnIt section 
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd1, this.search, res);

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


  /* 
  @Type: File, <ts>
  @Name: openForm function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-483
  @What: FOR opening the form on button click event
  */
  public openForm(formType, id,isView:boolean) {
    this.formtitle = formType;
    this.active = true;
    this.roleId = this.gridData.filter(x => x['Id'] == id);
  }

  /* 
  @Type: File, <ts>
  @Name: onCancel function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-483
  @What: FOR closing the form on button click event
  */

  public onCancel(e): void {
    this.formtitle = 'grid';
    this.active = true;
    this.addUserRoleForm.reset();
    this.activestatus = 'Add';
  }
  /* 
  @Type: File, <ts>
  @Name: closeForm function
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-483
  @What: FOR closing the form on button click event
  */
  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }

 
 
  /* 
    @Type: File, <ts>
    @Name: userRoleList function
    @Who: Renu
    @When: 25-Nov-2020
    @Why: ROST-405
    @What: service call for get list for user role data
    */

  userRoleList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.systemSettingService.fetchuserRoleList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.animate();
          this.loading = false;
           /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount=repsonsedata['TotalRecord'];
          this.gridView = repsonsedata['Data'];
          this.gridData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }

  /* 
  @Type: File, <ts>
  @Name: onFilter function
  @Who: Renu
  @When: 24-dEC-2020
  @Why: ROST-485
  @What: use for filter/search data
  @modified by: priti
  @When:24-may-2021
   */
  public onFilter(inputValue: string): void {
    this.loading = false;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);  
 
  }

  getFilterValue(inputValue){
    this.systemSettingService.fetchuserRoleList(this.pagesize, this.pagneNo, this.sortingValue, inputValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata['Data'];
          this.gridData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      });
  }
  /**
     @(C): Entire Software
     @Type: Function
     @Who: Satya Prakash
     @When: 15-Dec-2020
     @Why:  Switch mode List and card
     @What: This function responsible to change list and card view
    */

  // switchListMode(viewMode) {
  //   let listHeader = document.getElementById("listHeader");
  //   if (viewMode === 'cardMode') {
  //     this.maxCharacterLength = 80;
  //     this.maxCharacterLengthName = 40;
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //     // listHeader.classList.add("hide");
  //   } else {
  //     this.maxCharacterLength = 50;
  //     this.maxCharacterLengthName = 30;
  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     this.animate();
  //     // listHeader.classList.remove("hide");
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
  /* 
   @Type: File, <ts>
   @Name: userRoleDelete function 
   @Who: Nitin Bhati
   @When: 26-Nov-2020
   @Why: ROST-428
   @What: call Api for delete record using ID.
 */
  userRoleDelete(val,index): void {
    this.pagneNo = 1;
    const message = `label_titleDialogContent`;
    const title = '';
    const subtitle = 'label_userRole';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated','animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        this.systemSettingService.deleteRoleById(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
              this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
              this.listDataview.splice(index, 1);
              this.addUserRoleForm.reset();
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            }
            this.cancel.emit();
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
           
          })
      } else {
        //this.snackBService.showErrorSnackBar("Cancelled the request", this.result);
      }
    });
  }


  /* 
  @Type: File, <ts>
  @Name: userRoleListScroll function
  @Who: Renu
  @When: 30-Dec-2020
  @Why: ROST-485
  @What: used to append list data whenever user scrolldown
  */

  userRoleListScroll(pagesize, pagneNo, sortingValue) {
    //this.loadingscroll = true;
    this.systemSettingService.fetchuserRoleList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridData = this.gridData.concat(nextgridView);
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingscroll = false;
      })
  }


  /* 
 @Type: File, <ts>
 @Name: onScrollDown function
 @Who: Renu
 @When: 30-Dec-2020
 @Why: ROST-485
 @What: for pagination whenever user scroll down
 */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      /*  @Who: Bantee @When: 15-May-2023 @Why: EWM-11658*/
        /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
        if(this.totalDataCount>this.gridData.length){
      this.pagneNo = this.pagneNo + 1;
      this.userRoleListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      // this.reloadListData();
      //     this.doNext();
    } else {
      
      this.loadingscroll = false;
    }
    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }

  /*
  @Type: File, <ts>
  @Name: onSort function
  @Who: Renu
  @When: 15-Dec-2020
  @Why: ROST-488
  @What: This function is used for sorting asc /desc based on column Clicked
  */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this.systemSettingService.fetchuserRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          document.getElementById('contentdata').scrollTo(0, 0);//EWM-1325
          this.loading = false;
          this.gridData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
 
/*
@Type: File, <ts>
  @Name: openPermissionForm function
  @Who: Priti
  @When: 21-March-2021
  @Why: EWM-1124
  @What: This function is used for open permission form
*/
  openPermissionForm(roleName: string,roleCode:string) {
    this.isPermission = true;
    this.permissionforRole = roleName;
    this.addPermissionForm.patchValue({RoleCode:roleCode});
    this.getRolePermission(roleCode);
  }
  /*
@Type: File, <ts>
  @Name: cancelPermission function
  @Who: Priti
  @When: 22-March-2021
  @Why: EWM-1124
  @What: This function is used for close permission form
*/
  cancelPermission(){
    this.isPermission = false;
    this.permissionforRole = "";
  }
   /*
@Type: File, <ts>
  @Name: cancelPermission function
  @Who: Priti
  @When: 22-March-2021
  @Why: EWM-1124
  @What: This function is used for open/close all accordian 
*/

toggleAccordian()
{
  if(this.isCollaps)
  {
    this.isCollaps=false;
  }
  else{
    this.isCollaps=true;
  }
  this.Menudata.forEach(t=>{t.isCollapse=this.isCollaps;
    t.Children.forEach((tc:any) =>{ tc.isCollapse = this.isCollaps;
    tc.Children.forEach((tch:any) =>{ tch.isCollapse = this.isCollaps})
    });
  });
}

 // RolePermission/get-role-permissions-by-roleid
    /*
@Type: File, <ts>
  @Name: cancelPermission function
  @Who: Priti
  @When: 23-March-2021
  @Why: EWM-1124
  @What: This function is used for get data of permission(s) by role  from services 
  
*/
  getRolePermission(roleId:string){
    this.systemSettingService.getRolePermission('?RoleCode=' + roleId).subscribe(
      (responsedata:any) => {
        if(responsedata.HttpStatusCode==200 && responsedata.Data!=null){
          this.Menudata=responsedata.Data;
        }
  
      });
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
      this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
      this.formtitle='grid';
    }
    /*
    @Type: File, <ts>
    @Who: priti
    @When: 17-May-2021
    @Why: EWM-1470
  */

    checkAll(checked:boolean)
    {
      this.Menudata.forEach(t=>{t.IsChecked=checked;
        t.IsIntermediate=false;
        t.Children.forEach((tc:any) =>{ tc.IsChecked = checked;
          tc.IsIntermediate=false;
        tc.Children.forEach((tch:any) =>{ tch.IsChecked = checked;
          tch.IsIntermediate=false;})
        });
      });
    }
     /*
    @Type: File, <ts>
    @Who: priti
    @When: 17-May-2021
    @Why: EWM-1470
  */
    somechecked(): boolean {
      if (this.Menudata==undefined || this.Menudata .length == 0) {
        return false;
      }
      this.allchecked=this.Menudata.length > 0 && this.Menudata.every((t)=> t.IsChecked );
      return (this.Menudata.filter((t:any) => t.IsChecked).length > 0 ||this.Menudata.filter((t:any) => t.IsIntermediate).length > 0) && !this.allchecked;
    }
     /*
    @Type: File, <ts>
    @Who: priti
    @When: 17-May-2021
    @Why: EWM-1470
  */
    updatedata(data)
    {
    this.Menudata.find(item => item.Id == data.Id).IsChecked = data.IsChecked;
    this.Menudata.find(item => item.Id == data.Id).IsIntermediate = (data.Children.filter((t:any) => t.IsChecked).length > 0||data.Children.filter((t:any) => t.IsIntermediate).length > 0);
    
    }
    /*
    @Type: File, <ts>
    @Who: priti
    @When: 19-May-2021
    @Why: EWM-1468
  */
    onSavePermission()
   {
     let selectedmenu;
   let menuList=[];
     this.Menudata.forEach(t=>{ if(t.IsChecked)
       {
         selectedmenu= {
         MenuID: t.Id };
         menuList.push(selectedmenu);
       t.Children.forEach((tc:any) =>{ selectedmenu= {
         MenuID: tc.Id };
         menuList.push(selectedmenu);
       tc.Children.forEach((tch:any) =>{  selectedmenu= {
         MenuID: tch.Id } ;
         menuList.push(selectedmenu);})
       });
     }else if(t.IsIntermediate){
       selectedmenu= {
         MenuID: t.Id };
         menuList.push(selectedmenu);
       t.Children.forEach((tc:any) =>{
         if(tc.IsChecked){
         selectedmenu= {
         MenuID: tc.Id };
         menuList.push(selectedmenu);
       tc.Children.forEach((tch:any) =>{  selectedmenu= {
         MenuID: tch.Id } ;
         menuList.push(selectedmenu);})
       }
       else if(tc.IsIntermediate)
       {
         selectedmenu= {
           MenuID: tc.Id };
           menuList.push(selectedmenu);
         tc.Children.forEach((tch:any) =>{ 
           if(tch.IsChecked){
           selectedmenu= {
           MenuID: tch.Id } ;
           menuList.push(selectedmenu);
         }
       });
       }
       });
     }
     });
    this.addPermissionForm.patchValue({Menus:menuList}); 
    this.loading = true;
    this.systemSettingService.saveRolePermission(JSON.stringify(this.addPermissionForm.value)).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
          this.userRoleList(this.pagesize,this.pagneNo,this.sortingValue,this.searchVal);
          this.isPermission = false;
          this.addPermissionForm.reset();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
   }
 
   /*
    @Who: priti
    @When: 19-May-2021
    @Why: EWM-1468
  */
   userRoleCopy(items:any)
   {
     this.addUserRoleForm.enable();
    this.formtitle = 'Add';
    this.active = true;
    this.addUserRoleForm.patchValue({
      'CloneFrom':items.RoleCode,
      'Name': items.Name,
      'Description': items.Description
    })
    this.activestatus = 'Add';
   }

  //  reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // } 
  //  doNext() {
  //    if (this.next < this.gridData.length) {
  //     this.listDataview.push(this.gridData[this.next++]);
  //   }
  // }

// refresh button onclick method by Adarsh Singh
  refreshComponent(){
    this.pagneNo = 1;
    this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
  }
/*
@Name: onFilterClear function
@Who: Adarsh singh
@When: 18-july-22
@Why: EWM-5982 
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.pagneNo = 1;
  this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
 }
}