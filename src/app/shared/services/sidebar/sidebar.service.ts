/*
@(C): Entire Software
@Type: File, <ts>
@Name: sidebar.service.ts
@Who: Mukesh kumar Rai
@When: 24-nov-2020
@Why: ROST-424
@What: this file is used for common observable service to communicate b/q compenents independenantly
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  subManuGroup: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  activesubMenuObs: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  searchEnable: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  checkcookies: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  menuLavelStatusOb: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  topMenuAciveObs: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  activeCoreRouteObs: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public menuLavelStatus = this.menuLavelStatusOb.asObservable();
  public activesubMenu = this.activesubMenuObs.asObservable();
  public subManuGroupData = this.subManuGroup.asObservable();
  public searchBarEnable = this.searchEnable.asObservable();
  public topMenuActive = this.topMenuAciveObs.asObservable();

  public activeCoreRoute = this.activeCoreRouteObs.asObservable();

  constructor(private http: HttpClient) {

  }

}
