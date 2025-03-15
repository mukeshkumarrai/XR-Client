import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DRP_CONFIG_CLIENT_SIDE } from '@app/shared/models/common-dropdown';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
enum DropdownMouseState {
  inside,
  outside,
}

@Component({
  selector: 'dropdown-client-side',
  templateUrl: './common-dropdown-client-side.component.html',
  styleUrls: ['./common-dropdown-client-side.component.scss']
})
export class CommonDropdownClientSideComponent implements OnInit {

  propagateChange = (_: any) => { };
  showMenu: boolean;
  isDisabled: boolean;
  state: DropdownMouseState;
  @Output() selectedOut: EventEmitter<any> = new EventEmitter<any>();
  @Input() configuration: DRP_CONFIG_CLIENT_SIDE;
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
  dropListData:any = [];
  selectedArr = [];
  apicall: Subscription;
  Subscription1: Subscription;
  Subscription2: Subscription;
  Subscription3: Subscription;
  showMoreItem:boolean;
  @Input() resetConfiguration: Subject<any> = new Subject<any>();
  @Input() showMoreOptionsNum: number = 2;
  selectedItemsFormControl=new FormControl('');
  removable:boolean = true;
  anotherBindValue:string;
  // reset configuration
@Input() set apiCalledWhileReset(val:boolean){
  if (val) {
    this.checkDisabled(val);
  }
}
 @Input() set initialize(value: string) {
  if (value) {
    this.selectedItemsFormControl.reset();
  }
}
  @Input() set getSelectedItem(value: string) {
    if (!value || (Object.keys(value)?.length === 0)) { 
      this.selectedArr = [];
      this.selectedItemsFormControl.patchValue(null)
     }
    else { 
        this.selectedArr = [];
        if (this.configuration.SINGLE_SELECETION) {
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
    }
    let dropdown = document.getElementById('dropdown-content_' + this.index);
      if (dropdown) {
        dropdown?.classList.remove('open-downward');
        dropdown?.classList.remove('open-upward');
      }
  }

  constructor(private renderer: Renderer2) {
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
    this.Subscription2 = this.resetConfiguration.subscribe((data: DRP_CONFIG_CLIENT_SIDE) => {
      if (data) {
        this.configuration = data;
        this.checkAllConfigurations(this.configuration);
        this.BIND_By = this.configuration?.BINDBY;
        this.apiHandler();
      }
    })
    // get selected item 
  }

  valueChange(item: any) {
    const index = this.selectedArr?.findIndex((x) => x[this.BIND_By] === item[this.BIND_By]);
    if (index == -1) {
      if (this.configuration?.SINGLE_SELECETION) {
        this.selectedArr = [];
        this.selectedArr.push(item);
      }
      else {
        this.selectedArr.push(item);
        if (this.configuration?.AT_LEAST_ONE_IS_NOT_REMOVABLE && this.configuration?.REQUIRED) {
          this.selectedArr[0]['disabled'] = true;
        }
      }
    }
    this.propagateChange(item.Value);
    if (this.configuration.SINGLE_SELECETION) {
      this.showMenu = false;
      this.selectedOut.emit(item);
    }
    else{
      this.selectedOut.emit(this.selectedArr);
    }
  }

  public Clear() {
    this.searchVal = '';
    this.apiHandler();
  }

  remove(item:any, event) {
    // event.stopPropagation();
    const index = this.selectedArr.indexOf(item);
    if (index >= 0) {
      this.selectedArr.splice(index, 1);
    }
    this.selectedOut.emit(this.selectedArr);
  }
  
  openDropdown(isOpen: boolean) {
    if (isOpen) {
      this.dropdownClick = true;
        this.addClassOnChangeDirection();
        setTimeout(() => {
          this.renderer.selectRootElement('#searchInput__v2_'+this.index).focus();
        }, 100);
      // open
      if (this.dropListData?.length > 0) return
      this.apiHandler();
    }
    this.showMoreItem = false;
  }

  getInputVal(e) {
    this.searchSubject$.next(e)
  }

  apiHandler() {
    this.dropListData = this.configuration?.LIST_ARRAY_DATA;
    this.isSpinner = false;
    setTimeout(() => {
      this.renderer.selectRootElement('#searchInput__v2_' + this.index).focus();
    }, 10);
  }

  onSearchHandler(searchVal) {
    let searchText = searchVal.toLowerCase();
    const filteredData = this.configuration?.LIST_ARRAY_DATA.filter(obj => obj[this.BIND_By].toLowerCase().includes(searchText));
    this.dropListData = filteredData;
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
    this.Subscription3?.unsubscribe();
  }

    determineDropdownDirection(dropdownElement) {
    const dropdownRect = dropdownElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Calculate the distance from the dropdown to the bottom of the viewport
    const distanceToBottom = windowHeight - dropdownRect.bottom;
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

  checkAllConfigurations(config: DRP_CONFIG_CLIENT_SIDE) {
    this.BIND_By = this.configuration?.BINDBY;
    if (config.REQUIRED) {
      this.selectedItemsFormControl.setValidators([Validators.required]);
      this.selectedItemsFormControl.updateValueAndValidity();
    }
    if (config.DISABLED) {
      this.isDisabled = config.DISABLED;
      // this.removable = false;
      this.selectedItemsFormControl.disable();
    }
    if (config.EXTRA_BIND_VALUE) {
      this.anotherBindValue = this.configuration.EXTRA_BIND_VALUE
    }
  }
  checkDisabled(isDisable:boolean){
    if (isDisable) {
      this.isDisabled = isDisable;
      this.selectedItemsFormControl.disable();
    }
  }
}

