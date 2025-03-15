import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerServiceService {

  private _drawer1 = new BehaviorSubject(false);
  private _drawer2 = new BehaviorSubject(false);

  drawer1$ = this._drawer1.asObservable();
  drawer2$ = this._drawer2.asObservable();

  set drawer1(v: boolean) {
    this._drawer1.next(v);
  }

  get drawer1(): boolean {
    return this._drawer1.value;
  }

  set drawer2(v: boolean) {
    this._drawer2.next(v);
  }

  get drawer2(): boolean {
    return this._drawer2.value;
  }
}
