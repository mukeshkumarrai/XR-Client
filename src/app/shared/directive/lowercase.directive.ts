import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appLowercase]'
})
export class LowercaseDirective {

  @HostListener('input', ['$event']) onInput(event) {
     event.target.value = event.target.value.toLowerCase();
    return true;
  }

}
