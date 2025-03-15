import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.scss']
})
export class AssessmentQuestionsComponent implements OnInit {
  @Input() assessmentQuestionIdData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
