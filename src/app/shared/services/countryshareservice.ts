import { Component, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class countryshareservice {
 private headerSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
 header = this.headerSource.asObservable();

 getcountryId(mode) {
     this.headerSource.next(mode);
 }
}