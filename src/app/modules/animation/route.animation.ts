/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: route.animation.ts
  @Who: Satya Prakash Gupta
  @When: 10-Dec-2021
  @Why: EWM-3959 EWM-1337
  @What: This file is the main animation file for animation
 */
import {
  trigger,
  animate,
  transition,
  style,
  query,
  group
} from '@angular/animations';

export const rightToLeft = trigger('rightToLeft', [
  // The '* => *' will trigger the animation to change between any two states
  transition('* => *', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    group([
        query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.4s ease-in-out', style({ transform: 'translateX(100%)' }))
        ], { optional: true }),
    ])
  ])
]);