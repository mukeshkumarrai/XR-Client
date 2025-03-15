import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
 import { MatDialog} from '@angular/material/dialog';
 import { ActivatedRoute, Router } from '@angular/router';
 import { TranslateService } from '@ngx-translate/core';
 import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
 import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
 import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
 import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
 import { Userpreferences } from 'src/app/shared/models';
 import { ButtonTypes } from 'src/app/shared/models';
 import { Subject, Subscription } from 'rxjs';
 import {takeUntil } from 'rxjs/operators';
import { LeadsService } from '@app/modules/EWM.core/shared/services/leads/leads.service';
import { AddLeadComponent } from '@app/shared/modal/add-lead/add-lead.component';
import { ViewLeadWorkflowStagesComponent } from './view-lead-workflow-stages/view-lead-workflow-stages.component';

@Component({
  selector: 'app-lead-workflow-landing',
  templateUrl: './lead-workflow-landing.component.html',
  styleUrls: ['./lead-workflow-landing.component.scss']
})
export class LeadWorklfowLandingComponent implements OnInit {
  public ascIcon: string;
  panelOpenState = false;
  loading: boolean;
  public userpreferences: Userpreferences;
  listData: any[] = [];
  selected = -1;
  public disableContinuebtn: boolean = true;
  workflowId:string;
  workFlowLenght :any;
  animationVar: any;
  public maxCharacterLength:number;
  public loadingSearch: boolean;
  public searchVal: string ='';
  public loaderStatus: number;
  public workflowcolor: any;
  searchSubject$ = new Subject<any>();
  stagedata:any=[]
  JobCountWithIconObs: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public currentMenuWidth: number;
  public workflowIdData: any[] = [];
  public baseData: any[] = [];
  public loadingCount: boolean;
  private dirctionalLang:any;
  workflowstageID:string;
  listDataSearch: any[] = [];
  constructor(private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router,private commonserviceService: CommonserviceService,public dialog: MatDialog,
    private translateService: TranslateService, private routes: ActivatedRoute,public _userpreferencesService: UserpreferencesService,private _LeadsService: LeadsService) {
  }
  ngOnInit(): void {
    let URL = this.route?.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL?.indexOf("?")) == '') {
      URL_AS_LIST = URL?.split('/');
    } else {
      URL_AS_LIST = URL?.substring(0, URL?.indexOf("?"))?.split('/');
    }
    this.commonserviceService.setTitle('label_Menuleads');
    this._sidebarService.activeCoreRouteObs?.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup?.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs?.next(URL_AS_LIST[4]);
    this.ascIcon = 'north';
    this.getLeadWorkflowCount(this.searchVal);
    this.commonserviceService?.onOrgSelectId?.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    this.workflowcolor="border-bottom: 3px solid #ed7e32";
       this.routes.queryParams.subscribe((parmsValue) => {
        this.workflowId = parmsValue?.WorkflowId;
      });
      this.currentMenuWidth = window?.innerWidth;
      this.detectScreenSize();
    sessionStorage.removeItem('joblandingCreatejob');
    sessionStorage.removeItem('jobLandingQuickFilter');
    }
 detectScreenSize(){
    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 1150) {
      this.maxCharacterLength = 40;
    } else {
      this.maxCharacterLength = 60;
    }
  }

  @HostListener("window:resize", ['$event'])
  public onResize(event) {
    event.target.innerWidth;
    this.currentMenuWidth = event?.target?.innerWidth;
    this.detectScreenSize();
  }

viewWorkflowStages(WorkflowId) {
  this.workflowstageID=WorkflowId;
  const dialogRef = this.dialog?.open(ViewLeadWorkflowStagesComponent, {
    data: new Object({ workflowId: this.workflowstageID, isParentStages: true }),
    panelClass: ['xeople-modal-full-screen', 'workflow-sub-stages', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
}
  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId)?.classList?.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList?.remove(animationName)
  }
  createLead() {
    const dialogRef = this.dialog?.open(AddLeadComponent, {
      data: new Object({ PageUrl:this.route?.url}),
      panelClass: ['xeople-modal-md', 'add-lead', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getLeadWorkflowCount(this.searchVal);
        //this.dialogRef.close();
      }
      let dir: string;
      dir = document?.getElementsByClassName('cdk-global-overlay-wrapper')[0]?.attributes['dir']?.value;
      let classList = document?.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    })
  }

 reloadApiBasedOnorg() {
    this. getLeadWorkflowCount(this.searchVal);
  }

 getLeadWorkflowCount(searchVal) {
    this.loading = true;
    this.JobCountWithIconObs = this._LeadsService.getLeadWorkflowCount(searchVal).pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata?.HttpStatusCode === 200) {
        this.loading = false;
       if((repsonsedata['Data'] !=null) && (repsonsedata['Data'] !=undefined) && (repsonsedata['Data']?.length==1)){
        this.route.navigate(['/client/leads/lead/lead-details'], { queryParams: { workflowId: repsonsedata['Data'][0]?.WorkflowId,WorkflowName:repsonsedata['Data'][0]?.WorkflowName } });
        // this.listData = repsonsedata?.Data;
        // this.listDataSearch=repsonsedata?.Data;
       }else{
        this.listData = repsonsedata?.Data;
        this.listDataSearch=repsonsedata?.Data;
      }
      } else if (repsonsedata?.HttpStatusCode === 204) {
        this.loading = false;
        this.listData = repsonsedata?.Data;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata?.Message), repsonsedata?.HttpStatusCode);
       this.loading = false;
      }
    }, err => {
     this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err?.Message), err?.StatusCode);
    })
}
public onSearchFilterClear(): void {
      this.loadingSearch = false;
      this.searchVal = '';
      this.listData=[...this.listDataSearch];
    }

  public onFilter(inputValue: string): void {
    this.loading = false;
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.listData = this.listDataSearch?.filter(
      (item) =>
       `${item?.WorkflowName}`
    .toLowerCase()
    .indexOf(inputValue?.toLowerCase()) !== -1
    );
   }

 
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.JobCountWithIconObs?.unsubscribe();
  }

}
