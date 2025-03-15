import { Directive, Input, ElementRef, Renderer2, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDisableIfJobClosed]'
})
export class DisableIfJobClosedDirective implements OnInit, OnChanges {
  @Input() isJobClosed: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateState();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isJobClosed) {
      this.updateState();
    }
  }

  private updateState() {
     const elementType = this.el.nativeElement.tagName;
     if (this.isJobClosed === 1) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');

      // Apply different classes based on the element type
      if (elementType === 'BUTTON') {
        this.renderer.addClass(this.el.nativeElement, 'button-disabled');
      } else if (elementType === 'MAT-CHECKBOX') {
        this.renderer.addClass(this.el.nativeElement, 'checkbox-disabled');
      } else if (elementType === 'SPAN') {
        this.renderer.addClass(this.el.nativeElement, 'span-disabled');
      } else if (elementType === 'DIV') {
        this.renderer.addClass(this.el.nativeElement, 'div-disabled');
      }else if (elementType === 'A') {
        this.renderer.addClass(this.el.nativeElement, 'anchor-disabled');
      }  else if (elementType === 'MAT-FORM-FIELD') {
        this.renderer.addClass(this.el.nativeElement, 'field-disabled');
      }
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');

      // Remove classes based on the element type
      if (elementType === 'BUTTON') {
        this.renderer.removeClass(this.el.nativeElement, 'button-disabled');
      } else if (elementType === 'INPUT' && this.el.nativeElement.type === 'checkbox') {
        this.renderer.removeClass(this.el.nativeElement, 'checkbox-disabled');
      } else if (elementType === 'SPAN') {
        this.renderer.removeClass(this.el.nativeElement, 'span-disabled');
      } else if (elementType === 'DIV') {
        this.renderer.removeClass(this.el.nativeElement, 'div-disabled');
      } else if (elementType === 'A') {
        this.renderer.removeClass(this.el.nativeElement, 'anchor-disabled');
      } else if (elementType === 'MAT-FORM-FIELD') {
        this.renderer.removeClass(this.el.nativeElement, 'field-disabled');
      }
    }
  }
    // if (this.isJobClosed === 1) {
    //   this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    //   this.renderer.addClass(this.el.nativeElement, 'disabled');
    // } else {
    //   this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    //   this.renderer.removeClass(this.el.nativeElement, 'disabled');
    // }
  }
