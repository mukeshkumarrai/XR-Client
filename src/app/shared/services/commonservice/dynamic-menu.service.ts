import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { handleError } from '../../helper/exception-handler';
import { catchError, delay, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DynamicMenuService {

  public allMenu: any;
  objectKeys = Object.keys;
  menuLavelStatusOb: BehaviorSubject<any> = new BehaviorSubject<any>(1);
  public menuLavelStatus = this.menuLavelStatusOb.asObservable();

  menuStatusOb: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public menuLoadStatus = this.menuStatusOb.asObservable();

  constructor(handler: HttpBackend, private serviceListClass: ServiceListClass, private http: HttpClient) {
    //this.menuAvlablestatusOb.next(false);

  }
  /*
  @(C): Entire Software
  @Type: Url
  @Name: DynamicMenu.service.ts
  @Who: Mukesh
  @When: 15-05-2021
  @Why:
  @What: Get all menu realted info dynamically
  */
  public getsubMenuall() {
    return this.http.get(this.serviceListClass.menuList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  public getMenuByFilter() {
    return this.allMenu;
  }
  /*
  @Type: Url
  @Name: getSubMenubyName
  @Who: Mukesh
  @When: 15-05-2021
  @Why: getting for submenu data
  @What: Get all menu realted info dynamically
  */
  public getSubMenubyName(manuName) {
    let subMenu: any = [];
    let result: any;
    let menuLavel: number;
    if (this.allMenu) {
      this.allMenu.forEach(element => {
        if (manuName === element['Name']) {
          subMenu = this.allMenu.filter(x => x['Name'] == manuName);
          menuLavel = 1;
        } else {
          let tempSubMenu = element['Children'];
          tempSubMenu.forEach(element1 => {
            if (manuName === element1['Name']) {
              subMenu = tempSubMenu.filter(x => x['Name'] == manuName);
              menuLavel = 2;
            }
          });
        }
      });

      result = subMenu[0]?.Children;
     // console.log('result', result);
      this.menuLavelStatusOb.next(menuLavel);
    }

    return result;
  }
  public setAllMenu(data) {
    this.allMenu = data;
    this.getMenuByFilter();
    return true;
  }



  /*
  @Type: Url
  @Name: DynamicMenu.service.ts
  @Who: Renu
  @When: 04-Jun-2021
  @Why: EWM-1727
  @What: Get all menu realted Access Info
  */
  public async getAccessRole(menuId: any,accessdatatype:any) {
    let response;
    response = await this.http
      .get<any>(this.serviceListClass.getAccessRole + '?menuId=' + menuId+'&accessdatatype='+accessdatatype)
      .pipe(retry(1))
      .toPromise();
    return response;
    // return this.http.get(this.serviceListClass.getAccessRole+'?menuId='+menuId).pipe(
    //   retry(1),
    //   catchError(handleError)
    // );
  }
}
