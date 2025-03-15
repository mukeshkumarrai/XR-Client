/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Naresh Singh
  @When: 12-Jul-2021
  @Why: EWM-2009 EWM-2049
  @What:  This page will be use for the Customizing Widgets component ts file
*/

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserEmailIntegration } from '../../shared/datamodels'
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CustomizingWidgetService } from 'src/app/shared/services/dashboard-widget/customizing-widget/customizing-widget.service';
import { ResponceData } from 'src/app/shared/models';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-customizing-widgets',
  templateUrl: './customizing-widgets.component.html',
  styleUrls: ['./customizing-widgets.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ])
  ]
})
export class CustomizingWidgetsComponent implements OnInit {

  isShowActionList :any = [];
  public pageNo: number = 1;
  public pageSize = 200;
  public sortingValue: string = "Order,description,asc";
  public sortedcolumnName: string = 'Order';  
  searchVal: string = '';
  public gridData: any =[]; 
  public leftGridData: any =[];
  public rightGridData: any =[];   
  next: number = 0;
  public loading : boolean = false;  
  listDataview: any[] = [];  
 public totalDataCount: number;
 public IsEnabled : any; 
 isButtonActive:any = [];
 isResponseGet:boolean = false;

  

  constructor(public _sidebarService: SidebarService, private fb: FormBuilder, private route: Router, private cdRef: ChangeDetectorRef, 
    private _profileInfoService: ProfileInfoService, private snackBService: SnackBarService,
    private translateService: TranslateService,private customizingWidgetService:CustomizingWidgetService) {}

  ngOnInit(): void {
    let URL = this.route.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }   
  
      this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
      this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
      this._sidebarService.topMenuAciveObs.next('profile');
      this.getWidgetList(this.pageSize, this.pageNo);
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
 }

  drop(event: CdkDragDrop<string[]>,isDirection) {  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    this.checkItemData(event.container.data, event.previousContainer.data, event.container.id, event.previousContainer.id,isDirection); 
  }


  checkItemData(dropData,previousData,dropId,previousId,isDirection){
    if(isDirection=='L'){
      this.leftGridData.forEach((favArr) => {
        this.changeWidgetLocation(dropData, favArr,isDirection);
      })
      } else if(isDirection=='R'){
        this.rightGridData.forEach((favArr) => {
          this.changeWidgetLocation(dropData, favArr,isDirection);
        })
        }
        /*else{
         this.leftGridData = [];
         this.rightGridData = [];
        }*/
  }

 

  changeWidgetLocation(dropData, favArr,isDirection) {
    var out = [];
    let n = 1;
    for (var i in dropData) {     
      if (dropData[i].WidgetName == favArr.WidgetName) {
        dropData[i].WidgetLocation = isDirection;
        dropData[i].WidgetSequence = parseInt(i)+n;
        out.push(dropData[i])       
      }
    }
    return out
  }


  showActionList(id) {   
    this.isShowActionList[id] = !this.isShowActionList[id];
  }
  

  getWidgetList(pagesize, pagneNo){
    this.loading = true;
    this.customizingWidgetService.getdashboardWidgetList(pagneNo,pagesize).subscribe(
      (repsonsedata: ResponceData)  => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {          
          this.loading = false;         
          this.gridData = repsonsedata.Data;
            let lData =   this.gridData.filter(x => x['WidgetLocation'] === 'L');
            this.leftGridData =  lData.sort(function (a, b) {
            return a.WidgetSequence - b.WidgetSequence;
          }); 
          let rData =  this.gridData.filter(x => x['WidgetLocation'] === 'R');  
          this.rightGridData =  rData.sort(function (a, b) {
            return a.WidgetSequence - b.WidgetSequence;
          }); 
          this.totalDataCount = repsonsedata.TotalRecord;
          this.reloadListData();
          this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      }) 
  }

  onSave(){
    this.loading = true;
    this.isResponseGet = true;
    let arr = [];
    arr = this.leftGridData.concat(this.rightGridData); 
    this.customizingWidgetService.dashboardConfigure(arr).subscribe(repsonsedata=>{
      if(repsonsedata['HttpStatusCode']==200)
      {
        this.isResponseGet = false;
        this.loading=false;        
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.getWidgetList(this.pageSize, this.pageNo);
      } else if(repsonsedata['HttpStatusCode']==400)
      {
        this.isResponseGet = false;
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.loading=false;
      }
      else{
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading=false;
      }
    },
    err=>{
      if(err.StatusCode==undefined)
      {
        this.loading=false;
        this.isResponseGet = false;

      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading=false;
      this.isResponseGet = false;
      
  });
   
  }


  doNext() {
    // alert(this.gridData.length)
    if (this.next < this.gridData.length) {
      //alert('go')
      this.listDataview.push(this.gridData[this.next++]);
    }
  }


  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  reloadListData() {
    this.next=0;
    this.listDataview=[];
  }

  
  makeEnabled(Id, IsEnabled,isDirection) {  
    this.isButtonActive[Id] = 0;  
    if(IsEnabled===0){
      this.isButtonActive[Id]=1;
    }else{
      this.isButtonActive[Id]=0;     
    }
    this.reloadGridData(Id,isDirection,this.isButtonActive[Id]) 
  }

  reloadGridData(Id,isDirection,isButtonActive) { 
    if(isDirection=='L'){
      let selectedArray =  this.leftGridData.filter(x => x['Id'] === Id);     
      selectedArray.forEach(element => {
        element['IsEnabled'] = isButtonActive;
      }); 
    }else if(isDirection=='R'){
      let selectedArray =  this.rightGridData.filter(x => x['Id'] === Id);
      selectedArray.forEach(element => {
        element['IsEnabled'] = isButtonActive;
      }); 
    }
   
  }


}
