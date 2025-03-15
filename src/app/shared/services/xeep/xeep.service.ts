import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XeepService {

  constructor() { }
  private defaultImage: string = 'default.gif';
  private actionImageSubject = new BehaviorSubject<string>(this.defaultImage);
  actionImage$ = this.actionImageSubject.asObservable();

  performAction(action: string) {
    let newImage: string;
   if(action){
    newImage=action+'.gif';
   }else{
     newImage = this.defaultImage;
   }
   this.actionImageSubject.next(newImage);
   setTimeout(() => {
      this.actionImageSubject.next(this.defaultImage);
     }, 5900);
     
    //  // Append a timestamp to the image URL to prevent caching
    //  const timestamp = new Date().getTime();
    //  this.actionImageSubject.next(`${newImage}?t=${timestamp}`);
 
    //  // Reset the image after 5s. 
    //  setTimeout(() => {
    //    this.actionImageSubject.next(`${this.defaultImage}?t=${timestamp}`);
    //  }, 5000);
   }
}
