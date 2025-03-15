
//    @Type: File, <ts>
//     @Name: address-bar.component.ts
//     @Who: Anup Singh
//     @When: 16-June-2021
//     @Why: EWM-1662 EWM-1916
//     @What: popup component for Address Bar Popup

import { Component, EventEmitter, Inject, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from '../services/commonservice/commonservice.service';
import { SidebarService } from '../services/sidebar/sidebar.service';
import { SnackBarService } from '../services/snackbar/snack-bar.service';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-address-bar',
  templateUrl: './address-bar.component.html',
  styleUrls: ['./address-bar.component.scss']
})
export class AddressBarComponent implements OnInit {
  saveEnableDisable:boolean=true;
  addressBarData:Address;
 /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup singh
  @When: 16-June-2021
  @Why: EWM-1662 EWM-1916
  @What: For injection of service class and other dependencies
   */
  constructor(private fb: FormBuilder, public _sidebarService: SidebarService, private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
   private route: Router, private translateService: TranslateService,
    private apiloader: MapsAPILoader,
    public dialogRef: MatDialogRef<AddressBarComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog,
  ) {

  }



  ngOnInit(): void {
 
  }

/*
  @Type: File, <ts>
  @Name: sendAddress function
  @Who: Anup singh
  @When: 16-June-2021
  @Why: EWM-1662 EWM-1916
  @What: For Send Address Data And Also close popup
   */

  sendAddress(){
    document.getElementsByClassName("add_addressBar")[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("add_addressBar")[0].classList.add("animate__slideOutUp");
   setTimeout(() => { this.dialogRef.close(this.addressBarData); }, 200);
  }

 
/*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Anup singh
  @When: 16-June-2021
  @Why: EWM-1662 EWM-1916
  @What: For close popup
   */
  onDismiss() {
    document.getElementsByClassName("add_addressBar")[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("add_addressBar")[0].classList.add("animate__slideOutUp");
   setTimeout(() => { this.dialogRef.close(true); }, 200);

  }

/*
  @Type: File, <ts>
  @Name: handleAddressChange function
  @Who: Anup singh
  @When: 16-June-2021
  @Why: EWM-1662 EWM-1916
  @What: For Address get from input field
   */
public handleAddressChange(address: Address) {
 this.addressBarData = address

 if(address != null){
  this.saveEnableDisable = false;
}


  }


}
