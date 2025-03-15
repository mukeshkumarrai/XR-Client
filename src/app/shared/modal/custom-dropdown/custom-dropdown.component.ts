/*
@(C): Entire Software
@Type: File, <ts>
@Name: custom-dropdown.component.ts
@Who: Renu
@When: 21-Aug-2020
@Why: ROST-2246
@What: this file is used for common dropdown based on given endpoint
 */

import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ResponceData } from '../../models';
import { AppSettingsService } from '../../services/app-settings.service';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { ButtonTypes } from 'src/app/shared/models';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})
export class CustomDropdownComponent implements OnInit {
selectedDataGet = new BehaviorSubject<boolean>(false);
 public dropList:any;
 public isClearable:boolean = true;
 selectedValue=new FormControl('');
 // public keyValue:any;
  @Input() config:customDropdownConfig;
  loadingSearch: boolean;
  public searchValue: string = "";
  pageNameObj:any;
  @Input() set pageName(value: string) {
    if (value) {
      this.pageNameObj = value;
    }
  }

  get keyValue() :any |undefined {
    return this.config.bindLabel
  }
  //@when:18-nov-2021;@who:Priti Srivastva;@why: EWM-3304
  // @Input() selectedIn:any;
  private _selectedIn: any;
  @Input() set selectedIn(value: string) {
    if(value && (Object.keys(value).length === 0))
    {this._selectedIn = null;}
    else{ this._selectedIn = value;}
 }
  get selectedIn(): string {
    // adarsh singh EWM-13711 for display selected value on top in dropdown list
    if (!this.config.multiple) {
      if (this._selectedIn) {
        this.selectedDataGet.next(true);
        return this._selectedIn;
      }
      else {
        this.selectedDataGet.next(false);
      }
      // End 
    }
    else{
      return this._selectedIn;
    }
    
  }

  isDataExist:boolean = true;
  @Input() resetFormSubject: Subject<any> = new Subject<any>();
  @Output() selectedOut:EventEmitter<any> = new EventEmitter<any>();
  // suika @EWM-13542 Whn 01-08-2023 to check data is loaded or not
  @Output() isDataLoad:EventEmitter<any> = new EventEmitter<any>();
  public baseUrl: any;
  public loader:boolean=false;
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones:MediaQueryList;
  forIpads:MediaQueryList;
  forMiniLapi:MediaQueryList;
  private _mobileQueryListener: () => void;
  maxMoreLength:any;
  IsRefresh:Boolean;
  animationVar: any;
  @Output() informStateParent = new EventEmitter<any>();
  @Output() sendDataToParent = new EventEmitter<any>();


 public dropListData:any = [];
 bufferSize:number = 50;
 loadingOnScroll:boolean = false;
 subs: Subscription;
 isData:boolean = true; 

  constructor(private commonserviceService: CommonserviceService,private router:Router,private _appSetting:AppSettingsService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
      this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
      this.forSmartphones = media.matchMedia('(max-width: 832px)');
      this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
      this.forIpads = media.matchMedia('(max-width: 1024px)');
      this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
      this._mobileQueryListener = () => {changeDetectorRef.detectChanges()
       this.screenMediaQuiry();
      } ;
      this.forSmallSmartphones.addListener(this._mobileQueryListener);

  }
  ngOnInit(): void {
    this.screenMediaQuiry();
    this.baseUrl = this._appSetting.baseUrl;
   // this.keyValue=this.config.bindLabel;
    this.getdropdownList();
    this.animationVar = ButtonTypes;
    this.resetFormSubject.subscribe(response => {
      if(response){
       this.config=response;
        this.getdropdownList();
       // this.getdropdownList();
      // @suika @EWM-13898 @whn - 21-09-2023
      if(this.config.IsDisabled){
        this.selectedValue.disable();
      }else{
       this.selectedValue.enable();
        }   
      //  if(this.config.IsRequired){        
      //    this.isClearable = true;
      //  }else{
      //   this.isClearable = false; 
      //  }

       /*******************@suika**@EWM-10681  @02-03-2023 handle staus clear button*******************/
        if(this.config?.isClearable!=undefined && this.config?.isClearable){
          this.isClearable = this.config?.isClearable;
        }
    }
  });
   //@when:2-nov-2021;@who:Priti Srivastva;@why: EWM-3304
   if(this.config.IsRequired)
   {
     this.selectedValue.setValidators([Validators.required]);
     this.selectedValue.updateValueAndValidity();
   }
   if(this.config.IsDisabled!=undefined && this.config.IsDisabled){
     this.selectedValue.disable();
   }
   else{
    this.selectedValue.enable();
   }
   
  if(this.config?.IsRefresh==false){
    this.IsRefresh=this.config?.IsRefresh;
  }else{
    this.IsRefresh=true;
  }

  }

  ngOnDestroy(): void {
    this.forSmallSmartphones.removeListener(this._mobileQueryListener);
  }
    /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: get drop down list on baisis of api endpoint recived
  */

  getdropdownList() {
        // @Who: Bantee Kumar,@Why: EWM-10666.EWM-10732,@When: 27-Feb-2023,@What:clearing the dropdown list of the child if parent dropdown clears its value.
    if(!this.config.apiEndPoint){
      this.dropList=[]
    }
    this.commonserviceService.getGenericDropdownList(this.config.apiEndPoint).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loader=false;
          this.dropListData=repsonsedata.Data;
          if (!this.config.multiple) {
            this.dropList = this.dropListData?.slice(0, this.bufferSize); 
             this.getSelectedDataOnTop();
          }
          else{
            this.dropList = repsonsedata.Data;
          }
          if (this.pageNameObj?.pageName == 'jobManage' && this.pageNameObj?.mode == 'add') {
            let findData = this.dropList?.find((e: any) => e?.Id == this._selectedIn?.Id);
            if (!findData) {
              this.isDataExist = false;
              this.sendDataToParent.emit({ Id: this.dropList[0]?.Id, StatusName: this.dropList[0]?.StatusName, ColorCode: this.dropList[0]?.ColorCode })
            }
          }
          /*--@Who:Nitin Bhati,@When: 02-07-2023,@Why:EWM-13251,@What:for multiple api calling----*/
          this.informStateParent.emit(this.dropList);
          this.isDataLoad.emit(this.dropList);
        }
      }, err => {
         this.loader=false;
         this.dropList=[];
        //console.log(err);
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
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: on clcik on refresh data in list
  */


  getUpdateOptions(){
    this.loader=true;
    this.getdropdownList();
  }

   /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: on click of manage redirect to specific page
    change by priti on 14-sep-2021 to handle parameterize url
  */

  redirect(){
      // const url = this.router.serializeUrl(
      //   this.router.createUrlTree([this.config.IsManage])
      // );
      // window.open(url, '_blank');
      window.open(this.config.IsManage, '_blank');
  }


  /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: to compare objects selected
  */
    compareFn(c1: any, c2:any): boolean {
     // let keyValue:string='Name';
      return c1 && c2 ? c1['Id'] === c2['Id'] : c1 === c2;
  }

  /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: on selection of values
  */
  getValues()
  {
    
    this.selectedOut.emit(this.selectedIn);
  }

  screenMediaQuiry(){
    if(this.forSmallSmartphones.matches==true){
      this.maxMoreLength=1;
    }else if(this.forSmartphones.matches==true){
      this.maxMoreLength=1;
    }else if(this.forLargeSmartphones.matches==true){
      this.maxMoreLength=1;
    }else if(this.forIpads.matches==true){
      this.maxMoreLength=1;
    }else if(this.forMiniLapi.matches==true){
      this.maxMoreLength=1;
    }else{
      this.maxMoreLength=2;
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.screenMediaQuiry();
  }
/*
     @Type: File, <ts>
     @Name: onSearchFilterClear
     @Who:  maneesh
     @When: 08-july-2022
     @Why: EWM.6778.EWM.6776
     @What: For clear Filter search value
   */
  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.getSearchdropdownList(this.searchValue);
  }


  /*
     @Type: File, <ts>
     @Name: searchData
     @Who:  Suika
     @When: 08-feb-2023
     @Why: EWM-10496
     @What: For searching data server side
   */
  searchData(inputValue){
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.getSearchdropdownList(inputValue)
  }

   /*
     @Type: File, <ts>
     @Name: getSearchdropdownList
     @Who:  Suika
     @When: 08-feb-2023
     @Why: EWM-10496
     @What: For searching data server side
   */
  getSearchdropdownList(searchVal) {
    let isExistParam = this.config.apiEndPoint.includes('?');
    let elem ;
    if(isExistParam){
      elem = this.config.apiEndPoint+'&search='+searchVal;
    }else{
      elem = this.config.apiEndPoint+'?search='+searchVal;
    }
    this.commonserviceService.getGenericDropdownList(elem).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loader=false;
          this.dropListData=repsonsedata.Data;
          if (searchVal == '') {
            this.filterArray(); 
          }
          else{
            if (!this.config.multiple) {
              this.dropList = this.dropListData?.slice(0, this.bufferSize); 
            }
            else{
              this.dropList = repsonsedata.Data;
            }
          }

        }
      }, err => {
        this.loader=false;
         this.dropList=[];
        //console.log(err);
      })
  }

/* 
  @Name: fetchMore
  @Who:  Adarsh singh
  @When: 06-Aug-2023
  @Why: EWM-13711 EWM-13884
  @What: For fetch more record on scroll
*/
  fetchMore() {
  const len = this.dropList.length;
  const more = this.dropListData?.slice(len, this.bufferSize + len);
  if (len>49) {
    this.loadingOnScroll = true;
  }
  setTimeout(() => {
      this.loadingOnScroll = false;
      this.dropList = this.dropList.concat(more);
  }, 200)
}

/* 
  @Name: getSelectedDataOnTop
  @Who:  Adarsh singh
  @When: 19-Sep-2023
  @Why: EWM-13711 EWM-13884
  @What: show selected record on top
*/

  getSelectedDataOnTop() {
     this.subs =  this.selectedDataGet.subscribe((e) => {
        if (e) {
          this.loadingOnScroll = false;
           if (this._selectedIn?.Id && this.isData) {
            this.isData = false;
            this.filterArray(); 
            this.subs?.unsubscribe();
           }
        }
      })
  }
/* 
  @Name: filterArray
  @Who:  Adarsh singh
  @When: 19-Sep-2023
  @Why: EWM-13711 EWM-13884
  @What: show selected record on top
*/
  filterArray (){
      const filteredObject: any = this.dropListData?.find(obj => obj?.Id === this._selectedIn?.Id);
      if (filteredObject) {
        // Remove the matching object from the original array
      const index = this.dropListData?.indexOf(filteredObject);
      if (index !== -1) {
        this.dropListData?.splice(index, 1);
      }
      // Add the matching object to the top of the array
      this.dropListData?.unshift(filteredObject);
      }
      this.dropList = this.dropListData?.slice(0, this.bufferSize); 
  }
}
