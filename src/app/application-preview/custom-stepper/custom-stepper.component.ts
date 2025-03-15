/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: custom-stepper.component.ts
 @Who: Renu
 @When: 23-May-2022
 @Why: ROST-6558 EWM-6782
 @What: custom stepper
 */
import { CdkStepper } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: CustomStepperComponent }]
})
export class CustomStepperComponent extends CdkStepper  {
  onClick(index: number): void {
    this.selectedIndex = index;
  }
}
