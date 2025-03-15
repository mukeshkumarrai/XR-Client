/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 19-July-2021
  @Why: EWM-2086
  @What:  This page will be use for Job action popup page Component ts file
*/

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ConfirmDialogModel } from '../../screening/share-resume-internal/share-resume-internal.component';
import { ConfirmDialogComponent } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss']
})
export class ActionDialogComponent implements OnInit {

  /*************************global variables decalre here ************************/
  public gridData: any[];
  public IsCheckedMenu: boolean;
  public selectedcolGrid: any[] = [];
  public colGrid: any[] = [];
  public loading: boolean;
  public GridId: any = 'grid001';
  public checked = [];
  public gridConfigArr: any[] = [];
  public searchTextProduct;
  public addSelectedbtn: boolean = true;
  public isCheckedAllMenu: boolean;
  public isPartial: boolean;
  public allComplete: boolean = false;
  @ViewChild('target') private myScrollContainer: ElementRef;
  public addRemovebtn: boolean = true;
  gridConfig: any;
  public ProximitySearchResult = {
    Latitude: 0,
    Longitude: 0,
    Distance:0,
    Unit:'KM',
    Address:''
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ActionDialogComponent>,
    private jobService: JobService, private snackBService: SnackBarService, private translateService: TranslateService,private appSettingsService: AppSettingsService
    ,public dialog: MatDialog,) {
    if (data.GridId !== undefined) {
      this.GridId = data.GridId;
      this.gridConfig=data.gridConfig;
    }
  }

  ngOnInit(): void {
// <!--@Who: Bantee Kumar,@Why:EWM-12906.EWM-12956,@When: 08-07-2023,@What:Column name reload issue in action popup. -->

    this.loading=true;

    setTimeout(() => {
    this.getFilterConfig();
      
    }, 1000);
  }
  /*
   @Type: File, <ts>
   @Name: sortBy function
   @Who: Renu
   @When: 19-Jul-2021
   @Why: ROST-2087
   @What: For showing the order column of seelction
    */
  sortBy(prop: string) {
   // return this.selectedcolGrid.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  return  this.selectedcolGrid.sort((a,b) => (a[prop] > b[prop]) ? 1 : ((b[prop] > a[prop]) ? -1 : 0));
  
  }
  /*
 @Type: File, <ts>
 @Name: getFilterConfig function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For getting the deafult config for the user
  */
  getFilterConfig() {
// <!--@Who: Bantee Kumar,@Why:EWM-12813.EWM-12998,@When: 05-07-2023,@What:Remove fix column in action modal. -->

    this.loading = true;

    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          //Who:Ankit Rawat, What:EWM-16114 retain Proximity, When:06March24
          this.ProximitySearchResult.Latitude=repsonsedata.Data?.Latitude ?? 0;
          this.ProximitySearchResult.Longitude=repsonsedata.Data?.Longitude ?? 0;
          this.ProximitySearchResult.Address=repsonsedata.Data?.Address;
          this.ProximitySearchResult.Distance=repsonsedata.Data?.Distance ?? 0;

          //this.gridConfigArr = repsonsedata?.Data?.GridConfig;
          this.gridConfigArr =  repsonsedata?.Data?.GridConfig.sort((a,b) => (a['Order'] > b['Order']) ? 1 : ((b['Order'] > a['Order']) ? -1 : 0));
          let gridConfigArrShow = repsonsedata?.Data?.GridConfig?.filter(item => item?.Grid == true);
          if (this.gridConfigArr !== null) {
            this.selectedcolGrid = gridConfigArrShow?.filter(x => x?.Selected == true);
            //this.selectedcolGrid =  selectedcolGrid?.sort((a,b) => (a['Order'] > b['Order']) ? 1 : ((b['Order'] > a['Order']) ? -1 : 0));
            this.colGrid = gridConfigArrShow?.filter(x => x?.Selected == false).map(v => ({ ...v, completed: false }));
            if (this.selectedcolGrid?.length != 0) {
              this.addRemovebtn = false;
            }
          }
        }else if(repsonsedata.HttpStatusCode === 204){
          this.gridConfigArr = [];
          this.selectedcolGrid = [];
          this.colGrid = [];
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
  @Name: onConfirm function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2087
  @What: For saving the setting config on click btn
   */

  onConfirm(): void {
    //  console.log(this.gridConfigArr,"this.gridConfigArr")

    this.setConfiguration();
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /*
 @Type: File, <ts>
 @Name: setConfiguration function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For saving the setting config
  */

  setConfiguration() {
    
    let gridConf = {};
    let gridConfigArr =  this.gridConfigArr.sort((a,b) => (a['Order'] > b['Order']) ? 1 : ((b['Order'] > a['Order']) ? -1 : 0));
    gridConf['GridId'] = this.GridId;
    gridConf['GridConfig'] = gridConfigArr;
    gridConf['CardConfig'] = [];
    gridConf['FilterAlert'] = this.gridConfig?.filterAlert;
    gridConf['filterConfig'] = this.gridConfig?.filterConfig;
    gridConf['QuickFilter'] = this.gridConfig?.quickFilterStatus;
  // who:maneesh,what:15012 for handel page mode,when:03/11/2023
    gridConf['PageMode'] = localStorage.getItem('viewMode')=='listMode'?'List':'Card';
    gridConf['Header'] = this.gridConfig?.Header;

       //Who:Ankit Rawat, What:EWM-16114-EWM-16203 set proximity data, When:04March24
    gridConf['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    gridConf['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    gridConf['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    gridConf['Address']=this.ProximitySearchResult?.Address;

    this.loading = true;
   // return false;
    this.jobService.setfilterConfig(gridConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          document.getElementsByClassName("add_actiondialog")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_actiondialog")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close({ data: this.gridConfigArr }) }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
  @Name: drop function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: For drag & drop functionality
   */
  drop(event: CdkDragDrop<string[]>, ...targets: string[]) {
    // this.checked =[]
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      if (targets[1] == 'selectedcolGrid') {
        this.gridConfigArr.forEach(x => {
          event.container.data.forEach((y, index) => {
            if (y['Field'] == x['Field']) {
              x['Order'] = index + 1; // @suika @EWM-13066 @Whn 10-07-2023 handling index position
            }
          })
        });
      }
    } else {

      let fieldVal = event.previousContainer.data[event.previousIndex]['Field'];
          if (targets[1] == 'selectedcolGrid') {
            this.checked.push({
              'Field': fieldVal
            });
           
            this.gridConfigArr?.forEach(x => {
              if (x?.Field == fieldVal) {
                x.Selected = true;
                x.Order =  event.currentIndex; // @suika @EWM-13066 @Whn 10-07-2023 handling index position
              }
            });
            this.colGrid?.forEach(x => {
              if (x?.Field == fieldVal) {
                x.completed = false;
                x.Order =  event.currentIndex; // @suika @EWM-13066 @Whn 10-07-2023 handling index position
              }
            });
            
            this.selectedcolGrid?.forEach(x => {
              if (x?.Field == fieldVal) {
                x.Order =  event.currentIndex; // @suika @EWM-13066 @Whn 10-07-2023 handling index position
              }
            });
            
           
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          
            var newGridArr = this.gridConfigArr?.concat(event.container.data);
            newGridArr?.forEach(x => {
              if (x?.Field == fieldVal) {
                x.Order =  event.currentIndex; // @suika @EWM-13066 @Whn 10-07-2023 handling index position
              }
            });
            /////remove duplicate data from newGridArr
            const uniqueGridArr = Array.from(new Set(newGridArr.map(a => a?.Field)))
              .map(Field => {
                return newGridArr?.find(a => a?.Field === Field)
              });
            //////

            this.gridConfigArr = uniqueGridArr;
            //  this.gridConfigArr.forEach(x=>{
            //   event.container.data.forEach((y,index)=>{
            //     if(y['Field']==x['Field']){
            //       x['Order']=index;
            //     }
            //   })
            //  });
            this.allComplete = this.colGrid.every(t => t.completed);
            // console.log(this.gridConfigArr,"this.gridConfigArr2dddd") 
          } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            this.colGrid?.forEach(x => {
              if (x.Field == fieldVal) {
                x.completed = false;
                x.Order =  event.currentIndex;
              }
              this.gridConfigArr?.forEach(y => {
                if (y['Field'] == x['Field']) {
                  x.Selected = false;
                  x.Order =   event.currentIndex;
                }
              })
            });
            this.allComplete = false;
          }
    }

    // console.log(this.gridConfigArr,"this.gridConfigArr")
  }

  /*
  @Type: File, <ts>
  @Name: checkColMovData function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: moving data from one panel to other
   */

  checkColMovData(event: any, field: any, ...targets: string[]) {

    if (event.checked === true) {
      this.checked.push({
        'Field': field
      });

      this.colGrid.forEach(x => {
        if (x.Field == field) {
          x.completed = true;
        }
      });
    } else {
      const index = this.checked.findIndex(x => x.Field == field);
      if (index !== -1) {
        this.checked.splice(index, 1);
      }
      this.colGrid.forEach(x => {
        if (x.Field == field) {
          x.completed = false;
        }
      });
    }
    this.allComplete = this.colGrid.every(t => t.completed);
    if (this.checked.length != 0) {
      this.addSelectedbtn = false;
    }
    else {
      this.addSelectedbtn = true;
    }
  }

  /*
    @Type: File, <ts>
    @Name: someComplete function
    @Who: Renu
    @When: 19-Jul-2021
    @Why: ROST-2086
    @What: for maintianing three state in checkbox checkall/unchecked/intermediate
     */
  someComplete(): boolean {
    if (this.colGrid == null) {
      return false;
    }
    return this.colGrid.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  /*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: for cosing the pop up
   */
  onDismiss() {
    document.getElementsByClassName("add_actiondialog")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_actiondialog")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }


  /*
  @Type: File, <ts>
  @Name: remove function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: delete the data single record from update array
   */
  remove(fieldName: any, ...targets: string[]) {
    this[targets[0]] = [
      ...this[targets[1]].splice(this[targets[1]].findIndex((x => x.Field == fieldName)), 1),
      ...this[targets[0]]
    ];
    this.allComplete = false;
    this[targets[0]].forEach(item => {
      if (item.Field == fieldName) {
        item.completed = false; item.Order = 0; item.Selected = false;
      }
    });
    this.gridConfigArr.forEach(item => {
      if (item.Field == fieldName) {
        item.Order = 0; item.Selected = false;
      }
    });
  }

  /*
  @Type: File, <ts>
  @Name: AddSelectedAll function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2086
  @What: on all btn selected add the data to selected panel
   */
  AddSelectedAll(...targets: string[]) {
    if (this.checked.length !== 0) {
      this.checked.forEach(y => {
        this[targets[0]] = [
          ...this[targets[1]].splice(this[targets[1]].findIndex((x => x.Field === y.Field)), 1),
          ...this[targets[0]]
        ];

        this.checked = [];
        /*  @Who: Anup Singh @When: 23-Dec-2021 @Why: EWM-4037 EWM-4307 (for Action when remove all)*/
        /////Concat gridConfigArr and array checked of Array
        var newGridArr = this.gridConfigArr.concat(this[targets[0]]);

        /////remove duplicate data from newGridArr
        const uniqueGridArr = Array.from(new Set(newGridArr.map(a => a.Field)))
          .map(Field => {
            return newGridArr.find(a => a.Field === Field)
          })
        ////

        //////
        this.gridConfigArr = uniqueGridArr;
        this.gridConfigArr.forEach(item => {
          if (item.Field == y.Field) {
            item.Order = 0; item.Selected = true;
          }
        });

      })

      this.addSelectedbtn = true;
      this.allComplete = false;
      this.addRemovebtn = false;
    } else {
      this.addSelectedbtn = false;
    }




  }

  /*
   @Type: File, <ts>
   @Name: checkAll function
   @Who: Renu
   @When: 19-Jul-2021
   @Why: ROST-2086
   @What:  check all functionality
    */
  checkAll(event) {
    if (event.checked == true) {
      this.IsCheckedMenu = true;
      this.colGrid.forEach(item => {
        const index = this.checked.findIndex(x => x.Field == item.Field);
        if (index == -1) {
             //<!-----@suika@EWM-10650 EWM-10818  @09-03-2023 to handle API url-----> 
          this.checked.push({
            'Field': item.Field,
            'API': item.API
          });
        }
        item.completed = event.checked;
      });
      this.allComplete = event.checked;
    } else {
      this.IsCheckedMenu = false;
      this.allComplete = event.checked;
      this.checked = [];
      this.colGrid.forEach(t => t.completed = event.checked);
    }

    if (this.checked.length !== 0) {
      this.addSelectedbtn = false;
    } else {
      this.addSelectedbtn = true;
    }

  }


  /*
  @Type: File, <ts>
  @Name: RemoveSelectedAll function
  @Who: Nitin Bhati
  @When: 6-Sep-2021
  @Why: EWM-2253
  @What: on all btn selected Remove the data to selected panel
   */
  RemoveSelectedAll(...targets: string[]) {
    let selectedRemove: any = [];
    selectedRemove = this.selectedcolGrid;
    this.addRemovebtn = true;
    this.gridConfigArr = [];
    if (selectedRemove.length !== 0) {
// <!--@Who: Bantee Kumar,@Why:EWM-12813.EWM-12998,@When: 05-07-2023,@What:Remove fix column in action modal. -->

      let selectedcolGrid = this.selectedcolGrid.filter(x => x.Locked == true);
      this.selectedcolGrid = selectedcolGrid.filter((item, i, ar) => ar.indexOf(item) === i);
      selectedRemove.forEach(y => { 
        if(y.Locked==false){
          this.colGrid.push({
            'API': y.API,    //<!-----@suika@EWM-10650 EWM-10818  @10-03-2023 to handle API url-----> 
            'APIKey':y.APIKey,
            'Grid':y.Grid,
            'Label':y.Label,
            'IsMultiple':y.IsMultiple,
            'Field': y.Field,
            'Format': y.Format,
            'Locked': y.Locked,
            'Order': y.Order,
            'Selected': false,
            'Title': y.Title,
            'Type': y.Type,
            'width': y.width,  
            'Filterable': y.Filterable,    //--@Nitin Bhati,@19-07-2023,to handle filterable--//         
            // 'completed':false, 
          }); 
        }else{
          this.colGrid.push({
            'API': y.API ,   //<!-----@suika@EWM-10650 EWM-10818  @10-03-2023 to handle API url-----> 
            'APIKey':y.APIKey,
            'Grid':y.Grid,
            'Label':y.Label,
            'IsMultiple':y.IsMultiple,
            'Field': y.Field,
            'Format': y.Format,
            'Locked': y.Locked,
            'Order': y.Order,
            'Selected': true,
            'Title': y.Title,
            'Type': y.Type,
            'width': y.width,   
            'Filterable': y.Filterable,    //--@Nitin Bhati,@19-07-2023,to handle filterable--//                
            // 'completed':false, 
          }); 
        }       
         
      })

    }
    //this.gridConfigArr = this.colGrid;
    this.gridConfigArr = this.colGrid.filter((item, i, ar) => ar.indexOf(item) === i);
     //<!-----@Nitin Bhati@EWM-11403 @11-03-2023@Why:Status column should not be displayed or searched in left side panel and should not be display twice or thrice to right side panel-----> 
    this.colGrid = this.colGrid.filter(x => x.Locked === false);
    //this.colGrid = this.colGrid.filter(x => x.Locked === false); // @suika @EWM-10650 @whn 21-03-2013 handle status drop list
    this.checked = [];
  }

    /*
      @Type: File, <ts>
      @Name: disconnectPopUp function
       @Who: maneesh
       @When: 03-july-2023
      @Why: EWM-12931
      @What: FOR DIALOG BOX confirmation
    */
      onRestoreDefault(): void {  
        const message = `label_titleDialogContentSiteDomain`;
        const title = '';
        const subTitle = 'label_RestoreDefaultConfigration';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: "350px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(dialogResult => {          
          if (dialogResult == true) {
            let gridId=[];
            gridId.push(this.GridId);
            this.jobService.restoreDefaultConfig(gridId).subscribe(
              (data: ResponceData) => {
                if (data.HttpStatusCode === 200) {  
                this.getFilterConfig();
                setTimeout(()=>{
                this.onConfirm()
                },700)
                    } else if (data.HttpStatusCode === 400){
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
                }   
              }, err => {
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
              })
          }
        });
      }
}
