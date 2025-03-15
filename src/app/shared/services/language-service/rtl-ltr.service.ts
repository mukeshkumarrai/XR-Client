import { Injectable, Renderer2, RendererFactory2, ElementRef, ViewChild  } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CommonServiesService } from '../../../shared/services/common-servies.service';

@Injectable({
  providedIn: 'root'
})
export class RtlLtrService {
  public rtl = false;
  public ltr=true;
  private renderer: Renderer2;
  messages: any;
/* 
    @Type: File, <ts>
    @Name: Contructor Function
    @Who: Nitin Bhati
    @When: 10-Nov-2020
    @Why: ROST-393
    @What: for passing services
*/
constructor(rendererFactory: RendererFactory2){
  this.renderer = rendererFactory.createRenderer(null, null);
}
/* 
  @Type: File, <ts>
  @Name: gridLtrToRtl function
  @Who: Nitin Bhati
  @When: 10-Nov-2020
  @Why: ROST-393
  @What: for Chnage grid dircetion
*/
public gridLtrToRtl(revAdd,revAdd1,search,res) {
  if(revAdd?.nativeElement!=undefined){
  if(res=='rtl'){
    this.renderer.addClass(revAdd?.nativeElement, 'right');
    this.renderer.addClass(revAdd1?.nativeElement, 'right-align');
    this.renderer.removeClass(search?.nativeElement, 'right-align');
    this.renderer.addClass(search?.nativeElement, 'left-align');
    this.rtl = !this.rtl;
    }else if(res=='ltr'){
    this.renderer.removeClass(revAdd?.nativeElement, 'right');
    this.renderer.removeClass(revAdd1?.nativeElement, 'right-align');
    this.renderer.removeClass(search?.nativeElement, 'left-align');
    this.renderer.addClass(search?.nativeElement, 'right-align');
    this.ltr = !this.ltr;
   }
  }
}
}
