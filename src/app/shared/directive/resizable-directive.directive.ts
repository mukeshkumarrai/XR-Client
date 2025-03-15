/**
   @(C): Entire Software
   @Type: ts
   @Name: resizeable-directive.directive.ts
   @Who: Mukesh Kumar rai
   @When: 21-Sept-2020
   @Why: #ROST-183
   @What: This directive work for resizing div.
  */
import { Directive, ElementRef, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[divResizable]' // Attribute selector
})
export class ResizableDirective implements OnInit {
  @ViewChild("mainContainer") divView: ElementRef;
  @Input() resizableGrabWidth = 3;
  @Input() resizableMinWidth = 50;
  @Input() resizableMaxWidth = 400;
  @Input() direction;
  margin: string;
  dragging = false;
  constructor(private el: ElementRef) {
    this.margin = "margin-left";
    const self = this;

    const EventListenerMode = { capture: true };

    function preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    }


    const newWidth = (wid) => {
      // if (this.direction['right'] === true) {
      //   this.margin = "margin-right";
      // }

      const newWidth = Math.max(this.resizableMinWidth, wid);
      el.nativeElement.style.cursor = "col-resize";
      if (newWidth > this.resizableMinWidth && newWidth < this.resizableMaxWidth) {
        el.nativeElement.style.width = (newWidth) + "px";
        document.getElementById("sidenavContent-box").style[this.margin] = (newWidth + 30) + 'Px';
      }

    }


    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      el.nativeElement.style.cursor = "col-resize";
      newWidth(evt.clientX - el.nativeElement.offsetLeft)
      evt.stopPropagation();
    };

    const dragMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - el.nativeElement.offsetLeft)) + "px";
      el.nativeElement.style.width = (evt.clientX - el.nativeElement.offsetLeft) + "px";
      evt.stopPropagation();


    };

    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt) => {
      el.nativeElement.style.cursor = "col-resize";
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        preventGlobalMouseEvents();

        evt.stopPropagation();
      }
      
      
    };
    
    const drag = (evt) =>{
      el.nativeElement.style.cursor = "col-resize";
    }
    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = "col-resize";
      } else {
        el.nativeElement.style.cursor = "default";
      }
      if (this.dragging) {
        el.nativeElement.style.cursor = "col-resize";
      }
    }


    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
    el.nativeElement.addEventListener('mousedown', drag, true);
  }

  ngOnInit(): void {
    this.el.nativeElement.style["border-right"] = this.resizableGrabWidth + "px solid darkgrey";
  }

  inDragRegion(evt) {
    return this.el.nativeElement.clientWidth - evt.clientX + this.el.nativeElement.offsetLeft < this.resizableGrabWidth;
  }

}
