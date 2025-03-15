/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: assessment-preview.component.ts
 @Who: Satya Prakash
 @When: 23-May-2022
 @Why: ROST-6656 EWM-7015
 @What: assessment preview component
*/
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-assessment-preview',
  templateUrl: './assessment-preview.component.html',
  styleUrls: ['./assessment-preview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssessmentPreviewComponent implements OnInit {
  
  constructor() {
    
  }

  ngOnInit(): void {
  }


}
