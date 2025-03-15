import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Industry } from 'src/app/modules/EWM.core/system-settings/industry/model/industry';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
 
 /* public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Order,description,asc";
  public sortedcolumnName: string = 'Order';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public result: string = '';
  //public actionStatus: string = 'Add';
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  public viewMode: string;
  public isvisible: boolean;
  public maxCharacterLengthSubHead = 130;
  public gridView = [{ 'ID': 1, 'GroupCode': 'FOO1', 'GroupDescription': 'treee', 'IsBuiltIn': 1, 'IsActive': 1 },
  { 'ID': 2, 'GroupCode': 'FOO9', 'GroupDescription': 'test2', 'IsBuiltIn': 1, 'IsActive': 1 }]
  public auditParameter;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  public totalDataCount: number;
  public pagneNo = 1;
  public groupId = '';
  public gridData: any = [];
  searchVal: string = '';
  public loadingSearch: boolean;
  next: number = 0;
  listDataview: any[] = [];
  public pageLabel : any = "label_industry";
*/

@Input() gridData:any;

 
  
  /*
 @Type: File, <ts>
 @Name: constructor function
 @Who: Suika
 @When: 17-May-2021
 @Why: ROST-1514
 @What: For injection of service class and other dependencies
  */

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router, private route: ActivatedRoute,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private translateService: TranslateService, private systemSettingService: SystemSettingService,private commonserviceService: CommonserviceService) {
   
  }
public gridView =[];
public gridGroupView = [];
public value=[];

  ngOnInit(): void {

    this.commonserviceService.onOrgSelectJsonId.subscribe(value => {
      if (value !== null) {
        this.value=value[0];
        this.jsonData(this.value);
      }
    });
  }

jsonData(values){
  this.gridGroupView=[];
  this.gridView=[];
  for (var prop in this.value) {
    if (this.value.hasOwnProperty(prop)) {
      this.gridGroupView.push(prop);
       var innerObj = {};
       innerObj[prop] = JSON.parse(this.value[prop]);
       this.gridView.push(innerObj)
    }
 }
 }


}




