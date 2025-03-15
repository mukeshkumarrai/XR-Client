/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Suika
  @When: 18-nov-2021
  @Why:EWM-3641 EWM-3840
  @What:  This page will be use for job of candidate Component ts file
*/

import { Component, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from '../../../../shared/models';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { CandidatejobmappingService } from '../../../../shared/services/candidate/candidatejobmapping.service';
import { DocumentService } from '../../../../shared/services/candidate/document.service';
import { CommonServiesService } from '../../../../shared/services/common-servies.service';
import { UserpreferencesService } from '../../../../shared/services/commonservice/userpreferences.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { AddAddressComponent } from '../../../EWM.core/shared/quick-modal/add-address/add-address.component';
import { CandidateService } from '../../../EWM.core/shared/services/candidates/candidate.service';
import { ClientService } from '../../../EWM.core/shared/services/client/client.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { JobService } from '../../shared/services/Job/job.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { IfStmt } from '@angular/compiler';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { GridComponent } from '@progress/kendo-angular-grid';
import { take } from 'rxjs/operators';
import { ButtonTypes } from 'src/app/shared/models';
import { CommonFilterDiologComponent } from '../../job/landingpage/common-filter-diolog/common-filter-diolog.component';
import { CommonFilterdilogService } from '@app/shared/services/common-filterdilog.service';
import { RouterData } from '../../../../shared/enums/router.enum';


interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

SwiperCore.use([Pagination, Navigation]);
@Component({
  selector: 'app-client-location',
  templateUrl: './client-location.component.html',
  styleUrls: ['./client-location.component.scss']
})
export class ClientLocationComponent implements OnInit {

  public loading: boolean;
  public positionMatDrawer: string = 'end';
  public isAsignJob: boolean = false;
  gridListData: any[]=[];
  public userpreferences: Userpreferences;
  public sortDirection = 'asc';
  public sortingValue: string = "LocationType,desc";
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  public sort: any[] = [{
    field: 'LocationType',
    dir: 'asc'
  }];
  public kendoLoading: boolean;
  TotalNoOfClient: number;
  public colArr: any = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective; 
  public pageSizeOptions;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public filterCount: number = 0;
  public columns: ColumnSetting[] = [];
  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  viewMode: string = 'listMode';
  @Output() assignLocationCount = new EventEmitter();
  public totalDataCount: number;
  @Input() clientIdData:any;
  public  clientId:any;
  @Input() clientName:any;
  GridId="ClientLocation_grid_001";
  public filterConfig: any;
  addCompanyForm: FormGroup;
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  emails: any = [];
  addressBarData:Address;
  activeStatus:any = 'add';
  public countryId: number;
  public CompanyLocationspopUp: any;
  public result: string = '';
  public isMultiple :boolean = false;
  public isEditDisable :boolean = false;
  public isViewDisable:boolean = false;
  public gridViewList: any = [];
  animationState = false;
  public pageSize;
  public pageNo: any;
  public searchVal: any;
  isDefault: any;
  gridData: any;
  IsDefault: any;
  dirctionalLang;
  searchSubject$ = new Subject<any>();
  animationVar: any;

// get config Adarsh EWM-11971 19APRIL2023
public filterAlert: any = 0;
public quickFilterStatus: number = 0;
@ViewChild(GridComponent) public grid: GridComponent;
public dynamicFilterArea: boolean = false;
public columnsWithAction: any[] = [];
// End 
gridColConfigStatus:boolean=false;
  constructor(private route: Router,private fb: FormBuilder,private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService,private jobService: JobService, private snackBService: SnackBarService,private clientService: ClientService, public candidateService: CandidateService,
    private ngZone: NgZone, private CommonFilterdilogsrvs :CommonFilterdilogService) {
    this.pagesize = appSettingsService.pagesize;
    this.emailPattern=this.appSettingsService.emailPattern;
    this.addCompanyForm = this.fb.group({
      orgId: ['', [Validators.required]],
      companyName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100),Validators.pattern(this.specialcharPattern)]],
      address: [[], [Validators.required,Validators.maxLength(250)]],
      industry: [],
      subIndustry: [],
      brandId: [[]],
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
      parentCompany: [],
      longitude: ['',[Validators.maxLength(50),Validators.pattern('^[-+]?[0-9]{1,7}(\.[0-9]+)?$')]],
      lattitude: ['',[Validators.maxLength(50),Validators.pattern('^[-+]?[0-9]{1,7}(\.[0-9]+)?$')]],
      temptype: [[]],
      tempStatus: [],
      reasonStatus: []  
    });
  }

  ngOnInit(): void {    
    this.getFilterConfig(false);
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.routes.queryParams.subscribe((value) => {
      if(value.clientId!=undefined && value.clientId!=null && value.clientId!=''){
       this.clientId = value.clientId;
      }
    });

    this.commonserviceService.onClientSelectId.subscribe(value => {     
      if (value !== null) {
        this.clientIdData = value;  
        this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false,false);    
      } 
    })
    // this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false,false);
  
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => { 
      this.loadingSearch = true;
      this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, val, true, false,false);
       });

       this.animationVar = ButtonTypes;

  }

/* 
@Type: File, <ts>
@Name: ngOnDestroy
@Who: Adarsh Singh
@When: 26-APRIL-2023
@Why: ROST-12059
@What: calling configuation while user has leave the page
*/
ngOnDestroy() {
  const columns = this.grid?.columns;
  if (columns) {
    const gridConfig = {
      columnsConfig: columns.toArray().map(item => {
        return Object.keys(item)
          .filter(propName => !propName.toLowerCase()
            .includes('template'))
          .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
      }),
    };
    // this.setConfiguration(gridConfig.columnsConfig);//by maneesh ewm-17806
  }
}
  /*
  @Type: File, <ts>
  @Name: openjobDetailsView
  @Who: Suika
  @When: 18-nov-2021
  @Why:EWM-3641 EWM-3840
  @What: for child component load when click job details view
 */

  openAsignJob() {
    this.isAsignJob = true
  }


  /*
@Type: File, <ts>
@Name: closeDrawerAssignJob
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
@What: to open Drawer
*/

closeDrawerAssignJob() {
    this.isAsignJob = false;
  }

/*
@Type: File, <ts>
@Name: dirChange
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
@What: for ltr and rtr
*/
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }

  /*
@Name: getCandidateListByJob function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  getCandidateListByJob(clientId: any, pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll:boolean,toggelCondition:boolean) {
    if (isSearch == true) {
      this.loading = false;
    } else if(isScroll) {
      this.loading = false;
    }else{
      this.loading = true;
    }
    let jsonObj = {};
    if (this.filterConfig !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['ClientId'] = this.clientIdData;
    this.clientService.fetchLocationMappedToClientAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            if(isScroll){
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            }else{
              this.gridListData = data.Data;
            }
            if(toggelCondition == false){
              this.assignLocationCount.emit(true);
            }else{
              this.assignLocationCount.emit(false);
            }
            // this.assignLocationCount.emit(true);
          this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
            this.loadingSearch = false;
            // this.loadingAssignJobSaved = false;
          }
          else if (data.HttpStatusCode === 204) {
            if(isScroll){
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            }else{
              this.gridListData = data.Data;
            }
            this.totalDataCount = data.TotalRecord;
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
            // this.loadingAssignJobSaved = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
            //  this.loadingAssignJobSaved = false;
          }
        }, err => {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          //  this.loadingAssignJobSaved = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }


  // @When: 27-09-2023 @who:Amit @why: EWM-14465 @what: btn animation function
  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /*
@Name: pageChange function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData.length) {
      this.pagneNo = this.pagneNo + 1;
      this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, true,false);
    } else {
      this.loadingscroll = false;
    }
  }

  /*
@Name: sortChange function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  public sortChange($event): void {
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }
    this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
  }

  /*
@Name: showTooltip function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    //console.log("show Tooltip:", e.target as HTMLElement);
    //alert("show tooltip");

    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
     // console.log("show Tooltip One:");
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        //  console.log("show Tooltip two:");
        }
        else {
          if (element.innerText == '') {
            this.tooltipDir.hide();
           // console.log("show Tooltip three:");
          } else {
          //  console.log("show Tooltip four:");
            this.tooltipDir.toggle(element);
          }
        }
      }
      else {
        this.tooltipDir.hide();
      }
    }
    else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      //  console.log("show Tooltip five:");
      }
      else {
      //  console.log("show Tooltip six:");
        this.tooltipDir.toggle(element);
      }
    }
    else {
     
      this.tooltipDir.hide();
    }
  }

  /*
@Name: switchListMode function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";

    } else {
      this.viewMode = "listMode";
    }
  }

  /*
@Name: onFilter function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  isFilter: boolean = false;
  public onFilter(inputValue: string): void {
    this.isFilter = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);
   
  }

/*
@Name: onFilterClear function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  loadingSearch: boolean;
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);

    // this.getFilterConfig();
  }

/*
@Name: fetchRefreshgetjobApi function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
  fetchRefreshgetjobApi(value) {
    if (value == true ) {
    this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true,false,false);
   this.assignLocationCount.emit(true);
  }
}


/*
@Name: sortName function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
@What: For showing shortname on image icon
*/
sortName(Name) {
  if (Name) {
    let finalNameArr = Name.split(' ').slice(0, 2);

if(finalNameArr.length>=2){
const Name = finalNameArr[0] + " " + finalNameArr[1];

    const ShortName1 = Name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
    
     let first= ShortName1.slice(0,1);
     let last=ShortName1.slice(-1);
     let ShortName = first.concat(last.toString());
     return ShortName.toUpperCase();
     
}else{
 const ShortName1 = finalNameArr[0].split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
    let singleName = ShortName1.slice(0, 1);
    return singleName.toUpperCase();

}
  }
}




/* 
  @Type: File, <ts>
  @Name: openjobDetailsView function 
  @Who: Suika
  @When: 18-nov-2021
  @Why:EWM-3641 EWM-3840
  @What: open drawer For Job Details View.
  */
isJobDetailsView:boolean=false;
JobId:any;
openjobDetailsView(jobId){
  this.isJobDetailsView = true; 
  this.JobId = jobId;
}


 /* 
  @Type: File, <ts>
  @Name: closeDrawerJobView function 
  @Who: Suika
  @When: 18-nov-2021
  @Why:EWM-3641 EWM-3840
  @What: close drawer.
  */
closeDrawerJobView(){
  this.isJobDetailsView = false; 
}

 /* 
  @Type: File, <ts>
  @Name: deleteClientLocation function 
  @Who: Suika
  @When: 22-nov-2021
  @Why:EWM-3641 EWM-3840
  @What: call Api for delete record .
  */
 deleteClientLocation(val): void {
   const message = 'label_titleDialogContent';
   const title = 'label_delete';
   const subTitle = 'candidate_location';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
     maxWidth: "355px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     if (dialogResult == true) {
       this.loading = true;
       let delObj = {};
       delObj["PageName"] = "Candidate Job",
       delObj["BtnId"] = "btnDelete";
       delObj = val;
       this.clientService.deleteClientLocation(delObj).subscribe(
         (repsonsedata:any) => {
           if (repsonsedata['HttpStatusCode'] == 200) {
             this.loading = false;
             this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
             this.pagneNo = 1;
             this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
             this.assignLocationCount.emit(true);
            } else {
              this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

         })
     } else {
       // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
     }
   });

   // RTL Code
   let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

 }


editData(Id,IsDefault){
  this.activeStatus = 'edit';
  this.isEditDisable = true;
  this.getLocationMappedToClientById(Id);
  this.IsDefault = IsDefault
}


addData(){
  this.activeStatus = 'add'; 
  this.addAddress();
}


viewData(Id){
  this.activeStatus = 'view';
  this.isViewDisable = true;
  this.getLocationMappedToClientById(Id);
}

  /*
@Name: getLocationMappedToClientById function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
getLocationMappedToClientById(Id: any) {   
    this.clientService.fetchLocationMappedToClientById("?Id="+Id)
      .subscribe(
        (data: any) => {
          if (data.HttpStatusCode === 200) {
            this.addressBarData = data.Data;
            this.emails = data.Data.Emails;  
            this.isEditDisable = false; 
            this.isViewDisable = false;       
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
            this.addAddress();
          }
          else if (data.HttpStatusCode === 204) {
          
          this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
            this.loadingSearch = false;
            // this.loadingAssignJobSaved = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
            //  this.loadingAssignJobSaved = false;
          }
        }, err => {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          //  this.loadingAssignJobSaved = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }




addAddress() {
  const dialogRef = this.dialog.open(AddAddressComponent, {
    maxWidth: "750px",
    width:"90%",
    data: new Object({ addressmul: this.addCompanyForm.get('addressmul'), emailsChip: this.emails, addressBarData: this.addressBarData, countryId: this.countryId,mode:this.activeStatus,isMultiple:this.isMultiple,clientName:this.clientName,IsDefault:this.IsDefault  }),
    panelClass: ['quick-modalbox', , 'add_address', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    
  });
  dialogRef.afterClosed().subscribe(res => {
    if(res.data!=undefined || res.data!=null){
      this.addCompanyForm.patchValue({ address:res.data.AddressLinkToMap});
      this.addCompanyForm.patchValue({ lattitude: res.data.Latitude });
      this.addCompanyForm.patchValue({ longitude: res.data.Longitude });
    this.CompanyLocationspopUp=[res.data];     
    if(this.activeStatus=='edit'){
      this.updateClientLocation(res.data);
    }else{
      this.createClientLocation(res.data);
    }
    }
  })

  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }	 

 }


/*
@Type: File, <ts>
@Name: createClientLocation function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

createClientLocation(resLocation) {
  this.loading = true;
  let jsonObj = {}; 
  const router = RouterData.clientSummery;
  const baseUrl = window.location.origin;
  resLocation['GridId'] = this.GridId;
  resLocation['ClientId'] = this.clientIdData;
  resLocation['ClientName'] = this.clientName;
  resLocation['ShareClientURL'] =baseUrl+router;
  jsonObj = resLocation; 
  this.clientService.createClientLocation(jsonObj).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
         this.loading = false;       
      } else if (repsonsedata.HttpStatusCode === 204) {       
        this.loading = false;       
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}



/*
@Type: File, <ts>
@Name: updateClientLocation function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

updateClientLocation(resLocation) {
  this.loading = true;
  let updateObj = [];
  let toObj = {}; 
  let fromObj = {};
  fromObj = this.addressBarData;
  //resLocation['GridId'] = this.GridId;
  resLocation['ClientId'] = this.clientIdData; 
  resLocation['Id'] = this.addressBarData['Id'];  
  toObj = resLocation;
  updateObj = [{
    "From": fromObj,
    "To": toObj
  }];
  this.clientService.updateClientLocation(updateObj[0]).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
        this.loading = false;       
      } else if (repsonsedata.HttpStatusCode === 204) {       
        this.loading = false;       
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

 
  /*
   @Type: File, <ts>
   @Name: createphone
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: when user click on add to create form group with same formcontrol
   */

  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName:[]
    });
  }


    /*
   @Type: File, <ts>
   @Name: createemail
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: when user click on add to create form group with same formcontrol
   */
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [ RxwebValidators.unique()]]
    });
  }


   /*
 @Type: File, <ts>
 @Name: openFilterModalDialog function
 @Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
 @What: For opening filter  dialog box
  */

 openFilterModalDialog() {
  //by maneesh fixed new CommonFilterDiologComponent stop calling api 
  const dialogRef = this.dialog.open(CommonFilterDiologComponent, {
    data: new Object({ filterObj: this.filterConfig, GridId: this.GridId,isMultiple:this.isMultiple }),
    panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {    
    if (res != false) {
      this.loading = true;
     this.filterCount = res.data.length;
      let filterParamArr = [];
      res.data.forEach(element => {
        filterParamArr.push({
          'FilterValue': element.ParamValue,
          'ColumnName': element.filterParam.Field,
          'ColumnType': element.filterParam.Type,
          'FilterOption': element.condition,
          'FilterCondition': 'AND'
        })
      });
      this.filterConfig = filterParamArr;
      this.loading = true;
     this.setFilterConfig(this.filterConfig);//by maneesh fixed new CommonFilterDiologComponent stop calling api
     this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
    }
  })
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }	 

}

  /*
@Type: File, <ts>
@Name: getClientCount function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

setFilterConfig(JobFilter) {
  this.loading = true;
  this.kendoLoading = true;
  let jsonObj = {};
  if (JobFilter !== null) {
    jsonObj['FilterConfig'] = this.filterConfig;
  } else {
    jsonObj['FilterConfig'] = [];
  }
  jsonObj['GridId'] = this.GridId;
  jsonObj['CardConfig'] = [];
  jsonObj['GridConfig'] = this.colArr;
  this.jobService.setfilterConfig(jsonObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
          this.getLocalStorageData();
          this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
          },100);
        this.TotalNoOfClient = repsonsedata.Data.Count;
        this.loading = false;
        this.kendoLoading = false;
        this.loadingSearch = false;
        // this.getFilterConfig(false);
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.TotalNoOfClient = 0;
        this.loading = false;
        this.kendoLoading = false;
        this.loadingSearch = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.loadingSearch = false;
      }
    }, err => {
      this.loading = false;
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

getFilterConfig(loaderValue: boolean) {
  this.loading = loaderValue;
  this.jobService.getfilterConfig(this.GridId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        let colArrSelected = [];
        if (repsonsedata.Data !== null) {
          this.colArr = repsonsedata.Data.GridConfig;
          this.filterConfig = repsonsedata.Data.FilterConfig;
          this.gridColConfigStatus=repsonsedata.Data.IsDefault;
          setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            this.getLocalStorageData();
            this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
            },100)
          // this.CommonFilterdilogsrvs.setLocalStorage('commonFilterDataStore',JSON.stringify(repsonsedata.Data)); //by maneesh fixed new filtercomponent stop calling api
          if (this.filterConfig !== null) {
            this.filterCount = this.filterConfig.length;
          } else {
            this.filterCount = 0;
          }
          if (repsonsedata.Data.GridConfig.length != 0) {
            colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Grid == true);
          }
          if (colArrSelected.length !== 0) {
            this.columns = colArrSelected;
            // <!-- --------@When: 26-APR-2023 @who:Adarsh singh @why: EWM-12059 -------- -->
            this.columnsWithAction = this.columns;
            this.columnsWithAction.splice(0,0,{
              "Type": "Action",
              "Field": null,
              "Order": 0,
              "Title": null,
              "Selected": true,
              "Format": "{0:c}",
              "Locked": true,
              "width": "40px",
              "Alighment": null,
              "ColumnAlignment": "Left",
              "Grid": true,
              "Filter": false,
              "API": null,
              "APIKey": null,
              "Label": null
              });
              // End 
          } else {
            this.columns = this.colArr;
            // <!-- --------@When: 26-APR-2023 @who:Adarsh singh @why: EWM-12059 -------- -->
            this.columnsWithAction = this.columns;
            this.columnsWithAction.splice(0,0,{
              "Type": "Action",
              "Field": null,
              "Order": 0,
              "Title": null,
              "Selected": true,
              "Format": "{0:c}",
              "Locked": true,
              "width": "40px",
              "Alighment": null,
              "Grid": true,
              "ColumnAlignment": "Left",
              "Filter": false,
              "API": null,
              "APIKey": null,
              "Label": null
            });
            // End 
          }
        }
        this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

/*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who:  Suika
   @When: 29-Oct-2021
   @Why: EWM-3279/33516
   @What: FOR DIALOG BOX confirmation
 */

clearFilterData(viewMode): void {
  const message = `label_confirmDialogJob`;
  const title = '';
  const subTitle = 'candidate_location';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    this.result = dialogResult;
    if (dialogResult == true) {
      this.filterConfig = [];
      let JobFilter = [];
      this.loading = true;
      this.filterCount = 0;
      this.setFilterConfig(this.filterConfig);
      this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,false);
    }
  });
}
 /*
 @Type: File, <ts>
 @Name: updateApplicationForm function
 @Who: maneesh
 @When: 03-06-2022
@Why: EWM-6812 EWM-6989
 @What: update isDefault toggle button
*/
updateApplicationForm(isDefault, data) {
  let fromObj = {};
  fromObj['Id'] = data.Id;
  fromObj['ClientId'] = this.clientIdData;
  fromObj['ClientName'] = this.clientName;
  fromObj['IsDefault'] = isDefault;
  this.jobService.setDefaultlocation(fromObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 400) {
        this.loading = false;
        this.pageNo = 1;
        this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,true);
      }
      else {
        this.loadingscroll = false;
        this.loading = false;
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    }
  )
}
/*
 @Type: File, <ts>
 @Name: toggleVisibility function
 @Who: Maneesh
 @When: 03-06-2022
@Why: EWM-6812 EWM-6989
 @What: on chnage toggle button
*/

toggleVisibility(isDefaultValue: any, gridData) { 
  const message = 'label_titleDialogContentSiteDomain';
  const title = '';
  const subTitle = 'label_changeDefaultLocation';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "355px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.isDefault = isDefaultValue===true?1:0;
      this.updateApplicationForm(this.isDefault, gridData);
    } else {
      this.getCandidateListByJob(this.clientIdData, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false,true);
      
    }
  });
}
 /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: maneesh
  @When: 03-06-2022
  @Why: EWM-6812 EWM-6989
  @What: creating animation
*/
animate() {
  this.animationState = false;
  setTimeout(() => {
    this.animationState = true;
  }, 0);
}
delaAnimation(i: number) {
  if (i <= 25) {
    return 0 + i * 80;
  }
  else {
    return 0;
  }
}
/*
@Type: File, <ts>
@Name: setConfiguration function
@Who: Adarsh singh
@When: 26-APRIL-2023
@Why: ROST-12059
@What: For saving the setting config WITH WIdth of columns
*/
setConfiguration(columnsConfig) {
  let gridConf = {};
  let tempArr: any[] = this.colArr;
  columnsConfig?.forEach(x => {
    let objIndex: any = tempArr.findIndex((obj => obj.Field == x.field));
    if (objIndex >= 0) {
      tempArr[objIndex].Format = x.format,
        tempArr[objIndex].Locked = x.locked,
        tempArr[objIndex].Order = x.leafIndex + 1,
        tempArr[objIndex].Selected = true,
        tempArr[objIndex].Type = x.filter,
        tempArr[objIndex].width = String(x._width)
    }
  });
  gridConf['GridId'] = this.GridId;
  gridConf['GridConfig'] = tempArr;
  gridConf['CardConfig'] = [];
  gridConf['FilterAlert'] = this.filterAlert;
  gridConf['filterConfig'] = this.filterConfig;
  gridConf['QuickFilter'] = this.quickFilterStatus;
  this.jobService.setfilterConfig(gridConf).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}
        // Function to get the current config data from localStorage
        getLocalStorageData() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
          const data = this.CommonFilterdilogsrvs.getLocalStorage('commonFilterDataStore');
          return data ? JSON.parse(data) : {};
        }  
        // Function to save config data to localStorage
         setLocalStorageData(key, data) {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
          this.CommonFilterdilogsrvs.setLocalStorage(key,JSON.stringify(data));
        }
}
