import {
    Directive,
    ViewChildren,
    QueryList,
    ElementRef,
    AfterViewInit,
    HostListener,
    OnDestroy,
    Renderer2
  } from "@angular/core";
  
  @Directive({
    selector: "[applyTabIndexes]"
  })
  export class ApplyTabIndexesDirective implements AfterViewInit, OnDestroy {
    private mutationObserver: MutationObserver;
  
    constructor(private hostEl: ElementRef) {}
  
    ngAfterViewInit() {
      this.applyIndexes();
      this.mutationObserver = new MutationObserver(() => this.applyIndexes());
      this.mutationObserver.observe(this.hostEl.nativeElement, {
        childList: true,
        subtree: true
      });
    }
  
    ngOnDestroy() {
      this.mutationObserver.disconnect();
    }
  
    private applyIndexes() {
      const isTabAheadOffset = !!this.hostEl.nativeElement.querySelector(
        '[tabIndexAheadOffset]'
      );
      const elements = this.hostEl.nativeElement.querySelectorAll('[tabindex]');
      let globalOffset: number;
      let tabIndex: string;
  
      elements.forEach((el, index) => {
        if (isTabAheadOffset) {
          const offsetValue = parseInt(el.getAttribute('tabIndexAheadOffset'), 10);
          if (offsetValue) {
            globalOffset = offsetValue;
            tabIndex = this.getTabIndex(index + offsetValue + 1);
          } else if (globalOffset >= 1) {
            tabIndex = this.getTabIndex(index);
            globalOffset--;
          } else {
            tabIndex = this.getTabIndex(index + 1);
          }
        } else {
          tabIndex = this.getTabIndex(index + 1);
        }
  
        el.setAttribute('tabindex', tabIndex);
      });
    }
  
    private getTabIndex(index: number): string {
      return index.toString();
    }
  }
  