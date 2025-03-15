import { I } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  SkipSelf,
  Host,
  HostListener,
  EventEmitter,
  Component,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  Directive,
  Input,
} from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { CommonserviceService } from '../services/commonservice/commonservice.service';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {

  _host: HTMLElement;
  _startWidth = 0;
  constructor(private elm: ElementRef) { }
  ngOnInit() {
    this._host = this.elm.nativeElement;

  }
  dragStart() {
    const style = window.getComputedStyle(this._host, undefined);
    this._startWidth = style.width ? parseInt(style.width, 10) : 0;
  }
  dragging(diff: number,position:string) {
   
    if(position=='left'){
      this._host.style.width = this._startWidth + diff + 'px';
      document.getElementById('leftmargin').style.marginLeft = this._startWidth + diff + 'px';
    }else{
      this._host.style.width = this._startWidth - diff + 'px';
      document.getElementById('leftmargin').style.marginRight = this._startWidth - diff + 'px';
    }
  }
  dragEnd() {
    this._startWidth = 0;
  }
}

@Directive({
  selector: '[grabber]',
})
export class GrabberDirective {

  @Input() positionPanel: any;
  @Input() matdrwaer:MatDrawer;
  @HostListener('mousedown', ['$event']) mousedown = (e: MouseEvent) => {
    this._startOffsetX = e.clientX;
    document.addEventListener('mousemove', this._boundDragging);
    document.addEventListener('mouseup', this._boundDragEnd);
    this.resizable.dragStart();
  }

  _startOffsetX = 0;
  readonly _boundDragging = (e) => this._dragging(e);
  readonly _boundDragEnd = (e) => this._dragEnd(e);
  
  constructor(
    private elm: ElementRef,
    @Host() @SkipSelf() private resizable: ResizableDirective,private commonserviceService: CommonserviceService
  ) {
  }


  private _dragging(e: MouseEvent) {
    if(this.positionPanel=='left'){
      let sideMenu = document.getElementById('mat-sidebar').clientWidth;
      let clientWidth=document.getElementById('leftpanel').clientWidth;
      if(clientWidth!=50){
        let clientX = e.clientX - sideMenu;
        if(clientX<=350){
          document.getElementById('leftpanel').classList.add('hiiii')
        const diff = e.clientX - this._startOffsetX;
        this.resizable.dragging(diff,this.positionPanel);  
        }
      }else{
        document.getElementById('leftpanel').classList.remove('hiiii')
      }
    
    }else{
      
      const element = document.getElementById("rightpanel");
      let offsetWidth =  element.offsetWidth;
     if(e.clientX-offsetWidth>=280){
      const diff = e.clientX - this._startOffsetX;
      this.resizable.dragging(diff,this.positionPanel);
     }
    }
    
    
  }

  private _dragEnd(e: MouseEvent) {
    this._startOffsetX = 0;
    if( this.positionPanel=='left'){
      let sideMenu = document.getElementById('mat-sidebar').clientWidth;
      let clientX = e.clientX - sideMenu;
      if (clientX < 250) {
        document.getElementById("leftpanel").style.width = "50px";
        document.getElementById("leftmargin").style.marginLeft = "50px";
        document.getElementById("leftpanel").classList.add("drawerMinimize");
        this.commonserviceService.onleftPanelWidth.next('290px');
      } else{
        // document.getElementById("leftpanel").style.width = "290px";
        // document.getElementById("leftmargin").style.marginLeft = "290px";
        // document.getElementById("leftpanel").classList.remove("drawerMinimize");
        // this.commonserviceService.onleftPanelWidth.next('50px');
      }
      
    }else{
      const element = document.getElementById("rightpanel");
      let offsetWidth =  element.offsetWidth;
     if(offsetWidth<290){
      this.commonserviceService.onrightPanelWidth.next(true);
     }else{
   
      this.commonserviceService.onrightPanelWidth.next(false);
     }
     
   }
    document.removeEventListener('mousemove', this._boundDragging);
    document.removeEventListener('mouseup', this._boundDragEnd);
    this.resizable.dragEnd();
  }
}