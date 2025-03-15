import { ApplicationRef, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ThemingService {
  themes = ["dark-theme", "my-app"];
  theme = new BehaviorSubject("my-app");

  constructor(private ref: ApplicationRef) {
    // initially trigger dark mode if preference is set to dark mode on system
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;   
    if(darkModeOn){     
      this.theme.next("dark-theme");
      document.querySelector('body').classList.add(darkModeOn ? "dark-theme" : "light");
    }

    // watch for changes of the preference
    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => {
      const turnOn = e.matches;     
      this.theme.next(turnOn ? "dark-theme" : "my-app");
      // trigger refresh of UI
      if(turnOn){
        document.querySelector('body').classList.add("dark-theme");
      }else{
        document.querySelector('body').classList.remove("dark-theme");
      }
      this.ref.tick();
    });
  }
}
