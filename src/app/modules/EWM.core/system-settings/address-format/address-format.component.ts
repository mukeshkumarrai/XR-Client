/*
@(C): Entire Software
@Type: File, <ts>
@Name: address-format.component.ts
@Who: Mulesh Kumar Rai
@When: 24-Jan-2020
@Why: ROST-254
@What: contains address format logics
*/

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { TranslateService } from '@ngx-translate/core';
import { MatChip } from '@angular/material/chips';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';


@Component({
  selector: 'app-address-format',
  templateUrl: './address-format.component.html',
  styleUrls: ['./address-format.component.scss']
})
export class AddressFormatComponent implements OnInit {
  /*********************common variables global decalaration********************/
  stateZipselectedSeparator = ',';
  capAddress1 = true;
  selectAddress2Cap = true;
  selectCityCap = true;
  selectStateCap = true;
  selectZipCap = true;
  selectCountryCap = true;
  selectAddress1NotInclude = true;
  selectAddress2NotInclude = true;
  selectCityNotInclude = true;
  selectStateNotInclude = true;
  selectZipNotInclude = true;
  selectCountryNotInclude = true;
  cityStateselectedSeparator = ',';
  Cap
  loading: boolean;
  selectYesNo = 'no';
  line_1: any = [];
  line_2 = [];
  line_3 = [];
  line_4 = [];
  line: any = [];
  todos = [];
  public addressLine_1: string = '';
  public addressLine_2: string = '';
  public addressLine_3: string = '';
  public addressLine_4: string = '';
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  country: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = false;
  @ViewChild("inputField") inputField: ElementRef;
  selectedObject;
  public maxCharacterLengthSubHead = 115;

  constructor(public _sidebarService: SidebarService, private snackBService: SnackBarService,  private commonserviceService:CommonserviceService,
    private _systemSettingService: SystemSettingService, private route: Router, private translateService: TranslateService) { }

  ngOnInit(): void {

    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.getUserGeneralSettingInfo();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
  }

  /*
    @Type: File, <ts>
    @Name: addressInit
    @Who: Renu
    @When: 24-Jan-2020
    @Why: ROST-670
    @What: to check if tenant addresss alreday there or not
  */

  addressInit() {
    this.todos = [];
    this.cityStateselectedSeparator = this.line.filter(x => x['Key'] === 'City')[0]['Seprator'];
    this.stateZipselectedSeparator = this.line.filter(x => x['Key'] === 'State')[0]['Seprator'];
    for (let i = 0; i < this.line.length; i++) {
      if (this.line[i]['DoNotInclude'] === false) {
       this.setAddresFormat(this.line[i]['Key']);
      }else
      {
        let tempData = {
              "Key": this.line[i]['Key'],
              "IsCapital": this.line[i]['IsCapital'],
              "position": this.line[i]['Position']
            }
            this.todos.push(tempData);
      }
     
    }
  }


  /*
    @Type: File, <ts>
    @Name: setAddresFormat
    @Who: Renu
    @When: 24-Jan-2020
    @Why: ROST-670
    @What: set the postion of the seelected address in respective lines
  */
  setAddresFormat(pram) {
    let addressPosData = [];
    addressPosData = this.line.filter(x => x.Key === pram);
   let pos = addressPosData[0]['Position'];
    if (addressPosData[0]['Line'] === 1) {
      let newData = {
        "Key": addressPosData[0]['Key'],
        "IsCapital": addressPosData[0]['IsCapital'],
        "position":  addressPosData[0]['Position']
      }
     
      this.line_1[pos-1 ] = newData;
      this.line_1=this.line_1.filter(this.notEmpty);
  
      }
     if (addressPosData[0]['Line'] === 2) {
      let newData = {
        "Key": addressPosData[0]['Key'],
        "IsCapital": addressPosData[0]['IsCapital'],
        "position":  addressPosData[0]['Position']
      }
      this.line_2[pos - 1] = newData;
      this.line_2=this.line_2.filter(this.notEmpty);
     }
    if (addressPosData[0]['Line'] === 3) {
      let newData = {
        "Key": addressPosData[0]['Key'],
        "IsCapital": addressPosData[0]['IsCapital'],
        "position":  addressPosData[0]['Position']
      }
      this.line_3[pos - 1] = newData;
      this.line_3=this.line_3.filter(this.notEmpty);
    }
     if (addressPosData[0]['Line'] === 4) {
      let newData = {
        "Key": addressPosData[0]['Key'],
        "IsCapital": addressPosData[0]['IsCapital'],
        "position":  addressPosData[0]['Position']
      }
    
      this.line_4[pos - 1] = newData;
   
      this.line_4=this.line_4.filter(this.notEmpty);

     }
 
    this.addressFormatPreiview();
  }


  /*
    @Type: File, <ts>
    @Name: changeCapitalsData
    @Who: Renu
    @When: 24-Jan-2020
    @Why: ROST-670
    @What: set the first letter capital in address preview
  */

  changeCapitalsData(param, event) {
    this.line[param]['cap'] = event.value;
    this.addressFormatPreiview();
  }

  /*
   @Type: File, <ts>
   @Name: clickMove
   @Who: Renu
   @When: 24-Jan-2020
   @Why: ROST-670
   @What: when user drag and drop then this function call to move data from one array to another
 */
 
  clickMove(itemName: string, ...targets: string[]) {
      this[targets[0]] = [
        ...this[targets[1]].splice(this[targets[1]].findIndex((x => x['Key'] == itemName )), 1),
        ...this[targets[0]]
      ];
    
    for (let i = 0; i < this.line.length; i++) {
      if (this.line[i]['Key'] === itemName) {
        this.line[i]['DoNotInclude'] = true;
        this.line[i]['Line'] = 0;
        this.line[i]['Position'] = 0;
      }

    }
    //this.addressInit();
    this.addressFormatPreiview();
  }

  /*
  @Type: File, <ts>
  @Name: clickMove
  @Who: Renu
  @When: 24-Jan-2020
  @Why: ROST-670
  @What: when user wants to remove the address data in particular line
*/

  addRemoveAddress(param, data) {
    //this.todos.push(param);
    let lineData = this.line[param]['Line'];

    if (data === false) {
      if (Number(lineData) === 1) {

        this.line_1.push(param);
      };
      if (Number(lineData) === 2) { this.line_2.push(param); };
      if (Number(lineData) === 3) { this.line_3.push(param); };
      if (Number(lineData) === 4) { this.line_4.push(param); };

    } else {

      if (Number(lineData) === 1) {
        const index: number = this.line_1.indexOf(param);
        if (index !== -1) {
          this.line_1.splice(index, 1);
        }
      };
      if (Number(lineData) === 2) {
        const index: number = this.line_2.indexOf(param);
        if (index !== -1) {
          this.line_2.splice(index, 1);
        }
      };
      if (Number(lineData) === 3) {
        const index: number = this.line_3.indexOf(param);
        if (index !== -1) {
          this.line_3.splice(index, 1);
        }
      };
      if (Number(lineData) === 4) {
        const index: number = this.line_4.indexOf(param);
        if (index !== -1) {
          this.line_4.splice(index, 1);
        }
      };

    }
    if (param === 'Address1') {
      this.selectAddress1NotInclude = data;
    }
    if (param === 'Address2') {
      this.selectAddress2NotInclude = data;
    }
    if (param === 'City') {
      this.selectCityNotInclude = data;
    }
    if (param === 'State') {
      this.selectStateNotInclude = data;
    }
    if (param === 'Zip') {
      this.selectZipNotInclude = data;
    }
    if (param === 'Country') {

      this.selectCountryNotInclude = data;
    }

    this.addressFormatPreiview();
  }

  /*
    @Type: File, <ts>
    @Name: drop
    @Who: Renu
    @When: 24-Jan-2020
    @Why: ROST-670
    @What: when user wants to drag and drop
  */

  drop(event: CdkDragDrop<string[]>) {
    let element = <HTMLInputElement>document.getElementById(String(event.previousContainer.data[event.previousIndex]['Key']));
    let isChecked = element.checked;
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.checkItemData(event.container.data, event.previousContainer.data, event.container.id, event.previousContainer.id, isChecked,element);

    this.addressFormatPreiview();
  }

   /*
    @Type: File, <ts>
    @Name: checkItemData
    @Who: Renu
    @When: 25-Mar-2021
    @Why: ROST-670
    @What: set the data format
  */

  checkItemData(dropData, prviousData, containerID, prvscontainerID, isChecked,element) {
    for (let i = 0; i < this.line.length; i++) {
      for (let x = 0; x < dropData.length; x++) {
        if(dropData[x])
        {
        
          if (this.line[i]['Key'] === dropData[x]['Key']) {
            this.line[i]['DoNotInclude'] = false;
            this.line[i].Line = Number(containerID);
            this.line[i].Position = Number(x+1);
            if (isChecked === true) {
            
              if(element.id==dropData[x]['Key'])
              {
                this.line[i].IsCapital = true;
                dropData[x]['IsCapital']= true;
              }
              
            }else
            {
              if(element.id==dropData[x]['Key'])
              {
              this.line[i].IsCapital = false;
              dropData[x]['IsCapital']= false;
              }
            }
          }
        }
       if(prviousData[x]){
        if (this.line[i]['Key'] === prviousData[x]['Key']) {
          this.line[i].Position = prviousData[x]['position']-1;
       }
      }
      }
      for (let x = 0; x < prviousData.length; x++) {
        if (this.line[i]['Key'] === prviousData[x] && this.line[i]['DoNotInclude'] !== true) {
          this.line[i].Line = Number(containerID);
          this.line[i].Position = Number(x + 1);
        }
      }
    }
  }

  /*
   @Type: File, <ts>
   @Name: addressFormatPreiview
   @Who: Renu
   @When: 24-Jan-2020
   @Why: ROST-670
   @What:  to show address preview
 */

  addressFormatPreiview() {
   
    this.addressLine_1 = '';
    this.addressLine_2 = '';
    this.addressLine_3 = '';
    this.addressLine_4 = '';

    for (let i = 0; i < this.line_1.length; i++) {
      if(this.line_1[i])
      {
      let AddresData = this.line.filter(x => x['Key'] == this.line_1[i]['Key']);
      if (AddresData[0]) {
        let IsCapital=AddresData[0]['IsCapital'];
        this.addressLine_1 += this.FirstletterCap(AddresData[0]['Value'], IsCapital) + ' ';
      }
    }
    }
    for (let i = 0; i < this.line_2.length; i++) {
      if(this.line_2[i])
      {
      let AddresData = this.line.filter(x => x['Key'] == this.line_2[i]['Key']);
      if (AddresData[0]) {
        let IsCapital=AddresData[0]['IsCapital'];
        this.addressLine_2 += this.FirstletterCap(AddresData[0]['Value'], IsCapital) + ' ';
      }
    }
    }
    for (let i = 0; i < this.line_3.length; i++) {
      if(this.line_3[i])
      {
      let AddresData = this.line.filter(x => x['Key'] == this.line_3[i]['Key']);
      if (AddresData[0]) {
        let IsCapital=AddresData[0]['IsCapital'];
        this.addressLine_3 += this.FirstletterCap(AddresData[0]['Value'], IsCapital) + ' ';
      }
    }

    }
     for (let i = 0; i < this.line_4.length; i++) {
       if(this.line_4[i])
       {
       let AddresData = this.line.filter(x => x['Key'] == this.line_4[i]['Key']);
      if (AddresData[0]) {
        let IsCapital=AddresData[0]['IsCapital'];
        this.addressLine_4 += this.FirstletterCap(AddresData[0]['Value'], IsCapital) + ' ';
      }
       }
      
     }
    this.separator();

  }

  /*
  @Type: File, <ts>
  @Name: FirstletterCap
  @Who: Renu
  @When: 24-Jan-2020
  @Why: ROST-670
  @What: makes first letter of each word in capital format
*/
  FirstletterCap(value: string, capValue: boolean): string {

    if (capValue) {
      let first = value.toUpperCase();
      return first;
    } else {

      return value;
    }
  }


  /*
  @Type: File, <ts>
  @Name: changeCityState
  @Who: Renu
  @When: 24-Jan-2020
  @Why: ROST-670
  @What: when user change the selector b/w city & state from drop down
*/

  changeCityState(event) {
    this.cityStateselectedSeparator = event.value;
    for (let i = 0; i < this.line.length; i++) {
      if (this.line[i]['Key'] === 'City') {
        this.line[i]['Seprator'] = event.value;
      }
    }
    this.addressFormatPreiview();
  }

  /*
  @Type: File, <ts>
  @Name: changeStateZip
  @Who: Renu
  @When: 24-Jan-2020
  @Why: ROST-670
  @What: when user change the selector b/w zip & state from drop down
*/
  changeStateZip(event) {
    this.stateZipselectedSeparator = event.value;
    for (let i = 0; i < this.line.length; i++) {
      if (this.line[i]['Key'] === 'State') {
        this.line[i]['Seprator'] = event.value;
      }
    }
    this.addressFormatPreiview();
  }

  /*
 @Type: File, <ts>
 @Name: separator
 @Who: Renu
 @When: 24-Jan-2020
 @Why: ROST-670
 @What: when user change the selector b/w zip & state from drop down this
  function will call and set the seprator chosn in addess preview
*/

  separator() {
    //city and state Separator
    let stateorignalValue = this.line.filter(x => x['Key'] === 'City')[0]['Value'];
    let ziporignalValue = this.line.filter(x => x['Key'] === 'Zip')[0]['Value'];
    let statePosLine = this.line.filter(x => x['Key'] === 'State')[0]['Line'];
    let cityPosLine = this.line.filter(x => x['Key'] === 'City')[0]['Line'];
    let zipPosLine = this.line.filter(x => x['Key'] === 'Zip')[0]['Line'];
  
    if (this.getIndex('State',this.line_1) === this.getIndex('City',this.line_1) + 1 && statePosLine === cityPosLine) {
      let valueSeparator = stateorignalValue + this.cityStateselectedSeparator + ' ';
      this.addressLine_1 = this.addressLine_1.replace(stateorignalValue, valueSeparator);
    }

    if (this.getIndex('State',this.line_2) === this.getIndex('City',this.line_2) + 1 && statePosLine === cityPosLine) {
      let valueSeparator = stateorignalValue + this.cityStateselectedSeparator + ' ';
      this.addressLine_2 = this.addressLine_2.replace(stateorignalValue, valueSeparator);

    }
    if (this.getIndex('State',this.line_3)=== this.getIndex('City',this.line_3) + 1 && statePosLine === cityPosLine) {
      let valueSeparator = stateorignalValue + this.cityStateselectedSeparator + ' ';
      this.addressLine_3 = this.addressLine_3.replace(stateorignalValue, valueSeparator);

    }
    if (this.getIndex('State',this.line_4) === this.getIndex('City',this.line_4)+ 1 && statePosLine === cityPosLine) {
      let valueSeparator = stateorignalValue + this.cityStateselectedSeparator + ' ';
      this.addressLine_4 = this.addressLine_4.replace(stateorignalValue, valueSeparator);

    }

    //State and Zip Separator

    if (this.getIndex('Zip',this.line_1) === this.getIndex('State',this.line_1)  + 1 && statePosLine === zipPosLine) {

      let valueSeparator = this.stateZipselectedSeparator + ziporignalValue;
      this.addressLine_1 = this.addressLine_1.replace(ziporignalValue, valueSeparator);

    }
    if (this.getIndex('Zip',this.line_2) ===this.getIndex('State',this.line_2)+ 1 && statePosLine === zipPosLine) {

      let valueSeparator = this.stateZipselectedSeparator + ziporignalValue;
      this.addressLine_2 = this.addressLine_2.replace(ziporignalValue, valueSeparator);
    }
    if (this.getIndex('Zip',this.line_3) === this.getIndex('State',this.line_3) + 1 && statePosLine === zipPosLine) {

      let valueSeparator = this.stateZipselectedSeparator + ziporignalValue;
      this.addressLine_3 = this.addressLine_3.replace(ziporignalValue, valueSeparator);

    }
    if (this.getIndex('Zip',this.line_4) === this.getIndex('State',this.line_4) + 1 && statePosLine === zipPosLine) {
      let valueSeparator = this.stateZipselectedSeparator + ziporignalValue;
      this.addressLine_4 = this.addressLine_4.replace(ziporignalValue, valueSeparator);
    }

  }

  /*
 @Type: File, <ts>
 @Name: getIndex
 @Who: Renu
 @When: 17-June-2021
 @Why: ROST-1839
 @What: to get the index from an array
 @param: val:value of the index
         linearr: array of object
*/
getIndex(val,lineArr){
 return lineArr.findIndex(p => p.Key ==val)
}

  /*
  @Type: File, <ts>
  @Name: selected
  @Who: Renu
  @When: 24-Jan-2020
  @Why: ROST-670
  @What: when user selected from drop down to create another array to maintain selected data
*/
  selected(event: MatAutocompleteSelectedEvent): void {
    this.country.push(event.option.viewValue);
    this.inputField.nativeElement.value = "";
    this.myControl.setValue(null);
  }

  /*
  @Type: File, <ts>
  @Name: onSubmitAddress
  @Who: Renu
  @When: 24-Jan-2020
  @Why: ROST-670
  @What: trigger when user want to save the address format
*/

  onSubmitAddress() {
    this.loading = true;
    this._systemSettingService.setAddressFormat(this.line).subscribe(
      (repsonsedata: ResponceData) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), String(repsonsedata.HttpStatusCode));
          this.getUserGeneralSettingInfo();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), String(repsonsedata.HttpStatusCode));
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }

  /*
  @Type: File, <ts>
  @Name: getUserGeneralSettingInfo
  @Who: Nitin Bhati
  @When: 23-Nov-2020
  @Why: ROST-309
  @What: to get all User Email Setting related Information
  */
  getUserGeneralSettingInfo() {

    this.loading = true;
    this._systemSettingService.getAddressFormat().subscribe(
      (repsonsedata: ResponceData) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200) {
          this.line = repsonsedata['Data'];
          this.addressInit();
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }
  capOn(key,event) {
    for (let i = 0; i < this.line.length; i++) {
      if (this.line[i]['Key'] === key) {
        this.line[i]['IsCapital'] = event.checked;
      }
    }
   this.addressFormatPreiview();
    
  }
  toggleSelection(chip: MatChip) {
    chip.toggleSelected();
  }

  /*
   @Type: File, <ts>
   @Name: clickMove
   @Who: Renu
   @When: 01-Apr-2020
   @Why: ROST-670
   @What: to check if there is empty key exists or not 
 */
   notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
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
      this.getUserGeneralSettingInfo();
      }

}
