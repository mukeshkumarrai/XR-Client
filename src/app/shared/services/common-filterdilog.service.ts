//by maneesh fixed new CommonFilterDiologComponent stop calling api
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFilterdilogService {

  constructor() { }
  setLocalStorage(key: string,data:any):void { 
    localStorage.setItem(key,data);
  }
  getLocalStorage(key: string): any { 
    return localStorage.getItem(key);
  }
  // removeConfigLocalStorage(data): any {  // by maneesh ewm-17890;
  //   return localStorage.removeItem(data);
  // }
}
