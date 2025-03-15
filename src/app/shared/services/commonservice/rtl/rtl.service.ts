/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: rtl.service.ts
  @Who: Adarsh singh
  @When: 10-April-2023
  @Why: ROST-11803
  @What: this file is used for adding rtl functionality in our appllication
*/


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RtlService {
  dirctionalLang:string;
  language:string;
  constructor() { 
    this.language = localStorage.getItem("Language");
    if (this.language === 'ara') {
      this.dirctionalLang = "rtl";
    } else {
      this.dirctionalLang = "ltr";
    }
  }

/*
  @Type: File, <ts>
  @Name: onModalRTLHandler
  @Who: Adarsh singh
  @When: 10-April-2023
  @Why: ROST-11803
  @What: adding class while opening modal
*/
  onModalRTLHandler() {
    setTimeout(() => {
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    }, 200);
  }
/*
  @Type: File, <ts>
  @Name: onOverlayDrawerRTLHandler
  @Who: Adarsh singh
  @When: 10-April-2023
  @Why: ROST-11803
  @What: adding class while opening drawer
*/
  onOverlayDrawerRTLHandler() {
   setTimeout(() => {
      let classList = document.getElementsByClassName('cdk-overlay-connected-position-bounding-box');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    }, 200);
  }

  /*
  @Type: File, <ts>
  @Name: onKendoGridRTLHandler
  @Who: Nitin Bhati
  @When: 18-July-2023
  @Why: EWM-11815
  @What: adding class for kendo grid
*/
onKendoGridRTLHandler() {
  setTimeout(() => {
    let classList = document.getElementsByClassName('k-grid');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }, 200);
}

}
