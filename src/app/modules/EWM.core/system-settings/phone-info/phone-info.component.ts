/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Renu
    @When: 14-Dec-2020
    @Why: ROST-536
    @What:  This page wil be use only for the Web: Search with special character POC purpose
*/

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';

@Component({
  selector: 'app-phone-info',
  templateUrl: './phone-info.component.html',
  styleUrls: ['./phone-info.component.scss']
})
export class PhoneInfoComponent implements OnInit {
  myControl: FormControl = new FormControl();

  options = ["One", "Two", "Three"];
  options1 = ["four", "five", "six"];

  filteredOptions: Observable<string[]>;

  constructor(public _sidebarService: SidebarService, private route: Router, private _userAdministrationService: CountryMasterService) { }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(val => (val.length >= 1 ? this.filter(val) : []))
    );
  }

  filter(val: string): string[] {
    if (val == '@') {

      return this.options.filter(
        option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
      );
    } else {

      return this.options1.filter(
        option => option.toLowerCase().indexOf(val.toLowerCase()) === 0
      );
    }

  }

  changeDetect(serchText) {
    if (serchText.charAt(0) === '@') {

      if (serchText.length == 1) {
        this._userAdministrationService.getCountryList(1, '200').subscribe(
          repsonsedata => {

            this.filteredOptions = repsonsedata['Data'];
          }, err => {

          })
      } else {
        this._userAdministrationService.getCountryByname(serchText.substring(1)).subscribe(
          repsonsedata => {

            this.filteredOptions = repsonsedata['Data'];
          }, err => {

          })
      }

    } else {

      this.filteredOptions = String[''];
    }
  }


}
