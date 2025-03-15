/*
  @Type: File, <html>
  @Who: Adarsh singh
  @When: 06-Nov-2023
  @Why: EWM-14995
*/

import { Injectable } from '@angular/core';
import { GetScreenSize } from '@app/shared/enums/job-detail.enum';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonDropDownService {
  private _unsubscriber$: Subject<any> = new Subject();
  public screenWidth$: BehaviorSubject<number> = new BehaviorSubject(null);
  public mediaBreakpoint$: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor() {
    this.init();
  }
  init() {
    this._setScreenWidth(window.innerWidth);
    this._setMediaBreakpoint(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(1000),
        takeUntil(this._unsubscriber$)
      ).subscribe((evt: any) => {
        this._setScreenWidth(evt.target.innerWidth);
        this._setMediaBreakpoint(evt.target.innerWidth);
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  private _setScreenWidth(width: number): void {
    this.screenWidth$.next(width);
  }

  private _setMediaBreakpoint(width: number): void {
    if (width < 576) {
      this.mediaBreakpoint$.next(GetScreenSize.XS);
    } else if (width >= 576 && width < 768) {
      this.mediaBreakpoint$.next(GetScreenSize.SM);
    } else if (width >= 768 && width < 992) {
      this.mediaBreakpoint$.next(GetScreenSize.MD);
    } else if (width >= 992 && width < 1200) {
      this.mediaBreakpoint$.next(GetScreenSize.LG);
    } else if (width >= 1200 && width < 1600) {
      this.mediaBreakpoint$.next(GetScreenSize.XL);
    } else {
      this.mediaBreakpoint$.next(GetScreenSize.XXL);
    }
  }
}
