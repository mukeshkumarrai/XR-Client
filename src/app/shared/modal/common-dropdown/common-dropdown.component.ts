/*
  @Type: File, <html>
  @Who: Adarsh singh
  @When: 06-Nov-2023
  @Why: EWM-14995
*/
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { ResponceData } from '@app/shared/models/responce.model';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DRP_CONFIG } from '../../models/common-dropdown';
import { FormControl, Validators } from '@angular/forms';
import { ButtonTypes } from 'src/app/shared/models';
import { DropdownMouseState } from '@app/shared/enums/job-detail.enum';

@Component({
  selector: 'dropdown',
  templateUrl: './common-dropdown.component.html',
  styleUrls: ['./common-dropdown.component.scss']
})
export class CommonDropdownComponent implements OnInit, OnDestroy {
  propagateChange = (_: any) => { };
  showMenu: boolean;
  isDisabled: boolean;
  state: DropdownMouseState;
  @Output() selectedOut: EventEmitter<any> = new EventEmitter<any>();
  @Input() configuration: DRP_CONFIG;
  @Input() width: string;
  @Input() index: string;
  selectedItemControl=new FormControl('');
  searchSubject$ = new Subject<any>();
  isSpinner: boolean = false;
  dropdownClick: boolean = false;
  isDataGet:boolean;
  searchVal: string;
  BIND_By:string;
  loaded = false;
  dropListData = [];
  selectedArr = [];
  apicall: Subscription;
  Subscription1: Subscription;
  Subscription2: Subscription;
  showMoreItem:boolean;
  animationVar: any;
  @Input() resetConfiguration: Subject<any> = new Subject<any>();
  @Input() showMoreOptionsNum: number = 2;
  selectedItemsFormControl=new FormControl('');
  removable:boolean = true;
  anotherBindValue:string;
  // set disbaled control
@Input() set setDisabledControl(val:boolean){
  if (val) {
    this.checkDisabled(val);
  }
}
// for reset form 
 @Input() set initialize(value: string) {
  if (value) {
    this.selectedItemsFormControl.reset();
  }
}
// get selected item 
  @Input() set getSelectedItem(value: string) {
    if (!value || (Object.keys(value)?.length === 0)) {
      this.selectedArr = [];
      this.selectedItemsFormControl.patchValue(null)
     }
    else {
        this.selectedArr = [];
        if (this.configuration?.SINGLE_SELECETION) {
          this.selectedArr = [value];
        }
        else{
          this.selectedArr = [...value];
        }
        this.selectedItemsFormControl.patchValue(this.selectedArr)
    }
  }

  @HostListener('document:click') clickedOutside() {
    if (this.state == DropdownMouseState.outside) {
      this.showMenu = false; // hide the dropdown...
      this.showMoreItem = false;
      //Who:Ankit Rawat, What:EWM-16842, Why: when a user opens the dropdown again, the searched name is still displayed in the dropdown, When:25Apr24 -->
      if(this.searchVal){
        this.Clear();
      }
      
    }
    let dropdown = document.getElementById('dropdown-content_' + this.index);
      if (dropdown && this.configuration?.SINGLE_SELECETION) {
        dropdown?.classList.remove('open-downward');
        dropdown?.classList.remove('open-upward');
      }
  }

  constructor(private renderer: Renderer2, private commonService: CommonserviceService) {
    this.showMenu = false;
    this.state = DropdownMouseState.outside;
  }

  ngOnInit() {
    this.index = this.generateRandomUniqueId();
    this.checkAllConfigurations(this.configuration);
    this.Subscription1 = this.searchSubject$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.onSearchHandler(value)
    })
    // get config on change
    this.Subscription2 = this.resetConfiguration.subscribe((data: DRP_CONFIG) => {
      if (data) {
        this.configuration = data;
        this.checkAllConfigurations(this.configuration);
        this.BIND_By = this.configuration?.BINDBY;
        this.apiHandler();
      }
    })
    // get selected item
    this.animationVar = ButtonTypes;
    /**@When: 10/06/2024 @what:to show onload page error @why; ewm-17037 ewm-17284 */
    if(this.configuration.ONLOAD_ERROR_SHOW)
      {
        this.selectedItemsFormControl.markAsTouched();
      }
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  valueChange(item: any) {
    const findIndexKey = this.configuration?.FIND_BY_INDEX;
    const index = this.selectedArr?.findIndex((x) => x[findIndexKey] === item[findIndexKey]);
    if (index == -1) {
      if (this.configuration?.SINGLE_SELECETION) {
        this.selectedArr = [];
        //Who:Ankit Rawat, Highlight selected item, When:01Jul24
        this.dropListData.forEach(listItem => {
          listItem.IsSelected = false;
        });
        item.IsSelected=true;
        this.selectedArr.push(item);
      }
      else {
        //Who:Ankit Rawat, Highlight selected item, When:01Jul24
        item.IsSelected=true;
        this.selectedArr.push(item);
        if (this.configuration?.AT_LEAST_ONE_IS_NOT_REMOVABLE && this.configuration?.REQUIRED) {
          this.selectedArr[0]['disabled'] = true;
        }
      }
    }
    this.propagateChange(item.Value);
    if (this.configuration?.SINGLE_SELECETION) {
      this.showMenu = false;
      this.sendSelectedDataHandler(item);
    }
    else{
      this.sendSelectedDataHandler(this.selectedArr);
    }
  }

  public Clear() {
    this.searchVal = '';
    this.apiHandler();
  }

  remove(item:any, event) {
    const index = this.selectedArr.indexOf(item);
    if (index >= 0) {
      this.selectedArr.splice(index, 1);
      //Who:Ankit Rawat, Highlight selected item, When:01Jul24
      //const selectedItem=this.dropListData.find(selectItem=>selectItem.UserId==item.UserId);
      //if(selectedItem){
       // selectedItem.IsSelected=false;
      //}
      //Who:Ankit Rawat, Highlight selected item, changed with dynamic property, When:16Aug24
      this.dropListData.forEach(itemList => {
        const match = Object.keys(item).every(
          key => item[key] === itemList[key]
        );
        
        if (match) {
          itemList.IsSelected = false;
        }
      });
    }
    this.sendSelectedDataHandler(this.selectedArr);
    this.selectedItemsFormControl.markAllAsTouched();
    event?.stopPropagation();
  }

  openDropdown(isOpen: boolean) {
    if (isOpen) {
      this.dropdownClick = true;
        this.addClassOnChangeDirection();
        setTimeout(() => {
          this.renderer?.selectRootElement('#searchInput_'+this.index).focus();
        }, 200);

      // open
      if (this.dropListData?.length > 0) {
        //Who:Ankit Rawat, Highlight selected item, When:01Jul24
        //this.dropListData = this.dropListData.map(item => ({
        //  ...item,
        //  IsSelected: this.selectedArr.some(selectedItem => selectedItem.UserId === item.UserId)
       // }));
      //Who:Ankit Rawat, Highlight selected item, changed with dynamic property, When:16Aug24
       const commonProperties = this.findCommonProperties(this.selectedArr, this.dropListData);
       this.dropListData.forEach(itemList => {
        if (this.selectedArr.some(itemSelect => commonProperties.every(prop => itemSelect[prop] === itemList[prop]))) {
          itemList.IsSelected = true;
        }
        else {
          itemList.IsSelected = false;
        }
      });
        return
      }
      this.apiHandler();
    }
    this.showMoreItem = false;
  }

  getInputVal(e) {
    this.searchSubject$.next(e)
  }

  apiHandler() {
    if (!this.configuration?.API) return
    this.loaded = false;
    this.isSpinner = true;
    this.apicall && this.apicall.unsubscribe();
    let isExistParam = this.configuration?.API.includes('?');
    let elem = isExistParam ? `&pageSize=50` : `?pageSize=50`;
    this.apicall = this.commonService.getGenericDropdownList_v2(this.configuration?.API +elem).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.isDataGet = true
          if (repsonsedata.Data?.length > 0) {
            this.dropListData = repsonsedata.Data;
            //Who:Ankit Rawat, Highlight selected item, When:01Jul24
            //this.dropListData = repsonsedata.Data.map(item => ({
            //  ...item,
             // IsSelected: this.selectedArr.some(selectedItem => selectedItem.UserId === item.UserId)
            //}));

            //Who:Ankit Rawat, Highlight selected item, changed with dynamic property, When:16Aug24
            const commonProperties = this.findCommonProperties(this.selectedArr, this.dropListData);
            this.dropListData.forEach(itemList => {
            if (this.selectedArr.some(itemSelect => commonProperties.every(prop => itemSelect[prop] === itemList[prop]))) {
              itemList.IsSelected = true;
             }
             else {
              itemList.IsSelected = false;
             }
            });
        
            this.isSpinner = false;
            this.addClassOnChangeDirection();
            setTimeout(() => {
              this.renderer.selectRootElement('#searchInput_'+this.index).focus();
            }, 100);
          }
          else {
            this.dropListData = [];
            this.isSpinner = false;
          }
          this.loaded = true;
          this.apicall.unsubscribe();
        }
        this.isSpinner = false;
      }, err => {
        this.dropListData = [];
        this.isSpinner = false;
      })
  }

  onSearchHandler(searchVal) {
    this.loaded = false;
    this.isSpinner = true;
    let isExistParam = this.configuration?.API?.includes('?');
    let elem = isExistParam ? `&search=${searchVal}&pageSize=200` : `?search=${searchVal}&pageSize=200`;
    this.apicall && this.apicall.unsubscribe();
    this.apicall = this.commonService.getGenericDropdownList(this.configuration.API + elem).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Data?.length > 0) {
            this.dropListData = repsonsedata.Data;
            //Who:Ankit Rawat, Highlight selected item, When:01Jul24
            //this.dropListData = repsonsedata.Data.map(item => ({
            //  ...item,
            //  IsSelected: this.selectedArr.some(selectedItem => selectedItem.UserId === item.UserId)
            //}));
            //Who:Ankit Rawat, Highlight selected item, changed with dynamic property, When:16Aug24
            const commonProperties = this.findCommonProperties(this.selectedArr, this.dropListData);
            this.dropListData.forEach(itemList => {
            if (this.selectedArr.some(itemSelect => commonProperties.every(prop => itemSelect[prop] === itemList[prop]))) {
              itemList.IsSelected = true;
             }
            else {
              itemList.IsSelected = false;
             }
            });
            this.isSpinner = false;
          }
          else {
            this.dropListData = [];
            this.isSpinner = false;
          }
          this.loaded = true;
          this.apicall.unsubscribe();
        }else {
          this.dropListData = [];
          this.isSpinner = false;
        }
      }, err => {
        this.isSpinner = false;
      })
  }

  refreshAPI() {
    this.searchVal = '';
    this.apiHandler()
  }

  redirect() {
    window.open(this.configuration?.MANAGE, '_blank')
  }

  ngOnDestroy() {
    this.Subscription1?.unsubscribe();
    this.Subscription2?.unsubscribe();
  }
    determineDropdownDirection(dropdownElement) {
    const dropdownRect = dropdownElement?.getBoundingClientRect();
    const windowHeight = window?.innerHeight;
    // Calculate the distance from the dropdown to the bottom of the viewport
    const distanceToBottom = windowHeight - dropdownRect?.bottom;
    // You can adjust this threshold value to suit your needs
    const threshold = -50;
    // Check if there is enough space below the dropdown for it to open downward
    if (distanceToBottom >= threshold) {
      return 'downward';
    } else {
      return 'upward';
    }
  }

  addClassOnChangeDirection() {
    setTimeout(() => {
      let dropdown = document.getElementById('dropdown-content_' + this.index);
      const direction = this.determineDropdownDirection(dropdown);
      if (direction === 'downward') {
        // Open the dropdown menu downward
       if (direction) {
        dropdown?.classList.add('open-downward');
        dropdown?.classList.remove('open-upward');
       }
      } else {
        // Open the dropdown menu upward
        if (dropdown) {
          dropdown?.classList.add('open-upward');
          dropdown?.classList.remove('open-downward');
        }
      }
    }, 10);
  }
  generateRandomUniqueId() {
    const randomId = Math.random().toString(36).substr(2, 10);
    return randomId;
  }

  checkAllConfigurations(config: DRP_CONFIG) {
    this.BIND_By = this.configuration?.BINDBY;
    if (config?.REQUIRED) {
      this.selectedItemsFormControl.setValidators([Validators.required]);
      this.selectedItemsFormControl.updateValueAndValidity();
    }
    if (config?.DISABLED) {
      this.isDisabled = config?.DISABLED;
      // this.removable = false;
      this.selectedItemsFormControl?.disable();
    }else{
      this.isDisabled = config?.DISABLED;
      this.selectedItemsFormControl?.enable();
    }
    if (config?.EXTRA_BIND_VALUE) {
      this.anotherBindValue = this.configuration?.EXTRA_BIND_VALUE
    }
  }

  checkDisabled(isDisable:boolean){
    if (isDisable) {
      this.isDisabled = isDisable;
      this.selectedItemsFormControl.disable();
    }
  }
  onRemoveAllHandler(event: any) {
    this.selectedArr = [];
    this.sendSelectedDataHandler(this.selectedArr);
    this.selectedItemsFormControl.markAllAsTouched();
    event?.stopPropagation();
  }

  sendSelectedDataHandler(data:any){
    this.selectedOut.emit(data);
  }

  findCommonProperties(SelectedList: any, Itemlist: any): string[] {
    if (SelectedList.length === 0 || Itemlist.length === 0) {
      return null;
    }
    
    const propertiesSelected = Object.keys(SelectedList[0]);
    const propertiesList = Object.keys(Itemlist[0]);
  
    return propertiesSelected.filter(prop => propertiesList.includes(prop)).slice(0, 2);
  }

}

