import { Directive, Input, TemplateRef, HostListener, OnInit, ElementRef, ComponentRef } from '@angular/core';
import {
  OverlayRef,
  Overlay,
  OverlayPositionBuilder
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';

@Directive({ selector: '[appTooltip]' })
export class TooltipDirective implements OnInit {
  @Input('appTooltip') content: any | TemplateRef<any>;
  private overlayRef: OverlayRef;

  constructor(
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private overlay: Overlay
  ) {}

  ngOnInit() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top'
        }
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    const tooltipPortal = new ComponentPortal(TooltipComponent);

    const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef.attach(
      tooltipPortal
    );

    if (typeof(this.content) === 'string') {
      tooltipRef.instance.text = this.content;
    } else {
      tooltipRef.instance.content = this.content;
    }
  }

  @HostListener('mouseout')
  hide() {
    this.overlayRef.detach();
  }
}