import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheServiceService {

constructor() { }
private dataCache: { [key: string]: any } = {};
set(key: string, data: any): void {
  console.log("set:"+ key + "//")
  this.dataCache[key] = data;
}
get(key: string): any {
  return this.dataCache[key];
}
setLocalStorage(key: string,data:any):void { 
  localStorage.setItem(key,data);
}
getLocalStorage(key: string): any { 
  return localStorage.getItem(key);
}
}
