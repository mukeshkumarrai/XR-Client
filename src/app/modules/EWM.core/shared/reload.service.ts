import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {

 // Observable string sources
 private reloadSource = new Subject<void>();

 // Observable string streams
 reload$ = this.reloadSource.asObservable();

 // Service message commands
 reload() {
   this.reloadSource.next();
 }
}
